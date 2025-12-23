import { requireUserFromRequest } from '../../../lib/auth/require-user.js';

export async function GET(request) {
  try {
    const decoded = await requireUserFromRequest(request);
    return Response.json(
      {
        status: 'ok',
        uid: decoded.user_id || decoded.sub || 'unknown',
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { error: error?.message || 'Unauthorized' },
      { status: 401 },
    );
  }
}
