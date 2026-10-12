'use client';

// ============================================================
// SamayYudh 2.0 — Instagram-Style Profile Picture Modal
// Reusable modal component that displays an enlarged avatar
// with a premium, dark, blurred backdrop and smooth animations.
// Uses createPortal to render on document.body (avoids
// transform-induced stacking context issues from framer-motion).
// Supports uploading a custom photo from the user's device.
// ============================================================

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Upload, Loader2 } from 'lucide-react';
import { setCustomAvatar, resizeImageFile } from '@/lib/avatars';

interface ProfilePictureModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** URL of the avatar image (null = show initials fallback) */
  avatarUrl: string | null;
  /** Alt text / avatar label */
  avatarLabel: string;
  /** Display name shown beneath the avatar */
  displayName: string;
  /** User initials fallback when no avatar is selected */
  initials: string;
  /** Callback when user clicks "Choose Avatar" (opens avatar gallery) */
  onChangeAvatar?: () => void;
}

export function ProfilePictureModal({
  isOpen,
  onClose,
  avatarUrl,
  avatarLabel,
  displayName,
  initials,
  onChangeAvatar,
}: ProfilePictureModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // Resolve portal target on mount (client-only)
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Lock body scroll while open & manage focus
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      // Focus close button after animation settles
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      // Restore focus to the element that opened the modal
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Click-outside handler
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  // Handle file upload from device
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file, 400);
      setCustomAvatar(dataUrl);
      // Close the modal after short delay to show the change
      setTimeout(() => {
        setUploading(false);
        onClose();
      }, 300);
    } catch (err) {
      console.error('Failed to process image:', err);
      setUploading(false);
    }

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onClose]);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Determine if avatar is a data URL (custom upload) — needs unoptimized for next/image
  const isDataUrl = avatarUrl?.startsWith('data:');

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="profile-modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName}'s profile picture`}
        >
          {/* Modal content */}
          <motion.div
            className="profile-modal-content"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{
              duration: 0.28,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              className="profile-modal-close"
              onClick={onClose}
              aria-label="Close profile picture"
              tabIndex={0}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Avatar container with glow */}
            <div className="profile-modal-avatar-wrapper">
              <div className="profile-modal-avatar-glow" />
              <div className="profile-modal-avatar">
                {avatarUrl ? (
                  isDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarUrl}
                      alt={avatarLabel}
                      className="profile-modal-avatar-img"
                    />
                  ) : (
                    <Image
                      src={avatarUrl}
                      alt={avatarLabel}
                      width={360}
                      height={360}
                      className="profile-modal-avatar-img"
                      priority
                    />
                  )
                ) : (
                  <span className="profile-modal-avatar-initials">
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <p className="profile-modal-name">{displayName}</p>

            {/* Action buttons */}
            <div className="profile-modal-actions">
              {/* Upload own photo */}
              <button
                className="profile-modal-upload-btn"
                onClick={triggerFileUpload}
                disabled={uploading}
                tabIndex={0}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploading ? 'Uploading…' : 'Upload Photo'}</span>
              </button>

              {/* Choose from gallery */}
              {onChangeAvatar && (
                <button
                  className="profile-modal-change-btn"
                  onClick={onChangeAvatar}
                  tabIndex={0}
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>Choose Avatar</span>
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              aria-label="Upload profile photo"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal so the modal renders on document.body directly,
  // bypassing any transform/will-change stacking contexts
  if (!portalTarget) return null;
  return createPortal(modalContent, portalTarget);
}
