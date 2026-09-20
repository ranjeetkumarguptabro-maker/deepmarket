import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, CheckCircle, Trash2, ArrowRight, ShieldCheck, 
  CreditCard, Clock, Lock, Copy, Eye, EyeOff, Check, ExternalLink, 
  Zap, KeyRound, User, AlertTriangle, Image as ImageIcon, ZoomIn, CheckCircle2, ShieldAlert
} from 'lucide-react';

const DEMO_TEST_CARDS = [
  { cardType: 'VISA', name: 'Ranjeet Gupta', cardNumber: '4532 •••• •••• 8821', fullCardNumber: '4532 9102 8374 8821', expiry: '08/29', cvv: '492', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' },
  { cardType: 'MASTERCARD', name: 'Ranjeet Gupta', cardNumber: '5412 •••• •••• 4409', fullCardNumber: '5412 8823 9910 4409', expiry: '11/28', cvv: '718', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' },
  { cardType: 'AMEX', name: 'Ranjeet Gupta', cardNumber: '3782 •••• •••• 9102', fullCardNumber: '3782 9102 4432 9102', expiry: '05/30', cvv: '8812', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' }
];

export const OrdersModal = ({ 
  isOpen, 
  onClose, 
  transactions = [], 
  onClearOrders, 
  onProceedPayment, 
  onUpdateTransaction, 
  onShowToast,
  initialAdminView = false 
}) => {
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showCvv, setShowCvv] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(initialAdminView);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialAdminView) {
        setShowAdminPanel(true);
      }
      setSelectedOrderDetails(null);
      setShowCvv(false);
      setPreviewImage(null);
    }
  }, [isOpen, initialAdminView]);

  if (!isOpen) return null;

  const totalCartValue = transactions.reduce(
    (acc, tx) => acc + (typeof tx.priceInr === 'number' ? tx.priceInr : (parseInt(tx.priceInr) || 0)), 
    0
  );

  const handleCopyText = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (onShowToast) onShowToast(`✓ Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminUsername.trim() === 'darkerzoneyt' && adminPassword === 'Rgbro@779!') {
      setIsAdminLoggedIn(true);
      if (onShowToast) onShowToast("✅ Admin Authorization Granted! Store Control Panel Unlocked.");
    } else {
      setAdminError("Invalid Admin Username or Password! (Credentials: darkerzoneyt / Rgbro@779!)");
    }
  };

  // ADMIN ACTION: Confirm Payment
  // When admin confirms payment has been received, order status changes from:
  // Pending Verification -> Payment Confirmed
  const handleAdminConfirmPayment = (tx) => {
    if (!onUpdateTransaction) return;
    const confirmationDate = new Date().toLocaleString();
    const updatedTx = {
      ...tx,
      paymentStatus: 'Payment Confirmed',
      status: 'Payment Confirmed',
      confirmedByAdmin: true,
      confirmedAt: confirmationDate,
      approvalDate: confirmationDate
    };
    onUpdateTransaction(updatedTx);
    if (onShowToast) {
      onShowToast(`🎉 Order #${tx.id} confirmed! Status changed to Payment Confirmed.`);
    }
  };

  // ADMIN ACTION: Reject Payment (if fraudulent or unpaid)
  const handleAdminRejectPayment = (tx) => {
    if (!onUpdateTransaction) return;
    const rejectedDate = new Date().toLocaleString();
    const updatedTx = {
      ...tx,
      paymentStatus: 'Payment Rejected',
      status: 'Rejected',
      confirmedByAdmin: false,
      rejectionDate: rejectedDate,
      rejectionReason: 'Payment not found on blockchain ledger.'
    };
    onUpdateTransaction(updatedTx);
    if (onShowToast) {
      onShowToast(`❌ Order #${tx.id} marked as Rejected.`);
    }
  };

  const getExplorerUrl = (tx) => {
    if (!tx.txId && !tx.ltcTxHash) return null;
    const hash = tx.txId || tx.ltcTxHash;
    const crypto = (tx.selectedCrypto || '').toUpperCase();
    if (crypto === 'BTC' || (!crypto && hash.startsWith('0x'))) {
      return `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
    }
    return `https://live.blockcypher.com/ltc/tx/${hash}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl sm:max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 max-h-[92vh] flex flex-col text-[#1e1035]">
        
        {/* Header Bar */}
        <div className="py-4 px-6 border-b border-purple-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl p-2 flex items-center justify-center shadow-xs ${
              showAdminPanel ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-purple-100 text-purple-700 border border-purple-200'
            }`}>
              {showAdminPanel ? <Lock className="w-5 h-5 stroke-[2.2]" /> : <ShoppingBag className="w-5 h-5 stroke-[2.2]" />}
            </div>
            <div>
              <h3 className="font-black text-xl text-[#1e1035]">
                {showAdminPanel ? 'Admin Verification Control Panel' : 'Your Orders & Purchases'}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                {showAdminPanel 
                  ? 'Review Submitted Crypto Payments & Confirm Orders' 
                  : 'DeepMarket Encrypted Decentralized Ledger'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Admin Panel vs Customer Orders */}
            <button
              onClick={() => {
                setShowAdminPanel(!showAdminPanel);
                setSelectedOrderDetails(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                showAdminPanel 
                  ? 'bg-purple-900 text-white shadow-sm' 
                  : 'bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200'
              }`}
              title="Toggle between Admin Panel and Customer Orders"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showAdminPanel ? 'Switch to Customer Orders' : 'Admin Panel'}</span>
            </button>

            {transactions.length > 0 && !showAdminPanel && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all items in cart/order history?")) {
                    onClearOrders();
                  }
                }}
                className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100 transition-colors"
                title="Clear order history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer hover:bg-purple-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-[#6e5a8e]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ========================================================================= */}
          {/* VIEW 1: ADMIN CONTROL PANEL (ORDER CARDS & CONFIRM PAYMENT)             */}
          {/* ========================================================================= */}
          {showAdminPanel ? (
            <div className="space-y-6">
              {!isAdminLoggedIn ? (
                /* ADMIN LOGIN GATE */
                <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-5 max-w-md mx-auto shadow-2xl">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-black text-white">Admin Verification Gate</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                      Authorized Store Administrator Login required to review submitted crypto payments.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Admin Username</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="e.g. darkerzoneyt"
                        required
                        className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Admin Password</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                    {adminError && <p className="text-xs text-rose-400 font-bold mt-1">{adminError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>UNLOCK ADMIN PANEL</span>
                  </button>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Credentials: <strong className="text-slate-400">darkerzoneyt</strong> / <strong className="text-slate-400">Rgbro@779!</strong>
                    </span>
                  </div>
                </form>
              ) : (
                /* UNLOCKED ADMIN PANEL: INDIVIDUAL ORDER CARDS */
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
                    <div>
                      <h4 className="font-black text-amber-950 text-base flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-700" />
                        <span>Admin Payment Verification Ledger</span>
                      </h4>
                      <p className="text-xs text-amber-800 font-medium mt-0.5">
                        Verify the TXID and Payment Screenshot against the blockchain. Click <strong>Confirm Payment</strong> to approve and release virtual card credentials.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                        {transactions.length} Total {transactions.length === 1 ? 'Order' : 'Orders'}
                      </span>
                      <button
                        onClick={() => setIsAdminLoggedIn(false)}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                      >
                        Lock Panel
                      </button>
                    </div>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="p-12 text-center bg-purple-50/50 border border-purple-100 rounded-3xl text-xs text-[#6e5a8e] font-bold space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-purple-400" />
                      <p>No submitted payments in the system yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {transactions.map((order, idx) => {
                        const orderId = order.id || order.orderNumber || `DM-${idx + 1000}`;
                        const isPending = order.status === 'Pending Verification' || order.status === 'Pending Admin Approval';
                        const isConfirmed = order.status === 'Payment Confirmed' || order.status === 'Completed' || order.confirmedByAdmin;
                        const isRejected = order.status === 'Rejected' || order.paymentStatus === 'Payment Rejected';
                        const cryptoType = (order.selectedCrypto || (order.paymentMethod?.includes('BTC') ? 'BTC' : 'LTC') || 'CRYPTO').toUpperCase();
                        const customer = order.customer || {
                          name: 'VIP Customer',
                          email: 'vip@deepmarket.org',
                          phone: '+91 98765 43210'
                        };
                        const txHash = order.txId || order.ltcTxHash || 'TXID-PENDING';
                        const screenshot = order.paymentScreenshot;
                        const walletAddress = order.walletAddress || order.ltcAddress || (cryptoType === 'BTC' ? '0x2be2f7958319a1aabffe611e47288cd68940147f' : 'LfLgkHH2PpqMiKec1DWsdUNZmdfDpRL3Tm');
                        const explorerUrl = getExplorerUrl(order);

                        return (
                          /* INDIVIDUAL ADMIN ORDER CARD REQUIRED BY USER SPEC */
                          <div 
                            key={order.id || idx} 
                            className={`p-5 sm:p-6 bg-white border-2 rounded-3xl space-y-4 shadow-md transition-all ${
                              isPending 
                                ? 'border-amber-400 bg-amber-50/20' 
                                : isConfirmed 
                                ? 'border-emerald-300' 
                                : 'border-rose-200 bg-rose-50/20'
                            }`}
                          >
                            {/* Card Top Row: Order ID, Product & Status */}
                            <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-purple-100">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-black text-sm bg-purple-100 text-purple-900 px-3 py-1 rounded-xl border border-purple-200">
                                  Order #{orderId}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 border ${
                                  cryptoType === 'BTC' 
                                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                    : 'bg-blue-100 text-blue-900 border-blue-300'
                                }`}>
                                  <span>{cryptoType === 'BTC' ? '₿' : 'Ł'}</span>
                                  <span>{cryptoType}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Order Status Badge */}
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                                  isPending 
                                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                    : isConfirmed 
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}>
                                  {isPending && <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />}
                                  {isConfirmed && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                                  {isRejected && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                                  <span>{isPending ? 'Pending Verification' : isConfirmed ? 'Payment Confirmed' : 'Payment Rejected'}</span>
                                </span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              
                              {/* Left Column: Product & Customer Information */}
                              <div className="space-y-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                <div>
                                  <span className="text-[10px] font-extrabold text-[#6e5a8e] uppercase tracking-wider block">
                                    Product / Order Information
                                  </span>
                                  <p className="font-black text-sm text-[#1e1035] mt-0.5">{order.suiteName}</p>
                                  <p className="text-[11px] text-[#6e5a8e]">
                                    Network: <strong className="text-[#1e1035]">{order.brand || 'VISA'}</strong> • Balance: <strong className="text-purple-700">{order.cardBalance || 'Calculated'}</strong>
                                  </p>
                                  <p className="font-mono font-black text-base text-purple-700 mt-1">
                                    ₹{(order.totalPaid || order.priceInr || 0).toLocaleString()} 
                                    <span className="text-xs font-medium text-[#6e5a8e] ml-1.5">
                                      (≈ ${(order.priceUsd || Math.round((order.totalPaid || 1000) / 85)).toFixed(2)} USD)
                                    </span>
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-purple-200/60 space-y-1">
                                  <span className="text-[10px] font-extrabold text-[#6e5a8e] uppercase tracking-wider block">
                                    Customer Information
                                  </span>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e5a8e]">Name:</span>
                                    <span className="font-bold text-[#1e1035]">{customer.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e5a8e]">Email:</span>
                                    <span className="font-mono font-bold text-[#1e1035]">{customer.email}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e5a8e]">Phone / Telegram:</span>
                                    <span className="font-mono font-bold text-[#1e1035]">{customer.phone}</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-purple-200/60 flex justify-between text-[11px] text-[#6e5a8e]">
                                  <span>Submitted At:</span>
                                  <span className="font-mono font-semibold text-[#1e1035]">{order.timestamp || order.date || 'Today'}</span>
                                </div>
                              </div>

                              {/* Right Column: Crypto Transaction Proof & Screenshot */}
                              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800 font-mono">
                                
                                <div className="space-y-1">
                                  <span className="text-[10px] font-sans font-extrabold text-amber-400 uppercase tracking-wider block">
                                    Wallet Address Used ({cryptoType})
                                  </span>
                                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 flex justify-between items-center gap-1">
                                    <span className="text-[10.5px] text-amber-300 break-all select-all font-bold">
                                      {walletAddress}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(walletAddress, 'Wallet Address')}
                                      className="p-1 hover:text-amber-400 text-slate-400 cursor-pointer"
                                      title="Copy Wallet Address"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-sans font-extrabold text-purple-300 uppercase tracking-wider">
                                      Transaction ID / TXID
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(txHash, 'TXID')}
                                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer font-sans"
                                    >
                                      <Copy className="w-3 h-3" /> Copy TXID
                                    </button>
                                  </div>
                                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 text-[10.5px] text-purple-200 break-all select-all font-bold">
                                    {txHash}
                                  </div>
                                  {explorerUrl && (
                                    <a
                                      href={explorerUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10.5px] text-amber-400 hover:underline font-sans pt-0.5"
                                    >
                                      <ExternalLink className="w-3 h-3" /> Check on {cryptoType} Blockchain Explorer →
                                    </a>
                                  )}
                                </div>

                                {/* Payment Screenshot Display */}
                                <div className="space-y-1 pt-1 border-t border-slate-800 font-sans">
                                  <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">
                                    Payment Screenshot Proof
                                  </span>

                                  {screenshot ? (
                                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-700">
                                      <img
                                        src={screenshot}
                                        alt="Payment Proof Thumbnail"
                                        className="w-14 h-14 object-cover rounded-lg border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setPreviewImage(screenshot)}
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-white truncate">Payment Receipt Uploaded</p>
                                        <button
                                          type="button"
                                          onClick={() => setPreviewImage(screenshot)}
                                          className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer mt-1"
                                        >
                                          <ZoomIn className="w-3.5 h-3.5" /> Click to View Full Size Screenshot
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                                      No screenshot uploaded for this order.
                                    </div>
                                  )}
                                </div>

                              </div>

                            </div>

                            {/* ADMIN ACTIONS: CONFIRM PAYMENT & REJECT */}
                            <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="text-xs">
                                <span className="text-[#6e5a8e] font-medium">Payment Status: </span>
                                <strong className={`font-bold ${isConfirmed ? 'text-emerald-700' : isPending ? 'text-amber-700' : 'text-rose-700'}`}>
                                  {order.paymentStatus || (isConfirmed ? 'Payment Confirmed' : 'Pending Verification')}
                                </strong>
                                {order.confirmedAt && (
                                  <span className="text-[#6e5a8e] ml-2 text-[11px]">(Confirmed at: {order.confirmedAt})</span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {isPending ? (
                                  <>
                                    {/* CONFIRM PAYMENT ACTION REQUIRED BY USER SPEC */}
                                    <button
                                      type="button"
                                      onClick={() => handleAdminConfirmPayment(order)}
                                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>CONFIRM PAYMENT</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleAdminRejectPayment(order)}
                                      className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs cursor-pointer transition-colors"
                                    >
                                      <span>Reject</span>
                                    </button>
                                  </>
                                ) : isConfirmed ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-300">
                                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                                      <span>Payment Confirmed &amp; Customer Unlocked</span>
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAdminConfirmPayment(order)}
                                    className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs cursor-pointer"
                                  >
                                    Re-Confirm Payment
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : selectedOrderDetails ? (
            /* ========================================================================= */
            /* VIEW 2: CUSTOMER ORDER DETAILS & VIRTUAL CARD UNLOCKED CREDENTIALS       */
            /* ========================================================================= */
            <div className="space-y-5 animate-fade-in">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Return to Orders List
              </button>

              {/* Order Confirmation Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-3 text-xs text-emerald-950 font-bold shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-emerald-900">Payment Confirmed by Admin</p>
                    <p className="text-[11px] font-medium text-emerald-800">
                      Your {selectedOrderDetails.selectedCrypto || 'Crypto'} payment was verified. Your virtual card suite and clearance credentials are now active.
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full text-[10.5px] font-black font-mono">
                  {selectedOrderDetails.confirmedAt || 'Verified Today'}
                </span>
              </div>

              {/* Virtual Card Credentials Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-[#1e1035] text-white shadow-2xl space-y-5 border border-purple-400/40">
                
                <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-purple-300" />
                    <span>{selectedOrderDetails.demoCard?.cardType || selectedOrderDetails.brand || 'VISA'} VIRTUAL CARD</span>
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-0.5 rounded-full text-[11px] font-black">
                    ✓ ACTIVE &amp; UNLOCKED
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">Cardholder Name</p>
                  <p className="text-xl font-black tracking-wide text-white">{selectedOrderDetails.demoCard?.name || selectedOrderDetails.customer?.name || 'VIP Cardholder'}</p>
                </div>

                {/* 16-Digit Card Number */}
                <div className="bg-purple-900/60 border border-purple-700/50 p-4 rounded-2xl flex justify-between items-center font-mono">
                  <div>
                    <p className="text-[10px] text-purple-300 uppercase">Card Number</p>
                    <p className="font-black text-lg tracking-widest text-white">
                      {selectedOrderDetails.demoCard?.fullCardNumber || '4532 9102 8374 8821'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedOrderDetails.demoCard?.fullCardNumber || '4532 9102 8374 8821', 'Card Number')}
                    className="p-2.5 text-purple-200 hover:text-white hover:bg-purple-800 rounded-xl cursor-pointer transition-colors"
                    title="Copy Card Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-purple-900/60 border border-purple-700/50 p-3.5 rounded-2xl">
                    <p className="text-[10px] text-purple-300 uppercase">Valid Thru (EXP)</p>
                    <p className="font-black text-base text-white">{selectedOrderDetails.demoCard?.expiry || '08/29'}</p>
                  </div>
                  <div className="bg-purple-900/60 border border-purple-700/50 p-3.5 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-purple-300 uppercase">Security CVV</p>
                      <p className="font-black text-base text-white">{showCvv ? (selectedOrderDetails.demoCard?.cvv || '492') : '•••'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="text-[11px] font-bold text-purple-300 hover:text-white underline cursor-pointer"
                    >
                      {showCvv ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Billing Address & Access Token */}
                <div className="space-y-2 pt-3 border-t border-purple-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Access Key / Token:</span>
                    <span className="font-mono font-bold text-amber-300">{selectedOrderDetails.demoCard?.accessKey || 'DM-AUTH-882910'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Email:</span>
                    <span className="font-mono text-white font-bold">{selectedOrderDetails.demoCard?.email || selectedOrderDetails.customer?.email || 'vip@deepmarket.org'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Billing Country &amp; ZIP:</span>
                    <span className="font-bold text-white">{selectedOrderDetails.demoCard?.country || 'India'} ({selectedOrderDetails.demoCard?.zip || '110001'})</span>
                  </div>
                </div>

              </div>

              {/* Order Metadata Overview */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs space-y-2.5">
                <h5 className="font-black text-xs text-[#1e1035] uppercase tracking-wider">Complete Order Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Order ID:</span>
                    <strong className="font-mono text-[#1e1035]">{selectedOrderDetails.id}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Product:</span>
                    <strong className="text-[#1e1035]">{selectedOrderDetails.suiteName}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Selected Crypto:</span>
                    <strong className="text-purple-900">{selectedOrderDetails.selectedCrypto || 'BTC'} ({selectedOrderDetails.paymentMethod})</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Total Paid:</span>
                    <strong className="font-mono text-purple-700">₹{(selectedOrderDetails.totalPaid || selectedOrderDetails.priceInr || 0).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Payment Status:</span>
                    <strong className="text-emerald-700">Payment Confirmed</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-[#6e5a8e]">Order Status:</span>
                    <strong className="text-emerald-700">Payment Confirmed</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-200/60 space-y-1">
                  <span className="text-[#6e5a8e] font-bold text-[11px]">Submitted TXID:</span>
                  <div className="p-2 bg-white rounded-lg border border-purple-200 font-mono text-[10.5px] text-purple-950 font-bold break-all flex justify-between items-center gap-2">
                    <span className="select-all">{selectedOrderDetails.txId || selectedOrderDetails.ltcTxHash || 'TXID-REGISTERED'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedOrderDetails.txId || selectedOrderDetails.ltcTxHash, 'TXID')}
                      className="p-1 text-purple-700 hover:text-purple-950 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="glass-btn w-full h-12 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>RETURN TO ORDERS LIST</span>
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 3: CUSTOMER ORDERS LIST                                              */
            /* ========================================================================= */
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-base font-black text-[#1e1035]">
                  Your Submitted Orders
                </h4>
                <span className="text-xs text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  {transactions.length} {transactions.length === 1 ? 'Order' : 'Orders'} (Total: ₹{totalCartValue.toLocaleString()})
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-16 space-y-4 bg-purple-50/50 border border-purple-100 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-purple-200 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#1e1035]">No Orders Placed Yet</h4>
                    <p className="text-xs text-[#6e5a8e] max-w-sm mx-auto font-medium">
                      Select a virtual credit card suite from the marketplace to checkout with Bitcoin (BTC) or Litecoin (LTC).
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="glass-btn px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                  >
                    <span>Browse Marketplace Cards</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((order, index) => {
                    const itemName = order.suiteName || order.tierName || order.name || 'Virtual Card Suite';
                    const itemPrice = typeof order.priceInr === 'number' ? `₹${order.priceInr.toLocaleString()}` : order.priceInr;
                    const itemBrand = (order.brand || 'VISA').toUpperCase();
                    const orderId = order.id || order.orderNumber || `DM-${index + 1000}`;
                    
                    const isPending = order.status === 'Pending Verification' || order.status === 'Pending Admin Approval';
                    const isConfirmed = order.status === 'Payment Confirmed' || order.status === 'Completed' || order.confirmedByAdmin;
                    const isRejected = order.status === 'Rejected' || order.paymentStatus === 'Payment Rejected';
                    const cryptoType = (order.selectedCrypto || (order.paymentMethod?.includes('BTC') ? 'BTC' : 'LTC') || 'CRYPTO').toUpperCase();

                    const demoCard = order.demoCard || DEMO_TEST_CARDS[index % DEMO_TEST_CARDS.length];

                    return (
                      <div
                        key={order.id || index}
                        onClick={() => {
                          if (isConfirmed) {
                            setSelectedOrderDetails({ ...order, demoCard });
                          }
                        }}
                        className={`bg-white border-2 rounded-3xl p-5 space-y-4 shadow-sm transition-all ${
                          isConfirmed 
                            ? 'border-emerald-300 hover:border-emerald-500 hover:shadow-md cursor-pointer group' 
                            : isPending 
                            ? 'border-amber-300 bg-amber-50/20' 
                            : 'border-rose-200'
                        }`}
                      >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center text-xs">
                          {isPending ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                              <span>⏳ Pending Verification (Admin Review in Progress)</span>
                            </span>
                          ) : isConfirmed ? (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>✅ Payment Confirmed (Click to View Card Credentials)</span>
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Payment Rejected</span>
                            </span>
                          )}
                          <span className="text-[#6e5a8e] text-xs font-medium font-mono">{order.timestamp || order.date || 'Just Now'}</span>
                        </div>

                        {/* Order Content */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          
                          {/* Mini Card Display */}
                          <div className="sm:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#1e1035] text-white shadow-md space-y-2 border border-purple-400/30">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-purple-200">
                              <span>{itemBrand}</span>
                              <span className={`px-2 py-0.5 rounded border text-[9.5px] font-bold ${
                                isConfirmed ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-200' : 'bg-amber-500/30 border-amber-400/40 text-amber-200'
                              }`}>
                                {isConfirmed ? 'UNLOCKED' : 'LOCKED'}
                              </span>
                            </div>
                            <p className="font-black text-sm text-white truncate">{itemName}</p>
                            <div className="flex justify-between items-center pt-1 text-[11px] font-mono text-purple-200">
                              <span>{itemPrice}</span>
                              <span className="font-bold text-amber-300">{cryptoType}</span>
                            </div>
                          </div>

                          {/* Order Details & Actions */}
                          <div className="sm:col-span-8 space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-extrabold text-[#1e1035]">{itemName}</h4>
                                <p className="text-xs text-[#6e5a8e] font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  Guaranteed Balance: <strong className="text-purple-700">{order.cardBalance || 'Calculated'}</strong>
                                </p>
                              </div>
                              <span className="font-black text-lg text-[#1e1035] font-mono">{itemPrice}</span>
                            </div>

                            {/* Status Message depending on Verification */}
                            {isPending ? (
                              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                  <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                                  <span>Payment submitted successfully. Waiting for admin verification.</span>
                                </div>
                                <p className="text-[11px] text-amber-800 leading-tight">
                                  Your <strong>{cryptoType}</strong> payment proof and TXID (<span className="font-mono text-amber-950 font-bold">{order.txId?.slice(0, 16) || 'TXID'}...</span>) have been queued. Once confirmed by store admin, your card credentials will unlock immediately.
                                </p>
                              </div>
                            ) : isConfirmed ? (
                              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                  <span>Payment Confirmed by Admin! Ready to use.</span>
                                </span>
                                <span className="text-[11px] text-emerald-700 font-bold underline group-hover:text-emerald-900">
                                  Open Card Details →
                                </span>
                              </div>
                            ) : null}

                            <div className="flex flex-wrap justify-between items-center text-xs pt-1 border-t border-purple-50">
                              <span className="text-[#6e5a8e] font-medium">Order ID: <strong className="font-mono text-[#1e1035]">{orderId}</strong></span>
                              
                              {/* ACTION BUTTON */}
                              {isConfirmed ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderDetails({ ...order, demoCard });
                                  }}
                                  className="glass-btn px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-sm"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>View Card &amp; Credentials</span>
                                </button>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300">
                                  <Clock className="w-3 h-3 animate-spin" /> Pending Verification
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onProceedPayment) onProceedPayment(order);
                                  }}
                                  className="glass-btn px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>Retry Payment</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* LIGHTBOX MODAL FOR PAYMENT SCREENSHOT PREVIEW */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-950 p-4 rounded-3xl border border-slate-700 text-white space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Customer Submitted Payment Proof Screenshot
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/50 rounded-2xl p-2">
              <img 
                src={previewImage} 
                alt="Full Payment Screenshot" 
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
