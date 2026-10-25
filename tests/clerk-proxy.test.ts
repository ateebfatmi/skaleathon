// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getClerkProxyUrl } from '../src/lib/auth/clerk-config';

describe('Clerk frontend API proxy', () => {
  it('uses the same-origin proxy for live keys on localhost', () => {
    expect(getClerkProxyUrl('development', 'pk_live_example')).toBe('/__clerk');
  });

  it('leaves test keys and production auto-proxying unchanged', () => {
    expect(getClerkProxyUrl('development', 'pk_test_example')).toBeUndefined();
    expect(getClerkProxyUrl('production', 'pk_live_example')).toBeUndefined();
  });
});
