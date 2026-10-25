// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Supabase migration contract', () => {
  const migration = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/001_initial_schema.sql'),
    'utf8'
  );
  const webhookRetryMigration = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/003_webhook_retry_state.sql'),
    'utf8'
  );
  const registrationDeadlineMigration = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/004_correct_registration_deadline.sql'),
    'utf8'
  );
  const rateLimitMigration = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/005_distributed_rate_limits.sql'),
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

  it('keeps failed webhook deliveries retryable', () => {
    expect(webhookRetryMigration).toContain('ALTER COLUMN processed_at DROP NOT NULL');
    expect(webhookRetryMigration).toContain('ADD COLUMN IF NOT EXISTS error_message TEXT');
  });

  it('keeps registration ahead of the January 2027 competition stages', () => {
    expect(registrationDeadlineMigration).toContain("registration_end_at = '2026-12-31T18:29:59.000Z'");
  });

  it('provides an atomic distributed rate limiter through Supabase', () => {
    expect(rateLimitMigration).toContain('CREATE TABLE IF NOT EXISTS api_rate_limits');
    expect(rateLimitMigration).toContain('CREATE OR REPLACE FUNCTION check_rate_limit');
    expect(rateLimitMigration).toContain('GRANT EXECUTE ON FUNCTION check_rate_limit');
  });
});
