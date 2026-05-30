'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, GraduationCap, Search, FileQuestion, FileText, 
  Briefcase, MessageSquare, Mail, Presentation, Send, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

type Tab = 'learn' | 'career' | 'creator';

export default function AIFeatures() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          🤖 AI Features
        </h1>
        <p className="text-white/40">Access advanced neural assistants optimized for learning, professional career building, and creation.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'learn' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Learn & Solve
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'career' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Career & Interviews
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'creator' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Presentation className="w-4 h-4" /> Creator Suite
        </button>
      </div>

      {/* Panel Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'learn' && <LearnWorkspace />}
          {activeTab === 'career' && <CareerWorkspace />}
          {activeTab === 'creator' && <CreatorWorkspace />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   1. LEARN & SOLVE HUB (Study Assistant, Research Assistant, Doubt Solver)
   ========================================================================== */
function LearnWorkspace() {
  const [subTool, setSubTool] = useState<'study' | 'research' | 'doubt'>('study');

  // Study Assistant State
  const [studyMsg, setStudyMsg] = useState('');
  const [studyChat, setStudyChat] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Study Assistant. Drop any topic or question you need help breaking down.' }
  ]);

  const sendStudyMsg = () => {
    if (!studyMsg) return;
    const newChat = [...studyChat, { sender: 'user' as 'user', text: studyMsg }];
    setStudyChat(newChat);
    const userQuery = studyMsg;
    setStudyMsg('');
    setTimeout(() => {
      setStudyChat([...newChat, { 
        sender: 'ai' as 'ai', 
        text: `Here is a structured explanation regarding "${userQuery}":\n\n1. **Core Concept:** It acts as the backbone theory in this topic.\n2. **Critical Formula/Fact:** Re-evaluating components reveals that variables directly interact in a linear format.\n3. **Analogy:** Think of this like water flow through pipes—constrictions increase resistance, similar to resistors in a circuit.` 
      }]);
    }, 1200);
  };

  // Research Assistant State
  const [researchTopic, setResearchTopic] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [researching, setResearching] = useState(false);

  const performResearch = () => {
    if (!researchTopic) return;
    setResearching(true);
    setTimeout(() => {
      setResearchResult(`### Academic Literature Digest: ${researchTopic}\n\n- **Summary of Consensus:** Multiple peer-reviewed studies indicate a 20% margin of efficiency improvement when using standard parameters.\n- **Primary Methodology:** Quantitative modeling paired with double-blind empirical testing.\n- **Identified Gaps:** Limited testing in lower temperature boundaries and edge scenarios.`);
      setResearching(false);
    }, 1500);
  };

  // Doubt Solver State
  const [doubtText, setDoubtText] = useState('');
  const [doubtSolution, setDoubtSolution] = useState('');
  const [solving, setSolving] = useState(false);

  const solveDoubt = () => {
    if (!doubtText) return;
    setSolving(true);
    setTimeout(() => {
      setDoubtSolution(`### Step-by-Step Resolution\n\n**Problem:** "${doubtText}"\n\n* **Step 1 (Analysis):** Isolate variables and identify boundary values.\n* **Step 2 (Simplification):** Apply fundamental laws (e.g. conservation of energy, algebraic balance) to cancel complex parameters.\n* **Step 3 (Result):** Final calculation yields the simplified model. Double-check results against core definitions.`);
      setSolving(false);
    }, 1400);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'study', label: 'Study Assistant', icon: Sparkles },
          { id: 'research', label: 'Research Assistant', icon: Search },
          { id: 'doubt', label: 'Doubt Solver', icon: FileQuestion },
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
        {subTool === 'study' && (
          <div className="flex flex-col h-[450px]">
            <h3 className="text-2xl font-bold mb-4">AI Study Assistant</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {studyChat.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' ? 'bg-primary text-black font-medium' : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your assistant anything..."
                value={studyMsg}
                onChange={(e) => setStudyMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendStudyMsg()}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button onClick={sendStudyMsg} className="p-3 bg-white text-black rounded-xl hover:opacity-90">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {subTool === 'research' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Research Assistant</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter research topic/question..."
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={performResearch}
                disabled={researching}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
              >
                {researching ? 'Analyzing...' : 'Research'}
              </button>
            </div>
            {researchResult && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
                {researchResult}
              </div>
            )}
          </div>
        )}

        {subTool === 'doubt' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Doubt Solver</h3>
            <textarea
              rows={4}
              placeholder="Paste the problem statement or question you are stuck on..."
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
            />
            <button
              onClick={solveDoubt}
              disabled={solving}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90"
            >
              {solving ? 'Solving Doubt...' : 'Solve Instantly'}
            </button>
            {doubtSolution && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
                {doubtSolution}
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   2. CAREER & INTERVIEWS (Resume Builder, Career Advisor, Interview Practice)
   ========================================================================== */
function CareerWorkspace() {
  const [subTool, setSubTool] = useState<'resume' | 'advisor' | 'interview'>('resume');

  // Resume Builder State
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [exp, setExp] = useState('');
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [generatingResume, setGeneratingResume] = useState(false);

  const generateResume = () => {
    if (!name || !skills) return;
    setGeneratingResume(true);
    setTimeout(() => {
      setResumeData(`## ${name}\n\n**Professional Skills:** ${skills}\n\n**Key Work Experience:** ${exp || 'Not specified'}\n\n--- \n*Generated Profile by LIFE OS Career AI*`);
      setGeneratingResume(false);
    }, 1500);
  };

  // Career Advisor State
  const [interests, setInterests] = useState('');
  const [advice, setAdvice] = useState('');
  const [advising, setAdvising] = useState(false);

  const getCareerAdvice = () => {
    if (!interests) return;
    setAdvising(true);
    setTimeout(() => {
      setAdvice(`### Career Recommendations\n\nBased on your interest in "${interests}", here are top matches:\n\n1. **Software Architect / Engineering Manager** (High alignment with tech and design)\n2. **Product Designer / UX Specialist** (Ideal for creative system analysis)\n\n**Suggested Next Step:** Work on building a localized portfolio project focusing on automation.`);
      setAdvising(false);
    }, 1400);
  };

  // Interview Practice State
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewStatus, setInterviewStatus] = useState<'idle' | 'started' | 'feedback'>('idle');
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const startInterview = () => {
    if (!interviewRole) return;
    setInterviewStatus('started');
    setQuestion(`"Tell me about a time you designed a complex software system. What were the challenges, and how did you resolve them?"`);
  };

  const submitAnswer = () => {
    if (!userAnswer) return;
    setInterviewStatus('feedback');
    setFeedback(`### AI Evaluation & Feedback\n\n- **Strengths:** Good structure and clear articulation of system architecture.\n- **Improvement Areas:** Elaborate more on quantitative outcomes (e.g. latency reduced by X%).\n- **Score:** 8.5 / 10`);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'resume', label: 'Resume Builder', icon: FileText },
          { id: 'advisor', label: 'Career Advisor', icon: Briefcase },
          { id: 'interview', label: 'Interview Practice', icon: MessageSquare },
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
        {subTool === 'resume' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-2">AI Resume Builder</h3>
            <input
              type="text"
              placeholder="Full Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="Skills (comma separated)..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
            <textarea
              rows={3}
              placeholder="Experience / Projects Summary..."
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
            />
            <button
              onClick={generateResume}
              disabled={generatingResume}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
            >
              {generatingResume ? 'Compiling Resume...' : 'Generate Resume Profile'}
            </button>

            {resumeData && (
              <pre className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 font-mono text-sm whitespace-pre-wrap mt-4">
                {resumeData}
              </pre>
            )}
          </div>
        )}

        {subTool === 'advisor' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Career Advisor</h3>
            <textarea
              rows={4}
              placeholder="Describe your interests, values, and what you love working on..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
            />
            <button
              onClick={getCareerAdvice}
              disabled={advising}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90"
            >
              {advising ? 'Formulating Advice...' : 'Get Career Advice'}
            </button>
            {advice && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
                {advice}
              </div>
            )}
          </div>
        )}

        {subTool === 'interview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Interview Practice</h3>
            {interviewStatus === 'idle' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Target Role (e.g. Frontend Engineer, Product Manager)..."
                  value={interviewRole}
                  onChange={(e) => setInterviewRole(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                />
                <button
                  onClick={startInterview}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90"
                >
                  Start Practice Session
                </button>
              </div>
            )}

            {interviewStatus === 'started' && (
              <div className="space-y-4">
                <p className="font-semibold text-primary font-mono text-sm uppercase tracking-wider">Interviewer Question:</p>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl italic text-white/90">
                  {question}
                </div>
                <textarea
                  rows={4}
                  placeholder="Type your response here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
                />
                <button
                  onClick={submitAnswer}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:opacity-90"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {interviewStatus === 'feedback' && (
              <div className="space-y-4">
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
                <button
                  onClick={() => {
                    setInterviewStatus('idle');
                    setUserAnswer('');
                    setFeedback('');
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10"
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   3. CREATOR SUITE (Email Writer, Presentation Generator)
   ========================================================================== */
function CreatorWorkspace() {
  const [subTool, setSubTool] = useState<'email' | 'presentation'>('email');

  // Email Writer State
  const [emailPurpose, setEmailPurpose] = useState('');
  const [emailTone, setEmailTone] = useState('formal');
  const [emailBody, setEmailBody] = useState('');
  const [writingEmail, setWritingEmail] = useState(false);

  const writeEmail = () => {
    if (!emailPurpose) return;
    setWritingEmail(true);
    setTimeout(() => {
      setEmailBody(`Subject: Follow-up regarding ${emailPurpose}\n\nDear recipient,\n\nI hope this email finds you well.\n\nI am writing to officially follow up on ${emailPurpose}. Please let me know if there are additional details required from my end to conclude this task.\n\nThank you for your time.\n\nBest regards,\n[Your Name]`);
      setWritingEmail(false);
    }, 1400);
  };

  // Presentation Generator State
  const [presTopic, setPresTopic] = useState('');
  const [slides, setSlides] = useState<{ title: string; content: string[] }[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [generatingPres, setGeneratingPres] = useState(false);

  const generatePresentation = () => {
    if (!presTopic) return;
    setGeneratingPres(true);
    setTimeout(() => {
      setSlides([
        { title: `Welcome to ${presTopic}`, content: ["Overview of the principal theme", "Significance in modern development workflows", "Key objectives and expected outcomes"] },
        { title: "Functional Breakdown", content: ["Step 1: Input structure definition", "Step 2: Processing and execution modules", "Step 3: Verification and testing phases"] },
        { title: "Conclusion & Next Steps", content: ["Summary of major takeaways", "Identified development roadmaps", "Open forum Q&A session"] }
      ]);
      setActiveSlide(0);
      setGeneratingPres(false);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex flex-col gap-1">
        {[
          { id: 'email', label: 'AI Email Writer', icon: Mail },
          { id: 'presentation', label: 'Slide Deck Gen', icon: Presentation },
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
        {subTool === 'email' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">AI Email Writer</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Email purpose (e.g., project delay, follow-up)..."
                value={emailPurpose}
                onChange={(e) => setEmailPurpose(e.target.value)}
                className="sm:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <select
                value={emailTone}
                onChange={(e) => setEmailTone(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="assertive">Assertive</option>
              </select>
            </div>
            
            <button
              onClick={writeEmail}
              disabled={writingEmail}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
            >
              {writingEmail ? 'Drafting...' : 'Write Email'}
            </button>

            {emailBody && (
              <pre className="p-6 bg-black/40 border border-white/5 rounded-2xl text-white/80 font-mono text-sm whitespace-pre-wrap">
                {emailBody}
              </pre>
            )}
          </div>
        )}

        {subTool === 'presentation' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">AI Presentation Generator</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Slide deck topic (e.g. Solar Energy, Machine Learning)..."
                value={presTopic}
                onChange={(e) => setPresTopic(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
              <button
                onClick={generatePresentation}
                disabled={generatingPres}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
              >
                {generatingPres ? 'Designing...' : 'Generate Deck'}
              </button>
            </div>

            {slides.length > 0 && (
              <div className="mt-8 border border-white/10 rounded-3xl p-8 bg-white/5 relative min-h-[250px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider">Slide {activeSlide + 1} of {slides.length}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">{slides[activeSlide].title}</h4>
                  <ul className="space-y-2 text-white/70">
                    {slides[activeSlide].content.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="text-primary mt-1.5 shrink-0">•</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                    disabled={activeSlide === 0}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={activeSlide === slides.length - 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
