// Example content for empty states - UI only, never persisted to database
// These examples disappear immediately when the user creates their first real entry

import type { Goal, JournalEntry, Reminder, Task, DomainItem, ChatMessage } from '../types';

// ============================================
// GOALS EXAMPLES
// ============================================
export const EXAMPLE_GOALS: Goal[] = [
  {
    id: 'example-goal-1',
    userId: '',
    title: 'Run a 5K by March',
    description: 'Training 3x per week, currently on week 6 of Couch to 5K',
    category: 'health',
    progress: 65,
    milestones: [],
    isCompleted: false,
    isPinned: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-goal-2',
    userId: '',
    title: 'Save $5,000 for vacation',
    description: 'Putting away $400/month toward Greece trip',
    category: 'finance',
    progress: 40,
    milestones: [],
    isCompleted: false,
    isPinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-goal-3',
    userId: '',
    title: 'Read 12 books this year',
    description: 'Currently reading: Atomic Habits',
    category: 'learning',
    progress: 25,
    milestones: [],
    isCompleted: false,
    isPinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================
// JOURNAL EXAMPLES
// ============================================
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const thisWeek = new Date(today);
thisWeek.setDate(thisWeek.getDate() - 3);

export const EXAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'example-journal-1',
    userId: '',
    title: 'Productive Monday',
    date: today,
    content: 'Had an amazing morning routine today. Woke up early, did yoga, and finished my biggest work project. Feeling accomplished and grateful for the momentum. Sometimes small wins lead to bigger ones.',
    mood: 'great',
    tags: ['productivity', 'wins'],
    createdAt: today,
    updatedAt: today,
  },
  {
    id: 'example-journal-2',
    userId: '',
    title: 'Weekend Reflections',
    date: yesterday,
    content: 'Spent quality time with family. Sometimes slowing down is exactly what I need. Made homemade pasta and watched old movies. Grateful for these simple moments.',
    mood: 'good',
    tags: ['family', 'self-care'],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: 'example-journal-3',
    userId: '',
    title: 'Setting Intentions',
    date: thisWeek,
    content: 'Feeling a bit overwhelmed with everything on my plate. Writing this out to organize my thoughts and prioritize what matters most. Need to focus on one thing at a time.',
    mood: 'okay',
    tags: ['reflection'],
    createdAt: thisWeek,
    updatedAt: thisWeek,
  },
];

// ============================================
// REMINDERS EXAMPLES
// ============================================
const in5Days = new Date(today);
in5Days.setDate(in5Days.getDate() + 5);
const in12Days = new Date(today);
in12Days.setDate(in12Days.getDate() + 12);
const in18Days = new Date(today);
in18Days.setDate(in18Days.getDate() + 18);

export const EXAMPLE_REMINDERS: Reminder[] = [
  {
    id: 'example-reminder-1',
    userId: '',
    title: 'Car registration renewal',
    dueDate: in5Days,
    isCompleted: false,
    priority: 'high',
    createdAt: new Date(),
  },
  {
    id: 'example-reminder-2',
    userId: '',
    title: "Mom's birthday",
    dueDate: in12Days,
    isCompleted: false,
    priority: 'medium',
    createdAt: new Date(),
  },
  {
    id: 'example-reminder-3',
    userId: '',
    title: 'Annual checkup',
    dueDate: in18Days,
    isCompleted: false,
    priority: 'low',
    createdAt: new Date(),
  },
];

// ============================================
// TASKS EXAMPLES
// ============================================
export const EXAMPLE_TASKS: Task[] = [
  {
    id: 'example-task-1',
    userId: '',
    title: 'Review monthly budget',
    isCompleted: false,
    dueDate: today,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-task-2',
    userId: '',
    title: '15-min morning walk',
    isCompleted: true,
    completedAt: today,
    dueDate: today,
    priority: 'low',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-task-3',
    userId: '',
    title: 'Call insurance company',
    isCompleted: false,
    dueDate: today,
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================
// DOMAIN ITEMS EXAMPLES (for all 8 domains)
// ============================================
export const EXAMPLE_DOMAIN_ITEMS: Record<string, DomainItem[]> = {
  health: [
    {
      id: 'example-health-1',
      type: 'checkup',
      title: 'Annual physical',
      date: new Date(today.getFullYear(), today.getMonth() + 1, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-health-2',
      type: 'medication',
      title: 'Take vitamin D daily',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-health-3',
      type: 'appointment',
      title: 'Dentist cleaning',
      date: new Date(today.getFullYear(), today.getMonth() + 2, 2),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  finance: [
    {
      id: 'example-finance-1',
      type: 'bill',
      title: 'Rent payment',
      description: 'Due 1st of each month',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-finance-2',
      type: 'subscription',
      title: 'Netflix',
      description: '$15.99/month',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-finance-3',
      type: 'savings',
      title: 'Emergency fund goal',
      description: '$2,000 target',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  home: [
    {
      id: 'example-home-1',
      type: 'maintenance',
      title: 'Change HVAC filters',
      description: 'Every 3 months',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-home-2',
      type: 'cleaning',
      title: 'Deep clean kitchen',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-home-3',
      type: 'repair',
      title: 'Fix leaky faucet',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  auto: [
    {
      id: 'example-auto-1',
      type: 'maintenance',
      title: 'Oil change',
      description: 'Every 5,000 miles',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-auto-2',
      type: 'registration',
      title: 'Registration renewal',
      date: new Date(today.getFullYear(), 7, 15), // August
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-auto-3',
      type: 'insurance',
      title: 'Car insurance renewal',
      date: new Date(today.getFullYear(), 11, 1), // December
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  relationships: [
    {
      id: 'example-relationships-1',
      type: 'birthday',
      title: "Mom's birthday",
      date: new Date(today.getFullYear(), 5, 15), // June 15
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-relationships-2',
      type: 'check-in',
      title: 'Weekly call with parents',
      description: 'Every Sunday',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-relationships-3',
      type: 'event',
      title: "Best friend's wedding RSVP",
      date: new Date(today.getFullYear(), 8, 20), // September 20
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  career: [
    {
      id: 'example-career-1',
      type: 'review',
      title: 'Q2 performance review',
      date: new Date(today.getFullYear(), 3, 30), // April 30
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-career-2',
      type: 'learning',
      title: 'Complete AWS certification',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-career-3',
      type: 'goal',
      title: 'Update LinkedIn profile',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  wellness: [
    {
      id: 'example-wellness-1',
      type: 'therapy',
      title: 'Therapy session',
      description: 'Bi-weekly on Thursdays',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-wellness-2',
      type: 'self-care',
      title: '10-min morning meditation',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-wellness-3',
      type: 'exercise',
      title: 'Yoga class Tuesdays',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  pets: [
    {
      id: 'example-pets-1',
      type: 'vet',
      title: 'Annual vet checkup - Max',
      date: new Date(today.getFullYear(), 4, 10), // May 10
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-pets-2',
      type: 'medication',
      title: 'Flea treatment due',
      description: 'Monthly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-pets-3',
      type: 'grooming',
      title: 'Grooming appointment',
      description: 'Every 8 weeks',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// ============================================
// ASSISTANT CHAT EXAMPLES
// ============================================
export const EXAMPLE_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'example-chat-1',
    role: 'user',
    content: 'What should I focus on today?',
    timestamp: new Date(),
  },
  {
    id: 'example-chat-2',
    role: 'assistant',
    content: "Based on your goals, I'd suggest focusing on your 5K training today — you're 65% through your program, great momentum! 🏃‍♂️\n\nAlso, don't forget your car registration is due in 5 days. Would you like me to help you break down today's priorities?",
    timestamp: new Date(),
  },
];
