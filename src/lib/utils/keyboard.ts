/**
 * @file keyboard.ts
 * @description Keyboard shortcut parsing, event key normalization, and modifier key utilities.
 * @module AuraCore/Lib/Utils/Keyboard
 */

import { detectPlatform } from './platform';

export interface ShortcutDescriptor {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

/**
 * Returns OS-specific primary modifier symbol (⌘ for Mac, Ctrl for Windows/Linux).
 */
export function getMetaKeyLabel(): string {
  const { isMac } = detectPlatform();
  return isMac ? '⌘' : 'Ctrl';
}

/**
 * Parses a shortcut string like "meta+k" or "ctrl+shift+p" into structured boolean flags.
 */
export function parseShortcut(shortcut: string): ShortcutDescriptor {
  const parts = shortcut.toLowerCase().split('+').map((s) => s.trim());
  const key = parts[parts.length - 1];

  return {
    key,
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt') || parts.includes('option'),
    shift: parts.includes('shift'),
  };
}

/**
 * Checks if a KeyboardEvent matches a parsed or string shortcut descriptor.
 */
export function isMatchingShortcut(event: KeyboardEvent, shortcut: string | ShortcutDescriptor): boolean {
  const parsed = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;
  const { isMac } = detectPlatform();

  const eventKey = event.key.toLowerCase();
  const targetKey = parsed.key.toLowerCase();

  const keyMatches = eventKey === targetKey || event.code.toLowerCase() === `key${targetKey}`;

  // Handle 'meta' abstracting Cmd on Mac and Ctrl on Windows/Linux if specified
  const metaMatch = parsed.meta
    ? (isMac ? event.metaKey : event.ctrlKey)
    : !event.metaKey && (!isMac ? !event.ctrlKey : true);

  const ctrlMatch = parsed.ctrl ? event.ctrlKey : true;
  const altMatch = parsed.alt ? event.altKey : !event.altKey;
  const shiftMatch = parsed.shift ? event.shiftKey : !event.shiftKey;

  return keyMatches && metaMatch && ctrlMatch && altMatch && shiftMatch;
}

/**
 * Formats shortcut string into human readable OS representation (e.g. "⌘ K" or "Ctrl + K").
 */
export function formatShortcutForOS(shortcut: string): string {
  const parsed = parseShortcut(shortcut);
  const { isMac } = detectPlatform();

  const symbols: string[] = [];

  if (parsed.meta) symbols.push(isMac ? '⌘' : 'Ctrl');
  if (parsed.ctrl && isMac) symbols.push('⌃');
  if (parsed.alt) symbols.push(isMac ? '⌥' : 'Alt');
  if (parsed.shift) symbols.push(isMac ? '⇧' : 'Shift');

  symbols.push(parsed.key.toUpperCase());

  return isMac ? symbols.join('') : symbols.join(' + ');
}
