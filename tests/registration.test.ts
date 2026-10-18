import { describe, it, expect, beforeEach } from 'vitest';
import { EventRepository } from '../src/lib/db/repository';
import { registrationSchema } from '../src/lib/validation/schemas';

describe('Team Registration & Validation', () => {
  it('validates team registration schema with Zod', () => {
    const validData = {
      name: 'CyberCrafters',
      track_id: 'track-ai-ml',
      college_or_org: 'IIT Bombay',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Building autonomous agent workflows',
      leader_name: 'Rohit Verma',
      leader_email: 'rohit@example.com',
      leader_phone: '9876543210',
      members: [
        { name: 'Ananya Sen', email: 'ananya@example.com', phone: '9876543211', college_or_org: 'IIT Bombay' },
      ],
      acceptedPolicies: true,
    };

    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects team registration when policies are not accepted', () => {
    const invalidData = {
      name: 'CyberCrafters',
      track_id: 'track-ai-ml',
      city: 'Mumbai',
      state: 'Maharashtra',
      leader_name: 'Rohit Verma',
      leader_email: 'rohit@example.com',
      leader_phone: '9876543210',
      members: [],
      acceptedPolicies: false,
    };

    const result = registrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects team sizes greater than 6 members', () => {
    const overflowData = {
      name: 'MegaTeam',
      track_id: 'track-ai-ml',
      city: 'Delhi',
      state: 'Delhi',
      leader_name: 'Leader One',
      leader_email: 'leader@example.com',
      leader_phone: '9876543210',
      members: [
        { name: 'M1', email: 'm1@example.com' },
        { name: 'M2', email: 'm2@example.com' },
        { name: 'M3', email: 'm3@example.com' },
        { name: 'M4', email: 'm4@example.com' },
        { name: 'M5', email: 'm5@example.com' },
        { name: 'M6', email: 'm6@example.com' }, // 1 leader + 6 members = 7 (exceeds max 6)
      ],
      acceptedPolicies: true,
    };

    const result = registrationSchema.safeParse(overflowData);
    expect(result.success).toBe(false);
  });

  it('prevents duplicate memberships across teams', async () => {
    const uniqueEmail = `test_${Date.now()}@testdomain.com`;

    // First team creation
    await EventRepository.createTeam({
      name: `Team Alpha ${Date.now()}`,
      track_id: 'track-web-dev',
      leader_id: `leader_${Date.now()}`,
      leader_name: 'Alpha Leader',
      leader_email: uniqueEmail,
      city: 'Bengaluru',
      state: 'Karnataka',
      members: [],
    });

    // Attempt second team creation with same email
    await expect(
      EventRepository.createTeam({
        name: `Team Beta ${Date.now()}`,
        track_id: 'track-web-dev',
        leader_id: `leader_beta_${Date.now()}`,
        leader_name: 'Beta Leader',
        leader_email: uniqueEmail, // Duplicate
        city: 'Bengaluru',
        state: 'Karnataka',
        members: [],
      })
    ).rejects.toThrow(/already registered in another team/);
  });
});
