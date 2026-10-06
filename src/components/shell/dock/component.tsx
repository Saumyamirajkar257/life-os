/**
 * @file component.tsx
 * @description Floating Desktop Dock component with macOS-inspired spring magnification, tooltips, active dots, and badges.
 * @module AuraShell/Dock/Component
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Moon, Sun, Plus, CheckSquare, BookOpen, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Tooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useCommandPaletteStore } from '@/stores/useCommandPaletteStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useTheme } from '@/hooks/use-theme';
import { springTransitions } from '@/animations/transitions';
import { preloadRoute } from '@/lib/router/prefetch';
import { DockProps, DockItem } from './types';

export const Dock: React.FC<DockProps> = ({
  items: customItems,
  activeItemId = 'analytics',
  onSelectItemId,
  enableMagnification = true,
  autoHide = false,
  position = 'bottom',
  className,
}) => {
  const { openCommandPalette } = useCommandPaletteStore();
  const { notifications } = useNotificationStore();
  const { toggleTheme, isDarkTheme, currentTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Default items if none provided
  const defaultItems: DockItem[] = [
    {
      id: 'tasks',
      label: 'Tasks Engine',
      icon: <CheckSquare className="w-5 h-5" />,
      isActive: activeItemId === 'tasks',
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: <BookOpen className="w-5 h-5" />,
      isActive: activeItemId === 'journal',
    },
    {
      id: 'command',
      label: 'Command Palette (⌘K)',
      icon: <Search className="w-5 h-5" />,
      onClick: () => openCommandPalette(),
    },
    {
      id: 'theme',
      label: `Theme: ${currentTheme.name}`,
      icon: isDarkTheme ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />,
      onClick: () => toggleTheme(),
    }
  ];

  const dockItems = customItems || defaultItems;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed z-40 flex justify-center pointer-events-none transition-transform duration-300',
        position === 'bottom' ? 'bottom-4 left-1/2 -translate-x-1/2' : '',
        position === 'bottom-left' ? 'bottom-4 left-6' : '',
        position === 'bottom-right' ? 'bottom-4 right-6' : '',
        autoHide && !isHovered ? 'translate-y-12 opacity-40 hover:translate-y-0 hover:opacity-100' : 'translate-y-0',
        className
      )}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springTransitions.gentle}
        className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl shadow-black/20 select-none"
      >
        {dockItems.map((item) => {
          const isActive = item.isActive || activeItemId === item.id;

          return (
            <Tooltip key={item.id} content={item.label} position="top">
              <motion.button
                type="button"
                whileHover={enableMagnification ? { scale: 1.25, y: -6 } : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => preloadRoute(item.id)}
                onFocus={() => preloadRoute(item.id)}
                onPointerDown={() => preloadRoute(item.id)}
                onClick={() => {
                  if (item.disabled) return;
                  if (item.onClick) item.onClick();
                  if (onSelectItemId) onSelectItemId(item.id);
                }}
                disabled={item.disabled}
                className={cn(
                  'relative group p-2.5 rounded-xl transition-colors cursor-pointer flex flex-col items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed',
                  isActive
                    ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-bold border border-[var(--color-accent)]/20 shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                )}
              >
                {/* Icon */}
                <span className="shrink-0">{item.icon}</span>

                {/* Badge */}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[var(--color-accent)] text-[var(--color-accent-contrast,white)] text-[9px] font-bold font-mono rounded-full flex items-center justify-center border border-[var(--color-surface)] shadow-xs leading-none">
                    {item.badge}
                  </span>
                )}

                {/* Active Dot Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="dock-active-dot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-xs"
                  />
                )}
              </motion.button>
            </Tooltip>
          );
        })}
      </motion.div>
    </div>
  );
};
