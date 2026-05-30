'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, SkipForward, Volume2, Sparkles, Trophy, Brain,
  Shield, ShieldAlert, Lock, Unlock, ExternalLink, X 
} from 'lucide-react';
import { pageTransition, fadeInUp } from '@/animations';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/store/useAppStore';
import { useCompanionStore } from '@/store/useCompanionStore';
import { useFocusStore } from '@/store/useFocusStore';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import MultiplayerFocus from '@/components/focus/MultiplayerFocus';

export default function FocusPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusTime, setFocusTime] = useState(25); // 25 mins
  const [breakTime, setBreakTime] = useState(5); // 5 mins
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const soundUrls: Record<string, string> = {
    rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lofi: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    white: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    library: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  };

  // Regain App Features States
  const { userName } = useAppStore();
  const { energyLevel } = useCompanionStore();
  const { strictMode, setStrictMode, blockedSites, toggleBlockSite, updateSiteLimit, currentRoomId, roomMembers } = useFocusStore();
  const [selectedSiteForSim, setSelectedSiteForSim] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Authenticate user state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
        if (bypassed) {
          setUserId('sandbox-user-id');
        } else {
          setUserId(null);
        }
      }
    });
    return () => unsub();
  }, []);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalTime = mode === 'focus' ? focusTime * 60 : breakTime * 60;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            if (mode === 'focus') {
              setCompletedSessions((c) => c + 1);
              setMode('break');
              return breakTime * 60;
            } else {
              setMode('focus');
              return focusTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, focusTime, breakTime]);

  // Adjust time presets on mode change
  useEffect(() => {
    setTimeLeft(mode === 'focus' ? focusTime * 60 : breakTime * 60);
    setIsRunning(false);
  }, [mode, focusTime, breakTime]);

  // Audio Playback effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (activeSound) {
      audio.src = soundUrls[activeSound];
      audio.play().catch(e => console.log("Audio playback deferred for user interaction", e));
    } else {
      audio.pause();
    }
  }, [activeSound]);

  // Volume slider effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Liquid Wave Canvas Animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const radius = circleRadius;
      const centerX = width / 2;
      const centerY = height / 2;

      // Fill level matches timeLeft ratio (1.0 to 0.0)
      const fillLevel = timeLeft / totalTime;

      ctx.save();

      // Clip drawing context to circular Pomodoro face bounds
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.clip();

      // Draw background tint inside timer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fillRect(0, 0, width, height);

      // Waves dynamics
      const waveHeight = isRunning ? 6 : 2;
      const waveSpeed = isRunning ? 0.05 : 0.015;
      const waveFrequency = 0.035;

      phase += waveSpeed;

      const fillY = height - (fillLevel * radius * 2 + (centerY - radius));

      // Draw back wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x++) {
        const y = fillY + Math.sin(x * waveFrequency + phase) * waveHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = mode === 'focus' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(16, 185, 129, 0.12)';
      ctx.fill();

      // Draw front wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x++) {
        const y = fillY + Math.cos(x * waveFrequency - phase + 1.2) * waveHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = mode === 'focus' ? 'rgba(99, 102, 241, 0.22)' : 'rgba(16, 185, 129, 0.22)';
      ctx.fill();

      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [timeLeft, totalTime, isRunning, mode]);

  const progress = useMemo(() => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  }, [timeLeft, totalTime]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [timeLeft]);

  // Circle progress calculation
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (timeLeft / totalTime) * circumference;

  const sounds = [
    { id: 'rain', label: 'Rainforest Rainfall' },
    { id: 'lofi', label: 'Lofi Bedroom Beats' },
    { id: 'white', label: 'White Noise Shimmer' },
    { id: 'library', label: 'Old Library Ambience' },
  ];

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Calibrating focus state...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Brain className="w-8 h-8 text-white/95" />
          <span>Focus Space</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Enter flow state. Eliminate distraction, isolate task, build momentum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Timer Control Card */}
        <div className="md:col-span-2 glass-panel border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 min-h-[380px]">
          {/* Presets Toggle */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => {
                if (strictMode && isRunning) {
                  alert("Strict Mode Active: Focus session is locked until complete!");
                  return;
                }
                setMode('focus');
              }}
              className={cn(
                "px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all",
                mode === 'focus' ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white"
              )}
            >
              Focus Session
            </button>
            <button
              onClick={() => {
                if (strictMode && isRunning) {
                  alert("Strict Mode Active: Focus session is locked until complete!");
                  return;
                }
                setMode('break');
              }}
              className={cn(
                "px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all",
                mode === 'break' ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white"
              )}
            >
              Short Break
            </button>
          </div>

          {/* Radial Countdown Indicator */}
          <div className="relative w-[220px] h-[220px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none"
              width={220}
              height={220}
            />
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 220 220">
              <circle
                className="fill-none stroke-white/5"
                cx="110"
                cy="110"
                r={circleRadius}
                strokeWidth="10"
              />
              <motion.circle
                className="fill-none stroke-white transition-all duration-300"
                cx="110"
                cy="110"
                r={circleRadius}
                strokeWidth="10"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeOffset,
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-bold tracking-tighter text-white">{formattedTime}</span>
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase mt-1 flex items-center gap-1">
                {mode === 'focus' ? 'Focusing' : 'Resting'}
                {strictMode && isRunning && <Lock className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (strictMode && isRunning) return;
                setTimeLeft(totalTime);
                setIsRunning(false);
              }}
              disabled={strictMode && isRunning}
              className="p-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 active:scale-[0.95] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              title={strictMode && isRunning ? "Strict Mode Active: Reset Locked" : "Reset Timer"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={async () => {
                if (strictMode && isRunning) {
                  alert("Strict Mode Active: You cannot pause flow sessions. Keep working!");
                  return;
                }

                // Multiplayer room timer controller overrides
                if (currentRoomId) {
                  try {
                    const roomRef = doc(db, 'shared_focus_rooms', currentRoomId);
                    const roomSnap = await getDoc(roomRef);
                    if (roomSnap.exists()) {
                      const data = roomSnap.data();
                      if (data.hostUid !== userId) {
                        alert("Only the lobby host can start/pause the shared focus timer.");
                        return;
                      }
                      await updateDoc(roomRef, {
                        timerStatus: isRunning ? 'paused' : 'running',
                        startedAt: isRunning ? null : new Date().toISOString(),
                        durationSeconds: timeLeft,
                        mode
                      });
                    }
                  } catch (e) {
                    console.error('Failed to control multiplayer timer:', e);
                    setIsRunning(!isRunning);
                  }
                } else {
                  setIsRunning(!isRunning);
                }
              }}
              className={cn(
                "px-8 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(255,255,255,0.2)]",
                strictMode && isRunning && "cursor-not-allowed opacity-90"
              )}
            >
              {isRunning && strictMode ? <Lock className="w-4 h-4 text-black" /> : isRunning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
              <span>{isRunning ? (strictMode ? 'Timer Locked' : 'Pause Flow') : 'Start Session'}</span>
            </button>

            <button
              onClick={() => {
                if (strictMode && isRunning) return;
                setIsRunning(false);
                if (mode === 'focus') {
                  setCompletedSessions((c) => c + 1);
                  setMode('break');
                } else {
                  setMode('focus');
                }
              }}
              disabled={strictMode && isRunning}
              className="p-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 active:scale-[0.95] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              title={strictMode && isRunning ? "Strict Mode Active: Skip Locked" : "Skip Session"}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Focus stats & sound card */}
        <div className="flex flex-col gap-6 w-full">
          {/* Focus Metrics Panel */}
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Brain className="w-4 h-4 text-white/50" />
              <span>Flow Metrics</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-white/40" />
                  <span className="text-xs font-medium text-white/70">Flow Cycles Today</span>
                </div>
                <span className="font-mono font-bold text-white text-sm">{completedSessions} completed</span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white/40" />
                  <span className="text-xs font-medium text-white/70">Efficiency Index</span>
                </div>
                <span className="font-mono font-bold text-white text-sm">94% Optimum</span>
              </div>
            </div>
          </GlassCard>

          {/* Multiplayer Focus room widget */}
          {userId && (
            <MultiplayerFocus
              userId={userId}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              mode={mode}
              setMode={setMode}
              focusTime={focusTime}
              breakTime={breakTime}
            />
          )}

          {/* Soundscapes selection */}
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Volume2 className="w-4 h-4 text-white/50 animate-pulse" />
              <span>Flow Soundscapes</span>
            </div>
            <div className="flex flex-col gap-2">
              {sounds.map((sound) => {
                const isActive = activeSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => setActiveSound(isActive ? null : sound.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide border transition-all flex items-center justify-between",
                      isActive
                        ? "bg-white border-white text-black shadow-md shadow-white/10"
                        : "border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <span>{sound.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />}
                  </button>
                );
              })}
            </div>
            
            {/* Audio volume slider control */}
            <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase">
                <span>Sound Level</span>
                <span className="text-white/50">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-white/80 transition-all"
              />
            </div>
          </GlassCard>

          {/* Hidden Loopable audio element */}
          <audio ref={audioRef} loop />
        </div>
      </div>

      {/* Regain Wellbeing attention controls */}
      <GlassCard className="p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Distraction Shield (Regain Mode)</span>
            </h3>
            <p className="text-white/40 text-xs mt-1">Block distracting sites and set screen-time thresholds during focus hours.</p>
          </div>
          
          {/* Strict Mode Control Toggle */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              {strictMode ? <Lock className="w-3.5 h-3.5 text-indigo-400" /> : <Unlock className="w-3.5 h-3.5 text-white/40" />}
              <span className="text-xs font-mono font-semibold text-white/80">Strict Timer Lock</span>
            </div>
            <button
              onClick={() => setStrictMode(!strictMode)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                strictMode ? "bg-indigo-600" : "bg-white/10"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  strictMode ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Blocked Sites configuration list */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase">Shielded Websites list</h4>
            <div className="space-y-2.5">
              {blockedSites.map((site) => (
                <div key={site.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{site.icon}</span>
                    <div>
                      <span className="text-xs font-semibold text-white block">{site.name}</span>
                      <span className="text-[10px] font-mono text-white/30 block mt-0.5">{site.domain}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedSiteForSim(site)}
                      disabled={!site.blocked}
                      className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[10px] font-mono text-white/50 hover:text-white bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Shield</span>
                    </button>

                    <button
                      onClick={() => toggleBlockSite(site.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all border",
                        site.blocked 
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                      )}
                    >
                      {site.blocked ? 'Shielded' : 'Unshielded'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Screen Time Tracking Progress Bars */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase">Daily Attention Limit trackers</h4>
            <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
              {blockedSites.map((site) => {
                const percent = Math.round((site.currentUsage / site.dailyLimit) * 100);
                const isOverLimit = site.currentUsage >= site.dailyLimit;
                
                return (
                  <div key={site.id} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-white/70 flex items-center gap-1.5 font-sans text-xs">
                        <span className="text-sm">{site.icon}</span>
                        <span>{site.name}</span>
                      </span>
                      <span className={cn(
                        "font-bold",
                        isOverLimit ? "text-red-400 animate-pulse" : percent > 80 ? "text-amber-400" : "text-white/40"
                      )}>
                        {site.currentUsage}m / {site.dailyLimit}m {isOverLimit && '(OVER LIMIT!)'}
                      </span>
                    </div>

                    {/* Limit Progress bar */}
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isOverLimit 
                            ? "bg-gradient-to-r from-red-500 to-rose-500" 
                            : percent > 80 
                              ? "bg-gradient-to-r from-amber-400 to-orange-400"
                              : "bg-gradient-to-r from-indigo-500 to-blue-500"
                        )}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                    
                    {/* Controls to change limit */}
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[9px] font-mono text-white/20">Set Limit:</span>
                      <input
                        type="number"
                        min="5"
                        max="240"
                        step="5"
                        value={site.dailyLimit}
                        onChange={(e) => updateSiteLimit(site.id, parseInt(e.target.value) || 15)}
                        className="bg-black/45 border border-white/5 rounded px-1.5 py-0.5 text-[9px] font-mono text-white w-12 text-center focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[9px] font-mono text-white/20">mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Block Page Simulator Overlay Modal */}
      <AnimatePresence>
        {selectedSiteForSim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full glass-panel bg-zinc-950/80 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-6 shadow-2xl relative"
            >
              {/* Close corner trigger */}
              <button 
                onClick={() => setSelectedSiteForSim(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white p-1 hover:bg-white/5 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  Attention Shield Engaged
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-4">
                  Access to {selectedSiteForSim.domain} Blocked
                </h2>
                <p className="text-white/40 text-sm mt-1">This site has been locked under your Life OS focus shield rules.</p>
              </div>

              {/* Dynamic motivational coaching prompt leveraging user context */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 max-w-md w-full text-left relative overflow-hidden font-mono">
                <div className="absolute top-2 right-2 text-[9px] text-white/20 tracking-wider font-mono">OS COACH WARNING</div>
                <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
                  <span>🚨</span> <span>FA9 Coach:</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  "Hey {userName || 'Commander'}, you are currently in a focus session with strict shield rules active. You logged <strong>{energyLevel} energy</strong>. Redirecting this Surge to your compiler projects is 2.8x more productive than loading {selectedSiteForSim.name} right now. Complete the session!"
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <button
                  onClick={() => setSelectedSiteForSim(null)}
                  className="flex-1 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  Decline & Resume Focus
                </button>
                <button
                  onClick={() => {
                    alert("Requires +50 Focus XP. Complete this 25 min flow timer to unlock calibration bypasses!");
                  }}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white font-semibold text-xs rounded-xl active:scale-[0.98] transition-all"
                >
                  Request 5 min Break
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
