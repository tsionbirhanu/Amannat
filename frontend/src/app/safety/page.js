'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { safety, workers, checkInNow, triggerPanic } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

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
    <div className="min-h-screen bg-[#1e1e1e] md:bg-[#F9F8F3] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#F9F8F3] flex flex-col overflow-hidden relative">
        
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
            <Link className="flex items-center space-x-2 text-[#1D453D] font-semibold" href="/safety">
              <div className="w-8 h-8 rounded-full bg-[#E5EFE9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-[#1D453D]">shield</span>
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
        <header className="md:hidden w-full pt-3 px-7 flex justify-between items-center z-20 shrink-0 text-gray-900 font-semibold select-none">
          <span className="text-[14px] tracking-tight">9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[14px] fill-current">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <div className="w-6 h-3 border border-gray-900 rounded-[4px] p-0.5 flex items-center relative">
              <div className="h-full w-full bg-gray-900 rounded-[1.5px]"></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-12 pt-1 md:pt-10 pb-24 md:pb-12 w-full flex justify-center">
          
          <div className="w-full max-w-5xl h-full flex flex-col">
            
            {/* Header Section */}
            <section className="flex items-center justify-between mt-1 mb-2 md:mb-8 shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-[#1D453D] flex items-center justify-center text-white shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[24px] md:text-[32px] text-emerald-300">verified</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{t.safetyHub}</h1>
                  <div className="flex items-center space-x-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-600 inline-block"></span>
                    <span className="text-xs md:text-sm text-[#6F7775]">{t.savedOnDevice}</span>
                  </div>
                </div>
              </div>
              <Link href="/home" className="md:hidden bg-[#AF443E] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>{t.exit}</span>
              </Link>
            </section>

            {/* Desktop 2-Column Container */}
            <div className="md:flex md:gap-10 mt-1 md:mt-2">
              
              {/* Left Column */}
              <div className="md:w-1/2 flex flex-col gap-3.5 md:gap-6 mb-3.5 md:mb-0">
                
                {message && (
                  <p
                    role={message.type === 'error' ? 'alert' : 'status'}
                    className={`text-xs md:text-sm rounded-xl p-3 border ${message.type === 'error' ? 'text-red-700 bg-red-50 border-red-100' : 'text-emerald-900 bg-emerald-50 border-emerald-100'}`}
                  >
                    {message.text}
                  </p>
                )}

                {/* Check In Card */}
                <section className="bg-[#EBF5EF] rounded-2xl md:rounded-3xl p-3.5 md:p-6 flex items-center justify-between border border-[#E0ECE5]">
                  <div className="flex items-center space-x-3.5 md:space-x-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#1D453D] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] md:text-[28px] text-emerald-300">verified</span>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-xl font-semibold text-emerald-950">{lastConfirmed ? t.checkedInSafe : 'No check-in yet'}</h2>
                      <p className="text-[11px] md:text-sm text-[#6F7775] mt-0.5 md:mt-1 leading-snug">
                        {lastConfirmed ? `${formatTime(lastConfirmed.scheduled_at)}` : 'Tap “Check in” to let guardians know you are safe'}
                        {nextPending ? ` • Next check-in ${formatTime(nextPending.scheduled_at)}` : ''}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Urgent Help Card */}
                <section
                  role="button"
                  tabIndex={0}
                  aria-label="Press and hold for 3 seconds to send an urgent alert"
                  onPointerDown={startHold}
                  onPointerUp={cancelHold}
                  onPointerLeave={cancelHold}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`bg-[#FDF1F0] border border-[#F0C7C4] rounded-2xl md:rounded-3xl p-3.5 md:p-6 flex items-center space-x-3.5 md:space-x-5 cursor-pointer select-none touch-none transition-transform ${holding ? 'scale-[0.98] ring-2 ring-[#B13B35]' : ''}`}
                >
                  <div className="w-[52px] h-[52px] md:w-20 md:h-20 rounded-full bg-[#B13B35] flex items-center justify-center shrink-0 shadow-inner relative group">
                    <span className="material-symbols-outlined text-[24px] md:text-[36px] text-white">front_hand</span>
                    <div className="absolute inset-0 rounded-full ring-4 ring-[#B13B35]/30 animate-ping group-active:animate-none hidden md:block"></div>
                  </div>
                  <div>
                    <h2 className="text-sm md:text-xl font-bold text-red-900 leading-tight">{holding ? 'Keep holding…' : t.urgentEmergency}</h2>
                    <p className="text-[11px] md:text-sm text-gray-700 mt-1 md:mt-2 leading-snug max-w-[220px] md:max-w-sm">{t.urgentEmergencyDesc}</p>
                  </div>
                </section>

                {confirmPanic && (
                  <section role="alertdialog" aria-label="Confirm urgent alert" className="bg-white border-2 border-[#B13B35] rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-3">
                    <h2 className="text-sm md:text-lg font-bold text-red-900">Send urgent alert?</h2>
                    <p className="text-xs md:text-sm text-gray-700">
                      {guardians.length
                        ? `These people will get an SMS: ${guardians.map((g) => g.name).join(', ')}.`
                        : 'You have no guardians yet. The alert will be recorded, but nobody will get an SMS. Add a guardian below.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button type="button" onClick={() => setConfirmPanic(false)} className="py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800">Cancel</button>
                      <button type="button" disabled={busy} onClick={sendPanic} className="py-2.5 rounded-xl bg-[#B13B35] text-white text-sm font-bold disabled:opacity-60">{busy ? 'Sending…' : 'Send alert'}</button>
                    </div>
                  </section>
                )}

                {/* Action Buttons Section */}
                <section className="grid grid-cols-2 gap-2.5 md:gap-4 pt-0.5 md:pt-2">
                  <button type="button" onClick={handleCheckIn} disabled={busy} className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl py-3 md:py-5 px-3 flex items-center justify-center space-x-2 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-60">
                    <span className="material-symbols-outlined text-[18px] md:text-[24px] text-emerald-900">verified</span>
                    <span className="text-xs md:text-base font-bold text-gray-900">{busy ? 'Saving…' : t.checkIn}</span>
                  </button>
                  <Link href="/assistant" className="bg-[#1D453D] hover:bg-[#143831] text-white rounded-2xl md:rounded-3xl py-3 md:py-5 px-3 flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined text-[18px] md:text-[24px]">shield</span>
                    <span className="text-xs md:text-base font-bold">{t.reportSafely}</span>
                  </Link>
                </section>

                <footer className="bg-[#EBF5EF] rounded-2xl md:rounded-3xl p-3 md:p-5 flex items-start space-x-2.5 md:space-x-3 border border-[#E0ECE5] mt-auto hidden md:flex">
                  <div className="pt-0.5 text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">lock</span>
                  </div>
                  <p className="text-[11px] md:text-sm text-emerald-950 leading-snug">
                    {t.hotlineOffline}
                  </p>
                </footer>
              </div>

              {/* Right Column */}
              <div className="md:w-1/2 flex flex-col gap-3.5 md:gap-6 pt-1 md:pt-0">
                
                {/* Guardians Section */}
                <section className="space-y-2 md:space-y-4">
                  <div className="flex items-center justify-between px-0.5">
                    <h3 className="text-sm md:text-lg font-bold text-gray-900">{t.myGuardians}</h3>
                    <button type="button" onClick={() => setShowGuardianForm((v) => !v)} className="text-xs md:text-sm font-semibold text-emerald-800 hover:underline">
                      {showGuardianForm ? 'Cancel' : guardians.length >= 5 ? '' : 'Add'}
                    </button>
                  </div>

                  {showGuardianForm && (
                    <form onSubmit={addGuardian} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 border border-gray-100 shadow-sm grid grid-cols-2 gap-2">
                      <input className="col-span-2 rounded-xl border-gray-200 text-sm" placeholder="Name" value={guardianForm.name} onChange={(e) => setGuardianForm({ ...guardianForm, name: e.target.value })} />
                      <input className="rounded-xl border-gray-200 text-sm" placeholder="Relation (e.g. Sister)" value={guardianForm.relation} onChange={(e) => setGuardianForm({ ...guardianForm, relation: e.target.value })} />
                      <input className="rounded-xl border-gray-200 text-sm" type="tel" placeholder="Phone" value={guardianForm.phone} onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })} />
                      <select className="rounded-xl border-gray-200 text-sm" value={guardianForm.channel} onChange={(e) => setGuardianForm({ ...guardianForm, channel: e.target.value })}>
                        <option value="sms">SMS</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="call">Call</option>
                      </select>
                      <button type="submit" disabled={busy} className="rounded-xl bg-[#1D453D] text-white text-sm font-semibold disabled:opacity-60">Save</button>
                    </form>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                    {guardians.length === 0 && !showGuardianForm && (
                      <p className="col-span-2 text-xs md:text-sm text-[#6F7775] px-0.5">No guardians yet. Add someone you trust to be alerted in an emergency.</p>
                    )}
                    {guardians.map((g) => (
                      <div key={g.id} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
                        <div className="flex items-center space-x-2.5 md:space-x-3.5 min-w-0">
                          <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#E5F0EC] text-emerald-900 text-xs md:text-sm font-semibold flex items-center justify-center shrink-0">{initials(g.name)}</div>
                          <div className="min-w-0 pr-1">
                            <p className="text-xs md:text-base font-bold text-gray-900 truncate">{g.name}</p>
                            <p className="text-[10px] md:text-sm text-[#6F7775] truncate leading-tight mt-0.5">{g.relation} • {g.channel}</p>
                          </div>
                        </div>
                        <a href={`sms:${g.phone}`} aria-label={`Message ${g.name}`} className="text-gray-400 hover:text-emerald-700 shrink-0 p-1">
                          <span className="material-symbols-outlined text-[18px] md:text-[22px]">chat_bubble</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Hotline Directory Section */}
                <section className="bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-6 border border-gray-100 shadow-sm space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between pb-0.5 md:pb-2">
                    <h3 className="text-sm md:text-lg font-bold text-gray-900">{t.hotlineDirectory}</h3>
                    <select
                      aria-label="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="text-xs md:text-sm font-semibold text-emerald-800 border-0 bg-transparent py-0 pr-7 focus:ring-0"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {hotlines.length === 0 && (
                    <p className="text-xs md:text-sm text-[#6F7775]">No hotlines listed for {country}.</p>
                  )}
                  {hotlines.map((number, i) => (
                    <div key={number}>
                      {i > 0 && <div className="h-px bg-gray-100 w-full mb-3 md:mb-4"></div>}
                      <a href={`tel:${number}`} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#DDECE4] flex items-center justify-center text-emerald-900 shrink-0 group-hover:bg-[#d0e5da] transition-colors">
                            <span className="material-symbols-outlined text-[16px] md:text-[22px]">call</span>
                          </div>
                          <div>
                            <p className="text-xs md:text-base font-semibold text-gray-900 leading-tight">{number}</p>
                            <p className="text-[10px] md:text-sm text-[#6F7775] leading-tight mt-0.5 md:mt-1">Emergency / worker support • {country}</p>
                          </div>
                        </div>
                        <span className="text-[11px] md:text-sm font-medium text-emerald-800 shrink-0 pl-1">Call</span>
                      </a>
                    </div>
                  ))}
                </section>

                <footer className="bg-[#EBF5EF] rounded-2xl p-3 flex items-start space-x-2.5 border border-[#E0ECE5] md:hidden mt-2">
                  <div className="pt-0.5 text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </div>
                  <p className="text-[11px] text-emerald-950 leading-snug">
                    {t.hotlineOffline}
                  </p>
                </footer>

              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-5 flex justify-between items-center z-30">
          <Link className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-900 transition-colors" href="/home">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] font-medium">{t.home}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-900 transition-colors" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] font-medium">{t.trust}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-900 transition-colors" href="/records">
            <span className="material-symbols-outlined text-[24px]">folder</span>
            <span className="text-[10px] font-medium">{t.recordsTitle}</span>
          </Link>
          <Link className="flex flex-col items-center justify-center px-3.5 py-1 rounded-2xl bg-[#E5EFE9] text-[#1D453D] transition-all" href="/safety">
            <span className="material-symbols-outlined text-[24px] filled">shield</span>
            <span className="text-[10px] font-bold">{t.safety}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
