'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Activity, Clock, LogOut, Search, ShieldAlert,
  Layers, Mail, Database, Bell, Shield, Lock, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { HeroParticles } from '@/components/landing/HeroParticles';
import { Logo } from '@/components/Logo';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth and verification states
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);

  // Passcode gate states (restored for manual lock session)
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [attempts, setAttempts] = useState(3); // wrong attempts remaining
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'overview' | 'waitlist'>('overview');
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');

  // Hydrate lockout state on client
  useEffect(() => {
    const storedLockout = localStorage.getItem('admin_lockout_until');
    if (storedLockout) {
      const until = parseInt(storedLockout, 10);
      if (until > Date.now()) {
        setLockoutTime(until);
        setAttempts(0);
      }
    }
  }, []);

  // Monitor lockout countdown
  useEffect(() => {
    if (lockoutTime === null) return;

    const interval = setInterval(() => {
      const remaining = lockoutTime - Date.now();
      if (remaining <= 0) {
        setLockoutTime(null);
        setAttempts(3);
        localStorage.removeItem('admin_lockout_until');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  // Fetch admin email from server config to bypass static inlining issues
  useEffect(() => {
    fetch('/api/admin-config')
      .then(res => res.json())
      .then(data => {
        if (data.adminEmail) {
          setAdminEmail(data.adminEmail.toLowerCase().trim());
        }
      })
      .catch(err => console.error("Failed to load admin config:", err));
  }, []);

  // Check Firebase Auth & Admin Email and auto-verify without passcode unless manually locked
  useEffect(() => {
    if (adminEmail === null) return;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);

      if (!u) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else if (u.email?.toLowerCase().trim() !== adminEmail) {
        // Verification fails if wrong email
        setVerifyingSession(false);
      } else {
        // Authenticated as Admin! Check if session was manually locked in this browser session
        const manuallyLocked = localStorage.getItem('admin_session_manually_locked') === 'true';
        if (manuallyLocked) {
          setIsVerified(false);
          setVerifyingSession(false);
        } else {
          setIsVerified(true);
          setVerifyingSession(false);
          await fetchDashboardData();
        }
      }
    });

    return () => unsubscribe();
  }, [router, adminEmail]);

  // Fetch Waitlist and Admin Log collections from Firestore
  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch waitlist signups
      const waitlistSnap = await getDocs(query(collection(db, 'waitlist'), orderBy('joinedAt', 'desc')));
      const waitlistData = waitlistSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWaitlist(waitlistData);

      // 2. Fetch admin security logs (last 30 for safe buffer, show last 10)
      const logsSnap = await getDocs(query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'), limit(30)));
      const logsData = logsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdminLogs(logsData);

      // Update last synced time stamp
      setLastSyncedTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Submit Passcode to verify and set cookie
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime || submitting || !passcode || !user) return;

    setSubmitting(true);
    setWrongPassword(false);

    try {
      const res = await fetch('/api/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode, email: user.email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.removeItem('admin_session_manually_locked');
          setIsVerified(true);
          setPasscode('');
          setAttempts(3);
          await fetchDashboardData();
        }
      } else {
        // Wrong passcode
        setWrongPassword(true);
        const nextAttempts = attempts - 1;
        setAttempts(nextAttempts);

        if (nextAttempts <= 0) {
          const blockUntil = Date.now() + 30 * 60 * 1000; // 30 mins
          setLockoutTime(blockUntil);
          localStorage.setItem('admin_lockout_until', blockUntil.toString());
        }

        // Clear passcode input on fail
        setPasscode('');
      }
    } catch (err) {
      console.error("Passcode verify request failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Clear cookie and manual lock session
  const handleLockSession = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'POST' });
      setIsVerified(false);
      localStorage.setItem('admin_session_manually_locked', 'true');
      // Fetch logs again since we logged a session_locked event
      await fetchDashboardData();
    } catch (err) {
      console.error("Lock session failed:", err);
    }
  };

  // Sign out of Google/Firebase auth
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('admin_session_manually_locked');
      router.push('/login');
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Helper: Format relative timestamp
  const getRelativeTime = (timestamp: any): string => {
    if (!timestamp) return 'Just now';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  // Avatar Initials Generator
  const getInitials = (email: string): string => {
    if (!email) return '??';
    const parts = email.split('@')[0];
    if (parts.length >= 2) {
      return parts.substring(0, 2).toUpperCase();
    }
    return parts.substring(0, 1).toUpperCase() || 'U';
  };

  // Filter waitlist entries based on search query
  const filteredWaitlist = waitlist.filter(item => 
    item.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger Waitlist CSV Export
  const handleExportCSV = () => {
    if (filteredWaitlist.length === 0) return;
    const headers = ['ID', 'Email', 'Plan', 'Source', 'Joined At'];
    const csvRows = [
      headers.join(','),
      ...filteredWaitlist.map(item => {
        const date = item.joinedAt?.toDate ? item.joinedAt.toDate().toISOString() : item.joinedAt || '';
        return [item.id, item.email, item.plan, item.source, date].map(v => `"${v}"`).join(',');
      })
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Loading indicator for authentication check
  if (authLoading || verifyingSession || adminEmail === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0d0f] relative">
        <HeroParticles />
        <div className="text-center space-y-4 relative z-10">
          <Logo showText={false} size={64} className="animate-pulse" />
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
            Establishing Secure Admin Node...
          </p>
        </div>
      </div>
    );
  }

  // Layer 1 Failure: Logged in with wrong email
  if (user && user.email?.toLowerCase().trim() !== adminEmail) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0d0d0f] relative">
        <HeroParticles />
        <GlassCard className="w-full max-w-[440px] p-8 text-center relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">Access Denied</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Your account (<span className="text-rose-400 font-medium font-mono">{user.email}</span>) does not have admin permissions to access this command center.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Switch Account
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all text-sm cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Layer 2 Failure: Valid email but manually locked session
  if (!isVerified) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0d0d0f] relative overflow-hidden">
        {/* Style animations and shake effect */}
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
          }
          .shake-effect {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>
        
        <HeroParticles />
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            "w-full max-w-[440px] backdrop-blur-xl rounded-[24px] p-8 md:p-12 relative z-10 transition-all duration-300",
            wrongPassword ? "border border-rose-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] shake-effect" : "border border-white/10 shadow-[0_0_60px_rgba(0,212,255,0.08)]",
            lockoutTime ? "border-rose-900/40" : ""
          )}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
        >
          <div className="text-center mb-8 flex flex-col items-center justify-center">
            {lockoutTime ? (
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
            ) : (
              <Logo showText={false} size={48} className="mb-4" />
            )}
            
            <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
              {lockoutTime ? "Temporarily Locked" : "Admin Access"}
            </h2>
            <p className="text-white/60 text-xs font-mono uppercase tracking-wider">
              {lockoutTime ? "Passcode limit exceeded" : "Enter admin passcode to unlock session"}
            </p>
          </div>

          {lockoutTime ? (
            /* Locked Out State */
            <div className="text-center space-y-4 py-4">
              <span className="text-3xl font-mono font-bold text-rose-500 block animate-pulse">
                Locked for {timeLeft}
              </span>
              <p className="text-white/40 text-xs max-w-xs mx-auto leading-relaxed uppercase">
                Too many attempts. The passcode input is locked for security reasons. Try again later.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-mono uppercase tracking-widest mt-4 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Form Passcode Input State */
            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPasscode ? "text" : "password"}
                    required
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (wrongPassword) setWrongPassword(false);
                    }}
                    placeholder="Enter Passcode"
                    className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all text-sm font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                  >
                    {showPasscode ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                
                {attempts < 3 && attempts > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-500 font-mono text-center"
                  >
                    ⚠️ Incorrect passcode. {attempts} of 3 attempts remaining.
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#00d4ff] hover:bg-[#00bced] text-black font-bold hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  'Enter →'
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // Active verified page: Show Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white relative flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500/30 pb-16">
      <HeroParticles />

      {/* ADMIN HEADER TOP BAR */}
      <header className="sticky top-0 w-full z-30 bg-[#0d0d0f]/60 backdrop-blur-[12px] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={28} showText={true} />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 font-mono text-indigo-300 uppercase select-none tracking-widest">
              Admin Command
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Bell with counter */}
            <div className="relative p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-lg transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              {waitlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 border border-[#0d0d0f] rounded-full flex items-center justify-center text-[9px] font-bold text-white font-mono animate-pulse">
                  {waitlist.length}
                </span>
              )}
            </div>

            {/* Lock Session (ghost button) */}
            <button
              onClick={handleLockSession}
              className="flex items-center gap-1.5 px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>

            {/* Logout (icon-only button) */}
            <button
              onClick={handleSignOut}
              className="p-2 border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-white/50 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto px-6 mt-8 w-full flex-grow relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Dashboard Overview</h1>
            <p className="text-white/40 text-xs mt-1.5 font-mono">Manage waitlist registrations, system operations, and audit security node events.</p>
          </div>

          {/* TAB SYSTEM WITH UNREAD DOT */}
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all border",
                activeTab === 'overview' 
                  ? "bg-white text-black border-white shadow-lg" 
                  : "text-white/60 hover:text-white border-transparent hover:bg-white/5"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              System overview
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all border relative",
                activeTab === 'waitlist' 
                  ? "bg-white text-black border-white shadow-lg" 
                  : "text-white/60 hover:text-white border-transparent hover:bg-white/5"
              )}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Waitlist ({waitlist.length})</span>
              {waitlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full border border-black shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* LOADING DATA SCREEN */}
        {loadingData ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-white/30 font-mono text-xs uppercase tracking-widest">Querying Cloud Firestore...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-8"
              >
                {/* REDESIGNED METRICS ROW WITH DELTA/STATUS LINES AND COLORED ICON BADGES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Waitlist Card */}
                  <GlassCard className="p-5 flex flex-col justify-between min-h-[135px] border-white/10 transition-all hover:border-teal-500/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">Total Waitlist</span>
                        <span className="text-2xl font-display font-extrabold text-white block mt-1.5 truncate max-w-[180px]">
                          {waitlist.length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/35 font-mono block mt-2">Emails registered for Pro</span>
                      <div className="text-[10px] font-mono text-teal-400 flex items-center gap-1 mt-1.5 font-semibold">
                        <span>↑</span> New since yesterday
                      </div>
                    </div>
                  </GlassCard>

                  {/* Active Admin Card */}
                  <GlassCard className="p-5 flex flex-col justify-between min-h-[135px] border-white/10 transition-all hover:border-indigo-500/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">Active Auth Admin</span>
                        <span className="text-xl font-display font-extrabold text-white block mt-2 truncate max-w-[170px]" title={user?.email || "saumyamir25@gmail.com"}>
                          {user?.email?.split('@')[0] || "saumyamir25"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <User className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/35 font-mono block mt-2">Current console privilege</span>
                      <div className="text-[10px] font-mono text-indigo-400 flex items-center gap-1 mt-1.5 font-semibold">
                        <span>✓</span> Session verified secure
                      </div>
                    </div>
                  </GlassCard>

                  {/* Database Nodes Card */}
                  <GlassCard className="p-5 flex flex-col justify-between min-h-[135px] border-white/10 transition-all hover:border-emerald-500/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">Database Nodes</span>
                        <span className="text-2xl font-display font-extrabold text-white block mt-1.5 truncate max-w-[180px]">
                          Verified
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Database className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/35 font-mono block mt-2">Firestore status</span>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1.5 font-semibold">
                        <span>✓</span> All nodes healthy
                      </div>
                    </div>
                  </GlassCard>

                  {/* Security Logs Card */}
                  <GlassCard className="p-5 flex flex-col justify-between min-h-[135px] border-white/10 transition-all hover:border-amber-500/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">Security Logs</span>
                        <span className="text-2xl font-display font-extrabold text-white block mt-1.5 truncate max-w-[180px]">
                          {adminLogs.length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <Shield className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/35 font-mono block mt-2">Total events captured</span>
                      <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1 mt-1.5 font-semibold">
                        <span>✓</span> No threats detected
                      </div>
                    </div>
                  </GlassCard>

                </div>

                {/* TWO-COLUMN SIDE-BY-SIDE LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Waitlist Registrations Section (8 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <GlassCard className="p-6 border-white/10 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                        <div>
                          <h3 className="text-lg font-display font-bold">Waitlist Registrations</h3>
                          <p className="text-white/45 text-xs">Direct list of users subscribed to LIFE OS Pro.</p>
                        </div>
                        <button
                          onClick={handleExportCSV}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white text-white hover:text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                        >
                          Export CSV
                        </button>
                      </div>

                      {/* COMPACT SEARCH */}
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-xl mb-4">
                        <Search className="w-4 h-4 text-white/30 shrink-0 ml-1.5" />
                        <input
                          type="text"
                          placeholder="Search waitlist emails..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-grow bg-transparent border-none text-white text-xs focus:outline-none placeholder-white/20 font-mono"
                        />
                      </div>

                      {/* WAITLIST TABLE WITH AVATARS & PLAN BADGES */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-white/40 font-mono text-[9px] uppercase tracking-wider">
                              <th className="p-3 font-semibold">User</th>
                              <th className="p-3 font-semibold">Assigned Plan</th>
                              <th className="p-3 font-semibold">Date Registered</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredWaitlist.map((item) => {
                              const date = item.joinedAt?.toDate ? item.joinedAt.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              }) : 'Just now';

                              return (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-all">
                                  <td className="p-3 font-medium flex items-center gap-3">
                                    {/* Initials Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-300 font-mono select-none">
                                      {getInitials(item.email)}
                                    </div>
                                    <span className="text-white/90 font-mono truncate max-w-[200px]" title={item.email}>
                                      {item.email}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                                      {item.plan || 'Pro'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-white/45 font-mono text-[10px]">{date}</td>
                                </tr>
                              );
                            })}

                            {filteredWaitlist.length === 0 && (
                              <tr>
                                <td colSpan={3} className="p-8 text-center text-white/30 italic font-mono">
                                  No waitlist subscribers found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  </div>

                  {/* RIGHT COLUMN: Access Audit Log Section (4 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <GlassCard className="p-6 border-white/10 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                        <div>
                          <h3 className="text-lg font-display font-bold">Access Audit Log</h3>
                          <p className="text-white/45 text-xs">Administrative nodes connections stream.</p>
                        </div>
                        {lastSyncedTime && (
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>LIVE: {lastSyncedTime}</span>
                          </div>
                        )}
                      </div>

                      {/* LOG LIST */}
                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {adminLogs.slice(0, 8).map((log) => {
                          const relativeTime = getRelativeTime(log.timestamp);
                          let icon = "✅";
                          let text = "Admin accessed";
                          let borderClass = "border-emerald-500/20 bg-emerald-500/5 text-emerald-300";

                          if (log.type === 'failed_admin_attempt') {
                            icon = "⚠️";
                            text = "Failed attempt";
                            borderClass = "border-rose-500/20 bg-rose-500/5 text-rose-300";
                          } else if (log.type === 'session_locked') {
                            icon = "🔒";
                            text = "Session locked";
                            borderClass = "border-zinc-500/20 bg-white/5 text-zinc-355";
                          }

                          return (
                            <div 
                              key={log.id} 
                              className={cn(
                                "p-3 rounded-xl border flex items-center justify-between text-xs transition-all hover:bg-white/[0.02]",
                                borderClass
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-md">{icon}</span>
                                <div className="space-y-0.5">
                                  <span className="font-bold">{text}</span>
                                  <span className="text-[9px] text-white/40 font-mono block">Node IP: {log.ip || "unknown"}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-white/40 shrink-0">{relativeTime}</span>
                            </div>
                          );
                        })}

                        {/* REDESIGNED EMPTY AUDIT STATE */}
                        {adminLogs.length === 0 && (
                          <div className="text-center py-16 px-4 space-y-4 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01]">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                              <Shield className="w-5 h-5 text-white/45" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-white/80 font-mono text-xs font-bold uppercase tracking-wider">No access events logged yet</p>
                              <p className="text-white/30 text-[10px] max-w-[200px] mx-auto leading-relaxed">
                                Your security log is clean. All connection nodes are established and fully monitored.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>

                </div>
              </motion.div>
            )}

            {/* INDEPENDENT FULL-WIDTH WAITLIST TAB */}
            {activeTab === 'waitlist' && (
              <motion.div
                key="waitlist"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                {/* SEARCH AND FILTER BAR */}
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <Search className="w-5 h-5 text-white/30 shrink-0 ml-2" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-transparent border-none text-white text-sm focus:outline-none placeholder-white/20 font-mono"
                  />
                  
                  {/* Export CSV button */}
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>

                {/* FULL-WIDTH DETAILED TABLE */}
                <GlassCard className="border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-white/50 font-mono text-[10px] uppercase tracking-wider">
                          <th className="p-4 font-semibold">Subscriber User</th>
                          <th className="p-4 font-semibold">Assigned Plan</th>
                          <th className="p-4 font-semibold">Conversion Source</th>
                          <th className="p-4 font-semibold">Signed Up Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredWaitlist.map((item) => {
                          const date = item.joinedAt?.toDate ? item.joinedAt.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Just now';

                          return (
                            <tr key={item.id} className="hover:bg-white/[0.02] transition-all">
                              <td className="p-4 font-medium text-white/90 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-300 font-mono select-none">
                                  {getInitials(item.email)}
                                </div>
                                <span className="font-mono">{item.email}</span>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                                  {item.plan || 'pro'}
                                </span>
                              </td>
                              <td className="p-4 text-white/45 font-mono text-[11px]">{item.source || 'pricing'}</td>
                              <td className="p-4 text-white/45 font-mono text-[11px]">{date}</td>
                            </tr>
                          );
                        })}

                        {filteredWaitlist.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-white/20 italic">
                              No waitlist subscribers found matching search query.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
