export type EventStatus =
  | 'draft'
  | 'upcoming'
  | 'registration_open'
  | 'registration_closed'
  | 'hacking_live'
  | 'submission_closed'
  | 'judging'
  | 'results_announced'
  | 'archived';

export type UserRole = 'participant' | 'team_leader' | 'judge' | 'admin';

export interface EventData {
  id: string;
  name: string;
  tagline: string;
  organizer_name: string;
  organizer_website: string;
  status: EventStatus;
  registration_fee_inr: number;
  min_team_size: number;
  max_team_size: number;
  prize_pool_inr: number;
  first_prize_inr: number;
  second_prize_inr: number;
  third_prize_inr: number;
  certificates_top_n: number;
  registration_start_at: string | null;
  registration_end_at: string | null;
  submission_deadline: string | null;
  results_announced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventTrack {
  id: string;
  event_id: string;
  name: string;
  slug: string;
  description: string;
  color_accent: string;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  college_or_org?: string | null;
  city?: string | null;
  state?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type TeamStatus = 'registered' | 'paid' | 'disqualified' | 'withdrawn';

export interface Team {
  id: string;
  event_id: string;
  name: string;
  track_id: string | null;
  leader_id: string;
  description?: string | null;
  college_or_org?: string | null;
  city?: string | null;
  state?: string | null;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  role: 'leader' | 'member';
  college_or_org?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamDetails extends Team {
  members: TeamMember[];
  track?: EventTrack;
}

export type PaymentOrderStatus = 'created' | 'attempted' | 'paid' | 'failed' | 'refunded' | 'cancelled';

export interface PaymentOrder {
  id: string;
  team_id: string;
  amount_inr: number;
  currency: string;
  status: PaymentOrderStatus;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  error_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentWebhookEvent {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed: boolean;
  error_message?: string | null;
  created_at: string;
  processed_at?: string | null;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'disqualified' | 'accepted';

export interface Submission {
  id: string;
  team_id: string;
  track_id: string;
  title: string;
  problem_statement: string;
  description: string;
  solution_overview: string;
  tech_stack: string[];
  github_url: string;
  live_demo_url?: string | null;
  demo_video_url?: string | null;
  presentation_url?: string | null;
  member_contributions?: string | null;
  ai_tool_disclosure?: string | null;
  file_attachments: Array<{ name: string; url: string; size?: number; type?: string }>;
  status: SubmissionStatus;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionVersion {
  id: string;
  submission_id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  submitted_by: string;
  created_at: string;
}

export interface Judge {
  id: string;
  email?: string;
  full_name?: string;
  track_ids: string[];
  bio?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface JudgeAssignment {
  id: string;
  judge_id: string;
  submission_id: string;
  status: 'assigned' | 'in_progress' | 'completed';
  conflict_of_interest: boolean;
  conflict_reason?: string | null;
  created_at: string;
}

export interface JudgingCriterion {
  id: string;
  name: string;
  description?: string | null;
  weight_percentage: number;
  max_score: number;
  sort_order: number;
}

export interface Score {
  id: string;
  assignment_id: string;
  criterion_id: string;
  score: number;
  created_at: string;
}

export interface ScoreSubmission {
  id: string;
  assignment_id: string;
  feedback?: string | null;
  internal_notes?: string | null;
  is_locked: boolean;
  total_weighted_score: number;
  submitted_at: string | null;
  created_at: string;
}

export type PrizeCategory =
  | 'first_prize'
  | 'second_prize'
  | 'third_prize'
  | 'track_winner'
  | 'top_25'
  | 'honorable_mention'
  | null;

export interface LeaderboardResult {
  id: string;
  event_id: string;
  team_id: string;
  team_name?: string;
  project_title?: string;
  track_id?: string | null;
  track_name?: string | null;
  rank: number | null;
  final_score: number;
  prize_category: PrizeCategory;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export type CertificateType = 'winner_first' | 'winner_second' | 'winner_third' | 'top_25_merit' | 'participation';

export interface Certificate {
  id: string;
  certificate_code: string;
  team_id: string;
  team_name?: string;
  recipient_name: string;
  recipient_email: string;
  certificate_type: CertificateType;
  achievement_text: string;
  qr_verification_url: string;
  pdf_url?: string | null;
  issued_at: string;
  is_revoked: boolean;
  revocation_reason?: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  event_id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'timeline' | 'results';
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface PolicyConsent {
  id: string;
  user_id: string;
  team_id?: string | null;
  policy_version: string;
  accepted_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_email?: string | null;
  action: string;
  target_entity: string;
  target_id?: string | null;
  details?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
}
