'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, FileText, Mic, BookOpen, HelpCircle, 
  Calendar, Timer, Clock, ListTodo, GraduationCap, Plus, Trash2, CheckCircle2, Play, Pause, RotateCcw,
  FolderHeart, Bookmark, Globe, Video, ExternalLink, Search, Filter, RefreshCw
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useVaultStore } from '@/store/useVaultStore';
import { cn } from '@/lib/utils';

type Tab = 'ai' | 'schedule' | 'tracker' | 'vault';

export default function StudyOS() {
  const [activeTab, setActiveTab] = useState<Tab>('ai');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Study OS</h1>
        <p className="text-white/40">An all-in-one cognitive workspace for learning, focus, and academic tracking.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ai' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI Workspace
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'schedule' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" /> Time & Schedule
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tracker' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Academia Tracker
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'vault' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <FolderHeart className="w-4 h-4" /> Resource Vault
        </button>
      </div>

      {/* Dynamic Content Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'ai' && <AIWorkspace />}
          {activeTab === 'schedule' && <ScheduleWorkspace />}
          {activeTab === 'tracker' && <TrackerWorkspace />}
          {activeTab === 'vault' && <ResourceVaultWorkspace />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   1. AI WORKSPACE COMPONENT (AI Notes, PDF, Lecture, Flashcards, Quiz)
   ========================================================================== */
function AIWorkspace() {
  const [subTool, setSubTool] = useState<'notes' | 'pdf' | 'lecture' | 'flashcards' | 'quiz'>('notes');

  // AI Notes Generator State
  const [topic, setTopic] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [generatingNotes, setGeneratingNotes] = useState(false);

  // PDF Summarizer State
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  // Lecture-to-Notes State
  const [recording, setRecording] = useState(false);
  const [lectureText, setLectureText] = useState('');
  const [converting, setConverting] = useState(false);

  // Flashcard Generator State
  const [fcTopic, setFcTopic] = useState('');
  const [flashcards, setFlashcards] = useState<{ q: string; a: string; flipped?: boolean }[]>([]);
  const [generatingFC, setGeneratingFC] = useState(false);

  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<{ q: string; options: string[]; ans: number; selected?: number }[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // AI Notes Mock Generator
  const generateNotesHandler = () => {
    if (!topic) return;
    setGeneratingNotes(true);
    setTimeout(() => {
      setGeneratedNotes(`# Comprehensive Study Notes: ${topic}\n\n## 1. Core Principles\n- Key Definition: Fundamental concept essential for understanding ${topic}.\n- Historical Context: Early developments and breakthroughs.\n\n## 2. Major Themes & Concepts\n- Concept A: Core mechanics, properties, and variations.\n- Concept B: Analytical breakdown and real-world models.\n\n## 3. Practical Applications\n- Real-world case study: How this is applied in modern industries.\n- Problem Solving Framework: Step-by-step resolution steps.`);
      setGeneratingNotes(false);
    }, 1500);
  };

  // PDF Summarizer Mock Handler
  const summarizePDFHandler = () => {
    setSummarizing(true);
    setTimeout(() => {
      setSummary(`### Executive Summary of Document\n\n- **Key Takeaway 1:** The document highlights the optimization of cognitive load during study periods.\n- **Key Takeaway 2:** Emphasizes spaced repetition as a critical retention strategy.\n- **Conclusion:** Spaced retrieval coupled with active recall yields 150% better long-term retention.`);
      setSummarizing(false);
    }, 1500);
  };

  // Lecture to Notes Mock Handler
  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setConverting(true);
      setTimeout(() => {
        setLectureText(`### Lecture Notes (Transcription Sync)\n\n"Today we covered the mechanisms of neural plasticity. Specifically, how synaptic connections strengthen with high-frequency stimulation (LTP), which forms the cellular basis of memory encoding. Spaced review directly matches the biological decay curve of these synapses..."`);
        setConverting(false);
      }, 1500);
    } else {
      setRecording(true);
    }
  };

  // Flashcard Mock Generator
  const generateFlashcardsHandler = () => {
    if (!fcTopic) return;
    setGeneratingFC(true);
    setTimeout(() => {
      setFlashcards([
        { q: `What is the primary concept of ${fcTopic}?`, a: "The foundational theme defined by initial researchers." },
        { q: `What is the main application of ${fcTopic}?`, a: "Direct implementation in problem solving and critical analysis." },
        { q: `Name one limitation of ${fcTopic}.`, a: "Scaling limits under intense operational workloads." }
      ]);
      setGeneratingFC(false);
    }, 1500);
  };

  // Quiz Mock Generator
  const generateQuizHandler = () => {
    if (!quizTopic) return;
    setGeneratingQuiz(true);
    setTimeout(() => {
      setQuizQuestions([
        { q: `Which of the following defines ${quizTopic} best?`, options: ["Option A: Basic placeholder description", "Option B: Detailed technical solution", "Option C: System configuration parameter"], ans: 1 },
        { q: `What is a common misconception about ${quizTopic}?`, options: ["That it requires high power", "That it works instantly without calibration", "That it is only theoretical"], ans: 1 }
      ]);
      setGeneratingQuiz(false);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      {/* Sub navigation side bar */}
      <div className="flex flex-col gap-1">
        {[
          { id: 'notes', label: 'Notes Generator', icon: Sparkles },
          { id: 'pdf', label: 'PDF Summarizer', icon: FileText },
          { id: 'lecture', label: 'Lecture Converter', icon: Mic },
          { id: 'flashcards', label: 'Flashcard Gen', icon: BookOpen },
          { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
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

      {/* Main Workspace window */}
      <GlassCard className="p-8 min-h-[400px]">
        {subTool === 'notes' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Notes Generator</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter study topic (e.g. Quantum Computing, Photosynthesis)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
              <button
                onClick={generateNotesHandler}
                disabled={generatingNotes}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {generatingNotes ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {generatedNotes && (
              <pre className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {generatedNotes}
              </pre>
            )}
          </div>
        )}

        {subTool === 'pdf' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">PDF Summarizer</h3>
            <div className="border border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setPdfFile('mock_file.pdf')}>
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-semibold text-white/80">{pdfFile ? 'mock_file.pdf Selected' : 'Click to Upload PDF'}</p>
              <p className="text-xs text-white/30 mt-2">Support documents up to 50MB</p>
            </div>
            {pdfFile && (
              <button
                onClick={summarizePDFHandler}
                disabled={summarizing}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity"
              >
                {summarizing ? 'Summarizing...' : 'Summarize Document'}
              </button>
            )}
            {summary && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
                {summary}
              </div>
            )}
          </div>
        )}

        {subTool === 'lecture' && (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-left">Lecture-to-Notes Converter</h3>
            <p className="text-white/50 text-sm text-left">Record your live lecture audio. Our AI will transcribe and extract structured notes.</p>
            
            <div className="py-12 flex justify-center">
              <button 
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  recording ? 'bg-rose-500 animate-pulse text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Mic className="w-10 h-10" />
              </button>
            </div>
            <p className="text-sm font-mono text-white/40">
              {recording ? 'Recording lecture... click again to stop' : 'Tap mic to start recording'}
            </p>

            {converting && <div className="text-white/50 animate-pulse mt-4">Transcribing & Generating Notes...</div>}
            
            {lectureText && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-left text-white/80 whitespace-pre-wrap leading-relaxed">
                {lectureText}
              </div>
            )}
          </div>
        )}

        {subTool === 'flashcards' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Flashcard Generator</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Topic for flashcards..."
                value={fcTopic}
                onChange={(e) => setFcTopic(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={generateFlashcardsHandler}
                disabled={generatingFC}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {generatingFC ? 'Creating...' : 'Create Deck'}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {flashcards.map((card, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    const updated = [...flashcards];
                    updated[idx].flipped = !updated[idx].flipped;
                    setFlashcards(updated);
                  }}
                  className="h-40 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center cursor-pointer relative overflow-hidden transition-all hover:border-primary/50"
                >
                  <p className="text-sm font-semibold select-none text-white/80 leading-snug">
                    {card.flipped ? card.a : card.q}
                  </p>
                  <span className="absolute bottom-3 right-3 text-[10px] text-white/30 select-none">
                    {card.flipped ? 'Answer' : 'Question'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'quiz' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Quiz Generator</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Topic for dynamic quiz..."
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={generateQuizHandler}
                disabled={generatingQuiz}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
              >
                {generatingQuiz ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>

            {quizQuestions.length > 0 && (
              <div className="space-y-6 mt-6">
                {quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                    <p className="font-semibold text-white/90">{q.q}</p>
                    <div className="grid gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => {
                            const updated = [...quizQuestions];
                            updated[qIdx].selected = optIdx;
                            setQuizQuestions(updated);
                          }}
                          className={`w-full py-3 px-4 rounded-xl border text-left text-sm transition-all ${
                            q.selected === optIdx 
                              ? (optIdx === q.ans ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300')
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   2. TIME & SCHEDULE COMPONENT (Planner, Pomodoro, Exam Countdown)
   ========================================================================== */
function ScheduleWorkspace() {
  const [subTool, setSubTool] = useState<'planner' | 'pomo' | 'exams'>('planner');

  // Study Planner State
  const [sessions, setSessions] = useState<{ id: string; subject: string; time: string; completed?: boolean }[]>([
    { id: '1', subject: 'Linear Algebra Review', time: '10:00 AM', completed: false },
    { id: '2', subject: 'Physics Lab Report Prep', time: '2:30 PM', completed: true },
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('');

  const addSession = () => {
    if (!newSubject || !newTime) return;
    setSessions([...sessions, { id: Date.now().toString(), subject: newSubject, time: newTime, completed: false }]);
    setNewSubject('');
    setNewTime('');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  // Pomodoro Timer State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setPomoTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            return 0;
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
  }, [timerRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Exam Countdown State
  const [exams, setExams] = useState<{ id: string; name: string; date: string }[]>([
    { id: '1', name: 'Computer Science Midterm', date: '2026-06-15' },
    { id: '2', name: 'Organic Chemistry Final', date: '2026-06-28' },
  ]);
  const [newExamName, setNewExamName] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  const addExam = () => {
    if (!newExamName || !newExamDate) return;
    setExams([...exams, { id: Date.now().toString(), name: newExamName, date: newExamDate }]);
    setNewExamName('');
    setNewExamDate('');
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} Days Left` : 'Exam Passed';
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'planner', label: 'Study Planner', icon: Calendar },
          { id: 'pomo', label: 'Pomodoro Timer', icon: Timer },
          { id: 'exams', label: 'Exam Countdown', icon: Clock },
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
        {subTool === 'planner' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Study Planner</h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Subject..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Time (e.g. 3:00 PM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="sm:w-48 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={addSession}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-3 mt-6">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setSessions(sessions.map(s => s.id === session.id ? { ...s, completed: !s.completed } : s));
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        session.completed ? 'bg-primary border-primary text-black' : 'border-white/20'
                      }`}
                    >
                      {session.completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </button>
                    <div>
                      <p className={`font-semibold ${session.completed ? 'line-through text-white/30' : 'text-white'}`}>{session.subject}</p>
                      <p className="text-xs text-white/40">{session.time}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteSession(session.id)} className="text-white/40 hover:text-rose-400 p-1">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'pomo' && (
          <div className="space-y-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-2xl font-bold self-start">Pomodoro Timer</h3>
            
            <div className="relative w-48 h-48 rounded-full border-4 border-white/5 flex flex-col items-center justify-center bg-white/5">
              <span className="text-4xl font-display font-bold text-white tracking-wide">{formatTime(pomoTime)}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1 font-mono">Focus Phase</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {timerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-black" />}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setPomoTime(25 * 60);
                }}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {subTool === 'exams' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Exam Countdown</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Exam Name..."
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <input
                type="date"
                value={newExamDate}
                onChange={(e) => setNewExamDate(e.target.value)}
                className="sm:w-56 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={addExam}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {exams.map((exam) => (
                <div key={exam.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white/90 text-lg">{exam.name}</h4>
                    <p className="text-sm text-primary font-mono font-semibold mt-1">{getDaysLeft(exam.date)}</p>
                  </div>
                  <button onClick={() => deleteExam(exam.id)} className="text-white/40 hover:text-rose-400 p-1">
                    <Trash2 className="w-4.5 h-4.5" />
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
   3. ACADEMIA TRACKER COMPONENT (Assignments, GPA/CGPA Calculator)
   ========================================================================== */
function TrackerWorkspace() {
  const [subTool, setSubTool] = useState<'assignments' | 'gpa'>('assignments');

  // Assignment Tracker State
  const [assignments, setAssignments] = useState<{ id: string; title: string; due: string; status: 'todo' | 'progress' | 'done' }[]>([
    { id: '1', title: 'Math Problem Set 4', due: 'June 5', status: 'todo' },
    { id: '2', title: 'History Term Paper Outline', due: 'June 10', status: 'progress' },
    { id: '3', title: 'Biology Lab Report 1', due: 'May 20', status: 'done' },
  ]);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDue, setNewAssignDue] = useState('');

  const addAssignment = () => {
    if (!newAssignTitle || !newAssignDue) return;
    setAssignments([...assignments, { id: Date.now().toString(), title: newAssignTitle, due: newAssignDue, status: 'todo' }]);
    setNewAssignTitle('');
    setNewAssignDue('');
  };

  const cycleStatus = (id: string) => {
    setAssignments(assignments.map(a => {
      if (a.id === id) {
        const nextStatus: Record<typeof a.status, typeof a.status> = {
          todo: 'progress',
          progress: 'done',
          done: 'todo'
        };
        return { ...a, status: nextStatus[a.status] };
      }
      return a;
    }));
  };

  // GPA Calculator State
  const [courses, setCourses] = useState<{ id: string; name: string; grade: number; credits: number }[]>([
    { id: '1', name: 'Intro to Programming', grade: 4.0, credits: 4 },
    { id: '2', name: 'Calculus I', grade: 3.7, credits: 4 },
    { id: '3', name: 'Physics I', grade: 3.3, credits: 3 },
  ]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseGrade, setNewCourseGrade] = useState('4.0');
  const [newCourseCredits, setNewCourseCredits] = useState('3');

  const addCourse = () => {
    if (!newCourseName) return;
    setCourses([...courses, {
      id: Date.now().toString(),
      name: newCourseName,
      grade: parseFloat(newCourseGrade),
      credits: parseInt(newCourseCredits)
    }]);
    setNewCourseName('');
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += c.grade * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'assignments', label: 'Assignment Tracker', icon: ListTodo },
          { id: 'gpa', label: 'GPA Calculator', icon: GraduationCap },
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
        {subTool === 'assignments' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Assignment Tracker</h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Assignment Title..."
                value={newAssignTitle}
                onChange={(e) => setNewAssignTitle(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Due Date (e.g. June 10)"
                value={newAssignDue}
                onChange={(e) => setNewAssignDue(e.target.value)}
                className="sm:w-48 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={addAssignment}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-3 mt-6">
              {assignments.map((assign) => (
                <div key={assign.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-white/95">{assign.title}</h4>
                    <p className="text-xs text-white/40">Due: {assign.due}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => cycleStatus(assign.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize border transition-all ${
                        assign.status === 'todo' && 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      } ${
                        assign.status === 'progress' && 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      } ${
                        assign.status === 'done' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {assign.status}
                    </button>
                    <button onClick={() => setAssignments(assignments.filter(a => a.id !== assign.id))} className="text-white/40 hover:text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTool === 'gpa' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-2xl font-bold">GPA/CGPA Calculator</h3>
              <div className="text-right">
                <span className="text-[10px] text-white/30 uppercase tracking-widest block font-mono">Current GPA</span>
                <span className="text-3xl font-display font-bold text-primary">{calculateGPA()}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Course Name..."
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="sm:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <select
                value={newCourseGrade}
                onChange={(e) => setNewCourseGrade(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="4.0">A (4.0)</option>
                <option value="3.7">A- (3.7)</option>
                <option value="3.3">B+ (3.3)</option>
                <option value="3.0">B (3.0)</option>
                <option value="2.7">B- (2.7)</option>
                <option value="2.3">C+ (2.3)</option>
                <option value="2.0">C (2.0)</option>
                <option value="1.0">D (1.0)</option>
                <option value="0.0">F (0.0)</option>
              </select>
              <input
                type="number"
                placeholder="Credits"
                value={newCourseCredits}
                onChange={(e) => setNewCourseCredits(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
            </div>
            
            <button
              onClick={addCourse}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Add Course
            </button>

            <div className="space-y-3 mt-6">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-white/90">{course.name}</h4>
                    <p className="text-xs text-white/40">{course.credits} Credits</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold font-mono text-sm">{course.grade.toFixed(1)}</span>
                    <button onClick={() => deleteCourse(course.id)} className="text-white/40 hover:text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
   4. RESOURCE VAULT COMPONENT (Store: websites, youtube videos, pdfs, articles, courses)
   ========================================================================== */
function ResourceVaultWorkspace() {
  const { resources, addResource, deleteResource } = useVaultStore();
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Website' | 'YouTube Video' | 'PDF Document' | 'Article' | 'Course'>('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSaveResource = async () => {
    if (!newUrl.trim() && !newTitle.trim()) return;
    setIsAnalyzing(true);
    
    await addResource(
      newTitle.trim() || 'Scanned Resource Node',
      newUrl.trim(),
      newNotes.trim()
    );
    
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setIsAnalyzing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'YouTube Video': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'PDF Document': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Course': return 'bg-violet-500/10 border-violet-500/30 text-violet-400';
      case 'Article': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'YouTube Video': return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'PDF Document': return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case 'Course': return <GraduationCap className="w-3.5 h-3.5 text-violet-400" />;
      case 'Article': return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20';
      case 'Advanced': return 'bg-rose-400/20 text-rose-300 border-rose-400/20';
      default: return 'bg-blue-400/20 text-blue-300 border-blue-400/20';
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <FolderHeart className="w-6 h-6 text-indigo-400" />
            <span>AI Resource Vault</span>
          </h3>
          <p className="text-white/40 text-xs mt-1">
            Save articles, YouTube tutorials, PDF guides, courses, or websites. The Life OS AI automatically categorizes and tags your resources.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6"
                >
                  <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest animate-pulse">
                    AI Auto-Categorizing...
                  </span>
                  <p className="text-[10px] text-white/40 max-w-[200px] mt-2">
                    Parsing metadata, checking domain patterns, and extracting tags...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white/95">Save New Resource</h4>
              
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase">Resource URL</span>
                  <input
                    type="text"
                    placeholder="https://example.com/learn-something"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase">Title / Name</span>
                  <input
                    type="text"
                    placeholder="Title (or let AI auto-extract)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase">Private Notes / Goal</span>
                  <textarea
                    placeholder="Why are you saving this? What are your learning targets?"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveResource}
              disabled={!newUrl.trim() && !newTitle.trim()}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity mt-6 flex items-center justify-center gap-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Save and Categorize
            </button>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-white/30" />
              <input
                type="text"
                placeholder="Search resources, tags, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-white/20"
              />
            </div>
            
            <div className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/30" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Website">Websites</option>
                <option value="YouTube Video">YouTube Videos</option>
                <option value="PDF Document">PDF Documents</option>
                <option value="Article">Articles</option>
                <option value="Course">Courses</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
            {filteredResources.map((resource) => (
              <GlassCard key={resource.id} className="p-5 flex flex-col justify-between h-56 border-white/5 hover:bg-white/[0.04] transition-colors relative">
                <div className={cn(
                  "absolute left-0 top-4 bottom-4 w-1 rounded-r-md",
                  resource.category === 'YouTube Video' && 'bg-rose-500',
                  resource.category === 'PDF Document' && 'bg-amber-500',
                  resource.category === 'Course' && 'bg-violet-500',
                  resource.category === 'Article' && 'bg-emerald-500',
                  resource.category === 'Website' && 'bg-blue-500'
                )} />

                <div className="space-y-3 pl-2">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[9px] font-mono font-semibold px-2 py-0.5 rounded border uppercase flex items-center gap-1",
                      getCategoryColor(resource.category)
                    )}>
                      {getCategoryIcon(resource.category)}
                      <span>{resource.category.replace(' Document', '').replace(' Video', '')}</span>
                    </span>
                    
                    <span className={cn(
                      "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border capitalize",
                      getDifficultyColor(resource.difficulty)
                    )}>
                      {resource.difficulty}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-semibold text-white/95 text-sm line-clamp-2 leading-tight">
                      {resource.title}
                    </h5>
                    <p className="text-white/40 text-[10px] line-clamp-2 mt-1.5 leading-snug">
                      {resource.notes}
                    </p>
                  </div>
                </div>

                <div className="pl-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap min-w-0">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-[8px] font-mono text-white/30 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => window.open(resource.url, '_blank')}
                      className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
                      title="Open Resource"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}

            {filteredResources.length === 0 && (
              <div className="col-span-2 text-center py-20 text-white/30 text-xs italic">
                No matching vault resources found. Click "Save and Categorize" on the left to add items!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
