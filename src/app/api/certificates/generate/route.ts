import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function POST() {
  try {
    const session = await requireAdmin();
    const certs = await EventRepository.issueCertificatesForTopN(session.userId);

    return NextResponse.json({
      success: true,
      message: `Issued/verified certificates for eligible Top 25 teams.`,
      certificates: certs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
