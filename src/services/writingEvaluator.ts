// IELTS Writing Evaluator Engine - Strict 4-Criteria Assessment
import { WritingEvaluation, WritingPrompt } from '../types/ielts';

const ACADEMIC_WORDS = new Set([
  'analyze', 'analysis', 'approach', 'area', 'assessment', 'assume', 'authority', 'available', 'benefit',
  'concept', 'consistent', 'constitutional', 'context', 'contract', 'create', 'data', 'definition',
  'derived', 'distribution', 'economic', 'environment', 'established', 'estimate', 'evidence', 'factor',
  'financial', 'formula', 'function', 'identify', 'income', 'indicate', 'individual', 'interpretation',
  'involved', 'issues', 'labor', 'legal', 'legislation', 'major', 'method', 'occur', 'percent', 'period',
  'policy', 'principle', 'procedure', 'process', 'required', 'research', 'response', 'role', 'section',
  'sector', 'significant', 'similar', 'source', 'specific', 'structure', 'theory', 'variables', 'achieve',
  'acquisition', 'administration', 'affect', 'appropriate', 'aspects', 'assistance', 'category', 'chapter',
  'commission', 'community', 'complex', 'computer', 'conclusion', 'conduct', 'consequences', 'construction',
  'consumer', 'credit', 'cultural', 'design', 'distinction', 'elements', 'equation', 'evaluation', 'features',
  'final', 'focus', 'impact', 'injury', 'institute', 'investment', 'items', 'journal', 'maintenance',
  'normal', 'obtained', 'participation', 'perceived', 'positive', 'potential', 'previous', 'primary',
  'purchase', 'range', 'region', 'regulations', 'relevant', 'resident', 'resources', 'restricted', 'security',
  'sought', 'select', 'site', 'strategies', 'survey', 'text', 'traditional', 'transfer', 'alternative',
  'circumstances', 'comments', 'compensation', 'components', 'consent', 'considerable', 'constant',
  'constraints', 'contribution', 'convention', 'coordination', 'core', 'corporate', 'corresponding', 'criteria',
  'deduction', 'demonstrate', 'document', 'dominant', 'emphasis', 'ensure', 'excluded', 'framework', 'funds',
  'illustrated', 'immigration', 'implies', 'initial', 'instance', 'interaction', 'justification', 'layer',
  'link', 'location', 'maximum', 'minorities', 'negative', 'outcomes', 'partnership', 'philosophy', 'physical',
  'proportion', 'published', 'reaction', 'registered', 'reliance', 'removed', 'scheme', 'sequence', 'shift',
  'specified', 'sufficient', 'task', 'technical', 'techniques', 'technology', 'validity', 'volume', 'overall',
  'consequently', 'furthermore', 'nevertheless', 'predominantly', 'substantial', 'exponentially', 'negligible'
]);

const INFORMAL_PATTERNS = [
  { regex: /\b(a lot of|lots of)\b/gi, fix: 'a substantial amount of / numerous', reason: 'Informal quantifier in academic writing.', allowInInformalLetter: true },
  { regex: /\b(kids)\b/gi, fix: 'children / adolescents', reason: 'Colloquial term for young people.', allowInInformalLetter: true },
  { regex: /\b(stuff|things)\b/gi, fix: 'aspects / factors / elements', reason: 'Vague colloquial noun.', allowInInformalLetter: false },
  { regex: /\b(gonna|wanna|gotta)\b/gi, fix: 'going to / want to / must', reason: 'Slang contraction.', allowInInformalLetter: false },
  { regex: /\b(don't|can't|won't|isn't|aren't|didn't|haven't|hasn't|I'm|it's)\b/gi, fix: 'expand to full forms (do not, cannot, will not)', reason: 'Contractions should be avoided in formal IELTS writing and Academic essays.', allowInInformalLetter: true },
  { regex: /\b(bad)\b/gi, fix: 'detrimental / adverse / unfavorable', reason: 'Overly simplistic adjective.', allowInInformalLetter: true },
  { regex: /\b(good)\b/gi, fix: 'beneficial / advantageous / favorable', reason: 'Overly simplistic adjective.', allowInInformalLetter: true },
  { regex: /\b(in a nutshell)\b/gi, fix: 'in conclusion / to summarize', reason: 'Informal idiom inappropriate for Task 1/2.', allowInInformalLetter: false },
];

const COHESIVE_MARKERS = [
  'furthermore', 'moreover', 'in addition', 'consequently', 'as a result',
  'however', 'nevertheless', 'on the other hand', 'by contrast', 'in comparison',
  'firstly', 'secondly', 'finally', 'for instance', 'for example', 'namely',
  'to illustrate', 'in conclusion', 'to summarize', 'overall', 'whereas', 'while',
  'despite', 'in spite of', 'therefore', 'thus', 'accordingly', 'conversely'
];

export function evaluateWritingSubmission(
  text: string,
  prompt: WritingPrompt
): WritingEvaluation {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const sentences = text.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
  const detectedErrors: WritingEvaluation['detectedErrors'] = [];

  const isInformalLetter = prompt.subType === 'letter-informal';
  const isGTLetter = prompt.taskType === 'task1' && prompt.examType === 'general';
  const isAcademicTask1 = prompt.taskType === 'task1' && prompt.examType === 'academic';
  const isQuantitativeChart =
    isAcademicTask1 &&
    ['line-graph', 'bar-chart', 'pie-chart', 'table', 'combined-chart'].includes(prompt.subType);

  // 1. Task Achievement / Task Response Score
  const minRequired = prompt.minWordCount;
  let trScore = 6.0;
  let missingTaskNotes: string[] = [];

  if (wordCount < 80) {
    trScore = 4.0;
    missingTaskNotes.push(`Severely underlength (${wordCount}/${minRequired} words).`);
  } else if (wordCount < minRequired - 30) {
    trScore = 5.0; // Heavy penalty for underlength
    missingTaskNotes.push(`Under minimum word requirement (${wordCount}/${minRequired} words).`);
  } else if (wordCount < minRequired) {
    trScore = 5.5;
    missingTaskNotes.push(`Slightly under the ${minRequired}-word minimum (${wordCount} words).`);
  } else {
    if (paragraphs.length >= 3) trScore += 0.5;
    if (paragraphs.length >= 4) trScore += 0.5;

    const promptKeywords = prompt.title.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const hits = promptKeywords.filter((k) => k.length > 4 && textLower.includes(k));
    if (hits.length >= 2) trScore += 0.5;
    if (wordCount >= minRequired + 25 && wordCount <= minRequired + 160) {
      trScore += 0.5;
    }
  }

  // Academic Task 1 specific Task Achievement checks
  if (isAcademicTask1) {
    const hasOverview = /\b(overall|in summary|it is noticeable that|broadly speaking|it is evident that|at first glance)\b/i.test(text);
    if (!hasOverview) {
      trScore = Math.min(trScore, 5.5); // Official IELTS TA descriptor: no clear overview caps TA at Band 5/5.5
      missingTaskNotes.push('Missing a clear Overview paragraph (use "Overall, it is evident that..."). Without an overview, Task Achievement cannot exceed Band 5.5.');
      detectedErrors.push({
        type: 'grammar',
        snippet: 'Missing Task 1 Overview Signpost',
        suggestion: 'Begin paragraph 2 with "Overall, it is immediately apparent that..."',
        explanation: 'Official IELTS Academic Task 1 descriptors cap Task Achievement at Band 5 if there is no clear overview.',
      });
    }

    if (isQuantitativeChart && !/\d/.test(text)) {
      trScore -= 1.0;
      missingTaskNotes.push('No specific figures, percentages, or years cited from the chart/table.');
      detectedErrors.push({
        type: 'vocab',
        snippet: 'No numerical data cited',
        suggestion: 'Support key trend statements with exact figures/percentages from the chart',
        explanation: 'Academic Task 1 requires key features to be supported by data from the visual figure.',
      });
    }

    if (/\b(i think|in my opinion|i believe|we should|governments must)\b/i.test(text)) {
      trScore -= 0.5;
      detectedErrors.push({
        type: 'vocab',
        snippet: 'Personal opinion / speculation in Academic Task 1',
        suggestion: 'Remove personal opinions; report only factual visual data',
        explanation: 'Academic Writing Task 1 is an objective factual report; personal opinions lower Task Achievement.',
      });
    }
  }

  // General Training Task 1 Letter checks
  if (isGTLetter) {
    if (!/\bdear\s+/i.test(text)) {
      trScore -= 0.5;
      missingTaskNotes.push('Missing standard letter salutation ("Dear ...,").');
      detectedErrors.push({
        type: 'grammar',
        snippet: 'Missing Salutation',
        suggestion: 'Begin your letter with "Dear Sir or Madam," or "Dear [Name],"',
        explanation: 'General Training Task 1 letters must open with an appropriate salutation.',
      });
    }
    if (!/\b(yours faithfully|yours sincerely|best wishes|warm regards|kind regards)\b/i.test(text)) {
      trScore -= 0.5;
      missingTaskNotes.push('Missing appropriate letter sign-off ("Yours faithfully," / "Yours sincerely," / "Best wishes,").');
    }
  }

  // Task 2 Essay checks
  if (prompt.taskType === 'task2') {
    const hasConclusion = /\b(in conclusion|to conclude|to sum up|in summary|overall, while|ultimately)\b/i.test(text);
    if (!hasConclusion && wordCount >= 120) {
      trScore -= 0.5;
      missingTaskNotes.push('Missing a clearly signposted concluding paragraph ("In conclusion,...").');
    }
  }

  // Check for verbatim prompt copying
  const cleanPromptStart = prompt.promptText.split('\n')[0].trim().toLowerCase().slice(0, 45);
  if (cleanPromptStart.length > 25 && text.toLowerCase().includes(cleanPromptStart)) {
    trScore -= 0.5;
    detectedErrors.push({
      type: 'vocab',
      snippet: 'Verbatim copying of prompt opening',
      suggestion: 'Paraphrase the prompt using synonyms and altered clause structure',
      explanation: 'Words copied directly from the question prompt are not counted by IELTS examiners.',
    });
  }

  trScore = Math.min(8.5, Math.max(3.5, trScore));

  // 2. Coherence and Cohesion
  let ccScore = 5.5;
  if (paragraphs.length >= 3 && paragraphs.length <= 5) {
    ccScore += 0.5;
  }
  const foundCohesive = new Set<string>();
  COHESIVE_MARKERS.forEach((marker) => {
    if (text.toLowerCase().includes(marker)) {
      foundCohesive.add(marker);
    }
  });

  if (foundCohesive.size >= 3) ccScore += 0.5;
  if (foundCohesive.size >= 6) ccScore += 0.5;
  if (foundCohesive.size >= 9) ccScore += 0.5;

  if (prompt.taskType === 'task1') {
    if (/overall|in summary|it is noticeable that|broadly speaking|dear\s/i.test(text)) {
      ccScore += 0.5;
    }
  } else {
    if (/in conclusion|to conclude|to sum up|in summary/i.test(text)) {
      ccScore += 0.5;
    }
  }
  if (wordCount < 100) {
    ccScore = Math.min(ccScore, 5.0);
  }
  ccScore = Math.min(8.5, Math.max(4.0, ccScore));

  // 3. Lexical Resource
  let lrScore = 5.5;
  let academicWordCount = 0;
  const wordFreq: { [key: string]: number } = {};

  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (clean) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      if (ACADEMIC_WORDS.has(clean)) {
        academicWordCount++;
      }
    }
  });

  const academicRatio = wordCount > 0 ? (academicWordCount / wordCount) * 100 : 0;
  if (academicRatio >= 4 || isInformalLetter) lrScore += 0.5;
  if (academicRatio >= 8) lrScore += 0.5;
  if (academicRatio >= 12) lrScore += 0.5;

  // Deduct for informal patterns (respecting Informal Letter register!)
  INFORMAL_PATTERNS.forEach((pattern) => {
    if (isInformalLetter && pattern.allowInInformalLetter) return;
    const matches = text.match(pattern.regex);
    if (matches) {
      matches.slice(0, 2).forEach((m) => {
        detectedErrors.push({
          type: 'vocab',
          snippet: m,
          suggestion: pattern.fix,
          explanation: pattern.reason,
        });
      });
      lrScore -= 0.25;
    }
  });

  // Check repetitive words
  const overused = Object.entries(wordFreq).filter(([k, count]) => count >= 5 && k.length > 4);
  if (overused.length > 2) {
    lrScore -= 0.25;
    detectedErrors.push({
      type: 'vocab',
      snippet: overused.map(([k, c]) => `"${k}" (${c}x)`).join(', '),
      suggestion: 'Use synonyms and varied pronouns',
      explanation: 'Over-repetition of specific nouns or verbs lowers Lexical Resource to Band 5/6.',
    });
  }
  if (wordCount < 100) {
    lrScore = Math.min(lrScore, 5.0);
  }
  lrScore = Math.min(8.5, Math.max(4.0, lrScore));

  // 4. Grammatical Range and Accuracy
  let graScore = 5.5;
  const complexConnectors = /(although|even though|because|since|whereas|while|provided that|unless|which|who|whom|whose|if\s)/i;
  const complexCount = sentences.filter((s) => complexConnectors.test(s)).length;
  const complexRatio = sentences.length > 0 ? complexCount / sentences.length : 0;

  if (complexRatio >= 0.3) graScore += 0.5;
  if (complexRatio >= 0.5) graScore += 0.5;

  if (/(is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en)\b/i.test(text)) {
    graScore += 0.5;
  }

  if (/\.\.|\,\,/.test(text)) {
    detectedErrors.push({
      type: 'punctuation',
      snippet: 'Punctuation duplication',
      suggestion: 'Single punctuation mark',
      explanation: 'Accidental double commas or periods should be eliminated.',
    });
    graScore -= 0.2;
  }

  const uncapitalized = sentences.filter((s) => s.length > 0 && /^[a-z]/.test(s.trim()));
  if (uncapitalized.length > 0) {
    detectedErrors.push({
      type: 'grammar',
      snippet: uncapitalized[0].slice(0, 30) + '...',
      suggestion: 'Capitalize first letter',
      explanation: 'Every sentence must begin with an uppercase letter.',
    });
    graScore -= 0.3;
  }
  if (wordCount < 100) {
    graScore = Math.min(graScore, 5.0);
  }
  graScore = Math.min(8.5, Math.max(4.0, graScore));

  // Overall Band calculation (Average of the 4 rounded to nearest 0.5)
  const rawAverage = (trScore + ccScore + lrScore + graScore) / 4;
  const roundedBand = Math.round(rawAverage * 2) / 2;

  // Build detailed criterion feedback
  const taskFeedback =
    missingTaskNotes.length > 0
      ? `Task Alert: ${missingTaskNotes.join(' ')}`
      : `Good job meeting the minimum word requirement (${wordCount} words) and addressing the core requirements of this ${
          isAcademicTask1 ? 'Academic Task 1 visual report' : isGTLetter ? 'General Training letter' : 'Task 2 discursive essay'
        }.`;

  const coherenceFeedback =
    paragraphs.length < 3
      ? `Your writing needs clearer paragraph division (${paragraphs.length} paragraph detected). Use 4 well-structured paragraphs with clear topic sentences and transitions.`
      : `Paragraphing is effective (${paragraphs.length} paragraphs). You utilized ${foundCohesive.size} cohesive transitions such as ${Array.from(foundCohesive).slice(0, 4).join(', ') || 'basic linkers'}.`;

  const lexicalFeedback =
    academicRatio >= 6
      ? `Strong lexical variety! Approximately ${academicRatio.toFixed(1)}% of your vocabulary consists of Academic Word List items with appropriate register.`
      : isInformalLetter
      ? `Your vocabulary matches an informal letter register well. Incorporate natural phrasal verbs and descriptive collocations to reach Band 8+.`
      : `To attain Band 7.0+, incorporate more precise academic collocations and formal synonyms instead of basic everyday terms.`;

  const grammarFeedback =
    complexRatio >= 0.4
      ? `Solid variety of complex structures and subordinate clauses (${Math.round(complexRatio * 100)}% complex sentences).`
      : `Increase your use of subordinate clauses, conditionals, and passive voice to demonstrate a wider grammatical range.`;

  const improvedSentences: WritingEvaluation['improvedSentences'] = [];
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    if (isAcademicTask1) {
      improvedSentences.push({
        original: firstSentence,
        enhanced: `The provided ${prompt.subType.replace('-', ' ')} delineates the significant variations and quantitative patterns in ${prompt.title.toLowerCase()}.`,
        explanation: 'Academic paraphrasing of the visual figure demonstrates strong Band 8+ opening technique.',
      });
    } else if (isGTLetter) {
      improvedSentences.push({
        original: firstSentence,
        enhanced: isInformalLetter
          ? `It was wonderful to hear from you, and I am thrilled to share some recommendations for your upcoming visit.`
          : `I am writing to formally bring to your attention an urgent matter regarding ${prompt.title.toLowerCase()}.`,
        explanation: 'Establishes the exact purpose and register of the letter in the opening sentence.',
      });
    } else {
      improvedSentences.push({
        original: firstSentence,
        enhanced: `The question of ${prompt.title.toLowerCase()} has sparked considerable debate among contemporary policymakers and citizens alike.`,
        explanation: 'A sophisticated introductory hook establishes academic tone and contextual background.',
      });
    }
  }

  return {
    id: 'eval-' + Date.now(),
    promptId: prompt.id,
    taskType: prompt.taskType,
    submittedText: text,
    wordCount,
    estimatedOverallBand: roundedBand,
    scores: {
      taskAchievementOrResponse: Math.round(trScore * 2) / 2,
      coherenceAndCohesion: Math.round(ccScore * 2) / 2,
      lexicalResource: Math.round(lrScore * 2) / 2,
      grammaticalRangeAndAccuracy: Math.round(graScore * 2) / 2,
    },
    detailedFeedback: {
      taskFeedback,
      coherenceFeedback,
      lexicalFeedback,
      grammarFeedback,
    },
    detectedErrors,
    improvedSentences,
    recommendedExercises: [
      'Advanced Academic Collocations Lesson',
      'Complex Sentences & Relative Clauses Academy',
      'Paragraph Cohesion & Linking Words Drill',
      'Task 2 Thesis & Topic Sentence Mastery',
    ],
    evaluatedAt: new Date().toISOString(),
    isAiEstimate: true,
  };
}
