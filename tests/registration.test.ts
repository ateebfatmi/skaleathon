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

  it('assigns leader phone as fallback when member phone is empty or omitted', async () => {
    const leaderPhone = '9876543210';
    const { team, members } = await EventRepository.createTeam({
      name: `Team With Optional Phone ${Date.now()}`,
      track_id: 'track-web-dev',
      leader_id: `leader_${Date.now()}`,
      leader_name: 'Contact Lead',
      leader_email: `lead_${Date.now()}@example.com`,
      leader_phone: leaderPhone,
      city: 'Ranchi',
      state: 'Jharkhand',
      members: [
        {
          name: 'Member Without Phone',
          email: `mem_nophone_${Date.now()}@example.com`,
          phone: '',
        },
      ],
    });

    expect(members).toHaveLength(2);
    expect(members[0].phone).toBe(leaderPhone);
    expect(members[1].phone).toBe(leaderPhone);
  });

  it('generates registration ID following the SK27-[TRACK]-[XXXX] pattern series', async () => {
    const { team } = await EventRepository.createTeam({
      name: `Pattern Team ${Date.now()}`,
      track_id: 'track-ai-ml',
      leader_id: `leader_pattern_${Date.now()}`,
      leader_name: 'Pattern Leader',
      leader_email: `pattern_lead_${Date.now()}@example.com`,
      leader_phone: '9876543210',
      city: 'Delhi',
      state: 'Delhi',
      members: [],
    });

    expect(team.id).toMatch(/^SK27-AIML-\d{4}$/);
  });
});
