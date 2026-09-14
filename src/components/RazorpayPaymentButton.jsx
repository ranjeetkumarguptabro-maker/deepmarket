import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';

export const RazorpayPaymentButton = ({ buttonId = "pl_TMuuLdBd4SwDJW" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous form elements to prevent duplicate button mounts
    containerRef.current.innerHTML = '';

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', buttonId);
    script.async = true;

    form.appendChild(script);
    containerRef.current.appendChild(form);
  }, [buttonId]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-950 to-purple-950 rounded-2xl border border-emerald-500/40 my-2 shadow-md text-center font-['Satoshi']">
      <div className="flex items-center justify-center gap-1.5 mb-2 text-emerald-300">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-extrabold uppercase tracking-wider">
          SECURE PAYMENT PROTECTED
        </span>
      </div>

      <div ref={containerRef} className="min-h-[48px] flex items-center justify-center w-full" />
    </div>
  );
};
