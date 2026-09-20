import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Clock, ShieldCheck, ArrowRight, ShoppingBag, Upload, Image as ImageIcon, CheckCircle, Tag, GraduationCap, PlusCircle, AlertCircle } from 'lucide-react';
import { sanitizeText, checkRateLimit, validateFileUpload } from '../lib/security';
import { CaptchaWidget } from './CaptchaWidget';

export const CRYPTO_CONFIG = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    ticker: 'BTC',
    symbol: '₿',
    address: '0x2be2f7958319a1aabffe611e47288cd68940147f',
    qrImage: '/assets/crypto/btc_qr.png',
    network: 'Bitcoin Network',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  LTC: {
    id: 'LTC',
    name: 'Litecoin',
    ticker: 'LTC',
    symbol: 'Ł',
    address: 'LfLgkHH2PpqMiKec1DWsdUNZmdfDpRL3Tm',
    qrImage: '/assets/crypto/ltc_qr.png',
    network: 'Litecoin Network',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300'
  }
};

export const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  selectedSuite, 
  selectedBrand = 'VISA', 
  onAddTransaction, 
  onOpenOrders, 
  onShowToast, 
  userProfile 
}) => {
  // Cryptocurrency Selection: 'BTC' or 'LTC'
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Customer Contact Information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Payment Verification Inputs
  const [txId, setTxId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Form State
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Optional Add-on Course state (₹400)
  const [includeCourseAddon, setIncludeCourseAddon] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Prefill user details when modal opens
  useEffect(() => {
    if (isOpen) {
      if (userProfile) {
        const fullName = [userProfile.firstName, userProfile.surname].filter(Boolean).join(' ');
        setCustomerName(fullName || 'VIP Customer');
        setCustomerEmail(userProfile.gmail || 'vip@deepmarket.org');
        setCustomerPhone(userProfile.phone || userProfile.telegramHandle || '+91 98765 43210');
      } else {
        setCustomerName('VIP Customer');
        setCustomerEmail('vip@deepmarket.org');
        setCustomerPhone('+91 98765 43210');
      }
      // Reset inputs
      setTxId('');
      setScreenshotFile(null);
      setScreenshotPreview('');
      setErrorMessage('');
      setCopiedAddress(false);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, userProfile]);

  if (!isOpen || !selectedSuite) return null;

  const isCourseItem = selectedSuite.id === 'carding-course' || selectedSuite.id === 'carding-course-standalone';
  const basePrice = selectedSuite.priceInr || 1000;
  const courseAddonPrice = (!isCourseItem && includeCourseAddon) ? 400 : 0;
  const subtotalBeforeDiscount = basePrice + courseAddonPrice;
  const discountAmount = appliedPromo ? Math.round(subtotalBeforeDiscount * 0.10) : 0;
  const totalPaid = Math.max(0, subtotalBeforeDiscount - discountAmount);

  const activeCrypto = CRYPTO_CONFIG[selectedCrypto] || CRYPTO_CONFIG.BTC;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeCrypto.address);
    setCopiedAddress(true);
    if (onShowToast) onShowToast(`✓ ${activeCrypto.ticker} Wallet Address copied to clipboard!`);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileUpload(file, 5); // 5MB limit
    if (!validation.valid) {
      setErrorMessage(validation.message);
      if (onShowToast) onShowToast(validation.message);
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
      setScreenshotFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview('');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Rate limit check
    const rateCheck = checkRateLimit('crypto_payment_submit', 4, 60000);
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.message);
      if (onShowToast) onShowToast(rateCheck.message);
      return;
    }

    // Validate TXID
    const cleanTxId = sanitizeText(txId).trim();
    if (!cleanTxId || cleanTxId.length < 8) {
      setErrorMessage('Please provide a valid Transaction ID / TXID for payment verification.');
      if (onShowToast) onShowToast('Transaction ID / TXID is required!');
      return;
    }

    // Validate Screenshot
    if (!screenshotPreview) {
      setErrorMessage('Please upload a screenshot of your payment confirmation.');
      if (onShowToast) onShowToast('Payment screenshot is required!');
      return;
    }

    setIsSubmitting(true);

    const orderId = `DM-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderItemTitle = includeCourseAddon && !isCourseItem 
      ? `${selectedSuite.name} + Carding Masterclass Course Bundle` 
      : selectedSuite.name;

    const submissionDate = new Date().toLocaleDateString();
    const submissionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimestamp = `${submissionDate} ${submissionTime}`;

    // Demo virtual card credentials created upon generation (revealed only once Payment Confirmed)
    const demoCardCredentials = {
      cardType: selectedBrand.toUpperCase(),
      name: customerName || 'VIP Customer',
      fullCardNumber: `${selectedBrand === 'AMEX' ? '3782' : selectedBrand === 'MASTERCARD' ? '5412' : '4532'} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      cardNumber: `${selectedBrand === 'AMEX' ? '3782' : selectedBrand === 'MASTERCARD' ? '5412' : '4532'} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: `08/${new Date().getFullYear() + 3}`,
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      zip: '110001',
      country: 'India',
      email: customerEmail,
      phone: customerPhone,
      accessKey: `DM-AUTH-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      suiteId: selectedSuite.id,
      suiteName: orderItemTitle,
      brand: selectedBrand,
      basePrice: basePrice,
      courseAddonPrice: courseAddonPrice,
      subtotal: subtotalBeforeDiscount,
      discountAmount: discountAmount,
      appliedPromoCode: appliedPromo ? appliedPromo.code : null,
      totalPaid: totalPaid,
      priceInr: totalPaid,
      priceUsd: selectedSuite.priceUsd || Math.round(totalPaid / 85),
      cardBalance: selectedSuite.cardBalance || 'Calculated',
      processingSla: selectedSuite.processingSla || 'Instant Clearance',

      // Customer Information
      customer: {
        name: sanitizeText(customerName) || 'VIP Customer',
        email: sanitizeText(customerEmail) || 'vip@deepmarket.org',
        phone: sanitizeText(customerPhone) || '+91 98765 43210'
      },

      // Crypto Payment Verification Details
      paymentMethod: `Crypto (${activeCrypto.ticker})`,
      selectedCrypto: activeCrypto.ticker,
      cryptoName: activeCrypto.name,
      walletAddress: activeCrypto.address,
      txId: cleanTxId,
      paymentScreenshot: screenshotPreview,
      
      // Order & Payment Statuses
      paymentStatus: 'Pending Verification',
      status: 'Pending Verification',
      
      // Timestamps
      date: submissionDate,
      time: submissionTime,
      timestamp: fullTimestamp,
      submittedAt: new Date().toISOString(),

      // Credentials to unlock once Payment Confirmed
      demoCard: demoCardCredentials,
      includedCourseAddon: includeCourseAddon && !isCourseItem
    };

    setTimeout(() => {
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);

      if (onAddTransaction) onAddTransaction(newOrder);
      if (onShowToast) {
        onShowToast("Payment submitted successfully. Your order is now waiting for admin verification.");
      }
    }, 1000);
  };

  const handleCloseAll = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
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
        className="absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity" 
        onClick={handleCloseAll} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={handleCloseAll}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer hover:bg-purple-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#6e5a8e]" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300 flex items-center gap-1">
                  ⚡ Crypto Only Payment
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant Clearance
                </span>
              </div>
              <h3 className="font-black text-2xl text-[#1e1035] mt-2 tracking-tight">
                {selectedSuite.name}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                {selectedBrand.toUpperCase()} Network Clearance Protocol • Balance: {selectedSuite.cardBalance}
              </p>
            </div>

            {/* OPTIONAL ADD-ON COURSE OFFER */}
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

            {/* PROMO CODE SECTION */}
            {!isCourseItem ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-600" /> Apply Promo Code
                  </span>
                  <span className="text-[10px] text-amber-700 font-extrabold uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
            ) : null}

            {/* Price Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1.5 text-xs">
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
                <span className="text-sm text-[#1e1035]">Payable Total:</span>
                <div className="text-right">
                  <span className="font-mono font-black text-purple-700 text-xl">₹{totalPaid.toLocaleString()}</span>
                  <span className="text-[10.5px] text-[#6e5a8e] block font-mono">≈ ${(totalPaid / 85).toFixed(2)} USD in {activeCrypto.ticker}</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: SELECT CRYPTO PAYMENT */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#1e1035] uppercase tracking-wider">
                  1. Select Cryptocurrency
                </label>
                <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded border border-amber-300">
                  BTC or LTC Accepted
                </span>
              </div>

              {/* Crypto Tabs: Bitcoin (BTC) & Litecoin (LTC) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCrypto('BTC')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs ${
                    selectedCrypto === 'BTC'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-400/30'
                      : 'border-purple-100 bg-white text-[#6e5a8e] hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    ₿
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs leading-none">Bitcoin</p>
                    <p className="text-[10px] opacity-70 font-mono">BTC</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCrypto('LTC')}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs ${
                    selectedCrypto === 'LTC'
                      ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-md ring-2 ring-blue-400/30'
                      : 'border-purple-100 bg-white text-[#6e5a8e] hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs font-mono">
                    Ł
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs leading-none">Litecoin</p>
                    <p className="text-[10px] opacity-70 font-mono">LTC</p>
                  </div>
                </button>
              </div>

              {/* DYNAMIC QR CODE & WALLET ADDRESS DISPLAY */}
              <div className="p-4 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-4 shadow-lg text-center">
                
                {/* Header Tag */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1 text-amber-400 text-xs">
                    <span className="text-base">{activeCrypto.symbol}</span>
                    <span>{activeCrypto.name} ({activeCrypto.ticker}) Deposit</span>
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                    {activeCrypto.network}
                  </span>
                </div>

                {/* QR Code with Dynamic Image Switch */}
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-purple-300 transition-all duration-300">
                    <img 
                      src={activeCrypto.qrImage} 
                      alt={`${activeCrypto.name} QR Code`} 
                      className="w-44 h-44 object-contain rounded-lg"
                      key={activeCrypto.ticker}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Scan with any {activeCrypto.ticker} wallet app to pay
                  </p>
                </div>

                {/* Wallet Address & Copy Button */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block">
                    {activeCrypto.name} Wallet Address
                  </label>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                    <span className="text-[11.5px] font-mono font-bold text-amber-300 break-all select-all">
                      {activeCrypto.address}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                        copiedAddress 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                      title="Copy Address"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2: PAYMENT CONFIRMATION INPUTS */}
            <div className="space-y-3 pt-2 border-t border-purple-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#1e1035] uppercase tracking-wider">
                  2. Payment Confirmation Details
                </label>
                <span className="text-[10px] text-purple-700 font-extrabold uppercase">
                  Required for Admin Approval
                </span>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-[#6e5a8e] uppercase block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-10 px-3 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-[#1e1035] focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-[#6e5a8e] uppercase block mb-1">Email / Telegram</label>
                  <input
                    type="text"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full h-10 px-3 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-[#1e1035] focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Transaction ID / TXID Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-[#1e1035] uppercase tracking-wider flex justify-between">
                  <span>Transaction ID / TXID <span className="text-rose-600">*</span></span>
                  <span className="text-[10px] font-mono text-purple-700">64-Character Blockchain Hash</span>
                </label>
                <input
                  type="text"
                  required
                  value={txId}
                  onChange={(e) => {
                    setTxId(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={`Paste your ${activeCrypto.ticker} Transaction ID / Hash (TXID)...`}
                  className="w-full h-11 px-3.5 bg-purple-50/40 border-2 border-purple-200 rounded-xl text-xs font-mono font-bold text-[#1e1035] placeholder:text-[#6e5a8e]/60 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              {/* Payment Screenshot File Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-[#1e1035] uppercase tracking-wider flex justify-between">
                  <span>Payment Screenshot <span className="text-rose-600">*</span></span>
                  <span className="text-[10px] text-[#6e5a8e]">PNG, JPG, WEBP (Max 5MB)</span>
                </label>

                {!screenshotPreview ? (
                  <label className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center">
                    <Upload className="w-6 h-6 text-purple-600" />
                    <span className="text-xs font-bold text-[#1e1035]">Click or Drag &amp; Drop Payment Screenshot</span>
                    <span className="text-[10.5px] text-[#6e5a8e]">Upload proof of your crypto wallet transfer</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={screenshotPreview} 
                        alt="Screenshot Preview" 
                        className="w-12 h-12 object-cover rounded-xl border border-purple-300 shadow-xs" 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1e1035] truncate">{screenshotFile?.name || 'Payment_Proof.png'}</p>
                        <p className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Screenshot Attached
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Cloudflare Anti-Bot Captcha */}
              <CaptchaWidget
                isVerified={isCaptchaVerified}
                onVerify={(status) => setIsCaptchaVerified(status)}
              />

              {/* Submit Payment Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-btn-gradient w-full h-12 rounded-full font-['Satoshi'] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" /> Submitting Payment Proof...
                  </span>
                ) : (
                  <>
                    <span>SUBMIT PAYMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </form>
        ) : (
          /* SUCCESS VIEW */
          <div className="text-center py-4 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner bg-amber-100 text-amber-600">
              <Clock className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block">
                Status: Pending Verification
              </span>
              <h3 className="text-2xl font-black text-[#1e1035] tracking-tight">
                Order Submitted Successfully!
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                Order ID: <strong className="font-mono text-[#1e1035]">{createdOrder?.id}</strong>
              </p>
            </div>

            {/* MESSAGE REQUIRED BY USER SPEC */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left text-xs space-y-2 text-amber-950 font-medium shadow-xs">
              <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                <Clock className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
                <span>Payment submitted successfully. Your order is now waiting for admin verification.</span>
              </div>
              <p className="text-[11.5px] text-amber-900 leading-relaxed font-normal">
                We have received your <strong>{createdOrder?.selectedCrypto}</strong> payment submission with Transaction ID: <span className="font-mono font-bold break-all">{createdOrder?.txId}</span>. The store admin will verify the transaction on the blockchain ledger and confirm your payment.
              </p>
            </div>

            {/* Order Summary Snapshot */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6e5a8e]">Item:</span>
                <span className="font-bold text-[#1e1035] text-right">{createdOrder?.suiteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e5a8e]">Cryptocurrency:</span>
                <span className="font-bold text-purple-900">{createdOrder?.cryptoName} ({createdOrder?.selectedCrypto})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e5a8e]">Total Payable:</span>
                <span className="font-mono font-black text-purple-700">₹{createdOrder?.totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-purple-200 pt-1.5">
                <span className="text-[#6e5a8e]">Initial Order Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10.5px]">Pending Verification</span>
              </div>
            </div>

            <button
              onClick={handleOpenMyOrders}
              className="glass-btn w-full h-12 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
