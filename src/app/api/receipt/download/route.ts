import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { generateReceiptPDF } from '@/lib/receipt/generator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const searchParams = req.nextUrl.searchParams;
    const requestedPass = searchParams.get('pass') || searchParams.get('teamId');

    const teamId = requestedPass || session?.teamId;

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID or authenticated session required to download receipt.' },
        { status: 401 }
      );
    }

    const team = await EventRepository.getTeam(teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found.' },
        { status: 404 }
      );
    }

    const members = team.members || [];
    const track = team.track || null;
    const paymentOrder = await EventRepository.getPaymentOrderByTeam(team.id);

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skaleathon.skalekraft.in';
    const pdfBytes = await generateReceiptPDF({
      team,
      members,
      track,
      paymentOrder,
      siteUrl,
    });

    const safeTeamId = team.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Skaleathon_Receipt_${safeTeamId}.pdf`;

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error generating receipt PDF:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate receipt PDF' },
      { status: 500 }
    );
  }
}
