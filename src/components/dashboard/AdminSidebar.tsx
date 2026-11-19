import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserPlus,
  Building2,
  BookOpen,
  Layers, 
  CreditCard, 
  FileText, 
  PieChart, 
  Bell, 
  Headphones,
  Globe,
  Settings, 
  LogOut, 
  ShieldCheck,
  Building,
  CheckCircle,
  FlaskConical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navSections = [
    {
      title: 'Core Administration',
      items: [
        { label: 'Overview', path: '/admin', icon: BarChart3, exact: true },
        { label: 'Manage Students', path: '/admin/students', icon: Users, exact: true },
        { label: 'Add Student', path: '/admin/students/new', icon: UserPlus },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Courses', path: '/admin/courses', icon: BookOpen },
        { label: 'Fee Management', path: '/admin/fees', icon: Layers },
      ]
    },
    {
      title: 'Transactions & Ledgers',
      items: [
        { label: 'Payment Records', path: '/admin/payments', icon: CreditCard, exact: true },
        { label: 'Real Transactions', path: '/admin/payments?filter=real', icon: CheckCircle },
        { label: 'Demo Transactions', path: '/admin/payments?filter=demo', icon: FlaskConical },
        { label: 'Receipts', path: '/admin/receipts', icon: FileText },
        { label: 'Reports & Analytics', path: '/admin/reports', icon: PieChart },
      ]
    },
    {
      title: 'Communications & Site Control',
      items: [
        { label: 'Notifications', path: '/admin/notifications', icon: Bell },
        { label: 'Contact Support', path: '/admin/support', icon: Headphones },
        { label: 'Website Management', path: '/admin/website', icon: Globe },
        { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isCurrentActive = (itemPath: string, exact?: boolean) => {
    const currentFull = location.pathname + location.search;
    if (itemPath.includes('?')) {
      return currentFull === itemPath;
    }
    if (exact) {
      return location.pathname === itemPath && !location.search;
    }
    return location.pathname === itemPath;
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-black text-white">
                Edu<span className="text-blue-500">Pay</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </span>
            </div>
          </NavLink>
        </div>

        {/* Admin Quick Info */}
        <div className="p-3.5 mx-3.5 my-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
            {user?.full_name?.charAt(0) || 'S'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              {user?.full_name || 'Swarnapriya Egala'}
            </p>
            <p className="text-[11px] text-blue-400 font-medium truncate font-mono">
              {user?.email || 'swarnapriyaegala@gmail.com'}
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 space-y-4 overflow-y-auto pb-4 text-xs">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </span>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isCurrentActive(item.path, item.exact);
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                        active
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Admin Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
