import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Mail, ChevronDown, ChevronUp, Send, CheckCircle2, Headphones, ShieldCheck, Zap } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    category: "Delivery & Clearance",
    question: "How quickly will I receive my Virtual Credit Card?",
    answer: "Cards are dispatched instantly via automated clearance protocols within 1 to 2 minutes of payment confirmation. Your card number, CVV, and expiry details will appear directly in your Orders portal."
  },
  {
    id: 2,
    category: "Payments",
    question: "Which payment methods are supported?",
    answer: "We support direct cryptocurrency payments exclusively: Bitcoin (BTC) and Litecoin (LTC) with zero third-party processing fees. Simply submit your payment Transaction ID (TXID) and screenshot for admin verification."
  },
  {
    id: 3,
    category: "Guarantees & Refunds",
    question: "What is the 100% Balance & Refund Guarantee?",
    answer: "Every card suite is pre-calibrated with guaranteed balance ledger integrity. If your card experiences any clearance delay, our automated protocol initiates a 100% money-back refund within 2 minutes."
  },
  {
    id: 4,
    category: "Privacy & Security",
    question: "Is my personal transaction data kept private?",
    answer: "Yes. DeepMarket operates under strict zero-knowledge encryption architecture. Your data is strictly confidential and is never transferred, sold, or disclosed to any third-party entities."
  },
  {
    id: 5,
    category: "Training & Setup",
    question: "I am a beginner. How do I start using virtual cards?",
    answer: "We recommend enrolling in our Carding Masterclass for ₹400. It provides step-by-step guidance on virtual card setup, routing protocols, and ledger management from scratch."
  }
];

export const SupportModal = ({ isOpen, onClose }) => {
  const [openFaqId, setOpenFaqId] = useState(1);
  const [userQuery, setUserQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(false);

  if (!isOpen) return null;

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleCustomQuerySubmit = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setSubmittedQuery(true);
    setTimeout(() => {
      setUserQuery('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 font-['Satoshi'] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 p-2 flex items-center justify-center text-purple-700 shadow-xs">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">Customer Support Center</h3>
              <p className="text-xs text-[#6e5a8e] font-medium">Instant FAQ Answers &amp; 24/7 VIP Helpdesk</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* Scrollable Support Body */}
        <div className="overflow-y-auto space-y-6 pr-1 flex-1">
          
          {/* Top Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold p-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-950">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-purple-700" />
              <span>Instant Answers</span>
            </div>
            <div className="flex items-center justify-center gap-1 border-x border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>24/7 Resolution</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span>Direct Email</span>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#6e5a8e] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-700" />
              Frequently Asked Questions
            </h4>

            <div className="space-y-2.5">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className={`rounded-2xl border transition-all duration-200 ${
                      isOpen 
                        ? 'border-purple-300 bg-purple-50/60 shadow-xs' 
                        : 'border-purple-100 bg-white hover:border-purple-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-extrabold text-[#1e1035] leading-snug">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6e5a8e] shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#524170] leading-relaxed font-medium border-t border-purple-100/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* UNSATISFIED / STILL NEED HELP? DIRECT EMAIL ESCALATION SECTION */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1e1035] via-purple-950 to-indigo-950 text-white space-y-3.5 shadow-lg relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white">Still haven't found your answer?</h4>
                <p className="text-xs text-purple-200 leading-relaxed font-medium">
                  If your question isn't answered above or you need custom order assistance, our VIP support team is available 24/7.
                </p>
              </div>
            </div>

            {submittedQuery ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Message Received! We will reply to your registered email shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleCustomQuerySubmit} className="space-y-2.5 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type your question here..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="flex-1 h-10 px-3.5 bg-white/10 border border-purple-400/30 rounded-xl text-xs text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-300 font-medium"
                  />
                  <button
                    type="submit"
                    className="glass-btn px-4 h-10 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Direct Official Mail Contact Fallback */}
            <div className="pt-2 border-t border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-purple-300 font-medium">Direct Email Contact:</span>
              <a 
                href="mailto:deepmarketofficialchat@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-colors border border-white/20"
              >
                <Mail className="w-3.5 h-3.5 text-purple-300" />
                <span>deepmarketofficialchat@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
