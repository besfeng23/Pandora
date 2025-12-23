
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (!user && !isAuthPage) {
      router.replace('/login');
    }

    if (user && isAuthPage) {
      router.replace('/');
    }
  }, [isUserLoading, pathname, router, user]);

  const shouldBlockContent = () => {
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isUserLoading) return true;
    if (!user && !isAuthPage) return true;
    if (user && isAuthPage) return true;
    return false;
  };

  if (shouldBlockContent()) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

    
