import React from 'react';
import { ShoppingCart, User, BookOpen, Layers, Headphones, Wallet, Shield } from 'lucide-react';

export const Header = ({ 
  currentView, 
  onNavigate, 
  ordersCount, 
  userProfile, 
  walletBalance = 0, 
  onOpenOrders, 
  onOpenLogin, 
  onOpenProfile, 
  onOpenWallet, 
  onOpenSupport,
  onOpenAdmin
}) => {
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
            type="button"
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

        {/* Top Right Corner Actions: Admin, Support, Profile & Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-['Satoshi']">
          
          <div className="flex items-center gap-2.5 sm:gap-3.5 pl-1.5 sm:pl-2 border-l border-purple-100 shrink-0">
            
            {/* ADMIN PANEL BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenAdmin) onOpenAdmin();
              }}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform active:scale-95"
              title="Store Admin Verification Panel"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-amber-300 flex items-center justify-center text-amber-800 bg-amber-50 group-hover:border-amber-600 group-hover:bg-amber-100 transition-colors">
                <Shield className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </div>
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-black text-amber-900 group-hover:text-amber-700 transition-colors mt-0.5 tracking-tight">
                Admin
              </span>
            </button>

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

            {/* USER PROFILE ICON BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof onOpenProfile === 'function') {
                  onOpenProfile();
                } else if (typeof onOpenLogin === 'function') {
                  onOpenLogin();
                }
              }}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform active:scale-95 relative z-50"
              title="My Profile & Settings"
            >
              {isLoggedIn ? (
                avatarUrl ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-purple-600 shadow-xs pointer-events-none">
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#1e1035] flex items-center justify-center text-[#1e1035] group-hover:border-purple-700 group-hover:text-purple-700 transition-colors pointer-events-none">
                    <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2] pointer-events-none" />
                  </div>
                )
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-purple-300 flex items-center justify-center text-purple-800 bg-purple-100 group-hover:border-purple-700 group-hover:bg-purple-200 transition-colors pointer-events-none">
                  <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2] pointer-events-none" />
                </div>
              )}
              <span className="text-[10.5px] sm:text-xs font-['Satoshi'] font-extrabold text-[#1e1035] group-hover:text-purple-700 transition-colors mt-0.5 tracking-tight pointer-events-none">
                {isLoggedIn ? displayName : 'Sign In'}
              </span>
            </button>

            {/* CART / ORDERS BUTTON */}
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
