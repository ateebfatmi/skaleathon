import { NextRequest, NextResponse } from 'next/server';
import { requireJudge } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';
import { judgingScoreSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    const session = await requireJudge();
    const body = await req.json();

    const parsed = judgingScoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid score payload', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const scoreSubmission = await EventRepository.saveJudgeScore({
      assignmentId: data.assignmentId,
      judgeId: session.userId,
      scores: data.scores,
      feedback: data.feedback,
      internalNotes: data.internalNotes,
      isLocked: data.isLocked,
    });

    return NextResponse.json({
      success: true,
      scoreSubmission,
      message: data.isLocked ? 'Scores locked and submitted permanently.' : 'Draft evaluation saved.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
