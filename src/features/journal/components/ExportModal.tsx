/**
 * @file ExportModal.tsx
 * @description Export document dialog for saving Journal or Note items to Markdown, JSON, or Plain Text.
 * @module Features/Journal/Components
 */

import React, { useState } from 'react';
import { Download, FileText, Code, FileCode, X, Check } from 'lucide-react';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';
import { generateExportContent, triggerDownload } from '../utils/journalUtils';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, closeExportModal, selectedEntryId, selectedEntryType } =
    useJournalUIStore();

  const { journals, notes } = useJournalStore();

  const [exportFormat, setExportFormat] = useState<'markdown' | 'json' | 'text'>('markdown');

  if (!isExportModalOpen || !selectedEntryId) return null;

  const activeItem =
    selectedEntryType === 'journal'
      ? journals.find((j) => j.id === selectedEntryId)
      : notes.find((n) => n.id === selectedEntryId);

  if (!activeItem) return null;

  const handleExecuteExport = () => {
    const { filename, content, mimeType } = generateExportContent(activeItem, exportFormat);
    triggerDownload(filename, content, mimeType);
    closeExportModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Export Knowledge Entry</h3>
              <p className="text-xs text-slate-400">Save local file to your machine.</p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-300">Select Export Format</span>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setExportFormat('markdown')}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                exportFormat === 'markdown'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-5 h-5 text-purple-400" />
              <span>Markdown (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('json')}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                exportFormat === 'json'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-5 h-5 text-blue-400" />
              <span>JSON (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('text')}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                exportFormat === 'text'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Plain Text (.txt)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={closeExportModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteExport}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
