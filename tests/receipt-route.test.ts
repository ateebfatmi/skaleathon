// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
  getTeam: vi.fn(),
  getPaymentOrderByTeam: vi.fn(),
  generateReceiptPDF: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentSession: mocks.getCurrentSession }));
vi.mock('@/lib/db/repository', () => ({
  EventRepository: {
    getTeam: mocks.getTeam,
    getPaymentOrderByTeam: mocks.getPaymentOrderByTeam,
  },
}));
vi.mock('@/lib/receipt/generator', () => ({ generateReceiptPDF: mocks.generateReceiptPDF }));

import { GET } from '@/app/api/receipt/download/route';

describe('receipt download authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires authentication even when a team ID is supplied', async () => {
    mocks.getCurrentSession.mockResolvedValue(null);

    const response = await GET(
      new NextRequest('http://localhost/api/receipt/download?teamId=SK27-AIML-0001')
    );

    expect(response.status).toBe(401);
    expect(mocks.getTeam).not.toHaveBeenCalled();
  });

  it('prevents a participant from downloading another team receipt', async () => {
    mocks.getCurrentSession.mockResolvedValue({
      userId: 'user-1',
      email: 'leader@example.com',
      fullName: 'Leader',
      role: 'team_leader',
      teamId: 'SK27-AIML-0001',
    });

    const response = await GET(
      new NextRequest('http://localhost/api/receipt/download?teamId=SK27-WEB-0002')
    );

    expect(response.status).toBe(403);
    expect(mocks.getTeam).not.toHaveBeenCalled();
  });

  it('allows an administrator to download a requested receipt', async () => {
    mocks.getCurrentSession.mockResolvedValue({
      userId: 'admin-1',
      email: 'admin@example.com',
      fullName: 'Admin',
      role: 'admin',
      teamId: null,
    });
    mocks.getTeam.mockResolvedValue({
      id: 'SK27-WEB-0002',
      name: 'Web Team',
      members: [],
      track: null,
    });
    mocks.getPaymentOrderByTeam.mockResolvedValue(null);
    mocks.generateReceiptPDF.mockResolvedValue(new Uint8Array([37, 80, 68, 70]));

    const response = await GET(
      new NextRequest('http://localhost/api/receipt/download?teamId=SK27-WEB-0002')
    );

    expect(response.status).toBe(200);
    expect(mocks.getTeam).toHaveBeenCalledWith('SK27-WEB-0002');
  });
});
