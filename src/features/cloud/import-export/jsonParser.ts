/**
 * JSON Data Parser for Aura Cloud Import
 */

import { ImportPayload, ImportResult } from '../types/cloudTypes';

export class JSONParser {
  public static parse(payload: ImportPayload): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: Record<string, any>[] = [];

    try {
      const parsed = JSON.parse(payload.rawContent);
      if (Array.isArray(parsed)) {
        records = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // If master export payload
        if (parsed.data && typeof parsed.data === 'object') {
          records = parsed.data[payload.targetDomain] || [parsed];
        } else {
          records = [parsed];
        }
      } else {
        errors.push('JSON root must be an object or array of items');
      }
    } catch (err) {
      errors.push(`JSON Syntax Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    return {
      success: errors.length === 0,
      importedCount: records.length,
      skippedCount: 0,
      errors,
      warnings,
      records,
    };
  }
}
