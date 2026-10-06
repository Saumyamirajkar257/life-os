/**
 * @file DomainScoreCards.tsx
 * @description Interactive cards for all 10 life domains displaying current scores, deltas, and explicit WHY explanations.
 * @module Features/Analytics/Widgets
 */

import React, { useState } from 'react';
import { useLifeScore } from '../hooks/useLifeScore';
import { DomainType } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  Brain,
  HeartPulse,
  DollarSign,
  Target,
  Zap,
  BookOpen,
  Smile,
  Shield,
  X,
  ArrowRight
} from 'lucide-react';

export const DomainScoreCards: React.FC = () => {
  const { domainScores } = useLifeScore();
  const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case 'productivity': return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
      case 'consistency': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'health': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'finance': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'goals': return <Target className="w-5 h-5 text-indigo-400" />;
      case 'habits': return <Shield className="w-5 h-5 text-purple-400" />;
      case 'focus': return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-teal-400" />;
      case 'mood': return <Smile className="w-5 h-5 text-violet-400" />;
      case 'wellbeing': return <HeartPulse className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getStatusText = (score: number, change: number) => {
    if (score >= 80) return "Strong";
    if (score >= 60 && change > 0) return "Improving";
    if (score >= 60) return "Stable";
    return "Needs attention";
  };

  const selectedData = domainScores.find(d => d.domain === selectedDomain);

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-6">Life Areas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {domainScores.map((ds) => {
          const isPositive = ds.change >= 0;
          const status = getStatusText(ds.score, ds.change);

          return (
            <div
              key={ds.domain}
              onClick={() => setSelectedDomain(ds.domain)}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-5 transition-all cursor-pointer flex flex-col justify-between hover:border-[var(--color-border-hover)] hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] group-hover:border-[var(--color-border-hover)] transition-colors">
                    {getDomainIcon(ds.domain)}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                    isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? `+${ds.change}` : ds.change}%
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-sm font-bold text-white">{ds.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{ds.score}</span>
                    <span className="text-xs font-medium text-[var(--color-text-tertiary)]">{status}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[var(--color-background)] rounded-full h-1.5 overflow-hidden border border-[var(--color-border)]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${ds.score}%`, backgroundColor: ds.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain Detail Drawer / Modal */}
      {selectedDomain && selectedData && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedDomain(null)}>
          <div 
            className="w-full max-w-md h-full bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl p-6 sm:p-8 flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                  {getDomainIcon(selectedData.domain)}
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">{selectedData.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedDomain(null)}
                className="p-2 rounded-full hover:bg-[var(--color-background)] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2">
              {/* Score Header */}
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Domain Score</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-white">{selectedData.score}</span>
                    <span className={`flex items-center gap-1 text-sm font-bold ${selectedData.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedData.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(selectedData.change)}%
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-4 transform rotate-45"
                    style={{ 
                      borderColor: selectedData.color, 
                      borderLeftColor: 'transparent', 
                      borderBottomColor: 'transparent' 
                    }}
                  />
                  <span className="text-sm font-bold text-white">{selectedData.score}</span>
                </div>
              </div>

              {/* Contributing Metrics */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Analysis</h3>
                <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-5">
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {selectedData.explanation}
                  </p>
                </div>
              </div>

              {/* What improved & declined (Mocked realistically based on change) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-emerald-400 mb-2">What's helping</h4>
                  <ul className="text-xs text-[var(--color-text-secondary)] space-y-1.5 list-disc pl-3">
                    {selectedData.change >= 0 ? <li>Recent consistent activity</li> : <li>Baseline stability</li>}
                    <li>Engagement with module</li>
                  </ul>
                </div>
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-rose-400 mb-2">What's holding you back</h4>
                  <ul className="text-xs text-[var(--color-text-secondary)] space-y-1.5 list-disc pl-3">
                    {selectedData.change < 0 ? <li>Recent drop in activity</li> : <li>Lack of stretch goals</li>}
                    <li>Inconsistent tracking</li>
                  </ul>
                </div>
              </div>

              {/* Recommended Next Action */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Next Best Action</h3>
                <button className="w-full flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/20 rounded-2xl transition-colors group">
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-indigo-300 mb-1">Recommendation</span>
                    <span className="block text-sm font-medium text-white">Review {selectedData.title} Dashboard</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
