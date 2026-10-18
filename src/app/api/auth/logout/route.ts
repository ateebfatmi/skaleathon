import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';

export async function POST() {
  const cookieData = clearSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookieData.name, cookieData.value, cookieData.options);
  return response;
}
