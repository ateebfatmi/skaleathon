import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { createRazorpayOrder } from '@/lib/razorpay/client';
import { requireTeamLeader } from '@/lib/auth/server-guard';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 'payment-order', 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    const { teamId } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    await requireTeamLeader(teamId);

    const team = await EventRepository.getTeam(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.status === 'paid') {
      return NextResponse.json(
        { error: 'Team registration has already been paid and verified.' },
        { status: 400 }
      );
    }

    const event = await EventRepository.getEvent();
    const fixedAmount = event.registration_fee_inr || 99.0;

    // Server-created order — strictly 99 INR
    const rzpOrder = await createRazorpayOrder({
      amountInr: fixedAmount,
      teamId: team.id,
      teamName: team.name,
    });

    const paymentOrder = await EventRepository.createPaymentOrder({
      teamId: team.id,
      amountInr: fixedAmount,
      orderId: rzpOrder.orderId,
    });

    return NextResponse.json({
      success: true,
      orderId: paymentOrder.id,
      amount: fixedAmount,
      currency: 'INR',
      keyId: rzpOrder.keyId,
      teamName: team.name,
    });
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Order creation failed' },
      { status: err.statusCode || 500 }
    );
  }
}
