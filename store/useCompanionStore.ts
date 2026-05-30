import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/lib/firebase';

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CompanionState {
  companionOpen: boolean;
  petLevel: number;
  petXp: number;
  petMood: 'happy' | 'neutral' | 'sleepy' | 'excited' | 'thinking';
  energyLevel: 'exhausted' | 'low' | 'focused' | 'hyper';
  messages: CompanionMessage[];
  isTyping: boolean;
  xpNotifications: { id: string; amount: number; type: 'feed' | 'pet' | 'levelup' }[];
  
  setCompanionOpen: (open: boolean) => void;
  feedPet: () => void;
  petCompanion: () => void;
  setEnergyLevel: (level: 'exhausted' | 'low' | 'focused' | 'hyper') => void;
  sendMessage: (text: string, context: any) => Promise<void>;
  triggerBrutalCritique: (context: any) => Promise<void>;
  clearCompanionMessages: () => void;
  clearNotification: (id: string) => void;
}

const defaultWelcome = (): CompanionMessage => ({
  id: 'welcome',
  sender: 'assistant',
  content: "Hi! I'm FA9, your personal AI Coach Companion. I sync with your goals, tasks, habits, and exam deadlines. Talk to me, adjust your energy vibe, or click 'Brutal Critique' for an honest OS review! You can also feed or pet me to boost my level.",
  timestamp: new Date().toISOString()
});

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set, get) => ({
      companionOpen: false,
      petLevel: 1,
      petXp: 0,
      petMood: 'neutral',
      energyLevel: 'focused',
      messages: [defaultWelcome()],
      isTyping: false,
      xpNotifications: [],

      setCompanionOpen: (open) => set({ companionOpen: open }),

      feedPet: () => {
        const currentXp = get().petXp;
        const currentLevel = get().petLevel;
        let newXp = currentXp + 25;
        let newLevel = currentLevel;
        let leveledUp = false;

        if (newXp >= 100) {
          newXp = newXp - 100;
          newLevel = currentLevel + 1;
          leveledUp = true;
        }

        const notificationId = `xp-${Date.now()}`;
        const newNotifications = [...get().xpNotifications, { id: notificationId, amount: 25, type: 'feed' as const }];
        if (leveledUp) {
          newNotifications.push({ id: `lvl-${Date.now()}`, amount: newLevel, type: 'levelup' as const });
        }

        set({
          petXp: newXp,
          petLevel: newLevel,
          petMood: 'excited',
          xpNotifications: newNotifications,
        });

        // Add companion verbal acknowledgment
        const feedMsg: CompanionMessage = {
          id: `feed-ack-${Date.now()}`,
          sender: 'assistant',
          content: leveledUp 
            ? `*MUNCH MUNCH* Level Up! FA9 has reached Level ${newLevel}! Cognitive core processing is expanding!`
            : "*OM NOM NOM* Delicious! That focus-snack recharged my circuits. (+25 XP gained)",
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          messages: [...state.messages, feedMsg]
        }));
      },

      petCompanion: () => {
        const currentXp = get().petXp;
        const currentLevel = get().petLevel;
        let newXp = currentXp + 10;
        let newLevel = currentLevel;
        let leveledUp = false;

        if (newXp >= 100) {
          newXp = newXp - 100;
          newLevel = currentLevel + 1;
          leveledUp = true;
        }

        const notificationId = `xp-${Date.now()}`;
        const newNotifications = [...get().xpNotifications, { id: notificationId, amount: 10, type: 'pet' as const }];
        if (leveledUp) {
          newNotifications.push({ id: `lvl-${Date.now()}`, amount: newLevel, type: 'levelup' as const });
        }

        set({
          petXp: newXp,
          petLevel: newLevel,
          petMood: 'happy',
          xpNotifications: newNotifications,
        });

        const petMsg: CompanionMessage = {
          id: `pet-ack-${Date.now()}`,
          sender: 'assistant',
          content: leveledUp
            ? `*PURR* Level Up! FA9 has reached Level ${newLevel}! Your strategic companion is growing stronger.`
            : "*purr...* Bleep bloop, that feels nice! Habit calibration locked. (+10 XP gained)",
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          messages: [...state.messages, petMsg]
        }));
      },

      setEnergyLevel: (level) => {
        set({ energyLevel: level });
        
        let responseContent = '';
        switch(level) {
          case 'exhausted':
            responseContent = "⚠️ Exhausted energy logged. Warning: Proceeding with deep work is highly inefficient. I recommend stopping coding tasks, shutting down screens, and logging 8 hours of sleep.";
            break;
          case 'low':
            responseContent = "⚡ Low energy logged. High cognitive load tasks should be deferred. Suggest doing lower-intensity tasks like reading PDF summaries, checking finance budgets, or planning tomorrow.";
            break;
          case 'focused':
            responseContent = "🎯 Focused energy logged! Systems ready. Launch a focus block timer right now and complete your high-priority project tasks.";
            break;
          case 'hyper':
            responseContent = "🔥 Hyper energy logged! You are overflowing with capacity. Direct this surge immediately into team project setup or closing pending habit items.";
            break;
        }
        
        const systemTip: CompanionMessage = {
          id: `energy-tip-${Date.now()}`,
          sender: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          messages: [...state.messages, systemTip],
          petMood: level === 'focused' || level === 'hyper' ? 'excited' : 'sleepy'
        }));
      },

      sendMessage: async (text, context) => {
        if (!text.trim()) return;

        const userMsg: CompanionMessage = {
          id: `user-${Date.now()}`,
          sender: 'user',
          content: text.trim(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMsg],
          isTyping: true,
          petMood: 'thinking',
        }));

        try {
          const user = auth.currentUser;
          const uid = user ? user.uid : (typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true' ? 'sandbox-user-id' : null);

          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'chat',
              message: text.trim(),
              context,
              uid,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const aiMsg: CompanionMessage = {
              id: `ai-${Date.now()}`,
              sender: 'assistant',
              content: data.response || "I am analyzing your data. Keep maintaining habit streaks to optimize my cognitive capacity.",
              timestamp: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, aiMsg],
              petMood: 'happy',
            }));
          } else {
            throw new Error('Failed to get response');
          }
        } catch (e) {
          console.error(e);
          const aiMsg: CompanionMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            content: "My connection to the cognitive core was briefly interrupted. Let's focus on completing one high priority task!",
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, aiMsg],
            petMood: 'neutral',
          }));
        } finally {
          set({ isTyping: false });
        }
      },

      triggerBrutalCritique: async (context) => {
        set((state) => ({
          isTyping: true,
          petMood: 'thinking',
        }));

        const prompt = `Give me a brutal, honest operating system review critique of my progress.
Analyze my current pending high priority tasks, habit streaks, sleep memory, and exams.
Reference specific details from my logs to criticize or rate my productivity (e.g. "You haven't touched German in 8 days" or "Your exam is in 12 days and you're only 35% prepared").
Keep your critique short, direct, and motivating. Limit to 3 sentences maximum. Be a harsh personal trainer coach.`;

        try {
          const user = auth.currentUser;
          const uid = user ? user.uid : (typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true' ? 'sandbox-user-id' : null);

          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'chat',
              message: prompt,
              context,
              uid,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const aiMsg: CompanionMessage = {
              id: `critique-${Date.now()}`,
              sender: 'assistant',
              content: data.response || "No tasks completed. Zero habit streaks. You are stagnating. Boot up a focus session immediately.",
              timestamp: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, aiMsg],
              petMood: 'neutral',
            }));
          } else {
            throw new Error('Critique failed');
          }
        } catch (e) {
          console.error(e);
          const aiMsg: CompanionMessage = {
            id: `critique-fail-${Date.now()}`,
            sender: 'assistant',
            content: "I couldn't run a full audit right now, but warning: your German habit streak is broken and pending high priority items require action immediately.",
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, aiMsg],
            petMood: 'neutral',
          }));
        } finally {
          set({ isTyping: false });
        }
      },

      clearCompanionMessages: () => {
        set({ messages: [defaultWelcome()] });
      },

      clearNotification: (id) => {
        set((state) => ({
          xpNotifications: state.xpNotifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: 'life-os-companion-settings',
    }
  )
);
