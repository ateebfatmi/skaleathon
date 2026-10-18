import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { FluidParticlesBackground } from '@/components/ui/fluid-particles-background';
import PremiumCursor from '@/components/layout/PremiumCursor';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Skaleathon 2027 — National Online Hackathon | SkaleKraft',
  description:
    'SkaleKraft presents Skaleathon 2027: Build. Innovate. Scale. National online hackathon across India with ₹35,000 prize pool, ₹99 registration fee, certificates for top 25 teams, and interview opportunities.',
  keywords: [
    'Skaleathon 2027',
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
    title: 'Skaleathon 2027 — National Online Hackathon | SkaleKraft',
    description: 'Build. Innovate. Scale. Compete for ₹35,000 prize pool across AI/ML, Web, and App development tracks.',
    url: '/',
    siteName: 'Skaleathon 2027',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skaleathon 2027 — National Online Hackathon',
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
        <body className="min-h-screen bg-[#0B0B0B] text-[#EDEDED] flex flex-col antialiased selection:bg-[#805948]/30 selection:text-white relative">
          {/* Background Gradients & Fluid Particles (SkaleKraft ambient animation on EVERY page) */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(128,89,72,0.18),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.02),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)] [background-size:32px_32px] opacity-70" />
          </div>
          <ErrorBoundary fallback={null}>
            <FluidParticlesBackground
              theme="dark"
              particleCount={560}
              noiseIntensity={0.0024}
              particleSize={{ min: 0.45, max: 1.2 }}
              className="pointer-events-none fixed inset-0 z-0 h-screen bg-transparent opacity-65 dark:bg-transparent"
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={null}>
            <PremiumCursor />
          </ErrorBoundary>

          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
