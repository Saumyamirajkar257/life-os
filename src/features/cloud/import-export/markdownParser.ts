/**
 * Markdown & TXT Parser for Journal Notes & Tasks
 */

import { ImportPayload, ImportResult } from '../types/cloudTypes';

export class MarkdownParser {
  public static parse(payload: ImportPayload): ImportResult {
    const records: Record<string, any>[] = [];
    const lines = payload.rawContent.split(/\r?\n/);
    let currentTitle = 'Imported Note';
    let currentContent: string[] = [];

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        if (currentContent.length > 0) {
          records.push({
            id: `imported_md_${Date.now()}_${records.length}`,
            title: currentTitle,
            content: currentContent.join('\n'),
            createdAt: new Date().toISOString(),
          });
          currentContent = [];
        }
        currentTitle = line.replace('# ', '').trim();
      } else {
        currentContent.push(line);
      }
    });

    if (currentContent.length > 0 || records.length === 0) {
      records.push({
        id: `imported_md_${Date.now()}_${records.length}`,
        title: currentTitle,
        content: currentContent.join('\n'),
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      importedCount: records.length,
      skippedCount: 0,
      errors: [],
      warnings: [],
      records,
    };
  }
}
