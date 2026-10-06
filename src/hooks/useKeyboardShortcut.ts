/**
 * @file useKeyboardShortcut.ts
 * @description React hook to register global window hotkey listeners safely with matching logic.
 * @module AuraCore/Hooks/UseKeyboardShortcut
 */

import { useEffect, useRef } from 'react';
import { isMatchingShortcut, ShortcutDescriptor } from '@/lib/utils/keyboard';

export interface KeyboardShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
  targetElement?: HTMLElement | null;
}

/**
 * Hook to attach global or element-specific keyboard shortcuts.
 *
 * @param shortcut - String shortcut representation (e.g. "meta+k", "ctrl+shift+p") or ShortcutDescriptor
 * @param callback - Event handler triggered on valid shortcut match
 * @param options - Configuration options for event handling
 */
export function useKeyboardShortcut(
  shortcut: string | ShortcutDescriptor,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
): void {
  const {
    preventDefault = true,
    stopPropagation = true,
    enabled = true,
    targetElement = null,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea unless modifier key is pressed
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      const isMetaOrCtrl = event.metaKey || event.ctrlKey;

      if (isInput && !isMetaOrCtrl && event.key !== 'Escape') {
        return;
      }

      if (isMatchingShortcut(event, shortcut)) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callbackRef.current(event);
      }
    };

    const target = targetElement || window;
    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [shortcut, enabled, preventDefault, stopPropagation, targetElement]);
}
