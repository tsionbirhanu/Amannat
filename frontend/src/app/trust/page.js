'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TrustRegistryPage() {
  const [activeAgency, setActiveAgency] = useState(null);

  const agencies = [
    {
      id: 1,
      name: 'Al Noor Recruitment PLC',
      location: 'Addis Ababa',
      destination: 'Saudi Arabia',
      status: 'active', // active, warning
      icon: 'verified',
      color: 'emerald',
      license: 'active',
      flag: 'No repeated flags',
      stats: {
        years: '4.2',
        records: '62',
        concern: 'Low',
        patterns: [
          { type: 'positive', label: 'Salary matched signed contract', count: '58 of 62' }
        ]
      }
    },
    {
      id: 2,
      name: 'Al Noor Overseas Services',
      location: 'Adama',
      destination: 'Gulf',
      status: 'warning',
      icon: 'corporate_fare',
      color: 'amber',
      license: 'Renewal pending',
      flag: '3 salary mismatch patterns',
      stats: {
        years: '2.1',
        records: '14',
        concern: 'High',
        patterns: [
          { type: 'warning', label: 'Passport held longer than agreed', count: '2 reports' },
          { type: 'warning', label: 'Unexpected placement fee', count: '1 report' }
        ]
      }
    },
    {
      id: 3,
      name: 'Noor Al Hayat Agency',
      location: 'Addis Ababa',
      destination: 'Qatar',
      status: 'active',
      icon: 'verified',
      color: 'emerald',
      license: 'active',
      flag: '1 delayed document pattern',
      stats: {
        years: '1.8',
        records: '25',
        concern: 'Medium',
        patterns: [
          { type: 'warning', label: 'Delayed document return', count: '1 report' }
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center font-sans text-stone-800">
      <main className="w-full h-[100dvh] md:h-screen bg-sand-50 flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation */}
        <nav className="hidden md:flex bg-white border-b border-sand-200 px-8 py-4 justify-between items-center z-10 shrink-0 w-full">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>Home</span>
            </Link>
            <Link className="flex items-center space-x-2 text-brand-900 font-semibold" href="/trust">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-brand-800">verified</span>
              </div>
              <span>Trust</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/records">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              <span>Records</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/safety">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>Safety</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 transition-colors text-stone-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit Disguise</span>
          </button>
        </nav>

        {/* iOS StatusBar */}
        <div className="md:hidden pt-3 px-7 pb-1 flex justify-between items-center text-xs font-semibold text-stone-800 select-none z-20 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[15px]">wifi</span>
            <span className="material-symbols-outlined text-[17px]">battery_full</span>
          </div>
        </div>

        {/* Desktop Split View / Mobile Toggle View */}
        <div className="flex-1 flex max-w-6xl mx-auto w-full overflow-hidden relative">
          
          {/* LEFT: Search Screen (Hidden on mobile if activeAgency is set) */}
          <div className={`w-full md:w-[45%] lg:w-[40%] flex flex-col h-full bg-sand-50 ${activeAgency ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-2 md:pt-8 pb-24 md:pb-8 no-scrollbar">
              
              <header className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-800 flex items-center justify-center text-emerald-200 shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-stone-900 leading-tight">Trust Registry</h2>
                    <p className="text-[11px] md:text-xs text-stone-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
                      Offline • will sync later
                    </p>
                  </div>
                </div>
                <Link href="/home" className="md:hidden flex items-center gap-1 text-xs font-semibold text-stone-700 bg-sand-100 hover:bg-sand-200 px-3 py-1.5 rounded-xl border border-sand-300 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Exit</span>
                </Link>
              </header>

              <div className="relative mb-3 md:mb-4">
                <div className="flex items-center bg-white rounded-2xl px-3.5 py-3 border border-stone-300/80 shadow-sm focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-brand-700">
                  <span className="material-symbols-outlined text-stone-400 text-[20px] mr-2.5">search</span>
                  <input className="w-full bg-transparent border-0 p-0 text-stone-900 placeholder-stone-400 font-medium text-sm focus:ring-0 outline-none" placeholder="Search agency name..." type="text" defaultValue="Al Noor"/>
                  <button aria-label="Voice search" className="ml-2 w-8 h-8 rounded-full bg-sand-100 text-stone-600 flex items-center justify-center hover:bg-sand-200 transition-colors" type="button">
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs md:text-sm text-stone-600 font-medium">3 agencies found</span>
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-sand-100 px-3 py-1 rounded-full border border-sand-300 hover:bg-sand-200 transition">
                  <span className="material-symbols-outlined text-[15px] text-stone-500">location_on</span>
                  <span>Saudi Arabia</span>
                </button>
              </div>

              <div className="bg-brand-50 border border-brand-200/80 rounded-2xl p-3 mb-3.5 flex items-start gap-2.5 text-stone-700 text-xs md:text-[13px]">
                <span className="material-symbols-outlined text-brand-700 text-[18px] shrink-0 mt-0.5">verified</span>
                <p className="leading-relaxed">
                  License status comes from public government records. Worker patterns are anonymous.
                </p>
              </div>

              <div className="space-y-3">
                {agencies.map(agency => (
                  <article 
                    key={agency.id}
                    onClick={() => setActiveAgency(agency)}
                    className={`bg-white rounded-2xl p-3.5 border shadow-sm cursor-pointer active:scale-[0.99] transition-all
                      ${activeAgency?.id === agency.id ? 'border-brand-500 ring-1 ring-brand-500' : 
                        agency.status === 'warning' ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200/90 hover:border-brand-500/50'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border
                          ${agency.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}
                        `}>
                          <span className="material-symbols-outlined text-[22px]">{agency.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{agency.name}</h3>
                          <p className="text-[11px] text-stone-500 mt-0.5">{agency.location} • {agency.destination} placements</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-stone-400 text-[18px] mt-1 hidden md:block">
                        {activeAgency?.id === agency.id ? 'chevron_right' : 'chevron_right'}
                      </span>
                      <span className="material-symbols-outlined text-stone-400 text-[18px] mt-1 md:hidden">
                        chevron_right
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border
                        ${agency.status === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}
                      `}>
                        <span className="material-symbols-outlined text-[14px]">{agency.status === 'warning' ? 'schedule' : 'account_balance'}</span>
                        {agency.license}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] border
                        ${agency.status === 'warning' ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' : 'font-medium bg-sand-100 text-stone-700 border-sand-300'}
                      `}>
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {agency.flag}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 bg-brand-50 border border-brand-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-stone-600 text-xs">
                <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">lock</span>
                <p className="leading-relaxed">
                  Searches are not linked to your worker code. No agency can see that you looked them up.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Detail Screen (Hidden on mobile if activeAgency is NULL) */}
          <div className={`w-full md:w-[55%] lg:w-[60%] flex flex-col h-full bg-sand-50 md:bg-white md:border-l md:border-stone-200 ${!activeAgency ? 'hidden md:flex' : 'flex'} relative`}>
            
            {!activeAgency ? (
              // Desktop Empty State
              <div className="hidden md:flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
                <span className="material-symbols-outlined text-6xl mb-4 text-stone-300">verified_user</span>
                <h3 className="text-xl font-bold text-stone-700 mb-2">Select an agency</h3>
                <p className="text-stone-500 max-w-sm">Tap on an agency from the search results to view their official license status and anonymous worker patterns.</p>
              </div>
            ) : (
              // Actual Detail View
              <div className="flex-1 overflow-y-auto px-4 md:px-10 pt-2 md:pt-8 pb-24 md:pb-8 no-scrollbar w-full">
                <header className="flex items-center justify-between mb-4 md:mb-8">
                  <div className="flex items-center gap-2">
                    <button aria-label="Go back to search" className="md:hidden w-8 h-8 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 flex items-center justify-center text-stone-700 transition" onClick={() => setActiveAgency(null)}>
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="ml-1 md:ml-0">
                      <h2 className="text-base md:text-2xl font-bold text-stone-900 leading-tight">Agency details</h2>
                      <p className="text-[11px] md:text-sm text-stone-500 font-medium flex items-center gap-1 md:mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                        Saved on this device
                      </p>
                    </div>
                  </div>
                  <button className="md:hidden flex items-center gap-1 text-xs font-semibold text-stone-700 bg-sand-100 hover:bg-sand-200 px-3 py-1.5 rounded-xl border border-sand-300 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Exit</span>
                  </button>
                </header>

                <div className="bg-white md:bg-sand-50/50 rounded-2xl p-4 md:p-6 border border-stone-200/90 shadow-sm mb-3 md:mb-5">
                  <div className="flex items-start gap-3.5 md:gap-5 mb-3.5 md:mb-5">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border shrink-0
                      ${activeAgency.status === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}
                    `}>
                      <span className="material-symbols-outlined text-[26px] md:text-[32px]">{activeAgency.icon}</span>
                    </div>
                    <div className="mt-0.5">
                      <h3 className="text-base md:text-xl font-bold text-stone-900 leading-snug">{activeAgency.name}</h3>
                      <p className="text-xs md:text-sm text-stone-500 mt-0.5 md:mt-1">{activeAgency.location} • {activeAgency.destination} placements</p>
                    </div>
                  </div>
                  
                  <div className={`border rounded-xl p-3 md:p-4 flex items-center justify-between
                    ${activeAgency.status === 'warning' ? 'bg-amber-50/70 border-amber-200/80' : 'bg-emerald-50/70 border-emerald-200/80'}
                  `}>
                    <div className="flex items-start gap-2.5">
                      <span className={`material-symbols-outlined text-[20px] md:text-[24px] mt-0.5 md:mt-0
                        ${activeAgency.status === 'warning' ? 'text-amber-800' : 'text-emerald-800'}
                      `}>{activeAgency.status === 'warning' ? 'schedule' : 'account_balance'}</span>
                      <div>
                        <h4 className={`text-xs md:text-sm font-bold ${activeAgency.status === 'warning' ? 'text-amber-950' : 'text-emerald-950'}`}>
                          {activeAgency.status === 'warning' ? 'License renewal pending' : 'Government license active'}
                        </h4>
                        <p className="text-[11px] md:text-xs text-stone-600 mt-0.5">MOLS Registration ET-RA-20481 • checked 24 Sep 2026</p>
                      </div>
                    </div>
                    {activeAgency.status !== 'warning' && (
                      <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 ml-1">
                        <span className="material-symbols-outlined text-[16px] md:text-[20px] font-bold">check</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-sand-100 md:bg-white rounded-2xl p-3 md:p-4 text-left border border-sand-200 md:shadow-sm">
                    <div className="text-base md:text-xl font-bold text-stone-900">{activeAgency.stats.years} yrs</div>
                    <div className="text-[11px] md:text-xs text-stone-500 font-medium leading-tight mt-0.5 md:mt-1">in registry</div>
                  </div>
                  <div className="bg-sand-100 md:bg-white rounded-2xl p-3 md:p-4 text-left border border-sand-200 md:shadow-sm">
                    <div className="text-base md:text-xl font-bold text-stone-900">{activeAgency.stats.records}</div>
                    <div className="text-[11px] md:text-xs text-stone-500 font-medium leading-tight mt-0.5 md:mt-1">anonymous records</div>
                  </div>
                  <div className="bg-sand-100 md:bg-white rounded-2xl p-3 md:p-4 text-left border border-sand-200 md:shadow-sm">
                    <div className={`text-base md:text-xl font-bold ${activeAgency.stats.concern === 'High' ? 'text-red-700' : activeAgency.stats.concern === 'Medium' ? 'text-amber-700' : 'text-emerald-800'}`}>{activeAgency.stats.concern}</div>
                    <div className="text-[11px] md:text-xs text-stone-500 font-medium leading-tight mt-0.5 md:mt-1">pattern concern</div>
                  </div>
                </div>

                <div className="bg-white md:bg-sand-50/50 rounded-2xl p-4 md:p-6 border border-stone-200/90 shadow-sm mb-3 md:mb-5">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h4 className="text-sm md:text-base font-bold text-stone-900">Anonymous worker patterns</h4>
                    <a className="text-xs md:text-sm font-semibold text-brand-700 underline decoration-brand-200 hover:text-brand-900" href="#">How this works</a>
                  </div>
                  <div className="space-y-2.5 md:space-y-3">
                    {activeAgency.stats.patterns.map((pattern, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 md:p-3 rounded-xl border
                        ${pattern.type === 'warning' ? 'bg-amber-50/50 border-amber-200/60' : 'bg-sand-50 border-sand-200/60'}
                      `}>
                        <div className="flex items-center gap-2.5 md:gap-3.5">
                          <span className={`w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center shrink-0
                            ${pattern.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}
                          `}>
                            <span className="material-symbols-outlined text-[16px] md:text-[20px]">
                              {pattern.type === 'warning' ? 'warning' : 'check_circle'}
                            </span>
                          </span>
                          <span className="text-xs md:text-sm font-medium text-stone-800">{pattern.label}</span>
                        </div>
                        <span className={`text-xs md:text-sm shrink-0
                          ${pattern.type === 'warning' ? 'font-semibold text-amber-900' : 'font-bold text-stone-700'}
                        `}>{pattern.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-50 border border-brand-200/70 rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3 text-stone-600 text-xs md:text-sm mb-4 md:mb-6">
                  <span className="material-symbols-outlined text-emerald-700 text-[18px] md:text-[22px] shrink-0 mt-0.5">verified_user</span>
                  <p className="leading-relaxed">
                    Patterns only appear after enough similar records. No worker, employer, or exact incident is identified.
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2.5 md:gap-4 mb-2">
                  <button className="col-span-2 flex items-center justify-center gap-1.5 py-3 md:py-4 px-2 bg-white hover:bg-sand-100 text-stone-800 text-xs md:text-sm font-bold rounded-2xl border border-stone-300 shadow-sm transition active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">bookmark</span>
                    <span>Save agency</span>
                  </button>
                  <button className="col-span-3 flex items-center justify-center gap-1.5 py-3 md:py-4 px-3 bg-brand-800 hover:bg-brand-900 text-white text-xs md:text-sm font-bold rounded-2xl shadow-sm transition active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">document_scanner</span>
                    <span>Check a contract</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 bg-sand-50/95 backdrop-blur-md border-t border-sand-200 px-6 py-2.5 flex justify-between items-center z-20">
          <Link className="flex flex-col items-center gap-0.5 text-stone-500 hover:text-stone-800 transition" href="/home">
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5 px-3 py-1 bg-brand-100 text-brand-900 rounded-xl transition">
            <span className="material-symbols-outlined text-[22px] filled text-brand-800">verified</span>
            <span className="text-[10px] font-bold text-brand-900">Trust</span>
          </button>
          <Link className="flex flex-col items-center gap-0.5 text-stone-500 hover:text-stone-800 transition" href="/records">
            <span className="material-symbols-outlined text-[22px]">folder</span>
            <span className="text-[10px] font-medium">Records</span>
          </Link>
          <Link className="flex flex-col items-center gap-0.5 text-stone-500 hover:text-stone-800 transition" href="/safety">
            <span className="material-symbols-outlined text-[22px]">shield</span>
            <span className="text-[10px] font-medium">Safety</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
