import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Clock, 
  Building,
  User,
  Calculator,
  Info,
  Sparkles,
  Zap,
  Lock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataStore } from '../services/dataStore';
import { StudentFee, PaymentMethod } from '../types';
import { DemoGatewayModal } from '../components/payment/DemoGatewayModal';
import { 
  loadRazorpayScript, 
  createRazorpayOrder, 
  verifyRazorpayPayment 
} from '../services/razorpay';
import { Modal } from '../components/common/Modal';

export const PaymentPage: React.FC = () => {
  const { student, user } = useAuth();
  const { success, error, warning, info } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentStudent = student || dataStore.getStudents()[0];
  const currentUser = user || currentStudent.profile;

  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [razorpayConfigModal, setRazorpayConfigModal] = useState(false);
  const [razorpayErrorMessage, setRazorpayErrorMessage] = useState('');
  const [showRealGatewayAccordion, setShowRealGatewayAccordion] = useState(false);

  // Load student fees
  useEffect(() => {
    if (currentStudent) {
      const fees = dataStore.getFeesByStudentId(currentStudent.id);
      setStudentFees(fees);

      const queryFeeId = searchParams.get('feeId');
      const targetFee = fees.find(f => f.id === queryFeeId) || fees.find(f => (f.total_amount - (f.paid_amount || 0)) > 0) || fees[0];

      if (targetFee) {
        setSelectedFeeId(targetFee.id);
        const pending = Math.max(0, targetFee.total_amount - (targetFee.paid_amount || 0));
        setAmount(pending > 0 ? pending : targetFee.total_amount);
      }
    }
  }, [currentStudent, searchParams]);

  const summary = currentStudent ? dataStore.getFeeSummary(currentStudent.id) : {
    totalFee: 60000,
    totalPaid: 32500,
    realPaid: 31000,
    demoPaid: 1500,
    pendingAmount: 27500,
    nextDueDate: '2024-12-15',
    paymentProgress: 54
  };

  const selectedFee = studentFees.find(f => f.id === selectedFeeId);
  const selectedFeePending = selectedFee ? Math.max(0, selectedFee.total_amount - (selectedFee.paid_amount || 0)) : 0;
  const calculatedRemaining = Math.max(0, selectedFeePending - (Number(amount) || 0));

  const handleFeeCategoryChange = (feeId: string) => {
    setSelectedFeeId(feeId);
    const fee = studentFees.find(f => f.id === feeId);
    if (fee) {
      const pending = Math.max(0, fee.total_amount - (fee.paid_amount || 0));
      setAmount(pending > 0 ? pending : fee.total_amount);
    }
  };

  const handlePresetAmount = (preset: 'full' | 'half') => {
    if (!selectedFee) return;
    if (preset === 'full') {
      setAmount(selectedFeePending);
    } else if (preset === 'half') {
      setAmount(Math.round(selectedFeePending / 2));
    }
  };

  // ----------------------------------------------------
  // DEMO PAYMENT SYSTEM: LAUNCH MODAL OR QUICK ACTIONS
  // ----------------------------------------------------
  const handleOpenDemoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      warning('Please enter a valid payment amount greater than ₹0.');
      return;
    }
    if (amount > selectedFeePending && selectedFeePending > 0) {
      warning(`Entered amount (₹${amount}) exceeds pending balance (₹${selectedFeePending}).`);
      return;
    }
    setIsDemoModalOpen(true);
  };

  // One-click quick simulation right from page
  const handleQuickSimulate = (status: 'SUCCESS' | 'FAILED') => {
    if (!amount || amount <= 0) {
      warning('Please enter a valid payment amount greater than ₹0.');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const txnId = `DEMO-TXN-${timestamp}-${rand}`;

    if (status === 'SUCCESS') {
      const { receipt } = dataStore.createPayment({
        studentId: currentStudent.id,
        feeId: selectedFeeId,
        amount: Number(amount),
        paymentMethod: 'UPI',
        status: 'SUCCESS',
        isDemo: true,
        transactionId: txnId
      });

      success(`[DEMO SUCCESS] Simulated payment of ₹${amount.toLocaleString('en-IN')} confirmed! (Ref #${txnId})`);
      if (receipt) {
        navigate(`/receipt/${receipt.id}`);
      } else {
        navigate('/receipts');
      }
    } else {
      dataStore.createPayment({
        studentId: currentStudent.id,
        feeId: selectedFeeId,
        amount: Number(amount),
        paymentMethod: 'UPI',
        status: 'FAILED',
        isDemo: true,
        transactionId: txnId
      });

      error(`[DEMO FAILED] Simulated transaction decline logged in student audit history (Ref #${txnId}). Fee balance unchanged.`);
    }
  };

  // Demo Modal Completion
  const handleDemoPaymentComplete = (result: {
    status: 'SUCCESS' | 'FAILED';
    paymentMethod: PaymentMethod;
    transactionId: string;
  }) => {
    setIsDemoModalOpen(false);

    if (result.status === 'SUCCESS') {
      const { receipt } = dataStore.createPayment({
        studentId: currentStudent.id,
        feeId: selectedFeeId,
        amount: Number(amount),
        paymentMethod: result.paymentMethod,
        status: 'SUCCESS',
        isDemo: true,
        transactionId: result.transactionId
      });

      success(`[DEMO CONFIRMED] Simulated payment of ₹${amount.toLocaleString('en-IN')} successful! Receipt generated.`);
      if (receipt) {
        navigate(`/receipt/${receipt.id}`);
      } else {
        navigate('/receipts');
      }
    } else {
      dataStore.createPayment({
        studentId: currentStudent.id,
        feeId: selectedFeeId,
        amount: Number(amount),
        paymentMethod: result.paymentMethod,
        status: 'FAILED',
        isDemo: true,
        transactionId: result.transactionId
      });

      error(`[DEMO DECLINED] Transaction logged with status FAILED. No fee balance deducted.`);
    }
  };

  // Optional Real Razorpay Handler
  const handleRealRazorpayPayment = async () => {
    setIsProcessingRazorpay(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setIsProcessingRazorpay(false);
      error('Failed to load Razorpay SDK from secure CDN.');
      return;
    }

    const orderResult = await createRazorpayOrder({
      amount: Number(amount),
      studentId: currentStudent.id,
      feeId: selectedFeeId
    });

    if (!orderResult.success) {
      setIsProcessingRazorpay(false);
      if (orderResult.needsConfig) {
        setRazorpayErrorMessage(orderResult.error || 'Razorpay keys not configured.');
        setRazorpayConfigModal(true);
      } else {
        error(orderResult.error || 'Failed to initialize payment gateway.');
      }
      return;
    }

    const options = {
      key: orderResult.keyId,
      amount: orderResult.amount,
      currency: orderResult.currency || 'INR',
      name: 'Apex Institute of Technology',
      description: `Academic Fee: ${selectedFee?.category?.name || 'Tuition Fee'}`,
      order_id: orderResult.orderId,
      prefill: {
        name: currentUser?.full_name || 'Rahul Sharma',
        email: currentUser?.email || 'student@edupay.ac.in',
        contact: currentUser?.phone || '9876543210'
      },
      theme: { color: '#2563EB' },
      modal: {
        ondismiss: () => {
          setIsProcessingRazorpay(false);
          info('Payment checkout closed.');
        }
      },
      handler: async (response: any) => {
        info('Verifying signature with backend...');
        const verifyResult = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          studentId: currentStudent.id,
          feeId: selectedFeeId,
          amount: Number(amount),
          paymentMethod: 'Razorpay Standard'
        });

        setIsProcessingRazorpay(false);

        if (verifyResult.verified) {
          const { receipt } = dataStore.createPayment({
            studentId: currentStudent.id,
            feeId: selectedFeeId,
            amount: Number(amount),
            paymentMethod: 'Razorpay Standard',
            status: 'SUCCESS',
            isDemo: false,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          success(`Payment confirmed! Genuine receipt issued.`);
          if (receipt) navigate(`/receipt/${receipt.id}`);
        } else {
          error(verifyResult.error || 'Signature verification rejected.');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setIsProcessingRazorpay(false);
        error(`Payment failed: ${resp.error?.description || 'Gateway declined'}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessingRazorpay(false);
      error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>EduPay Demo Payment Gateway (Zero Keys Required)</span>
          </div>
          <h1 className="text-3xl font-black text-[#142B4A] dark:text-white tracking-tight">
            Student Fee Payment System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate fee payment using simulated UPI, Card, or Net Banking without real money deduction
          </p>
        </div>

        {/* Student Profile & Summary Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Profile</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.full_name || 'Rahul Sharma'}
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                {currentStudent?.student_id || 'STU-2024-042'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentStudent?.department || 'CSE'}
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Program Fee</span>
              <div className="text-2xl font-black font-mono text-slate-800 dark:text-white">
                ₹{summary.totalFee.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Academic Year 2024-2025</span>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Already Paid</span>
              <div className="text-2xl font-black font-mono text-emerald-600">
                ₹{summary.totalPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-emerald-600 font-medium">Verified by Accounts</span>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Dues</span>
              <div className="text-2xl font-black font-mono text-amber-600">
                ₹{summary.pendingAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">
                Next Due: {summary.nextDueDate ? new Date(summary.nextDueDate).toLocaleDateString() : 'All Cleared'}
              </span>
            </div>

          </div>
        </div>

        {/* Payment Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Demo Checkout Controls */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* Prominent Demo Badge */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                    DEMO PAYMENT SYSTEM READY
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 rounded-full">
                    NO PAN / NO API KEYS
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every demo transaction is safely sandboxed. You can trigger the complete checkout modal with simulated UPI QR, test cards, and net banking, or use the quick simulation buttons below.
                </p>
              </div>
            </div>

            <form onSubmit={handleOpenDemoModal} className="space-y-6">
              
              {/* Fee Category Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  1. Select Fee Category *
                </label>
                <div className="space-y-2">
                  {studentFees.map(fee => {
                    const isSelected = fee.id === selectedFeeId;
                    const feePending = Math.max(0, fee.total_amount - (fee.paid_amount || 0));
                    const isFullyPaid = feePending === 0;

                    return (
                      <div
                        key={fee.id}
                        onClick={() => handleFeeCategoryChange(fee.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="feeCategory"
                            checked={isSelected}
                            onChange={() => handleFeeCategoryChange(fee.id)}
                            className="text-blue-600 focus:ring-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">
                              {fee.category?.name || 'Fee Item'}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Total: ₹{fee.total_amount.toLocaleString('en-IN')} • Due: {new Date(fee.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {isFullyPaid ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Fully Cleared
                            </span>
                          ) : (
                            <span className="font-mono text-xs font-bold text-amber-600">
                              Pending: ₹{feePending.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amount Entry & Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    2. Payment Amount (INR) *
                  </label>
                  {selectedFeePending > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePresetAmount('half')}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        50% (₹{Math.round(selectedFeePending / 2).toLocaleString('en-IN')})
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetAmount('full')}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Full Pending (₹{selectedFeePending.toLocaleString('en-IN')})
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-mono font-bold text-slate-400 text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={selectedFeePending > 0 ? selectedFeePending : 100000}
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xl font-mono font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Action Button: Open Demo Checkout Modal */}
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <CreditCard className="w-5 h-5" />
                <span>Open Demo Checkout Modal (₹{Number(amount || 0).toLocaleString('en-IN')})</span>
              </button>

              {/* Instant Quick-Simulation Buttons Row */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Direct One-Click Simulation
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSimulate('SUCCESS')}
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>⚡ Simulate Success</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSimulate('FAILED')}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Simulate Failure</span>
                  </button>
                </div>
              </div>

            </form>

            {/* Optional Real Gateway Accordion */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRealGatewayAccordion(!showRealGatewayAccordion)}
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Optional: Real Gateway Test (Razorpay Checkout)</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showRealGatewayAccordion ? 'rotate-180' : ''}`} />
              </button>

              {showRealGatewayAccordion && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    If you have Razorpay test API keys in your <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">.env</code>, you can launch the live checkout modal:
                  </p>
                  <button
                    type="button"
                    disabled={isProcessingRazorpay}
                    onClick={handleRealRazorpayPayment}
                    className="w-full py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isProcessingRazorpay ? 'Connecting...' : 'Launch Razorpay Gateway Modal'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Live Calculation Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Automatic Balance Calculator</span>
              </h3>

              <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Selected Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedFee?.category?.name || 'Tuition Fee'}
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₹{Number(selectedFee?.total_amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-slate-500">Already Cleared:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    - ₹{Number(selectedFee?.paid_amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-slate-500">Current Outstanding:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₹{selectedFeePending.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-blue-600 font-semibold">Paying in this txn:</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">
                    ₹{Number(amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between pt-3 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Remaining Balance:</span>
                  <span className={`font-mono font-black ${calculatedRemaining === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ₹{calculatedRemaining.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {calculatedRemaining === 0 && selectedFeePending > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>This payment clears 100% of this fee category!</span>
                </div>
              )}
            </div>

            {/* Architecture Card */}
            <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Full Verification & Receipt Pipeline
              </p>
              <p className="leading-relaxed">
                Every confirmed demo payment automatically generates an authenticated digital receipt with a verifiable QR code, updates the student dashboard, and saves to the payment ledger.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Demo Gateway Simulator Modal */}
      <DemoGatewayModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        amount={Number(amount)}
        feeCategoryName={selectedFee?.category?.name || 'Tuition Fee'}
        studentName={currentUser?.full_name || 'Rahul Sharma'}
        studentId={currentStudent?.student_id || 'STU-2024-042'}
        onPaymentComplete={handleDemoPaymentComplete}
      />

      {/* Razorpay Info Modal if real gateway keys are missing */}
      <Modal
        isOpen={razorpayConfigModal}
        onClose={() => setRazorpayConfigModal(false)}
        title="Razorpay API Credentials Notice"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {razorpayErrorMessage}
          </p>
          <p className="text-slate-500">
            For presentations, use the <strong>Demo Payment System</strong> which requires zero external configuration.
          </p>
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setRazorpayConfigModal(false)}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
            >
              Continue with Demo Payment
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
