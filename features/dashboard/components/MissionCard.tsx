'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { GlassCard, Badge, ProgressBar } from '@/components/ui';
import { useAIStore } from '@/store/useAIStore';

export function MissionCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { goals } = useAIStore();

  if (!mounted) {
    return (
      <GlassCard
        icon={<Zap className="w-5 h-5" />}
        header="Current Mission"
        className="h-full"
        animated={false}
      >
        <div className="h-[120px] flex items-center justify-center text-white/30 text-xs font-mono">
          Loading mission data...
        </div>
      </GlassCard>
    );
  }

  // Find first active/uncompleted goal or default
  const activeMission = goals[0] || {
    name: 'Establish Core System Objectives',
    progress: 84,
    timeline: 'Ongoing',
  };

  const isCompleted = activeMission.progress === 100;

  return (
    <GlassCard
      icon={<Zap className="w-5 h-5" />}
      header="Current Mission"
      className="h-full"
      animated={false}
    >
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-lg font-bold text-white truncate">{activeMission.name}</h2>
        <Badge variant={isCompleted ? 'default' : 'glow'} className="shrink-0">
          {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
        </Badge>
      </div>
      <p className="text-white/40 text-xs mb-6 font-mono uppercase tracking-wider">
        Timeline: {activeMission.timeline}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/50 font-mono uppercase">Progress</span>
          <span className="text-white/70 font-mono">{activeMission.progress}%</span>
        </div>
        <ProgressBar value={activeMission.progress} />
      </div>
    </GlassCard>
  );
}
