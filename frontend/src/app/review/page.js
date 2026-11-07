'use client';
import { useState, useEffect, useCallback } from 'react';
import { auth, workers, voice, getLanguage } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Badge, Button, Card, EmptyState, Field, Icon, Notice, PageHeader, SectionTitle, Spinner, inputClass } from '@/components/ui';

const SPEECH_LANG = { en: 'en-US', am: 'am-ET', om: 'om-ET', ar: 'ar-SA' };

const parseUtc = (iso) => new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
const fmtDate = (iso) => (iso ? parseUtc(iso).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const money = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function parseTerms(contract) {
  try {
    return JSON.parse(contract.terms_json || '{}');
  } catch {
    return { terms: contract.terms_json };
  }
}

// Same checks the backend runs when a contract is saved (workers.create_contract)
function contractIssues(contract, terms) {
  const text = (terms.terms || '').toLowerCase();
  const issues = [];
  if (!(contract.wage > 0)) issues.push({ title: 'Wage amount missing', body: 'No monthly wage is recorded. Ask for the amount in writing before travel.', tone: 'warn' });
  if (!text.includes('rest day')) issues.push({ title: 'Weekly rest day not stated', body: 'No weekly day off appears in the terms. This should be written clearly.', tone: 'missing' });
  if (!text.includes('terminat')) issues.push({ title: 'Termination terms not stated', body: 'The terms do not say how the contract can end. Ask the agency to add this.', tone: 'missing' });
  return issues;
}

const fetchRecord = async () => {
  const [me, contracts] = await Promise.all([auth.me(), workers.contracts()]);
  const latest = [...contracts].sort((a, b) => parseUtc(b.start_date) - parseUtc(a.start_date))[0] || null;
  const [summary, docs] = latest
    ? await Promise.all([workers.wageSummary(latest.id), workers.documents(latest.id)])
    : [null, { documents: [] }];
  return { me, contracts, latest, summary, documents: docs.documents };
};

export default function ReviewRecordPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const ready = useRequireAuth();
  const [record, setRecord] = useState(null); // { me, contracts, latest, summary }
  const [loadError, setLoadError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [payment, setPayment] = useState({ amount: '', paid_on: '', note: '' });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetchRecord()
      .then((r) => !cancelled && setRecord(r))
      .catch((err) => !cancelled && setLoadError(err.message));
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const reload = useCallback(async () => {
    try {
      setRecord(await fetchRecord());
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  const contract = record?.latest;
  const terms = contract ? parseTerms(contract) : {};
  const issues = contract ? contractIssues(contract, terms) : [];
  const summary = record?.summary;
  const workerCode = record?.me?.id ? record.me.id.slice(-6).toUpperCase() : '';
  const paidPct = summary && summary.total_owed > 0 ? Math.min(100, Math.round((summary.total_paid / summary.total_owed) * 100)) : 0;

  const listenSummary = async () => {
    if (!contract) return;
    try {
      const res = await voice.readContract(contract.id);
      if (/^https?:/.test(res.audio_url)) {
        new Audio(res.audio_url).play();
      } else if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(res.text);
        u.lang = SPEECH_LANG[getLanguage()] || 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch (err) {
      setNotice(err.message);
    }
  };

  const addPayment = async (e) => {
    e.preventDefault();
    if (!payment.amount || !payment.paid_on) return setNotice('Enter the amount and the date you were paid.');
    setBusy(true);
    try {
      await workers.addWage(contract.id, {
        amount: Number(payment.amount),
        paid_on: new Date(payment.paid_on).toISOString(),
        note: payment.note || null,
      });
      setPayment({ amount: '', paid_on: '', note: '' });
      setShowPayment(false);
      setNotice('Payment saved.');
      await reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  const exportRecord = async () => {
    try {
      const data = await workers.exportRecord();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amannat-record-${workerCode || 'worker'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setNotice(err.message);
    }
  };

  const openDocument = async (doc) => {
    // Open the tab synchronously so pop-up blockers allow it, then load the file into it
    const tab = window.open('', '_blank');
    try {
      const blob = await workers.documentBlob(contract.id, doc.id);
      const url = URL.createObjectURL(blob);
      if (tab) tab.location.assign(url);
      else window.location.assign(url);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      tab?.close();
      setNotice(err.message);
    }
  };

  const openPaymentForm = () => {
    if (!contract) return setNotice('Add a contract first.');
    setShowPayment(true);
  };

  if (!ready) return null;

  const details = contract
    ? [
        ['Monthly wage', contract.wage > 0 ? money(contract.wage) : null],
        [t.workingHours, terms.hours ? `${terms.hours} hours per day` : null],
        ['Start date', fmtDate(contract.start_date)],
        ['End date', contract.end_date ? fmtDate(contract.end_date) : 'Ongoing'],
      ]
    : [];

  return (
    <AppShell wide>
      <PageHeader
        title={t.myPortableRecord}
        subtitle={workerCode ? `Worker code ${workerCode}` : undefined}
        action={record && <Button size="sm" variant="secondary" icon="download" onClick={exportRecord}>Export</Button>}
      />

      {loadError && <Notice tone="error" className="mb-5">{loadError}</Notice>}
      {notice && <Notice tone="info" className="mb-5">{notice}</Notice>}
      {!record && !loadError && <Spinner label="Loading your record…" />}

      {record && !contract && (
        <Card>
          <EmptyState
            icon="description"
            title="No contract saved yet"
            action={<Button href="/records" icon="add">{t.addYourContract}</Button>}
          >
            Save what was promised to you. We check it and help you track your wages.
          </EmptyState>
        </Card>
      )}

      {contract && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Contract check */}
          <div className="flex flex-col gap-4">
            <Card>
              <SectionTitle action={<Button size="sm" variant="ghost" icon="volume_up" onClick={listenSummary}>{t.listen || 'Listen'}</Button>}>
                {t.reviewContractTerms}
              </SectionTitle>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 rounded-full bg-sand-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${issues.length ? 'bg-accent-500' : 'bg-brand-600'}`}
                    style={{ width: `${((3 - issues.length) / 3) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${issues.length ? 'text-accent-700' : 'text-brand-700'}`}>
                  {issues.length ? `${issues.length} to check` : 'Looks complete'}
                </span>
              </div>

              {issues.length > 0 && (
                <ul className="flex flex-col gap-2 mb-4">
                  {issues.map((issue) => (
                    <li key={issue.title} className={`rounded-xl px-4 py-3 ${issue.tone === 'warn' ? 'bg-accent-50' : 'bg-danger-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-[15px] font-semibold ${issue.tone === 'warn' ? 'text-accent-700' : 'text-danger-700'}`}>{issue.title}</p>
                        <Badge tone={issue.tone === 'warn' ? 'warning' : 'danger'}>{issue.tone === 'warn' ? t.unusual : t.missing}</Badge>
                      </div>
                      <p className="text-sm text-stone-700 mt-1">{issue.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <dl className="divide-y divide-sand-200">
                {details.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <dt className="text-[15px] text-stone-500">{label}</dt>
                    <dd className={`text-[15px] font-semibold ${value ? 'text-stone-900' : 'text-accent-700'}`}>{value || 'Not stated'}</dd>
                  </div>
                ))}
              </dl>
              {terms.terms && (
                <div className="mt-3 rounded-xl bg-sand-50 p-4">
                  <p className="text-sm font-semibold text-stone-500 mb-1">Terms</p>
                  <p className="text-[15px] text-stone-800 whitespace-pre-wrap">{terms.terms}</p>
                </div>
              )}
              <p className="text-sm text-stone-500 mt-4">{t.reviewGuidance}</p>
            </Card>

            {issues.length > 0 && (
              <Button href="/assistant" variant="secondary" icon="mic">Ask Voxide what to say to the agency</Button>
            )}
          </div>

          {/* Wages + documents */}
          <div className="flex flex-col gap-4">
            <Card>
              <SectionTitle
                action={
                  <Button size="sm" variant="ghost" icon={showPayment ? 'close' : 'add'} onClick={() => (showPayment ? setShowPayment(false) : openPaymentForm())}>
                    {showPayment ? 'Cancel' : t.addPayment}
                  </Button>
                }
              >
                {t.wageHistoryLabel}
              </SectionTitle>

              {showPayment && (
                <form onSubmit={addPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 pb-5 border-b border-sand-200">
                  <Field label="Amount received" htmlFor="pay-amount">
                    <input id="pay-amount" type="number" min="0" inputMode="decimal" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Date received" htmlFor="pay-date">
                    <input id="pay-date" type="date" value={payment.paid_on} onChange={(e) => setPayment({ ...payment, paid_on: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Note (optional)" htmlFor="pay-note" className="sm:col-span-2">
                    <input id="pay-note" value={payment.note} onChange={(e) => setPayment({ ...payment, note: e.target.value })} className={inputClass} />
                  </Field>
                  <Button type="submit" className="sm:col-span-2" disabled={busy}>{busy ? 'Saving…' : 'Save payment'}</Button>
                </form>
              )}

              {summary && (
                <>
                  <dl className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-sand-50 p-3">
                      <dt className="text-sm text-stone-500">Earned</dt>
                      <dd className="text-lg font-bold text-stone-900 mt-0.5">{money(summary.total_owed)}</dd>
                    </div>
                    <div className="rounded-xl bg-brand-50 p-3">
                      <dt className="text-sm text-brand-700">Paid</dt>
                      <dd className="text-lg font-bold text-brand-800 mt-0.5">{money(summary.total_paid)}</dd>
                    </div>
                    <div className="rounded-xl bg-accent-50 p-3">
                      <dt className="text-sm text-accent-700">{t.stillOwed}</dt>
                      <dd className="text-lg font-bold text-accent-700 mt-0.5">{money(Math.max(0, summary.balance))}</dd>
                    </div>
                  </dl>
                  <div className="h-2 rounded-full bg-sand-200 overflow-hidden mt-4">
                    <div className={`h-full rounded-full ${paidPct >= 100 ? 'bg-brand-600' : 'bg-accent-500'}`} style={{ width: `${paidPct}%` }} />
                  </div>
                  <p className="text-sm text-stone-500 mt-2">
                    {paidPct}% paid · {money(contract.wage)} per month since {fmtDate(contract.start_date)}
                  </p>
                </>
              )}
            </Card>

            <Card>
              <SectionTitle action={<Button size="sm" variant="ghost" icon="add" href="/records">Add</Button>}>
                {t.savedEvidence}
              </SectionTitle>
              {record.documents?.length ? (
                <ul className="flex flex-col gap-2">
                  {record.documents.map((doc, i) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => openDocument(doc)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-sand-50 hover:bg-sand-100 text-left"
                      >
                        <Icon name={doc.content_type === 'application/pdf' ? 'picture_as_pdf' : 'image'} className="text-[22px] text-brand-700" />
                        <span className="flex-1 min-w-0">
                          <span className="block text-[15px] font-semibold text-stone-900 truncate">Page {i + 1}</span>
                          <span className="block text-sm text-stone-500 truncate">{doc.name} · {Math.max(1, Math.round(doc.size / 1024))} KB</span>
                        </span>
                        <Icon name="open_in_new" className="text-[20px] text-stone-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-stone-600">No photos or files saved for this contract.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}
