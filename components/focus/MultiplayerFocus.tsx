'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, UserPlus, LogOut, ShieldAlert, Sparkles, Circle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, getDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { useFocusStore, RoomMember } from '@/store/useFocusStore';
import { useAppStore } from '@/store/useAppStore';

interface MultiplayerFocusProps {
  userId: string;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  mode: 'focus' | 'break';
  setMode: (mode: 'focus' | 'break') => void;
  focusTime: number;
  breakTime: number;
}

export default function MultiplayerFocus({
  userId,
  timeLeft,
  setTimeLeft,
  isRunning,
  setIsRunning,
  mode,
  setMode,
  focusTime,
  breakTime
}: MultiplayerFocusProps) {
  const { userName } = useAppStore();
  const { currentRoomId, roomMembers, setRoomState } = useFocusStore();

  const [inputRoomId, setInputRoomId] = useState('');
  const [hostUid, setHostUid] = useState<string | null>(null);
  const [distracted, setDistracted] = useState(false);

  // Real-time listener for the focus room
  useEffect(() => {
    if (!currentRoomId || !userId) return;

    const roomRef = doc(db, 'shared_focus_rooms', currentRoomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setHostUid(data.hostUid);
        
        // Sync members
        const membersList: RoomMember[] = data.members || [];
        setRoomState({
          roomMembers: membersList,
          timerStatus: data.timerStatus,
          startedAt: data.startedAt,
          durationSeconds: data.durationSeconds
        });

        // Synchronize timer values using elapsed times
        if (data.timerStatus === 'running' && data.startedAt) {
          setIsRunning(true);
          const startMs = new Date(data.startedAt).getTime();
          const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
          const computedTimeLeft = Math.max(0, data.durationSeconds - elapsedSeconds);
          setTimeLeft(computedTimeLeft);
          setMode(data.mode || 'focus');
        } else {
          setIsRunning(false);
          setTimeLeft(data.durationSeconds);
          setMode(data.mode || 'focus');
        }
      } else {
        // Room was deleted or is invalid
        setRoomState({ currentRoomId: null, roomMembers: [] });
      }
    });

    return () => unsubscribe();
  }, [currentRoomId, userId, setRoomState, setIsRunning, setTimeLeft, setMode]);

  // Sync personal distraction status to Firestore
  useEffect(() => {
    if (!currentRoomId || !userId) return;

    const updateStatus = async () => {
      const roomRef = doc(db, 'shared_focus_rooms', currentRoomId);
      try {
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const membersList: RoomMember[] = docSnap.data().members || [];
          const updatedMembers = membersList.map((m) =>
            m.uid === userId ? { ...m, status: distracted ? 'distracted' as const : 'active' as const } : m
          );
          await updateDoc(roomRef, { members: updatedMembers });
        }
      } catch (e) {
        console.error('Failed to update distraction status in room:', e);
      }
    };

    updateStatus();
  }, [distracted, currentRoomId, userId]);

  // 1. Create a Focus Room
  const handleCreateRoom = async () => {
    const randomId = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomRef = doc(db, 'shared_focus_rooms', randomId);
    
    const newRoom = {
      id: randomId,
      hostUid: userId,
      timerStatus: 'idle',
      startedAt: null,
      durationSeconds: focusTime * 60,
      mode: 'focus',
      members: [
        { uid: userId, name: userName || 'Developer', status: 'active' }
      ],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(roomRef, newRoom);
      setRoomState({ currentRoomId: randomId });
    } catch (e) {
      console.error('Failed to create focus room:', e);
      alert('Failed to create focus room. Verify Firestore access.');
    }
  };

  // 2. Join a Focus Room
  const handleJoinRoom = async () => {
    const code = inputRoomId.trim().toUpperCase();
    if (!code) return;

    const roomRef = doc(db, 'shared_focus_rooms', code);
    try {
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        const memberInfo = { uid: userId, name: userName || 'Scholar', status: 'active' };
        await updateDoc(roomRef, {
          members: arrayUnion(memberInfo)
        });
        setRoomState({ currentRoomId: code });
        setInputRoomId('');
      } else {
        alert('Focus Room ID not found.');
      }
    } catch (e) {
      console.error('Failed to join focus room:', e);
      alert('Error connecting to focus room.');
    }
  };

  // 3. Leave a Focus Room
  const handleLeaveRoom = async () => {
    if (!currentRoomId) return;

    const roomRef = doc(db, 'shared_focus_rooms', currentRoomId);
    try {
      const docSnap = await getDoc(roomRef);
      if (docSnap.exists()) {
        const membersList: RoomMember[] = docSnap.data().members || [];
        const filteredMembers = membersList.filter((m) => m.uid !== userId);
        await updateDoc(roomRef, { members: filteredMembers });
      }
    } catch (e) {
      console.error('Error leaving focus room:', e);
    }
    setRoomState({ currentRoomId: null, roomMembers: [] });
  };

  // Host Action: Start / Pause Multiplayer Timer
  const handleHostTimerControl = async (action: 'start' | 'pause') => {
    if (!currentRoomId) return;
    const roomRef = doc(db, 'shared_focus_rooms', currentRoomId);
    
    if (action === 'start') {
      await updateDoc(roomRef, {
        timerStatus: 'running',
        startedAt: new Date().toISOString(),
        durationSeconds: timeLeft,
        mode
      });
    } else {
      await updateDoc(roomRef, {
        timerStatus: 'paused',
        startedAt: null,
        durationSeconds: timeLeft,
        mode
      });
    }
  };

  const isHost = userId === hostUid;

  return (
    <GlassCard className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3 justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white/50" />
          <span>Multiplayer Study Rooms</span>
        </div>
        {currentRoomId && (
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-500/30">
            ROOM: {currentRoomId}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!currentRoomId ? (
          <motion.div
            key="join-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-white/60 text-xs leading-relaxed">
              Study side-by-side with friends in real-time. Join an active room code or spin up a new lobby.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Lobby ID (e.g. ROOM-1234)"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50 transition-colors uppercase font-mono"
              />
              <button
                onClick={handleJoinRoom}
                className="px-4 py-2 bg-white text-black rounded-xl font-bold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Join
              </button>
            </div>

            <div className="relative flex py-1.5 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-white/20 uppercase">Or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-white/50" />
              Create Study Room
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="lobby-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Host Controls */}
            {isHost ? (
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                <span className="text-[9px] font-mono text-indigo-400 block uppercase font-bold">Host Orchestration Tools</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleHostTimerControl(isRunning ? 'pause' : 'start')}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] transition-all uppercase tracking-wider"
                  >
                    {isRunning ? 'Pause Shared Timer' : 'Start Shared Timer'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-[10px] text-white/40">
                Lobby Host handles timer activations. Syncing live...
              </div>
            )}

            {/* Distraction simulation flag */}
            <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-xs text-white/60 font-sans">Simulate Off-task:</span>
              <button
                onClick={() => setDistracted(!distracted)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase font-bold transition-all border ${
                  distracted 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {distracted ? 'Distracted!' : 'Active'}
              </button>
            </div>

            {/* Member list */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Active Members ({roomMembers.length})</span>
              <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {roomMembers.map((member) => (
                  <div key={member.uid} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-2 rounded-lg text-xs">
                    <span className="text-white/80 font-medium">{member.name}</span>
                    <span className="flex items-center gap-1.5">
                      <Circle className={`w-2 h-2 ${member.status === 'distracted' ? 'text-red-400 fill-red-400 animate-ping' : 'text-emerald-400 fill-emerald-400'}`} />
                      <span className={`text-[10px] font-mono capitalize ${member.status === 'distracted' ? 'text-red-300 font-bold' : 'text-white/30'}`}>
                        {member.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exit Room button */}
            <button
              onClick={handleLeaveRoom}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave Focus Room
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
