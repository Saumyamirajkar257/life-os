/**
 * @file component.tsx
 * @description Composite LoadingScreen featuring Aura OS brand pulsing logos and progress indicators.
 * @module AuraComposite/LoadingScreen/Component
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { LoadingScreenProps } from './types';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing Aura OS environment...',
  progress,
  fullScreen = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-primary)] p-6 z-50',
        fullScreen ? 'fixed inset-0 w-screen h-screen' : 'w-full h-64 rounded-2xl border border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex flex-col items-center max-w-sm w-full text-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-3xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] shadow-xl"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2 w-full">
          <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
            Aura OS
          </h3>
          <p className="text-xs font-mono text-[var(--color-text-muted)] animate-pulse">
            {message}
          </p>
        </div>

        {progress !== undefined ? (
          <div className="w-full space-y-1">
            <Progress value={progress} size="sm" />
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{progress}%</span>
          </div>
        ) : (
          <Spinner size="md" color="accent" />
        )}
      </div>
    </div>
  );
};
