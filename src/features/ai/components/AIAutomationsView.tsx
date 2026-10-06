/**
 * @file AIAutomationsView.tsx
 * @description Background Automation Triggers (Daily Brief, Morning Summary, Evening Reflection, Weekly Review, Monthly Report).
 * @module AuraAI/Components
 */

import React from 'react';
import { Clock, Zap, CheckCircle2, Play } from 'lucide-react';
import { useAIWorkflows } from '../hooks/useAIWorkflows';

export const AIAutomationsView: React.FC = () => {
  const { runWorkflow } = useAIWorkflows();

  const automations = [
    { title: 'Morning Briefing (08:00 AM)', desc: 'Synthesizes today’s focus, calendar events, and top priority tasks automatically.', wf: 'plan_my_day' },
    { title: 'Evening Habit Audit (21:00 PM)', desc: 'Checks incomplete habits and logs streak warnings.', wf: 'review_habits' },
    { title: 'Sunday Weekly Review', desc: 'Prepares a weekly velocity score, budget breakdown, and top goal milestones.', wf: 'review_my_week' },
    { title: 'Monthly Financial Audit', desc: 'Evaluates net worth growth, budget categories, and savings goals.', wf: 'analyze_spending' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
          <Clock className="w-4 h-4" /> Automation Engine
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Scheduled OS Triggers</h2>
        <p className="text-xs text-slate-400">
          Configure background automated triggers for daily briefings, habit audits, and financial reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((a, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> {a.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
            </div>
            <button
              onClick={() => runWorkflow(a.wf as any)}
              className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400" /> Test Trigger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
