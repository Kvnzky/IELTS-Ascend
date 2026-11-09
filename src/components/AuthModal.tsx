import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { UserAccount, ExamType } from '../types/ielts';
import { storageService } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: UserAccount | null;
  onAuthChange: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  onAuthChange,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState<ExamType>('academic');
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const res = storageService.loginAccount(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed.');
      return;
    }
    setSuccessMsg(`Welcome back, ${res.account?.name}!`);
    onAuthChange();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const res = storageService.registerAccount(name, email, password, targetExam, targetBand);
    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
      return;
    }
    setSuccessMsg(`Account created for ${res.account?.name}!`);
    onAuthChange();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const res = storageService.resetPassword(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Password reset failed.');
      return;
    }
    setSuccessMsg('Password updated! You can now sign in with your new password.');
    setTimeout(() => {
      setMode('login');
      setPassword('');
    }, 1000);
  };

  const handleLogout = () => {
    storageService.logoutAccount();
    onAuthChange();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[88vh] my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-extrabold text-base">
                {currentAccount ? 'Candidate Account Profile' : 'IELTS Academy Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Isolated personal study records & exam progress
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {currentAccount ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shrink-0">
                  {currentAccount.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Signed In Candidate
                  </span>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {currentAccount.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentAccount.email}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your curriculum mastery, diagnostic baseline, AI writing/speaking evaluations, and mock exam records are securely isolated to your account.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            <>
              {/* Mode Switch Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    resetMessages();
                  }}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    resetMessages();
                  }}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    mode === 'reset'
                      ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Recovery</span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all"
                  >
                    Sign In to Academy
                  </button>
                </form>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Candidate Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setTargetExam('academic')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        targetExam === 'academic'
                          ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-red-600" />
                        <span>Academic</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetExam('general')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        targetExam === 'general'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>General</span>
                      </div>
                    </button>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Overall Band: {targetBand.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min={5.5}
                      max={9.0}
                      step={0.5}
                      value={targetBand}
                      onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                      className="w-full accent-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all"
                  >
                    Create Candidate Account
                  </button>
                </form>
              )}

              {mode === 'reset' && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter your registered email address and set a new password to recover your account.
                  </p>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all"
                  >
                    Reset Password
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
