import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Filter,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { isAnswerMatch } from '../data/readingData';

export interface QualityDrillQuestion {
  id: string;
  skill: 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar';
  examTrack: 'both' | 'academic' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  format: 'multiple-choice' | 'fill-blank' | 'true-false-ng';
  topicTag: string;
  title: string;
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  recommendedLessonId: string;
}

export const QUALITY_QUESTION_BANK: QualityDrillQuestion[] = [
  // ==================== LISTENING DRILLS ====================
  {
    id: 'qb-lis-1',
    skill: 'listening',
    examTrack: 'both',
    difficulty: 'beginner',
    format: 'fill-blank',
    topicTag: 'Listening Numbers & Postcodes',
    title: 'Section 1 Postcode & Price Dictation',
    prompt:
      'Audio Transcript: "The delivery postcode for the community library is M-K-4-1, 7-B-N." Write the exact postcode:',
    correctAnswer: 'MK41 7BN',
    explanation: 'UK postcodes dictated letter-by-letter must be recorded accurately (MK41 7BN).',
    recommendedLessonId: 'l1-listening-format-prediction',
  },
  {
    id: 'qb-lis-2',
    skill: 'listening',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'Listening Distractor Traps',
    title: 'Self-Correction Distractor Recognition',
    prompt:
      'Speaker: "The original lecture was scheduled for Room 204, but due to plumbing repairs, it was relocated to Room 315, although the seminar next Friday will be in Room 102." Where is today\'s lecture?',
    options: ['Room 204', 'Room 315', 'Room 102', 'Room 214'],
    correctAnswer: 1,
    explanation: 'Room 204 was relocated to Room 315 for today; Room 102 is a future distractor for next Friday.',
    recommendedLessonId: 'l2-listening-paraphrase-distractors',
  },
  {
    id: 'qb-lis-3',
    skill: 'listening',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'fill-blank',
    topicTag: 'Listening Word Limits & Paraphrasing',
    title: 'Section 4 Note Completion Paraphrase (ONE WORD ONLY)',
    prompt:
      'Audio: "Although early solar cells were praised for their durability, their widespread adoption was hindered by their exorbitant manufacturing cost." Note: "Early solar cells were not widely adopted due to their high ________ (ONE WORD ONLY)."',
    correctAnswer: 'cost',
    explanation: '"Hindered by" paraphrases "not widely adopted due to", and "exorbitant" paraphrases "high", leaving the head noun "cost".',
    recommendedLessonId: 'l2-listening-paraphrase-distractors',
  },
  {
    id: 'qb-lis-4',
    skill: 'listening',
    examTrack: 'both',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Listening Map Labelling & Spatial Prepositions',
    title: 'Section 2 Map Orientation Logic',
    prompt:
      'Guide: "Entering from the South Gate facing north, walk straight past the lily pond; the building immediately adjacent to the bridge on the eastern bank is the Herbarium." Where is the Herbarium?',
    options: [
      'Just inside the South Gate on the left',
      'Next to the bridge on the right-hand (eastern) bank',
      'Across the river on the western bank',
      'In the middle of the lily pond',
    ],
    correctAnswer: 1,
    explanation: '"Adjacent to" means next to, and facing north, the eastern bank is on the right-hand side.',
    recommendedLessonId: 'l3-listening-maps-accents',
  },
  {
    id: 'qb-lis-5',
    skill: 'listening',
    examTrack: 'both',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Listening Section 3 Academic Consensus',
    title: 'Section 3 Peer Rejection & Tutor Agreement',
    prompt:
      'Audio: "Maya: Shall we interview fifty local retailers? Leo: That will take three weeks; we only have five days. Dr. Grant: Leo is right—focus on ten in-depth case studies instead." What methodology will the students use?',
    options: [
      'Fifty retailer interviews',
      'Ten in-depth case studies',
      'An online postal survey',
      'A three-week observation',
    ],
    correctAnswer: 1,
    explanation: 'Maya\'s suggestion (50 interviews) is rejected due to time constraints; the tutor confirms "ten in-depth case studies".',
    recommendedLessonId: 'l3-listening-maps-accents',
  },

  // ==================== READING DRILLS (ACADEMIC & GENERAL) ====================
  {
    id: 'qb-read-1',
    skill: 'reading',
    examTrack: 'both',
    difficulty: 'beginner',
    format: 'multiple-choice',
    topicTag: 'Reading Skimming & Scanning Anchors',
    title: 'Selecting Type A Scanning Anchors',
    prompt:
      'Which keyword in the question "What did the 1987 Montreal Protocol require industrial manufacturers to phase out?" should you scan the passage for FIRST?',
    options: ['require', '1987 Montreal Protocol', 'industrial', 'phase out'],
    correctAnswer: 1,
    explanation: 'Numbers ("1987") and capitalised proper nouns ("Montreal Protocol") cannot be paraphrased and stand out immediately when scanning.',
    recommendedLessonId: 'l1-reading-skimming-scanning',
  },
  {
    id: 'qb-read-2',
    skill: 'reading',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'true-false-ng',
    topicTag: 'Reading True / False / Not Given Logic',
    title: 'Distinguishing FALSE from NOT GIVEN (Comparison Trap)',
    prompt:
      'Passage: "Professor Higgins published three monograph studies on Andean condors before retiring in 2012." Statement: "Professor Higgins was the most famous ornithologist in South America."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctAnswer: 2,
    explanation: 'The passage states his publications and retirement year, but makes no comparison regarding his fame relative to other ornithologists → NOT GIVEN.',
    recommendedLessonId: 'l4-reading-tfng-mastery',
  },
  {
    id: 'qb-read-3',
    skill: 'reading',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'true-false-ng',
    topicTag: 'Reading True / False / Not Given Qualifiers',
    title: 'Qualifier Contradiction Trap ("Solely / Only")',
    prompt:
      'Passage: "While volcanic eruptions release substantial sulphur dioxide, anthropogenic coal combustion accounts for over 70% of atmospheric sulphate aerosols." Statement: "Atmospheric sulphate aerosols are produced exclusively by volcanic eruptions."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctAnswer: 1,
    explanation: 'The passage states coal combustion accounts for over 70%, directly contradicting "exclusively by volcanic eruptions" → FALSE.',
    recommendedLessonId: 'l4-reading-tfng-mastery',
  },
  {
    id: 'qb-read-4',
    skill: 'reading',
    examTrack: 'academic',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Academic Reading Matching Headings',
    title: 'Paragraph Heading Selection with Pivot Contrast',
    prompt:
      'Paragraph D: "Early proponents of vertical farming predicted it would replace rural wheat fields within a decade. In reality, the prohibitive electricity cost of artificial LED lighting restricts vertical farms to high-margin leafy greens and herbs." Choose the best Heading:',
    options: [
      'i. How wheat is harvested in rural areas',
      'ii. Economic constraints limiting the scope of vertical agriculture',
      'iii. The invention of LED lighting',
      'iv. Why leafy greens are unpopular',
    ],
    correctAnswer: 1,
    explanation: 'The pivot "In reality,..." introduces the core thesis of the paragraph: economic/electricity constraints limiting what vertical farms can grow.',
    recommendedLessonId: 'l2-reading-academic-headings-matching',
  },
  {
    id: 'qb-read-5',
    skill: 'reading',
    examTrack: 'academic',
    difficulty: 'advanced',
    format: 'fill-blank',
    topicTag: 'Academic Reading Summary Completion',
    title: 'Verbatim Passage Summary Completion (ONE WORD ONLY)',
    prompt:
      'Passage: "Deep-sea hydrothermal vents support thriving ecosystems powered not by sunlight, but by chemosynthesis." Summary: "Unlike surface habitats that rely on solar energy, hydrothermal vent ecosystems are sustained by ________ (ONE WORD ONLY)."',
    correctAnswer: 'chemosynthesis',
    explanation: '"Sustained by" paraphrases "powered by", pointing to the exact noun "chemosynthesis".',
    recommendedLessonId: 'l3-reading-academic-completion',
  },
  {
    id: 'qb-read-6',
    skill: 'reading',
    examTrack: 'general',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'General Training Workplace Policies',
    title: 'Section 2 Workplace Policy Conditional Exception',
    prompt:
      'Company Policy: "All warehouse staff must complete the fire-marshal refresher module by Friday 18th, with the exception of night-shift supervisors who completed certified first-responder training in May." Who is exempt from Friday\'s module?',
    options: [
      'All warehouse staff',
      'Night-shift supervisors who completed certified first-responder training in May',
      'New daytime fork-lift drivers',
      'No one is exempt',
    ],
    correctAnswer: 1,
    explanation: '"With the exception of..." explicitly exempts night-shift supervisors who completed the May training.',
    recommendedLessonId: 'l2-reading-gt-notices-workplace',
  },
  {
    id: 'qb-read-7',
    skill: 'reading',
    examTrack: 'general',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'General Training Section 3 Implied Meaning',
    title: 'Section 3 Rhetorical Negation ("Far from being...")',
    prompt:
      'Passage: "Far from being an overnight stroke of luck, the invention of the marine chronometer required John Harrison forty years of relentless mechanical refinement." What is the writer emphasizing?',
    options: [
      'Harrison invented the chronometer by accident in one night.',
      'The chronometer was the result of decades of persistent, painstaking engineering rather than sudden luck.',
      'The chronometer was never completed.',
      'Sailors refused to use Harrison\'s clock.',
    ],
    correctAnswer: 1,
    explanation: '"Far from being X, it required Y" negates X (overnight luck) and highlights Y (40 years of relentless refinement).',
    recommendedLessonId: 'l3-reading-gt-extended-passage',
  },

  // ==================== WRITING DRILLS (ACADEMIC, GT & TASK 2) ====================
  {
    id: 'qb-wrt-1',
    skill: 'writing',
    examTrack: 'academic',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'Academic Task 1 Overview Formula',
    title: 'Task 1 Band 8 Overview Identification',
    prompt: 'Which of the following belongs in a Band 8 Academic Task 1 Overview paragraph?',
    options: [
      'In 2018, solar generation was precisely 42.4% while wind was 18.2%.',
      'Overall, solar power experienced exponential growth throughout the period, whereas coal consumption plummeted.',
      'I believe wind power is the best source of sustainable electricity for Europe.',
      'The graph has a horizontal axis showing years and a vertical axis in megawatts.',
    ],
    correctAnswer: 1,
    explanation: 'Overviews must capture overarching macro trends and contrasts without raw numerical clutter or personal opinions.',
    recommendedLessonId: 'l4-task1-overview-strategy',
  },
  {
    id: 'qb-wrt-2',
    skill: 'writing',
    examTrack: 'academic',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'Academic Task 1 Prepositions & Data Grouping',
    title: 'Data Preposition Precision (by vs of vs to)',
    prompt: 'Select the sentence with 100% accurate Task 1 data prepositions:',
    options: [
      'Beef consumption fell by 40 grams, experiencing a drop of 25% between 2005 and 2020.',
      'Beef consumption fell of 40 grams, experiencing a drop by 25%.',
      'Beef consumption peaked by 200 grams in 2005.',
      'There was a decline to 25% in beef consumption from 100 to 75.',
    ],
    correctAnswer: 0,
    explanation: 'Verbs take "by" ("fell by 40 grams"), whereas nouns take "of" ("a drop of 25%").',
    recommendedLessonId: 'l2-writing-acad-charts-trends',
  },
  {
    id: 'qb-wrt-3',
    skill: 'writing',
    examTrack: 'academic',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Academic Task 1 Maps & Processes',
    title: 'Map Transformation Lexical Choice',
    prompt: 'Which sentence uses the most accurate lexical verbs to describe a Map change?',
    options: [
      'The forest in the north-west was demolished and a supermarket was planted.',
      'The woodland in the north-west was cleared to make way for a new supermarket complex, which was erected in 2018.',
      'The trees decreased sharply into a supermarket.',
      'A supermarket happened in the north-west.',
    ],
    correctAnswer: 1,
    explanation: 'Woodland/trees are "cleared" (or "felled"), and buildings are "erected" (or "constructed").',
    recommendedLessonId: 'l3-writing-acad-maps-processes',
  },
  {
    id: 'qb-wrt-4',
    skill: 'writing',
    examTrack: 'general',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'General Training Letter Register & Tone',
    title: 'Formal Letter Register & Salutation Pairing',
    prompt: 'Which opening and closing pair is required for a Formal Letter of complaint to an insurance company where you do not know the manager\'s name?',
    options: [
      'Dear Sir or Madam, ... Yours faithfully,',
      'Dear Sir or Madam, ... Yours sincerely,',
      'Hi Insurance Manager, ... Best wishes,',
      'Dear Mr. Insurance, ... Cheers,',
    ],
    correctAnswer: 0,
    explanation: '"Dear Sir or Madam," always pairs with "Yours faithfully," in formal business correspondence.',
    recommendedLessonId: 'l2-writing-gt-letters-register',
  },
  {
    id: 'qb-wrt-5',
    skill: 'writing',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'Writing Task 2 Thesis & Introductions',
    title: 'Task 2 Thesis Statement Clarity',
    prompt: 'Prompt: "Some people believe university education should be free for everyone. To what extent do you agree or disagree?" Select the strongest Band 8 Thesis Statement:',
    options: [
      'In this essay I will discuss the pros and cons of free university and give my view at the end.',
      'While abolishing tuition fees entirely would strain public budgets, I firmly believe that governments should provide means-tested scholarships so that no qualified student is excluded on financial grounds.',
      'University is very important in the modern world today.',
      'There are many reasons why people go to university.',
    ],
    correctAnswer: 1,
    explanation: 'Option B states a clear, nuanced position ("While..., I firmly believe...") directly answering "To what extent" right in the introduction.',
    recommendedLessonId: 'l2-writing-task2-planning-intros',
  },
  {
    id: 'qb-wrt-6',
    skill: 'writing',
    examTrack: 'both',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Writing Task 2 PEEL & Organic Cohesion',
    title: 'Replacing Mechanical Linkers with Demonstrative Cohesion',
    prompt: 'Choose the best revision to eliminate mechanical linking in: "Cities are investing in underground metro lines. Moreover, this reduces surface congestion. Furthermore, it lowers air pollution."',
    options: [
      'Cities are investing in underground metro lines. Secondly, this reduces congestion. Thirdly, it lowers pollution.',
      'Many municipalities are expanding underground metro networks, a measure that simultaneously alleviates surface gridlock and curbs vehicular air pollution.',
      'Metro lines are good. Also, cars are bad.',
      'In conclusion, metro lines reduce congestion.',
    ],
    correctAnswer: 1,
    explanation: 'Using an appositive noun phrase ("a measure that simultaneously alleviates... and curbs...") achieves Band 8.5 organic cohesion.',
    recommendedLessonId: 'l3-writing-task2-body-cohesion',
  },

  // ==================== SPEAKING DRILLS ====================
  {
    id: 'qb-spk-1',
    skill: 'speaking',
    examTrack: 'both',
    difficulty: 'beginner',
    format: 'multiple-choice',
    topicTag: 'Speaking Pronunciation & Stress',
    title: 'Syllable Stress Shift in Word Families',
    prompt: 'Where does the primary syllable stress fall in the adjective "e-co-NOM-ic" compared to the noun "e-CON-o-my"?',
    options: [
      'Third syllable (NOM) in economic vs second syllable (CON) in economy',
      'First syllable in both words',
      'Last syllable in both words',
      'Stress does not matter in English',
    ],
    correctAnswer: 0,
    explanation: 'Words ending in "-ic" place primary stress on the syllable immediately preceding "-ic" (e-co-NOM-ic).',
    recommendedLessonId: 'l1-speaking-pronunciation-fluency',
  },
  {
    id: 'qb-spk-2',
    skill: 'speaking',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'multiple-choice',
    topicTag: 'Speaking Part 1 Natural Extension',
    title: 'Part 1 A-R-E Extension & Spoken Register',
    prompt: 'Examiner: "Do you prefer spending your free time indoors or outdoors?" Which response demonstrates Band 8 spoken register?',
    options: [
      'Indoors.',
      'Furthermore, I prefer indoors. Moreover, indoors has air conditioning. In conclusion, indoors is better.',
      'Honestly, I’m a bit of an outdoors enthusiast, mainly because my weekday job keeps me glued to a computer screen. Whenever the weather cooperates at the weekend, I love heading out for a coastal hike to clear my head.',
      'According to a recent scientific survey of 10,000 citizens, outdoors is healthier.',
    ],
    correctAnswer: 2,
    explanation: 'Option C uses natural idiomatic vocabulary ("outdoors enthusiast", "glued to a computer screen", "clear my head") and follows the 3-step A-R-E structure.',
    recommendedLessonId: 'l2-speaking-part1-mastery',
  },
  {
    id: 'qb-spk-3',
    skill: 'speaking',
    examTrack: 'both',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Speaking Part 3 Abstract Discussion',
    title: 'Part 3 Buying Thinking Time & Societal Generalisation',
    prompt: 'Select the most natural Band 8 opener to buy thinking time on a difficult Speaking Part 3 question:',
    options: [
      '"Um... uh... I don\'t know..."',
      '"That is a thought-provoking question; when we look at how this affects different socioeconomic groups..."',
      '"Wait a second, let me think..."',
      '"Nothing to say about that."',
    ],
    correctAnswer: 1,
    explanation: 'Natural analytical framing ("That is a thought-provoking question; when we look at...") maintains fluency while pivoting immediately to societal analysis.',
    recommendedLessonId: 'l3-speaking-part3-discussion',
  },

  // ==================== GRAMMAR & LEXIS DRILLS ====================
  {
    id: 'qb-grm-1',
    skill: 'grammar',
    examTrack: 'both',
    difficulty: 'beginner',
    format: 'multiple-choice',
    topicTag: 'Subject-Verb Agreement & Uncountables',
    title: 'Head Noun Agreement Across Prepositional Phrases',
    prompt: 'Select the sentence with 100% accurate subject-verb agreement:',
    options: [
      'The percentage of households with solar panels have doubled.',
      'The percentage of households with solar panels has doubled.',
      'A large number of scientific researches is published daily.',
      'Each of the candidates were interviewed.',
    ],
    correctAnswer: 1,
    explanation: 'The singular head noun "The percentage" requires the singular auxiliary verb "has".',
    recommendedLessonId: 'l1-subject-verb-agreement',
  },
  {
    id: 'qb-grm-2',
    skill: 'grammar',
    examTrack: 'both',
    difficulty: 'intermediate',
    format: 'fill-blank',
    topicTag: 'Conditionals & Modal Verbs',
    title: 'Formal Inverted Second Conditional',
    prompt: 'Complete the formal inverted conditional: "_______ municipal authorities to make public buses free, commuter traffic would drop by a third." (ONE WORD)',
    correctAnswer: 'Were',
    explanation: '"Were + subject + to + infinitive" is the Band 8 inverted second conditional.',
    recommendedLessonId: 'l2-conditionals',
  },
  {
    id: 'qb-grm-3',
    skill: 'grammar',
    examTrack: 'both',
    difficulty: 'advanced',
    format: 'multiple-choice',
    topicTag: 'Academic Hedging & Negative Inversion',
    title: 'Negative Inversion Word Order',
    prompt: 'Identify the sentence with accurate Band 8 negative inversion:',
    options: [
      'Not only does urban green space lower ambient temperatures, but it also enhances residents\' mental well-being.',
      'Not only urban green space lowers ambient temperatures, but it also enhances well-being.',
      'Not only does urban green space lowers ambient temperatures, it also enhances well-being.',
      'Rarely cities invest enough in public parks.',
    ],
    correctAnswer: 0,
    explanation: '"Not only" at the start of a clause triggers auxiliary inversion: "does + singular subject (urban green space) + base verb (lower)".',
    recommendedLessonId: 'l3-academic-hedging',
  },
];

interface PracticeExercisesProps {
  onOpenRecommendedLesson?: (lessonId: string) => void;
}

export const PracticeExercises: React.FC<PracticeExercisesProps> = ({ onOpenRecommendedLesson }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'academic' | 'general'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const [answers, setAnswers] = useState<{ [id: string]: string | number }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const filtered = QUALITY_QUESTION_BANK.filter((q) => {
    const matchSkill = selectedSkill === 'all' || q.skill === selectedSkill;
    const matchTrack = selectedTrack === 'all' || q.examTrack === 'both' || q.examTrack === selectedTrack;
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchSkill && matchTrack && matchDiff;
  });

  const handleAnswer = (qId: string, val: string | number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const isQuestionCorrect = (q: QualityDrillQuestion): boolean => {
    const userAns = answers[q.id];
    if (userAns === undefined || userAns === '') return false;
    if (typeof q.correctAnswer === 'number') {
      return userAns === q.correctAnswer;
    }
    return isAnswerMatch(String(userAns), String(q.correctAnswer));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;

    filtered.forEach((q) => {
      if (isQuestionCorrect(q)) {
        correct++;
        storageService.clearWeakTopic(q.id);
      } else {
        // Log missed topic so the Smart Personal Learning Pathway can recommend targeted remediation!
        storageService.recordWeakTopic(q.id, q.topicTag, q.skill, q.recommendedLessonId);
      }
    });

    storageService.incrementStudyTime(10);

    if (correct >= Math.ceil(filtered.length * 0.8)) {
      audioService.playChime('correct');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      audioService.playChime('wrong');
    }
  };

  const correctCount = submitted ? filtered.filter((q) => isQuestionCorrect(q)).length : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              <Dumbbell className="w-4 h-4" />
              <span>Quality-Controlled Question Bank ({QUALITY_QUESTION_BANK.length} Validated Drills)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Progressive IELTS Skill & Strategy Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Filter by Exam Track, Skill, and Difficulty Stage (Beginner → Intermediate → Advanced). Missed questions automatically update your Smart Personal Learning Pathway with targeted remediation lessons.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 max-w-xs leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Original Practice Material
            </span>
            Calibrated to official IELTS specifications; distinct from copyrighted Cambridge past papers.
          </div>
        </div>

        {/* Multi-Dimensional Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Skill Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {(['all', 'listening', 'reading', 'writing', 'speaking', 'grammar'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedSkill(s);
                  setSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedSkill === s
                    ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Track Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['all', 'academic', 'general'] as const).map((tr) => (
                <button
                  key={tr}
                  onClick={() => {
                    setSelectedTrack(tr);
                    setSubmitted(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedTrack === tr
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {tr === 'all' ? 'All Tracks' : tr === 'academic' ? 'Academic' : 'General Training'}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setSubmitted(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score & Remediation Summary Banner after Submit */}
      {submitted && (
        <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
              Diagnostic Drill Results
            </span>
            <h3 className="text-lg font-black">
              You scored {correctCount} / {filtered.length} ({Math.round((correctCount / Math.max(filtered.length, 1)) * 100)}%)
            </h3>
            <p className="text-xs text-slate-300">
              {correctCount === filtered.length
                ? 'Flawless mastery across this drill set!'
                : 'Review the explanations and launch the recommended remediation lessons below for any missed items.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-center"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Drill Set</span>
          </button>
        </div>
      )}

      {/* Drills List */}
      <div className="space-y-4">
        {filtered.map((q, index) => {
          const userAns = answers[q.id];
          const isCorrect = submitted && isQuestionCorrect(q);

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-red-300 bg-red-50/40 dark:bg-red-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-red-600">
                    {q.skill} • Drill #{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      q.difficulty === 'beginner'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : q.difficulty === 'intermediate'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  {q.examTrack !== 'both' && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {q.examTrack === 'academic' ? 'Academic Track' : 'General Training'}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500">{q.title}</span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {q.prompt}
              </p>

              {q.options && q.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleAnswer(q.id, oIdx)}
                      className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        userAns === oIdx
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="inline-block w-5 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="max-w-md">
                  <input
                    type="text"
                    disabled={submitted}
                    value={userAns !== undefined ? String(userAns) : ''}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder="Type your exact answer..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              {submitted && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`font-extrabold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Incorrect — Correct Answer:{' '}
                          {typeof q.correctAnswer === 'number' && q.options
                            ? q.options[q.correctAnswer]
                            : String(q.correctAnswer)}
                        </>
                      )}
                    </span>

                    {!isCorrect && onOpenRecommendedLesson && (
                      <button
                        type="button"
                        onClick={() => onOpenRecommendedLesson(q.recommendedLessonId)}
                        className="px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold text-[11px] flex items-center gap-1 hover:bg-red-100"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Study Remediation Lesson ({q.topicTag}) →</span>
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Explanation: </strong>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-slate-400">
          {Object.keys(answers).length} of {filtered.length} answered
        </span>

        {!submitted && (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-transform hover:scale-105"
          >
            Check All Drill Answers
          </button>
        )}
      </div>
    </div>
  );
};
