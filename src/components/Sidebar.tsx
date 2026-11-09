import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Briefcase,
  Headphones,
  BookOpen,
  Feather,
  Mic,
  Languages,
  BookCheck,
  Dumbbell,
  Clock,
  LineChart,
  CalendarDays,
  Trophy,
  Settings,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ExamType } from '../types/ielts';

interface SidebarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  targetExam: ExamType;
  onTrackChange?: (track: ExamType) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: 'core' | 'skills' | 'foundation' | 'assessment';
}

const NAV_ITEMS: NavItem[] = [
  // Core
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'curriculum', label: 'Start Learning', icon: Compass, badge: 'Levels 1–4', category: 'core' },
  { id: 'academic', label: 'IELTS Academic', icon: GraduationCap, category: 'core' },
  { id: 'general', label: 'IELTS General Training', icon: Briefcase, category: 'core' },

  // Four Skills
  { id: 'listening', label: 'Listening Practice', icon: Headphones, badge: 'Audio', category: 'skills' },
  { id: 'reading', label: 'Reading Practice', icon: BookOpen, category: 'skills' },
  { id: 'writing', label: 'Writing Practice', icon: Feather, badge: 'AI Evaluator', category: 'skills' },
  { id: 'speaking', label: 'Speaking Practice', icon: Mic, badge: 'Voice Record', category: 'skills' },

  // Foundations
  { id: 'vocabulary', label: 'Vocabulary Builder', icon: Languages, badge: 'SRS Deck', category: 'foundation' },
  { id: 'grammar', label: 'Grammar Academy', icon: BookCheck, category: 'foundation' },
  { id: 'exercises', label: 'Practice Exercises', icon: Dumbbell, category: 'foundation' },

  // Assessment & Planning
  { id: 'mock-exams', label: 'Mock Examinations', icon: Clock, badge: 'Official Sim', category: 'assessment' },
  { id: 'performance', label: 'My Performance', icon: LineChart, category: 'assessment' },
  { id: 'study-plan', label: 'Study Plan', icon: CalendarDays, category: 'assessment' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, category: 'assessment' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'assessment' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  targetExam,
  onTrackChange,
  isOpen,
  onClose,
}) => {
  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const categories = [
    { key: 'core', label: 'Overview & Curricula' },
    { key: 'skills', label: 'Four IELTS Components' },
    { key: 'foundation', label: 'Language Academy' },
    { key: 'assessment', label: 'Simulations & Analytics' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Primary Sidebar Navigation"
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile Track Switcher (visible on < md where Navbar track switcher is hidden) */}
          {onTrackChange && (
            <div className="md:hidden p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Active Examination Track
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => onTrackChange('academic')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    targetExam === 'academic'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Academic
                </button>
                <button
                  type="button"
                  onClick={() => onTrackChange('general')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    targetExam === 'general'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  General Training
                </button>
              </div>
            </div>
          )}

          {categories.map((cat) => {
            const items = NAV_ITEMS.filter((i) => i.category === cat.key);
            return (
              <div key={cat.key}>
                <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat.label}
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    const isTrackHighlight =
                      (item.id === 'academic' && targetExam === 'academic') ||
                      (item.id === 'general' && targetExam === 'general');

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                          isActive
                            ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 shadow-sm border border-red-200/60 dark:border-red-900/40'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                              isActive
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isTrackHighlight && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active track" />
                          )}
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-red-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                              isActive ? 'opacity-100 text-red-600 dark:text-red-400' : 'text-slate-400'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Accreditation Notice */}
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-bold">Official IELTS Standards</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Curriculum aligned with British Council, IDP, and Cambridge assessment band rubrics.
          </p>
        </div>
      </aside>
    </>
  );
};
