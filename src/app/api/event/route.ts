import { NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    const [event, tracks, announcements] = await Promise.all([
      EventRepository.getEvent(),
      EventRepository.getTracks(),
      EventRepository.getAnnouncements(true),
    ]);

    return NextResponse.json({
      event,
      tracks,
      announcements,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
