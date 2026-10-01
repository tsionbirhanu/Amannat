'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { language: selectedLang, setLanguage: setSelectedLang } = useLanguage();

  const handleContinue = () => {
    // Navigate to the home dashboard after selection
    router.push('/home');
  };

  const translations = {
    'English': {
      worksOffline: 'Works offline',
      exit: 'Exit',
      tagline: 'Your contracts, wages, and safety support — carried with you.',
      chooseLanguage: 'Choose your language',
      languageDesc: 'You can listen to every step and change language at any time.',
      privacyNotice: 'No name is needed to begin. Your private worker code is created on this device.',
      continueIn: 'Continue in'
    },
    'Amharic': {
      worksOffline: 'ያለ በይነመረብ ይሰራል',
      exit: 'ውጣ',
      tagline: 'ኮንትራቶችዎ፣ ደመወዝዎ እና የደህንነት ድጋፍዎ — ከእርስዎ ጋር ናቸው።',
      chooseLanguage: 'ቋንቋዎን ይምረጡ',
      languageDesc: 'እያንዳንዱን እርምጃ ማዳመጥ እና በማንኛውም ጊዜ ቋንቋ መቀየር ይችላሉ።',
      privacyNotice: 'ለመጀመር ስም አያስፈልግም። የእርስዎ የግል ሰራተኛ ኮድ በዚህ መሳሪያ ላይ ይፈጠራል።',
      continueIn: 'ቀጥል በ'
    },
    'Afaan Oromo': {
      worksOffline: 'Toora irraan ala ni hojjeta',
      exit: 'Bahi',
      tagline: 'Waliigaltee kee, mindaa fi deeggarsi nageenyaa — si waliin jira.',
      chooseLanguage: 'Afaan kee filadhu',
      languageDesc: 'Tarkaanfii hunda dhaggeeffachuu fi yeroo barbaaddetti afaan jijjiiruu ni dandeessa.',
      privacyNotice: 'Eegaluuf maqaan hin barbaachisu. Koodiin hojjetaa dhuunfaa keetii meeshaa kana irratti uumama.',
      continueIn: 'Itti fufi'
    },
    'Arabic': {
      worksOffline: 'يعمل بدون إنترنت',
      exit: 'خروج',
      tagline: 'عقودك وأجورك ودعم سلامتك — معك دائماً.',
      chooseLanguage: 'اختر لغتك',
      languageDesc: 'يمكنك الاستماع إلى كل خطوة وتغيير اللغة في أي وقت.',
      privacyNotice: 'لا حاجة للاسم للبدء. يتم إنشاء رمز العامل الخاص بك على هذا الجهاز.',
      continueIn: 'المتابعة بـ'
    }
  };

  const languages = [
    { id: 'am', name: 'Amharic', rtl: false },
    { id: 'om', name: 'Afaan Oromo', rtl: false },
    { id: 'en', name: 'English', rtl: false },
    { id: 'ar', name: 'Arabic', rtl: true },
  ];

  const t = translations[selectedLang] || translations['English'];
  const isRtl = languages.find(l => l.name === selectedLang)?.rtl || false;

  return (
    <div className="h-screen flex items-center justify-center bg-[#fbfbf9] font-sans overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <main className="w-full h-full text-gray-900 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Left/Top Section Container (Green Background) */}
        <div className="bg-[#143e35] text-white pt-3 pb-8 px-6 md:px-16 lg:px-24 relative rounded-b-[28px] md:rounded-none md:w-1/2 lg:w-[45%] flex flex-col shrink-0">
          
          {/* iOS StatusBar (Hide on Desktop) */}
          <div className="md:hidden flex justify-between items-center text-white text-xs font-semibold tracking-tight pt-1 pb-3 px-1">
            <span className="text-[14px] font-medium tracking-tight">9:41</span>
            <div className="flex items-center space-x-1.5">
              <svg className="w-4 h-3.5" fill="currentColor" viewBox="0 0 18 14">
                <path d="M1 10.5C1 10.2239 1.22386 10 1.5 10H3.5C3.77614 10 4 10.2239 4 10.5V13.5C4 13.7761 3.77614 14 3.5 14H1.5C1.22386 14 1 13.7761 1 13.5V10.5Z"></path>
                <path d="M5.5 8C5.5 7.72386 5.72386 7.5 6 7.5H8C8.27614 7.5 8.5 7.72386 8.5 8V13.5C8.5 13.7761 8.27614 14 8 14H6C5.72386 14 5.5 13.7761 5.5 13.5V8Z"></path>
                <path d="M10 5C10 4.72386 10.2239 4.5 10.5 4.5H12.5C12.7761 4.5 13 4.72386 13 5V13.5C13 13.7761 12.7761 14 12.5 14H10.5C10.2239 14 10 13.7761 10 13.5V5Z"></path>
                <path d="M14.5 1.5C14.5 1.22386 14.7239 1 15 1H17C17.2761 1 17.5 1.22386 17.5 1.5V13.5C17.5 13.7761 17.2761 14 17 14H15C14.7239 14 14.5 13.7761 14.5 13.5V1.5Z"></path>
              </svg>
              <svg className="w-4 h-3.5" fill="currentColor" viewBox="0 0 18 14">
                <path clipRule="evenodd" d="M9 3C5.53 3 2.42 4.49.26 6.88L9 16.5l8.74-9.62C15.58 4.49 12.47 3 9 3z" fillRule="evenodd"></path>
              </svg>
              <div className="flex items-center">
                <div className="w-5 h-2.5 border border-white rounded-[3px] p-[1px] flex items-center">
                  <div className="h-full w-3.5 bg-white rounded-[1.5px]"></div>
                </div>
                <div className="w-0.5 h-1 bg-white rounded-r-sm -ml-[0.5px]"></div>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center mt-2.5 md:mt-8 mb-5 md:mb-0">
            <div className="inline-flex items-center gap-1.5 bg-[#204a40]/90 text-white/95 px-3 py-1.5 rounded-full text-xs font-normal border border-emerald-600/30">
              <svg className="w-3.5 h-3.5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line strokeLinecap="round" x1="2" x2="22" y1="2" y2="22"></line>
                <path d="M8.5 8.5A6 6 0 0 1 12 7.5c1.7 0 3.2.7 4.2 1.8" strokeLinecap="round"></path>
                <path d="M5 5a10 10 0 0 1 14 0" strokeLinecap="round"></path>
                <line strokeLinecap="round" strokeWidth="3" x1="12" x2="12.01" y1="20" y2="20"></line>
              </svg>
              <span className="tracking-tight text-[11px] md:text-xs font-medium">{t.worksOffline}</span>
            </div>
            <button aria-label="Exit" className="inline-flex items-center gap-1.5 bg-[#204a40]/90 hover:bg-[#27594d] text-white/90 px-3.5 py-1.5 rounded-full text-xs font-medium border border-emerald-600/30 active:scale-95 transition" type="button">
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-[11px] md:text-xs">{t.exit}</span>
            </button>
          </div>

          {/* Hero Identity - Centered Vertically on Desktop */}
          <div className="mt-4 md:mt-auto md:mb-auto md:-translate-y-12">
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-[#de9b43] flex items-center justify-center shadow-md mb-4 md:mb-8">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-[#143e35]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <h1 className="text-3xl md:text-6xl font-normal tracking-tight text-white mb-2 md:mb-4">Amannat</h1>
            <p className="text-[15px] md:text-xl md:leading-relaxed text-white/80 mt-2 font-light max-w-[310px] md:max-w-md">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right/Bottom Selection Area */}
        <div className="px-5 md:px-12 lg:px-20 pt-5 md:pt-0 pb-3 md:pb-0 flex-1 flex flex-col justify-between md:justify-center md:items-center overflow-y-auto">
          <div className="w-full md:max-w-lg md:mx-auto flex flex-col justify-center my-auto py-4">
            <div className="mb-4 md:mb-6">
              <h2 className="text-[20px] md:text-2xl font-semibold tracking-tight text-gray-900 md:mb-1">{t.chooseLanguage}</h2>
              <p className="text-[12.5px] md:text-sm leading-relaxed text-gray-500 mt-0.5">
                {t.languageDesc}
              </p>
            </div>
            
            {/* Language Radio List */}
            <fieldset className="space-y-2.5 md:space-y-3">
              <legend className="sr-only">Available Languages</legend>
              {languages.map((lang) => {
                const isSelected = selectedLang === lang.name;
                return (
                  <label 
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.name)}
                    className={`flex items-center justify-between p-3.5 md:p-4 bg-white rounded-xl md:rounded-2xl cursor-pointer active:scale-[0.985] transition ${
                      isSelected 
                        ? 'border-2 border-[#143e35] shadow-[0_1px_3px_rgba(20,62,53,0.08)]' 
                        : 'border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-gray-300'
                    }`}>
                    <div className="flex items-center space-x-3.5 md:space-x-4">
                      {isSelected ? (
                        <span className="w-5 h-5 md:w-5 md:h-5 rounded-full border-[2.2px] border-[#143e35] flex items-center justify-center shrink-0">
                          <span className="w-2.5 h-2.5 md:w-2.5 md:h-2.5 rounded-full bg-[#143e35]"></span>
                        </span>
                      ) : (
                        <span className="w-5 h-5 md:w-5 md:h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0"></span>
                      )}
                      <span className={`text-[15px] md:text-base ${isSelected ? 'font-medium text-gray-900' : 'font-normal text-gray-800'}`}>
                        {lang.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5 md:space-x-4">
                      {lang.rtl && <span className="text-[10px] md:text-xs tracking-wide text-gray-400 font-medium uppercase px-1">RTL</span>}
                      <button aria-label={`Listen in ${lang.name}`} className="text-emerald-800/80 hover:text-emerald-950 p-1 md:p-2" type="button" onClick={(e) => e.stopPropagation()}>
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                  </label>
                );
              })}
            </fieldset>

            {/* Bottom Action Section */}
            <div className="mt-4 md:mt-6 mb-2 md:mb-0 space-y-3.5 md:space-y-4">
              {/* Privacy & Security Notice Callout */}
              <aside aria-label="Privacy guarantee" className="flex items-center space-x-2.5 md:space-x-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#e3f3ec] border border-[#d2ecdf]">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[#205244] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <p className="text-[11.5px] md:text-[12.5px] leading-tight text-[#205244] font-normal">
                  {t.privacyNotice}
                </p>
              </aside>
              
              {/* Continue CTA Button */}
              <button 
                onClick={handleContinue}
                className="w-full py-3.5 md:py-4 px-4 bg-[#143e35] hover:bg-[#0f322b] text-white rounded-xl md:rounded-2xl font-normal text-[15px] md:text-base flex items-center justify-center space-x-2.5 md:space-x-3 shadow-sm active:scale-[0.985] transition cursor-pointer" type="button">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>{t.continueIn} {selectedLang}</span>
              </button>
              
              {/* Home Bar Indicator (Hide on Desktop) */}
              <div aria-hidden="true" className="md:hidden w-full flex justify-center pt-1">
                <div className="w-32 h-1 bg-neutral-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
