import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CurriculumView } from './components/CurriculumView';
import { AcademicHub } from './components/AcademicHub';
import { GeneralHub } from './components/GeneralHub';
import { ListeningAcademy } from './components/ListeningAcademy';
import { ReadingAcademy } from './components/ReadingAcademy';
import { WritingAcademy } from './components/WritingAcademy';
import { SpeakingAcademy } from './components/SpeakingAcademy';
import { VocabularyBuilder } from './components/VocabularyBuilder';
import { GrammarAcademy } from './components/GrammarAcademy';
import { PracticeExercises } from './components/PracticeExercises';
import { MockExamSimulator } from './components/MockExamSimulator';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { StudyPlanView } from './components/StudyPlanView';
import { AchievementsView } from './components/AchievementsView';
import { SettingsView } from './components/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';
import { DiagnosticExamModal } from './components/DiagnosticExamModal';
import { AuthModal } from './components/AuthModal';

import { storageService } from './services/storageService';
import { CURRICULUM_LESSONS } from './data/curriculumData';
import { VOCABULARY_LIST } from './data/vocabularyData';
import {
  UserProfile,
  DiagnosticResult,
  WritingEvaluation,
  SpeakingEvaluation,
  AchievementBadge,
  ExamType,
} from './types/ielts';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(() => storageService.getDiagnostic());
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => storageService.getCompletedLessons());
  const [writingEvals, setWritingEvals] = useState<WritingEvaluation[]>(() => storageService.getWritingEvaluations());
  const [speakingEvals, setSpeakingEvals] = useState<SpeakingEvaluation[]>(() => storageService.getSpeakingEvaluations());
  const [vocabProgress, setVocabProgress] = useState<{ [wordId: string]: { boxLevel: number; mastered: boolean } }>(() => storageService.getVocabProgress());
  const [badges, setBadges] = useState<AchievementBadge[]>(() => storageService.getAchievements());

  // UI state
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [targetLessonId, setTargetLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ielts_theme_mode');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboardingCompleted);
  const [showDiagnostic, setShowDiagnostic] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const reloadUserData = () => {
    const nextProfile = storageService.getProfile();
    setProfile(nextProfile);
    setDiagnostic(storageService.getDiagnostic());
    setCompletedLessonIds(storageService.getCompletedLessons());
    setWritingEvals(storageService.getWritingEvaluations());
    setSpeakingEvals(storageService.getSpeakingEvaluations());
    setVocabProgress(storageService.getVocabProgress());
    setBadges(storageService.getAchievements());
    setShowOnboarding(!nextProfile.onboardingCompleted);
  };

  // Sync dark mode class on root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ielts_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ielts_theme_mode', 'light');
    }
  }, [darkMode]);

  // Scroll to top when navigating between sections
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [currentSection]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTrackChange = (track: ExamType) => {
    const updated = { ...profile, targetExam: track };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleCompleteOnboarding = (updatedProfile: UserProfile, startDiagnostic: boolean) => {
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setShowOnboarding(false);
    if (startDiagnostic) {
      setShowDiagnostic(true);
    }
  };

  const handleSaveDiagnostic = (result: DiagnosticResult) => {
    setDiagnostic(result);
    storageService.saveDiagnostic(result);
    storageService.unlockAchievement('first_step');
    setBadges(storageService.getAchievements());
  };

  const handleCompleteLesson = (lessonId: string, score: number) => {
    storageService.markLessonComplete(lessonId, score);
    setCompletedLessonIds(storageService.getCompletedLessons());
    setProfile(storageService.getProfile());
  };

  const handleSaveWritingEval = (evaluation: WritingEvaluation) => {
    storageService.saveWritingEvaluation(evaluation);
    setWritingEvals(storageService.getWritingEvaluations());
    storageService.unlockAchievement('essay_master');
    setBadges(storageService.getAchievements());
    setProfile(storageService.getProfile());
  };

  const handleSaveSpeakingEval = (evaluation: SpeakingEvaluation) => {
    storageService.saveSpeakingEvaluation(evaluation);
    setSpeakingEvals(storageService.getSpeakingEvaluations());
    storageService.unlockAchievement('speaking_pioneer');
    setBadges(storageService.getAchievements());
    setProfile(storageService.getProfile());
  };

  const handleUpdateWordProgress = (wordId: string, correct: boolean) => {
    storageService.updateWordProgress(wordId, correct);
    setVocabProgress(storageService.getVocabProgress());
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleResetAllData = () => {
    storageService.resetAllData();
    window.location.reload();
  };

  // Mastery metrics
  const masteredVocabCount = Object.values(vocabProgress).filter((v) => v.mastered).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Accessible Skip-to-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-red-600 focus:text-white focus:font-bold focus:text-xs focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navbar */}
      <Navbar
        profile={profile}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenDiagnostic={() => setShowDiagnostic(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onTrackChange={handleTrackChange}
        onNavigate={(id) => setCurrentSection(id)}
      />

      <div className="flex-1 flex w-full relative">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onNavigate={(id) => setCurrentSection(id)}
          targetExam={profile.targetExam}
          onTrackChange={handleTrackChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 lg:pl-72 w-full min-w-0 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {currentSection === 'dashboard' && (
              <Dashboard
                profile={profile}
                diagnostic={diagnostic}
                completedLessonsCount={completedLessonIds.length}
                totalLessonsCount={CURRICULUM_LESSONS.length}
                completedLessonIds={completedLessonIds}
                vocabMasteredCount={masteredVocabCount}
                totalVocabCount={VOCABULARY_LIST.length}
                onNavigate={(id) => setCurrentSection(id)}
                onOpenDiagnostic={() => setShowDiagnostic(true)}
                onOpenLesson={(lessonId) => {
                  setTargetLessonId(lessonId);
                  setCurrentSection('curriculum');
                }}
              />
            )}

            {currentSection === 'curriculum' && (
              <CurriculumView
                lessons={CURRICULUM_LESSONS}
                completedLessonIds={completedLessonIds}
                onCompleteLesson={handleCompleteLesson}
                userExamType={profile.targetExam}
                initialLessonId={targetLessonId}
                onClearInitialLesson={() => setTargetLessonId(null)}
              />
            )}

            {currentSection === 'academic' && (
              <AcademicHub
                onNavigate={(id) => setCurrentSection(id)}
                onTrackChange={handleTrackChange}
              />
            )}

            {currentSection === 'general' && (
              <GeneralHub
                onNavigate={(id) => setCurrentSection(id)}
                onTrackChange={handleTrackChange}
              />
            )}

          {currentSection === 'listening' && (
            <ListeningAcademy
              onScoreSave={(raw, band) => {
                storageService.saveSkillScore('listening', band);
                setProfile(storageService.getProfile());
                if (raw >= 12 || band >= 7.0) {
                  storageService.unlockAchievement('listening_ace');
                  setBadges(storageService.getAchievements());
                }
              }}
            />
          )}

          {currentSection === 'reading' && (
            <ReadingAcademy
              userExamType={profile.targetExam}
              onScoreSave={(_raw, band) => {
                storageService.saveSkillScore('reading', band);
                setProfile(storageService.getProfile());
              }}
            />
          )}

          {currentSection === 'writing' && (
            <WritingAcademy
              userExamType={profile.targetExam}
              onSaveEvaluation={handleSaveWritingEval}
            />
          )}

          {currentSection === 'speaking' && (
            <SpeakingAcademy onSaveEvaluation={handleSaveSpeakingEval} />
          )}

          {currentSection === 'vocabulary' && (
            <VocabularyBuilder
              vocabProgress={vocabProgress}
              onUpdateWordProgress={handleUpdateWordProgress}
            />
          )}

          {currentSection === 'grammar' && <GrammarAcademy />}

          {currentSection === 'exercises' && (
            <PracticeExercises
              onOpenRecommendedLesson={(lessonId) => {
                setTargetLessonId(lessonId);
                setCurrentSection('curriculum');
              }}
            />
          )}

          {currentSection === 'mock-exams' && (
            <MockExamSimulator
              userExamType={profile.targetExam}
              onNavigateSkill={(skillId) => setCurrentSection(skillId)}
              onMockComplete={() => {
                setProfile(storageService.getProfile());
                setBadges(storageService.getAchievements());
              }}
            />
          )}

          {currentSection === 'performance' && (
            <PerformanceAnalytics
              profile={profile}
              diagnostic={diagnostic}
              writingEvals={writingEvals}
              speakingEvals={speakingEvals}
              onNavigate={(id) => setCurrentSection(id)}
            />
          )}

          {currentSection === 'study-plan' && (
            <StudyPlanView
              profile={profile}
              onNavigate={(id) => setCurrentSection(id)}
            />
          )}

          {currentSection === 'achievements' && (
            <AchievementsView badges={badges} />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              onResetAll={handleResetAllData}
            />
          )}
          </div>
        </main>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        initialProfile={profile}
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Diagnostic Exam Modal */}
      <DiagnosticExamModal
        isOpen={showDiagnostic}
        onClose={() => setShowDiagnostic(false)}
        profile={profile}
        existingResult={diagnostic}
        onSaveResult={handleSaveDiagnostic}
      />

      {/* User Authentication & Account Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentAccount={storageService.getCurrentAccount()}
        onAuthChange={reloadUserData}
      />
    </div>
  );
}

export default App;
