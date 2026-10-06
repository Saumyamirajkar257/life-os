/**
 * @file LifeScoreRadarChart.tsx
 * @description Interactive Radar chart displaying multi-domain equilibrium across all 10 life domains.
 * @module Features/Analytics/Charts
 */

import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useLifeScore } from '../hooks/useLifeScore';

export const LifeScoreRadarChart: React.FC = () => {
  const { domainScores } = useLifeScore();

  const data = domainScores.map((ds) => ({
    subject: ds.title,
    score: ds.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-72 sm:h-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100">10-Domain Balance Radar</h3>
          <p className="text-[11px] text-slate-400">Holistic life equilibrium score map</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Equilibrium View
        </span>
      </div>

      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#CBD5E1' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
            <Radar name="Life Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.35} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#34D399' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
