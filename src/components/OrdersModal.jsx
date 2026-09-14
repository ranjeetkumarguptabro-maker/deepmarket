import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Trash2, ArrowRight, ShieldCheck, CreditCard, Clock, Lock, Copy, Eye, EyeOff, Check, ExternalLink, Zap, KeyRound, User, AlertTriangle } from 'lucide-react';

const DEMO_TEST_CARDS = [
  { cardType: 'VISA', name: 'Ranjeet Gupta', cardNumber: '4532 •••• •••• 8821', fullCardNumber: '4532 9102 8374 8821', expiry: '08/29', cvv: '492', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' },
  { cardType: 'MASTERCARD', name: 'Ranjeet Gupta', cardNumber: '5412 •••• •••• 4409', fullCardNumber: '5412 8823 9910 4409', expiry: '11/28', cvv: '718', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' },
  { cardType: 'AMEX', name: 'Ranjeet Gupta', cardNumber: '3782 •••• •••• 9102', fullCardNumber: '3782 9102 4432 9102', expiry: '05/30', cvv: '8812', zip: '110001', country: 'India', email: 'ranjeet.gupta@deepmarket.org', phone: '+91 98765 43210' }
];

export const OrdersModal = ({ isOpen, onClose, transactions = [], onClearOrders, onProceedPayment, onUpdateTransaction, onShowToast }) => {
  const [selectedCardOrder, setSelectedCardOrder] = useState(null);
  const [showCvv, setShowCvv] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  // Calculate Total Cart Price
  const totalCartValue = transactions.reduce((acc, tx) => acc + (typeof tx.priceInr === 'number' ? tx.priceInr : (parseInt(tx.priceInr) || 0)), 0);

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast(`Copied ${label} to clipboard!`);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminUsername.trim() === 'darkerzoneyt' && adminPassword === 'Rgbro@779!') {
      setIsAdminLoggedIn(true);
      if (onShowToast) onShowToast("✅ Admin Authorization Granted! Store Control Panel Unlocked.");
    } else {
      setAdminError("Invalid Admin Username or Password!");
    }
  };

  const handleAdminApproveLtc = (tx) => {
    if (!onUpdateTransaction) return;
    const updatedTx = {
      ...tx,
      status: 'Completed',
      approvedByAdmin: true,
      approvalDate: new Date().toLocaleString()
    };
    onUpdateTransaction(updatedTx);
    if (onShowToast) onShowToast(`✅ LTC Order ${tx.id} APPROVED! Card credentials released to user.`);
  };

  const handleAdminRejectLtc = (tx) => {
    if (!onUpdateTransaction) return;
    const updatedTx = {
      ...tx,
      status: 'Rejected',
      rejectionReason: 'Payment Not Received on LTC Blockchain Network',
      approvedByAdmin: false,
      rejectionDate: new Date().toLocaleString()
    };
    onUpdateTransaction(updatedTx);
    if (onShowToast) onShowToast(`❌ LTC Order ${tx.id} REJECTED: Payment Not Received.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 max-h-[92vh] flex flex-col text-[#1e1035]">
        
        {/* Header */}
        <div className="py-4 px-6 border-b border-purple-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 p-2 flex items-center justify-center text-purple-700 shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">
                {showAdminPanel ? 'Store Admin Panel (LTC Verification)' : 'Your Cart & Orders'}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                {showAdminPanel ? 'Review & Approve Pending LTC Crypto Payments' : 'DeepMarket Encrypted Order Ledger'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                showAdminPanel 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200'
              }`}
              title="Admin Confirmation Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showAdminPanel ? 'User Orders' : 'Admin Gate'}</span>
            </button>

            {transactions.length > 0 && !showAdminPanel && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all items in cart?")) {
                    onClearOrders();
                  }
                }}
                className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100 transition-colors"
                title="Clear all cart items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Cart</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
            >
              <X className="w-4 h-4 text-[#6e5a8e]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ADMIN CONTROL PANEL VIEW */}
          {showAdminPanel ? (
            <div className="space-y-6">
              {!isAdminLoggedIn ? (
                /* ADMIN LOGIN FORM */
                <form onSubmit={handleAdminLogin} className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-black text-white">Admin Manual Verification Gate</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                      Log in to review pending LTC payments and confirm receipts on the blockchain.
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
                        placeholder="Enter Admin Username"
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
                        placeholder="Enter Admin Password"
                        required
                        className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                    {adminError && <p className="text-xs text-rose-400 font-bold">{adminError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>UNLOCK ADMIN CONTROL PANEL</span>
                  </button>
                </form>
              ) : (
                /* ADMIN PENDING LTC ORDERS PANEL */
                <div className="space-y-5">
                  <div className="flex justify-between items-center bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <div>
                      <h4 className="font-black text-amber-950 text-base flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-600" /> Pending LTC Payment Verifications
                      </h4>
                      <p className="text-xs text-amber-800 font-medium mt-0.5">
                        Verify LTC Blockchain TxID and click "Approve" to release items to customer.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAdminLoggedIn(false)}
                      className="px-3 py-1 rounded-lg bg-amber-200 text-amber-950 text-xs font-bold hover:bg-amber-300"
                    >
                      Lock Panel
                    </button>
                  </div>

                  {transactions.filter(t => t.status === 'Pending Admin Approval' || (t.paymentMethod && t.paymentMethod.includes('LTC') && t.status !== 'Completed')).length === 0 ? (
                    <div className="p-8 text-center bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-[#6e5a8e] font-bold">
                      🎉 No pending LTC crypto orders waiting for approval.
                    </div>
                  ) : (
                    transactions.filter(t => t.status === 'Pending Admin Approval' || (t.paymentMethod && t.paymentMethod.includes('LTC') && t.status !== 'Completed')).map((tx) => (
                      <div key={tx.id} className="p-5 bg-white border-2 border-amber-300 rounded-2xl space-y-4 text-xs shadow-md">
                        <div className="flex justify-between items-center font-bold pb-2 border-b border-purple-100">
                          <span className="flex items-center gap-1.5 text-amber-950 font-black text-sm">
                            <Zap className="w-4 h-4 text-amber-600" /> {tx.suiteName}
                          </span>
                          <span className="font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                            Order #{tx.id}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 font-mono text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Amount:</span>
                            <span className="font-bold text-amber-400 text-xs">₹{(tx.totalPaid || tx.priceInr || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payment Method:</span>
                            <span className="font-bold text-emerald-400">{tx.paymentMethod || 'Crypto (LTC)'}</span>
                          </div>
                          {tx.ltcTxHash && (
                            <div className="pt-2 border-t border-slate-800 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-purple-300 font-bold">Submitted LTC TxID / Hash:</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(tx.ltcTxHash, 'LTC TxID')}
                                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy TxID
                                </button>
                              </div>
                              <p className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[10.5px] break-all text-amber-300 select-all">
                                {tx.ltcTxHash}
                              </p>
                              <a
                                href={`https://live.blockcypher.com/ltc/tx/${tx.ltcTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 hover:underline pt-1"
                              >
                                <ExternalLink className="w-3 h-3" /> Verify TxID on Litecoin Blockchain Explorer →
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAdminApproveLtcOrder(tx)}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>APPROVE &amp; RELEASE ITEMS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdminRejectLtcOrder(tx)}
                            className="py-3 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            <span>REJECT ORDER</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : selectedCardOrder ? (
            /* INDIVIDUAL CARD DETAILS MODAL VIEW FOR COMPLETED ORDERS */
            <div className="space-y-5 animate-fade-in font-['Satoshi']">
              <button
                onClick={() => setSelectedCardOrder(null)}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Return to Cart &amp; Orders List
              </button>

              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-[#1e1035] text-white shadow-xl space-y-4 border border-purple-400/30">
                <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                  <span>{selectedCardOrder.demoCard.cardType} VIRTUAL CARD</span>
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10.5px]">
                    ✓ UNLOCKED &amp; READY
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-purple-300 uppercase tracking-widest">Cardholder Name</p>
                  <p className="text-lg font-black tracking-wide text-white">{selectedCardOrder.demoCard.name}</p>
                </div>

                {/* Card Number */}
                <div className="bg-purple-900/60 border border-purple-700/50 p-3.5 rounded-2xl flex justify-between items-center font-mono">
                  <div>
                    <p className="text-[10px] text-purple-300">Card Number</p>
                    <p className="font-bold text-base tracking-widest text-white">{selectedCardOrder.demoCard.fullCardNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedCardOrder.demoCard.fullCardNumber, 'Card Number')}
                    className="p-2 text-purple-200 hover:text-white hover:bg-purple-800/80 rounded-xl cursor-pointer transition-colors"
                    title="Copy Card Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-purple-900/60 border border-purple-700/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-purple-300">Valid Thru (EXP)</p>
                    <p className="font-bold text-sm text-white">{selectedCardOrder.demoCard.expiry}</p>
                  </div>
                  <div className="bg-purple-900/60 border border-purple-700/50 p-3 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-purple-300">Security CVV</p>
                      <p className="font-bold text-sm text-white">{showCvv ? selectedCardOrder.demoCard.cvv : '•••'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="text-[10px] font-bold text-purple-300 hover:text-white underline cursor-pointer"
                    >
                      {showCvv ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="space-y-1.5 pt-3 border-t border-purple-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Email:</span>
                    <span className="font-mono text-white font-bold">{selectedCardOrder.demoCard.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Billing Country &amp; ZIP:</span>
                    <span className="font-bold text-white">{selectedCardOrder.demoCard.country} ({selectedCardOrder.demoCard.zip})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCardOrder(null)}
                className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>RETURN TO CART LIST</span>
              </button>
            </div>
          ) : (
            /* LIST OF CART ITEMS & ORDERS */
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-base font-extrabold font-['Satoshi'] text-[#1e1035]">
                  Cart Items &amp; Active Orders
                </h4>
                <span className="text-xs text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full">
                  {transactions.length} {transactions.length === 1 ? 'Item' : 'Items'} (Total: ₹{totalCartValue.toLocaleString()})
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-16 space-y-4 bg-purple-50/50 border border-purple-100 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-purple-200 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#1e1035]">Your Cart is Empty</h4>
                    <p className="text-xs text-[#6e5a8e] max-w-sm mx-auto font-medium">
                      You haven't added any virtual credit card suites to your cart yet. Choose a suite from the marketplace to get started.
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
                  {transactions.map((tx, index) => {
                    const itemName = tx.suiteName || tx.tierName || tx.name || 'Virtual Card Suite';
                    const itemPrice = typeof tx.priceInr === 'number' ? `₹${tx.priceInr.toLocaleString()}` : tx.priceInr;
                    const itemBrand = (tx.brand || 'VISA').toUpperCase();
                    const orderId = tx.id || tx.orderNumber || 'DM-1001';
                    const isPendingAdmin = tx.status === 'Pending Admin Approval' || (tx.paymentMethod && tx.paymentMethod.includes('LTC') && tx.status !== 'Completed');
                    const isCompleted = tx.status === 'Completed' || tx.approvedByAdmin;
                    const demoCard = DEMO_TEST_CARDS[index % DEMO_TEST_CARDS.length];

                    return (
                      <div
                        key={tx.id || index}
                        className={`bg-white border rounded-3xl p-5 space-y-4 shadow-sm transition-all ${
                          isPendingAdmin ? 'border-amber-300 bg-amber-50/30' : 'border-purple-100'
                        }`}
                      >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center text-xs">
                          {isPendingAdmin ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                              <span>⏳ Awaiting Manual Admin Confirmation (LTC)</span>
                            </span>
                          ) : isCompleted ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>✅ Payment Confirmed &amp; Items Delivered</span>
                            </span>
                          ) : (
                            <span className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Active Cart Item ({orderId})
                            </span>
                          )}
                          <span className="text-[#6e5a8e] text-xs font-medium">{tx.date || tx.timestamp || 'Just Now'}</span>
                        </div>

                        {/* Order Content */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          
                          {/* Mini Card Badge */}
                          <div className="sm:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#1e1035] text-white shadow-md space-y-2 border border-purple-400/30">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-purple-200">
                              <span>{itemBrand}</span>
                              <span className={`px-2 py-0.5 rounded border text-[9.5px] font-bold ${
                                isPendingAdmin ? 'bg-amber-500/30 border-amber-400/40 text-amber-200' : 'bg-emerald-500/30 border-emerald-400/40 text-emerald-200'
                              }`}>
                                {isPendingAdmin ? 'LOCKED (PENDING)' : 'READY'}
                              </span>
                            </div>
                            <p className="font-extrabold text-sm text-white truncate">{itemName}</p>
                            <p className="font-mono text-xs font-bold text-purple-200">{itemPrice}</p>
                          </div>

                          {/* Order Details & Actions */}
                          <div className="sm:col-span-8 space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-extrabold text-[#1e1035]">{itemName}</h4>
                                <p className="text-xs text-[#6e5a8e] font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  100% Guaranteed Balance: <strong className="text-purple-700">{tx.cardBalance || 'Calculated'}</strong>
                                </p>
                              </div>
                              <span className="font-black text-lg text-[#1e1035] font-mono">{itemPrice}</span>
                            </div>

                            {/* PENDING ADMIN MANUAL CONFIRMATION NOTICE */}
                            {isPendingAdmin && (
                              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                                  <span>🔒 Items Locked (LTC Manual Verification Pending)</span>
                                </div>
                                <p className="text-[11px] text-amber-800 leading-tight font-medium">
                                  You paid using Litecoin (LTC). Please wait for manual confirmation. Once the store admin verifies your LTC deposit on the blockchain, your items will be automatically unlocked.
                                </p>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-xs pt-1 border-t border-purple-50">
                              <span className="text-[#6e5a8e] font-medium">Order ID: <strong className="font-mono text-[#1e1035]">{orderId}</strong></span>
                              
                              {/* ACTION BUTTONS */}
                              {isCompleted ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedCardOrder({ tx, demoCard })}
                                  className="glass-btn px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-sm"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>View Card &amp; Credentials</span>
                                </button>
                              ) : isPendingAdmin ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300">
                                  <Clock className="w-3 h-3 animate-spin" /> Awaiting Admin Approval
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleProceedOrder(tx)}
                                  className="glass-btn px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-sm"
                                >
                                  <span>Proceed Order</span>
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
    </div>
  );
};
