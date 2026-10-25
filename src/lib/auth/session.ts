import { cookies } from 'next/headers';
import crypto from 'crypto';
import { cache } from 'react';
import { Profile, UserRole } from '../db/types';
import { EventRepository } from '../db/repository';

const SESSION_COOKIE_NAME = 'skale_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEVELOPMENT_SECRET = crypto.randomBytes(32).toString('hex');

function getAppSecret(): string {
  const secret = process.env.APP_SECRET;
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('APP_SECRET must be configured with at least 32 characters in production.');
  }

  return DEVELOPMENT_SECRET;
}

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  teamId?: string | null;
}

export function signToken(payload: Record<string, unknown>): string {
  const now = Math.floor(Date.now() / 1000);
  const data = Buffer.from(
    JSON.stringify({ ...payload, iat: now, exp: now + SESSION_TTL_SECONDS })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', getAppSecret()).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken<T>(token: string): T | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', getAppSecret()).update(data).digest('base64url');
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return null;
    }
    const jsonStr = Buffer.from(data, 'base64url').toString('utf-8');
    const parsed = JSON.parse(jsonStr) as T & { exp?: number };
    if (!parsed.exp || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const resolveCurrentSession = async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  let profile: Profile | null = null;

  if (token) {
    const payload = verifyToken<{ userId: string }>(token);
    if (payload && payload.userId) {
      profile = await EventRepository.getProfile(payload.userId);
    }
  }

  // Fallback to Clerk authenticated user
  if (!profile) {
    try {
      const { auth, currentUser } = await import('@clerk/nextjs/server');
      const clerkAuth = await auth();

      // Existing Clerk users can resolve locally without another Clerk API call.
      if (clerkAuth.userId) {
        profile = await EventRepository.getProfile(clerkAuth.userId);
      }

      // `auth()` already tells us when the request is signed out. Avoid a
      // network-backed `currentUser()` lookup in that case; it needlessly
      // delayed protected-route redirects when Clerk was slow or unavailable.
      const clerkUser = !profile && clerkAuth.userId ? await currentUser() : null;
      if (clerkUser) {
        const primaryEmail =
          clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
          clerkUser.emailAddresses[0]?.emailAddress;

        if (primaryEmail) {
          profile = await EventRepository.getProfileByEmail(primaryEmail);
          if (!profile) {
            profile = await EventRepository.upsertProfile({
              id: clerkUser.id,
              email: primaryEmail,
              full_name: clerkUser.firstName
                ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
                : (clerkUser.username || primaryEmail),
              role: 'participant',
            });
          }
        }
      }
    } catch (error) {
      console.error('Unable to synchronize the Clerk session with the application profile.', error);
    }
  }

  if (!profile) return null;

  // Retrieve teamId if user is leader or member
  let teamId: string | null = null;
  const teamAsLeader = await EventRepository.getTeamByLeader(profile.id);
  const teamAsMember = teamAsLeader
    ? null
    : await EventRepository.getTeamByMemberEmail(profile.email);
  if (teamAsLeader) {
    teamId = teamAsLeader.id;
  } else if (teamAsMember) {
    teamId = teamAsMember.id;
  }

  // Double check admin allowlist
  const adminEmails = (process.env.ADMIN_EMAILS || '')
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
};

// Layouts and pages frequently ask for the same session during one render.
// React's request cache keeps that authentication/database work single-flight.
export const getCurrentSession = cache(resolveCurrentSession);

export function createSessionCookie(userId: string): { name: string; value: string; options: any } {
  const token = signToken({ userId });
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
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
