import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Clock, 
  Flame,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import YearProgressRing from '../components/dashboard/YearProgressRing';
import InsightCard from '../components/dashboard/InsightCard';
import QuickStats from '../components/dashboard/QuickStats';
import { EXAMPLE_GOALS, EXAMPLE_REMINDERS, EXAMPLE_TASKS } from '../constants/exampleContent';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { goals, tasks, reminders, habits, getDashboardStats } = useDataStore();
  const stats = getDashboardStats();

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const upcomingReminders = reminders
    .filter((r) => !r.isCompleted && new Date(r.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const activeGoals = goals
    .filter((g) => !g.isCompleted)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const todaysTasks = tasks
    .filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      const today = new Date();
      return due.toDateString() === today.toDateString();
    });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-obsidian dark:text-white mb-2">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-obsidian-400 dark:text-obsidian-300">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Year Progress - Large card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="card bg-gradient-to-br from-obsidian to-obsidian-600 dark:from-obsidian-700 dark:to-obsidian-800 text-white p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <YearProgressRing 
                progress={stats.yearProgress} 
                size={180}
                strokeWidth={12}
              />
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                  {stats.yearProgress}% of 2025
                </h2>
                <p className="text-white/60 mb-6">
                  {stats.daysElapsed} days in • {stats.daysRemaining} days to go
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-cyan mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Goals</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {stats.goalsCompleted}/{stats.goalsTotal}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-cyan mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">Streak</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {stats.habitsStreak} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InsightCard stats={stats} />
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <QuickStats stats={stats} />
        </motion.div>

        {/* Active Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-obsidian dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-lavender" />
                Active Goals
              </h3>
              <Link
                to="/app/goals"
                className="text-sm text-obsidian-400 dark:text-obsidian-300 hover:text-obsidian dark:hover:text-white flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {activeGoals.length === 0 ? (
              goals.length === 0 ? (
                // Show example goals for brand new users
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-lavender/10 dark:bg-lavender/20 rounded-lg text-lavender text-xs font-medium w-fit">
                    <Sparkles className="w-3 h-3" />
                    <span>Example goals</span>
                  </div>
                  <div className="space-y-4 opacity-60">
                    {EXAMPLE_GOALS.slice(0, 3).map((goal) => (
                      <div
                        key={goal.id}
                        className="block p-4 rounded-2xl bg-obsidian-50 dark:bg-obsidian-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-obsidian dark:text-white">{goal.title}</h4>
                          <span className="text-sm font-medium text-lavender">{goal.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-obsidian-200 dark:bg-obsidian-500 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan to-lavender rounded-full transition-all"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/app/goals" className="btn-secondary text-sm w-full justify-center">
                    Set Your First Goal
                  </Link>
                </div>
              ) : (
                // User has goals but none are active (all completed)
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-obsidian-200 dark:text-obsidian-500 mx-auto mb-3" />
                  <p className="text-obsidian-400 dark:text-obsidian-300 mb-4">All goals completed!</p>
                  <Link to="/app/goals" className="btn-secondary text-sm">
                    Set a New Goal
                  </Link>
                </div>
              )
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <Link
                    key={goal.id}
                    to="/app/goals"
                    className="block p-4 rounded-2xl bg-obsidian-50 dark:bg-obsidian-600 hover:bg-obsidian-100 dark:hover:bg-obsidian-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-obsidian dark:text-white">{goal.title}</h4>
                      <span className="text-sm font-medium text-lavender">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-obsidian-200 dark:bg-obsidian-500 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan to-lavender rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-obsidian dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan" />
                Upcoming
              </h3>
            </div>

            {upcomingReminders.length === 0 ? (
              reminders.length === 0 ? (
                // Show example reminders for brand new users
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan/20 dark:bg-cyan/10 rounded-lg text-cyan-700 dark:text-cyan text-xs font-medium w-fit">
                    <Sparkles className="w-3 h-3" />
                    <span>Examples</span>
                  </div>
                  <div className="space-y-3 opacity-60">
                    {EXAMPLE_REMINDERS.map((reminder) => {
                      const daysUntil = differenceInDays(new Date(reminder.dueDate), new Date());
                      return (
                        <div
                          key={reminder.id}
                          className="p-3 rounded-xl bg-obsidian-50 dark:bg-obsidian-600 flex items-start gap-3"
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            daysUntil <= 1 ? 'bg-red-400' : 
                            daysUntil <= 7 ? 'bg-cyan' : 'bg-sage'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-obsidian dark:text-white text-sm truncate">
                              {reminder.title}
                            </p>
                            <p className="text-xs text-obsidian-400 dark:text-obsidian-300">
                              {daysUntil === 0 ? 'Today' : 
                               daysUntil === 1 ? 'Tomorrow' : 
                               `In ${daysUntil} days`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // User has reminders but none upcoming
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-obsidian-200 dark:text-obsidian-500 mx-auto mb-2" />
                  <p className="text-obsidian-400 dark:text-obsidian-300 text-sm">No upcoming reminders</p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => {
                  const daysUntil = differenceInDays(new Date(reminder.dueDate), new Date());
                  return (
                    <div
                      key={reminder.id}
                      className="p-3 rounded-xl bg-obsidian-50 dark:bg-obsidian-600 flex items-start gap-3"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        daysUntil <= 1 ? 'bg-red-400' : 
                        daysUntil <= 7 ? 'bg-cyan' : 'bg-sage'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-obsidian dark:text-white text-sm truncate">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-obsidian-400 dark:text-obsidian-300">
                          {daysUntil === 0 ? 'Today' : 
                           daysUntil === 1 ? 'Tomorrow' : 
                           `In ${daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-obsidian dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage" />
                Today's Tasks
              </h3>
              <span className="text-sm text-obsidian-400 dark:text-obsidian-300">
                {todaysTasks.filter(t => t.isCompleted).length}/{todaysTasks.length} done
              </span>
            </div>

            {todaysTasks.length === 0 ? (
              tasks.length === 0 ? (
                // Show example tasks for brand new users
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/20 dark:bg-sage/10 rounded-lg text-sage-700 dark:text-sage text-xs font-medium w-fit">
                    <Sparkles className="w-3 h-3" />
                    <span>Example tasks</span>
                  </div>
                  <div className="space-y-2 opacity-60">
                    {EXAMPLE_TASKS.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl flex items-center gap-3
                          ${task.isCompleted ? 'bg-sage-50 dark:bg-sage/10' : 'bg-obsidian-50 dark:bg-obsidian-600'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${task.isCompleted 
                            ? 'bg-sage border-sage text-white' 
                            : 'border-obsidian-200 dark:border-obsidian-400'
                          }`}
                        >
                          {task.isCompleted && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={`flex-1 text-sm ${task.isCompleted ? 'text-obsidian-400 dark:text-obsidian-300 line-through' : 'text-obsidian dark:text-white'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // User has tasks but none for today
                <div className="text-center py-6">
                  <CheckCircle2 className="w-10 h-10 text-obsidian-200 dark:text-obsidian-500 mx-auto mb-2" />
                  <p className="text-obsidian-400 dark:text-obsidian-300 text-sm">No tasks scheduled for today</p>
                </div>
              )
            ) : (
              <div className="space-y-2">
                {todaysTasks.slice(0, 5).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Life Domains Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="card h-full">
            <h3 className="font-semibold text-obsidian dark:text-white mb-4">Life Domains</h3>
            <div className="grid grid-cols-2 gap-2">
              {['health', 'finance', 'home', 'auto', 'wellness'].map((key) => {
                const icons: Record<string, any> = {
                  health: '❤️',
                  finance: '💰',
                  home: '🏠',
                  auto: '🚗',
                  wellness: '🧠',
                };
                return (
                  <Link
                    key={key}
                    to={`/app/domains/${key}`}
                    className="p-3 rounded-xl bg-obsidian-50 dark:bg-obsidian-600 hover:bg-obsidian-100 dark:hover:bg-obsidian-500 transition-colors flex items-center gap-2"
                  >
                    <span className="text-lg">{icons[key]}</span>
                    <span className="text-sm font-medium text-obsidian dark:text-white capitalize">{key}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task }: { task: any }) => {
  const { toggleTask } = useDataStore();

  return (
    <div
      className={`p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer
        ${task.isCompleted ? 'bg-sage-50 dark:bg-sage/10' : 'bg-obsidian-50 dark:bg-obsidian-600 hover:bg-obsidian-100 dark:hover:bg-obsidian-500'}`}
      onClick={() => toggleTask(task.id)}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
        ${task.isCompleted 
          ? 'bg-sage border-sage text-white' 
          : 'border-obsidian-200 dark:border-obsidian-400 hover:border-sage'
        }`}
      >
        {task.isCompleted && <CheckCircle2 className="w-3 h-3" />}
      </div>
      <span className={`flex-1 text-sm ${task.isCompleted ? 'text-obsidian-400 dark:text-obsidian-300 line-through' : 'text-obsidian dark:text-white'}`}>
        {task.title}
      </span>
    </div>
  );
};

export default Dashboard;
