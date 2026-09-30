'use client';
import Link from 'next/link';

export default function IncidentReviewPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] md:bg-[#FBF9F4] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#FBF9F4] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-stone-200/80 px-8 py-4 justify-between items-center z-10 shrink-0 w-full shadow-sm">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>Home</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/trust">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Trust</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-slate-800 transition-colors font-medium" href="/records">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              <span>Records</span>
            </Link>
            <Link className="flex items-center space-x-2 text-[#183B32] font-semibold" href="/safety">
              <div className="w-8 h-8 rounded-full bg-[#E2EFE7] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-[#183B32]">shield</span>
              </div>
              <span>Safety</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit Disguise</span>
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
                  <h1 className="text-[17px] md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Review incident report</h1>
                  <div className="flex items-center gap-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#B86B33]"></span>
                    <p className="text-[11px] md:text-sm text-stone-500 font-medium">Offline • will sync later</p>
                  </div>
                </div>
              </div>
              <Link href="/home" className="flex items-center gap-1.5 bg-[#9E3834] text-white text-[13px] md:text-sm font-semibold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-sm active:opacity-90 hover:bg-[#8A312D] transition-colors">
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">logout</span>
                <span className="hidden md:inline">Exit Disguise</span>
                <span className="md:hidden">Exit</span>
              </Link>
            </section>

            {/* Desktop 2-Column Container */}
            <div className="md:flex md:gap-10">
              
              {/* Left Column (Desktop) */}
              <div className="md:w-[55%] flex flex-col gap-3.5 md:gap-6 mb-3.5 md:mb-0">
                
                {/* Audio Summary Card */}
                <section className="bg-[#183B32] text-white rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button aria-label="Play audio summary" className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#DE9E46] text-[#122D26] flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-inner hover:bg-[#c98f3f]">
                      <span className="material-symbols-outlined text-[24px] md:text-[32px] ml-0.5">play_arrow</span>
                    </button>
                    <div>
                      <h2 className="text-[14px] md:text-lg font-semibold leading-tight text-white">Listen before you decide</h2>
                      <p className="text-[11px] md:text-sm text-stone-300 font-normal mt-0.5 md:mt-1">Voxide summary • 46 sec • English</p>
                    </div>
                  </div>
                  <div className="bg-white/95 text-slate-700 text-[11px] md:text-sm font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[14px] md:text-[18px] text-stone-500">schedule</span>
                    <span>Not sent</span>
                  </div>
                </section>

                {/* What I Reported Card */}
                <section className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-stone-200/50 flex-1">
                  <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-stone-100">
                    <h2 className="text-[15px] md:text-lg font-bold text-slate-800">What I reported</h2>
                    <button className="text-[12px] md:text-sm font-medium text-emerald-800 flex items-center gap-1 hover:text-emerald-900 transition-colors" type="button">
                      <span>Edit by voice</span>
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">mic</span>
                    </button>
                  </div>
                  
                  <div className="divide-y divide-stone-100 text-[12px] md:text-sm mt-1 md:mt-2">
                    <div className="py-2.5 md:py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-stone-500 w-[95px] md:w-[130px] shrink-0">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">radio_button_unchecked</span>
                        <span>Concern</span>
                      </div>
                      <div className="flex-1 text-slate-800 font-medium px-2 md:px-4">Passport is being kept</div>
                      <button aria-label="Edit concern" className="text-stone-400 hover:text-stone-600 transition-colors p-1" type="button">
                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                      </button>
                    </div>
                    
                    <div className="py-2.5 md:py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-stone-500 w-[95px] md:w-[130px] shrink-0">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">calendar_today</span>
                        <span>When</span>
                      </div>
                      <div className="flex-1 text-slate-800 font-medium px-2 md:px-4">Since 18 September 2026</div>
                      <button aria-label="Edit date" className="text-stone-400 hover:text-stone-600 transition-colors p-1" type="button">
                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                      </button>
                    </div>
                    
                    <div className="py-2.5 md:py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-stone-500 w-[95px] md:w-[130px] shrink-0">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">shield</span>
                        <span>Safety now</span>
                      </div>
                      <div className="flex-1 text-slate-800 font-medium px-2 md:px-4">Safe to receive a call</div>
                      <button aria-label="Edit safety condition" className="text-stone-400 hover:text-stone-600 transition-colors p-1" type="button">
                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                      </button>
                    </div>
                    
                    <div className="pt-2.5 md:pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-stone-500 w-[95px] md:w-[130px] shrink-0">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">description</span>
                        <span>Evidence</span>
                      </div>
                      <div className="flex-1 text-slate-800 font-medium px-2 md:px-4 truncate">1 voice note, contract page</div>
                      <button aria-label="Edit evidence" className="text-stone-400 hover:text-stone-600 transition-colors p-1" type="button">
                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column (Desktop) */}
              <div className="md:w-[45%] flex flex-col gap-3.5 md:gap-5 pt-1 md:pt-0">
                
                {/* Who Will Receive It Section */}
                <section className="bg-stone-200/40 md:bg-white md:border border-stone-200/50 rounded-2xl md:rounded-3xl p-3.5 md:p-6 space-y-2.5 md:space-y-4">
                  <h2 className="text-[14px] md:text-lg font-bold text-slate-800 px-0.5 mb-1 md:mb-3">Who will receive it</h2>
                  
                  <div className="bg-white md:bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-xs md:shadow-none md:border border-slate-100">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">support_agent</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] md:text-base font-semibold text-slate-800 leading-tight">Selam Worker Support Desk</h3>
                        <p className="text-[11px] md:text-sm text-stone-500 font-normal mt-0.5">Safety follow-up and referral</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] md:text-sm font-medium text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] md:text-[20px]">verified</span>
                      <span className="hidden sm:inline">Trusted</span>
                    </div>
                  </div>
                  
                  <div className="bg-white md:bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-xs md:shadow-none md:border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5 md:gap-3.5">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-[#183B32] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">check</span>
                      </div>
                      <div>
                        <p className="text-[13px] md:text-base font-semibold text-slate-800 leading-snug">Use my worker code only</p>
                        <p className="text-[10.5px] md:text-sm text-stone-500 font-normal leading-tight mt-0.5 md:mt-1 max-w-[200px] md:max-w-xs">Do not include my name or employer address</p>
                      </div>
                    </div>
                    <button aria-label="Toggle worker code details" className="text-stone-400 pl-1 p-2" type="button">
                      <span className="material-symbols-outlined text-[20px] md:text-[24px]">expand_more</span>
                    </button>
                  </div>
                </section>

                <section className="bg-[#FDF6E9] border border-[#D9984E]/80 rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-start gap-3 shadow-xs">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-[#183B32] text-white flex items-center justify-center shrink-0 mt-0.5 md:mt-0.5">
                    <span className="material-symbols-outlined text-[16px] md:text-[18px]">check</span>
                  </div>
                  <p className="text-[12px] md:text-sm text-slate-800 font-normal leading-snug">
                    I understand what will be shared and consent to send this report.
                  </p>
                </section>

                <section className="bg-[#E2EFE7]/70 md:bg-[#E2EFE7]/50 rounded-2xl md:rounded-3xl p-3 md:p-5 flex items-start gap-2.5 md:gap-3 text-emerald-950 mt-auto md:mt-2">
                  <span className="material-symbols-outlined text-[18px] md:text-[22px] text-emerald-900 mt-0.5 md:mt-0 shrink-0">info</span>
                  <p className="text-[11px] md:text-sm leading-snug text-emerald-900/90 font-normal">
                    You can withdraw consent before follow-up begins. A private copy stays in your record.
                  </p>
                </section>

                <section className="grid grid-cols-2 gap-3 pt-1 md:pt-4">
                  <button className="w-full bg-white border border-stone-300 text-slate-800 font-semibold py-3 md:py-4 px-3 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-[13px] md:text-base shadow-xs active:bg-stone-50 hover:bg-stone-50 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[22px] text-stone-600">save</span>
                    <span>Save draft</span>
                  </button>
                  <button className="w-full bg-[#183B32] text-white font-semibold py-3 md:py-4 px-3 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-[13px] md:text-base shadow-md active:bg-[#122D26] hover:bg-[#122D26] transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px] md:text-[22px]">send</span>
                    <span>Consent & send</span>
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
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center justify-center w-16 text-stone-500 hover:text-stone-800 transition-colors" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] mt-1 font-medium">Trust</span>
          </Link>
          <Link className="flex flex-col items-center justify-center w-16 text-stone-500 hover:text-stone-800 transition-colors" href="/records">
            <span className="material-symbols-outlined text-[24px]">folder</span>
            <span className="text-[10px] mt-1 font-medium">Records</span>
          </Link>
          <Link className="flex flex-col items-center justify-center bg-[#E2EFE7]/70 text-[#183B32] rounded-2xl px-3 py-1.5 transition-colors" href="/safety">
            <span className="material-symbols-outlined text-[24px] filled">shield</span>
            <span className="text-[10.5px] mt-0.5 font-bold">Safety</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
