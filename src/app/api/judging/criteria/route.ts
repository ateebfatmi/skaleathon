import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    const criteria = await EventRepository.getJudgingCriteria();
    return NextResponse.json({ criteria });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { criteria } = await req.json();

    if (!Array.isArray(criteria)) {
      return NextResponse.json({ error: 'Criteria must be an array' }, { status: 400 });
    }

    const updated = await EventRepository.updateJudgingCriteria(criteria, session.userId);
    return NextResponse.json({ success: true, criteria: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
