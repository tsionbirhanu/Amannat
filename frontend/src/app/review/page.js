'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { auth, workers, voice, getLanguage } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

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
  const [activeView, setActiveView] = useState('contract'); // 'contract', 'record', or 'both'
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
    setActiveView(window.innerWidth >= 768 ? 'both' : 'record');
    setShowPayment(true);
  };

  // Auto-switch to 'both' on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveView('both');
      } else if (activeView === 'both') {
        setActiveView('contract');
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeView]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#0d1117] md:bg-[#fcfbf7] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#fcfbf7] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-4 justify-between items-center z-10 shrink-0 w-full shadow-sm">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>{t.home}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/trust">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>{t.trust}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-emerald-800 font-semibold" href="/records">
              <div className="w-8 h-8 rounded-full bg-[#edf6f2] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-emerald-800">folder</span>
              </div>
              <span>{t.records}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/safety">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>{t.safety}</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{t.exitDisguise}</span>
          </button>
        </nav>

        {/* Mobile View Toggle */}
        <div className="md:hidden mt-2 mb-2 flex justify-center w-full px-4 z-20 shrink-0">
          <div className="flex items-center bg-slate-800 p-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-300 shadow-lg w-full max-w-[350px]">
            <button 
              className={`flex-1 py-1.5 rounded-full transition-all ${activeView === 'contract' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setActiveView('contract')}
            >
              {t.tabReview}
            </button>
            <button 
              className={`flex-1 py-1.5 rounded-full transition-all ${activeView === 'record' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setActiveView('record')}
            >
              {t.tabRecord}
            </button>
          </div>
        </div>

        {/* iOS StatusBar (Hidden on Desktop) */}
        <header className="md:hidden w-full pt-1 px-7 pb-1 flex justify-between items-center z-30 select-none shrink-0 text-slate-900">
          <span className="text-[14px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center space-x-2 text-[12px]">
            <span className="material-symbols-outlined text-[14px] fill-current">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <div className="w-5 h-2.5 border border-slate-900 rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-slate-900 rounded-[2px]"></div>
            </div>
          </div>
        </header>

        {/* Main 2-Column Content */}
        <div className="flex-1 overflow-hidden w-full max-w-6xl mx-auto flex">
          
          {/* ========================================================= */}
          {/* SCREEN 1: Contract Review */}
          {/* ========================================================= */}
          <div className={`w-full md:w-1/2 flex flex-col h-full bg-[#fcfbf7] md:border-r border-slate-200 ${activeView === 'contract' || activeView === 'both' ? 'flex' : 'hidden'}`}>
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 pt-2 md:pt-6 pb-24 md:pb-6 space-y-3.5 md:space-y-5">
              
              <header className="flex items-center justify-between pt-1 mb-2">
                <div className="flex items-center gap-3">
                  <Link href="/records" aria-label="Go back" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm active:scale-95 transition-transform hover:bg-slate-50">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </Link>
                  <div>
                    <h1 className="text-[17px] md:text-xl font-bold tracking-tight text-slate-900 leading-tight">{t.reviewContractTerms}</h1>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{t.offlineSync}</span>
                    </div>
                  </div>
                </div>
                <button className="md:hidden px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 shadow-sm hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  <span>{t.exit}</span>
                </button>
              </header>

              {loadError && (
                <p role="alert" className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">{loadError}</p>
              )}
              {notice && (
                <p role="status" className="text-xs md:text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded-xl p-3">{notice}</p>
              )}
              {record && !contract && (
                <section className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-200 text-sm text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">No contract saved yet</p>
                  <p>Save what was promised to you so we can check it and track your wages.</p>
                  <Link href="/records" className="inline-block font-semibold text-teal-700 underline">Add your contract</Link>
                </section>
              )}
              {!record && !loadError && <p className="text-sm text-slate-500">Loading your record…</p>}

              {contract && (<>
              <section aria-label="Terms status" className="pt-1">
                <div className="flex justify-between items-center text-[11px] md:text-xs text-slate-600 mb-1.5 md:mb-2 font-medium">
                  <span>{3 - issues.length} of 3 key terms found</span>
                  <span className={issues.length ? 'text-amber-800 font-semibold' : 'text-emerald-700 font-semibold'}>
                    {issues.length ? `${issues.length} need${issues.length === 1 ? 's' : ''} your attention` : 'Looks complete'}
                  </span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className={`${issues.length ? 'bg-amber-600' : 'bg-emerald-600'} h-full rounded-full`} style={{ width: `${((3 - issues.length) / 3) * 100}%` }}></div>
                </div>
              </section>

              <section className="bg-[#1b433c] text-white p-3.5 md:p-4 rounded-2xl md:rounded-3xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 md:gap-4">
                  <button onClick={listenSummary} aria-label="Play contract summary" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f28e2b] flex items-center justify-center text-white shrink-0 shadow-inner hover:bg-[#e07d1a] transition-colors">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">play_arrow</span>
                  </button>
                  <div>
                    <h2 className="text-[13px] md:text-sm font-semibold tracking-wide">{t.listenSummary}</h2>
                    <p className="text-[11px] md:text-xs text-teal-200/90 mt-0.5">Read aloud by Voxide</p>
                  </div>
                </div>
                <button aria-label="Translate audio" className="text-teal-200 hover:text-white p-1.5 md:p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">translate</span>
                </button>
              </section>

              {issues.map((issue) => (
                <article
                  key={issue.title}
                  className={`${issue.tone === 'warn' ? 'bg-[#fffbeb] border-[#fef3c7]' : 'bg-[#fef2f2] border-[#fee2e2]'} border rounded-2xl md:rounded-3xl p-3.5 md:p-5 text-[12px] md:text-sm space-y-2 md:space-y-3 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 font-semibold text-[13px] md:text-base ${issue.tone === 'warn' ? 'text-amber-900' : 'text-[#991b1b]'}`}>
                      <span className={`material-symbols-outlined text-[18px] md:text-[20px] ${issue.tone === 'warn' ? 'text-amber-600' : 'text-[#dc2626]'}`}>{issue.tone === 'warn' ? 'warning' : 'help'}</span>
                      <span>{issue.title}</span>
                    </div>
                    <span className={`text-[11px] md:text-xs font-medium px-2 py-0.5 rounded-md ${issue.tone === 'warn' ? 'text-amber-800 bg-amber-100/90' : 'text-[#991b1b] bg-rose-100/90'}`}>
                      {issue.tone === 'warn' ? t.unusual : t.missing}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-snug">{issue.body}</p>
                  <div className="pt-1">
                    <Link className="inline-flex items-center gap-1 text-[12px] md:text-sm font-medium text-[#b91c1c] hover:underline" href="/assistant">
                      <span>Ask Voxide what to say to the agency</span>
                      <span className="material-symbols-outlined text-[14px] md:text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}

              <section className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-3 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
                {[
                  ['Monthly wage', contract.wage > 0 ? money(contract.wage) : null],
                  [t.workingHours, terms.hours ? `${terms.hours} hours per day` : null],
                  ['Start date', fmtDate(contract.start_date)],
                  ['End date', contract.end_date ? fmtDate(contract.end_date) : 'Ongoing'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                    <span className="text-slate-500 font-medium">{label}</span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <span>{value || 'Not stated'}</span>
                      <span className={`material-symbols-outlined text-[16px] md:text-[20px] ${value ? 'text-emerald-600' : 'text-amber-600'}`}>{value ? 'check_circle' : 'help'}</span>
                    </div>
                  </div>
                ))}
                {terms.terms && (
                  <div className="py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                    <span className="text-slate-500 font-medium block mb-1">Terms</span>
                    <p className="text-slate-800 whitespace-pre-wrap">{terms.terms}</p>
                  </div>
                )}
              </section>
              </>)}

              <section className="bg-[#edf6f2] border border-[#d8ebe1] rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-700 shrink-0 mt-0.5 md:mt-0">lock</span>
                <p className="text-[11px] md:text-xs leading-relaxed text-slate-700">
                  {t.reviewGuidance}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-2.5 md:gap-4 pt-1 pb-4">
                <Link href="/records" className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-slate-300 bg-white font-semibold text-[13px] md:text-sm text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span>New contract</span>
                </Link>
                <button 
                  className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-[#1b433c] hover:bg-[#153630] text-white font-semibold text-[13px] md:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                  onClick={() => setActiveView(window.innerWidth >= 768 ? 'both' : 'record')}
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-300">check_box</span>
                  <span>{t.saveReview}</span>
                </button>
              </div>
            </main>
          </div>

          {/* ========================================================= */}
          {/* SCREEN 2: Portable Record */}
          {/* ========================================================= */}
          <div className={`w-full md:w-1/2 flex flex-col h-full bg-[#fcfbf7] ${activeView === 'record' || activeView === 'both' ? 'flex' : 'hidden'}`}>
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 pt-2 md:pt-6 pb-24 md:pb-6 space-y-3.5 md:space-y-5">
              
              <header className="flex items-center justify-between pt-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-[#1b433c] text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px] text-teal-300">verified</span>
                  </div>
                  <div>
                    <h1 className="text-[17px] md:text-xl font-bold tracking-tight text-slate-900 leading-tight">{t.myPortableRecord}</h1>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>{t.savedOnDevice}</span>
                    </div>
                  </div>
                </div>
                <button className="md:hidden px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 shadow-sm hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  <span>{t.exit}</span>
                </button>
              </header>

              <section className="bg-[#1b433c] text-white p-3.5 md:p-5 rounded-2xl md:rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#e6983b] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px] md:text-[28px] text-amber-950">folder</span>
                  </div>
                  <div>
                    <div className="text-[10px] md:text-[11px] tracking-wider font-semibold text-[#f4ba6d] uppercase">WORKER {workerCode || '…'}</div>
                    <h2 className="text-[14px] md:text-lg font-bold text-white tracking-tight md:mt-0.5">You own this record</h2>
                    <p className="text-[11px] md:text-[13px] text-teal-200/90 mt-0.5 md:mt-1">
                      {record ? `${record.contracts.length} contract${record.contracts.length === 1 ? '' : 's'} saved` : 'Loading…'}
                    </p>
                  </div>
                </div>
                <div className="text-teal-200 p-1.5 md:p-2 bg-white/10 rounded-full md:rounded-xl">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">key</span>
                </div>
              </section>

              <section className="bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-5 border border-slate-200/90 shadow-sm space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-[14px] md:text-base">{t.wageHistoryLabel}</h2>
                  {contract && (
                    <button type="button" onClick={() => setShowPayment((v) => !v)} className="text-[12px] md:text-sm font-semibold text-teal-700 hover:text-teal-800">
                      {showPayment ? 'Cancel' : 'Add payment'}
                    </button>
                  )}
                </div>

                {!contract && <p className="text-[12px] md:text-sm text-slate-500">Save a contract to start tracking wages.</p>}

                {showPayment && contract && (
                  <form onSubmit={addPayment} className="grid grid-cols-2 gap-2">
                    <input type="number" min="0" inputMode="decimal" placeholder="Amount paid" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} className="rounded-xl border-slate-200 text-sm" />
                    <input type="date" value={payment.paid_on} onChange={(e) => setPayment({ ...payment, paid_on: e.target.value })} className="rounded-xl border-slate-200 text-sm" />
                    <input placeholder="Note (optional)" value={payment.note} onChange={(e) => setPayment({ ...payment, note: e.target.value })} className="col-span-2 rounded-xl border-slate-200 text-sm" />
                    <button type="submit" disabled={busy} className="col-span-2 py-2 rounded-xl bg-[#1b433c] text-white text-sm font-semibold disabled:opacity-60">{busy ? 'Saving…' : 'Save payment'}</button>
                  </form>
                )}

                {summary && (
                  <>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div className="bg-[#f2f4f3] rounded-xl md:rounded-2xl p-2.5 md:p-4">
                        <span className="text-[11px] md:text-xs text-slate-500 font-medium">Earned so far</span>
                        <div className="text-[15px] md:text-xl font-bold text-slate-800 mt-0.5 md:mt-1">{money(summary.total_owed)}</div>
                      </div>
                      <div className="bg-[#edf6f2] rounded-xl md:rounded-2xl p-2.5 md:p-4">
                        <span className="text-[11px] md:text-xs text-emerald-800 font-medium">Paid</span>
                        <div className="text-[15px] md:text-xl font-bold text-emerald-800 mt-0.5 md:mt-1">{money(summary.total_paid)}</div>
                      </div>
                      <div className="bg-[#fef4e8] rounded-xl md:rounded-2xl p-2.5 md:p-4">
                        <span className="text-[11px] md:text-xs text-amber-800 font-medium">{t.stillOwed}</span>
                        <div className="text-[15px] md:text-xl font-bold text-amber-700 mt-0.5 md:mt-1">{money(Math.max(0, summary.balance))}</div>
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className={`${paidPct >= 100 ? 'bg-emerald-800' : 'bg-amber-600'} h-full rounded-full`} style={{ width: `${paidPct}%` }}></div>
                      </div>
                      <p className="text-[10px] md:text-[12px] text-slate-500 font-medium">{paidPct}% of earned wages paid • based on {money(contract.wage)} per month since {fmtDate(contract.start_date)}</p>
                    </div>
                  </>
                )}
              </section>

              <section className="space-y-2 md:space-y-3 pt-1 md:pt-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-[14px] md:text-base">{t.savedEvidence}</h2>
                  <Link href="/records" className="text-[12px] md:text-sm font-medium text-slate-500 hover:text-slate-800">Add pages</Link>
                </div>

                {record?.documents?.map((doc, i) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => openDocument(doc)}
                    className="w-full text-left bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
                      <div className="bg-emerald-50 p-2 rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-[20px] md:text-[24px] text-emerald-800">
                          {doc.content_type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                        </span>
                      </div>
                      <div className="text-[12px] md:text-sm font-semibold text-slate-800 min-w-0">
                        <span className="block truncate">Page {i + 1} • {doc.name}</span>
                        <span className="font-normal text-slate-500">{Math.max(1, Math.round(doc.size / 1024))} KB</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0">open_in_new</span>
                  </button>
                ))}

                <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5 md:gap-4">
                    <div className="bg-emerald-50 p-2 rounded-xl">
                      <span className="material-symbols-outlined text-[20px] md:text-[24px] text-emerald-800">description</span>
                    </div>
                    <div className="text-[12px] md:text-sm font-semibold text-slate-800">
                      Contract terms <span className="hidden md:inline">•</span> <br className="md:hidden"/> <span className="font-normal text-slate-500">{record ? `${record.contracts.length} saved` : '…'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] md:text-xs font-medium text-slate-600 bg-slate-100 px-2 md:px-3 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>{t.private}</span>
                  </div>
                </div>

                <div className="bg-[#edf6f2] border border-[#d8ebe1] rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                  <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-700 shrink-0 mt-0.5 md:mt-0">lock</span>
                  <p className="text-[11px] md:text-xs leading-relaxed text-slate-700">
                    {t.pdfExportNotice}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-2.5 md:gap-4 pt-1 pb-4 md:pt-3">
                <button type="button" onClick={openPaymentForm} className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-slate-300 bg-white font-semibold text-[13px] md:text-sm text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>{t.addPayment}</span>
                </button>
                <button type="button" onClick={exportRecord} className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-[#1b433c] hover:bg-[#153630] text-white font-semibold text-[13px] md:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px] text-emerald-300">download</span>
                  <span>Export record</span>
                </button>
              </div>
            </main>
          </div>
          
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 bg-white border-t border-slate-200/80 px-6 py-2 pb-5 flex justify-between items-center z-30 select-none">
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/home">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] mt-1 font-medium">Trust</span>
          </Link>
          <Link className="flex flex-col items-center" href="/records">
            <div className="px-5 py-1 bg-[#E8F1EC] rounded-2xl flex flex-col items-center text-[#143B35]">
              <span className="material-symbols-outlined text-[24px] filled">folder</span>
              <span className="text-[10px] font-semibold mt-0.5">Records</span>
            </div>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/safety">
            <span className="material-symbols-outlined text-[24px]">shield</span>
            <span className="text-[10px] mt-1 font-medium">Safety</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
