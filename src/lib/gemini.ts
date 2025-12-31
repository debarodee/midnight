// Gemini AI Configuration and Utilities
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { Goal, Task, Reminder, Habit, DashboardStats } from '../types';

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration
const modelConfig = {
  model: 'gemini-2.0-flash-exp',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
};

// System prompt for Midnight assistant
const SYSTEM_PROMPT = `You are Midnight, a friendly and supportive AI assistant built into a life management app called "Midnight - Your Year Starts Now."

Your role is to help users:
1. Manage their goals, tasks, and habits effectively
2. Stay on top of life responsibilities (health, finances, home maintenance, etc.)
3. Provide encouragement and motivation
4. Offer practical adulting advice and tips
5. Help with time management and prioritization

Personality:
- Warm and encouraging, but not overly enthusiastic
- Practical and actionable in your advice
- Concise - users are busy, respect their time
- Occasionally witty, but professional

Important context:
- The app tracks goals, habits, tasks, reminders across life domains (health, finance, home, auto, relationships, career, wellness)
- Users are trying to manage their year effectively
- Focus on actionable, specific advice

When responding:
- Keep responses under 150 words unless more detail is requested
- Use bullet points for lists
- Be specific and practical
- If creating tasks or reminders, format them clearly
- End with a gentle question or suggestion when appropriate`;

// Generate chat response
export const generateChatResponse = async (
  userMessage: string,
  context?: {
    stats?: DashboardStats;
    recentGoals?: Goal[];
    recentTasks?: Task[];
    upcomingReminders?: Reminder[];
    habits?: Habit[];
  }
): Promise<string> => {
  if (!apiKey) {
    return "I'm not connected to my AI brain yet! Add a Gemini API key to enable smart assistance.";
  }

  try {
    const model = genAI.getGenerativeModel(modelConfig);
    
    // Build context string
    let contextString = '';
    if (context) {
      if (context.stats) {
        contextString += `\n\nUser's year progress: ${context.stats.yearProgress}% complete (${context.stats.daysElapsed} days in, ${context.stats.daysRemaining} remaining).`;
        contextString += `\nGoals: ${context.stats.goalsCompleted}/${context.stats.goalsTotal} completed.`;
        contextString += `\nTasks today: ${context.stats.tasksCompletedToday} done, ${context.stats.tasksDueToday} due.`;
        contextString += `\nCurrent habit streak total: ${context.stats.habitsStreak} days.`;
      }
      
      if (context.recentGoals?.length) {
        contextString += `\n\nUser's active goals: ${context.recentGoals.map(g => `${g.title} (${g.progress}%)`).join(', ')}`;
      }
      
      if (context.upcomingReminders?.length) {
        contextString += `\n\nUpcoming reminders: ${context.upcomingReminders.map(r => r.title).join(', ')}`;
      }
    }

    const fullPrompt = `${SYSTEM_PROMPT}${contextString}\n\nUser: ${userMessage}\n\nAssistant:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return "I had trouble processing that. Could you try rephrasing your question?";
  }
};

// Generate daily briefing
export const generateDailyBriefing = async (
  stats: DashboardStats,
  goals: Goal[],
  tasks: Task[],
  reminders: Reminder[],
): Promise<string> => {
  if (!apiKey) {
    return "Good morning! Connect Gemini AI to receive personalized daily briefings.";
  }

  try {
    const model = genAI.getGenerativeModel(modelConfig);
    
    const prompt = `${SYSTEM_PROMPT}

Generate a brief, encouraging morning briefing for a user with:
- Year progress: ${stats.yearProgress}% (${stats.daysRemaining} days left)
- ${stats.tasksDueToday} tasks due today
- ${stats.goalsCompleted}/${stats.goalsTotal} goals completed this year
- ${reminders.length} upcoming reminders

Active goals: ${goals.filter(g => !g.isCompleted).slice(0, 3).map(g => g.title).join(', ') || 'None set'}

Keep it under 100 words. Be warm but not cheesy. End with one actionable suggestion for the day.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Briefing generation error:', error);
    return `Good morning! You're ${stats.yearProgress}% through the year with ${stats.daysRemaining} days to make it count. You have ${stats.tasksDueToday} tasks due today. Let's make it productive!`;
  }
};

// Generate smart suggestions
export const generateSuggestions = async (
  goals: Goal[],
  tasks: Task[],
  habits: Habit[],
  reminders: Reminder[],
): Promise<string[]> => {
  if (!apiKey) {
    return ['Set up Gemini AI for personalized suggestions'];
  }

  try {
    const model = genAI.getGenerativeModel(modelConfig);
    
    const goalsProgress = goals.filter(g => !g.isCompleted).map(g => ({
      title: g.title,
      progress: g.progress,
    }));
    
    const incompleteTasks = tasks.filter(t => !t.isCompleted).length;
    const overdueReminders = reminders.filter(
      r => !r.isCompleted && new Date(r.dueDate) < new Date()
    ).length;
    
    const habitStreaks = habits.map(h => ({ title: h.title, streak: h.streak }));

    const prompt = `${SYSTEM_PROMPT}

Based on this user data, generate exactly 3 brief, actionable suggestions:
- Goals in progress: ${JSON.stringify(goalsProgress)}
- Incomplete tasks: ${incompleteTasks}
- Overdue reminders: ${overdueReminders}
- Habit streaks: ${JSON.stringify(habitStreaks)}

Format as a JSON array of strings. Each suggestion should be 10-15 words max.
Example: ["Review your budget goal - you're at 60%", "You have 3 overdue reminders to address", "Great 5-day streak on meditation!"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return ['Keep up the great work on your goals!'];
  } catch (error) {
    console.error('Suggestions error:', error);
    return ['Check your goals progress', 'Review upcoming reminders', 'Keep your habits going!'];
  }
};

// Parse natural language input into task/reminder
export const parseNaturalLanguageTask = async (
  input: string
): Promise<{
  type: 'task' | 'reminder';
  title: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
} | null> => {
  if (!apiKey) {
    return { type: 'task', title: input };
  }

  try {
    const model = genAI.getGenerativeModel(modelConfig);
    
    const prompt = `Parse this natural language input into a task or reminder:
"${input}"

Respond with ONLY a JSON object in this format:
{
  "type": "task" or "reminder",
  "title": "cleaned up title",
  "dueDate": "YYYY-MM-DD" or null,
  "priority": "low", "medium", or "high"
}

Examples:
"remind me to call mom tomorrow" → {"type": "reminder", "title": "Call mom", "dueDate": "${new Date(Date.now() + 86400000).toISOString().split('T')[0]}", "priority": "medium"}
"buy groceries" → {"type": "task", "title": "Buy groceries", "dueDate": null, "priority": "low"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { type: 'task', title: input };
  } catch (error) {
    console.error('Parse error:', error);
    return { type: 'task', title: input };
  }
};

// Adulting advice
export const getAdultingAdvice = async (question: string): Promise<string> => {
  if (!apiKey) {
    return "Connect Gemini AI to get personalized adulting advice!";
  }

  try {
    const model = genAI.getGenerativeModel(modelConfig);
    
    const prompt = `${SYSTEM_PROMPT}

The user is asking for adulting advice:
"${question}"

Provide a helpful, practical answer. If it involves:
- Medical/legal/financial matters: remind them to consult professionals
- General life skills: give specific, actionable steps
- Home/car maintenance: include typical timelines

Keep it under 150 words and conversational.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Advice error:', error);
    return "I couldn't process that question. Try asking in a different way!";
  }
};

export default {
  generateChatResponse,
  generateDailyBriefing,
  generateSuggestions,
  parseNaturalLanguageTask,
  getAdultingAdvice,
};
