import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Layers, 
  CreditCard, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  Building
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success } = useToast();
  const { user } = useAuth();

  const analytics = dataStore.getAdminAnalytics();
  const allPayments = dataStore.getPayments();

  // Mode tab: 'ALL' | 'REAL' | 'DEMO'
  const [paymentModeTab, setPaymentModeTab] = useState<'ALL' | 'REAL' | 'DEMO'>('ALL');
  const [searchTxn, setSearchTxn] = useState('');

  const filteredPayments = allPayments.filter(p => {
    const matchesMode = paymentModeTab === 'ALL' || (paymentModeTab === 'REAL' ? !p.is_demo : p.is_demo);
    const matchesSearch = p.transaction_id.toLowerCase().includes(searchTxn.toLowerCase()) ||
                          (p.student?.profile?.full_name || '').toLowerCase().includes(searchTxn.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Student Name', 'Student ID', 'Amount', 'Method', 'Mode', 'Status', 'Date'];
    const rows = allPayments.map(p => [
      p.transaction_id,
      p.student?.profile?.full_name || 'N/A',
      p.student?.student_id || 'N/A',
      p.amount,
      p.payment_method,
      p.is_demo ? 'DEMO' : 'REAL_RAZORPAY',
      p.status,
      new Date(p.payment_date).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPay_Institutional_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Institutional financial report downloaded.');
  };

  const methodColors = ['#2563EB', '#10B981', '#F59E0B'];

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Institutional Finance & Administration"
          subtitle="Real-time fee collections, student enrollments, and ledger audits"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Verified Real Collection Active
                </span>
                <span className="text-xs text-slate-400 font-mono">FY 2024-2025</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Welcome back, {user?.full_name || 'Swarnapriya Egala'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Institutional Finance Control Center • Razorpay live collections are mathematically segregated from demonstration sandbox simulations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors flex items-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit CSV</span>
              </button>
              <Link
                to="/admin/students"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Manage Students</span>
              </Link>
            </div>
          </div>

          {/* Real vs Demo Separation Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Verified Razorpay Collection"
              value={`₹${analytics.realCollected.toLocaleString('en-IN')}`}
              subtitle={`${analytics.realTransactionsCount} Real Gateway Remittances`}
              icon={CreditCard}
              colorScheme="emerald"
              trend="+₹72,500 Real Realized"
              trendPositive={true}
            />
            <StatCard
              title="Demo Transaction Volume"
              value={`₹${analytics.demoVolume.toLocaleString('en-IN')}`}
              subtitle={`${analytics.demoTransactionsCount} College Demo Sim. (Segregated)`}
              icon={Sparkles}
              colorScheme="amber"
            />
            <StatCard
              title="Actual Outstanding Dues"
              value={`₹${analytics.totalPending.toLocaleString('en-IN')}`}
              subtitle="Pending real revenue"
              icon={Clock}
              colorScheme="rose"
            />
            <StatCard
              title="Total Billed Program Fees"
              value={`₹${analytics.totalExpectedFees.toLocaleString('en-IN')}`}
              subtitle={`${analytics.totalStudents} Active Students`}
              icon={Layers}
              colorScheme="blue"
            />
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Department Wise Collections Bar Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Department-Wise Collection Realization
                  </h3>
                  <p className="text-xs text-slate-500">Real Verified Razorpay Collections vs Outstanding</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Real Collected
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="collected" fill="#2563EB" radius={[4, 4, 0, 0]} name="Real Collected" />
                    <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mode Split Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Mode Distribution
                </h3>
                <p className="text-xs text-slate-500">Strict separation of accounts</p>
              </div>

              <div className="space-y-4 my-2">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Real Verified Revenue
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                    ₹{analytics.realCollected.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-600 block">
                    {analytics.realTransactionsCount} verified bank settlement records
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Demo Simulation Volume
                  </span>
                  <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300">
                    ₹{analytics.demoVolume.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-amber-600 block">
                    Excluded from institutional revenue audit
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300">Audit Rule:</span> Demo mode volume is never added to college balance sheets.
              </div>
            </div>

          </div>

          {/* Payment Remittances Table with Real vs Demo Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Institutional Payment Ledger
                </h3>
                <p className="text-xs text-slate-500">Filter between Genuine Gateway Receipts and Demo Simulations</p>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex text-xs font-bold">
                  <button
                    onClick={() => setPaymentModeTab('ALL')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      paymentModeTab === 'ALL'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    All ({allPayments.length})
                  </button>
                  <button
                    onClick={() => setPaymentModeTab('REAL')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      paymentModeTab === 'REAL'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Real Razorpay ({allPayments.filter(p => !p.is_demo).length})
                  </button>
                  <button
                    onClick={() => setPaymentModeTab('DEMO')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      paymentModeTab === 'DEMO'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Demo Only ({allPayments.filter(p => p.is_demo).length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTxn}
                    onChange={e => setSearchTxn(e.target.value)}
                    placeholder="Search txn / student..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-3">Transaction ID</th>
                    <th className="py-3.5 px-3">Student Name</th>
                    <th className="py-3.5 px-3">Student ID</th>
                    <th className="py-3.5 px-3">Amount</th>
                    <th className="py-3.5 px-3">Payment Mode</th>
                    <th className="py-3.5 px-3">Method</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPayments.map(p => {
                    const rcp = dataStore.getReceiptByPaymentId(p.id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {p.transaction_id}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {p.student?.profile?.full_name || 'Student'}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                          {p.student?.student_id || 'STU-000'}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-black text-slate-900 dark:text-white">
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          {p.is_demo ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              DEMO SIMULATION
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              REAL RAZORPAY
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-400">
                          {p.payment_method}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Success
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {rcp ? (
                            <Link
                              to={`/receipt/${rcp.id}`}
                              className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:underline"
                            >
                              #{rcp.receipt_number}
                            </Link>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
