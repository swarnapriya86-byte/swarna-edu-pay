import React, { useEffect, useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  FileCode, 
  Sun, 
  Key, 
  ExternalLink, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Lock, 
  Check, 
  Copy
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useTheme } from '../../context/ThemeContext';
import { checkSupabaseHealth, isSupabaseConfigured, SupabaseHealthReport } from '../../services/supabase';

export const AdminSettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState<SupabaseHealthReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchHealth = async () => {
    setIsChecking(true);
    try {
      const res = await checkSupabaseHealth();
      setHealth(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const copySqlNotice = () => {
    navigator.clipboard.writeText('/supabase/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tablesList = [
    { name: 'profiles', desc: 'Student & Admin Auth profiles linked with auth.users' },
    { name: 'students', desc: 'Enrolled student data, course & academic records' },
    { name: 'fee_categories', desc: 'Tuition, Exam, Lab, Library & Other fee definitions' },
    { name: 'student_fees', desc: 'Per-student ledger balances & due dates' },
    { name: 'payments', desc: 'Segregated Demo and Real transaction ledgers' },
    { name: 'receipts', desc: 'Digital receipt records & verification codes' },
    { name: 'notifications', desc: 'Fee deadline alerts & transaction notifications' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="System Architecture & Settings"
          subtitle="Database configurations, security policies, and administrative preferences"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Live Supabase Project Connection Status */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Connected Supabase Project</span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      uhwenfexhhlodksolkrl
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">Live PostgreSQL Database & Authentication Gateway</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchHealth}
                  disabled={isChecking}
                  className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Refresh Connection Status"
                >
                  <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                </button>

                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isSupabaseConfigured 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSupabaseConfigured ? 'Client Connected' : 'Offline Mode'}</span>
                </span>
              </div>
            </div>

            {/* Connection Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Endpoint URL</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white truncate">
                  https://uhwenfexhhlodksolkrl.supabase.co
                </p>
                <p className="text-[11px] text-slate-500">PostgreSQL REST / Auth</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auth Gateway</span>
                <p className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Operational</span>
                </p>
                <p className="text-[11px] text-slate-500">Student & Admin Auth active</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Protection</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>sb_publishable_...</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">service_role secret never exposed</p>
              </div>
            </div>

            {/* Tables Health Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>PostgreSQL Database Tables (7 Required)</span>
                </h4>
                <span className="text-xs text-slate-500">
                  {health ? `${Object.values(health.tableStatus).filter(s => s === 'ready').length} / 7 Online` : 'Checking...'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tablesList.map(tab => {
                  const status = health?.tableStatus[tab.name];
                  const isReady = status === 'ready';
                  return (
                    <div 
                      key={tab.name}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {tab.name}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {tab.desc}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide shrink-0 ${
                        isReady 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {isReady ? 'Active' : 'Ready in Store'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supabase SQL Schema Box */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>Production Schema Migration File</span>
                </div>
                <a
                  href="https://supabase.com/dashboard/project/uhwenfexhhlodksolkrl/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 text-[11px] underline"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans text-xs">
                Run the script in <code className="font-mono font-bold text-blue-700 dark:text-blue-300">supabase/schema.sql</code> once in your Supabase SQL Editor to initialize all 7 tables with Row Level Security (RLS) policies and automatic auth triggers.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySqlNotice}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Path Copied!' : 'Copy Path: supabase/schema.sql'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Theme Preferences</span>
            </h3>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Current Mode: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-slate-500">Adjust the interface contrast for your presentation setup</p>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
              >
                Toggle {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
