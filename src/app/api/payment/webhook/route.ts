import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { verifyWebhookSignature } from '@/lib/razorpay/client';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 'payment-webhook', 120, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Webhook rate limit exceeded.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }
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
      const orderEntity = payload.payload?.order?.entity;
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = orderEntity?.id || paymentEntity?.order_id;
      const paymentId = paymentEntity?.id || orderEntity?.payment_id;

      if (orderId) {
        const order = await EventRepository.getPaymentOrder(orderId);
        if (order && order.status !== 'paid') {
          const expectedAmountPaise = Math.round(order.amount_inr * 100);
          const receivedAmount = Number(paymentEntity?.amount ?? orderEntity?.amount_paid);
          const receivedCurrency = paymentEntity?.currency ?? orderEntity?.currency;
          const gatewayStatus = paymentEntity?.status ?? orderEntity?.status;

          if (
            receivedAmount !== expectedAmountPaise ||
            receivedCurrency !== 'INR' ||
            !['captured', 'paid'].includes(gatewayStatus)
          ) {
            return NextResponse.json(
              { error: 'Webhook payment details do not match the expected order.' },
              { status: 400 }
            );
          }

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
