import fs from 'fs';
import path from 'path';
import {
  EventData,
  EventTrack,
  Profile,
  Team,
  TeamMember,
  PaymentOrder,
  PaymentWebhookEvent,
  Submission,
  SubmissionVersion,
  Judge,
  JudgeAssignment,
  JudgingCriterion,
  Score,
  ScoreSubmission,
  LeaderboardResult,
  Certificate,
  Announcement,
  PolicyConsent,
  AuditLog,
} from './types';

export interface DatabaseState {
  events: EventData[];
  tracks: EventTrack[];
  profiles: Profile[];
  teams: Team[];
  teamMembers: TeamMember[];
  paymentOrders: PaymentOrder[];
  webhookEvents: PaymentWebhookEvent[];
  submissions: Submission[];
  submissionVersions: SubmissionVersion[];
  judges: Judge[];
  judgeAssignments: JudgeAssignment[];
  judgingCriteria: JudgingCriterion[];
  scores: Score[];
  scoreSubmissions: ScoreSubmission[];
  leaderboardResults: LeaderboardResult[];
  certificates: Certificate[];
  announcements: Announcement[];
  policyConsents: PolicyConsent[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_STATE: DatabaseState = {
  events: [
    {
      id: 'skaleathon-2027',
      name: 'Skaleathon 2027',
      tagline: 'Build. Innovate. Scale.',
      organizer_name: 'SkaleKraft',
      organizer_website: 'https://skalekraft.in',
      status: 'registration_open',
      registration_fee_inr: 99.0,
      min_team_size: 1,
      max_team_size: 6,
      prize_pool_inr: 35000.0,
      first_prize_inr: 20000.0,
      second_prize_inr: 10000.0,
      third_prize_inr: 5000.0,
      certificates_top_n: 25,
      registration_start_at: null,
      registration_end_at: null,
      submission_deadline: null,
      results_announced_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  tracks: [
    {
      id: 'track-ai-ml',
      event_id: 'skaleathon-2027',
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description:
        'Leverage LLMs, predictive intelligence, neural architectures, and agentic workflows to build impactful real-world solutions.',
      color_accent: '#8b5cf6',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'track-web-dev',
      event_id: 'skaleathon-2027',
      name: 'Web Development',
      slug: 'web-dev',
      description:
        'Engineer scalable, resilient, high-performance web platforms and digital infrastructure for modern enterprises.',
      color_accent: '#06b6d4',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'track-app-dev',
      event_id: 'skaleathon-2027',
      name: 'App Development',
      slug: 'app-dev',
      description:
        'Design sleek, responsive mobile and cross-platform native experiences solving concrete user and business challenges.',
      color_accent: '#6366f1',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  profiles: [
    {
      id: 'admin_skalekraft',
      email: 'skalekraft@gmail.com',
      full_name: 'SkaleKraft Organizer Admin',
      phone: '+919876543210',
      college_or_org: 'SkaleKraft',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'judge_lead',
      email: 'judge@skalekraft.in',
      full_name: 'Lead Technical Evaluator',
      phone: '+919876543211',
      college_or_org: 'SkaleKraft Technology Panel',
      role: 'judge',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  teams: [],
  teamMembers: [],
  paymentOrders: [],
  webhookEvents: [],
  submissions: [],
  submissionVersions: [],
  judges: [
    {
      id: 'judge_lead',
      email: 'judge@skalekraft.in',
      full_name: 'Lead Technical Evaluator',
      track_ids: ['track-ai-ml', 'track-web-dev', 'track-app-dev'],
      bio: 'Senior Architect & Product Evaluation Lead at SkaleKraft.',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  judgeAssignments: [],
  judgingCriteria: [
    {
      id: 'crit-innovation',
      name: 'Innovation & Originality',
      description: 'Novelty of approach, uniqueness of solution, and creative problem-solving.',
      weight_percentage: 25,
      max_score: 10,
      sort_order: 1,
    },
    {
      id: 'crit-technical',
      name: 'Technical Implementation',
      description: 'Code quality, architectural robustness, tech stack execution, and security.',
      weight_percentage: 25,
      max_score: 10,
      sort_order: 2,
    },
    {
      id: 'crit-relevance',
      name: 'Problem Relevance & Impact',
      description: 'Market demand, clarity of problem statement, and potential scalability.',
      weight_percentage: 20,
      max_score: 10,
      sort_order: 3,
    },
    {
      id: 'crit-design',
      name: 'Usability & Design',
      description: 'User experience clarity, responsive design, accessibility, and visual polish.',
      weight_percentage: 15,
      max_score: 10,
      sort_order: 4,
    },
    {
      id: 'crit-presentation',
      name: 'Presentation & Demonstration',
      description: 'Demo effectiveness, video/slide clarity, documentation, and live showcase.',
      weight_percentage: 15,
      max_score: 10,
      sort_order: 5,
    },
  ],
  scores: [],
  scoreSubmissions: [],
  leaderboardResults: [],
  certificates: [],
  announcements: [
    {
      id: 'ann-1',
      event_id: 'skaleathon-2027',
      title: 'Welcome to Skaleathon 2027!',
      content:
        'Registrations are now open across India for all eligible college students and early-career innovators. Build your team of 1–6 members and choose your track!',
      category: 'general',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ],
  policyConsents: [],
  auditLogs: [],
};

export class FileStore {
  private static instance: FileStore;
  private state: DatabaseState;

  private constructor() {
    this.state = this.loadState();
  }

  public static getInstance(): FileStore {
    if (!FileStore.instance) {
      FileStore.instance = new FileStore();
    }
    return FileStore.instance;
  }

  private loadState(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
      this.saveState(INITIAL_STATE);
      return INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  }

  public saveState(newState?: DatabaseState): void {
    if (newState) {
      this.state = newState;
    }
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }
}
