import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'This legacy payment endpoint has been retired. Use the authenticated team payment flow.' },
    { status: 410 }
  );
}
