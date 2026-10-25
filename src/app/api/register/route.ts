import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation/schemas';
import { EventRepository } from '@/lib/db/repository';
import { requireAuth } from '@/lib/auth/server-guard';
import { checkRateLimitDistributed } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimitDistributed(req, 'registration', 5, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    const session = await requireAuth();
    const rawBody = await req.json();

    // 1. Zod Server-side Validation
    const parsed = registrationSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.leader_email.toLowerCase().trim() !== session.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Team leader email must match the verified signed-in account.' },
        { status: 403 }
      );
    }

    const leaderId = session.userId;
    await EventRepository.upsertProfile({
      id: leaderId,
      email: session.email,
      full_name: data.leader_name,
      phone: data.leader_phone,
      college_or_org: data.college_or_org,
      city: data.city,
      state: data.state,
      role: 'team_leader',
    });

    // 3. Create Team and Members in repository (atomic validation of duplicates)
    const { team, members } = await EventRepository.createTeam({
      name: data.name,
      track_id: data.track_id,
      leader_id: leaderId,
      leader_name: data.leader_name,
      leader_email: data.leader_email,
      leader_phone: data.leader_phone,
      description: data.description,
      college_or_org: data.college_or_org,
      city: data.city,
      state: data.state,
      members: data.members,
    });

    const response = NextResponse.json({
      success: true,
      team,
      members,
      fee: (await EventRepository.getEvent()).registration_fee_inr,
      currency: 'INR',
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: err.statusCode || 400 }
    );
  }
}
