import React from 'react';
import { ShoppingCart, User, BookOpen, Layers, Headphones, Wallet } from 'lucide-react';

export const Header = ({ currentView, onNavigate, ordersCount, userProfile, walletBalance = 0, onOpenOrders, onOpenLogin, onOpenWallet, onOpenSupport }) => {
  const isLoggedIn = userProfile && userProfile.isLoggedIn;
  const displayName = isLoggedIn && userProfile.firstName ? userProfile.firstName : 'Profile';
  const avatarUrl = userProfile && userProfile.avatarUrl ? userProfile.avatarUrl : '/assets/avatars/men1.jpg';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-purple-100 shadow-xs font-['Satoshi']">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-18 sm:h-22 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div 
            onClick={() => onNavigate('marketplace')}
            className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100/70 border border-purple-200 p-1.5 sm:p-2 shadow-xs cursor-pointer hover:bg-purple-200/80 transition-all shrink-0"
          >
            <img src="/assets/dm_logo_original_black.png" alt="DeepMarket Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 
              onClick={() => onNavigate('marketplace')}
              className="font-['Satoshi'] text-lg sm:text-2xl font-black tracking-tight text-[#1e1035] cursor-pointer truncate"
            >
              DeepMarket
            </h1>
            <p className="text-[9.5px] sm:text-[11px] text-[#6e5a8e] font-['Satoshi'] font-semibold hidden xs:block tracking-tight mt-0.5 truncate">
              Premium Virtual Cards, Delivered Instantly
            </p>
          </div>
        </div>

        {/* Center View Switcher Glass Tabs */}
        <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-purple-50/90 border border-purple-200/90 backdrop-blur-md shrink-0">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`px-4.5 py-1.5 rounded-full text-xs font-['Satoshi'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'marketplace'
                ? 'glass-btn shadow-md'
                : 'text-[#6e5a8e] hover:text-[#1e1035]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`px-4.5 py-1.5 rounded-full text-xs font-['Satoshi'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'how-it-works'
                ? 'glass-btn shadow-md'
                : 'text-[#6e5a8e] hover:text-[#1e1035]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Top Right Corner Actions: Support, Wallet, User Profile / Login & Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-['Satoshi']">
          
          {/* TOP RIGHT CORNER: SUPPORT, WALLET, LOGIN/PROFILE & CART BUTTONS */}
          <div className="flex items-center gap-2.5 sm:gap-4 pl-1.5 sm:pl-2 border-l border-purple-100 shrink-0">
            
            {/* SUPPORT BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSupport) onOpenSupport();
              }}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform active:scale-95"
              title="Customer Support & FAQ"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-purple-200 flex items-center justify-center text-purple-700 bg-purple-50 group-hover:border-purple-700 group-hover:bg-purple-100 transition-colors">
                <Headphones className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </div>
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-extrabold text-[#1e1035] group-hover:text-purple-700 transition-colors mt-0.5 tracking-tight">
                Support
              </span>
            </button>

            {/* WALLET BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenWallet) onOpenWallet();
              }}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform active:scale-95"
              title="View User Wallet & Balance"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-purple-200 flex items-center justify-center text-purple-700 bg-purple-50 group-hover:border-purple-700 group-hover:bg-purple-100 transition-colors relative">
                <Wallet className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </div>
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-black text-purple-700 mt-0.5 tracking-tight font-mono">
                ₹{(walletBalance || 0).toLocaleString()}
              </span>
            </button>

            {/* USER PROFILE / LOGIN BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLogin) onOpenLogin();
              }}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform active:scale-95 max-w-[65px] sm:max-w-[80px]"
              title={isLoggedIn ? `Logged in as ${displayName}` : 'Login to Account'}
            >
              {avatarUrl ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-purple-600 shadow-xs">
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#1e1035] flex items-center justify-center text-[#1e1035] group-hover:border-purple-700 group-hover:text-purple-700 transition-colors">
                  <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
              )}
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-extrabold text-[#1e1035] group-hover:text-purple-700 transition-colors mt-0.5 tracking-tight truncate w-full text-center">
                {displayName}
              </span>
            </button>

            {/* CART BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenOrders) onOpenOrders();
              }}
              className="flex flex-col items-center justify-center relative group cursor-pointer transition-transform active:scale-95"
              title="View Cart & Orders"
            >
              <div className="relative">
                <ShoppingCart className="w-5.5 h-5.5 sm:w-7 sm:h-7 text-[#1e1035] stroke-[2.2] group-hover:text-purple-700 transition-colors" />
                {ordersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-purple-700 text-white font-['Satoshi'] font-black text-[8.5px] sm:text-[9px] flex items-center justify-center shadow-md animate-pulse">
                    {ordersCount}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-extrabold text-[#1e1035] group-hover:text-purple-700 transition-colors mt-0.5 tracking-tight">
                Cart
              </span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
