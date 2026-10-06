/**
 * @file component.tsx
 * @description Accessible Accordion component with spring motion collapse/expand transitions.
 * @module AuraUI/Accordion/Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { fadeInVariants } from '@/animations/variants';
import { springTransitions } from '@/animations/transitions';
import { AccordionProps } from './types';

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultExpandedIds = [],
  className,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setExpandedIds(expandedIds.includes(id) ? [] : [id]);
    } else {
      setExpandedIds(
        expandedIds.includes(id)
          ? expandedIds.filter((item) => item !== id)
          : [...expandedIds, id]
      );
    }
  };

  return (
    <div className={cn('w-full border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-2xs', className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);

        return (
          <div key={item.id} className="w-full">
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between p-4 text-xs md:text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors text-left focus:outline-none focus:bg-[var(--color-surface-elevated)] disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {item.icon && <span className="text-[var(--color-text-muted)] shrink-0">{item.icon}</span>}
                <span>{item.title}</span>
              </div>
              <ChevronDown
                className={cn('w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 shrink-0', isExpanded && 'rotate-180')}
              />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={springTransitions.snappy}
                  className="overflow-hidden bg-[var(--color-surface-muted)]"
                >
                  <div className="p-4 pt-1 text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-subtle)]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
