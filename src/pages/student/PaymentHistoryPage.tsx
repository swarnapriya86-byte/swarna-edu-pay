import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText,
  CreditCard
} from 'lucide-react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const PaymentHistoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student } = useAuth();
  const { success } = useToast();
  const currentStudent = student || dataStore.getStudents()[0];

  const payments = dataStore.getPaymentsByStudentId(currentStudent.id);

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = payments.filter(p => {
    const matchesSearch = p.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
                          (p.fee?.category?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || p.payment_method === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Fee Category', 'Amount (INR)', 'Payment Method', 'Status', 'Date'];
    const rows = filtered.map(p => [
      p.transaction_id,
      p.fee?.category?.name || 'Academic Fee',
      p.amount,
      p.payment_method,
      p.status,
      new Date(p.payment_date).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payment_History_${currentStudent.student_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Payment history CSV exported.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Payment History & Audit Logs"
          subtitle="Comprehensive record of fee remittances, transaction statuses, and gateway confirmations"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Action & Filter Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  All Transactions ({filtered.length})
                </h3>
                <p className="text-xs text-slate-500">Filter by method or search by unique reference</p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction ID or category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <select
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Debit/Credit Card">Debit / Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success Only</option>
                <option value="PENDING">Pending Only</option>
                <option value="FAILED">Failed Only</option>
              </select>
            </div>
          </div>

          {/* Transactions List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Transaction ID</th>
                    <th className="py-3.5 px-4 font-bold">Fee Description</th>
                    <th className="py-3.5 px-4 font-bold">Amount Paid</th>
                    <th className="py-3.5 px-4 font-bold">Payment Method</th>
                    <th className="py-3.5 px-4 font-bold">Timestamp</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Digital Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => {
                      const rcp = dataStore.getReceiptByPaymentId(p.id);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.transaction_id}
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                            {p.fee?.category?.name || 'Academic Fee'}
                          </td>
                          <td className="py-4 px-4 font-mono font-black text-slate-900 dark:text-white text-sm">
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">
                            {p.payment_method}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {new Date(p.payment_date).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="py-4 px-4">
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
                          <td className="py-4 px-4 text-right">
                            {rcp ? (
                              <Link
                                to={`/receipt/${rcp.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Receipt</span>
                              </Link>
                            ) : (
                              <span className="text-slate-400 text-xs">N/A</span>
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
