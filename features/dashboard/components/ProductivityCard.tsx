'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui';

const hours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];
const values = [20, 45, 80, 65, 90, 75, 55, 40, 25];

export function ProductivityCard() {
  const maxVal = Math.max(...values);

  return (
    <GlassCard
      icon={<Activity className="w-5 h-5" />}
      header="Productivity Pulse"
      className="h-full"
      animated={false}
    >
      <div className="flex items-end justify-between gap-2 h-32 mt-4">
        {values.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full rounded-t-sm origin-bottom"
              style={{
                height: `${(val / maxVal) * 100}%`,
                background: val >= 70
                  ? 'rgba(255,255,255,0.9)'
                  : val >= 40
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.15)',
                boxShadow: val >= 70 ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
              }}
            />
            <span className="text-[10px] text-white/30">{hours[i]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <span className="text-white/40 text-xs">Peak: 2:00 PM</span>
        <span className="text-white/60 text-xs font-mono">Avg: 72%</span>
      </div>
    </GlassCard>
  );
}
