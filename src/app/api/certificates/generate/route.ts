import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 'certificate-generate', 3, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Certificate generation is temporarily rate limited.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }
    const session = await requireAdmin();
    const certs = await EventRepository.issueCertificatesForTopN(session.userId);

    return NextResponse.json({
      success: true,
      message: `Issued certificates for eligible Top 25 teams.`,
      certificates: certs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
