import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials not configured on server' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let amount = body.amount; // in paise
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes || {};

    // If amount is not specified, default to hackathon registration fee: 99 INR = 9900 paise
    if (amount === undefined || amount === null) {
      amount = 9900;
    }

    // Minimum amount check: 100 paise
    if (typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount: amount must be a number and at least 100 paise (₹1.00)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: String(receipt).slice(0, 40),
      notes,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: key_id,
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json(
      { error: err?.error?.description || err?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
