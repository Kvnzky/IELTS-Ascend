import React from 'react';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Compass,
  Feather,
  Mic,
  Headphones,
  BookOpen,
} from 'lucide-react';
import { AchievementBadge } from '../types/ielts';

interface AchievementsViewProps {
  badges: AchievementBadge[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ badges }) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const iconMap: { [key: string]: any } = {
    Compass,
    Flame,
    Feather,
    Mic,
    Headphones,
    BookOpen,
    Award,
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Milestone Honors</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Academy Achievements & Badges
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Celebrate meaningful milestones across study streaks, diagnostic baselines, essay submissions, and test completions.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-500" />
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
              {unlockedCount} of {badges.length} Unlocked
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">Keep learning to unlock all!</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b) => {
          const Icon = iconMap[b.icon] || Award;

          return (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                b.unlocked
                  ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    b.unlocked
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {b.unlocked ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-extrabold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Progress</span>
                  <span>{b.unlocked ? '100%' : `${b.progress}%`}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.unlocked ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${b.unlocked ? 100 : b.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
