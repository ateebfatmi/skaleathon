import crypto from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { signToken, verifyToken } from '../src/lib/auth/session';

describe('session token security', () => {
  const originalSecret = process.env.APP_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.APP_SECRET;
    else process.env.APP_SECRET = originalSecret;
  });

  it('accepts an authentic, unexpired token', () => {
    process.env.APP_SECRET = 'test_app_secret_that_is_at_least_32_chars';
    const token = signToken({ userId: 'user-123' });

    expect(verifyToken<{ userId: string }>(token)?.userId).toBe('user-123');
  });

  it('rejects a token whose payload or signature was changed', () => {
    process.env.APP_SECRET = 'test_app_secret_that_is_at_least_32_chars';
    const token = signToken({ userId: 'user-123' });
    const [payload, signature] = token.split('.');

    expect(verifyToken(`${payload}x.${signature}`)).toBeNull();
    expect(verifyToken(`${payload}.${signature.slice(0, -1)}x`)).toBeNull();
  });

  it('rejects an authentic but expired token', () => {
    const secret = 'test_app_secret_that_is_at_least_32_chars';
    process.env.APP_SECRET = secret;
    const payload = Buffer.from(
      JSON.stringify({ userId: 'user-123', exp: Math.floor(Date.now() / 1000) - 1 })
    ).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

    expect(verifyToken(`${payload}.${signature}`)).toBeNull();
  });
});
