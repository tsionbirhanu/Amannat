'use client';
// The frame around every signed-in page: top bar (desktop), header + bottom tabs
// (mobile), and a Quick exit that immediately replaces the app with a neutral page.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';
import { Icon } from './ui';

const QUICK_EXIT_URL = 'https://www.google.com';

// Which tab a route belongs to
const TAB_FOR_ROUTE = {
  '/home': 'home',
  '/trust': 'trust',
  '/records': 'records',
  '/review': 'records',
  '/safety': 'safety',
  '/incident': 'safety',
  '/assistant': 'assistant',
};

export function quickExit() {
  // replace() so the Back button doesn't return to Amannat
  window.location.replace(QUICK_EXIT_URL);
}

function BrandMark() {
  return (
    <Link href="/home" className="flex items-center gap-2.5 shrink-0">
      <span className="w-9 h-9 rounded-xl bg-brand-800 flex items-center justify-center">
        <Icon name="verified_user" filled className="text-[20px] text-accent-400" />
      </span>
      <span className="text-lg font-bold text-stone-900 tracking-tight">Amannat</span>
    </Link>
  );
}

function QuickExitButton({ label }) {
  return (
    <button
      type="button"
      onClick={quickExit}
      title="Leave immediately and open a neutral page"
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-semibold text-stone-700 bg-sand-100 hover:bg-sand-200"
    >
      <Icon name="logout" className="text-[18px]" />
      {label}
    </button>
  );
}

export default function AppShell({ children, wide = false }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language] || translations.English;
  const active = TAB_FOR_ROUTE[pathname];

  const tabs = [
    { id: 'home', href: '/home', icon: 'home', label: t.home },
    { id: 'trust', href: '/trust', icon: 'verified', label: t.trust },
    { id: 'records', href: '/records', icon: 'folder', label: t.recordsTitle },
    { id: 'safety', href: '/safety', icon: 'shield', label: t.safety },
  ];
  const quickExitLabel = 'Quick exit';

  return (
    <div className="min-h-[100dvh] bg-sand-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-sand-200">
        <div className="max-w-6xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-4">
          <BrandMark />
          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[15px] font-semibold transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-600 hover:text-stone-900 hover:bg-sand-100'
                  }`}
                >
                  <Icon name={tab.icon} filled={isActive} className="text-[20px]" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/assistant"
              className={`hidden md:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold ${
                active === 'assistant' ? 'bg-accent-500 text-stone-900' : 'bg-accent-50 text-accent-700 hover:bg-accent-100'
              }`}
            >
              <Icon name="mic" className="text-[18px]" />
              {t.voxide || 'Assistant'}
            </Link>
            <QuickExitButton label={quickExitLabel} />
          </div>
        </div>
      </header>

      <main className={`${wide ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-32 md:pb-16`}>
        {children}
      </main>

      {/* Bottom tabs (mobile) */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-sand-200 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16">
          {tabs.slice(0, 2).map((tab) => (
            <TabLink key={tab.id} tab={tab} active={active === tab.id} />
          ))}
          <Link href="/assistant" aria-label={t.voxide || 'Assistant'} className="flex items-center justify-center">
            <span
              className={`w-12 h-12 -mt-5 rounded-full flex items-center justify-center shadow-md ring-4 ring-white ${
                active === 'assistant' ? 'bg-brand-800 text-accent-400' : 'bg-accent-500 text-stone-900'
              }`}
            >
              <Icon name="mic" filled className="text-[24px]" />
            </span>
          </Link>
          {tabs.slice(2).map((tab) => (
            <TabLink key={tab.id} tab={tab} active={active === tab.id} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({ tab, active }) {
  return (
    <Link
      href={tab.href}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-col items-center justify-center gap-0.5 text-[12px] font-semibold ${active ? 'text-brand-800' : 'text-stone-500'}`}
    >
      <Icon name={tab.icon} filled={active} className="text-[24px]" />
      <span className="truncate max-w-full px-1">{tab.label}</span>
    </Link>
  );
}
