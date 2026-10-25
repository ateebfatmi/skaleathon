import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';
import { submissionSchema } from '@/lib/validation/schemas';
import { NotificationService } from '@/lib/notifications/service';
import { checkRateLimitDistributed } from '@/lib/security/rate-limit';

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
    const event = await EventRepository.getEvent();
    const isWindowOpen = event.status === 'hacking_live';

    return NextResponse.json({
      submission: sub,
      team,
      isWindowOpen,
      eventStatus: event.status,
      submissionDeadline: event.submission_deadline,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimitDistributed(req, 'submission-write', 20, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submission requests. Please retry shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }
    const session = await requireAuth();

    if (!session.teamId) {
      return NextResponse.json(
        { error: 'You must be part of a registered team to submit deliverables.' },
        { status: 403 }
      );
    }

    const event = await EventRepository.getEvent();
    const isWindowOpen = event.status === 'hacking_live' || session.role === 'admin';
    if (!isWindowOpen) {
      return NextResponse.json(
        { error: 'The submission window is not open yet. Submissions will be accepted on the defined competition dates.' },
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
    let emailDelivered = false;
    if (team && !data.isDraft) {
      const notification = await NotificationService.sendSubmissionReceipt({
        recipientEmail: session.email,
        teamName: team.name,
        projectTitle: submission.title,
        submissionId: submission.id,
      });
      emailDelivered = notification.success;
    }

    return NextResponse.json({
      success: true,
      submission,
      emailDelivered: data.isDraft ? undefined : emailDelivered,
      message: data.isDraft ? 'Draft saved successfully.' : 'Project submitted successfully for evaluation.',
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
