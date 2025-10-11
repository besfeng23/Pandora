
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) return; // Wait for user status to be determined

    if (!user && pathname !== '/login') {
      router.replace('/login');
    } else if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [user, isUserLoading, router, pathname]);

  // Show a loader if we are still determining the auth state, or if a redirect is imminent.
  const showLoader = isUserLoading || (!user && pathname !== '/login') || (user && pathname === '/login');

  if (showLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

    