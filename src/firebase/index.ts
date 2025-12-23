
'use client';

import { getClientFirebase } from '@/lib/firebase/client';

export function initializeFirebase() {
  const { app, auth, firestore } = getClientFirebase();
  return {
    firebaseApp: app,
    auth,
    firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

    
