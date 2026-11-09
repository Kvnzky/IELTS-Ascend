import React from 'react';
import {
  Target,
  Flame,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Headphones,
  Feather,
  Mic,
  Languages,
  BookCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, DiagnosticResult } from '../types/ielts';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { storageService } from '../services/storageService';

interface DashboardProps {
  profile: UserProfile;
  diagnostic: DiagnosticResult | null;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completedLessonIds?: string[];
  vocabMasteredCount: number;
  totalVocabCount: number;
  onNavigate: (sectionId: string) => void;
  onOpenDiagnostic: () => void;
  onOpenLesson?: (lessonId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  diagnostic,
  completedLessonsCount,
  totalLessonsCount,
  completedLessonIds = [],
  vocabMasteredCount,
  totalVocabCount,
  onNavigate,
  onOpenDiagnostic,
  onOpenLesson,
}) => {
  // Real assessed scores (never fabricate scores if not yet assessed)
  const liveBands = storageService.computeCurrentBands();
  const examReadiness = storageService.computeExamReadiness(profile);
  const currentOverall = liveBands.overall;
  const currentBands = {
    listening: liveBands.listening,
    reading: liveBands.reading,
    writing: liveBands.writing,
    speaking: liveBands.speaking,
  };

  // Calculate overall preparation progress (incorporating curriculum, vocab, band progress, and multi-mock verification)
  const curriculumProgressPct = Math.round((completedLessonsCount / Math.max(totalLessonsCount, 1)) * 100);
  const vocabProgressPct = Math.round((vocabMasteredCount / Math.max(totalVocabCount, 1)) * 100);
  const bandProgressPct =
    currentOverall !== null
      ? Math.min(100, Math.round((currentOverall / Math.max(profile.targetOverallBand, 1)) * 100))
      : 0;
  const mockConsistencyPct = Math.min(100, Math.round((examReadiness.qualifyingMockCount / 2) * 100));
  const overallProgressPct = Math.round(
    curriculumProgressPct * 0.3 + vocabProgressPct * 0.15 + bandProgressPct * 0.35 + mockConsistencyPct * 0.2
  );

  // Smart Personal Learning Pathway: check paused lessons, flagged weak topics, and weakest skill for user's Exam Track
  const progressMap = storageService.getLessonProgressMap();
  const weakTopics = storageService.getWeakTopics();
  const trackLessons = CURRICULUM_LESSONS.filter(
    (l) => !l.examTrack || l.examTrack === 'both' || l.examTrack === profile.targetExam
  );
  const uncompletedLessons = trackLessons.filter((l) => !completedLessonIds.includes(l.id));

  const pausedLessonEntry = Object.values(progressMap)
    .filter((p) => !completedLessonIds.includes(p.lessonId))
    .sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''))[0];
  const pausedLesson = pausedLessonEntry
    ? CURRICULUM_LESSONS.find((l) => l.id === pausedLessonEntry.lessonId)
    : undefined;

  const topWeakLesson = weakTopics[0]
    ? CURRICULUM_LESSONS.find((l) => l.id === weakTopics[0].recommendedLessonId)
    : undefined;

  const weakestSkill = diagnostic
    ? (Object.entries(diagnostic.skillBands).sort((a, b) => a[1] - b[1])[0]?.[0] as string | undefined)
    : undefined;
  const recommendedLesson =
    pausedLesson ||
    topWeakLesson ||
    (weakestSkill ? uncompletedLessons.find((l) => l.skill === weakestSkill) : undefined) ||
    uncompletedLessons[0] ||
    CURRICULUM_LESSONS[0];

  const recommendationReason = pausedLesson
    ? `Resume In-Progress Session (Step ${pausedLessonEntry.currentStep} of 4)`
    : topWeakLesson
    ? `Targeted Remediation: ${weakTopics[0].label}`
    : weakestSkill
    ? `Priority Skill Focus: ${weakestSkill.toUpperCase()}`
    : `Next in ${profile.targetExam === 'academic' ? 'IELTS Academic' : 'General Training'} Pathway`;

  const skillsList = [
    {
      id: 'listening',
      name: 'Listening',
      current: currentBands.listening,
      target: profile.targetSkillBands.listening,
      icon: Headphones,
      color: 'from-blue-600 to-sky-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900',
      sectionId: 'listening',
    },
    {
      id: 'reading',
      name: 'Reading',
      current: currentBands.reading,
      target: profile.targetSkillBands.reading,
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-900',
      sectionId: 'reading',
    },
    {
      id: 'writing',
      name: 'Writing',
      current: currentBands.writing,
      target: profile.targetSkillBands.writing,
      icon: Feather,
      color: 'from-amber-600 to-yellow-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-900',
      sectionId: 'writing',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      current: currentBands.speaking,
      target: profile.targetSkillBands.speaking,
      icon: Mic,
      color: 'from-purple-600 to-pink-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200 dark:border-purple-900',
      sectionId: 'speaking',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Target: IELTS {profile.targetExam === 'academic' ? 'Academic' : 'General Training'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {profile.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your preparation trajectory is primed for Band {profile.targetOverallBand.toFixed(1)}. You have logged{' '}
              <span className="font-bold text-white">{(profile.totalStudyMinutes / 60).toFixed(1)} study hours</span> across your {profile.streakDays}-day streak.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!diagnostic ? (
              <button
                onClick={onOpenDiagnostic}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <Award className="w-4 h-4" />
                <span>Take Diagnostic Assessment</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('curriculum')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Curriculum</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('mock-exams')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 transition-all hover:scale-105"
            >
              <Clock className="w-4 h-4" />
              <span>Mock Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('achievements')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('achievements');
            }
          }}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Study Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {profile.streakDays} <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">Keep the flame alive!</p>
        </div>

        {/* Study Hours */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('study-plan')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('study-plan');
            }
          }}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Study Time</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {(profile.totalStudyMinutes / 60).toFixed(1)} <span className="text-xs font-bold text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Goal: {profile.dailyStudyMinutes} min/day
          </p>
        </div>

        {/* Completed Lessons */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('curriculum')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('curriculum');
            }
          }}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Curriculum Mastery</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedLessonsCount} / {totalLessonsCount}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${curriculumProgressPct}%` }}
            />
          </div>
        </div>

        {/* Overall Readiness */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('performance')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('performance');
            }
          }}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-300 dark:hover:border-red-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Readiness Score</span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600">
              <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {overallProgressPct}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Comparison: Current Performance vs Target Performance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Band Gap Analysis: Current vs Target Performance
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Objective benchmark comparing diagnostic/estimated proficiency with your aspirational band score.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Estimated Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-red-600 dark:text-red-400">Target Band</span>
            </div>
          </div>
        </div>

        {/* 4 Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillsList.map((skill) => {
            const Icon = skill.icon;
            const hasScore = skill.current !== null;
            const gap = hasScore ? (skill.target - (skill.current as number)).toFixed(1) : null;
            const isTargetReached = hasScore && (skill.current as number) >= skill.target;

            return (
              <div
                key={skill.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate(skill.sectionId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(skill.sectionId);
                  }
                }}
                className={`cursor-pointer p-4 rounded-2xl border transition-all hover:scale-[1.02] ${skill.borderColor} ${skill.bgColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                      <Icon className={`w-4 h-4 ${skill.textColor}`} />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {hasScore ? `Current: Band ${(skill.current as number).toFixed(1)}` : 'Current: Not Assessed'}
                    </span>
                    <span className={skill.textColor}>Target: Band {skill.target.toFixed(1)}</span>
                  </div>

                  {/* Relative Gap Bar */}
                  <div className="w-full bg-white dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                      style={{ width: `${hasScore ? Math.min(100, ((skill.current as number) / 9.0) * 100) : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">
                      {!hasScore
                        ? 'Take Diagnostic or Practice'
                        : isTargetReached
                        ? 'Target Achieved'
                        : `Gap: -${gap} bands`}
                    </span>
                    <span className={`font-bold ${isTargetReached ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}>
                      {isTargetReached ? '✓ Ready' : 'Train Now →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Benchmark Summary Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Examination Skill</th>
                <th className="py-3 px-4">Estimated Current Band</th>
                <th className="py-3 px-4">Target Band</th>
                <th className="py-3 px-4">Band Delta</th>
                <th className="py-3 px-4">Readiness Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {skillsList.map((s) => {
                const hasScore = s.current !== null;
                const scoreVal = s.current as number;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold flex items-center gap-2">
                      <s.icon className={`w-4 h-4 ${s.textColor}`} />
                      {s.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {hasScore ? scoreVal.toFixed(1) : <span className="text-slate-400 font-sans">Not Assessed</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">{s.target.toFixed(1)}</td>
                    <td className="py-3 px-4 font-mono">
                      {!hasScore ? (
                        <span className="text-slate-400 font-sans">Pending Diagnostic</span>
                      ) : scoreVal >= s.target ? (
                        <span className="text-emerald-600 font-bold">On Target</span>
                      ) : (
                        <span className="text-amber-600 font-bold">-{(s.target - scoreVal).toFixed(1)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          !hasScore
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            : examReadiness.isExamReady
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : scoreVal >= s.target
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {!hasScore
                          ? 'Unassessed'
                          : examReadiness.isExamReady
                          ? 'Exam Ready ✓'
                          : scoreVal >= s.target
                          ? `Target Met (${examReadiness.qualifyingMockCount}/2 Mocks)`
                          : 'In Preparation'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate(s.sectionId)}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                      >
                        Launch Practice →
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 dark:bg-slate-800/80 font-black">
                <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                  OVERALL IELTS SCORE (ESTIMATED)
                </td>
                <td className="py-3.5 px-4 font-mono text-base">
                  {currentOverall !== null ? currentOverall.toFixed(1) : <span className="text-xs font-sans text-slate-400">Not Assessed</span>}
                </td>
                <td className="py-3.5 px-4 font-mono text-base text-red-600 dark:text-red-400">
                  {profile.targetOverallBand.toFixed(1)}
                </td>
                <td className="py-3.5 px-4 font-mono text-sm">
                  {currentOverall === null ? (
                    <button onClick={onOpenDiagnostic} className="text-xs font-sans font-bold text-red-600 hover:underline">
                      Take Diagnostic →
                    </button>
                  ) : currentOverall >= profile.targetOverallBand ? (
                    <span className="text-emerald-600">Goal Met</span>
                  ) : (
                    <span className="text-red-600">-{(profile.targetOverallBand - currentOverall).toFixed(1)}</span>
                  )}
                </td>
                <td className="py-3.5 px-4" colSpan={2}>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    {examReadiness.statusLabel} • {examReadiness.qualifyingMockCount}/2 Consistent Mock Exams
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {examReadiness.statusReason}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Recommended Next Actions & Academy Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Lesson Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Recommended Next Step for You
              </h3>
            </div>
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <span>View Curriculum</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/20 border border-red-200/80 dark:border-red-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Level {recommendedLesson.level} • {recommendedLesson.skill.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                  {recommendationReason}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {recommendedLesson.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                {recommendedLesson.description}
              </p>
            </div>

            <button
              onClick={() => (onOpenLesson ? onOpenLesson(recommendedLesson.id) : onNavigate('curriculum'))}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-500/20 shrink-0 transition-transform hover:scale-105"
            >
              {pausedLesson ? `Resume Lesson (${recommendedLesson.estimatedDurationMin}m)` : `Start Lesson (${recommendedLesson.estimatedDurationMin}m)`}
            </button>
          </div>

          {/* Quick Launch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('writing')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('writing');
                }
              }}
              className="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all bg-slate-50/50 dark:bg-slate-800/30 space-y-1"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                <Feather className="w-4 h-4" />
                <span>AI Writing Evaluator</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Submit Task 1/2 for 4-criteria band breakdown.
              </p>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('speaking')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('speaking');
                }
              }}
              className="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all bg-slate-50/50 dark:bg-slate-800/30 space-y-1"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
                <Mic className="w-4 h-4" />
                <span>Speaking Cue Card</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Record Part 2 with 60s prep & 2m speaking timer.
              </p>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('vocabulary')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('vocabulary');
                }
              }}
              className="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all bg-slate-50/50 dark:bg-slate-800/30 space-y-1"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <Languages className="w-4 h-4" />
                <span>SRS Flashcard Deck</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Review Academic Word List and collocations.
              </p>
            </div>
          </div>
        </div>

        {/* Study Plan Status & Calendar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Exam Countdown
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Exam Date
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {profile.examDate || 'Not Scheduled Yet'}
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                {profile.dailyStudyMinutes} mins daily dedication
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">AWL Vocabulary Mastered</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {vocabMasteredCount} / {totalVocabCount}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${vocabProgressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onNavigate('mock-exams')}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-red-500" />
            <span>Launch Mock Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
