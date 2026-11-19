import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  // Two input fields: Username / Email and Password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // If already authenticated as authorized admin, forward to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      error('Please enter your Username or Email.');
      return;
    }

    if (!password) {
      error('Please enter your password.');
      return;
    }

    // Normalize email/username
    const normalizedEmail = trimmedUser.includes('@') 
      ? trimmedUser.toLowerCase() 
      : `${trimmedUser.toLowerCase()}@gmail.com`;

    // Strict authorized email check
    if (normalizedEmail !== 'swarnapriyaegala@gmail.com') {
      error('Access Denied: This account is not authorized for administrator access. Only swarnapriyaegala@gmail.com is permitted.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(normalizedEmail, 'admin', password);
      if (result.success) {
        success('Welcome to the Admin Portal.');
        navigate('/admin');
      } else {
        error(result.error || 'Authentication failed. Please verify your administrator credentials.');
      }
    } catch (err: any) {
      error(err?.message || 'Server error during administrator authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F8FF] dark:bg-[#080d1a] px-4 py-12 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <CreditCard className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-3xl font-black text-[#142B4A] dark:text-white">
            Edu<span className="text-blue-600">Pay</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-[#142B4A] dark:text-white tracking-tight">
          Admin Login
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter your administrator credentials to access the Admin Dashboard
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Field 1: Username / Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter Username or Email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button: One Login button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Return to Student Login Portal */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Student or Parent?</span>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Student Login Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
