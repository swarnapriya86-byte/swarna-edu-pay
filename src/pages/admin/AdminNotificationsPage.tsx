import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Building, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const AdminNotificationsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success, error } = useToast();
  const students = dataStore.getStudents();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'ALL' | string>('ALL');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      error('Please provide both notification title and message body.');
      return;
    }

    setIsBroadcasting(true);
    setTimeout(() => {
      if (target === 'ALL') {
        dataStore.broadcastNotification(title, message);
        success(`Broadcast notice sent to all ${students.length} students!`);
      } else {
        dataStore.sendNotification(target, title, message);
        const stu = students.find(s => s.id === target);
        success(`Notification delivered to ${stu?.profile?.full_name || 'Student'}.`);
      }
      setIsBroadcasting(false);
      setTitle('');
      setMessage('');
    }, 600);
  };

  const handleQuickTemplate = (templateType: 'due' | 'exam' | 'receipt') => {
    if (templateType === 'due') {
      setTitle('Upcoming Fee Due Date Reminder');
      setMessage('Semester 5 Laboratory Fee and pending tuition fees must be cleared before 20th December 2024 to avoid late charges.');
    } else if (templateType === 'exam') {
      setTitle('End-Semester Examination Hall Ticket Notice');
      setMessage('All students with fully cleared examination fees may now download their hall tickets from the student portal.');
    } else {
      setTitle('Digital Fee Receipts Verification Active');
      setMessage('Please verify that your digital PDF receipts display the authenticated cryptographic QR code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Campus Notification Dispatcher"
          subtitle="Broadcast payment due notices, fee deadlines, and clearance alerts"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto w-full">
          {/* Broadcaster Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Compose Institutional Announcement
                </h3>
                <p className="text-xs text-slate-500">Notifications appear instantly on student dashboards</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Live Dispatcher
              </span>
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Quick Template Presets
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('due')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Fee Due Reminder
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('exam')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Exam Hall Ticket
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('receipt')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Receipt Verification
                </button>
              </div>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                  Recipient Audience *
                </label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Enrolled Students (Campus Broadcast)</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Direct: {s.profile?.full_name} ({s.student_id}) - {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Semester 5 Fee Payment Deadline"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                  Notification Body *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write clear instructions for students..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isBroadcasting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isBroadcasting ? 'Broadcasting...' : 'Dispatch Notification'}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
