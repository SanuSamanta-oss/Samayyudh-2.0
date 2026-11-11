'use client';

// ============================================================
// SamayYudh 2.0 — Floating Portrait Profile Picture Modal
// Modern vertical social-profile preview card with smooth
// scale/fade entrance & exit animations, live photo preview,
// and theme-aware atmospheric depth.
// ============================================================

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ImagePlus, Upload, Loader2, Check } from 'lucide-react';
import { setCustomAvatar, resizeImageFile } from '@/lib/avatars';
import { useAuth } from '@/components/providers/AuthProvider';

export interface ProfilePictureModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** URL of the avatar image (null = show initials fallback) */
  avatarUrl: string | null;
  /** Alt text / avatar label */
  avatarLabel: string;
  /** Display name shown at top of card */
  displayName: string;
  /** Optional explicit username handle */
  username?: string;
  /** User initials fallback when no avatar is selected */
  initials: string;
  /** Callback when user clicks gallery avatar chooser */
  onChangeAvatar?: () => void;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
const emptySubscribe = () => () => {};

export function ProfilePictureModal({
  isOpen,
  onClose,
  avatarUrl,
  avatarLabel,
  displayName,
  username,
  initials,
  onChangeAvatar,
}: ProfilePictureModalProps) {
  const { user, isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [processingFile, setProcessingFile] = useState(false);
  const [savingPreview, setSavingPreview] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeImageUrl = previewDataUrl || avatarUrl;
  const isUploadedPhoto = Boolean(previewDataUrl || avatarUrl?.startsWith('data:'));

  // Derive clean handle without dummy placeholders
  const emailPrefix = user?.email?.includes('@') ? user.email.split('@')[0] : '';
  const resolvedHandle = (
    username ||
    user?.user_metadata?.username ||
    emailPrefix ||
    displayName.replace(/\s+/g, '').toLowerCase() ||
    'aspirant'
  )
    .replace(/^@+/, '')
    .toLowerCase();

  // Real account / upload status indicator
  const statusInfo = savingPreview
    ? { label: 'Saving photo', mode: 'spin' as const }
    : processingFile
      ? { label: 'Preparing preview', mode: 'spin' as const }
      : previewDataUrl
        ? { label: 'Preview ready', mode: 'pulse' as const }
        : isAuthenticated
          ? { label: 'Connected', mode: 'pulse' as const }
          : { label: 'Profile ready', mode: 'pulse' as const };

  const handleClose = useCallback(() => {
    setPreviewDataUrl(null);
    setUploadError(null);
    setProcessingFile(false);
    setSavingPreview(false);
    onClose();
  }, [onClose]);

  // Lock body scroll while open & restore focus cleanly
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 120);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    }
  }, [isOpen]);

  // Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        handleClose();
      }
    },
    [handleClose]
  );

  // Pick & resize photo into live card preview before saving
  const handleFilePick = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a JPG, PNG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file must be under 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setProcessingFile(true);
    try {
      const dataUrl = await resizeImageFile(file, 400);
      setImageLoaded(true);
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
      setUploadError('Could not process this image. Please try another file.');
    } finally {
      setProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const handleSavePreview = useCallback(() => {
    if (!previewDataUrl) return;
    setSavingPreview(true);
    setCustomAvatar(previewDataUrl);
    setTimeout(() => {
      setSavingPreview(false);
      setPreviewDataUrl(null);
      onClose();
    }, 260);
  }, [previewDataUrl, onClose]);

  const handleDiscardPreview = useCallback(() => {
    setPreviewDataUrl(null);
    setUploadError(null);
  }, []);

  const triggerFilePicker = useCallback(() => {
    setUploadError(null);
    fileInputRef.current?.click();
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, ease: PREMIUM_EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName}'s profile card`}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-slate-900/35 dark:bg-[#050814]/76 backdrop-blur-md"
        >
          {/* Ambient Soft Purple Atmospheric Glow Behind Card */}
          <div className="relative flex items-center justify-center">
            <motion.div
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: PREMIUM_EASE }}
              className="pointer-events-none absolute -inset-8 rounded-[48px] bg-violet-500/20 dark:bg-violet-600/25 blur-3xl"
            />

            {/* Floating Portrait Profile Card — Borderless */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, y: 22 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.93, y: 14 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.52,
                ease: PREMIUM_EASE,
              }}
              className="relative w-[88vw] max-w-[376px] h-[500px] sm:h-[524px] rounded-[32px] overflow-hidden select-none bg-gradient-to-b from-[#ECE8FF] via-[#F5F3FF] to-[#DCD4FF] dark:from-[#1B1738] dark:via-[#141A33] dark:to-[#0C1022] shadow-[0_28px_72px_-16px_rgba(46,16,101,0.36)] dark:shadow-[0_32px_88px_-14px_rgba(0,0,0,0.82)]"
            >
              {/* Primary Portrait / Avatar Layer */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.04 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.15 : 0.54,
                  delay: prefersReducedMotion ? 0 : 0.06,
                  ease: PREMIUM_EASE,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {activeImageUrl ? (
                  isUploadedPhoto ? (
                    /* Uploaded photograph fills the portrait seamlessly */
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeImageUrl}
                      alt={avatarLabel}
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
                        imageLoaded || previewDataUrl ? 'opacity-100' : 'opacity-85'
                      }`}
                    />
                  ) : (
                    /* Illustrated avatar preserved uncropped & feathered naturally */
                    <div
                      className="w-full h-[80%] flex items-center justify-center px-3 pt-10 pb-6"
                      style={{
                        maskImage:
                          'radial-gradient(ellipse 88% 84% at 50% 49%, black 64%, transparent 100%)',
                        WebkitMaskImage:
                          'radial-gradient(ellipse 88% 84% at 50% 49%, black 64%, transparent 100%)',
                      }}
                    >
                      <Image
                        src={activeImageUrl}
                        alt={avatarLabel}
                        width={420}
                        height={420}
                        priority
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-contain drop-shadow-[0_18px_34px_rgba(46,16,101,0.22)]"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-40 h-40 rounded-[36px] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                    <span className="text-5xl font-extrabold text-white tracking-tight">
                      {initials}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Upper Readability Gradient Veil */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-36 ${
                  isUploadedPhoto
                    ? 'bg-gradient-to-b from-black/55 via-black/22 to-transparent'
                    : 'bg-gradient-to-b from-white/35 via-white/10 to-transparent dark:from-[#0C1022]/60 dark:via-[#0C1022]/20 dark:to-transparent'
                }`}
              />

              {/* Bottom Gradient Veil for Profile Identity & Action Contrast */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-44 ${
                  isUploadedPhoto
                    ? 'bg-gradient-to-t from-black/72 via-black/32 to-transparent'
                    : 'bg-gradient-to-t from-[#1E143B]/82 via-[#2E1065]/32 to-transparent dark:from-[#070A16]/90 dark:via-[#0D132B]/45 dark:to-transparent'
                }`}
              />

              {/* Top-Right Minimal Floating Controls (Optional Gallery + Close) */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                {onChangeAvatar && !previewDataUrl && (
                  <motion.button
                    type="button"
                    onClick={onChangeAvatar}
                    aria-label="Choose preset avatar"
                    title="Choose preset avatar"
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.07 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                    className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isUploadedPhoto
                        ? 'bg-black/28 hover:bg-black/45 text-white'
                        : 'bg-white/60 hover:bg-white/85 text-slate-700 dark:bg-white/12 dark:hover:bg-white/22 dark:text-white/90'
                    }`}
                  >
                    <ImagePlus className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleClose}
                  aria-label="Close profile picture"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.07 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    isUploadedPhoto
                      ? 'bg-black/28 hover:bg-black/45 text-white'
                      : 'bg-white/60 hover:bg-white/85 text-slate-700 dark:bg-white/12 dark:hover:bg-white/22 dark:text-white/90'
                  }`}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Upper Centered Name & Real Status Indicator */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{
                  duration: prefersReducedMotion ? 0.15 : 0.4,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: PREMIUM_EASE,
                }}
                className="relative z-20 pt-9 px-14 text-center"
              >
                <h2
                  className={`text-2xl sm:text-[26px] font-bold tracking-tight truncate ${
                    isUploadedPhoto
                      ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {displayName}
                </h2>

                <div
                  className={`mt-1.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium ${
                    isUploadedPhoto
                      ? 'text-white/90 drop-shadow-xs'
                      : 'text-slate-600 dark:text-violet-200/85'
                  }`}
                >
                  {statusInfo.mode === 'spin' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="relative flex h-2 w-2">
                      {!prefersReducedMotion && (
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-65 ${
                            isUploadedPhoto
                              ? 'bg-white'
                              : 'bg-violet-500 dark:bg-violet-300'
                          }`}
                        />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          isUploadedPhoto
                            ? 'bg-white'
                            : 'bg-violet-600 dark:bg-violet-300'
                        }`}
                      />
                    </span>
                  )}
                  <span>{statusInfo.label}</span>
                </div>
              </motion.div>

              {/* Inline Validation Feedback Pill */}
              {uploadError && (
                <div className="absolute bottom-22 inset-x-5 z-30 flex justify-center">
                  <div className="px-3.5 py-2 rounded-2xl bg-rose-600/92 backdrop-blur-md text-white text-xs font-medium shadow-lg text-center">
                    {uploadError}
                  </div>
                </div>
              )}

              {/* Bottom Identity + Floating Upload Action */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 14 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  duration: prefersReducedMotion ? 0.15 : 0.44,
                  delay: prefersReducedMotion ? 0 : 0.18,
                  ease: PREMIUM_EASE,
                }}
                className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-4 flex items-center justify-between gap-3"
              >
                {/* Bottom-Left Compact Account Identity */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm shrink-0 shadow-sm flex items-center justify-center">
                    {activeImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activeImageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">{initials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      @{resolvedHandle}
                    </p>
                    <p className="text-[11px] text-white/75 truncate">
                      {previewDataUrl
                        ? 'Unsaved preview'
                        : isAuthenticated
                          ? 'SamayYudh Member'
                          : 'Local Profile'}
                    </p>
                  </div>
                </div>

                {/* Bottom-Right Floating Pill Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {previewDataUrl ? (
                    <>
                      <motion.button
                        type="button"
                        onClick={handleDiscardPreview}
                        aria-label="Discard photo preview"
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleSavePreview}
                        disabled={savingPreview}
                        whileHover={prefersReducedMotion ? undefined : { y: -1.5 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white text-xs font-semibold shadow-[0_10px_24px_-4px_rgba(124,58,237,0.68)] transition-all disabled:opacity-65 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        {savingPreview ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>{savingPreview ? 'Saving...' : 'Save Photo'}</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={triggerFilePicker}
                      disabled={processingFile}
                      whileHover={prefersReducedMotion ? undefined : { y: -1.5 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white text-xs font-semibold shadow-[0_10px_26px_-4px_rgba(124,58,237,0.7)] transition-all disabled:opacity-65 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                      {processingFile ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{processingFile ? 'Loading...' : 'Upload Photo'}</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Hidden File Picker Preserved */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFilePick}
                aria-label="Upload profile photo"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isClient) return null;
  return createPortal(modalContent, document.body);
}
