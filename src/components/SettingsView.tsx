import React, { useState } from 'react';
import {
  Settings,
  Target,
  Sun,
  Moon,
  Volume2,
  Trash2,
  Download,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react';
import { UserProfile, ExamType } from '../types/ielts';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  darkMode,
  toggleDarkMode,
  onResetAll,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = () => {
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ielts_prep_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Academy Settings & Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalize examination track, band goals, and notifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Target Examination Selection */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Examination Track Selection
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, targetExam: 'academic' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              formData.targetExam === 'academic'
                ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-red-600" />
              <span className="font-black text-sm">IELTS Academic</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              For university entry, higher degrees, and professional certifications.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, targetExam: 'general' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              formData.targetExam === 'general'
                ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="font-black text-sm">IELTS General Training</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              For permanent residency, immigration visas, work permits, and employment.
            </p>
          </button>
        </div>
      </div>

      {/* Target Band Scores */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Target Band Scores (9-Band Scale)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Overall Band</span>
            <select
              value={formData.targetOverallBand}
              onChange={(e) => setFormData({ ...formData, targetOverallBand: parseFloat(e.target.value) })}
              className="w-full bg-transparent font-black text-base text-red-600 dark:text-red-400 focus:outline-none"
            >
              {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((num) => (
                <option key={num} value={num} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  Band {num.toFixed(1)}
                </option>
              ))}
            </select>
          </div>

          {(['listening', 'reading', 'writing', 'speaking'] as const).map((skill) => (
            <div
              key={skill}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
            >
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 capitalize">
                {skill}
              </span>
              <select
                value={formData.targetSkillBands[skill]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetSkillBands: {
                      ...formData.targetSkillBands,
                      [skill]: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full bg-transparent font-black text-base text-slate-900 dark:text-white focus:outline-none"
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

      {/* Daily Routine & Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Daily Study Dedication
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Minutes per day: {formData.dailyStudyMinutes} mins
              </label>
              <input
                type="range"
                min={20}
                max={180}
                step={10}
                value={formData.dailyStudyMinutes}
                onChange={(e) => setFormData({ ...formData, dailyStudyMinutes: parseInt(e.target.value) })}
                className="w-full accent-red-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={formData.examDate || ''}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Theme & Appearance
          </h3>

          <div className="space-y-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <span>{darkMode ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
              </div>
              <span className="text-slate-400">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Study Data</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
        >
          Save All Settings
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 space-y-3">
        <h4 className="font-bold text-xs text-red-700 dark:text-red-400 uppercase tracking-wider">
          Danger Zone
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Reset all cached progress, mock scores, flashcard levels, and diagnostic results back to clean state.
        </p>
        {!confirmingReset ? (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Academy Data</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setConfirmingReset(false);
                onResetAll();
              }}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Permanent Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmingReset(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
