import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Receipt, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Calculator, 
  ChevronDown, 
  Send, 
  QrCode, 
  Building2, 
  Users, 
  Award,
  Zap,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const { success } = useToast();

  // Interactive Fee Calculator State
  const [calcCourse, setCalcCourse] = useState('diploma-cse');
  const [calcSemester, setCalcSemester] = useState('sem-5');
  const [includeLab, setIncludeLab] = useState(true);
  const [includeLibrary, setIncludeLibrary] = useState(true);
  const [includeExam, setIncludeExam] = useState(true);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Fee Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Calculation Logic
  const baseTuition = calcCourse === 'diploma-cse' ? 45000 : calcCourse === 'btech-cse' ? 65000 : 40000;
  const labFee = includeLab ? 6000 : 0;
  const libraryFee = includeLibrary ? 2500 : 0;
  const examFee = includeExam ? 3500 : 0;
  const totalCalculatedFee = baseTuition + labFee + libraryFee + examFee;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      success('Thank you! Your inquiry has been forwarded to the Finance Office.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1000);
  };

  const faqs = [
    {
      q: 'How does EduPay securely verify fee payments?',
      a: 'EduPay combines encrypted transactional metadata with cryptographic verification codes and dynamic QR codes. Every transaction is matched with the college accounting ledger, generating an unforgeable digital receipt.'
    },
    {
      q: 'Which payment methods are supported in EduPay?',
      a: 'EduPay supports all major modern Indian payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards (Visa, RuPay, MasterCard), and Direct Net Banking across 50+ banking institutions.'
    },
    {
      q: 'How can students download and verify their receipts?',
      a: 'Once a payment is confirmed, an official digital receipt is immediately issued. Students can download high-resolution PDFs, print on A4 letterhead, or present the live QR code which anyone can scan to verify authenticity.'
    },
    {
      q: 'Is this system built with Supabase and Row Level Security?',
      a: 'Yes! EduPay is architected on Supabase PostgreSQL with robust Row Level Security (RLS) policies. Students can strictly only view and interact with their own financial records, while administrators enjoy secured oversight.'
    },
    {
      q: 'Can administrators set custom fee structures and due dates?',
      a: 'Absolutely. The Admin Finance portal features comprehensive Fee Management, allowing administrators to define fee categories, set semester deadlines, assign amounts by department, and track real-time collection metrics.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 transition-colors">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Next-Gen Academic Fintech Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#142B4A] dark:text-white tracking-tight leading-[1.15]">
                Smart & Secure <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                  Student Fee Payments
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Manage your college fees, track payments and download receipts easily with EduPay. Built with high-trust bank-grade security, instant QR verification, and real-time ledger synchronization.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-base rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 transition-all"
                >
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Student Login</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">₹24Cr+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fees Processed</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">99.98%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">Instant</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QR Receipts</p>
                </div>
              </div>
            </div>

            {/* Right: Fintech Dashboard Illustration Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Card 1: Payment Success Pill */}
                <div className="absolute -top-6 -left-6 z-20 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Fee Paid Successfully</p>
                    <p className="text-[11px] text-emerald-600 font-semibold font-mono">₹25,000 via UPI</p>
                  </div>
                </div>

                {/* Floating Card 2: QR Code Verified Badge */}
                <div className="absolute -bottom-6 -right-6 z-20 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Receipt #RCP-2024</p>
                    <p className="text-[11px] text-blue-600 font-semibold">Digitally Signed & Sealed</p>
                  </div>
                </div>

                {/* Main Mockup Card */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                        RS
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rahul Sharma</h4>
                        <p className="text-xs text-slate-500 font-mono">STU-2024-042 • Diploma CSE</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Active
                    </span>
                  </div>

                  {/* Fee Balance Widget */}
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#142B4A] to-blue-900 text-white shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Total Academic Fee</span>
                      <span className="text-xs font-mono bg-blue-800/80 px-2 py-0.5 rounded">2024-2025</span>
                    </div>
                    <div className="text-3xl font-black font-mono">₹60,000.00</div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-blue-200">
                        <span>Paid: ₹32,500</span>
                        <span>Pending: ₹27,500</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden">
                        <div className="w-[54%] h-full bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Fee Categories List */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Fee Breakdown & Status
                    </p>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Tuition Fee (Part 1)</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">₹25,000</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Examination Fee</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">₹3,500</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Laboratory Fee</span>
                      </div>
                      <span className="font-mono font-bold text-amber-600">₹6,000 Due</span>
                    </div>
                  </div>

                  {/* Pay button shortcut */}
                  <Link
                    to="/payment"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Pending Fees Now</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1: PLATFORM FEATURES */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#142B4A] dark:text-white tracking-tight">
              Engineered for Complete Financial Clarity
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              EduPay removes manual cashier lines and paper receipts with automated payment verification, real-time ledgers, and institutional insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Receipt,
                title: 'Instant Digital PDF Receipts',
                desc: 'Generate official, tamper-proof PDF receipts with institution stamps, QR verification, and complete breakdowns immediately upon transaction approval.'
              },
              {
                icon: Smartphone,
                title: 'Multi-Modal Payment Gateway',
                desc: 'Comprehensive support for dynamic UPI QR codes, debit & credit cards, and direct net banking integrations with full sandbox demo simulation.'
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Ledger Tracking',
                desc: 'Automated fee balance calculators continually compute paid vs pending amounts across tuition, exams, library, and laboratory categories.'
              },
              {
                icon: ShieldCheck,
                title: 'Bank-Grade Supabase Security',
                desc: 'Protected by PostgreSQL Row Level Security (RLS) guaranteeing students only view their authenticated ledger records and preventing manual tampering.'
              },
              {
                icon: Clock,
                title: 'Automated Due Reminders',
                desc: 'Never miss semester deadlines with intelligent notification center alerts, exam hall ticket clearance badges, and penalty prevention.'
              },
              {
                icon: Award,
                title: 'Admin Financial Analytics',
                desc: 'Department-wise collection breakdowns, monthly trend charts, pending dues summaries, and one-click CSV report exports for college audits.'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform mb-6">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-[#F5F8FF] dark:bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#142B4A] dark:text-white tracking-tight">
              How EduPay Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              A friction-free workflow designed for students and college administration alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Student Authentication',
                desc: 'Securely login with your student credentials or register your academic profile.'
              },
              {
                step: '02',
                title: 'Select Fee & Method',
                desc: 'Choose your fee category, calculate remaining balance, and select UPI, Card, or Net Banking.'
              },
              {
                step: '03',
                title: 'Simulate Payment',
                desc: 'Experience the sandboxed fintech gateway flow with dynamic QR and real-time bank clearance.'
              },
              {
                step: '04',
                title: 'Download & Verify',
                desc: 'Receive your verified digital PDF receipt instantly with a verifiable QR code.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono font-black text-lg flex items-center justify-center mb-5">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE FEE CALCULATOR */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-[#142B4A] via-blue-950 to-blue-900 text-white shadow-2xl">
            <div className="max-w-2xl mb-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Calculator className="w-3.5 h-3.5" /> Interactive Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Calculate Your Academic Fees
              </h2>
              <p className="text-xs sm:text-sm text-blue-200">
                Estimate your semester fee breakdown automatically based on your academic course and opted laboratory facilities.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200 block mb-1.5">
                      Select Academic Course
                    </label>
                    <select
                      value={calcCourse}
                      onChange={e => setCalcCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-blue-900/60 border border-blue-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="diploma-cse" className="bg-slate-900">Diploma in CSE (3 Years)</option>
                      <option value="btech-cse" className="bg-slate-900">B.Tech Computer Science</option>
                      <option value="diploma-ece" className="bg-slate-900">Diploma in ECE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200 block mb-1.5">
                      Academic Semester
                    </label>
                    <select
                      value={calcSemester}
                      onChange={e => setCalcSemester(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-blue-900/60 border border-blue-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="sem-1" className="bg-slate-900">Semester 1</option>
                      <option value="sem-3" className="bg-slate-900">Semester 3</option>
                      <option value="sem-5" className="bg-slate-900">Semester 5 (Final Year)</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-semibold text-blue-200 block">
                    Optional / Departmental Add-ons
                  </label>
                  
                  <label className="flex items-center justify-between p-3 rounded-xl bg-blue-900/40 border border-blue-800 text-xs cursor-pointer hover:bg-blue-900/60 transition-colors">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLab}
                        onChange={e => setIncludeLab(e.target.checked)}
                        className="rounded text-blue-500 focus:ring-0"
                      />
                      <span>Advanced Computer Laboratory & Cloud Access</span>
                    </span>
                    <span className="font-mono font-bold text-blue-300">+₹6,000</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-blue-900/40 border border-blue-800 text-xs cursor-pointer hover:bg-blue-900/60 transition-colors">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLibrary}
                        onChange={e => setIncludeLibrary(e.target.checked)}
                        className="rounded text-blue-500 focus:ring-0"
                      />
                      <span>Digital Library & E-Journals Access</span>
                    </span>
                    <span className="font-mono font-bold text-blue-300">+₹2,500</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-blue-900/40 border border-blue-800 text-xs cursor-pointer hover:bg-blue-900/60 transition-colors">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeExam}
                        onChange={e => setIncludeExam(e.target.checked)}
                        className="rounded text-blue-500 focus:ring-0"
                      />
                      <span>Semester End Examination Assessment Fee</span>
                    </span>
                    <span className="font-mono font-bold text-blue-300">+₹3,500</span>
                  </label>
                </div>
              </div>

              {/* Result Summary */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Estimated Total Payable
                </span>
                <div className="text-4xl font-black font-mono text-white tracking-tight">
                  ₹{totalCalculatedFee.toLocaleString('en-IN')}.00
                </div>
                <p className="text-xs text-blue-200">
                  Includes base tuition (₹{baseTuition.toLocaleString('en-IN')}) plus selected semester fees.
                </p>
                <Link
                  to="/payment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Pay Fees</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE EDUPAY */}
      <section id="about" className="py-20 bg-[#F5F8FF] dark:bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Institutional Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#142B4A] dark:text-white tracking-tight">
                Why Colleges & Students Trust EduPay
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Traditional college fee processing is riddled with long queues, manual ledger bookkeeping errors, and lost paper receipts. EduPay replaces this with a modern fintech infrastructure that automates student reconciliation in seconds.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  '100% Zero Manual Reconciliation: Ledger balances update instantly upon gateway clearance.',
                  'Cryptographic QR Receipt Codes: Instantly verifiable by examination boards and auditors.',
                  'Role-Based Access Control: Strict separation between students and finance administrators.',
                  'Export Ready: 1-Click CSV data downloads for university financial reporting.'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Security & Compliance Checklist</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Supabase Row Level Security</span>
                  <span className="px-2 py-0.5 rounded font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Sensitive PIN / CVV Storage</span>
                  <span className="px-2 py-0.5 rounded font-bold text-blue-700 bg-blue-100 dark:bg-blue-950">Never Stored (Zero-Trust)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Transaction ID Uniqueness</span>
                  <span className="px-2 py-0.5 rounded font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950">Strict Constraint</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Public QR Verification Registry</span>
                  <span className="px-2 py-0.5 rounded font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQS */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black text-[#142B4A] dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Everything you need to know about EduPay fee management and verification.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT SECTION */}
      <section id="contact" className="py-20 bg-[#F5F8FF] dark:bg-[#080d1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Help & Support
            </span>
            <h2 className="text-3xl font-black text-[#142B4A] dark:text-white">
              Institutional Finance & Support Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Connect directly with our accounts division for payment receipts, clearance queries, or fee structures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Configured Contact Support Details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>College Accounts Division</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Email Support</span>
                      <a href="mailto:swarnapriyaegala@gmail.com" className="font-bold text-slate-900 dark:text-white hover:text-blue-600 font-mono text-xs">
                        swarnapriyaegala@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Location</span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        Gudivada, Andhra Pradesh, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Office Hours</span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        Monday – Saturday
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">9:00 AM – 5:00 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ⚡ Fast-Track Resolution
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    For student fee payments, transaction issues, payment receipts and account-related support, please contact the College Accounts Division.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Support Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-6">
                  Submit an Inquiry or Fee Grievance
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
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
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="student@edupay.ac.in"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Subject
                    </label>
                    <select
                      value={contactSubject}
                      onChange={e => setContactSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Fee Inquiry">Fee Inquiry / Balance Clarification</option>
                      <option value="Payment Issue">Payment Debited but Pending Status</option>
                      <option value="Receipt Issue">Receipt Download / QR Verification</option>
                      <option value="Scholarship">Scholarship & Fee Concession</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="Provide your Student ID and specific query..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{contactSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
