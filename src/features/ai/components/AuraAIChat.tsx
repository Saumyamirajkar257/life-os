/**
 * @file AuraAIChat.tsx
 * @description Desktop AI Chat experience with conversation history, streaming rendering, markdown/code/table support, and quick actions.
 * @module AuraAI/Components
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Sparkles,
  Paperclip,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Flame,
  Target,
  Wallet,
  BookOpen,
  ChevronRight,
  User,
  Check,
  Copy,
  Zap
} from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { useAIProvider } from '../hooks/useAIProvider';
import { useAIWorkflows } from '../hooks/useAIWorkflows';
import { useAIContext } from '../hooks/useAIContext';

interface AuraAIChatProps {
  initialPrompt?: string;
  onNavigateToSection?: (section: string) => void;
}

export const AuraAIChat: React.FC<AuraAIChatProps> = ({ initialPrompt, onNavigateToSection }) => {
  const {
    activeConversation,
    isGenerating,
    createConversation,
    sendMessage,
  } = useAIChat();

  const { activeProvider, activeModel } = useAIProvider();
  const { runWorkflow, activeRunningWorkflowId } = useAIWorkflows();
  const { snapshot } = useAIContext();

  const [input, setInput] = useState(initialPrompt || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isGenerating]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    if (!activeConversation) {
      createConversation();
      setTimeout(() => sendMessage(text), 100);
    } else {
      sendMessage(text);
    }
  };

  const handleRunWorkflow = (workflowId: string, promptText: string) => {
    if (!activeConversation) {
      createConversation();
    }
    // We visually insert the user's request
    setTimeout(() => {
      sendMessage(promptText);
      if (!['add_salary', 'create_task', 'complete_task', 'log_expense', 'check_habit'].includes(workflowId)) {
        runWorkflow(workflowId as any);
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_ACTIONS = [
    { id: 'add_salary', label: 'Add Salary $1,000', icon: Wallet, prompt: 'add money i got salary 1000' },
    { id: 'create_task', label: 'Create Task (!high)', icon: CheckCircle2, prompt: 'add a new task buy groceries !high' },
    { id: 'complete_task', label: 'Complete Task', icon: CheckCircle2, prompt: 'I completed this task' },
    { id: 'log_expense', label: 'Log $50 Expense', icon: Wallet, prompt: 'spent 50 on groceries' },
    { id: 'check_habit', label: 'Check Habit Streak', icon: Flame, prompt: 'checked habit meditation' },
    { id: 'plan_my_day', label: 'Plan My Day', icon: Calendar, prompt: "Plan my day based on today's tasks and schedule" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-background)]">
      {/* Top Header & Context Indicator */}
      {activeConversation && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => createConversation()}
              className="p-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h2 className="text-sm font-semibold text-white">
                  {activeConversation.title || 'Aura Intelligence'}
                </h2>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Aura Personal Intelligence · Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-wide uppercase text-[var(--color-text-muted)]">
            <span className="hidden sm:inline">Context:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Tasks</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Calendar</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Habits</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Goals</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Finance</span>
            </div>
          </div>
        </div>
      )}

      {/* Message Stream or Empty State */}
      <div className="flex-1 overflow-y-auto pt-6 pb-4 space-y-6 scrollbar-none">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto px-4 mt-4">
            <div className="space-y-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-white mb-2 shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Ask Aura</h1>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
                Aura is connected to your tasks, calendar, habits, goals, and finances.
              </p>
            </div>

            <div className="w-full relative group">
              <div className="relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden focus-within:border-neutral-600 transition-colors">
                <textarea
                  rows={3}
                  placeholder="Ask Aura anything... (e.g. 'What are my top priorities today?')"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 bg-transparent text-sm text-white placeholder-[var(--color-text-muted)] focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between p-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]/40">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-mono">
                    <span>Press Enter to send</span>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Ask</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleRunWorkflow(action.id, action.prompt)}
                    disabled={activeRunningWorkflowId === action.id || isGenerating}
                    className="p-3.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-neutral-700 text-left transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="p-1.5 w-fit rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] group-hover:text-white transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 px-4 pb-20">
            {activeConversation.messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isUser ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-white' : 'bg-gradient-to-br from-[var(--color-accent)] to-teal-500 shadow-lg text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-1.5 flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] ${isUser ? 'justify-end' : 'justify-between'}`}>
                      <span>{isUser ? 'You' : 'Aura'}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-white transition-colors p-1"
                        >
                          {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    <div
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'text-white'
                          : 'text-[var(--color-text-secondary)] space-y-4'
                      }`}
                    >
                      {/* Structured markdown rendering for AI responses */}
                      {m.content.split(/\r?\n/).map((line, i) => {
                        const renderInline = (text: string) => {
                          const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
                          return parts.map((part, idx) => {
                            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                              return (
                                <strong key={idx} className="font-semibold text-white">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
                              return (
                                <em key={idx} className="italic text-[var(--color-text-primary)]">
                                  {part.slice(1, -1)}
                                </em>
                              );
                            }
                            if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
                              return (
                                <code key={idx} className="px-1.5 py-0.5 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-accent)]">
                                  {part.slice(1, -1)}
                                </code>
                              );
                            }
                            return part;
                          });
                        };

                        if (line.startsWith('> ⚡') || line.startsWith('> **Action Executed:')) {
                          return (
                            <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold my-1 shadow-sm">
                              {renderInline(line.replace(/^>\s*/, ''))}
                            </div>
                          );
                        }
                        if (line.startsWith('> ⚠️')) {
                          return (
                            <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold my-1 shadow-sm">
                              {renderInline(line.replace(/^>\s*/, ''))}
                            </div>
                          );
                        }
                        if (line.startsWith('> ')) {
                          return (
                            <blockquote key={i} className="border-l-2 border-[var(--color-accent)] pl-3 text-xs text-[var(--color-text-secondary)] italic my-2">
                              {renderInline(line.replace(/^>\s*/, ''))}
                            </blockquote>
                          );
                        }
                        if (line.startsWith('# ')) {
                          return <h1 key={i} className="text-lg font-bold text-white mt-3 mb-1">{renderInline(line.replace('# ', ''))}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={i} className="text-base font-bold text-white mt-3 mb-1">{renderInline(line.replace('## ', ''))}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="text-sm font-semibold text-white mt-2 mb-1">{renderInline(line.replace('### ', ''))}</h3>;
                        }
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                          return <li key={i} className="ml-4 list-disc marker:text-[var(--color-accent)] my-0.5">{renderInline(line.replace(/^[-*]\s/, ''))}</li>;
                        }
                        if (/^\d+\.\s/.test(line)) {
                          return <li key={i} className="ml-4 list-decimal marker:text-[var(--color-accent)] my-0.5">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
                        }
                        if (line.trim() === '') {
                          return <div key={i} className="h-1.5" />;
                        }
                        return <p key={i} className="leading-relaxed">{renderInline(line)}</p>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isGenerating && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[var(--color-accent)] to-teal-500 shadow-lg text-white">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex items-center text-sm text-[var(--color-text-tertiary)] italic animate-pulse">
                  Aura is executing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar for Active Chat */}
      {activeConversation && activeConversation.messages.length > 0 && (
        <div className="pt-2 pb-6 max-w-3xl mx-auto w-full px-4">
          <div className="relative flex items-end gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-2 focus-within:border-[var(--color-accent-muted)] transition-colors shadow-lg shadow-black/20">
            <div className="flex items-center gap-1 mb-1">
              <button className="p-2 text-[var(--color-text-tertiary)] hover:text-white rounded-lg transition-colors" title="Voice Input">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={1}
              placeholder="Ask Aura anything or give commands (e.g. 'add money i got salary 1000', 'completed this task', 'add task Buy groceries !high')..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 py-3 px-2 bg-transparent text-sm text-white placeholder-[var(--color-text-tertiary)] focus:outline-none resize-none max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="mb-1 p-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:bg-[var(--color-surface-hover)] text-white transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[10px] text-[var(--color-text-tertiary)]">Aura can make mistakes. Verify important information.</span>
          </div>
        </div>
      )}
    </div>
  );
};
