/**
 * @file component.tsx
 * @description Accessible ContextMenu component triggered on right click with screen bounds clipping prevention.
 * @module AuraUI/ContextMenu/Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { ContextMenuProps } from './types';

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, className }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPosition(null);
      }
    };
    const handleScroll = () => setPosition(null);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPosition(null);
    };

    if (position) {
      document.addEventListener('click', handleClick);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [position]);

  return (
    <div onContextMenu={handleContextMenu} className={cn('inline-block', className)}>
      {children}

      <AnimatePresence>
        {position && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springTransitions.snappy}
            style={{ top: position.y, left: position.x }}
            className="fixed z-50 min-w-[180px] p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl space-y-0.5"
            role="menu"
          >
            {items.map((item) => {
              if (item.isDivider) {
                return <div key={item.id} className="my-1 border-t border-[var(--color-border-subtle)]" />;
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setPosition(null);
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
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
