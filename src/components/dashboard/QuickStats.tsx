import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Flame } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface QuickStatsProps {
  stats: DashboardStats;
}

const QuickStats = ({ stats }: QuickStatsProps) => {
  const statItems = [
    {
      label: 'Goals Progress',
      value: stats.goalsTotal > 0 
        ? `${Math.round((stats.goalsCompleted / stats.goalsTotal) * 100)}%` 
        : '0%',
      subtext: `${stats.goalsCompleted} of ${stats.goalsTotal}`,
      icon: Target,
      color: 'text-lavender',
      bg: 'bg-lavender-50 dark:bg-lavender/20',
    },
    {
      label: 'Today\'s Tasks',
      value: stats.tasksCompletedToday.toString(),
      subtext: `${stats.tasksDueToday} remaining`,
      icon: CheckCircle2,
      color: 'text-sage',
      bg: 'bg-sage-50 dark:bg-sage/20',
    },
    {
      label: 'Habit Streak',
      value: `${stats.habitsStreak}`,
      subtext: 'days total',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/20',
    },
    {
      label: 'Days Left',
      value: stats.daysRemaining.toString(),
      subtext: 'in 2025',
      icon: Clock,
      color: 'text-cyan-600 dark:text-cyan',
      bg: 'bg-cyan-50 dark:bg-cyan/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-5"
        >
          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <p className="text-2xl font-bold text-obsidian dark:text-white mb-1">{item.value}</p>
          <p className="text-sm text-obsidian-400 dark:text-obsidian-300">{item.label}</p>
          <p className="text-xs text-obsidian-300 dark:text-obsidian-400 mt-1">{item.subtext}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
