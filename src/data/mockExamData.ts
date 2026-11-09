import { MockExamSession, ExamType } from '../types/ielts';

export const INITIAL_MOCK_EXAMS: MockExamSession[] = [
  {
    id: 'mock-acad-2025-1',
    examType: 'academic',
    title: 'IELTS Academic Official Simulation Test 1 (Full Battery)',
    status: 'not_started',
    currentSkill: 'listening',
    scores: {},
  },
  {
    id: 'mock-gt-2025-1',
    examType: 'general',
    title: 'IELTS General Training Official Simulation Test 1 (Full Battery)',
    status: 'not_started',
    currentSkill: 'listening',
    scores: {},
  },
];

export function calculateOverallBand(
  listeningBand: number,
  readingBand: number,
  writingBand: number,
  speakingBand: number
): number {
  const average = (listeningBand + readingBand + writingBand + speakingBand) / 4;
  // Official IELTS rounding rule:
  // If decimal is .25 -> rounds up to .5
  // If decimal is .75 -> rounds up to next whole band
  // Otherwise rounds to closest 0.5
  const floor = Math.floor(average);
  const remainder = average - floor;

  if (remainder < 0.25) {
    return floor;
  } else if (remainder < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1.0;
  }
}
