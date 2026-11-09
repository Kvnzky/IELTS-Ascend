import { GrammarRule } from '../types/ielts';

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'g-inversion',
    title: 'Negative & Restrictive Inversion for Band 8.0+ Writing',
    category: 'inversion',
    bandTarget: '8.0+',
    summary:
      'Placing negative or limiting adverbs at the beginning of a clause requires the subject and auxiliary verb to invert, creating rhetorical power.',
    detailedRules: [
      'Trigger words: Rarely, Seldom, Scarcely, Barely, Under no circumstances, Not only... but also, On no account.',
      'Formula: Negative adverb + Auxiliary Verb + Subject + Main Verb.',
      'Example: "Under no circumstances should governments neglect rural healthcare infrastructure."',
      'Never invert the subject without an auxiliary verb (e.g. not "Rarely people think", but "Rarely do people think").',
    ],
    examples: [
      {
        correct: 'Not only does excessive vehicular traffic exacerbate air pollution, but it also compromises public health.',
        incorrect: 'Not only excessive vehicular traffic exacerbates air pollution, but also it compromises health.',
        explanation: 'The auxiliary verb "does" must precede the noun phrase subject "excessive vehicular traffic".',
      },
      {
        correct: 'Seldom have urban planners encountered such rapid population influx.',
        incorrect: 'Seldom urban planners have encountered such rapid population influx.',
        explanation: 'Auxiliary "have" must move ahead of subject "urban planners".',
      },
    ],
    practiceExercises: [
      {
        id: 'g-ex-1',
        sentenceWithBlanks: 'Under no circumstances _______ citizens be deprived of access to clean drinking water.',
        options: ['should', 'citizens should', 'they should', 'are'],
        answer: 'should',
        explanation: '"Under no circumstances" triggers negative inversion, demanding the auxiliary "should" immediately before "citizens".',
      },
      {
        id: 'g-ex-2',
        sentenceWithBlanks: 'Rarely _______ modern educational institutions operate without digital learning management software.',
        options: ['do', 'are', 'have', 'does'],
        answer: 'do',
        explanation: 'The subject "modern educational institutions" is plural; hence auxiliary "do" is required.',
      },
    ],
  },
  {
    id: 'g-conditionals-mixed',
    title: 'Mixed Conditionals: Linking Past Actions to Present Realities',
    category: 'conditionals',
    bandTarget: '7.0+',
    summary:
      'Connect an unreal hypothetical past event with its continuing current consequence for sophisticated argumentation.',
    detailedRules: [
      'Formula: If + Past Perfect (had + V3), would + base verb.',
      'Used when a past condition has a direct result in the present time.',
      'Example: "If the city had preserved its historic tram network, commuter traffic would be far less congested today."',
    ],
    examples: [
      {
        correct: 'If the council had enacted zoning regulations a decade ago, urban sprawl would not be such a dilemma now.',
        incorrect: 'If the council enacted zoning regulations a decade ago, urban sprawl will not be a dilemma now.',
        explanation: 'Past condition requires past perfect "had enacted"; present consequence requires "would not be".',
      },
    ],
    practiceExercises: [
      {
        id: 'g-ex-3',
        sentenceWithBlanks: 'If the government _______ earlier to protect local wetlands, many migratory species would be thriving today.',
        options: ['had acted', 'acted', 'would act', 'has acted'],
        answer: 'had acted',
        explanation: 'Mixed conditional referring to a past missed action requires Past Perfect ("had acted").',
      },
    ],
  },
  {
    id: 'g-relative-clauses',
    title: 'Non-Defining Relative Clauses: Adding Academic Detail without Run-ons',
    category: 'clauses',
    bandTarget: '6.0+',
    summary:
      'Use commas and relative pronouns (which, who, whose, where) to attach qualifying evidence without creating choppy fragments.',
    detailedRules: [
      'A non-defining relative clause gives extra non-essential information and MUST be enclosed in commas.',
      'Use "which" for things and ideas, NEVER "that" in non-defining clauses (e.g., "The plan, which was drafted in 2018, failed").',
      'Sentential "which": "which" can refer back to the entire preceding clause (e.g., "Renewable subsidies surged, which stimulated green jobs").',
    ],
    examples: [
      {
        correct: 'Electric vehicles produce zero tailpipe emissions, which significantly curtails urban nitrogen dioxide levels.',
        incorrect: 'Electric vehicles produce zero tailpipe emissions, that significantly curtails nitrogen dioxide.',
        explanation: '"That" cannot be used in a non-defining clause preceded by a comma.',
      },
    ],
    practiceExercises: [
      {
        id: 'g-ex-4',
        sentenceWithBlanks: 'The university built a solar research observatory, _______ cost exceeded five million pounds.',
        options: ['whose', 'which', 'that', 'its'],
        answer: 'whose',
        explanation: '"Whose" expresses possession for both animate and inanimate antecedents in academic English.',
      },
    ],
  },
];
