import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('placeholder')) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Creates an order in Razorpay (or sandbox fallback order if keys are unconfigured)
 */
export async function createRazorpayOrder(params: {
  amountInr: number;
  teamId: string;
  teamName: string;
}): Promise<RazorpayOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_skaleathon_sandbox';
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const client = getRazorpayClient();

  const amountPaise = Math.round(params.amountInr * 100);

  if (client) {
    try {
      const order = await client.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `rcpt_${params.teamId.substring(0, 20)}`,
        notes: {
          teamId: params.teamId,
          teamName: params.teamName,
          event: 'skaleathon-2027',
        },
      });

      return {
        orderId: order.id,
        amount: params.amountInr,
        currency: 'INR',
        keyId,
      };
    } catch (err: any) {
      console.error('Razorpay live order creation failed:', err);
      throw new Error(`Razorpay order creation failed: ${err.message || 'Gateway error'}`);
    }
  }

  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_PAYMENT_SANDBOX !== 'true') {
    throw new Error('Razorpay is not configured. Set gateway credentials before accepting payments.');
  }

  // Explicit local-development sandbox order.
  const sandboxOrderId = `order_sbx_${Math.random().toString(36).substring(2, 12)}`;
  return {
    orderId: sandboxOrderId,
    amount: params.amountInr,
    currency: 'INR',
    keyId: 'rzp_test_skaleathon_sandbox',
  };
}

/**
 * Strictly verifies Razorpay payment signature
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Explicit local-only sandbox mode. Production always fails closed.
  if (!keySecret || keySecret.includes('placeholder')) {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_PAYMENT_SANDBOX !== 'true') {
      return false;
    }
    const secret = 'skaleathon_sandbox_payment_secret';
    const text = `${params.orderId}|${params.paymentId}`;
    const expected = crypto.createHmac('sha256', secret).update(text).digest('hex');
    return params.signature === expected;
  }

  const text = `${params.orderId}|${params.paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(text)
    .digest('hex');

  const expectedBuffer = Buffer.from(generatedSignature);
  const actualBuffer = Buffer.from(params.signature);
  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

/**
 * Strictly verifies Razorpay Webhook signature
 */
export function verifyWebhookSignature(payloadRaw: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.includes('placeholder')) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadRaw)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);
  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
}
