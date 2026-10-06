/**
 * Aura WCAG Contrast & Accessibility Auditor
 */

export interface AccessibilityAuditResult {
  score: number;
  wcagLevel: 'AAA' | 'AA' | 'NON_COMPLIANT';
  issues: {
    selector: string;
    issue: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    recommendation: string;
  }[];
  timestamp: string;
}

export class WcagChecker {
  public static runAudit(): AccessibilityAuditResult {
    const issues: AccessibilityAuditResult['issues'] = [];

    // Check 1: Image Alt Attributes
    const images = document.querySelectorAll('img');
    images.forEach((img, idx) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          selector: `img[index=${idx}]`,
          issue: 'Image missing alt attribute',
          impact: 'serious',
          recommendation: 'Add alt="" for decorative images or alt="description" for content images.',
        });
      }
    });

    // Check 2: Interactive Controls Accessibility Labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      const hasText = (btn.textContent || '').trim().length > 0;
      const hasAriaLabel = btn.hasAttribute('aria-label') || btn.hasAttribute('aria-labelledby');
      if (!hasText && !hasAriaLabel) {
        issues.push({
          selector: `button[index=${idx}]`,
          issue: 'IconButton lacks accessible name',
          impact: 'critical',
          recommendation: 'Add aria-label="..." to icon buttons.',
        });
      }
    });

    // Check 3: Form Input Labels
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach((input, idx) => {
      const hasId = input.hasAttribute('id');
      const hasLabel = hasId && !!document.querySelector(`label[for="${input.getAttribute('id')}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      if (!hasLabel && !hasAriaLabel) {
        issues.push({
          selector: `input[index=${idx}]`,
          issue: 'Form input missing linked <label> or aria-label',
          impact: 'serious',
          recommendation: 'Associate input with an explicit <label for="..."> or aria-label.',
        });
      }
    });

    const criticalCount = issues.filter((i) => i.impact === 'critical').length;
    const seriousCount = issues.filter((i) => i.impact === 'serious').length;

    let wcagLevel: AccessibilityAuditResult['wcagLevel'] = 'AAA';
    let score = 100;

    if (criticalCount > 0) {
      wcagLevel = 'NON_COMPLIANT';
      score = Math.max(50, 100 - criticalCount * 15 - seriousCount * 5);
    } else if (seriousCount > 0) {
      wcagLevel = 'AA';
      score = Math.max(80, 100 - seriousCount * 4);
    }

    return {
      score,
      wcagLevel,
      issues,
      timestamp: new Date().toISOString(),
    };
  }
}
