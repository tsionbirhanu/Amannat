'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { voice, report, workers, agency as agencyApi, getLanguage } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Badge, Button, Card, Field, Icon, Notice, PageHeader, SectionTitle, inputClass, textareaClass } from '@/components/ui';

const CATEGORIES = [
  { id: 'wage_nonpayment', label: 'Wages not paid' },
  { id: 'contract_substitution', label: 'Contract changed after signing' },
  { id: 'abuse', label: 'Abuse' },
  { id: 'passport_confiscation', label: 'Passport is being kept' },
];
const SPEECH_LANG = { en: 'en-US', am: 'am-ET', om: 'om-ET', ar: 'ar-SA' };
const DRAFT_KEY = 'amannat_incident_draft';

const emptyDraft = { description: '', category: '', agencyId: null, agencyName: '' };

function loadDraft() {
  try {
    return { ...emptyDraft, ...JSON.parse(window.localStorage.getItem(DRAFT_KEY) || '{}') };
  } catch {
    return emptyDraft;
  }
}

export default function IncidentReviewPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const ready = useRequireAuth();
  const [draft, setDraft] = useState(() => (typeof window === 'undefined' ? emptyDraft : loadDraft()));
  // Agencies the worker has a contract with: the backend only accepts reports about these (FR-2.3)
  const [myAgencies, setMyAgencies] = useState(null); // null = loading
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('draft'); // draft | analyzing | sending | sent
  const [message, setMessage] = useState(null); // { type, text }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const categoryLabel = CATEGORIES.find((c) => c.id === draft.category)?.label;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const contracts = await workers.contracts();
      const ids = [...new Set(contracts.map((c) => c.agency_id).filter(Boolean))];
      const agencies = await Promise.all(ids.map((id) => agencyApi.get(id).catch(() => null)));
      return agencies.filter(Boolean).map((a) => ({ id: a.id, name: a.name }));
    })()
      .then((list) => {
        if (cancelled) return;
        setMyAgencies(list);
        // Only one agency? Pre-select it.
        if (list.length === 1) setDraft((d) => (d.agencyId ? d : { ...d, agencyId: list[0].id, agencyName: list[0].name }));
      })
      .catch((err) => {
        if (cancelled) return;
        setMyAgencies([]);
        setMessage({ type: 'error', text: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const pickAgency = (id) => {
    const a = myAgencies?.find((x) => x.id === id);
    set({ agencyId: a?.id || null, agencyName: a?.name || '' });
  };

  // Ask the backend to guess the category and agency from the description
  const analyze = async () => {
    if (!draft.description.trim()) return setMessage({ type: 'error', text: 'Describe what happened first.' });
    setStatus('analyzing');
    setMessage(null);
    try {
      const res = await voice.report(draft.description.trim());
      const known = myAgencies?.find((a) => a.id === res.agency_id);
      set({
        category: CATEGORIES.some((c) => c.id === res.category_guess) ? res.category_guess : draft.category,
        ...(known ? { agencyId: known.id, agencyName: known.name } : {}),
      });
      if (res.agency_id && !known) {
        setMessage({
          type: 'error',
          text: `It sounds like this is about ${res.agency_name_guess || 'an agency'}, but you have no saved contract with them. Add that contract in Records first.`,
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setStatus('draft');
    }
  };

  const listen = () => {
    if (!('speechSynthesis' in window)) return;
    const text = [
      categoryLabel && `Concern: ${categoryLabel}.`,
      draft.agencyName && `Agency: ${draft.agencyName}.`,
      draft.description,
    ].filter(Boolean).join(' ');
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SPEECH_LANG[getLanguage()] || 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const saveDraft = () => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setMessage({ type: 'ok', text: 'Draft saved on this device.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not save the draft on this device.' });
    }
  };

  const send = async () => {
    if (!draft.category) return setMessage({ type: 'error', text: 'Choose what the concern is.' });
    if (!draft.agencyId) return setMessage({ type: 'error', text: 'Choose the agency this report is about.' });
    if (!consent) return setMessage({ type: 'error', text: 'Please tick the consent box before sending.' });
    setStatus('sending');
    setMessage(null);
    try {
      await report.submit({ agencyId: draft.agencyId, category: draft.category, description: draft.description });
      try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
      setStatus('sent');
      setMessage({ type: 'ok', text: 'Report sent. It is queued for review and your name is not shared.' });
    } catch (err) {
      setStatus('draft');
      setMessage({
        type: 'error',
        text: err.status === 403 ? 'You can only report an agency you have a saved contract with. Add the contract in Records first.' : err.message,
      });
    }
  };

  if (!ready) return null;

  const sent = status === 'sent';

  return (
    <AppShell>
      <PageHeader
        title={t.reviewIncidentReport}
        backHref="/safety"
        action={<Badge tone={sent ? 'success' : 'neutral'} icon={sent ? 'check' : 'schedule'}>{sent ? 'Sent' : t.notSent}</Badge>}
      />

      <Card>
        <SectionTitle
          action={
            <Button size="sm" variant="ghost" icon="auto_awesome" onClick={analyze} disabled={status !== 'draft' || sent}>
              {status === 'analyzing' ? 'Reading…' : 'Fill in for me'}
            </Button>
          }
        >
          {t.whatIReported}
        </SectionTitle>

        <div className="flex flex-col gap-4">
          <Field label="What happened" htmlFor="incident-text" hint="Write it in your own words. “Fill in for me” picks the concern and agency from what you write.">
            <textarea
              id="incident-text"
              rows={5}
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
              disabled={sent}
              placeholder="Example: My employer has kept my passport since September."
              className={textareaClass}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t.concern} htmlFor="incident-category">
              <select id="incident-category" value={draft.category} onChange={(e) => set({ category: e.target.value })} disabled={sent} className={inputClass}>
                <option value="">Choose…</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>

            <Field label="Agency" htmlFor="incident-agency">
              {myAgencies === null ? (
                <p className="h-12 flex items-center text-[15px] text-stone-500">Loading…</p>
              ) : myAgencies.length === 0 ? (
                <p className="text-[15px] text-stone-600">
                  Save a contract with the agency first.{' '}
                  <Link href="/records" className="font-semibold text-brand-700 underline">Add contract</Link>
                </p>
              ) : (
                <select id="incident-agency" value={draft.agencyId || ''} onChange={(e) => pickAgency(e.target.value)} disabled={sent} className={inputClass}>
                  <option value="">Choose…</option>
                  {myAgencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              )}
            </Field>
          </div>

          <Button variant="ghost" size="sm" icon="volume_up" onClick={listen} className="self-start -ml-2">{t.listenBeforeDecide}</Button>
        </div>
      </Card>

      <Card className="mt-4">
        <SectionTitle>{t.whoWillReceive}</SectionTitle>
        <ul className="flex flex-col gap-3 text-[15px] text-stone-700">
          <li className="flex items-start gap-3">
            <Icon name="gavel" className="text-[22px] text-brand-700 mt-px" />
            Your report goes to the Amannat review council.
          </li>
          <li className="flex items-start gap-3">
            <Icon name="visibility_off" className="text-[22px] text-brand-700 mt-px" />
            The agency never sees your name or phone number. Only anonymous totals are shown.
          </li>
        </ul>
      </Card>

      <label className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 cursor-pointer ${consent ? 'border-brand-500 bg-brand-50' : 'border-sand-200 bg-white'}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={sent}
          className="mt-0.5 w-5 h-5 rounded border-stone-400 text-brand-700 focus:ring-brand-500"
        />
        <span className="text-[15px] text-stone-800">{t.consentSend}</span>
      </label>

      {message && <Notice tone={message.type === 'error' ? 'error' : 'success'} className="mt-4">{message.text}</Notice>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        <Button variant="secondary" icon="save" onClick={saveDraft} disabled={sent}>{t.saveDraft}</Button>
        <Button icon="send" onClick={send} disabled={status === 'sending' || sent}>
          {status === 'sending' ? 'Sending…' : sent ? 'Sent' : t.consentAndSend}
        </Button>
      </div>
    </AppShell>
  );
}
