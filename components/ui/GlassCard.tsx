'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerItem, hoverLift } from '@/animations';

interface GlassCardProps {
  variant?: 'default' | 'strong' | 'subtle' | 'elevated' | 'floating' | 'sunken';
  glowOnHover?: boolean;
  animated?: boolean;
  gradientBorder?: boolean;
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
  elevated: 'glass-panel depth-card-elevated',
  floating: 'glass-panel animate-float glow-border',
  sunken: 'bg-black/40 border border-white/5 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', glowOnHover = true, animated = true, gradientBorder = false, header, icon, className, children, style }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={animated ? staggerItem : undefined}
        whileHover={glowOnHover ? hoverLift : undefined}
        className={cn(
          variantClasses[variant],
          'rounded-2xl p-6 relative transition-colors duration-300',
          glowOnHover && 'glow-hover cursor-pointer',
          gradientBorder && 'p-[1px] overflow-hidden',
          !gradientBorder && 'overflow-hidden',
          className
        )}
        style={style}
      >
        {gradientBorder && (
          <>
            <div className="absolute inset-[-100%] animate-[border-rotate_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.3)_360deg)] pointer-events-none" />
            <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-black/60 backdrop-blur-xl -z-10" />
          </>
        )}
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
