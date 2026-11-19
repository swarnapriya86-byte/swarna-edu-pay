import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  CreditCard 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { StudentSidebar } from '../../components/dashboard/StudentSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/dataStore';
import { downloadReceiptAsPDF } from '../../services/pdfGenerator';
import { useToast } from '../../context/ToastContext';

export const ReceiptsListPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { student } = useAuth();
  const { success } = useToast();
  const currentStudent = student || dataStore.getStudents()[0];

  const receipts = dataStore.getReceipts().filter(r => r.payment?.student_id === currentStudent.id);

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Digital Fee Receipts Vault"
          subtitle="Authenticated institutional fee receipts with QR verification"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Issued Receipts ({receipts.length})
            </h3>
            <Link
              to="/verify"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Public QR Verification Tool →</span>
            </Link>
          </div>

          {receipts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">No Receipts Generated Yet</h4>
              <p className="text-xs text-slate-500">Pay any pending fee category to generate an official digital receipt.</p>
              <Link
                to="/payment"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                <span>Make a Payment</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receipts.map(rcp => {
                const verifyUrl = `${window.location.origin}/verify/${rcp.verification_code}`;
                return (
                  <div
                    key={rcp.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                            {rcp.receipt_number}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {rcp.payment?.fee?.category?.name || 'Academic Fee'}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      </div>

                      {/* Middle Details + QR */}
                      <div className="py-4 flex items-center justify-between gap-4">
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Amount Paid</p>
                          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                            ₹{Number(rcp.payment?.amount || 0).toLocaleString('en-IN')}
                          </div>
                          <p className="text-slate-500 text-[11px]">
                            Via {rcp.payment?.payment_method}
                          </p>
                          <p className="text-slate-400 text-[10px] pt-1">
                            {new Date(rcp.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                          <QRCodeSVG value={verifyUrl} size={64} level="M" />
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        Verif: <span className="font-bold text-blue-600">{rcp.verification_code}</span>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Link
                        to={`/receipt/${rcp.id}`}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Official PDF</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
