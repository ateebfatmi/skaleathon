import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { verifyWebhookSignature } from '@/lib/razorpay/client';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Rejected invalid Razorpay webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = req.headers.get('x-razorpay-event-id') || payload.event_id || 'evt_' + Date.now();
    const eventType = payload.event;

    // Idempotency check
    const { isDuplicate } = await EventRepository.recordWebhookEvent({
      eventId,
      eventType,
      payload,
    });

    if (isDuplicate) {
      return NextResponse.json({ status: 'ignored_duplicate', eventId });
    }

    // Process event
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const orderEntity = payload.payload?.order?.entity || payload.payload?.payment?.entity;
      const orderId = orderEntity?.id || orderEntity?.order_id;
      const paymentId = orderEntity?.payment_id || orderEntity?.id;

      if (orderId) {
        const order = await EventRepository.getPaymentOrder(orderId);
        if (order && order.status !== 'paid') {
          await EventRepository.completePaymentOrder({
            orderId,
            paymentId: paymentId || 'rzp_webhook_verified',
            signature: signature || 'webhook_signature',
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await EventRepository.markPaymentFailed(
          orderId,
          paymentEntity?.error_description || 'Payment failed at gateway'
        );
      }
    }

    await EventRepository.markWebhookProcessed(eventId);
    return NextResponse.json({ status: 'success', eventId });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
