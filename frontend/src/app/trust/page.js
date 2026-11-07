'use client';
import { useEffect, useState } from 'react';
import { agency as agencyApi, isLoggedIn } from '@/lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';
import AppShell from '@/components/AppShell';
import { Badge, Button, Card, EmptyState, Icon, Notice, PageHeader, SectionTitle, inputClass } from '@/components/ui';

const CATEGORY_LABELS = {
  wage_nonpayment: 'Wages not paid',
  contract_substitution: 'Contract changed after signing',
  abuse: 'Abuse reported',
  passport_confiscation: 'Passport held by employer',
};

const LICENSE_LABELS = {
  verified: 'License verified',
  unverified: 'Not yet verified',
  flagged: 'Flagged',
};

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Convert a backend Agency (+ optional report_flags) into what this page renders.
function toView(a, flags = null) {
  const status = a.verification_status === 'verified' ? 'active' : 'warning';
  const total = flags ? flags.reduce((sum, f) => sum + f.count, 0) : null;
  const concern =
    a.verification_status === 'flagged' || total >= 3 ? 'High' : total > 0 ? 'Medium' : total === 0 ? 'Low' : '—';
  return {
    id: a.id,
    name: a.name,
    location: a.location || 'Location not listed',
    licenseNo: a.license_no,
    phone: a.phone,
    verification: a.verification_status,
    status,
    icon: status === 'active' ? 'verified' : 'corporate_fare',
    license: LICENSE_LABELS[a.verification_status] || a.verification_status,
    flag: a.verification_status === 'flagged' ? 'Flagged by reviewers' : 'Tap to see worker reports',
    stats: {
      records: total ?? '…',
      concern,
      patterns: (flags || []).map((f) => ({
        type: 'warning',
        label: CATEGORY_LABELS[f.category] || f.category,
        count: plural(f.count, 'report'),
      })),
    },
  };
}

export default function TrustRegistryPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  const [activeAgency, setActiveAgency] = useState(null);
  const [query, setQuery] = useState('');
  const [agencies, setAgencies] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Debounced search against GET /agency/search
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await agencyApi.search(q);
        if (!cancelled) {
          setAgencies(results.map((a) => toView(a)));
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const handleQueryChange = (value) => {
    setQuery(value);
    if (!value.trim()) setAgencies([]);
  };

  const openAgency = async (a) => {
    setActiveAgency(a);
    setNotice('');
    try {
      const detail = await agencyApi.get(a.id);
      setActiveAgency(toView(detail, detail.report_flags));
    } catch (err) {
      setNotice(err.message);
    }
  };

  const saveAgency = async () => {
    if (!isLoggedIn()) return setNotice('Sign in first to save agencies.');
    try {
      await agencyApi.addToShortlist(activeAgency.id);
      setNotice('Saved to your shortlist.');
    } catch (err) {
      setNotice(err.status === 409 ? 'Already in your shortlist.' : err.message);
    }
  };


  const statusBadge = (a) =>
    a.verification === 'verified' ? (
      <Badge tone="success" icon="verified">{a.license}</Badge>
    ) : a.verification === 'flagged' ? (
      <Badge tone="danger" icon="flag">{a.license}</Badge>
    ) : (
      <Badge tone="warning" icon="schedule">{a.license}</Badge>
    );
  const concernLabel = (c) => ({ High: t.concernHigh, Medium: t.concernMedium, Low: t.concernLow }[c] || c);
  const concernTone = (c) => (c === 'High' ? 'text-danger-600' : c === 'Medium' ? 'text-accent-600' : 'text-brand-700');

  return (
    <AppShell wide>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 items-start">
        {/* Search + results */}
        <div className={activeAgency ? 'hidden lg:block' : ''}>
          <PageHeader title={t.trustRegistry} subtitle={t.licenseStatus} />

          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={t.searchAgency}
              aria-label={t.searchAgency}
              className={`${inputClass} h-14 pl-12 text-base`}
            />
          </div>

          <p className="text-sm text-stone-500 mt-3 mb-3 px-1" aria-live="polite">
            {!query.trim() ? 'Search by name, license number or phone.' : searching ? 'Searching…' : `${agencies.length} ${agencies.length === 1 ? 'agency' : 'agencies'} found`}
          </p>

          {error && <Notice tone="error" className="mb-3">{error}</Notice>}

          <ul className="flex flex-col gap-2.5">
            {agencies.map((agency) => {
              const selected = activeAgency?.id === agency.id;
              return (
                <li key={agency.id}>
                  <button
                    type="button"
                    onClick={() => openAgency(agency)}
                    className={`w-full text-left p-4 rounded-2xl bg-white border transition-colors ${
                      selected ? 'border-brand-500 ring-1 ring-brand-500' : 'border-sand-200 hover:border-brand-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-stone-900">{agency.name}</p>
                        <p className="text-sm text-stone-500 mt-0.5 truncate">
                          {agency.location}{agency.licenseNo ? ` · ${agency.licenseNo}` : ''}
                        </p>
                      </div>
                      <Icon name="chevron_right" className="text-[22px] text-stone-400 rtl:rotate-180" />
                    </div>
                    <div className="mt-3">{statusBadge(agency)}</div>
                  </button>
                </li>
              );
            })}
          </ul>

          {query.trim() && !searching && agencies.length === 0 && !error && (
            <Card><EmptyState icon="search_off" title="No agency found">Check the spelling, or try the license number.</EmptyState></Card>
          )}

          <p className="flex items-start gap-2 text-sm text-stone-500 mt-5 px-1">
            <Icon name="lock" className="text-[18px] mt-px" />
            {t.searchesPrivate}
          </p>
        </div>

        {/* Details */}
        <div className={activeAgency ? '' : 'hidden lg:block'}>
          {!activeAgency ? (
            <Card className="lg:mt-[4.5rem]">
              <EmptyState icon="verified_user" title={t.selectAgency}>{t.tapAgency}</EmptyState>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveAgency(null)}
                  aria-label="Back to search"
                  className="w-10 h-10 rounded-full bg-white border border-sand-200 flex items-center justify-center"
                >
                  <Icon name="arrow_back" className="text-[20px] rtl:rotate-180" />
                </button>
                <span className="text-[15px] font-semibold text-stone-700">{t.agencyDetails}</span>
              </div>

              <Card className="lg:mt-[4.5rem]">
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">{activeAgency.name}</h2>
                <p className="text-[15px] text-stone-500 mt-1">
                  {activeAgency.location}{activeAgency.phone ? ` · ${activeAgency.phone}` : ''}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {statusBadge(activeAgency)}
                  {activeAgency.licenseNo && <Badge>License {activeAgency.licenseNo}</Badge>}
                </div>

                <dl className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl bg-sand-50 p-4">
                    <dt className="text-sm text-stone-500">Worker reports</dt>
                    <dd className="text-2xl font-bold text-stone-900 mt-1">{activeAgency.stats.records}</dd>
                  </div>
                  <div className="rounded-xl bg-sand-50 p-4">
                    <dt className="text-sm text-stone-500">{t.patternConcern}</dt>
                    <dd className={`text-2xl font-bold mt-1 ${concernTone(activeAgency.stats.concern)}`}>{concernLabel(activeAgency.stats.concern)}</dd>
                  </div>
                </dl>
              </Card>

              <Card>
                <SectionTitle>{t.anonymousWorkerPatterns}</SectionTitle>
                {activeAgency.stats.records === 0 ? (
                  <p className="text-[15px] text-stone-600">No worker reports for this agency.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {activeAgency.stats.patterns.map((pattern) => (
                      <li key={pattern.label} className="flex items-center justify-between gap-3 rounded-xl bg-accent-50 px-4 py-3">
                        <span className="flex items-center gap-2.5 text-[15px] font-medium text-stone-800">
                          <Icon name="warning" className="text-[20px] text-accent-600" />
                          {pattern.label}
                        </span>
                        <span className="text-sm font-semibold text-accent-700 shrink-0">{pattern.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-stone-500 mt-4">{t.patternsOnlyAppear}</p>
              </Card>

              {notice && <Notice tone="info">{notice}</Notice>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="secondary" icon="bookmark" onClick={saveAgency}>{t.saveAgency}</Button>
                <Button href="/records" icon="description">{t.checkAContract}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
