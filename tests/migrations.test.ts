// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Supabase migration contract', () => {
  const migration = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/001_initial_schema.sql'),
    'utf8'
  );

  it('uses the column contract consumed by SupabaseStore', () => {
    for (const column of [
      'team_name',
      'profile_id',
      'is_leader',
      'college_name',
      'project_title',
      'repository_url',
      'expertise_tracks',
      'resource_type',
    ]) {
      expect(migration).toContain(column);
    }
  });

  it('enables row-level security for every application table', () => {
    const tables = [
      'events', 'event_tracks', 'profiles', 'teams', 'team_members',
      'payment_orders', 'payment_webhook_events', 'policy_consents',
      'submissions', 'submission_versions', 'judges', 'judge_assignments',
      'judging_criteria', 'scores', 'score_submissions', 'leaderboard_results',
      'certificates', 'audit_logs', 'announcements',
    ];

    for (const table of tables) {
      expect(migration).toContain(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
    }
  });
});
