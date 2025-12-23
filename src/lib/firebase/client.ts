'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

export type ClientFirebase = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function getClientFirebase(): ClientFirebase {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export async function getCurrentUserToken(auth: Auth): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user found for token retrieval.');
  }
  return currentUser.getIdToken();
}

