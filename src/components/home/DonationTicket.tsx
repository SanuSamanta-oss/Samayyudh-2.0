'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

type PaymentState = 'idle' | 'selecting' | 'receipt';

export function DonationTicket() {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [amount, setAmount] = useState<string>('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await initializeRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsLoading(false);
        return;
      }

      // Create an order via our backend API
      const data = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      }).then((t) => t.json());

      if (!data || !data.id) {
        alert("Server error. Please try again.");
        setIsLoading(false);
        return;
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tlix2vclEDoazj",
        amount: data.amount,
        currency: data.currency,
        name: "SamayYudh",
        description: "Donation for Improvements",
        order_id: data.id,
        handler: function (response: any) {
          // Payment Successful
          setPaymentState('receipt');
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment failed or cancelled!");
      });
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      // Temporarily remove animation styles that might interfere
      const el = receiptRef.current;
      const originalTransform = el.style.transform;
      el.style.transform = 'none';

      // Use html-to-image to bypass the lab() color error in html2canvas
      const imgData = await htmlToImage.toPng(el, { 
        backgroundColor: '#f8f9fa',
        pixelRatio: 2
      });
      
      el.style.transform = originalTransform;

      // Get dimensions of the element to scale PDF correctly
      const rect = el.getBoundingClientRect();

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [rect.width, rect.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, rect.width, rect.height);
      pdf.save(`SamayYudh_Receipt_${amount}INR.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16 md:py-20 text-center flex flex-col items-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">Support Our Work</h3>
        <p className="text-muted mt-2">Help us keep SamayYudh running and free for students.</p>
      </div>

      <div 
        className="relative inline-block w-full max-w-[600px] mx-auto cursor-pointer group" 
        onClick={() => setPaymentState('selecting')}
      >
        {/* Custom CSS Ticket Component */}
        <div 
          className="relative w-full max-w-[850px] mx-auto flex transition-transform hover:scale-[1.02] duration-300 ease-out cursor-pointer group drop-shadow-2xl"
        >
          {/* LEFT PART */}
          <div className="relative flex-1 flex flex-col items-center py-8 sm:py-10 px-6 sm:px-10 overflow-hidden"
               style={{ 
                 background: '#e8e4db',
                 borderTopLeftRadius: '16px',
                 borderBottomLeftRadius: '16px'
               }}
          >
            {/* Left notch */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--background,#0a0a0a)]"></div>

            {/* Top labels */}
            <div className="w-full flex justify-center items-center gap-3 sm:gap-6 text-[8px] sm:text-xs text-[#233a54]/70 font-bold tracking-widest uppercase mb-4 sm:mb-6">
              <span>Student First</span>
              <span className="flex-1 max-w-[60px] h-[1px] bg-[#233a54]/30"></span>
              <span>Free Forever</span>
              <span className="flex-1 max-w-[60px] h-[1px] bg-[#233a54]/30"></span>
              <span>Expert Verified</span>
            </div>
            
            {/* Main title block */}
            <div className="flex flex-col items-center my-auto">
              <span className="font-serif italic text-xl sm:text-3xl lg:text-4xl text-[#233a54] self-start">Your</span>
              <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black text-[#233a54] tracking-tight leading-none my-1">TICKET</h2>
              <span className="font-serif italic text-base sm:text-xl lg:text-2xl text-[#233a54] self-end">to ace your exams</span>
            </div>
            
            {/* Bottom description */}
            <p className="text-center text-[9px] sm:text-xs text-[#233a54]/70 max-w-[90%] mt-4 sm:mt-6 font-medium leading-relaxed">
              Whether you&apos;re practicing for competitive exams or discovering new concepts, we ensure a smooth experience.
            </p>
          </div>

          {/* DASHED DIVIDER with notches */}
          <div className="relative w-0 flex items-center z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--background,#0a0a0a)]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--background,#0a0a0a)]"></div>
            <div className="w-[3px] h-full border-l-[3px] border-dashed border-[#233a54]/25"></div>
          </div>

          {/* RIGHT STUB */}
          <div className="relative w-20 sm:w-28 lg:w-36 flex items-center justify-center overflow-hidden"
               style={{ 
                 background: '#e8e4db',
                 borderTopRightRadius: '16px',
                 borderBottomRightRadius: '16px'
               }}
          >
            {/* Right notch */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--background,#0a0a0a)]"></div>

            <div className="rotate-90 whitespace-nowrap text-[#233a54] tracking-widest text-center flex flex-col items-center">
              <span className="text-[7px] sm:text-[10px] font-bold tracking-[0.3em] uppercase mb-1">SUPPORTING</span>
              <span className="text-sm sm:text-xl lg:text-2xl font-black tracking-[0.1em] uppercase">SAMAYYUDH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modals */}
      <AnimatePresence>
        {paymentState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#f8f9fa] dark:bg-zinc-950 overflow-y-auto"
          >
            {/* Header with Close Button */}
            <div className="sticky top-0 p-4 md:p-6 flex items-center justify-between bg-[#f8f9fa] dark:bg-zinc-950 z-10">
               <button 
                 onClick={() => setPaymentState('idle')}
                 className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full transition-colors"
               >
                 <X className="w-6 h-6 md:w-8 md:h-8 text-zinc-600 dark:text-zinc-400" />
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 pb-20">
              
              {/* Payment Selection State */}
              {paymentState === 'selecting' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center pt-4 md:pt-8 w-full max-w-md mx-auto"
                >

                  {/* Animated Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Secure Payment
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white">
                      Support SamayYudh
                    </h2>
                    <p className="text-sm text-zinc-500 mt-2">Every contribution helps keep this platform free.</p>
                  </motion.div>

                  {/* Amount Input — Centered Ring Design */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    className="relative w-56 h-56 md:w-64 md:h-64 mb-8 flex items-center justify-center mx-auto"
                  >
                    {/* Outer animated ring */}
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `conic-gradient(from 0deg, #f59e0b, #d97706, #b45309, #f59e0b)`,
                      animation: 'spinSlow 6s linear infinite',
                      opacity: amount && Number(amount) > 0 ? 1 : 0.3,
                      transition: 'opacity 0.5s'
                    }}></div>

                    {/* Inner background */}
                    <div className="absolute inset-[4px] rounded-full bg-[#f8f9fa] dark:bg-zinc-950"></div>

                    {/* Second ring glow */}
                    <div className="absolute inset-[8px] rounded-full border-2 border-amber-500/20"></div>

                    {/* Orbiting particle */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-[-6px]"
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                    </motion.div>

                    {/* Center content */}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-600 dark:text-amber-400 mb-1">Amount</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-amber-500/60">₹</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-white bg-transparent border-0 border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent ring-0 w-28 md:w-32 text-center placeholder:text-zinc-300 dark:placeholder:text-zinc-700 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0 leading-none"
                          autoFocus
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 mt-1">.00 INR</span>
                    </div>
                  </motion.div>

                  {/* Preset Amount Chips */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap justify-center gap-2.5 mb-8"
                  >
                    {[49, 99, 199, 499, 999].map((preset, i) => (
                      <motion.button 
                        key={preset}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                        onClick={() => setAmount(String(preset))}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                          amount === String(preset)
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-110'
                            : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:scale-105'
                        }`}
                      >
                        ₹{preset}
                      </motion.button>
                    ))}
                  </motion.div>
                  
                  {/* Donate Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full"
                  >
                    <button 
                      onClick={handlePayment}
                      disabled={isLoading || !amount || Number(amount) <= 0}
                      className="relative w-full py-4 md:py-5 rounded-2xl text-white font-bold text-lg md:text-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none group"
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)' }}
                    >
                      {/* Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                      {/* Glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(245,158,11,0.4)]"></div>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                            Processing...
                          </>
                        ) : (
                          <>Donate {amount && Number(amount) > 0 ? `₹${amount}` : ''} Securely</>
                        )}
                      </span>
                    </button>
                  </motion.div>

                  {/* Trust badges */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-4 mt-6 text-zinc-400 dark:text-zinc-600"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Encrypted
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Razorpay
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      UPI &amp; Cards
                    </div>
                  </motion.div>

                  <style jsx>{`
                    @keyframes spinSlow {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                  
                </motion.div>
              )}

              {/* Receipt State */}
              {paymentState === 'receipt' && (
                <div className="w-full min-h-[80vh] flex flex-col items-center justify-center relative py-12">
                  
                  {/* Confetti particles */}
                  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const colors = ['#41b8c4', '#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#8b5cf6', '#f97316'];
                      const color = colors[i % colors.length];
                      const left = Math.random() * 100;
                      const delay = Math.random() * 1.5;
                      const duration = 2 + Math.random() * 2;
                      const size = 6 + Math.random() * 8;
                      const isCircle = Math.random() > 0.5;
                      return (
                        <motion.div
                          key={i}
                          initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0, scale: 1 }}
                          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: Math.random() * 720 - 360, scale: [1, 0.8] }}
                          transition={{ duration, delay, ease: 'linear' }}
                          className="absolute top-0"
                          style={{
                            width: isCircle ? size : size * 0.6,
                            height: isCircle ? size : size * 1.5,
                            backgroundColor: color,
                            borderRadius: isCircle ? '50%' : '2px',
                            left: `${left}%`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Receipt Card */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.3 }}
                    className="flex flex-col items-center w-full max-w-sm"
                  >
                    <div 
                      ref={receiptRef}
                      className="relative w-full bg-white text-zinc-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
                    >
                      {/* Top notch cutouts */}
                      <div className="absolute top-[52%] -left-4 w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-zinc-950"></div>
                      <div className="absolute top-[52%] -right-4 w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-zinc-950"></div>

                      {/* Top Section — Thank You */}
                      <div className="pt-10 pb-8 px-8 text-center">
                        {/* Party Popper */}
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.6 }}
                          className="text-5xl mb-4"
                        >
                          🎉
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="text-2xl font-black text-zinc-900 mb-2"
                        >
                          Thank you
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="text-sm text-zinc-500 leading-relaxed"
                        >
                          Your payment has been processed<br />successfully.
                        </motion.p>
                      </div>

                      {/* Dashed separator */}
                      <div className="mx-6 border-t-[3px] border-dashed border-zinc-200"></div>

                      {/* Bottom Section — Details */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="px-8 pt-6 pb-8"
                      >
                        {/* Ticket ID & Amount */}
                        <div className="flex justify-between mb-5">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ticket ID</span>
                            <p className="text-sm font-bold text-zinc-800 mt-0.5 font-mono">{Date.now().toString().slice(0, 13)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</span>
                            <p className="text-sm font-bold text-zinc-800 mt-0.5">₹{Number(amount).toLocaleString('en-IN')}.00</p>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="mb-5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date &amp; Time</span>
                          <p className="text-sm font-bold text-zinc-800 mt-0.5">
                            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} | {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </p>
                        </div>

                        {/* Payment Method Badge */}
                        <div className="flex items-center gap-3 bg-zinc-50 rounded-2xl px-4 py-3 mb-6">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#41b8c4] to-[#2d9ea9] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-black">₹</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-800">UPI Payment</p>
                            <p className="text-xs text-zinc-400">Processed via Razorpay</p>
                          </div>
                        </div>

                        {/* Barcode */}
                        <div className="flex flex-col items-center">
                          <div className="w-full h-16 flex justify-center items-end gap-[1px] px-4">
                            {Array.from({ length: 50 }).map((_, i) => {
                              const seed = (i * 7 + 13) % 17;
                              return (
                                <div key={i} className="bg-zinc-900" style={{
                                  width: `${(seed % 3) + 1.5}px`,
                                  height: seed > 12 ? '100%' : '80%'
                                }}></div>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-zinc-400 font-mono tracking-[0.2em] mt-1.5">
                            {Date.now().toString().slice(0, 13).split('').join('')}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Download Button */}
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 }}
                      onClick={handleDownloadPDF}
                      className="mt-8 flex items-center gap-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Download className="w-5 h-5" /> Download Receipt
                    </motion.button>

                    {/* Done button */}
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      onClick={() => { setPaymentState('idle'); setAmount(''); }}
                      className="mt-3 text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors py-2"
                    >
                      Done
                    </motion.button>
                  </motion.div>

                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
