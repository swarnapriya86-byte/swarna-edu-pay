import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  History, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const { student, user, logout } = useAuth();
  const navigate = useNavigate();

  const unreadNotifs = student ? dataStore.getNotifications(student.id).filter(n => !n.is_read).length : 0;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Fee Details', path: '/fees', icon: Layers },
    { label: 'Make Payment', path: '/payment', icon: CreditCard, highlight: true },
    { label: 'Payment History', path: '/history', icon: History },
    { label: 'My Receipts', path: '/receipts', icon: FileText },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Contact Support', path: '/contact', icon: HelpCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-black text-[#142B4A] dark:text-white">
                Edu<span className="text-blue-600">Pay</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 -mt-0.5 uppercase tracking-wider">
                Student Portal
              </span>
            </div>
          </NavLink>
        </div>

        {/* User Quick Info */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
            {user?.full_name?.charAt(0) || 'S'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {user?.full_name || 'Rahul Sharma'}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium truncate">
              {student?.student_id || 'STU-2024-042'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : item.highlight
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
