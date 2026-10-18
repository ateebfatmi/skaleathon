import { cookies } from 'next/headers';
import crypto from 'crypto';
import { Profile, UserRole } from '../db/types';
import { EventRepository } from '../db/repository';

const SESSION_COOKIE_NAME = 'skale_session';
const APP_SECRET = process.env.APP_SECRET || 'skaleathon_2027_secure_development_signing_secret_99inr';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  teamId?: string | null;
}

export function signToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', APP_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken<T>(token: string): T | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', APP_SECRET).update(data).digest('base64url');
    if (signature !== expectedSig) return null;
    const jsonStr = Buffer.from(data, 'base64url').toString('utf-8');
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken<{ userId: string }>(token);
  if (!payload || !payload.userId) return null;

  const profile = await EventRepository.getProfile(payload.userId);
  if (!profile) return null;

  // Retrieve teamId if user is leader or member
  let teamId: string | null = null;
  const teamAsLeader = await EventRepository.getTeamByLeader(profile.id);
  if (teamAsLeader) {
    teamId = teamAsLeader.id;
  } else {
    const teamAsMember = await EventRepository.getTeamByMemberEmail(profile.email);
    if (teamAsMember) {
      teamId = teamAsMember.id;
    }
  }

  // Double check admin allowlist
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@skalekraft.in')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  let effectiveRole: UserRole = profile.role;
  if (adminEmails.includes(profile.email.toLowerCase())) {
    effectiveRole = 'admin';
  } else if (teamId && effectiveRole === 'participant') {
    effectiveRole = 'team_leader';
  }

  return {
    userId: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: effectiveRole,
    teamId,
  };
}

export function createSessionCookie(userId: string): { name: string; value: string; options: any } {
  const token = signToken({ userId, iat: Date.now() });
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export function clearSessionCookie(): { name: string; value: string; options: any } {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    },
  };
}
