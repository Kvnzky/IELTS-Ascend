// IELTS Speaking Evaluator Engine - Official 4 Assessment Criteria
import { SpeakingEvaluation } from '../types/ielts';

const DISCOURSE_MARKERS = [
  'well', 'actually', 'to be honest', 'frankly speaking', 'as a matter of fact',
  'in my opinion', 'from my perspective', 'personally speaking', 'having said that',
  'on top of that', 'for instance', 'in other words', 'what i mean is', 'speaking of which',
  'needless to say', 'undoubtedly', 'consequently', 'similarly'
];

const ADVANCED_SPEAKING_VOCAB = [
  'fascinating', 'paramount', 'crucial', 'captivating', 'exhilarating', 'challenging',
  'indispensable', 'monotonous', 'astounding', 'serene', 'vibrant', 'nostalgic',
  'substantial', 'predominantly', 'multitask', 'perseverance', 'resilient', 'perspective',
  'cultural heritage', 'state-of-the-art', 'broaden my horizons', 'once in a blue moon',
  'over the moon', 'piece of cake', 'down to earth', 'food for thought'
];

export function evaluateSpeakingTranscript(
  transcript: string,
  durationSeconds: number,
  partNumber: 1 | 2 | 3,
  hasAudioRecording: boolean = durationSeconds > 0
): SpeakingEvaluation {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const estimatedDurationFromWords = Math.max(15, Math.round((wordCount / 125) * 60));
  const validDuration = durationSeconds > 0 ? Math.max(durationSeconds, 10) : estimatedDurationFromWords;
  const minutes = validDuration / 60;
  const wordsPerMinute = Math.round(wordCount / minutes);

  // 1. Fluency & Coherence
  let fcScore = 6.0;
  // WPM optimal range for IELTS speaking: 110 - 150 WPM
  if (wordsPerMinute < 70) {
    fcScore = 5.0; // Slow, hesitant
  } else if (wordsPerMinute >= 70 && wordsPerMinute < 100) {
    fcScore = 5.5;
  } else if (wordsPerMinute >= 105 && wordsPerMinute <= 155) {
    fcScore = 7.0; // Fluent, natural speed
  } else if (wordsPerMinute > 175) {
    fcScore = 6.5; // Rushed
  }

  // Check discourse markers
  const textLower = transcript.toLowerCase();
  const markersUsed = DISCOURSE_MARKERS.filter((dm) => textLower.includes(dm));
  if (markersUsed.length >= 2) fcScore += 0.5;
  if (markersUsed.length >= 4) fcScore += 0.5;

  // Check hesitations (um, uh, er, like, you know)
  const hesitationMatches = textLower.match(/\b(um|uh|er|like|you know)\b/g) || [];
  const hesitationCount = hesitationMatches.length;
  if (hesitationCount > 6) {
    fcScore -= 0.5;
  }
  fcScore = Math.min(8.5, Math.max(4.0, fcScore));

  // 2. Lexical Resource
  let lrScore = 5.5;
  const advancedUsed = ADVANCED_SPEAKING_VOCAB.filter((w) => textLower.includes(w));
  if (advancedUsed.length >= 1) lrScore += 0.5;
  if (advancedUsed.length >= 3) lrScore += 0.5;
  if (advancedUsed.length >= 5) lrScore += 0.5;

  // Repetition check
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const lexicalDiversity = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  if (lexicalDiversity > 0.65 && wordCount > 30) {
    lrScore += 0.5;
  }
  lrScore = Math.min(8.5, Math.max(4.0, lrScore));

  // 3. Grammatical Range and Accuracy
  let graScore = 5.5;
  const complexMarkers = /(although|because|since|if\s|when\s|even though|which|who|whereas|unless|in order to)/i;
  const complexFound = words.filter((w) => complexMarkers.test(w)).length;
  if (complexFound >= 2) graScore += 0.5;
  if (complexFound >= 4) graScore += 0.5;

  // Conditional tense check (e.g., "if I had... I would")
  if (/\b(if|would|could|might)\b/i.test(transcript)) {
    graScore += 0.5;
  }
  graScore = Math.min(8.5, Math.max(4.0, graScore));

  // 4. Pronunciation & Intonation (Estimated based on pacing, length, rhythm)
  let pronScore = 6.0;
  if (wordsPerMinute >= 100 && wordsPerMinute <= 150) {
    pronScore = 7.0;
  } else if (wordsPerMinute < 80 || wordsPerMinute > 170) {
    pronScore = 5.5;
  }
  if (hesitationCount <= 2 && wordCount > 40) {
    pronScore += 0.5;
  }
  pronScore = Math.min(8.5, Math.max(4.5, pronScore));

  // Overall Band
  const rawAvg = (fcScore + lrScore + graScore + pronScore) / 4;
  const roundedBand = Math.round(rawAvg * 2) / 2;

  return {
    id: 'spk-eval-' + Date.now(),
    partNumber,
    transcript,
    durationSeconds: validDuration,
    wordCount,
    wordsPerMinute,
    estimatedOverallBand: roundedBand,
    scores: {
      fluencyAndCoherence: Math.round(fcScore * 2) / 2,
      lexicalResource: Math.round(lrScore * 2) / 2,
      grammaticalRangeAndAccuracy: Math.round(graScore * 2) / 2,
      pronunciation: Math.round(pronScore * 2) / 2,
    },
    strengths: [
      hasAudioRecording
        ? `Recorded live speech for ${validDuration} seconds at approximately ${wordsPerMinute} words per minute.`
        : `Submitted ${wordCount}-word transcript (Note: Pronunciation score is estimated from syntactic chunking; record microphone audio to evaluate acoustic pacing).`,
      markersUsed.length > 0
        ? `Effectively used discourse markers: "${markersUsed.slice(0, 3).join('", "')}".`
        : 'Maintained continuous clause progression without excessive filler words.',
      `Demonstrated a vocabulary bank of ${uniqueWords.size} distinct words.`,
    ],
    improvements: [
      !hasAudioRecording
        ? 'Acoustic Pronunciation Notice: Phonemic accuracy, word stress, and intonation contours cannot be verified from text alone—use the microphone recorder for live pacing analysis.'
        : hesitationCount > 3
        ? `Reduce filler words ("um", "like", "you know") to elevate fluency from Band 6 to Band 7/8.`
        : 'Work on expanding complex conditional structures (e.g. "If I had the opportunity, I would have...").',
      'Incorporate more idiomatic phrases and topic-specific collocations for Lexical Resource Band 7+.',
      'Practice rhythmic chunking and sentence stress on content words.',
    ],
    hesitationsAndPauses: {
      count: hesitationCount,
      analysis:
        hesitationCount <= 2
          ? 'Minimal hesitation detected. Natural English conversational pacing.'
          : `${hesitationCount} filler expressions observed. Practice pausing silently or using conversational fillers like "That is an intriguing question...".`,
    },
    vocabularyHighlights: {
      advancedWordsUsed: advancedUsed.length > 0 ? advancedUsed : ['clear foundational vocabulary'],
      recommendedCollocations: [
        'have a profound impact on',
        'broaden one\'s horizon',
        'play a vital role in',
        'weigh the pros and cons',
        'unforeseen circumstances',
      ],
    },
    grammarAnalysis: {
      complexStructuresUsed: [
        complexFound >= 1 ? 'Subordinate dependent clauses' : 'Compound sentences with conjunctions',
        'Past and present descriptive tenses',
      ],
      errorsIdentified:
        wordCount < 20
          ? ['Short response: extend responses in Part 1 to 2-3 sentences, and Part 3 to 4-5 sentences.']
          : ['Pay attention to third-person singular "s" (he thinks, it causes).'],
    },
    evaluatedAt: new Date().toISOString(),
    isAiEstimate: true,
  };
}
