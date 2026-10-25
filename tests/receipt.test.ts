import { describe, it, expect } from 'vitest';
import { generateReceiptPDF } from '../src/lib/receipt/generator';
import { Team, TeamMember, EventTrack, PaymentOrder } from '../src/lib/db/types';

describe('Official Registration Receipt PDF Generator', () => {
  it('generates a valid binary PDF document with %PDF magic header', async () => {
    const mockTeam: Team = {
      id: 'SK27-AIML-0004',
      event_id: 'skaleathon-2027',
      name: 'Ateeb Testing',
      track_id: 'track-ai-ml',
      leader_id: 'user_test_leader',
      college_or_org: 'Independent Squad',
      city: 'Delhi',
      state: 'Delhi',
      status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockMembers: TeamMember[] = [
      {
        id: 'mem_1',
        team_id: mockTeam.id,
        name: 'ATEEB FATMI',
        email: 'ateebfatmi30@gmail.com',
        phone: '9876543210',
        role: 'leader',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mem_2',
        team_id: mockTeam.id,
        name: 'Member Two',
        email: 'two@example.com',
        phone: '9876543211',
        role: 'member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const mockTrack: EventTrack = {
      id: 'track-ai-ml',
      event_id: 'skaleathon-2027',
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description: 'Autonomous agents and ML track',
      color_accent: '#c19a88',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const mockPayment: PaymentOrder = {
      id: 'ord_test_123',
      team_id: mockTeam.id,
      amount_inr: 500,
      currency: 'INR',
      status: 'paid',
      razorpay_payment_id: 'pay_TsGI0chNSdLTap',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const pdfBytes = await generateReceiptPDF({
      team: mockTeam,
      members: mockMembers,
      track: mockTrack,
      paymentOrder: mockPayment,
      siteUrl: 'https://skaleathon.skalekraft.in',
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    // Verify PDF magic header %PDF-
    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });
});
