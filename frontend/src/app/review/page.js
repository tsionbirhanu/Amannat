'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ReviewRecordPage() {
  const [activeView, setActiveView] = useState('contract'); // 'contract', 'record', or 'both'

  // Auto-switch to 'both' on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveView('both');
      } else if (activeView === 'both') {
        setActiveView('contract');
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeView]);

  return (
    <div className="min-h-screen bg-[#0d1117] md:bg-[#fcfbf7] flex flex-col items-center font-sans text-slate-800 selection:bg-teal-200">
      <main className="w-full h-[100dvh] md:h-screen bg-[#fcfbf7] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-4 justify-between items-center z-10 shrink-0 w-full shadow-sm">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/home">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>Home</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/trust">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Trust</span>
            </Link>
            <Link className="flex items-center space-x-2 text-emerald-800 font-semibold" href="/records">
              <div className="w-8 h-8 rounded-full bg-[#edf6f2] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] filled text-emerald-800">folder</span>
              </div>
              <span>Records</span>
            </Link>
            <Link className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium" href="/safety">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>Safety</span>
            </Link>
          </div>
          <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 text-sm font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit Disguise</span>
          </button>
        </nav>

        {/* Mobile View Toggle */}
        <div className="md:hidden mt-2 mb-2 flex justify-center w-full px-4 z-20 shrink-0">
          <div className="flex items-center bg-slate-800 p-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-300 shadow-lg w-full max-w-[350px]">
            <button 
              className={`flex-1 py-1.5 rounded-full transition-all ${activeView === 'contract' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setActiveView('contract')}
            >
              1. Review
            </button>
            <button 
              className={`flex-1 py-1.5 rounded-full transition-all ${activeView === 'record' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setActiveView('record')}
            >
              2. Record
            </button>
          </div>
        </div>

        {/* iOS StatusBar (Hidden on Desktop) */}
        <header className="md:hidden w-full pt-1 px-7 pb-1 flex justify-between items-center z-30 select-none shrink-0 text-slate-900">
          <span className="text-[14px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center space-x-2 text-[12px]">
            <span className="material-symbols-outlined text-[14px] fill-current">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <div className="w-5 h-2.5 border border-slate-900 rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-slate-900 rounded-[2px]"></div>
            </div>
          </div>
        </header>

        {/* Main 2-Column Content */}
        <div className="flex-1 overflow-hidden w-full max-w-6xl mx-auto flex">
          
          {/* ========================================================= */}
          {/* SCREEN 1: Contract Review */}
          {/* ========================================================= */}
          <div className={`w-full md:w-1/2 flex flex-col h-full bg-[#fcfbf7] md:border-r border-slate-200 ${activeView === 'contract' || activeView === 'both' ? 'flex' : 'hidden'}`}>
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 pt-2 md:pt-6 pb-24 md:pb-6 space-y-3.5 md:space-y-5">
              
              <header className="flex items-center justify-between pt-1 mb-2">
                <div className="flex items-center gap-3">
                  <Link href="/records" aria-label="Go back" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm active:scale-95 transition-transform hover:bg-slate-50">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </Link>
                  <div>
                    <h1 className="text-[17px] md:text-xl font-bold tracking-tight text-slate-900 leading-tight">Review contract terms</h1>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>Offline • will sync later</span>
                    </div>
                  </div>
                </div>
                <button className="md:hidden px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 shadow-sm hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  <span>Exit</span>
                </button>
              </header>

              <section aria-label="Terms status" className="pt-1">
                <div className="flex justify-between items-center text-[11px] md:text-xs text-slate-600 mb-1.5 md:mb-2 font-medium">
                  <span>8 terms found</span>
                  <span className="text-amber-800 font-semibold">2 need your attention</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="w-4/5 bg-amber-600 h-full rounded-full"></div>
                  <div className="w-1/5 bg-slate-200 h-full"></div>
                </div>
              </section>

              <section className="bg-[#1b433c] text-white p-3.5 md:p-4 rounded-2xl md:rounded-3xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 md:gap-4">
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f28e2b] flex items-center justify-center text-white shrink-0 shadow-inner hover:bg-[#e07d1a] transition-colors">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">play_arrow</span>
                  </button>
                  <div>
                    <h2 className="text-[13px] md:text-sm font-semibold tracking-wide">Listen to the contract summary</h2>
                    <p className="text-[11px] md:text-xs text-teal-200/90 mt-0.5">1 min 12 sec • English</p>
                  </div>
                </div>
                <button aria-label="Translate audio" className="text-teal-200 hover:text-white p-1.5 md:p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">translate</span>
                </button>
              </section>

              <article className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl md:rounded-3xl p-3.5 md:p-5 text-[12px] md:text-sm space-y-2 md:space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[13px] md:text-base">
                    <span className="material-symbols-outlined text-amber-600 text-[18px] md:text-[20px]">warning</span>
                    <span>Salary amount differs</span>
                  </div>
                  <span className="text-[11px] md:text-xs font-medium text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">Unusual</span>
                </div>
                <p className="text-slate-700 leading-snug">
                  Contract: <span className="font-medium text-slate-900">SAR 1,200</span> per month. Agency message: <span className="font-medium text-slate-900">SAR 1,500</span>. Ask for the higher amount in writing before travel.
                </p>
                <div className="pt-1">
                  <a className="inline-flex items-center gap-1 text-[12px] md:text-sm font-medium text-[#c05621] hover:underline" href="#">
                    <span>Hear a question to ask the agency</span>
                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </article>

              <article className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl md:rounded-3xl p-3.5 md:p-5 text-[12px] md:text-sm space-y-2 md:space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#991b1b] font-semibold text-[13px] md:text-base">
                    <span className="material-symbols-outlined text-[#dc2626] text-[18px] md:text-[20px]">help</span>
                    <span>Weekly rest day not stated</span>
                  </div>
                  <span className="text-[11px] md:text-xs font-medium text-[#991b1b] bg-rose-100/90 px-2 py-0.5 rounded-md">Missing</span>
                </div>
                <p className="text-slate-700 leading-snug">
                  No weekly day off appears in the captured pages. This term should be written clearly.
                </p>
                <div className="pt-1">
                  <a className="inline-flex items-center gap-1 text-[12px] md:text-sm font-medium text-[#b91c1c] hover:underline" href="#">
                    <span>Mark for agency follow-up</span>
                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </article>

              <section className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-3 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                  <span className="text-slate-500 font-medium">Destination</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>Riyadh, Saudi Arabia</span>
                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-600">check_circle</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                  <span className="text-slate-500 font-medium">Working hours</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>8 hours per day</span>
                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-600">check_circle</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                  <span className="text-slate-500 font-medium">Contract period</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>24 months</span>
                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-600">check_circle</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 text-[12px] md:text-sm">
                  <span className="text-slate-500 font-medium">Passport access</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>Worker keeps access</span>
                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-600">check_circle</span>
                  </div>
                </div>
              </section>

              <section className="bg-[#edf6f2] border border-[#d8ebe1] rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-700 shrink-0 mt-0.5 md:mt-0">lock</span>
                <p className="text-[11px] md:text-xs leading-relaxed text-slate-700">
                  This review is guidance, not legal advice. Your original pages remain unchanged and worker-owned.
                </p>
              </section>

              <div className="grid grid-cols-2 gap-2.5 md:gap-4 pt-1 pb-4">
                <button className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-slate-300 bg-white font-semibold text-[13px] md:text-sm text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span>Edit terms</span>
                </button>
                <button 
                  className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-[#1b433c] hover:bg-[#153630] text-white font-semibold text-[13px] md:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                  onClick={() => setActiveView(window.innerWidth >= 768 ? 'both' : 'record')}
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-300">check_box</span>
                  <span>Save review</span>
                </button>
              </div>
            </main>
          </div>

          {/* ========================================================= */}
          {/* SCREEN 2: Portable Record */}
          {/* ========================================================= */}
          <div className={`w-full md:w-1/2 flex flex-col h-full bg-[#fcfbf7] ${activeView === 'record' || activeView === 'both' ? 'flex' : 'hidden'}`}>
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 pt-2 md:pt-6 pb-24 md:pb-6 space-y-3.5 md:space-y-5">
              
              <header className="flex items-center justify-between pt-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-[#1b433c] text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px] text-teal-300">verified</span>
                  </div>
                  <div>
                    <h1 className="text-[17px] md:text-xl font-bold tracking-tight text-slate-900 leading-tight">My portable record</h1>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>Saved on this device</span>
                    </div>
                  </div>
                </div>
                <button className="md:hidden px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 shadow-sm hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  <span>Exit</span>
                </button>
              </header>

              <section className="bg-[#1b433c] text-white p-3.5 md:p-5 rounded-2xl md:rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#e6983b] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px] md:text-[28px] text-amber-950">folder</span>
                  </div>
                  <div>
                    <div className="text-[10px] md:text-[11px] tracking-wider font-semibold text-[#f4ba6d] uppercase">WORKER 8K2-41M</div>
                    <h2 className="text-[14px] md:text-lg font-bold text-white tracking-tight md:mt-0.5">You own this record</h2>
                    <p className="text-[11px] md:text-[13px] text-teal-200/90 mt-0.5 md:mt-1">Encrypted • updated today at 8:16</p>
                  </div>
                </div>
                <div className="text-teal-200 p-1.5 md:p-2 bg-white/10 rounded-full md:rounded-xl">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">key</span>
                </div>
              </section>

              <section className="bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-5 border border-slate-200/90 shadow-sm space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-[14px] md:text-base">Wage history</h2>
                  <button className="text-[12px] md:text-sm font-semibold text-teal-700 hover:text-teal-800">Add payment</button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="bg-[#f2f4f3] rounded-xl md:rounded-2xl p-2.5 md:p-4">
                    <span className="text-[11px] md:text-xs text-slate-500 font-medium">Total owed</span>
                    <div className="text-[16px] md:text-xl font-bold text-slate-800 mt-0.5 md:mt-1">SAR 3,600</div>
                  </div>
                  <div className="bg-[#fef4e8] rounded-xl md:rounded-2xl p-2.5 md:p-4">
                    <span className="text-[11px] md:text-xs text-amber-800 font-medium">Still owed</span>
                    <div className="text-[16px] md:text-xl font-bold text-amber-700 mt-0.5 md:mt-1">SAR 400</div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 pt-1 md:pt-2">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between text-[11px] md:text-sm font-medium text-slate-600">
                      <span className="font-bold text-slate-900">Sep</span>
                      <span>Owed 1,200</span>
                      <span className="font-semibold text-slate-900">Paid 800</span>
                    </div>
                    <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="w-[66%] bg-amber-600 h-full rounded-full"></div>
                      <div className="w-[34%] bg-slate-200 h-full"></div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] text-amber-700 font-medium pt-0.5 md:pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>SAR 400 remaining • due 30 Sep</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between text-[11px] md:text-sm font-medium text-slate-600">
                      <span className="font-bold text-slate-900">Aug</span>
                      <span>Owed 1,200</span>
                      <span className="font-semibold text-slate-900">Paid 1,200</span>
                    </div>
                    <div className="w-full h-2 md:h-3 bg-emerald-800 rounded-full overflow-hidden"></div>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between text-[11px] md:text-sm font-medium text-slate-600">
                      <span className="font-bold text-slate-900">Jul</span>
                      <span>Owed 1,200</span>
                      <span className="font-semibold text-slate-900">Paid 1,200</span>
                    </div>
                    <div className="w-full h-2 md:h-3 bg-emerald-800 rounded-full overflow-hidden"></div>
                  </div>
                </div>
              </section>

              <section className="space-y-2 md:space-y-3 pt-1 md:pt-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-[14px] md:text-base">Saved evidence</h2>
                  <button className="text-[12px] md:text-sm font-medium text-slate-500 hover:text-slate-800">View all</button>
                </div>
                
                <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5 md:gap-4">
                    <div className="bg-emerald-50 p-2 rounded-xl">
                      <span className="material-symbols-outlined text-[20px] md:text-[24px] text-emerald-800">description</span>
                    </div>
                    <div className="text-[12px] md:text-sm font-semibold text-slate-800">
                      Signed contract <span className="hidden md:inline">•</span> <br className="md:hidden"/> <span className="font-normal text-slate-500">3 pages</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] md:text-xs font-medium text-slate-600 bg-slate-100 px-2 md:px-3 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Private</span>
                  </div>
                </div>

                <div className="bg-[#edf6f2] border border-[#d8ebe1] rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                  <span className="material-symbols-outlined text-[16px] md:text-[20px] text-emerald-700 shrink-0 mt-0.5 md:mt-0">lock</span>
                  <p className="text-[11px] md:text-xs leading-relaxed text-slate-700">
                    PDF export uses your worker code, not your name. Choose what to include before sharing.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-2.5 md:gap-4 pt-1 pb-4 md:pt-3">
                <button className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-slate-300 bg-white font-semibold text-[13px] md:text-sm text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add payment</span>
                </button>
                <button className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-[#1b433c] hover:bg-[#153630] text-white font-semibold text-[13px] md:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[18px] text-emerald-300">download</span>
                  <span>Export PDF</span>
                </button>
              </div>
            </main>
          </div>
          
        </div>

        {/* Mobile Navigation Footer Bar */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 bg-white border-t border-slate-200/80 px-6 py-2 pb-5 flex justify-between items-center z-30 select-none">
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/home">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/trust">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="text-[10px] mt-1 font-medium">Trust</span>
          </Link>
          <Link className="flex flex-col items-center" href="/records">
            <div className="px-5 py-1 bg-[#E8F1EC] rounded-2xl flex flex-col items-center text-[#143B35]">
              <span className="material-symbols-outlined text-[24px] filled">folder</span>
              <span className="text-[10px] font-semibold mt-0.5">Records</span>
            </div>
          </Link>
          <Link className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition" href="/safety">
            <span className="material-symbols-outlined text-[24px]">shield</span>
            <span className="text-[10px] mt-1 font-medium">Safety</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
