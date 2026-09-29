import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VirtualCard3D } from './components/VirtualCard3D';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { HowItWorksPage } from './components/HowItWorksPage';
import { ReviewsModal } from './components/ReviewsModal';
import { LoginModal } from './components/LoginModal';
import { AuthModal } from './components/AuthModal';
import { NewProfileModal } from './components/NewProfileModal';
import { SupportModal } from './components/SupportModal';
import { UserProfileSection } from './components/UserProfileSection';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { LivePurchaseNotification } from './components/LivePurchaseNotification';
import { ProofAndReviewsSection } from './components/ProofAndReviewsSection';
import { AdminBottomPanel } from './components/AdminBottomPanel';
import { syncUserProfileToSupabase, fetchUserProfileFromSupabase, syncOrderToSupabase, autoSeedSupabaseData } from './lib/supabase';
import { CARD_SUITES as INITIAL_CARD_SUITES, NETWORK_BRANDS } from './data/cardsData';
import { ChevronRight, BookOpen, GraduationCap, CheckCircle, Star, ShoppingCart, Tag, Radio, Mail, Smartphone, Shield, LockKeyhole, Headphones } from 'lucide-react';

export const App = () => {
  const [cardSuites, setCardSuites] = useState(INITIAL_CARD_SUITES);
  const [currentView, setCurrentView] = useState('marketplace'); // 'marketplace' | 'how-it-works'
  const [activeBrand, setActiveBrand] = useState('visa');
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [reviewSuite, setReviewSuite] = useState(null);
  const [gatewayOrderItem, setGatewayOrderItem] = useState(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState('profile'); // 'profile' | 'orders'
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isAdminViewModal, setIsAdminViewModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('deepmarket_admin_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const DEFAULT_USER_PROFILE = {
    firstName: 'Ranjeet',
    surname: 'Gupta',
    gmail: 'ranjeet.gupta@deepmarket.org',
    avatarUrl: '/assets/avatars/men1.jpg',
    isLoggedIn: true
  };

  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [normalWalletBalance, setNormalWalletBalance] = useState(500);
  const [virtualWalletBalance, setVirtualWalletBalance] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  // Load order history, user profile, and wallet balances from localStorage & Supabase
  useEffect(() => {
    try {
      // Trigger Supabase Auto-Seeding so sample profiles and orders populate the dashboard
      autoSeedSupabaseData();

      const savedOrders = localStorage.getItem('deepmarket_orders');
      if (savedOrders) {
        setTransactions(JSON.parse(savedOrders));
      }
      const isLoggedOut = localStorage.getItem('deepmarket_logged_out') === 'true';
      const savedProfile = localStorage.getItem('deepmarket_user_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else if (!isLoggedOut) {
        setUserProfile(DEFAULT_USER_PROFILE);
        localStorage.setItem('deepmarket_user_profile', JSON.stringify(DEFAULT_USER_PROFILE));
      } else {
        setUserProfile(null);
      }
      const savedNormalWallet = localStorage.getItem('deepmarket_normal_wallet');
      if (savedNormalWallet) {
        setNormalWalletBalance(parseInt(savedNormalWallet, 10));
      }
      const savedVirtualWallet = localStorage.getItem('deepmarket_virtual_wallet');
      if (savedVirtualWallet) {
        setVirtualWalletBalance(parseInt(savedVirtualWallet, 10));
      }

      // Fetch user profile from Supabase Project bfqrmgmnzmgdzboamjhd if not explicitly logged out
      if (!isLoggedOut) {
        fetchUserProfileFromSupabase('rnejet3').then((supabaseProfile) => {
          if (supabaseProfile) {
            setUserProfile((prev) => ({
              ...prev,
              ...supabaseProfile,
              isLoggedIn: true
            }));
            if (supabaseProfile.normalWalletBalance !== undefined) {
              setNormalWalletBalance(supabaseProfile.normalWalletBalance);
            }
          }
        });
      }

      // Check for PayU payment return redirect
      const urlParams = new URLSearchParams(window.location.search);
      const payuStatus = urlParams.get('payu_status');
      const payuTxnId = urlParams.get('txnid');
      const payuAmount = urlParams.get('amount');
      const payuRef = urlParams.get('ref');
      const payuReason = urlParams.get('reason');
      const payuCustomer = urlParams.get('customer');

      if (payuStatus === 'success') {
        const orderId = payuTxnId || `DM-${Math.floor(10000 + Math.random() * 90000)}`;
        const customerDisplayName = payuCustomer || (userProfile && [userProfile.firstName, userProfile.surname].filter(Boolean).join(' ')) || 'Cardholder';
        const confirmedOrder = {
          id: orderId,
          orderNumber: orderId,
          suiteId: 'payu-verified-suite',
          suiteName: 'DeepMarket Premium Card Suite (PayU Verified)',
          brand: 'VISA',
          priceInr: parseFloat(payuAmount) || 1000,
          totalPaid: parseFloat(payuAmount) || 1000,
          paymentMethod: 'PayU Payment Gateway (UPI / Cards)',
          paymentStatus: 'Payment Confirmed',
          status: 'Payment Confirmed',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          submittedAt: new Date().toISOString(),
          payuRef: payuRef || 'PAYU_REF_' + Date.now(),
          demoCard: {
            cardType: 'VISA',
            name: customerDisplayName,
            fullCardNumber: `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
            cardNumber: `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
            expiry: `08/${new Date().getFullYear() + 3}`,
            cvv: `${Math.floor(100 + Math.random() * 900)}`,
            zip: '110001',
            country: 'India',
            accessKey: `DM-AUTH-${Math.floor(100000 + Math.random() * 900000)}`
          }
        };

        const existingOrders = JSON.parse(localStorage.getItem('deepmarket_orders') || '[]');
        if (!existingOrders.some((o) => o.id === orderId)) {
          const updated = [confirmedOrder, ...existingOrders];
          localStorage.setItem('deepmarket_orders', JSON.stringify(updated));
          setTransactions(updated);
          syncOrderToSupabase(confirmedOrder);
        }
        showToast('🎉 PayU Payment Successful! Card suite unlocked.');
        setIsOrdersOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (payuStatus === 'failed') {
        showToast(`❌ PayU Payment Failed: ${payuReason || 'Transaction declined.'}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn("Failed to read data from localStorage", e);
    }
  }, []);

  // Save order history
  const saveTransactions = (newOrders) => {
    setTransactions(newOrders);
    try {
      localStorage.setItem('deepmarket_orders', JSON.stringify(newOrders));
    } catch (e) {
      console.warn("Failed to save orders to localStorage", e);
    }
  };

  // Save user profile & Sync to Supabase
  const handleSaveProfile = (profileData) => {
    const activeProfile = {
      ...profileData,
      isLoggedIn: true
    };
    setUserProfile(activeProfile);
    try {
      localStorage.setItem('deepmarket_user_profile', JSON.stringify(activeProfile));
      localStorage.removeItem('deepmarket_logged_out');
    } catch (e) {
      console.warn("Failed to save user profile", e);
    }

    // Shift user profile data to Supabase
    syncUserProfileToSupabase({
      ...activeProfile,
      username: 'rnejet3',
      normalWalletBalance: normalWalletBalance
    });
  };

  // Add Normal Wallet Balance (For Purchases)
  const handleAddNormalWallet = (amount) => {
    const updated = normalWalletBalance + amount;
    setNormalWalletBalance(updated);
    try {
      localStorage.setItem('deepmarket_normal_wallet', `${updated}`);
    } catch (e) {
      console.warn("Failed to save normal wallet balance", e);
    }

    if (userProfile) {
      syncUserProfileToSupabase({
        ...userProfile,
        username: 'rnejet3',
        normalWalletBalance: updated
      });
    }
  };

  // Add Virtual Wallet Balance (For Refund Payouts - Withdrawal Only)
  const handleAddVirtualWallet = (amount) => {
    const updated = virtualWalletBalance + amount;
    setVirtualWalletBalance(updated);
    try {
      localStorage.setItem('deepmarket_virtual_wallet', `${updated}`);
    } catch (e) {
      console.warn("Failed to save virtual wallet balance", e);
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('deepmarket_user_profile');
      localStorage.setItem('deepmarket_logged_out', 'true');
    } catch (e) {
      console.warn("Failed to clear user profile", e);
    }
    setCurrentView('marketplace');
    showToast("Logged out successfully.");
  };

  const handleAddTransaction = (order) => {
    const updated = [order, ...transactions];
    saveTransactions(updated);

    // Sync order transaction data to Supabase
    syncOrderToSupabase(order);
  };

  const handleUpdateTransaction = (updatedTx) => {
    const updated = transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t));
    saveTransactions(updated);
  };

  const handleClearOrders = () => {
    saveTransactions([]);
    showToast("Order history cleared!");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleOpenBuy = (suite) => {
    setSelectedSuite(suite);
    setIsCheckoutOpen(true);
  };

  // Directly Add Suite to Cart
  const handleAddToCart = (suite) => {
    const newTx = {
      id: `DM-${Math.floor(100000 + Math.random() * 900000)}`,
      suiteId: suite.id,
      suiteName: suite.name,
      priceInr: suite.priceInr,
      priceUsd: suite.priceUsd,
      brand: activeBrand,
      cardBalance: suite.cardBalance,
      processingSla: suite.processingSla,
      status: 'pending',
      date: new Date().toLocaleString(),
      paymentMethod: 'Crypto (BTC / LTC)'
    };
    handleAddTransaction(newTx);
    showToast(`Added ${suite.name} to Cart!`);
  };

  const handleProceedPayment = (item) => {
    setSelectedSuite(item);
    setIsOrdersOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (verifiedItem) => {
    handleUpdateTransaction(verifiedItem);
  };

  const handleOpenReviews = (suite) => {
    setReviewSuite(suite);
    setIsReviewsOpen(true);
  };

  const handleAddReview = (suiteId, newReviewObj) => {
    const updatedSuites = cardSuites.map((suite) => {
      if (suite.id === suiteId) {
        return {
          ...suite,
          reviewCount: suite.reviewCount + 1,
          reviews: [newReviewObj, ...(suite.reviews || [])]
        };
      }
      return suite;
    });
    setCardSuites(updatedSuites);
    if (reviewSuite && reviewSuite.id === suiteId) {
      setReviewSuite({
        ...reviewSuite,
        reviewCount: reviewSuite.reviewCount + 1,
        reviews: [newReviewObj, ...(reviewSuite.reviews || [])]
      });
    }
    showToast("Thank you for your review!");
  };

  // Direct buy for Carding Course alone
  const handleBuyCourseDirect = () => {
    setSelectedSuite({
      id: "carding-course-standalone",
      name: "Carding Course",
      priceInr: 400,
      priceUsd: 5,
      limit: "Full Masterclass Access",
      cardBalance: "Course Material",
      expiry: "Lifetime Access",
      processingSla: "Instant Access",
      qtyRemaining: 99
    });
    setIsCheckoutOpen(true);
  };

  const handleOpenAuthModal = () => {
    setIsProfileOpen(false);
    setIsOrdersOpen(false);
    setIsSupportOpen(false);
    setIsGatewayOpen(false);
    setIsLoginOpen(false);
    setTimeout(() => {
      setIsLoginOpen(true);
    }, 10);
  };

  const handleOpenProfileModal = () => {
    setIsLoginOpen(false);
    setIsOrdersOpen(false);
    setIsSupportOpen(false);
    setIsGatewayOpen(false);
    if (!userProfile || !userProfile.isLoggedIn) {
      handleOpenAuthModal();
      return;
    }
    setIsProfileOpen(false);
    setTimeout(() => {
      setIsProfileOpen(true);
    }, 10);
  };

  const handleOpenSupport = () => {
    setIsLoginOpen(false);
    setIsProfileOpen(false);
    setIsOrdersOpen(false);
    setIsGatewayOpen(false);
    setIsSupportOpen(false);
    setTimeout(() => {
      setIsSupportOpen(true);
    }, 10);
  };

  const handleOpenProfileOrders = () => {
    setIsLoginOpen(false);
    setIsSupportOpen(false);
    setIsGatewayOpen(false);
    setIsAdminViewModal(false);
    setIsOrdersOpen(true);
  };

  const handleOpenAdminPanel = () => {
    setIsLoginOpen(false);
    setIsProfileOpen(false);
    setIsSupportOpen(false);
    setIsGatewayOpen(false);
    setIsAdminViewModal(true);
    setIsOrdersOpen(true);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('deepmarket_admin_logged_in', 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('deepmarket_admin_logged_in');
    } catch (e) {
      // ignore
    }
    showToast("Admin session locked.");
  };

  const handleOpenProfileWallet = () => {
    setIsLoginOpen(false);
    setIsSupportOpen(false);
    setIsGatewayOpen(false);
    setProfileTab('profile');
    setIsProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f6fc] text-[#1e1035] flex flex-col selection:bg-purple-200 selection:text-purple-900 font-['Satoshi']">
      
      {/* BLACK CONTINUOUS SCROLLING DISCOUNT MARQUEE STRIPE */}
      <div className="w-full bg-[#05070a] text-white py-2.5 overflow-hidden whitespace-nowrap z-30 border-b border-purple-950 font-['Satoshi'] shadow-md">
        <div className="animate-marquee flex items-center font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
          <span className="mx-8 flex items-center gap-2 shrink-0">
            🔥 <strong className="text-white">10% DISCOUNT ON ALL ORDERS USING THIS CODE</strong> <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-md font-black tracking-widest">DEEPNET50</span> 🔥
          </span>
          <span className="mx-8 flex items-center gap-2 shrink-0">
            🔥 <strong className="text-white">10% DISCOUNT ON ALL ORDERS USING THIS CODE</strong> <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-md font-black tracking-widest">DEEPNET50</span> 🔥
          </span>
          <span className="mx-8 flex items-center gap-2 shrink-0">
            🔥 <strong className="text-white">10% DISCOUNT ON ALL ORDERS USING THIS CODE</strong> <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-md font-black tracking-widest">DEEPNET50</span> 🔥
          </span>
          <span className="mx-8 flex items-center gap-2 shrink-0">
            🔥 <strong className="text-white">10% DISCOUNT ON ALL ORDERS USING THIS CODE</strong> <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-md font-black tracking-widest">DEEPNET50</span> 🔥
          </span>
        </div>
      </div>

      {/* Header Bar */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        ordersCount={transactions.length}
        userProfile={userProfile}
        walletBalance={normalWalletBalance}
        onOpenOrders={() => {
          setIsAdminViewModal(false);
          setIsOrdersOpen(true);
        }}
        onOpenLogin={handleOpenAuthModal}
        onOpenProfile={handleOpenProfileModal}
        onOpenWallet={handleOpenProfileModal}
        onOpenSupport={handleOpenSupport}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'how-it-works' ? (
          <HowItWorksPage onGoToMarketplace={() => setCurrentView('marketplace')} />
        ) : currentView === 'profile' ? (
          <UserProfileSection
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            onLogout={handleLogout}
            onShowToast={showToast}
          />
        ) : (
          <div>
            {/* PURE FULL-BLEED VIDEO HERO SECTION */}
            <section className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] overflow-hidden bg-[#150a28]">
              
              {/* FULL-BLEED BACKGROUND VIDEO */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-95 filter brightness-105 saturate-125 pointer-events-none z-0"
                poster="/assets/vc_ref.jpg"
              >
                <source src="/assets/hero_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* SUBTLE SOFT BOTTOM GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6fc] via-transparent to-transparent pointer-events-none z-0 opacity-70" />

              {/* FLOATING SUPPORT ACTION PILL IN BOTTOM RIGHT */}
              <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-10">
                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="glass-btn px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-2xl hover:scale-105 transition-transform"
                >
                  <Headphones className="w-4 h-4 text-purple-200" />
                  <span>24/7 SUPPORT &amp; FAQ</span>
                </button>
              </div>

            </section>

            {/* FEATURED CARDING COURSE BANNER IMAGE WITH PERFECTLY ALIGNED OVERLAID PURPLE BUY BUTTON */}
            <section className="py-4 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto">
                <div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl group border border-purple-800/40"
                >
                  <img 
                    onClick={handleBuyCourseDirect}
                    src="/assets/course_banner.png" 
                    alt="Carding Masterclass Special Training Course - ₹400" 
                    className="w-full h-auto object-cover block rounded-3xl cursor-pointer" 
                  />

                  {/* PERFECTLY ALIGNED PURPLE CTA BUTTON OVERLAYING POSTER PRINTED BUTTON 100% EXACTLY */}
                  <div className="absolute bottom-[13.2%] sm:bottom-[13.8%] md:bottom-[14.2%] left-1/2 -translate-x-1/2 z-20 w-[41.5%] sm:w-[41%] md:w-[40.5%] max-w-[380px] h-[12%] min-h-[30px] max-h-[52px] flex items-center justify-center">
                    <button
                      onClick={handleBuyCourseDirect}
                      className="w-full h-full rounded-full bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7e22ce] text-white font-['Satoshi'] font-black text-[10px] xs:text-xs sm:text-sm md:text-base uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-[1.01] active:scale-95 transition-all duration-200 border border-purple-200/40"
                      title="Click to Proceed for Payment (₹400)"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-purple-100 shrink-0" />
                      <span className="truncate">BUY COURSE (₹400)</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* NETWORK BRAND TABS SELECTOR */}
            <section id="catalog-grid" className="py-8 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="font-['Satoshi'] text-2xl sm:text-3xl font-black text-[#1e1035] mb-2 tracking-tight">
                    Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">Card Network</span>
                  </h2>
                  <p className="text-[#6e5a8e] text-xs sm:text-sm font-['Satoshi'] font-medium">
                    Select your preferred architecture network protocol.
                  </p>
                </div>

                {/* Professional Network Selector Buttons */}
                <div className="flex justify-center mb-10">
                  <div className="inline-flex items-center gap-2 p-1.5 rounded-full border border-purple-200/80 bg-white shadow-sm font-['Satoshi']">
                    <button
                      onClick={() => setActiveBrand('visa')}
                      className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        activeBrand === 'visa'
                          ? 'glass-btn shadow-md ring-2 ring-purple-400/50'
                          : 'text-[#6e5a8e] hover:text-[#1e1035] hover:bg-purple-50'
                      }`}
                    >
                      <span className="font-serif italic font-black text-sm tracking-tighter">VISA</span>
                      <span className="text-[10px] opacity-75 font-mono">3D SECURE</span>
                    </button>

                    <button
                      onClick={() => setActiveBrand('mastercard')}
                      className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        activeBrand === 'mastercard'
                          ? 'glass-btn shadow-md ring-2 ring-purple-400/50'
                          : 'text-[#6e5a8e] hover:text-[#1e1035] hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex -space-x-1.5 items-center">
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block" />
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block opacity-90" />
                      </div>
                      <span>MASTERCARD</span>
                    </button>
                  </div>
                </div>

                {/* BORDERLESS CARD SUITES CATALOG GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                  {cardSuites
                    .filter((suite) => {
                      if (activeBrand === 'visa') return suite.network !== 'mastercard';
                      if (activeBrand === 'mastercard') return suite.network === 'mastercard';
                      return true;
                    })
                    .map((suite) => {
                    const isPopular = suite.id === 'shadow-suite';
                    const entryFee = suite.priceInr;
                    const balance = suite.cardBalance;

                    return (
                      <div
                        key={suite.id}
                        className={`rounded-3xl p-6 flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                          isPopular
                            ? 'purple-card-popular lg:scale-105 z-10'
                            : 'purple-card'
                        }`}
                      >
                        {/* Badge */}
                        {isPopular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 glass-btn text-[10px] font-['Satoshi'] font-black uppercase tracking-widest rounded-full shadow-md whitespace-nowrap">
                            MOST POPULAR
                          </div>
                        )}

                        {/* Suite Header */}
                        <div>
                          {/* Available & 300+ Reviews Rating Pill */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-['Satoshi'] font-bold uppercase tracking-widest text-[#1e1035] flex items-center gap-1.5 border-0 bg-purple-50/80 px-3 py-1 rounded-full shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" /> Available
                            </span>

                            {/* Rating & 300+ Reviews Pill */}
                            <button
                              onClick={() => handleOpenReviews(suite)}
                              className="text-[11px] font-['Satoshi'] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border-0 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              title="Click to view all reviews"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{suite.rating}</span>
                              <span className="text-[#6e5a8e] font-normal">({suite.reviewCount}+)</span>
                            </button>
                          </div>

                          {/* 3D Virtual Card Flip Preview */}
                          <VirtualCard3D suite={suite} activeBrand={activeBrand} />

                          {/* Suite Name & Description */}
                          <h3 className="font-['Satoshi'] text-xl font-bold text-[#1e1035] mb-1 group-hover:text-purple-700 transition-colors">
                            {suite.name}
                          </h3>
                          <p className="text-xs text-[#6e5a8e] leading-relaxed mb-4 font-['Satoshi'] font-medium">{suite.description}</p>

                          {/* Specs List with Balance of Card */}
                          <ul className="space-y-2.5 mb-6 border-t border-b border-purple-100/70 py-4 text-xs text-[#1e1035] font-['Satoshi']">
                            <div className="flex justify-between items-center bg-purple-50/80 border-0 px-3.5 py-2.5 rounded-xl">
                              <span className="text-purple-900 font-bold uppercase tracking-wider text-[11px]">Balance of Card</span>
                              <span className="font-black text-purple-700 text-base">{balance}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-[#6e5a8e] font-medium">Zero Hidden Fees</span>
                              <span className="font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Guaranteed
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#6e5a8e] font-medium">Order Tracking</span>
                              <span className="font-bold text-purple-700 flex items-center gap-1">
                                <Radio className="w-3 h-3 animate-pulse" /> Live Real-Time
                              </span>
                            </div>
                          </ul>
                        </div>

                        {/* Pricing & Dual Action Buttons (BUY NOW & ADD TO CART) */}
                        <div>
                          <div className="flex justify-between items-end mb-4 font-['Satoshi']">
                            <div>
                              <p className="font-['Satoshi'] text-3xl font-black tracking-tight text-[#1e1035]">
                                ₹{entryFee.toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs text-[#6e5a8e] font-medium">
                              Remaining: <strong className="text-[#1e1035] font-bold">{suite.qtyRemaining}</strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-12 gap-2 font-['Satoshi']">
                            {/* BUY NOW BUTTON */}
                            <button
                              onClick={() => handleOpenBuy(suite)}
                              className="glass-btn col-span-6 h-12 rounded-full text-xs font-['Satoshi'] font-extrabold uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-1"
                            >
                              <span>BUY NOW</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* ADD TO CART BUTTON */}
                            <button
                              onClick={() => handleAddToCart(suite)}
                              className="glass-btn-secondary col-span-6 h-12 rounded-full text-xs font-['Satoshi'] font-extrabold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                              title="Add to Shopping Cart"
                            >
                              <ShoppingCart className="w-4 h-4 text-purple-700" />
                              <span>ADD TO CART</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* REAL-TIME PROOF OF DELIVERY & VERIFIED CUSTOMER REVIEWS SECTIONS */}
            <ProofAndReviewsSection 
              onOpenReviews={() => setIsReviewsOpen(true)} 
              onOpenBuyCourse={handleBuyCourseDirect} 
            />
          </div>
        )}
      </main>

      {/* DEDICATED PROPER ADMIN PANEL AT THE BOTTOM */}
      <AdminBottomPanel
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        onOpenAdminPanel={handleOpenAdminPanel}
        transactions={transactions}
        onShowToast={showToast}
      />

      {/* FOOTER WITH COMPANY NAME, SUPPORT EMAIL, DATA PRIVACY ASSURANCE, & MOBILE DETAILS */}
      <footer className="py-12 border-t border-purple-100 bg-white text-[#1e1035] font-['Satoshi']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Brand & Company Name */}
          <div className="md:col-span-5 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 border border-purple-200 p-2 flex items-center justify-center shadow-xs">
                <img src="/assets/dm_logo_original_black.png" alt="DeepMarket Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-['Satoshi'] text-2xl font-black tracking-tight text-[#1e1035]">
                DeepMarket Inc.
              </span>
            </div>
            <p className="text-xs text-[#6e5a8e] font-medium max-w-sm mx-auto md:mx-0">
              DeepMarket Financial Technologies Ltd. — Premium Virtual Credit Card issuing platform with instant dispatch and zero hidden fees.
            </p>
          </div>

          {/* Support Email & Mobile Details */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-[#524170] font-semibold">
            
            {/* Support Email */}
            <a 
              href="mailto:deepmarketofficialchat@gmail.com" 
              className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-extrabold hover:bg-purple-100 transition-colors shadow-xs"
            >
              <Mail className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Support Email: <strong className="text-purple-700 font-black">deepmarketofficialchat@gmail.com</strong></span>
            </a>

            {/* Mobile Platform Details */}
            <div className="flex items-center gap-4 text-[11.5px]">
              <span className="flex items-center gap-1.5 text-purple-950 font-extrabold">
                <Smartphone className="w-4 h-4 text-purple-700 shrink-0" />
                iOS & Android Mobile PWA
              </span>
              <span className="text-purple-200">•</span>
              <span className="flex items-center gap-1.5 text-purple-950 font-extrabold">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                256-Bit Encrypted Security
              </span>
            </div>

          </div>

        </div>

        {/* PROFESSIONAL DATA PRIVACY ASSURANCE BANNER */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
          <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200/80 text-center text-xs font-['Satoshi'] text-[#524170] flex flex-col sm:flex-row items-center justify-center gap-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-purple-950 font-extrabold shrink-0">
              <LockKeyhole className="w-4 h-4 text-purple-700" />
              <span>Data Privacy Assurance:</span>
            </div>
            <p className="font-medium text-[#524170]">
              We strictly enforce zero-knowledge encryption protocols. Your data is strictly confidential and is <strong className="text-[#1e1035] font-bold">never transferred, shared, or disclosed to any third-party entities</strong> under any circumstances.
            </p>
          </div>
        </div>

        {/* Footer Bottom Copy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-purple-100 text-center text-xs text-[#6e5a8e]">
          <p>© 2026 DeepMarket Inc. All Rights Reserved. Instant Card Clearance Protocol.</p>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedSuite={selectedSuite}
        selectedBrand={activeBrand}
        onAddTransaction={handleAddTransaction}
        onOpenOrders={handleOpenProfileOrders}
        onShowToast={showToast}
        userProfile={userProfile}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => {
          setIsOrdersOpen(false);
          setIsAdminViewModal(false);
        }}
        transactions={transactions}
        onClearOrders={handleClearOrders}
        onProceedPayment={handleProceedPayment}
        onUpdateTransaction={handleUpdateTransaction}
        onShowToast={showToast}
        initialAdminView={isAdminViewModal}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderItem={gatewayOrderItem}
        onPaymentSuccess={handlePaymentSuccess}
        onShowToast={showToast}
      />

      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        suite={reviewSuite}
        onAddReview={handleAddReview}
      />

      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSaveProfile={handleSaveProfile}
        onShowToast={showToast}
      />

      <NewProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        onShowToast={showToast}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Live Social Proof Purchase Notification */}
      <LivePurchaseNotification />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-[#1e1035] text-white border border-purple-400 shadow-2xl text-xs font-bold font-['Satoshi'] animate-bounce">
          {toastMessage}
        </div>
      )}

    </div>
  );
};
