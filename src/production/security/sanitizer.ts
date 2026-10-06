/**
 * Aura Production Input Sanitizer & XSS Protection
 */

export class AuraSanitizer {
  /**
   * Sanitizes string to prevent XSS attacks when embedding user text into innerHTML or attributes
   */
  public static sanitizeHtml(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitizes structured user input before database submission or storage
   */
  public static sanitizeInput<T extends Record<string, unknown>>(data: T): T {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHtml(value.trim());
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeInput(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized as T;
  }

  /**
   * Validates URLs to prevent javascript: or unsafe protocol injections
   */
  public static validateSafeUrl(url: string): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url, window.location.origin);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}
