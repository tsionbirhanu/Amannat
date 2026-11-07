'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { safety, workers, checkInNow, triggerPanic } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Button, Card, Field, Icon, ListLink, Notice, PageHeader, SectionTitle, inputClass } from '@/components/ui';

const COUNTRIES = ['Saudi Arabia', 'UAE', 'Lebanon', 'Kuwait'];
const HOLD_MS = 3000;

const formatTime = (iso) => {
  if (!iso) return '';
  // Backend stores UTC without a timezone suffix
  const d = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  return d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
};

const fetchAll = () => Promise.all([safety.checkins(), workers.guardians()]);

const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

export default function SafetyHubPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const ready = useRequireAuth();
  const [checkins, setCheckins] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [hotlines, setHotlines] = useState([]);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false);

  const [holding, setHolding] = useState(false);
  const [confirmPanic, setConfirmPanic] = useState(false);
  const holdTimer = useRef(null);

  const [showGuardianForm, setShowGuardianForm] = useState(false);
  const [guardianForm, setGuardianForm] = useState({ name: '', relation: '', phone: '', channel: 'sms' });

  const fail = (err) => setMessage({ type: 'error', text: err.message });

  const loadAll = useCallback(async () => {
    try {
      const [c, g] = await fetchAll();
      setCheckins(c);
      setGuardians(g);
    } catch (err) {
      fail(err);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetchAll()
      .then(([c, g]) => {
        if (cancelled) return;
        setCheckins(c);
        setGuardians(g);
      })
      .catch((err) => !cancelled && fail(err));
    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    safety
      .hotlines(country)
      .then((h) => !cancelled && setHotlines(h))
      .catch((err) => !cancelled && fail(err));
    return () => {
      cancelled = true;
    };
  }, [ready, country]);

  const lastConfirmed = checkins.find((c) => c.status === 'confirmed');
  const nextPending = [...checkins]
    .filter((c) => c.status === 'pending')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];

  const handleCheckIn = async () => {
    setBusy(true);
    try {
      await checkInNow();
      setMessage({ type: 'ok', text: 'Checked in. Your guardians know you are safe.' });
      await loadAll();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const startHold = () => {
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      setHolding(false);
      setConfirmPanic(true);
    }, HOLD_MS);
  };
  const cancelHold = () => {
    clearTimeout(holdTimer.current);
    setHolding(false);
  };

  const sendPanic = async () => {
    setBusy(true);
    try {
      await triggerPanic();
      setConfirmPanic(false);
      setMessage({ type: 'ok', text: 'Urgent alert sent to your guardians.' });
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const addGuardian = async (e) => {
    e.preventDefault();
    const { name, relation, phone } = guardianForm;
    if (!name.trim() || !relation.trim() || !phone.trim()) return setMessage({ type: 'error', text: 'Fill in name, relation and phone.' });
    setBusy(true);
    try {
      await workers.addGuardian(guardianForm);
      setGuardianForm({ name: '', relation: '', phone: '', channel: 'sms' });
      setShowGuardianForm(false);
      await loadAll();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return null;

  return (
    <AppShell wide>
      <PageHeader title={t.safetyHub} />

      {message && (
        <Notice tone={message.type === 'error' ? 'error' : 'success'} className="mb-5">{message.text}</Notice>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="flex flex-col gap-5">
          {/* Emergency */}
          <section className="rounded-3xl bg-danger-50 border border-danger-100 p-5 md:p-6">
            <h2 className="text-lg font-bold text-danger-700">{t.urgentEmergency}</h2>
            <p className="text-[15px] text-stone-700 mt-1">Press and hold for 3 seconds. You will see who gets the alert before it is sent.</p>

            {!confirmPanic ? (
              <button
                type="button"
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Press and hold for 3 seconds to send an urgent alert"
                className="relative mt-5 w-full h-16 rounded-2xl bg-danger-600 text-white font-bold text-lg overflow-hidden select-none touch-none active:scale-[0.99]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 bg-danger-700 ${holding ? 'w-full transition-[width] duration-[3000ms] ease-linear' : 'w-0'}`}
                />
                <span className="relative inline-flex items-center gap-2">
                  <Icon name="sos" filled className="text-[26px]" />
                  {holding ? 'Keep holding…' : 'Hold for help'}
                </span>
              </button>
            ) : (
              <div role="alertdialog" aria-label="Confirm urgent alert" className="mt-5 bg-white rounded-2xl border border-danger-100 p-4">
                <p className="text-[15px] font-semibold text-stone-900">Send an urgent alert now?</p>
                <p className="text-[15px] text-stone-600 mt-1">
                  {guardians.length
                    ? `${guardians.map((g) => g.name).join(', ')} will be alerted.`
                    : 'You have no guardians yet, so nobody will be alerted. Add one below.'}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button variant="secondary" onClick={() => setConfirmPanic(false)}>Cancel</Button>
                  <Button variant="danger" onClick={sendPanic} disabled={busy}>{busy ? 'Sending…' : 'Send alert'}</Button>
                </div>
              </div>
            )}
          </section>

          {/* Check-in */}
          <Card className="flex flex-wrap items-center gap-4">
            <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${lastConfirmed ? 'bg-brand-50 text-brand-700' : 'bg-sand-100 text-stone-500'}`}>
              <Icon name={lastConfirmed ? 'verified' : 'schedule'} filled={!!lastConfirmed} className="text-[24px]" />
            </span>
            <div className="flex-1 min-w-[10rem]">
              <p className="text-[15px] font-semibold text-stone-900">{lastConfirmed ? t.checkedInSafe : 'No check-in yet'}</p>
              <p className="text-sm text-stone-500 mt-0.5">
                {lastConfirmed ? formatTime(lastConfirmed.scheduled_at) : 'Let your guardians know you are safe.'}
                {nextPending ? ` · Next: ${formatTime(nextPending.scheduled_at)}` : ''}
              </p>
            </div>
            <Button icon="check" onClick={handleCheckIn} disabled={busy} className="w-full sm:w-auto">{busy ? 'Saving…' : t.checkIn}</Button>
          </Card>

          <ListLink href="/incident" icon="report" title={t.reportSafely} subtitle="Write a report about an agency or employer" tone="accent" />
        </div>

        <div className="flex flex-col gap-5">
          {/* Guardians */}
          <Card>
            <SectionTitle
              action={guardians.length < 5 && (
                <Button size="sm" variant="ghost" icon={showGuardianForm ? 'close' : 'person_add'} onClick={() => setShowGuardianForm((v) => !v)}>
                  {showGuardianForm ? 'Cancel' : 'Add'}
                </Button>
              )}
            >
              {t.myGuardians}
            </SectionTitle>

            {showGuardianForm && (
              <form onSubmit={addGuardian} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pb-4 border-b border-sand-200">
                <Field label="Name" htmlFor="g-name" className="sm:col-span-2">
                  <input id="g-name" className={inputClass} value={guardianForm.name} onChange={(e) => setGuardianForm({ ...guardianForm, name: e.target.value })} />
                </Field>
                <Field label="Relation" htmlFor="g-relation">
                  <input id="g-relation" className={inputClass} placeholder="Sister" value={guardianForm.relation} onChange={(e) => setGuardianForm({ ...guardianForm, relation: e.target.value })} />
                </Field>
                <Field label="Phone" htmlFor="g-phone">
                  <input id="g-phone" type="tel" className={inputClass} placeholder="+251…" value={guardianForm.phone} onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })} />
                </Field>
                <Field label="Contact by" htmlFor="g-channel">
                  <select id="g-channel" className={inputClass} value={guardianForm.channel} onChange={(e) => setGuardianForm({ ...guardianForm, channel: e.target.value })}>
                    <option value="sms">SMS / Telegram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="call">Call</option>
                  </select>
                </Field>
                <div className="flex items-end">
                  <Button type="submit" className="w-full" disabled={busy}>Save</Button>
                </div>
              </form>
            )}

            {guardians.length === 0 && !showGuardianForm ? (
              <p className="text-[15px] text-stone-600">Add someone you trust. They are alerted if you need help or miss a check-in.</p>
            ) : (
              <ul className="divide-y divide-sand-200">
                {guardians.map((g) => (
                  <li key={g.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="w-10 h-10 rounded-full bg-brand-50 text-brand-800 text-sm font-bold flex items-center justify-center shrink-0">{initials(g.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-stone-900 truncate">{g.name}</p>
                      <p className="text-sm text-stone-500 truncate">{g.relation}</p>
                    </div>
                    <a href={`tel:${g.phone}`} aria-label={`Call ${g.name}`} className="w-10 h-10 rounded-full flex items-center justify-center text-brand-700 hover:bg-brand-50">
                      <Icon name="call" className="text-[20px]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Hotlines */}
          <Card>
            <SectionTitle
              action={
                <select
                  aria-label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-9 rounded-lg border-stone-300 text-sm font-semibold text-stone-700 py-0 pl-3 pr-8"
                >
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              }
            >
              {t.hotlineDirectory}
            </SectionTitle>
            {hotlines.length === 0 ? (
              <p className="text-[15px] text-stone-600">No hotlines listed for {country}.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hotlines.map((number) => (
                  <li key={number}>
                    <a href={`tel:${number}`} className="flex items-center gap-3 h-14 px-4 rounded-xl bg-sand-50 border border-sand-200 hover:border-brand-200">
                      <Icon name="call" className="text-[20px] text-brand-700" />
                      <span className="text-lg font-bold text-stone-900 tracking-wide">{number}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
