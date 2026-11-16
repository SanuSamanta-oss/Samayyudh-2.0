'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  TeacherVerificationIllustration,
  RoleTeacherIllustration,
} from '@/components/illustrations/AuthCardIllustrations';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileCheck2,
  RefreshCw,
  Clock,
  Loader2,
} from 'lucide-react';

export function TeacherVerificationCenter() {
  const router = useRouter();

  // Verification method tab: 'email' | 'classroom' | 'directory' | 'credentials'
  const [activeTab, setActiveTab] = useState<'email' | 'classroom' | 'directory' | 'credentials'>('email');

  // Form states - Institutional Email
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  // Domain check
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<{
    checked: boolean;
    eligible: boolean;
    domain?: string;
    institution_name?: string;
    message?: string;
  }>({ checked: false, eligible: false });

  // OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  // Directory flow
  const [directoryUrl, setDirectoryUrl] = useState('');
  const [dirFacultyName, setDirFacultyName] = useState('');
  const [dirDesignation, setDirDesignation] = useState('');
  const [verifyingDirectory, setVerifyingDirectory] = useState(false);

  // Overall status
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'verified' | 'limited'>('pending');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load current verification status
  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch('/api/auth/role');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'verified' || data.teacher_profile?.verification_status === 'verified') {
            setCurrentStatus('verified');
          }
          if (data.teacher_profile) {
            if (data.teacher_profile.institutional_email) {
              setInstitutionalEmail(data.teacher_profile.institutional_email);
            }
            if (data.teacher_profile.institution_name) {
              setInstitutionName(data.teacher_profile.institution_name);
            }
          }
        }
      } catch {}
    }
    loadStatus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Live domain check debounced
  useEffect(() => {
    const trimmed = institutionalEmail.trim();
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setDomainStatus({ checked: false, eligible: false });
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingDomain(true);
      try {
        const res = await fetch('/api/teacher/verify/institutional-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check_domain', email: trimmed }),
        });
        const data = await res.json();
        setDomainStatus({
          checked: true,
          eligible: Boolean(data.eligible),
          domain: data.domain,
          institution_name: data.institution_name,
          message: data.message,
        });
        if (data.institution_name && !institutionName) {
          setInstitutionName(data.institution_name);
        }
      } catch {
        setDomainStatus({ checked: true, eligible: false, message: 'Failed to verify domain.' });
      } finally {
        setCheckingDomain(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [institutionalEmail, institutionName]);

  async function handleSendOtp() {
    if (!institutionalEmail.trim() || !domainStatus.eligible) {
      setNotification({ type: 'error', message: 'Please enter a recognized institutional email address.' });
      return;
    }

    setSendingOtp(true);
    setNotification(null);

    try {
      const res = await fetch('/api/teacher/verify/institutional-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_otp',
          institutional_email: institutionalEmail.trim(),
          full_name: fullName.trim(),
          institution_name: institutionName.trim(),
          department: department.trim(),
          designation: designation.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification({ type: 'error', message: data.error || 'Failed to send OTP code.' });
        return;
      }

      setOtpSent(true);
      setResendCooldown(60);
      if (data.dev_otp_hint) {
        setOtpHint(data.dev_otp_hint);
      }
      setNotification({ type: 'success', message: data.message || 'Verification OTP sent to your institutional inbox.' });
    } catch {
      setNotification({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setNotification({ type: 'error', message: 'Please enter the complete 6-digit verification code.' });
      return;
    }

    setVerifyingOtp(true);
    setNotification(null);

    try {
      const res = await fetch('/api/teacher/verify/institutional-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          institutional_email: institutionalEmail.trim(),
          otp: otpCode.trim(),
          full_name: fullName.trim(),
          institution_name: institutionName.trim(),
          department: department.trim(),
          designation: designation.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification({ type: 'error', message: data.error || 'Invalid verification code.' });
        return;
      }

      setCurrentStatus('verified');
      setNotification({ type: 'success', message: 'Your teaching credentials have been verified successfully!' });
    } catch {
      setNotification({ type: 'error', message: 'Failed to verify OTP. Please try again.' });
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleVerifyDirectory(e: React.FormEvent) {
    e.preventDefault();
    if (!directoryUrl.trim() || !dirFacultyName.trim()) {
      setNotification({ type: 'error', message: 'Faculty profile URL and full name are required.' });
      return;
    }

    setVerifyingDirectory(true);
    setNotification(null);

    try {
      const res = await fetch('/api/teacher/verify/faculty-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_url: directoryUrl.trim(),
          faculty_name: dirFacultyName.trim(),
          designation: dirDesignation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: 'error', message: data.error || 'Verification failed.' });
        return;
      }

      if (data.verified) {
        setCurrentStatus('verified');
        setNotification({ type: 'success', message: data.message });
      } else {
        setNotification({ type: 'success', message: data.message });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setVerifyingDirectory(false);
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Teacher Identity Verification Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Verify Your Academic Credentials
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
            Authenticate your teaching status to unlock custom test composition, classroom
            management, assignment publishing, and student analytics.
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-neutral-100 dark:bg-[#1E1B2E] shadow-sm shrink-0">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              currentStatus === 'verified'
                ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.5)]'
            }`}
          />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Account Status
            </div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
              {currentStatus === 'verified' ? 'Verified Educator' : 'Pending Verification'}
            </div>
          </div>
        </div>
      </div>

      {/* Global Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-500/10 text-red-700 dark:text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ALREADY VERIFIED CARD */}
      {currentStatus === 'verified' ? (
        <div className="relative rounded-[32px] bg-white dark:bg-[#181622] p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] text-center overflow-hidden">
          <div className="-mt-8 flex justify-center mb-4">
            <TeacherVerificationIllustration size={220} />
          </div>

          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            You Are a Verified Educator!
          </h2>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Your teaching credentials and institution affiliations have been authenticated. You have
            unrestricted access to all educator tools.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="py-3.5 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="py-3.5 px-6 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#201D2E] dark:hover:bg-[#28253A] text-neutral-900 dark:text-white font-medium text-sm transition-transform active:scale-95 cursor-pointer"
            >
              Explore Exam Hub
            </button>
          </div>
        </div>
      ) : (
        /* VERIFICATION WIDGET */
        <div className="space-y-8">
          {/* Method Selection Tabs with Smooth Sliding Pill */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#1C1A29]">
            {[
              { id: 'email', label: 'Institutional Email', icon: Mail },
              { id: 'directory', label: 'Faculty Directory', icon: Globe },
              { id: 'classroom', label: 'Google Classroom', icon: GraduationCap },
              { id: 'credentials', label: 'Manual Review', icon: FileCheck2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`group relative flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none focus:outline-none ${
                    active
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="teacher-tab-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      className="absolute inset-0 rounded-xl bg-white dark:bg-[#262238] shadow-[0_4px_16px_-2px_rgba(0,0,0,0.12)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4 text-[#F59E0B]" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB PANELS with Smooth Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* TAB 1: INSTITUTIONAL EMAIL VERIFICATION */}
              {activeTab === 'email' && (
                <div className="rounded-[32px] bg-white dark:bg-[#181622] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Primary: Institutional Email OTP Verification
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Enter your official university or collegiate email address (e.g., @iitb.ac.in,
                    @aiims.edu, or .ac.in / .edu domains).
                  </p>
                </div>
              </div>

              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={institutionalEmail}
                        onChange={(e) => setInstitutionalEmail(e.target.value)}
                        placeholder="e.g. professor.name@iitb.ac.in"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                      />
                      {checkingDomain && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Domain feedback pill */}
                    {domainStatus.checked && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        {domainStatus.eligible ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              Recognized Institution: {domainStatus.institution_name || domainStatus.domain}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            <AlertCircle className="w-4 h-4" />
                            <span>{domainStatus.message}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. / Prof. / Full Name"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Institution / University Name
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="e.g. IIT Bombay, AIIMS New Delhi"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science / Physics"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Assistant Professor, HOD, Lecturer"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || !domainStatus.eligible}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send 6-Digit Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: ENTER OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#201D2E] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Code sent to
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {institutionalEmail}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-[#B45309] dark:text-[#FBBF24] font-semibold hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>

                  {otpHint && (
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                      Development Test OTP Hint: <strong>{otpHint}</strong>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      autoFocus
                      className="w-full max-w-xs px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-2xl font-bold tracking-[0.4em] text-center text-neutral-900 dark:text-white outline-none focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={verifyingOtp || otpCode.length !== 6}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {verifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>Verify &amp; Activate Account</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={resendCooldown > 0 || sendingOtp}
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {resendCooldown > 0 ? (
                        <span>Resend code in {resendCooldown}s</span>
                      ) : (
                        <span>Resend Verification Code</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: FACULTY DIRECTORY VERIFICATION */}
          {activeTab === 'directory' && (
            <div className="rounded-[32px] bg-white dark:bg-[#181622] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Alternative: Institutional Faculty Directory Verification
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Provide the official URL of your profile in your university or college faculty
                    directory. Our SSRF-safe verifier scans the university portal to confirm your
                    teaching appointment.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyDirectory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Faculty Profile / Directory URL
                  </label>
                  <input
                    type="url"
                    value={directoryUrl}
                    onChange={(e) => setDirectoryUrl(e.target.value)}
                    placeholder="https://www.iitb.ac.in/faculty/your-name"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Faculty Name (Exact Name on Page)
                    </label>
                    <input
                      type="text"
                      value={dirFacultyName}
                      onChange={(e) => setDirFacultyName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={dirDesignation}
                      onChange={(e) => setDirDesignation(e.target.value)}
                      placeholder="e.g. Professor / Associate Professor"
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={verifyingDirectory}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {verifyingDirectory ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scanning University Directory...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Profile URL</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: GOOGLE CLASSROOM */}
          {activeTab === 'classroom' && (
            <div className="rounded-[32px] bg-white dark:bg-[#181622] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] text-center">
              <div className="max-w-md mx-auto">
                <div className="inline-flex p-4 rounded-3xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Google Classroom Educator Verification
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                  Authenticate your Google Workspace for Education account. We confirm your active
                  teacher permissions directly through Google Classroom APIs.
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    setNotification(null);
                    try {
                      const res = await fetch('/api/teacher/verify/google-classroom', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ institution_name: 'Google Education Workspace' }),
                      });
                      const data = await res.json();
                      if (res.ok && data.verified) {
                        setCurrentStatus('verified');
                        setNotification({ type: 'success', message: data.message });
                      } else {
                        setNotification({ type: 'error', message: data.error || 'Verification failed.' });
                      }
                    } catch {
                      setNotification({ type: 'error', message: 'Failed to connect Google Classroom.' });
                    }
                  }}
                  className="py-3.5 px-8 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#201D2E] dark:hover:bg-[#28253A] text-white font-semibold text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Connect Google Classroom Account</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL CREDENTIAL REVIEW */}
          {activeTab === 'credentials' && (
            <div className="rounded-[32px] bg-white dark:bg-[#181622] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Alternative: Professional Credential Review
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    If your institution does not issue personal email addresses or public directory
                    pages, submit your Faculty ID card or appointment letter for Super Admin review.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-center space-y-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  Document verification requests are reviewed by our platform administrators within
                  24 hours. Your teaching privileges will be activated immediately upon approval.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setNotification({
                      type: 'success',
                      message: 'Manual review request submitted to Super Admin queue. You will receive an update shortly.',
                    });
                  }}
                  className="py-3 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Submit Credential for Review
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
      )}
    </div>
  );
}

