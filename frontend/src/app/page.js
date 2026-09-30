export default function Home() {
  return (
    <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* BEGIN: WelcomeBanner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Bethlehem</h2>
            <span className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="">Status: Safe & Synced</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 font-normal">
            Worker Safety & Portable Records · Riyadh, Saudi Arabia
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 pt-1">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="">Next scheduled check-in: <strong className="text-slate-800 font-semibold">Sunday at 6:00 PM</strong></span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 self-start md:self-center flex-shrink-0">
          <button className="inline-flex items-center space-x-2 bg-[#0d1e32] hover:bg-[#142842] text-white px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="">Check-in Now (I am safe)</span>
          </button>
          <button className="inline-flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all">
            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="">Hold for SOS</span>
          </button>
        </div>
      </section>

      {/* BEGIN: MetricSummaryCards */}
      <section aria-label="Metric Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Wages Received</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" width="20" x="2" y="5"></rect>
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-slate-900">$2,800</span>
              <span className="text-xs font-medium text-slate-400">/ $3,200</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '87.5%' }}></div>
            </div>
          </div>
          <p className="text-xs font-medium text-emerald-600 pt-0.5">October salary logged (90% on time)</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Contract Validity</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 leading-none">16 Months</span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Remaining on term</p>
          </div>
          <p className="text-xs font-medium text-emerald-600 pt-0.5">Bilateral agreement verified</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Trust Registry</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 leading-tight block">Agency Verified</span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Ethio-Gulf Bilateral Agency</p>
          </div>
          <p className="text-xs font-semibold text-slate-800 pt-0.5">Grade A Credential</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Safety Status</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 leading-none">All 5 Active</span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Trusted safety guardians</p>
          </div>
          <p className="text-xs font-medium text-emerald-600 pt-0.5">Consular hotline standby</p>
        </div>
      </section>

      {/* BEGIN: LowerTwoColumnSection */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <h3 className="text-base font-bold text-slate-900">Portable Wage & Contract Snapshot</h3>
              </div>
              <span className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="">Encrypted Vault Copy</span>
              </span>
            </div>

            <div className="bg-slate-50/75 rounded-xl p-5 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Household Employer</p>
                <p className="text-sm font-bold text-slate-900">Al-Mansoor Family</p>
                <p className="text-xs text-slate-600">Riyadh, Al-Malaz District</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Agreed Wage</p>
                <p className="text-sm font-bold text-slate-900">1,500 SAR <span className="text-xs font-normal text-slate-500">/ Month</span></p>
                <p className="text-xs text-emerald-600 font-medium">Auto-disbursed via digital ledger</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Weekly Rest Day</p>
                <p className="text-sm font-bold text-slate-900">Every Friday</p>
                <p className="text-xs text-slate-600">Guaranteed 24-hr rest window</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Recent Disbursement Records</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">October 2024 Base Salary</h4>
                      <p className="text-[11px] text-slate-500">Direct mobile transfer · Deposited Oct 29</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 leading-tight">1,500 SAR</p>
                    <p className="text-[11px] font-semibold text-emerald-600">Receipt Confirmed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">September 2024 Base Salary</h4>
                      <p className="text-[11px] text-slate-500">Direct mobile transfer · Deposited Sep 30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 leading-tight">1,500 SAR</p>
                    <p className="text-[11px] font-semibold text-emerald-600">Receipt Confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center space-x-2 bg-[#17253b] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm">
                  <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">View Full Contract</span>
                </button>
                <button className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">Log New Payment</span>
                </button>
              </div>
              <button className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="">Export Consular PDF</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Guardians & Check-in</h3>
                </div>
                <span className="text-xs font-medium text-slate-500">Weekly Cadence</span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">Family Emergency Link</h4>
                      <p className="text-[11px] text-slate-500">Mother & Brother (Addis Ababa)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">Local Safe Cell Community</h4>
                      <p className="text-[11px] text-slate-500">Riyadh Domestic Workers Circle</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">Ethiopian Embassy Consular Desk</h4>
                      <p className="text-[11px] text-slate-500">+966 11 482 8411 (Diplomatic line)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/75 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">Next automated ping alert in <strong className="font-semibold text-slate-900">3 days</strong></span>
                </div>
                <button className="font-semibold text-slate-700 hover:text-slate-900 text-xs">Settings</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Trust Registry Search</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Verify licensed recruiters and employers</p>
                </div>
              </div>
              <div className="relative flex items-center">
                <svg className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <input className="w-full pl-9 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-slate-400" placeholder="Search agency or employer license..." type="text" />
                <button className="absolute right-1.5 bg-[#0d1e32] hover:bg-[#142842] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Voxide Voice Assistant</h3>
                  <p className="text-xs text-slate-500">Ask anything about your rights or contract terms</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1.5 bg-orange-50 border border-orange-200/80 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="">Audio AI Ready</span>
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="w-12 h-12 rounded-full bg-[#f97316] hover:bg-[#ea580c] flex items-center justify-center text-white shadow-sm transition-transform active:scale-95 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">Tap to Speak</h4>
                  <p className="text-xs text-slate-500 mt-0.5">English audio voice assistant is ready to listen</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                <span className="w-1 h-3 rounded-full bg-amber-500"></span>
                <span className="w-1 h-6 rounded-full bg-amber-600"></span>
                <span className="w-1 h-8 rounded-full bg-slate-800"></span>
                <span className="w-1 h-5 rounded-full bg-amber-500"></span>
                <span className="w-1 h-2 rounded-full bg-amber-400"></span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Quick One-Click Inquiries</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="text-left p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="text-xs font-bold text-slate-900">Overtime Clause</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">Review extra hours compensation</p>
                </button>
                <button className="text-left p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="text-xs font-bold text-slate-900">Labor Law Rights</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">Official domestic worker protections</p>
                </button>
                <button className="text-left p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="text-xs font-bold text-slate-900">Agency Rating</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">Check broker compliance record</p>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 flex items-start space-x-3">
              <div className="p-1 text-rose-500 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Recent Council Verdict</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="font-semibold text-slate-900">Al-Barakah Agency</strong> placed on 3-month probation due to unverified salary fee deductions reported by 4 workers.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">Worker Governance Council</h3>
                    <p className="text-[11px] text-slate-500">Active Term 4 · Peer-Led Accountability</p>
                  </div>
                </div>
                <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                  12 Active Reps
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Have a dispute, unfair contract modification, or inquiry? Speak directly with a verified female community representative assigned to your sector.
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">Contact Representative</span>
                </button>
                <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  View Decisions
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/70 backdrop-blur rounded-2xl border border-slate-200/80 shadow-sm text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-slate-100 text-slate-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </span>
            <span className="">Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[11px] font-bold text-slate-800">ESC</kbd> anytime for immediate Quick Disguise</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="">24/7 Consular Emergency Assistance Hotline: <strong className="font-bold text-slate-900">+966 11 482 8411</strong></span>
          </div>
        </div>
      </div>
    </main>
  );
}
