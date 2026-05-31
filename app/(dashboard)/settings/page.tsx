'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Sliders, Shield, Database, Save, RotateCcw, AlertTriangle, Camera, Upload, Trash2 } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useThemeStore, type ThemeType } from '@/store/useThemeStore';
import { useTasksStore } from '@/store/useTasksStore';
import { auth } from '@/lib/firebase';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useJournalStore } from '@/store/useJournalStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { userName: storeName, userEmail: storeEmail, userHandle: storeHandle, userPfp: storePfp, updateProfile } = useAppStore();
  const [userName, setUserName] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [email, setEmail] = useState('');
  const [userPfp, setUserPfp] = useState('');
  const { theme: currentTheme, setTheme } = useThemeStore();
  const { compactDock, soundEnabled, setCompactDock, setSoundEnabled } = useAppStore();
  const [isSaved, setIsSaved] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
    setUserName(storeName);
    setEmail(storeEmail);
    setUserHandle(storeHandle || '');
    setUserPfp(storePfp || '');
  }, [storeName, storeEmail, storeHandle, storePfp]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(userName, email, userHandle, userPfp);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to purge all local databases? This will clear all logged tasks, transactions, habits, and reflections.')) {
      localStorage.clear();
      
      try {
        await useTasksStore.persist.clearStorage();
        await useHabitsStore.persist.clearStorage();
        await useJournalStore.persist.clearStorage();
        await useFinanceStore.persist.clearStorage();
        await useBrainStore.persist.clearStorage();
      } catch (e) {
        console.error('Failed to clear some stores', e);
      }
      
      window.location.reload();
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Loading settings panel...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure your desktop nodes, visual styling, and cognitive integrations</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6 w-full"
      >
        {/* Profile Card */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <User className="w-4 h-4 text-white/50" />
              <span>Identity Profile</span>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Picture Uploader with Cybernetic Presets */}
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/5">
                <div className="relative group shrink-0 select-none">
                  {/* Pulsing Aura Border Glow */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-md opacity-75 animate-pulse-slow" style={{ animationDuration: '4s' }} />
                  
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/15 flex items-center justify-center overflow-hidden shadow-lg relative transition-all duration-300 hover:border-white/30">
                    {userPfp ? (
                      <img src={userPfp} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white/20" />
                    )}
                    
                    {/* Hover Camera overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer select-none">
                      <Camera className="w-5 h-5 text-white/80" />
                      <span className="text-[9px] font-mono text-white/60 mt-1">UPLOAD</span>
                    </div>
                  </div>
                  
                  {/* Invisible file input trigger */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUserPfp(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload profile picture"
                  />
                </div>
                
                {/* Details instruction, Reset button & Presets */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white/90">Profile Picture (PFP)</h4>
                    <p className="text-[10px] text-white/30 max-w-sm font-mono leading-normal uppercase">
                      Select an image from your computer or choose an inline vector key to update your avatar. Supports PNG, JPG, or SVG.
                    </p>
                  </div>
                  
                  {/* Preset Sci-Fi Avatars Selection */}
                  <div className="flex flex-col items-center md:items-start gap-1.5">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block">Choose a Cybernetic Core Preset:</span>
                    <div className="flex gap-2">
                      {[
                        { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="40" stroke="%23818cf8" stroke-width="6" stroke-dasharray="10 5" fill="none"/><circle cx="50" cy="50" r="24" stroke="%23c084fc" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="10" fill="%23818cf8"/></svg>', label: 'Indigo' },
                        { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><path d="M50,15 L85,75 L15,75 Z" stroke="%23f59e0b" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="50" cy="58" r="10" fill="%23f97316"/></svg>', label: 'Amber' },
                        { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><rect x="20" y="20" width="60" height="60" rx="10" stroke="%2310b981" stroke-width="5" fill="none"/><circle cx="50" cy="50" r="12" fill="%2314b8a6"/></svg>', label: 'Teal' },
                        { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="35" stroke="%23f43f5e" stroke-width="5" stroke-dasharray="2 6" fill="none"/><circle cx="50" cy="50" r="20" fill="%23e11d48"/></svg>', label: 'Rose' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserPfp(preset.url)}
                          className="w-9 h-9 rounded-full border border-white/5 hover:border-white/20 overflow-hidden transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center bg-black/40 hover:scale-105"
                          title={`Select ${preset.label} Preset`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {userPfp && (
                    <button
                      type="button"
                      onClick={() => setUserPfp('')}
                      className="text-[9px] font-mono text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-1 pt-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Picture
                    </button>
                  )}
                </div>
              </div>

              {/* Text fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">First Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Primary Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">User Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">@</span>
                    <input
                      type="text"
                      value={userHandle.replace(/^@/, '')}
                      onChange={(e) => setUserHandle('@' + e.target.value.replace(/^@/, ''))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-3">
                {isSaved && <span className="text-[10px] font-mono text-zinc-300">Identity Updated</span>}
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Preferences Card */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-white/50" />
              <span>App Preferences</span>
            </div>
            <div className="flex flex-col gap-3">
              {/* Theme Engine */}
              <div className="flex flex-col gap-2 p-3.5 bg-white/[0.01] border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">Visual Engine (Theme)</h4>
                  <p className="text-[10px] text-white/30 mt-0.5">Select the cinematic aesthetic of your OS</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {(['minimal-black', 'cyberpunk', 'glassmorphism', 'hacker'] as ThemeType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-mono capitalize transition-all border",
                        currentTheme === t 
                          ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 1 */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.02] hover:border-white/10 transition-all">
                <div>
                  <h4 className="text-xs font-semibold text-white">Compact macOS Dock</h4>
                  <p className="text-[10px] text-white/30 mt-0.5">Compress bottom dock dimensions on smaller viewports</p>
                </div>
                <button
                  onClick={() => setCompactDock(!compactDock)}
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0",
                    compactDock ? "bg-white" : "bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-transform",
                      compactDock ? "bg-black translate-x-4" : "bg-white"
                    )}
                  />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.02] hover:border-white/10 transition-all">
                <div>
                  <h4 className="text-xs font-semibold text-white">Cognitive Audio Loops</h4>
                  <p className="text-[10px] text-white/30 mt-0.5">Enable subtle micro-interactions sound effects during sessions</p>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0",
                    soundEnabled ? "bg-white" : "bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-transform",
                      soundEnabled ? "bg-black translate-x-4" : "bg-white"
                    )}
                  />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Integrations & Webhook Simulator */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-5 flex flex-col gap-4 border-indigo-950/40">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Integrations & Webhook Simulator</span>
            </div>
            
            <div className="space-y-4">
              {/* GitHub commit simulator */}
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">GitHub Habit Auto-Check</h4>
                  <p className="text-[10px] text-white/30">Mock commits to test auto-complete habits webhook.</p>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    id="gitRepo"
                    defaultValue="life-os"
                    placeholder="Repo name (e.g. life-os)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={async () => {
                      const repo = (document.getElementById('gitRepo') as HTMLInputElement)?.value || 'life-os';
                      const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
                      const user = auth.currentUser;
                      const uid = user ? user.uid : (bypassed ? 'sandbox-user-id' : null);
                      
                      if (!uid) {
                        alert("Log in or enter Sandbox mode first.");
                        return;
                      }

                      try {
                        const res = await fetch('/api/integrations/github', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ uid, username: 'saumya', repository: repo, action: 'push' })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          alert(data.message);
                        }
                      } catch (e) {
                        alert('GitHub webhook simulation failed.');
                      }
                    }}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    Sim Commit
                  </button>
                </div>
              </div>

              {/* Google Calendar simulator */}
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">Google Calendar Focus Sync</h4>
                  <p className="text-[10px] text-white/30">Toggle strict focus mode automatically on calendar study event starts.</p>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    id="calEvent"
                    defaultValue="Coding Study Block"
                    placeholder="Event name (e.g. Study Group)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white"
                  />
                  <select
                    id="calAction"
                    className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="start">Event Start (Lock Timer)</option>
                    <option value="end">Event End (Unlock Timer)</option>
                  </select>
                  <button
                    onClick={async () => {
                      const event = (document.getElementById('calEvent') as HTMLInputElement)?.value || 'Coding Study Block';
                      const type = (document.getElementById('calAction') as HTMLSelectElement)?.value || 'start';
                      const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
                      const user = auth.currentUser;
                      const uid = user ? user.uid : (bypassed ? 'sandbox-user-id' : null);

                      if (!uid) {
                        alert("Log in or enter Sandbox mode first.");
                        return;
                      }

                      try {
                        const res = await fetch('/api/integrations/calendar', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ uid, eventName: event, type })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          alert(data.message);
                        }
                      } catch (e) {
                        alert('Calendar webhook simulation failed.');
                      }
                    }}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    Sim Event
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Database Audit Card */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-5 flex flex-col gap-4 border-zinc-900">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Database className="w-4 h-4 text-white/50" />
              <span>System Operations</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Export Neural Data</span>
                  </h4>
                  <p className="text-[10px] text-white/40 mt-1 max-w-md">
                    Export all your tasks, habits, journals, and analytics locally as JSON.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const data = JSON.stringify(localStorage);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `life-os-export-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-400 font-medium text-xs rounded-xl transition-all shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/40 border border-rose-900/30 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Purge Local Database</span>
                  </h4>
                  <p className="text-[10px] text-rose-400/50 mt-1 max-w-md">
                    This action clears all browser states, including task logs, habits, balances, and profiles. This is irreversible.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 px-4 py-2 border border-rose-900/50 hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400 font-medium text-xs rounded-xl transition-all shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Purge Node</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
