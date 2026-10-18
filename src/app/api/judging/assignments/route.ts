import { NextRequest, NextResponse } from 'next/server';
import { requireJudge } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    const session = await requireJudge();
    const assignments = await EventRepository.getAssignmentsForJudge(session.userId);
    const criteria = await EventRepository.getJudgingCriteria();

    return NextResponse.json({
      assignments,
      criteria,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
