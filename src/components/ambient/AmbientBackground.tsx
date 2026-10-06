import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'auto';

interface Props {
  timeOverride?: TimeOfDay;
  showParticles?: boolean;
  intensity?: 'subtle' | 'vibrant' | 'minimal';
}

export const AmbientBackground: React.FC<Props> = ({
  timeOverride = 'auto',
  showParticles = true,
  intensity = 'subtle',
}) => {
  const [activePeriod, setActivePeriod] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('evening');

  useEffect(() => {
    if (timeOverride !== 'auto') {
      setActivePeriod(timeOverride);
      return;
    }

    const updateTimePeriod = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setActivePeriod('morning');
      } else if (hour >= 12 && hour < 17) {
        setActivePeriod('afternoon');
      } else if (hour >= 17 && hour < 22) {
        setActivePeriod('evening');
      } else {
        setActivePeriod('night');
      }
    };

    updateTimePeriod();
    const interval = setInterval(updateTimePeriod, 60000);
    return () => clearInterval(interval);
  }, [timeOverride]);

  // Color profiles based on time period
  const themeGradients = {
    morning: {
      primary: 'rgba(251, 146, 60, 0.08)', // Warm Amber Glow
      secondary: 'rgba(20, 184, 166, 0.07)', // Teal
      accent: 'rgba(244, 63, 94, 0.05)', // Dawn Rose
    },
    afternoon: {
      primary: 'rgba(20, 184, 166, 0.09)', // Vibrant Teal
      secondary: 'rgba(56, 189, 248, 0.07)', // Sky Blue
      accent: 'rgba(16, 185, 129, 0.06)', // Emerald
    },
    evening: {
      primary: 'rgba(168, 85, 247, 0.08)', // Violet Twilight
      secondary: 'rgba(20, 184, 166, 0.08)', // Teal
      accent: 'rgba(99, 102, 241, 0.06)', // Indigo
    },
    night: {
      primary: 'rgba(15, 23, 42, 0.12)', // Slate Midnight
      secondary: 'rgba(20, 184, 166, 0.05)', // Deep Teal
      accent: 'rgba(30, 41, 59, 0.10)', // Dark Slate
    },
  };

  const currentGradient = themeGradients[activePeriod];
  const opacityMultiplier = intensity === 'vibrant' ? 1.6 : intensity === 'minimal' ? 0.5 : 1.0;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Animated Gradient Mesh Layer */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px]"
        style={{
          background: `radial-gradient(circle, ${currentGradient.primary} 0%, transparent 70%)`,
          opacity: opacityMultiplier,
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[65vw] h-[65vw] rounded-full blur-[150px]"
        style={{
          background: `radial-gradient(circle, ${currentGradient.secondary} 0%, transparent 70%)`,
          opacity: opacityMultiplier,
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.92, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-[35%] left-[30%] w-[45vw] h-[45vw] rounded-full blur-[160px]"
        style={{
          background: `radial-gradient(circle, ${currentGradient.accent} 0%, transparent 70%)`,
          opacity: opacityMultiplier * 0.8,
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle Noise Texture overlay to prevent color banding */}
      <div
        className="absolute inset-0 opacity-[0.018] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Optional Particle Glow Highlights */}
      {showParticles && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-teal-400 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-3/4 left-2/3 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-teal-300 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
        </div>
      )}
    </div>
  );
};
