'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, Minus, Move } from 'lucide-react';

interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamCalculator({ isOpen, onClose }: ExamCalculatorProps) {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Safe arithmetic evaluator for basic non-scientific math
  const calculateResult = useCallback((expr: string): string => {
    try {
      // Replace visual operators with JS operators
      const sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Security check: only allow digits, operators, parentheses, decimals, percentages
      if (!/^[\d+\-*/. ()%]+$/.test(sanitized)) {
        return 'Error';
      }

      // Handle percentage
      const withPercents = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

      // Evaluate safely with Function constructor restricted to math expressions
      const result = new Function(`'use strict'; return (${withPercents})`)();

      if (typeof result !== 'number' || !isFinite(result)) {
        return 'Error';
      }

      // Format clean decimals
      const formatted = Number(Math.round(Number(result + 'e+8')) + 'e-8');
      return String(formatted);
    } catch {
      return 'Error';
    }
  }, []);

  // Handle number click
  const handleDigit = (digit: string) => {
    if (isNewNumber || displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(digit);
      setIsNewNumber(false);
    } else {
      if (displayValue.length < 14) {
        setDisplayValue(displayValue + digit);
      }
    }
  };

  // Handle decimal dot
  const handleDecimal = () => {
    if (isNewNumber || displayValue === 'Error') {
      setDisplayValue('0.');
      setIsNewNumber(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  // Handle operators (+, -, ×, ÷)
  const handleOperator = (op: string) => {
    if (displayValue === 'Error') return;

    if (expression && !isNewNumber) {
      const fullExpr = `${expression} ${displayValue}`;
      const intermediate = calculateResult(fullExpr);
      if (intermediate !== 'Error') {
        setExpression(`${intermediate} ${op}`);
        setDisplayValue(intermediate);
      } else {
        setExpression(`${displayValue} ${op}`);
      }
    } else {
      setExpression(`${displayValue} ${op}`);
    }
    setIsNewNumber(true);
  };

  // Handle equals (=)
  const handleEquals = () => {
    if (!expression || displayValue === 'Error') return;
    const fullExpr = `${expression} ${displayValue}`;
    const result = calculateResult(fullExpr);
    setExpression(fullExpr);
    setDisplayValue(result);
    setIsNewNumber(true);
  };

  // Clear / All Clear (AC)
  const handleAllClear = () => {
    setExpression('');
    setDisplayValue('0');
    setIsNewNumber(true);
  };

  // Backspace / Delete
  const handleDelete = () => {
    if (displayValue === 'Error' || isNewNumber) {
      setDisplayValue('0');
      setIsNewNumber(true);
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
      setIsNewNumber(true);
    }
  };

  // Sign toggle (±)
  const handleToggleSign = () => {
    if (displayValue === '0' || displayValue === 'Error') return;
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  };

  // Percentage (%)
  const handlePercentage = () => {
    if (displayValue === 'Error') return;
    const num = parseFloat(displayValue);
    if (!isNaN(num)) {
      const res = String(num / 100);
      setDisplayValue(res);
      setIsNewNumber(true);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if student is typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, displayValue, expression, isNewNumber]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed z-50 select-none top-20 right-6 md:top-24 md:right-10 pointer-events-auto touch-none"
      >
        {isMinimized ? (
          /* MINIMIZED FLOATING PILL */
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-card/95 dark:bg-[#181622]/95 backdrop-blur-md shadow-xl border border-border/80 cursor-pointer hover:scale-105 transition-all text-foreground"
          >
            <Calculator className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold">{displayValue}</span>
          </motion.div>
        ) : (
          /* FULL FLOATING CALCULATOR (Inspired by reference image) */
          <div className="w-[230px] sm:w-[250px] rounded-[30px] bg-[#EEF4FA]/95 dark:bg-[#141A22]/95 backdrop-blur-xl p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/60 dark:border-white/10 flex flex-col">
            {/* Window Drag Bar & Controls */}
            <div className="flex items-center justify-between pb-2 px-1 text-stone-400 dark:text-stone-500 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                <Move className="w-3 h-3" />
                <span>Calculator</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-stone-400 transition-colors cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-stone-400 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Display Area (Dual Expression & Result Line) */}
            <div className="w-full pt-2 pb-3 px-2 text-right">
              {/* Expression history line */}
              <div className="text-[11px] font-medium text-stone-400 dark:text-stone-500 tracking-tight min-h-[16px] truncate">
                {expression}
              </div>
              {/* Prominent result line */}
              <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight truncate">
                {expression && !isNewNumber ? `= ${displayValue}` : displayValue}
              </div>
            </div>

            {/* 4x5 Button Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {/* Row 1 */}
              <button
                type="button"
                onClick={handleAllClear}
                className="h-11 rounded-2xl bg-white/70 dark:bg-[#1E252E] hover:bg-white dark:hover:bg-[#28323E] text-stone-600 dark:text-stone-300 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                AC
              </button>
              <button
                type="button"
                onClick={handleToggleSign}
                className="h-11 rounded-2xl bg-white/70 dark:bg-[#1E252E] hover:bg-white dark:hover:bg-[#28323E] text-stone-600 dark:text-stone-300 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                ±
              </button>
              <button
                type="button"
                onClick={handlePercentage}
                className="h-11 rounded-2xl bg-white/70 dark:bg-[#1E252E] hover:bg-white dark:hover:bg-[#28323E] text-stone-600 dark:text-stone-300 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleOperator('÷')}
                className="h-11 rounded-2xl bg-[#BAE6FD]/80 dark:bg-[#0369A1]/40 hover:bg-[#A5F3FC] dark:hover:bg-[#0369A1]/60 text-sky-800 dark:text-sky-300 font-bold text-base shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                type="button"
                onClick={() => handleDigit('7')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleDigit('8')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleDigit('9')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                9
              </button>
              <button
                type="button"
                onClick={() => handleOperator('×')}
                className="h-11 rounded-2xl bg-[#BAE6FD]/80 dark:bg-[#0369A1]/40 hover:bg-[#A5F3FC] dark:hover:bg-[#0369A1]/60 text-sky-800 dark:text-sky-300 font-bold text-base shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                type="button"
                onClick={() => handleDigit('4')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleDigit('5')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleDigit('6')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                6
              </button>
              <button
                type="button"
                onClick={() => handleOperator('−')}
                className="h-11 rounded-2xl bg-[#BAE6FD]/80 dark:bg-[#0369A1]/40 hover:bg-[#A5F3FC] dark:hover:bg-[#0369A1]/60 text-sky-800 dark:text-sky-300 font-bold text-base shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                −
              </button>

              {/* Row 4 */}
              <button
                type="button"
                onClick={() => handleDigit('1')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleDigit('2')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleDigit('3')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => handleOperator('+')}
                className="h-11 rounded-2xl bg-[#BAE6FD]/80 dark:bg-[#0369A1]/40 hover:bg-[#A5F3FC] dark:hover:bg-[#0369A1]/60 text-sky-800 dark:text-sky-300 font-bold text-base shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDecimal}
                className="h-11 rounded-2xl bg-white dark:bg-[#232B35] hover:bg-stone-50 dark:hover:bg-[#2D3744] text-[#1E293B] dark:text-white font-bold text-base shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                .
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-11 rounded-2xl bg-white/80 dark:bg-[#1E252E] hover:bg-white dark:hover:bg-[#28323E] text-stone-600 dark:text-stone-300 font-semibold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Delete"
              >
                DEL
              </button>
              <button
                type="button"
                onClick={handleEquals}
                className="h-11 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-base shadow-md active:scale-95 transition-all cursor-pointer"
              >
                =
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
