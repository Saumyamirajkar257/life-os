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
      // Simulate sending the prompt and then running the workflow
      sendMessage(promptText);
      runWorkflow(workflowId as any);
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
    { id: 'plan_my_day', label: 'Plan my day', icon: Calendar, prompt: 'Plan my day' },
    { id: 'review_my_week', label: 'Review my week', icon: Zap, prompt: 'Review my week' },
    { id: 'analyze_spending', label: 'Analyze my spending', icon: Wallet, prompt: 'Analyze my spending' },
    { id: 'suggest_focus_time', label: 'Prepare for tomorrow', icon: Target, prompt: 'Prepare for tomorrow' },
    { id: 'goal_progress', label: 'Review my goals', icon: Target, prompt: 'Review my goals' },
    { id: 'review_habits', label: 'Check my habits', icon: Flame, prompt: 'Check my habits' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-background)]">
      {/* Top Header & Context Indicator */}
      {activeConversation && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => createConversation()}
              className="p-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                <h2 className="text-sm font-semibold text-white">
                  {activeConversation.title || 'Aura Intelligence'}
                </h2>
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {activeProvider.name} • {activeModel.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-medium tracking-wide uppercase text-[var(--color-text-tertiary)]">
            <span className="hidden sm:inline">Context:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" /> Tasks</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" /> Calendar</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" /> Habits</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" /> Goals</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" /> Finance</span>
            </div>
          </div>
        </div>
      )}

      {/* Message Stream or Empty State */}
      <div className="flex-1 overflow-y-auto pt-8 pb-4 space-y-6 scrollbar-none">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto px-4 mt-8">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-[var(--color-accent)] to-teal-500 shadow-2xl flex items-center justify-center text-white mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">How can I help today?</h1>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Aura Intelligence is connected to your tasks, calendar, goals, and habits. Ask me anything to get started.
              </p>
            </div>

            <div className="w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden focus-within:border-[var(--color-accent-muted)] transition-colors">
                <textarea
                  rows={3}
                  placeholder="Ask Aura anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 bg-transparent text-sm text-white placeholder-[var(--color-text-tertiary)] focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between p-3 border-t border-[var(--color-border)]/50 bg-[var(--color-background)]/50">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[var(--color-text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors" title="Voice Input">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--color-text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors" title="Attach Image">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="px-4 py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 transition-all"
                  >
                    Send <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleRunWorkflow(action.id, action.prompt)}
                    disabled={activeRunningWorkflowId === action.id || isGenerating}
                    className="p-4 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-left transition-all group disabled:opacity-50"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="p-2 w-fit rounded-lg bg-[var(--color-background)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/10 transition-colors">
                        <Icon className="w-4 h-4" />
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
                  Aura is thinking...
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
              placeholder="Ask Aura anything..."
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
