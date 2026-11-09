import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Headphones,
  BookOpen,
  Feather,
  Mic,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateOverallBand } from '../data/mockExamData';
import { LISTENING_TESTS, calculateListeningBand } from '../data/listeningData';
import { READING_TESTS, calculateReadingBand, isAnswerMatch } from '../data/readingData';
import { WRITING_PROMPTS } from '../data/writingData';
import { SPEAKING_PROMPT_PACKS } from '../data/speakingData';
import { evaluateWritingSubmission } from '../services/writingEvaluator';
import { evaluateSpeakingTranscript } from '../services/speakingEvaluator';
import { MockExamSession, ExamType } from '../types/ielts';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { VisualChartRenderer } from './VisualChartRenderer';

interface MockExamSimulatorProps {
  userExamType: ExamType;
  onNavigateSkill: (skillId: string) => void;
  onMockComplete?: () => void;
}

type SimStage = 'overview' | 'listening' | 'reading' | 'writing' | 'speaking' | 'trf';

export const MockExamSimulator: React.FC<MockExamSimulatorProps> = ({
  userExamType,
  onNavigateSkill,
  onMockComplete,
}) => {
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(userExamType);
  const [deliveryFormat, setDeliveryFormat] = useState<'computer' | 'paper'>('computer');
  const [stage, setStage] = useState<SimStage>('overview');

  // Stage Timers (in seconds)
  const [stageSecondsLeft, setStageSecondsLeft] = useState<number>(30 * 60);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Stage 1: Listening State
  const listeningTest = LISTENING_TESTS[0];
  const [activeListeningSec, setActiveListeningSec] = useState<1 | 2 | 3 | 4>(1);
  const [listeningAnswers, setListeningAnswers] = useState<{ [qId: string]: string }>({});
  const [playedSections, setPlayedSections] = useState<Set<number>>(new Set());
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Stage 2: Reading State
  const readingTest = READING_TESTS.find((t) => t.examType === selectedExamType) || READING_TESTS[0];
  const [activeReadingIdx, setActiveReadingIdx] = useState<number>(0);
  const [readingAnswers, setReadingAnswers] = useState<{ [qId: string]: string }>({});

  // Stage 3: Writing State
  const task1Prompt =
    WRITING_PROMPTS.find((p) => p.taskType === 'task1' && p.examType === selectedExamType) || WRITING_PROMPTS[0];
  const task2Prompt = WRITING_PROMPTS.find((p) => p.taskType === 'task2') || WRITING_PROMPTS[2];
  const [activeWritingTab, setActiveWritingTab] = useState<'task1' | 'task2'>('task1');
  const [task1Text, setTask1Text] = useState<string>('');
  const [task2Text, setTask2Text] = useState<string>('');

  // Stage 4: Speaking State
  const speakingPack = SPEAKING_PROMPT_PACKS[0];
  const [speakingText, setSpeakingText] = useState<string>('');

  // Final Session Result & Past History
  const [completedSession, setCompletedSession] = useState<MockExamSession | null>(null);
  const [pastSessions, setPastSessions] = useState<MockExamSession[]>(() => storageService.getMockSessions());
  const [savedDraft, setSavedDraft] = useState<any>(() => storageService.getActiveMockDraft());

  useEffect(() => {
    setSelectedExamType(userExamType);
  }, [userExamType]);

  // Countdown timer for active stage
  useEffect(() => {
    if (!timerActive || stage === 'overview' || stage === 'trf') return;
    const interval = setInterval(() => {
      setStageSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAdvanceStage();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, stage]);

  // Autosave in-progress mock draft
  useEffect(() => {
    if (stage === 'overview' || stage === 'trf') return;
    const draft = {
      selectedExamType,
      deliveryFormat,
      stage,
      stageSecondsLeft,
      listeningAnswers,
      readingAnswers,
      task1Text,
      task2Text,
      speakingText,
      updatedAt: new Date().toISOString(),
    };
    storageService.saveActiveMockDraft(draft);
    setSavedDraft(draft);
  }, [stage, listeningAnswers, readingAnswers, task1Text, task2Text, speakingText]);

  const formatClock = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartFreshExam = () => {
    audioService.stop();
    setListeningAnswers({});
    setReadingAnswers({});
    setTask1Text('');
    setTask2Text('');
    setSpeakingText('');
    setPlayedSections(new Set());
    setActiveListeningSec(1);
    setActiveReadingIdx(0);
    setStage('listening');
    setStageSecondsLeft(deliveryFormat === 'computer' ? 32 * 60 : 40 * 60);
    setTimerActive(true);
    audioService.playChime('bell');
  };

  const handleResumeDraft = () => {
    if (!savedDraft) return;
    setSelectedExamType(savedDraft.selectedExamType || userExamType);
    setDeliveryFormat(savedDraft.deliveryFormat || 'computer');
    setListeningAnswers(savedDraft.listeningAnswers || {});
    setReadingAnswers(savedDraft.readingAnswers || {});
    setTask1Text(savedDraft.task1Text || '');
    setTask2Text(savedDraft.task2Text || '');
    setSpeakingText(savedDraft.speakingText || '');
    setStage(savedDraft.stage || 'listening');
    setStageSecondsLeft(savedDraft.stageSecondsLeft || 30 * 60);
    setTimerActive(true);
  };

  const handlePlayListeningAudio = () => {
    const currentSec =
      listeningTest.sections.find((s) => s.sectionNumber === activeListeningSec) || listeningTest.sections[0];
    if (isAudioPlaying) {
      audioService.stop();
      setIsAudioPlaying(false);
      return;
    }
    if (playedSections.has(currentSec.sectionNumber)) return;
    setPlayedSections((prev) => new Set(prev).add(currentSec.sectionNumber));
    setIsAudioPlaying(true);
    audioService.speak(currentSec.scriptText, {
      accent: currentSec.accent,
      rate: 1.0,
      onEnd: () => setIsAudioPlaying(false),
      onError: () => setIsAudioPlaying(false),
    });
  };

  const handleAdvanceStage = () => {
    audioService.stop();
    setIsAudioPlaying(false);

    if (stage === 'listening') {
      setStage('reading');
      setStageSecondsLeft(60 * 60);
      setTimerActive(true);
      audioService.playChime('bell');
    } else if (stage === 'reading') {
      setStage('writing');
      setStageSecondsLeft(60 * 60);
      setTimerActive(true);
      audioService.playChime('bell');
    } else if (stage === 'writing') {
      setStage('speaking');
      setStageSecondsLeft(14 * 60);
      setTimerActive(true);
      audioService.playChime('bell');
    } else if (stage === 'speaking') {
      handleFinalizeMock();
    }
  };

  const handleFinalizeMock = () => {
    audioService.stop();
    setTimerActive(false);

    // 1. Score Listening
    let lCorrect = 0;
    let lTotal = 0;
    listeningTest.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        lTotal++;
        if (isAnswerMatch(listeningAnswers[q.id] || '', q.correctAnswer)) {
          lCorrect++;
        }
      });
    });
    const lBand = calculateListeningBand(lCorrect, lTotal);
    const scaledL = Math.round((lCorrect / Math.max(lTotal, 1)) * 40);

    // 2. Score Reading
    let rCorrect = 0;
    let rTotal = 0;
    readingTest.passages.forEach((p) => {
      p.questions.forEach((q) => {
        rTotal++;
        if (isAnswerMatch(readingAnswers[q.id] || '', q.correctAnswer)) {
          rCorrect++;
        }
      });
    });
    const rBand = calculateReadingBand(rCorrect, rTotal, selectedExamType);
    const scaledR = Math.round((rCorrect / Math.max(rTotal, 1)) * 40);

    // 3. Score Writing (Task 1 counts 1/3, Task 2 counts 2/3 per official IELTS weighting)
    const eval1 = evaluateWritingSubmission(
      task1Text.trim().length >= 10 ? task1Text : 'No sufficient response provided for Task 1.',
      task1Prompt
    );
    const eval2 = evaluateWritingSubmission(
      task2Text.trim().length >= 10 ? task2Text : 'No sufficient response provided for Task 2.',
      task2Prompt
    );
    const rawWBand =
      task1Text.trim().length < 5 && task2Text.trim().length < 5
        ? 4.0
        : (eval1.estimatedOverallBand + eval2.estimatedOverallBand * 2) / 3;
    const wBand = Math.round(rawWBand * 2) / 2;

    // 4. Score Speaking
    const sEval = evaluateSpeakingTranscript(
      speakingText.trim().length >= 10
        ? speakingText
        : 'I would like to describe an important skill I learned recently and why it has been useful in my daily life.',
      110,
      2
    );
    const sBand = speakingText.trim().length < 5 ? 4.0 : sEval.estimatedOverallBand;

    // 5. Overall Band (Official .25 / .75 rounding)
    const overall = calculateOverallBand(lBand, rBand, wBand, sBand);

    const finalSession: MockExamSession = {
      id: 'mock-' + Date.now(),
      examType: selectedExamType,
      title: `IELTS ${selectedExamType === 'academic' ? 'Academic' : 'General Training'} Full Mock Exam`,
      status: 'completed',
      currentSkill: 'speaking',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      scores: {
        listening: { raw: scaledL, band: lBand },
        reading: { raw: scaledR, band: rBand },
        writing: { band: wBand, evaluationIds: [eval1.id, eval2.id] },
        speaking: { band: sBand, evaluationIds: [sEval.id] },
        overallBand: overall,
      },
    };

    storageService.saveMockSession(finalSession);
    storageService.saveActiveMockDraft(null);
    setSavedDraft(null);
    setCompletedSession(finalSession);
    setPastSessions(storageService.getMockSessions());
    setStage('trf');
    onMockComplete?.();

    audioService.playChime('bell');
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const getCefrLabel = (band: number) => {
    if (band >= 8.5) return { level: 'C2', desc: 'Mastery / Proficient User' };
    if (band >= 7.0) return { level: 'C1', desc: 'Effective Operational Proficiency' };
    if (band >= 5.5) return { level: 'B2', desc: 'Vantage / Independent User' };
    if (band >= 4.0) return { level: 'B1', desc: 'Threshold / Intermediate' };
    return { level: 'A2', desc: 'Waystage / Elementary Foundation' };
  };

  const t1Words = task1Text.trim().split(/\s+/).filter(Boolean).length;
  const t2Words = task2Text.trim().split(/\s+/).filter(Boolean).length;
  const spWords = speakingText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Full-Length 4-Skill Examination Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            IELTS Official Mock Battery ({selectedExamType === 'academic' ? 'Academic' : 'General Training'})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Complete all 4 modules under timed examination conditions with automatic draft saving, authentic band conversion, and official 0.25 / 0.75 overall rounding.
          </p>
        </div>

        {/* Active Stage Timer or Track Switch */}
        {stage === 'overview' ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setSelectedExamType('academic')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedExamType === 'academic' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setSelectedExamType('general')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedExamType === 'general' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                General Training
              </button>
            </div>
          </div>
        ) : stage !== 'trf' ? (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-red-500/40 flex items-center gap-2.5 font-mono text-sm font-black">
              <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              <span>{formatClock(stageSecondsLeft)}</span>
            </div>
            <button
              type="button"
              onClick={handleAdvanceStage}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
            >
              <span>{stage === 'speaking' ? 'Finish & Generate TRF' : 'Submit Section & Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      {/* STAGE 0: OVERVIEW & INSTRUCTIONS */}
      {stage === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Examination Format & Delivery Rules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total duration: ~2 hours 45 minutes across Listening, Reading, Writing, and Speaking.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Computer vs Paper Timing Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDeliveryFormat('computer')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      deliveryFormat === 'computer'
                        ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Computer-Delivered (2m Listening Review)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryFormat('paper')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      deliveryFormat === 'paper'
                        ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Paper-Based (10m Listening Transfer)
                  </button>
                </div>

                {savedDraft && (
                  <button
                    type="button"
                    onClick={handleResumeDraft}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Resume Saved Mock ({savedDraft.stage.toUpperCase()})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartFreshExam}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Begin Full Interactive Mock Exam</span>
                </button>
              </div>
            </div>

            {/* 4 Module Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  skill: 'listening',
                  name: '1. Listening Module',
                  duration: deliveryFormat === 'computer' ? '30m Audio + 2m Review' : '30m Audio + 10m Transfer',
                  desc: '4 sections, single-play audio enforcement, British/Australian/American accents.',
                  icon: Headphones,
                },
                {
                  skill: 'reading',
                  name: `2. ${selectedExamType === 'academic' ? 'Academic' : 'General Training'} Reading`,
                  duration: '60 Minutes (No extra transfer time)',
                  desc:
                    selectedExamType === 'academic'
                      ? '3 long academic passages with T/F/NG, headings, and completion.'
                      : '3 workplace & general sections with official GT band conversion.',
                  icon: BookOpen,
                },
                {
                  skill: 'writing',
                  name: `3. ${selectedExamType === 'academic' ? 'Academic' : 'General Training'} Writing`,
                  duration: '60 Minutes (20m Task 1 + 40m Task 2)',
                  desc:
                    selectedExamType === 'academic'
                      ? 'Task 1 Visual Data Report (150w) + Task 2 Discursive Essay (250w).'
                      : 'Task 1 Functional Letter (150w) + Task 2 Discursive Essay (250w).',
                  icon: Feather,
                },
                {
                  skill: 'speaking',
                  name: '4. Speaking Interview',
                  duration: '11–14 Minutes (Parts 1, 2 & 3)',
                  desc: 'Personal introduction, Part 2 Individual Long Turn Cue Card, and two-way discussion.',
                  icon: Mic,
                },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.skill}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-red-600 shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stage {idx + 1}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{m.name}</h4>
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">{m.duration}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateSkill(m.skill)}
                      className="w-full py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-red-500 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Practice Standalone</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Previous Mock Attempts Log */}
          {pastSessions.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Previous Mock Examination Attempts ({pastSessions.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pastSessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block">
                        {s.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        L: {s.scores.listening?.band.toFixed(1)} • R: {s.scores.reading?.band.toFixed(1)} • W:{' '}
                        {s.scores.writing?.band.toFixed(1)} • S: {s.scores.speaking?.band.toFixed(1)}
                      </span>
                    </div>
                    <span className="font-mono font-black text-red-600 text-base">
                      Band {(s.scores.overallBand || 0).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 1: INTERACTIVE LISTENING MODULE */}
      {stage === 'listening' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                Stage 1 of 4 • Single-Play Audio Enforced
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                IELTS Listening Examination ({listeningTest.title})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {listeningTest.sections.map((sec) => (
                <button
                  key={sec.sectionNumber}
                  type="button"
                  onClick={() => {
                    audioService.stop();
                    setIsAudioPlaying(false);
                    setActiveListeningSec(sec.sectionNumber);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    activeListeningSec === sec.sectionNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Section {sec.sectionNumber}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const currentSec =
              listeningTest.sections.find((s) => s.sectionNumber === activeListeningSec) || listeningTest.sections[0];
            const isLocked = playedSections.has(currentSec.sectionNumber) && !isAudioPlaying;

            return (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={handlePlayListeningAudio}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                        isLocked
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : isAudioPlaying
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-400 block">
                        {currentSec.accent} Accent • {isLocked ? 'Audio Played (1x Limit)' : 'Click Play to Start Audio'}
                      </span>
                      <h4 className="font-bold text-sm">{currentSec.contextTitle}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {Object.keys(listeningAnswers).length} answered
                  </span>
                </div>

                {currentSec.sectionNumber === 2 && (
                  <VisualChartRenderer
                    type="map"
                    data={{}}
                    caption="Greenfield Botanical Park: Official Visitor Orientation Map (Locations A–D)"
                  />
                )}

                <div className="space-y-4">
                  {currentSec.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                    >
                      <span className="text-[11px] font-extrabold text-blue-600 uppercase">
                        Question {idx + 1} • {q.type.replace('-', ' ')}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{q.prompt}</p>
                      {q.options && q.options.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setListeningAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                                listeningAnswers[q.id] === opt
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={listeningAnswers[q.id] || ''}
                          onChange={(e) => setListeningAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Type your answer..."
                          className="w-full max-w-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* STAGE 2: INTERACTIVE READING MODULE */}
      {stage === 'reading' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                Stage 2 of 4 • {selectedExamType === 'academic' ? 'Academic' : 'General Training'} Reading
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{readingTest.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              {readingTest.passages.map((p, idx) => (
                <button
                  key={p.passageNumber}
                  type="button"
                  onClick={() => setActiveReadingIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    activeReadingIdx === idx
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {selectedExamType === 'general' ? `Section ${p.passageNumber}` : `Passage ${p.passageNumber}`}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const currentPassage = readingTest.passages[activeReadingIdx] || readingTest.passages[0];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 max-h-[560px] overflow-y-auto space-y-3">
                  <h4 className="font-black text-base text-slate-900 dark:text-white">{currentPassage.title}</h4>
                  {currentPassage.paragraphs.map((para) => (
                    <div key={para.index} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed font-serif text-slate-800 dark:text-slate-200">
                      {para.label && (
                        <span className="shrink-0 w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-sans font-bold text-xs flex items-center justify-center">
                          {para.label}
                        </span>
                      )}
                      <p>{para.text}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 max-h-[560px] overflow-y-auto space-y-4 pr-1">
                  {currentPassage.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                    >
                      <span className="text-[11px] font-extrabold text-emerald-600 uppercase">
                        Question {idx + 1} • {q.type.replace(/-/g, ' ')}
                      </span>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{q.prompt}</p>
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setReadingAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className={`w-full text-left p-2 rounded-xl border text-xs transition-all ${
                                readingAnswers[q.id] === opt
                                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={readingAnswers[q.id] || ''}
                          onChange={(e) => setReadingAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Type exact word(s)..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* STAGE 3: INTERACTIVE WRITING MODULE */}
      {stage === 'writing' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">
                Stage 3 of 4 • Task 1 (1/3 Weight) & Task 2 (2/3 Weight)
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                IELTS {selectedExamType === 'academic' ? 'Academic' : 'General Training'} Writing Module
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveWritingTab('task1')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  activeWritingTab === 'task1'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                Task 1 ({t1Words}/150w)
              </button>
              <button
                type="button"
                onClick={() => setActiveWritingTab('task2')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  activeWritingTab === 'task2'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                Task 2 Essay ({t2Words}/250w)
              </button>
            </div>
          </div>

          {activeWritingTab === 'task1' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{task1Prompt.title}</h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line">
                  {task1Prompt.promptText}
                </div>
                {task1Prompt.visualData && (
                  <VisualChartRenderer
                    type={task1Prompt.visualData.type}
                    data={task1Prompt.visualData.dataPoints}
                    caption={task1Prompt.visualData.caption}
                  />
                )}
              </div>
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Task 1 Response (Suggested: 20 minutes)</span>
                  <span className={t1Words < 150 ? 'text-amber-600' : 'text-emerald-600'}>
                    {t1Words} words (Minimum 150)
                  </span>
                </div>
                <textarea
                  value={task1Text}
                  onChange={(e) => setTask1Text(e.target.value)}
                  rows={14}
                  placeholder="Write your Task 1 response here (at least 150 words)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{task2Prompt.title}</h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line">
                  {task2Prompt.promptText}
                </div>
              </div>
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Task 2 Essay Response (Suggested: 40 minutes)</span>
                  <span className={t2Words < 250 ? 'text-amber-600' : 'text-emerald-600'}>
                    {t2Words} words (Minimum 250)
                  </span>
                </div>
                <textarea
                  value={task2Text}
                  onChange={(e) => setTask2Text(e.target.value)}
                  rows={14}
                  placeholder="Write your Task 2 discursive essay here (at least 250 words)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: INTERACTIVE SPEAKING MODULE */}
      {stage === 'speaking' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">
              Stage 4 of 4 • Part 2 Long Turn & Part 3 Discussion
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              IELTS Speaking Examination ({speakingPack.title})
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-600 text-white">
                Candidate Cue Card
              </span>
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                {speakingPack.part2CueCard.topic}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {speakingPack.part2CueCard.bullets.map((b: string, i: number) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
              <div className="pt-3 border-t border-purple-200 dark:border-purple-800 text-xs space-y-1">
                <span className="font-bold text-purple-800 dark:text-purple-300 block">Part 3 Follow-Up Question:</span>
                <p className="text-slate-700 dark:text-slate-300">{speakingPack.part3Discussion.questions[0].question}</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Your Spoken Response Transcript</span>
                <span className="text-purple-600">{spWords} words</span>
              </div>
              <textarea
                value={speakingText}
                onChange={(e) => setSpeakingText(e.target.value)}
                rows={10}
                placeholder="Deliver or type your full Part 2 & Part 3 response here for 4-criteria evaluation..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleFinalizeMock}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Complete Examination & Generate Official Mock TRF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: SIMULATED TEST REPORT FORM (TRF) */}
      {stage === 'trf' && completedSession && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-600 shadow-2xl space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-base">
                IELTS
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                  Simulated Test Report Form (Practice Estimate)
                </h3>
                <span className="text-xs text-slate-500">
                  Track: IELTS {selectedExamType === 'academic' ? 'Academic' : 'General Training'} • Completed{' '}
                  {new Date(completedSession.completedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                OVERALL BAND SCORE
              </span>
              <span className="text-3xl font-black text-red-600 dark:text-red-400 font-mono">
                {(completedSession.scores.overallBand || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* 4 Individual Skill Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              {
                name: 'Listening',
                band: completedSession.scores.listening?.band || 0,
                raw: `Scaled ${completedSession.scores.listening?.raw || 0}/40`,
              },
              {
                name: 'Reading',
                band: completedSession.scores.reading?.band || 0,
                raw: `Scaled ${completedSession.scores.reading?.raw || 0}/40`,
              },
              {
                name: 'Writing',
                band: completedSession.scores.writing?.band || 0,
                raw: 'Task 1 + Task 2',
              },
              {
                name: 'Speaking',
                band: completedSession.scores.speaking?.band || 0,
                raw: '4-Criteria Eval',
              },
            ].map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <span className="text-[11px] font-bold text-slate-500 uppercase block">{s.name}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
                  {s.band.toFixed(1)}
                </span>
                <span className="text-[10px] font-medium text-slate-400">{s.raw}</span>
              </div>
            ))}
          </div>

          {/* Dynamic CEFR Equivalence */}
          {(() => {
            const cefr = getCefrLabel(completedSession.scores.overallBand || 0);
            return (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">
                    CEFR Equivalence: Level {cefr.level} ({cefr.desc})
                  </span>
                </div>
                <span className="text-[11px] font-semibold">
                  Saved to your Performance Analytics profile
                </span>
              </div>
            );
          })()}

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> This report is a simulated practice assessment calculated using official IELTS band conversion tables and heuristic AI rubric analysis. It is not an official IELTS Test Report Form issued by British Council, IDP, or Cambridge English.
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStage('overview')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Simulator Overview</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSkill('performance')}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              View Performance Analytics →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
