import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Send, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { WebsiteSettings } from '../types';

export const ContactPage: React.FC = () => {
  const { user, student } = useAuth();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<WebsiteSettings>(dataStore.getWebsiteSettings());
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [subject, setSubject] = useState('Fee Inquiry / Balance Clarification');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setSettings(dataStore.getWebsiteSettings());
    const handleSettingsUpdate = (e: any) => {
      setSettings(e.detail || dataStore.getWebsiteSettings());
    };
    window.addEventListener('edupay_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('edupay_settings_updated', handleSettingsUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      error('Please complete all mandatory fields (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      dataStore.addSupportRequest({
        student_id: student?.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      setIsSubmitting(false);
      setIsSent(true);
      success('Your inquiry has been submitted! Support reference created in EduPay portal.');
      setMessage('');
    } catch (err: any) {
      setIsSubmitting(false);
      error(err.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Direct Student Helpdesk
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#142B4A] dark:text-white tracking-tight">
              Contact Support & Finance Desk
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need assistance with tuition fee balances, duplicate receipts, scholarship verification or clearance? Connect with our dedicated support executive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Official Contact Card (Swarna Priya / Gudivada) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Institutional Accounts Support
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>College Accounts Division</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Officer in Charge: <strong className="text-slate-800 dark:text-slate-200">{settings.contact_person || 'Swarnapriya Egala'}</strong>
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Email Support */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                        Email Support
                      </span>
                      <a 
                        href="mailto:swarnapriyaegala@gmail.com"
                        className="font-mono font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs mt-0.5 block"
                      >
                        swarnapriyaegala@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                        Location
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs leading-relaxed mt-0.5">
                        Gudivada, Andhra Pradesh, India
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                        Office Hours
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5">
                        Monday – Saturday
                      </p>
                      <p className="text-[11px] text-slate-500">9:00 AM – 5:00 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>⚡ Fast-Track Resolution</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    For student fee payments, transaction issues, payment receipts and account-related support, please contact the College Accounts Division.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Support Request Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Submit a Student Support Request
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide your student details and query details below.
                  </p>
                </div>

                {isSent ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                      Inquiry Successfully Dispatched!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                      Your query has been logged and assigned to <strong>{settings.contact_person || 'Swarna Priya'}</strong>. You will receive an email update at <strong>{email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSent(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="student@edupay.ac.in"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Inquiry Subject *
                        </label>
                        <select
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="Fee Inquiry / Balance Clarification">Fee Inquiry / Balance Clarification</option>
                          <option value="Payment Debited but Status Pending">Payment Debited but Status Pending</option>
                          <option value="Duplicate Receipt / QR Code Error">Duplicate Receipt / QR Code Error</option>
                          <option value="Scholarship & Fee Concession">Scholarship & Fee Concession</option>
                          <option value="Examination Hall Ticket Block">Examination Hall Ticket Block</option>
                          <option value="Other Administrative Issue">Other Administrative Issue</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Detailed Message / Problem Description *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Please include your Student ID, Transaction ID (if applicable), and specific details of your request..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Official Inquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
