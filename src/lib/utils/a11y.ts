/**
 * @file a11y.ts
 * @description Accessibility helpers: screen reader announcements, focus management, ARIA attributes.
 * @module AuraCore/Lib/Utils/Accessibility
 */

let liveRegionElement: HTMLElement | null = null;

/**
 * Dynamically announces a status or message to assistive technologies (screen readers).
 *
 * @param message - Text to announce
 * @param politeness - 'polite' (default) or 'assertive'
 */
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return;

  if (!liveRegionElement) {
    liveRegionElement = document.createElement('div');
    liveRegionElement.setAttribute('id', 'aura-a11y-live-region');
    liveRegionElement.setAttribute('aria-live', politeness);
    liveRegionElement.setAttribute('aria-atomic', 'true');
    liveRegionElement.style.position = 'absolute';
    liveRegionElement.style.width = '1px';
    liveRegionElement.style.height = '1px';
    liveRegionElement.style.padding = '0';
    liveRegionElement.style.overflow = 'hidden';
    liveRegionElement.style.clip = 'rect(0, 0, 0, 0)';
    liveRegionElement.style.whiteSpace = 'nowrap';
    liveRegionElement.style.border = '0';
    document.body.appendChild(liveRegionElement);
  }

  liveRegionElement.setAttribute('aria-live', politeness);
  liveRegionElement.textContent = '';
  setTimeout(() => {
    if (liveRegionElement) {
      liveRegionElement.textContent = message;
    }
  }, 50);
}

/**
 * Safely focuses an HTML element by ID or element reference with scroll option.
 */
export function focusElement(target: string | HTMLElement | null, preventScroll = false): boolean {
  if (!target || typeof document === 'undefined') return false;

  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (element) {
    element.focus({ preventScroll });
    return true;
  }
  return false;
}
