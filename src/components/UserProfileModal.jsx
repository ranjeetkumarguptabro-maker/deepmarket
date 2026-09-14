import React, { useState, useEffect } from 'react';
import { X, User, Camera, Mail, Save, LogOut, CreditCard, ShoppingBag, Copy, ShieldCheck, Wallet, Plus, CheckCircle2, RefreshCw, Clock, Check, XCircle, ShieldAlert, Zap, Database, UploadCloud, Lock, KeyRound } from 'lucide-react';
import { DEMO_TEST_CARDS } from '../data/cardsData';
import { autoSeedSupabaseData } from '../lib/supabase';
import { sanitizeText, validateFileUpload, isValidAmount, checkRateLimit } from '../lib/security';
import { CaptchaWidget } from './CaptchaWidget';

export const UserProfileModal = ({ isOpen, onClose, userProfile, transactions, normalWalletBalance = 0, onAddNormalWallet, onUpdateTransaction, initialTab = 'profile', onSaveProfile, onLogout, onShowToast }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'orders' | 'refunds' | 'admin'
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [surname, setSurname] = useState(userProfile?.surname || '');
  const [gmail, setGmail] = useState(userProfile?.gmail || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '/assets/avatars/men1.jpg');
  
  // Wallet Top-Up State
  const [topupAmount, setTopupAmount] = useState('');
  
  // Refund Requests State
  const [refundRequests, setRefundRequests] = useState([
    {
      id: 'REF-45991',
      orderId: 'ORD-45991',
      userId: 'DEV-USER-01',
      refundAmount: 1000,
      totalRefund: 1000,
      status: 'Approved',
      reason: 'I purchased by mistake',
      createdAt: '05/08/2026'
    }
  ]);

  // Request Refund Reason Input Modal State
  const [refundModalOrder, setRefundModalOrder] = useState(null);
  const [refundReason, setRefundReason] = useState('I purchased by mistake');

  // Selected Order for Single Card Details View
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCvv, setShowCvv] = useState(false);

  // Admin Security Lockout & Multi-Factor Username/Password Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminCaptchaVerified, setIsAdminCaptchaVerified] = useState(false);
  const [adminAuditLogs, setAdminAuditLogs] = useState([
    { action: 'ADMIN_SECURITY_INITIALIZED', timestamp: '06/08/2026 19:30', status: 'SUCCESS', ip: '127.0.0.1' }
  ]);

  const handleUnlockAdminPanel = (e) => {
    e.preventDefault();
    setAdminAuthError('');

    // Strict Rate Limiting: Max 3 failed attempts per 15 minutes
    const rateCheck = checkRateLimit('admin_login_attempt', 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      setAdminAuthError(rateCheck.message);
      if (onShowToast) onShowToast(rateCheck.message);
      return;
    }

    if (!isAdminCaptchaVerified) {
      setAdminAuthError('Security Alert: Cloudflare Turnstile CAPTCHA verification required!');
      return;
    }

    const u = sanitizeText(adminUsernameInput).toLowerCase();
    const p = adminPasswordInput.trim();

    // Check 10-digit password length & dual credential check
    if (p.length < 10) {
      setAdminAuthError('Security Requirement: Password must be at least 10 characters long.');
      return;
    }

    // Official Admin Credentials: Username: darkerzoneyt | Password: Rgbro@779!
    if (u === 'darkerzoneyt' && p === 'Rgbro@779!') {
      setIsAdminAuthenticated(true);
      setAdminUsernameInput('');
      setAdminPasswordInput('');
      setAdminAuthError('');
      const logEntry = {
        action: 'ADMIN_AUTHENTICATED',
        timestamp: new Date().toLocaleString(),
        status: 'SUCCESS',
        ip: '127.0.0.1'
      };
      setAdminAuditLogs((prev) => [logEntry, ...prev]);
      if (onShowToast) onShowToast("🔒 Admin Credentials Verified! Security Panel Unlocked.");
    } else {
      setAdminAuthError('Security Alert: Invalid Admin Username or Password! Access attempt logged.');
      const logEntry = {
        action: 'ADMIN_FAILED_AUTH_ATTEMPT',
        timestamp: new Date().toLocaleString(),
        status: 'BLOCKED',
        user: u || 'unknown',
        ip: '127.0.0.1'
      };
      setAdminAuditLogs((prev) => [logEntry, ...prev]);
      if (onShowToast) onShowToast("Security Alert: Invalid Admin Credentials!");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'profile');
      setSelectedOrder(null);
      setFirstName(userProfile?.firstName || 'Ranjeet');
      setSurname(userProfile?.surname || 'Gupta');
      setGmail(userProfile?.gmail || 'ranjeet.gupta@deepmarket.org');
      setAvatarUrl(userProfile?.avatarUrl || '/assets/avatars/men1.jpg');
    }
  }, [isOpen, initialTab, userProfile]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File Upload Security Check (MIME type & Max 2 MB limit)
      const fileCheck = validateFileUpload(file, 2);
      if (!fileCheck.valid) {
        if (onShowToast) onShowToast(fileCheck.message);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      firstName: sanitizeText(firstName),
      surname: sanitizeText(surname),
      gmail: sanitizeText(gmail),
      avatarUrl: avatarUrl,
      isLoggedIn: true
    };
    onSaveProfile(updated);
    if (onShowToast) onShowToast("User Profile Saved & Synced to Supabase!");
  };

  const handlePushSampleDataToSupabase = async () => {
    await autoSeedSupabaseData();
    if (onShowToast) onShowToast("🎉 Pushed Sample User Profiles & Orders to Supabase (Project ID: bfqrmgmnzmgdzboamjhd)!");
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast(`Copied ${label} to clipboard!`);
  };

  const handleTopupSubmit = (e) => {
    if (e) e.preventDefault();
    const val = parseInt(topupAmount.trim(), 10);
    if (isNaN(val) || val <= 0) {
      if (onShowToast) onShowToast("Please enter a valid top-up amount.");
      return;
    }

    if (onAddNormalWallet) {
      onAddNormalWallet(val);
    }
    setTopupAmount('');
    if (onShowToast) onShowToast(`Added ₹${val.toLocaleString()} to Account Wallet!`);
  };

  const handleWithdrawSubmit = (e) => {
    if (e) e.preventDefault();
    const val = parseInt(topupAmount.trim(), 10);
    if (isNaN(val) || val <= 0) {
      if (onShowToast) onShowToast("Please enter a valid withdrawal amount.");
      return;
    }
    if (val > normalWalletBalance) {
      if (onShowToast) onShowToast("Withdrawal Error: Insufficient Account Wallet Balance.");
      return;
    }
    if (onAddNormalWallet) {
      onAddNormalWallet(-val);
    }
    setTopupAmount('');
    if (onShowToast) onShowToast(`✅ Withdrawal Request for ₹${val.toLocaleString()} submitted successfully!`);
  };

  // SYSTEM CHECKS ELIGIBILITY FLOW
  const handleOpenRefundModal = (tx) => {
    const orderId = tx.id || tx.orderNumber;

    if (!tx) {
      if (onShowToast) onShowToast("Refund Error: Order does not exist.");
      return;
    }

    if (tx.status === 'Refunded' || tx.status === 'REFUNDED') {
      if (onShowToast) onShowToast("Refund Error: Order is already refunded.");
      return;
    }

    const existingPending = refundRequests.find((r) => r.orderId === orderId && r.status === 'Pending');
    if (existingPending) {
      if (onShowToast) onShowToast("Refund Request is already Pending Approval.");
      return;
    }

    setRefundModalOrder(tx);
    setRefundReason('I purchased by mistake');
  };

  // REFUND REQUEST CREATED (Status: Pending)
  const handleSubmitRefundRequest = (e) => {
    e.preventDefault();
    if (!refundModalOrder) return;

    const orderId = refundModalOrder.id || refundModalOrder.orderNumber;
    const productPrice = refundModalOrder.orderAmount || refundModalOrder.priceInr || 1000;

    const newRefundReq = {
      id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: orderId,
      userId: userProfile?.firstName || 'Dev User',
      refundAmount: productPrice,
      totalRefund: productPrice,
      status: 'Pending',
      reason: refundReason,
      createdAt: new Date().toLocaleDateString()
    };

    setRefundRequests([newRefundReq, ...refundRequests]);
    setRefundModalOrder(null);
    if (onShowToast) onShowToast(`Refund Request Created for Order #${orderId} (Status: Pending)`);
  };

  // ADMIN REVIEW -> APPROVE REFUND
  const handleAdminApproveRefund = (refId) => {
    const targetRefund = refundRequests.find((r) => r.id === refId);
    if (!targetRefund) return;

    const updatedRefunds = refundRequests.map((r) =>
      r.id === refId ? { ...r, status: 'Approved', approvedAt: new Date().toLocaleDateString() } : r
    );
    setRefundRequests(updatedRefunds);

    if (onUpdateTransaction && transactions) {
      const matchTx = transactions.find((t) => (t.id || t.orderNumber) === targetRefund.orderId);
      if (matchTx) {
        onUpdateTransaction({
          ...matchTx,
          status: 'Refunded',
          cardDeleted: true
        });
      }
    }

    if (onAddNormalWallet) {
      onAddNormalWallet(targetRefund.totalRefund);
    }

    if (onShowToast) onShowToast(`🎉 Refund Approved & Sent! ₹${targetRefund.totalRefund.toLocaleString()} has been credited directly to your Account Wallet Balance.`);
  };

  // ADMIN REVIEW -> REJECT REFUND
  const handleAdminRejectRefund = (refId) => {
    const updatedRefunds = refundRequests.map((r) =>
      r.id === refId ? { ...r, status: 'Rejected' } : r
    );
    setRefundRequests(updatedRefunds);
    if (onShowToast) onShowToast(`Refund Request ${refId} Rejected. User notified.`);
  };

  // ADMIN REVIEW -> APPROVE PENDING LTC ORDER
  const handleAdminApproveLtcOrder = (tx) => {
    if (!onUpdateTransaction) return;

    const updatedTx = {
      ...tx,
      status: 'Completed',
      approvedByAdmin: true,
      approvalDate: new Date().toLocaleString()
    };

    onUpdateTransaction(updatedTx);
    if (onShowToast) onShowToast(`✅ LTC Order ${tx.id} APPROVED (Payment Received)! Card issued to user.`);
  };

  // ADMIN REVIEW -> REJECT PENDING LTC ORDER (Payment Not Received)
  const handleAdminRejectLtcOrder = (tx) => {
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

      {/* Profile Card Container */}
      <div className="relative w-full max-w-lg sm:max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 font-['Satoshi'] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 p-1.5 flex items-center justify-center">
              <img src="/assets/dm_logo_original_black.png" alt="DeepMarket Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">User Profile &amp; Portal</h3>
              <p className="text-xs text-[#6e5a8e] font-medium">Welcome {firstName || 'Dev'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* Tab Switcher: Profile vs Orders vs Refund History vs Admin Panel */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-purple-50 border border-purple-200 rounded-2xl shrink-0 font-['Satoshi'] text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setSelectedOrder(null);
            }}
            className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'profile' && !selectedOrder
                ? 'glass-btn shadow-md'
                : 'text-[#6e5a8e] hover:text-[#1e1035]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrder(null);
            }}
            className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'glass-btn shadow-md'
                : 'text-[#6e5a8e] hover:text-[#1e1035]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({transactions ? transactions.length : 0})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('refunds');
              setSelectedOrder(null);
            }}
            className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'refunds'
                ? 'glass-btn shadow-md'
                : 'text-[#6e5a8e] hover:text-[#1e1035]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refunds ({refundRequests.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setSelectedOrder(null);
            }}
            className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 space-y-5 pr-1">

          {/* TAB 1: EDIT PROFILE FORM WITH SINGLE ACCOUNT WALLET */}
          {activeTab === 'profile' && !selectedOrder && (
            <div className="space-y-6 font-['Satoshi'] animate-fade-in">
              
              {/* SINGLE ACCOUNT WALLET CARD */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-[#1e1035] text-white shadow-xl relative overflow-hidden space-y-3.5 border border-purple-400/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-purple-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-purple-400" /> Account Wallet Balance
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    ✓ VERIFIED
                  </span>
                </div>

                <div className="space-y-0.5">
                  <p className="font-mono text-3xl font-black text-white tracking-tight">
                    ₹{(normalWalletBalance || 0).toLocaleString()}.00
                  </p>
                </div>

                {/* TOP-UP & WITHDRAWAL FORM */}
                <div className="pt-3 border-t border-purple-800/80 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-300">₹</span>
                      <input
                        type="number"
                        placeholder="Amount e.g. 1000"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value)}
                        className="w-full h-9 pl-7 pr-3 bg-purple-900/60 border border-purple-700/60 rounded-xl text-xs font-mono text-white font-bold focus:outline-none focus:border-purple-400 placeholder:text-purple-300/60"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleTopupSubmit}
                      className="glass-btn px-3.5 h-9 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                      title="Top-Up Account Wallet Balance"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Top-Up</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleWithdrawSubmit}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 h-9 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-sm shrink-0 transition-colors"
                      title="Request Wallet Withdrawal"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PROFILE DETAILS EDIT FORM */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1 border-t border-purple-100">
                <h4 className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Profile Information</h4>
                
                <div className="flex flex-col items-center justify-center space-y-2 py-1">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-purple-300 shadow-md bg-purple-50">
                      <img 
                        src={avatarUrl} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <label 
                      htmlFor="profile-modal-avatar-upload"
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-800 transition-colors border-2 border-white"
                      title="Upload Profile Picture"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input 
                      id="profile-modal-avatar-upload" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" /> First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" /> Surname (Last Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-600" /> Gmail / Email
                    </label>
                    <span className="text-[10px] text-purple-700 font-extrabold uppercase bg-purple-100 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  </div>
                  <input
                    type="email"
                    placeholder="name@gmail.com (Optional)"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-medium"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE PROFILE</span>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full h-10 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout Session</span>
                    </button>
                  )}
                </div>
              </form>

            </div>
          )}

          {/* TAB 2: MY ORDERS LIST (WITH LTC PENDING ADMIN APPROVAL SUPPORT) */}
          {activeTab === 'orders' && !selectedOrder && (
            <div className="space-y-4 font-['Satoshi'] animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#1e1035]">My Orders</h4>
                <span className="text-xs text-purple-700 font-bold bg-purple-100 px-2.5 py-0.5 rounded-full">
                  {transactions ? transactions.length : 0} Total
                </span>
              </div>

              {!transactions || transactions.length === 0 ? (
                <div className="text-center py-10 space-y-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-6">
                  <ShoppingBag className="w-10 h-10 text-purple-400 mx-auto" />
                  <p className="text-xs text-[#6e5a8e] font-medium">No orders completed yet. Purchase a card suite to view your order details here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, index) => {
                    const demoCard = DEMO_TEST_CARDS[index % DEMO_TEST_CARDS.length];
                    const orderId = tx.id || tx.orderNumber || `DM-${45990 + index}`;
                    const productPrice = tx.orderAmount || tx.priceInr || 1000;
                    const statusStr = tx.status || 'Completed';
                    const isRefunded = statusStr === 'Refunded' || statusStr === 'REFUNDED';
                    const isPendingAdmin = statusStr === 'Pending Admin Approval';
                    const hasPendingRefund = refundRequests.some((r) => r.orderId === orderId && r.status === 'Pending');

                    return (
                      <div 
                        key={tx.id || index}
                        className="bg-white border border-purple-200 rounded-2xl p-4 space-y-3 shadow-xs font-['Satoshi']"
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center pb-2 border-b border-purple-100 text-xs">
                          <span className="font-extrabold text-[#1e1035] flex items-center gap-1">
                            Order #{orderId}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            isPendingAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            isRefunded ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isPendingAdmin ? 'Processing (Pending Admin)' : statusStr}
                          </span>
                        </div>

                        {/* Breakdown: Product Amount */}
                        <div className="flex justify-between items-center text-xs py-2 bg-purple-50/70 px-3.5 rounded-xl font-['Satoshi']">
                          <span className="text-[#6e5a8e] font-medium">
                            Payment Method: <strong className="text-[#1e1035] font-bold">{tx.paymentMethod || 'Instant UPI'}</strong>
                          </span>
                          <span className="font-mono font-black text-purple-900 text-base">₹{productPrice.toLocaleString()}</span>
                        </div>

                        {/* Status Message if Pending Admin Approval */}
                        {isPendingAdmin && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                              <span>LTC Deposit Verification Pending</span>
                            </div>
                            <p className="text-[10.5px] text-amber-800">
                              Order request sent to Admin Panel. Card details will be issued upon Admin approval.
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div>
                            {!isRefunded && !isPendingAdmin && !hasPendingRefund && (
                              <button
                                type="button"
                                onClick={() => handleOpenRefundModal(tx)}
                                className="px-3.5 py-1.5 rounded-full border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                [ Request Refund ]
                              </button>
                            )}

                            {hasPendingRefund && (
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 animate-spin" /> Refund Pending
                              </span>
                            )}
                          </div>

                          {!isRefunded && !isPendingAdmin && (
                            <button
                              type="button"
                              onClick={() => setSelectedOrder({ tx, index, demoCard })}
                              className="glass-btn px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center gap-1 shadow-sm"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>View Card</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REFUND HISTORY */}
          {activeTab === 'refunds' && !selectedOrder && (
            <div className="space-y-4 font-['Satoshi'] animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#1e1035]">Refund History</h4>
                <span className="text-xs text-purple-700 font-bold bg-purple-100 px-2.5 py-0.5 rounded-full">
                  {refundRequests.length} Requests
                </span>
              </div>

              <div className="space-y-3">
                {refundRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-white border border-purple-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-purple-100 pb-2">
                      <span className="font-bold text-[#1e1035]">Order #{req.orderId}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-mono">
                      <span className="text-[#6e5a8e]">Refund Amount:</span>
                      <span className="font-black text-purple-700 text-sm">₹{req.totalRefund.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#6e5a8e]">
                      <span>Requested On: {req.createdAt}</span>
                      <span>Reason: "{req.reason}"</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN PANEL FOR PENDING LTC ORDERS & REFUND APPROVALS */}
          {activeTab === 'admin' && !selectedOrder && (
            <div className="space-y-5 font-['Satoshi'] animate-fade-in">
              
              {!isAdminAuthenticated ? (
                /* ADMIN LOCK SCREEN GATE */
                <form onSubmit={handleUnlockAdminPanel} className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-black text-white">Restricted Admin Control Panel</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                      Security Protection Active: Authorization Passcode & Cloudflare CAPTCHA Verification Required.
                    </p>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Admin Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={adminUsernameInput}
                        onChange={(e) => setAdminUsernameInput(e.target.value)}
                        placeholder="Enter Admin ID (e.g. darkerzoneyt)"
                        required
                        className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  {/* 10-Digit Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex justify-between">
                      <span>Admin Password (10 Characters Min)</span>
                      <span className="text-[10px] text-amber-400 font-mono">ENCRYPTED AUTH</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        placeholder="Enter Admin Password (e.g. Rgbro@779!)"
                        minLength={10}
                        required
                        className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                    {adminAuthError && (
                      <p className="text-[11px] text-rose-400 font-bold pl-1 animate-shake">{adminAuthError}</p>
                    )}
                  </div>

                  {/* CAPTCHA Widget Verification */}
                  <CaptchaWidget
                    isVerified={isAdminCaptchaVerified}
                    onVerify={(status) => setIsAdminCaptchaVerified(status)}
                  />

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>VERIFY &amp; UNLOCK ADMIN PANEL</span>
                  </button>
                </form>
              ) : (
                /* UNLOCKED ADMIN PANEL CONTENT */
                <>
                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Authorization Active
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="text-[11px] text-rose-700 hover:underline font-extrabold cursor-pointer"
                    >
                      Lock Admin Panel
                    </button>
                  </div>

                  {/* ADMIN BANNER */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Admin Review Panel</span>
                </span>
                <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-mono">LIVE VERIFICATION</span>
              </div>

              {/* SECTION A: PENDING LTC ORDERS REQUIRING ADMIN APPROVAL */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> Pending LTC Crypto Orders
                </h5>

                {(!transactions || transactions.filter((t) => t.status === 'Pending Admin Approval').length === 0) ? (
                  <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-[#6e5a8e] font-medium text-center">
                    No pending LTC crypto orders waiting for approval.
                  </div>
                ) : (
                  transactions.filter((t) => t.status === 'Pending Admin Approval').map((tx) => (
                    <div key={tx.id} className="p-4 rounded-2xl bg-white border border-amber-300 space-y-3 text-xs shadow-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="flex items-center gap-1 text-amber-900">
                          <Zap className="w-3.5 h-3.5 text-amber-600" /> {tx.suiteName}
                        </span>
                        <span className="font-mono text-purple-700">Order #{tx.id}</span>
                      </div>

                      <div className="p-2.5 bg-amber-50 rounded-xl space-y-1.5 text-[11px] font-mono text-amber-950 border border-amber-200">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-bold">₹{(tx.totalPaid || tx.priceInr || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between truncate">
                          <span>LTC Address:</span>
                          <span className="font-bold truncate max-w-[200px]">{tx.ltcAddress}</span>
                        </div>
                        {tx.ltcTxHash && (
                          <div className="pt-1.5 border-t border-amber-200 space-y-1">
                            <div className="flex justify-between items-center text-purple-900 font-bold">
                              <span>Submitted TxID / Hash:</span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(tx.ltcTxHash, 'LTC TxID')}
                                className="text-[10px] text-purple-700 hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <p className="p-2 bg-white rounded-lg border border-purple-200 font-mono text-[10.5px] break-all text-purple-950 font-bold select-all">
                              {tx.ltcTxHash}
                            </p>
                            <a
                              href={`https://live.blockcypher.com/ltc/tx/${tx.ltcTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-amber-700 hover:text-amber-900 underline pt-0.5"
                            >
                              🔍 Verify TxID on Litecoin Blockchain Explorer →
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 font-['Satoshi'] pt-1">
                        <button
                          type="button"
                          onClick={() => handleAdminApproveLtcOrder(tx)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-all"
                          title="Payment Received - Approve & Issue Card"
                        >
                          <Check className="w-4 h-4" /> Approve (Payment Received)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminRejectLtcOrder(tx)}
                          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-all"
                          title="Payment Not Received - Reject Order"
                        >
                          <XCircle className="w-4 h-4" /> Reject (Payment Not Received)
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* SECTION B: REFUND APPROVAL REQUESTS */}
              <div className="space-y-3 pt-2 border-t border-purple-100">
                <h5 className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600" /> Pending Refund Requests
                </h5>

                <div className="space-y-3">
                  {refundRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-white border border-purple-200 space-y-3 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span>User: {req.userId}</span>
                        <span className="font-mono text-purple-700">Order #{req.orderId}</span>
                      </div>

                      <div className="flex justify-between items-center bg-purple-50 p-2.5 rounded-xl text-xs">
                        <span className="text-[#6e5a8e] font-medium">Refund Amount:</span>
                        <span className="font-mono font-black text-purple-900 text-sm">₹{req.totalRefund.toLocaleString()}</span>
                      </div>

                      <p className="text-[11px] text-[#6e5a8e]">Reason: <strong className="text-[#1e1035]">"{req.reason}"</strong></p>

                      <div className="flex gap-2 pt-1">
                        {req.status === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAdminApproveRefund(req.id)}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdminRejectRefund(req.id)}
                              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-1.5 bg-purple-50 rounded-xl text-center text-[11px] font-bold text-purple-900">
                            Status: {req.status}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

                </>
              )}

            </div>
          )}

          {/* DEDICATED SINGLE CARD DETAILS PLACE VIEW */}
          {selectedOrder && selectedOrder.demoCard && !selectedOrder?.tx?.cardDeleted && (
            <div className="space-y-5 font-['Satoshi'] animate-fade-in">
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Back to My Orders
              </button>

              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-[#1e1035] text-white shadow-xl space-y-4 border border-purple-400/30">
                <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                  <span>{selectedOrder.demoCard.cardType} DEEP-CARD</span>
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                    ✓ ACTIVE
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-purple-300 uppercase tracking-widest">Cardholder Name</p>
                  <p className="text-lg font-black tracking-wide text-white">{selectedOrder.demoCard.name}</p>
                </div>

                {/* Card Number */}
                <div className="bg-purple-900/60 border border-purple-700/50 p-3 rounded-2xl flex justify-between items-center font-mono">
                  <div>
                    <p className="text-[10px] text-purple-300">Card Number</p>
                    <p className="font-bold text-base tracking-widest text-white">{selectedOrder.demoCard.cardNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedOrder.demoCard.cardNumber, 'Card Number')}
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
                    <p className="font-bold text-sm text-white">{selectedOrder.demoCard.expiry}</p>
                  </div>
                  <div className="bg-purple-900/60 border border-purple-700/50 p-3 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-purple-300">Security CVV</p>
                      <p className="font-bold text-sm text-white">{showCvv ? selectedOrder.demoCard.cvv : '•••'}</p>
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

                {/* Billing Address & Owner Info */}
                <div className="space-y-1.5 pt-3 border-t border-purple-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Email:</span>
                    <span className="font-mono text-white font-bold">{selectedOrder.demoCard.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Phone:</span>
                    <span className="font-mono text-white font-bold">{selectedOrder.demoCard.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Country &amp; ZIP:</span>
                    <span className="font-bold text-white">{selectedOrder.demoCard.country} ({selectedOrder.demoCard.zip})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>RETURN TO MY ORDERS LIST</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* REQUEST REFUND REASON MODAL WITH ELIGIBILITY CHECK */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-purple-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-['Satoshi']">
            <div className="flex justify-between items-center border-b border-purple-100 pb-2">
              <h4 className="font-black text-lg text-[#1e1035]">Refund Eligibility Verified ✅</h4>
              <button onClick={() => setRefundModalOrder(null)} className="text-[#6e5a8e]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl space-y-1 text-xs text-[#524170]">
              <p className="font-bold text-purple-950">System Verification Checklist:</p>
              <ul className="text-[11px] space-y-0.5 font-medium">
                <li className="flex items-center gap-1 text-emerald-700">✓ Order exists (Order #{refundModalOrder.id || refundModalOrder.orderNumber})</li>
                <li className="flex items-center gap-1 text-emerald-700">✓ User owns the order</li>
                <li className="flex items-center gap-1 text-emerald-700">✓ Within eligible refund window</li>
                <li className="flex items-center gap-1 text-emerald-700">✓ Not already refunded</li>
              </ul>
            </div>

            <form onSubmit={handleSubmitRefundRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1e1035] uppercase">Reason for Refund</label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRefundModalOrder(null)}
                  className="flex-1 py-3 rounded-full border border-purple-200 text-xs font-bold text-[#6e5a8e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-btn flex-1 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
