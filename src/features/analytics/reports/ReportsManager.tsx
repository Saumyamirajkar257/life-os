/**
 * @file ReportsManager.tsx
 * @description Executive Report Generator creating structured Daily, Weekly, Monthly, and Year Reviews.
 * @module Features/Analytics/Reports
 */

import React, { useState } from 'react';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { FileText, Download, Plus, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export const ReportsManager: React.FC = () => {
  const { reports, activeReportType, setActiveReportType, generateReport } = useAnalyticsStore();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports[0]?.id || null);

  const reportTypes = [
    { id: 'daily', label: 'Daily Brief' },
    { id: 'weekly', label: 'Weekly Synthesis' },
    { id: 'monthly', label: 'Monthly Executive' },
    { id: 'yearly', label: 'Year Review' },
  ] as const;

  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-6">Executive Reports</h2>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">Comprehensive holistic summaries and PDF export generators.</p>
          </div>

          {/* Report Type Selector & Generator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[var(--color-background)] p-1 rounded-xl border border-[var(--color-border)] overflow-x-auto">
              {reportTypes.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => setActiveReportType(rt.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeReportType === rt.id 
                      ? 'bg-[var(--color-surface-elevated)] text-white shadow-sm border border-[var(--color-border)]' 
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] border border-transparent'
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const rep = generateReport(activeReportType);
                setSelectedReportId(rep.id);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Generate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Generated Reports List */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">Available Reports</h4>
            {reports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  selectedReportId === r.id
                    ? 'bg-[var(--color-surface-elevated)] border-[var(--color-accent)] shadow-md'
                    : 'bg-[var(--color-background)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold flex items-center gap-2 ${selectedReportId === r.id ? 'text-white' : 'text-slate-300'}`}>
                    <FileText className={`w-4 h-4 ${selectedReportId === r.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'}`} />
                    {r.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)]">{r.periodLabel}</p>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] capitalize">
                    {r.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detailed Report Viewer */}
          {currentReport ? (
            <div className="md:col-span-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{currentReport.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{currentReport.periodLabel}</p>
                  </div>

                  <button
                    onClick={() => alert(`Exporting ${currentReport.title} as PDF...`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-white text-xs font-semibold border border-[var(--color-border)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>

                {/* Summary Paragraph */}
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl mb-8">
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {currentReport.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {/* Top Achievements */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Accomplishments
                    </h4>
                    <ul className="space-y-3">
                      {currentReport.topAchievements.map((ach, idx) => (
                        <li key={idx} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Warnings */}
                  {currentReport.keyWarnings.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" /> Sector Warnings
                      </h4>
                      <ul className="space-y-3">
                        {currentReport.keyWarnings.map((warn, idx) => (
                          <li key={idx} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-4 bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl mb-8">
                  <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Strategic Next Steps
                  </h4>
                  <ul className="space-y-3">
                    {currentReport.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Metrics Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-border)]">
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">Score</span>
                  <span className="text-xl font-black text-white">{currentReport.metrics.lifeScoreAvg}</span>
                </div>
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">Tasks</span>
                  <span className="text-xl font-black text-white">{currentReport.metrics.tasksCompleted}</span>
                </div>
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">Habits</span>
                  <span className="text-xl font-black text-white">{currentReport.metrics.habitsRate}%</span>
                </div>
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">Focus</span>
                  <span className="text-xl font-black text-white">{currentReport.metrics.focusHours}h</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-8 bg-[var(--color-background)] border border-[var(--color-border)] border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <FileText className="w-10 h-10 text-[var(--color-text-tertiary)] mb-4" />
              <p className="text-[var(--color-text-secondary)] font-medium">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
