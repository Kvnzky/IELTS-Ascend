import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Feather,
  Headphones,
  Mic,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

import { ExamType } from '../types/ielts';

interface AcademicHubProps {
  onNavigate: (sectionId: string) => void;
  onTrackChange?: (track: ExamType) => void;
}

export const AcademicHub: React.FC<AcademicHubProps> = ({ onNavigate, onTrackChange }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Higher Education & Professional Licensure</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">IELTS Academic Master Hub</h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            The global gold standard for admissions to undergraduate and postgraduate degrees at top international universities (Oxford, Cambridge, Harvard, Toronto, Melbourne) and medical/professional registrations.
          </p>
        </div>
      </div>

      {/* Academic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Writing Task 1 Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Task 1: Visual Data Synthesis
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">20 Mins • Min 150 Words</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You must objectively describe, summarize, or explain visual information without offering personal opinions or external speculation.
          </p>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">7 Visual Typologies:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Line Graphs</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Bar Charts</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Pie Charts</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Tables</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Maps / Plans</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Process Diagrams</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 sm:col-span-3">• Combined / Multiple Charts (e.g. Bar Chart + Data Table)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTrackChange?.('academic');
              onNavigate('writing');
            }}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Practice Academic Task 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Academic Reading Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Academic Reading Module
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">60 Mins • 3 Passages • 40 Questions</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Authentic texts sourced from academic journals, scientific monographs, books, and analytical magazines. Texts range from descriptive and factual to discursive and analytical.
            </p>

            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
              <span className="font-bold text-blue-800 dark:text-blue-300 block">Band 7.0 Requirement:</span>
              <p className="text-blue-900 dark:text-blue-200 text-[11px]">
                Requires achieving 30 out of 40 raw marks. Tougher texts than General Training, but slightly more lenient raw score conversion.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTrackChange?.('academic');
              onNavigate('reading');
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Launch Academic Reading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shared Components Callout */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-black text-base text-slate-900 dark:text-white">
          Identical Components in Academic & General Training
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Listening and Speaking modules are completely identical across both IELTS test formats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('listening')}
            className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="font-bold text-xs block text-slate-900 dark:text-white">
                  IELTS Listening Academy
                </span>
                <span className="text-[11px] text-slate-500">4 sections • 40 questions • Audio tracks</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('speaking')}
            className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold text-xs block text-slate-900 dark:text-white">
                  IELTS Speaking Academy
                </span>
                <span className="text-[11px] text-slate-500">3 official parts • Cue card timers • AI analysis</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
