import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  Moon, 
  Sun, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2 
} from 'lucide-react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export const StudentSettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { success, error } = useToast();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      error('Please complete all password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      error('New password and confirm password do not match.');
      return;
    }
    success('Password updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Account Settings & Preferences"
          subtitle="Customize interface themes and configure password security"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto w-full">
          {/* Theme Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Theme & Appearance</span>
            </h3>
            <p className="text-xs text-slate-500">
              Toggle between high-contrast light fintech mode and dark terminal mode.
            </p>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {theme === 'dark' ? 'Dark Theme (Active)' : 'Light Theme (Active)'}
                  </p>
                  <p className="text-[11px] text-slate-500">Persisted in browser localStorage</p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          {/* Password Security */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Change Portal Password</span>
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
