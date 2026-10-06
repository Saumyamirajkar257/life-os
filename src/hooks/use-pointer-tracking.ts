import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function usePointerTracking() {
  const reducedMotion = useReducedMotion();
  const ticking = useRef(false);

  useEffect(() => {
    // If reduced motion is requested or we're on a small screen, disable tracking
    if (reducedMotion || window.innerWidth < 768) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const x = e.clientX;
          const y = e.clientY;
          const width = window.innerWidth;
          const height = window.innerHeight;

          // Normalized values from -1 to 1
          const xNorm = (x / width) * 2 - 1;
          const yNorm = (y / height) * 2 - 1;

          // Percentages
          const xPct = (x / width) * 100;
          const yPct = (y / height) * 100;

          document.documentElement.style.setProperty('--pointer-x', `${x}px`);
          document.documentElement.style.setProperty('--pointer-y', `${y}px`);
          document.documentElement.style.setProperty('--pointer-x-norm', xNorm.toFixed(3));
          document.documentElement.style.setProperty('--pointer-y-norm', yNorm.toFixed(3));
          document.documentElement.style.setProperty('--pointer-x-pct', `${xPct.toFixed(1)}%`);
          document.documentElement.style.setProperty('--pointer-y-pct', `${yPct.toFixed(1)}%`);

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [reducedMotion]);
}
