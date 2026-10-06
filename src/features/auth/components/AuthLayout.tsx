/**
 * @file AuthLayout.tsx
 * @description Wrapper layout for authentication pages centering content on dark/light canvas with branded badge and backdrop blur.
 * @module Features/Auth/Components/AuthLayout
 */

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { APP_CONFIG } from '@/config/app.config';
import { springTransitions } from '@/animations/transitions';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badge = 'Aura Core Security',
  className,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[var(--color-bg)] select-none">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springTransitions.gentle}
        className={cn(
          'w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden',
          className
        )}
      >
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            <Zap className="w-3 h-3 fill-current" />
            <span>{badge}</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--color-text-primary)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Main Form Content */}
        <div>{children}</div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-[var(--color-border)]/60 text-center flex items-center justify-center gap-2 text-[10px] font-mono text-[var(--color-text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{APP_CONFIG.name} Secure Account Portal</span>
        </div>
      </motion.div>
    </div>
  );
};
