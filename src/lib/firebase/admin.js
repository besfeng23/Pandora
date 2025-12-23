import crypto from 'crypto';

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCerts = null;
let certsExpiry = 0;

function base64UrlDecode(segment) {
  return Buffer.from(segment.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

async function fetchCertificates() {
  const now = Date.now();
  if (cachedCerts && now < certsExpiry) return cachedCerts;

  const response = await fetch(CERTS_URL);
  if (!response.ok) {
    throw new Error(`Unable to download Firebase signing certificates (${response.status})`);
  }

  const cacheControl = response.headers.get('cache-control');
  const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
  const maxAgeMs = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 5 * 60 * 1000;
  certsExpiry = now + maxAgeMs;

  cachedCerts = await response.json();
  return cachedCerts;
}

function verifySignature(token, cert) {
  const [headerSegment, payloadSegment, signatureSegment] = token.split('.');
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerSegment}.${payloadSegment}`);
  verifier.end();

  const signature = Buffer.from(signatureSegment.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  return verifier.verify(cert, signature);
}

function decodeJwt(token) {
  const [headerSegment, payloadSegment] = token.split('.');
  if (!headerSegment || !payloadSegment) {
    throw new Error('Invalid ID token format');
  }
  return {
    header: JSON.parse(base64UrlDecode(headerSegment)),
    payload: JSON.parse(base64UrlDecode(payloadSegment)),
  };
}

export function extractBearerToken(authHeader) {
  if (!authHeader) return null;
  const trimmed = authHeader.trim();
  return trimmed.startsWith('Bearer ') ? trimmed.slice(7) : null;
}

export async function verifyIdToken(idToken) {
  if (!idToken) {
    throw new Error('Missing Authorization token');
  }

  if (process.env.NODE_ENV === 'test' && process.env.TEST_BYPASS_FIREBASE_AUTH === 'true') {
    return { user_id: 'test-user', aud: 'test-project', iss: 'test-issuer' };
  }

  const { header, payload } = decodeJwt(idToken);
  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Unsupported token header.');
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Missing Firebase project ID for token verification.');
  }

  const certs = await fetchCertificates();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error('Unable to find matching certificate for token.');
  }

  if (!verifySignature(idToken, cert)) {
    throw new Error('Token signature verification failed.');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSeconds) {
    throw new Error('Token expired.');
  }

  const expectedIssuer = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== expectedIssuer || payload.aud !== projectId) {
    throw new Error('Token issuer/audience mismatch.');
  }

  return payload;
}

