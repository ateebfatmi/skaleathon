import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    await requireAdmin();
    const preview = await EventRepository.calculateAndPreviewLeaderboard();
    return NextResponse.json({ preview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

export async function POST() {
  try {
    const session = await requireAdmin();
    const published = await EventRepository.publishLeaderboard(session.userId);
    return NextResponse.json({ success: true, message: 'Leaderboard published officially.', results: published });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}

export async function DELETE() {
  try {
    const session = await requireAdmin();
    await EventRepository.unpublishLeaderboard(session.userId);
    return NextResponse.json({ success: true, message: 'Leaderboard unpublished.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
