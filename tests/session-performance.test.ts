import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  getProfile: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => undefined),
  })),
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: authMocks.auth,
  currentUser: authMocks.currentUser,
}));

vi.mock('@/lib/db/repository', () => ({
  EventRepository: {
    getProfile: authMocks.getProfile,
    getProfileByEmail: vi.fn(),
    upsertProfile: vi.fn(),
    getTeamByLeader: vi.fn(),
    getTeamByMemberEmail: vi.fn(),
  },
}));

describe('session performance', () => {
  beforeEach(() => {
    authMocks.auth.mockReset();
    authMocks.currentUser.mockReset();
    authMocks.getProfile.mockReset();
  });

  it('does not fetch the Clerk user record for a signed-out request', async () => {
    authMocks.auth.mockResolvedValue({ userId: null });

    const { getCurrentSession } = await import('@/lib/auth/session');
    const session = await getCurrentSession();

    expect(session).toBeNull();
    expect(authMocks.currentUser).not.toHaveBeenCalled();
    expect(authMocks.getProfile).not.toHaveBeenCalled();
  });
});
