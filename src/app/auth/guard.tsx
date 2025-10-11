
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // AUTH TEMPORARILY DISABLED
  // The original authentication logic has been commented out to allow
  // access to the application without requiring a login.
  
  /*
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) return; // Wait for user status to be determined

    if (!user && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    } else if (user && (pathname === '/login' || pathname === '/register')) {
      router.replace('/');
    }
  }, [user, isUserLoading, router, pathname]);

  const showLoader = isUserLoading || (!user && pathname !== '/login' && pathname !== '/register') || (user && (pathname === '/login' || pathname === '/register'));

  if (showLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  */

  return <>{children}</>;
}

    