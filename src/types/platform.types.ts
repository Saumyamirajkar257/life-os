/**
 * @file platform.types.ts
 * @description OS and environment detection type declarations for Aura Core.
 * @module AuraCore/Types/Platform
 */

export type PlatformOS = 'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'Unknown';

export interface PlatformInfo {
  os: PlatformOS;
  isMac: boolean;
  isWindows: boolean;
  isMobile: boolean;
  hasTouch: boolean;
  userAgent: string;
}
