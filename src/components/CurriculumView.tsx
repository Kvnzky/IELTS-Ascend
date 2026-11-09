import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  ShieldAlert,
  Target,
  Layers,
  Volume2,
  PauseCircle,
  Flame,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurriculumLesson, ExamType, LessonProgressState } from '../types/ielts';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { isAnswerMatch } from '../data/readingData';
import { VisualChartRenderer } from './VisualChartRenderer';

interface CurriculumViewProps {
  lessons: CurriculumLesson[];
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string, score: number) => void;
  userExamType?: ExamType;
  initialLessonId?: string | null;
  onClearInitialLesson?: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  lessons,
  completedLessonIds,
  onCompleteLesson,
  userExamType = 'academic',
  initialLessonId,
  onClearInitialLesson,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<0 | 1 | 2 | 3 | 4>(0); // 0 = All Levels
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'academic' | 'general'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2: Guided Practice State
  const [guidedAnswers, setGuidedAnswers] = useState<{ [id: string]: string | number }>({});
  const [revealedHints, setRevealedHints] = useState<{ [id: string]: boolean }>({});
  const [guidedSubmitted, setGuidedSubmitted] = useState<boolean>(false);

  // Step 3: Independent Practice & Practical Task State
  const [independentAnswers, setIndependentAnswers] = useState<{ [id: string]: string | number }>({});
  const [independentSubmitted, setIndependentSubmitted] = useState<boolean>(false);
  const [practicalDraft, setPracticalDraft] = useState<string>('');
  const [showPracticalModel, setShowPracticalModel] = useState<boolean>(false);

  // Step 4: Knowledge Assessment State
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string | number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Smart Pathway & Saved Progress State
  const [progressMap, setProgressMap] = useState<{ [lessonId: string]: LessonProgressState }>(() =>
    storageService.getLessonProgressMap()
  );
  const [weakTopics, setWeakTopics] = useState(() => storageService.getWeakTopics());

  const modalBodyRef = useRef<HTMLDivElement>(null);

  const refreshSavedProgress = () => {
    setProgressMap(storageService.getLessonProgressMap());
    setWeakTopics(storageService.getWeakTopics());
  };

  // Handle opening initialLessonId if navigated from Dashboard or PracticeExercises
  useEffect(() => {
    if (initialLessonId) {
      const target = lessons.find((l) => l.id === initialLessonId);
      if (target) {
        openLesson(target);
      }
      if (onClearInitialLesson) {
        onClearInitialLesson();
      }
    }
  }, [initialLessonId]);

  // Scroll modal to top when switching lesson or step
  useEffect(() => {
    if (activeLesson && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [activeLesson?.id, activeStep]);

  const filteredLessons = lessons.filter((l) => {
    const matchLevel = selectedLevel === 0 || l.level === selectedLevel;
    const matchTrack =
      selectedTrack === 'all' || !l.examTrack || l.examTrack === 'both' || l.examTrack === selectedTrack;
    const matchDiff = selectedDifficulty === 'all' || !l.difficulty || l.difficulty === selectedDifficulty;
    const matchSkill = selectedSkill === 'all' || l.skill === selectedSkill;
    return matchLevel && matchTrack && matchDiff && matchSkill;
  });

  const openLesson = (lesson: CurriculumLesson) => {
    setActiveLesson(lesson);
    const saved = storageService.getLessonProgress(lesson.id);
    const isAlreadyCompleted = completedLessonIds.includes(lesson.id);

    if (saved) {
      setActiveStep(saved.currentStep || 1);
      setGuidedAnswers(saved.guidedAnswers || {});
      setGuidedSubmitted(saved.guidedSubmitted || false);
      setIndependentAnswers(saved.independentAnswers || {});
      setIndependentSubmitted(saved.independentSubmitted || false);
      setPracticalDraft(saved.practicalDraft || '');
      setShowPracticalModel( Boolean(saved.practicalDraft && saved.practicalDraft.length > 10) );
      setUserAnswers(saved.assessmentAnswers || {});
      setSubmittedQuiz(saved.assessmentSubmitted || false);
      setQuizScore(saved.assessmentScore ?? null);
      setRevealedHints({});
    } else if (isAlreadyCompleted) {
      const gAns: { [id: string]: string | number } = {};
      lesson.guidedPractice?.forEach((g) => {
        gAns[g.id] = g.correctAnswer;
      });
      const iAns: { [id: string]: string | number } = {};
      lesson.independentPractice?.forEach((ip) => {
        iAns[ip.id] = ip.correctAnswer;
      });
      const qAns: { [qId: string]: string | number } = {};
      lesson.practiceQuestions.forEach((q) => {
        qAns[q.id] = q.correctAnswer;
      });
      setActiveStep(1);
      setGuidedAnswers(gAns);
      setGuidedSubmitted(true);
      setIndependentAnswers(iAns);
      setIndependentSubmitted(true);
      setPracticalDraft('');
      setShowPracticalModel(false);
      setUserAnswers(qAns);
      setSubmittedQuiz(true);
      setQuizScore(100);
      setRevealedHints({});
    } else {
      setActiveStep(1);
      setGuidedAnswers({});
      setGuidedSubmitted(false);
      setIndependentAnswers({});
      setIndependentSubmitted(false);
      setPracticalDraft('');
      setShowPracticalModel(false);
      setUserAnswers({});
      setSubmittedQuiz(false);
      setQuizScore(null);
      setRevealedHints({});
    }
  };

  const persistCurrentLessonState = (
    overrideStep?: 1 | 2 | 3 | 4,
    overrideGuidedSub?: boolean,
    overrideIndepSub?: boolean,
    overrideQuizSub?: boolean,
    overrideQuizScore?: number | null
  ) => {
    if (!activeLesson) return;
    const state: LessonProgressState = {
      lessonId: activeLesson.id,
      currentStep: overrideStep ?? activeStep,
      guidedAnswers,
      guidedSubmitted: overrideGuidedSub ?? guidedSubmitted,
      independentAnswers,
      independentSubmitted: overrideIndepSub ?? independentSubmitted,
      practicalDraft,
      assessmentAnswers: userAnswers,
      assessmentSubmitted: overrideQuizSub ?? submittedQuiz,
      assessmentScore: overrideQuizScore !== undefined ? overrideQuizScore : quizScore,
      lastUpdated: new Date().toISOString(),
    };
    storageService.saveLessonProgress(state);
    refreshSavedProgress();
  };

  const handleCloseAndSave = () => {
    persistCurrentLessonState();
    setActiveLesson(null);
  };

  useEffect(() => {
    if (!activeLesson) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseAndSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLesson, activeStep, guidedAnswers, guidedSubmitted, independentAnswers, independentSubmitted, practicalDraft, userAnswers, submittedQuiz, quizScore]);

  const handleStepChange = (nextStep: 1 | 2 | 3 | 4) => {
    setActiveStep(nextStep);
    persistCurrentLessonState(nextStep);
  };

  const currentIndex = activeLesson ? lessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const isQuestionMatch = (userVal: string | number | undefined, correctVal: string | number): boolean => {
    if (userVal === undefined || userVal === '') return false;
    if (typeof correctVal === 'number') {
      return Number(userVal) === correctVal;
    }
    return isAnswerMatch(String(userVal), String(correctVal));
  };

  const handleCheckGuided = () => {
    setGuidedSubmitted(true);
    persistCurrentLessonState(activeStep, true);
    audioService.playChime('tick');
  };

  const handleCheckIndependent = () => {
    setIndependentSubmitted(true);
    persistCurrentLessonState(activeStep, guidedSubmitted, true);
    audioService.playChime('tick');
  };

  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    let correct = 0;
    activeLesson.practiceQuestions.forEach((q) => {
      if (isQuestionMatch(userAnswers[q.id], q.correctAnswer)) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / Math.max(activeLesson.practiceQuestions.length, 1)) * 100);
    setQuizScore(scorePct);
    setSubmittedQuiz(true);
    persistCurrentLessonState(4, guidedSubmitted, independentSubmitted, true, scorePct);

    const requiredScore = activeLesson.requiredPassingScore || 80;
    if (scorePct >= requiredScore) {
      onCompleteLesson(activeLesson.id, scorePct);
      storageService.clearWeakTopic(activeLesson.id);
      refreshSavedProgress();
      audioService.playChime('correct');
      try {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      storageService.recordWeakTopic(
        activeLesson.id,
        `${activeLesson.title} (${activeLesson.skill.toUpperCase()})`,
        activeLesson.skill,
        activeLesson.id
      );
      refreshSavedProgress();
      audioService.playChime('wrong');
    }
  };

  // Find any paused (in-progress) lessons not yet completed
  const inProgressLessons = Object.values(progressMap)
    .filter((p) => !completedLessonIds.includes(p.lessonId))
    .sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''))
    .map((p) => ({
      progress: p,
      lesson: lessons.find((l) => l.id === p.lessonId),
    }))
    .filter((item): item is { progress: LessonProgressState; lesson: CurriculumLesson } => Boolean(item.lesson));

  // Smart Next Recommended Lesson for user's track
  const nextRecommendedForTrack = lessons.find(
    (l) =>
      !completedLessonIds.includes(l.id) &&
      (!l.examTrack || l.examTrack === 'both' || l.examTrack === userExamType)
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Mastery-Based IELTS Curriculum ({lessons.length} Comprehensive Lessons)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              From Foundations to Band 8+ Mastery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Every lesson follows an 8-stage instructional architecture: Learning Objectives, Concept Breakdown, Effective vs Ineffective Worked Examples, Guided Practice with Hints, Progressive Independent Practice, IELTS Exam Application, and a Mastery Assessment (80%+ required).
            </p>
          </div>

          {/* Level Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { level: 0, title: 'All Levels' },
              { level: 1, title: 'L1: Foundations' },
              { level: 2, title: 'L2: Intermediate' },
              { level: 3, title: 'L3: Advanced' },
              { level: 4, title: 'L4: Exam Strategy' },
            ].map((item) => (
              <button
                key={item.level}
                onClick={() => setSelectedLevel(item.level as 0 | 1 | 2 | 3 | 4)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedLevel === item.level
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Dimensional Filter Bar: Track, Difficulty, Skill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Skill Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['all', 'listening', 'reading', 'writing', 'speaking', 'grammar', 'strategy'] as const).map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedSkill === sk
                    ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {sk === 'all' ? 'All Skills' : sk}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Exam Track Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['all', 'academic', 'general'] as const).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSelectedTrack(tr)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedTrack === tr
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {tr === 'all' ? 'All Tracks' : tr === 'academic' ? 'IELTS Academic' : 'General Training'}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {diff === 'all' ? 'All Stages' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Personal Learning Pathway & Pause/Resume Hub */}
      {(inProgressLessons.length > 0 || weakTopics.length > 0 || nextRecommendedForTrack) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Resume In-Progress Lesson or Next Recommended */}
          <div className="lg:col-span-2 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white border border-slate-800 shadow-md flex flex-col justify-between gap-4">
            {inProgressLessons.length > 0 ? (
              <>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Paused Session • Step {inProgressLessons[0].progress.currentStep} of 4</span>
                  </div>
                  <h3 className="text-lg font-black">{inProgressLessons[0].lesson.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inProgressLessons[0].lesson.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-300 font-medium">
                    Your practice answers and draft are automatically saved.
                  </span>
                  <button
                    type="button"
                    onClick={() => openLesson(inProgressLessons[0].lesson)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume Lesson (Step {inProgressLessons[0].progress.currentStep}/4)</span>
                  </button>
                </div>
              </>
            ) : nextRecommendedForTrack ? (
              <>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smart Pathway • Recommended for IELTS {userExamType === 'academic' ? 'Academic' : 'General Training'}</span>
                  </div>
                  <h3 className="text-lg font-black">{nextRecommendedForTrack.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {nextRecommendedForTrack.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-300 font-medium">
                    Estimated time: {nextRecommendedForTrack.estimatedDurationMin} mins • Passing threshold: {nextRecommendedForTrack.requiredPassingScore}%
                  </span>
                  <button
                    type="button"
                    onClick={() => openLesson(nextRecommendedForTrack)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Recommended Lesson</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>

          {/* Card 2: Targeted Weak-Topic Remediation */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Adaptive Remediation Queue</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {weakTopics.length} Focus {weakTopics.length === 1 ? 'Area' : 'Areas'}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                Topics Flagged from Drills & Assessments
              </h4>
            </div>

            {weakTopics.length === 0 ? (
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No weak topics flagged right now! Complete drills or assessments to receive adaptive remediation.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {weakTopics.slice(0, 3).map((wt) => {
                  const remLesson = lessons.find((l) => l.id === wt.recommendedLessonId);
                  return (
                    <div
                      key={wt.topicId}
                      className="p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {wt.label}
                        </span>
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase">
                          {wt.skill} • Missed {wt.count}x
                        </span>
                      </div>
                      {remLesson && (
                        <button
                          type="button"
                          onClick={() => openLesson(remLesson)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shrink-0"
                        >
                          Fix Now →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lesson List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No curriculum lessons match the current filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel(0);
                setSelectedTrack('all');
                setSelectedDifficulty('all');
                setSelectedSkill('all');
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const savedState = progressMap[lesson.id];
            const isPaused = !isCompleted && Boolean(savedState);
            const totalActivities =
              (lesson.guidedPractice?.length || 0) +
              (lesson.independentPractice?.length || 0) +
              lesson.practiceQuestions.length;

            return (
              <div
                key={lesson.id}
                onClick={() => openLesson(lesson)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all hover:scale-[1.005] flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : isPaused
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/70'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                        : isPaused
                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isPaused ? (
                      <PauseCircle className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        L{lesson.level} • {lesson.skill}
                      </span>

                      {lesson.difficulty && (
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            lesson.difficulty === 'beginner'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : lesson.difficulty === 'intermediate'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          }`}
                        >
                          {lesson.difficulty}
                        </span>
                      )}

                      {lesson.examTrack && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                          {lesson.examTrack === 'both'
                            ? 'Academic & GT'
                            : lesson.examTrack === 'academic'
                            ? 'Academic Track'
                            : 'General Training Track'}
                        </span>
                      )}

                      <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.estimatedDurationMin}m ({lesson.durationCategory || 'standard'})
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium">
                        • {totalActivities} interactive tasks
                      </span>

                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                          Mastered ✓
                        </span>
                      )}

                      {isPaused && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                          In Progress (Step {savedState.currentStep}/4)
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : isPaused
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black'
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20'
                    }`}
                  >
                    <span>
                      {isCompleted
                        ? 'Review Lesson'
                        : isPaused
                        ? `Resume (Step ${savedState.currentStep}/4)`
                        : 'Start Mastery Lesson'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive 4-Step Mastery Lesson Studio Modal */}
      {activeLesson &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeLesson.title}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          >
            {/* Backdrop click saves progress and closes */}
            <div
              className="absolute inset-0"
              onClick={handleCloseAndSave}
              aria-hidden="true"
            />

            {/* Modal Dialog Window */}
            <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[86vh] my-auto">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white border-b border-slate-800 shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseAndSave}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="Pause & Return to Curriculum"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Pause & Save</span>
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400">
                          {activeLesson.levelTitle} • {activeLesson.skill}
                        </span>
                        {activeLesson.difficulty && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                            {activeLesson.difficulty}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeLesson.estimatedDurationMin} mins
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-black leading-tight">{activeLesson.title}</h3>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseAndSave}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Save & Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4-Step Instructional Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {[
                    { step: 1, label: '1. Concept & Examples', sub: 'Objectives & Models' },
                    { step: 2, label: '2. Guided Practice', sub: 'Scaffolded + Hints' },
                    { step: 3, label: '3. Independent & Exam', sub: 'Drills & Strategy' },
                    { step: 4, label: '4. Mastery Assessment', sub: `${activeLesson.requiredPassingScore}% Required` },
                  ].map((st) => {
                    const isCurrent = activeStep === st.step;
                    const isStepDone =
                      (st.step === 1 && activeStep > 1) ||
                      (st.step === 2 && guidedSubmitted) ||
                      (st.step === 3 && independentSubmitted) ||
                      (st.step === 4 && submittedQuiz && (quizScore || 0) >= activeLesson.requiredPassingScore);

                    return (
                      <button
                        key={st.step}
                        type="button"
                        onClick={() => handleStepChange(st.step as 1 | 2 | 3 | 4)}
                        className={`p-2 rounded-xl text-left transition-all border ${
                          isCurrent
                            ? 'bg-red-600/20 border-red-500 text-white'
                            : isStepDone
                            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                            : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-extrabold">
                          <span>{st.label}</span>
                          {isStepDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] opacity-75 block truncate">{st.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Body */}
              <div
                ref={modalBodyRef}
                className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100 text-xs"
              >
                {/* ==================== STEP 1: CONCEPT & WORKED EXAMPLES (A, B, C) ==================== */}
                {activeStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* A. Learning Objectives & Band Contribution */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="font-extrabold text-red-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          <span>A. Learning Objectives</span>
                        </span>
                        <ul className="space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
                          {activeLesson.learningObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Official IELTS Band Impact</span>
                          </span>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {activeLesson.bandContribution ||
                              'Directly strengthens official IELTS assessment criteria across accuracy, coherence, and exam strategy.'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                          Target Track:{' '}
                          {activeLesson.examTrack === 'academic'
                            ? 'IELTS Academic'
                            : activeLesson.examTrack === 'general'
                            ? 'IELTS General Training'
                            : 'Academic & General Training'}
                        </div>
                      </div>
                    </div>

                    {/* B. Concept Explanation & Structured Sections */}
                    <div className="space-y-3">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-red-600" />
                        <span>B. Core Concept Explanation</span>
                      </h4>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans text-xs">
                        {activeLesson.explanation}
                      </div>

                      {activeLesson.conceptSections && activeLesson.conceptSections.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {activeLesson.conceptSections.map((sec, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5"
                            >
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                                {idx + 1}. {sec.heading}
                              </span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {sec.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reference Visual Chart if Academic Task 1 lesson */}
                    {(activeLesson.id === 'l4-task1-overview-strategy' ||
                      activeLesson.id === 'l2-writing-acad-charts-trends') && (
                      <div className="space-y-2">
                        <span className="font-bold text-xs text-red-600 block uppercase tracking-wider">
                          Reference Graph: Fossil Fuels vs Renewables (2000–2020)
                        </span>
                        <VisualChartRenderer
                          type="line"
                          data={{
                            years: [2000, 2005, 2010, 2015, 2020],
                            series: [
                              { name: 'Petroleum (Fossil Fuel)', color: '#dc2626', values: [75, 78, 80, 83, 85] },
                              { name: 'Renewables (Solar & Wind)', color: '#16a34a', values: [10, 18, 32, 54, 76] },
                              { name: 'Coal', color: '#64748b', values: [55, 48, 38, 25, 14] },
                            ],
                            maxY: 100,
                          }}
                          caption="Energy Consumption Trends (Million Tonnes Oil Equivalent) - Band 8.5 Demonstration"
                        />
                      </div>
                    )}

                    {/* C. Worked Examples (Effective vs Ineffective) */}
                    {activeLesson.examples && activeLesson.examples.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>C. Worked Examples: Effective vs. Ineffective Approaches</span>
                        </h4>
                        <div className="space-y-3">
                          {activeLesson.examples.map((ex, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  Example {i + 1}: {ex.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => audioService.speak(ex.content)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1"
                                  title="Listen to Band 8+ Model Pronunciation"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-red-600" />
                                  <span>Listen</span>
                                </button>
                              </div>

                              {ex.ineffectiveVersion && (
                                <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-1">
                                  <span className="text-[10px] font-extrabold uppercase text-red-700 dark:text-red-400 block">
                                    ❌ Ineffective Approach (Band 5.0–6.0)
                                  </span>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {ex.ineffectiveVersion}
                                  </p>
                                </div>
                              )}

                              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">
                                  ✅ Effective IELTS Approach (Band 8.0–9.0)
                                </span>
                                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap">
                                  {ex.content}
                                </p>
                              </div>

                              {ex.note && (
                                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                                  <span className="font-bold">Examiner Reasoning: </span>
                                  {ex.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
                      <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2">
                        <div className="flex items-center gap-1.5 font-extrabold text-red-700 dark:text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>Common IELTS Pitfalls & Misconceptions to Avoid</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                          {activeLesson.commonMistakes.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* ==================== STEP 2: GUIDED PRACTICE (D) ==================== */}
                {activeStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                          D. Scaffolded Guided Practice
                        </span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          Practise with Examiner Hints & Immediate Step-by-Step Explanations
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Use the optional hint button if you get stuck, then verify your answers before moving to independent practice.
                        </p>
                      </div>
                    </div>

                    {(!activeLesson.guidedPractice || activeLesson.guidedPractice.length === 0) ? (
                      <p className="text-xs text-slate-500">Proceed to Step 3 for independent practice.</p>
                    ) : (
                      <div className="space-y-4">
                        {activeLesson.guidedPractice.map((gp, idx) => {
                          const userAns = guidedAnswers[gp.id];
                          const isCorrect = isQuestionMatch(userAns, gp.correctAnswer);

                          return (
                            <div
                              key={gp.id}
                              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                                  Guided Exercise {idx + 1} of {activeLesson.guidedPractice!.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRevealedHints((prev) => ({ ...prev, [gp.id]: !prev[gp.id] }))
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-200 transition-colors"
                                >
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  <span>{revealedHints[gp.id] ? 'Hide Hint' : 'Show Hint'}</span>
                                </button>
                              </div>

                              <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                                {gp.prompt}
                              </p>

                              {revealedHints[gp.id] && (
                                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
                                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                                  <div>
                                    <span className="font-bold">Coaching Hint: </span>
                                    {gp.hint}
                                  </div>
                                </div>
                              )}

                              {gp.type === 'multiple-choice' && gp.options ? (
                                <div className="space-y-1.5">
                                  {gp.options.map((opt, oIdx) => {
                                    const isSelected = userAns === oIdx;
                                    const isOptCorrect = gp.correctAnswer === oIdx;
                                    return (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        onClick={() => {
                                          if (guidedSubmitted) return;
                                          setGuidedAnswers((prev) => ({ ...prev, [gp.id]: oIdx }));
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                          guidedSubmitted
                                            ? isOptCorrect
                                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                                              : isSelected
                                              ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                                              : 'border-slate-200 dark:border-slate-800 opacity-60'
                                            : isSelected
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
                                        }`}
                                      >
                                        <span className="inline-block w-5 font-bold">
                                          {String.fromCharCode(65 + oIdx)}.
                                        </span>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    disabled={guidedSubmitted}
                                    value={typeof userAns === 'string' ? userAns : ''}
                                    onChange={(e) =>
                                      setGuidedAnswers((prev) => ({ ...prev, [gp.id]: e.target.value }))
                                    }
                                    placeholder="Type your answer..."
                                    className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {guidedSubmitted && (
                                    <div className="text-[11px] font-bold">
                                      {isCorrect ? (
                                        <span className="text-emerald-600">✓ Correct!</span>
                                      ) : (
                                        <span className="text-red-600">
                                          ✗ Correct Answer: {String(gp.correctAnswer)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {guidedSubmitted && (
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    Step-by-Step Explanation:{' '}
                                  </span>
                                  {gp.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <div className="flex items-center justify-between pt-2">
                          {guidedSubmitted ? (
                            <button
                              type="button"
                              onClick={() => {
                                setGuidedSubmitted(false);
                                setGuidedAnswers({});
                              }}
                              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset Guided Practice</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Answer the guided items above, then check your work.
                            </span>
                          )}

                          {!guidedSubmitted ? (
                            <button
                              type="button"
                              onClick={handleCheckGuided}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Check Guided Answers</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStepChange(3)}
                              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                            >
                              <span>Continue to Step 3: Independent & Exam Application</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ==================== STEP 3: INDEPENDENT PRACTICE & IELTS APPLICATION (E, F) ==================== */}
                {activeStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* E. Independent Practice */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                          E. Progressive Independent Practice
                        </span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          Apply the Skill Without Hints Across Increasing Difficulty
                        </h4>
                      </div>

                      {activeLesson.independentPractice && activeLesson.independentPractice.length > 0 && (
                        <div className="space-y-4">
                          {activeLesson.independentPractice.map((ip, idx) => {
                            const userAns = independentAnswers[ip.id];
                            const isCorrect = isQuestionMatch(userAns, ip.correctAnswer);

                            return (
                              <div
                                key={ip.id}
                                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-purple-600 dark:text-purple-400">
                                    Independent Task {idx + 1}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                      ip.difficulty === 'beginner'
                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                        : ip.difficulty === 'intermediate'
                                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                        : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                    }`}
                                  >
                                    {ip.difficulty}
                                  </span>
                                </div>

                                <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                                  {ip.prompt}
                                </p>

                                {ip.type === 'multiple-choice' && ip.options ? (
                                  <div className="space-y-1.5">
                                    {ip.options.map((opt, oIdx) => {
                                      const isSelected = userAns === oIdx;
                                      const isOptCorrect = ip.correctAnswer === oIdx;
                                      return (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          onClick={() => {
                                            if (independentSubmitted) return;
                                            setIndependentAnswers((prev) => ({ ...prev, [ip.id]: oIdx }));
                                          }}
                                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                            independentSubmitted
                                              ? isOptCorrect
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                                                : isSelected
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                                                : 'border-slate-200 dark:border-slate-800 opacity-60'
                                              : isSelected
                                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span className="inline-block w-5 font-bold">
                                            {String.fromCharCode(65 + oIdx)}.
                                          </span>
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      disabled={independentSubmitted}
                                      value={typeof userAns === 'string' ? userAns : ''}
                                      onChange={(e) =>
                                        setIndependentAnswers((prev) => ({ ...prev, [ip.id]: e.target.value }))
                                      }
                                      placeholder="Type your exact answer..."
                                      className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {independentSubmitted && (
                                      <div className="text-[11px] font-bold">
                                        {isCorrect ? (
                                          <span className="text-emerald-600">✓ Correct!</span>
                                        ) : (
                                          <span className="text-red-600">
                                            ✗ Correct Answer: {String(ip.correctAnswer)}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {independentSubmitted && (
                                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                                    <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                                    {ip.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <div className="flex items-center justify-between">
                            {independentSubmitted ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setIndependentSubmitted(false);
                                  setIndependentAnswers({});
                                }}
                                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Retry Independent Tasks</span>
                              </button>
                            ) : (
                              <span />
                            )}

                            {!independentSubmitted && (
                              <button
                                type="button"
                                onClick={handleCheckIndependent}
                                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Check Independent Practice</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* F. IELTS Examination Application */}
                    {activeLesson.ieltsApplication && (
                      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-600" />
                          <span>F. Direct IELTS Examination Application</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">
                              Exam-Day Execution Strategy
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {activeLesson.ieltsApplication.examStrategy}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 block">
                              Time-Management Benchmark
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {activeLesson.ieltsApplication.timeManagementTip}
                            </p>
                          </div>
                        </div>

                        {activeLesson.ieltsApplication.commonTraps.length > 0 && (
                          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                            <div className="flex items-center gap-1.5 font-extrabold text-amber-800 dark:text-amber-400">
                              <ShieldAlert className="w-4 h-4" />
                              <span>Common Examiner Traps to Watch Out For</span>
                            </div>
                            <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                              {activeLesson.ieltsApplication.commonTraps.map((tr, i) => (
                                <li key={i}>{tr}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Interactive Practical Writing/Speaking Task */}
                        {activeLesson.ieltsApplication.practicalTaskPrompt && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                                Applied Production Exercise (Writing / Speaking Draft)
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {practicalDraft.trim() ? practicalDraft.trim().split(/\s+/).length : 0} words
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                              {activeLesson.ieltsApplication.practicalTaskPrompt}
                            </p>
                            <textarea
                              rows={3}
                              value={practicalDraft}
                              onChange={(e) => setPracticalDraft(e.target.value)}
                              placeholder="Draft your response or speaking notes here before comparing with the Band 8.5 model..."
                              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowPracticalModel(!showPracticalModel);
                                  persistCurrentLessonState();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                                <span>
                                  {showPracticalModel ? 'Hide Band 8.5 Model' : 'Compare with Band 8.5 Model Response'}
                                </span>
                              </button>
                            </div>

                            {showPracticalModel && activeLesson.ieltsApplication.modelPracticalResponse && (
                              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">
                                  Band 8.5+ Examiner Model Response
                                </span>
                                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                                  {activeLesson.ieltsApplication.modelPracticalResponse}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ==================== STEP 4: KNOWLEDGE ASSESSMENT & REVIEW (G, H) ==================== */}
                {activeStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* G. Mandatory Knowledge Assessment */}
                    <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-red-600" />
                          <span>G. Mastery Knowledge Assessment ({activeLesson.practiceQuestions.length} Questions)</span>
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Passing requirement: <span className="font-bold text-red-600 dark:text-red-400">{activeLesson.requiredPassingScore}% or higher</span> to demonstrate competency and mark this lesson complete.
                        </p>
                      </div>
                      {(!guidedSubmitted || !independentSubmitted) && !completedLessonIds.includes(activeLesson.id) && (
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-3 py-1.5 rounded-xl">
                          Tip: Complete Steps 2 & 3 first for best results!
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {activeLesson.practiceQuestions.map((q, idx) => {
                        const userAns = userAnswers[q.id];
                        const isCorrect = isQuestionMatch(userAns, q.correctAnswer);

                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5"
                          >
                            <span className="font-extrabold text-red-600 block">
                              Assessment Question {idx + 1} of {activeLesson.practiceQuestions.length}
                            </span>
                            <p className="font-bold text-slate-900 dark:text-white leading-relaxed">{q.question}</p>

                            {q.type === 'multiple-choice' && q.options ? (
                              <div className="space-y-1.5">
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = userAns === oIdx;
                                  const isOptCorrect = q.correctAnswer === oIdx;

                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => {
                                        if (submittedQuiz) return;
                                        setUserAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                                      }}
                                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                        submittedQuiz
                                          ? isOptCorrect
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                                            : isSelected
                                            ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                                            : 'border-slate-200 dark:border-slate-800 opacity-60'
                                          : isSelected
                                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span className="inline-block w-5 font-bold">
                                        {String.fromCharCode(65 + oIdx)}.
                                      </span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  disabled={submittedQuiz}
                                  value={typeof userAns === 'string' ? userAns : ''}
                                  onChange={(e) =>
                                    setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                                  }
                                  placeholder="Type your answer..."
                                  className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                {submittedQuiz && (
                                  <div className="text-[11px] font-bold">
                                    {isCorrect ? (
                                      <span className="text-emerald-600">✓ Correct!</span>
                                    ) : (
                                      <span className="text-red-600">
                                        ✗ Correct Answer: {String(q.correctAnswer)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {submittedQuiz && (
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                                <span className="font-bold text-slate-800 dark:text-slate-200">Explanation: </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* H. Review & Reinforcement (Shown after submitting or always for summary) */}
                    {activeLesson.reviewAndReinforcement && (
                      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                            H. Review & Reinforcement Summary
                          </span>
                          <h4 className="font-black text-sm">Key Takeaways to Remember on Exam Day</h4>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-200">
                          {activeLesson.reviewAndReinforcement.keyTakeaways.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>

                        {submittedQuiz && (quizScore || 0) < activeLesson.requiredPassingScore && (
                          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-xs text-red-200 space-y-2">
                            <span className="font-extrabold text-red-300 block">
                              Targeted Remediation Advice (Score: {quizScore}% — {activeLesson.requiredPassingScore}% Required):
                            </span>
                            <p>{activeLesson.reviewAndReinforcement.remediationAdvice}</p>
                            <button
                              type="button"
                              onClick={() => handleStepChange(1)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px]"
                            >
                              Review Step 1 Concepts & Worked Examples →
                            </button>
                          </div>
                        )}

                        {activeLesson.reviewAndReinforcement.nextRecommendedLessonIds.length > 0 && (
                          <div className="pt-2 border-t border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Recommended Follow-Up Lessons in Pathway
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {activeLesson.reviewAndReinforcement.nextRecommendedLessonIds.map((nextId) => {
                                const rec = lessons.find((l) => l.id === nextId);
                                if (!rec) return null;
                                return (
                                  <button
                                    key={nextId}
                                    type="button"
                                    onClick={() => openLesson(rec)}
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                                  >
                                    <span>{rec.title}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Sticky Footer (Navigation across 4 Steps + Assessment Submission) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  {activeStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleStepChange((activeStep - 1) as 1 | 2 | 3 | 4)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Step</span>
                    </button>
                  ) : prevLesson ? (
                    <button
                      type="button"
                      onClick={() => openLesson(prevLesson)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Prev Lesson</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCloseAndSave}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Save & Back</span>
                    </button>
                  )}
                </div>

                {/* Middle Status */}
                <div className="flex items-center gap-2">
                  {activeStep === 4 ? (
                    submittedQuiz ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                          (quizScore || 0) >= activeLesson.requiredPassingScore
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                        }`}
                      >
                        {(quizScore || 0) >= activeLesson.requiredPassingScore ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Score: {quizScore}% • Lesson Mastered!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span>
                              Score: {quizScore}% • {activeLesson.requiredPassingScore}% Required
                            </span>
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {Object.keys(userAnswers).length} of {activeLesson.practiceQuestions.length} assessment questions answered
                      </span>
                    )
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Stage {activeStep} of 4 • Progress auto-saved
                    </span>
                  )}
                </div>

                {/* Right Primary Action */}
                <div className="flex items-center gap-2">
                  {activeStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => handleStepChange((activeStep + 1) as 1 | 2 | 3 | 4)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
                    >
                      <span>
                        {activeStep === 1
                          ? 'Next: Guided Practice (Step 2)'
                          : activeStep === 2
                          ? 'Next: Independent & Exam (Step 3)'
                          : 'Next: Mastery Assessment (Step 4)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      {submittedQuiz && (quizScore || 0) < activeLesson.requiredPassingScore && (
                        <button
                          type="button"
                          onClick={() => {
                            setSubmittedQuiz(false);
                            setUserAnswers({});
                          }}
                          className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry Assessment</span>
                        </button>
                      )}

                      {!submittedQuiz ? (
                        <button
                          type="button"
                          onClick={handleSubmitQuiz}
                          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
                        >
                          <span>Submit Mastery Assessment</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (quizScore || 0) >= activeLesson.requiredPassingScore ? (
                        nextLesson ? (
                          <button
                            type="button"
                            onClick={() => openLesson(nextLesson)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 flex items-center gap-2"
                          >
                            <span>
                              Next Lesson:{' '}
                              {nextLesson.title.length > 20
                                ? nextLesson.title.substring(0, 18) + '...'
                                : nextLesson.title}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleCloseAndSave}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                          >
                            <span>Complete Curriculum & Return</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
