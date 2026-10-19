import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { verifyPaymentSignature } from '@/lib/razorpay/client';
import { NotificationService } from '@/lib/notifications/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body.orderId || body.razorpay_order_id;
    const paymentId = body.paymentId || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters (orderId, paymentId, signature).' },
        { status: 400 }
      );
    }

    const order = await EventRepository.getPaymentOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: `Order ${orderId} does not exist.` }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Order was already verified and marked as paid.',
        order,
      });
    }

    // Server-side signature verification
    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      await EventRepository.markPaymentFailed(orderId, 'Signature mismatch');
      return NextResponse.json(
        { error: 'Cryptographic signature verification failed. Untrusted payment payload.' },
        { status: 400 }
      );
    }

    // Complete order and update team to 'paid'
    const completedOrder = await EventRepository.completePaymentOrder({
      orderId,
      paymentId,
      signature,
    });

    const team = await EventRepository.getTeam(order.team_id);
    const leader = team ? await EventRepository.getProfile(team.leader_id) : null;

    if (leader && team) {
      await NotificationService.sendRegistrationConfirmation({
        recipientEmail: leader.email,
        recipientName: leader.full_name,
        teamName: team.name,
        orderId: completedOrder.id,
        amountInr: completedOrder.amount_inr,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and registration finalized.',
      order: completedOrder,
      teamId: order.team_id,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
