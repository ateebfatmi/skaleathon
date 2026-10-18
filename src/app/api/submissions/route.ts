import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';
import { submissionSchema } from '@/lib/validation/schemas';
import { NotificationService } from '@/lib/notifications/service';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = req.nextUrl.searchParams;
    const teamIdParam = searchParams.get('teamId');

    // Admin or Judge can inspect any submission or list all
    if (session.role === 'admin' || session.role === 'judge') {
      if (teamIdParam) {
        const sub = await EventRepository.getSubmissionByTeam(teamIdParam);
        return NextResponse.json({ submission: sub });
      }
      const allSubmissions = await EventRepository.listSubmissions();
      return NextResponse.json({ submissions: allSubmissions });
    }

    // Participant / Team Leader can only access their own team's submission
    if (!session.teamId) {
      return NextResponse.json({ error: 'No team registration found for current user.' }, { status: 404 });
    }

    const sub = await EventRepository.getSubmissionByTeam(session.teamId);
    const team = await EventRepository.getTeam(session.teamId);

    return NextResponse.json({ submission: sub, team });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session.teamId) {
      return NextResponse.json(
        { error: 'You must be part of a registered team to submit a project.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const submission = await EventRepository.saveSubmission(session.teamId, data, session.userId);

    const team = await EventRepository.getTeam(session.teamId);
    if (team && !data.isDraft) {
      await NotificationService.sendSubmissionReceipt({
        recipientEmail: session.email,
        teamName: team.name,
        projectTitle: submission.title,
        submissionId: submission.id,
      });
    }

    return NextResponse.json({
      success: true,
      submission,
      message: data.isDraft ? 'Draft saved successfully.' : 'Project submitted successfully for evaluation.',
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
