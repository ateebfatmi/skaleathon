// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { shouldBypassAuthentication } from '@/lib/auth/e2e-bypass';

describe('E2E authentication bypass', () => {
  it('is available only when explicitly enabled outside production', () => {
    expect(
      shouldBypassAuthentication({
        NODE_ENV: 'development',
        E2E_AUTH_BYPASS: '1',
      }),
    ).toBe(true);
  });

  it('cannot be enabled in production', () => {
    expect(
      shouldBypassAuthentication({
        NODE_ENV: 'production',
        E2E_AUTH_BYPASS: '1',
      }),
    ).toBe(false);
  });
});
