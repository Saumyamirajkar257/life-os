/**
 * Import & Export Service Façade
 */

import { ImportPayload, ImportResult, ExportOptions } from '../types/cloudTypes';
import { JSONParser } from '../import-export/jsonParser';
import { CSVParser } from '../import-export/csvParser';
import { MarkdownParser } from '../import-export/markdownParser';
import { ZipExporter } from '../import-export/zipExporter';

export class ImportExportService {
  public static async parseImport(payload: ImportPayload): Promise<ImportResult> {
    switch (payload.source) {
      case 'json':
        return JSONParser.parse(payload);
      case 'csv':
        return CSVParser.parse(payload);
      case 'markdown':
      case 'txt':
        return MarkdownParser.parse(payload);
      default:
        // Fallback or external placeholders
        return JSONParser.parse(payload);
    }
  }

  public static exportData(data: Record<string, any>, options: ExportOptions): { filename: string; content: string | Blob; mimeType: string } {
    const timestamp = new Date().toISOString().split('T')[0];

    if (options.format === 'json') {
      const filtered: Record<string, any> = {};
      options.domains.forEach((dom) => {
        if (data[dom]) filtered[dom] = data[dom];
      });
      return {
        filename: `aura_export_${timestamp}.json`,
        content: JSON.stringify(filtered, null, 2),
        mimeType: 'application/json',
      };
    }

    if (options.format === 'csv') {
      const primaryDomain = options.domains[0] || 'tasks';
      const items = data[primaryDomain] || [];
      if (items.length === 0) {
        return {
          filename: `aura_${primaryDomain}_${timestamp}.csv`,
          content: 'id,title,status,createdAt\n',
          mimeType: 'text/csv',
        };
      }
      const keys = Object.keys(items[0]).filter((k) => typeof items[0][k] !== 'object');
      let csv = keys.join(',') + '\n';
      items.forEach((item: any) => {
        csv += keys.map((k) => `"${String(item[k] ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
      });
      return {
        filename: `aura_${primaryDomain}_${timestamp}.csv`,
        content: csv,
        mimeType: 'text/csv',
      };
    }

    if (options.format === 'pdf_report') {
      const report = ZipExporter.generatePdfReport(data, options);
      return {
        filename: `aura_executive_report_${timestamp}.txt`,
        content: report,
        mimeType: 'text/plain',
      };
    }

    if (options.format === 'zip_backup') {
      const blob = ZipExporter.exportZipPackage(data, options);
      return {
        filename: `aura_full_backup_${timestamp}.aura.zip`,
        content: blob,
        mimeType: 'application/zip',
      };
    }

    // Default JSON
    return {
      filename: `aura_export_${timestamp}.json`,
      content: JSON.stringify(data, null, 2),
      mimeType: 'application/json',
    };
  }
}
