import React, { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle, ArrowRight, Zap, ShoppingBag, Copy, Clock, ShieldAlert, Tag, QrCode, GraduationCap, PlusCircle, Check } from 'lucide-react';
import { sanitizeText, checkRateLimit } from '../lib/security';
import { CaptchaWidget } from './CaptchaWidget';
import { RazorpayPaymentButton } from './RazorpayPaymentButton';

export const CheckoutModal = ({ isOpen, onClose, selectedSuite, selectedBrand, onAddTransaction, onOpenOrders, onShowToast }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'crypto'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Optional Add-on Course state (₹400)
  const [includeCourseAddon, setIncludeCourseAddon] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // LTC Transaction Hash / TxID State
  const [userLtcTxId, setUserLtcTxId] = useState('');
  const [ltcTxError, setLtcTxError] = useState('');

  // Payment Gateway Configuration
  const demoLtcAddress = "ltc1qu6z2mt0zym24u0mx0r0p6ck02nckyy2h026c97";
  const demoUpiId = "deepmarket.pay@upi";
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

  if (!isOpen || !selectedSuite) return null;

  const isCourseItem = selectedSuite.id === 'carding-course';

  const basePrice = selectedSuite.priceInr || 1000;
  const courseAddonPrice = (!isCourseItem && includeCourseAddon) ? 400 : 0;
  const subtotalBeforeDiscount = basePrice + courseAddonPrice;

  const discountAmount = appliedPromo ? Math.round(subtotalBeforeDiscount * 0.10) : 0;
  const totalPaid = Math.max(0, subtotalBeforeDiscount - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');

    // Rate Limiting Security Check
    const rateCheck = checkRateLimit('promo_attempt', 5, 60000);
    if (!rateCheck.allowed) {
      setPromoError(rateCheck.message);
      if (onShowToast) onShowToast(rateCheck.message);
      return;
    }

    const code = sanitizeText(promoInput).toUpperCase();
    if (code === 'DEEPNET50') {
      const discount = Math.round(subtotalBeforeDiscount * 0.10);
      setAppliedPromo({
        code: 'DEEPNET50',
        discountPercent: 10,
        discountAmount: discount
      });
      setPromoError('');
      if (onShowToast) onShowToast("🎉 Promo code DEEPNET50 applied! 10% OFF discount activated.");
    } else if (!code) {
      setPromoError('Please enter a promo code');
    } else {
      setPromoError('Invalid promo code. Use DEEPNET50 for 10% OFF!');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
    if (onShowToast) onShowToast("Promo code removed.");
  };

  const handleCopyLtc = () => {
    navigator.clipboard.writeText(demoLtcAddress);
    if (onShowToast) onShowToast("LTC Deposit Address copied to clipboard!");
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(demoUpiId);
    if (onShowToast) onShowToast("Demo UPI VPA ID copied to clipboard!");
  };

  const handleConfirmCheckout = async (e) => {
    e.preventDefault();

    // Rate Limiting Security Check for Checkout Submissions
    const rateCheck = checkRateLimit('checkout_submit', 3, 30000);
    if (!rateCheck.allowed) {
      if (onShowToast) onShowToast(rateCheck.message);
      return;
    }

    // Proceed directly to payment gateway without blocking

    // Require LTC Transaction Hash / TxID for LTC Crypto Payments
    if (paymentMethod === 'crypto') {
      const cleanTxId = sanitizeText(userLtcTxId).trim();
      if (!cleanTxId || cleanTxId.length < 8) {
        setLtcTxError('Please enter your 64-character LTC Transaction Hash / TxID for verification.');
        if (onShowToast) onShowToast("Security Alert: LTC Transaction ID / Hash is required!");
        return;
      }
      setLtcTxError('');
    }

    setIsProcessing(true);

    const orderId = `DM-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderItemTitle = includeCourseAddon && !isCourseItem 
      ? `${selectedSuite.name} + Carding Masterclass Course Bundle` 
      : selectedSuite.name;

    // INSTANT RAZORPAY MODAL POPUP FLOW
    if (paymentMethod === 'razorpay') {
      try {
        const amountInPaise = totalPaid * 100;
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

        const openRazorpayModal = (serverOrderId = null) => {
          const options = {
            key: razorpayKeyId || 'rzp_test_TMrxw5OYPRmaZk',
            amount: amountInPaise,
            currency: 'INR',
            name: 'DEEP MARKET',
            description: `Purchase: ${orderItemTitle}`,
            image: '/assets/dm_logo_icon.png',
            order_id: serverOrderId || undefined,
            handler: async function (response) {
              const newOrder = {
                id: orderId,
                orderNumber: orderId,
                suiteId: selectedSuite.id,
                suiteName: orderItemTitle,
                basePrice: basePrice,
                courseAddonPrice: courseAddonPrice,
                subtotal: subtotalBeforeDiscount,
                discountAmount: discountAmount,
                appliedPromoCode: appliedPromo ? appliedPromo.code : null,
                gatewayFee: 0,
                totalPaid: totalPaid,
                priceInr: totalPaid,
                priceUsd: selectedSuite.priceUsd,
                brand: selectedBrand,
                cardBalance: selectedSuite.cardBalance,
                processingSla: selectedSuite.processingSla,
                status: 'Completed',
                date: new Date().toLocaleDateString(),
                timestamp: new Date().toLocaleString(),
                paymentMethod: 'Razorpay API Gateway',
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpayOrderId: response.razorpay_order_id || serverOrderId,
                includedCourseAddon: includeCourseAddon && !isCourseItem
              };

              setCreatedOrder(newOrder);
              setIsProcessing(false);
              setIsSuccess(true);
              if (onAddTransaction) onAddTransaction(newOrder);
              if (onShowToast) onShowToast(`🎉 Razorpay Payment Verified! Payment ID: ${newOrder.razorpayPaymentId}`);
            },
            prefill: {
              name: 'DeepMarket VIP',
              email: 'privacy@deepmarket.org',
              contact: '9000000000'
            },
            readonly: {
              name: 1,
              email: 1,
              contact: 1
            },
            hidden: {
              contact: 1,
              email: 1,
              name: 1
            },
            theme: {
              color: '#7e22ce'
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                if (onShowToast) onShowToast("Razorpay Payment window closed.");
              }
            }
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
              setIsProcessing(false);
              if (onShowToast) onShowToast(`Payment Declined: ${resp?.error?.description || 'Transaction failed.'}`);
            });
            rzp.open();
          } else {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
              const rzp = new window.Razorpay(options);
              rzp.open();
            };
            document.body.appendChild(script);
          }
        };

        // Open Razorpay Checkout Modal synchronously on user click event
        openRazorpayModal(null);

      } catch (err) {
        setIsProcessing(false);
        if (onShowToast) onShowToast(`Razorpay Launch Error: ${err.message}`);
      }
      return;
    }

    // LTC CRYPTO GATEWAY SUBMISSION FLOW
    setTimeout(() => {
      const newOrder = {
        id: orderId,
        orderNumber: orderId,
        suiteId: selectedSuite.id,
        suiteName: orderItemTitle,
        basePrice: basePrice,
        courseAddonPrice: courseAddonPrice,
        subtotal: subtotalBeforeDiscount,
        discountAmount: discountAmount,
        appliedPromoCode: appliedPromo ? appliedPromo.code : null,
        gatewayFee: 0,
        totalPaid: totalPaid,
        priceInr: totalPaid,
        priceUsd: selectedSuite.priceUsd,
        brand: selectedBrand,
        cardBalance: selectedSuite.cardBalance,
        processingSla: selectedSuite.processingSla,
        status: 'Pending Admin Approval',
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleString(),
        paymentMethod: 'Crypto (LTC)',
        ltcAddress: demoLtcAddress,
        ltcTxHash: sanitizeText(userLtcTxId).trim(),
        includedCourseAddon: includeCourseAddon && !isCourseItem
      };

      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setIsSuccess(true);
      if (onAddTransaction) onAddTransaction(newOrder);
      if (onShowToast) {
        onShowToast(`LTC Order ${orderId} submitted! Remaining Processing - Pending Admin Approval.`);
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setIncludeCourseAddon(false);
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
    onClose();
  };

  const handleOpenMyOrders = () => {
    handleCloseAll();
    if (onOpenOrders) onOpenOrders();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={handleCloseAll} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-5 font-['Satoshi'] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={handleCloseAll}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
        >
          <X className="w-4 h-4 text-[#6e5a8e]" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleConfirmCheckout} className="space-y-4">
            {/* Header */}
            <div>
              <span className="text-[11px] font-['Satoshi'] font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Instant Clearance Checkout
              </span>
              <h3 className="font-['Satoshi'] font-black text-2xl text-[#1e1035] mt-2">
                {selectedSuite.name}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-['Satoshi'] font-medium">
                {selectedBrand.toUpperCase()} Network Clearance Protocol • Balance: {selectedSuite.cardBalance}
              </p>
            </div>

            {/* OPTIONAL ADD-ON COURSE OFFER FOR VISA / MASTERCARD PURCHASES */}
            {!isCourseItem && (
              <div 
                onClick={() => setIncludeCourseAddon(!includeCourseAddon)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  includeCourseAddon
                    ? 'bg-purple-950 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40'
                    : 'bg-purple-50/90 text-[#1e1035] border-purple-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    includeCourseAddon ? 'bg-amber-400 text-black' : 'bg-purple-200 text-purple-900'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs tracking-tight">Add Carding Masterclass Course</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        includeCourseAddon ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-900'
                      }`}>
                        +₹400
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${
                      includeCourseAddon ? 'text-purple-200' : 'text-[#6e5a8e]'
                    }`}>
                      💡 Beginner guide for virtual card BIN routing protocols.
                    </p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  includeCourseAddon ? 'bg-amber-400 border-amber-400 text-black' : 'border-purple-300 bg-white'
                }`}>
                  {includeCourseAddon ? <Check className="w-4 h-4 stroke-[3]" /> : <PlusCircle className="w-4 h-4 text-purple-400" />}
                </div>
              </div>
            )}

            {/* PROMO CODE SECTION - ONLY APPLICABLE FOR REGULAR CARD SUITES */}
            {!isCourseItem ? (
              <div className="space-y-2 font-['Satoshi']">
                <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-600" /> Apply Promo Code
                  </span>
                  <span className="text-[10px] text-amber-600 font-extrabold uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Use: DEEPNET50 (10% OFF)
                  </span>
                </label>

                {!appliedPromo ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter DEEPNET50"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50/50 text-xs font-mono text-[#1e1035] placeholder:text-[#6e5a8e]/60 focus:outline-none focus:border-purple-600 focus:bg-white uppercase font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      APPLY CODE
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Code <strong>DEEPNET50</strong> Applied (10% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[11px] text-red-600 font-medium pl-1">{promoError}</p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-medium text-[#6e5a8e] flex items-center justify-between font-['Satoshi']">
                <span>Special Training Course: <strong className="text-[#1e1035] font-bold">₹400</strong></span>
                <span className="text-[10px] font-bold uppercase text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-200">
                  Fixed Rate • No Discount
                </span>
              </div>
            )}

            {/* Price Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1.5 text-xs font-['Satoshi']">
              <div className="flex justify-between items-center text-[#6e5a8e]">
                <span>Card Suite Price:</span>
                <span className="font-mono font-semibold">₹{basePrice.toLocaleString()}</span>
              </div>

              {includeCourseAddon && !isCourseItem && (
                <div className="flex justify-between items-center text-purple-900 font-bold">
                  <span>+ Carding Masterclass Course:</span>
                  <span className="font-mono">+₹400</span>
                </div>
              )}
              
              {appliedPromo && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span>10% Promo Discount (DEEPNET50):</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-purple-200 pt-1.5 font-bold">
                <span className="text-sm text-[#1e1035]">Final Payable Total:</span>
                <span className="font-mono font-black text-purple-700 text-xl">₹{totalPaid.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider block font-['Satoshi'] flex justify-between items-center">
                <span>Select Payment Gateway</span>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ SECURE ENCRYPTED
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3 font-['Satoshi'] text-[11px]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-purple-100 bg-white text-[#6e5a8e] hover:border-purple-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Razorpay (UPI / Cards / Wallets)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'crypto'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-sm'
                      : 'border-purple-100 bg-white text-[#6e5a8e] hover:border-purple-300'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Crypto (LTC)</span>
                </button>
              </div>
            </div>

            {/* RAZORPAY GATEWAY DISPLAY */}
            {paymentMethod === 'razorpay' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-blue-950 text-white border border-blue-700/60 font-mono text-xs shadow-md flex justify-between items-center">
                  <span className="font-bold flex items-center gap-1.5 font-sans text-xs text-blue-200">
                    <CreditCard className="w-4 h-4 text-blue-400" /> Razorpay Gateway {totalPaid === 400 || isCourseItem ? '(₹400 Gateway)' : ''}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> SECURE PAYMENT PROTECTED
                  </span>
                </div>

                {/* Razorpay Embedded Payment Button (₹400: pl_TMuuLdBd4SwDJW | Default: pl_TMsbghzmhPLvji) */}
                <RazorpayPaymentButton buttonId={totalPaid === 400 || isCourseItem ? "pl_TMuuLdBd4SwDJW" : "pl_TMsbghzmhPLvji"} />
              </div>
            )}

            {/* LTC DEPOSIT ADDRESS & TRANSACTION ID INPUT */}
            {paymentMethod === 'crypto' && (
              <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3 font-mono text-xs shadow-md">
                <div className="flex justify-between items-center text-amber-400 text-[11px]">
                  <span className="font-bold flex items-center gap-1 font-sans">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Official LTC Deposit Address
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    LITECOIN NETWORK
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center break-all">
                  <span className="text-[11px] font-bold text-amber-300 select-all font-mono">{demoLtcAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopyLtc}
                    className="p-1.5 text-amber-400 hover:text-white rounded-lg cursor-pointer shrink-0 ml-2"
                    title="Copy LTC Address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* LTC TxID / Hash Verification Input */}
                <div className="space-y-1 pt-1 border-t border-slate-800 font-sans">
                  <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block flex justify-between">
                    <span>Enter your LTC Transaction Hash / TxID</span>
                    <span className="text-[9px] text-amber-400/80 font-mono">REQUIRED FOR VERIFICATION</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userLtcTxId}
                    onChange={(e) => {
                      setUserLtcTxId(e.target.value);
                      if (ltcTxError) setLtcTxError('');
                    }}
                    placeholder="Paste 64-character Transaction Hash / TxID..."
                    className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                  />
                  {ltcTxError && (
                    <p className="text-[10.5px] text-rose-400 font-semibold">{ltcTxError}</p>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 font-sans font-medium flex items-center gap-1 leading-relaxed">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                  Your TxID will be verified in the <strong className="text-amber-400">Admin Panel</strong>. If valid = Approved (Payment Received). If invalid = Rejected.
                </p>
              </div>
            )}

            {/* Cloudflare Turnstile Anti-Bot CAPTCHA Protection */}
            <CaptchaWidget
              isVerified={isCaptchaVerified}
              onVerify={(status) => setIsCaptchaVerified(status)}
            />

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="glass-btn-gradient w-full h-12 rounded-full font-['Satoshi'] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Payment Gateway...</span>
              ) : (
                <>
                  <span>PAY ₹{totalPaid.toLocaleString()} NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        ) : (
          /* SUCCESS / SUBMITTED VIEW */
          <div className="text-center py-4 space-y-5 animate-fade-in font-['Satoshi']">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              createdOrder?.status === 'Pending Admin Approval'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {createdOrder?.status === 'Pending Admin Approval' ? (
                <Clock className="w-8 h-8 animate-spin" />
              ) : (
                <CheckCircle className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#1e1035]">
                {createdOrder?.status === 'Pending Admin Approval' ? 'LTC Payment Processing' : 'Payment Confirmed!'}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">Order ID: <strong className="font-mono text-[#1e1035]">{createdOrder?.id}</strong></p>
            </div>

            {createdOrder?.status === 'Pending Admin Approval' ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2 text-amber-900 font-medium">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Sent Request to Admin Panel</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Your LTC deposit request is pending verification. Once approved in the Admin Panel, your card credentials will be issued to your profile.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6e5a8e]">Item Purchased:</span>
                  <span className="font-bold text-[#1e1035] text-right">{createdOrder?.suiteName}</span>
                </div>
                {createdOrder?.includedCourseAddon && (
                  <div className="flex justify-between text-purple-900 font-bold">
                    <span>Bundle Add-on:</span>
                    <span>Carding Masterclass (+₹400)</span>
                  </div>
                )}
                {createdOrder?.appliedPromoCode && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo Applied:</span>
                    <span>10% OFF ({createdOrder?.appliedPromoCode})</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-purple-200 pt-1 font-bold">
                  <span className="text-[#1e1035]">Total Paid:</span>
                  <span className="font-mono text-purple-700 text-sm">₹{createdOrder?.totalPaid.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleOpenMyOrders}
              className="glass-btn w-full h-12 rounded-full font-['Satoshi'] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>VIEW MY ORDERS</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
