'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

export default function RecordsPage() {
  const [selectedOption, setSelectedOption] = useState('camera');
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];

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

              {/* Right Column (Desktop) / Viewfinder Section (Mobile) */}
              <div className="md:w-1/2 flex flex-col md:pl-4">
                
                {selectedOption === 'camera' && (
                  <section className="relative w-full rounded-2xl md:rounded-3xl bg-[#143B35] p-3 md:p-6 shadow-sm mb-3 overflow-hidden text-white flex flex-col justify-between min-h-[175px] md:min-h-[400px] flex-1">
                    <div className="flex items-center justify-between w-full z-10">
                      <div className="flex items-center space-x-1 md:space-x-1.5 px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-white/20 backdrop-blur-md text-[11px] md:text-sm font-medium text-white shadow-inner">
                        <span className="material-symbols-outlined text-[14px] md:text-[18px]">content_copy</span>
                        <span>{t.page1Of3}</span>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-1.5 px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-white/20 backdrop-blur-md text-[11px] md:text-sm font-medium text-white shadow-inner">
                        <span className="material-symbols-outlined text-[14px] md:text-[18px]">lock</span>
                        <span>{t.privateCapture}</span>
                      </div>
                    </div>

                    <div className="my-2 md:my-0 flex-1 flex flex-col items-center justify-center relative">
                      <div className="w-36 md:w-64 h-28 md:h-48 bg-[#181C1D] rounded-sm md:rounded-md flex items-center justify-center p-1.5 md:p-2.5 shadow-md relative overflow-hidden">
                        <div className="w-24 md:w-40 h-full bg-[#EDEDED] shadow-sm flex flex-col p-1.5 md:p-3 space-y-1 md:space-y-2 overflow-hidden opacity-95">
                          <div className="h-1 md:h-2 bg-slate-400 w-3/4 self-center mb-1 md:mb-2 rounded"></div>
                          <div className="space-y-0.5 md:space-y-1.5">
                            <div className="h-0.5 md:h-1 bg-slate-300 w-full rounded"></div>
                            <div className="h-0.5 md:h-1 bg-slate-300 w-11/12 rounded"></div>
                            <div className="h-0.5 md:h-1 bg-slate-300 w-full rounded"></div>
                            <div className="h-0.5 md:h-1 bg-slate-300 w-5/6 rounded"></div>
                            <div className="h-0.5 md:h-1 bg-slate-300 w-4/5 rounded"></div>
                          </div>
                          <div className="mt-auto pt-1 md:pt-2 flex justify-between border-t border-slate-300 text-[3px] md:text-[6px] text-slate-500 font-bold uppercase">
                            <span>{t.contract}</span>
                            <span>{t.sign}</span>
                          </div>
                        </div>
                        {/* Scanning animation line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400/50 shadow-[0_0_8px_2px_rgba(52,211,153,0.3)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>

                    <div className="text-center z-10 mt-auto md:mt-4">
                      <p className="text-[11px] md:text-base font-medium text-white tracking-wide">{t.keepCorners}</p>
                      <p className="text-[10px] md:text-sm text-emerald-200/90 mt-0.5 md:mt-1 font-normal">{t.goodLight}</p>
                    </div>
                  </section>
                )}

                {selectedOption === 'voice' && (
                  <section className="relative w-full rounded-2xl md:rounded-3xl bg-[#143B35] p-3 md:p-6 shadow-sm mb-3 overflow-hidden text-white flex flex-col justify-center items-center min-h-[175px] md:min-h-[400px] flex-1">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#dca14c]/30 flex items-center justify-center p-1.5 md:p-2 mb-4 md:mb-6 animate-pulse">
                      <div className="w-full h-full rounded-full bg-[#C26D28] flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[24px] md:text-[40px] text-white">mic</span>
                      </div>
                    </div>
                    <h3 className="text-sm md:text-xl font-medium text-white">{t.listeningTerms}</h3>
                    <p className="text-xs md:text-sm text-emerald-200/80 mt-1 md:mt-2 text-center max-w-xs">{t.sayPromisedTerms}</p>
                  </section>
                )}

                {selectedOption === 'upload' && (
                  <section className="relative w-full rounded-2xl md:rounded-3xl bg-[#F4F3ED] border-2 border-dashed border-slate-300 p-3 md:p-6 shadow-sm mb-3 overflow-hidden text-slate-600 flex flex-col justify-center items-center min-h-[175px] md:min-h-[400px] flex-1">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                      <span className="material-symbols-outlined text-[28px] md:text-[36px] text-slate-400">upload_file</span>
                    </div>
                    <h3 className="text-sm md:text-xl font-semibold text-slate-800">{t.selectDocument}</h3>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 text-center">{t.tapToBrowse}</p>
                  </section>
                )}

                <section className="mt-1 md:mt-4">
                  <Link href="/review" className="w-full bg-[#143B35] active:bg-[#0E2A26] hover:bg-[#0E2A26] text-white font-medium text-sm md:text-lg py-3.5 md:py-5 px-4 rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 md:space-x-3 shadow-sm transition active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">{selectedOption === 'camera' ? 'camera_alt' : selectedOption === 'voice' ? 'graphic_eq' : 'file_upload'}</span>
                    <span>{selectedOption === 'camera' ? t.capturePage : selectedOption === 'voice' ? t.startRecording : t.browseFiles}</span>
                  </Link>
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
