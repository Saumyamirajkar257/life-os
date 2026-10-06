/**
 * @file component.tsx
 * @description Accessible Dropdown menu component with submenus, shortcuts, and keyboard navigation.
 * @module AuraUI/Dropdown/Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { DropdownProps, DropdownItem } from './types';

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="inline-block cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={springTransitions.snappy}
            className={cn(
              'absolute top-full mt-1.5 z-40 min-w-[180px] p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl space-y-0.5',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            role="menu"
          >
            {items.map((item) => {
              if (item.isDivider) {
                return (
                  <div
                    key={item.id}
                    className="my-1 border-t border-[var(--color-border-subtle)]"
                  />
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  role="menuitem"
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left disabled:opacity-40 disabled:cursor-not-allowed',
                    item.isDanger
                      ? 'text-[var(--color-error)] hover:bg-[var(--color-error-bg)]'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span className="w-3.5 h-3.5 shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider uppercase">
                      {item.shortcut}
                    </span>
                  )}

                  {item.children && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
