-- ==============================================================================
-- SKALEATHON 2027 — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Core relational schema with RLS, audit logs, and indexing.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Events Table
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

-- 2. Event Tracks Table
CREATE TABLE IF NOT EXISTS event_tracks (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    color_accent TEXT NOT NULL DEFAULT '#6366f1',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, slug)
);

-- 3. Dynamic Event Settings & Policies Table
CREATE TABLE IF NOT EXISTS event_settings (
    key TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Profiles Table (Mirrors or supplements auth provider)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- Clerk User ID or Auth ID
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    college_or_org TEXT,
    city TEXT,
    state TEXT,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'team_leader', 'judge', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    track_id TEXT REFERENCES event_tracks(id) ON DELETE SET NULL,
    leader_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    description TEXT,
    college_or_org TEXT,
    city TEXT,
    state TEXT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'paid', 'disqualified', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, name)
);

-- 6. Team Members Table (Prevent duplicate team memberships)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    college_or_org TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, email)
);

-- 7. Payment Orders Table
CREATE TABLE IF NOT EXISTS payment_orders (
    id TEXT PRIMARY KEY, -- Razorpay order_id (e.g. order_xxx) or internal order ID
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded', 'cancelled')),
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    error_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Payment Webhook Logs Table (Idempotency)
CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id TEXT PRIMARY KEY, -- Razorpay event ID or generated idempotency key
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 9. Project Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
    track_id TEXT NOT NULL REFERENCES event_tracks(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    description TEXT NOT NULL,
    solution_overview TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT NOT NULL,
    live_demo_url TEXT,
    demo_video_url TEXT,
    presentation_url TEXT,
    member_contributions TEXT,
    ai_tool_disclosure TEXT,
    file_attachments JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'disqualified', 'accepted')),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Submission Versions Table (Audit history of edits)
CREATE TABLE IF NOT EXISTS submission_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot JSONB NOT NULL,
    submitted_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Judges & Assignments Table
CREATE TABLE IF NOT EXISTS judges (
    id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    track_ids TEXT[] DEFAULT '{}',
    bio TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id TEXT NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    conflict_of_interest BOOLEAN NOT NULL DEFAULT FALSE,
    conflict_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(judge_id, submission_id)
);

-- 12. Judging Criteria Table (Weights must sum to 100%)
CREATE TABLE IF NOT EXISTS judging_criteria (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    weight_percentage INT NOT NULL CHECK (weight_percentage > 0 AND weight_percentage <= 100),
    max_score INT NOT NULL DEFAULT 10,
    sort_order INT NOT NULL DEFAULT 0
);

-- 13. Scores Table
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES judge_assignments(id) ON DELETE CASCADE,
    criterion_id TEXT NOT NULL REFERENCES judging_criteria(id) ON DELETE RESTRICT,
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(assignment_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS score_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES judge_assignments(id) ON DELETE CASCADE UNIQUE,
    feedback TEXT,
    internal_notes TEXT,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    total_weighted_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Results & Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
    rank INT,
    track_id TEXT REFERENCES event_tracks(id),
    final_score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    prize_category TEXT CHECK (prize_category IN ('first_prize', 'second_prize', 'third_prize', 'track_winner', 'top_25', 'honorable_mention', NULL)),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_code TEXT NOT NULL UNIQUE, -- E.g. SKALE27-TOP25-0012
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('winner_first', 'winner_second', 'winner_third', 'top_25_merit', 'participation')),
    achievement_text TEXT NOT NULL,
    qr_verification_url TEXT NOT NULL,
    pdf_url TEXT,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revocation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'urgent', 'timeline', 'results')),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Policy Consent Records
CREATE TABLE IF NOT EXISTS policy_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    policy_version TEXT NOT NULL DEFAULT 'v1.0',
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 18. Audit Logs Table (Administrative and security action history)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_leader ON teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_team ON payment_orders(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_track ON submissions(track_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO events (
    id, name, tagline, organizer_name, organizer_website, status,
    registration_fee_inr, min_team_size, max_team_size, prize_pool_inr,
    first_prize_inr, second_prize_inr, third_prize_inr, certificates_top_n,
    registration_end_at, submission_deadline, results_announced_at
) VALUES (
    'skaleathon-2027',
    'Skaleathon 2027',
    'Build. Innovate. Scale.',
    'SkaleKraft',
    'https://skalekraft.in',
    'registration_open',
    99.00, 1, 6, 35000.00,
    20000.00, 10000.00, 5000.00, 25,
    '2027-12-31T18:29:59.000Z',
    '2028-01-26T18:29:59.000Z',
    '2028-01-30T13:30:00.000Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO event_tracks (id, event_id, name, slug, description, color_accent) VALUES
('track-ai-ml', 'skaleathon-2027', 'AI & Machine Learning', 'ai-ml', 'Leverage LLMs, computer vision, predictive intelligence, and agentic workflows to build high-impact real-world solutions.', '#8b5cf6'),
('track-web-dev', 'skaleathon-2027', 'Web Development', 'web-dev', 'Engineer scalable, resilient, high-performance web platforms and digital infrastructure for modern enterprises.', '#06b6d4'),
('track-app-dev', 'skaleathon-2027', 'App Development', 'app-dev', 'Design sleek, responsive mobile and cross-platform native experiences solving concrete user and business challenges.', '#6366f1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO judging_criteria (id, name, description, weight_percentage, max_score, sort_order) VALUES
('crit-innovation', 'Innovation & Originality', 'Uniqueness of approach, novelty of concept, and creative problem solving.', 25, 10, 1),
('crit-technical', 'Technical Implementation', 'Code quality, architectural robustness, tech stack mastery, and execution.', 25, 10, 2),
('crit-relevance', 'Problem Relevance & Impact', 'Clarity of the problem statement, market need, and real-world scalability.', 20, 10, 3),
('crit-design', 'Usability & Design', 'UX clarity, intuitive navigation, accessibility, and visual polish.', 15, 10, 4),
('crit-presentation', 'Presentation & Demonstration', 'Working demo effectiveness, clarity of solution pitch, and documentation.', 15, 10, 5)
ON CONFLICT (id) DO NOTHING;
