import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, Heart, Award, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Edu<span className="text-blue-500">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              EduPay is an enterprise-grade Student Payment Management System delivering seamless fee collections, automated receipting, digital verification, and real-time financial tracking for academic institutions.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-blue-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Supabase RLS Protected</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-emerald-400 border border-slate-700">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/#features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
              <li><Link to="/payment" className="hover:text-blue-400 transition-colors">Fee Payment</Link></li>
              <li><Link to="/receipts" className="hover:text-blue-400 transition-colors">Receipt Verification</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Student Login</Link></li>
              <li><Link to="/login?tab=admin" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">New Registration</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Finance Dashboard</Link></li>
              <li><Link to="/receipts" className="hover:text-blue-400 transition-colors">Public QR Lookup</Link></li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Academic Project</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <p className="font-semibold text-slate-200">Diploma CSE Final Year</p>
                <p className="mt-0.5">Capstone Project Presentation</p>
                <p className="text-blue-400 mt-1 font-mono">Academic Year 2024-2025</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Full-Stack Verified Architecture</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduPay Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Excellence
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>Apex Institute of Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
