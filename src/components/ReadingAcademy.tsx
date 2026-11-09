import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bookmark,
  Highlighter,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_TESTS, calculateReadingBand, isAnswerMatch } from '../data/readingData';
import { ReadingTest, ReadingPassage, ReadingQuestion, ExamType } from '../types/ielts';
import { audioService } from '../services/audioService';

interface ReadingAcademyProps {
  userExamType: ExamType;
  onScoreSave?: (rawScore: number, estimatedBand: number) => void;
}

export const ReadingAcademy: React.FC<ReadingAcademyProps> = ({ userExamType, onScoreSave }) => {
  // Select Academic or General Training test based on user setting or toggle
  const [selectedTrack, setSelectedTrack] = useState<ExamType>(userExamType);
  useEffect(() => {
    setSelectedTrack(userExamType);
    setActivePassageIndex(0);
  }, [userExamType]);

  const activeTest = READING_TESTS.find((t) => t.examType === selectedTrack) || READING_TESTS[0];

  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem(`ielts_reading_draft_${activeTest.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [highlightColor, setHighlightColor] = useState<'yellow' | 'green' | 'pink'>('yellow');
  const [savedHighlights, setSavedHighlights] = useState<{ text: string; color: 'yellow' | 'green' | 'pink' }[]>([]);
  const [mobilePanel, setMobilePanel] = useState<'both' | 'passage' | 'questions'>('both');

  // Sync saved draft when switching track
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ielts_reading_draft_${activeTest.id}`);
      setUserAnswers(saved ? JSON.parse(saved) : {});
    } catch (e) {
      setUserAnswers({});
    }
  }, [activeTest.id]);

  // Autosave reading answers
  useEffect(() => {
    try {
      localStorage.setItem(`ielts_reading_draft_${activeTest.id}`, JSON.stringify(userAnswers));
    } catch (e) {}
  }, [userAnswers, activeTest.id]);

  const handleCaptureSelectionHighlight = () => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text.length >= 3 && text.length <= 220) {
      setSavedHighlights((prev) => {
        if (prev.some((h) => h.text === text)) return prev;
        return [...prev, { text, color: highlightColor }];
      });
      sel?.removeAllRanges();
    }
  };

  const renderHighlightedParagraph = (paraText: string) => {
    if (savedHighlights.length === 0) return paraText;
    let parts: (string | React.ReactNode)[] = [paraText];
    savedHighlights.forEach((hl, hIdx) => {
      const nextParts: (string | React.ReactNode)[] = [];
      parts.forEach((part, pIdx) => {
        if (typeof part !== 'string') {
          nextParts.push(part);
          return;
        }
        const splitIdx = part.indexOf(hl.text);
        if (splitIdx === -1) {
          nextParts.push(part);
        } else {
          const before = part.slice(0, splitIdx);
          const match = part.slice(splitIdx, splitIdx + hl.text.length);
          const after = part.slice(splitIdx + hl.text.length);
          if (before) nextParts.push(before);
          const bgClass =
            hl.color === 'yellow'
              ? 'bg-yellow-200 dark:bg-yellow-800/80 text-slate-900 dark:text-white px-0.5 rounded'
              : hl.color === 'green'
              ? 'bg-emerald-200 dark:bg-emerald-800/80 text-slate-900 dark:text-white px-0.5 rounded'
              : 'bg-pink-200 dark:bg-pink-800/80 text-slate-900 dark:text-white px-0.5 rounded';
          nextParts.push(
            <mark key={`hl-${hIdx}-${pIdx}`} className={bgClass}>
              {match}
            </mark>
          );
          if (after) nextParts.push(after);
        }
      });
      parts = nextParts;
    });
    return parts;
  };

  // Timer: 60 minutes
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60 * 60);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Result state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; total: number; band: number } | null>(null);

  const currentPassage = activeTest.passages[activePassageIndex] || activeTest.passages[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !isSubmitted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted, secondsRemaining]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleAnswer = (qId: string, val: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    setTimerActive(false);
    let correct = 0;
    let total = 0;

    activeTest.passages.forEach((p) => {
      p.questions.forEach((q) => {
        total++;
        const ans = userAnswers[q.id] || '';
        if (isAnswerMatch(ans, q.correctAnswer)) {
          correct++;
        }
      });
    });

    const band = calculateReadingBand(correct, total, selectedTrack);
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
    setUserAnswers({});
    setBookmarkedQuestions(new Set());
    setSavedHighlights([]);
    try {
      localStorage.removeItem(`ielts_reading_draft_${activeTest.id}`);
    } catch (e) {}
    setSecondsRemaining(60 * 60);
    setTimerActive(true);
    setIsSubmitted(false);
    setScoreResult(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>IELTS Reading Academy</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {activeTest.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Passage viewer with text highlighting tools, bookmarking matrix, and evidence revelation.
          </p>
        </div>

        {/* Track switch & Timer */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('academic');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTrack === 'academic'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Academic
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('general');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTrack === 'general'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              General Training
            </button>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white font-mono font-bold text-xs shadow-xs">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Passage Selector Tabs & Mobile View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {activeTest.passages.map((p, idx) => (
            <button
              key={p.passageNumber}
              type="button"
              onClick={() => setActivePassageIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold transition-all ${
                activePassageIndex === idx
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {selectedTrack === 'general' ? `Section ${p.passageNumber}` : `Passage ${p.passageNumber}`} ({p.questions.length} Questions)
            </button>
          ))}
        </div>

        {/* Mobile View Switcher (< lg) */}
        <div
          role="group"
          aria-label="Mobile Reading Layout Switcher"
          className="flex lg:hidden items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          {(['both', 'passage', 'questions'] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setMobilePanel(view)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                mobilePanel === view
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {view === 'both' ? 'Split View' : view}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Passage Viewer */}
        <div
          className={`lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex-col h-[520px] sm:h-[620px] lg:h-[700px] ${
            mobilePanel === 'questions' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">
                {currentPassage.category}
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {currentPassage.title}
              </h3>
            </div>

            {/* Highlighting Color Tool */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Highlighter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(['yellow', 'green', 'pink'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlightColor(color)}
                  className={`w-5 h-5 rounded-lg border transition-transform ${
                    color === 'yellow' ? 'bg-yellow-300' : color === 'green' ? 'bg-emerald-300' : 'bg-pink-300'
                  } ${highlightColor === color ? 'scale-110 border-slate-900 ring-2 ring-slate-400' : 'border-transparent'}`}
                  title={`Select ${color} highlighter`}
                />
              ))}
              {savedHighlights.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSavedHighlights([])}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-500 hover:text-red-600"
                  title="Clear all passage highlights"
                >
                  Clear ({savedHighlights.length})
                </button>
              )}
            </div>
          </div>

          {/* Passage Scrollable Body (Select text to auto-highlight with active color) */}
          <div
            onMouseUp={handleCaptureSelectionHighlight}
            className="overflow-y-auto space-y-4 pr-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif flex-1"
          >
            {currentPassage.paragraphs.map((p) => (
              <div key={p.index} className="flex items-start gap-3">
                {p.label && (
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-black text-xs flex items-center justify-center">
                    {p.label}
                  </span>
                )}
                <p
                  className={`flex-1 ${
                    highlightColor === 'yellow'
                      ? 'selection:bg-yellow-200 dark:selection:bg-yellow-900'
                      : highlightColor === 'green'
                      ? 'selection:bg-emerald-200 dark:selection:bg-emerald-900'
                      : 'selection:bg-pink-200 dark:selection:bg-pink-900'
                  }`}
                >
                  {renderHighlightedParagraph(p.text)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Questions Navigator & Questions */}
        <div
          className={`lg:col-span-5 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex-col h-[520px] sm:h-[620px] lg:h-[700px] ${
            mobilePanel === 'passage' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Question Navigator Pill Bar */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Question Navigator
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentPassage.questions.map((q, idx) => {
                const hasAnswer = !!userAnswers[q.id];
                const isBookmarked = bookmarkedQuestions.has(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      const el = document.getElementById(`reading-q-${q.id}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative ${
                      hasAnswer
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isBookmarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Scrollable List */}
          <div className="overflow-y-auto space-y-5 pr-2 flex-1">
            {currentPassage.questions.map((q, idx) => {
              const userAns = userAnswers[q.id] || '';
              const isCorrect = isSubmitted && isAnswerMatch(userAns, q.correctAnswer);
              const isBookmarked = bookmarkedQuestions.has(q.id);

              return (
                <div
                  id={`reading-q-${q.id}`}
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-red-300 bg-red-50/40 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Question {idx + 1} • {q.type.replace(/-/g, ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1 rounded-md transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Multiple Choice / T-F-NG options */}
                  {q.options && q.options.length > 0 ? (
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleAnswer(q.id, opt)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                            userAns === opt
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Text input for sentence completion */
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={userAns}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      placeholder="Type exact word from passage..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}

                  {/* Evidence & Explanation post-submission */}
                  {isSubmitted && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>Expected Answer: {q.correctAnswer}</span>
                        {q.evidenceParagraph && (
                          <span className="text-emerald-600">Evidence: Paragraph {q.evidenceParagraph}</span>
                        )}
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
            {scoreResult ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-emerald-600">
                  Score: {scoreResult.raw}/{scoreResult.total} → Band {scoreResult.band.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-500 underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400">
                {Object.keys(userAnswers).length} of {activeTest.passages.reduce((acc, p) => acc + p.questions.length, 0)} answered
              </span>
            )}

            {!isSubmitted && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
              >
                Submit Reading Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
