'use client';
import Link from 'next/link';

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] md:bg-[#fbf9f4] flex flex-col items-center font-sans text-[#1c2e28]">
      <main className="w-full h-[100dvh] md:h-screen bg-[#fbf9f4] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-[#e7e2d7] px-8 py-4 justify-between items-center z-10 shrink-0 w-full">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-[#133e36] font-semibold" href="/home">
              <div className="w-8 h-8 rounded-full bg-[#e4f1ea] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#133e36]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span>Home</span>
            </Link>
            <Link className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-800 transition-colors font-medium" href="/trust">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Trust</span>
            </Link>
            <Link className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-800 transition-colors font-medium" href="/records">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                <circle cx="12" cy="13" r="1.5"></circle>
              </svg>
              <span>Records</span>
            </Link>
            <Link className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-800 transition-colors font-medium" href="/safety">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
              <span>Safety</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#f0ebe1] hover:bg-[#e7e1d5] transition-colors text-neutral-700 text-sm font-semibold" type="button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            <span>Exit Assistant</span>
          </button>
        </nav>

        {/* iOS StatusBar (Hidden on Desktop) */}
        <header className="md:hidden w-full pt-3 px-7 flex justify-between items-center z-20 shrink-0 select-none text-black">
          <span className="text-[14px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-3.5 fill-current" viewBox="0 0 17 12">
              <rect height="4" rx="0.5" width="2.5" x="0" y="8"></rect>
              <rect height="6.5" rx="0.5" width="2.5" x="4" y="5.5"></rect>
              <rect height="9" rx="0.5" width="2.5" x="8" y="3"></rect>
              <rect height="12" rx="0.5" width="2.5" x="12" y="0"></rect>
            </svg>
            <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
              <path d="M8 2.8c2.8 0 5.3 1.1 7.2 2.9.3.3.3.8 0 1.1l-1.1 1.1c-.3.3-.8.3-1.1 0-1.3-1.3-3.1-2.1-5-2.1s-3.7.8-5 2.1c-.3.3-.8.3-1.1 0L.8 6.8c-.3-.3-.3-.8 0-1.1C2.7 3.9 5.2 2.8 8 2.8zm0 4.2c1.7 0 3.2.7 4.3 1.8.3.3.3.8 0 1.1l-1.1 1.1c-.3.3-.8.3-1.1 0-.8-.8-2-1.3-3.2-1.3s-2.4.5-3.2 1.3c-.3.3-.8.3-1.1 0L2.7 9.9c-.3-.3-.3-.8 0-1.1C3.8 7.7 5.3 7 8 7zm0 4.2c.8 0 1.5.7 1.5 1.5S8.8 14.2 8 14.2 6.5 13.5 6.5 12.7 7.2 11.2 8 11.2z"></path>
            </svg>
            <div className="w-6 h-3 rounded-[3.5px] border border-black p-[1px] flex items-center relative">
              <div className="h-full bg-black rounded-[1.5px] w-full"></div>
              <div className="absolute -right-1 top-0.5 bottom-0.5 w-[2px] bg-black rounded-r-sm"></div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-12 pt-3 md:pt-10 pb-20 md:pb-12 w-full">
          
          <div className="max-w-4xl mx-auto space-y-3.5 md:space-y-6">
            {/* Header Section */}
            <section className="flex items-center justify-between">
              {/* Logo and App Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#133e36] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-emerald-300" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-[17px] md:text-3xl font-bold tracking-tight text-neutral-800 leading-tight">Voxide</h1>
                  <p className="text-[11px] md:text-sm font-medium text-amber-700/90 flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-600 inline-block"></span>
                    Offline • will sync later
                  </p>
                </div>
              </div>
              
              {/* Exit Button (Hidden on Desktop) */}
              <Link href="/home" className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ebe1] hover:bg-[#e7e1d5] rounded-full text-neutral-700 text-xs font-semibold transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
                <span>Exit</span>
              </Link>
            </section>

            <div className="md:flex md:gap-8 md:items-start md:mt-8">
              {/* Left Column on Desktop */}
              <div className="md:w-1/2 space-y-3.5 md:space-y-6">
                
                {/* Language Status Pills */}
                <section className="flex items-center justify-between text-xs md:text-sm pt-0.5 md:pt-0">
                  <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-[#ede8dc] text-neutral-600 font-medium">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-500" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M2 10v3"></path>
                      <path d="M6 6v11"></path>
                      <path d="M10 3v18"></path>
                      <path d="M14 8v7"></path>
                      <path d="M18 5v13"></path>
                      <path d="M22 10v4"></path>
                    </svg>
                    <span>Listening • English</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white text-neutral-600 border border-neutral-200 shadow-sm font-medium hover:bg-neutral-50 transition-colors" type="button">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="m5 8 6 6"></path>
                      <path d="m4 14 6-6 2-3"></path>
                      <path d="M2 5h12"></path>
                      <path d="M7 2h1"></path>
                      <path d="m22 22-5-10-5 10"></path>
                      <path d="M14 18h6"></path>
                    </svg>
                    <span>Change</span>
                  </button>
                </section>

                {/* Visualizer Card */}
                <section className="bg-[#133e36] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#dca14c]/30 flex items-center justify-center p-1.5 md:p-2 mb-4 md:mb-6">
                    <div className="w-full h-full rounded-full bg-[#dca14c] flex items-center justify-center shadow-inner">
                      <svg className="w-6 h-6 md:w-10 md:h-10 text-[#133e36]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" x2="12" y1="19" y2="22"></line>
                      </svg>
                    </div>
                  </div>
                  <div aria-hidden="true" className="flex items-center justify-center gap-1.5 md:gap-2 h-9 md:h-12 mb-3 md:mb-5">
                    <span className="w-1 md:w-1.5 h-2 md:h-3 rounded-full bg-[#377b6d] animate-pulse"></span>
                    <span className="w-1 md:w-1.5 h-4 md:h-6 rounded-full bg-[#418f7f] animate-pulse" style={{ animationDelay: '100ms' }}></span>
                    <span className="w-1 md:w-1.5 h-6 md:h-10 rounded-full bg-[#4ba391] animate-pulse" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1 md:w-1.5 h-3 md:h-5 rounded-full bg-[#3f8879] animate-pulse" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 md:w-2 h-8 md:h-12 rounded-full bg-[#dca14c] animate-pulse" style={{ animationDelay: '300ms' }}></span>
                    <span className="w-1 md:w-1.5 h-4 md:h-7 rounded-full bg-[#3f8879] animate-pulse" style={{ animationDelay: '100ms' }}></span>
                    <span className="w-1 md:w-1.5 h-7 md:h-11 rounded-full bg-[#4ba391] animate-pulse" style={{ animationDelay: '250ms' }}></span>
                    <span className="w-1 md:w-1.5 h-5 md:h-8 rounded-full bg-[#418f7f] animate-pulse" style={{ animationDelay: '50ms' }}></span>
                    <span className="w-1 md:w-1.5 h-2.5 md:h-4 rounded-full bg-[#377b6d] animate-pulse"></span>
                  </div>
                  <h2 className="text-sm md:text-lg font-medium tracking-tight text-white mb-0.5 md:mb-1.5">I'm listening</h2>
                  <p className="text-[11px] md:text-sm text-teal-100/70 font-normal">Speak naturally. Pause when you are finished.</p>
                </section>
                
                {/* Action Buttons (Desktop moves these below visualizer) */}
                <section className="grid grid-cols-2 gap-3 pt-1 md:pt-2">
                  <Link href="/incident" className="flex items-center justify-center gap-2 py-3 px-3 md:py-4 bg-white hover:bg-neutral-50 text-neutral-800 text-xs md:text-sm font-semibold rounded-2xl border border-neutral-200 shadow-sm transition-colors active:scale-[0.98]">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" x2="8" y1="13" y2="13"></line>
                      <line x1="16" x2="8" y1="17" y2="17"></line>
                    </svg>
                    <span>Review Report</span>
                  </Link>
                  <button className="flex items-center justify-center gap-2 py-3 px-3 md:py-4 bg-[#133e36] hover:bg-[#0d2d27] text-white text-xs md:text-sm font-semibold rounded-2xl shadow-sm transition-colors active:scale-[0.98]" type="button">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                    <span>Ask again</span>
                  </button>
                </section>
              </div>

              {/* Right Column on Desktop */}
              <div className="md:w-1/2 space-y-3.5 md:space-y-6 mt-4 md:mt-0">
                {/* User Transcript Card */}
                <section className="bg-[#efebe2] rounded-2xl md:rounded-3xl p-3.5 md:p-6 text-neutral-800">
                  <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-teal-900/60 block mb-1 md:mb-2">YOU SAID</span>
                  <p className="text-[13px] md:text-base font-medium leading-snug md:leading-relaxed text-neutral-800">
                    "My contract says 1,200 riyals, but the agency told me 1,500. Which is correct?"
                  </p>
                </section>

                {/* Assistant Response Card */}
                <section className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-[#eee9de] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-neutral-700">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path>
                      </svg>
                      <span>Voxide response</span>
                    </div>
                    <button aria-label="Listen to response" className="text-teal-800 hover:text-teal-950 transition-colors bg-teal-50 md:p-1.5 rounded-full" type="button">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-[12.5px] md:text-base leading-relaxed text-neutral-700">
                    The written contract is the record you can prove. The amount differs, so I marked it for review before you travel.
                  </p>
                  <div className="pt-1 md:pt-2">
                    <a className="inline-flex items-center gap-1.5 text-[11.5px] md:text-sm font-semibold text-[#b86f1e] hover:text-[#995914] transition-colors" href="#">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                        <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                        <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                      </svg>
                      <span>Review the salary term</span>
                    </a>
                  </div>
                </section>

                {/* Privacy Banner */}
                <section className="bg-[#e4f1ea] border border-emerald-200/50 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-start gap-2.5 md:gap-3">
                  <div className="mt-0.5 shrink-0 text-[#2e6b56]">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <p className="text-[10.5px] md:text-[13px] leading-tight md:leading-snug text-[#2e6b56] font-normal">
                    Voice is processed for this answer, then removed. The transcript stays only if you save it.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Footer Bar (Hidden on Desktop) */}
        <nav className="md:hidden w-full bg-[#fbf9f4] border-t border-[#ede7d8] px-4 pt-2 pb-6 shrink-0 grid grid-cols-4 items-center absolute bottom-0 z-10">
          <Link className="flex flex-col items-center justify-center text-center" href="/home">
            <div className="px-4 py-1 rounded-full bg-[#e3ece7] text-teal-900 transition-colors">
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-teal-900 mt-1">Home</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors" href="/trust">
            <div className="px-3 py-1">
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-1">Trust</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors" href="/records">
            <div className="px-3 py-1">
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                <circle cx="12" cy="13" r="1.5"></circle>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-1">Records</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors" href="/safety">
            <div className="px-3 py-1">
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-1">Safety/Voice</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
