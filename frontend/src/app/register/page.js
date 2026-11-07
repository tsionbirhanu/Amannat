'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { quickExit } from '@/components/AppShell';
import { Button, Icon, Notice, inputClass } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const { language: selectedLang, setLanguage: setSelectedLang } = useLanguage();
  // 'lang' -> choose language, 'phone' -> enter phone, 'code' -> enter OTP
  const [step, setStep] = useState('lang');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  // Set when the number isn't linked to the Telegram bot yet: { message, botUrl }
  const [telegramLink, setTelegramLink] = useState(null);
  // { enabled, bot_url } from the backend: are codes delivered through Telegram?
  const [telegram, setTelegram] = useState(null);

  useEffect(() => {
    let cancelled = false;
    auth.telegramInfo().then((t) => !cancelled && setTelegram(t)).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContinue = () => {
    // The selected language is already saved by LanguageContext (amannat_lang)
    setError('');
    setStep('phone');
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!phone.trim()) return setError('Please enter your phone number.');
    setBusy(true);
    setError('');
    try {
      const res = await auth.requestOtp(phone.trim());
      setTelegramLink(null);
      setInfo(
        res.channel === 'telegram'
          ? 'We sent a 6-digit code to your Telegram. Open the Amannat bot to see it.'
          : 'Development mode: the 6-digit code is printed in the backend terminal.'
      );
      setStep('code');
    } catch (err) {
      if (err.detail?.code === 'telegram_not_linked') {
        setTelegramLink({ message: err.detail.message, botUrl: err.detail.bot_url });
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return setError('Please enter the code.');
    setBusy(true);
    setError('');
    try {
      await auth.verifyOtp(phone.trim(), code.trim());
      router.push('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
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


  const stepIndex = { lang: 0, phone: 1, code: 2 }[step];
  const stepTitles = [t.chooseLanguage, 'Your phone number', 'Enter your code'];

  return (
    <div className="min-h-[100dvh] bg-sand-50 flex flex-col md:flex-row" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Brand panel */}
      <aside className="bg-brand-800 text-white px-6 pt-6 pb-8 md:w-[42%] md:p-12 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Icon name="verified_user" filled className="text-[22px] text-accent-400" />
            </span>
            <span className="text-xl font-bold tracking-tight">Amannat</span>
          </span>
          <button
            type="button"
            onClick={quickExit}
            title="Leave immediately and open a neutral page"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20"
          >
            <Icon name="logout" className="text-[18px]" />
            {t.exit}
          </button>
        </div>
        <div className="mt-8 md:mt-auto md:mb-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{t.tagline}</h1>
        </div>
      </aside>

      {/* Steps */}
      <main className="flex-1 flex items-start md:items-center justify-center px-4 py-8 md:p-12">
        <div className="w-full max-w-md">
          <ol aria-label="Progress" className="flex items-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <li key={i} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-brand-600' : 'bg-sand-200'}`}>
                <span className="sr-only">Step {i + 1}{i === stepIndex ? ' (current)' : ''}</span>
              </li>
            ))}
          </ol>

          <h2 className="text-2xl font-bold text-stone-900">{stepTitles[stepIndex]}</h2>

          {step === 'lang' && (
            <>
              <fieldset className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <legend className="sr-only">{t.chooseLanguage}</legend>
                {languages.map((lang) => {
                  const selected = selectedLang === lang.name;
                  return (
                    <label
                      key={lang.id}
                      className={`flex items-center gap-3 h-14 px-4 rounded-xl border bg-white cursor-pointer transition-colors ${
                        selected ? 'border-brand-600 ring-1 ring-brand-600 bg-brand-50' : 'border-sand-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang.name}
                        checked={selected}
                        onChange={() => setSelectedLang(lang.name)}
                        className="w-5 h-5 text-brand-700 border-stone-400 focus:ring-brand-500"
                      />
                      <span className={`text-base ${selected ? 'font-semibold text-stone-900' : 'text-stone-800'}`}>{lang.name}</span>
                    </label>
                  );
                })}
              </fieldset>
              <Button className="w-full mt-6" icon="arrow_forward" onClick={handleContinue}>
                {t.continueIn} {selectedLang}
              </Button>
            </>
          )}

          {step !== 'lang' && (
            <form onSubmit={step === 'phone' ? handleRequestOtp : handleVerify} className="mt-2">
              <p className="text-[15px] text-stone-600">
                {step === 'phone'
                  ? telegram?.enabled
                    ? 'Your login code is sent free to your Telegram. Use the number your Telegram uses, with the country code.'
                    : 'Enter your number with the country code. We send you a one-time code.'
                  : info || `Enter the 6-digit code sent to ${phone}.`}
              </p>

              <div className="mt-5">
                {step === 'phone' ? (
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    autoFocus
                    aria-label="Phone number"
                    placeholder="+251 9xx xxx xxx"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setTelegramLink(null); }}
                    className={`${inputClass} h-14 text-lg`}
                  />
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    aria-label="6-digit code"
                    maxLength={6}
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className={`${inputClass} h-14 text-2xl tracking-[0.5em] text-center font-semibold`}
                  />
                )}
              </div>

              {step === 'phone' && telegram?.enabled && telegram.bot_url && !telegramLink && (
                <p className="text-sm text-stone-500 mt-3">
                  First time?{' '}
                  <a href={telegram.bot_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline">
                    Link your number in Telegram
                  </a>
                </p>
              )}

              {error && <Notice tone="error" className="mt-4">{error}</Notice>}

              {step === 'phone' && telegramLink && (
                <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
                  <p className="text-[15px] font-semibold text-stone-900">Link your number in Telegram</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-[15px] text-stone-700">
                    <li>Open the Amannat bot and press <b>Start</b>.</li>
                    <li>Tap <b>Share my phone number</b>.</li>
                    <li>Come back and tap <b>Send code</b>.</li>
                  </ol>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {telegramLink.botUrl && (
                      <Button href={telegramLink.botUrl} variant="secondary" icon="send">Open Telegram</Button>
                    )}
                    <Button onClick={() => handleRequestOtp()} disabled={busy}>{busy ? 'Checking…' : 'Send code'}</Button>
                  </div>
                </div>
              )}

              {!(step === 'phone' && telegramLink) && (
                <Button type="submit" className="w-full mt-5" disabled={busy}>
                  {busy ? 'Please wait…' : step === 'phone' ? 'Send code' : 'Verify and continue'}
                </Button>
              )}

              <button
                type="button"
                onClick={() => { setError(''); setTelegramLink(null); setStep(step === 'code' ? 'phone' : 'lang'); }}
                className="w-full mt-3 h-11 text-[15px] font-semibold text-stone-600 hover:text-stone-900"
              >
                {step === 'code' ? 'Use a different number' : 'Back'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
