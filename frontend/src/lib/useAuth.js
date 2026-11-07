'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from './api';

const subscribe = (cb) => {
  window.addEventListener('storage', cb);
  return () => window.removeEventListener('storage', cb);
};

/**
 * Redirects to /register when there is no saved login token.
 * Returns true once the user is known to be logged in (false during SSR / before check).
 */
export function useRequireAuth() {
  const router = useRouter();
  // null on the server, true/false in the browser
  const loggedIn = useSyncExternalStore(subscribe, isLoggedIn, () => null);

  useEffect(() => {
    if (loggedIn === false) router.replace('/register');
  }, [loggedIn, router]);

  return loggedIn === true;
}
