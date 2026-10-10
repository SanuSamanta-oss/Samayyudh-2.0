'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OmnitrixLoader({ 
  text = 'LOADING...', 
  finished = false,
  logoUrl
}: { 
  text?: string;
  finished?: boolean;
  logoUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.div 
        className="relative flex items-center justify-center w-[240px] h-[240px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Radial Rays (Finished State) */}
        <AnimatePresence>
          {finished && (
            <motion.div 
              className="absolute inset-[-100px] rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 90 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background: 'conic-gradient(from 0deg, rgba(204,255,0,0) 0%, rgba(204,255,0,0.3) 10%, rgba(204,255,0,0) 20%, rgba(204,255,0,0.3) 30%, rgba(204,255,0,0) 40%, rgba(204,255,0,0.3) 50%, rgba(204,255,0,0) 60%, rgba(204,255,0,0.3) 70%, rgba(204,255,0,0) 80%, rgba(204,255,0,0.3) 90%, rgba(204,255,0,0) 100%)'
              }}
            />
          )}
        </AnimatePresence>

        {/* The Omnitrix SVG Dial */}
        <motion.svg 
          viewBox="0 0 200 200" 
          className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          animate={{
            rotate: finished ? 0 : 360,
          }}
          transition={{
            rotate: finished ? { duration: 0.5, type: "spring" } : { repeat: Infinity, duration: 4, ease: "linear" }
          }}
        >
          {/* Base Rings */}
          <circle cx="100" cy="100" r="95" fill="#111" />
          <circle cx="100" cy="100" r="90" fill="#222" stroke="#000" strokeWidth="4" />
          <circle cx="100" cy="100" r="75" fill="#333" stroke="#111" strokeWidth="2" />
          
          {/* 4 Knobs around the outer ring */}
          <g>
            {/* Top */}
            <circle cx="100" cy="10" r="12" fill="#222" stroke="#000" strokeWidth="3" />
            <circle cx="100" cy="10" r="7" fill="#ccff00" filter={finished ? "drop-shadow(0 0 8px #ccff00)" : ""} />
            <circle cx="100" cy="10" r="4" fill="#e6ff80" />
            {/* Bottom */}
            <circle cx="100" cy="190" r="12" fill="#222" stroke="#000" strokeWidth="3" />
            <circle cx="100" cy="190" r="7" fill="#ccff00" filter={finished ? "drop-shadow(0 0 8px #ccff00)" : ""} />
            <circle cx="100" cy="190" r="4" fill="#e6ff80" />
            {/* Left */}
            <circle cx="10" cy="100" r="12" fill="#222" stroke="#000" strokeWidth="3" />
            <circle cx="10" cy="100" r="7" fill="#ccff00" filter={finished ? "drop-shadow(0 0 8px #ccff00)" : ""} />
            <circle cx="10" cy="100" r="4" fill="#e6ff80" />
            {/* Right */}
            <circle cx="190" cy="100" r="12" fill="#222" stroke="#000" strokeWidth="3" />
            <circle cx="190" cy="100" r="7" fill="#ccff00" filter={finished ? "drop-shadow(0 0 8px #ccff00)" : ""} />
            <circle cx="190" cy="100" r="4" fill="#e6ff80" />
          </g>

          {/* Inner Bezel */}
          <circle cx="100" cy="100" r="68" fill="#111" stroke="#444" strokeWidth="4" />

          {/* State: Loading (Hourglass/Triangles) */}
          {!finished && (
            <g>
              <defs>
                <clipPath id="omnitrixCore">
                  <circle cx="100" cy="100" r="64" />
                </clipPath>
              </defs>
              <g clipPath="url(#omnitrixCore)">
                <rect x="0" y="0" width="200" height="200" fill="#ccff00" />
                
                {/* Glossy diagonal reflections */}
                <polygon points="50,-20 120,-20 80,220 10,220" fill="rgba(255,255,255,0.4)" />
                <polygon points="140,-20 180,-20 140,220 100,220" fill="rgba(255,255,255,0.2)" />

                {/* Left Black Wedge */}
                <polygon points="100,100 -20,30 -20,170" fill="#222" stroke="#444" strokeWidth="8" strokeLinejoin="bevel" />
                
                {/* Right Black Wedge */}
                <polygon points="100,100 220,30 220,170" fill="#222" stroke="#444" strokeWidth="8" strokeLinejoin="bevel" />
              </g>
              {/* Thin inner border */}
              <circle cx="100" cy="100" r="64" fill="none" stroke="#111" strokeWidth="6" />
            </g>
          )}

          {/* State: Finished (Open Diamond & Alien) */}
          {finished && (
            <g>
              <circle cx="100" cy="100" r="64" fill="#111" />
              {/* Diamond Base */}
              <polygon points="100,30 170,100 100,170 30,100" fill="#ccff00" stroke="#88b300" strokeWidth="4" strokeLinejoin="round" />
              {/* Diamond Glow / Gloss */}
              <polygon points="100,30 140,70 100,150 50,100" fill="rgba(255,255,255,0.15)" />
              
              {/* Cat with laptop (Default if no logo) */}
              {!logoUrl && (
                <image
                  href="/cat_cropped.png"
                  x="55"
                  y="55"
                  width="90"
                  height="90"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
                />
              )}
            </g>
          )}
        </motion.svg>
        
        {/* Logo Overlay */}
        {finished && logoUrl && (
          <motion.div
            className="absolute z-20 flex items-center justify-center w-[80px] h-[80px] rounded-full overflow-hidden bg-black shadow-[0_0_20px_rgba(204,255,0,0.5)] border-2 border-[#ccff00]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.1, duration: 0.5 }}
          >
            {/* Using standard img for simplicity in animation and SVGs without next/image wrapper issues */}
            <img src={logoUrl} alt="Exam Logo" className="w-full h-full object-contain p-2" />
          </motion.div>
        )}
      </motion.div>

      {/* Loading Bar */}
      <div className="w-64 h-2 bg-zinc-900 rounded-full mt-16 overflow-hidden relative border border-zinc-800">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#ccff00] rounded-full shadow-[0_0_10px_#ccff00]"
          initial={{ width: "0%" }}
          animate={{ width: finished ? "100%" : "85%" }}
          transition={{ duration: finished ? 0.3 : 3, ease: "easeOut" }}
        />
      </div>

      <motion.p 
        className="text-[#ccff00] text-sm font-bold tracking-[0.3em] mt-6"
        animate={{ opacity: finished ? 1 : [0.5, 1, 0.5] }}
        transition={{ repeat: finished ? 0 : Infinity, duration: 1.5 }}
        style={{ textShadow: '0 0 10px rgba(204,255,0,0.5)' }}
      >
        {finished ? 'UNLOCKED' : text}
      </motion.p>
    </div>
  );
}
