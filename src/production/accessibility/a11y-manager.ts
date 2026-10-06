/**
 * Aura Accessibility Manager & Screen Reader Announcer Service
 */

import { logger } from '../logging/logger';

class AccessibilityManager {
  private announcerElement: HTMLDivElement | null = null;

  constructor() {
    this.initAnnouncer();
  }

  private initAnnouncer() {
    if (typeof document === 'undefined') return;
    let announcer = document.getElementById('aura-a11y-announcer') as HTMLDivElement;
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aura-a11y-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0 whitespace-nowrap';
      document.body.appendChild(announcer);
    }
    this.announcerElement = announcer;
  }

  /**
   * Announces dynamic content updates to screen readers politely or assertively
   */
  public announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
    if (!this.announcerElement) this.initAnnouncer();
    if (this.announcerElement) {
      this.announcerElement.setAttribute('aria-live', politeness);
      this.announcerElement.textContent = message;
      logger.info('A11y', `Screen Reader Announcement (${politeness}): "${message}"`);
    }
  }

  /**
   * Enforces focus trap within modal dialogs or drawers for keyboard accessibility
   */
  public trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="checkbox"], input[type="radio"], select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
}

export const a11y = new AccessibilityManager();
