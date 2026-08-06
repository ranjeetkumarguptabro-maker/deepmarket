import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const RECENT_PURCHASES = [
  // Female Buyer Notifications (using img21.jpg, img22.jpg, img23.jpg)
  { name: "Ananya K.", city: "Bangalore", item: "Shadow Suite (₹16,640 CC Balance)", timeAgo: "4m ago", avatar: "/assets/avatars/img21.jpg" },
  { name: "Rahul M.", city: "Mumbai", item: "Shadow Suite (₹16,640 CC Balance)", timeAgo: "5m ago", avatar: "/assets/avatars/men1.jpg" },
  { name: "Priya P.", city: "Kolkata", item: "Alpha Suite (₹8,320 CC Balance)", timeAgo: "2m ago", avatar: "/assets/avatars/img22.jpg" },
  { name: "Vikram S.", city: "Delhi", item: "Alpha Suite (₹8,320 CC Balance)", timeAgo: "2m ago", avatar: "/assets/avatars/men2.jpg" },
  { name: "Neha R.", city: "Gurgaon", item: "Carding Course (₹400 RS)", timeAgo: "1m ago", avatar: "/assets/avatars/img23.jpg" },
  { name: "Siddharth V.", city: "Hyderabad", item: "Zenith Suite (₹66,560 CC Balance)", timeAgo: "1m ago", avatar: "/assets/avatars/men3.jpg" },
  { name: "Sneha M.", city: "Navi Mumbai", item: "Apex Suite (₹24,960 CC Balance)", timeAgo: "3m ago", avatar: "/assets/avatars/img21.jpg" },
  { name: "Karan J.", city: "Pune", item: "Beta Suite (₹12,480 CC Balance)", timeAgo: "6m ago", avatar: "/assets/avatars/men4.jpg" },
  { name: "Riya S.", city: "Thane", item: "Vajra Sovereign (₹58,240 CC Balance)", timeAgo: "5m ago", avatar: "/assets/avatars/img22.jpg" },
  { name: "Deepak R.", city: "Chennai", item: "Apex Suite (₹24,960 CC Balance)", timeAgo: "3m ago", avatar: "/assets/avatars/men5.jpg" },
  { name: "Kavya T.", city: "Kochi", item: "Shakti Elite (₹29,120 CC Balance)", timeAgo: "2m ago", avatar: "/assets/avatars/img23.jpg" },
  { name: "Aman G.", city: "Ahmedabad", item: "Shakti Elite (₹29,120 CC Balance)", timeAgo: "2m ago", avatar: "/assets/avatars/men6.jpg" },
  { name: "Aditya P.", city: "Surat", item: "Vajra Sovereign (₹58,240 CC Balance)", timeAgo: "4m ago", avatar: "/assets/avatars/men7.jpg" },
  { name: "Pooja V.", city: "Noida", item: "Prime Premium Suite (₹20,800 CC Balance)", timeAgo: "6m ago", avatar: "/assets/avatars/img21.jpg" },
  { name: "Nikhil T.", city: "Jaipur", item: "Vector Suite (₹37,440 CC Balance)", timeAgo: "7m ago", avatar: "/assets/avatars/men8.jpg" },
  { name: "Divya M.", city: "Coimbatore", item: "Carding Course (₹400 RS)", timeAgo: "2m ago", avatar: "/assets/avatars/img22.jpg" },
  { name: "Sameer N.", city: "Lucknow", item: "Prime Premium Suite (₹20,800 CC Balance)", timeAgo: "3m ago", avatar: "/assets/avatars/men9.jpg" },
  { name: "Tanvi G.", city: "Dehradun", item: "Spectre Suite (₹49,920 CC Balance)", timeAgo: "3m ago", avatar: "/assets/avatars/img23.jpg" },
  { name: "Varun G.", city: "Chandigarh", item: "Omega Sovereign (₹41,600 CC Balance)", timeAgo: "5m ago", avatar: "/assets/avatars/men10.jpg" }
];

export const LivePurchaseNotification = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setVisible(true);
      }, 2500);
    }, 8500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = RECENT_PURCHASES[currentIdx];

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-50 sm:max-w-sm w-auto animate-slide-up font-['Satoshi']">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/98 border border-purple-200 shadow-2xl backdrop-blur-xl flex items-start gap-3 text-[#1e1035] relative group">
        
        {/* Buyer Avatar Image (Men & Women Avatars) */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-purple-50 border border-purple-200 shadow-xs">
            <img 
              src={current.avatar} 
              alt={`${current.name} Verified Buyer`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[8.5px] sm:text-[9px] font-bold shadow-xs">
            ✓
          </span>
        </div>

        {/* Purchase Info */}
        <div className="flex-1 space-y-0.5 pr-4 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] sm:text-xs font-['Satoshi'] font-extrabold text-[#1e1035] flex items-center gap-1 truncate">
              {current.name} <span className="text-[9.5px] text-[#6e5a8e] font-normal truncate">({current.city})</span>
            </span>
            <span className="text-[9px] font-['Satoshi'] font-extrabold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full shrink-0 ml-1">
              {current.timeAgo}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-['Satoshi'] font-semibold text-purple-950 leading-snug truncate">
            Just bought <span className="text-purple-700 font-extrabold">{current.item}</span>
          </p>

          <p className="text-[9px] sm:text-[9.5px] font-['Satoshi'] text-emerald-700 font-bold flex items-center gap-1 pt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            Verified Order Dispatch
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 p-1 text-purple-400 hover:text-[#1e1035] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
