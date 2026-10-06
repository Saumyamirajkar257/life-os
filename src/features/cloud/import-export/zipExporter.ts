/**
 * Zip Exporter & PDF Report Generator Engine
 */

import { ExportOptions } from '../types/cloudTypes';

export class ZipExporter {
  public static exportZipPackage(data: Record<string, any>, options: ExportOptions): Blob {
    // Generates a composite JSON container representing the ZIP backup archive
    const zipManifest = {
      manifestVersion: '1.0',
      exportedAt: new Date().toISOString(),
      domainsIncluded: options.domains,
      data,
    };
    const jsonString = JSON.stringify(zipManifest, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  public static generatePdfReport(data: Record<string, any>, options: ExportOptions): string {
    const reportDate = new Date().toLocaleDateString();
    let text = `====================================================\n`;
    text += `          AURA LIFE OS — SYSTEM EXPORT REPORT       \n`;
    text += `====================================================\n`;
    text += `Date: ${reportDate}\n`;
    text += `Domains Included: ${options.domains.join(', ')}\n\n`;

    options.domains.forEach((dom) => {
      const items = data[dom] || [];
      text += `--- ${dom.toUpperCase()} (${items.length} records) ---\n`;
      items.slice(0, 10).forEach((item: any) => {
        text += `• [${item.id}] ${item.title || item.name || item.amount || 'Record'}\n`;
      });
      if (items.length > 10) {
        text += `... and ${items.length - 10} more records.\n`;
      }
      text += `\n`;
    });

    return text;
  }
}
