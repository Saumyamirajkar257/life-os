'use client';
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
}: {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest);
        // Snaps to final value if within 1% or at least within 5 of target
        if (Math.abs(latest - value) < Math.max(5, value * 0.001)) {
          ref.current.textContent = Intl.NumberFormat('en-US').format(value);
        } else {
          ref.current.textContent = Intl.NumberFormat('en-US').format(
            Math.max(0, rounded)
          );
        }
      }
    });
    return () => unsubscribe();
  }, [springValue, value]);

  return (
    <span
      className={className}
      ref={ref}
    />
  );
}
