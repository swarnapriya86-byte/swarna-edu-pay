import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Copy, 
  Sparkles,
  ArrowRight,
  Info,
  QrCode,
  Check,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types';

interface DemoGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  feeCategoryName: string;
  studentName: string;
  studentId: string;
  onPaymentComplete: (result: {
    status: 'SUCCESS' | 'FAILED';
    paymentMethod: PaymentMethod;
    transactionId: string;
  }) => void;
}

export const DemoGatewayModal: React.FC<DemoGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  feeCategoryName,
  studentName,
  studentId,
  onPaymentComplete
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [processingStep, setProcessingStep] = useState<string>('Initializing secure demo gateway session...');
  const [demoTxnId, setDemoTxnId] = useState<string>('');

  // UPI State
  const [upiId, setUpiId] = useState('student@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState(studentName ? studentName.toUpperCase() : 'RAHUL SHARMA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('842');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setProcessingState('idle');
      // Generate a realistic unique Demo Transaction ID
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomHex = Math.floor(1000 + Math.random() * 9000);
      setDemoTxnId(`DEMO-TXN-${timestamp}-${randomHex}`);
      setCardHolder(studentName ? studentName.toUpperCase() : 'RAHUL SHARMA');
    }
  }, [isOpen, studentName]);

  if (!isOpen) return null;

  const handleSimulatePayment = (forceFailure = false) => {
    setProcessingState('processing');
    setProcessingStep('1/3: Establishing encrypted connection to sandbox clearinghouse...');

    setTimeout(() => {
      setProcessingStep(`2/3: Authorizing simulated ${selectedMethod} payment for ₹${amount.toLocaleString('en-IN')}...`);
    }, 900);

    setTimeout(() => {
      setProcessingStep('3/3: Synchronizing student fee ledger with institutional accounts...');
    }, 1800);

    setTimeout(() => {
      if (forceFailure) {
        setProcessingState('failed');
        setTimeout(() => {
          onPaymentComplete({
            status: 'FAILED',
            paymentMethod: selectedMethod,
            transactionId: demoTxnId
          });
        }, 1500);
      } else {
        setProcessingState('success');
        try {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {}

        setTimeout(() => {
          onPaymentComplete({
            status: 'SUCCESS',
            paymentMethod: selectedMethod,
            transactionId: demoTxnId
          });
        }, 1500);
      }
    }, 2700);
  };

  const handleFillDemoCard = () => {
    setCardNumber('4532 8901 2345 8892');
    setCardHolder(studentName ? studentName.toUpperCase() : 'RAHUL SHARMA');
    setCardExpiry('12/28');
    setCardCvv('942');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Prominent Demo Notice Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>DEMO PAYMENT SYSTEM (SANDBOXED SIMULATION)</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
            NO REAL MONEY CHARGED
          </span>
        </div>

        {/* Header Strip */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              EduPay SafeCheckout Simulator
            </p>
            <h3 className="text-2xl font-black text-[#142B4A] dark:text-white font-mono">
              ₹{amount.toLocaleString('en-IN')}.00
            </h3>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800">
              {feeCategoryName}
            </span>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Student ID: <span className="font-bold text-slate-700 dark:text-slate-300">{studentId}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {processingState === 'idle' && (
            <div className="space-y-6">
              
              {/* Demo Mode Guide Pill */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-blue-900 dark:text-blue-200">
                    Presentation Simulation Environment
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Select a payment method below. You can trigger <strong>Pay Now / Simulate Success</strong> to test receipt issuance, or <strong>Simulate Failure</strong> to test decline handling.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Select Simulated Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                      selectedMethod === 'UPI'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Debit/Credit Card')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                      selectedMethod === 'Debit/Credit Card'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span>Debit/Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Net Banking')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                      selectedMethod === 'Net Banking'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* 1. UPI Tab Content */}
              {selectedMethod === 'UPI' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
                    <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 shrink-0">
                      <QRCodeSVG
                        value={`upi://pay?pa=apex.edupay@icici&pn=ApexInstitute&am=${amount}&tn=DemoFee_${feeCategoryName}`}
                        size={120}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simulated Dynamic QR Code</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Receiver: Apex Institute of Technology & Engineering.
                      </p>
                      <div className="pt-1">
                        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700 px-2 py-0.5 rounded-lg">
                          VPA: apex.edupay@icici
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* App Icons Pill */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                      <div key={app} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {app}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                      Or enter simulated UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="e.g. rahul@oksbi"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId('student.2024@okaxis')}
                        className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        Sample UPI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Card Tab Content */}
              {selectedMethod === 'Debit/Credit Card' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Virtual Card Graphic */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-[#142B4A] via-blue-950 to-blue-800 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-blue-200">
                          Demo Student Campus Card
                        </span>
                      </div>
                      <span className="font-bold tracking-wider text-sm italic">VISA / RuPay</span>
                    </div>

                    <div className="font-mono text-lg tracking-widest text-slate-100 font-bold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cardholder</p>
                        <p className="font-bold tracking-wide text-slate-100">{cardHolder || 'STUDENT NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Expires</p>
                        <p className="font-bold tracking-wide text-slate-100">{cardExpiry || '12/28'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Auto-fill Demo Test Card
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Card Number (Demo)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        CVV (Simulated)
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Net Banking Tab Content */}
              {selectedMethod === 'Net Banking' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Select Simulated Banking Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          selectedBank === bank
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500">
                    Simulated redirection through {selectedBank} sandbox gateway.
                  </p>
                </div>
              )}

              {/* Live Transaction ID Reference Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Generated Demo Reference ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{demoTxnId}</span>
              </div>
            </div>
          )}

          {/* Processing Animation */}
          {processingState === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-800 dark:text-white">
                  Processing Demo Transaction
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-mono leading-relaxed">
                  {processingStep}
                </p>
                <p className="text-[11px] font-mono font-bold text-blue-600 pt-1">
                  Reference: {demoTxnId}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {processingState === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Demo Payment Confirmed!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Transaction recorded with status <strong className="text-emerald-600">SUCCESS</strong>. Redirecting to official digital receipt...
              </p>
            </div>
          )}

          {/* Failed State */}
          {processingState === 'failed' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-500/20">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Simulated Transaction Declined
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Transaction recorded with status <strong className="text-rose-600">FAILED</strong> in audit logs. No student fee balance was deducted.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls with Explicit Simulate Buttons */}
        {processingState === 'idle' && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Simulate Failure Button */}
              <button
                type="button"
                onClick={() => handleSimulatePayment(true)}
                title="Test simulated payment failure and error state logging"
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors"
              >
                Simulate Failure
              </button>

              {/* Pay Now / Simulate Success Button */}
              <button
                type="button"
                onClick={() => handleSimulatePayment(false)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay Now (Simulate Success)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
