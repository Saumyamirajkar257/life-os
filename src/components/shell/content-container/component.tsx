/**
 * @file component.tsx
 * @description Responsive content container with scroll management, max-width presets, scroll-to-top button, and motion transitions.
 * @module AuraShell/ContentContainer/Component
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { tweenTransitions } from '@/animations/transitions';
import { ContentContainerProps } from './types';

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  maxWidth = '2xl',
  padding = 'lg',
  viewKey,
  showScrollToTop = true,
  scrollable = true,
  className,
}) => {
  const [scrolledDown, setScrolledDown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrolledDown(scrollTop > 200);
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const maxWidthMap = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingMap = {
    none: 'p-0',
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-6 sm:p-10',
    xl: 'p-8 sm:p-12',
  };

  return (
    <div
      ref={containerRef}
      onScroll={scrollable ? handleScroll : undefined}
      className={cn(
        'relative flex-1 w-full flex flex-col',
        scrollable ? 'overflow-y-auto overflow-x-hidden scroll-smooth' : 'overflow-hidden',
        className
      )}
    >
      <div className={cn('w-full mx-auto flex-1 flex flex-col', maxWidthMap[maxWidth], paddingMap[padding])}>
        <AnimatePresence initial={false}>
          <motion.div
            key={viewKey || 'content-view'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="flex-1 w-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollToTop && scrolledDown && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-16 right-6 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-xl hover:bg-[var(--color-surface-elevated)] hover:scale-110 active:scale-95 transition-all cursor-pointer z-30 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
          >
            <ArrowUp className="w-4 h-4 text-[var(--color-accent)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
