'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Award, Heart, Share2, Users, MessageSquare, 
  Sparkles, ShieldAlert, Zap, Lock, Unlock, Plus, ArrowUpRight, Camera, CheckCircle2,
  Clock, Settings, ChevronRight, ChevronLeft, UserPlus, Send, RefreshCw, HelpCircle, Home
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { useFriendsStore } from '@/store/useFriendsStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';

type Tab = 'social' | 'rewards' | 'twin';

export default function StudentHub() {
  const [activeTab, setActiveTab] = useState<Tab>('social');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          🏆 Student Hub
        </h1>
        <p className="text-white/40">Connect, compete, customize, and unlock insights with your AI digital twin.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'social' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Compete & Social
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rewards' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" /> Growth & Rewards
        </button>
        <button
          onClick={() => setActiveTab('twin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'twin' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Digital Twin
        </button>
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'social' && <SocialWorkspace />}
          {activeTab === 'rewards' && <RewardsWorkspace />}
          {activeTab === 'twin' && <TwinWorkspace />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SocialWorkspace() {
  const [subTool, setSubTool] = useState<'leaderboard' | 'cards' | 'rooms' | 'community' | 'friends'>('rooms');
  const { 
    friendsList, 
    friendRequests, 
    toggleFriendship, 
    addFriend, 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    cancelFriendRequest 
  } = useFriendsStore();

  const { userName, userHandle, userPfp } = useAppStore();

  // Study Rooms
  const [rooms, setRooms] = useState([
    { id: 'iitpk', name: 'IITPK study group', users: 16, tags: ['JEE Prep', 'Desks Grid', 'Active'] },
    { id: '1', name: 'MIT Deep Focus', users: 14, tags: ['Silent', 'STEM'] },
    { id: '2', name: 'Exam Prep Sprint', users: 8, tags: ['Co-Working', 'Bio'] },
    { id: '3', name: 'Pomodoro Library', users: 22, tags: ['25/5 Timer'] }
  ]);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  // Mobile Simulator state inside Joined IITPK Room
  const [simulatorTab, setSimulatorTab] = useState<'home' | 'attendance' | 'rankings' | 'invite' | 'chat'>('home');
  const [selectedDesk, setSelectedDesk] = useState<string>('aarryya');
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [livePresence, setLivePresence] = useState<any[]>([]);

  // 1. Live presence handler
  useEffect(() => {
    if (joinedRoom !== 'IITPK study group') return;
    
    // Create a sanitized handle for document ID
    const userHandleClean = userHandle ? userHandle.replace('@', '') : 'User_' + Math.random().toString(36).substring(7);
    const presenceRef = doc(db, 'study_rooms', 'IITPK', 'presence', userHandleClean);

    // Initial sign-in presence
    setDoc(presenceRef, {
      name: userName || 'Saumya',
      handle: userHandle || '@Sam_257',
      online: true,
      time: '0:00:00',
      lastActive: serverTimestamp()
    }).catch(err => console.warn("Firestore offline presence:", err));

    // Periodically update active time
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const secs = Math.floor((elapsedMs / 1000) % 60);
      const mins = Math.floor((elapsedMs / (1000 * 60)) % 60);
      const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
      const formattedTime = `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      setDoc(presenceRef, {
        name: userName || 'Saumya',
        handle: userHandle || '@Sam_257',
        online: true,
        time: formattedTime,
        lastActive: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }, 15000);

    // Subscribe to all live room presence documents
    const presenceQuery = query(collection(db, 'study_rooms', 'IITPK', 'presence'));
    const unsubscribePresence = onSnapshot(presenceQuery, (snap) => {
      const active: any[] = [];
      snap.forEach(d => {
        const data = d.data();
        // Fallback for missing timestamps during offline or local state testing
        const lastActiveTime = data.lastActive?.toDate?.() || new Date();
        const diffSeconds = (new Date().getTime() - lastActiveTime.getTime()) / 1000;
        
        // Active within 60s
        if (diffSeconds < 60 && data.online) {
          active.push(data);
        }
      });
      setLivePresence(active);
    }, (err) => {
      console.warn("Firestore presence listener error:", err);
    });

    return () => {
      clearInterval(interval);
      unsubscribePresence();
      deleteDoc(presenceRef).catch(() => {});
    };
  }, [joinedRoom, userName, userHandle]);

  // 2. Live chats handler
  useEffect(() => {
    if (joinedRoom !== 'IITPK study group') return;
    
    const chatsRef = collection(db, 'study_rooms', 'IITPK', 'chats');
    const q = query(chatsRef, orderBy('createdAt', 'asc'), limit(50));
    
    const unsubscribeChats = onSnapshot(q, (snap) => {
      const msgs: any[] = [];
      snap.forEach(d => {
        const data = d.data();
        const t = data.createdAt?.toDate?.() || new Date();
        msgs.push({
          sender: data.sender,
          text: data.text,
          time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
      if (msgs.length > 0) {
        setChatMessages(msgs);
      } else {
        setChatMessages([
          { sender: 'Swaraj', text: 'How is everyone solving the Thermodynamics problems today?', time: '1:10 PM' },
          { sender: 'Rucha', text: 'Stuck on Q5 of the HC Verma package. The friction factor is tricky.', time: '1:12 PM' },
          { sender: 'aarryya', text: 'Loving this Life OS focus space, keeps me locked in. Logged 7h already!', time: '1:18 PM' },
          { sender: 'Soojit', text: 'Is anyone online for chemistry organic revision?', time: '1:22 PM' }
        ]);
      }
    }, (err) => {
      console.warn("Firestore chats listener error:", err);
    });

    return () => {
      unsubscribeChats();
    };
  }, [joinedRoom]);

  const handleSendMessage = async () => {
    if (!typedMessage.trim()) return;
    const msgText = typedMessage.trim();
    setTypedMessage('');
    
    // Local optimistic append
    setChatMessages(prev => [
      ...prev,
      { sender: userName || 'You', text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    try {
      await addDoc(collection(db, 'study_rooms', 'IITPK', 'chats'), {
        sender: userName || 'You',
        text: msgText,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Failed to write live chat message", err);
    }
  };

  // Reconstruct deskData combining local defaults with live database occupants
  const mergedDesks = useMemo(() => {
    const defaultDesks = [
      { name: 'Swaraj', time: '10:45:52', hasClock: true, isOnline: true },
      { name: 'Rucha', time: '10:21:55', hasClock: true, isOnline: true },
      { name: 'NotSwaraj', time: '7:31:53', hasClock: false, isOnline: true },
      { name: 'aarryya', time: '7:21:22', hasClock: true, isOnline: true },
      { name: 'anaya', time: '6:19:06', hasClock: false, isOnline: false },
      { name: 'Soojit', time: '5:46:01', hasClock: false, isOnline: true },
      { name: 'Akshara', time: '5:17:26', hasClock: false, isOnline: false },
      { name: 'Sarthak', time: '5:16:29', hasClock: false, isOnline: true, hasChart: true },
      { name: 'vviinneell', time: '5:00:03', hasClock: false, isOnline: true },
      { name: 'hiiamharsh', time: '4:35:43', hasClock: false, isOnline: true },
      { name: 'radhika w.', time: '3:25:55', hasClock: false, isOnline: false },
      { name: 'Gargi Kulk', time: '0:34:56', hasClock: false, isOnline: true },
      { name: 'komald_2', time: '0:00:02', hasClock: false, isOnline: false },
      { name: 'Ranveer', time: '0:00:00', hasClock: false, isOnline: false },
      { name: 'Ak00000', time: '0:00:00', hasClock: false, isOnline: false },
      { name: 'Patil Ojas', time: '0:00:00', hasClock: false, isOnline: false }
    ];

    const result = [...defaultDesks];
    livePresence.forEach((user) => {
      const cleanName = user.name || 'You';
      const cleanHandle = (user.handle || '@User').replace('@', '');
      
      // Look if they match by handle or name
      const idx = result.findIndex(d => 
        d.name.toLowerCase() === cleanName.toLowerCase() || 
        d.name.toLowerCase() === cleanHandle.toLowerCase()
      );
      if (idx !== -1) {
        result[idx].isOnline = true;
        result[idx].time = user.time || result[idx].time;
      } else {
        // Find an offline slot to place this live peer
        const offIdx = result.findIndex(d => !d.isOnline && d.name !== 'You');
        if (offIdx !== -1) {
          result[offIdx] = {
            name: cleanHandle,
            time: user.time || '0:00:05',
            hasClock: true,
            isOnline: true
          };
        }
      }
    });

    return result;
  }, [livePresence]);

  const deskData = mergedDesks;

  // Leaderboards
  const [leaderboardFilter, setLeaderboardFilter] = useState<'hours' | 'productivity' | 'college'>('hours');
  const leadBoardData = {
    hours: [
      { rank: 1, name: 'Swaraj', stat: '52 hrs/wk', college: 'Stanford' },
      { rank: 2, name: 'Rucha', stat: '48 hrs/wk', college: 'MIT' },
      { rank: 3, name: 'You', stat: '44 hrs/wk', college: 'UCLA', isUser: true },
      { rank: 4, name: 'aarryya', stat: '39 hrs/wk', college: 'UCLA' }
    ],
    productivity: [
      { rank: 1, name: 'Rucha', stat: '98 pts', college: 'MIT' },
      { rank: 2, name: 'You', stat: '92 pts', college: 'UCLA', isUser: true },
      { rank: 3, name: 'Swaraj', stat: '89 pts', college: 'Stanford' },
      { rank: 4, name: 'aarryya', stat: '85 pts', college: 'UCLA' }
    ],
    college: [
      { rank: 1, name: 'MIT', stat: '42.8 avg hrs', college: 'Boston, MA' },
      { rank: 2, name: 'Stanford', stat: '40.2 avg hrs', college: 'Stanford, CA' },
      { rank: 3, name: 'UCLA', stat: '37.5 avg hrs', college: 'Los Angeles, CA' },
      { rank: 4, name: 'Harvard', stat: '36.1 avg hrs', college: 'Cambridge, MA' }
    ]
  };

  // Community
  const [posts, setPosts] = useState([
    { id: '1', title: 'Ultimate Organic Chemistry Anki Deck', author: 'Dr_Carbon', upvotes: 142, type: 'Resources' },
    { id: '2', title: 'How I optimized my focus using Pomodoro and soundscapes', author: 'FlowState', upvotes: 89, type: 'Tips' },
    { id: '3', title: 'Anyone want to group study for AP Calculus BC?', author: 'derivativ_guy', upvotes: 34, type: 'Doubts' }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostType, setNewPostType] = useState('Resources');

  const addPost = () => {
    if (!newPostTitle) return;
    setPosts([{ id: Date.now().toString(), title: newPostTitle, author: 'You', upvotes: 1, type: newPostType }, ...posts]);
    setNewPostTitle('');
  };

  // Calculate stats for IITPK Group
  const activeMembersCount = deskData.filter(d => d.isOnline).length;

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'rooms', label: 'Study Rooms', icon: Users },
          { id: 'friends', label: 'Focus Friends', icon: Users },
          { id: 'leaderboard', label: 'Leaderboards', icon: Trophy },
          { id: 'cards', label: 'Shareable Cards', icon: Camera },
          { id: 'community', label: 'Student Nexus', icon: MessageSquare },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSubTool(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                subTool === item.id 
                  ? 'bg-white/10 text-white border-l-2 border-primary' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <GlassCard className="p-8 min-h-[400px]">
        {subTool === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Student Leaderboard</h3>
              <select
                value={leaderboardFilter}
                onChange={(e) => setLeaderboardFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="hours">Study Hours</option>
                <option value="productivity">Productivity Rating</option>
                <option value="college">Top Colleges</option>
              </select>
            </div>

            <div className="space-y-2">
              {leadBoardData[leaderboardFilter].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    (item as any).isUser 
                      ? 'bg-primary/10 border-primary/40 text-primary-foreground' 
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-lg font-bold w-6 text-center text-white/40">#{item.rank}</span>
                    {leaderboardFilter !== 'college' && (
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {(() => {
                          if ((item as any).isUser) {
                            return userPfp ? (
                              <img src={userPfp} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-xs uppercase text-white/60">{item.name.slice(0, 2)}</span>
                            );
                          }
                          const foundFriend = friendsList.find(f => f.name.toLowerCase() === item.name.toLowerCase());
                          return foundFriend?.pfp ? (
                            <img src={foundFriend.pfp} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs uppercase text-white/60">{item.name.slice(0, 2)}</span>
                          );
                        })()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white/95">{item.name}</h4>
                      <p className="text-xs text-white/40">{item.college}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-white/80">{item.stat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'cards' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Shareable Achievement Cards</h3>
            <p className="text-white/40 text-sm">Download or generate customized, design-curated cards to share your weekly progress on Instagram Stories or Twitter.</p>

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {[
                { title: 'Weekly Focus', tag: 'Studied 44 hours this week.', bg: 'from-purple-900 to-indigo-950 border-purple-500/30' },
                { title: 'Life Score Card', tag: 'Overall Life Score: 92/100', bg: 'from-emerald-950 to-teal-950 border-emerald-500/30' }
              ].map((card, i) => (
                <div key={i} className={`p-8 rounded-3xl bg-gradient-to-br ${card.bg} border flex flex-col justify-between h-64 relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Sync Metrics</span>
                    <h4 className="text-2xl font-bold text-white leading-tight">{card.tag}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/60">LIFE OS</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'rooms' && (
          <div className="space-y-6">
            {joinedRoom ? (
              joinedRoom === 'IITPK study group' ? (
                /* High-fidelity Mobile View Simulator for IITPK study group */
                <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
                  {/* Left Side: Room Details Panel */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                        Live Study Session
                      </span>
                      <h3 className="text-3xl font-display font-bold text-white mt-3">IITPK Study Group Simulator</h3>
                      <p className="text-white/40 text-sm mt-1">
                        Interact directly with the team. Tap on any desk to check student data, manage focus friendships, or configure privacy parameters.
                      </p>
                    </div>

                    {/* Dynamic Desk Details Card */}
                    {(() => {
                      const selectedDeskObj = deskData.find(d => d.name === selectedDesk);
                      const storeFriend = friendsList.find(f => f.name.toLowerCase() === selectedDesk.toLowerCase());
                      const isFriend = storeFriend?.isFriend ?? false;
                      
                      return (
                        <GlassCard className="p-6 border-white/10 bg-white/[0.02]">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white overflow-hidden shrink-0">
                                {storeFriend?.pfp ? (
                                  <img src={storeFriend.pfp} alt={selectedDesk} className="w-full h-full object-cover" />
                                ) : (
                                  selectedDesk.slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white text-base">{selectedDesk}</h4>
                                <p className="text-xs text-white/40">{storeFriend?.college || 'External Node'}</p>
                              </div>
                            </div>
                            
                            <span className={cn(
                              "text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border",
                              selectedDeskObj?.isOnline 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                            )}>
                              {selectedDeskObj?.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>

                          <div className="mt-5 space-y-4">
                            <div className="p-3 bg-black/25 rounded-xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-white/40">Logged Focus Duration</span>
                                <span className="font-mono font-bold text-primary-foreground">
                                  {isFriend ? (selectedDeskObj?.time || '00:00:00') : '🔒 Private (Non-Friend)'}
                                </span>
                              </div>
                              {isFriend && storeFriend && (
                                <div className="text-[10px] text-white/50 border-t border-white/5 pt-2 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span className="truncate">{storeFriend.appsBreakdown}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-2">
                              <p className="text-[11px] text-white/40 max-w-[200px]">
                                {isFriend 
                                  ? "You are sharing screen times mutually with this student." 
                                  : "Screen time is hidden. Add them as friend to unlock logs."}
                              </p>
                              
                              <button
                                onClick={() => {
                                  if (storeFriend) {
                                    toggleFriendship(storeFriend.id);
                                  } else {
                                    addFriend(selectedDesk);
                                  }
                                }}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-wide border transition-all shrink-0",
                                  isFriend
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                                    : "bg-white text-black border-white hover:opacity-90"
                                )}
                              >
                                {isFriend ? 'Lock Screen Time' : 'Unlock Screen Time'}
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      );
                    })()}

                    {/* Room Information Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-mono text-white/30 uppercase block">Active desks</span>
                        <span className="text-2xl font-bold text-white mt-1">{activeMembersCount} / 16</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-mono text-white/30 uppercase block">Friends Sharing</span>
                        <span className="text-2xl font-bold text-indigo-400 mt-1">
                          {friendsList.filter(f => f.isFriend && deskData.some(d => d.name === f.name)).length} members
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setJoinedRoom(null)}
                      className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-semibold"
                    >
                      ← Back to study rooms
                    </button>
                  </div>

                  {/* Right Side: Phone simulator container */}
                  <div className="mx-auto w-full max-w-[390px] border-[8px] border-[#221f1d] rounded-[48px] bg-[#0D0B0A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden font-sans relative flex flex-col h-[680px]">
                    
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white/80 font-mono text-xs select-none">
                      <span className="font-semibold">1:25</span>
                      {/* Speaker notch */}
                      <div className="w-24 h-4 bg-[#221f1d] rounded-full absolute left-1/2 transform -translate-x-1/2 top-1" />
                      <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                        <span>32%</span>
                        {/* Battery Icon */}
                        <div className="w-5 h-2.5 border border-white/40 rounded-sm p-0.5 flex items-center">
                          <div className="h-full w-2/3 bg-white/80 rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Room Header */}
                    <div className="flex justify-between items-center px-4 py-2 border-b border-[#1b1918]">
                      <button 
                        onClick={() => setJoinedRoom(null)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h4 className="font-display font-semibold text-sm text-[#e0dddb]">IITPK study group</h4>
                      <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <Settings className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Interactive rules banner */}
                    <div className="px-4 py-2">
                      <button 
                        onClick={() => setRulesExpanded(!rulesExpanded)}
                        className="w-full flex items-center justify-between bg-[#1B1817] hover:bg-[#252120] border border-[#2B2725] rounded-xl px-3 py-2 text-left transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-[#d3ceca]">
                          <span className="text-sm">📢</span>
                          <span className="font-medium">Group introduction/rules</span>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 text-white/40 transition-transform", rulesExpanded && "rotate-90")} />
                      </button>
                      
                      <AnimatePresence>
                        {rulesExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#141211] border-x border-b border-[#2B2725] rounded-b-xl px-4 py-3 text-[10px] text-white/50 space-y-1.5 overflow-hidden"
                          >
                            <p className="font-bold text-white/70">IITPK Rules & Guidelines:</p>
                            <p>• Desk lamp MUST remain glowing while focused.</p>
                            <p>• Sync local calendars to post agenda items.</p>
                            <p>• Only mutual friends can review screen breakdowns.</p>
                            <p>• JEE/NEET Mock tests checks count 2x XP.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Active study indicators */}
                    <div className="px-4 py-1 flex items-center justify-between text-[11px] text-white/40">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#a5435b] font-medium font-sans">Studying</span>
                        <span className="text-[#a5435b] font-bold font-sans">0 members</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a5435b] animate-pulse ml-0.5" />
                      </div>
                      
                      {/* Target Icon */}
                      <button className="p-1 rounded-full border border-[#252220] bg-[#141211] text-[#a5435b]">
                        <svg className="w-3.5 h-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                          <circle cx="12" cy="12" r="4" fill="currentColor" />
                        </svg>
                      </button>
                    </div>

                    {/* Main Simulator Content (Switchable Tabs) */}
                    <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
                      
                      {/* 1. HOME TAB (DESKS GRID) */}
                      {simulatorTab === 'home' && (
                        <div className="grid grid-cols-4 gap-x-2 gap-y-3.5 pt-2 pb-6">
                          {deskData.map((item) => {
                            const storeFriend = friendsList.find(f => f.name.toLowerCase() === item.name.toLowerCase());
                            const isFriend = storeFriend?.isFriend ?? false;
                            const isSelected = selectedDesk === item.name;

                            // SVG Color variables
                            const lampColor = item.isOnline ? '#eab308' : '#4b4846';
                            const deskStrokeColor = isSelected ? '#FFFFFF' : item.isOnline ? '#dcdad7' : '#4b4846';
                            const isGlowing = item.isOnline;

                            return (
                              <button
                                key={item.name}
                                onClick={() => setSelectedDesk(item.name)}
                                className={cn(
                                  "flex flex-col items-center p-1 rounded-xl transition-all relative border border-transparent hover:bg-white/[0.02]",
                                  isSelected && "border-white/20 bg-white/[0.04] shadow-md"
                                )}
                              >
                                {/* Desk Drawing SVG */}
                                <div className="w-14 h-11 relative">
                                  <svg className="w-full h-full" viewBox="0 0 60 40" fill="none">
                                    {/* Lamp stand & lampshade */}
                                    <line x1="42" y1="26" x2="42" y2="10" stroke={lampColor} strokeWidth="1.5" />
                                    <path d="M37 10 L47 10 L49 15 L35 15 Z" fill={lampColor} />
                                    
                                    {/* Glowing light beam overlay */}
                                    {isGlowing && (
                                      <polygon points="42,15 28,32 56,32" fill="rgba(234, 179, 8, 0.08)" />
                                    )}
                                    
                                    {/* Clock indicator */}
                                    {item.hasClock && (
                                      <g transform="translate(16, 12)">
                                        <circle cx="0" cy="0" r="4.5" stroke={deskStrokeColor} strokeWidth="1" />
                                        <line x1="0" y1="0" x2="0" y2="-2.5" stroke={deskStrokeColor} strokeWidth="1" />
                                        <line x1="0" y1="0" x2="1.5" y2="0" stroke={deskStrokeColor} strokeWidth="1" />
                                      </g>
                                    )}

                                    {/* Desk Top */}
                                    <line x1="8" y1="26" x2="52" y2="26" stroke={deskStrokeColor} strokeWidth="1.8" />
                                    
                                    {/* Legs */}
                                    <line x1="12" y1="26" x2="12" y2="36" stroke={deskStrokeColor} strokeWidth="1.5" />
                                    <line x1="48" y1="26" x2="48" y2="36" stroke={deskStrokeColor} strokeWidth="1.5" />
                                    
                                    {/* Under-shelf */}
                                    <line x1="12" y1="31" x2="48" y2="31" stroke={deskStrokeColor} strokeWidth="0.8" />
                                  </svg>

                                  {/* Sarthak Tiny index chart icon */}
                                  {item.hasChart && (
                                    <div className="absolute right-1 bottom-4 bg-[#70212f] text-white p-0.5 rounded-[2px] border border-[#a23d4c] scale-75">
                                      <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 12l3-3 3 3 4-4M8 21h8" />
                                      </svg>
                                    </div>
                                  )}

                                  {/* Privacy Overlay Lock icon */}
                                  {!isFriend && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#0D0B0A]/40 backdrop-blur-[0.5px] rounded-lg">
                                      <Lock className="w-3.5 h-3.5 text-white/30" />
                                    </div>
                                  )}
                                </div>

                                {/* Student Name */}
                                <span className="text-[9px] text-[#8e8a86] font-medium mt-1 truncate max-w-full block">
                                  {item.name}
                                </span>

                                {/* Screen Time Logs */}
                                <span className={cn(
                                  "text-[8px] font-mono mt-0.5 select-none",
                                  isFriend ? "text-[#a59f99]" : "text-[#4b4846] italic"
                                )}>
                                  {isFriend ? item.time : 'Locked'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. ATTENDANCE TAB */}
                      {simulatorTab === 'attendance' && (
                        <div className="space-y-3 py-2 text-xs">
                          <div className="p-3 bg-[#1B1817] border border-[#2B2725] rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="text-white/40 text-[9px] uppercase font-mono">My Daily Streak</p>
                              <p className="text-lg font-bold text-white mt-0.5">12 Days Active</p>
                            </div>
                            <button className="px-3.5 py-1.5 rounded-xl bg-white text-black font-bold font-mono text-[10px]">
                              Check In
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Recent activity logs</p>
                            {[
                              { user: 'Swaraj', status: 'Checked in', time: '9:30 AM' },
                              { user: 'Rucha', status: 'Checked in', time: '9:45 AM' },
                              { user: 'aarryya', status: 'Checked in', time: '10:00 AM' },
                              { user: 'You', status: 'Checked in', time: '11:20 AM' },
                              { user: 'Soojit', status: 'Checked in', time: '12:15 PM' }
                            ].map((log, idx) => (
                              <div key={idx} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between text-[11px]">
                                <span className="font-medium text-white/80">{log.user}</span>
                                <div className="flex gap-2 text-white/40">
                                  <span>{log.status}</span>
                                  <span>·</span>
                                  <span>{log.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. RANKINGS TAB */}
                      {simulatorTab === 'rankings' && (
                        <div className="space-y-2.5 py-2">
                          <p className="text-[10px] text-[#8e8a86] uppercase tracking-wider font-mono">IITPK Group Leaderboard</p>
                          <div className="space-y-1.5">
                            {deskData.map((d, index) => {
                              const storeFriend = friendsList.find(f => f.name.toLowerCase() === d.name.toLowerCase());
                              const isFriend = storeFriend?.isFriend ?? false;

                              return (
                                <div 
                                  key={d.name} 
                                  className={cn(
                                    "p-2.5 rounded-xl border flex justify-between items-center text-xs",
                                    d.name === 'aarryya' ? "bg-white/5 border-white/10" : "bg-[#141211] border-[#252220]"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-[#8e8a86] w-4 font-bold">#{index + 1}</span>
                                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                      {storeFriend?.pfp ? (
                                        <img src={storeFriend.pfp} alt={d.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-[8px] font-bold text-white/55 uppercase">{d.name.slice(0, 1)}</span>
                                      )}
                                    </div>
                                    <span className="font-semibold text-white/90">{d.name}</span>
                                  </div>
                                  <span className="font-mono text-white/50 text-[10px]">
                                    {isFriend ? d.time : '🔒 Private'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 4. INVITE TAB */}
                      {simulatorTab === 'invite' && (
                        <div className="py-6 text-center space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary">
                            <UserPlus className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">Add Team Members</h4>
                            <p className="text-white/40 text-[11px] max-w-[200px] mx-auto mt-1">
                              Send this code or link to classmates to invite them directly to the IITPK group.
                            </p>
                          </div>
                          
                          <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-white max-w-[240px] mx-auto select-all">
                            IITPK-JEE-2026
                          </div>

                          <button 
                            onClick={() => alert("Simulated: Invite code copied to clipboard!")}
                            className="px-4 py-2 bg-white text-black rounded-xl font-bold text-xs hover:opacity-90 transition-all"
                          >
                            Copy Invite Code
                          </button>
                        </div>
                      )}

                      {/* 5. CHAT TAB */}
                      {simulatorTab === 'chat' && (
                        <div className="flex flex-col h-[400px] justify-between pb-3">
                          {/* Messages list */}
                          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                            {chatMessages.map((msg, idx) => {
                              const isMe = msg.sender === 'You';
                              return (
                                <div key={idx} className={cn(
                                  "flex flex-col max-w-[80%]",
                                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                  <span className="text-[9px] text-white/30 font-mono mb-0.5">{msg.sender} · {msg.time}</span>
                                  <div className={cn(
                                    "p-2.5 rounded-2xl leading-normal text-[11px]",
                                    isMe 
                                      ? "bg-indigo-600 text-white rounded-tr-none" 
                                      : "bg-[#1B1817] border border-[#2B2725] text-white/80 rounded-tl-none"
                                  )}>
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Message Input bar */}
                          <div className="flex items-center gap-2 border-t border-[#1b1918] pt-2.5 mt-2 bg-[#0D0B0A]">
                            <input
                              type="text"
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Message team..."
                              className="flex-1 bg-[#1B1817] border border-[#2B2725] rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/40"
                            />
                            <button 
                              onClick={handleSendMessage}
                              className="p-2 bg-white text-black rounded-xl hover:opacity-90 transition-all"
                            >
                              <Send className="w-3.5 h-3.5 fill-black" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Navigation Dock */}
                    <div className="grid grid-cols-5 border-t border-[#1b1918] bg-[#141211] py-1 select-none">
                      {[
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'attendance', label: 'Attendance', icon: Clock },
                        { id: 'rankings', label: 'Rankings', icon: Trophy },
                        { id: 'invite', label: 'Invite', icon: UserPlus },
                        { id: 'chat', label: 'Chat', icon: MessageSquare }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isCurrent = simulatorTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSimulatorTab(tab.id as any)}
                            className="flex flex-col items-center justify-center py-1.5 gap-0.5 text-white/40 hover:text-white/80 transition-colors"
                          >
                            <Icon className={cn("w-4.5 h-4.5", isCurrent ? "text-white" : "text-white/45")} />
                            <span className={cn("text-[8px] font-medium font-sans", isCurrent ? "text-white font-bold" : "text-white/30")}>
                              {tab.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Phone Navigation Bar */}
                    <div className="flex justify-around items-center px-12 py-2 bg-[#0D0B0A] select-none border-t border-[#141211]">
                      {/* Back Triangle */}
                      <button 
                        onClick={() => setJoinedRoom(null)}
                        className="w-3.5 h-3.5 text-white/40 hover:text-white flex items-center justify-center"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {/* Circle Home */}
                      <button 
                        onClick={() => setSimulatorTab('home')}
                        className="w-3 h-3 rounded-full border-2 border-white/40 hover:border-white" 
                      />
                      {/* Square Recents */}
                      <button 
                        onClick={() => alert("Simulated: Task Switching Drawer")}
                        className="w-2.5 h-2.5 border-2 border-white/40 hover:border-white rounded-sm" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard generic joined study rooms panel */
                <div className="p-8 border border-white/10 bg-black/40 rounded-2xl text-center space-y-4">
                  <p className="text-lg font-semibold">You joined <span className="text-primary">{joinedRoom}</span></p>
                  <div className="flex justify-center gap-4 py-8">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 animate-ping" />
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/15 flex items-center justify-center font-bold">You</div>
                  </div>
                  <button 
                    onClick={() => setJoinedRoom(null)}
                    className="px-6 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                  >
                    Leave Session
                  </button>
                </div>
              )
            ) : (
              /* Lists available study rooms */
              <div className="grid sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between h-44">
                    <div>
                      <h4 className="font-semibold text-lg">{room.name}</h4>
                      <div className="flex gap-1.5 mt-2">
                        {room.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/40 border border-white/5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-white/50">{room.users} online studying</span>
                      <button 
                        onClick={() => setJoinedRoom(room.name)}
                        className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {subTool === 'friends' && (
          <div className="space-y-6">
            {/* Header and User Profile Tag */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-5 gap-4">
              <div>
                <h3 className="text-2xl font-bold">Focus Social Network</h3>
                <p className="text-white/40 text-xs mt-1">Connect with team members to share attention logs mutually.</p>
              </div>

              {/* My Profile Tag */}
              <div className="flex items-center gap-3 bg-[#1B1817] border border-[#2B2725] px-4 py-2 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-xs text-indigo-400">
                  S
                </div>
                <div>
                  <span className="text-[10px] text-white/30 block uppercase font-mono">My User Tag</span>
                  <span className="text-xs font-bold text-white block">Saumya_257</span>
                </div>
                <button 
                  onClick={() => alert("Simulated: Copied your user tag to clipboard!")}
                  className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white"
                  title="Copy User Tag"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Friend Request Input */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
              <h4 className="text-sm font-semibold text-white">Send Friend Request</h4>
              <p className="text-white/40 text-xs leading-normal">
                Enter another student's unique tag to invite them. They must accept before screen time statistics can be shared.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter username (e.g. Sam_257, neo_coder...)"
                  id="friend-request-input"
                  className="flex-1 bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('friend-request-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      sendFriendRequest(input.value.trim());
                      alert(`Friend request sent to ${input.value.trim()}!`);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:opacity-90 transition-all shrink-0"
                >
                  Send Request
                </button>
              </div>
            </div>

            {/* Grid for Incoming & Outgoing Requests */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Incoming Requests */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase flex items-center gap-1.5">
                  <span>📥 Incoming Requests</span>
                  <span className="text-[10px] bg-indigo-500/25 text-indigo-300 font-bold px-1.5 py-0.5 rounded-full font-mono">
                    {friendRequests.filter(r => r.type === 'incoming').length}
                  </span>
                </h4>
                
                <div className="space-y-2">
                  {friendRequests.filter(r => r.type === 'incoming').map((req) => (
                    <div key={req.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase">
                            {req.username.slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">{req.username}</span>
                            <span className="text-[9px] font-mono text-white/40 block mt-0.5">{req.college || 'External Node'}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => acceptFriendRequest(req.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineFriendRequest(req.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold text-[10px] transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {friendRequests.filter(r => r.type === 'incoming').length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/5 rounded-xl text-white/30 text-xs italic">
                      No incoming requests.
                    </div>
                  )}
                </div>
              </div>

              {/* Outgoing Requests */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase flex items-center gap-1.5">
                  <span>📤 Sent Pending Requests</span>
                  <span className="text-[10px] bg-white/10 text-white/60 font-bold px-1.5 py-0.5 rounded-full font-mono">
                    {friendRequests.filter(r => r.type === 'outgoing').length}
                  </span>
                </h4>
                
                <div className="space-y-2">
                  {friendRequests.filter(r => r.type === 'outgoing').map((req) => (
                    <div key={req.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-semibold text-white/80">{req.username}</span>
                        <span className="text-[10px] text-white/30 font-mono">(Pending)</span>
                      </div>
                      <button
                        onClick={() => cancelFriendRequest(req.id)}
                        className="px-2.5 py-1 text-[10px] font-mono border border-white/10 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                  
                  {friendRequests.filter(r => r.type === 'outgoing').length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/5 rounded-xl text-white/30 text-xs italic">
                      No sent pending requests.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Mutual Friends */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase">Active Mutual Friends ({friendsList.filter(f => f.isFriend).length})</h4>
              <div className="space-y-2.5">
                {friendsList.filter(f => f.isFriend).map((friend) => (
                  <div key={friend.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white uppercase overflow-hidden shrink-0">
                          {friend.pfp ? (
                            <img src={friend.pfp} alt={friend.name} className="w-full h-full object-cover" />
                          ) : (
                            friend.name.slice(0, 2)
                          )}
                        </div>
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black/80",
                          friend.online ? "bg-emerald-400" : "bg-zinc-500"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white">{friend.name}</span>
                          <span className="text-[9px] font-mono text-white/30">{friend.college}</span>
                        </div>
                        <span className="text-[10px] font-mono block mt-0.5 text-white/40">
                          Status: {friend.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    {/* Privacy Controlled Screen Time Display */}
                    <div className="flex-1 max-w-md bg-black/25 rounded-xl border border-white/5 p-3 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-white/30 block uppercase">SCREEN TIME LOG</span>
                        <span className="text-xs font-semibold text-indigo-300 block">{friend.screenTime}</span>
                        <span className="text-[9px] text-white/50 truncate block mt-0.5">{friend.appsBreakdown}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFriendship(friend.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-wide border bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
                    >
                      Remove Friend
                    </button>
                  </div>
                ))}

                {friendsList.filter(f => f.isFriend).length === 0 && (
                  <div className="text-center py-10 border border-white/5 rounded-2xl text-white/30 text-sm">
                    No active mutual friends. Send some requests to share focus logs!
                  </div>
                )}
              </div>
            </div>

            {/* Discover Suggestions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono tracking-wider text-white/40 uppercase">Discover Peers ({friendsList.filter(f => !f.isFriend && !friendRequests.some(r => r.username.toLowerCase() === f.name.toLowerCase())).length})</h4>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {friendsList
                  .filter(f => !f.isFriend && !friendRequests.some(r => r.username.toLowerCase() === f.name.toLowerCase()))
                  .map((peer) => (
                    <div key={peer.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-white/60 overflow-hidden shrink-0">
                          {peer.pfp ? (
                            <img src={peer.pfp} alt={peer.name} className="w-full h-full object-cover" />
                          ) : (
                            peer.name.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white/80 block">{peer.name}</span>
                          <span className="text-[9px] font-mono text-white/30 block mt-0.5">{peer.college}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => sendFriendRequest(peer.name)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono text-white/70 hover:text-white transition-all flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Request</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {subTool === 'community' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Student Nexus Community</h3>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Share a roadmap, resource, or doubt topic..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <select
                value={newPostType}
                onChange={(e) => setNewPostType(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Resources">Resources</option>
                <option value="Tips">Tips</option>
                <option value="Doubts">Doubts</option>
              </select>
              <button
                onClick={addPost}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 flex items-center justify-center gap-1"
              >
                <Plus className="w-4.5 h-4.5" /> Post
              </button>
            </div>

            <div className="space-y-3 mt-6">
              {posts.map((post) => (
                <div key={post.id} className="p-5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase font-mono font-semibold">{post.type}</span>
                    <h4 className="font-semibold text-white/95 mt-2">{post.title}</h4>
                    <p className="text-xs text-white/40 mt-1">Shared by @{post.author}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPosts(posts.map(p => p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p));
                    }}
                    className="flex flex-col items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 min-w-12"
                  >
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono font-bold text-white/80 mt-1">{post.upvotes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   2. GROWTH & REWARDS HUB (Streaks, Life Score, Unlockables)
   ========================================================================== */
function RewardsWorkspace() {
  const [subTool, setSubTool] = useState<'streak' | 'score' | 'unlocks'>('streak');
  const { theme, setTheme } = useThemeStore();

  // Life Score Inputs
  const [studyScore, setStudyScore] = useState(85);
  const [fitnessScore, setFitnessScore] = useState(70);
  const [prodScore, setProdScore] = useState(90);
  const [learnScore, setLearnScore] = useState(75);

  const calculateOverallLifeScore = () => {
    return Math.round((studyScore + fitnessScore + prodScore + learnScore) / 4);
  };

  // Unlockables state with theme mapping properties
  const [coins, setCoins] = useState(350);
  const [unlocks, setUnlocks] = useState<{ id: string; name: string; price: number; type: string; themeKey?: string; unlocked?: boolean }[]>([
    { id: '1', name: 'White / Light Theme', price: 80, type: 'Themes', themeKey: 'white', unlocked: false },
    { id: '4', name: 'Dark / Glassmorphic Theme', price: 0, type: 'Themes', themeKey: 'glassmorphism', unlocked: true },
    { id: '5', name: 'Dynamic Neural Graph Widget', price: 200, type: 'Widgets', unlocked: false },
    { id: '6', name: 'Aurora Borealis Aura Profile Effect', price: 300, type: 'Profile Effects', unlocked: false }
  ]);

  // Load Coins & Shop purchase state
  useEffect(() => {
    const loadRewardsState = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid, 'rewards', 'shopState');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.coins !== undefined) setCoins(data.coins);
            if (data.unlockedIds) {
              setUnlocks(prev => prev.map(u => ({
                ...u,
                unlocked: data.unlockedIds.includes(u.id) || u.themeKey === 'glassmorphism'
              })));
            }
          }
        } catch (e) {
          console.warn("Failed to load rewards from Firestore", e);
        }
      } else {
        const stored = localStorage.getItem('life-os-rewards-shop');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setCoins(parsed.coins);
            setUnlocks(prev => prev.map(u => ({
              ...u,
              unlocked: parsed.unlockedIds.includes(u.id) || u.themeKey === 'glassmorphism'
            })));
          } catch (e) {}
        }
      }
    };
    loadRewardsState();
  }, []);

  const saveRewardsState = async (newCoins: number, newUnlocks: typeof unlocks) => {
    const unlockedIds = newUnlocks.filter(u => u.unlocked).map(u => u.id);
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'rewards', 'shopState'), {
          coins: newCoins,
          unlockedIds
        });
      } catch (e) {
        console.warn("Failed to save rewards to Firestore", e);
      }
    }
    localStorage.setItem('life-os-rewards-shop', JSON.stringify({ coins: newCoins, unlockedIds }));
  };

  const buyUnlock = (id: string, price: number) => {
    if (coins >= price) {
      const nextCoins = coins - price;
      const nextUnlocks = unlocks.map(u => u.id === id ? { ...u, unlocked: true } : u);
      setCoins(nextCoins);
      setUnlocks(nextUnlocks);
      saveRewardsState(nextCoins, nextUnlocks);
    }
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'streak', label: 'Study Streaks', icon: Flame },
          { id: 'score', label: 'Life Score', icon: Award },
          { id: 'unlocks', label: 'Unlockables', icon: Lock },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSubTool(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                subTool === item.id 
                  ? 'bg-white/10 text-white border-l-2 border-primary' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <GlassCard className="p-8 min-h-[400px]">
        {subTool === 'streak' && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Flame className="w-8 h-8 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold">12 Days Streak</h3>
                <p className="text-white/40 text-xs">Maintain your daily learning activity to grow the flame!</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Weekly Challenges</h4>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white/90">The Hyper-focus Sprint</p>
                  <p className="text-xs text-white/40">Complete 3 hours of focused study rooms</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold">+50 EXP</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white/90">Consistency Guru</p>
                  <p className="text-xs text-white/40">Check off all tasks for 5 consecutive days</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold">+100 EXP</span>
              </div>
            </div>
          </div>
        )}

        {subTool === 'score' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-2xl font-bold">Dynamic Life Score</h3>
              <div className="text-right">
                <span className="text-[10px] text-white/30 uppercase tracking-widest block font-mono">Overall Rating</span>
                <span className="text-4xl font-display font-bold text-emerald-400">{calculateOverallLifeScore()}</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Study Metric', val: studyScore, set: setStudyScore },
                { label: 'Fitness Metric', val: fitnessScore, set: setFitnessScore },
                { label: 'Productivity Level', val: prodScore, set: setProdScore },
                { label: 'Learning Velocity', val: learnScore, set: setLearnScore }
              ].map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{metric.label}</span>
                    <span className="font-mono font-bold text-white/95">{metric.val}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metric.val}
                    onChange={(e) => metric.set(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'unlocks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Nexus Shop</h3>
              <span className="font-mono font-bold text-sm bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full">🪙 {coins} Coins</span>
            </div>

            <div className="grid gap-4 mt-6">
              {unlocks.map((u) => (
                <div key={u.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 uppercase font-mono font-semibold">{u.type}</span>
                    <h4 className="font-semibold text-white/90 mt-1">{u.name}</h4>
                  </div>
                  {u.unlocked ? (
                    u.themeKey ? (
                      theme === u.themeKey ? (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : (
                        <button
                          onClick={() => setTheme(u.themeKey as any)}
                          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                        >
                          Equip Theme
                        </button>
                      )
                    ) : (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold flex items-center gap-1">
                        Active
                      </span>
                    )
                  ) : (
                    <button
                      onClick={() => buyUnlock(u.id, u.price)}
                      disabled={coins < u.price}
                      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40"
                    >
                      Unlock for 🪙 {u.price}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   3. AI DIGITAL TWIN (Predictive Analysis & Advice Model)
   ========================================================================== */
function TwinWorkspace() {
  const [studyHours, setStudyHours] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [exerciseHours, setExerciseHours] = useState(1);
  const [screenTime, setScreenTime] = useState(4);
  const [monthlySavings, setMonthlySavings] = useState(5000);

  const projectedGPA = useMemo(() => {
    const base = 6.0;
    const studyFactor = 3.5 * Math.log2(studyHours + 1) / Math.log2(13);
    let gpa = base + studyFactor;
    
    if (sleepHours >= 7 && sleepHours <= 8) {
      gpa += 0.5;
    } else if (sleepHours < 6) {
      gpa -= 0.8;
    } else if (sleepHours > 9) {
      gpa -= 0.2;
    }

    if (screenTime >= 8 && screenTime < 10) {
      gpa -= 0.5;
    } else if (screenTime >= 10) {
      gpa -= 1.0;
    }

    if (exerciseHours >= 1) {
      gpa += 0.2;
    }
    
    return Math.min(10.0, Math.max(4.0, parseFloat(gpa.toFixed(2))));
  }, [studyHours, sleepHours, screenTime, exerciseHours]);

  const placementReadiness = useMemo(() => {
    let readiness = studyHours * 10;
    
    if (sleepHours >= 6 && sleepHours <= 8) readiness += 15;
    else readiness += 5;

    if (exerciseHours >= 1) readiness += 10;
    if (exerciseHours >= 2) readiness += 5;

    if (screenTime >= 8 && screenTime < 10) readiness -= 15;
    else if (screenTime >= 10) readiness -= 25;

    if (studyHours >= 5) readiness += 15;

    return Math.min(100, Math.max(10, readiness));
  }, [studyHours, sleepHours, exerciseHours, screenTime]);

  const healthStatus = useMemo(() => {
    if (sleepHours >= 7 && exerciseHours >= 1 && screenTime <= 5) {
      return { label: 'Vibrant', color: 'text-emerald-400' };
    }
    if (sleepHours < 5 && exerciseHours === 0 && screenTime >= 10) {
      return { label: 'Burnout Alert', color: 'text-rose-500 font-bold animate-pulse' };
    }
    if (sleepHours < 6 || screenTime >= 8) {
      return { label: 'Fatigued', color: 'text-amber-400' };
    }
    return { label: 'Stable', color: 'text-blue-400' };
  }, [sleepHours, exerciseHours, screenTime]);

  const projectedSavings1Yr = useMemo(() => {
    const r = 0.07 / 12;
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total = (total + monthlySavings) * (1 + r);
    }
    return Math.round(total);
  }, [monthlySavings]);

  const projectedSavings3Yr = useMemo(() => {
    const r = 0.07 / 12;
    let total = 0;
    for (let i = 0; i < 36; i++) {
      total = (total + monthlySavings) * (1 + r);
    }
    return Math.round(total);
  }, [monthlySavings]);

  const unlockedSkills = useMemo(() => {
    const skills = ['Basic Coding', 'Time Management'];
    if (studyHours >= 2) {
      skills.push('Next.js', 'Tailwind CSS');
    }
    if (studyHours >= 4) {
      skills.push('Data Structures', 'System Design', 'SQL & Firebase');
    }
    if (studyHours >= 6) {
      skills.push('Machine Learning', 'Compiler Design', 'Distributed Systems');
    }
    if (sleepHours >= 7) {
      skills.push('Mental Focus', 'Stress Tolerance');
    }
    if (exerciseHours >= 1) {
      skills.push('Physical Discipline', 'High Endurance');
    }
    if (screenTime <= 4) {
      skills.push('Laser Focus', 'Dopamine Control');
    }
    return skills;
  }, [studyHours, sleepHours, exerciseHours, screenTime]);

  const unlockedProjects = useMemo(() => {
    const projects: { name: string; desc: string; difficulty: string }[] = [
      { name: 'Personal Portfolio', desc: 'Sleek visual profile page with CSS cards', difficulty: 'Easy' }
    ];
    if (studyHours >= 3) {
      projects.push({ name: 'SaaS Finance Dashboard', desc: 'Real-time transaction tracking with gauges', difficulty: 'Medium' });
    }
    if (exerciseHours >= 2) {
      projects.push({ name: 'IoT Fitness Band Sync', desc: 'Biometric health tracker overlay metrics', difficulty: 'Medium' });
    }
    if (screenTime <= 3) {
      projects.push({ name: 'Distraction Blocker Tool', desc: 'Frictionless browser focus utility extension', difficulty: 'Medium' });
    }
    if (studyHours >= 5) {
      projects.push({ name: 'Co-Working Chat Room', desc: 'Collaborative desk visualizer with websockets', difficulty: 'Hard' });
    }
    if (studyHours >= 7) {
      projects.push({ name: 'LIFE OS Core Engine', desc: 'Automated digital twin and neural model simulator', difficulty: 'Legendary' });
    }
    if (studyHours >= 7 && screenTime <= 4) {
      projects.push({ name: 'Advanced Neural Code Assistant', desc: 'Deep learning semantic context scanner', difficulty: 'Legendary' });
    }
    return projects;
  }, [studyHours, exerciseHours, screenTime]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        <div>
          <h3 className="text-2xl font-display font-bold text-white">Future Self Simulator</h3>
          <p className="text-white/40 text-xs mt-0.5">Drag productivity, health, and savings variables to predict your projected trajectory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-2 space-y-5">
          <GlassCard className="p-5 space-y-6">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white/50 uppercase border-b border-white/5 pb-2.5">
              Simulation Inputs
            </h4>

            {/* Study hours slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Study Hours/Day:</span>
                <span className="font-mono font-bold text-primary">{studyHours} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={studyHours}
                onChange={(e) => setStudyHours(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[9px] text-white/30 block">Controls learning velocity and skills.</span>
            </div>

            {/* Sleep hours slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Sleep Hours/Day:</span>
                <span className="font-mono font-bold text-primary">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="1"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[9px] text-white/30 block">Affects mental focus, GPA, and retention.</span>
            </div>

            {/* Exercise hours slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Exercise Hours/Day:</span>
                <span className="font-mono font-bold text-primary">{exerciseHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={exerciseHours}
                onChange={(e) => setExerciseHours(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[9px] text-white/30 block">Improves health, stamina, and readiness scores.</span>
            </div>

            {/* Screen time slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Screen Time Limit:</span>
                <span className="font-mono font-bold text-primary">{screenTime} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={screenTime}
                onChange={(e) => setScreenTime(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[9px] text-white/30 block">High screen time reduces focus and overall GPA.</span>
            </div>

            {/* Monthly savings slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Monthly Savings:</span>
                <span className="font-mono font-bold text-primary">{formatCurrency(monthlySavings)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[9px] text-white/30 block">Models long-term compounded wealth.</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Projections */}
        <div className="lg:col-span-3 space-y-5">
          <GlassCard className="p-5 space-y-6">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white/50 uppercase border-b border-white/5 pb-2.5">
              Projected Trajectory
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-mono text-white/40 block uppercase">Projected GPA</span>
                <span className="text-2xl font-display font-bold text-white block">{projectedGPA.toFixed(2)}</span>
                <span className="text-[8px] text-white/30 block">Scale: 10.0 max</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
                <span className="text-[10px] font-mono text-white/40 block uppercase">Placement Readiness</span>
                <span className="text-2xl font-display font-bold text-white block">{placementReadiness}%</span>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500" 
                    style={{ width: `${placementReadiness}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-1.5">
                <span className="text-[10px] font-mono text-white/40 block uppercase">Vitality Rating</span>
                <span className={`text-sm font-display font-bold block leading-normal ${healthStatus.color}`}>{healthStatus.label}</span>
                <span className="text-[8px] text-white/30 block">Based on sleep/exercise</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-white/40 block uppercase">Skills Unlocked</span>
              <div className="flex flex-wrap gap-1.5">
                {unlockedSkills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10 animate-fade-in"
                  >
                    ⚡ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-white/40 block uppercase">Project Portfolio Unlocked</span>
              <div className="grid gap-2">
                {unlockedProjects.map((proj, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white/90 block">{proj.name}</span>
                      <span className="text-[10px] text-white/45 block mt-0.5">{proj.desc}</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80 uppercase font-semibold">
                      {proj.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-white/40 block uppercase">Wealth Accrual (7% Compounded)</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-white/40 block">1 Year</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{formatCurrency(projectedSavings1Yr)}</span>
                </div>
                <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-white/40 block">3 Years</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{formatCurrency(projectedSavings3Yr)}</span>
                </div>
                <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-white/40 block">5 Years</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{formatCurrency(projectedSavings3Yr * 1.8)}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
