import React from 'react';
import {
  Briefcase,
  Mail,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

import { ExamType } from '../types/ielts';

interface GeneralHubProps {
  onNavigate: (sectionId: string) => void;
  onTrackChange?: (track: ExamType) => void;
}

export const GeneralHub: React.FC<GeneralHubProps> = ({ onNavigate, onTrackChange }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <Briefcase className="w-4 h-4" />
            <span>Immigration, Work Permits & Global Employment</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">IELTS General Training Hub</h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Engineered for immigration to Canada (Express Entry, PNP), Australia (PR points), New Zealand, the UK, and international workplace accreditation.
          </p>
        </div>
      </div>

      {/* Critical Scoring Warning */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-amber-900 dark:text-amber-200 block">
            Crucial Scoring Difference in General Training Reading:
          </span>
          <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
            Because General Training texts are drawn from everyday materials, the raw score boundary is substantially stricter. To achieve Band 7.0, you must score <span className="font-black underline">34 out of 40</span> (compared to 30 in Academic). Zero careless mistakes allowed!
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GT Writing Task 1: Letter Writing */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Task 1: Practical Letter Writing
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">20 Mins • Min 150 Words</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Respond to a real-world scenario by writing a formal, semi-formal, or informal letter answering all 3 specified bullet points.
          </p>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Letter Archetypes:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Formal Complaint Letters</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Request / Information Enquiries</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Apology & Explanation Letters</span>
              <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">• Informal Invitation / Advice</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTrackChange?.('general');
              onNavigate('writing');
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Practice GT Letter Writing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* GT Reading */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  General Training Reading Sections
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">60 Mins • 3 Sections • 40 Questions</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tests everyday practical English across workplace training handbooks, fire safety policies, community advertisements, and long narrative non-fiction.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Section 1: Everyday social notices, brochures & timetables</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Section 2: Workplace health & safety, staff contracts & conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Section 3: General interest longer narrative / descriptive article</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTrackChange?.('general');
              onNavigate('reading');
            }}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Launch General Training Reading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
