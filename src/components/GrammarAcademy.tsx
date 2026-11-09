import React, { useState } from 'react';
import {
  BookCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GRAMMAR_RULES } from '../data/grammarData';
import { GrammarRule } from '../types/ielts';
import { audioService } from '../services/audioService';

export const GrammarAcademy: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<GrammarRule>(GRAMMAR_RULES[0]);
  const [answers, setAnswers] = useState<{ [exId: string]: string }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectAnswer = (exId: string, opt: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [exId]: opt }));
  };

  const handleSubmit = () => {
    let allCorrect = true;
    selectedRule.practiceExercises.forEach((ex) => {
      if (answers[ex.id] !== ex.answer) {
        allCorrect = false;
      }
    });

    setSubmitted(true);
    if (allCorrect) {
      audioService.playChime('correct');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      audioService.playChime('wrong');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <BookCheck className="w-4 h-4" />
            <span>Grammar Academy</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Grammatical Range & Accuracy Masterclasses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Targeted drills covering inversion, conditionals, relative clauses, and complex sentence architecture to elevate your Grammatical Range from Band 6 to Band 8+.
          </p>
        </div>
      </div>

      {/* Rules Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {GRAMMAR_RULES.map((rule) => (
          <button
            key={rule.id}
            onClick={() => {
              setSelectedRule(rule);
              setAnswers({});
              setSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedRule.id === rule.id
                ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] uppercase font-mono mr-1.5 opacity-60">[{rule.bandTarget}]</span>
            {rule.title}
          </button>
        ))}
      </div>

      {/* Rule Content Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Theory & Exemplars */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
              Grammatical Blueprint • Target {selectedRule.bandTarget}
            </span>
            <span className="text-xs font-bold text-slate-500 capitalize">Category: {selectedRule.category}</span>
          </div>

          <h3 className="font-black text-xl text-slate-900 dark:text-white">
            {selectedRule.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {selectedRule.summary}
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <span className="font-bold text-red-600 block">Core Syntactic Rules:</span>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {selectedRule.detailedRules.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Correct vs Incorrect Comparative Analysis */}
          <div className="space-y-3">
            <span className="font-bold text-xs text-slate-900 dark:text-white block">
              Comparative Analysis: Common Error vs Band 8+ Correction
            </span>
            {selectedRule.examples.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
              >
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 flex items-start gap-2 font-medium">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Avoid: </span>"{ex.incorrect}"
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Band 8+ Standard: </span>"{ex.correct}"
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                  Why this scores higher: {ex.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Practice Exercises */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-black text-sm text-slate-900 dark:text-white">
              Interactive Diagnostic Drills
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {selectedRule.practiceExercises.length} Drills
            </span>
          </div>

          <div className="space-y-4">
            {selectedRule.practiceExercises.map((ex, idx) => {
              const userAns = answers[ex.id];
              const isCorrect = submitted && userAns === ex.answer;

              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    submitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-red-300 bg-red-50/40 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <span className="font-bold text-xs text-red-600 block">Exercise {idx + 1}</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                    {ex.sentenceWithBlanks}
                  </p>

                  <div className="space-y-1.5">
                    {ex.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectAnswer(ex.id, opt)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                          userAns === opt
                            ? 'border-red-600 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {submitted && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Examiner Rationale: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="text-xs font-bold text-slate-500 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Exercises</span>
              </button>
            ) : (
              <div />
            )}

            {!submitted && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20"
              >
                Check Grammar Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
