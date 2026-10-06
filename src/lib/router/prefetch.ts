/**
 * @file prefetch.ts
 * @description Intelligent module and route prefetching engine for Aura Life OS.
 * Prefetches lazy chunk bundles during browser idle periods and on pointer/hover intent
 * without mounting components, ensuring sub-16ms instantaneous route transitions.
 * @module AuraCore/Lib/Router/Prefetch
 */

// Route chunk import loaders
const ROUTE_LOADERS: Record<string, () => Promise<unknown>> = {
  tasks: () => import('@/features/tasks'),
  calendar: () => import('@/features/calendar'),
  habits: () => import('@/features/habits'),
  journal: () => import('@/features/journal'),
  finance: () => import('@/features/finance'),
  goals: () => import('@/features/goals'),
  ai: () => import('@/features/ai'),
  settings: () => import('@/features/settings'),
  analytics: () => import('@/features/analytics/pages/AnalyticsPage'),
  'user-profile': () => import('@/features/auth'),
  'auth-portal': () => import('@/features/auth'),
  cloud: () => import('@/features/cloud/CloudScreen'),
};

// Priority sequence for idle-time background prefetching
const IDLE_PREFETCH_PRIORITY: string[] = [
  'tasks',
  'calendar',
  'habits',
  'journal',
  'finance',
  'goals',
  'ai',
  'settings',
  'user-profile',
  'cloud',
];

// Track prefetched modules to avoid redundant network invocations
const prefetchedRoutes = new Set<string>();

/**
 * Preloads a specific route module into browser/HTTP module cache.
 * Safe to invoke repeatedly; subsequent calls are no-ops.
 */
export function preloadRoute(routeId: string): void {
  // Normalize route aliases
  const normalizedId = routeId.replace(/-sidebar-main$/, '').replace(/^\//, '');
  
  if (prefetchedRoutes.has(normalizedId)) return;
  const loader = ROUTE_LOADERS[normalizedId];
  if (!loader) return;

  prefetchedRoutes.add(normalizedId);

  // Execute dynamic import in background
  loader().catch((err) => {
    // Non-fatal: remove from cache so a retry can occur if needed
    prefetchedRoutes.delete(normalizedId);
    console.debug(`[Prefetch] Route "${normalizedId}" preload deferred:`, err);
  });
}

/**
 * Initiates progressive idle prefetching across high-probability routes.
 * Utilizes requestIdleCallback when available, with sequential scheduling
 * to prevent bandwidth contention or main thread jank during app boot.
 */
export function startIdleRoutePrefetch(): () => void {
  let isCancelled = false;
  let currentIndex = 0;

  const prefetchNext = () => {
    if (isCancelled || currentIndex >= IDLE_PREFETCH_PRIORITY.length) return;

    const routeId = IDLE_PREFETCH_PRIORITY[currentIndex++];
    preloadRoute(routeId);

    // Schedule next route prefetch
    if (currentIndex < IDLE_PREFETCH_PRIORITY.length) {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          prefetchNext,
          { timeout: 2000 }
        );
      } else {
        setTimeout(prefetchNext, 500);
      }
    }
  };

  // Give initial Overview render 1.2s of clean unhindered CPU & network time
  const initialTimer = setTimeout(() => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        prefetchNext,
        { timeout: 2500 }
      );
    } else {
      setTimeout(prefetchNext, 600);
    }
  }, 1200);

  return () => {
    isCancelled = true;
    clearTimeout(initialTimer);
  };
}
