import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation/schemas';
import { EventRepository } from '@/lib/db/repository';
import { getCurrentSession, createSessionCookie } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
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

    // 2. Identify or create leader profile
    let session = await getCurrentSession();
    let leaderId = session?.userId;

    if (!leaderId) {
      leaderId = 'usr_' + Buffer.from(data.leader_email.toLowerCase()).toString('base64url').substring(0, 16);
      await EventRepository.upsertProfile({
        id: leaderId,
        email: data.leader_email,
        full_name: data.leader_name,
        phone: data.leader_phone,
        college_or_org: data.college_or_org,
        city: data.city,
        state: data.state,
        role: 'team_leader',
      });
    }

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

    const cookieData = createSessionCookie(leaderId);
    const response = NextResponse.json({
      success: true,
      team,
      members,
      fee: 99,
      currency: 'INR',
    });

    response.cookies.set(cookieData.name, cookieData.value, cookieData.options);
    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 400 });
  }
}
