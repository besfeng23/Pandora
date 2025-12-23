import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from './route.js';

describe('protected route auth', () => {
  before(() => {
    process.env.NODE_ENV = 'test';
    process.env.TEST_BYPASS_FIREBASE_AUTH = 'true';
  });

  it('returns 401 when no token is provided', async () => {
    const request = { headers: new Headers() } as any;
    const response = await GET(request);
    assert.equal(response.status, 401);
  });

  it('returns 200 when a token is provided', async () => {
    const request = {
      headers: new Headers({
        Authorization: 'Bearer test-token',
      }),
    } as any;
    const response = await GET(request);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.status, 'ok');
  });
});
