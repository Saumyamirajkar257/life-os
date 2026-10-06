/**
 * @file component.tsx
 * @description Composite ErrorComponents rendering specialized error views (404, Network, 500, Unauthorized).
 * @module AuraComposite/ErrorComponents/Component
 */

import React from 'react';
import { WifiOff, FileQuestion, ServerCrash, ShieldAlert, AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { ErrorComponentProps, ErrorType } from './types';

const configMap: Record<ErrorType, { icon: React.ReactNode; defaultTitle: string; defaultDesc: string }> = {
  generic: {
    icon: <AlertTriangle className="w-10 h-10 text-rose-500" />,
    defaultTitle: 'Something went wrong',
    defaultDesc: 'An unexpected application error occurred. Please try again.',
  },
  network: {
    icon: <WifiOff className="w-10 h-10 text-amber-500" />,
    defaultTitle: 'Network Connection Lost',
    defaultDesc: 'Please verify your internet connection and network proxies.',
  },
  '404': {
    icon: <FileQuestion className="w-10 h-10 text-[var(--color-accent)]" />,
    defaultTitle: 'Page Not Found (404)',
    defaultDesc: 'The requested resource or page route does not exist in Aura OS.',
  },
  '500': {
    icon: <ServerCrash className="w-10 h-10 text-rose-500" />,
    defaultTitle: 'Internal Server Exception (500)',
    defaultDesc: 'The backend service encountered an unhandled fault.',
  },
  unauthorized: {
    icon: <ShieldAlert className="w-10 h-10 text-amber-500" />,
    defaultTitle: 'Access Restricted (403)',
    defaultDesc: 'You do not have permission to view or modify this resource.',
  },
};

export const ErrorStateView: React.FC<ErrorComponentProps> = ({
  type = 'generic',
  title,
  description,
  onRetry,
  onGoHome,
  className,
}) => {
  const conf = configMap[type];

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-md mx-auto space-y-4 shadow-2xs', className)}>
      <div className="p-4 rounded-3xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-2xs">
        {conf.icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          {title || conf.defaultTitle}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-mono">
          {description || conf.defaultDesc}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {onGoHome && (
          <Button variant="outline" size="sm" onClick={onGoHome} className="gap-2">
            <Home className="w-3.5 h-3.5" /> Return Home
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry} className="gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> Retry Request
          </Button>
        )}
      </div>
    </div>
  );
};
