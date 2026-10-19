'use client';

import RazorpayCheckoutButton from '@/components/payment/RazorpayCheckoutButton';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutDemoPage() {
  const [paymentResult, setPaymentResult] = useState<any>(null);

  return (
    <div className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-[#0E0E0E] p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19a88]">
                Razorpay Standard Web Checkout
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Checkout Integration
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c19a88]">
              <ShieldCheck className="h-4 w-4" />
              <span>Standard SDK</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Item</span>
              <span className="font-semibold text-white">Skaleathon Team Registration</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Currency</span>
              <span className="font-mono text-neutral-300">INR (₹)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Amount</span>
              <span className="text-lg font-black text-[#e8c5b4] font-mono">₹99.00</span>
            </div>
          </div>

          <div className="space-y-4">
            <RazorpayCheckoutButton
              amountPaise={9900}
              currency="INR"
              name="Participant"
              email="skalekraft@gmail.com"
              buttonText="Pay ₹99 with Razorpay"
              onSuccess={(data) => {
                setPaymentResult(data);
              }}
            />
          </div>

          {paymentResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <Zap className="h-4 w-4" />
                <span>Verified Payment Response:</span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-neutral-300 font-mono bg-black/40 p-3 rounded-lg">
                {JSON.stringify(paymentResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
