'use client';
// Mounted once in the root layout.
// - Keeps the Voxide agent pointed at the current Next.js router and page, so its
//   `navigate` capability and page-scoped context stay correct.
// - A voice session survives page changes (the agent can move the worker between
//   pages mid-conversation). While one is live outside /assistant, show a small
//   pill so the worker always knows the mic is on and can stop it.
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useVoxideVoice } from '@voxide/react';
import { getVoxide, setVoxideRouter } from '@/lib/voxide';

const LIVE = new Set(['connecting', 'listening', 'thinking', 'speaking', 'executing']);
const LABEL = {
  connecting: 'Connecting…',
  listening: 'Listening',
  thinking: 'Thinking…',
  speaking: 'Speaking',
  executing: 'Working…',
};

export default function VoxideSession() {
  const router = useRouter();
  const pathname = usePathname();
  const ai = useMemo(() => getVoxide(), []);
  const { status, disconnect } = useVoxideVoice(ai);

  useEffect(() => {
    setVoxideRouter(router);
  }, [router]);

  useEffect(() => {
    ai?.setActiveRoute(pathname);
  }, [ai, pathname]);

  if (!ai || !LIVE.has(status) || pathname === '/assistant') return null;

  return (
    <div
      role="status"
      className="fixed z-50 left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-[#133e36] text-white shadow-lg text-xs md:text-sm"
    >
      <span className="w-2 h-2 rounded-full bg-[#dca14c] animate-pulse" aria-hidden="true"></span>
      <span>Voxide • {LABEL[status]}</span>
      <button
        type="button"
        onClick={disconnect}
        className="ml-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 font-semibold"
      >
        Stop
      </button>
    </div>
  );
}
