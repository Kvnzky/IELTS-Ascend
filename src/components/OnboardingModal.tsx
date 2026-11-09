import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';
import { UserProfile, ExamType } from '../types/ielts';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  isOpen: boolean;
  onComplete: (profile: UserProfile, startDiagnostic: boolean) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete({ ...profile, onboardingCompleted: true }, false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, profile, onComplete]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishOnboarding(false);
    }
  };

  const finishOnboarding = (startDiag: boolean) => {
    const updated = { ...profile, onboardingCompleted: true };
    onComplete(updated, startDiag);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configure Your IELTS Roadmap"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[86vh] my-auto">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
              Personalized Academy Setup (Step {step} of 3)
            </span>
            <button
              onClick={() => finishOnboarding(false)}
              className="text-xs text-white/80 hover:text-white underline font-semibold"
            >
              Skip setup
            </button>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Configure Your IELTS Roadmap</h2>
          <p className="text-sm text-red-100 mt-1">
            Let our diagnostic engine tailor lessons, mock tests, and exercises to your target score.
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-white' : s < step ? 'w-4 bg-white/70' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. Which IELTS Examination Are You Preparing For?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, targetExam: 'academic' })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      profile.targetExam === 'academic'
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-red-600" />
                      <span className="font-extrabold text-base">IELTS Academic</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      For university admissions, postgraduate degrees, and professional registrations (medical, engineering).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, targetExam: 'general' })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      profile.targetExam === 'general'
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="font-extrabold text-base">General Training</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      For immigration (Express Entry, Australian PR), work permits, secondary education, and employment.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name or Nickname
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Previous IELTS Examination Experience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'First Time' },
                    { id: 'taken_once', label: 'Taken Once' },
                    { id: 'taken_multiple', label: 'Multiple Times' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, previousExperience: item.id as any })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        profile.previousExperience === item.id
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-red-600" />
                    Target Overall Band Score
                  </label>
                  <span className="text-xl font-black text-red-600">Band {profile.targetOverallBand.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setProfile({ ...profile, targetOverallBand: b })}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        profile.targetOverallBand === b
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {b.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Target Individual Skill Bands
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['listening', 'reading', 'writing', 'speaking'] as const).map((skill) => (
                    <div
                      key={skill}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col"
                    >
                      <span className="capitalize text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                        {skill}
                      </span>
                      <select
                        value={profile.targetSkillBands[skill]}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            targetSkillBands: {
                              ...profile.targetSkillBands,
                              [skill]: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="bg-transparent font-black text-base text-slate-900 dark:text-white focus:outline-none"
                      >
                        {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((num) => (
                          <option key={num} value={num} className="bg-white dark:bg-slate-900">
                            Band {num.toFixed(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Current English Proficiency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', title: 'Beginner', desc: 'B1 (Band 4.0 - 5.0)' },
                    { id: 'intermediate', title: 'Intermediate', desc: 'B2 (Band 5.5 - 6.5)' },
                    { id: 'advanced', title: 'Advanced', desc: 'C1 (Band 7.0+)' },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, currentProficiency: level.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        profile.currentProficiency === level.id
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block font-bold text-xs">{level.title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-red-600" />
                  Target Examination Date (Optional)
                </label>
                <input
                  type="date"
                  value={profile.examDate || ''}
                  onChange={(e) => setProfile({ ...profile, examDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  Daily Study Availability
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setProfile({ ...profile, dailyStudyMinutes: mins })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        profile.dailyStudyMinutes === mins
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {mins} mins/day
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Recommendation: Take the Initial Diagnostic Exam
                    </h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                      Evaluate your listening, reading, writing, and speaking baseline in 10 minutes to generate your customized study blueprint.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => finishOnboarding(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => finishOnboarding(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all hover:scale-105"
                >
                  <Award className="w-4 h-4" />
                  <span>Start Diagnostic Exam</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
