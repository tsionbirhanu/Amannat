'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVoxideVoice } from '@voxide/react';
import { voice, getLanguage } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { getVoxide } from '@/lib/voxide';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Badge, Button, Icon, ListLink, Notice, PageHeader, SectionTitle, inputClass } from '@/components/ui';

const LANGS = {
  en: { name: 'English', speech: 'en-US' },
  am: { name: 'Amharic', speech: 'am-ET' },
  om: { name: 'Afaan Oromo', speech: 'om-ET' },
  ar: { name: 'Arabic', speech: 'ar-SA' },
};

// Voxide session states -> this page's simpler states
const VOX_STATUS = {
  idle: 'idle',
  armed: 'idle',
  connecting: 'connecting',
  listening: 'listening',
  thinking: 'thinking',
  executing: 'thinking',
  speaking: 'speaking',
  error: 'error',
};
const VOX_LIVE = new Set(['connecting', 'listening', 'thinking', 'executing', 'speaking']);

const ACTION_LABELS = {
  checkAgencySafety: 'Checking the agency…',
  searchAgencies: 'Searching the registry…',
  checkInSafe: 'Checking you in…',
  sendUrgentAlert: 'Sending urgent alert…',
  getHotlines: 'Finding hotlines…',
  getMyContract: 'Reading your contract…',
  getWageSummary: 'Adding up your wages…',
  logWagePayment: 'Saving the payment…',
  listGuardians: 'Looking up your guardians…',
  draftIncidentReport: 'Preparing your report…',
  navigate: 'Opening the page…',
};

export default function AssistantPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const ready = useRequireAuth();
  const [langCode] = useState(() => (typeof window === 'undefined' ? 'en' : getLanguage()));
  const lang = LANGS[langCode] || LANGS.en;

  // ---- Voxide live agent (preferred) ----
  const ai = useMemo(() => getVoxide(), []);
  const vox = useVoxideVoice(ai);
  const [voxInitError, setVoxInitError] = useState('');
  useEffect(() => {
    if (!ai) return;
    ai.init().catch((err) => setVoxInitError(err?.message || 'Voxide could not start'));
  }, [ai]);
  const voxMode = !!ai && !voxInitError && vox.status !== 'error';
  const voxError = ai && (voxInitError || vox.status === 'error')
    ? vox.errorCode === 'usage_limit'
      ? 'Voxide voice minutes for this project are used up. Using basic mode.'
      : `Voxide is unavailable${voxInitError ? ` (${voxInitError})` : ''}. Using basic mode.`
    : '';
  const lastOf = (role) => [...vox.messages].reverse().find((m) => m.role === role)?.text || '';

  // ---- Basic mode: browser speech + POST /voice/query (fallback) ----
  const [basicQuestion, setBasicQuestion] = useState('');
  const [draft, setDraft] = useState('');
  const [basicAnswer, setBasicAnswer] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [basicStatus, setBasicStatus] = useState('idle'); // idle | listening | thinking | error
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const status = voxMode ? VOX_STATUS[vox.status] || 'idle' : basicStatus;
  const question = voxMode ? lastOf('user') : basicQuestion;
  const answer = voxMode ? lastOf('ai') || null : basicAnswer;
  const setStatus = setBasicStatus;
  const setQuestion = setBasicQuestion;
  const setAnswer = setBasicAnswer;

  const ask = async (text) => {
    const clean = text.trim();
    if (!clean) return;
    setDraft('');
    setError('');
    if (voxMode) {
      if (ai && !ai.isInitialized) {
        try {
          await ai.init();
        } catch (err) {
          setError(err?.message || 'Voxide could not start');
          return;
        }
      }
      // Same session as voice; the agent replies in text and (if connected) out loud
      await vox.sendText(clean);
      return;
    }
    setQuestion(clean);
    setStatus('thinking');
    try {
      const res = await voice.query(clean, { language: langCode });
      setAnswer(res.answer_text);
      setAudioUrl(res.answer_audio_url);
      setStatus('idle');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const listen = async () => {
    if (voxMode) {
      setError('');
      if (VOX_LIVE.has(vox.status)) {
        vox.disconnect();
      } else {
        if (ai && !ai.isInitialized) {
          try {
            await ai.init();
          } catch (err) {
            setError(err?.message || 'Voxide could not start');
            return;
          }
        }
        vox.connect();
      }
      return;
    }
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setError('Voice input is not supported in this browser. Please type your question below.');
      return;
    }
    if (status === 'listening') {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = lang.speech;
    rec.interimResults = false;
    rec.onresult = (e) => ask(e.results[0][0].transcript);
    rec.onerror = (e) => {
      setError(e.error === 'not-allowed' ? 'Microphone permission was denied.' : 'I could not hear you. Please try again.');
      setStatus('error');
    };
    rec.onend = () => setStatus((s) => (s === 'listening' ? 'idle' : s));
    recognitionRef.current = rec;
    setError('');
    setStatus('listening');
    rec.start();
  };

  const playAnswer = () => {
    if (!answer) return;
    // The backend TTS is still a stub (stub://...), so fall back to the browser's voice.
    if (audioUrl && /^https?:/.test(audioUrl)) {
      new Audio(audioUrl).play();
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(answer);
      u.lang = lang.speech;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const statusTitle = {
    idle: question ? 'Ask another question' : 'Tap the mic to ask',
    connecting: 'Connecting…',
    listening: t.imListening,
    thinking: (voxMode && ACTION_LABELS[vox.currentAction]) || 'Thinking…',
    speaking: 'Speaking — tap the mic to stop',
    error: 'Something went wrong',
  }[status];

  if (!ready) return null;

  const active = ['connecting', 'listening', 'thinking', 'speaking'].includes(status);
  // Conversation to show: the live session's messages, or the last basic-mode exchange
  const conversation = voxMode
    ? vox.messages.slice(-8)
    : [question && { role: 'user', text: question }, answer && { role: 'ai', text: answer }].filter(Boolean);
  const examples = ['Is this agency safe?', 'How much am I still owed?', 'Check me in, I am safe', 'What are the hotlines in Saudi Arabia?'];

  return (
    <AppShell>
      <PageHeader
        title={t.voxide || 'Voxide'}
        action={
          <Badge tone={voxMode ? 'success' : 'warning'} icon={voxMode ? 'graphic_eq' : 'mic_off'}>
            {voxMode ? 'Live' : 'Basic mode'}
          </Badge>
        }
      />

      {/* Mic */}
      <section className="rounded-3xl bg-brand-800 text-white px-6 py-8 flex flex-col items-center text-center">
        <button
          type="button"
          onClick={listen}
          aria-label={active ? 'Stop' : 'Start talking'}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            active ? 'bg-accent-500 text-stone-900' : 'bg-white/10 text-accent-400 hover:bg-white/15'
          }`}
        >
          {active && <span aria-hidden="true" className="absolute inset-0 rounded-full ring-4 ring-accent-400/40 animate-ping" />}
          <Icon name={active ? 'stop' : 'mic'} filled className="relative text-[40px]" />
        </button>
        <h2 className="text-xl font-semibold mt-5">{statusTitle}</h2>
        <p className="text-[15px] text-brand-100 mt-1">
          {status === 'listening' ? t.speakNaturally : lang.name}
        </p>
      </section>

      {/* Type instead */}
      <form onSubmit={(e) => { e.preventDefault(); ask(draft); }} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Or type your question…"
          aria-label="Type your question"
          className={`${inputClass} flex-1`}
        />
        <Button type="submit" icon="send" disabled={status === 'thinking' || !draft.trim()} aria-label="Send">
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </form>

      {error && <Notice tone="error" className="mt-4">{error}</Notice>}
      {voxError && (
        <Notice tone="warning" className="mt-4">
          {voxError}{' '}
          {!voxInitError && <button type="button" onClick={() => vox.connect()} className="font-semibold underline">Retry</button>}
        </Notice>
      )}

      {/* Conversation */}
      {conversation.length > 0 ? (
        <section aria-label="Conversation" aria-live="polite" className="mt-6 flex flex-col gap-3">
          {conversation.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                  m.role === 'user' ? 'bg-brand-800 text-white rounded-br-md' : 'bg-white border border-sand-200 text-stone-800 rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {answer && (
            <Button variant="ghost" size="sm" icon="volume_up" onClick={playAnswer} className="self-start">
              Play answer
            </Button>
          )}
        </section>
      ) : (
        <section className="mt-6">
          <SectionTitle>{t.exampleQuestions || 'Try asking'}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {examples.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="px-4 py-2.5 rounded-full bg-white border border-sand-200 text-[15px] text-stone-700 hover:border-brand-200 hover:bg-brand-50/40"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <ListLink href="/incident" icon="report" title={t.reviewReport} subtitle="Write a report about an agency or employer" tone="accent" />
      </div>
    </AppShell>
  );
}
