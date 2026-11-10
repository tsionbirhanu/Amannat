'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, safety, checkInNow } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import AppShell from '@/components/AppShell';
import { Badge, Button, Icon, ListLink, SectionTitle, inputClass } from '@/components/ui';

const parseUtc = (iso) => new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);

function relativeLabel(iso) {
  if (!iso) return 'NOT SCHEDULED';
  const mins = Math.round((parseUtc(iso) - Date.now()) / 60000);
  if (mins <= 0) return 'DUE NOW';
  if (mins < 60) return `IN ${mins} MIN`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `IN ${hrs} HOUR${hrs === 1 ? '' : 'S'}`;
  const days = Math.round(hrs / 24);
  return `IN ${days} DAY${days === 1 ? '' : 'S'}`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

const nextPendingOf = (list) =>
  list
    .filter((c) => c.status === 'pending')
    .sort((a, b) => parseUtc(a.scheduled_at) - parseUtc(b.scheduled_at))[0];

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
      exit: 'Exit',
      adjustCheckinTitle: 'Adjust check-in time',
      adjustCheckinDesc: 'Choose when you want your next safety check-in to be due.',
      in1Hour: 'In 1 hour',
      in2Hours: 'In 2 hours',
      in4Hours: 'In 4 hours',
      in8Hours: 'In 8 hours',
      tomorrow24h: 'Tomorrow (+24h)',
      customTimePrompt: 'Or pick a custom date and time:',
      saveNewTime: 'Set time',
      cancel: 'Cancel',
      timeUpdated: 'Check-in time updated',
      confirmSafetyPrompt: 'Are you safe right now?',
      confirmSafetyDesc: 'Confirming your safety lets your guardians know you are doing well.',
      yesImSafe: "Yes, I'm safe",
      confirmLater: "I'll confirm later"
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
      exit: 'ውጣ',
      adjustCheckinTitle: 'የማረጋገጫ ሰዓትን ያስተካክሉ',
      adjustCheckinDesc: 'ቀጣዩ የደህንነት ማረጋገጫዎ መቼ እንዲሆን እንደሚፈልጉ ይምረጡ።',
      in1Hour: 'በ1 ሰዓት ውስጥ',
      in2Hours: 'በ2 ሰዓታት ውስጥ',
      in4Hours: 'በ4 ሰዓታት ውስጥ',
      in8Hours: 'በ8 ሰዓታት ውስጥ',
      tomorrow24h: 'ነገ (+24 ሰዓት)',
      customTimePrompt: 'ወይም የተለየ ቀን እና ሰዓት ይምረጡ:',
      saveNewTime: 'ሰዓቱን አዘጋጅ',
      cancel: 'ይቅር',
      timeUpdated: 'የማረጋገጫ ሰዓቱ ተቀይሯል',
      confirmSafetyPrompt: 'አሁን ደህና ነዎት?',
      confirmSafetyDesc: 'አሁን ደህንነትዎን ማረጋገጥ ለአሳዳጊዎችዎ ደህና መሆንዎን ያሳውቃል።',
      yesImSafe: 'አዎ፣ ደህና ነኝ',
      confirmLater: 'በኋላ አረጋግጣለሁ'
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
      exit: 'Bahi',
      adjustCheckinTitle: 'Yeroo mirkaneeffannaa sirreessi',
      adjustCheckinDesc: 'Mirkaneeffannaan nageenyaa itti aanu yoom akka ta\'u filadhu.',
      in1Hour: 'Sa\'aatii 1 keessatti',
      in2Hours: 'Sa\'aatii 2 keessatti',
      in4Hours: 'Sa\'aatii 4 keessatti',
      in8Hours: 'Sa\'aatii 8 keessatti',
      tomorrow24h: 'Boru (+sa\'aatii 24)',
      customTimePrompt: 'Yookiin guyyaa fi yeroo filadhu:',
      saveNewTime: 'Yeroo galmeessi',
      cancel: 'Dhiisi',
      timeUpdated: 'Yeroon mirkaneeffannaa haaromeera',
      confirmSafetyPrompt: 'Amma nagaadhaa?',
      confirmSafetyDesc: 'Amma nageenya kee mirkaneessuun guddistoota keetti nagaa ta\'uu kee beeksisa.',
      yesImSafe: 'Eeyyee, nagaadha',
      confirmLater: 'Booda mirkaneessa'
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
      exit: 'خروج',
      adjustCheckinTitle: 'تعديل وقت تسجيل الدخول',
      adjustCheckinDesc: 'اختر متى تريد أن يكون تسجيل التحقق من السلامة التالي.',
      in1Hour: 'خلال ساعة واحدة',
      in2Hours: 'خلال ساعتين',
      in4Hours: 'خلال 4 ساعات',
      in8Hours: 'خلال 8 ساعات',
      tomorrow24h: 'غداً (+24 ساعة)',
      customTimePrompt: 'أو حدد تاريخاً ووقتاً مخصصاً:',
      saveNewTime: 'حفظ الوقت',
      cancel: 'إلغاء',
      timeUpdated: 'تم تحديث وقت التحقق',
      confirmSafetyPrompt: 'هل أنت آمن الآن؟',
      confirmSafetyDesc: 'تأكيد سلامتك يتيح للأوصياء معرفة أنك بخير.',
      yesImSafe: 'نعم، أنا آمن',
      confirmLater: 'سأؤكد لاحقاً'
    }
  };

  const t = translations[language] || translations['English'];
  const ready = useRequireAuth();
  const [workerCode, setWorkerCode] = useState('');
  const [nextCheckin, setNextCheckin] = useState(null);
  const [online, setOnline] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [notice, setNotice] = useState('');

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [modalStep, setModalStep] = useState('time'); // 'time' | 'safety'
  const [customDateTime, setCustomDateTime] = useState('');
  const [editedTimeDisplay, setEditedTimeDisplay] = useState('');
  const [savingTime, setSavingTime] = useState(false);

  const openChangeTimeModal = () => {
    setModalStep('time');
    const d = new Date(Date.now() + 2 * 3600 * 1000);
    const offset = d.getTimezoneOffset() * 60000;
    const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
    setCustomDateTime(localIso);
    setShowTimeModal(true);
  };

  const handleApplyTime = async (hoursOrDate) => {
    setSavingTime(true);
    let targetDate;
    if (typeof hoursOrDate === 'number') {
      targetDate = new Date(Date.now() + hoursOrDate * 3600 * 1000);
    } else {
      targetDate = new Date(hoursOrDate);
    }

    if (Number.isNaN(targetDate.getTime())) {
      setSavingTime(false);
      return;
    }

    try {
      const list = await safety.setCustomTime(targetDate.toISOString());
      setNextCheckin(nextPendingOf(list));
    } catch {
      setNextCheckin({ scheduled_at: targetDate.toISOString(), status: 'pending' });
    } finally {
      setSavingTime(false);
      setEditedTimeDisplay(
        targetDate.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
      );
      setModalStep('safety');
    }
  };

  const handleConfirmSafetyInModal = async () => {
    await handleSafe();
    setTimeout(() => {
      setShowTimeModal(false);
      setModalStep('time');
    }, 700);
  };

  const handleDismissModal = () => {
    setShowTimeModal(false);
    setModalStep('time');
  };

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    Promise.all([auth.me(), safety.checkins()])
      .then(([me, checkins]) => {
        if (cancelled) return;
        // Short private code: last 3 characters of the worker id
        setWorkerCode((me.id || '').slice(-3).toUpperCase());
        setNextCheckin(nextPendingOf(checkins));
        setOnline(true);
      })
      .catch(() => !cancelled && setOnline(false));
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const handleSafe = async () => {
    setCheckingIn(true);
    setNotice('');
    try {
      await checkInNow();
      setNextCheckin(nextPendingOf(await safety.checkins()));
      setNotice('Checked in. Thank you — stay safe.');
    } catch (err) {
      setNotice(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  if (!ready) return null;

  const greetingText = language === 'English' ? greeting() : t.goodMorning.split(/[,،]/)[0];

  return (
    <AppShell>
      <header className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
          {greetingText}{workerCode ? `, ${workerCode}` : ''}
        </h1>
        {online !== null && (
          <Badge tone={online ? 'success' : 'warning'} icon={online ? 'cloud_done' : 'cloud_off'}>
            {online ? 'Connected' : t.offlineSync}
          </Badge>
        )}
      </header>

      {/* Daily check-in */}
      <section className="rounded-3xl bg-brand-800 text-white p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-100">
            <Icon name="schedule" className="text-[18px]" />
            {t.nextCheckin}
          </span>
          <span className="text-sm font-bold tracking-wide text-accent-400">{relativeLabel(nextCheckin?.scheduled_at)}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-5">{t.safeToday}</h2>
        <p className="text-[15px] text-brand-100 mt-2 max-w-md">{t.guardianDesc}</p>
        {notice && <p role="status" className="text-[15px] font-medium text-accent-400 mt-4">{notice}</p>}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="accent" icon="check" onClick={handleSafe} disabled={checkingIn}>
            {checkingIn ? 'Saving…' : t.imSafe}
          </Button>
          <Button
            type="button"
            icon="edit_calendar"
            onClick={openChangeTimeModal}
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
          >
            {t.changeTime}
          </Button>
        </div>
      </section>

      {/* Main actions */}
      <section className="mt-8">
        <SectionTitle>{t.whatNeed}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ListLink href="/trust" icon="verified" title={t.checkAgency} subtitle={t.searchRegistry} />
          <ListLink href="/records" icon="description" title={t.readContract} subtitle={t.cameraVoice} />
          <ListLink href="/review" icon="payments" title={t.recordPayment} subtitle={t.wageHistory} />
          <ListLink href="/safety" icon="sos" title={t.getHelp} subtitle={t.hotlines} tone="danger" />
        </div>
      </section>

      {/* Assistant */}
      <Link
        href="/assistant"
        className="mt-3 flex items-center gap-4 p-4 rounded-2xl bg-accent-50 border border-accent-100 hover:bg-accent-100 transition-colors"
      >
        <span className="w-11 h-11 rounded-full bg-accent-500 text-stone-900 flex items-center justify-center shrink-0">
          <Icon name="mic" filled className="text-[22px]" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-semibold text-stone-900">{t.voxide || 'Voxide'}</span>
          <span className="block text-sm text-stone-600">Ask by voice or text</span>
        </span>
        <Icon name="chevron_right" className="text-[22px] text-stone-400 rtl:rotate-180" />
      </Link>

      {/* Time Adjustment & Safety Confirmation Modal */}
      {showTimeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl p-6 md:p-7 w-full max-w-md shadow-2xl border border-sand-200">
            {modalStep === 'time' ? (
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-stone-900">
                    <span className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center">
                      <Icon name="schedule" className="text-[20px]" />
                    </span>
                    <h3 className="text-lg md:text-xl font-bold">{t.adjustCheckinTitle}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleDismissModal}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-sand-100"
                    aria-label="Close"
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>

                <p className="text-sm text-stone-600 mb-5">{t.adjustCheckinDesc}</p>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <button
                    type="button"
                    onClick={() => handleApplyTime(1)}
                    disabled={savingTime}
                    className="p-3 rounded-2xl border border-sand-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
                  >
                    <span>{t.in1Hour}</span>
                    <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">+1h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTime(2)}
                    disabled={savingTime}
                    className="p-3 rounded-2xl border border-sand-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
                  >
                    <span>{t.in2Hours}</span>
                    <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">+2h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTime(4)}
                    disabled={savingTime}
                    className="p-3 rounded-2xl border border-sand-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
                  >
                    <span>{t.in4Hours}</span>
                    <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">+4h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTime(8)}
                    disabled={savingTime}
                    className="p-3 rounded-2xl border border-sand-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
                  >
                    <span>{t.in8Hours}</span>
                    <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">+8h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTime(24)}
                    disabled={savingTime}
                    className="col-span-2 p-3 rounded-2xl border border-sand-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
                  >
                    <span>{t.tomorrow24h}</span>
                    <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">+24h</span>
                  </button>
                </div>

                {/* Custom Date & Time Picker */}
                <div className="pt-3 border-t border-sand-200">
                  <label htmlFor="custom-checkin-time" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
                    {t.customTimePrompt}
                  </label>
                  <input
                    id="custom-checkin-time"
                    type="datetime-local"
                    value={customDateTime}
                    onChange={(e) => setCustomDateTime(e.target.value)}
                    className={`${inputClass} mb-4`}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={handleDismissModal} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button
                      variant="primary"
                      icon="check"
                      onClick={() => handleApplyTime(customDateTime)}
                      disabled={savingTime || !customDateTime}
                      className="flex-1"
                    >
                      {savingTime ? 'Saving…' : t.saveNewTime}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-accent-100 text-stone-900 mx-auto flex items-center justify-center mb-4">
                  <Icon name="check_circle" filled className="text-[32px] text-brand-800" />
                </div>
                <Badge tone="success" className="mb-3">
                  {t.timeUpdated}: {editedTimeDisplay}
                </Badge>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">{t.confirmSafetyPrompt}</h3>
                <p className="text-[15px] text-stone-600 mb-6 max-w-xs mx-auto leading-relaxed">
                  {t.confirmSafetyDesc}
                </p>
                <div className="flex flex-col gap-2.5">
                  <Button
                    variant="accent"
                    icon="check"
                    onClick={handleConfirmSafetyInModal}
                    disabled={checkingIn}
                    className="w-full h-12 text-base font-bold"
                  >
                    {checkingIn ? 'Saving…' : t.yesImSafe}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDismissModal}
                    className="w-full text-stone-600 hover:text-stone-900"
                  >
                    {t.confirmLater}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
