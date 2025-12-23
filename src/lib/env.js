import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_API_KEY is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_APP_ID is required'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const serverSchema = z.object({
  FIREBASE_SERVICE_ACCOUNT_KEY: z
    .string()
    .min(1, 'FIREBASE_SERVICE_ACCOUNT_KEY is required for server-side auth verification'),
});

function formatIssues(issues) {
  return issues.map(issue => issue.message).join('; ');
}

const isProduction = process.env.NODE_ENV === 'production';

export function getClientEnv() {
  const defaults = isProduction
    ? {}
    : {
        NEXT_PUBLIC_FIREBASE_API_KEY: 'local-key',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'local-domain.firebaseapp.com',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'local-project',
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'local-bucket',
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'local-sender',
        NEXT_PUBLIC_FIREBASE_APP_ID: 'local-app-id',
      };

  const parsed = clientSchema.safeParse({ ...defaults, ...process.env });
  if (!parsed.success) {
    throw new Error(`Firebase client env invalid: ${formatIssues(parsed.error.issues)}`);
  }
  return parsed.data;
}

export function getServerEnv() {
  const defaults = isProduction ? {} : { FIREBASE_SERVICE_ACCOUNT_KEY: 'local-key' };
  const parsed = serverSchema.safeParse({ ...defaults, ...process.env });
  if (!parsed.success) {
    throw new Error(`Firebase server env invalid: ${formatIssues(parsed.error.issues)}`);
  }
  return parsed.data;
}

export function parseServiceAccountKey(raw) {
  const material = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const parsed = JSON.parse(material);
  const serviceAccountSchema = z.object({
    project_id: z.string(),
    private_key: z.string(),
    client_email: z.string(),
  });
  const result = serviceAccountSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT_KEY: ${formatIssues(result.error.issues)}`);
  }
  return result.data;
}

