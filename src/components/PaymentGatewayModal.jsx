import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, ShieldCheck, CheckCircle2, Copy, Clock, ArrowRight, Lock, Key, FileText } from 'lucide-react';

export const PaymentGatewayModal = ({ isOpen, onClose, orderItem, onPaymentSuccess, onShowToast }) => {
  const [step, setStep] = useState(1); // 1: QR & UTR, 2: Verifying, 3: Confirmation Info
  const [utrInput, setUtrInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isVerifying, setIsVerifying] = useState(false);

  const payableAmount = orderItem 
    ? (typeof orderItem.priceInr === 'number' ? orderItem.priceInr : (parseInt(orderItem.priceInr) || 1000))
    : 1000;

  useEffect(() => {
    if (isOpen && orderItem) {
      setStep(1);
      setUtrInput('');
      setTimeLeft(600);
      setIsVerifying(false);

      // Generate Demo Gateway Payment QR
      const demoUpiString = `upi://pay?pa=demo.gateway@upi&pn=DeepMarketGateway&am=${payableAmount}&cu=INR`;
      QRCode.toDataURL(demoUpiString, { margin: 1, width: 220 })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, orderItem, payableAmount]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || step !== 1) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen || !orderItem) return null;

  const isValidUtr = utrInput.trim().length >= 8 && utrInput.trim().length <= 22 && /^[a-zA-Z0-9]+$/.test(utrInput.trim());

  const handleVerifyUtr = (e) => {
    e.preventDefault();
    if (!isValidUtr) return;

    setStep(2);
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          ...orderItem,
          utr: utrInput.trim(),
          paymentStatus: 'verified',
          accessKey: `DM-KEY-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }
      if (onShowToast) onShowToast("Payment verified! Access information generated.");
    }, 2500);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 font-['Satoshi']">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 p-1.5 flex items-center justify-center text-purple-700">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">Payment Gateway (Demo)</h3>
              <p className="text-xs text-[#6e5a8e] font-medium">Scan QR &amp; Enter UTR Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* STEP 1: SCAN QR & UTR INPUT */}
        {step === 1 && (
          <form onSubmit={handleVerifyUtr} className="space-y-5 font-['Satoshi'] animate-fade-in">
            
            {/* Order Info & Amount */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#6e5a8e] font-bold uppercase tracking-wider">Item Name</p>
                <p className="font-black text-sm text-[#1e1035]">{orderItem.suiteName || orderItem.tierName || 'Virtual Card Suite'}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#6e5a8e] font-bold uppercase tracking-wider">Payable Amount</p>
                <p className="font-black text-xl text-purple-700 font-mono">₹{payableAmount.toLocaleString()}.00</p>
              </div>
            </div>

            {/* QR CODE DISPLAY */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-2xl border-2 border-purple-300 bg-white shadow-sm">
                <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center">
                  {qrUrl ? (
                    <img src={qrUrl} alt="Gateway Payment QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-purple-400 font-bold animate-pulse">Generating QR...</div>
                  )}
                </div>
              </div>
              <p className="text-[11px] font-bold text-[#6e5a8e] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Scan QR with any UPI app to pay ₹{payableAmount.toLocaleString()}
              </p>
            </div>

            {/* TIMER LOCK */}
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs">
              <span className="flex items-center gap-1.5 text-purple-900 font-semibold">
                <Clock className="w-3.5 h-3.5 text-purple-700 animate-spin" />
                <span>Gateway Session Active</span>
              </span>
              <span className="font-mono font-bold text-purple-700">{formatTimer(timeLeft)}</span>
            </div>

            {/* UTR INPUT FIELD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-[#1e1035] uppercase tracking-wider">Enter 12-Digit Banking UTR / Reference ID</label>
                <span className={`font-mono text-[11px] ${isValidUtr ? 'text-purple-700 font-bold' : 'text-[#6e5a8e]'}`}>
                  {utrInput.length}/12
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={22}
                placeholder="e.g. 423189076512"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full h-12 px-4 bg-purple-50/70 border border-purple-200 rounded-xl text-sm font-mono text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold tracking-widest"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!isValidUtr}
              className={`glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                !isValidUtr ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>SUBMIT UTR FOR VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFYING ANIMATION */}
        {step === 2 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 font-['Satoshi'] animate-fade-in">
            <div className="relative w-28 h-28">
              <div className="w-full h-full rounded-full border-4 border-purple-100 border-t-purple-700 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-purple-700 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xl text-[#1e1035]">Verifying Banking UTR...</h4>
              <p className="text-xs text-[#6e5a8e] font-mono font-semibold">UTR: {utrInput}</p>
            </div>
          </div>
        )}

        {/* STEP 3: DEMO CONFIRMATION & ACCESS INFORMATION */}
        {step === 3 && (
          <div className="space-y-5 font-['Satoshi'] animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-black text-2xl text-[#1e1035]">Payment Confirmed!</h4>
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-block">
                ✓ Gateway Verified UTR: {utrInput}
              </p>
            </div>

            {/* DEMO ACCESS INFORMATION BOX */}
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                <Key className="w-4 h-4 text-purple-700" />
                <h5 className="font-black text-xs text-[#1e1035] uppercase tracking-wider">Demo Order Access Information</h5>
              </div>

              <div className="space-y-2 text-xs font-['Satoshi']">
                <div className="flex justify-between">
                  <span className="text-[#6e5a8e] font-medium">Order ID:</span>
                  <span className="font-mono font-bold text-[#1e1035]">{orderItem.id || orderItem.orderNumber || 'DM-1001'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e5a8e] font-medium">Card Suite:</span>
                  <span className="font-bold text-[#1e1035]">{orderItem.suiteName || orderItem.tierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e5a8e] font-medium">Guaranteed Balance:</span>
                  <span className="font-bold text-purple-700">{orderItem.cardBalance || '₹8,320'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e5a8e] font-medium">Demo Access Token:</span>
                  <span className="font-mono text-purple-900 font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
                    DM-AUTH-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>RETURN TO MARKETPLACE</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
