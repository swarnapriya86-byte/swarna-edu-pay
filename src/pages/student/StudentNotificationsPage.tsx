import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CreditCard 
} from 'lucide-react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const StudentNotificationsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student } = useAuth();
  const { success } = useToast();
  const currentStudent = student || dataStore.getStudents()[0];

  const [notifications, setNotifications] = useState(dataStore.getNotifications(currentStudent.id));

  const handleMarkRead = (id: string) => {
    dataStore.markNotificationRead(id);
    setNotifications(dataStore.getNotifications(currentStudent.id));
  };

  const handleMarkAllRead = () => {
    dataStore.markAllNotificationsRead(currentStudent.id);
    setNotifications(dataStore.getNotifications(currentStudent.id));
    success('All notifications marked as read.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Notification Center"
          subtitle="Official alerts, fee due reminders, and clearance notices"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Alerts ({notifications.length})
            </h3>
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No notifications at this time.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                    n.is_read
                      ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80'
                      : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.is_read
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${n.is_read ? 'text-slate-800 dark:text-slate-200' : 'text-blue-900 dark:text-white'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
