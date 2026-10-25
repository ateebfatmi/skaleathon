import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import QRCode from 'qrcode';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import ReceiptViewClient from '@/components/dashboard/ReceiptViewClient';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ pass?: string; teamId?: string }>;
}

export default async function DashboardReceiptPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const session = await getCurrentSession();
  const requestedId = resolvedParams.pass || resolvedParams.teamId;
  const teamId = requestedId || session?.teamId;

  const team = teamId ? await EventRepository.getTeam(teamId) : null;
  const members = team?.members || [];
  const track = team?.track || null;
  const paymentOrder = team ? await EventRepository.getPaymentOrderByTeam(team.id) : null;

  if (!team) {
    return (
      <div className="relative max-w-2xl mx-auto py-16 text-center space-y-5">
        <div className="relative z-10 flex items-center justify-center text-[#c19a88] mx-auto">
          <FileText className="h-8 w-8" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Receipt Not Found</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
            No registered tournament squad found with this identifier. Please verify your team pass ID or sign in to your registered account.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3 text-xs font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] transition-all hover:scale-105"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skaleathon.skalekraft.in';
  const qrCodeUrl = await QRCode.toDataURL(
    `${siteUrl}/dashboard/team?pass=${encodeURIComponent(team.id)}`,
    { margin: 1, width: 140 }
  );

  return (
    <ReceiptViewClient
      team={team}
      members={members}
      track={track}
      paymentOrder={paymentOrder}
      qrCodeUrl={qrCodeUrl}
    />
  );
}
