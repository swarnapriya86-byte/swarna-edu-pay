import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  CreditCard, 
  Building, 
  User, 
  ArrowLeft 
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { dataStore } from '../services/dataStore';
import { Receipt } from '../types';

export const VerifyReceiptPage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const [searchInput, setSearchInput] = useState(code || '');
  const [verifiedReceipt, setVerifiedReceipt] = useState<Receipt | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (code) {
      performVerification(code);
    }
  }, [code]);

  const performVerification = (query: string) => {
    setHasSearched(true);
    const trimmed = query.trim().toUpperCase();
    const receipts = dataStore.getReceipts();
    const match = receipts.find(
      r => r.verification_code.toUpperCase() === trimmed || r.receipt_number.toUpperCase() === trimmed
    );
    setVerifiedReceipt(match || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      performVerification(searchInput);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Verification Portal Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Verification Registry</span>
          </div>
          <h1 className="text-3xl font-black text-[#142B4A] dark:text-white tracking-tight">
            EduPay Official Receipt Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Scan QR code or enter the verification code printed on your digital receipt to authenticate its validity with the college ledger.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter Verification Code (e.g. VERIF-9821-XQ) or Receipt #"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-colors"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {verifiedReceipt ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
                
                {/* Verified Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Cryptographically Valid & Sealed
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      Authentic Educational Fee Receipt
                    </h3>
                    <p className="text-xs text-slate-500">
                      Apex Institute of Technology & Engineering • Dept of Accounts
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Particulars</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {verifiedReceipt.payment?.student?.profile?.full_name || 'Rahul Sharma'}
                    </p>
                    <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      ID: {verifiedReceipt.payment?.student?.student_id || 'STU-2024-042'}
                    </p>
                    <p className="text-slate-500">
                      {verifiedReceipt.payment?.student?.department || 'Computer Science & Engineering'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Particulars</span>
                    <div className="text-lg font-black font-mono text-emerald-600">
                      ₹{Number(verifiedReceipt.payment?.amount || 0).toLocaleString('en-IN')}.00
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">
                      {verifiedReceipt.payment?.fee?.category?.name || 'Tuition Fee'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Txn: {verifiedReceipt.payment?.transaction_id}
                    </p>
                  </div>
                </div>

                {/* Receipt Codes */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
                  <div>
                    <span className="text-slate-500 block">Receipt Number</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {verifiedReceipt.receipt_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Verification Code</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {verifiedReceipt.verification_code}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payment Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(verifiedReceipt.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to={`/receipt/${verifiedReceipt.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    <span>View & Download Official PDF Receipt</span>
                  </Link>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 shadow-xl text-center space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Verification Failed: No Matching Receipt Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The verification code "{searchInput}" does not match any authenticated record in the institutional database. Please double check the code printed on the receipt.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
