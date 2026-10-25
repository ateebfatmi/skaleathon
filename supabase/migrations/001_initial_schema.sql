-- ==============================================================================
-- SKALEATHON 2027 — SUPABASE POSTGRESQL SCHEMA
-- Migration: 001_initial_schema.sql
-- This schema is intentionally aligned with src/lib/db/supabase-store.ts.
-- All application access is server-side through the Supabase service role.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY DEFAULT 'skaleathon-2027',
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    organizer_name TEXT NOT NULL DEFAULT 'SkaleKraft',
    organizer_website TEXT NOT NULL DEFAULT 'https://skalekraft.in',
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'registration_open', 'registration_closed', 'hacking_live', 'submission_closed', 'judging', 'results_announced', 'archived')),
    registration_fee_inr NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    min_team_size INT NOT NULL DEFAULT 1,
    max_team_size INT NOT NULL DEFAULT 6,
    prize_pool_inr NUMERIC(10, 2) NOT NULL DEFAULT 35000.00,
    first_prize_inr NUMERIC(10, 2) NOT NULL DEFAULT 20000.00,
    second_prize_inr NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    third_prize_inr NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    certificates_top_n INT NOT NULL DEFAULT 25,
    registration_start_at TIMESTAMPTZ,
    registration_end_at TIMESTAMPTZ,
    submission_deadline TIMESTAMPTZ,
    results_announced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_tracks (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    color_accent TEXT NOT NULL DEFAULT '#c19a88',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, slug)
);

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    college_name TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    system_role TEXT NOT NULL DEFAULT 'participant' CHECK (system_role IN ('participant', 'judge', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    track_id TEXT NOT NULL REFERENCES event_tracks(id) ON DELETE RESTRICT,
    leader_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'disqualified', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, team_name)
);

CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    profile_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college_name TEXT NOT NULL,
    is_leader BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, email)
);

CREATE TABLE IF NOT EXISTS payment_orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    order_id TEXT NOT NULL UNIQUE,
    payment_id TEXT,
    signature TEXT,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded', 'cancelled')),
    error_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_consents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    policy_type TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
    track_id TEXT NOT NULL REFERENCES event_tracks(id) ON DELETE RESTRICT,
    project_title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    demo_url TEXT,
    presentation_url TEXT,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submission_versions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    project_title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    demo_url TEXT,
    presentation_url TEXT,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(submission_id, version_number)
);

CREATE TABLE IF NOT EXISTS judges (
    id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    bio TEXT,
    expertise_tracks TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judge_assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    judge_id TEXT NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(judge_id, submission_id)
);

CREATE TABLE IF NOT EXISTS judging_criteria (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    weight_percentage NUMERIC(5, 2) NOT NULL CHECK (weight_percentage > 0 AND weight_percentage <= 100),
    max_score INT NOT NULL DEFAULT 10 CHECK (max_score > 0),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    judge_id TEXT NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    criterion_id TEXT NOT NULL REFERENCES judging_criteria(id) ON DELETE RESTRICT,
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(submission_id, judge_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS score_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    judge_id TEXT NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    total_weighted_score NUMERIC(6, 2) NOT NULL,
    general_feedback TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_finalized BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(submission_id, judge_id)
);

CREATE TABLE IF NOT EXISTS leaderboard_results (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
    track_id TEXT NOT NULL REFERENCES event_tracks(id) ON DELETE RESTRICT,
    rank INT,
    track_rank INT,
    final_score NUMERIC(6, 2) NOT NULL DEFAULT 0,
    normalized_score NUMERIC(6, 2),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    awarded_prize TEXT CHECK (awarded_prize IN ('first_prize', 'second_prize', 'third_prize', 'track_winner', 'top_25', 'honorable_mention')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_college TEXT NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('winner_first', 'winner_second', 'winner_third', 'top_25_merit', 'participation')),
    certificate_code TEXT NOT NULL UNIQUE,
    pdf_storage_path TEXT,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revocation_reason TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    actor_id TEXT,
    actor_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_value JSONB,
    new_value JSONB,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
    created_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_leader ON teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_payment_orders_team ON payment_orders(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_track ON submissions(track_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- The browser receives a Supabase anonymous key, so every application table is
-- protected by RLS. Server-side service-role requests bypass RLS as intended.
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

INSERT INTO events (
    id, name, tagline, organizer_name, organizer_website, status,
    registration_fee_inr, min_team_size, max_team_size, prize_pool_inr,
    first_prize_inr, second_prize_inr, third_prize_inr, certificates_top_n,
    registration_start_at, registration_end_at, submission_deadline, results_announced_at
) VALUES (
    'skaleathon-2027', 'Skaleathon 2027', 'Build. Innovate. Scale.',
    'SkaleKraft', 'https://skalekraft.in', 'registration_open',
    99.00, 1, 6, 35000.00, 20000.00, 10000.00, 5000.00, 25,
    '2026-10-01T00:00:00.000Z', '2026-12-31T18:29:59.000Z',
    '2027-01-26T18:29:59.000Z', '2027-01-30T13:30:00.000Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO event_tracks (id, event_id, name, slug, description, color_accent) VALUES
('track-ai-ml', 'skaleathon-2027', 'AI & Machine Learning', 'ai-ml', 'Leverage LLMs, computer vision, predictive intelligence, and agentic workflows to build high-impact real-world solutions.', '#c19a88'),
('track-web-dev', 'skaleathon-2027', 'Web Development', 'web-dev', 'Engineer scalable, resilient, high-performance web platforms and digital infrastructure for modern enterprises.', '#c19a88'),
('track-app-dev', 'skaleathon-2027', 'App Development', 'app-dev', 'Design sleek, responsive mobile and cross-platform native experiences solving concrete user and business challenges.', '#c19a88')
ON CONFLICT (id) DO NOTHING;

INSERT INTO judging_criteria (id, name, description, weight_percentage, max_score, sort_order) VALUES
('crit-innovation', 'Innovation & Originality', 'Uniqueness of approach, novelty of concept, and creative problem solving.', 25, 10, 1),
('crit-technical', 'Technical Implementation', 'Code quality, architectural robustness, tech stack mastery, and execution.', 25, 10, 2),
('crit-relevance', 'Problem Relevance & Impact', 'Clarity of the problem statement, market need, and real-world scalability.', 20, 10, 3),
('crit-design', 'Usability & Design', 'UX clarity, intuitive navigation, accessibility, and visual polish.', 15, 10, 4),
('crit-presentation', 'Presentation & Demonstration', 'Working demo effectiveness, clarity of solution pitch, and documentation.', 15, 10, 5)
ON CONFLICT (id) DO NOTHING;
