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
          colorPrimary: '#c19a88',
          colorBackground: '#0B0B0B',
          colorText: '#ffffff',
          colorTextSecondary: '#A1A1AA',
          colorInputBackground: '#121212',
          colorInputText: '#ffffff',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl',
          formButtonPrimary:
            'bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#c19a88] hover:to-[#805948] text-white font-semibold transition-all shadow-[0_4px_20px_rgba(128,89,72,0.35)]',
          footerActionLink: 'text-[#c19a88] hover:text-white',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col antialiased selection:bg-[#805948]/30 selection:text-white">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
