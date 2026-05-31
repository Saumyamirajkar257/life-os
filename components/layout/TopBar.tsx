'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Menu, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useState, useEffect, useMemo } from 'react';
import { fadeInDown } from '@/animations';
import { cn } from '@/lib/utils';
import { FutureSelfModal } from '@/features/future-self/components/FutureSelfModal';

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function capitalizeFirst(str: string): string {
  if (!str) return 'Dashboard';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TopBar() {
  const {
    activePage,
    sidebarExpanded,
    isMobile,
    toggleCommandPalette,
    toggleSidebar,
    userHandle,
    userPfp
  } = useAppStore();

  const { notifications, markAllAsRead, clearAll, removeNotification } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const [isFutureSelfOpen, setIsFutureSelfOpen] = useState(false);

  // Live clock - updates every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    useNotificationStore.persist.rehydrate();
    // Force re-render after hydration so persisted userPfp is available
    const unsub = useAppStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    // If already hydrated (hot module reload etc), set immediately
    if (useAppStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return unsub;
  }, []);

  // Daily progress calculation
  const dailyProgress = useMemo(() => {
    if (!isHydrated) return 0;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const tasks = useTasksStore.getState().tasks;
      const habits = useHabitsStore.getState().habits;
      const totalTasks = tasks.filter(t => t.dueDate === todayStr).length;
      const completedTasks = tasks.filter(t => t.dueDate === todayStr && t.completed).length;
      const totalHabits = habits.length;
      const completedHabits = habits.filter(h => h.completedDates.includes(todayStr)).length;
      const totalItems = totalTasks + totalHabits;
      if (totalItems === 0) return 0;
      return Math.round(((completedTasks + completedHabits) / totalItems) * 100);
    } catch {
      return 0;
    }
  }, [isHydrated]);

  const unreadCount = isHydrated ? notifications.filter((n) => !n.read).length : 0;
  const pageTitle = capitalizeFirst(activePage || 'dashboard');

  return (
    <>
    {/* Thin gradient progress bar at very top of viewport */}
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-black/30">
      <motion.div
        className="h-full progress-gradient rounded-r-full"
        initial={{ width: '0%' }}
        animate={{ width: `${dailyProgress}%` }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
      />
    </div>
    <motion.header
      variants={fadeInDown}
      initial="initial"
      animate="animate"
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-4 md:px-6"
      style={{
        left: isMobile ? 0 : sidebarExpanded ? 240 : 72,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-display font-semibold text-white/90 tracking-tight">
            {pageTitle}
          </h2>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-sm text-white/30 hidden sm:block">
            {formatDate()}
          </span>
          {/* Live Clock Widget */}
          {liveTime && (
            <>
              <div className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Clock className="w-3 h-3 text-white/25" />
                <span className="text-[11px] font-mono text-white/35 tabular-nums tracking-wider">{liveTime}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        
        {/* Future Self Trigger */}
        <button
          onClick={() => setIsFutureSelfOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 group mr-2"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-200 group-hover:text-white transition-colors">
            Future Self
          </span>
        </button>

        {/* Search / Command Palette button */}
        <button
          onClick={toggleCommandPalette}
          className={cn(
            'glass-panel-subtle flex items-center gap-2 rounded-xl px-3 py-2 text-white/30 hover:text-white/50 hover:bg-white/5 transition-all duration-200',
            'hidden sm:flex'
          )}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search...</span>
          <div className="flex items-center gap-0.5 ml-2">
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/30">
              ⌘K
            </kbd>
          </div>
        </button>

        {/* Mobile search icon */}
        <button
          onClick={toggleCommandPalette}
          className="sm:hidden p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) {
                markAllAsRead();
              }
            }}
            className={cn(
              "relative p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200",
              isOpen && "text-white/70 bg-white/5"
            )}
          >
            <Bell className="w-5 h-5" />
            {/* Pulsing green dot */}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-black/50" />
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          <AnimatePresence>
          {isOpen && (
            <>
              {/* Clicking outside closes the panel */}
              <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-white/10 max-h-[400px] overflow-y-auto space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {isHydrated && notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-[10px] text-white/40 hover:text-red-400 transition-colors flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {!isHydrated || notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-white/20">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all duration-200 text-left relative group",
                          notif.read ? "bg-white/[0.01] border-white/5" : "bg-white/[0.03] border-white/10"
                        )}
                      >
                        <button
                          onClick={() => removeNotification(notif.id)}
                          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-white/20 hover:text-white/60 transition-opacity p-0.5 rounded-md hover:bg-white/5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-start gap-2.5 pr-5">
                          <span className="mt-0.5 text-xs select-none">
                            {notif.type === 'success' && '✅'}
                            {notif.type === 'info' && 'ℹ️'}
                            {notif.type === 'warning' && '⚠️'}
                            {notif.type === 'error' && '❌'}
                            {notif.type === 'github' && '🐙'}
                            {notif.type === 'calendar' && '📅'}
                          </span>
                          <div className="space-y-0.5">
                            <h5 className={cn(
                              "text-xs font-semibold text-white/90",
                              !notif.read && "text-emerald-300"
                            )}>
                              {notif.title}
                            </h5>
                            <p className="text-[10px] leading-relaxed text-white/50">
                              {notif.description}
                            </p>
                            <span className="text-[8px] text-white/25 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
          </AnimatePresence>
        </div>

        {/* Clickable PFP Profile Avatar with Aura Glow */}
        <Link href="/settings" className="relative group shrink-0 block select-none" title="Settings Profile">
          {/* Pulsing Breathing Aura Background */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 blur-md opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 animate-pulse-slow" style={{ animationDuration: '4s' }} />
          
          {/* Main avatar container */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:border-white/30 group-hover:scale-105 group-active:scale-95">
            {isHydrated && userPfp ? (
              <img src={userPfp} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </div>

          {/* Active Status Pulse Indicator Dot */}
          <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-black/80" />
          </span>
        </Link>
      </div>
    </motion.header>
    
    <FutureSelfModal isOpen={isFutureSelfOpen} onClose={() => setIsFutureSelfOpen(false)} />
    </>
  );
}
