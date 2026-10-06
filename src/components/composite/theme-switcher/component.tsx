/**
 * @file component.tsx
 * @description Composite ThemeSwitcher supporting Midnight, Light, AMOLED, Aurora, and Auto themes with animated segmented control and grid layouts.
 * @module AuraComposite/ThemeSwitcher/Component
 */

import React from 'react';
import { Sun, Moon, Laptop, Sparkles, Contrast, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/hooks/use-theme';
import { Dropdown } from '@/components/ui/dropdown';
import { springTransitions } from '@/animations/transitions';
import { ThemeSwitcherProps } from './types';

const themeIcons: Record<string, React.ReactNode> = {
  midnight: <Moon className="w-3.5 h-3.5" />,
  light: <Sun className="w-3.5 h-3.5" />,
  amoled: <Contrast className="w-3.5 h-3.5" />,
  aurora: <Sparkles className="w-3.5 h-3.5" />,
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'segmented',
  showLabels = true,
  className,
}) => {
  const { currentTheme, setTheme, setAutoTheme, theme, availableThemes } = useTheme();

  if (variant === 'dropdown') {
    const trigger = (
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] text-xs font-medium text-[var(--color-text-primary)] transition-colors cursor-pointer shadow-2xs',
          className
        )}
      >
        <span className="text-[var(--color-accent)]">
          {theme === 'system' ? <Laptop className="w-3.5 h-3.5" /> : (themeIcons[currentTheme.id] || <Sun className="w-3.5 h-3.5" />)}
        </span>
        {showLabels && <span>{theme === 'system' ? 'System Theme' : currentTheme.name}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
      </button>
    );

    const dropdownItems = [
      ...availableThemes.map((t) => ({
        id: t.id,
        label: t.name,
        icon: themeIcons[t.id],
        onClick: () => setTheme(t.id as any),
      })),
      { id: 'divider', isDivider: true, label: '' },
      {
        id: 'system',
        label: 'Auto / System',
        icon: <Laptop className="w-3.5 h-3.5" />,
        onClick: () => setAutoTheme(true),
      },
    ];

    return (
      <Dropdown
        trigger={trigger}
        align="right"
        items={dropdownItems}
      />
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-2 w-full', className)}>
        {availableThemes.map((t) => {
          const isActive = theme !== 'system' && currentTheme.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id as any)}
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left',
                isActive
                  ? 'bg-[var(--color-surface-elevated)] border-[var(--color-accent)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)] shadow-sm'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]'
              )}
            >
              <div className="p-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] shrink-0">
                {themeIcons[t.id]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold truncate">{t.name}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                  {t.isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented Pill
  return (
    <div className={cn('inline-flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xs gap-1', className)}>
      {availableThemes.map((t) => {
        const isActive = theme !== 'system' && currentTheme.id === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id as any)}
            className={cn(
              'relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer select-none',
              isActive
                ? 'text-[var(--color-accent)] font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeThemePill"
                transition={springTransitions.snappy}
                className="absolute inset-0 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl shadow-2xs"
              />
            )}
            <span className="relative z-10">{themeIcons[t.id]}</span>
            {showLabels && <span className="relative z-10">{t.name}</span>}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => setAutoTheme(true)}
        title="Sync with System Theme"
        className={cn(
          'relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer select-none',
          theme === 'system'
            ? 'text-[var(--color-accent)] font-bold'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        )}
      >
        {theme === 'system' && (
          <motion.div
            layoutId="activeThemePill"
            transition={springTransitions.snappy}
            className="absolute inset-0 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl shadow-2xs"
          />
        )}
        <span className="relative z-10">
          <Laptop className="w-3.5 h-3.5" />
        </span>
        {showLabels && <span className="relative z-10">Auto</span>}
      </button>
    </div>
  );
};
