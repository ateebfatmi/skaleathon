import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { error: 'Razorpay secret key not configured on server' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Support both naming conventions: snake_case (Razorpay standard response) and camelCase
    const razorpay_order_id = body.razorpay_order_id || body.orderId;
    const razorpay_payment_id = body.razorpay_payment_id || body.paymentId;
    const razorpay_signature = body.razorpay_signature || body.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          error:
            'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)',
        },
        { status: 400 }
      );
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isMatch =
      generated_signature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generated_signature),
        Buffer.from(razorpay_signature)
      );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Signature verification failed: generated signature does not match razorpay_signature',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (err: any) {
    console.error('Razorpay payment verification error:', err);
    return NextResponse.json(
      { error: err?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
