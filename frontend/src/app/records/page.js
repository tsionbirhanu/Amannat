'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { workers, agency as agencyApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Button, Card, Field, Icon, Notice, PageHeader, SectionTitle, inputClass, textareaClass } from '@/components/ui';

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

  const options = [
    { id: 'camera', icon: 'photo_camera', label: t.takePhotos },
    { id: 'upload', icon: 'upload_file', label: t.choosePdf },
    { id: 'voice', icon: 'edit_note', label: 'Type the terms' },
  ];

  return (
    <AppShell>
      <PageHeader title={t.addYourContract} subtitle={t.savePromised} />

      {/* Hidden native pickers: the camera one opens the rear camera on phones */}
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" multiple className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      <input ref={fileInput} type="file" accept="image/*,application/pdf" multiple className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

      {/* Step 1: pages */}
      <Card>
        <SectionTitle>1. Contract pages <span className="font-normal text-stone-500">(optional)</span></SectionTitle>
        <div role="radiogroup" aria-label="How to add your contract" className="grid grid-cols-3 gap-2">
          {options.map((o) => {
            const selected = selectedOption === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSelectedOption(o.id)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3.5 text-sm font-semibold text-center transition-colors ${
                  selected ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600' : 'border-sand-200 text-stone-700 hover:bg-sand-50'
                }`}
              >
                <Icon name={o.icon} filled={selected} className="text-[24px]" />
                <span className="leading-tight">{o.label}</span>
              </button>
            );
          })}
        </div>

        {selectedOption !== 'voice' && (
          <div className="mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {pages.map((pg, idx) => (
                <div key={pg.url} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-sand-100 border border-sand-200">
                  {pg.file.type === 'application/pdf' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 p-2 text-center">
                      <Icon name="picture_as_pdf" className="text-[30px]" />
                      <span className="text-[12px] truncate w-full mt-1">{pg.file.name}</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pg.url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  )}
                  <span className="absolute bottom-1.5 left-1.5 text-[12px] font-bold bg-stone-900/70 text-white px-1.5 rounded">{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removePage(idx)}
                    aria-label={`Remove page ${idx + 1}`}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-stone-900/70 text-white flex items-center justify-center"
                  >
                    <Icon name="close" className="text-[16px]" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => (selectedOption === 'camera' ? cameraInput : fileInput).current?.click()}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-1 text-sm font-semibold text-stone-600 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50/50"
              >
                <Icon name={selectedOption === 'camera' ? 'photo_camera' : 'add'} className="text-[28px]" />
                {selectedOption === 'camera' ? (pages.length ? 'Next page' : 'Take photo') : 'Add file'}
              </button>
            </div>
            <p className="text-sm text-stone-500 mt-3">
              {selectedOption === 'camera' ? t.keepCorners : 'Photos or PDF, up to 10 MB each.'}
            </p>
          </div>
        )}
      </Card>

      {/* Step 2: terms */}
      <Card className="mt-4">
        <SectionTitle>2. What was promised</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Monthly wage" htmlFor="wage">
            <input id="wage" type="number" min="0" inputMode="decimal" value={form.wage} onChange={update('wage')} placeholder="1200" className={inputClass} />
          </Field>
          <Field label="Hours per day" htmlFor="hours">
            <input id="hours" type="number" min="0" max="24" value={form.hours} onChange={update('hours')} placeholder="8" className={inputClass} />
          </Field>
          <Field label="Start date" htmlFor="start" className="col-span-2 sm:col-span-1">
            <input id="start" type="date" value={form.start_date} onChange={update('start_date')} className={inputClass} />
          </Field>
          <Field label="Agency (optional)" htmlFor="agency-search" className="relative col-span-2 sm:col-span-1">
            <input id="agency-search" value={form.agencyName} onChange={(e) => searchAgency(e.target.value)} placeholder="Search by name" className={inputClass} autoComplete="off" />
            {agencyId && <Icon name="check_circle" filled className="absolute right-3 top-[2.65rem] text-[20px] text-brand-600" />}
            {agencyMatches.length > 0 && !agencyId && (
              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-sand-200 rounded-xl shadow-lg overflow-hidden">
                {agencyMatches.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => pickAgency(a)} className="w-full text-left px-4 py-3 text-[15px] hover:bg-sand-50">{a.name}</button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
          <Field label="Contract terms" htmlFor="terms" hint="Include the weekly rest day, how the contract can end, and who keeps your passport." className="col-span-2">
            <textarea id="terms" value={form.terms} onChange={update('terms')} rows={5} placeholder="Example: Housekeeping. One rest day per week. 30 days notice to end the contract." className={textareaClass} />
          </Field>
        </div>
      </Card>

      {error && <Notice tone="error" className="mt-4">{error}</Notice>}
      {flags && !error && (
        <Notice tone="warning" className="mt-4">
          <p className="font-semibold">Saved. Please check these points with the agency:</p>
          <ul className="list-disc pl-5 mt-1">
            {flags.map((f) => <li key={f}>{FLAG_LABELS[f] || f}</li>)}
          </ul>
          <Link href="/review" className="inline-block font-semibold underline mt-2">Go to my record</Link>
        </Notice>
      )}

      <Button
        className="w-full mt-5"
        icon="save"
        onClick={saveContract}
        disabled={saving || (savedId && !pages.length && !!flags)}
      >
        {saving ? 'Saving…' : pages.length ? `Save contract + ${pages.length} page${pages.length === 1 ? '' : 's'}` : 'Save contract'}
      </Button>
    </AppShell>
  );
}
