import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      error('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`
        });
      }
      setIsSubmitting(false);
      setIsSent(true);
      success('Password reset instructions dispatched to your email address.');
    } catch (err: any) {
      setIsSubmitting(false);
      setIsSent(true); // Don't reveal account existence for security
      success('Password reset link sent.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center transition-colors">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#142B4A] dark:text-white">
              Edu<span className="text-blue-600">Pay</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-[#142B4A] dark:text-white tracking-tight mt-2">
            Reset Account Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered student or administrator email to receive a secure recovery link
          </p>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an account exists for <strong className="text-slate-800 dark:text-slate-200">{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@edupay.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-slate-400">
          Need urgent help? Visit the{' '}
          <Link to="/contact" className="text-blue-600 hover:underline">
            College Finance Desk
          </Link>
        </div>
      </div>
    </div>
  );
};
