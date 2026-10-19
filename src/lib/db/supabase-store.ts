import { getSupabaseAdmin } from '@/lib/supabase/admin';
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
  AuditLog,
} from './types';
import crypto from 'crypto';

export class SupabaseStore {
  private static getClient() {
    const client = getSupabaseAdmin();
    if (!client) {
      throw new Error('Supabase client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return client;
  }

  // --- EVENTS ---
  static async getEvent(eventId: string = 'skaleathon-2027'): Promise<EventData | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      tagline: data.tagline,
      organizer_name: data.organizer_name,
      organizer_website: data.organizer_website,
      status: data.status,
      registration_fee_inr: Number(data.registration_fee_inr),
      min_team_size: data.min_team_size,
      max_team_size: data.max_team_size,
      prize_pool_inr: Number(data.prize_pool_inr),
      first_prize_inr: Number(data.first_prize_inr),
      second_prize_inr: Number(data.second_prize_inr),
      third_prize_inr: Number(data.third_prize_inr),
      certificates_top_n: data.certificates_top_n,
      registration_start_at: data.registration_start_at,
      registration_end_at: data.registration_end_at,
      submission_deadline: data.submission_deadline,
      results_announced_at: data.results_announced_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async updateEvent(
    updates: Partial<EventData>,
    actorId: string,
    eventId: string = 'skaleathon-2027'
  ): Promise<EventData> {
    const client = this.getClient();
    const dbUpdates: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('events')
      .update(dbUpdates)
      .eq('id', eventId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update event: ${error?.message}`);
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_EVENT_CONFIG',
      target_entity: 'events',
      target_id: eventId,
      details: updates,
    });

    return {
      id: data.id,
      name: data.name,
      tagline: data.tagline,
      organizer_name: data.organizer_name,
      organizer_website: data.organizer_website,
      status: data.status,
      registration_fee_inr: Number(data.registration_fee_inr),
      min_team_size: data.min_team_size,
      max_team_size: data.max_team_size,
      prize_pool_inr: Number(data.prize_pool_inr),
      first_prize_inr: Number(data.first_prize_inr),
      second_prize_inr: Number(data.second_prize_inr),
      third_prize_inr: Number(data.third_prize_inr),
      certificates_top_n: data.certificates_top_n,
      registration_start_at: data.registration_start_at,
      registration_end_at: data.registration_end_at,
      submission_deadline: data.submission_deadline,
      results_announced_at: data.results_announced_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // --- TRACKS ---
  static async getTracks(eventId: string = 'skaleathon-2027'): Promise<EventTrack[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('event_tracks')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true);

    if (error || !data) return [];
    return data.map((t) => ({
      id: t.id,
      event_id: t.event_id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      color_accent: t.color_accent,
      is_active: t.is_active,
      created_at: t.created_at,
    }));
  }

  static async getTrack(trackId: string): Promise<EventTrack | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('event_tracks')
      .select('*')
      .eq('id', trackId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      event_id: data.event_id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      color_accent: data.color_accent,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  }

  // --- PROFILES ---
  static async getProfile(userId: string): Promise<Profile | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      college_or_org: data.college_name,
      role: data.system_role,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getProfileByEmail(email: string): Promise<Profile | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .ilike('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      college_or_org: data.college_name,
      role: data.system_role,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async upsertProfile(data: {
    id: string;
    email: string;
    full_name: string;
    phone?: string | null;
    college_or_org?: string | null;
    city?: string | null;
    state?: string | null;
    role?: Profile['role'];
  }): Promise<Profile> {
    const client = this.getClient();
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@skalekraft.in')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    const isExplicitAdmin = adminEmails.includes(data.email.toLowerCase());
    const finalRole = isExplicitAdmin ? 'admin' : (data.role || 'participant');

    const dbProfile = {
      id: data.id,
      email: data.email.toLowerCase(),
      full_name: data.full_name,
      phone: data.phone || null,
      college_name: data.college_or_org || null,
      system_role: finalRole,
      updated_at: new Date().toISOString(),
    };

    const { data: res, error } = await client
      .from('profiles')
      .upsert(dbProfile, { onConflict: 'id' })
      .select()
      .single();

    if (error || !res) {
      throw new Error(`Failed to upsert profile: ${error?.message}`);
    }

    return {
      id: res.id,
      email: res.email,
      full_name: res.full_name,
      phone: res.phone,
      college_or_org: res.college_name,
      role: res.system_role,
      created_at: res.created_at,
      updated_at: res.updated_at,
    };
  }

  // --- TEAMS & MEMBERS ---
  static async checkDuplicateMembership(email: string, excludeTeamId?: string): Promise<boolean> {
    const client = this.getClient();
    const cleanEmail = email.toLowerCase().trim();

    let query = client
      .from('team_members')
      .select('team_id, email, teams!inner(status)')
      .ilike('email', cleanEmail)
      .neq('teams.status', 'withdrawn');

    if (excludeTeamId) {
      query = query.neq('team_id', excludeTeamId);
    }

    const { data, error } = await query;
    if (error || !data) return false;
    return data.length > 0;
  }

  static async createTeam(params: {
    name: string;
    track_id: string;
    leader_id: string;
    leader_name: string;
    leader_email: string;
    leader_phone?: string | null;
    description?: string | null;
    college_or_org?: string | null;
    city?: string | null;
    state?: string | null;
    members: Array<{ name: string; email: string; phone?: string | null; college_or_org?: string | null }>;
  }): Promise<{ team: Team; members: TeamMember[] }> {
    const client = this.getClient();

    // 1. Ensure leader profile exists
    await this.upsertProfile({
      id: params.leader_id,
      email: params.leader_email,
      full_name: params.leader_name,
      phone: params.leader_phone || null,
      college_or_org: params.college_or_org || null,
      city: params.city || null,
      state: params.state || null,
      role: 'team_leader',
    });

    // 2. Insert team into teams table
    const teamId = crypto.randomUUID();
    const dbTeam = {
      id: teamId,
      event_id: 'skaleathon-2027',
      team_name: params.name,
      track_id: params.track_id,
      leader_id: params.leader_id,
      status: 'registered',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: teamRes, error: teamErr } = await client
      .from('teams')
      .insert(dbTeam)
      .select()
      .single();

    if (teamErr || !teamRes) {
      throw new Error(`Failed to create team in Supabase: ${teamErr?.message}`);
    }

    // 3. Insert team members
    const membersToInsert = [
      {
        id: crypto.randomUUID(),
        team_id: teamId,
        profile_id: params.leader_id,
        name: params.leader_name,
        email: params.leader_email.toLowerCase(),
        phone: params.leader_phone || null,
        college_name: params.college_or_org || null,
        is_leader: true,
        created_at: new Date().toISOString(),
      },
      ...params.members.map((m) => ({
        id: crypto.randomUUID(),
        team_id: teamId,
        profile_id: null,
        name: m.name,
        email: m.email.toLowerCase(),
        phone: m.phone || null,
        college_name: m.college_or_org || null,
        is_leader: false,
        created_at: new Date().toISOString(),
      })),
    ];

    const { data: membersRes, error: membersErr } = await client
      .from('team_members')
      .insert(membersToInsert)
      .select();

    if (membersErr || !membersRes) {
      throw new Error(`Failed to insert team members in Supabase: ${membersErr?.message}`);
    }

    // 4. Record policy consent
    await client.from('policy_consents').insert({
      id: crypto.randomUUID(),
      user_id: params.leader_id,
      policy_type: 'terms_and_rules',
      version: '1.0',
      consented_at: new Date().toISOString(),
    });

    // 5. Audit log
    await this.logAudit({
      actor_id: params.leader_id,
      action: 'CREATE_TEAM',
      target_entity: 'teams',
      target_id: teamId,
      details: { team_name: params.name, track_id: params.track_id, member_count: membersToInsert.length },
    });

    const mappedTeam: Team = {
      id: teamRes.id,
      event_id: teamRes.event_id,
      name: teamRes.team_name,
      track_id: teamRes.track_id,
      leader_id: teamRes.leader_id,
      status: teamRes.status,
      created_at: teamRes.created_at,
      updated_at: teamRes.updated_at,
    };

    const mappedMembers: TeamMember[] = membersRes.map((m) => ({
      id: m.id,
      team_id: m.team_id,
      user_id: m.profile_id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      role: m.is_leader ? 'leader' : 'member',
      college_or_org: m.college_name,
      created_at: m.created_at,
      updated_at: m.created_at,
    }));

    return { team: mappedTeam, members: mappedMembers };
  }

  static async getTeam(teamId: string): Promise<(Team & { members: TeamMember[]; track?: EventTrack }) | null> {
    const client = this.getClient();
    const { data: teamData, error: teamErr } = await client
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (teamErr || !teamData) return null;

    const { data: membersData } = await client
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    let track: EventTrack | undefined;
    if (teamData.track_id) {
      const trackObj = await this.getTrack(teamData.track_id);
      if (trackObj) track = trackObj;
    }

    const members: TeamMember[] = (membersData || []).map((m) => ({
      id: m.id,
      team_id: m.team_id,
      user_id: m.profile_id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      role: m.is_leader ? 'leader' : 'member',
      college_or_org: m.college_name,
      created_at: m.created_at,
      updated_at: m.created_at,
    }));

    return {
      id: teamData.id,
      event_id: teamData.event_id,
      name: teamData.team_name,
      track_id: teamData.track_id,
      leader_id: teamData.leader_id,
      status: teamData.status,
      created_at: teamData.created_at,
      updated_at: teamData.updated_at,
      members,
      track,
    };
  }

  static async getTeamByLeader(leaderId: string): Promise<(Team & { members: TeamMember[] }) | null> {
    const client = this.getClient();
    const { data: teamData, error } = await client
      .from('teams')
      .select('*')
      .eq('leader_id', leaderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !teamData) return null;
    return this.getTeam(teamData.id);
  }

  static async getTeamByMemberEmail(email: string): Promise<(Team & { members: TeamMember[] }) | null> {
    const client = this.getClient();
    const { data: memberData, error } = await client
      .from('team_members')
      .select('team_id')
      .ilike('email', email.trim().toLowerCase())
      .limit(1)
      .maybeSingle();

    if (error || !memberData) return null;
    return this.getTeam(memberData.team_id);
  }

  static async updateTeamStatus(teamId: string, status: Team['status'], actorId: string): Promise<Team> {
    const client = this.getClient();
    const { data, error } = await client
      .from('teams')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', teamId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update team status in Supabase: ${error?.message}`);
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_TEAM_STATUS',
      target_entity: 'teams',
      target_id: teamId,
      details: { status },
    });

    return {
      id: data.id,
      event_id: data.event_id,
      name: data.team_name,
      track_id: data.track_id,
      leader_id: data.leader_id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getTeams(eventId: string = 'skaleathon-2027'): Promise<Array<Team & { members: TeamMember[] }>> {
    const client = this.getClient();
    const { data: teamsData, error: teamsErr } = await client
      .from('teams')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (teamsErr || !teamsData) return [];

    const { data: allMembers } = await client
      .from('team_members')
      .select('*');

    const membersByTeam = new Map<string, TeamMember[]>();
    for (const m of allMembers || []) {
      const list = membersByTeam.get(m.team_id) || [];
      list.push({
        id: m.id,
        team_id: m.team_id,
        user_id: m.profile_id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        role: m.is_leader ? 'leader' : 'member',
        college_or_org: m.college_name,
        created_at: m.created_at,
        updated_at: m.created_at,
      });
      membersByTeam.set(m.team_id, list);
    }

    return teamsData.map((t) => ({
      id: t.id,
      event_id: t.event_id,
      name: t.team_name,
      track_id: t.track_id,
      leader_id: t.leader_id,
      status: t.status,
      created_at: t.created_at,
      updated_at: t.updated_at,
      members: membersByTeam.get(t.id) || [],
    }));
  }

  // --- PAYMENTS ---
  static async createPaymentOrder(data: {
    id: string;
    team_id: string;
    amount_inr: number;
    currency: string;
    status: PaymentOrder['status'];
  }): Promise<PaymentOrder> {
    const client = this.getClient();
    const dbOrder = {
      id: data.id,
      order_id: data.id,
      team_id: data.team_id,
      amount_inr: data.amount_inr,
      currency: data.currency,
      status: data.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: res, error } = await client
      .from('payment_orders')
      .insert(dbOrder)
      .select()
      .single();

    if (error || !res) {
      throw new Error(`Failed to create payment order in Supabase: ${error?.message}`);
    }

    return {
      id: res.id,
      team_id: res.team_id,
      amount_inr: Number(res.amount_inr),
      currency: res.currency,
      status: res.status,
      razorpay_payment_id: res.payment_id,
      razorpay_signature: res.signature,
      error_reason: res.error_reason,
      created_at: res.created_at,
      updated_at: res.updated_at,
    };
  }

  static async updatePaymentOrder(
    orderId: string,
    updates: Partial<PaymentOrder>
  ): Promise<PaymentOrder> {
    const client = this.getClient();
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) dbUpdates.status = updates.status;
    if (updates.razorpay_payment_id) dbUpdates.payment_id = updates.razorpay_payment_id;
    if (updates.razorpay_signature) dbUpdates.signature = updates.razorpay_signature;
    if (updates.error_reason) dbUpdates.error_reason = updates.error_reason;

    const { data, error } = await client
      .from('payment_orders')
      .update(dbUpdates)
      .eq('id', orderId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update payment order in Supabase: ${error?.message}`);
    }

    return {
      id: data.id,
      team_id: data.team_id,
      amount_inr: Number(data.amount_inr),
      currency: data.currency,
      status: data.status,
      razorpay_payment_id: data.payment_id,
      razorpay_signature: data.signature,
      error_reason: data.error_reason,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('payment_orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      team_id: data.team_id,
      amount_inr: Number(data.amount_inr),
      currency: data.currency,
      status: data.status,
      razorpay_payment_id: data.payment_id,
      razorpay_signature: data.signature,
      error_reason: data.error_reason,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async logWebhookEvent(data: {
    id: string;
    event_type: string;
    payload: Record<string, unknown>;
  }): Promise<{ isDuplicate: boolean; event: PaymentWebhookEvent }> {
    const client = this.getClient();
    const { data: existing } = await client
      .from('payment_webhook_events')
      .select('*')
      .eq('id', data.id)
      .maybeSingle();

    if (existing) {
      return {
        isDuplicate: true,
        event: {
          id: existing.id,
          event_type: existing.event_type,
          payload: existing.payload,
          processed: existing.processed_at !== null,
          created_at: existing.created_at,
          processed_at: existing.processed_at,
        },
      };
    }

    const { data: inserted, error } = await client
      .from('payment_webhook_events')
      .insert({
        id: data.id,
        event_id: data.id,
        event_type: data.event_type,
        payload: data.payload,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to log webhook event: ${error?.message}`);
    }

    return {
      isDuplicate: false,
      event: {
        id: inserted.id,
        event_type: inserted.event_type,
        payload: inserted.payload,
        processed: false,
        created_at: inserted.created_at,
        processed_at: null,
      },
    };
  }

  // --- SUBMISSIONS ---
  static async createSubmission(
    data: {
      team_id: string;
      track_id: string;
      title: string;
      problem_statement: string;
      description: string;
      solution_overview?: string;
      tech_stack: string[];
      github_url: string;
      live_demo_url?: string | null;
      demo_video_url?: string | null;
      presentation_url?: string | null;
      member_contributions?: string | null;
      ai_tool_disclosure?: string | null;
      status?: Submission['status'];
    },
    actorId: string
  ): Promise<Submission> {
    const client = this.getClient();
    const submissionId = crypto.randomUUID();

    const dbSubmission = {
      id: submissionId,
      team_id: data.team_id,
      track_id: data.track_id,
      project_title: data.title,
      short_description: data.problem_statement,
      full_description: data.description,
      repository_url: data.github_url,
      demo_url: data.live_demo_url || null,
      presentation_url: data.presentation_url || null,
      tech_stack: data.tech_stack || [],
      is_locked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: subRes, error: subErr } = await client
      .from('submissions')
      .insert(dbSubmission)
      .select()
      .single();

    if (subErr || !subRes) {
      throw new Error(`Failed to create submission in Supabase: ${subErr?.message}`);
    }

    // Save version 1 snapshot
    await client.from('submission_versions').insert({
      id: crypto.randomUUID(),
      submission_id: submissionId,
      version_number: 1,
      project_title: data.title,
      short_description: data.problem_statement,
      full_description: data.description,
      repository_url: data.github_url,
      demo_url: data.live_demo_url || null,
      presentation_url: data.presentation_url || null,
      tech_stack: data.tech_stack || [],
      created_at: new Date().toISOString(),
    });

    // Auto-assign active judges whose expertise matches the track
    const { data: activeJudges } = await client
      .from('judges')
      .select('*')
      .eq('is_active', true);

    if (activeJudges && activeJudges.length > 0) {
      const assignments = activeJudges
        .filter((j) => !j.expertise_tracks || j.expertise_tracks.length === 0 || j.expertise_tracks.includes(data.track_id))
        .map((j) => ({
          id: crypto.randomUUID(),
          judge_id: j.id,
          submission_id: submissionId,
          status: 'assigned',
          assigned_at: new Date().toISOString(),
        }));

      if (assignments.length > 0) {
        await client.from('judge_assignments').upsert(assignments, { onConflict: 'judge_id,submission_id' });
      }
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'CREATE_SUBMISSION',
      target_entity: 'submissions',
      target_id: submissionId,
      details: { title: data.title, track_id: data.track_id },
    });

    return {
      id: subRes.id,
      team_id: subRes.team_id,
      track_id: subRes.track_id,
      title: subRes.project_title,
      problem_statement: subRes.short_description,
      description: subRes.full_description,
      solution_overview: subRes.short_description,
      tech_stack: subRes.tech_stack || [],
      github_url: subRes.repository_url,
      live_demo_url: subRes.demo_url,
      demo_video_url: null,
      presentation_url: subRes.presentation_url,
      member_contributions: null,
      ai_tool_disclosure: null,
      file_attachments: [],
      status: 'submitted',
      submitted_at: subRes.created_at,
      created_at: subRes.created_at,
      updated_at: subRes.updated_at,
    };
  }

  static async updateSubmission(
    submissionId: string,
    updates: Partial<Submission>,
    actorId: string
  ): Promise<Submission> {
    const client = this.getClient();
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) dbUpdates.project_title = updates.title;
    if (updates.problem_statement) dbUpdates.short_description = updates.problem_statement;
    if (updates.description) dbUpdates.full_description = updates.description;
    if (updates.github_url) dbUpdates.repository_url = updates.github_url;
    if (updates.live_demo_url !== undefined) dbUpdates.demo_url = updates.live_demo_url;
    if (updates.presentation_url !== undefined) dbUpdates.presentation_url = updates.presentation_url;
    if (updates.tech_stack) dbUpdates.tech_stack = updates.tech_stack;

    const { data: subRes, error } = await client
      .from('submissions')
      .update(dbUpdates)
      .eq('id', submissionId)
      .select()
      .single();

    if (error || !subRes) {
      throw new Error(`Failed to update submission: ${error?.message}`);
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_SUBMISSION',
      target_entity: 'submissions',
      target_id: submissionId,
      details: updates,
    });

    return {
      id: subRes.id,
      team_id: subRes.team_id,
      track_id: subRes.track_id,
      title: subRes.project_title,
      problem_statement: subRes.short_description,
      description: subRes.full_description,
      solution_overview: subRes.short_description,
      tech_stack: subRes.tech_stack || [],
      github_url: subRes.repository_url,
      live_demo_url: subRes.demo_url,
      demo_video_url: null,
      presentation_url: subRes.presentation_url,
      member_contributions: null,
      ai_tool_disclosure: null,
      file_attachments: [],
      status: 'submitted',
      submitted_at: subRes.created_at,
      created_at: subRes.created_at,
      updated_at: subRes.updated_at,
    };
  }

  static async getSubmissionByTeam(teamId: string): Promise<Submission | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      team_id: data.team_id,
      track_id: data.track_id,
      title: data.project_title,
      problem_statement: data.short_description,
      description: data.full_description,
      solution_overview: data.short_description,
      tech_stack: data.tech_stack || [],
      github_url: data.repository_url,
      live_demo_url: data.demo_url,
      demo_video_url: null,
      presentation_url: data.presentation_url,
      member_contributions: null,
      ai_tool_disclosure: null,
      file_attachments: [],
      status: 'submitted',
      submitted_at: data.created_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getSubmission(submissionId: string): Promise<Submission | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      team_id: data.team_id,
      track_id: data.track_id,
      title: data.project_title,
      problem_statement: data.short_description,
      description: data.full_description,
      solution_overview: data.short_description,
      tech_stack: data.tech_stack || [],
      github_url: data.repository_url,
      live_demo_url: data.demo_url,
      demo_video_url: null,
      presentation_url: data.presentation_url,
      member_contributions: null,
      ai_tool_disclosure: null,
      file_attachments: [],
      status: 'submitted',
      submitted_at: data.created_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getSubmissions(eventId: string = 'skaleathon-2027'): Promise<Array<Submission & { team?: Team }>> {
    const client = this.getClient();
    const { data: teams } = await client
      .from('teams')
      .select('id, team_name, track_id, leader_id, status, created_at, updated_at')
      .eq('event_id', eventId);

    if (!teams || teams.length === 0) return [];

    const teamIds = teams.map((t) => t.id);
    const { data: subs, error } = await client
      .from('submissions')
      .select('*')
      .in('team_id', teamIds);

    if (error || !subs) return [];

    const teamMap = new Map(teams.map((t) => [t.id, t]));

    return subs.map((s) => {
      const rawTeam = teamMap.get(s.team_id);
      return {
        id: s.id,
        team_id: s.team_id,
        track_id: s.track_id,
        title: s.project_title,
        problem_statement: s.short_description,
        description: s.full_description,
        solution_overview: s.short_description,
        tech_stack: s.tech_stack || [],
        github_url: s.repository_url,
        live_demo_url: s.demo_url,
        demo_video_url: null,
        presentation_url: s.presentation_url,
        member_contributions: null,
        ai_tool_disclosure: null,
        file_attachments: [],
        status: 'submitted',
        submitted_at: s.created_at,
        created_at: s.created_at,
        updated_at: s.updated_at,
        team: rawTeam
          ? {
              id: rawTeam.id,
              event_id: eventId,
              name: rawTeam.team_name,
              track_id: rawTeam.track_id,
              leader_id: rawTeam.leader_id,
              status: rawTeam.status,
              created_at: rawTeam.created_at,
              updated_at: rawTeam.updated_at,
            }
          : undefined,
      };
    });
  }

  // --- JUDGING ---
  static async getJudges(): Promise<Judge[]> {
    const client = this.getClient();
    const { data, error } = await client.from('judges').select('*');
    if (error || !data) return [];
    return data.map((j) => ({
      id: j.id,
      email: j.email,
      full_name: j.name,
      track_ids: j.expertise_tracks || [],
      bio: j.bio,
      is_active: j.is_active,
      created_at: j.created_at,
    }));
  }

  static async getJudgeAssignments(judgeId: string): Promise<Array<JudgeAssignment & { submission?: Submission; team?: Team }>> {
    const client = this.getClient();
    const { data: assignments, error } = await client
      .from('judge_assignments')
      .select('*')
      .eq('judge_id', judgeId);

    if (error || !assignments) return [];

    const result: Array<JudgeAssignment & { submission?: Submission; team?: Team }> = [];
    for (const a of assignments) {
      const sub = await this.getSubmission(a.submission_id);
      let team: Team | undefined;
      if (sub) {
        const teamObj = await this.getTeam(sub.team_id);
        if (teamObj) team = teamObj;
      }

      result.push({
        id: a.id,
        judge_id: a.judge_id,
        submission_id: a.submission_id,
        status: a.status,
        conflict_of_interest: false,
        created_at: a.assigned_at || new Date().toISOString(),
        submission: sub || undefined,
        team,
      });
    }

    return result;
  }

  static async submitScores(data: {
    judge_id: string;
    submission_id: string;
    scores: Array<{ criterion_id: string; score: number; feedback?: string }>;
    general_feedback?: string;
  }): Promise<void> {
    const client = this.getClient();

    // 1. Get criteria weights
    const { data: criteria } = await client.from('judging_criteria').select('*');
    const criteriaMap = new Map((criteria || []).map((c) => [c.id, c]));

    let totalWeightedScore = 0;
    for (const s of data.scores) {
      const crit = criteriaMap.get(s.criterion_id);
      if (crit) {
        totalWeightedScore += (s.score / crit.max_score) * crit.weight_percentage;
      }
    }

    // 2. Upsert scores
    const scoreRows = data.scores.map((s) => ({
      id: crypto.randomUUID(),
      submission_id: data.submission_id,
      judge_id: data.judge_id,
      criterion_id: s.criterion_id,
      score: s.score,
      feedback: s.feedback || null,
      updated_at: new Date().toISOString(),
    }));

    await client.from('scores').upsert(scoreRows, { onConflict: 'submission_id,judge_id,criterion_id' });

    // 3. Upsert score_submissions summary
    await client.from('score_submissions').upsert(
      {
        id: crypto.randomUUID(),
        submission_id: data.submission_id,
        judge_id: data.judge_id,
        total_weighted_score: Number(totalWeightedScore.toFixed(2)),
        general_feedback: data.general_feedback || null,
        submitted_at: new Date().toISOString(),
        is_finalized: true,
      },
      { onConflict: 'submission_id,judge_id' }
    );

    // 4. Update assignment status
    await client
      .from('judge_assignments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('judge_id', data.judge_id)
      .eq('submission_id', data.submission_id);

    await this.logAudit({
      actor_id: data.judge_id,
      action: 'SUBMIT_SCORES',
      target_entity: 'submissions',
      target_id: data.submission_id,
      details: { total_weighted_score: totalWeightedScore },
    });
  }

  static async getJudgingCriteria(): Promise<JudgingCriterion[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('judging_criteria')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      weight_percentage: c.weight_percentage,
      max_score: c.max_score,
      sort_order: c.sort_order,
    }));
  }

  static async updateJudgingCriteria(
    criteria: JudgingCriterion[],
    actorId: string
  ): Promise<JudgingCriterion[]> {
    const client = this.getClient();
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight_percentage, 0);
    if (totalWeight !== 100) {
      throw new Error(`Total criteria weights must equal 100% (currently ${totalWeight}%).`);
    }

    const rows = criteria.map((c, index) => ({
      id: c.id,
      name: c.name,
      description: c.description || null,
      weight_percentage: c.weight_percentage,
      max_score: c.max_score || 10,
      sort_order: index + 1,
    }));

    const { data, error } = await client
      .from('judging_criteria')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error || !data) {
      throw new Error(`Failed to update criteria in Supabase: ${error?.message}`);
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_CRITERIA',
      target_entity: 'judging_criteria',
      details: { count: rows.length },
    });

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      weight_percentage: c.weight_percentage,
      max_score: c.max_score,
      sort_order: c.sort_order,
    }));
  }

  // --- LEADERBOARD & CERTIFICATES ---
  static async getLeaderboard(eventId: string = 'skaleathon-2027', publishedOnly: boolean = false): Promise<LeaderboardResult[]> {
    const client = this.getClient();
    let query = client
      .from('leaderboard_results')
      .select('*, submissions(project_title, team_id, teams(team_name, track_id))')
      .eq('event_id', eventId)
      .order('rank', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r: any) => ({
      id: r.id,
      event_id: r.event_id,
      team_id: r.submissions?.team_id || '',
      team_name: r.submissions?.teams?.team_name || 'Team',
      project_title: r.submissions?.project_title || 'Project',
      track_id: r.track_id,
      rank: r.rank,
      final_score: Number(r.final_score || 0),
      prize_category: r.awarded_prize,
      is_published: r.is_published,
      published_at: r.published_at,
      created_at: r.created_at,
    }));
  }

  static async publishLeaderboard(eventId: string = 'skaleathon-2027', actorId: string): Promise<void> {
    const client = this.getClient();
    await client
      .from('leaderboard_results')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .eq('event_id', eventId);

    await client
      .from('events')
      .update({ status: 'results_announced', results_announced_at: new Date().toISOString() })
      .eq('id', eventId);

    await this.logAudit({
      actor_id: actorId,
      action: 'PUBLISH_LEADERBOARD',
      target_entity: 'leaderboard_results',
      target_id: eventId,
    });
  }

  static async getCertificateByCode(code: string): Promise<Certificate | null> {
    const client = this.getClient();
    const { data, error } = await client
      .from('certificates')
      .select('*, teams(team_name)')
      .eq('certificate_code', code.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      certificate_code: data.certificate_code,
      team_id: data.team_id,
      team_name: data.teams?.team_name || 'Team',
      recipient_name: data.recipient_name,
      recipient_email: data.recipient_email,
      certificate_type: data.certificate_type,
      achievement_text: data.certificate_type === 'top_25_merit' ? 'Top 25 Merit Certificate' : 'Certificate of Participation',
      qr_verification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-certificate/${data.certificate_code}`,
      pdf_url: data.pdf_storage_path,
      issued_at: data.issued_at,
      is_revoked: data.is_revoked,
      revocation_reason: data.revocation_reason,
      created_at: data.issued_at,
    };
  }

  static async getCertificatesByTeam(teamId: string): Promise<Certificate[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('certificates')
      .select('*')
      .eq('team_id', teamId);

    if (error || !data) return [];

    return data.map((c) => ({
      id: c.id,
      certificate_code: c.certificate_code,
      team_id: c.team_id,
      recipient_name: c.recipient_name,
      recipient_email: c.recipient_email,
      certificate_type: c.certificate_type,
      achievement_text: c.certificate_type === 'top_25_merit' ? 'Top 25 Merit' : 'Participation',
      qr_verification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-certificate/${c.certificate_code}`,
      pdf_url: c.pdf_storage_path,
      issued_at: c.issued_at,
      is_revoked: c.is_revoked,
      revocation_reason: c.revocation_reason,
      created_at: c.issued_at,
    }));
  }

  // --- AUDIT LOGS ---
  static async logAudit(entry: {
    actor_id: string;
    actor_email?: string;
    action: string;
    target_entity: string;
    target_id?: string;
    details?: Record<string, unknown>;
    ip_address?: string;
  }): Promise<void> {
    const client = this.getClient();
    await client.from('audit_logs').insert({
      id: crypto.randomUUID(),
      actor_id: entry.actor_id,
      actor_email: entry.actor_email || null,
      action: entry.action,
      resource_type: entry.target_entity,
      resource_id: entry.target_id || null,
      metadata: entry.details || {},
      ip_address: entry.ip_address || null,
      created_at: new Date().toISOString(),
    });
  }

  static async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((l) => ({
      id: l.id,
      actor_id: l.actor_id,
      action: l.action,
      target_entity: l.resource_type,
      target_id: l.resource_id,
      details: l.metadata || {},
      ip_address: l.ip_address,
      created_at: l.created_at,
    }));
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(eventId: string = 'skaleathon-2027'): Promise<Announcement[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('announcements')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((a) => ({
      id: a.id,
      event_id: a.event_id,
      title: a.title,
      content: a.content,
      category: a.priority === 'high' ? 'urgent' : 'general',
      is_published: true,
      published_at: a.created_at,
      created_at: a.created_at,
    }));
  }

  // --- OVERVIEW METRICS FOR ADMIN ---
  static async getAdminOverview(eventId: string = 'skaleathon-2027') {
    const client = this.getClient();
    const [
      { count: totalTeams },
      { count: paidRegistrations },
      { count: pendingPayments },
      { count: failedPayments },
      { count: submittedProjects },
      { count: totalAssignments },
      { count: completedAssignments },
      { count: publishedResults },
      { count: certificatesIssued },
    ] = await Promise.all([
      client.from('teams').select('*', { count: 'exact', head: true }).eq('event_id', eventId),
      client.from('teams').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('status', 'paid'),
      client.from('payment_orders').select('*', { count: 'exact', head: true }).in('status', ['created', 'attempted']),
      client.from('payment_orders').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      client.from('submissions').select('*', { count: 'exact', head: true }),
      client.from('judge_assignments').select('*', { count: 'exact', head: true }),
      client.from('judge_assignments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      client.from('leaderboard_results').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('is_published', true),
      client.from('certificates').select('*', { count: 'exact', head: true }).eq('is_revoked', false),
    ]);

    const paid = paidRegistrations || 0;
    const totalAss = totalAssignments || 0;
    const compAss = completedAssignments || 0;

    return {
      totalTeams: totalTeams || 0,
      paidRegistrations: paid,
      pendingPayments: pendingPayments || 0,
      failedPayments: failedPayments || 0,
      submittedProjects: submittedProjects || 0,
      judgingProgress: totalAss > 0 ? Math.round((compAss / totalAss) * 100) : 0,
      publishedResults: publishedResults || 0,
      certificatesIssued: certificatesIssued || 0,
      verifiedRevenueINR: paid * 99,
    };
  }
}
