import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  FileText,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LISTENING_TESTS, calculateListeningBand } from '../data/listeningData';
import { isAnswerMatch } from '../data/readingData';
import { ListeningTest, ListeningQuestion } from '../types/ielts';
import { audioService } from '../services/audioService';
import { VisualChartRenderer } from './VisualChartRenderer';

interface ListeningAcademyProps {
  onScoreSave?: (rawScore: number, estimatedBand: number) => void;
}

export const ListeningAcademy: React.FC<ListeningAcademyProps> = ({ onScoreSave }) => {
  const [selectedTest] = useState<ListeningTest>(LISTENING_TESTS[0]);
  const [activeSectionNum, setActiveSectionNum] = useState<1 | 2 | 3 | 4>(1);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [examMode, setExamMode] = useState<boolean>(false);
  const [playedSections, setPlayedSections] = useState<Set<number>>(new Set());

  // Answers state (with localStorage autosave)
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem(`ielts_listening_draft_${LISTENING_TESTS[0].id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; total: number; band: number } | null>(null);
  const [showTranscripts, setShowTranscripts] = useState<boolean>(false);

  const currentSection = selectedTest.sections.find((s) => s.sectionNumber === activeSectionNum) || selectedTest.sections[0];
  const isSectionLockedInExam = examMode && playedSections.has(currentSection.sectionNumber) && !isPlaying;

  // Autosave Listening answers
  useEffect(() => {
    if (!isSubmitted) {
      try {
        localStorage.setItem(`ielts_listening_draft_${selectedTest.id}`, JSON.stringify(userAnswers));
      } catch {}
    }
  }, [userAnswers, selectedTest.id, isSubmitted]);

  // Stop audio on unmount or section change
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isSectionLockedInExam) return;

    if (isPlaying) {
      if (examMode) return; // Cannot pause/replay in strict exam mode
      audioService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (examMode) {
        setPlayedSections((prev) => new Set(prev).add(currentSection.sectionNumber));
      }
      audioService.speak(currentSection.scriptText, {
        accent: currentSection.accent,
        rate: examMode ? 1.0 : playbackSpeed,
        volume,
        onEnd: () => {
          setIsPlaying(false);
          audioService.playChime('tick');
        },
        onError: () => setIsPlaying(false),
      });
    }
  };

  const handleSpeedChange = (speed: 0.75 | 1.0 | 1.25) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
    }
  };

  const handleAnswerChange = (qId: string, val: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmitTest = () => {
    audioService.stop();
    setIsPlaying(false);

    let correct = 0;
    let total = 0;

    selectedTest.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        total++;
        const userAns = userAnswers[q.id] || '';
        if (isAnswerMatch(userAns, q.correctAnswer)) {
          correct++;
        }
      });
    });

    const band = calculateListeningBand(correct, total);
    setScoreResult({ raw: correct, total, band });
    setIsSubmitted(true);
    onScoreSave?.(correct, band);

    if (band >= 7.0) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        audioService.playChime('bell');
      } catch (e) {}
    } else {
      audioService.playChime('correct');
    }
  };

  const handleReset = () => {
    audioService.stop();
    setIsPlaying(false);
    setUserAnswers({});
    setPlayedSections(new Set());
    setIsSubmitted(false);
    setScoreResult(null);
    setShowTranscripts(false);
    try {
      localStorage.removeItem(`ielts_listening_draft_${selectedTest.id}`);
    } catch {}
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Headphones className="w-4 h-4" />
            <span>IELTS Listening Academy</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {selectedTest.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {selectedTest.description}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setExamMode(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !examMode ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => setExamMode(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              examMode ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Strict Exam Mode
          </button>
        </div>
      </div>

      {/* Audio Controller Console */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSectionLockedInExam}
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform shadow-md ${
              isSectionLockedInExam
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : isPlaying
                ? 'bg-amber-500 text-slate-950 animate-pulse hover:scale-105'
                : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
            }`}
            title={
              isSectionLockedInExam
                ? 'Single play completed in Strict Exam Mode'
                : isPlaying
                ? 'Pause Audio'
                : 'Play Section Audio'
            }
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Audio Console • {currentSection.accent} Accent
            </span>
            <h4 className="font-bold text-sm text-white">
              {currentSection.contextTitle}
            </h4>
            <span className="text-[11px] text-slate-400">
              Speakers: {currentSection.speakers.join(', ')}
            </span>
          </div>
        </div>

        {/* Volume & Speed Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          {/* Volume Slider */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Audio Volume"
              className="w-16 accent-blue-500 cursor-pointer"
            />
          </div>

          <span className="text-slate-400 text-[11px]">Speed:</span>
          {[0.75, 1.0, 1.25].map((s) => (
            <button
              key={s}
              type="button"
              disabled={examMode}
              onClick={() => handleSpeedChange(s as any)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                playbackSpeed === s
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              } ${examMode ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {s}x
            </button>
          ))}

          {examMode && (
            <span className="ml-1 text-[10px] text-red-300 font-semibold bg-red-950/60 border border-red-800 px-2 py-0.5 rounded-md">
              {isSectionLockedInExam ? 'Section Played (Locked)' : 'Single play enforced'}
            </span>
          )}
        </div>
      </div>

      {/* Section Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {selectedTest.sections.map((sec) => (
          <button
            key={sec.sectionNumber}
            type="button"
            onClick={() => {
              if (isPlaying) audioService.stop();
              setIsPlaying(false);
              setActiveSectionNum(sec.sectionNumber);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeSectionNum === sec.sectionNumber
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">
              Section {sec.sectionNumber}
            </span>
            <span className="text-xs font-bold line-clamp-1 text-slate-900 dark:text-white">
              {sec.contextTitle.split(':')[1] || sec.contextTitle}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              {sec.questions.length} questions • {sec.accent}
            </span>
          </button>
        ))}
      </div>

      {/* Questions Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {currentSection.contextTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listen attentively. Write the correct word, number, or option.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {Object.keys(userAnswers).length} answered
          </span>
        </div>

        {/* Section 2 Map Labelling Diagram */}
        {currentSection.sectionNumber === 2 && (
          <div className="space-y-2">
            <VisualChartRenderer
              type="map"
              data={{}}
              caption="Greenfield Botanical Park: Official Visitor Orientation Map (Use to label Locations A–D)"
            />
          </div>
        )}

        <div className="space-y-5">
          {currentSection.questions.map((q, idx) => {
            const userAns = userAnswers[q.id] || '';
            const isCorrect = isSubmitted && isAnswerMatch(userAns, q.correctAnswer);

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-red-300 bg-red-50/40 dark:bg-red-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Question {idx + 1} • {q.type.replace('-', ' ')}
                  </span>
                  {isSubmitted && (
                    <span className="flex items-center gap-1 font-bold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Expected: {q.correctAnswer}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {q.prompt}
                </p>

                {/* Multiple choice or Map labelling with options */}
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          userAns === opt
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Text input for fill-blank, form-completion, short-answer */
                  <div className="max-w-md">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={userAns}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Explanation review after submit */}
                {isSubmitted && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Examiner Justification: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit & Reset Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {scoreResult ? (
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                <span className="font-extrabold text-blue-700 dark:text-blue-300">
                  Result: {scoreResult.raw} / {scoreResult.total} Correct
                </span>
                <span className="ml-2 font-black text-slate-900 dark:text-white">
                  → Estimated Band {scoreResult.band.toFixed(1)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowTranscripts(!showTranscripts)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                <span>{showTranscripts ? 'Hide Transcripts' : 'View Full Audio Script'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Test</span>
              </button>
            </div>
          ) : (
            <div />
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleSubmitTest}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
            >
              Submit All 4 Sections
            </button>
          )}
        </div>
      </div>

      {/* Transcript Viewer (Unlocked after submission) */}
      {showTranscripts && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Complete Listening Audio Transcript with Answers</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line border border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto">
            {currentSection.scriptText}
          </div>
        </div>
      )}
    </div>
  );
};
