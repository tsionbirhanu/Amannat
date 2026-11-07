'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { voice, report, workers, agency as agencyApi, getLanguage } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

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

  return (
    <div className="min-h-screen bg-[#1F1F1F] md:bg-[#FBF9F4] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#FBF9F4] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-stone-200/80 px-8 py-4 justify-between items-center z-10 shrink-0 w-full shadow-sm">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>{t.home}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/trust">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>{t.trust}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/records">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              <span>{t.recordsTitle}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-[#183B32] font-semibold" href="/safety">
              <div className="w-8 h-8 rounded-full bg-[#E2EFE7] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-[#183B32]">shield</span>
              </div>
              <span>{t.safety}</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{t.exitDisguise}</span>
          </button>
        </nav>

        {/* iOS StatusBar (Hidden on Desktop) */}
        <header className="md:hidden w-full pt-3 px-7 flex justify-between items-center z-20 shrink-0 text-slate-900">
          <span className="text-[14px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[14px] fill-current">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <div className="w-6 h-3 border border-current rounded-[3px] p-[1px] flex items-center relative">
              <div className="h-full w-4 bg-current rounded-[1.5px]"></div>
              <div className="w-[1.5px] h-[4px] bg-current absolute -right-[3px] rounded-r-sm"></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-12 pt-2.5 md:pt-10 pb-24 md:pb-12 w-full flex justify-center">
          
          <div className="w-full max-w-5xl h-full flex flex-col">
            
            {/* Header Section */}
            <section className="flex items-center justify-between pt-1 mb-4 md:mb-8 shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                <Link href="/assistant" aria-label="Go back" className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-sm border border-stone-200/70 flex items-center justify-center text-slate-700 active:scale-95 transition-transform hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">arrow_back</span>
                </Link>
                <div>
                  <h1 className="text-[17px] md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{t.reviewIncidentReport}</h1>
                  <div className="flex items-center gap-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#B86B33]"></span>
                    <p className="text-[11px] md:text-sm text-stone-500 font-medium">{t.offlineSync}</p>
                  </div>
                </div>
              </div>
              <Link href="/home" className="flex items-center gap-1.5 bg-[#9E3834] text-white text-[13px] md:text-sm font-semibold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-sm active:opacity-90 hover:bg-[#8A312D] transition-colors">
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">logout</span>
                <span className="hidden md:inline">{t.exitDisguise}</span>
                <span className="md:hidden">{t.exit}</span>
              </Link>
            </section>

            {/* Desktop 2-Column Container */}
            <div className="md:flex md:gap-10">
              
              {/* Left Column (Desktop) */}
              <div className="md:w-[55%] flex flex-col gap-3.5 md:gap-6 mb-3.5 md:mb-0">
                
                {/* Audio Summary Card */}
                <section className="bg-[#183B32] text-white rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button type="button" onClick={listen} aria-label="Play audio summary" className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#DE9E46] text-[#122D26] flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-inner hover:bg-[#c98f3f]">
                      <span className="material-symbols-outlined text-[24px] md:text-[32px] ml-0.5">play_arrow</span>
                    </button>
                    <div>
                      <h2 className="text-[14px] md:text-lg font-semibold leading-tight text-white">{t.listenBeforeDecide}</h2>
                      <p className="text-[11px] md:text-sm text-stone-300 font-normal mt-0.5 md:mt-1">Hear your report read back</p>
                    </div>
                  </div>
                  <div className="bg-white/95 text-slate-700 text-[11px] md:text-sm font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[14px] md:text-[18px] text-stone-500">{status === 'sent' ? 'check' : 'schedule'}</span>
                    <span>{status === 'sent' ? 'Sent' : t.notSent}</span>
                  </div>
                </section>

                {/* What I Reported Card */}
                <section className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-stone-200/50 flex-1">
                  <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-stone-100">
                    <h2 className="text-[15px] md:text-lg font-bold text-slate-800">{t.whatIReported}</h2>
                    <button onClick={analyze} disabled={status !== 'draft'} className="text-[12px] md:text-sm font-medium text-emerald-800 flex items-center gap-1 hover:text-emerald-900 transition-colors disabled:opacity-50" type="button">
                      <span>{status === 'analyzing' ? 'Reading…' : 'Fill in for me'}</span>
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">auto_awesome</span>
                    </button>
                  </div>

                  <div className="text-[12px] md:text-sm mt-3 md:mt-4 space-y-3 md:space-y-4">
                    <label className="block">
                      <span className="flex items-center gap-2 text-stone-500 mb-1">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">description</span>
                        What happened
                      </span>
                      <textarea
                        rows={4}
                        value={draft.description}
                        onChange={(e) => set({ description: e.target.value })}
                        placeholder="e.g. My employer at Noor Al Hayat agency has kept my passport since September."
                        className="w-full rounded-xl border-stone-200 text-sm"
                      />
                    </label>

                    <label className="block">
                      <span className="flex items-center gap-2 text-stone-500 mb-1">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">radio_button_unchecked</span>
                        {t.concern}
                      </span>
                      <select value={draft.category} onChange={(e) => set({ category: e.target.value })} className="w-full rounded-xl border-stone-200 text-sm">
                        <option value="">Choose…</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </label>

                    <div>
                      <label htmlFor="incident-agency" className="flex items-center gap-2 text-stone-500 mb-1">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">corporate_fare</span>
                        Agency you worked with
                      </label>
                      {myAgencies === null ? (
                        <p className="text-stone-500">Loading your agencies…</p>
                      ) : myAgencies.length === 0 ? (
                        <p className="text-stone-600 bg-stone-50 border border-stone-200 rounded-xl p-3">
                          You can report an agency once you have saved a contract with it. This keeps reports genuine.{' '}
                          <Link href="/records" className="font-semibold text-emerald-800 underline">Add your contract</Link>
                        </p>
                      ) : (
                        <select
                          id="incident-agency"
                          value={draft.agencyId || ''}
                          onChange={(e) => pickAgency(e.target.value)}
                          className="w-full rounded-xl border-stone-200 text-sm"
                        >
                          <option value="">Choose…</option>
                          {myAgencies.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column (Desktop) */}
              <div className="md:w-[45%] flex flex-col gap-3.5 md:gap-5 pt-1 md:pt-0">
                
                {/* Who Will Receive It Section */}
                <section className="bg-stone-200/40 md:bg-white md:border border-stone-200/50 rounded-2xl md:rounded-3xl p-3.5 md:p-6 space-y-2.5 md:space-y-4">
                  <h2 className="text-[14px] md:text-lg font-bold text-slate-800 px-0.5 mb-1 md:mb-3">{t.whoWillReceive}</h2>
                  
                  <div className="bg-white md:bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-xs md:shadow-none md:border border-slate-100">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">support_agent</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] md:text-base font-semibold text-slate-800 leading-tight">{t.supportDesk}</h3>
                        <p className="text-[11px] md:text-sm text-stone-500 font-normal mt-0.5">{t.supportDeskDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] md:text-sm font-medium text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] md:text-[20px]">verified</span>
                      <span className="hidden sm:inline">{t.trusted}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white md:bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-xs md:shadow-none md:border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5 md:gap-3.5">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-[#183B32] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">check</span>
                      </div>
                      <div>
                        <p className="text-[13px] md:text-base font-semibold text-slate-800 leading-snug">{t.useWorkerCodeOnly}</p>
                        <p className="text-[10.5px] md:text-sm text-stone-500 font-normal leading-tight mt-0.5 md:mt-1 max-w-[200px] md:max-w-xs">{t.noNameOrAddress}</p>
                      </div>
                    </div>
                    <button aria-label="Toggle worker code details" className="text-stone-400 pl-1 p-2" type="button">
                      <span className="material-symbols-outlined text-[20px] md:text-[24px]">expand_more</span>
                    </button>
                  </div>
                </section>

                <label className="bg-[#FDF6E9] border border-[#D9984E]/80 rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-start gap-3 shadow-xs cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 rounded-md text-[#183B32] focus:ring-[#183B32] shrink-0 mt-0.5" />
                  <span className="text-[12px] md:text-sm text-slate-800 font-normal leading-snug">
                    {t.consentSend}
                  </span>
                </label>

                {message && (
                  <p
                    role={message.type === 'error' ? 'alert' : 'status'}
                    className={`text-xs md:text-sm rounded-xl p-3 border ${message.type === 'error' ? 'text-red-700 bg-red-50 border-red-100' : 'text-emerald-900 bg-emerald-50 border-emerald-100'}`}
                  >
                    {message.text}
                  </p>
                )}

                <section className="bg-[#E2EFE7]/70 md:bg-[#E2EFE7]/50 rounded-2xl md:rounded-3xl p-3 md:p-5 flex items-start gap-2.5 md:gap-3 text-emerald-950 mt-auto md:mt-2">
                  <span className="material-symbols-outlined text-[18px] md:text-[22px] text-emerald-900 mt-0.5 md:mt-0 shrink-0">info</span>
                  <p className="text-[11px] md:text-sm leading-snug text-emerald-900/90 font-normal">
                    {t.withdrawConsent}
                  </p>
                </section>

                <section className="grid grid-cols-2 gap-3 pt-1 md:pt-4">
                  <button type="button" onClick={saveDraft} disabled={status === 'sent'} className="disabled:opacity-50 w-full bg-white border border-stone-300 text-slate-800 font-semibold py-3 md:py-4 px-3 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-[13px] md:text-base shadow-xs active:bg-stone-50 hover:bg-stone-50 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[22px] text-stone-600">save</span>
                    <span>{t.saveDraft}</span>
                  </button>
                  <button type="button" onClick={send} disabled={status === 'sending' || status === 'sent'} className="disabled:opacity-60 w-full bg-[#183B32] text-white font-semibold py-3 md:py-4 px-3 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-[13px] md:text-base shadow-md active:bg-[#122D26] hover:bg-[#122D26] transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[22px]">send</span>
                    <span>{status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : t.consentAndSend}</span>
                  </button>
                </section>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 bg-white border-t border-stone-200/60 px-4 py-2 pb-5 flex justify-between items-center z-20 shrink-0">
          <Link className="flex flex-col items-center justify-center w-16 text-stone-500 hover:text-stone-800 transition-colors" href="/home">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] mt-1 font-medium">{t.home}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center w-16 text-stone-500 hover:text-stone-800 transition-colors" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] mt-1 font-medium">{t.trust}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center w-16 text-stone-500 hover:text-stone-800 transition-colors" href="/records">
            <span className="material-symbols-outlined text-[24px]">folder</span>
            <span className="text-[10px] mt-1 font-medium">{t.recordsTitle}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center bg-[#E2EFE7]/70 text-[#183B32] rounded-2xl px-3 py-1.5 transition-colors" href="/safety">
            <span className="material-symbols-outlined text-[24px] filled">shield</span>
            <span className="text-[10.5px] mt-0.5 font-bold">{t.safety}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
