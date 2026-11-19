import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  FileText,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const AdminPaymentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success } = useToast();
  const [searchParams] = useSearchParams();
  const payments = dataStore.getPayments();

  const [modeTab, setModeTab] = useState<'ALL' | 'REAL' | 'DEMO'>('ALL');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'real') {
      setModeTab('REAL');
    } else if (filterParam === 'demo') {
      setModeTab('DEMO');
    } else {
      setModeTab('ALL');
    }
  }, [searchParams]);

  const filtered = payments.filter(p => {
    const matchesMode = modeTab === 'ALL' || (modeTab === 'REAL' ? !p.is_demo : p.is_demo);
    const matchesSearch = p.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
                          (p.student?.profile?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.student?.student_id || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesMode && matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Student Name', 'Student ID', 'Department', 'Amount', 'Method', 'Channel Mode', 'Status', 'Date'];
    const rows = filtered.map(p => [
      p.transaction_id,
      p.student?.profile?.full_name || 'N/A',
      p.student?.student_id || 'N/A',
      p.student?.department || 'N/A',
      p.amount,
      p.payment_method,
      p.is_demo ? 'DEMO SIMULATION' : 'REAL RAZORPAY',
      p.status,
      new Date(p.payment_date).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPay_Payments_${modeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Payments report (${modeTab}) downloaded.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Payment Ledgers & Transaction Audits"
          subtitle="Segregated tracking of Real Razorpay remittances and Demo Sandbox simulations"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transactions ({filtered.length})
                </h3>
                <p className="text-xs text-slate-500">
                  {modeTab === 'REAL' ? 'Displaying verified Razorpay bank collections only' : modeTab === 'DEMO' ? 'Displaying sandboxed presentation simulations only' : 'Displaying all recorded transactions'}
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ({modeTab}) CSV</span>
              </button>
            </div>

            {/* Mode Pills + Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex text-xs font-bold">
                <button
                  onClick={() => setModeTab('ALL')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    modeTab === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  All ({payments.length})
                </button>
                <button
                  onClick={() => setModeTab('REAL')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    modeTab === 'REAL'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Real Razorpay ({payments.filter(p => !p.is_demo).length})</span>
                </button>
                <button
                  onClick={() => setModeTab('DEMO')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    modeTab === 'DEMO'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Demo ({payments.filter(p => p.is_demo).length})</span>
                </button>
              </div>

              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction ID or student..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="FAILED">Failed Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Transaction Reference</th>
                    <th className="py-3.5 px-4 font-bold">Student Name</th>
                    <th className="py-3.5 px-4 font-bold">Student ID</th>
                    <th className="py-3.5 px-4 font-bold">Amount Paid</th>
                    <th className="py-3.5 px-4 font-bold">Channel Mode</th>
                    <th className="py-3.5 px-4 font-bold">Date & Time</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No transactions found in this view.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => {
                      const rcp = dataStore.getReceiptByPaymentId(p.id);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.transaction_id}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {p.student?.profile?.full_name || 'Student'}
                          </td>
                          <td className="py-4 px-4 font-mono text-blue-600 dark:text-blue-400">
                            {p.student?.student_id || 'STU-000'}
                          </td>
                          <td className="py-4 px-4 font-mono font-black text-slate-900 dark:text-white text-sm">
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4">
                            {p.is_demo ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                DEMO SIMULATION
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                REAL RAZORPAY
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {new Date(p.payment_date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Success
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {rcp ? (
                              <Link
                                to={`/receipt/${rcp.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </Link>
                            ) : (
                              <span className="text-slate-400">-</span>
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
