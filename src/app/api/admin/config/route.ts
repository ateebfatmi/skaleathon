import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/server-guard';
import { EventRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    await requireAdmin();
    const event = await EventRepository.getEvent();
    return NextResponse.json({ event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const updates = await req.json();

    const updatedEvent = await EventRepository.updateEvent(updates, session.userId);
    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 400 });
  }
}
