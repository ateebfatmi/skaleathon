import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { EventRepository } from '../src/lib/db/repository';
import { verifyPaymentSignature, verifyWebhookSignature } from '../src/lib/razorpay/client';

describe('Payment & Webhook Security Verification', () => {
  it('strictly validates payment signature using HMAC SHA-256', () => {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    const secret = 'skaleathon_sandbox_payment_secret';

    const text = `${orderId}|${paymentId}`;
    const validSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature,
    });
    expect(isValid).toBe(true);

    const isInvalid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature: 'forged_fake_signature_abc',
    });
    expect(isInvalid).toBe(false);
  });

  it('handles duplicate webhook events idempotently', async () => {
    const eventId = `evt_webhook_${Date.now()}`;
    const payload = { event: 'payment.captured', id: eventId };

    // First time
    const res1 = await EventRepository.recordWebhookEvent({
      eventId,
      eventType: 'payment.captured',
      payload,
    });
    expect(res1.isDuplicate).toBe(false);

    // Second time with identical eventId
    const res2 = await EventRepository.recordWebhookEvent({
      eventId,
      eventType: 'payment.captured',
      payload,
    });
    expect(res2.isDuplicate).toBe(true);
  });

  it('updates team status to paid upon authoritative completion', async () => {
    const teamName = `Team PayTest ${Date.now()}`;
    const leaderEmail = `paytest_${Date.now()}@example.com`;

    const { team } = await EventRepository.createTeam({
      name: teamName,
      track_id: 'track-app-dev',
      leader_id: `leader_${Date.now()}`,
      leader_name: 'Payment Tester',
      leader_email: leaderEmail,
      city: 'Pune',
      state: 'Maharashtra',
      members: [],
    });

    expect(team.status).toBe('registered');

    const order = await EventRepository.createPaymentOrder({
      teamId: team.id,
      amountInr: 99.0,
      orderId: `order_${Date.now()}`,
    });

    const completed = await EventRepository.completePaymentOrder({
      orderId: order.id,
      paymentId: `pay_${Date.now()}`,
      signature: 'sandbox_sig_verified',
    });

    expect(completed.status).toBe('paid');

    const updatedTeam = await EventRepository.getTeam(team.id);
    expect(updatedTeam?.status).toBe('paid');
  });
});
