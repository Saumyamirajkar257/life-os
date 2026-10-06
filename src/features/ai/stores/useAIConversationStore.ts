/**
 * @file useAIConversationStore.ts
 * @description Zustand state management for AI Conversations, Chat Messages, and History.
 * @module AuraAI/Stores
 */

import { create } from 'zustand';
import { AIConversation, AIMessage, AIProviderId } from '../types';

interface AIConversationState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  isGenerating: boolean;
  searchQuery: string;
  selectedTag: string | null;

  // Actions
  setActiveConversationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  createConversation: (title?: string, provider?: AIProviderId, modelId?: string) => AIConversation;
  addMessage: (conversationId: string, message: Omit<AIMessage, 'id' | 'conversationId' | 'timestamp'>) => AIMessage;
  updateMessageContent: (conversationId: string, messageId: string, content: string) => void;
  togglePinConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  setGenerating: (isGenerating: boolean) => void;
}

const INITIAL_CONVERSATIONS: AIConversation[] = [
  {
    id: 'conv_welcome',
    userId: 'user_default',
    title: 'Welcome to Aura Intelligence',
    provider: 'gemini',
    modelId: 'gemini-3.6-flash',
    pinned: true,
    tags: ['Aura', 'Onboarding'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_welcome',
        role: 'assistant',
        content: `👋 Hello! I am **Aura Intelligence**, your complete AI Operating System.

I bring together your entire digital footprint:
- 📅 **Calendar & Schedule**
- ✅ **Tasks & Priorities**
- 🔥 **Habits & Daily Routines**
- 🎯 **Goals & Milestones**
- 📓 **Journal & Emotional Health**
- 💰 **Finances & Wealth OS**

How can I assist you today? Try running **"Plan My Day"** or asking a question!`,
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

export const useAIConversationStore = create<AIConversationState>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: 'conv_welcome',
  isGenerating: false,
  searchQuery: '',
  selectedTag: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setGenerating: (isGenerating) => set({ isGenerating }),

  createConversation: (title = 'New Synthesis Session', provider = 'gemini', modelId = 'gemini-3.6-flash') => {
    const newConv: AIConversation = {
      id: `conv_${Date.now()}`,
      userId: 'user_default',
      title,
      provider,
      modelId,
      pinned: false,
      tags: ['General'],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newConv.id,
    }));

    return newConv;
  },

  addMessage: (conversationId, msg) => {
    const newMsg: AIMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      conversationId,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = [...c.messages, newMsg];
          // Auto update title if first user message
          let newTitle = c.title;
          if (msg.role === 'user' && c.messages.length === 0) {
            newTitle = msg.content.slice(0, 35) + (msg.content.length > 35 ? '...' : '');
          }
          return {
            ...c,
            title: newTitle,
            messages: updatedMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      }),
    }));

    return newMsg;
  },

  updateMessageContent: (conversationId, messageId, content) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: c.messages.map((m) => (m.id === messageId ? { ...m, content } : m)),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      }),
    }));
  },

  togglePinConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    }));
  },

  deleteConversation: (id) => {
    set((state) => {
      const remaining = state.conversations.filter((c) => c.id !== id);
      const nextActive = state.activeConversationId === id ? (remaining[0]?.id || null) : state.activeConversationId;
      return {
        conversations: remaining,
        activeConversationId: nextActive,
      };
    });
  },

  clearAllConversations: () => {
    set({ conversations: [], activeConversationId: null });
  },
}));
