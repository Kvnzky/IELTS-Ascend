import React, { useState } from 'react';
import {
  Languages,
  RotateCw,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  BookOpen,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { VocabularyWord } from '../types/ielts';
import { audioService } from '../services/audioService';

interface VocabularyBuilderProps {
  vocabProgress: { [wordId: string]: { boxLevel: number; mastered: boolean } };
  onUpdateWordProgress: (wordId: string, correct: boolean) => void;
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  vocabProgress,
  onUpdateWordProgress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<'flashcards' | 'browser' | 'quiz'>('flashcards');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedAns, setQuizSelectedAns] = useState<string | null>(null);

  // Flashcards deck state
  const filteredWords = VOCABULARY_LIST.filter(
    (w) =>
      (selectedFilter === 'all' || w.level === selectedFilter) &&
      (searchQuery.trim() === '' ||
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.collocations.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentWord = filteredWords[cardIndex] || filteredWords[0];
  const currentProgress = (currentWord && vocabProgress[currentWord.id]) || {
    boxLevel: currentWord ? currentWord.boxLevel : 1,
    mastered: false,
  };

  const handlePrevCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleNextCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePronounce = (word: string) => {
    audioService.speak(word, { accent: 'British', rate: 0.9 });
  };

  const handleSRSResponse = (correct: boolean) => {
    if (!currentWord) return;
    onUpdateWordProgress(currentWord.id, correct);
    if (correct) {
      audioService.playChime('correct');
      if (currentProgress.boxLevel >= 3) {
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      audioService.playChime('wrong');
    }
    handleNextCard();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Languages className="w-4 h-4" />
            <span>Academic Lexical Resource</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            IELTS Academic Word List & Collocation Deck
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Powered by Leitner Spaced Repetition (SRS) algorithms to anchor Band 7+ vocabulary permanently in long-term memory.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveMode('flashcards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            SRS Flashcards
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('browser')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'browser'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Lexicon Dictionary
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('quiz');
              setQuizIndex(0);
              setQuizSelectedAns(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Lexical Quiz
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Terms' },
          { id: 'AWL-Sublist-1', label: 'AWL Sublist 1' },
          { id: 'AWL-Sublist-2', label: 'AWL Sublist 2' },
          { id: 'Topic-Environment', label: 'Environment' },
          { id: 'Topic-Technology', label: 'Technology' },
          { id: 'Collocations', label: 'Collocations' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFilter(f.id);
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedFilter === f.id
                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* FLASHCARD MODE */}
      {activeMode === 'flashcards' && currentWord && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Progress & Deck Status */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              Card {cardIndex + 1} of {filteredWords.length}
            </span>
            <div className="flex items-center gap-1.5">
              <span>Leitner SRS Level:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-extrabold">
                Box {currentProgress.boxLevel} / 5
              </span>
            </div>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Flashcard for ${currentWord.word}. Click or press Enter to flip.`}
            onClick={() => setIsFlipped(!isFlipped)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
            className="cursor-pointer min-h-[360px] p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/90 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-between transition-all hover:shadow-2xl relative"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {currentWord.level.replace('-', ' ')} • {currentWord.partOfSpeech}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePronounce(currentWord.word);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform"
                title="Listen to native pronunciation"
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
              </button>
            </div>

            {/* Middle Content */}
            {!isFlipped ? (
              <div className="text-center py-8 space-y-2">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentWord.word}
                </h3>
                <span className="text-sm font-mono text-slate-400">{currentWord.phonetic}</span>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold pt-4">
                  (Click card to reveal definition & IELTS context)
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-4 animate-fade-in text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Academic Definition
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {currentWord.definition}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">
                    IELTS Band 8 Example Sentence:
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium italic">
                    "{currentWord.ieltsExampleSentence}"
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-500 block">Essential Collocations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentWord.collocations.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Flip Indicator */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold pt-2">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap to flip card</span>
            </div>
          </div>

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              ← Previous Card
            </button>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-xs font-bold text-amber-700 dark:text-amber-300"
            >
              {isFlipped ? 'Show Term Front' : 'Reveal Definition'}
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              Next Card →
            </button>
          </div>

          {/* SRS Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSRSResponse(false)}
              className="py-3 px-4 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Still Learning (Reset to Box 1)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSRSResponse(true)}
              className="py-3 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Know This! (Advance Level)</span>
            </button>
          </div>
        </div>
      )}

      {/* BROWSER / DICTIONARY MODE */}
      {activeMode === 'browser' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Academic Word List by term, definition, or collocation..."
              aria-label="Search Academic Word List"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-slate-900 dark:text-white">{w.word}</h4>
                      <span className="text-xs font-mono text-slate-400">{w.phonetic}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      {w.partOfSpeech} • {w.level}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePronounce(w.word)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title={`Pronounce ${w.word}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {w.definition}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                  "{w.ieltsExampleSentence}"
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {w.collocations.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEXICAL QUIZ MODE */}
      {activeMode === 'quiz' && filteredWords.length > 0 && (() => {
        const quizWord = filteredWords[quizIndex % filteredWords.length];
        const distractors = VOCABULARY_LIST.filter((w) => w.id !== quizWord.id)
          .slice(0, 3)
          .map((w) => w.word);
        const options = [quizWord.word, ...distractors].sort();
        const isCorrect = quizSelectedAns === quizWord.word;

        return (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="text-amber-600 uppercase tracking-wider">
                Active Recall Lexical Quiz • Item {(quizIndex % filteredWords.length) + 1} of {filteredWords.length}
              </span>
              <span>{quizWord.level}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Select the academic term matching this definition:
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                "{quizWord.definition}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={quizSelectedAns !== null}
                  onClick={() => {
                    setQuizSelectedAns(opt);
                    onUpdateWordProgress(quizWord.id, opt === quizWord.word);
                  }}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    quizSelectedAns === null
                      ? 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
                      : opt === quizWord.word
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : quizSelectedAns === opt
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {quizSelectedAns && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className={`font-black block ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isCorrect ? '✓ Correct Academic Match!' : `✗ Expected: ${quizWord.word}`}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 italic">
                    Example: "{quizWord.ieltsExampleSentence}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuizSelectedAns(null);
                    setQuizIndex((prev) => prev + 1);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shrink-0"
                >
                  Next Question →
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
