/**
 * Data Validation Engine for Aura Cloud Sync
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Validate a single entity against basic schema requirements
   */
  public static validateEntity(collection: string, data: Record<string, any>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Invalid object payload'], warnings: [] };
    }

    if (!data.id || typeof data.id !== 'string') {
      errors.push('Entity missing valid "id" string');
    }

    // Collection specific checks
    switch (collection) {
      case 'tasks':
        if (!data.title || typeof data.title !== 'string') errors.push('Task missing title string');
        if (data.title && data.title.length > 200) errors.push('Task title exceeds 200 characters');
        break;

      case 'habits':
        if (!data.name || typeof data.name !== 'string') errors.push('Habit missing name string');
        break;

      case 'goals':
        if (!data.title || typeof data.title !== 'string') errors.push('Goal missing title string');
        break;

      case 'transactions':
        if (typeof data.amount !== 'number') errors.push('Transaction missing numeric amount');
        if (!data.type) errors.push('Transaction missing type');
        break;

      case 'journals':
      case 'notes':
        if (!data.title && !data.content) warnings.push('Journal entry is empty');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize an entity payload before cloud write
   */
  public static sanitizePayload(data: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    Object.keys(data).forEach((key) => {
      const val = data[key];
      // Exclude functions and undefined values
      if (typeof val !== 'function' && val !== undefined) {
        clean[key] = val;
      }
    });
    return clean;
  }
}
