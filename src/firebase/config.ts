'use client';

const requiredEnvSets = {
  apiKey: ['NEXT_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'],
  authDomain: ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'],
  projectId: ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID', 'GCLOUD_PROJECT'],
  storageBucket: ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: [
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_MESSAGING_SENDER_ID',
  ],
  appId: ['NEXT_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID'],
} as const;

const missing: string[] = [];

function readEnv(keys: readonly string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  missing.push(keys[0]);
  return undefined;
}

const apiKey = readEnv(requiredEnvSets.apiKey);
const authDomain = readEnv(requiredEnvSets.authDomain);
const projectId = readEnv(requiredEnvSets.projectId);
const storageBucket = readEnv(requiredEnvSets.storageBucket);
const messagingSenderId = readEnv(requiredEnvSets.messagingSenderId);
const appId = readEnv(requiredEnvSets.appId);

if (missing.length) {
  throw new Error(`Missing required Firebase config: ${missing.join(', ')}`);
}

export const firebaseConfig = {
  apiKey: apiKey!,
  authDomain: authDomain!,
  projectId: projectId!,
  storageBucket: storageBucket!,
  messagingSenderId: messagingSenderId!,
  appId: appId!,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
};
