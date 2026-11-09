import React from 'react';
import {
  LineChart,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Headphones,
  BookOpen,
  Feather,
  Mic,
  ArrowUpRight,
} from 'lucide-react';
import { UserProfile, DiagnosticResult, WritingEvaluation, SpeakingEvaluation } from '../types/ielts';
import { storageService } from '../services/storageService';

interface PerformanceAnalyticsProps {
  profile: UserProfile;
  diagnostic: DiagnosticResult | null;
  writingEvals: WritingEvaluation[];
  speakingEvals: SpeakingEvaluation[];
  onNavigate: (sectionId: string) => void;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  profile,
  diagnostic,
  writingEvals,
  speakingEvals,
  onNavigate,
}) => {
  const liveBands = storageService.computeCurrentBands();
  const examReadiness = storageService.computeExamReadiness(profile);
  const mockSessions = storageService.getMockSessions();
  const currentBands = {
    listening: liveBands.listening,
    reading: liveBands.reading,
    writing: liveBands.writing,
    speaking: liveBands.speaking,
  };

  const skillsData = [
    {
      skill: 'listening',
      name: 'Listening',
      current: currentBands.listening,
      target: profile.targetSkillBands.listening,
      icon: Headphones,
      color: 'bg-blue-600',
    },
    {
      skill: 'reading',
      name: 'Reading',
      current: currentBands.reading,
      target: profile.targetSkillBands.reading,
      icon: BookOpen,
      color: 'bg-emerald-600',
    },
    {
      skill: 'writing',
      name: 'Writing',
      current: currentBands.writing,
      target: profile.targetSkillBands.writing,
      icon: Feather,
      color: 'bg-amber-600',
    },
    {
      skill: 'speaking',
      name: 'Speaking',
      current: currentBands.speaking,
      target: profile.targetSkillBands.speaking,
      icon: Mic,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>Progress Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            My IELTS Performance & Band Trajectory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Empirical tracking of your readiness, score deltas, and recent practice & AI evaluations across all 4 skills. Note: Estimated bands are for preparation guidance and are not official IELTS Test Report Form (TRF) results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {liveBands.overall !== null && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Estimated Overall: Band {liveBands.overall.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-bold text-red-700 dark:text-red-400">
            <Target className="w-4 h-4 text-red-600" />
            <span>Target: Band {profile.targetOverallBand.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Multi-Exam Readiness Verification Banner (Section 11) */}
      <div
        className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          examReadiness.isExamReady
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
            : 'bg-slate-900 text-white border-slate-800'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider">
            {examReadiness.isExamReady ? (
              <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Official Exam Readiness Verified
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Multi-Exam Readiness Gate: {examReadiness.statusLabel}
              </span>
            )}
          </div>
          <p
            className={`text-xs leading-relaxed ${
              examReadiness.isExamReady ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300'
            }`}
          >
            {examReadiness.statusReason}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 dark:bg-slate-800 border border-white/10 text-xs font-mono font-bold">
            Qualifying Mocks: {examReadiness.qualifyingMockCount} / 2 Required
          </div>
          {!examReadiness.isExamReady && (
            <button
              type="button"
              onClick={() => onNavigate('mock-exams')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold"
            >
              Take Full Mock →
            </button>
          )}
        </div>
      </div>

      {/* Skill Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillsData.map((item) => {
          const Icon = item.icon;
          const hasScore = item.current !== null;
          const scoreVal = item.current as number;
          const delta = hasScore ? (item.target - scoreVal).toFixed(1) : null;
          const pct = hasScore ? Math.min(100, Math.round((scoreVal / 9.0) * 100)) : 0;

          return (
            <div
              key={item.skill}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">Band 9.0 Max</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {hasScore ? scoreVal.toFixed(1) : <span className="text-sm font-sans text-slate-400">Not Assessed</span>}
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    Target: {item.target.toFixed(1)}
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    {!hasScore
                      ? 'Take Diagnostic or Practice'
                      : scoreVal >= item.target
                      ? 'Target Achieved'
                      : `Gap: -${delta} bands`}
                  </span>
                  <button
                    onClick={() => onNavigate(item.skill)}
                    className="font-bold text-red-600 hover:underline flex items-center"
                  >
                    <span>Train</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Submissions Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Evaluations Log */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Recent Writing Submissions
              </h3>
            </div>
            <span className="text-xs text-slate-400">{writingEvals.length} evaluated</span>
          </div>

          {writingEvals.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <p>No essays submitted yet.</p>
              <button
                onClick={() => onNavigate('writing')}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
              >
                Write an Essay
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {writingEvals.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block uppercase">
                      {w.taskType} ({w.wordCount} words)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(w.evaluatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-mono font-black text-amber-600 text-sm">
                    Band {w.estimatedOverallBand.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Speaking Evaluations Log */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Recent Speaking Sessions
              </h3>
            </div>
            <span className="text-xs text-slate-400">{speakingEvals.length} evaluated</span>
          </div>

          {speakingEvals.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <p>No speaking recordings evaluated yet.</p>
              <button
                onClick={() => onNavigate('speaking')}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                Record Cue Card
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {speakingEvals.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Speaking Part {s.partNumber} ({s.durationSeconds}s, {s.wordsPerMinute} WPM)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.evaluatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-mono font-black text-purple-600 text-sm">
                    Band {s.estimatedOverallBand.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mock Examination Sessions Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Completed Mock Examination Reports
            </h3>
          </div>
          <span className="text-xs text-slate-400">{mockSessions.length} completed</span>
        </div>

        {mockSessions.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 space-y-2">
            <p>No full mock examinations completed yet.</p>
            <button
              onClick={() => onNavigate('mock-exams')}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
            >
              Launch Mock Simulator
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900 dark:text-white block uppercase">
                    IELTS {session.examType === 'academic' ? 'Academic' : 'General Training'} Mock
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    L: {(session.scores.listening?.band || 0).toFixed(1)} • R: {(session.scores.reading?.band || 0).toFixed(1)} • W: {(session.scores.writing?.band || 0).toFixed(1)} • S: {(session.scores.speaking?.band || 0).toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(session.completedAt || session.startedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Overall</span>
                  <span className="font-mono font-black text-red-600 text-base">
                    Band {(session.scores.overallBand || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
