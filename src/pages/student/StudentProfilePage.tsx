import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Award,
  Hash
} from 'lucide-react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const StudentProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student, user } = useAuth();
  const { success } = useToast();
  const currentStudent = student || dataStore.getStudents()[0];
  const currentUser = user || currentStudent.profile;

  const [phone, setPhone] = useState(currentUser?.phone || '+91 91234 56789');
  const [address, setAddress] = useState(currentStudent.address || 'Flat 402, Green Valley Enclave, Bengaluru');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      dataStore.updateStudent(currentStudent.id, {
        phone,
        address
      });
      setIsSaving(false);
      success('Student profile updated successfully.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Student Profile & Enrollment"
          subtitle="Manage your contact information and review verified institutional enrollment"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Profile Overview Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
              {currentUser?.full_name?.charAt(0) || 'R'}
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.full_name || 'Rahul Sharma'}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                  {currentStudent.student_id}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Enrolled & Active
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {currentStudent.course} • {currentStudent.department}
              </p>
              <p className="text-xs text-slate-500">
                Academic Year {currentStudent.academic_year} • {currentStudent.semester}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academic Information (Read-Only) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Building2 className="w-4 h-4" /> Academic Record (Registrar Verified)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Institution</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    Apex Institute of Technology & Engineering
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {currentStudent.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Program & Course</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {currentStudent.course}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Academic Term</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {currentStudent.academic_year} • {currentStudent.semester}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {currentStudent.dob || '2004-06-15'}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Contact Details */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="w-4 h-4" /> Contact Information
              </h3>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'rahul.sharma@edupay.ac.in'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Residential Address
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Updating...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
