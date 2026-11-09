import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Flame,
} from 'lucide-react';
import { UserProfile } from '../types/ielts';
import { storageService } from '../services/storageService';

interface StudyPlanViewProps {
  profile: UserProfile;
  onNavigate: (sectionId: string) => void;
}

interface PlanDay {
  dayName: string;
  focus: string;
  tasks: { id: string; title: string; durationMin: number; sectionId: string }[];
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ profile, onNavigate }) => {
  const [doneIds, setDoneIds] = useState<string[]>(() => storageService.getStudyPlanDoneIds());
  const currentBands = storageService.computeCurrentBands();
  const weakTopics = storageService.getWeakTopics();
  const timeScale = Math.max(0.5, Math.min(2, (profile.dailyStudyMinutes || 60) / 60));

  const skillEntries: { id: string; label: string; band: number | null; target: number }[] = [
    { id: 'listening', label: 'Listening', band: currentBands.listening, target: profile.targetSkillBands.listening },
    { id: 'reading', label: 'Reading', band: currentBands.reading, target: profile.targetSkillBands.reading },
    { id: 'writing', label: 'Writing', band: currentBands.writing, target: profile.targetSkillBands.writing },
    { id: 'speaking', label: 'Speaking', band: currentBands.speaking, target: profile.targetSkillBands.speaking },
  ];
  const assessedSkills = skillEntries.filter((s) => s.band !== null) as {
    id: string;
    label: string;
    band: number;
    target: number;
  }[];
  const prioritySkill =
    assessedSkills.length > 0
      ? [...assessedSkills].sort((a, b) => (b.target - b.band) - (a.target - a.band))[0]
      : null;

  const schedule: PlanDay[] = [
    {
      dayName: 'Monday',
      focus: 'Listening & Lexicon',
      tasks: [
        { id: 't1', title: 'Listening Section 1 & 2 Accommodation audio drill', durationMin: 25, sectionId: 'listening' },
        { id: 't2', title: 'Review 15 Academic Word List Sublist 1 Flashcards', durationMin: 15, sectionId: 'vocabulary' },
        { id: 't3', title: 'L1 Sentence Construction & Parts of Speech lesson', durationMin: 20, sectionId: 'curriculum' },
      ],
    },
    {
      dayName: 'Tuesday',
      focus: 'Reading Deep Dive',
      tasks: [
        {
          id: 't4',
          title:
            profile.targetExam === 'academic'
              ? 'Timed Academic Reading Passages 1–3 with highlighting tools'
              : 'Timed General Training Reading Sections 1–3 workplace & general texts',
          durationMin: 30,
          sectionId: 'reading',
        },
        { id: 't5', title: 'True / False / Not Given elimination drill', durationMin: 15, sectionId: 'exercises' },
        { id: 't6', title: 'Topic Vocabulary: Environment & Biodiversity terms', durationMin: 15, sectionId: 'vocabulary' },
      ],
    },
    {
      dayName: 'Wednesday',
      focus: 'Writing Task 1 Mastery',
      tasks: [
        {
          id: 't7',
          title:
            profile.targetExam === 'academic'
              ? 'Academic Task 1: Line Graph / Pie Chart Band 8 Overview writing'
              : 'General Training Task 1: Formal & Semi-Formal Letter tone mastery',
          durationMin: 35,
          sectionId: 'writing',
        },
        { id: 't8', title: 'Passive Voice & Complex Clause Structures in Grammar Academy', durationMin: 25, sectionId: 'grammar' },
      ],
    },
    {
      dayName: 'Thursday',
      focus: 'Speaking Fluency & Cue Cards',
      tasks: [
        { id: 't9', title: 'Record Part 2 Cue Card with 1-min preparation timer', durationMin: 20, sectionId: 'speaking' },
        { id: 't10', title: 'AI Speaking evaluation review and pause mitigation', durationMin: 15, sectionId: 'speaking' },
        { id: 't11', title: 'Academic Collocations Flashcard deck', durationMin: 25, sectionId: 'vocabulary' },
      ],
    },
    {
      dayName: 'Friday',
      focus: 'Writing Task 2 Essay Workshop',
      tasks: [
        { id: 't12', title: 'Discuss Both Views 250-word timed essay', durationMin: 40, sectionId: 'writing' },
        { id: 't13', title: 'Academic Hedging and Inversion masterclass', durationMin: 20, sectionId: 'grammar' },
      ],
    },
    {
      dayName: 'Saturday',
      focus: 'Mock Examination Simulation',
      tasks: [
        { id: 't14', title: 'Full 4-Skill IELTS Mock Examination Simulation', durationMin: 60, sectionId: 'mock-exams' },
      ],
    },
    {
      dayName: 'Sunday',
      focus: 'Review & Error Rectification',
      tasks: [
        { id: 't15', title: 'Audit incorrect answers in reading and listening', durationMin: 30, sectionId: 'performance' },
        { id: 't16', title: 'Leitner Box 4 & 5 SRS review session', durationMin: 30, sectionId: 'vocabulary' },
      ],
    },
  ];

  const toggleTask = (taskId: string) => {
    const updated = storageService.toggleStudyPlanTask(taskId);
    setDoneIds([...updated]);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Personalized Study Calendar</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Weekly IELTS Preparation Roadmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Calibrated for your {profile.dailyStudyMinutes} min/day commitment to bridge your current level to Band {profile.targetOverallBand.toFixed(1)}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{profile.streakDays}-Day Active Streak</span>
          </div>
        </div>
      </div>

      {/* Adaptive Priority Focus Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white border border-indigo-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adaptive Performance Calibration</span>
          </div>
          {prioritySkill ? (
            <p className="text-sm font-bold text-white">
              Priority Skill Gap: <span className="text-amber-400">{prioritySkill.label}</span> (Current Band{' '}
              {prioritySkill.band.toFixed(1)} vs Target {prioritySkill.target.toFixed(1)})
              {weakTopics.length > 0 && ` • ${weakTopics.length} Remediation Lesson(s) Queued`}
            </p>
          ) : (
            <p className="text-sm font-bold text-white">
              Complete your first Diagnostic or Skill Practice Test to unlock dynamic skill-gap prioritization.
            </p>
          )}
          <p className="text-xs text-slate-300">
            Daily task durations are automatically scaled to match your {profile.dailyStudyMinutes} min/day study target ({profile.targetExam === 'academic' ? 'IELTS Academic' : 'IELTS General Training'}).
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate(prioritySkill ? prioritySkill.id : 'curriculum')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          <span>{prioritySkill ? `Train ${prioritySkill.label} Now` : 'Start Diagnostic / Curriculum'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map((day) => {
          const totalDayMin = day.tasks.reduce((acc, t) => acc + Math.max(10, Math.round(t.durationMin * timeScale)), 0);
          const completedCount = day.tasks.filter((t) => doneIds.includes(t.id)).length;
          const isAllDone = completedCount === day.tasks.length;

          return (
            <div
              key={day.dayName}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isAllDone
                  ? 'border-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-black text-base text-slate-900 dark:text-white block">
                      {day.dayName}
                    </span>
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                      {day.focus}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {totalDayMin}m
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {day.tasks.map((t) => {
                    const isDone = doneIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-2.5 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(t.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <span
                            className={`font-semibold block leading-snug ${
                              isDone
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {t.title}
                          </span>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{Math.max(10, Math.round(t.durationMin * timeScale))} mins</span>
                            <button
                              onClick={() => onNavigate(t.sectionId)}
                              className="font-bold text-red-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Open</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-400 text-right">
                {completedCount} of {day.tasks.length} tasks completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
