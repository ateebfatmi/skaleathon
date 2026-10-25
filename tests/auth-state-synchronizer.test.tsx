import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthStateSynchronizer from '@/components/auth/AuthStateSynchronizer';

const authState = vi.hoisted(() => ({
  isLoaded: true,
  userId: null as string | null,
  refresh: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isLoaded: authState.isLoaded, userId: authState.userId }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: authState.refresh }),
}));

describe('AuthStateSynchronizer', () => {
  beforeEach(() => {
    authState.isLoaded = true;
    authState.userId = null;
    authState.refresh.mockClear();
    window.sessionStorage.clear();
  });

  it('refreshes server components when Clerk signs a user in', async () => {
    const view = render(<AuthStateSynchronizer />);

    expect(window.sessionStorage.getItem('skaleathon:clerk-user')).toBe('signed-out');
    expect(authState.refresh).not.toHaveBeenCalled();

    authState.userId = 'user_123';
    view.rerender(<AuthStateSynchronizer />);

    await vi.waitFor(() => expect(authState.refresh).toHaveBeenCalledTimes(1));
    expect(window.sessionStorage.getItem('skaleathon:clerk-user')).toBe('user_123');
  });
});
