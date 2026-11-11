'use client';
// Voxide live voice agent (https://voxide.dev).
//
// Voxide runs in the browser: the agent hears the worker, decides which of the
// "capabilities" below to call, and speaks the result. Every capability calls
// our own FastAPI backend through src/lib/api.js, so the agent only ever sees
// what the logged-in worker could see in the app anyway.
import { VoxideClient } from '@voxide/react';
import {
  agency,
  safety,
  workers,
  voice,
  isLoggedIn,
  getLanguage,
  checkInNow,
  triggerPanic,
} from './api';

export const VOXIDE_KEY = process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY || '';
export const voxideEnabled = VOXIDE_KEY.startsWith('vox_pub_');

const SPEECH_LANG = { en: 'en-US', am: 'am-ET', om: 'om-ET', ar: 'ar-SA' };
export const INCIDENT_DRAFT_KEY = 'amannat_incident_draft';

const CATEGORY_LABELS = {
  wage_nonpayment: 'wages not paid',
  contract_substitution: 'contract changed after signing',
  abuse: 'abuse',
  passport_confiscation: 'passport kept by employer',
};

const ROUTES = [
  { path: '/home', description: 'Home dashboard: daily safety check-in and shortcuts' },
  { path: '/trust', description: 'Trust registry: search agencies and see their license status and worker reports' },
  { path: '/records', description: 'Add a contract: photograph it, upload a PDF, or type the promised terms' },
  { path: '/review', description: 'Review the saved contract, wage history, payments and saved documents' },
  { path: '/safety', description: 'Safety hub: check in, urgent help alert, guardians, emergency hotlines' },
  { path: '/incident', description: 'Write and send an incident report about an agency' },
  { path: '/assistant', description: 'This voice assistant' },
];

// The Next.js router changes per page; navigation goes through whichever one is current.
let currentRouter = null;
export const setVoxideRouter = (router) => {
  currentRouter = router;
};
const routerProxy = {
  push: (path) => (currentRouter ? currentRouter.push(path) : window.location.assign(path)),
};

const needLogin = () => ({
  status: 'error',
  message: 'The worker is not signed in. Ask them to sign in with their phone number first.',
});

// Run a handler, turning thrown API errors into a result the agent can explain.
const safe = (fn, { auth = true } = {}) => async (args = {}) => {
  if (auth && !isLoggedIn()) return needLogin();
  try {
    return await fn(args);
  } catch (err) {
    return { status: 'error', message: err.message || 'Something went wrong' };
  }
};

const parseUtc = (iso) => new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);

async function latestContract() {
  const contracts = await workers.contracts();
  return [...contracts].sort((a, b) => parseUtc(b.start_date) - parseUtc(a.start_date))[0] || null;
}

async function findAgency(name) {
  const results = await agency.search(name, { limit: 5 });
  if (!results.length) return null;
  const lower = name.toLowerCase();
  return results.find((a) => a.name.toLowerCase() === lower) || results[0];
}

function registerCapabilities(ai) {
  ai.enableNavigation(routerProxy, ROUTES);

  ai.register({
    checkAgencySafety: {
      description:
        'Check whether a recruitment agency or employer is safe and licensed. Returns its verification status and how many worker reports it has, by type. Use when the worker asks "is X safe", "can I trust X", or "check X".',
      params: { agencyName: { type: 'string', required: true, description: 'Agency name, license number or phone' } },
      handler: safe(async ({ agencyName }) => {
        const match = await findAgency(agencyName);
        if (!match) return { status: 'not_found', message: `No agency called "${agencyName}" is in the registry.` };
        const detail = await agency.get(match.id);
        const flags = detail.report_flags || [];
        return {
          status: 'found',
          name: detail.name,
          licenseNumber: detail.license_no,
          location: detail.location,
          verification: detail.verification_status,
          totalReports: flags.reduce((n, f) => n + f.count, 0),
          reports: flags.map((f) => ({ type: CATEGORY_LABELS[f.category] || f.category, count: f.count })),
        };
      }, { auth: false }),
    },

    searchAgencies: {
      description: 'Search the trust registry for agencies by name, license number, phone or location.',
      params: { query: { type: 'string', required: true } },
      handler: safe(async ({ query }) => {
        const results = await agency.search(query, { limit: 5 });
        return {
          count: results.length,
          agencies: results.map((a) => ({ name: a.name, location: a.location, verification: a.verification_status })),
        };
      }, { auth: false }),
    },

    checkInSafe: {
      description: 'Record that the worker is safe right now (a safety check-in). Use when they say "I am safe" or "check me in".',
      handler: safe(async () => {
        const c = await checkInNow();
        return { status: 'checked_in', at: c.scheduled_at };
      }),
    },

    sendUrgentAlert: {
      description:
        'Send an emergency alert by SMS to all of the worker\'s guardians. Only use when the worker clearly says they are in danger or asks for urgent help.',
      dangerous: true,
      handler: safe(async () => {
        const guardians = await workers.guardians();
        await triggerPanic();
        return {
          status: 'alert_sent',
          notified: guardians.map((g) => g.name),
          note: guardians.length ? undefined : 'No guardians are saved, so nobody received an SMS. Suggest adding a guardian in the Safety hub.',
        };
      }),
    },

    getHotlines: {
      description: 'Get emergency and worker-support hotline numbers for a country.',
      params: {
        country: {
          type: 'string',
          required: true,
          enum: ['Saudi Arabia', 'UAE', 'Lebanon', 'Kuwait'],
          description: 'Country the worker is in',
        },
      },
      handler: safe(async ({ country }) => ({ country, numbers: await safety.hotlines(country) })),
    },

    getMyContract: {
      description: 'Read the worker\'s most recent saved contract: wage, hours, dates and terms.',
      handler: safe(async () => {
        const c = await latestContract();
        if (!c) return { status: 'none', message: 'No contract saved yet. They can add one on the Records page.' };
        const res = await voice.readContract(c.id);
        return { status: 'found', summary: res.text, monthlyWage: c.wage };
      }),
    },

    getWageSummary: {
      description: 'How much the worker has earned, been paid, and is still owed under their current contract.',
      handler: safe(async () => {
        const c = await latestContract();
        if (!c) return { status: 'none', message: 'No contract saved yet.' };
        const s = await workers.wageSummary(c.id);
        return { earnedSoFar: s.total_owed, paid: s.total_paid, stillOwed: Math.max(0, s.balance), monthlyWage: c.wage };
      }),
    },

    logWagePayment: {
      description: 'Record a wage payment the worker received under their current contract.',
      requireConfirmation: true,
      params: {
        amount: { type: 'number', required: true, description: 'Amount received' },
        paidOn: { type: 'string', description: 'Date received, YYYY-MM-DD. Defaults to today.' },
        note: { type: 'string' },
      },
      handler: safe(async ({ amount, paidOn, note }) => {
        const c = await latestContract();
        if (!c) return { status: 'none', message: 'No contract saved yet, so the payment cannot be recorded.' };
        const date = paidOn ? new Date(paidOn) : new Date();
        if (Number.isNaN(date.getTime())) return { status: 'error', message: `"${paidOn}" is not a valid date.` };
        await workers.addWage(c.id, { amount: Number(amount), paid_on: date.toISOString(), note: note || null });
        const s = await workers.wageSummary(c.id);
        return { status: 'recorded', stillOwed: Math.max(0, s.balance) };
      }),
    },

    listGuardians: {
      description: 'List the trusted people (guardians) who get alerts if the worker is in danger.',
      handler: safe(async () => {
        const g = await workers.guardians();
        return { count: g.length, guardians: g.map((x) => ({ name: x.name, relation: x.relation, channel: x.channel })) };
      }),
    },

    draftIncidentReport: {
      description:
        'Prepare an incident report about an agency or employer (unpaid wages, passport kept, abuse, contract changed). This only fills in a draft and opens the report page; the worker reviews it and sends it themselves.',
      params: {
        description: { type: 'string', required: true, sensitive: true, description: 'What happened, in the worker\'s words' },
      },
      handler: safe(async ({ description }) => {
        const guess = await voice.report(description);
        const draft = {
          description,
          category: CATEGORY_LABELS[guess.category_guess] ? guess.category_guess : '',
          agencyId: guess.agency_id || null,
          agencyName: guess.agency_name_guess || '',
        };
        try {
          window.localStorage.setItem(INCIDENT_DRAFT_KEY, JSON.stringify(draft));
        } catch {
          /* draft stays in memory only */
        }
        routerProxy.push('/incident');
        return {
          status: 'draft_ready',
          category: CATEGORY_LABELS[guess.category_guess] || 'not sure',
          agency: guess.agency_name_guess || 'not recognised',
          next: 'Tell the worker to check the draft, tick consent, and press "Consent & send".',
        };
      }),
    },
  });

  ai.bindState(() => ({
    app: 'Amannat — safety, contracts and wages for migrant domestic workers',
    currentPage: typeof window !== 'undefined' ? window.location.pathname : null,
    signedIn: isLoggedIn(),
    language: getLanguage(),
  }));

  // Confirmation prompt for `dangerous` / `requireConfirmation` capabilities.
  ai.onConfirmation(async (action) =>
    window.confirm(action.name === 'sendUrgentAlert' ? 'Send an urgent alert to your guardians now?' : `${action.description}\n\nContinue?`)
  );
}

/**
 * Acoustic echo gate: prevents Voxide from hearing its own voice output
 * through laptop/phone speakers and creating a feedback loop.
 */
function installEchoSuppression(ai) {
  if (!ai || ai.__echoSuppressionInstalled) return;
  ai.__echoSuppressionInstalled = true;
  ai._muteMicUntil = 0;

  // Intercept audio chunk playback to track when assistant audio is active
  const origPlayAudioChunk = ai._voicePlayAudioChunk;
  if (typeof origPlayAudioChunk === 'function') {
    ai._voicePlayAudioChunk = function (base64Data) {
      this._muteMicUntil = Date.now() + 1200;
      origPlayAudioChunk.call(this, base64Data);

      if (Array.isArray(this._voiceActiveSources)) {
        this._voiceActiveSources.forEach((src) => {
          if (!src.__echoHandled) {
            src.__echoHandled = true;
            const prevOnEnded = src.onended;
            src.onended = () => {
              if (prevOnEnded) prevOnEnded.call(src);
              // When audio finishes, keep mic muted for another 500ms for room echo decay
              this._muteMicUntil = Date.now() + 500;
            };
          }
        });
      }
    };
  }

  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 32768 : s * 32767, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  // Intercept _voiceStartMic so microphone data is silenced while assistant speaks
  const origStartMic = ai._voiceStartMic;
  if (typeof origStartMic === 'function') {
    ai._voiceStartMic = async function () {
      await origStartMic.apply(this, arguments);

      if (this._voiceProcessor) {
        this._voiceProcessor.onaudioprocess = (e) => {
          if (this._voiceWs?.readyState !== WebSocket.OPEN) return;

          // Check if the assistant is speaking, playing audio, or in the post-speech echo window
          const isAssistantSpeaking =
            (Array.isArray(this._voiceActiveSources) && this._voiceActiveSources.length > 0) ||
            this._voiceSnapshot?.status === 'speaking' ||
            (typeof window !== 'undefined' && window.speechSynthesis?.speaking) ||
            (this._muteMicUntil && Date.now() < this._muteMicUntil);

          if (isAssistantSpeaking) {
            // Mute/drop microphone input: do not stream speaker output back to the server
            return;
          }

          const float32 = e.inputBuffer.getChannelData(0);
          const pcm16 = floatTo16BitPCM(float32);
          const b64 = arrayBufferToBase64(pcm16);
          this._voiceWs.send(JSON.stringify({ type: 'audio_input', data: b64 }));
        };
      }
    };
  }
}

/**
 * Ensures client.init() is deduplicated and that _voiceConnect automatically awaits init()
 * rather than throwing "[Voxide] Client not initialized. Call client.init() first."
 */
function ensureSafeInit(ai) {
  if (!ai || ai.__safeInitInstalled) return;
  ai.__safeInitInstalled = true;

  let inFlightInit = null;
  const origInit = ai.init;
  if (typeof origInit === 'function') {
    ai.init = function () {
      if (this.isInitialized) return Promise.resolve(this);
      if (!inFlightInit) {
        inFlightInit = origInit.apply(this, arguments).finally(() => {
          inFlightInit = null;
        });
      }
      return inFlightInit;
    };
  }

  const origVoiceConnect = ai._voiceConnect;
  if (typeof origVoiceConnect === 'function') {
    ai._voiceConnect = async function () {
      if (!this.isInitialized) {
        try {
          await this.init();
        } catch (err) {
          console.error('[Voxide] Auto-init before connect failed:', err);
          this._setVoiceStatus('error');
          return;
        }
      }
      return origVoiceConnect.apply(this, arguments);
    };
  }
}

let client = null;

/** The shared Voxide client, or null on the server / when no key is configured. */
export function getVoxide() {
  if (typeof window === 'undefined' || !voxideEnabled) return null;
  if (!client) {
    client = new VoxideClient({ publicKey: VOXIDE_KEY, language: SPEECH_LANG[getLanguage()] || 'en-US' });
    ensureSafeInit(client);
    installEchoSuppression(client);
    registerCapabilities(client);
  }
  return client;
}
