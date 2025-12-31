import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Goal, 
  Task, 
  Reminder, 
  JournalEntry, 
  Habit, 
  DashboardStats,
  ChatMessage,
  AIInsight,
  Domain,
  DomainItem,
} from '../types';

interface DataState {
  // Data
  goals: Goal[];
  tasks: Task[];
  reminders: Reminder[];
  journal: JournalEntry[];
  journalEntries: JournalEntry[]; // Alias for journal
  habits: Habit[];
  domains: Domain[];
  chatHistory: ChatMessage[];
  insights: AIInsight[];
  
  // UI State
  isLoading: boolean;
  activeView: string;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Reminder actions
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  
  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'longestStreak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabitToday: (id: string) => void;
  
  // Domain actions
  addDomainItem: (domainType: string, item: Omit<DomainItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDomainItem: (domainType: string, itemId: string, updates: Partial<DomainItem>) => void;
  deleteDomainItem: (domainType: string, itemId: string) => void;
  
  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  
  // Insight actions
  addInsight: (insight: Omit<AIInsight, 'id' | 'createdAt'>) => void;
  dismissInsight: (id: string) => void;
  markInsightRead: (id: string) => void;
  
  // Utility actions
  setActiveView: (view: string) => void;
  getDashboardStats: () => DashboardStats;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getYearProgress = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const daysInYear = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return {
    daysInYear,
    daysElapsed,
    daysRemaining: daysInYear - daysElapsed,
    yearProgress: Math.round((daysElapsed / daysInYear) * 100),
  };
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      goals: [],
      tasks: [],
      reminders: [],
      journal: [],
      journalEntries: [], // Will be synced with journal
      habits: [],
      domains: [],
      chatHistory: [],
      insights: [],
      isLoading: false,
      activeView: 'dashboard',

      // Goal actions
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, {
          ...goal,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
        ),
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      })),

      // Task actions
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                isCompleted: !t.isCompleted,
                completedAt: !t.isCompleted ? new Date() : undefined,
                updatedAt: new Date(),
              }
            : t
        ),
      })),

      // Reminder actions
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, {
          ...reminder,
          id: generateId(),
          createdAt: new Date(),
        }],
      })),

      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      })),

      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
      })),

      completeReminder: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, isCompleted: true } : r
        ),
      })),

      // Journal actions
      addJournalEntry: (entry) => set((state) => {
        const newEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return {
          journal: [...state.journal, newEntry],
          journalEntries: [...state.journal, newEntry],
        };
      }),

      updateJournalEntry: (id, updates) => set((state) => {
        const updated = state.journal.map((j) =>
          j.id === id ? { ...j, ...updates, updatedAt: new Date() } : j
        );
        return {
          journal: updated,
          journalEntries: updated,
        };
      }),

      deleteJournalEntry: (id) => set((state) => {
        const filtered = state.journal.filter((j) => j.id !== id);
        return {
          journal: filtered,
          journalEntries: filtered,
        };
      }),

      // Habit actions
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, {
          ...habit,
          id: generateId(),
          createdAt: new Date(),
          streak: 0,
          longestStreak: 0,
          completedDates: [],
        }],
      })),

      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        ),
      })),

      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
      })),

      completeHabitToday: (id) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        return {
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            
            const alreadyCompleted = h.completedDates.includes(today);
            if (alreadyCompleted) return h;
            
            const newCompletedDates = [...h.completedDates, today].sort();
            const newStreak = h.streak + 1;
            
            return {
              ...h,
              completedDates: newCompletedDates,
              streak: newStreak,
              longestStreak: Math.max(h.longestStreak, newStreak),
            };
          }),
        };
      }),

      // Domain actions
      addDomainItem: (domainType, item) => set((state) => {
        const domainIndex = state.domains.findIndex((d) => d.type === domainType);
        const newItem = {
          ...item,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (domainIndex === -1) {
          // Create new domain
          return {
            domains: [...state.domains, {
              id: generateId(),
              userId: '',
              type: domainType as Domain['type'],
              items: [newItem],
              lastUpdated: new Date(),
            }],
          };
        }

        // Update existing domain
        const newDomains = [...state.domains];
        newDomains[domainIndex] = {
          ...newDomains[domainIndex],
          items: [...newDomains[domainIndex].items, newItem],
          lastUpdated: new Date(),
        };
        return { domains: newDomains };
      }),

      updateDomainItem: (domainType, itemId, updates) => set((state) => ({
        domains: state.domains.map((d) =>
          d.type === domainType
            ? {
                ...d,
                items: d.items.map((item) =>
                  item.id === itemId
                    ? { ...item, ...updates, updatedAt: new Date() }
                    : item
                ),
                lastUpdated: new Date(),
              }
            : d
        ),
      })),

      deleteDomainItem: (domainType, itemId) => set((state) => ({
        domains: state.domains.map((d) =>
          d.type === domainType
            ? {
                ...d,
                items: d.items.filter((item) => item.id !== itemId),
                lastUpdated: new Date(),
              }
            : d
        ),
      })),

      // Chat actions
      addChatMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }],
      })),

      clearChatHistory: () => set({ chatHistory: [] }),

      // Insight actions
      addInsight: (insight) => set((state) => ({
        insights: [...state.insights, {
          ...insight,
          id: generateId(),
          createdAt: new Date(),
        }],
      })),

      dismissInsight: (id) => set((state) => ({
        insights: state.insights.map((i) =>
          i.id === id ? { ...i, isDismissed: true } : i
        ),
      })),

      markInsightRead: (id) => set((state) => ({
        insights: state.insights.map((i) =>
          i.id === id ? { ...i, isRead: true } : i
        ),
      })),

      // Utility actions
      setActiveView: (activeView) => set({ activeView }),

      getDashboardStats: () => {
        const state = get();
        const yearStats = getYearProgress();
        const today = new Date().toISOString().split('T')[0];

        const tasksCompletedToday = state.tasks.filter(
          (t) => t.isCompleted && t.completedAt?.toISOString().split('T')[0] === today
        ).length;

        const tasksDueToday = state.tasks.filter(
          (t) => !t.isCompleted && t.dueDate?.toISOString().split('T')[0] === today
        ).length;

        const upcomingReminders = state.reminders
          .filter((r) => !r.isCompleted && new Date(r.dueDate) >= new Date())
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5);

        const totalStreak = state.habits.reduce((sum, h) => sum + h.streak, 0);

        return {
          ...yearStats,
          goalsCompleted: state.goals.filter((g) => g.isCompleted).length,
          goalsTotal: state.goals.length,
          habitsStreak: totalStreak,
          tasksCompletedToday,
          tasksDueToday,
          upcomingReminders,
        };
      },
    }),
    {
      name: 'midnight-data',
      partialize: (state) => ({
        goals: state.goals,
        tasks: state.tasks,
        reminders: state.reminders,
        journal: state.journal,
        habits: state.habits,
        domains: state.domains,
        chatHistory: state.chatHistory.slice(-50), // Keep last 50 messages
        insights: state.insights.filter((i) => !i.isDismissed),
      }),
    }
  )
);
