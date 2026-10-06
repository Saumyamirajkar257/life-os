import { isMacOS, getPlatformModKey } from './platform';

export function normalizeKey(key: string): string {
  const keyMap: Record<string, string> = {
    Control: 'Ctrl',
    Meta: '⌘',
    Alt: isMacOS() ? '⌥' : 'Alt',
    Shift: '⇧',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Escape: 'Esc',
    Enter: '↵',
    Backspace: '⌫',
    Delete: '⌦',
    Tab: '⇥',
    ' ': 'Space',
  };
  return keyMap[key] ?? key;
}

export function isModKey(event: KeyboardEvent): boolean {
  return isMacOS() ? event.metaKey : event.ctrlKey;
}

export function isShortcut(
  event: KeyboardEvent,
  key: string,
  options?: { mod?: boolean; shift?: boolean; alt?: boolean }
): boolean {
  const { mod = false, shift = false, alt = false } = options ?? {};

  if (mod && !isModKey(event)) return false;
  if (shift && !event.shiftKey) return false;
  if (alt && !event.altKey) return false;

  return event.key.toLowerCase() === key.toLowerCase();
}

export function formatShortcut(keys: string[]): string {
  return keys
    .map((key) => {
      if (key === 'mod') return getPlatformModKey();
      return normalizeKey(key);
    })
    .join('');
}
