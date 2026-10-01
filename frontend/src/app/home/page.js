'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();

  const translations = {
    'English': {
      home: 'Home',
      trust: 'Trust',
      records: 'Records',
      safety: 'Safety',
      goodMorning: 'Good morning, 8K2',
      offlineSync: 'Offline • will sync later',
      nextCheckin: 'Next check-in',
      in2Hours: 'IN 2 HOURS',
      safeToday: 'Are you safe today?',
      guardianDesc: 'Your guardian only sees if you miss a check-in — not your location.',
      imSafe: "I'm safe",
      changeTime: 'Change time',
      whatNeed: 'What do you need?',
      listen: 'Listen',
      checkAgency: 'Check an agency',
      searchRegistry: 'Search the Trust Registry',
      readContract: 'Read my contract',
      cameraVoice: 'Use camera or voice',
      recordPayment: 'Record a payment',
      wageHistory: 'Keep a private wage history',
      getHelp: 'Get help safely',
      hotlines: 'Hotlines and incident report',
      portableRecord: 'Your portable record',
      savedDocs: '3 documents • Last saved today, 8:16',
      exitDisguise: 'Exit Disguise',
      exit: 'Exit'
    },
    'Amharic': {
      home: 'መነሻ',
      trust: 'እምነት',
      records: 'መዝገቦች',
      safety: 'ደህንነት',
      goodMorning: 'እንደምን አደሩ, 8K2',
      offlineSync: 'ከመስመር ውጭ • በኋላ ይመሳሰላል',
      nextCheckin: 'ቀጣይ ማረጋገጫ',
      in2Hours: 'በ2 ሰዓታት ውስጥ',
      safeToday: 'ዛሬ ደህና ነዎት?',
      guardianDesc: 'አሳዳጊዎ የሚያየው ማረጋገጫ ካጡ ብቻ ነው — አካባቢዎን አይደለም።',
      imSafe: 'ደህና ነኝ',
      changeTime: 'ሰዓት ቀይር',
      whatNeed: 'ምን ይፈልጋሉ?',
      listen: 'ያዳምጡ',
      checkAgency: 'ኤጀንሲን ያረጋግጡ',
      searchRegistry: 'የእምነት መዝገብን ይፈልጉ',
      readContract: 'ውሌን አንብብ',
      cameraVoice: 'ካሜራ ወይም ድምጽ ይጠቀሙ',
      recordPayment: 'ክፍያን ይመዝግቡ',
      wageHistory: 'የግል ደመወዝ ታሪክ ይያዙ',
      getHelp: 'በደህና እርዳታ ያግኙ',
      hotlines: 'የስልክ መስመሮች እና የክስተት ሪፖርት',
      portableRecord: 'ተንቀሳቃሽ መዝገብዎ',
      savedDocs: '3 ሰነዶች • ዛሬ 8፡16 ተቀምጧል',
      exitDisguise: 'መደበቂያን ውጣ',
      exit: 'ውጣ'
    },
    'Afaan Oromo': {
      home: 'Gadaa',
      trust: 'Amantaa',
      records: 'Galmeewwan',
      safety: 'Nageenya',
      goodMorning: 'Akkam bultan, 8K2',
      offlineSync: 'Tooraan ala • booda wajjiin sirreeffama',
      nextCheckin: 'Mirkaneeffannaa itti aanu',
      in2Hours: 'SA\'AATII 2 KEESSATTI',
      safeToday: 'Har\'a nagaadhaa?',
      guardianDesc: 'Guddisaan kee yoo mirkaneeffannaa dhabde qofa arga — iddoo kee miti.',
      imSafe: 'Nagaadha',
      changeTime: 'Yeroo jijjiiri',
      whatNeed: 'Maal barbaadda?',
      listen: 'Dhaggeeffadhu',
      checkAgency: 'Ejensii mirkaneessi',
      searchRegistry: 'Galmee Amantaa barbaadi',
      readContract: 'Waliigaltee koo dubbisi',
      cameraVoice: 'Kaameeraa ykn sagalee fayyadami',
      recordPayment: 'Kaffaltii galmeessi',
      wageHistory: 'Seenaa mindaa dhuunfaa qabadhu',
      getHelp: 'Nageenyaan gargaarsa argadhu',
      hotlines: 'Sararoota bilbilaa fi gabaasa taatee',
      portableRecord: 'Galmee socho\'u kee',
      savedDocs: 'Sanadoota 3 • Har\'a 8:16 qusatame',
      exitDisguise: 'Dhoksaa keessaa bahi',
      exit: 'Bahi'
    },
    'Arabic': {
      home: 'الرئيسية',
      trust: 'الثقة',
      records: 'السجلات',
      safety: 'السلامة',
      goodMorning: 'صباح الخير، 8K2',
      offlineSync: 'غير متصل • ستتم المزامنة لاحقاً',
      nextCheckin: 'تسجيل الدخول التالي',
      in2Hours: 'في ساعتين',
      safeToday: 'هل أنت آمن اليوم؟',
      guardianDesc: 'لا يرى الوصي إلا إذا فوت تسجيل الدخول — وليس موقعك.',
      imSafe: 'أنا آمن',
      changeTime: 'تغيير الوقت',
      whatNeed: 'ماذا تحتاج؟',
      listen: 'استمع',
      checkAgency: 'تحقق من الوكالة',
      searchRegistry: 'ابحث في سجل الثقة',
      readContract: 'اقرأ عقدي',
      cameraVoice: 'استخدم الكاميرا أو الصوت',
      recordPayment: 'سجل الدفع',
      wageHistory: 'احتفظ بسجل أجور خاص',
      getHelp: 'احصل على المساعدة بأمان',
      hotlines: 'الخطوط الساخنة وتقرير الحوادث',
      portableRecord: 'سجلك المحمول',
      savedDocs: '3 مستندات • تم الحفظ اليوم، 8:16',
      exitDisguise: 'الخروج من التخفي',
      exit: 'خروج'
    }
  };

  const t = translations[language] || translations['English'];

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTimeStr, setCheckInTimeStr] = useState('IN 2 HOURS');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [checkInExpiry, setCheckInExpiry] = useState(null);

  useEffect(() => {
    // Check every second if the check-in has expired
    const interval = setInterval(() => {
      if (isCheckedIn && checkInExpiry && new Date() > checkInExpiry) {
        setIsCheckedIn(false);
        setCheckInExpiry(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInExpiry]);
  
  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Parse the checkInTimeStr roughly to set an expiry
    let expiry = new Date();
    if (checkInTimeStr.includes('2 HOURS')) {
      expiry.setHours(expiry.getHours() + 2);
    } else if (checkInTimeStr.includes('4 HOURS')) {
      expiry.setHours(expiry.getHours() + 4);
    } else if (checkInTimeStr.includes('8 HOURS')) {
      expiry.setHours(expiry.getHours() + 8);
    } else if (checkInTimeStr.includes('TOMORROW')) {
      expiry.setDate(expiry.getDate() + 1);
    } else if (selectedDate) {
      expiry = new Date(selectedDate);
    } else {
      // Just for a quick test if users set random dates
      expiry = new Date(selectedDate);
    }
    setCheckInExpiry(expiry);
  };
  
  const handleChangeTime = () => {
    setShowTimeModal(true);
  };

  const handleSaveTime = () => {
    setShowTimeModal(false);
    if (selectedDate) {
      const d = new Date(selectedDate);
      setCheckInTimeStr(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex flex-col items-center font-sans">
      <main className="w-full h-[100dvh] md:h-screen bg-[#F9F8F5] flex flex-col overflow-hidden relative">
        
        {/* Desktop Top Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex bg-white border-b border-stone-200/80 px-8 py-4 justify-between items-center z-10 shrink-0">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center space-x-2 text-[#183B36] font-semibold" href="/home">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#183B36]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
                </svg>
              </div>
              <span>{t.home}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/trust">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
              </svg>
              <span>{t.trust}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/records">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
              </svg>
              <span>{t.records}</span>
            </Link>
            <Link className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-medium" href="/safety">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
              </svg>
              <span>{t.safety}</span>
            </Link>
          </div>
          <Link href="/register" className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path>
            </svg>
            <span>{t.exitDisguise}</span>
          </Link>
        </nav>

        {/* Scrollable Content Layer */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24 md:pb-10">
          
          {/* iOS StatusBar (Hidden on Desktop) */}
          <header className="md:hidden pt-3 px-7 flex justify-between items-center text-xs font-semibold tracking-tight text-neutral-800">
            <span className="text-[14px]">9:41</span>
            <div className="flex items-center space-x-1.5">
              <svg className="w-4 h-3.5 fill-current" viewBox="0 0 17 12">
                <rect height="4" rx="0.5" width="2.5" x="0" y="8"></rect>
                <rect height="6.5" rx="0.5" width="2.5" x="4" y="5.5"></rect>
                <rect height="9" rx="0.5" width="2.5" x="8" y="3"></rect>
                <rect height="12" rx="0.5" width="2.5" x="12" y="0"></rect>
              </svg>
              <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
                <path clipRule="evenodd" d="M8 2.5a10.96 10.96 0 00-6.72 2.32.75.75 0 11-.96-1.15A12.46 12.46 0 018 1c2.8 0 5.4.92 7.68 2.67a.75.75 0 01-.96 1.15A10.96 10.96 0 008 2.5zm-4.34 4.54A7.47 7.47 0 018 5.5c1.66 0 3.2.54 4.34 1.54a.75.75 0 01-.98 1.14A5.97 5.97 0 008 7c-1.33 0-2.56.43-3.36 1.18a.75.75 0 01-.98-1.14zM8 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fillRule="evenodd"></path>
              </svg>
              <div className="w-6 h-3 border border-neutral-800 rounded-sm p-0.5 flex items-center">
                <div className="bg-neutral-800 h-full w-full rounded-[2px]"></div>
              </div>
            </div>
          </header>

          <div className="md:px-12 md:py-10 max-w-6xl mx-auto w-full">
            {/* User Profile Header */}
            <section className="mt-4 px-5 md:px-0 flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#183B36] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-[17px] md:text-2xl font-semibold text-gray-900 leading-tight">{t.goodMorning}</h1>
                  <div className="flex items-center space-x-1.5 mt-0.5 md:mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
                    <span className="text-xs md:text-sm text-stone-500 font-normal">{t.offlineSync}</span>
                  </div>
                </div>
              </div>
              
              {/* Exit Action Button (Hidden on Desktop, moved to top nav) */}
              <Link href="/register" className="md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path>
                </svg>
                <span>{t.exit}</span>
              </Link>
            </section>

            <div className="md:flex md:gap-8 md:mt-8">
              {/* Safety Hero Card */}
              <section className="mt-4 md:mt-0 px-5 md:px-0 md:w-5/12 shrink-0">
                <div className="bg-[#183B36] rounded-[22px] md:rounded-3xl p-5 md:p-8 text-white shadow-md md:h-full flex flex-col justify-center">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="inline-flex items-center space-x-1.5 bg-[#254F49] text-stone-200 px-2.5 py-1 rounded-full text-[11px] md:text-[13px] font-medium">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{t.nextCheckin}</span>
                    </div>
                    <span className="text-[11px] md:text-[13px] font-bold tracking-wider text-amber-400">
                      {isCheckedIn ? "CHECKED IN" : checkInTimeStr === 'IN 2 HOURS' ? t.in2Hours : checkInTimeStr}
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-3xl font-semibold mt-4 md:mt-6 tracking-tight">{t.safeToday}</h2>
                  <p className="text-xs md:text-sm text-stone-300 mt-1 md:mt-3 leading-relaxed pr-2">
                    {t.guardianDesc}
                  </p>
                  
                  <div className="mt-5 md:mt-8 pt-1 grid grid-cols-2 gap-2.5 md:gap-4">
                    <button onClick={handleCheckIn} className={`w-full transition-colors font-semibold text-xs md:text-sm py-3 md:py-4 px-3 rounded-xl md:rounded-2xl flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 ${isCheckedIn ? 'bg-emerald-600 text-white' : 'bg-[#D9913D] hover:bg-[#C58032] text-stone-900'}`} type="button">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-current stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                      </svg>
                      <span>{isCheckedIn ? 'Safe Confirmed' : t.imSafe}</span>
                    </button>
                    <button onClick={handleChangeTime} className="w-full bg-[#254F49] hover:bg-[#2F5D56] transition-colors text-white text-xs md:text-sm font-medium py-3 md:py-4 px-3 rounded-xl md:rounded-2xl flex items-center justify-center space-x-1.5 active:scale-95" type="button">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path>
                      </svg>
                      <span>{t.changeTime}</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="flex-1 flex flex-col justify-between">
                {/* Action Grid Section */}
                <section className="mt-5 md:mt-0 px-5 md:px-0">
                  <div className="flex items-center justify-between mb-3 md:mb-5">
                    <h3 className="text-[15px] md:text-lg font-semibold text-gray-900">{t.whatNeed}</h3>
                    <Link href="/assistant" className="text-xs md:text-sm font-medium text-[#183B36] hover:underline flex items-center space-x-1">
                      <span>{t.listen}</span>
                    </Link>
                  </div>
                  
                  {/* Grid transforms from 2x2 on mobile to 2x2 on desktop with larger cards */}
                  <div className="grid grid-cols-2 gap-3 md:gap-5">
                    {/* Card 1 */}
                    <Link href="/trust" className="bg-white p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]">
                      <div className="flex items-start justify-between w-full">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-teal-50 flex items-center justify-center text-[#183B36]">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
                          </svg>
                        </div>
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
                        </svg>
                      </div>
                      <div className="mt-3 md:mt-5">
                        <span className="block text-xs md:text-sm font-semibold text-gray-900 leading-tight">{t.checkAgency}</span>
                        <span className="block text-[10.5px] md:text-xs text-stone-400 mt-1 md:mt-1.5 font-normal">{t.searchRegistry}</span>
                      </div>
                    </Link>
                    
                    {/* Card 2 */}
                    <Link href="/assistant" className="bg-white p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]">
                      <div className="flex items-start justify-between w-full">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-50 flex items-center justify-center text-amber-700">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-700" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"></path>
                          </svg>
                        </div>
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
                        </svg>
                      </div>
                      <div className="mt-3 md:mt-5">
                        <span className="block text-xs md:text-sm font-semibold text-gray-900 leading-tight">{t.readContract}</span>
                        <span className="block text-[10.5px] md:text-xs text-stone-400 mt-1 md:mt-1.5 font-normal">{t.cameraVoice}</span>
                      </div>
                    </Link>
                    
                    {/* Card 3 */}
                    <Link href="/records" className="bg-white p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]">
                      <div className="flex items-start justify-between w-full">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                          </svg>
                        </div>
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
                        </svg>
                      </div>
                      <div className="mt-3 md:mt-5">
                        <span className="block text-xs md:text-sm font-semibold text-gray-900 leading-tight">{t.recordPayment}</span>
                        <span className="block text-[10.5px] md:text-xs text-stone-400 mt-1 md:mt-1.5 font-normal">{t.wageHistory}</span>
                      </div>
                    </Link>
                    
                    {/* Card 4 */}
                    <Link href="/assistant" className="bg-white p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]">
                      <div className="flex items-start justify-between w-full">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path>
                          </svg>
                        </div>
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
                        </svg>
                      </div>
                      <div className="mt-3 md:mt-5">
                        <span className="block text-xs md:text-sm font-semibold text-gray-900 leading-tight">{t.getHelp}</span>
                        <span className="block text-[10.5px] md:text-xs text-stone-400 mt-1 md:mt-1.5 font-normal">{t.hotlines}</span>
                      </div>
                    </Link>
                  </div>
                </section>

                {/* Portable Record Banner */}
                <section className="mt-4 md:mt-6 px-5 md:px-0">
                  <Link href="/records" className="w-full block bg-white p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 hover:border-stone-200 transition-all active:scale-[0.98]">
                    <div className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-3.5 md:space-x-5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-teal-50 flex items-center justify-center text-[#183B36]">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900">{t.portableRecord}</h4>
                          <p className="text-[11px] md:text-xs text-stone-400 mt-0.5 md:mt-1">{t.savedDocs}</p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-stone-400 mr-1 md:mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                      </svg>
                    </div>
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Mic Button (Keeps its position on mobile, scales on desktop) */}
        <div className="absolute right-5 bottom-20 md:right-12 md:bottom-12 z-20">
          <Link href="/assistant" aria-label="Voice command" className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#D9913D] hover:bg-[#C58032] text-stone-900 flex items-center justify-center shadow-[0_4px_14px_rgba(217,145,61,0.45)] border-2 md:border-4 border-white transition-transform active:scale-95">
            <svg className="w-6 h-6 md:w-8 md:h-8 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"></path>
            </svg>
          </Link>
        </div>

        {/* Mobile iOS Tab Bar (Hidden on Desktop) */}
        <nav className="md:hidden bg-white border-t border-stone-200/80 px-6 py-2 pb-5 flex justify-between items-center z-10 absolute bottom-0 w-full">
          <Link className="flex flex-col items-center group" href="/home">
            <div className="w-14 h-7 rounded-full bg-teal-50 flex items-center justify-center text-[#183B36]">
              <svg className="w-5 h-5 text-[#183B36]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-[#183B36] mt-0.5">{t.home}</span>
          </Link>
          <Link className="flex flex-col items-center text-stone-400 hover:text-stone-600 transition-colors" href="/trust">
            <div className="w-14 h-7 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-0.5">{t.trust}</span>
          </Link>
          <Link className="flex flex-col items-center text-stone-400 hover:text-stone-600 transition-colors" href="/records">
            <div className="w-14 h-7 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-0.5">{t.records}</span>
          </Link>
          <Link className="flex flex-col items-center text-stone-400 hover:text-stone-600 transition-colors" href="/safety">
            <div className="w-14 h-7 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
              </svg>
            </div>
            <span className="text-[10px] font-medium mt-0.5">{t.safety}</span>
          </Link>
        </nav>
        
        {/* Time Settings Modal */}
        {showTimeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Set Check-in Time</h3>
              <p className="text-sm text-stone-500">Choose when you want your next safety check-in to be due.</p>
              
              <input 
                type="datetime-local" 
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="flex-1 py-3 px-4 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTime}
                  className="flex-1 py-3 px-4 bg-[#183B36] text-white font-medium rounded-xl hover:bg-[#254F49] transition-colors"
                >
                  Save Time
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
