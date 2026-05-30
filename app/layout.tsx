import type { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LIFE OS | AI-Powered Life Command Center',
  description: 'Futuristic AI-powered productivity operating system. Manage tasks, habits, journal, analytics, finance, and focus — all from one cinematic command center.',
  keywords: ['productivity', 'life os', 'ai', 'task manager', 'habits', 'journal'],
};

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { VoiceAssistant } from '@/components/ai/VoiceAssistant';
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
          inter.variable,
          outfit.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <VoiceAssistant />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
