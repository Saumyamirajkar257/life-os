'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerItem, hoverLift } from '@/animations';

interface GlassCardProps {
  variant?: 'default' | 'strong' | 'subtle';
  glowOnHover?: boolean;
  animated?: boolean;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses = {
  default: 'glass-panel',
  strong: 'glass-panel-strong',
  subtle: 'glass-panel-subtle',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', glowOnHover = true, animated = true, header, icon, className, children, style }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={animated ? staggerItem : undefined}
        whileHover={glowOnHover ? hoverLift : undefined}
        className={cn(
          variantClasses[variant],
          'rounded-2xl p-6 relative overflow-hidden transition-colors duration-300',
          glowOnHover && 'glow-hover cursor-pointer',
          className
        )}
        style={style}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {(header || icon) && (
          <div className="flex items-center gap-3 mb-4 relative z-10">
            {icon && <span className="text-white/70">{icon}</span>}
            {header && <h3 className="font-display font-semibold text-white">{header}</h3>}
          </div>
        )}

        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
