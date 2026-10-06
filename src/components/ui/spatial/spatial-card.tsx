import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
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
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useFramerReducedMotion();

  // Motion values for smooth hover tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Calculate rotation based on depth
  const maxRotation = depth * 3; // 3deg, 6deg, 9deg
  const rotateX = useTransform(springY, [0, 1], [maxRotation, -maxRotation]);
  const rotateY = useTransform(springX, [0, 1], [-maxRotation, maxRotation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const depthClass = `spatial-layer-${depth}`;
  
  return (
    <div className="spatial-perspective-container" style={{ perspective: '1200px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden transition-shadow duration-500',
          interactive && !shouldReduceMotion ? 'hover:shadow-[var(--spatial-shadow-elevated)]' : '',
          depthClass,
          className
        )}
        style={{
          rotateX: shouldReduceMotion || !interactive ? 0 : rotateX,
          rotateY: shouldReduceMotion || !interactive ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={interactive && !shouldReduceMotion ? { scale: 1.015, z: 15 } : {}}
        whileTap={interactive && !shouldReduceMotion ? { scale: 0.985, z: 0 } : {}}
        {...(props as any)}
      >
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'var(--spatial-glow-subtle)' }} />

        {/* Content container (lifted slightly off the card background) */}
        <div style={{ transform: 'translateZ(10px)' }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
