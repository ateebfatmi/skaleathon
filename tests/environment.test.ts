// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getProductionEnvironmentIssues } from '@/lib/config/environment';

const validEnvironment: NodeJS.ProcessEnv = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-value',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-value',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_live_valid',
  CLERK_SECRET_KEY: 'sk_live_valid',
  RAZORPAY_KEY_ID: 'rzp_live_valid',
  RAZORPAY_KEY_SECRET: 'razorpay-secret',
  NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_live_valid',
  RAZORPAY_WEBHOOK_SECRET: 'webhook-secret',
  ADMIN_EMAILS: 'admin@example.com',
  APP_SECRET: 'a-secure-application-secret-over-32-characters',
  NEXT_PUBLIC_SITE_URL: 'https://skaleathon.skalekraft.in',
  EMAIL_PROVIDER: 'resend',
  RESEND_API_KEY: 're_live_valid',
  EMAIL_FROM: 'Skaleathon <no-reply@example.com>',
  UPSTASH_REDIS_REST_URL: 'https://instance.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'upstash-token',
};

describe('production environment validation', () => {
  it('accepts a complete production environment', () => {
    expect(getProductionEnvironmentIssues(validEnvironment)).toEqual([]);
  });

  it('rejects missing, placeholder, insecure, and short secrets', () => {
    const issues = getProductionEnvironmentIssues({
      ...validEnvironment,
      APP_SECRET: 'short',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      RAZORPAY_WEBHOOK_SECRET: 'placeholder_webhook_secret',
      RESEND_API_KEY: '',
    });

    expect(issues).toContain('APP_SECRET must contain at least 32 characters');
    expect(issues).toContain('NEXT_PUBLIC_SITE_URL must use HTTPS in production');
    expect(issues).toContain('RAZORPAY_WEBHOOK_SECRET still contains a placeholder value');
    expect(issues).toContain('RESEND_API_KEY is missing');
  });
});
