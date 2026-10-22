import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import AudioToggle from '@/components/layout/AudioToggle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import InteractiveAmbientBackground from '@/components/layout/InteractiveAmbientBackground';
import { EventRepository } from '@/lib/db/repository';
import AuthStateSynchronizer from '@/components/auth/AuthStateSynchronizer';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});


export const metadata: Metadata = {
  title: 'Skaleathon',
  description:
    'SkaleKraft presents Skaleathon: a national online hackathon for builders across India.',
  keywords: [
    'Skaleathon',
    'SkaleKraft',
    'National Online Hackathon',
    'AI ML Hackathon',
    'Web Development Hackathon',
    'App Development Hackathon',
    'India Hackathon',
  ],
  authors: [{ name: 'SkaleKraft', url: 'https://skalekraft.in' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Skaleathon',
    description: 'Build. Innovate. Scale. Compete across AI/ML, Web, and App development tracks.',
    url: '/',
    siteName: 'Skaleathon',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skaleathon',
    description: 'Build. Innovate. Scale. Presented by SkaleKraft.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Shared event data is read at request time, including for the 404 route.
  // Production builds must not require a live database to prerender this layout.
  await connection();
  const event = await EventRepository.getEvent();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#c19a88',
          colorBackground: '#0B0B0B',
          colorText: '#EDEDED',
          colorTextSecondary: '#A1A1A1',
          colorInputBackground: '#141414',
          colorInputText: '#EDEDED',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0B0B0B]',
          formButtonPrimary:
            'bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] text-white font-medium transition-all shadow-lg shadow-[#805948]/20',
          footerActionLink: 'text-[#c19a88] hover:text-[#e8c5b4]',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`min-h-screen bg-[#0B0B0B] text-white flex flex-col antialiased selection:bg-[#805948]/30 selection:text-white relative overflow-x-clip ${instrumentSerif.variable}`}>
          <AuthStateSynchronizer />
          {/* SkaleKraft Signature Interactive Background Architecture */}
          <InteractiveAmbientBackground />




          <ErrorBoundary fallback={null}>
            <Navbar event={event} />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <main className="relative z-10 flex-1">{children}</main>
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <Footer event={event} />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <AudioToggle />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
