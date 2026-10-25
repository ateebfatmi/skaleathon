import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getSubmissionByTeam, getSubmission, getState } = vi.hoisted(() => ({
  getSubmissionByTeam: vi.fn(),
  getSubmission: vi.fn(),
  getState: vi.fn(() => {
    throw new Error('Local JSON fallback must not be used');
  }),
}));

vi.mock('../src/lib/db/supabase-store', () => ({
  SupabaseStore: {
    getSubmissionByTeam,
    getSubmission,
  },
}));

vi.mock('../src/lib/db/file-store', () => ({
  FileStore: {
    getInstance: () => ({ getState }),
  },
}));

import { EventRepository } from '../src/lib/db/repository';

describe('production repository empty states', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key');
    getSubmissionByTeam.mockResolvedValue(null);
    getSubmission.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('returns null when a team has not submitted yet', async () => {
    await expect(EventRepository.getSubmissionByTeam('team-1')).resolves.toBeNull();
    expect(getState).not.toHaveBeenCalled();
  });

  it('returns null when a submission id is not found', async () => {
    await expect(EventRepository.getSubmission('missing-submission')).resolves.toBeNull();
    expect(getState).not.toHaveBeenCalled();
  });
});
