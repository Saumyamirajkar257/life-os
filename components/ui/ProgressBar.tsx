'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  glowColor?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  className,
  glowColor = 'rgba(255,255,255,0.8)',
  animated = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizeClasses[size], className)}>
      <motion.div
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        className={cn('h-full bg-white rounded-full', sizeClasses[size])}
        style={{ boxShadow: `0 0 10px ${glowColor}` }}
      />
    </div>
  );
}
