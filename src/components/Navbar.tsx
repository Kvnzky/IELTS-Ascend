import React from 'react';
import {
  GraduationCap,
  Flame,
  Sun,
  Moon,
  Menu,
  X,
  Target,
  Award,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { UserProfile, ExamType } from '../types/ielts';

interface NavbarProps {
  profile: UserProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onOpenDiagnostic: () => void;
  onOpenAuth?: () => void;
  onTrackChange: (track: ExamType) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  darkMode,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
  onOpenDiagnostic,
  onOpenAuth,
  onTrackChange,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-left group min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  IELTS<span className="text-red-600 dark:text-red-500">Master</span>
                </span>
                <span className="hidden xl:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Academy & Simulator
                </span>
              </div>
            </button>
          </div>

          {/* Center Track Switcher (Academic vs General) */}
          <div
            className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
            role="group"
            aria-label="Select IELTS Examination Track"
          >
            <button
              type="button"
              onClick={() => onTrackChange('academic')}
              aria-pressed={profile.targetExam === 'academic'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                profile.targetExam === 'academic'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              IELTS Academic
            </button>
            <button
              type="button"
              onClick={() => onTrackChange('general')}
              aria-pressed={profile.targetExam === 'general'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                profile.targetExam === 'general'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              General Training
            </button>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Streak Counter */}
            <button
              type="button"
              onClick={() => onNavigate('achievements')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:scale-105 transition-transform"
              title="Daily Study Streak"
              aria-label={`Daily Study Streak: ${profile.streakDays || 1} days`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-pulse shrink-0" />
              <span>{profile.streakDays || 1}d</span>
              <span className="hidden sm:inline">Streak</span>
            </button>

            {/* Target Band Pill */}
            <button
              type="button"
              onClick={() => onNavigate('performance')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold hover:scale-105 transition-transform"
              title="Target Band Score"
            >
              <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Target: Band {profile.targetOverallBand.toFixed(1)}</span>
            </button>

            {/* Diagnostic Button */}
            {!profile.diagnosticCompleted ? (
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all hover:scale-105"
                title="Take Initial Diagnostic Assessment"
              >
                <Award className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Take Diagnostic</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                title="View Diagnostic Report"
              >
                <span>Report Ready</span>
              </button>
            )}

            {/* Account / Auth Button */}
            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors"
                title="Manage Account / Sign In"
                aria-label="Manage Account or Sign In"
              >
                <UserCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span className="hidden sm:inline max-w-[100px] truncate">{profile.name || 'Account'}</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
