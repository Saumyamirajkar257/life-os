/**
 * @file component.tsx
 * @description Desktop Shell status bar / footer showing system health, live clock, workspace info, and platform details.
 * @module AuraShell/Footer/Component
 */

import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { APP_CONFIG } from '@/config/app.config';
import { detectPlatform } from '@/lib/utils/platform';
import { ShortcutHint } from '@/components/composite/shortcut-hint';
import { FooterProps } from './types';

export const Footer: React.FC<FooterProps> = ({
  workspaceLabel = 'Aura Life OS',
  statusText = 'Operational',
  statusVariant = 'online',
  leftContent,
  rightContent,
  showClock = true,
  showShortcuts = true,
  sticky = true,
  className,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [platform, setPlatform] = useState(() => detectPlatform());

  useEffect(() => {
    setPlatform(detectPlatform());
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColorMap = {
    online: 'bg-emerald-500',
    offline: 'bg-red-500',
    busy: 'bg-amber-500',
    warning: 'bg-orange-500',
  };

  return (
    <footer
      className={cn(
        'h-9 border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] shrink-0 z-20 select-none',
        sticky ? 'sticky bottom-0' : 'relative',
        className
      )}
    >
      {/* Left Section: Status & Workspace */}
      <div className="flex items-center gap-4 min-w-0">
        {leftContent ? (
          leftContent
        ) : (
          <>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('w-2 h-2 rounded-full', statusColorMap[statusVariant])} />
              <span className="font-semibold text-[var(--color-text-primary)]">{statusText}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 border-l border-[var(--color-border)]/60 pl-3">
              <Activity className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
              <span className="truncate">{workspaceLabel}</span>
            </div>
          </>
        )}
      </div>

      {/* Right Section: Time, OS, Version, Shortcuts */}
      <div className="flex items-center gap-4 shrink-0">
        {rightContent ? (
          rightContent
        ) : (
          <>
            {showShortcuts && (
              <div className="hidden md:flex items-center gap-2 border-r border-[var(--color-border)]/60 pr-3">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Hotkeys:</span>
                <ShortcutHint keys={['⌘', 'K']} size="xs" />
                <ShortcutHint keys={['⌘', 'B']} size="xs" />
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <Cpu className="w-3 h-3 text-[var(--color-text-muted)]" />
              <span>{platform.os}</span>
            </div>

            {showClock && timeStr && (
              <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-semibold border-l border-[var(--color-border)]/60 pl-3">
                <Clock className="w-3 h-3 text-[var(--color-accent)]" />
                <span>{timeStr}</span>
              </div>
            )}

            <div className="text-[10px] font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
              {APP_CONFIG.version}
            </div>
          </>
        )}
      </div>
    </footer>
  );
};
