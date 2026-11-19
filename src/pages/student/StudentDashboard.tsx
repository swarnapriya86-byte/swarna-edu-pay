import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Layers, 
  Calendar, 
  TrendingUp, 
  Download, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  Search,
  Filter
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
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const StudentDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student, user } = useAuth();
  const { success } = useToast();

  const currentStudent = student || dataStore.getStudents()[0];
  const currentUser = user || currentStudent.profile;

  const summary = dataStore.getFeeSummary(currentStudent.id);
  const fees = dataStore.getFeesByStudentId(currentStudent.id);
  const payments = dataStore.getPaymentsByStudentId(currentStudent.id);

  // Search & Filter state for transactions
  const [txnSearch, setTxnSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.transaction_id.toLowerCase().includes(txnSearch.toLowerCase()) ||
                          p.payment_method.toLowerCase().includes(txnSearch.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data: Monthly payments
  const monthlyData = [
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 6000 },
    { month: 'Nov', amount: 26500 },
    { month: 'Dec (Est)', amount: 27500 }
  ];

  // Chart data: Category distribution
  const pieColors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const categoryData = fees.map((f, i) => ({
    name: f.category?.name || 'Category',
    value: Number(f.total_amount),
    paid: Number(f.paid_amount || 0),
    color: pieColors[i % pieColors.length]
  }));

  // CSV Export for payment reports
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Fee Category', 'Amount (INR)', 'Payment Method', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.transaction_id,
      p.fee?.category?.name || 'Fee',
      p.amount,
      p.payment_method,
      p.status,
      new Date(p.payment_date).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPay_Payment_Report_${currentStudent.student_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Payment report CSV downloaded successfully.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Student Financial Dashboard"
          subtitle="Real-time academic fee tracking, schedules, and digital records"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full border border-white/20">
                Academic Year 2024-2025 • Semester 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Welcome back, {currentUser?.full_name || 'Rahul'}!
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
                Your examination clearance is verified. You have ₹{summary.pendingAmount.toLocaleString('en-IN')} in upcoming semester dues.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report CSV</span>
              </button>
              <Link
                to="/payment"
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black shadow-lg transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Make Fee Payment</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total College Fees"
              value={`₹${summary.totalFee.toLocaleString('en-IN')}`}
              subtitle="Full Academic Year"
              icon={Layers}
              colorScheme="indigo"
            />
            <StatCard
              title="Total Paid"
              value={`₹${summary.totalPaid.toLocaleString('en-IN')}`}
              subtitle={`${summary.paymentProgress}% settled`}
              icon={CheckCircle2}
              colorScheme="emerald"
              trend="+₹25,000 this month"
              trendPositive={true}
            />
            <StatCard
              title="Pending Amount"
              value={`₹${summary.pendingAmount.toLocaleString('en-IN')}`}
              subtitle="Balance remaining"
              icon={CreditCard}
              colorScheme="amber"
            />
            <StatCard
              title="Next Payment Due"
              value={summary.nextDueDate ? new Date(summary.nextDueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'All Cleared'}
              subtitle="Lab & Term Fee"
              icon={Clock}
              colorScheme="blue"
            />
          </div>

          {/* Progress Tracker Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Academic Fee Settlement Progress
                </h3>
                <p className="text-xs text-slate-500">
                  ₹{summary.totalPaid.toLocaleString('en-IN')} paid out of ₹{summary.totalFee.toLocaleString('en-IN')} total fee
                </p>
              </div>
              <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
                {summary.paymentProgress}%
              </span>
            </div>
            
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${summary.paymentProgress}%` }}
              />
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Monthly Trend Chart */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fee Payment Timeline (Monthly)
                  </h3>
                  <p className="text-xs text-slate-500">Payments disbursed across 2024</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                  INR (₹)
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Payment']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Fee Allocation by Category
                </h3>
                <p className="text-xs text-slate-500">Distribution of semester expenses</p>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                {categoryData.map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Upcoming Due Date Reminders */}
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                  Semester 5 Fee Deadline Reminder
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Laboratory fee (₹6,000) and remaining tuition balance are due before 20th December 2024 to clear end-term hall tickets.
                </p>
              </div>
            </div>
            <Link
              to="/payment"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Pay Dues Now
            </Link>
          </div>

          {/* Recent Transactions Table with Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Payment Transactions
                </h3>
                <p className="text-xs text-slate-500">Verified receipts & gateway transaction logs</p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={txnSearch}
                    onChange={e => setTxnSearch(e.target.value)}
                    placeholder="Search transaction..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="FAILED">Failed Only</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">Fee Category</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(p => {
                      const rcp = dataStore.getReceiptByPaymentId(p.id);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {p.transaction_id}
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                            {p.fee?.category?.name || 'Academic Fee'}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-black text-slate-900 dark:text-white">
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-400">
                            {p.payment_method}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500">
                            {new Date(p.payment_date).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3">
                            {p.status === 'SUCCESS' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Success</span>
                              </span>
                            ) : p.status === 'FAILED' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                                Failed
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {rcp ? (
                              <Link
                                to={`/receipt/${rcp.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </Link>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
