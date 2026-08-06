import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export const OrdersModal = ({ isOpen, onClose, transactions, onClearOrders, onProceedPayment, onShowToast }) => {
  if (!isOpen) return null;

  // Calculate Total Cart Price
  const totalCartValue = transactions.reduce((acc, tx) => acc + (typeof tx.priceInr === 'number' ? tx.priceInr : (parseInt(tx.priceInr) || 0)), 0);

  const handleProceedOrder = (tx) => {
    if (onProceedPayment) {
      onProceedPayment(tx);
    }
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
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">Your Cart &amp; Orders</h3>
              <p className="text-xs text-[#6e5a8e] font-medium">DeepMarket Encrypted Order Ledger</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {transactions.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all items in cart?")) {
                    onClearOrders();
                  }
                }}
                className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition-colors"
                title="Clear all cart items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
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

          {/* LIST OF CART ITEMS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-base font-extrabold font-['Satoshi'] text-[#1e1035]">
                Cart Items &amp; Orders
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
                {transactions.map((tx) => {
                  const itemName = tx.suiteName || tx.tierName || tx.name || 'Virtual Card Suite';
                  const itemPrice = typeof tx.priceInr === 'number' ? `₹${tx.priceInr.toLocaleString()}` : tx.priceInr;
                  const itemBrand = (tx.brand || 'VISA').toUpperCase();
                  const orderId = tx.id || tx.orderNumber || 'DM-1001';

                  return (
                    <div
                      key={tx.id || Math.random()}
                      className="bg-white border border-purple-100 hover:border-purple-200 rounded-3xl p-5 space-y-4 shadow-sm transition-all"
                    >
                      {/* Status Bar */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Order ({orderId})
                        </span>
                        <span className="text-[#6e5a8e] text-xs font-medium">{tx.date || tx.timestamp || 'Just Now'}</span>
                      </div>

                      {/* Order Content */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        
                        {/* Mini Card Badge */}
                        <div className="sm:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#1e1035] text-white shadow-md space-y-2 border border-purple-400/30">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-purple-200">
                            <span>{itemBrand}</span>
                            <span className="bg-purple-500/30 px-2 py-0.5 rounded border border-purple-400/40 text-white">READY</span>
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

                          <div className="flex justify-between items-center text-xs pt-1 border-t border-purple-50">
                            <span className="text-[#6e5a8e] font-medium">Order ID: <strong className="font-mono text-[#1e1035]">{orderId}</strong></span>
                            
                            {/* ORDER PROCEED BUTTON */}
                            <button
                              onClick={() => handleProceedOrder(tx)}
                              className="glass-btn px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-sm"
                            >
                              <span>Proceed Order</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
