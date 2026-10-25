import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Mitigate CSV / Formula Injection: prepend ' if cell starts with dangerous spreadsheet formula triggers
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

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
        sanitizeCsvCell(t.id),
        sanitizeCsvCell(t.name),
        sanitizeCsvCell(t.track_id || ''),
        sanitizeCsvCell(t.status),
        sanitizeCsvCell(t.college_or_org || ''),
        sanitizeCsvCell(t.city || ''),
        sanitizeCsvCell(t.members.length),
        sanitizeCsvCell(t.paymentOrder?.status || 'unpaid'),
        sanitizeCsvCell(t.created_at),
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
