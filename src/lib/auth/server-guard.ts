import { getCurrentSession, AuthSession } from './session';
import { UserRole } from '../db/types';

export class AuthError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new AuthError('Authentication required. Please sign in.', 401);
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthSession> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new AuthError(
      `Access denied. Role "${session.role}" lacks permissions for this operation.`,
      403
    );
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  return requireRole(['admin']);
}

export async function requireJudge(): Promise<AuthSession> {
  return requireRole(['judge', 'admin']);
}

export async function requireTeamLeader(teamId?: string): Promise<AuthSession> {
  const session = await requireAuth();
  if (session.role === 'admin') return session;

  if (teamId && session.teamId !== teamId) {
    throw new AuthError('Access denied: You do not have permissions for this team.', 403);
  }

  return session;
}
