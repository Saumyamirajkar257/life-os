'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Activity, ShieldAlert, Zap, 
  Send, Trash2, X, RefreshCw, MessageSquare, 
  Smile, User, Settings, AlertTriangle, Coffee
} from 'lucide-react';
import { RobotPet } from './RobotPet';
import { useCompanionStore, type CompanionMessage } from '@/store/useCompanionStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAIStore } from '@/store/useAIStore';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '@/lib/utils';

interface Particle {
  id: string;
  x: number;
  y: number;
  char: string;
}

export function GlobalCompanion() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'vibe' | 'interact'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Bind external stores
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { transactions } = useFinanceStore();
  const { memory } = useAIStore();
  const { userName } = useAppStore();
  
  const {
    companionOpen,
    petLevel,
    petXp,
    petMood,
    energyLevel,
    messages,
    isTyping,
    xpNotifications,
    setCompanionOpen,
    feedPet,
    petCompanion,
    setEnergyLevel,
    sendMessage,
    triggerBrutalCritique,
    clearCompanionMessages,
    clearNotification
  } = useCompanionStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll chat message log
  useEffect(() => {
    if (companionOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, companionOpen, isTyping]);

  // Aggregate user context for AI strategist prompts
  const requestContext = useMemo(() => {
    return {
      tasks,
      habits,
      transactions: transactions.slice(0, 5),
      memory: {
        ...memory,
        userName
      }
    };
  }, [tasks, habits, transactions, memory, userName]);

  // Spawns particles (hearts, cookies, stars) rising from the pet avatar
  const spawnParticles = (char: string) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `particle-${Date.now()}-${i}-${Math.random()}`,
      x: Math.random() * 120 - 60, // horizontal spread
      y: Math.random() * -100 - 40, // float upwards
      char,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    
    // Cleanup
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1200);
  };

  const handleFeed = () => {
    feedPet();
    spawnParticles('🍪');
    spawnParticles('✨');
  };

  const handlePet = () => {
    petCompanion();
    spawnParticles('❤️');
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    await sendMessage(text, requestContext);
  };

  // SVG representation of the pet based on level & mood state
  const renderPetAvatar = (size: 'sm' | 'lg' = 'sm') => {
    return <RobotPet level={petLevel} mood={petMood} size={size} />;
  };

  if (!mounted) return null;

  return (
    <>
      {/* 1. Global Floating Orb (Bottom Right Trigger) */}
      {!companionOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5"
        >
          <div 
            onClick={() => setCompanionOpen(true)}
            className="group relative"
          >
            {/* Glowing border ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur opacity-75 group-hover:opacity-100 transition duration-300" />
            
            {renderPetAvatar('sm')}

            {/* Level Badge Overlay */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/85 border border-white/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full text-white/95 whitespace-nowrap shadow-md">
              Lvl {petLevel}
            </div>
          </div>
        </motion.div>
      )}

      {/* XP/Action Toast Overlay (Flashed when XP is gained) */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {xpNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
              onAnimationComplete={() => {
                setTimeout(() => clearNotification(notif.id), 2500);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md text-white uppercase",
                notif.type === 'levelup' 
                  ? "bg-purple-600/90 border-purple-400/30 animate-pulse" 
                  : notif.type === 'feed'
                    ? "bg-emerald-600/90 border-emerald-400/30"
                    : "bg-blue-600/90 border-blue-400/30"
              )}
            >
              {notif.type === 'levelup' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>LEVEL UP TO {notif.amount}!</span>
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3 fill-white" />
                  <span>+{notif.amount} XP gained</span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Global Companion Drawer (Slide Over Control Panel) */}
      <AnimatePresence>
        {companionOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[95vw] h-[550px] glass-panel bg-zinc-950/95 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {renderPetAvatar('sm')}
                  {/* Floating particles inside header */}
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    <AnimatePresence>
                      {particles.map((p) => (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                          animate={{ opacity: 0, scale: 1.5, x: p.x, y: p.y }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="absolute text-lg pointer-events-none select-none z-50"
                        >
                          {p.char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-white text-sm">FA9</h3>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-white/60">Lvl {petLevel}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {/* XP Progress Bar */}
                    <div className="w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${petXp}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{petXp}/100 XP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Active Energy Badge */}
                <div className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider",
                  energyLevel === 'hyper' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                  energyLevel === 'focused' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                  energyLevel === 'low' && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                  energyLevel === 'exhausted' && "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                  ⚡ {energyLevel}
                </div>
                
                <button
                  onClick={() => setCompanionOpen(false)}
                  className="p-1 rounded-md text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 bg-zinc-950 p-1">
              {(['chat', 'vibe', 'interact'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                    activeTab === tab
                      ? "text-white border-b-2 border-white font-bold"
                      : "text-white/40 hover:text-white/80"
                  )}
                >
                  {tab === 'chat' ? '💬 Chat' : tab === 'vibe' ? '🔋 Vibe Log' : '🍖 Care'}
                </button>
              ))}
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin bg-black/20 flex flex-col justify-between">
              
              {/* TAB 1: Chat interface */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full justify-between gap-4">
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none h-[300px]">
                    {messages.map((msg) => {
                      const isAssistant = msg.sender === 'assistant';
                      return (
                        <div key={msg.id} className={cn("flex gap-2 max-w-[85%] sm:max-w-[80%]", isAssistant ? "mr-auto" : "ml-auto flex-row-reverse")}>
                          <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-white/5 mt-0.5",
                            isAssistant ? "bg-white text-black" : "bg-white/5 text-white/55"
                          )}>
                            {isAssistant ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          </div>
                          <div className={cn(
                            "rounded-xl px-3 py-2 text-xs leading-relaxed border transition-all duration-300",
                            isAssistant 
                              ? "glass-panel border-white/5 text-white/80 whitespace-pre-wrap font-mono" 
                              : "bg-white border-white text-black font-semibold"
                          )}>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex gap-2 max-w-[70%] mr-auto items-center">
                        <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center shrink-0 border border-white/5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="glass-panel border border-white/5 rounded-xl px-3 py-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="flex gap-2 justify-center shrink-0 pb-1">
                    <button 
                      onClick={() => triggerBrutalCritique(requestContext)}
                      disabled={isTyping}
                      className="px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-40"
                    >
                      💥 Brutal Critique
                    </button>
                    <button 
                      onClick={clearCompanionMessages}
                      className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-mono uppercase tracking-wider transition-all"
                    >
                      🧹 Clear logs
                    </button>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChat} className="flex gap-2 shrink-0 border-t border-white/5 pt-3">
                    <input
                      type="text"
                      required
                      placeholder={`Ask me anything, ${userName}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isTyping}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isTyping}
                      className="w-9 h-9 bg-white hover:bg-white/90 text-black rounded-xl transition-all flex items-center justify-center shrink-0 shadow-lg disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5 fill-black" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Vibe / Energy Logs */}
              {activeTab === 'vibe' && (
                <div className="flex flex-col gap-5 h-full">
                  <div>
                    <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase border-b border-white/5 pb-2">Log Current Vibe Index</h4>
                    <p className="text-[11px] text-white/50 mt-1 leading-normal font-mono">
                      Logging energy adapts FA9's mood and injects custom recommendations into your chat stream.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { value: 'hyper' as const, label: '🔥 Hyper Capacity', color: 'border-orange-500/30 hover:border-orange-400 bg-orange-500/5 hover:bg-orange-500/10 text-orange-300', desc: 'Ready for major high-intensity sprints' },
                      { value: 'focused' as const, label: '🎯 High Flow', color: 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300', desc: 'Optimal state for coding & studies' },
                      { value: 'low' as const, label: '⚡ Low Vibe', color: 'border-blue-500/30 hover:border-blue-400 bg-blue-500/5 hover:bg-blue-500/10 text-blue-300', desc: 'Suggest low intensity workspace tasks' },
                      { value: 'exhausted' as const, label: '⚠️ Depleted', color: 'border-red-500/30 hover:border-red-400 bg-red-500/5 hover:bg-red-500/10 text-red-300', desc: 'Shutting down blocks, rest required' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setEnergyLevel(opt.value)}
                        className={cn(
                          "p-4 rounded-xl border text-left flex flex-col justify-between h-[120px] transition-all relative overflow-hidden group",
                          opt.color,
                          energyLevel === opt.value && "ring-1 ring-white"
                        )}
                      >
                        <span className="text-xs font-mono font-bold">{opt.label}</span>
                        <p className="text-[10px] text-white/50 mt-2 leading-snug font-sans group-hover:text-white/70 transition-colors">
                          {opt.desc}
                        </p>
                        {energyLevel === opt.value && (
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white animate-ping" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-start gap-2.5">
                    <Coffee className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Coach Vibe Recommendation</span>
                      <p className="text-[10px] text-white/60 leading-relaxed mt-1 font-sans">
                        {energyLevel === 'exhausted' && "FA9 recommends reading physical books or stretching. Do NOT lock flow sessions."}
                        {energyLevel === 'low' && "Review Second Brain links or check email. Defer Rust/Next compiler architecture cycles."}
                        {energyLevel === 'focused' && "Initialize study timers or compile Rust projects. Focus is 92% calibrated."}
                        {energyLevel === 'hyper' && "Tackle high priority backlog queues or write collaborative ideas blocks."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Tamagotchi Care */}
              {activeTab === 'interact' && (
                <div className="flex flex-col gap-6 h-full justify-between">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase border-b border-white/5 pb-2">Tamagotchi Coach Care</h4>
                      <p className="text-[11px] text-white/50 mt-1 leading-normal font-mono">
                        Nurturing FA9 trains your strategic coach, unlocks level badges, and helps structure habit cycles.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Feed button */}
                      <button
                        onClick={handleFeed}
                        className="p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 flex flex-col items-center text-center gap-3 transition-all active:scale-[0.98]"
                      >
                        <span className="text-3xl">🍪</span>
                        <div>
                          <span className="text-xs font-mono font-bold block">FEED FA9</span>
                          <span className="text-[9px] font-mono text-emerald-400/60 block mt-1">+25 XP Focus Snack</span>
                        </div>
                      </button>

                      {/* Pet button */}
                      <button
                        onClick={handlePet}
                        className="p-5 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400 flex flex-col items-center text-center gap-3 transition-all active:scale-[0.98]"
                      >
                        <span className="text-3xl">✋</span>
                        <div>
                          <span className="text-xs font-mono font-bold block">PET FA9</span>
                          <span className="text-[9px] font-mono text-pink-400/60 block mt-1">+10 XP Calibration</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Character Card Info */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-zinc-950/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                      <span className="text-white/40">COMPANION STATUS</span>
                      <span className="text-white/70 font-semibold">{petMood.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                      <span className="text-white/40">COMPLETED WORKFLOWS</span>
                      <span className="text-white/70 font-semibold">{tasks.filter(t => t.completed).length} Tasks</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white/40">ACTIVE ROUTINES</span>
                      <span className="text-white/70 font-semibold">{habits.filter(h => h.currentStreak > 0).length} Streaks</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
