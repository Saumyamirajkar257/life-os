'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { 
  Telescope, History, Compass, Users, Sparkles, BookOpen, 
  Send, RefreshCw, Star, ChevronRight, Play, Upload, Plus, 
  Trash2, ShieldAlert, Check, CheckCircle2, Award, Heart, Share2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useAIStore } from '@/store/useAIStore';
import { auth } from '@/lib/firebase';

type MainTab = 'replay' | 'radar' | 'build';
type SubTab = string;

export default function LifeVision() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<MainTab>('replay');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('monthly-wrapped');

  // Hydrate local stores
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { memory, lifeScore } = useAIStore();

  // Computations
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const focusHours = useMemo(() => {
    const taskHours = completedTasksCount * 0.5;
    const habitHours = habits.reduce((acc, h) => acc + h.completedDates.length * 0.3, 0);
    return Number((taskHours + habitHours).toFixed(1));
  }, [completedTasksCount, habits]);

  const uniqueTags = useMemo(() => {
    const allTags = new Set<string>();
    tasks.forEach(t => t.tags?.forEach(tag => allTags.add(tag)));
    habits.forEach(h => h.category && allTags.add(h.category));
    return Array.from(allTags);
  }, [tasks, habits]);

  // Interactive Monthly Wrapped State
  const [wrappedMonth, setWrappedMonth] = useState('May 2026');
  const [copiedWrapped, setCopiedWrapped] = useState(false);

  // Interactive Documentary State
  const [docMilestones, setDocMilestones] = useState([
    { title: 'Compiler Project Bootstrapped', date: 'May 04, 2026', type: 'code', desc: 'Initialized the rust implementation and set up base token parsing framework.' },
    { title: 'Habit Milestone: 30 Days Streak', date: 'May 16, 2026', type: 'habit', desc: 'Completed 30 consecutive days of systems architecture reviews and stretches.' },
    { title: 'Hackathon Final Submission', date: 'May 28, 2026', type: 'trophy', desc: 'Submitted distributed consensus visualizer app and received top-tier score.' }
  ]);

  // Opportunity Feed & Interceptor State
  const [oppFeed, setOppFeed] = useState([
    { title: 'Next-Gen Hackathon 2026', host: 'Major League Hacking', type: 'Hackathon', deadline: '12 days left', match: 96, applied: false },
    { title: 'Open Source Fellow 2026', host: 'Rust Foundation', type: 'Scholarship', deadline: '22 days left', match: 89, applied: false },
    { title: 'Systems Research Intern', host: 'Max Planck Institute', type: 'Internship', deadline: '3 days left', match: 93, applied: false }
  ]);

  // Build Together States
  const [teams, setTeams] = useState([
    { name: 'Quantum Devs', desc: 'Building next-generation distributed compilation infrastructure.', members: 3, progress: 65 },
    { name: 'BioIntel Sandbox', desc: 'Modeling DNA sequence neural nets for genomics studies.', members: 2, progress: 40 }
  ]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Idea Vault States
  const [ideas, setIdeas] = useState([
    { title: 'Decentralized Wasm Package Registry', desc: 'A secure package index utilizing content-addressable storage for lightning-fast compilation modules.', date: 'May 22, 2026', tags: ['wasm', 'rust'] },
    { title: 'Micro-Habits Gamified Companion', desc: 'Linking RPG character XP progress to real-world focus hours to enhance student routine building.', date: 'May 25, 2026', tags: ['game', 'health'] }
  ]);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaTags, setNewIdeaTags] = useState('');

  // Real-time Firestore Sync for Teams and Ideas
  useEffect(() => {
    if (activeTab !== 'build') return;

    // Listen to teams collection in real-time
    const teamsQuery = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
    const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
      const syncedTeams: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        syncedTeams.push({
          id: doc.id,
          name: data.name,
          desc: data.desc,
          members: data.members || 1,
          progress: data.progress || 10,
        });
      });
      // Only set if Firestore has records to prevent erasing visual mock states on empty DB
      if (syncedTeams.length > 0) {
        setTeams(syncedTeams);
      }
    }, (error) => {
      console.warn("Firestore teams sync error:", error);
    });

    // Listen to ideas collection in real-time
    const ideasQuery = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
    const unsubscribeIdeas = onSnapshot(ideasQuery, (snapshot) => {
      const syncedIdeas: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        syncedIdeas.push({
          id: doc.id,
          title: data.title,
          desc: data.desc,
          date: data.date || 'Just Now',
          tags: data.tags || ['general'],
        });
      });
      if (syncedIdeas.length > 0) {
        setIdeas(syncedIdeas);
      }
    }, (error) => {
      console.warn("Firestore ideas sync error:", error);
    });

    return () => {
      unsubscribeTeams();
      unsubscribeIdeas();
    };
  }, [activeTab]);

  // Actions
  const handleApplyOpp = (idx: number) => {
    const updated = [...oppFeed];
    updated[idx].applied = true;
    setOppFeed(updated);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await addDoc(collection(db, 'teams'), {
        name: newTeamName,
        desc: newTeamDesc || 'No description provided.',
        members: 1,
        progress: 10,
        createdAt: serverTimestamp(),
      });
      setNewTeamName('');
      setNewTeamDesc('');
      setShowTeamModal(false);
    } catch (err) {
      console.error("Failed to sync team to cloud, appending locally:", err);
      setTeams([...teams, {
        name: newTeamName,
        desc: newTeamDesc || 'No description provided.',
        members: 1,
        progress: 10
      }]);
      setNewTeamName('');
      setNewTeamDesc('');
      setShowTeamModal(false);
    }
  };

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    const tagList = newIdeaTags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      await addDoc(collection(db, 'ideas'), {
        title: newIdeaTitle,
        desc: newIdeaDesc,
        tags: tagList.length ? tagList : ['general'],
        date: 'Just Now',
        createdAt: serverTimestamp(),
      });
      setNewIdeaTitle('');
      setNewIdeaDesc('');
      setNewIdeaTags('');
    } catch (err) {
      console.error("Failed to sync idea to cloud, appending locally:", err);
      setIdeas([
        {
          title: newIdeaTitle,
          desc: newIdeaDesc,
          date: 'Just Now',
          tags: tagList.length ? tagList : ['general']
        },
        ...ideas
      ]);
      setNewIdeaTitle('');
      setNewIdeaDesc('');
      setNewIdeaTags('');
    }
  };

  const handleShareWrapped = () => {
    setCopiedWrapped(true);
    navigator.clipboard.writeText(`My LIFE OS Wrapped 🚀\n🔥 Deep Focus Hours: ${focusHours} hrs\n🏆 Objectives Completed: ${completedTasksCount} items\n🧠 Cognitive Life Score: ${lifeScore?.score || 84}/100\nJoin me on LIFE OS!`);
    setTimeout(() => setCopiedWrapped(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Initializing Life Vision & Replay...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Telescope className="w-9 h-9 text-primary" /> Life Vision & Replay
          </h1>
          <p className="text-white/40 mt-1.5 flex items-center gap-2">
            Cinematic monthly reports, opportunity match systems, and collaboration hubs.
            {activeTab === 'build' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                Live Cloud Sync Active
              </span>
            )}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit shrink-0">
          <button
            onClick={() => { setActiveTab('replay'); setActiveSubTab('monthly-wrapped'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'replay' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" /> Life Replay
          </button>
          <button
            onClick={() => { setActiveTab('radar'); setActiveSubTab('opp-radar'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'radar' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Opportunity Radar
          </button>
          <button
            onClick={() => { setActiveTab('build'); setActiveSubTab('build-team'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'build' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Build Together
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-[220px] bg-white/5 border border-white/10 rounded-2xl p-2.5 space-y-1 shrink-0">
          {activeTab === 'replay' && (
            <>
              <button
                onClick={() => setActiveSubTab('monthly-wrapped')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'monthly-wrapped' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Monthly Wrapped</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('life-doc')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'life-doc' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Life Documentary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'radar' && (
            <>
              <button
                onClick={() => setActiveSubTab('opp-radar')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'opp-radar' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Opportunity Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'build' && (
            <>
              <button
                onClick={() => setActiveSubTab('build-team')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'build-team' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Team Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('idea-vault')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'idea-vault' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Idea Vault</span>
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

                {/* SUB TAB: MONTHLY WRITTEN WRAPPED */}
                {activeSubTab === 'monthly-wrapped' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" /> Cinematic Monthly Wrapped Report
                      </h3>
                      <p className="text-xs text-white/50">Spotify-wrapped style insights mapping your monthly productivity milestones.</p>
                    </div>

                    {/* wrapped card mock */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 font-display text-[150px] font-extrabold select-none leading-none -translate-y-8">
                        2026
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                          <div>
                            <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider">Life OS Wrapped</span>
                            <h4 className="text-2xl font-display font-extrabold text-white mt-0.5">{wrappedMonth}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-semibold">
                            Rank #42 Global
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-black/45 border border-white/5 text-center">
                            <span className="text-[10px] text-white/40 font-mono block">DEEP FOCUS HOURS</span>
                            <span className="text-3xl font-display font-extrabold text-white block mt-1.5">{focusHours} hrs</span>
                            <span className="text-[9px] text-emerald-400 font-mono font-semibold block mt-1">Top 3% of Students</span>
                          </div>

                          <div className="p-4 rounded-xl bg-black/45 border border-white/5 text-center">
                            <span className="text-[10px] text-white/40 font-mono block">TASKS COMPLETED</span>
                            <span className="text-3xl font-display font-extrabold text-white block mt-1.5">{completedTasksCount} Items</span>
                            <span className="text-[9px] text-primary font-mono font-semibold block mt-1">94% consistency</span>
                          </div>

                          <div className="p-4 rounded-xl bg-black/45 border border-white/5 text-center">
                            <span className="text-[10px] text-white/40 font-mono block">SKILLS REFINED</span>
                            <span className="text-3xl font-display font-extrabold text-white block mt-1.5">{uniqueTags.length} Topics</span>
                            <span className="text-[9px] text-purple-400 font-mono font-semibold block mt-1">{uniqueTags.slice(0, 4).join(', ') || 'General'}</span>
                          </div>
                        </div>

                        {/* Top Mood Segment */}
                        <div className="p-4.5 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-white/40 font-mono uppercase">AI Vibe Analysis</span>
                            <span className="text-base font-semibold text-white block mt-0.5">Focus Mode Dominance: The {memory.strongHabit || 'Productivity'} Architect</span>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed max-w-xl">
                              You spent most of your study session in uninterrupted deep work phases, peaking around your best focus block of {memory.bestFocusTime || 'evening'} with low context switching, while successfully overcoming your prime weakness of "{memory.mainWeakness || 'fatigue'}".
                            </p>
                          </div>
                          
                          <button 
                            onClick={handleShareWrapped}
                            className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-4 py-2.5 text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 self-start md:self-center"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{copiedWrapped ? 'Copied Stats!' : 'Share to Instagram'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: LIFE DOCUMENTARY */}
                {activeSubTab === 'life-doc' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" /> Auto-Generated Life Documentary
                      </h3>
                      <p className="text-xs text-white/50">Chronological compilation of saved repository state benchmarks, completed projects, and habit milestones.</p>
                    </div>

                    {/* Timeline List */}
                    <div className="relative border-l border-white/10 pl-6 space-y-8 ml-3 py-2">
                      {docMilestones.map((mil, idx) => (
                        <div key={idx} className="relative">
                          {/* Circle indicator */}
                          <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-black border-2 border-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                          
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[10px] text-white/40 font-mono">{mil.date}</span>
                                <h4 className="text-sm font-bold text-white mt-0.5">{mil.title}</h4>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider">
                                {mil.type}
                              </span>
                            </div>
                            <p className="text-xs text-white/60 mt-2 leading-relaxed">{mil.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: OPPORTUNITY FEED */}
                {activeSubTab === 'opp-radar' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-primary" /> AI Opportunity Interceptor Radar
                      </h3>
                      <p className="text-xs text-white/50">Matches global scholarships, hackathons, and research positions to your career goals and skill profiles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {oppFeed.map((opp, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-semibold uppercase">
                                {opp.type}
                              </span>
                              <span className="text-xs font-mono font-bold text-emerald-400">{opp.match}% AI Match</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-3">{opp.title}</h4>
                            <span className="text-xs text-white/40 block mt-0.5">{opp.host}</span>
                            <span className="text-xs text-white/50 font-mono block mt-2">Deadline: {opp.deadline}</span>
                          </div>

                          <button
                            onClick={() => handleApplyOpp(idx)}
                            disabled={opp.applied}
                            className={`w-full mt-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                              opp.applied 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-white text-black hover:opacity-90'
                            }`}
                          >
                            {opp.applied ? <CheckCircle2 className="w-4 h-4" /> : null}
                            <span>{opp.applied ? 'Applied Successfully' : 'Apply Now'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: TEAM PROJECTS */}
                {activeSubTab === 'build-team' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" /> Build Together Workspace
                        </h3>
                        <p className="text-xs text-white/50">Form or join collaborative student teams to track startup ideas, hackathons, and assignments.</p>
                      </div>
                      <button 
                        onClick={() => setShowTeamModal(true)}
                        className="rounded-xl bg-white text-black font-semibold text-xs px-3.5 py-2 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Team</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teams.map((t, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-base font-display font-bold text-white">{t.name}</h4>
                              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px]">
                                {t.members} Members
                              </span>
                            </div>
                            <p className="text-xs text-white/50 mt-2 leading-relaxed min-h-[40px]">{t.desc}</p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-white/5">
                            <div className="flex justify-between text-[10px] text-white/40 mb-1 font-mono">
                              <span>Milestone Completion</span>
                              <span>{t.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${t.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showTeamModal && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 relative"
                        >
                          <h4 className="text-lg font-display font-bold text-white mb-4">Initialize Team Workspace</h4>
                          <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                              <label className="block text-xs text-white/40 font-semibold mb-2 uppercase tracking-wide">Workspace Name</label>
                              <input 
                                type="text" 
                                required
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="e.g. distributed-compilers"
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 font-semibold mb-2 uppercase tracking-wide">Short Description</label>
                              <textarea 
                                value={newTeamDesc}
                                onChange={(e) => setNewTeamDesc(e.target.value)}
                                placeholder="State what projects you will build together..."
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full text-sm min-h-[80px]"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button 
                                type="button"
                                onClick={() => setShowTeamModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:opacity-90"
                              >
                                Create Workspace
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB TAB: IDEA VAULT */}
                {activeSubTab === 'idea-vault' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" /> Encrypted Idea Vault
                      </h3>
                      <p className="text-xs text-white/50">Capture spontaneous ideas, hackathon drafts, or research concepts. Categorize with neural tags.</p>
                    </div>

                    {/* Add Idea Form */}
                    <form onSubmit={handleAddIdea} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                      <span className="text-xs font-bold text-white block">Quick Add Concept</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={newIdeaTitle}
                          onChange={(e) => setNewIdeaTitle(e.target.value)}
                          placeholder="Idea Title/Concept name"
                          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none text-xs"
                        />
                        <input
                          type="text"
                          value={newIdeaTags}
                          onChange={(e) => setNewIdeaTags(e.target.value)}
                          placeholder="Tags (comma separated e.g. rust, server)"
                          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none text-xs"
                        />
                      </div>
                      <textarea
                        value={newIdeaDesc}
                        onChange={(e) => setNewIdeaDesc(e.target.value)}
                        placeholder="Describe the technical details, implementation mechanics..."
                        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none w-full text-xs min-h-[60px]"
                      />
                      <button 
                        type="submit"
                        className="rounded-xl bg-white text-black font-semibold text-xs px-4 py-2.5 transition-all hover:opacity-90 flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Store Idea</span>
                      </button>
                    </form>

                    {/* Idea Cards List */}
                    <div className="space-y-3 mt-4">
                      {ideas.map((idea, idx) => (
                        <div key={idx} className="p-4.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                            <span className="text-[10px] text-white/30 font-mono">{idea.date}</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{idea.desc}</p>
                          <div className="flex gap-1.5 pt-1.5">
                            {idea.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded bg-white/10 text-white/50 text-[9px] font-mono">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
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
