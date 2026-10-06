/**
 * @file component.tsx
 * @description Accessible Tabs component with spring layout motion active indicator.
 * @module AuraUI/Tabs/Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { TabsProps } from './types';

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  defaultTabId,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className,
}) => {
  const initialTab = activeTabId || defaultTabId || tabs[0]?.id;
  const [currentTab, setCurrentTab] = useState(initialTab);

  const activeId = activeTabId !== undefined ? activeTabId : currentTab;

  const handleTabClick = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setCurrentTab(id);
    onTabChange?.(id);
  };

  const activeTabContent = tabs.find((t) => t.id === activeId)?.content;

  const tabSizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-1.5 gap-2 font-medium',
    lg: 'text-sm px-4 py-2 gap-2.5 font-semibold',
  };

  return (
    <div className={cn('w-full flex flex-col gap-3', className)}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          'flex items-center gap-1 border-b border-[var(--color-border)] relative',
          variant === 'segmented' &&
            'p-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl border-b-transparent',
          variant === 'pills' && 'border-b-transparent gap-2'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              className={cn(
                'relative inline-flex items-center justify-center transition-colors select-none focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                tabSizeClasses[size],
                variant === 'underline' &&
                  (isActive
                    ? 'text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'),
                variant === 'pills' &&
                  (isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] rounded-lg font-semibold shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] rounded-lg'),
                variant === 'segmented' &&
                  (isActive
                    ? 'text-[var(--color-text-primary)] font-semibold z-10'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] z-10')
              )}
            >
              {/* Segmented Background Slider */}
              {variant === 'segmented' && isActive && (
                <motion.div
                  layoutId="segmented-tab-active"
                  transition={springTransitions.snappy}
                  className="absolute inset-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xs z-0"
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                    {tab.badge}
                  </span>
                )}
              </span>

              {/* Underline Indicator */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="underline-tab-active"
                  transition={springTransitions.snappy}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={springTransitions.tight}
          role="tabpanel"
          className="w-full focus:outline-none"
        >
          {activeTabContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
