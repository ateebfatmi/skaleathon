'use client';

import { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayCheckoutButtonProps {
  amountPaise?: number; // amount in paise (default: 9900 paise = ₹99)
  currency?: string; // currency code (default: INR)
  name?: string; // customer or team name
  email?: string;
  phone?: string;
  receipt?: string;
  notes?: Record<string, string>;
  buttonText?: string;
  className?: string;
  onSuccess?: (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

export default function RazorpayCheckoutButton({
  amountPaise = 9900,
  currency = 'INR',
  name = 'Participant',
  email = '',
  phone = '',
  receipt,
  notes = {},
  buttonText = 'Pay with Razorpay',
  className = '',
  onSuccess,
  onFailure,
  onDismiss,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      // 1. Ensure Razorpay checkout.js script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay Checkout SDK. Please check your internet connection.');
      }

      // 2. Step 1: Call backend endpoint to create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initialize payment order on server.');
      }

      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_test_TprfRK3zhNYH43';

      // 3. Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || currency,
        name: 'SkaleKraft — Skaleathon 2028',
        description: 'Team Registration Fee',
        image: '/icon.png',
        order_id: orderData.order_id,
        prefill: {
          name: name || undefined,
          email: email || undefined,
          contact: phone || undefined,
        },
        notes: {
          ...notes,
          platform: 'Skaleathon 2028 Web Checkout',
        },
        theme: {
          color: '#805948',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (onDismiss) {
              onDismiss();
            }
          },
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            setLoading(true);

            // 4. Step 3: Call backend verify endpoint with HMAC-SHA256 signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error || 'Payment signature verification failed. Untrusted response.'
              );
            }

            setStatusMessage({
              type: 'success',
              text: `Payment verified successfully! ID: ${response.razorpay_payment_id}`,
            });

            if (onSuccess) {
              onSuccess(response);
            }
          } catch (verifyErr: any) {
            console.error('Signature verification error:', verifyErr);
            setStatusMessage({
              type: 'error',
              text: verifyErr.message || 'Payment verification failed.',
            });
            if (onFailure) {
              onFailure(verifyErr);
            }
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on('payment.failed', function (failureResponse: any) {
        console.error('Payment failed:', failureResponse);
        const errMsg =
          failureResponse?.error?.description ||
          failureResponse?.error?.reason ||
          'Payment processing failed.';
        setStatusMessage({
          type: 'error',
          text: errMsg,
        });
        if (onFailure) {
          onFailure(failureResponse);
        }
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to start payment.',
      });
      if (onFailure) {
        onFailure(err);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        disabled={loading}
        onClick={handlePayment}
        className={
          className ||
          'w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#805948]/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer'
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Processing Checkout...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 text-white" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
              : 'border-red-500/30 bg-red-950/20 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
