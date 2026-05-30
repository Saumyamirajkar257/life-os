'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Award, BarChart3, Network, MessageSquare, Compass,
  Flame, Zap, Plus, ArrowUpRight, Mail, Link as LinkIcon,
  ChevronRight, Calendar, Star, ShieldAlert, Award as BadgeIcon, HelpCircle, Send
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/store/useAppStore';

type MainTab = 'profile' | 'analytics' | 'clone';
type SubTab = string;

export default function LifeProfile() {
  const [mounted, setMounted] = useState(false);
  const { userName } = useAppStore();
  const [activeTab, setActiveTab] = useState<MainTab>('profile');

  useEffect(() => {
    setMounted(true);
  }, []);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('profile-card');

  // Portfolio projects
  const [projects, setProjects] = useState([
    { name: 'Distributed Compiler Daemon', tech: ['Rust', 'Wasm', 'TCP'], date: 'May 2026', link: '#' },
    { name: 'Life OS Dashboard V2', tech: ['Next.js', 'Tailwind', 'Firebase'], date: 'April 2026', link: '#' }
  ]);
  const [newProjName, setNewProjName] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [showProjModal, setShowProjModal] = useState(false);

  // Digital Clone States
  const [cloneMessages, setCloneMessages] = useState([
    { sender: 'clone', text: "Hello! I am your Digital Clone sync-module. I learn your writing style, goals, notes, and schedules. What would you like to test?", time: 'Just now' }
  ]);
  const [cloneInput, setCloneInput] = useState('');
  const [cloneTyping, setCloneTyping] = useState(false);
  const [cloneStatus, setCloneStatus] = useState({
    styleSync: 65,
    notesAnalyzed: 24,
    goalsTracked: 12,
    scheduleMatch: 82
  });

  // Actions
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    const techArray = newProjTech.split(',').map(t => t.trim()).filter(Boolean);
    setProjects([...projects, {
      name: newProjName,
      tech: techArray.length ? techArray : ['General'],
      date: 'May 2026',
      link: '#'
    }]);
    setNewProjName('');
    setNewProjTech('');
    setShowProjModal(false);
  };

  const handleSendClone = () => {
    if (!cloneInput.trim()) return;
    const userMsg = { sender: 'user', text: cloneInput, time: 'Just now' };
    setCloneMessages(prev => [...prev, userMsg]);
    setCloneInput('');
    setCloneTyping(true);

    setTimeout(() => {
      setCloneTyping(false);
      const responses = [
        "Analyzing prompt query. Based on your writing style index (65% accuracy), I predict you would say: 'Let us optimize compile timings first and rest tomorrow.'",
        "Checked scheduler constraints. We usually complete assignment submissions with a 1.2-day safety margin. So I'll draft the roadmap email now.",
        "Refining note synthesis. You have written 24 notes on Distributed systems. The recurring core concept is: content-addressable memory."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setCloneMessages(prev => [...prev, { sender: 'clone', text: randomReply, time: 'Just now' }]);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <User className="w-9 h-9 text-primary" /> Life Profile & Analytics
          </h1>
          <p className="text-white/40 mt-1.5">Manage your public credential portfolio, analyze focus analytics, and train your digital clone.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit shrink-0">
          <button
            onClick={() => { setActiveTab('profile'); setActiveSubTab('profile-card'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Public Profile
          </button>
          <button
            onClick={() => { setActiveTab('analytics'); setActiveSubTab('study-analytics'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'analytics' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Personal Analytics
          </button>
          <button
            onClick={() => { setActiveTab('clone'); setActiveSubTab('knowledge-graph'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'clone' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" /> Knowledge Map & Clone
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-[220px] bg-white/5 border border-white/10 rounded-2xl p-2.5 space-y-1 shrink-0">
          {activeTab === 'profile' && (
            <>
              <button
                onClick={() => setActiveSubTab('profile-card')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'profile-card' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Profile Card</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('portfolio')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'portfolio' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Portfolio Grid</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('achievements')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'achievements' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Achievements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <button
                onClick={() => setActiveSubTab('study-analytics')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'study-analytics' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Study Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('focus-heatmap')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'focus-heatmap' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Flame className="w-4 h-4" /> Focus Heatmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('ai-trends')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'ai-trends' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> AI Trends</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'clone' && (
            <>
              <button
                onClick={() => setActiveSubTab('knowledge-graph')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'knowledge-graph' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Network className="w-4 h-4" /> Knowledge Graph</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('digital-clone')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'digital-clone' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Talk to Clone</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Main GlassCard Workspace Area */}
        <div className="flex-1 w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <GlassCard variant="default" glowOnHover={false} animated={false} className="h-full">

                {/* SUB TAB: PROFILE CARD */}
                {activeSubTab === 'profile-card' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Integrated Student Profile Card
                      </h3>
                      <p className="text-xs text-white/50">Your consolidated student resume, syncing XP milestones and overall Life Score.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center md:items-start">
                      {/* Avatar Mock */}
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center border border-white/15 shrink-0 shadow-lg shadow-primary/20 relative">
                        <User className="w-12 h-12 text-black" />
                        <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-black border border-primary text-[10px] text-primary font-bold font-mono">
                          LVL 24
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="flex-grow space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                          <div className="text-center md:text-left">
                            <h4 className="text-2xl font-display font-extrabold text-white">
                              {mounted ? userName : 'Alex Commander'}
                            </h4>
                            <span className="text-xs text-white/50 block mt-0.5">Systems Engineering & UI Design</span>
                          </div>
                          
                          {/* Life score */}
                          <div className="p-3 bg-black/45 border border-white/5 rounded-xl text-center shrink-0">
                            <span className="text-[9px] text-white/40 font-mono block">OVERALL LIFE SCORE</span>
                            <span className="text-2xl font-display font-extrabold text-primary block mt-0.5">92 / 100</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center md:text-left">
                          <div>
                            <span className="text-[10px] text-white/40 block font-mono">STUDY STREAK</span>
                            <span className="text-base font-bold text-white block mt-0.5">42 Days</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 block font-mono">FOCUS HOURS</span>
                            <span className="text-base font-bold text-white block mt-0.5">142.5 hrs</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 block font-mono">TASKS DONE</span>
                            <span className="text-base font-bold text-white block mt-0.5">87 Items</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 block font-mono">ACTIVE CLONE</span>
                            <span className="text-base font-bold text-emerald-400 block mt-0.5">Ready (65%)</span>
                          </div>
                        </div>

                        {/* Skill Tags */}
                        <div className="pt-2">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono block mb-2">Verified Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Rust Compilers', 'Next.js App Router', 'Firebase Storage', 'Tailwind CSS v4', 'UI/UX Glassmorphism', 'Distributed Consensus'].map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex gap-2.5 pt-3">
                          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          </button>
                          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </button>
                          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: PORTFOLIO GRID */}
                {activeSubTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                          <LinkIcon className="w-5 h-5 text-primary" /> Project Portfolio Grid
                        </h3>
                        <p className="text-xs text-white/50">Showcase completed project cards showing technologies used and completion timestamps.</p>
                      </div>
                      <button 
                        onClick={() => setShowProjModal(true)}
                        className="rounded-xl bg-white text-black font-semibold text-xs px-3.5 py-2.5 flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between h-[150px]">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                              <a href={proj.link} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono block mt-1">Completed: {proj.date}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {proj.tech.map((t, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-semibold border border-primary/30">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {showProjModal && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6"
                        >
                          <h4 className="text-lg font-display font-bold text-white mb-4">Add Project Showcase</h4>
                          <form onSubmit={handleAddProject} className="space-y-4">
                            <div>
                              <label className="block text-xs text-white/40 font-semibold mb-2 uppercase tracking-wide">Project Name</label>
                              <input 
                                type="text" 
                                required
                                value={newProjName}
                                onChange={(e) => setNewProjName(e.target.value)}
                                placeholder="e.g. Distributed Compiler Daemon"
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 font-semibold mb-2 uppercase tracking-wide">Tech Stack (comma separated)</label>
                              <input 
                                type="text"
                                required
                                value={newProjTech}
                                onChange={(e) => setNewProjTech(e.target.value)}
                                placeholder="e.g. Rust, Wasm, TCP"
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full text-sm"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button 
                                type="button"
                                onClick={() => setShowProjModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:opacity-90"
                              >
                                Add Project
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB TAB: ACHIEVEMENTS */}
                {activeSubTab === 'achievements' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" /> Achievement Badges Status
                      </h3>
                      <p className="text-xs text-white/50">Unlocked badges glow with active borders. Locked badges require specific study streaks or milestones.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { title: 'First 100 Hours', desc: 'Log 100 deep focus hours.', unlocked: true, date: 'Unlocked May 12' },
                        { title: 'Week Warrior', desc: 'Maintain 7-day study streak.', unlocked: true, date: 'Unlocked May 16' },
                        { title: 'Early Bird', desc: 'Focus session before 5am.', unlocked: true, date: 'Unlocked May 24' },
                        { title: 'Century Milestone', desc: 'Reach level 100 Commander.', unlocked: false, date: 'Locked (Level 24/100)' },
                        { title: 'Decentralized Master', desc: 'Build 5 systems projects.', unlocked: false, date: 'Locked (2/5 Built)' },
                        { title: 'Language Scholar', desc: 'Review language for 30 days.', unlocked: false, date: 'Locked (8-day gap)' }
                      ].map((badge, idx) => (
                        <div 
                          key={idx} 
                          className={`p-4.5 rounded-2xl border text-center flex flex-col justify-between min-h-[140px] transition-all ${
                            badge.unlocked 
                              ? 'border-amber-500/25 bg-amber-500/5 text-white hover:shadow-lg hover:shadow-amber-500/5' 
                              : 'border-white/5 bg-black/45 text-white/30'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <BadgeIcon className={`w-8 h-8 mb-2.5 ${badge.unlocked ? 'text-amber-400' : 'text-white/20'}`} />
                            <span className="text-xs font-bold font-display block leading-tight">{badge.title}</span>
                            <span className="text-[10px] text-white/45 mt-1.5 block leading-normal">{badge.desc}</span>
                          </div>
                          
                          <span className={`text-[9px] font-mono block mt-3 ${badge.unlocked ? 'text-amber-400/80' : 'text-white/20'}`}>
                            {badge.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: STUDY ANALYTICS */}
                {activeSubTab === 'study-analytics' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" /> Study Analytics & Performance
                      </h3>
                      <p className="text-xs text-white/50">Comprehensive charts tracking your daily study hours, productivity metrics, and week-over-week comparisons.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Peak days */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <span className="text-xs font-semibold text-white block">Most Productive Days (Weekdays)</span>
                        <div className="space-y-3">
                          {[
                            { day: 'Wednesday', hrs: 8.5, percentage: 95 },
                            { day: 'Friday', hrs: 7.0, percentage: 80 },
                            { day: 'Tuesday', hrs: 6.2, percentage: 70 },
                            { day: 'Monday', hrs: 4.5, percentage: 50 },
                          ].map((d, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-xs text-white/60 mb-1 font-mono">
                                <span>{d.day}</span>
                                <span>{d.hrs} hrs avg</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${d.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Focus hours distribution */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <span className="text-xs font-semibold text-white block">Focus Interval Distribution</span>
                        <div className="space-y-3">
                          {[
                            { label: 'Morning sessions (5 AM - 9 AM)', hrs: 32.5, percentage: 22 },
                            { label: 'Afternoon sessions (1 PM - 5 PM)', hrs: 18.0, percentage: 12 },
                            { label: 'Night sessions (8 PM - 12 AM)', hrs: 92.0, percentage: 66 },
                          ].map((interval, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-white/60">{interval.label}</span>
                              <div className="text-right shrink-0 font-mono">
                                <span className="text-white font-bold block">{interval.hrs} hrs</span>
                                <span className="text-primary text-[10px] block">{interval.percentage}% volume</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: FOCUS HEATMAP */}
                {activeSubTab === 'focus-heatmap' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" /> Daily Focus Activity Heatmap
                      </h3>
                      <p className="text-xs text-white/50">Visual grid of study session intensity. Darker cells represent high XP volumes logged.</p>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex gap-1.5 justify-between flex-wrap mb-4 border-b border-white/5 pb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <span key={day} className="text-[10px] font-mono text-white/40 w-[24px] text-center">{day}</span>
                        ))}
                      </div>

                      {/* 4 weeks grid */}
                      <div className="space-y-2">
                        {[
                          { week: 'Week 1', intensities: [1, 2, 3, 1, 4, 0, 1] },
                          { week: 'Week 2', intensities: [2, 0, 4, 3, 2, 1, 2] },
                          { week: 'Week 3', intensities: [3, 2, 4, 1, 3, 0, 2] },
                          { week: 'Week 4', intensities: [1, 3, 4, 2, 4, 1, 3] }
                        ].map((w, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-white/30 w-12 shrink-0">{w.week}</span>
                            <div className="flex-grow flex gap-1.5">
                              {w.intensities.map((intensity, iIdx) => {
                                const colors = [
                                  'bg-white/5 border-white/5',
                                  'bg-primary/20 border-primary/20',
                                  'bg-primary/40 border-primary/40',
                                  'bg-primary/70 border-primary/75',
                                  'bg-primary border-primary'
                                ];
                                return (
                                  <div 
                                    key={iIdx} 
                                    className={`h-[24px] flex-1 rounded-md border ${colors[intensity]} transition-colors duration-300 hover:scale-105`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-white/5 text-[10px] text-white/40 font-mono">
                        <span>Less</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-white/5 border border-white/5 rounded-sm" />
                          <div className="w-3 h-3 bg-primary/20 border border-primary/20 rounded-sm" />
                          <div className="w-3 h-3 bg-primary/70 border border-primary/75 rounded-sm" />
                          <div className="w-3 h-3 bg-primary border border-primary rounded-sm" />
                        </div>
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: AI TRENDS */}
                {activeSubTab === 'ai-trends' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-primary" /> AI Behavioral Trend Analysis
                      </h3>
                      <p className="text-xs text-white/50">Cognitive trends calculated automatically from focus session times and sleep quality metrics.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: 'The Wednesday Peak Effect', desc: 'Your focus session intensity index increases by 42% on Wednesdays. This matches with your post-workout schedule earlier in the morning.', type: 'positive' },
                        { title: 'Sleep Deprivation Penalty', desc: 'When sleep falls under 6 hours, your cognitive decay rate is 2.5x higher. Avoid late coding sprints if exam falls on the following day.', type: 'caution' },
                        { title: 'Morning Inertia Challenge', desc: 'Focus sessions started before 8 AM consistently last 35% shorter unless a 5-minute stretch routine is logged in the companion.', type: 'caution' }
                      ].map((t, idx) => (
                        <div 
                          key={idx} 
                          className={`p-5 rounded-2xl border ${
                            t.type === 'positive' 
                              ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300' 
                              : 'border-amber-500/25 bg-amber-500/5 text-amber-300'
                          }`}
                        >
                          <span className="font-display font-bold text-sm uppercase block tracking-wide">{t.title}</span>
                          <p className="text-xs text-white/70 mt-2 leading-relaxed">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: KNOWLEDGE GRAPH */}
                {activeSubTab === 'knowledge-graph' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" /> Interconnected Knowledge Map
                      </h3>
                      <p className="text-xs text-white/50">Visualization mapping subject mastery and document connections. Topics link automatically based on references.</p>
                    </div>

                    <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                      <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" />
                      
                      {/* Topic Bubble nodes mock */}
                      <div className="relative w-full max-w-md h-[220px]">
                        {[
                          { label: 'Rust Compiler', x: '10%', y: '10%', size: 'w-24 h-24', mastery: 85, color: 'bg-primary/20 border-primary' },
                          { label: 'UI Design', x: '60%', y: '15%', size: 'w-20 h-20', mastery: 76, color: 'bg-purple-500/20 border-purple-500' },
                          { label: 'Math/Algs', x: '35%', y: '50%', size: 'w-28 h-28', mastery: 92, color: 'bg-blue-500/20 border-blue-500' },
                          { label: 'German', x: '75%', y: '60%', size: 'w-20 h-20', mastery: 40, color: 'bg-amber-500/20 border-amber-500' }
                        ].map((node, idx) => (
                          <div 
                            key={idx}
                            className={`absolute rounded-full border-2 ${node.color} flex flex-col items-center justify-center p-3 select-none hover:scale-105 transition-transform cursor-pointer shadow-lg`}
                            style={{ left: node.x, top: node.y }}
                          >
                            <span className="text-[10px] font-bold text-white block leading-tight text-center">{node.label}</span>
                            <span className="text-[9px] font-mono text-white/40 block mt-1">{node.mastery}% Mastery</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: TALK TO CLONE */}
                {activeSubTab === 'digital-clone' && (
                  <div className="flex flex-col h-[500px] justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" /> Train Digital Clone Sync-Module
                      </h3>
                      <p className="text-xs text-white/50 border-b border-white/5 pb-4 mb-4">
                        Chat with your personal clone to check if its output aligns with your writing and thought style.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      {[
                        { label: 'Writing Style Sync', val: cloneStatus.styleSync },
                        { label: 'Notes Analyzed', val: cloneStatus.notesAnalyzed, isRaw: true },
                        { label: 'Goals Tracked', val: cloneStatus.goalsTracked, isRaw: true },
                        { label: 'Schedule Patterns', val: cloneStatus.scheduleMatch }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-black/45 border border-white/5 rounded-xl text-center">
                          <span className="text-[9px] text-white/40 font-mono block uppercase">{item.label}</span>
                          <span className="text-lg font-display font-bold text-white block mt-1">
                            {item.isRaw ? item.val : `${item.val}%`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                      {cloneMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-black font-medium rounded-tr-none' 
                              : 'bg-white/5 border border-white/10 text-white rounded-tl-none whitespace-pre-line'
                          }`}>
                            {msg.text}
                            <span className="block text-[10px] text-white/40 mt-1.5 text-right font-mono">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      {cloneTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 rounded-tl-none flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-75" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-150" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={cloneInput}
                        onChange={(e) => setCloneInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendClone()}
                        placeholder="Say something to test your clone's writing output..."
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all flex-grow text-sm"
                      />
                      <button 
                        onClick={handleSendClone}
                        className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-5 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
