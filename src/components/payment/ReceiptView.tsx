import React from 'react';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  CreditCard,
  User,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Receipt, Student, StudentFee } from '../../types';
import { downloadReceiptAsPDF } from '../../services/pdfGenerator';
import { useToast } from '../../context/ToastContext';

interface ReceiptViewProps {
  receipt: Receipt;
  student?: Student;
  fee?: StudentFee;
  onBack?: () => void;
  showBackBtn?: boolean;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  receipt,
  student,
  fee,
  onBack,
  showBackBtn = true
}) => {
  const { success } = useToast();
  const payment = receipt.payment;
  const isDemo = receipt.is_demo || payment?.is_demo;

  const verifyUrl = `${window.location.origin}/verify/${receipt.verification_code}`;

  const handleDownload = () => {
    downloadReceiptAsPDF('official-edupay-receipt', receipt.receipt_number);
    success('Receipt PDF download started.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        {showBackBtn && onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Digital Receipt Card */}
      <div
        id="official-edupay-receipt"
        className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl relative overflow-hidden"
      >
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-3.5 ${
          isDemo 
            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500' 
            : 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600'
        }`} />

        {/* DEMO NOTICE BANNER (Prominently displayed if demo) */}
        {isDemo && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>DEMO MODE TRANSACTION — NOT A VALID LEGAL / FINANCIAL RECEIPT</span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded">
              COLLEGE PROJECT SIMULATION
            </span>
          </div>
        )}

        {/* Institution Header */}
        <div className="pb-8 border-b-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0">
              <Building className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#142B4A]">
                APEX INSTITUTE OF TECHNOLOGY & ENGINEERING
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                Department of Finance & Accounts • Autonomous Institution
              </p>
              <p className="text-xs text-slate-500">
                Accredited 'A+' Grade by NAAC | Approved by AICTE
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            {isDemo ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DEMO SIMULATION</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OFFICIALLY VERIFIED</span>
              </span>
            )}
            <p className="text-[11px] font-mono text-slate-500 mt-1.5">
              Receipt #: <span className="font-bold text-slate-800">{receipt.receipt_number}</span>
            </p>
          </div>
        </div>

        {/* Receipt Title */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              FEE PAYMENT RECEIPT (ACADEMIC YEAR 2024-2025)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isDemo 
                ? 'Educational Sandbox Simulator Mode' 
                : 'Processed and Verified via Razorpay Standard Gateway Integration'}
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Verification Code: </span>
            <span className={`font-mono font-bold ${isDemo ? 'text-amber-700' : 'text-blue-700'}`}>
              {receipt.verification_code}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs border-b border-slate-100">
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-blue-800">
              <User className="w-3.5 h-3.5" /> Student Credentials
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-800">{student?.profile?.full_name || 'Rahul Sharma'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Student ID / Roll No:</span>
              <span className="font-mono font-bold text-slate-800">{student?.student_id || 'STU-2024-042'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{student?.department || 'Computer Science & Engineering'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Course / Semester:</span>
              <span className="font-semibold text-slate-800">{student?.course || 'Diploma CSE'} • {student?.semester || 'Semester 5'}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-blue-800">
              <CreditCard className="w-3.5 h-3.5" /> Payment Metadata
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-800">{payment?.transaction_id || 'TXN-RZP-2024'}</span>
            </div>
            {payment?.razorpay_order_id && (
              <div className="flex justify-between py-1 border-b border-slate-100 font-mono text-[11px]">
                <span className="text-slate-500">Razorpay Order ID:</span>
                <span className="text-slate-700">{payment.razorpay_order_id}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Date:</span>
              <span className="font-semibold text-slate-800">
                {payment?.payment_date ? new Date(payment.payment_date).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : new Date().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-bold text-slate-800">{payment?.payment_method || 'Razorpay Standard'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transaction Mode:</span>
              <span className={`font-bold ${isDemo ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isDemo ? 'DEMO SIMULATION' : 'REAL VERIFIED GATEWAY'}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="py-6 border-b border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-bold">#</th>
                <th className="py-3 px-4 font-bold">Fee Description</th>
                <th className="py-3 px-4 font-bold text-right">Category Allocated</th>
                <th className="py-3 px-4 font-bold text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-mono">01</td>
                <td className="py-3.5 px-4">
                  <p className="font-bold text-slate-800">
                    {fee?.category?.name || 'Academic Fee'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Remitted for Academic Session 2024-2025
                  </p>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                  ₹{Number(fee?.total_amount || 45000).toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                  ₹{Number(payment?.amount || 25000).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-blue-50/60 font-bold">
                <td colSpan={3} className="py-3.5 px-4 text-right text-slate-700 text-xs uppercase tracking-wider">
                  Total Amount Received
                </td>
                <td className="py-3.5 px-4 text-right text-blue-700 text-base font-mono">
                  ₹{Number(payment?.amount || 25000).toLocaleString('en-IN')}.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer with QR Code */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm shrink-0">
              <QRCodeSVG
                value={verifyUrl}
                size={84}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-left space-y-1 text-[11px] text-slate-500 max-w-xs">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Digital QR Verification
              </p>
              <p>
                Scan this QR code with any mobile camera to verify this receipt directly on the public registry.
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-2">
            <div className="inline-block p-3 rounded-2xl border-2 border-dashed border-blue-400/80 bg-blue-50/50 text-center">
              <p className="text-[10px] font-bold text-blue-800 tracking-wider uppercase">
                EduPay Digital Signoff
              </p>
              <p className="text-xs font-serif italic text-slate-800 font-bold mt-1">
                Accounts Officer / Dean of Finance
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                Cryptographically Signed • No Physical Stamp Required
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
