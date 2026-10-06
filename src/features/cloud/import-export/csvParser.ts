/**
 * CSV Data Parser for Aura Cloud Import
 */

import { ImportPayload, ImportResult } from '../types/cloudTypes';

export class CSVParser {
  public static parse(payload: ImportPayload): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const records: Record<string, any>[] = [];

    const lines = payload.rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        errors: ['CSV file must contain a header line and at least one data row'],
        warnings: [],
        records: [],
      };
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] !== undefined ? values[idx] : '';
      });

      if (!obj.id) obj.id = `imported_csv_${Date.now()}_${i}`;
      if (!obj.title && obj.name) obj.title = obj.name;

      records.push(obj);
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
