/**
 * @file platform.ts
 * @description OS and environment detection utilities for Aura Core.
 * Safely inspects navigator context for macOS, Windows, touch support, and mobile viewports.
 * @module AuraCore/Lib/Utils/Platform
 */

import { PlatformInfo, PlatformOS } from '@/types/platform.types';

/**
 * Detects current runtime operating system and environment characteristics.
 * Safe for SSR and client environments.
 */
export function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      os: 'Unknown',
      isMac: false,
      isWindows: false,
      isMobile: false,
      hasTouch: false,
      userAgent: 'server',
    };
  }

  const userAgent = navigator.userAgent || '';
  const platformStr = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || '';

  const isMac = /Mac|iPhone|iPod|iPad/i.test(platformStr) || /Mac/i.test(userAgent);
  const isWindows = /Win/i.test(platformStr) || /Windows/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isLinux = /Linux/i.test(platformStr) && !isAndroid;

  let os: PlatformOS = 'Unknown';
  if (isMac) os = 'macOS';
  else if (isWindows) os = 'Windows';
  else if (isIOS) os = 'iOS';
  else if (isAndroid) os = 'Android';
  else if (isLinux) os = 'Linux';

  const isMobile = isIOS || isAndroid || /Mobi|Tablet/i.test(userAgent);
  const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    os,
    isMac,
    isWindows,
    isMobile,
    hasTouch,
    userAgent,
  };
}
