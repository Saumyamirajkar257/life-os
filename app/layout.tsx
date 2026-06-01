import type { Metadata } from 'next';
import { DM_Sans, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lifeos-257.vercel.app'),
  title: 'LIFE OS — AI-Powered Life Command Center',
  description: 'Replace 6 apps with one intelligent dashboard. Manage tasks, habits, journal, finance and focus — powered by AI. Free forever.',
  keywords: ['productivity', 'life os', 'ai', 'task manager', 'habits', 'journal'],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'LIFE OS — AI-Powered Life Command Center',
    description: 'Replace 6 apps with one intelligent dashboard. Manage tasks, habits, journal, finance and focus — powered by AI. Free forever.',
    url: 'https://lifeos-257.vercel.app',
    siteName: 'LIFE OS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LIFE OS Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIFE OS — AI-Powered Life Command Center',
    description: 'Replace 6 apps with one intelligent dashboard. Manage tasks, habits, journal, finance and focus — powered by AI. Free forever.',
    images: ['/og-image.png'],
  },
};

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          dmSans.variable,
          syne.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
