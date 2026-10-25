import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getSubmissionByTeam,
  getSubmission,
  getPaymentOrderByTeam,
  getLeaderboard,
  getAnnouncements,
  getTeam,
  getState,
} = vi.hoisted(() => ({
  getSubmissionByTeam: vi.fn(),
  getSubmission: vi.fn(),
  getPaymentOrderByTeam: vi.fn(),
  getLeaderboard: vi.fn(),
  getAnnouncements: vi.fn(),
  getTeam: vi.fn(),
  getState: vi.fn(() => {
    throw new Error('Local JSON fallback must not be used');
  }),
}));

vi.mock('../src/lib/db/supabase-store', () => ({
  SupabaseStore: {
    getSubmissionByTeam,
    getSubmission,
    getPaymentOrderByTeam,
    getLeaderboard,
    getAnnouncements,
    getTeam,
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
    getPaymentOrderByTeam.mockResolvedValue(null);
    getLeaderboard.mockResolvedValue([]);
    getAnnouncements.mockResolvedValue([]);
    getTeam.mockResolvedValue(null);
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

  it('returns null when a team has no payment order in production', async () => {
    await expect(EventRepository.getPaymentOrderByTeam('team-1')).resolves.toBeNull();
    expect(getState).not.toHaveBeenCalled();
  });

  it('returns empty array when leaderboard is unpublished in production', async () => {
    await expect(EventRepository.getPublicLeaderboard()).resolves.toEqual([]);
    expect(getState).not.toHaveBeenCalled();
  });

  it('returns empty array when there are no announcements in production', async () => {
    await expect(EventRepository.getAnnouncements(true)).resolves.toEqual([]);
    expect(getState).not.toHaveBeenCalled();
  });

  it('returns null when team is missing without falling back to local JSON in production', async () => {
    await expect(EventRepository.getTeam('missing-team')).resolves.toBeNull();
    expect(getState).not.toHaveBeenCalled();
  });
});
