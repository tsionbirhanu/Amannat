'use client';
import Link from 'next/link';

export default function SafetyHubPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] md:bg-[#F9F8F3] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#F9F8F3] flex flex-col overflow-hidden relative">
        
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
            <Link className="flex items-center space-x-2 text-[#1D453D] font-semibold" href="/safety">
              <div className="w-8 h-8 rounded-full bg-[#E5EFE9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-[#1D453D]">shield</span>
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
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">Safety hub</h1>
                  <div className="flex items-center space-x-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-600 inline-block"></span>
                    <span className="text-xs md:text-sm text-[#6F7775]">Saved on this device</span>
                  </div>
                </div>
              </div>
              <Link href="/home" className="md:hidden bg-[#AF443E] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Exit</span>
              </Link>
            </section>

            {/* Desktop 2-Column Container */}
            <div className="md:flex md:gap-10 mt-1 md:mt-2">
              
              {/* Left Column */}
              <div className="md:w-1/2 flex flex-col gap-3.5 md:gap-6 mb-3.5 md:mb-0">
                
                {/* Check In Card */}
                <section className="bg-[#EBF5EF] rounded-2xl md:rounded-3xl p-3.5 md:p-6 flex items-center justify-between cursor-pointer border border-[#E0ECE5] transition-all hover:bg-[#E4F1E9] active:scale-[0.99]">
                  <div className="flex items-center space-x-3.5 md:space-x-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#1D453D] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] md:text-[28px] text-emerald-300">verified</span>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-xl font-semibold text-emerald-950">Checked in safe</h2>
                      <p className="text-[11px] md:text-sm text-[#6F7775] mt-0.5 md:mt-1 leading-snug">Today, 9:12 • Next check-in at 18:00</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[20px] md:text-[24px] text-emerald-800 opacity-60 shrink-0">chevron_right</span>
                </section>

                {/* Urgent Help Card */}
                <section className="bg-[#FDF1F0] border border-[#F0C7C4] rounded-2xl md:rounded-3xl p-3.5 md:p-6 flex items-center space-x-3.5 md:space-x-5 cursor-pointer active:scale-[0.99] transition-transform">
                  <div className="w-[52px] h-[52px] md:w-20 md:h-20 rounded-full bg-[#B13B35] flex items-center justify-center shrink-0 shadow-inner relative group">
                    <span className="material-symbols-outlined text-[24px] md:text-[36px] text-white">front_hand</span>
                    <div className="absolute inset-0 rounded-full ring-4 ring-[#B13B35]/30 animate-ping group-active:animate-none hidden md:block"></div>
                  </div>
                  <div>
                    <h2 className="text-sm md:text-xl font-bold text-red-900 leading-tight">Hold for urgent help</h2>
                    <p className="text-[11px] md:text-sm text-gray-700 mt-1 md:mt-2 leading-snug max-w-[220px] md:max-w-sm">Press and hold for 3 seconds. We'll show who will be contacted before sending.</p>
                  </div>
                </section>
                
                {/* Action Buttons Section */}
                <section className="grid grid-cols-2 gap-2.5 md:gap-4 pt-0.5 md:pt-2">
                  <button className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl py-3 md:py-5 px-3 flex items-center justify-center space-x-2 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined text-[18px] md:text-[24px] text-emerald-900">verified</span>
                    <span className="text-xs md:text-base font-bold text-gray-900">Check in</span>
                  </button>
                  <Link href="/assistant" className="bg-[#1D453D] hover:bg-[#143831] text-white rounded-2xl md:rounded-3xl py-3 md:py-5 px-3 flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined text-[18px] md:text-[24px]">shield</span>
                    <span className="text-xs md:text-base font-bold">Report safely</span>
                  </Link>
                </section>

                <footer className="bg-[#EBF5EF] rounded-2xl md:rounded-3xl p-3 md:p-5 flex items-start space-x-2.5 md:space-x-3 border border-[#E0ECE5] mt-auto hidden md:flex">
                  <div className="pt-0.5 text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">lock</span>
                  </div>
                  <p className="text-[11px] md:text-sm text-emerald-950 leading-snug">
                    Hotlines stay available offline. Quick exit closes Amannat and opens a neutral page.
                  </p>
                </footer>
              </div>

              {/* Right Column */}
              <div className="md:w-1/2 flex flex-col gap-3.5 md:gap-6 pt-1 md:pt-0">
                
                {/* Guardians Section */}
                <section className="space-y-2 md:space-y-4">
                  <div className="flex items-center justify-between px-0.5">
                    <h3 className="text-sm md:text-lg font-bold text-gray-900">My guardians</h3>
                    <button className="text-xs md:text-sm font-semibold text-emerald-800 hover:underline">Edit</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                    <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2.5 md:space-x-3.5 min-w-0">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#E5F0EC] text-emerald-900 text-xs md:text-sm font-semibold flex items-center justify-center shrink-0">MT</div>
                        <div className="min-w-0 pr-1">
                          <p className="text-xs md:text-base font-bold text-gray-900 truncate">Marta T.</p>
                          <p className="text-[10px] md:text-sm text-[#6F7775] truncate leading-tight mt-0.5">Sister • Addis Ababa</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-emerald-700 shrink-0 p-1">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">chat_bubble</span>
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2.5 md:space-x-3.5 min-w-0">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#E5F0EC] text-emerald-900 text-xs md:text-sm font-semibold flex items-center justify-center shrink-0">SS</div>
                        <div className="min-w-0 pr-1">
                          <p className="text-xs md:text-base font-bold text-gray-900 truncate">Selam Support</p>
                          <p className="text-[10px] md:text-sm text-[#6F7775] truncate leading-tight mt-0.5">Case guardian</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-emerald-700 shrink-0 p-1">
                        <span className="material-symbols-outlined text-[18px] md:text-[22px]">chat_bubble</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Hotline Directory Section */}
                <section className="bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-6 border border-gray-100 shadow-sm space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between pb-0.5 md:pb-2">
                    <h3 className="text-sm md:text-lg font-bold text-gray-900">Hotline directory</h3>
                    <button className="text-xs md:text-sm font-semibold text-emerald-800 hover:underline">Offline list</button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 group cursor-pointer">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#DDECE4] flex items-center justify-center text-emerald-900 shrink-0 group-hover:bg-[#d0e5da] transition-colors">
                        <span className="material-symbols-outlined text-[16px] md:text-[22px]">call</span>
                      </div>
                      <div>
                        <p className="text-xs md:text-base font-semibold text-gray-900 leading-tight">Ethiopian Embassy — Riyadh</p>
                        <p className="text-[10px] md:text-sm text-[#6F7775] leading-tight mt-0.5 md:mt-1">Consular support • Amharic / English</p>
                      </div>
                    </div>
                    <span className="text-[11px] md:text-sm font-medium text-gray-500 shrink-0 pl-1">24/7</span>
                  </div>
                  
                  <div className="h-px bg-gray-100 w-full"></div>
                  
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#DDECE4] flex items-center justify-center text-emerald-900 shrink-0 group-hover:bg-[#d0e5da] transition-colors">
                        <span className="material-symbols-outlined text-[16px] md:text-[22px]">call</span>
                      </div>
                      <div>
                        <p className="text-xs md:text-base font-semibold text-gray-900 leading-tight">Saudi Human Rights Commission</p>
                        <p className="text-[10px] md:text-sm text-[#6F7775] leading-tight mt-0.5 md:mt-1">Workplace rights and urgent referrals</p>
                      </div>
                    </div>
                    <span className="text-[11px] md:text-sm font-medium text-gray-500 shrink-0 pl-1">19922</span>
                  </div>
                  
                  <div className="h-px bg-gray-100 w-full"></div>
                  
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#DDECE4] flex items-center justify-center text-emerald-900 shrink-0 group-hover:bg-[#d0e5da] transition-colors">
                        <span className="material-symbols-outlined text-[16px] md:text-[22px]">call</span>
                      </div>
                      <div className="min-w-0 pr-1">
                        <p className="text-xs md:text-base font-semibold text-gray-900 truncate leading-tight">Musaned domestic worker support</p>
                        <p className="text-[10px] md:text-sm text-[#6F7775] truncate leading-tight mt-0.5 md:mt-1">Contract and recruitment complaints</p>
                      </div>
                    </div>
                    <span className="text-[11px] md:text-sm font-medium text-gray-500 shrink-0 pl-1">920002866</span>
                  </div>
                </section>

                <footer className="bg-[#EBF5EF] rounded-2xl p-3 flex items-start space-x-2.5 border border-[#E0ECE5] md:hidden mt-2">
                  <div className="pt-0.5 text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </div>
                  <p className="text-[11px] text-emerald-950 leading-snug">
                    Hotlines stay available offline. Quick exit closes Amannat and opens a neutral page.
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
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-900 transition-colors" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] font-medium">Trust</span>
          </Link>
          <Link className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-900 transition-colors" href="/records">
            <span className="material-symbols-outlined text-[24px]">folder</span>
            <span className="text-[10px] font-medium">Records</span>
          </Link>
          <Link className="flex flex-col items-center justify-center px-3.5 py-1 rounded-2xl bg-[#E5EFE9] text-[#1D453D] transition-all" href="/safety">
            <span className="material-symbols-outlined text-[24px] filled">shield</span>
            <span className="text-[10px] font-bold">Safety</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
