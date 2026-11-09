import {
  UserAccount,
  UserProfile,
  DiagnosticResult,
  WritingEvaluation,
  SpeakingEvaluation,
  AchievementBadge,
  MockExamSession,
  SkillType,
  ExamType,
  LessonProgressState,
} from '../types/ielts';
import { calculateOverallBand } from '../data/mockExamData';

const STORAGE_KEYS = {
  ACCOUNTS: 'ielts_user_accounts',
  CURRENT_ACCOUNT_ID: 'ielts_current_account_id',
  PROFILE: 'ielts_user_profile',
  DIAGNOSTIC: 'ielts_diagnostic_result',
  COMPLETED_LESSONS: 'ielts_completed_lessons',
  LESSON_PROGRESS: 'ielts_lesson_progress_map',
  WEAK_TOPICS: 'ielts_weak_topics_log',
  WRITING_EVALS: 'ielts_writing_evals',
  SPEAKING_EVALS: 'ielts_speaking_evals',
  VOCAB_PROGRESS: 'ielts_vocab_progress',
  MOCK_SESSIONS: 'ielts_mock_sessions',
  MOCK_ACTIVE_DRAFT: 'ielts_mock_active_draft',
  ACHIEVEMENTS: 'ielts_achievements',
  SKILL_SCORES: 'ielts_skill_scores',
  STUDY_PLAN_DONE: 'ielts_study_plan_done',
  THEME: 'ielts_theme_mode',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Future Band 8 Scholar',
  targetExam: 'academic',
  targetOverallBand: 7.5,
  targetSkillBands: {
    listening: 8.0,
    reading: 8.0,
    writing: 7.0,
    speaking: 7.5,
  },
  currentProficiency: 'intermediate',
  previousExperience: 'none',
  examDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dailyStudyMinutes: 60,
  preferredPace: 'moderate',
  onboardingCompleted: false,
  diagnosticCompleted: false,
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 0,
};

export const DEFAULT_BADGES: AchievementBadge[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete the IELTS Diagnostic Assessment',
    icon: 'Compass',
    category: 'mock_exam',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_3',
    title: 'Consistency Champion',
    description: 'Maintain a 3-day active study streak',
    icon: 'Flame',
    category: 'streak',
    unlocked: false,
    progress: 33,
  },
  {
    id: 'essay_master',
    title: 'Essayist',
    description: 'Complete and evaluate an IELTS Task 2 Essay',
    icon: 'Feather',
    category: 'skills',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'speaking_pioneer',
    title: 'Fluent Speaker',
    description: 'Record and evaluate a Speaking Part 2 Cue Card',
    icon: 'Mic',
    category: 'skills',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'listening_ace',
    title: 'Eagle Ear',
    description: 'Score Band 7.0+ in an IELTS Listening test',
    icon: 'Headphones',
    category: 'skills',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'vocab_50',
    title: 'Lexicon Builder',
    description: 'Master Academic Word List terms via Leitner SRS',
    icon: 'BookOpen',
    category: 'mastery',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'mock_exam_finisher',
    title: 'Exam Warrior',
    description: 'Complete a full-length IELTS Mock Examination',
    icon: 'Award',
    category: 'mock_exam',
    unlocked: false,
    progress: 0,
  },
];

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

class StorageService {
  private getKey(baseKey: string): string {
    try {
      const currentAccountId = localStorage.getItem(STORAGE_KEYS.CURRENT_ACCOUNT_ID);
      if (currentAccountId) {
        return `${baseKey}__${currentAccountId}`;
      }
    } catch (e) {}
    return baseKey;
  }

  // ==================== AUTHENTICATION & ACCOUNTS ====================

  getAccounts(): UserAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  getCurrentAccount(): UserAccount | null {
    try {
      const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_ACCOUNT_ID);
      if (!currentId) return null;
      const accounts = this.getAccounts();
      return accounts.find((a) => a.id === currentId) || null;
    } catch (e) {
      return null;
    }
  }

  registerAccount(
    name: string,
    email: string,
    password: string,
    targetExam: ExamType = 'academic',
    targetOverallBand: number = 7.5
  ): { success: boolean; error?: string; account?: UserAccount } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter a valid full name (at least 2 characters).' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = this.getAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      email: cleanEmail,
      name: cleanName,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_KEYS.CURRENT_ACCOUNT_ID, newAccount.id);

      const initialProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        name: cleanName,
        email: cleanEmail,
        targetExam,
        targetOverallBand,
        onboardingCompleted: true,
        diagnosticCompleted: false,
        streakDays: 1,
        totalStudyMinutes: 0,
      };
      this.saveProfile(initialProfile);
    } catch (e) {}

    return { success: true, account: newAccount };
  }

  loginAccount(
    email: string,
    password: string
  ): { success: boolean; error?: string; account?: UserAccount } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with that email address.' };
    }
    if (found.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ACCOUNT_ID, found.id);
    } catch (e) {}
    return { success: true, account: found };
  }

  resetPassword(
    email: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }
    const accounts = this.getAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      return { success: false, error: 'No registered account matches that email address.' };
    }
    accounts[idx].passwordHash = simpleHash(newPassword);
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {}
    return { success: true };
  }

  logoutAccount() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ACCOUNT_ID);
    } catch (e) {}
  }

  // ==================== PROFILE & DIAGNOSTIC ====================

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.PROFILE));
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : { ...DEFAULT_PROFILE };
    } catch (e) {
      return { ...DEFAULT_PROFILE };
    }
  }

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(this.getKey(STORAGE_KEYS.PROFILE), JSON.stringify(profile));
    } catch (e) {}
  }

  getDiagnostic(): DiagnosticResult | null {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.DIAGNOSTIC));
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveDiagnostic(diag: DiagnosticResult) {
    try {
      localStorage.setItem(this.getKey(STORAGE_KEYS.DIAGNOSTIC), JSON.stringify(diag));
      const profile = this.getProfile();
      profile.diagnosticCompleted = true;
      this.saveProfile(profile);
    } catch (e) {}
  }

  // ==================== SKILL SCORES & LIVE BAND CALCULATION ====================

  getSkillScores(): { [key in SkillType]?: number } {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.SKILL_SCORES));
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveSkillScore(skill: SkillType, band: number) {
    try {
      const current = this.getSkillScores();
      current[skill] = band;
      localStorage.setItem(this.getKey(STORAGE_KEYS.SKILL_SCORES), JSON.stringify(current));
      this.incrementStudyTime(20);
    } catch (e) {}
  }

  /**
   * Computes authentic current band scores per skill from real user records:
   * - Latest Mock Exam score (if completed)
   * - Latest Practice Test / AI Evaluation score
   * - Diagnostic baseline score
   * Returns null for any skill that has not yet been assessed!
   */
  computeCurrentBands(): {
    listening: number | null;
    reading: number | null;
    writing: number | null;
    speaking: number | null;
    overall: number | null;
    hasAnyRecord: boolean;
  } {
    const diag = this.getDiagnostic();
    const skillScores = this.getSkillScores();
    const writingEvals = this.getWritingEvaluations();
    const speakingEvals = this.getSpeakingEvaluations();
    const mockSessions = this.getMockSessions().filter((m) => m.status === 'completed');
    const latestMock = mockSessions.length > 0 ? mockSessions[0] : null;

    const listening =
      skillScores.listening ??
      latestMock?.scores.listening?.band ??
      diag?.skillBands.listening ??
      null;

    const reading =
      skillScores.reading ??
      latestMock?.scores.reading?.band ??
      diag?.skillBands.reading ??
      null;

    const writing =
      (writingEvals.length > 0 ? writingEvals[0].estimatedOverallBand : undefined) ??
      skillScores.writing ??
      latestMock?.scores.writing?.band ??
      diag?.skillBands.writing ??
      null;

    const speaking =
      (speakingEvals.length > 0 ? speakingEvals[0].estimatedOverallBand : undefined) ??
      skillScores.speaking ??
      latestMock?.scores.speaking?.band ??
      diag?.skillBands.speaking ??
      null;

    const validScores = [listening, reading, writing, speaking].filter(
      (s): s is number => typeof s === 'number' && s > 0
    );

    let overall: number | null = null;
    if (validScores.length === 4) {
      overall = calculateOverallBand(listening!, reading!, writing!, speaking!);
    } else if (validScores.length > 0) {
      const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
      overall = Math.round(avg * 2) / 2;
    }

    return {
      listening,
      reading,
      writing,
      speaking,
      overall,
      hasAnyRecord: validScores.length > 0,
    };
  }

  /**
   * Section 11: Rigorous Multi-Exam Readiness Assessment Engine.
   * "Exam Ready" status requires:
   * 1. All 4 individual skill targets met or exceeded (Listening, Reading, Writing, Speaking) AND Overall target met.
   * 2. Consistent performance across at least 2 recent full Mock Examinations (never calculated from 1 exam alone).
   */
  computeExamReadiness(customProfile?: UserProfile) {
    const profile = customProfile || this.getProfile();
    const bands = this.computeCurrentBands();
    const completedMocks = this.getMockSessions().filter(
      (m) => m.status === 'completed' && m.examType === profile.targetExam
    );

    const hasAllFourSkills =
      bands.listening !== null &&
      bands.reading !== null &&
      bands.writing !== null &&
      bands.speaking !== null &&
      bands.overall !== null;

    const allSkillsMeetTarget =
      hasAllFourSkills &&
      (bands.listening as number) >= profile.targetSkillBands.listening &&
      (bands.reading as number) >= profile.targetSkillBands.reading &&
      (bands.writing as number) >= profile.targetSkillBands.writing &&
      (bands.speaking as number) >= profile.targetSkillBands.speaking &&
      (bands.overall as number) >= profile.targetOverallBand;

    // Count how many of the recent 3 mock exams met all 4 skill targets + overall target
    const recentMocks = completedMocks.slice(0, 3);
    const qualifyingMocks = recentMocks.filter((m) => {
      const l = m.scores.listening?.band ?? 0;
      const r = m.scores.reading?.band ?? 0;
      const w = m.scores.writing?.band ?? 0;
      const s = m.scores.speaking?.band ?? 0;
      const ov = m.scores.overallBand ?? 0;
      return (
        l >= profile.targetSkillBands.listening &&
        r >= profile.targetSkillBands.reading &&
        w >= profile.targetSkillBands.writing &&
        s >= profile.targetSkillBands.speaking &&
        ov >= profile.targetOverallBand
      );
    });

    const isExamReady = allSkillsMeetTarget && qualifyingMocks.length >= 2;

    let readinessStage: 'unassessed' | 'in-preparation' | 'single-test-target' | 'exam-ready' = 'unassessed';
    let statusLabel = 'Unassessed';
    let statusReason = 'Complete the Diagnostic Assessment or a Practice Module to establish your baseline bands.';

    if (isExamReady) {
      readinessStage = 'exam-ready';
      statusLabel = 'Exam Ready ✓';
      statusReason = `Verified across ${qualifyingMocks.length} recent full mock examinations with all 4 individual skill targets achieved.`;
    } else if (allSkillsMeetTarget && qualifyingMocks.length < 2) {
      readinessStage = 'single-test-target';
      statusLabel = `Target Reached (${qualifyingMocks.length}/2 Mocks)`;
      statusReason = `Your current skill bands meet your target, but official Exam Readiness requires consistent target performance across at least 2 full Mock Examinations (${qualifyingMocks.length}/2 completed).`;
    } else if (bands.hasAnyRecord) {
      readinessStage = 'in-preparation';
      statusLabel = 'In Preparation';
      statusReason =
        'Continue completing targeted mastery lessons, skill drills, and full mock exams until all 4 skill targets are consistently met.';
    }

    return {
      isExamReady,
      readinessStage,
      statusLabel,
      statusReason,
      completedMockCount: completedMocks.length,
      qualifyingMockCount: qualifyingMocks.length,
      allSkillsMeetTarget,
    };
  }

  // ==================== CURRICULUM, WRITING, SPEAKING, VOCAB ====================

  getCompletedLessons(): string[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.COMPLETED_LESSONS));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  markLessonComplete(lessonId: string, _score?: number) {
    try {
      const completed = new Set(this.getCompletedLessons());
      completed.add(lessonId);
      localStorage.setItem(
        this.getKey(STORAGE_KEYS.COMPLETED_LESSONS),
        JSON.stringify(Array.from(completed))
      );
      this.incrementStudyTime(15);
    } catch (e) {}
  }

  getWritingEvaluations(): WritingEvaluation[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.WRITING_EVALS));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWritingEvaluation(evaluation: WritingEvaluation) {
    try {
      const all = this.getWritingEvaluations();
      all.unshift(evaluation);
      localStorage.setItem(this.getKey(STORAGE_KEYS.WRITING_EVALS), JSON.stringify(all));
      this.saveSkillScore('writing', evaluation.estimatedOverallBand);
    } catch (e) {}
  }

  getSpeakingEvaluations(): SpeakingEvaluation[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.SPEAKING_EVALS));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveSpeakingEvaluation(evaluation: SpeakingEvaluation) {
    try {
      const all = this.getSpeakingEvaluations();
      all.unshift(evaluation);
      localStorage.setItem(this.getKey(STORAGE_KEYS.SPEAKING_EVALS), JSON.stringify(all));
      this.saveSkillScore('speaking', evaluation.estimatedOverallBand);
    } catch (e) {}
  }

  getVocabProgress(): { [wordId: string]: { boxLevel: number; mastered: boolean } } {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.VOCAB_PROGRESS));
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  updateWordProgress(wordId: string, correct: boolean) {
    try {
      const progress = this.getVocabProgress();
      const current = progress[wordId] || { boxLevel: 1, mastered: false };
      if (correct) {
        current.boxLevel = Math.min(5, current.boxLevel + 1);
        if (current.boxLevel >= 4) current.mastered = true;
      } else {
        current.boxLevel = 1;
        current.mastered = false;
      }
      progress[wordId] = current;
      localStorage.setItem(this.getKey(STORAGE_KEYS.VOCAB_PROGRESS), JSON.stringify(progress));
    } catch (e) {}
  }

  // ==================== MOCK EXAM SESSIONS & RESUME SUPPORT ====================

  getMockSessions(): MockExamSession[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.MOCK_SESSIONS));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveMockSession(session: MockExamSession) {
    try {
      const all = this.getMockSessions().filter((s) => s.id !== session.id);
      all.unshift(session);
      localStorage.setItem(this.getKey(STORAGE_KEYS.MOCK_SESSIONS), JSON.stringify(all));
      if (session.status === 'completed') {
        if (session.scores.listening) this.saveSkillScore('listening', session.scores.listening.band);
        if (session.scores.reading) this.saveSkillScore('reading', session.scores.reading.band);
        if (session.scores.writing) this.saveSkillScore('writing', session.scores.writing.band);
        if (session.scores.speaking) this.saveSkillScore('speaking', session.scores.speaking.band);
        this.unlockAchievement('mock_exam_finisher');
        this.incrementStudyTime(120);
      }
    } catch (e) {}
  }

  getActiveMockDraft(): any | null {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.MOCK_ACTIVE_DRAFT));
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveActiveMockDraft(draft: any) {
    try {
      localStorage.setItem(this.getKey(STORAGE_KEYS.MOCK_ACTIVE_DRAFT), JSON.stringify(draft));
    } catch (e) {}
  }

  clearActiveMockDraft() {
    try {
      localStorage.removeItem(this.getKey(STORAGE_KEYS.MOCK_ACTIVE_DRAFT));
    } catch (e) {}
  }

  // ==================== STUDY PLAN PERSISTENCE ====================

  getStudyPlanDoneIds(): string[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.STUDY_PLAN_DONE));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  toggleStudyPlanTask(taskId: string): string[] {
    try {
      const current = new Set(this.getStudyPlanDoneIds());
      if (current.has(taskId)) {
        current.delete(taskId);
      } else {
        current.add(taskId);
        this.incrementStudyTime(15);
      }
      const next = Array.from(current);
      localStorage.setItem(this.getKey(STORAGE_KEYS.STUDY_PLAN_DONE), JSON.stringify(next));
      return next;
    } catch (e) {
      return [];
    }
  }

  // ==================== LESSON PAUSE/RESUME & WEAK TOPIC TRACKING ====================

  getLessonProgressMap(): { [lessonId: string]: LessonProgressState } {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.LESSON_PROGRESS));
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  getLessonProgress(lessonId: string): LessonProgressState | null {
    const map = this.getLessonProgressMap();
    return map[lessonId] || null;
  }

  saveLessonProgress(state: LessonProgressState) {
    try {
      const map = this.getLessonProgressMap();
      map[state.lessonId] = { ...state, lastUpdated: new Date().toISOString() };
      localStorage.setItem(this.getKey(STORAGE_KEYS.LESSON_PROGRESS), JSON.stringify(map));
    } catch (e) {}
  }

  getWeakTopics(): { topicId: string; label: string; skill: string; count: number; recommendedLessonId: string }[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.WEAK_TOPICS));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  recordWeakTopic(topicId: string, label: string, skill: string, recommendedLessonId: string) {
    try {
      const list = this.getWeakTopics();
      const existing = list.find((item) => item.topicId === topicId);
      if (existing) {
        existing.count += 1;
      } else {
        list.unshift({ topicId, label, skill, count: 1, recommendedLessonId });
      }
      localStorage.setItem(this.getKey(STORAGE_KEYS.WEAK_TOPICS), JSON.stringify(list.slice(0, 10)));
    } catch (e) {}
  }

  clearWeakTopic(topicId: string) {
    try {
      const list = this.getWeakTopics().filter((item) => item.topicId !== topicId);
      localStorage.setItem(this.getKey(STORAGE_KEYS.WEAK_TOPICS), JSON.stringify(list));
    } catch (e) {}
  }

  // ==================== ACHIEVEMENTS & STREAK ====================

  getAchievements(): AchievementBadge[] {
    try {
      const data = localStorage.getItem(this.getKey(STORAGE_KEYS.ACHIEVEMENTS));
      return data ? JSON.parse(data) : DEFAULT_BADGES.map((b) => ({ ...b }));
    } catch (e) {
      return DEFAULT_BADGES.map((b) => ({ ...b }));
    }
  }

  unlockAchievement(badgeId: string) {
    try {
      const badges = this.getAchievements();
      const found = badges.find((b) => b.id === badgeId);
      if (found && !found.unlocked) {
        found.unlocked = true;
        found.progress = 100;
        found.unlockedAt = new Date().toISOString();
        localStorage.setItem(this.getKey(STORAGE_KEYS.ACHIEVEMENTS), JSON.stringify(badges));
      }
    } catch (e) {}
  }

  incrementStudyTime(minutes: number) {
    const profile = this.getProfile();
    profile.totalStudyMinutes = (profile.totalStudyMinutes || 0) + minutes;

    const today = new Date().toISOString().split('T')[0];
    if (profile.lastStudyDate !== today) {
      profile.streakDays = (profile.streakDays || 0) + 1;
      profile.lastStudyDate = today;
      if (profile.streakDays >= 3) {
        this.unlockAchievement('streak_3');
      }
    }
    this.saveProfile(profile);
  }

  resetAllData() {
    try {
      const keysToReset = [
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.DIAGNOSTIC,
        STORAGE_KEYS.COMPLETED_LESSONS,
        STORAGE_KEYS.LESSON_PROGRESS,
        STORAGE_KEYS.WEAK_TOPICS,
        STORAGE_KEYS.WRITING_EVALS,
        STORAGE_KEYS.SPEAKING_EVALS,
        STORAGE_KEYS.VOCAB_PROGRESS,
        STORAGE_KEYS.MOCK_SESSIONS,
        STORAGE_KEYS.MOCK_ACTIVE_DRAFT,
        STORAGE_KEYS.ACHIEVEMENTS,
        STORAGE_KEYS.SKILL_SCORES,
        STORAGE_KEYS.STUDY_PLAN_DONE,
      ];
      keysToReset.forEach((k) => localStorage.removeItem(this.getKey(k)));
    } catch (e) {}
  }
}

export const storageService = new StorageService();
