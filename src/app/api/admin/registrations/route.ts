import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get('format');
    const search = searchParams.get('search') || undefined;

    const teams = await EventRepository.listTeams({ search });

    if (format === 'csv') {
      const headers = ['Team ID', 'Team Name', 'Track ID', 'Status', 'College/Org', 'City', 'Members Count', 'Payment Status', 'Created At'];
      const rows = teams.map((t) => [
        `"${t.id}"`,
        `"${t.name.replace(/"/g, '""')}"`,
        `"${t.track_id || ''}"`,
        `"${t.status}"`,
        `"${(t.college_or_org || '').replace(/"/g, '""')}"`,
        `"${(t.city || '').replace(/"/g, '""')}"`,
        t.members.length,
        `"${t.paymentOrder?.status || 'unpaid'}"`,
        `"${t.created_at}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="skaleathon_2027_registrations.csv"',
        },
      });
    }

    return NextResponse.json({ teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
