export type Platform = 'macos' | 'windows' | 'linux' | 'unknown';

export function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

export function isMacOS(): boolean {
  return getPlatform() === 'macos';
}

export function isWindows(): boolean {
  return getPlatform() === 'windows';
}

export function getPlatformModKey(): string {
  return isMacOS() ? '⌘' : 'Ctrl';
}

export function getPlatformAltKey(): string {
  return isMacOS() ? '⌥' : 'Alt';
}

export function getPlatformShiftKey(): string {
  return '⇧';
}
