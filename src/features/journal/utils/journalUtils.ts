/**
 * @file journalUtils.ts
 * @description Helper functions for text analytics, reading time, markdown generation, and data formatting.
 * @module Features/Journal/Utils
 */

import { JournalEntry, NoteItem } from '../types/journal.types';

/**
 * Calculates total word count from plain text or HTML string
 */
export const calculateWordCount = (text: string): number => {
  if (!text) return 0;
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).filter(Boolean).length;
};

/**
 * Calculates estimated reading time in minutes (based on 200 wpm)
 */
export const calculateReadingTime = (wordCount: number): number => {
  if (wordCount <= 0) return 1;
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * Extracts plain text snippet from HTML or Markdown content
 */
export const extractSnippet = (content: string, maxLength = 160): string => {
  if (!content) return '';
  const clean = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.substring(0, maxLength).trim()}...`;
};

/**
 * Converts HTML content to Markdown for export
 */
export const convertHtmlToMarkdown = (html: string): string => {
  if (!html) return '';
  let md = html;
  md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
  md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<ul>(.*?)<\/ul>/gi, '$1\n');
  md = md.replace(/<ol>(.*?)<\/ol>/gi, '$1\n');
  md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<[^>]*>/g, '');
  return md.trim();
};

/**
 * Generates export text file content (Markdown or Plain Text)
 */
export const generateExportContent = (
  item: JournalEntry | NoteItem,
  format: 'markdown' | 'json' | 'text'
): { filename: string; content: string; mimeType: string } => {
  const safeTitle = (item.title || 'Untitled').replace(/[^a-zA-Z0-9_\-]/g, '_');

  if (format === 'json') {
    return {
      filename: `${safeTitle}.json`,
      content: JSON.stringify(item, null, 2),
      mimeType: 'application/json',
    };
  }

  const markdownBody = convertHtmlToMarkdown(item.content);

  if (format === 'markdown') {
    const isJournal = 'mood' in item;
    const header = [
      `# ${item.title || 'Untitled'}`,
      `*Created: ${item.createdAt}*`,
      isJournal ? `*Mood: ${(item as JournalEntry).mood} | Energy: ${(item as JournalEntry).energyLevel}/5*` : null,
      item.tags.length > 0 ? `*Tags: ${item.tags.map((t) => `#${t}`).join(' ')}*` : null,
      `---`,
      '',
      markdownBody,
    ]
      .filter((line) => line !== null)
      .join('\n');

    return {
      filename: `${safeTitle}.md`,
      content: header,
      mimeType: 'text/markdown',
    };
  }

  // Plain Text format
  const plainBody = markdownBody.replace(/[*#>`]/g, '');
  const textContent = `${item.title}\nDate: ${item.createdAt}\n\n${plainBody}`;
  return {
    filename: `${safeTitle}.txt`,
    content: textContent,
    mimeType: 'text/plain',
  };
};

/**
 * Trigger browser file download
 */
export const triggerDownload = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
