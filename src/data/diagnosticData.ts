import { ExamType } from '../types/ielts';

export interface DiagnosticAssessmentData {
  examType: ExamType;
  listening: {
    audioScript: string;
    context: string;
    questions: {
      id: string;
      prompt: string;
      options: string[];
      correctAnswer: number;
      skillFocus: string;
    }[];
  };
  reading: {
    title: string;
    passageText: string;
    questions: {
      id: string;
      prompt: string;
      options: string[];
      correctAnswer: number;
      skillFocus: string;
    }[];
  };
  writing: {
    task1Prompt: string;
    task2Prompt: string;
  };
  speaking: {
    part1Question: string;
    part2CueCard: {
      topic: string;
      bullets: string[];
    };
    part3Question: string;
  };
}

export const DIAGNOSTIC_EXAM_DATA: DiagnosticAssessmentData = {
  examType: 'academic',
  listening: {
    context: 'Academic Advisory Consultation regarding Post-Graduate Course Selection',
    audioScript:
      'Good morning, Michael. Thank you for coming in today. As your postgraduate academic advisor, I have reviewed your preliminary research proposal on urban renewable infrastructure. While your primary thesis on solar integration in municipal buildings is remarkably thorough, our faculty committee has noted that section three lacks sufficient comparative data from developing economies. To address this, we recommend that you either enroll in the Advanced Econometrics module starting next Tuesday or collaborate with Professor Henderson in the Department of Applied Geography. The deadline for submitting your revised thesis proposal is Friday the 18th of November, strictly by 5:00 PM.',
    questions: [
      {
        id: 'diag-l-1',
        prompt: 'What specific weakness did the faculty committee identify in Michael’s research proposal?',
        options: [
          'The proposal exceeded the departmental word limit.',
          'Section three lacked comparative data from developing economies.',
          'The methodology used for solar panels was outdated.',
          'The bibliography did not include recent peer-reviewed articles.',
        ],
        correctAnswer: 1,
        skillFocus: 'Identifying Specific Academic Information',
      },
      {
        id: 'diag-l-2',
        prompt: 'What alternative recommendation is offered alongside collaborating with Professor Henderson?',
        options: [
          'Enrolling in the Advanced Econometrics module starting next Tuesday',
          'Postponing the postgraduate degree to the following spring semester',
          'Switching the research department to Electrical Engineering',
          'Publishing an interim working paper with the student union',
        ],
        correctAnswer: 0,
        skillFocus: 'Understanding Academic Options and Details',
      },
      {
        id: 'diag-l-3',
        prompt: 'What is the exact deadline for submitting the revised proposal?',
        options: [
          'Tuesday the 15th at midday',
          'Thursday the 17th by 4:00 PM',
          'Friday the 18th of November by 5:00 PM',
          'Monday the 21st before midnight',
        ],
        correctAnswer: 2,
        skillFocus: 'Listening for Exact Dates and Times',
      },
    ],
  },
  reading: {
    title: 'The Cognitive Mechanics of Bilingualism',
    passageText: `In recent decades, neurolinguists and cognitive psychologists have fundamentally altered their perspective on bilingualism. During much of the twentieth century, many pedagogical theorists erroneously warned that exposing young children to two languages simultaneously would result in cognitive overload, delayed syntactic development, and reduced verbal intelligence. Contemporary neuroimaging techniques, however, have thoroughly refuted this deficit model.

Far from impairing executive functions, bilingualism appears to substantially fortify them. The executive control system is a suite of cognitive processes that includes attentional shifting, working memory manipulation, inhibitory control, and goal maintenance. Because both languages remain perpetually active in the bilingual brain, the speaker must continuously resolve linguistic interference, inhibiting words from the non-target language while swiftly retrieving the desired lexicon. This mental juggling functions as continuous resistance training for the prefrontal cortex.

Crucially, longitudinal investigations spearheaded by Dr. Ellen Bialystok demonstrate that this cognitive enhancement confers neuroprotective benefits in later life. While bilingual individuals are not immune to neurodegenerative conditions such as Alzheimer's disease, the symptomatic onset of cognitive decline is consistently delayed by an average of four to five years compared to monolinguals with equivalent brain pathology.`,
    questions: [
      {
        id: 'diag-r-1',
        prompt: 'What was the prevailing twentieth-century view regarding bilingual education in young children?',
        options: [
          'It would promote faster acquisition of third languages.',
          'It would cause cognitive overload and delay language development.',
          'It would enhance prefrontal cortex density at an early age.',
          'It was exclusively advantageous for mathematically inclined students.',
        ],
        correctAnswer: 1,
        skillFocus: 'Identifying Historical Academic Perspectives',
      },
      {
        id: 'diag-r-2',
        prompt: 'According to paragraph 2, why does bilingualism strengthen the executive control system?',
        options: [
          'Bilinguals only use one language at any given time in their lifespan.',
          'The speaker must continuously inhibit the non-target language, exercising mental control.',
          'Bilingual individuals possess larger overall cranial volumes than monolinguals.',
          'Executive control is entirely inherited and unaffected by environmental stimuli.',
        ],
        correctAnswer: 1,
        skillFocus: 'Understanding Cause-and-Effect Relationships in Texts',
      },
      {
        id: 'diag-r-3',
        prompt: 'What did Dr. Ellen Bialystok’s research discover regarding bilingualism and Alzheimer’s disease?',
        options: [
          'Bilingualism prevents brain pathology from ever developing in elderly patients.',
          'Monolinguals recover faster from cognitive decline than bilinguals.',
          'The symptomatic onset of cognitive decline is postponed by 4 to 5 years.',
          'Alzheimer’s disease is twice as prevalent among bilingual populations.',
        ],
        correctAnswer: 2,
        skillFocus: 'Extracting Precise Empirical Findings',
      },
    ],
  },
  writing: {
    task1Prompt:
      'The line graph shows the percentage of electricity generated from renewable sources in four European nations between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task2Prompt:
      'Some people believe that university education should be completely free for all citizens, funded entirely by governments. Others argue that students should pay their own tuition fees. Discuss both views and give your own opinion.',
  },
  speaking: {
    part1Question: 'Tell me about the town or city where you currently live. What do you like most about it?',
    part2CueCard: {
      topic: 'Describe an important decision you made that had a positive impact on your life.',
      bullets: [
        'What the decision was and when you made it',
        'Why you had to make this decision',
        'What difficulties or choices you faced',
        'And explain why this decision had a positive impact on you',
      ],
    },
    part3Question:
      'Do you think young people today have to make more important life decisions than generations in the past? Why or why not?',
  },
};
