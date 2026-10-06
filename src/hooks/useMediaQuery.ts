/**
 * @file useMediaQuery.ts
 * @description React hook to listen for media query changes (screen size, dark mode preference, etc).
 * @module AuraCore/Hooks/UseMediaQuery
 */

import { useState, useEffect } from 'react';

/**
 * Returns boolean state of a CSS media query string.
 *
 * @param query - Media query string e.g. "(min-width: 768px)" or "(prefers-color-scheme: dark)"
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
