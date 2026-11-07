'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, safety, checkInNow } from '@/lib/api';
import { useRequireAuth } from '@/lib/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import AppShell from '@/components/AppShell';
import { Badge, Button, Icon, ListLink, SectionTitle } from '@/components/ui';

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
  const ready = useRequireAuth();
  const [workerCode, setWorkerCode] = useState('');
  const [nextCheckin, setNextCheckin] = useState(null);
  const [online, setOnline] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [notice, setNotice] = useState('');

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
          <Button href="/safety" icon="edit_calendar" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
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
    </AppShell>
  );
}
