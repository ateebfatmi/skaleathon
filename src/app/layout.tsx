import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Script from 'next/script';
import AudioToggle from '@/components/layout/AudioToggle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import InteractiveAmbientBackground from '@/components/layout/InteractiveAmbientBackground';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});


export const metadata: Metadata = {
  title: 'Skaleathon',
  description:
    'SkaleKraft presents Skaleathon: Build. Innovate. Scale. National online hackathon across India with ₹35,000 prize pool, ₹99 registration fee, certificates for top 25 teams, and interview opportunities.',
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
    description: 'Build. Innovate. Scale. Compete for ₹35,000 prize pool across AI/ML, Web, and App development tracks.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {/* SkaleKraft Signature Interactive Background Architecture */}
          <InteractiveAmbientBackground />




          <ErrorBoundary fallback={null}>
            <Navbar />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <main className="relative z-10 flex-1">{children}</main>
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <Footer />
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <AudioToggle />
          </ErrorBoundary>

          {/* Razorpay Standard Checkout SDK */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
