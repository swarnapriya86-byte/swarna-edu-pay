import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Check, 
  ExternalLink, 
  User, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { Link, useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, title, subtitle }) => {
  const { user, student, role, isAdmin, logout } = useAuth();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const navigate = useNavigate();

  const notifications = student ? dataStore.getNotifications(student.id) : [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    if (student) {
      dataStore.markAllNotificationsRead(student.id);
      setShowNotifDropdown(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(role === 'admin' ? '/admin/login' : '/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Authorized Clearance Pill & Session Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Admin Clearance</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Student Portal</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Dropdown (for student) */}
        {role === 'student' && (
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Notifications ({notifications.length})
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          dataStore.markNotificationRead(n.id);
                        }}
                        className={`p-3 rounded-xl text-xs transition-colors cursor-pointer ${
                          n.is_read
                            ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                            : 'bg-blue-50/70 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className={n.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-blue-700 dark:text-blue-400'}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <ThemeToggle />

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.full_name || 'User'}
            </p>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
