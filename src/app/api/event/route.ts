import { NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';

export const revalidate = 60;

export async function GET() {
  try {
    const [event, tracks, announcements] = await Promise.all([
      EventRepository.getEvent(),
      EventRepository.getTracks(),
      EventRepository.getAnnouncements(true),
    ]);

    return NextResponse.json(
      { event, tracks, announcements },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
