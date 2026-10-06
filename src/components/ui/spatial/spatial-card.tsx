import React from 'react';
import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SpatialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  depth?: 1 | 2 | 3;
  interactive?: boolean;
  className?: string;
  gradient?: boolean;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  depth = 1,
  interactive = true,
  className,
  gradient = false,
  ...props
}) => {
  const shouldReduceMotion = useFramerReducedMotion();
  const depthClass = `spatial-layer-${depth}`;
  
  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-all duration-300',
        interactive && !shouldReduceMotion ? 'hover:shadow-lg hover:border-[var(--color-border)]' : '',
        depthClass,
        className
      )}
      whileHover={interactive && !shouldReduceMotion ? { scale: 1.01, y: -2 } : {}}
      whileTap={interactive && !shouldReduceMotion ? { scale: 0.99 } : {}}
      {...(props as any)}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-2xl" />
      )}
      
      {/* Content container */}
      <div className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
