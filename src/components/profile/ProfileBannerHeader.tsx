'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Camera,
  Check,
  Clock,
  Calendar,
  Compass,
  Edit3,
  Mail,
  Sparkles,
  Upload,
  X,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { AVATARS, type AvatarDef, resizeImageFile, setCustomAvatar } from '@/lib/avatars';

export interface ProfileBannerHeaderProps {
  displayName: string;
  usernameHandle: string;
  email: string;
  joinedDate: string;
  practiceSince: string;
  totalStudyTime: string;
  avatar: AvatarDef | null;
  initials: string;
  onSaveName: (newName: string) => Promise<void> | void;
  onSelectPresetAvatar: (id: string) => void;
  onClearAvatar: () => void;
  onOpenPictureModal: () => void;
}

export function ProfileBannerHeader({
  displayName,
  usernameHandle,
  email,
  joinedDate,
  practiceSince,
  totalStudyTime,
  avatar,
  initials,
  onSaveName,
  onSelectPresetAvatar,
  onClearAvatar,
  onOpenPictureModal,
}: ProfileBannerHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [savingName, setSavingName] = useState(false);
  const [showAvatarDrawer, setShowAvatarDrawer] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setNameDraft(displayName);
    setEditing(true);
  };

  const handleSave = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setEditing(false);
      return;
    }
    setSavingName(true);
    try {
      await onSaveName(trimmed);
      setEditing(false);
    } finally {
      setSavingName(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10 MB.');
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file, 400);
      setCustomAvatar(dataUrl);
    } catch {
      setUploadError('Could not process image. Please try another file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="rounded-3xl bg-white dark:bg-[#111A2E] p-3 sm:p-4 shadow-[0_4px_24px_-6px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
      {/* Top Gradient Banner — Rounded lower & upper corners, zero borders */}
      <div className="relative h-28 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#C4B5FD] dark:from-[#3B1878] dark:via-[#5B21B6] dark:to-[#8B5CF6]">
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute -inset-1/2 opacity-45 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.42), transparent 55%), radial-gradient(circle at 75% 65%, rgba(233,213,255,0.45), transparent 50%)',
            }}
            animate={{ x: [0, 18, -10, 0], y: [0, -10, 8, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none"
        />
        <div className="relative z-10 flex items-center justify-end px-4 pt-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/18 backdrop-blur-md text-white/95">
            <Sparkles className="w-3 h-3" />
            SamayYudh Profile
          </span>
        </div>
      </div>

      {/* Avatar Row + Edit Action */}
      <div className="px-2 sm:px-4 pb-2">
        <div className="flex items-end justify-between gap-3 -mt-11 sm:-mt-12 mb-4 relative z-20">
          <motion.button
            type="button"
            onClick={onOpenPictureModal}
            aria-label="Update profile picture"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            className="group relative w-22 h-22 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-[#111A2E] p-1.5 shadow-[0_10px_28px_-6px_rgba(76,29,149,0.28)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.65)] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <div className="w-full h-full rounded-[18px] overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/80 dark:to-indigo-950/80 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar.src}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                  {initials}
                </span>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white dark:bg-[#1A2540] shadow-md flex items-center justify-center text-slate-600 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </motion.button>

          <div className="flex items-center gap-2 pb-1">
            {!editing ? (
              <motion.button
                type="button"
                onClick={handleOpenEdit}
                whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-100 hover:bg-stone-200/80 dark:bg-[#18233C] dark:hover:bg-[#1F2D4D] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Edit Profile</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  placeholder="Your full name"
                  autoFocus
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#18233C] text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 w-36 sm:w-44"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={savingName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="Cancel editing"
                  className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#18233C] dark:hover:bg-[#223052] text-slate-500 dark:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Name & Handle */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {displayName}
            </h1>
            <span className="text-xs sm:text-sm font-medium text-violet-600 dark:text-violet-400">
              @{usernameHandle}
            </span>
          </div>

          {/* Clean Borderless Metadata Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-[13px]">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-stone-50/90 dark:bg-[#162032]">
              <Mail className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span className="text-slate-400 dark:text-slate-400 shrink-0">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-100 truncate ml-auto">
                {email}
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-stone-50/90 dark:bg-[#162032]">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-slate-400 dark:text-slate-400 shrink-0">Joined</span>
              <span className="font-medium text-slate-800 dark:text-slate-100 ml-auto">
                {joinedDate}
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-stone-50/90 dark:bg-[#162032]">
              <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-slate-400 dark:text-slate-400 shrink-0">Practice Since</span>
              <span className="font-medium text-slate-800 dark:text-slate-100 ml-auto">
                {practiceSince}
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-stone-50/90 dark:bg-[#162032]">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-slate-400 dark:text-slate-400 shrink-0">Total Study Time</span>
              <span className="font-medium text-slate-800 dark:text-slate-100 ml-auto">
                {totalStudyTime}
              </span>
            </div>
          </div>

          {/* Collapsible Avatar Selector Bar (Preserves preset grid + device upload) */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAvatarDrawer((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-stone-50/80 hover:bg-stone-100/90 dark:bg-[#162032] dark:hover:bg-[#1B2740] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Customize Avatar
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {avatar ? avatar.label : 'Choose a character or upload a photo'}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showAvatarDrawer ? 'rotate-90 text-violet-500' : 'group-hover:translate-x-0.5'
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showAvatarDrawer && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-stone-50/90 dark:bg-[#162032] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploading ? 'Processing...' : 'Upload Photo'}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenPictureModal}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-[#1E2B45] text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-[#243454] transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-violet-500" />
                          Full Studio
                        </button>
                      </div>

                      {avatar && (
                        <button
                          type="button"
                          onClick={onClearAvatar}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </button>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-xs text-rose-600 dark:text-rose-400">{uploadError}</p>
                    )}

                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {AVATARS.map((item) => {
                        const selected = avatar?.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectPresetAvatar(item.id)}
                            title={item.label}
                            className={`relative aspect-square rounded-2xl overflow-hidden transition-all cursor-pointer ${
                              selected
                                ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-[#162032] scale-[1.03]'
                                : 'opacity-85 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <img
                              src={item.src}
                              alt={item.label}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {selected && (
                              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

