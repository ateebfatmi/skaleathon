import { FileStore } from './file-store';
import { SupabaseStore } from './supabase-store';
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

export class EventRepository {
  private static store = FileStore.getInstance();

  private static isSupabaseEnabled(): boolean {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  // --- EVENTS ---
  static async getEvent(eventId: string = 'skaleathon-2027'): Promise<EventData> {
    if (this.isSupabaseEnabled()) {
      try {
        const ev = await SupabaseStore.getEvent(eventId);
        if (ev) return ev;
      } catch (err) {
        console.warn('SupabaseStore.getEvent error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }
    return event;
  }

  static async updateEvent(
    updates: Partial<EventData>,
    actorId: string,
    eventId: string = 'skaleathon-2027'
  ): Promise<EventData> {
    if (this.isSupabaseEnabled()) {
      try {
        return await SupabaseStore.updateEvent(updates, actorId, eventId);
      } catch (err) {
        console.warn('SupabaseStore.updateEvent error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const index = state.events.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error(`Event not found: ${eventId}`);

    // Validate date sequence if provided
    if (updates.registration_start_at && updates.registration_end_at) {
      if (new Date(updates.registration_start_at) >= new Date(updates.registration_end_at)) {
        throw new Error('Registration start date must be before registration end date.');
      }
    }
    if (updates.registration_end_at && updates.submission_deadline) {
      if (new Date(updates.registration_end_at) > new Date(updates.submission_deadline)) {
        throw new Error('Registration end date must not be later than submission deadline.');
      }
    }

    state.events[index] = {
      ...state.events[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_EVENT_CONFIG',
      target_entity: 'events',
      target_id: eventId,
      details: updates,
    });

    this.store.saveState();
    return state.events[index];
  }

  // --- TRACKS ---
  static async getTracks(eventId: string = 'skaleathon-2027'): Promise<EventTrack[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const tracks = await SupabaseStore.getTracks(eventId);
        if (tracks.length > 0) return tracks;
      } catch (err) {
        console.warn('SupabaseStore.getTracks error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.tracks.filter((t) => t.event_id === eventId && t.is_active);
  }

  static async getTrack(trackId: string): Promise<EventTrack | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const track = await SupabaseStore.getTrack(trackId);
        if (track) return track;
      } catch (err) {
        console.warn('SupabaseStore.getTrack error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.tracks.find((t) => t.id === trackId) || null;
  }

  // --- PROFILES ---
  static async getProfile(userId: string): Promise<Profile | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const profile = await SupabaseStore.getProfile(userId);
        if (profile) return profile;
      } catch (err) {
        console.warn('SupabaseStore.getProfile error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.profiles.find((p) => p.id === userId) || null;
  }

  static async getProfileByEmail(email: string): Promise<Profile | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const profile = await SupabaseStore.getProfileByEmail(email);
        if (profile) return profile;
      } catch (err) {
        console.warn('SupabaseStore.getProfileByEmail error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || null;
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
    if (this.isSupabaseEnabled()) {
      try {
        const profile = await SupabaseStore.upsertProfile(data);
        return profile;
      } catch (err) {
        console.warn('SupabaseStore.upsertProfile error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const existingIndex = state.profiles.findIndex(
      (p) => p.id === data.id || p.email.toLowerCase() === data.email.toLowerCase()
    );

    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@skalekraft.in')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    const isExplicitAdmin = adminEmails.includes(data.email.toLowerCase());
    const finalRole = isExplicitAdmin ? 'admin' : (data.role || 'participant');

    const profile: Profile = {
      id: data.id,
      email: data.email.toLowerCase(),
      full_name: data.full_name,
      phone: data.phone || null,
      college_or_org: data.college_or_org || null,
      city: data.city || null,
      state: data.state || null,
      role: finalRole,
      created_at: existingIndex >= 0 ? state.profiles[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      state.profiles[existingIndex] = profile;
    } else {
      state.profiles.push(profile);
    }

    this.store.saveState();
    return profile;
  }

  // --- TEAMS & MEMBERS ---
  static async checkDuplicateMembership(email: string, excludeTeamId?: string): Promise<boolean> {
    if (this.isSupabaseEnabled()) {
      try {
        return await SupabaseStore.checkDuplicateMembership(email, excludeTeamId);
      } catch (err) {
        console.warn('SupabaseStore.checkDuplicateMembership error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const cleanEmail = email.toLowerCase().trim();
    return state.teamMembers.some((m) => {
      if (excludeTeamId && m.team_id === excludeTeamId) return false;
      return m.email.toLowerCase() === cleanEmail;
    });
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
    if (this.isSupabaseEnabled()) {
      try {
        const res = await SupabaseStore.createTeam(params);
        return res;
      } catch (err) {
        console.warn('SupabaseStore.createTeam error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const event = await this.getEvent();

    if (event.status !== 'registration_open') {
      throw new Error(`Registration is currently closed (${event.status}).`);
    }

    // Check duplicate team name
    if (state.teams.some((t) => t.name.toLowerCase().trim() === params.name.toLowerCase().trim())) {
      throw new Error(`A team named "${params.name}" already exists.`);
    }

    // Check team size (1-6)
    const totalMembers = 1 + params.members.length;
    if (totalMembers < event.min_team_size || totalMembers > event.max_team_size) {
      throw new Error(
        `Team size must be between ${event.min_team_size} and ${event.max_team_size} members (got ${totalMembers}).`
      );
    }

    // Check duplicate leader membership
    const leaderDuplicate = await this.checkDuplicateMembership(params.leader_email);
    if (leaderDuplicate) {
      throw new Error(`Team leader (${params.leader_email}) is already registered in another team.`);
    }

    // Check duplicate member emails
    const seenEmails = new Set<string>([params.leader_email.toLowerCase().trim()]);
    for (const member of params.members) {
      const email = member.email.toLowerCase().trim();
      if (seenEmails.has(email)) {
        throw new Error(`Duplicate email within team: ${email}`);
      }
      seenEmails.add(email);

      const duplicate = await this.checkDuplicateMembership(email);
      if (duplicate) {
        throw new Error(`Member ${member.name} (${email}) is already registered in another team.`);
      }
    }

    const teamId = 'team_' + Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();

    const team: Team = {
      id: teamId,
      event_id: event.id,
      name: params.name.trim(),
      track_id: params.track_id,
      leader_id: params.leader_id,
      description: params.description || null,
      college_or_org: params.college_or_org || null,
      city: params.city || null,
      state: params.state || null,
      status: 'registered',
      created_at: now,
      updated_at: now,
    };

    const teamMembers: TeamMember[] = [
      {
        id: 'mem_' + Math.random().toString(36).substring(2, 10),
        team_id: teamId,
        user_id: params.leader_id,
        name: params.leader_name.trim(),
        email: params.leader_email.toLowerCase().trim(),
        phone: params.leader_phone || null,
        role: 'leader',
        college_or_org: params.college_or_org || null,
        created_at: now,
        updated_at: now,
      },
      ...params.members.map((m) => ({
        id: 'mem_' + Math.random().toString(36).substring(2, 10),
        team_id: teamId,
        user_id: null,
        name: m.name.trim(),
        email: m.email.toLowerCase().trim(),
        phone: m.phone || null,
        role: 'member' as const,
        college_or_org: m.college_or_org || null,
        created_at: now,
        updated_at: now,
      })),
    ];

    state.teams.push(team);
    state.teamMembers.push(...teamMembers);

    await this.logAudit({
      actor_id: params.leader_id,
      action: 'CREATE_TEAM_REGISTRATION',
      target_entity: 'teams',
      target_id: teamId,
      details: { teamName: team.name, memberCount: totalMembers },
    });

    this.store.saveState();
    return { team, members: teamMembers };
  }

  static async getTeam(teamId: string): Promise<Team | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const team = await SupabaseStore.getTeam(teamId);
        if (team) return team;
      } catch (err) {
        console.warn('SupabaseStore.getTeam error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.teams.find((t) => t.id === teamId) || null;
  }

  static async getTeamByLeader(leaderId: string): Promise<Team | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const team = await SupabaseStore.getTeamByLeader(leaderId);
        if (team) return team;
      } catch (err) {
        console.warn('SupabaseStore.getTeamByLeader error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.teams.find((t) => t.leader_id === leaderId) || null;
  }

  static async getTeamByMemberEmail(email: string): Promise<Team | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const team = await SupabaseStore.getTeamByMemberEmail(email);
        if (team) return team;
      } catch (err) {
        console.warn('SupabaseStore.getTeamByMemberEmail error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const member = state.teamMembers.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (!member) return null;
    return state.teams.find((t) => t.id === member.team_id) || null;
  }

  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const team = await SupabaseStore.getTeam(teamId);
        if (team?.members && team.members.length > 0) return team.members;
      } catch (err) {
        console.warn('SupabaseStore.getTeamMembers error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.teamMembers.filter((m) => m.team_id === teamId);
  }

  static async listTeams(filters?: { status?: Team['status']; trackId?: string; search?: string }): Promise<
    Array<Team & { members: TeamMember[]; paymentOrder?: PaymentOrder | null }>
  > {
    if (this.isSupabaseEnabled()) {
      try {
        const teams = await SupabaseStore.getTeams();
        if (teams.length > 0) {
          let filtered = teams;
          if (filters?.status) filtered = filtered.filter((t) => t.status === filters.status);
          if (filters?.trackId) filtered = filtered.filter((t) => t.track_id === filters.trackId);
          if (filters?.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.college_or_org?.toLowerCase().includes(q) ||
                t.city?.toLowerCase().includes(q)
            );
          }
          return filtered;
        }
      } catch (err) {
        console.warn('SupabaseStore.getTeams error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    let teams = [...state.teams];

    if (filters?.status) {
      teams = teams.filter((t) => t.status === filters.status);
    }
    if (filters?.trackId) {
      teams = teams.filter((t) => t.track_id === filters.trackId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      teams = teams.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.college_or_org?.toLowerCase().includes(q) ||
          t.city?.toLowerCase().includes(q)
      );
    }

    return teams.map((team) => {
      const members = state.teamMembers.filter((m) => m.team_id === team.id);
      const paymentOrder = state.paymentOrders.find((p) => p.team_id === team.id && p.status === 'paid') ||
        state.paymentOrders.find((p) => p.team_id === team.id) || null;
      return { ...team, members, paymentOrder };
    });
  }

  // --- PAYMENTS & RAZORPAY ORDERS ---
  static async createPaymentOrder(params: {
    teamId: string;
    amountInr: number;
    orderId: string;
  }): Promise<PaymentOrder> {
    if (this.isSupabaseEnabled()) {
      try {
        return await SupabaseStore.createPaymentOrder({
          id: params.orderId,
          team_id: params.teamId,
          amount_inr: params.amountInr,
          currency: 'INR',
          status: 'created',
        });
      } catch (err) {
        console.warn('SupabaseStore.createPaymentOrder error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const existing = state.paymentOrders.find((p) => p.team_id === params.teamId && p.status === 'paid');
    if (existing) {
      return existing;
    }

    const order: PaymentOrder = {
      id: params.orderId,
      team_id: params.teamId,
      amount_inr: params.amountInr,
      currency: 'INR',
      status: 'created',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    state.paymentOrders.push(order);
    this.store.saveState();
    return order;
  }

  static async getPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const order = await SupabaseStore.getPaymentOrder(orderId);
        if (order) return order;
      } catch (err) {
        console.warn('SupabaseStore.getPaymentOrder error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.paymentOrders.find((p) => p.id === orderId) || null;
  }

  static async getPaymentOrderByTeam(teamId: string): Promise<PaymentOrder | null> {
    const state = this.store.getState();
    return state.paymentOrders.find((p) => p.team_id === teamId) || null;
  }

  static async completePaymentOrder(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentOrder> {
    if (this.isSupabaseEnabled()) {
      try {
        const order = await SupabaseStore.updatePaymentOrder(params.orderId, {
          status: 'paid',
          razorpay_payment_id: params.paymentId,
          razorpay_signature: params.signature,
        });
        if (order?.team_id) {
          await SupabaseStore.updateTeamStatus(order.team_id, 'paid', order.team_id);
        }
        return order;
      } catch (err) {
        console.warn('SupabaseStore.completePaymentOrder error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const orderIndex = state.paymentOrders.findIndex((p) => p.id === params.orderId);
    if (orderIndex === -1) {
      throw new Error(`Order ${params.orderId} not found.`);
    }

    const order = state.paymentOrders[orderIndex];
    order.status = 'paid';
    order.razorpay_payment_id = params.paymentId;
    order.razorpay_signature = params.signature;
    order.updated_at = new Date().toISOString();

    // Mark team as paid
    const teamIndex = state.teams.findIndex((t) => t.id === order.team_id);
    if (teamIndex >= 0) {
      state.teams[teamIndex].status = 'paid';
      state.teams[teamIndex].updated_at = new Date().toISOString();
    }

    await this.logAudit({
      actor_id: order.team_id,
      action: 'PAYMENT_VERIFIED_SUCCESS',
      target_entity: 'payment_orders',
      target_id: order.id,
      details: { amount: order.amount_inr, paymentId: params.paymentId },
    });

    this.store.saveState();
    return order;
  }

  static async markPaymentFailed(orderId: string, reason: string): Promise<void> {
    const state = this.store.getState();
    const order = state.paymentOrders.find((p) => p.id === orderId);
    if (order) {
      order.status = 'failed';
      order.error_reason = reason;
      order.updated_at = new Date().toISOString();
      this.store.saveState();
    }
  }

  static async recordWebhookEvent(params: {
    eventId: string;
    eventType: string;
    payload: Record<string, unknown>;
  }): Promise<{ isDuplicate: boolean }> {
    const state = this.store.getState();
    const existing = state.webhookEvents.find((e) => e.id === params.eventId);
    if (existing) {
      return { isDuplicate: true };
    }

    state.webhookEvents.push({
      id: params.eventId,
      event_type: params.eventType,
      payload: params.payload,
      processed: false,
      created_at: new Date().toISOString(),
    });

    this.store.saveState();
    return { isDuplicate: false };
  }

  static async markWebhookProcessed(eventId: string, errorMessage?: string): Promise<void> {
    const state = this.store.getState();
    const evt = state.webhookEvents.find((e) => e.id === eventId);
    if (evt) {
      evt.processed = true;
      evt.error_message = errorMessage || null;
      evt.processed_at = new Date().toISOString();
      this.store.saveState();
    }
  }

  // --- SUBMISSIONS ---
  static async getSubmissionByTeam(teamId: string): Promise<Submission | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const sub = await SupabaseStore.getSubmissionByTeam(teamId);
        if (sub) return sub;
      } catch (err) {
        console.warn('SupabaseStore.getSubmissionByTeam error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.submissions.find((s) => s.team_id === teamId) || null;
  }

  static async getSubmission(submissionId: string): Promise<Submission | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const sub = await SupabaseStore.getSubmission(submissionId);
        if (sub) return sub;
      } catch (err) {
        console.warn('SupabaseStore.getSubmission error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.submissions.find((s) => s.id === submissionId) || null;
  }

  static async saveSubmission(
    teamId: string,
    data: {
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
      file_attachments?: Array<{ name: string; url: string; size?: number; type?: string }>;
      isDraft?: boolean;
    },
    userId: string
  ): Promise<Submission> {
    if (this.isSupabaseEnabled()) {
      try {
        const sub = await SupabaseStore.createSubmission(
          {
            team_id: teamId,
            track_id: data.track_id,
            title: data.title,
            problem_statement: data.problem_statement,
            description: data.description,
            solution_overview: data.solution_overview,
            tech_stack: data.tech_stack,
            github_url: data.github_url,
            live_demo_url: data.live_demo_url,
            demo_video_url: data.demo_video_url,
            presentation_url: data.presentation_url,
            member_contributions: data.member_contributions,
            ai_tool_disclosure: data.ai_tool_disclosure,
            status: data.isDraft ? 'draft' : 'submitted',
          },
          userId
        );
        return sub;
      } catch (err) {
        console.warn('SupabaseStore.createSubmission error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    const team = state.teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Team not found');
    if (team.status !== 'paid') {
      throw new Error('Only teams with verified registration payment can submit projects.');
    }

    const event = await this.getEvent();
    if (event.submission_deadline) {
      if (new Date() > new Date(event.submission_deadline)) {
        throw new Error('Project submissions have officially closed for Skaleathon 2027.');
      }
    }

    const now = new Date().toISOString();
    const existingIndex = state.submissions.findIndex((s) => s.team_id === teamId);

    const submission: Submission = {
      id: existingIndex >= 0 ? state.submissions[existingIndex].id : 'sub_' + Math.random().toString(36).substring(2, 10),
      team_id: teamId,
      track_id: data.track_id,
      title: data.title.trim(),
      problem_statement: data.problem_statement.trim(),
      description: data.description.trim(),
      solution_overview: data.solution_overview.trim(),
      tech_stack: data.tech_stack,
      github_url: data.github_url.trim(),
      live_demo_url: data.live_demo_url?.trim() || null,
      demo_video_url: data.demo_video_url?.trim() || null,
      presentation_url: data.presentation_url?.trim() || null,
      member_contributions: data.member_contributions?.trim() || null,
      ai_tool_disclosure: data.ai_tool_disclosure?.trim() || null,
      file_attachments: data.file_attachments || [],
      status: data.isDraft ? 'draft' : 'submitted',
      submitted_at: data.isDraft ? null : now,
      created_at: existingIndex >= 0 ? state.submissions[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      state.submissions[existingIndex] = submission;
    } else {
      state.submissions.push(submission);
    }

    // Save snapshot in submission_versions
    const versionCount = state.submissionVersions.filter((v) => v.submission_id === submission.id).length;
    state.submissionVersions.push({
      id: 'subver_' + Math.random().toString(36).substring(2, 10),
      submission_id: submission.id,
      version_number: versionCount + 1,
      snapshot: { ...submission },
      submitted_by: userId,
      created_at: now,
    });

    await this.logAudit({
      actor_id: userId,
      action: data.isDraft ? 'SAVE_SUBMISSION_DRAFT' : 'SUBMIT_PROJECT',
      target_entity: 'submissions',
      target_id: submission.id,
      details: { title: submission.title, track: submission.track_id },
    });

    this.store.saveState();
    return submission;
  }

  static async listSubmissions(filters?: { trackId?: string; status?: Submission['status'] }): Promise<
    Array<Submission & { teamName: string; collegeOrOrg: string | null }>
  > {
    const state = this.store.getState();
    let subs = [...state.submissions];

    if (filters?.trackId) {
      subs = subs.filter((s) => s.track_id === filters.trackId);
    }
    if (filters?.status) {
      subs = subs.filter((s) => s.status === filters.status);
    }

    return subs.map((s) => {
      const team = state.teams.find((t) => t.id === s.team_id);
      return {
        ...s,
        teamName: team?.name || 'Unknown Team',
        collegeOrOrg: team?.college_or_org || null,
      };
    });
  }

  // --- JUDGING & CRITERIA ---
  static async getJudgingCriteria(): Promise<JudgingCriterion[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const criteria = await SupabaseStore.getJudgingCriteria();
        if (criteria.length > 0) return criteria;
      } catch (err) {
        console.warn('SupabaseStore.getJudgingCriteria error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return [...state.judgingCriteria].sort((a, b) => a.sort_order - b.sort_order);
  }

  static async updateJudgingCriteria(
    criteria: JudgingCriterion[],
    actorId: string
  ): Promise<JudgingCriterion[]> {
    if (this.isSupabaseEnabled()) {
      try {
        return await SupabaseStore.updateJudgingCriteria(criteria, actorId);
      } catch (err) {
        console.warn('SupabaseStore.updateJudgingCriteria error, using fallback:', err);
      }
    }
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight_percentage, 0);
    if (totalWeight !== 100) {
      throw new Error(`Total criteria weights must equal 100% (currently ${totalWeight}%).`);
    }

    const state = this.store.getState();
    state.judgingCriteria = criteria;

    await this.logAudit({
      actor_id: actorId,
      action: 'UPDATE_JUDGING_CRITERIA',
      target_entity: 'judging_criteria',
      details: { count: criteria.length, totalWeight },
    });

    this.store.saveState();
    return criteria;
  }

  static async getJudges(): Promise<Judge[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const judges = await SupabaseStore.getJudges();
        if (judges.length > 0) return judges;
      } catch (err) {
        console.warn('SupabaseStore.getJudges error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.judges.map((j) => {
      const profile = state.profiles.find((p) => p.id === j.id);
      return {
        ...j,
        email: profile?.email,
        full_name: profile?.full_name,
      };
    });
  }

  static async getAssignmentsForJudge(judgeId: string): Promise<
    Array<JudgeAssignment & { submission: Submission; teamName: string; scoreSubmission?: ScoreSubmission | null }>
  > {
    const state = this.store.getState();
    const assignments = state.judgeAssignments.filter((a) => a.judge_id === judgeId);

    return assignments
      .map((a) => {
        const sub = state.submissions.find((s) => s.id === a.submission_id);
        if (!sub) return null;
        const team = state.teams.find((t) => t.id === sub.team_id);
        const scoreSub = state.scoreSubmissions.find((s) => s.assignment_id === a.id) || null;
        return {
          ...a,
          submission: sub,
          teamName: team?.name || 'Assigned Project',
          scoreSubmission: scoreSub,
        };
      })
      .filter(Boolean) as Array<
      JudgeAssignment & { submission: Submission; teamName: string; scoreSubmission?: ScoreSubmission | null }
    >;
  }

  static async saveJudgeScore(params: {
    assignmentId: string;
    judgeId: string;
    scores: Array<{ criterionId: string; score: number }>;
    feedback?: string;
    internalNotes?: string;
    isLocked: boolean;
  }): Promise<ScoreSubmission> {
    const state = this.store.getState();
    const assignment = state.judgeAssignments.find((a) => a.id === params.assignmentId);
    if (!assignment) throw new Error('Judge assignment not found');
    if (assignment.judge_id !== params.judgeId) {
      throw new Error('Unauthorized: Assignment belongs to a different judge.');
    }

    const existingScoreSubmission = state.scoreSubmissions.find((s) => s.assignment_id === params.assignmentId);
    if (existingScoreSubmission?.is_locked) {
      throw new Error('Scores for this project have already been finalized and locked.');
    }

    const criteria = await this.getJudgingCriteria();
    let totalWeightedScore = 0;

    // Save individual scores
    for (const item of params.scores) {
      const crit = criteria.find((c) => c.id === item.criterionId);
      if (!crit) continue;
      const validScore = Math.max(0, Math.min(crit.max_score, item.score));
      totalWeightedScore += (validScore / crit.max_score) * crit.weight_percentage;

      const scoreIndex = state.scores.findIndex(
        (s) => s.assignment_id === params.assignmentId && s.criterion_id === item.criterionId
      );
      if (scoreIndex >= 0) {
        state.scores[scoreIndex].score = validScore;
      } else {
        state.scores.push({
          id: 'sc_' + Math.random().toString(36).substring(2, 10),
          assignment_id: params.assignmentId,
          criterion_id: item.criterionId,
          score: validScore,
          created_at: new Date().toISOString(),
        });
      }
    }

    const now = new Date().toISOString();
    const scoreSubmission: ScoreSubmission = {
      id: existingScoreSubmission?.id || 'scsub_' + Math.random().toString(36).substring(2, 10),
      assignment_id: params.assignmentId,
      feedback: params.feedback || null,
      internal_notes: params.internalNotes || null,
      is_locked: params.isLocked,
      total_weighted_score: Number(totalWeightedScore.toFixed(2)),
      submitted_at: params.isLocked ? now : null,
      created_at: existingScoreSubmission?.created_at || now,
    };

    if (existingScoreSubmission) {
      const idx = state.scoreSubmissions.findIndex((s) => s.id === existingScoreSubmission.id);
      state.scoreSubmissions[idx] = scoreSubmission;
    } else {
      state.scoreSubmissions.push(scoreSubmission);
    }

    assignment.status = params.isLocked ? 'completed' : 'in_progress';

    this.store.saveState();
    return scoreSubmission;
  }

  // --- LEADERBOARD & RESULTS ---
  static async calculateAndPreviewLeaderboard(): Promise<LeaderboardResult[]> {
    const state = this.store.getState();
    const event = await this.getEvent();

    // Group scores by submission
    const submissionScores: Map<string, { totalScore: number; count: number; submission: Submission; team: Team }> =
      new Map();

    for (const sub of state.submissions.filter((s) => s.status === 'submitted' || s.status === 'accepted')) {
      const team = state.teams.find((t) => t.id === sub.team_id);
      if (!team || team.status !== 'paid') continue;

      const assignments = state.judgeAssignments.filter((a) => a.submission_id === sub.id);
      let sumScores = 0;
      let evaluatedCount = 0;

      for (const a of assignments) {
        const scSub = state.scoreSubmissions.find((s) => s.assignment_id === a.id);
        if (scSub) {
          sumScores += scSub.total_weighted_score;
          evaluatedCount++;
        }
      }

      const avgScore = evaluatedCount > 0 ? Number((sumScores / evaluatedCount).toFixed(2)) : 0;
      submissionScores.set(sub.id, {
        totalScore: avgScore,
        count: evaluatedCount,
        submission: sub,
        team,
      });
    }

    const sorted = Array.from(submissionScores.values()).sort((a, b) => b.totalScore - a.totalScore);

    const results: LeaderboardResult[] = sorted.map((item, index) => {
      const rank = index + 1;
      let prizeCategory: LeaderboardResult['prize_category'] = null;

      if (rank === 1) prizeCategory = 'first_prize';
      else if (rank === 2) prizeCategory = 'second_prize';
      else if (rank === 3) prizeCategory = 'third_prize';
      else if (rank <= event.certificates_top_n) prizeCategory = 'top_25';

      const existing = state.leaderboardResults.find((r) => r.team_id === item.team.id);

      return {
        id: existing?.id || 'res_' + Math.random().toString(36).substring(2, 10),
        event_id: event.id,
        team_id: item.team.id,
        team_name: item.team.name,
        project_title: item.submission.title,
        track_id: item.submission.track_id,
        rank,
        final_score: item.totalScore,
        prize_category: prizeCategory,
        is_published: existing ? existing.is_published : false,
        published_at: existing ? existing.published_at : null,
        created_at: existing ? existing.created_at : new Date().toISOString(),
      };
    });

    return results;
  }

  static async publishLeaderboard(actorId: string): Promise<LeaderboardResult[]> {
    if (this.isSupabaseEnabled()) {
      try {
        await SupabaseStore.publishLeaderboard('skaleathon-2027', actorId);
        const res = await SupabaseStore.getLeaderboard('skaleathon-2027', true);
        if (res.length > 0) return res;
      } catch (err) {
        console.warn('SupabaseStore.publishLeaderboard error, using fallback:', err);
      }
    }
    const results = await this.calculateAndPreviewLeaderboard();
    const state = this.store.getState();
    const now = new Date().toISOString();

    const publishedResults = results.map((r) => ({
      ...r,
      is_published: true,
      published_at: now,
    }));

    state.leaderboardResults = publishedResults;

    // Update event status to results_announced
    const event = state.events.find((e) => e.id === 'skaleathon-2027');
    if (event) {
      event.status = 'results_announced';
      event.results_announced_at = now;
      event.updated_at = now;
    }

    // Add announcement
    state.announcements.unshift({
      id: 'ann_' + Math.random().toString(36).substring(2, 10),
      event_id: 'skaleathon-2027',
      title: 'Official Results Announced for Skaleathon 2027!',
      content:
        'The official rankings and winners have been announced. Top 25 teams are now eligible to verify and download their certificates.',
      category: 'results',
      is_published: true,
      published_at: now,
      created_at: now,
    });

    await this.logAudit({
      actor_id: actorId,
      action: 'PUBLISH_LEADERBOARD_RESULTS',
      target_entity: 'leaderboard_results',
      details: { rankedCount: publishedResults.length },
    });

    this.store.saveState();
    return publishedResults;
  }

  static async unpublishLeaderboard(actorId: string): Promise<void> {
    const state = this.store.getState();
    state.leaderboardResults.forEach((r) => {
      r.is_published = false;
      r.published_at = null;
    });

    const event = state.events.find((e) => e.id === 'skaleathon-2027');
    if (event && event.status === 'results_announced') {
      event.status = 'judging';
      event.results_announced_at = null;
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'UNPUBLISH_LEADERBOARD_RESULTS',
      target_entity: 'leaderboard_results',
    });

    this.store.saveState();
  }

  static async getPublicLeaderboard(): Promise<LeaderboardResult[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const res = await SupabaseStore.getLeaderboard('skaleathon-2027', true);
        if (res.length > 0) return res;
      } catch (err) {
        console.warn('SupabaseStore.getLeaderboard error, using fallback:', err);
      }
    }
    const state = this.store.getState();
    return state.leaderboardResults
      .filter((r) => r.is_published)
      .map((r) => {
        const track = state.tracks.find((t) => t.id === r.track_id);
        return {
          ...r,
          track_name: track?.name || 'General Track',
        };
      })
      .sort((a, b) => (a.rank || 999) - (b.rank || 999));
  }

  // --- CERTIFICATES ---
  static async issueCertificatesForTopN(actorId: string): Promise<Certificate[]> {
    const state = this.store.getState();
    const event = await this.getEvent();

    if (event.status !== 'results_announced') {
      throw new Error('Certificates can only be issued after official results are published.');
    }

    const eligibleResults = state.leaderboardResults.filter(
      (r) => r.is_published && r.rank !== null && r.rank <= event.certificates_top_n
    );

    const now = new Date().toISOString();
    const newCertificates: Certificate[] = [];

    for (const res of eligibleResults) {
      const team = state.teams.find((t) => t.id === res.team_id);
      if (!team) continue;
      const members = state.teamMembers.filter((m) => m.team_id === team.id);

      let certType: Certificate['certificate_type'] = 'top_25_merit';
      let achievementText = `Top 25 Finalist (Rank #${res.rank}) at Skaleathon 2027`;

      if (res.rank === 1) {
        certType = 'winner_first';
        achievementText = 'First Prize Winner (1st Place) at Skaleathon 2027';
      } else if (res.rank === 2) {
        certType = 'winner_second';
        achievementText = 'Second Prize Winner (2nd Place) at Skaleathon 2027';
      } else if (res.rank === 3) {
        certType = 'winner_third';
        achievementText = 'Third Prize Winner (3rd Place) at Skaleathon 2027';
      }

      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        // Unique code format: SKALE27-R<rank>-<shortHash>
        const hash = Math.random().toString(36).substring(2, 7).toUpperCase();
        const code = `SKALE27-R${res.rank}-${hash}`;

        // Avoid duplicate issuance
        const existing = state.certificates.find(
          (c) => c.team_id === team.id && c.recipient_email.toLowerCase() === member.email.toLowerCase()
        );

        if (!existing) {
          const cert: Certificate = {
            id: 'cert_' + Math.random().toString(36).substring(2, 10),
            certificate_code: code,
            team_id: team.id,
            team_name: team.name,
            recipient_name: member.name,
            recipient_email: member.email,
            certificate_type: certType,
            achievement_text: achievementText,
            qr_verification_url: `/verify-certificate/${code}`,
            issued_at: now,
            is_revoked: false,
            created_at: now,
          };
          state.certificates.push(cert);
          newCertificates.push(cert);
        }
      }
    }

    await this.logAudit({
      actor_id: actorId,
      action: 'ISSUE_TOP_N_CERTIFICATES',
      target_entity: 'certificates',
      details: { newlyIssuedCount: newCertificates.length },
    });

    this.store.saveState();
    return state.certificates;
  }

  static async getCertificateByCode(code: string): Promise<Certificate | null> {
    const state = this.store.getState();
    return state.certificates.find((c) => c.certificate_code.toUpperCase() === code.toUpperCase()) || null;
  }

  static async getCertificatesByTeam(teamId: string): Promise<Certificate[]> {
    const state = this.store.getState();
    return state.certificates.filter((c) => c.team_id === teamId && !c.is_revoked);
  }

  static async listCertificates(): Promise<Certificate[]> {
    const state = this.store.getState();
    return state.certificates;
  }

  static async revokeCertificate(code: string, reason: string, actorId: string): Promise<void> {
    const state = this.store.getState();
    const cert = state.certificates.find((c) => c.certificate_code.toUpperCase() === code.toUpperCase());
    if (cert) {
      cert.is_revoked = true;
      cert.revocation_reason = reason;
      await this.logAudit({
        actor_id: actorId,
        action: 'REVOKE_CERTIFICATE',
        target_entity: 'certificates',
        target_id: cert.certificate_code,
        details: { reason },
      });
      this.store.saveState();
    }
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(publishedOnly: boolean = true): Promise<Announcement[]> {
    const state = this.store.getState();
    if (publishedOnly) {
      return state.announcements.filter((a) => a.is_published);
    }
    return state.announcements;
  }

  static async createAnnouncement(
    data: { title: string; content: string; category: Announcement['category'] },
    actorId: string
  ): Promise<Announcement> {
    const state = this.store.getState();
    const now = new Date().toISOString();
    const ann: Announcement = {
      id: 'ann_' + Math.random().toString(36).substring(2, 10),
      event_id: 'skaleathon-2027',
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      is_published: true,
      published_at: now,
      created_at: now,
    };
    state.announcements.unshift(ann);

    await this.logAudit({
      actor_id: actorId,
      action: 'CREATE_ANNOUNCEMENT',
      target_entity: 'announcements',
      target_id: ann.id,
      details: { title: ann.title },
    });

    this.store.saveState();
    return ann;
  }

  // --- AUDIT LOGS ---
  static async logAudit(params: {
    actor_id: string;
    actor_email?: string;
    action: string;
    target_entity: string;
    target_id?: string;
    details?: Record<string, unknown>;
    ip_address?: string;
  }): Promise<AuditLog> {
    const state = this.store.getState();
    const log: AuditLog = {
      id: 'audit_' + Math.random().toString(36).substring(2, 10),
      actor_id: params.actor_id,
      actor_email: params.actor_email || null,
      action: params.action,
      target_entity: params.target_entity,
      target_id: params.target_id || null,
      details: params.details || {},
      ip_address: params.ip_address || null,
      created_at: new Date().toISOString(),
    };
    state.auditLogs.unshift(log);
    this.store.saveState();
    return log;
  }

  static async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    const state = this.store.getState();
    return state.auditLogs.slice(0, limit);
  }

  // --- OVERVIEW METRICS FOR ADMIN ---
  static async getAdminOverview() {
    const state = this.store.getState();
    const totalTeams = state.teams.length;
    const paidRegistrations = state.teams.filter((t) => t.status === 'paid').length;
    const pendingPayments = state.paymentOrders.filter((p) => p.status === 'created' || p.status === 'attempted').length;
    const failedPayments = state.paymentOrders.filter((p) => p.status === 'failed').length;
    const submittedProjects = state.submissions.filter((s) => s.status === 'submitted' || s.status === 'accepted').length;
    const totalAssignments = state.judgeAssignments.length;
    const completedAssignments = state.judgeAssignments.filter((a) => a.status === 'completed').length;
    const publishedResults = state.leaderboardResults.filter((r) => r.is_published).length;
    const certificatesIssued = state.certificates.filter((c) => !c.is_revoked).length;
    const verifiedRevenueINR = paidRegistrations * 99;

    return {
      totalTeams,
      paidRegistrations,
      pendingPayments,
      failedPayments,
      submittedProjects,
      judgingProgress: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0,
      publishedResults,
      certificatesIssued,
      verifiedRevenueINR,
    };
  }
}
