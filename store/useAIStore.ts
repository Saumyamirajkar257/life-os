import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  targetDate: string;
}

export interface AIGoal {
  id: string;
  name: string;
  type: 'short-term' | 'long-term';
  milestones: Milestone[];
  timeline: string;
  progress: number;
}

export interface AIMemory {
  bestFocusTime: string;
  mainWeakness: string;
  strongHabit: string;
  productivityPattern: string;
  strengths: string[];
  weaknesses: string[];
}

export interface NightlyReflection {
  date: string;
  completedTasks: number;
  moodAnalysis: string;
  focusAnalysis: string;
  financeHighlights: string;
  summary: string;
}

export interface DailyBriefing {
  date: string;
  productivitySummary: string;
  unfinishedPriorities: string[];
  todayFocusRecommendation: string;
  streakUpdates: string;
  motivation: string;
}

export interface WeeklyReview {
  weekEndDate: string;
  productivityTrend: string;
  disciplineTrend: string;
  focusTrend: string;
  habitConsistency: string;
  moodChanges: string;
  spendingPatterns: string;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  achievements: string[];
}

export interface AIInsight {
  id: string;
  text: string;
  category: 'productivity' | 'habits' | 'focus' | 'finance' | 'wellness';
  correlation: string;
}

export interface BurnoutStatus {
  detected: boolean;
  level: 'none' | 'warning' | 'critical';
  explanation: string;
  suggestions: string[];
}

export interface LifeScore {
  score: number;
  trend: 'up' | 'down' | 'stable';
  explanation: string;
  history: { date: string; score: number }[];
}

interface AIState {
  goals: AIGoal[];
  memory: AIMemory;
  reflections: NightlyReflection[];
  dailyBriefing: DailyBriefing | null;
  weeklyReview: WeeklyReview | null;
  insights: AIInsight[];
  burnoutStatus: BurnoutStatus;
  lifeScore: LifeScore;
  
  // Actions
  addGoal: (name: string, type: 'short-term' | 'long-term', milestones: Omit<Milestone, 'id' | 'completed'>[], timeline: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;
  addReflection: (reflection: NightlyReflection) => void;
  setDailyBriefing: (briefing: DailyBriefing) => void;
  setWeeklyReview: (review: WeeklyReview) => void;
  setInsights: (insights: AIInsight[]) => void;
  setBurnoutStatus: (status: BurnoutStatus) => void;
  setLifeScore: (score: LifeScore) => void;
  updateMemory: (updates: Partial<AIMemory>) => void;
}

const defaultMemory: AIMemory = {
  bestFocusTime: '8 PM',
  mainWeakness: 'late sleeping',
  strongHabit: 'daily planning',
  productivityPattern: 'higher output after morning routines',
  strengths: ['Consistent early start', 'Deep work concentration'],
  weaknesses: ['Late evening snack spending', 'Inconsistent weekend meditation'],
};

const defaultInsights: AIInsight[] = [
  {
    id: 'insight-1',
    text: 'You are 36% more productive after completing your morning routine.',
    category: 'productivity',
    correlation: 'Morning Meditations ↔ Task Completion',
  },
  {
    id: 'insight-2',
    text: 'Low sleep consistently reduces your focus score by 15 points.',
    category: 'focus',
    correlation: 'Sleep Hours ↔ Focus Timer',
  },
  {
    id: 'insight-3',
    text: 'Gym days correlate with 45% higher task completion rates.',
    category: 'habits',
    correlation: 'Active Workout ↔ Project Milestones',
  },
];

const defaultBriefing: DailyBriefing = {
  date: new Date().toISOString().split('T')[0],
  productivitySummary: 'Your productivity score increased by 11% yesterday. You complete most tasks between 7 PM and 10 PM.',
  unfinishedPriorities: ['Review quarterly financial report', 'Prepare investor presentation slides'],
  todayFocusRecommendation: 'Focus on your highest priority task before noon.',
  streakUpdates: 'Morning Meditations is at an 8-day streak!',
  motivation: 'Isolate deep work. Build continuous progress.',
};

const defaultWeeklyReview: WeeklyReview = {
  weekEndDate: new Date().toISOString().split('T')[0],
  productivityTrend: 'Steady upward trend in deep work sessions.',
  disciplineTrend: 'Completed 92% of scheduled daily workouts.',
  focusTrend: 'Average flow cycle length increased to 45 minutes.',
  habitConsistency: 'Water intake consistent, weekend reflection missed once.',
  moodChanges: 'Strong positive mood recorded during mid-week focus sessions.',
  spendingPatterns: 'Subtle increase in weekend dining out expenses.',
  strengths: ['Strong work block execution', 'Consistent hydration'],
  weaknesses: ['Minor late-night screen time', 'Impulse snack shopping'],
  improvementAreas: ['Weekend routine alignment', 'Streamlining meeting slots'],
  achievements: ['Achieved 12-day hydration streak', 'Closed high-priority slides early'],
};

const defaultBurnout: BurnoutStatus = {
  detected: false,
  level: 'none',
  explanation: 'Systems metrics indicate balanced workloads and healthy mood tracking.',
  suggestions: [],
};

const defaultLifeScore: LifeScore = {
  score: 84,
  trend: 'up',
  explanation: 'Your high habits completion rate and consistent budget compliance keep your life index elevated.',
  history: [
    { date: '2026-05-25', score: 78 },
    { date: '2026-05-26', score: 80 },
    { date: '2026-05-27', score: 81 },
    { date: '2026-05-28', score: 84 },
  ],
};

const defaultGoals: AIGoal[] = [
  {
    id: 'goal-1',
    name: 'Build AI Integrated Habit Core',
    type: 'short-term',
    timeline: '10 days',
    progress: 50,
    milestones: [
      { id: 'ms-1', name: 'Scaffold AI state persistence', completed: true, targetDate: '2026-05-29' },
      { id: 'ms-2', name: 'Connect OpenAI service API layer', completed: true, targetDate: '2026-05-30' },
      { id: 'ms-3', name: 'Integrate dynamic insights feed', completed: false, targetDate: '2026-06-02' },
      { id: 'ms-4', name: 'Verification and build test', completed: false, targetDate: '2026-06-05' },
    ],
  },
];

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      goals: defaultGoals,
      memory: defaultMemory,
      reflections: [],
      dailyBriefing: defaultBriefing,
      weeklyReview: defaultWeeklyReview,
      insights: defaultInsights,
      burnoutStatus: defaultBurnout,
      lifeScore: defaultLifeScore,

      addGoal: (name, type, milestonesData, timeline) =>
        set((state) => {
          const milestones: Milestone[] = milestonesData.map((m, idx) => ({
            ...m,
            id: `ms-${Date.now()}-${idx}`,
            completed: false,
          }));

          return {
            goals: [
              ...state.goals,
              {
                id: `goal-${Date.now()}`,
                name,
                type,
                milestones,
                timeline,
                progress: 0,
              },
            ],
          };
        }),

      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal;

            const updatedMilestones = goal.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );

            const completedCount = updatedMilestones.filter((m) => m.completed).length;
            const progress = Math.round((completedCount / updatedMilestones.length) * 100);

            return {
              ...goal,
              milestones: updatedMilestones,
              progress,
            };
          }),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      addReflection: (reflection) =>
        set((state) => ({
          reflections: [reflection, ...state.reflections],
        })),

      setDailyBriefing: (dailyBriefing) => set({ dailyBriefing }),
      setWeeklyReview: (weeklyReview) => set({ weeklyReview }),
      setInsights: (insights) => set({ insights }),
      setBurnoutStatus: (burnoutStatus) => set({ burnoutStatus }),
      setLifeScore: (lifeScore) => set({ lifeScore }),
      updateMemory: (updates) =>
        set((state) => ({
          memory: { ...state.memory, ...updates },
        })),
    }),
    {
      name: 'life-os-ai-core',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
