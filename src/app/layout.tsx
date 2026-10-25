import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import AudioToggle from '@/components/layout/AudioToggle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import InteractiveAmbientBackground from '@/components/layout/InteractiveAmbientBackground';
import AuthStateSynchronizer from '@/components/auth/AuthStateSynchronizer';
import PageMotion from '@/components/layout/PageMotion';
import { getClerkProxyUrl } from '@/lib/auth/clerk-config';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});


export const metadata: Metadata = {
  title: 'Skaleathon',
  description:
    'SkaleKraft presents Skaleathon: A premier national online hackathon with a ₹35,000 prize pool, 3 tracks (AI/ML, Web, App), and a flat ₹99 team pass. Build. Innovate. Scale.',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skaleathon.skalekraft.in'),
  openGraph: {
    title: 'Skaleathon — National Online Hackathon by SkaleKraft',
    description: 'Build. Innovate. Scale. ₹35,000 prize pool, 3 competition tracks (AI/ML, Web, App), and a flat ₹99 squad registration pass.',
    url: 'https://skaleathon.skalekraft.in',
    siteName: 'Skaleathon',
    images: [
      {
        url: '/images/skaleathon-poster.png',
        width: 1200,
        height: 630,
        alt: 'Skaleathon by SkaleKraft',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skaleathon — National Online Hackathon by SkaleKraft',
    description: 'Build. Innovate. Scale. ₹35,000 prize pool, 3 tracks, flat ₹99 team registration pass.',
    images: ['/images/skaleathon-poster.png'],
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

// Navigation chrome should never wait for the database. Pages that display
// live competition data fetch it themselves; these stable public values keep
// the persistent navbar and footer immediately renderable during transitions.
const shellEvent = {
  registration_fee_inr: 99,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      proxyUrl={getClerkProxyUrl(
        process.env.NODE_ENV,
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      )}
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: '#f5f5f5',
          colorBackground: '#0B0B0B',
          colorForeground: '#EDEDED',
          colorMutedForeground: '#A1A1A1',
          colorInput: '#141414',
          colorInputForeground: '#EDEDED',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0B0B0B]',
          formButtonPrimary:
            'bg-gradient-to-r from-[#737373] to-[#f5f5f5] hover:from-[#a3a3a3] hover:to-[#d4d4d4] text-white font-medium transition-all shadow-lg shadow-[#737373]/20',
          footerActionLink: 'text-[#c19a88] hover:text-[#ffffff]',
        },
      }}
    >
      <html lang="en" className="dark" data-scroll-behavior="smooth">
        <body className={`min-h-screen bg-[#0B0B0B] text-white flex flex-col antialiased selection:bg-[#737373]/30 selection:text-white relative overflow-x-clip ${instrumentSerif.variable}`}>
          <AuthStateSynchronizer />
          {/* SkaleKraft Signature Interactive Background Architecture */}
          <InteractiveAmbientBackground />




          <ErrorBoundary fallback={null}>
            <Navbar event={shellEvent} />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <main className="relative z-10 flex-1">
              <PageMotion>{children}</PageMotion>
            </main>
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <Footer />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <AudioToggle />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
