'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { workers, agency as agencyApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

const FLAG_LABELS = {
  missing_wage: 'No wage amount',
  missing_rest_day_clause: 'No weekly rest day mentioned',
  missing_termination_clause: 'No termination terms mentioned',
};

export default function RecordsPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const router = useRouter();
  const ready = useRequireAuth();
  const [selectedOption, setSelectedOption] = useState('camera');
  const [form, setForm] = useState({ wage: '', hours: '', start_date: '', terms: '', agencyName: '' });
  const [agencyMatches, setAgencyMatches] = useState([]);
  const [agencyId, setAgencyId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [flags, setFlags] = useState(null);
  const [pages, setPages] = useState([]); // [{ file, url }]
  const [savedId, setSavedId] = useState(null);
  const cameraInput = useRef(null);
  const fileInput = useRef(null);
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  // Free thumbnail object URLs when leaving the page
  useEffect(() => () => pagesRef.current.forEach((pg) => URL.revokeObjectURL(pg.url)), []);

  const MAX_BYTES = 10 * 1024 * 1024;
  const addFiles = (fileList) => {
    const accepted = [];
    for (const file of fileList) {
      if (!/^image\/|^application\/pdf$/.test(file.type)) {
        setError(`"${file.name}" is not a photo or PDF.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 10 MB.`);
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
    }
    if (accepted.length) setPages((prev) => [...prev, ...accepted]);
  };

  const removePage = (idx) => {
    setPages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const searchAgency = async (name) => {
    setForm((f) => ({ ...f, agencyName: name }));
    setAgencyId(null);
    if (name.trim().length < 2) return setAgencyMatches([]);
    try {
      setAgencyMatches(await agencyApi.search(name.trim(), { limit: 5 }));
    } catch {
      setAgencyMatches([]);
    }
  };

  const pickAgency = (a) => {
    setAgencyId(a.id);
    setForm((f) => ({ ...f, agencyName: a.name }));
    setAgencyMatches([]);
  };

  const saveContract = async () => {
    setError('');
    if (!form.wage || !form.start_date || !form.terms.trim()) {
      return setError('Please fill in the monthly wage, start date and the contract terms.');
    }
    setSaving(true);
    try {
      // 1. Save the terms (once — a retry after a failed upload reuses the same contract)
      let contractId = savedId;
      let resultFlags = flags || [];
      if (!contractId) {
        const res = await workers.addContract({
          wage: Number(form.wage),
          hours: form.hours ? Number(form.hours) : null,
          terms: form.terms.trim(),
          start_date: new Date(form.start_date).toISOString(),
          agency_id: agencyId,
        });
        contractId = res.contract.id;
        resultFlags = res.flags;
        setSavedId(contractId);
      }
      // 2. Attach the photos / PDFs
      if (pages.length) {
        try {
          await workers.uploadDocuments(contractId, pages.map((pg) => pg.file));
          pages.forEach((pg) => URL.revokeObjectURL(pg.url));
          setPages([]);
        } catch (err) {
          setFlags(resultFlags);
          return setError(`Your terms were saved, but the pages did not upload: ${err.message} Tap Save again to retry.`);
        }
      }
      if (resultFlags.length) setFlags(resultFlags);
      else router.push('/review');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#F9F8F3] flex flex-col items-center font-sans text-slate-800">
      <main className="w-full h-[100dvh] md:h-screen bg-[#F9F8F3] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-4 justify-between items-center z-10 shrink-0 w-full">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>{t.home}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/trust">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>{t.trust}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-[#163E38] font-semibold" href="/records">
              <div className="w-8 h-8 rounded-full bg-[#EBF3EE] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-[#163E38]">folder</span>
              </div>
              <span>{t.recordsTitle}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/safety">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>{t.safety}</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#FAF2F2] hover:bg-rose-50 border border-[#F3DFDF] transition-colors text-slate-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{t.exitDisguise}</span>
          </button>
        </nav>

        {/* iOS StatusBar (Hidden on Desktop) */}
        <header className="md:hidden w-full pt-3 px-7 flex justify-between items-center z-30 select-none shrink-0" data-purpose="status-bar">
          <span className="text-[14px] font-semibold tracking-tight text-slate-900">9:41</span>
          <div className="flex items-center space-x-2 text-slate-900">
            <svg className="w-4 h-3.5 fill-current" viewBox="0 0 17 12">
              <path d="M1 9.5h2v2.5H1v-2.5zm4-3h2v5.5H5V6.5zm4-3h2v8.5H9V3.5zm4-3h2v11.5h-2V.5z"></path>
            </svg>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 12">
              <path d="M8 2.5a11.9 11.9 0 0 1 7.2 2.5l-1.3 1.3A10.1 10.1 0 0 0 8 4.5a10 10 0 0 0-5.9 1.8L.8 5A11.9 11.9 0 0 1 8 2.5zm0 4a7.9 7.9 0 0 1 4.4 1.3l-1.3 1.3A6.1 6.1 0 0 0 8 8a6 6 0 0 0-3.1 1.1L3.6 7.8A7.9 7.9 0 0 1 8 6.5zm0 4a3.8 3.8 0 0 1 1.9.5l-1.9 2-1.9-2a3.8 3.8 0 0 1 1.9-.5z"></path>
            </svg>
            <div className="w-6 h-3 border border-slate-900 rounded-sm p-0.5 flex items-center">
              <div className="h-full bg-slate-900 rounded-[2px] w-[85%]"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 md:px-12 pt-3 md:pt-10 pb-24 w-full">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            
            {/* Header Section */}
            <section className="flex items-center justify-between mb-4 md:mb-8" data-purpose="top-navigation">
              <div className="flex items-center space-x-3 md:space-x-4">
                <Link href="/home" aria-label="Go back" className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition active:scale-95">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px] text-slate-700">arrow_back</span>
                </Link>
                <div className="flex flex-col">
                  <h1 className="text-base md:text-2xl font-semibold text-slate-900 leading-tight">{t.addYourContract}</h1>
                  <div className="flex items-center space-x-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#C26D28]"></span>
                    <span className="text-[11px] md:text-sm text-slate-500 font-medium">{t.offlineSync}</span>
                  </div>
                </div>
              </div>
              <Link href="/home" className="md:hidden px-3.5 py-1.5 bg-[#FAF2F2] hover:bg-rose-50 text-slate-700 text-xs font-medium rounded-full flex items-center space-x-1.5 border border-[#F3DFDF] transition active:scale-95">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>{t.exit}</span>
              </Link>
            </section>

            {/* Desktop 2-Column Layout Container */}
            <div className="md:flex md:gap-10 md:h-full md:pb-12">
              
              {/* Left Column (Desktop) / Top Section (Mobile) */}
              <div className="md:w-1/2 flex flex-col">
                <section className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">{t.savePromised}</h2>
                  <p className="text-xs md:text-base text-slate-600 mt-1 md:mt-2 leading-relaxed max-w-md">
                    {t.savePromisedDesc}
                  </p>
                </section>

                <section className="space-y-2 md:space-y-4 mb-3 md:mb-6">
                  {/* Option 1: Take Photos */}
                  <button 
                    onClick={() => setSelectedOption('camera')}
                    className={`w-full text-left rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-sm transition active:scale-[0.99]
                      ${selectedOption === 'camera' ? 'bg-[#EBF3EE] border-[1.5px] md:border-2 border-[#163E38]' : 'bg-white border border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0
                        ${selectedOption === 'camera' ? 'bg-[#143B35] text-white' : 'bg-[#F4F3ED] text-slate-700'}
                      `}>
                        <span className="material-symbols-outlined text-[20px] md:text-[28px]">camera_alt</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] md:text-base font-semibold text-slate-900 leading-tight">{t.takePhotos}</h3>
                        <p className="text-[11px] md:text-sm text-slate-600 mt-0.5 md:mt-1 leading-snug">{t.takePhotosDesc}</p>
                      </div>
                    </div>
                    {selectedOption === 'camera' ? (
                      <div className="shrink-0 pl-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border md:border-2 border-teal-800 flex items-center justify-center text-teal-800">
                          <span className="material-symbols-outlined text-[14px] md:text-[18px] font-bold">check</span>
                        </div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0 ml-2">chevron_right</span>
                    )}
                  </button>

                  {/* Option 2: Tell Voxide terms */}
                  <button 
                    onClick={() => setSelectedOption('voice')}
                    className={`w-full text-left rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs transition active:scale-[0.99]
                      ${selectedOption === 'voice' ? 'bg-[#EBF3EE] border-[1.5px] md:border-2 border-[#163E38]' : 'bg-white border border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0
                        ${selectedOption === 'voice' ? 'bg-[#143B35] text-white' : 'bg-[#F4F3ED] text-slate-700'}
                      `}>
                        <span className="material-symbols-outlined text-[20px] md:text-[28px]">mic</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] md:text-base font-semibold text-slate-900 leading-tight">{t.tellVoxide}</h3>
                        <p className="text-[11px] md:text-sm text-slate-500 mt-0.5 md:mt-1 leading-snug">{t.tellVoxideDesc}</p>
                      </div>
                    </div>
                    {selectedOption === 'voice' ? (
                      <div className="shrink-0 pl-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border md:border-2 border-teal-800 flex items-center justify-center text-teal-800">
                          <span className="material-symbols-outlined text-[14px] md:text-[18px] font-bold">check</span>
                        </div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0 ml-2">chevron_right</span>
                    )}
                  </button>

                  {/* Option 3: Choose PDF */}
                  <button 
                    onClick={() => setSelectedOption('upload')}
                    className={`w-full text-left rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs transition active:scale-[0.99]
                      ${selectedOption === 'upload' ? 'bg-[#EBF3EE] border-[1.5px] md:border-2 border-[#163E38]' : 'bg-white border border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0
                        ${selectedOption === 'upload' ? 'bg-[#143B35] text-white' : 'bg-[#F4F3ED] text-slate-700'}
                      `}>
                        <span className="material-symbols-outlined text-[20px] md:text-[28px]">upload_file</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] md:text-base font-semibold text-slate-900 leading-tight">{t.choosePdf}</h3>
                        <p className="text-[11px] md:text-sm text-slate-500 mt-0.5 md:mt-1 leading-snug">{t.choosePdfDesc}</p>
                      </div>
                    </div>
                    {selectedOption === 'upload' ? (
                      <div className="shrink-0 pl-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border md:border-2 border-teal-800 flex items-center justify-center text-teal-800">
                          <span className="material-symbols-outlined text-[14px] md:text-[18px] font-bold">check</span>
                        </div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0 ml-2">chevron_right</span>
                    )}
                  </button>
                </section>

                <section className="bg-[#EBF3EE] rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-start space-x-2.5 md:space-x-3 mb-3 border border-emerald-900/5 mt-auto">
                  <div className="text-[#2D5A52] mt-0.5 shrink-0">
                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">lock</span>
                  </div>
                  <p className="text-[10.5px] md:text-[13px] leading-tight md:leading-snug text-slate-600 font-normal">
                    {t.pagesEncrypted}
                  </p>
                </section>
              </div>

              {/* Right Column (Desktop) / Capture + Terms (Mobile) */}
              <div className="md:w-1/2 flex flex-col md:pl-4 gap-3">

                {/* Hidden native pickers: the camera one opens the rear camera on phones */}
                <input ref={cameraInput} type="file" accept="image/*" capture="environment" multiple className="hidden"
                  onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                <input ref={fileInput} type="file" accept="image/*,application/pdf" multiple className="hidden"
                  onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

                {selectedOption !== 'voice' && (
                  <section className={`w-full rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm ${selectedOption === 'camera' ? 'bg-[#143B35] text-white' : 'bg-[#F4F3ED] border-2 border-dashed border-slate-300 text-slate-700'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] md:text-sm font-medium ${selectedOption === 'camera' ? 'bg-white/20' : 'bg-white'}`}>
                        <span className="material-symbols-outlined text-[14px] md:text-[18px]">content_copy</span>
                        <span>{pages.length ? `${pages.length} page${pages.length === 1 ? '' : 's'} added` : 'No pages yet'}</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] md:text-sm font-medium ${selectedOption === 'camera' ? 'bg-white/20' : 'bg-white'}`}>
                        <span className="material-symbols-outlined text-[14px] md:text-[18px]">lock</span>
                        <span>Private</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {pages.map((pg, idx) => (
                        <div key={pg.url} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/90 border border-slate-200">
                          {pg.file.type === 'application/pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-1 text-center">
                              <span className="material-symbols-outlined text-[28px]">picture_as_pdf</span>
                              <span className="text-[10px] truncate w-full">{pg.file.name}</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pg.url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                          <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/60 text-white px-1.5 rounded">{idx + 1}</span>
                          <button type="button" onClick={() => removePage(idx)} aria-label={`Remove page ${idx + 1}`}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => (selectedOption === 'camera' ? cameraInput : fileInput).current?.click()}
                        className={`aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] md:text-xs font-medium ${selectedOption === 'camera' ? 'border-white/40 text-white hover:bg-white/10' : 'border-slate-300 text-slate-600 hover:bg-white'}`}>
                        <span className="material-symbols-outlined text-[24px]">{selectedOption === 'camera' ? 'photo_camera' : 'upload_file'}</span>
                        <span>{selectedOption === 'camera' ? (pages.length ? 'Next page' : 'Take photo') : 'Add file'}</span>
                      </button>
                    </div>
                    <p className={`text-[11px] md:text-sm mt-3 ${selectedOption === 'camera' ? 'text-emerald-200/90' : 'text-slate-500'}`}>
                      {selectedOption === 'camera' ? `${t.keepCorners} • ${t.goodLight}` : 'Photos or PDF, up to 10 MB each.'}
                    </p>
                  </section>
                )}

                <section className="w-full rounded-2xl md:rounded-3xl bg-white border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col gap-3 flex-1">
                  <h3 className="text-sm md:text-xl font-semibold text-slate-900">What was promised</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="text-xs md:text-sm text-slate-600">
                      Monthly wage
                      <input type="number" min="0" inputMode="decimal" value={form.wage} onChange={update('wage')} placeholder="1200" className="mt-1 w-full rounded-xl border-slate-200 text-sm" />
                    </label>
                    <label className="text-xs md:text-sm text-slate-600">
                      Hours per day
                      <input type="number" min="0" max="24" value={form.hours} onChange={update('hours')} placeholder="8" className="mt-1 w-full rounded-xl border-slate-200 text-sm" />
                    </label>
                    <label className="text-xs md:text-sm text-slate-600">
                      Start date
                      <input type="date" value={form.start_date} onChange={update('start_date')} className="mt-1 w-full rounded-xl border-slate-200 text-sm" />
                    </label>
                    <div className="text-xs md:text-sm text-slate-600 relative">
                      <label htmlFor="agency-search">Agency (optional)</label>
                      <input id="agency-search" value={form.agencyName} onChange={(e) => searchAgency(e.target.value)} placeholder="Search name" className="mt-1 w-full rounded-xl border-slate-200 text-sm" />
                      {agencyMatches.length > 0 && !agencyId && (
                        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden">
                          {agencyMatches.map((a) => (
                            <li key={a.id}>
                              <button type="button" onClick={() => pickAgency(a)} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">{a.name}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <label className="text-xs md:text-sm text-slate-600 flex-1 flex flex-col">
                    Contract terms
                    <textarea value={form.terms} onChange={update('terms')} rows={selectedOption === 'voice' ? 5 : 3} placeholder="Role, rest day, termination, who keeps the passport…" className="mt-1 w-full flex-1 rounded-xl border-slate-200 text-sm" />
                  </label>
                  {error && <p role="alert" className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>}
                  {flags && !error && (
                    <div role="status" className="text-xs md:text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                      <p className="font-semibold">Saved. Please check these points with the agency:</p>
                      <ul className="list-disc pl-5">
                        {flags.map((f) => <li key={f}>{FLAG_LABELS[f] || f}</li>)}
                      </ul>
                      <Link href="/review" className="inline-block font-semibold underline mt-1">Go to my record</Link>
                    </div>
                  )}
                </section>

                <section>
                  <button type="button" onClick={saveContract} disabled={saving || (savedId && !pages.length && !!flags)} className="w-full bg-[#143B35] hover:bg-[#0E2A26] disabled:opacity-60 text-white font-medium text-sm md:text-lg py-3.5 md:py-5 px-4 rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 md:space-x-3 shadow-sm transition active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">save</span>
                    <span>{saving ? 'Saving…' : pages.length ? `Save contract + ${pages.length} page${pages.length === 1 ? '' : 's'}` : 'Save contract'}</span>
                  </button>
                </section>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 w-full bg-white border-t border-slate-200/80 px-6 py-2 pb-5 flex justify-between items-center z-30 select-none">
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/home">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] mt-1 font-medium">{t.home}</span>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] mt-1 font-medium">{t.trust}</span>
          </Link>
          <Link className="flex flex-col items-center" href="/records">
            <div className="px-5 py-1 bg-[#E8F1EC] rounded-2xl flex flex-col items-center text-[#143B35]">
              <span className="material-symbols-outlined text-[24px] filled">folder</span>
              <span className="text-[10px] font-semibold mt-0.5">{t.recordsTitle}</span>
            </div>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/safety">
            <span className="material-symbols-outlined text-[24px]">shield</span>
            <span className="text-[10px] mt-1 font-medium">{t.safety}</span>
          </Link>
        </nav>
      </main>

      {/* Global Style for scanning animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
