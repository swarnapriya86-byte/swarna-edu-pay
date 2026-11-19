import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Download,
  AlertCircle
} from 'lucide-react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';

export const FeeDetailsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student } = useAuth();
  const currentStudent = student || dataStore.getStudents()[0];

  const fees = dataStore.getFeesByStudentId(currentStudent.id);
  const summary = dataStore.getFeeSummary(currentStudent.id);

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Academic Fee Structure & Breakdown"
          subtitle="Detailed itemization of tuition, examinations, laboratory, and campus amenities"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Program Fees</span>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                ₹{summary.totalFee.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-slate-500">5 Active Categories</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cleared</span>
              <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
                ₹{summary.totalPaid.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-emerald-600 font-semibold">{summary.paymentProgress}% Paid</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Due / Outstanding</span>
              <p className="text-2xl font-black font-mono text-amber-600 mt-1">
                ₹{summary.pendingAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-slate-500">
                Next Due: {summary.nextDueDate ? new Date(summary.nextDueDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Fee Items Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Allocated Fee Categories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fees.map(f => {
                const pending = Math.max(0, f.total_amount - (f.paid_amount || 0));
                const progress = f.total_amount > 0 ? Math.round(((f.paid_amount || 0) / f.total_amount) * 100) : 0;
                const isCleared = pending === 0;

                return (
                  <div
                    key={f.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 uppercase">
                            Semester 5
                          </span>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
                            {f.category?.name || 'Fee Category'}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {f.category?.description || 'Mandatory academic component'}
                          </p>
                        </div>

                        {isCleared ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1 shrink-0">
                            <Clock className="w-3.5 h-3.5" /> Due
                          </span>
                        )}
                      </div>

                      {/* Amounts Breakdown */}
                      <div className="grid grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Total Allocated</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            ₹{Number(f.total_amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                          <span className="font-mono font-bold text-emerald-600">
                            ₹{Number(f.paid_amount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Balance Pending</span>
                          <span className="font-mono font-bold text-amber-600">
                            ₹{pending.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Settled</span>
                          <span className="font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCleared ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Deadline: <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(f.due_date).toLocaleDateString()}</span>
                      </span>

                      {!isCleared && (
                        <Link
                          to={`/payment?feeId=${f.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay ₹{pending.toLocaleString('en-IN')}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
