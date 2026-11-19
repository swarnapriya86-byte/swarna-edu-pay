import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  Download, 
  TrendingUp, 
  Layers, 
  CreditCard, 
  CheckCircle2, 
  Building,
  Sparkles,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const AdminReportsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success } = useToast();
  const analytics = dataStore.getAdminAnalytics();

  const handleExportFullReport = () => {
    const headers = ['Department', 'Expected Total (INR)', 'Verified Razorpay Collected (INR)', 'Demo Simulated Volume (INR)', 'Pending (INR)', 'Realization Rate (%)'];
    const rows = analytics.departmentStats.map(d => [
      d.name,
      d.total,
      d.collected,
      d.demoVolume,
      d.pending,
      `${d.collectionRate}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPay_Departmental_Financial_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Departmental financial audit CSV downloaded.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Institutional Financial Reports & Analytics"
          subtitle="Departmental revenue reconciliation, monthly trends, and audit summaries"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Year 2024-2025 Financial Statement
              </h3>
              <p className="text-xs text-slate-500">Autonomous institution revenue reconciliation (Real vs Demo segregated)</p>
            </div>

            <button
              onClick={handleExportFullReport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Departmental CSV</span>
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Program Billed</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                ₹{analytics.totalExpectedFees.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Full institutional budget</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Verified Razorpay Revenue</span>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                ₹{analytics.realCollected.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-emerald-600 font-bold">{analytics.overallCollectionRate}% realization rate</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Demo Simulation Volume</span>
              <div className="text-2xl font-black font-mono text-amber-600 mt-1">
                ₹{analytics.demoVolume.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Segregated testing volume</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Outstanding Receivables</span>
              <div className="text-2xl font-black font-mono text-rose-500 mt-1">
                ₹{analytics.totalPending.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Real pending dues</span>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Department-Wise Collection Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Department Name</th>
                    <th className="py-3.5 px-4 font-bold">Total Billed</th>
                    <th className="py-3.5 px-4 font-bold">Verified Real Collected</th>
                    <th className="py-3.5 px-4 font-bold">Demo Sim Volume</th>
                    <th className="py-3.5 px-4 font-bold">Real Pending</th>
                    <th className="py-3.5 px-4 font-bold">Realization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analytics.departmentStats.map(d => (
                    <tr key={d.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        {d.name}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        ₹{d.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                        ₹{d.collected.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-600">
                        ₹{d.demoVolume.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-rose-500">
                        ₹{d.pending.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${d.collectionRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{d.collectionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
