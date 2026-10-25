import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { createSessionCookie } from '@/lib/auth/session';
import { UserRole } from '@/lib/db/types';
import { checkRateLimitDistributed } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_LOGIN !== 'true') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const rateLimit = await checkRateLimitDistributed(req, 'dev-login', 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const { email, fullName, role = 'participant' } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and Full Name are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    // Role security check: public login cannot set admin unless email is in ADMIN_EMAILS
    const allowedRoles: UserRole[] = ['participant', 'team_leader', 'judge', 'admin'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid development role.' }, { status: 400 });
    }

    let assignedRole: UserRole = role;
    if (assignedRole === 'admin' && !adminEmails.includes(cleanEmail)) {
      return NextResponse.json(
        { error: 'Unauthorized: This email is not in the authorized administrator allowlist.' },
        { status: 403 }
      );
    }

    if (adminEmails.includes(cleanEmail)) {
      assignedRole = 'admin';
    }

    const userId = 'usr_' + Buffer.from(cleanEmail).toString('base64url').substring(0, 16);

    const profile = await EventRepository.upsertProfile({
      id: userId,
      email: cleanEmail,
      full_name: fullName,
      role: assignedRole,
    });

    const cookieData = createSessionCookie(profile.id);

    const response = NextResponse.json({
      success: true,
      profile,
    });

    response.cookies.set(cookieData.name, cookieData.value, cookieData.options);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
