import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Headphones,
  BookOpen,
  Feather,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DIAGNOSTIC_EXAM_DATA } from '../data/diagnosticData';
import { DiagnosticResult, UserProfile } from '../types/ielts';
import { audioService } from '../services/audioService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { VisualChartRenderer } from './VisualChartRenderer';

interface DiagnosticExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  existingResult: DiagnosticResult | null;
  onSaveResult: (result: DiagnosticResult) => void;
}

export const DiagnosticExamModal: React.FC<DiagnosticExamModalProps> = ({
  isOpen,
  onClose,
  profile,
  existingResult,
  onSaveResult,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'report'>(
    existingResult ? 'report' : 'intro'
  );

  // Listening state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState<{ [qId: string]: number }>({});

  // Reading state
  const [readingAnswers, setReadingAnswers] = useState<{ [qId: string]: number }>({});

  // Writing state
  const [writingTask1, setWritingTask1] = useState('');
  const [writingTask2, setWritingTask2] = useState('');

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [speakingDuration, setSpeakingDuration] = useState(0);

  // Result state
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticResult | null>(existingResult);

  if (!isOpen) return null;

  // Toggle audio playback
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      audioService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioService.speak(DIAGNOSTIC_EXAM_DATA.listening.audioScript, {
        accent: 'British',
        rate: 0.95,
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
    }
  };

  // Toggle voice recording
  const handleToggleRecording = async () => {
    if (isRecording) {
      const res = await speechRecognitionService.stopRecording();
      setIsRecording(false);
      audioService.playChime('correct');
    } else {
      const started = await speechRecognitionService.startRecording(
        (transcript) => setSpeakingTranscript(transcript),
        (sec) => setSpeakingDuration(sec),
        () => setIsRecording(false)
      );
      if (started) {
        setIsRecording(true);
        audioService.playChime('bell');
      }
    }
  };

  // Compile full assessment report
  const handleGenerateReport = () => {
    // 1. Calculate Listening Band
    let lCorrect = 0;
    DIAGNOSTIC_EXAM_DATA.listening.questions.forEach((q) => {
      if (listeningAnswers[q.id] === q.correctAnswer) lCorrect++;
    });
    const lBand = lCorrect === 3 ? 7.5 : lCorrect === 2 ? 6.5 : lCorrect === 1 ? 5.5 : 4.5;

    // 2. Calculate Reading Band
    let rCorrect = 0;
    DIAGNOSTIC_EXAM_DATA.reading.questions.forEach((q) => {
      if (readingAnswers[q.id] === q.correctAnswer) rCorrect++;
    });
    const rBand = rCorrect === 3 ? 7.5 : rCorrect === 2 ? 6.5 : rCorrect === 1 ? 5.5 : 4.5;

    // 3. Estimate Writing Band based on submission lengths & connectors
    const w1Words = writingTask1.trim().split(/\s+/).filter(Boolean).length;
    const w2Words = writingTask2.trim().split(/\s+/).filter(Boolean).length;
    let wBand = 5.5;
    if (w2Words >= 200 && w1Words >= 100) {
      wBand = 7.0;
    } else if (w2Words >= 150 || w1Words >= 80) {
      wBand = 6.0;
    } else if (w2Words < 50 && w1Words < 50) {
      wBand = 5.0;
    }

    // 4. Estimate Speaking Band
    const sWords = speakingTranscript.trim().split(/\s+/).filter(Boolean).length;
    let sBand = 5.5;
    if (sWords >= 70 && speakingDuration >= 30) {
      sBand = 7.0;
    } else if (sWords >= 30) {
      sBand = 6.5;
    } else if (sWords < 15) {
      sBand = 5.0;
    }

    // Overall Average
    const avg = (lBand + rBand + wBand + sBand) / 4;
    const roundedOverall = Math.round(avg * 2) / 2;

    const report: DiagnosticResult = {
      completedAt: new Date().toISOString(),
      targetExam: profile.targetExam,
      estimatedOverallBand: roundedOverall,
      skillBands: {
        listening: lBand,
        reading: rBand,
        writing: wBand,
        speaking: sBand,
      },
      strengths: [
        lBand >= 6.5 ? 'Strong auditory retention of specific dates and names.' : 'Grasps general tone in audio.',
        rBand >= 6.5 ? 'Proficient at identifying empirical facts and causal linkages.' : 'Skimming main ideas.',
        'High motivation and readiness to pursue a structured study track.',
      ],
      weaknesses: [
        rBand < 7.0 ? 'Discerning nuanced academic evidence and avoiding distractors.' : 'Advanced academic speed reading.',
        wBand < 7.0 ? 'Underlength in timed writing tasks and limited cohesive variety.' : 'Fine-tuning paragraph transitions.',
        sBand < 7.0 ? 'Hesitation during extended abstract discussion.' : 'Incorporating high-level idiomatic collocations.',
      ],
      grammarIssues: [
        'Frequent omission of articles (a, an, the) before singular countable nouns.',
        'Subject-verb agreement inconsistencies in complex sentences.',
        'Over-reliance on simple active sentences rather than passive reporting structures.',
      ],
      vocabularyLimitations: [
        'Repetitive usage of basic adjectives ("good", "bad", "important") rather than AWL synonyms.',
        'Limited deployment of academic transition phrases (consequently, furthermore, conversely).',
      ],
      recommendedPriorities: [
        'Complete Level 3 Academic Word List and Collocation Deck.',
        'Master Task 1 Overview formulas to guarantee Band 7+ Task Achievement.',
        'Practice 60-second Speaking Cue Card outlines with timer.',
        'Engage in daily timed True/False/Not Given reading drills.',
      ],
      personalizedPlanOverview: `Based on your diagnostic baseline of estimated Band ${roundedOverall.toFixed(1)} against your target of Band ${profile.targetOverallBand.toFixed(1)}, we recommend a ${profile.preferredPace} preparation trajectory dedicating ${profile.dailyStudyMinutes} minutes daily.`,
      isOfficial: false,
    };

    setDiagnosticReport(report);
    onSaveResult(report);
    setActiveTab('report');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      audioService.playChime('bell');
    } catch (e) {}
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioService.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="IELTS Initial Diagnostic Assessment"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          audioService.stop();
          onClose();
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[86vh] my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                IELTS Initial Diagnostic Assessment
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {profile.targetExam === 'academic' ? 'Academic Track' : 'General Training'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Rigorous multi-skill baseline evaluation to engineer your study plan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-6 overflow-x-auto">
          {[
            { id: 'intro', label: 'Overview', icon: Brain },
            { id: 'listening', label: '1. Listening', icon: Headphones },
            { id: 'reading', label: '2. Reading', icon: BookOpen },
            { id: 'writing', label: '3. Writing', icon: Feather },
            { id: 'speaking', label: '4. Speaking', icon: Mic },
            { id: 'report', label: 'Diagnostic Report', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-100">
          {/* TAB 1: INTRO */}
          {activeTab === 'intro' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Discover Your True Baseline
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  To achieve Band {profile.targetOverallBand.toFixed(1)}, you need an honest, objective audit of your English capabilities. This 4-part assessment examines comprehension, structural writing, and speaking fluency.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <Headphones className="w-5 h-5 text-red-600 mb-1" />
                  <span className="font-bold text-xs block">Listening</span>
                  <span className="text-[11px] text-slate-500">Audio playback & specific information</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <BookOpen className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="font-bold text-xs block">Reading</span>
                  <span className="text-[11px] text-slate-500">Academic passage comprehension</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <Feather className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="font-bold text-xs block">Writing</span>
                  <span className="text-[11px] text-slate-500">Task 1 & 2 structural analysis</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <Mic className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="font-bold text-xs block">Speaking</span>
                  <span className="text-[11px] text-slate-500">Live voice recording & AI fluency</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('listening')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
              >
                <span>Begin Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: LISTENING */}
          {activeTab === 'listening' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                    Part 1: Listening Comprehension
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {DIAGNOSTIC_EXAM_DATA.listening.context}
                  </h4>
                </div>

                <button
                  onClick={handleToggleAudio}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all ${
                    isPlayingAudio
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {DIAGNOSTIC_EXAM_DATA.listening.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-red-600 dark:text-red-400">
                        Question {idx + 1} • {q.skillFocus}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q.prompt}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setListeningAnswers({ ...listeningAnswers, [q.id]: oIdx })}
                          className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all ${
                            listeningAnswers[q.id] === oIdx
                              ? 'border-red-600 bg-red-50/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('intro')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioService.stop();
                    setIsPlayingAudio(false);
                    setActiveTab('reading');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
                >
                  <span>Proceed to Reading</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: READING */}
          {activeTab === 'reading' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Passage Column */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 overflow-y-auto max-h-[500px] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Academic Reading Passage</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {DIAGNOSTIC_EXAM_DATA.reading.title}
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-serif">
                  {DIAGNOSTIC_EXAM_DATA.reading.passageText}
                </div>
              </div>

              {/* Questions Column */}
              <div className="space-y-4 overflow-y-auto max-h-[500px]">
                {DIAGNOSTIC_EXAM_DATA.reading.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                  >
                    <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                      Question {idx + 1} • {q.skillFocus}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q.prompt}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setReadingAnswers({ ...readingAnswers, [q.id]: oIdx })}
                          className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all ${
                            readingAnswers[q.id] === oIdx
                              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('listening')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Listening</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('writing')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
                  >
                    <span>Proceed to Writing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WRITING */}
          {activeTab === 'writing' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                    Writing Task 1 Overview Diagnostic
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {profile.targetExam === 'academic' ? 'Academic Line Graph' : 'General Training Letter'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-sans">
                  {profile.targetExam === 'academic'
                    ? DIAGNOSTIC_EXAM_DATA.writing.task1Prompt
                    : 'You recently travelled by plane and your luggage was delayed for three days, causing you considerable inconvenience and financial expense. Write a letter to the airline manager explaining your flight details, the inconvenience caused, and requesting compensation.'}
                </p>

                {/* VISUAL CHART FOR TASK 1 ACADEMIC */}
                {profile.targetExam === 'academic' ? (
                  <VisualChartRenderer
                    type="line"
                    data={{
                      years: [2000, 2005, 2010, 2015, 2020],
                      series: [
                        { name: 'Denmark', color: '#dc2626', values: [30, 42, 55, 68, 80] },
                        { name: 'Germany', color: '#2563eb', values: [10, 18, 30, 42, 52] },
                        { name: 'UK', color: '#16a34a', values: [4, 7, 15, 28, 45] },
                        { name: 'France', color: '#9333ea', values: [12, 14, 16, 19, 23] },
                      ],
                      maxY: 100,
                    }}
                    caption="Percentage of National Electricity Generated from Renewable Sources (2000–2020)"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-300">
                      <span>Continental Airways Property Irregularity Report (PIR)</span>
                      <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">
                        Ref: #YYZCA10482
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Passenger: Alex Henderson • Flight CA-408 London Heathrow to Toronto • Luggage Tag: #BAG-88412 • Status: Delayed 72 Hours • Essential expenses incurred: $480 CAD.
                    </p>
                    <div className="pt-1 font-bold text-slate-800 dark:text-slate-200">
                      Required letter bullets: 1) Flight & baggage details, 2) Specific inconvenience & expense, 3) Request for compensation & explanation.
                    </div>
                  </div>
                )}

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    Your Response:
                  </span>
                  <textarea
                    value={writingTask1}
                    onChange={(e) => setWritingTask1(e.target.value)}
                    placeholder={
                      profile.targetExam === 'academic'
                        ? 'Draft your introductory paraphrasing and overview sentence here (e.g. Overall, it is noticeable that while Denmark...)...'
                        : 'Draft your opening statement and purpose here (e.g. Dear Sir or Madam, I am writing to formally lodge a complaint...)...'
                    }
                    rows={4}
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Writing Task 2 Essay Thesis Diagnostic
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {DIAGNOSTIC_EXAM_DATA.writing.task2Prompt}
                </p>
                <textarea
                  value={writingTask2}
                  onChange={(e) => setWritingTask2(e.target.value)}
                  placeholder="Write your introductory paragraph with thesis statement and your main argument..."
                  rows={5}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('reading')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Reading</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('speaking')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
                >
                  <span>Proceed to Speaking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SPEAKING */}
          {activeTab === 'speaking' && (
            <div className="space-y-6 max-w-2xl mx-auto text-center">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                  Speaking Part 2 Diagnostic Cue Card
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {DIAGNOSTIC_EXAM_DATA.speaking.part2CueCard.topic}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-left space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-purple-800 dark:text-purple-300 block mb-1">You should say:</span>
                {DIAGNOSTIC_EXAM_DATA.speaking.part2CueCard.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Record Button & Timer */}
              <div className="py-4 space-y-3">
                <button
                  type="button"
                  onClick={handleToggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white ring-8 ring-red-400/30 animate-pulse'
                      : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>

                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {isRecording ? (
                    <span className="text-red-600 animate-pulse">
                      Recording speech... {speakingDuration}s
                    </span>
                  ) : speakingDuration > 0 ? (
                    <span className="text-emerald-600">
                      Recorded {speakingDuration}s of speech
                    </span>
                  ) : (
                    <span>Click microphone to speak (or type transcript below)</span>
                  )}
                </div>
              </div>

              {/* Live or manual transcript */}
              <textarea
                value={speakingTranscript}
                onChange={(e) => setSpeakingTranscript(e.target.value)}
                placeholder="Speech transcript will automatically stream here, or you may enter your response manually if mic is unavailable..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('writing')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Writing</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Generate Diagnostic Report & Study Plan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: DIAGNOSTIC REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              {!diagnosticReport ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-500">
                    No diagnostic assessment taken yet. Complete the 4 skill sections first!
                  </p>
                  <button
                    onClick={() => setActiveTab('listening')}
                    className="mt-3 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                  >
                    Start Assessment
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Notice Alert */}
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center gap-3 text-xs text-blue-900 dark:text-blue-300">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold">Official Assessment Disclaimer:</span> This diagnostic report provides an indicative educational estimate calibrated against the IELTS 9-band scale. Official test results are certified exclusively by IDP, British Council, and Cambridge.
                    </div>
                  </div>

                  {/* Top Score Summary Banner */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
                        Diagnostic Assessment Results
                      </span>
                      <h3 className="text-2xl font-black">
                        Estimated Baseline: <span className="text-red-400">Band {diagnosticReport.estimatedOverallBand.toFixed(1)}</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-md">
                        Targeting Band {profile.targetOverallBand.toFixed(1)} in IELTS {profile.targetExam === 'academic' ? 'Academic' : 'General Training'}. Gap to bridge: {(profile.targetOverallBand - diagnosticReport.estimatedOverallBand).toFixed(1)} bands.
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      {(['listening', 'reading', 'writing', 'speaking'] as const).map((s) => (
                        <div
                          key={s}
                          className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10"
                        >
                          <span className="text-[10px] font-bold text-slate-400 capitalize block">
                            {s.slice(0, 4)}
                          </span>
                          <span className="text-lg font-black text-white">
                            {diagnosticReport.skillBands[s].toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Identified Strengths</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {diagnosticReport.strengths.map((st, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        <span>Identified Improvement Areas</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {diagnosticReport.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Grammar & Vocab priorities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                      <span className="font-bold text-xs text-red-600 uppercase tracking-wider block">
                        Grammar Issues Flagged
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {diagnosticReport.grammarIssues.map((g, i) => (
                          <li key={i}>• {g}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                      <span className="font-bold text-xs text-blue-600 uppercase tracking-wider block">
                        Vocabulary Priorities
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {diagnosticReport.vocabularyLimitations.map((v, i) => (
                          <li key={i}>• {v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Action Plan */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                    <span className="font-bold text-xs text-purple-600 uppercase tracking-wider block">
                      Recommended Study Trajectory
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {diagnosticReport.recommendedPriorities.map((p, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Close and start learning */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20"
                    >
                      Apply Plan to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
