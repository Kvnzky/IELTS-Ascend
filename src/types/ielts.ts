export type ExamType = 'academic' | 'general';

export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  targetExam: ExamType;
  targetOverallBand: number; // e.g. 7.5
  targetSkillBands: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  currentProficiency: 'beginner' | 'intermediate' | 'advanced';
  previousExperience: 'none' | 'taken_once' | 'taken_multiple';
  examDate?: string;
  dailyStudyMinutes: number; // e.g. 60
  preferredPace: 'intensive' | 'moderate' | 'relaxed';
  onboardingCompleted: boolean;
  diagnosticCompleted: boolean;
  streakDays: number;
  lastStudyDate?: string;
  totalStudyMinutes: number;
}

export interface SkillScore {
  rawScore?: number;
  maxScore?: number;
  estimatedBand: number;
  date: string;
  testId?: string;
}

export interface DiagnosticResult {
  completedAt: string;
  targetExam: ExamType;
  estimatedOverallBand: number;
  skillBands: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  strengths: string[];
  weaknesses: string[];
  grammarIssues: string[];
  vocabularyLimitations: string[];
  recommendedPriorities: string[];
  personalizedPlanOverview: string;
  isOfficial: false;
}

export interface CurriculumLesson {
  id: string;
  level: 1 | 2 | 3 | 4;
  levelTitle: string;
  title: string;
  skill: SkillType | 'grammar' | 'vocabulary' | 'strategy';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  examTrack?: 'both' | 'academic' | 'general';
  durationCategory?: 'quick' | 'standard' | 'intensive';
  bandContribution?: string;
  description: string;
  learningObjectives: string[];
  explanation: string;
  conceptSections?: {
    heading: string;
    content: string;
  }[];
  examples: {
    title: string;
    content: string;
    ineffectiveVersion?: string;
    note?: string;
  }[];
  guidedDemonstration?: string;
  guidedPractice?: {
    id: string;
    prompt: string;
    options?: string[];
    correctAnswer: string | number;
    hint: string;
    explanation: string;
    type: 'multiple-choice' | 'fill-blank';
  }[];
  independentPractice?: {
    id: string;
    prompt: string;
    options?: string[];
    correctAnswer: string | number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    explanation: string;
    type: 'multiple-choice' | 'fill-blank' | 'true-false';
  }[];
  ieltsApplication?: {
    examStrategy: string;
    commonTraps: string[];
    timeManagementTip: string;
    practicalTaskPrompt?: string;
    modelPracticalResponse?: string;
  };
  commonMistakes: string[];
  practiceQuestions: {
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    type: 'multiple-choice' | 'fill-blank' | 'true-false';
  }[];
  reviewAndReinforcement?: {
    keyTakeaways: string[];
    remediationAdvice: string;
    nextRecommendedLessonIds: string[];
  };
  requiredPassingScore: number;
  estimatedDurationMin: number;
  completed: boolean;
  score?: number;
}

export interface LessonProgressState {
  lessonId: string;
  currentStep: 1 | 2 | 3 | 4;
  guidedAnswers: { [id: string]: string | number };
  guidedSubmitted: boolean;
  independentAnswers: { [id: string]: string | number };
  independentSubmitted: boolean;
  practicalDraft: string;
  assessmentAnswers: { [id: string]: string | number };
  assessmentSubmitted: boolean;
  assessmentScore: number | null;
  lastUpdated: string;
}

export interface ListeningQuestion {
  id: string;
  section: 1 | 2 | 3 | 4;
  type:
    | 'multiple-choice'
    | 'matching'
    | 'map-labelling'
    | 'form-completion'
    | 'note-completion'
    | 'table-completion'
    | 'sentence-completion'
    | 'short-answer';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  transcriptSnippet?: string;
  diagramUrl?: string;
  diagramLabels?: { id: string; x: number; y: number; label: string }[];
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  audioDurationSeconds: number;
  sections: {
    sectionNumber: 1 | 2 | 3 | 4;
    contextTitle: string;
    accent: 'British' | 'Australian' | 'American' | 'International';
    speakers: string[];
    scriptText: string;
    questions: ListeningQuestion[];
  }[];
}

export interface ReadingQuestion {
  id: string;
  passageNumber: 1 | 2 | 3;
  type:
    | 'multiple-choice'
    | 'true-false-not-given'
    | 'yes-no-not-given'
    | 'matching-headings'
    | 'matching-information'
    | 'matching-features'
    | 'matching-sentence-endings'
    | 'sentence-completion'
    | 'summary-completion'
    | 'note-completion'
    | 'short-answer';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  evidenceParagraph?: number;
}

export interface ReadingPassage {
  passageNumber: 1 | 2 | 3;
  title: string;
  category: string;
  paragraphs: {
    index: number;
    label?: string; // 'A', 'B', etc.
    text: string;
  }[];
  questions: ReadingQuestion[];
}

export interface ReadingTest {
  id: string;
  examType: ExamType;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passages: ReadingPassage[];
}

export interface WritingPrompt {
  id: string;
  examType: ExamType;
  taskType: 'task1' | 'task2';
  title: string;
  subType:
    | 'line-graph'
    | 'bar-chart'
    | 'pie-chart'
    | 'table'
    | 'map'
    | 'process'
    | 'combined-chart'
    | 'letter-formal'
    | 'letter-semi-formal'
    | 'letter-informal'
    | 'opinion'
    | 'discussion'
    | 'problem-solution'
    | 'advantage-disadvantage'
    | 'two-part';
  promptText: string;
  visualData?: {
    type: 'line' | 'bar' | 'pie' | 'process' | 'table' | 'map' | 'combined';
    dataPoints: any;
    caption: string;
  };
  letterContext?: {
    recipient: string;
    requiredBulletPoints: string[];
  };
  suggestedDurationMinutes: number;
  minWordCount: number;
  modelAnswers: {
    band: 6 | 7 | 8 | 9;
    essay: string;
    examinerComment: string;
  }[];
  keyChecklist: string[];
}

export interface WritingEvaluation {
  id: string;
  promptId: string;
  taskType: 'task1' | 'task2';
  submittedText: string;
  wordCount: number;
  estimatedOverallBand: number;
  scores: {
    taskAchievementOrResponse: number;
    coherenceAndCohesion: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
  };
  detailedFeedback: {
    taskFeedback: string;
    coherenceFeedback: string;
    lexicalFeedback: string;
    grammarFeedback: string;
  };
  detectedErrors: {
    type: 'grammar' | 'vocab' | 'punctuation' | 'cohesion';
    snippet: string;
    suggestion: string;
    explanation: string;
  }[];
  improvedSentences: {
    original: string;
    enhanced: string;
    explanation: string;
  }[];
  recommendedExercises: string[];
  evaluatedAt: string;
  isAiEstimate: true;
}

export interface SpeakingPromptPack {
  id: string;
  title: string;
  topic: string;
  part1: {
    questions: {
      id: string;
      question: string;
      modelAnswerBand8: string;
      tips: string;
    }[];
  };
  part2CueCard: {
    topic: string;
    bullets: string[];
    prepTimeSeconds: number;
    speakTimeSeconds: number;
    modelAnswerBand8: string;
    keyVocabulary: string[];
  };
  part3Discussion: {
    questions: {
      id: string;
      question: string;
      followUpContext: string;
      modelAnswerBand8: string;
      collocations: string[];
    }[];
  };
}

export interface SpeakingEvaluation {
  id: string;
  partNumber: 1 | 2 | 3;
  transcript: string;
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  estimatedOverallBand: number;
  scores: {
    fluencyAndCoherence: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
    pronunciation: number;
  };
  strengths: string[];
  improvements: string[];
  hesitationsAndPauses: {
    count: number;
    analysis: string;
  };
  vocabularyHighlights: {
    advancedWordsUsed: string[];
    recommendedCollocations: string[];
  };
  grammarAnalysis: {
    complexStructuresUsed: string[];
    errorsIdentified: string[];
  };
  evaluatedAt: string;
  isAiEstimate: true;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: 'AWL-Sublist-1' | 'AWL-Sublist-2' | 'Topic-Environment' | 'Topic-Education' | 'Topic-Technology' | 'Topic-Society' | 'Collocations';
  definition: string;
  ieltsExampleSentence: string;
  collocations: string[];
  synonyms: string[];
  antonyms?: string[];
  academicContext: string;
  mastered: boolean;
  boxLevel: number; // 1 to 5 for Leitner SRS
  nextReviewDate?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: 'tenses' | 'clauses' | 'conditionals' | 'passive-voice' | 'inversion' | 'prepositions' | 'academic-hedging';
  bandTarget: '6.0+' | '7.0+' | '8.0+';
  summary: string;
  detailedRules: string[];
  examples: {
    correct: string;
    incorrect: string;
    explanation: string;
  }[];
  practiceExercises: {
    id: string;
    sentenceWithBlanks: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

export interface MockExamSession {
  id: string;
  examType: ExamType;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentSkill: SkillType;
  startedAt?: string;
  completedAt?: string;
  scores: {
    listening?: { raw: number; band: number };
    reading?: { raw: number; band: number };
    writing?: { band: number; evaluationIds: string[] };
    speaking?: { band: number; evaluationIds: string[] };
    overallBand?: number;
  };
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'skills' | 'mock_exam' | 'mastery';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}
