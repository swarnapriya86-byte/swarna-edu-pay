import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Save, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  User
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore, DEFAULT_WEBSITE_SETTINGS } from '../../services/dataStore';
import { WebsiteSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminWebsitePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success, info } = useToast();

  const [settings, setSettings] = useState<WebsiteSettings>(dataStore.getWebsiteSettings());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(dataStore.getWebsiteSettings());
  }, []);

  const handleChange = (field: keyof WebsiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      dataStore.updateWebsiteSettings(settings);
      setIsSaving(false);
      success('Website configuration updated! Changes reflected across public portal.');
    } catch (err: any) {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_WEBSITE_SETTINGS);
    dataStore.updateWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
    info('Reset to default institutional configuration.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Website Content & Portal Settings"
          subtitle="Configure college branding, landing page hero text, statistics, and official contact details"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Header Action Bar */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Dynamic Website Control
                </h2>
                <p className="text-xs text-slate-500">
                  Settings are stored in the database and reactively update public navigation, hero, and helpdesk.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Apply Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1. College Accounts Division & Contact Details */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Building2 className="w-4 h-4" /> 1. College Accounts Division Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Designated Contact Person / Officer *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contact_person}
                    onChange={e => handleChange('contact_person', e.target.value)}
                    placeholder="Swarnapriya Egala"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Official Support Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.contact_email}
                    onChange={e => handleChange('contact_email', e.target.value)}
                    placeholder="swarnapriyaegala@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Physical Office Location & Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contact_address}
                    onChange={e => handleChange('contact_address', e.target.value)}
                    placeholder="Gudivada, Andhra Pradesh, India"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Helpdesk Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={e => handleChange('contact_phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    value={settings.college_name}
                    onChange={e => handleChange('college_name', e.target.value)}
                    placeholder="Apex Institute of Technology & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Homepage Hero Section & Messaging */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Globe className="w-4 h-4" /> 2. Public Homepage Content
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Homepage Hero Heading
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.hero_heading}
                    onChange={e => handleChange('hero_heading', e.target.value)}
                    placeholder="Smart & Secure Student Fee Payments"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Homepage Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hero_description}
                    onChange={e => handleChange('hero_description', e.target.value)}
                    placeholder="Manage your college fees, make secure online payments and access your payment receipts anytime."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Footer Statement / Institutional Trust Notice
                  </label>
                  <textarea
                    rows={2}
                    value={settings.footer_text}
                    onChange={e => handleChange('footer_text', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Homepage Statistics */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="w-4 h-4" /> 3. Institutional Statistics Cards
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Active Students
                  </label>
                  <input
                    type="text"
                    value={settings.stats_active_students}
                    onChange={e => handleChange('stats_active_students', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Success Rate
                  </label>
                  <input
                    type="text"
                    value={settings.stats_success_rate}
                    onChange={e => handleChange('stats_success_rate', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Colleges / Wings
                  </label>
                  <input
                    type="text"
                    value={settings.stats_verified_institutions}
                    onChange={e => handleChange('stats_verified_institutions', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Avg Clearance
                  </label>
                  <input
                    type="text"
                    value={settings.stats_avg_clearance}
                    onChange={e => handleChange('stats_avg_clearance', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save All Website Settings</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
