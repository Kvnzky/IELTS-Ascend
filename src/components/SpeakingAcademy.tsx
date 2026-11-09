import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Award,
  Volume2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SPEAKING_PROMPT_PACKS } from '../data/speakingData';
import { SpeakingPromptPack, SpeakingEvaluation } from '../types/ielts';
import { audioService } from '../services/audioService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { evaluateSpeakingTranscript } from '../services/speakingEvaluator';

interface SpeakingAcademyProps {
  onSaveEvaluation: (evaluation: SpeakingEvaluation) => void;
}

export const SpeakingAcademy: React.FC<SpeakingAcademyProps> = ({ onSaveEvaluation }) => {
  const [activePackIndex, setActivePackIndex] = useState<number>(0);
  const activePack = SPEAKING_PROMPT_PACKS[activePackIndex] || SPEAKING_PROMPT_PACKS[0];

  const [activePart, setActivePart] = useState<1 | 2 | 3>(2); // Default to Part 2 (Cue Card)

  // Part 2 Timer state
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);

  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluation | null>(null);

  // Active question for Part 1 & 3
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState<boolean>(false);
  const [showCueCardModel, setShowCueCardModel] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean up recording on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.cleanup();
      audioService.stop();
    };
  }, []);

  // Prep timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isPrepping && prepSecondsRemaining > 0) {
      interval = setInterval(() => {
        setPrepSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPrepping(false);
            audioService.playChime('bell');
            return 0;
          }
          if (prev === 10) {
            audioService.playChime('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPrepping, prepSecondsRemaining]);

  const handleStartPrep = () => {
    setPrepSecondsRemaining(60);
    setIsPrepping(true);
    audioService.playChime('bell');
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const res = await speechRecognitionService.stopRecording();
      setIsRecording(false);
      setRecordedAudioUrl(res.audioUrl);
      audioService.playChime('correct');
    } else {
      setLiveTranscript('');
      setRecordingSeconds(0);
      setEvaluationResult(null);
      setErrorMsg(null);

      const success = await speechRecognitionService.startRecording(
        (transcript) => setLiveTranscript(transcript),
        (sec) => setRecordingSeconds(sec),
        (err) => setErrorMsg(err)
      );

      if (success) {
        setIsRecording(true);
        audioService.playChime('bell');
      }
    }
  };

  const handlePlayModelAnswer = (text: string) => {
    if (isPlayingModelAudio) {
      audioService.stop();
      setIsPlayingModelAudio(false);
    } else {
      setIsPlayingModelAudio(true);
      audioService.speak(text, {
        accent: 'British',
        rate: 0.95,
        onEnd: () => setIsPlayingModelAudio(false),
        onError: () => setIsPlayingModelAudio(false),
      });
    }
  };

  const handleEvaluate = () => {
    if (!liveTranscript.trim()) {
      setErrorMsg('Please speak or type a response transcript so our AI evaluator can analyze your speech.');
      return;
    }
    setErrorMsg(null);

    setIsEvaluating(true);
    setTimeout(() => {
      const hasAudio = Boolean(recordedAudioUrl || recordingSeconds > 0);
      const evaluation = evaluateSpeakingTranscript(liveTranscript, recordingSeconds, activePart, hasAudio);
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

  const handleReset = () => {
    speechRecognitionService.cleanup();
    audioService.stop();
    setIsRecording(false);
    setIsPrepping(false);
    setPrepSecondsRemaining(60);
    setRecordingSeconds(0);
    setLiveTranscript('');
    setRecordedAudioUrl(null);
    setEvaluationResult(null);
    setIsPlayingModelAudio(false);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Mic className="w-4 h-4" />
            <span>IELTS Speaking Academy & AI Fluency Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {activePack.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulates the authentic 3-part examiner interview with preparation timers, voice recording, live transcription, and 4-criteria AI evaluation.
          </p>
        </div>

        {/* 3 Parts Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          {[
            { part: 1, label: 'Part 1: Interview' },
            { part: 2, label: 'Part 2: Cue Card' },
            { part: 3, label: 'Part 3: Discussion' },
          ].map((item) => (
            <button
              key={item.part}
              type="button"
              onClick={() => {
                handleReset();
                setActivePart(item.part as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePart === item.part
                  ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Pack Switcher Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
          Examiner Topic Pack:
        </span>
        {SPEAKING_PROMPT_PACKS.map((pack, idx) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => {
              handleReset();
              setActivePackIndex(idx);
              setSelectedQuestionIndex(0);
              setShowCueCardModel(false);
            }}
            className={`px-4 py-2 rounded-2xl border text-xs font-extrabold transition-all ${
              activePackIndex === idx
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            Pack {idx + 1}: {pack.topic}
          </button>
        ))}
      </div>

      {/* Main Studio Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Examiner Prompts & Cue Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* PART 1 VIEW */}
          {activePart === 1 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">
                Part 1 • Introduction & Familiar Topics (4–5 mins)
              </span>

              <div className="space-y-3">
                {activePack.part1.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionIndex(idx)}
                    className={`cursor-pointer p-4 rounded-2xl border text-xs transition-all space-y-2 ${
                      selectedQuestionIndex === idx
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Question {idx + 1}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayModelAnswer(q.modelAnswerBand8);
                        }}
                        className="text-[11px] font-bold text-purple-600 flex items-center gap-1 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Model</span>
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{q.question}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">💡 Examiner Tip: {q.tips}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PART 2 CUE CARD VIEW */}
          {activePart === 2 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                  Part 2 • Candidate Task Card (Long Turn)
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">1 Min Prep • 2 Mins Speak</span>
              </div>

              {/* Official Cue Card Presentation */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/60 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                  {activePack.part2CueCard.topic}
                </h3>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">
                    You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You should say:
                  </span>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    {activePack.part2CueCard.bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1-Minute Prep Timer Console */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Preparation Timer
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                    00:{prepSecondsRemaining.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isPrepping}
                    onClick={handleStartPrep}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isPrepping ? 'Thinking...' : 'Start 1-Min Prep'}
                  </button>
                  {isPrepping && (
                    <button
                      type="button"
                      onClick={() => setIsPrepping(false)}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Band 8 Vocabulary Bank & Model Answer Toggle */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-purple-900 dark:text-purple-300 block">
                    Recommended High-Band Collocations:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCueCardModel(!showCueCardModel)}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      {showCueCardModel ? 'Hide Band 8 Model' : 'View Band 8 Model'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlayModelAnswer(activePack.part2CueCard.modelAnswerBand8)}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingModelAudio ? 'Stop Audio' : 'Listen Model'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePack.part2CueCard.keyVocabulary.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-[11px] font-semibold text-purple-700 dark:text-purple-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                {showCueCardModel && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-purple-600 block">
                      Band 8.5 Examiner Model Response
                    </span>
                    <p>{activePack.part2CueCard.modelAnswerBand8}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PART 3 VIEW */}
          {activePart === 3 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">
                Part 3 • Two-Way Abstract Discussion (4–5 mins)
              </span>

              <div className="space-y-3">
                {activePack.part3Discussion.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionIndex(idx)}
                    className={`cursor-pointer p-4 rounded-2xl border text-xs transition-all space-y-2 ${
                      selectedQuestionIndex === idx
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Discussion Prompt {idx + 1}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayModelAnswer(q.modelAnswerBand8);
                        }}
                        className="text-[11px] font-bold text-purple-600 flex items-center gap-1 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Model</span>
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{q.question}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {q.collocations.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400"
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
        </div>

        {/* Right Column: Audio Recording Console & AI Fluency Assessment */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                Live Speech Recording Console
              </span>

              <span className="text-xs font-mono font-bold text-purple-600">
                Timer: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Big Recording Button */}
            <div className="py-6 text-center space-y-3">
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white ring-8 ring-red-400/30 scale-105 animate-pulse'
                    : 'bg-gradient-to-tr from-purple-600 to-red-500 text-white hover:scale-105 hover:shadow-purple-500/25'
                }`}
              >
                <Mic className="w-10 h-10" />
              </button>

              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isRecording ? (
                  <span className="text-red-600 animate-pulse">
                    Recording live microphone stream... Click to stop
                  </span>
                ) : (
                  <span>Click microphone to begin your speech response</span>
                )}
              </div>
            </div>

            {/* Audio Playback Player if recorded */}
            {recordedAudioUrl && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>Playback Your Recorded Audio</span>
                </div>
                <audio controls src={recordedAudioUrl} className="h-8 max-w-xs" />
              </div>
            )}

            {/* Live or Manual Speech Transcript */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Speech Transcript (Streaming STT / Manual Input)
              </span>
              <textarea
                value={liveTranscript}
                onChange={(e) => {
                  setLiveTranscript(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Speech recognition transcript streams here as you talk, or you can paste your spoken transcript manually..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Evaluate Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Reset Studio
              </button>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleEvaluate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'Evaluating Speech...' : 'Analyze Speech with AI Evaluator'}</span>
              </button>
            </div>
          </div>

          {/* AI Speaking Evaluator Results */}
          {evaluationResult && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Speaking 4-Criteria Assessment Breakdown (Estimated)
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 border border-purple-200 dark:border-purple-900 font-black text-xs font-mono">
                  Estimated Overall: Band {evaluationResult.estimatedOverallBand.toFixed(1)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200">Assessment Transparency Notice:</strong> This evaluation provides an automated heuristic estimate calibrated against public IELTS Speaking Band Descriptors (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation). It is designed for preparation guidance and is not an official score issued by a certified IELTS Examiner.
              </div>

              {/* Criteria Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { title: 'Fluency & Coherence', score: evaluationResult.scores.fluencyAndCoherence, sub: `${evaluationResult.wordsPerMinute} WPM` },
                  { title: 'Lexical Resource', score: evaluationResult.scores.lexicalResource, sub: 'Idiomatic Range' },
                  { title: 'Grammar Accuracy', score: evaluationResult.scores.grammaticalRangeAndAccuracy, sub: 'Sentence Variety' },
                  {
                    title: 'Pronunciation',
                    score: evaluationResult.scores.pronunciation,
                    sub: recordedAudioUrl || recordingSeconds > 0 ? 'Acoustic Pacing & Rhythm' : 'Transcript Pacing Proxy (No Audio)',
                  },
                ].map((crit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {crit.title}
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white block font-mono">
                      Band {crit.score.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
                      {crit.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fluency & Hesitation Analysis */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 text-xs space-y-1">
                <span className="font-bold text-purple-900 dark:text-purple-300 block">
                  Fluency & Pause Analysis:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {evaluationResult.hesitationsAndPauses.analysis} (Total word output: {evaluationResult.wordCount} words spoken over {evaluationResult.durationSeconds}s).
                </p>
              </div>

              {/* Strengths & Improvement Priorities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-emerald-600 uppercase tracking-wider block">
                    Examiner Commendations
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {evaluationResult.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-amber-600 uppercase tracking-wider block">
                    Band 8 Elevation Recommendations
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {evaluationResult.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
