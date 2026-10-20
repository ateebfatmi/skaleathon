import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 'certificate-verify', 30, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }
    const code = req.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Certificate code is required' }, { status: 400 });
    }

    const cert = await EventRepository.getCertificateByCode(code);
    if (!cert) {
      return NextResponse.json({ found: false, error: 'Certificate not found in official registry.' }, { status: 404 });
    }

    // Protect privacy: Mask recipient email in public lookup
    const maskedEmail = cert.recipient_email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`);

    return NextResponse.json({
      found: true,
      certificate: {
        code: cert.certificate_code,
        recipient_name: cert.recipient_name,
        masked_email: maskedEmail,
        team_name: cert.team_name,
        achievement_text: cert.achievement_text,
        certificate_type: cert.certificate_type,
        issued_at: cert.issued_at,
        is_revoked: cert.is_revoked,
        revocation_reason: cert.revocation_reason,
        organizer: 'SkaleKraft',
        event: 'Skaleathon 2027',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
