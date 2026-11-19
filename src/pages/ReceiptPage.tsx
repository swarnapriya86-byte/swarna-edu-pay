import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  QrCode, 
  Calendar, 
  CreditCard,
  Building,
  CheckCircle2,
  Download
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ReceiptView } from '../components/payment/ReceiptView';
import { useAuth } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { Receipt } from '../types';

export const ReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { student, user } = useAuth();
  const navigate = useNavigate();

  const currentStudent = student || dataStore.getStudents()[0];
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStudentReceipts, setAllStudentReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    const receipts = dataStore.getReceipts();
    // Filter receipts for current student
    const studentReceipts = receipts.filter(r => r.payment?.student_id === currentStudent.id);
    setAllStudentReceipts(studentReceipts);

    if (id) {
      const found = receipts.find(r => r.id === id || r.receipt_number.toUpperCase() === id.toUpperCase());
      if (found) {
        setActiveReceipt(found);
      } else if (studentReceipts.length > 0) {
        setActiveReceipt(studentReceipts[0]);
      }
    } else if (studentReceipts.length > 0) {
      setActiveReceipt(studentReceipts[0]);
    }
  }, [id, currentStudent]);

  const filteredReceipts = allStudentReceipts.filter(r => 
    r.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.verification_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.payment?.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Official Digital Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A] dark:text-white tracking-tight">
              Institutional Fee Receipts
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Layout: Sidebar list of previous receipts + Active Receipt display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Previous Receipts List */}
          <div className="no-print lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Receipts History ({allStudentReceipts.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search receipt # / txn..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Receipts List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredReceipts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No matching receipts found.</p>
              ) : (
                filteredReceipts.map(rcp => {
                  const isSelected = activeReceipt?.id === rcp.id;
                  return (
                    <div
                      key={rcp.id}
                      onClick={() => setActiveReceipt(rcp)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm'
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span className="text-slate-900 dark:text-white">{rcp.receipt_number}</span>
                        <span className="text-emerald-600">₹{Number(rcp.payment?.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{rcp.payment?.fee?.category?.name || 'Fee Category'}</span>
                        <span>{new Date(rcp.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Receipt Component */}
          <div className="lg:col-span-8">
            {activeReceipt ? (
              <ReceiptView
                receipt={activeReceipt}
                student={currentStudent}
                fee={activeReceipt.payment?.fee}
                onBack={() => navigate('/dashboard')}
              />
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Receipts Available</h3>
                <p className="text-xs text-slate-500">Make your first fee payment to generate an official digital receipt.</p>
                <Link
                  to="/payment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make Fee Payment</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
