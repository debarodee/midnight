// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  name?: string; // Alias for displayName
  photoURL?: string;
  createdAt: Date;
  settings: UserSettings;
  hasCompletedOnboarding?: boolean;
  onboarding?: OnboardingData | null;
}

export interface OnboardingData {
  mindfulnessLevel: number;      // 0-100 from slider
  evolutionPath: string | null;  // 'architect' | 'athlete' | 'sage' | 'creator' | null
  displayName: string;
  completedAt: Date | null;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean | NotificationSettings;
  reminderTime: string; // HH:mm format
  yearStartDate?: Date; // Custom year start (default Jan 1)
  enabledDomains?: string[];
}

export interface NotificationSettings {
  push?: boolean;
  email?: boolean;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  isCompleted: boolean;
  isPinned: boolean;
}

export type GoalCategory = 
  | 'health'
  | 'finance'
  | 'career'
  | 'relationships'
  | 'personal'
  | 'learning'
  | 'home'
  | 'wellness';

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}

// Life Domain types
export type DomainType = 
  | 'health'
  | 'finance'
  | 'home'
  | 'auto'
  | 'relationships'
  | 'career'
  | 'wellness'
  | 'pets';

export interface Domain {
  id: string;
  userId: string;
  type: DomainType;
  items: DomainItem[];
  lastUpdated: Date;
}

export interface DomainItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  date?: Date;
  reminder?: Reminder;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Health domain specific
export interface HealthItem extends DomainItem {
  type: 'appointment' | 'medication' | 'vital' | 'checkup';
  provider?: string;
  location?: string;
  recurring?: RecurringPattern;
}

// Finance domain specific
export interface FinanceItem extends DomainItem {
  type: 'bill' | 'subscription' | 'budget' | 'goal';
  amount?: number;
  dueDate?: Date;
  isPaid?: boolean;
  recurring?: RecurringPattern;
}

// Home/Auto domain specific
export interface HomeItem extends DomainItem {
  type: 'maintenance' | 'task' | 'reminder';
  recurring?: RecurringPattern;
}

export interface AutoItem extends DomainItem {
  type: 'maintenance' | 'registration' | 'insurance' | 'inspection';
  vehicle?: string;
  mileage?: number;
  recurring?: RecurringPattern;
}

// Reminder types
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: Date;
  reminderDate?: Date;
  isCompleted: boolean;
  recurring?: RecurringPattern;
  domainId?: string;
  domainItemId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every X days/weeks/months/years
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 for weekly
  dayOfMonth?: number; // For monthly
}

// Task types
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: GoalCategory;
  goalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Journal types
export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  date: Date;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'low' | 'bad';
  tags?: string[];
  gratitude?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Habit types
export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: RecurringPattern;
  streak: number;
  longestStreak: number;
  completedDates: string[]; // ISO date strings
  category?: GoalCategory;
  createdAt: Date;
  isActive: boolean;
}

// AI Assistant types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'suggestion' | 'reminder' | 'motivation' | 'insight';
  content: string;
  domain?: DomainType;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
  isDismissed: boolean;
}

// Dashboard types
export interface DashboardStats {
  yearProgress: number;
  daysInYear: number;
  daysElapsed: number;
  daysRemaining: number;
  goalsCompleted: number;
  goalsTotal: number;
  habitsStreak: number;
  tasksCompletedToday: number;
  tasksDueToday: number;
  upcomingReminders: Reminder[];
}

// Notification types
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'reminder' | 'insight' | 'achievement' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}
