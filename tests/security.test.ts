import crypto from 'crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { signToken, verifyToken } from '../src/lib/auth/session';
import { isSafePublicHttpUrl, submissionSchema } from '../src/lib/validation/schemas';
import { checkRateLimit, checkRateLimitDistributed } from '../src/lib/security/rate-limit';
import { NextRequest } from 'next/server';

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

describe('URL and SSRF safety validation', () => {
  it('accepts safe public HTTPS URLs', () => {
    expect(isSafePublicHttpUrl('https://myproject.vercel.app')).toBe(true);
    expect(isSafePublicHttpUrl('https://youtube.com/watch?v=123')).toBe(true);
    expect(isSafePublicHttpUrl('')).toBe(true);
    expect(isSafePublicHttpUrl(undefined)).toBe(true);
  });

  it('rejects unsafe protocols and internal metadata IP addresses', () => {
    expect(isSafePublicHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafePublicHttpUrl('file:///etc/passwd')).toBe(false);
    expect(isSafePublicHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafePublicHttpUrl('http://169.254.169.254/latest/meta-data/')).toBe(false);
    expect(isSafePublicHttpUrl('http://localhost:3000')).toBe(false);
    expect(isSafePublicHttpUrl('http://127.0.0.1:8080')).toBe(false);
    expect(isSafePublicHttpUrl('http://0.0.0.0')).toBe(false);
    expect(isSafePublicHttpUrl('http://192.168.1.1')).toBe(false);
    expect(isSafePublicHttpUrl('http://10.0.0.1')).toBe(false);
    expect(isSafePublicHttpUrl('http://internal.service.local')).toBe(false);
  });

  it('validates github_url specifically', () => {
    const valid = submissionSchema.safeParse({
      title: 'Valid Project',
      track_id: 'fintech',
      problem_statement: 'A valid problem statement that is long enough to meet requirements.',
      solution_overview: 'A valid solution overview that is detailed and meets requirements.',
      description: 'A complete and in-depth description that covers everything necessary for evaluation.',
      tech_stack: ['Next.js', 'TypeScript'],
      github_url: 'https://github.com/myorg/myrepo',
    });
    expect(valid.success).toBe(true);

    const invalid = submissionSchema.safeParse({
      title: 'Valid Project',
      track_id: 'fintech',
      problem_statement: 'A valid problem statement that is long enough to meet requirements.',
      solution_overview: 'A valid solution overview that is detailed and meets requirements.',
      description: 'A complete and in-depth description that covers everything necessary for evaluation.',
      tech_stack: ['Next.js'],
      github_url: 'https://evil-site.com/github.com/malicious',
    });
    expect(invalid.success).toBe(false);
  });
});

describe('rate limiter security', () => {
  it('enforces limit boundary and resets after time', () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '203.0.113.195' },
    });

    const res1 = checkRateLimit(req, 'test-scope', 2, 500);
    expect(res1.allowed).toBe(true);

    const res2 = checkRateLimit(req, 'test-scope', 2, 500);
    expect(res2.allowed).toBe(true);

    const res3 = checkRateLimit(req, 'test-scope', 2, 500);
    expect(res3.allowed).toBe(false);
    expect(res3.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('uses the shared Redis limiter when production credentials are configured', async () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = 'https://ratelimit.example.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ result: 1 }, { result: 1 }],
    });
    vi.stubGlobal('fetch', fetchMock);

    try {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-forwarded-for': '203.0.113.196' },
      });
      const result = await checkRateLimitDistributed(req, 'distributed-test', 2, 60_000);

      expect(result.allowed).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://ratelimit.example.com/pipeline',
        expect.objectContaining({ method: 'POST' })
      );
    } finally {
      if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
      else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
      else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
      vi.unstubAllGlobals();
    }
  });
});

