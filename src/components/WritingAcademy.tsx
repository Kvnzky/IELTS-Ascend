import React, { useState, useEffect } from 'react';
import {
  Feather,
  BarChart3,
  Mail,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Play,
  Pause,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WRITING_PROMPTS } from '../data/writingData';
import { WritingPrompt, WritingEvaluation, ExamType } from '../types/ielts';
import { evaluateWritingSubmission } from '../services/writingEvaluator';
import { audioService } from '../services/audioService';
import { VisualChartRenderer } from './VisualChartRenderer';

interface WritingAcademyProps {
  userExamType: ExamType;
  onSaveEvaluation: (evaluation: WritingEvaluation) => void;
}

export const WritingAcademy: React.FC<WritingAcademyProps> = ({
  userExamType,
  onSaveEvaluation,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<ExamType>(userExamType);
  const [selectedTaskType, setSelectedTaskType] = useState<'task1' | 'task2'>('task1');

  useEffect(() => {
    setSelectedTrack(userExamType);
  }, [userExamType]);

  // Strictly separate Academic vs General Training for Task 1; Task 2 essays apply to both tracks
  const filteredPrompts = WRITING_PROMPTS.filter((p) => {
    if (selectedTaskType === 'task1') {
      return p.taskType === 'task1' && p.examType === selectedTrack;
    }
    return p.taskType === 'task2';
  });

  const [activePrompt, setActivePrompt] = useState<WritingPrompt>(filteredPrompts[0] || WRITING_PROMPTS[0]);
  const [essayText, setEssayText] = useState<string>(() => {
    const first = filteredPrompts[0] || WRITING_PROMPTS[0];
    return localStorage.getItem(`ielts_writing_draft_${first.id}`) || '';
  });
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Exam countdown timer (20m for Task 1, 40m for Task 2)
  const [secondsLeft, setSecondsLeft] = useState<number>(activePrompt.suggestedDurationMinutes * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Model answers modal
  const [showModelAnswers, setShowModelAnswers] = useState<boolean>(false);
  const [selectedBandAnswer, setSelectedBandAnswer] = useState<number>(9);

  // Sync activePrompt when track or taskType changes
  useEffect(() => {
    const valid = WRITING_PROMPTS.filter((p) =>
      selectedTaskType === 'task1'
        ? p.taskType === 'task1' && p.examType === selectedTrack
        : p.taskType === 'task2'
    );
    if (valid.length > 0 && !valid.some((p) => p.id === activePrompt.id)) {
      handlePromptChange(valid[0]);
    }
  }, [selectedTrack, selectedTaskType]);

  // Autosave draft text
  useEffect(() => {
    localStorage.setItem(`ielts_writing_draft_${activePrompt.id}`, essayText);
  }, [essayText, activePrompt.id]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Word count & validation
  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const isUnderlength = wordCount < activePrompt.minWordCount;

  const handlePromptChange = (prompt: WritingPrompt) => {
    setActivePrompt(prompt);
    const savedDraft = localStorage.getItem(`ielts_writing_draft_${prompt.id}`) || '';
    setEssayText(savedDraft);
    setEvaluationResult(null);
    setShowModelAnswers(false);
    setTimerRunning(false);
    setSecondsLeft(prompt.suggestedDurationMinutes * 60);
    if (prompt.modelAnswers.length > 0) {
      setSelectedBandAnswer(prompt.modelAnswers[prompt.modelAnswers.length - 1].band);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEvaluate = () => {
    if (wordCount < 20) {
      setErrorMsg('Please write at least 20 words so our IELTS engine can analyze your syntactic and lexical patterns.');
      return;
    }
    setErrorMsg(null);

    setIsEvaluating(true);
    setTimeout(() => {
      const evaluation = evaluateWritingSubmission(essayText, activePrompt);
      setEvaluationResult(evaluation);
      setIsEvaluating(false);
      onSaveEvaluation(evaluation);

      audioService.playChime('bell');
      if (evaluation.estimatedOverallBand >= 7.0) {
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Feather className="w-4 h-4" />
            <span>IELTS Writing Studio & AI Evaluator</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Task 1 & Task 2 Academic Evaluation Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time assessment calibrated against official IELTS band descriptors for Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range.
          </p>
        </div>

        {/* Track & Task Type Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Exam Track Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTrack('academic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTrack === 'academic'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setSelectedTrack('general')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTrack === 'general'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              General Training
            </button>
          </div>

          {/* Task Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTaskType('task1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTaskType === 'task1'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {selectedTrack === 'academic' ? 'Task 1 Visual Report (150w)' : 'Task 1 Letter (150w)'}
            </button>
            <button
              onClick={() => setSelectedTaskType('task2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTaskType === 'task2'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Task 2 Essay (250w)
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filteredPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handlePromptChange(prompt)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition-all ${
              activePrompt.id === prompt.id
                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <span className="capitalize mr-1.5 opacity-60">[{prompt.subType.replace('-', ' ')}]</span>
            {prompt.title}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt, Visual Data or Letter Context */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                Official Examination Prompt
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {activePrompt.suggestedDurationMinutes} mins suggested
              </span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {activePrompt.title}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-line">
              {activePrompt.promptText}
            </div>

            {/* Dynamic Visual Data Renderer for Academic Task 1 (Line, Bar, Pie, Process) */}
            {activePrompt.visualData && (
              <VisualChartRenderer
                type={activePrompt.visualData.type}
                data={activePrompt.visualData.dataPoints}
                caption={activePrompt.visualData.caption}
              />
            )}

            {/* Letter checklist */}
            {activePrompt.letterContext && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                <span className="font-bold text-blue-900 dark:text-blue-300 block">
                  Mandatory Requirements to Satisfy:
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {activePrompt.letterContext.requiredBulletPoints.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model Answers Shortcut Button */}
            <button
              type="button"
              onClick={() => setShowModelAnswers(!showModelAnswers)}
              className="w-full py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showModelAnswers ? 'Hide Model Sample Answers' : 'Inspect Band 7 & Band 9 Model Answers'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Writing Editor & Evaluation Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  Your Writing Submission
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Draft Autosaved
                </span>
              </div>

              {/* Exam Timer & Word Counter */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className={secondsLeft < 180 ? 'text-red-600 animate-pulse' : 'text-slate-800 dark:text-slate-200'}>
                    {formatTimer(secondsLeft)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600"
                    title={timerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(activePrompt.suggestedDurationMinutes * 60);
                    }}
                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl border ${
                    isUnderlength
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200'
                  }`}
                >
                  {wordCount} words (Min {activePrompt.minWordCount})
                </span>
              </div>
            </div>

            {/* Warning if underlength */}
            {isUnderlength && wordCount > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Under minimum word count by {activePrompt.minWordCount - wordCount} words. In real IELTS, this incurs an automatic penalty in Task Achievement.
                </span>
              </div>
            )}

            {/* Main Textarea */}
            <textarea
              value={essayText}
              onChange={(e) => {
                setEssayText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Type your response here. Structure in clear paragraphs (Introduction, Overview/Body 1, Body 2, Conclusion)..."
              rows={14}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 selection:bg-amber-200"
            />

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Evaluation Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEssayText('')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Clear Text
              </button>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleEvaluate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'Analyzing Rubrics...' : 'Evaluate with AI Evaluator'}</span>
              </button>
            </div>
          </div>

          {/* Model Answers Drawer */}
          {showModelAnswers && (
            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-sm text-amber-900 dark:text-amber-200">
                    Official Model Answers for Comparison
                  </h3>
                </div>

                {/* Band toggle */}
                <div className="flex items-center gap-1">
                  {activePrompt.modelAnswers.map((m) => (
                    <button
                      key={m.band}
                      onClick={() => setSelectedBandAnswer(m.band)}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                        selectedBandAnswer === m.band
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      Band {m.band}.0 Model
                    </button>
                  ))}
                </div>
              </div>

              {activePrompt.modelAnswers
                .filter((m) => m.band === selectedBandAnswer)
                .map((m) => (
                  <div key={m.band} className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 font-serif leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line max-h-72 overflow-y-auto">
                      {m.essay}
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                      <span className="font-bold">Examiner Commentary: </span>
                      {m.examinerComment}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* AI Evaluator Detailed Results */}
          {evaluationResult && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    IELTS 4-Criteria Assessment Report (Estimated)
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-900 font-black text-xs">
                  Estimated Overall: Band {evaluationResult.estimatedOverallBand.toFixed(1)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200">Assessment Transparency Notice:</strong> This report provides an automated heuristic estimate calibrated against public IELTS Writing Band Descriptors (TA/TR, CC, LR, GRA). It is designed for formative practice and is not an official score issued by a certified Cambridge/IDP/British Council IELTS Examiner.
              </div>

              {/* 4 Official Criteria Score Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    title: activePrompt.taskType === 'task1' ? 'Task Achievement' : 'Task Response',
                    score: evaluationResult.scores.taskAchievementOrResponse,
                    feedback: evaluationResult.detailedFeedback.taskFeedback,
                  },
                  {
                    title: 'Coherence & Cohesion',
                    score: evaluationResult.scores.coherenceAndCohesion,
                    feedback: evaluationResult.detailedFeedback.coherenceFeedback,
                  },
                  {
                    title: 'Lexical Resource',
                    score: evaluationResult.scores.lexicalResource,
                    feedback: evaluationResult.detailedFeedback.lexicalFeedback,
                  },
                  {
                    title: 'Grammar Accuracy',
                    score: evaluationResult.scores.grammaticalRangeAndAccuracy,
                    feedback: evaluationResult.detailedFeedback.grammarFeedback,
                  },
                ].map((crit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {crit.title}
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white block font-mono">
                      Band {crit.score.toFixed(1)}
                    </span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-3">
                      {crit.feedback}
                    </p>
                  </div>
                ))}
              </div>

              {/* Detected Errors & Vocabulary Enhancements */}
              {evaluationResult.detectedErrors.length > 0 && (
                <div className="space-y-3">
                  <span className="font-bold text-xs text-red-600 uppercase tracking-wider block">
                    Detected Lexical & Grammatical Issues
                  </span>
                  <div className="space-y-2">
                    {evaluationResult.detectedErrors.map((err, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-xs flex items-start gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 flex-1">
                          <span className="font-bold text-red-700 dark:text-red-400">
                            Found: "{err.snippet}" → Suggestion: {err.suggestion}
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">{err.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved Sentence Comparison */}
              {evaluationResult.improvedSentences.length > 0 && (
                <div className="space-y-3">
                  <span className="font-bold text-xs text-blue-600 uppercase tracking-wider block">
                    Band 8+ Sentence Rewriting Transformation
                  </span>
                  {evaluationResult.improvedSentences.map((imp, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2"
                    >
                      <div className="text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Your draft: </span>
                        "{imp.original}"
                      </div>
                      <div className="text-blue-900 dark:text-blue-200 font-semibold">
                        <span className="font-bold text-blue-700 dark:text-blue-400">Academic Band 8+ version: </span>
                        "{imp.enhanced}"
                      </div>
                      <p className="text-[10px] text-slate-500 italic pt-1">
                        Why this scores higher: {imp.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
