import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

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
          colorPrimary: '#6366f1',
          colorBackground: '#0a0e1a',
          colorText: '#f1f5f9',
          colorTextSecondary: '#94a3b8',
          colorInputBackground: '#0c1220',
          colorInputText: '#ffffff',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0c1220]',
          formButtonPrimary:
            'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/20',
          footerActionLink: 'text-cyanAccent-400 hover:text-white',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[#060911] text-slate-100 flex flex-col antialiased selection:bg-brand-500/30 selection:text-white">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
