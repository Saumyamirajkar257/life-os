import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RobotPetProps {
  level: number;
  mood: 'happy' | 'neutral' | 'sleepy' | 'excited' | 'thinking';
  size?: 'sm' | 'lg';
}

export function RobotPet({ level, mood, size = 'sm' }: RobotPetProps) {
  // Customize colors based on pet level
  const baseColor = level > 8 ? '#d946ef' : level > 5 ? '#a855f7' : level > 3 ? '#3b82f6' : '#10b981';
  const glowColor = level > 8 ? 'rgba(217,70,239,0.6)' : level > 5 ? 'rgba(168,85,247,0.5)' : level > 3 ? 'rgba(59,130,246,0.5)' : 'rgba(16,185,129,0.5)';
  
  // Custom bounce heights based on mood
  const bounceY = mood === 'excited' ? [0, -12, 0] : mood === 'sleepy' ? [0, 3, 0] : mood === 'thinking' ? [0, -2, 2, -2, 0] : [0, -6, 0];
  const bounceDuration = mood === 'excited' ? 0.6 : mood === 'sleepy' ? 4 : mood === 'thinking' ? 3 : 2.4;

  const isLarge = size === 'lg';
  const baseSize = isLarge ? 'w-24 h-24' : 'w-14 h-14';

  return (
    <motion.div
      animate={{ y: bounceY }}
      transition={{ duration: bounceDuration, repeat: Infinity, ease: 'easeInOut' }}
      className={cn("relative flex items-center justify-center select-none", baseSize)}
    >
      <svg className="w-full h-full overflow-visible animate-glow-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`glow-${level}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={baseColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
          </radialGradient>
          <filter id={`shadow-${level}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={baseColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Ambient Outer Glow Field */}
        <circle cx="50" cy="50" r="45" fill={`url(#glow-${level})`} />

        {/* Hovering Ring underneath the robot body */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: mood === 'excited' ? 2.5 : 10, repeat: Infinity, ease: "linear" }}
          style={{ originX: '50px', originY: '78px' }}
        >
          <ellipse cx="50" cy="78" rx="20" ry="5" stroke={baseColor} strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7" />
          <circle cx="30" cy="78" r="2.5" fill={baseColor} />
          <circle cx="70" cy="78" r="2.5" fill={baseColor} />
        </motion.g>

        {/* Core propulsion glow */}
        <motion.ellipse
          cx="50"
          cy="78"
          rx="12"
          ry="3"
          fill={baseColor}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: '50px', originY: '78px' }}
        />

        {/* Antenna */}
        <g>
          <line x1="50" y1="28" x2="50" y2="15" stroke="#52525b" strokeWidth="2.5" />
          <motion.circle
            cx="50"
            cy="15"
            r={mood === 'excited' ? 4 : 3.5}
            fill={baseColor}
            filter={`url(#shadow-${level})`}
            animate={mood === 'excited' ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] } : mood === 'sleepy' ? { opacity: [0.3, 0.7, 0.3] } : { scale: [1, 1.15, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </g>

        {/* Floating ears */}
        <motion.g
          animate={{ y: mood === 'excited' ? [-2, 2, -2] : [-1, 1, -1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Left ear */}
          <path d="M22 34 C18 34 16 38 18 44 C20 48 24 48 24 48 Z" fill="#18181b" stroke={baseColor} strokeWidth="1.5" />
          <circle cx="20" cy="40" r="1.5" fill={baseColor} />
          
          {/* Right ear */}
          <path d="M78 34 C82 34 84 38 82 44 C80 48 76 48 76 48 Z" fill="#18181b" stroke={baseColor} strokeWidth="1.5" />
          <circle cx="80" cy="40" r="1.5" fill={baseColor} />
        </motion.g>

        {/* Torso/Main body */}
        <rect x="36" y="52" width="28" height="18" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2.5" />
        {/* Core Heart / Reactor */}
        <motion.circle
          cx="50"
          cy="61"
          r="4.5"
          fill={baseColor}
          animate={mood === 'excited' ? { scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] } : { opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        {/* Connection neck */}
        <rect x="46" y="47" width="8" height="6" fill="#3f3f46" rx="1" />

        {/* Head */}
        <rect x="28" y="22" width="44" height="28" rx="9" fill="#27272a" stroke="#52525b" strokeWidth="2.5" />
        
        {/* Screen overlay */}
        <rect x="32" y="26" width="36" height="20" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />

        {/* Mood dependent eyes */}
        {mood === 'happy' && (
          <g>
            <path d="M36 37 C 39 31, 44 37, 44 37" stroke={baseColor} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M56 37 C 59 31, 64 37, 64 37" stroke={baseColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}
        {mood === 'excited' && (
          <g>
            {/* Spinning glowing stars */}
            <motion.polygon
              points="40,30 42,34 46,34 43,36 44,40 40,38 36,40 37,36 34,34 38,34"
              fill={baseColor}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: '40px', originY: '35px' }}
            />
            <motion.polygon
              points="60,30 62,34 66,34 63,36 64,40 60,38 56,40 57,36 54,34 58,34"
              fill={baseColor}
              animate={{ rotate: -360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: '60px', originY: '35px' }}
            />
          </g>
        )}
        {mood === 'sleepy' && (
          <g opacity="0.75">
            <line x1="36" y1="36" x2="44" y2="36" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="56" y1="36" x2="64" y2="36" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {mood === 'thinking' && (
          <g>
            <circle cx="40" cy="35" r="4.5" fill="white" />
            <motion.circle
              cx="40" cy="35" r="2.5"
              fill="black"
              animate={{ cx: [38, 42, 38] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="60" cy="35" r="4.5" fill="white" />
            <motion.circle
              cx="60" cy="35" r="2.5"
              fill="black"
              animate={{ cx: [58, 62, 58] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        )}
        {mood === 'neutral' && (
          <g>
            <motion.ellipse
              cx="40" cy="35" rx="4" ry="4"
              fill={baseColor}
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
              style={{ originX: '40px', originY: '35px' }}
            />
            <motion.ellipse
              cx="60" cy="35" rx="4" ry="4"
              fill={baseColor}
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
              style={{ originX: '60px', originY: '35px' }}
            />
          </g>
        )}

        {/* Mouth styles */}
        {mood === 'happy' && (
          <path d="M43 42 Q50 48 57 42" stroke={baseColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
        {mood === 'excited' && (
          <path d="M43 42 Q50 49 57 42" stroke={baseColor} strokeWidth="2.5" strokeLinecap="round" fill={baseColor} />
        )}
        {mood === 'sleepy' && (
          <circle cx="50" cy="43" r="2" fill={baseColor} />
        )}
        {mood === 'thinking' && (
          <line x1="45" y1="43" x2="55" y2="43" stroke={baseColor} strokeWidth="2" strokeLinecap="round" />
        )}
        {mood === 'neutral' && (
          <line x1="46" y1="43" x2="54" y2="43" stroke={baseColor} strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Status indicator scanning dots */}
        {mood === 'thinking' && (
          <motion.circle
            cx="50"
            cy="26"
            r="1.5"
            fill={baseColor}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Sleeping elements */}
      {mood === 'sleepy' && (
        <motion.div
          className="absolute -top-3 right-0 text-[10px] text-blue-300 font-mono font-bold select-none"
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0, 0.95, 0], y: [0, -12, -24] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          Zzz
        </motion.div>
      )}
    </motion.div>
  );
}
