import { extractBearerToken, verifyIdToken } from '../firebase/admin.js';

/**
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<Awaited<ReturnType<typeof verifyIdToken>>>}
 */
export async function requireUserFromRequest(request) {
  const token = extractBearerToken(request.headers.get('authorization'));
  return verifyIdToken(token);
}
