'use client';

import React, { useRef } from 'react';
import {
  AlertCircle,
  Bell,
  Check,
  Music,
  Play,
  Smartphone,
  Square,
  Trash2,
  Upload,
  Volume2,
} from 'lucide-react';
import type { ReminderSettings, ReminderTone } from '@/types/reminders';
import { formatAudioSize, type CustomToneRecord } from '@/lib/notifications/custom-audio';

export const BUILT_IN_TONES: { id: ReminderTone; name: string; desc: string }[] = [
  { id: 'chime', name: 'Zen Chime', desc: '528Hz gentle clarity' },
  { id: 'gong', name: 'Tibetan Gong', desc: 'Deep singing bowl' },
  { id: 'bell', name: 'Temple Bell', desc: 'Crystal sparkle chime' },
  { id: 'marimba', name: 'Marimba', desc: 'Crisp upbeat notes' },
];

export interface NotificationSoundSettingsProps {
  settings: ReminderSettings;
  customTone: CustomToneRecord | null;
  previewingTone: ReminderTone | null;
  isUploadingTone: boolean;
  toneUploadError: string | null;
  permission: NotificationPermission | 'unsupported';
  isTesting: boolean;
  onUpdateSetting: <K extends keyof ReminderSettings>(
    key: K,
    val: ReminderSettings[K]
  ) => void;
  onPreviewTone: (tone: ReminderTone, customAudioData?: string) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCustomTone: () => void;
  onRequestPermission: () => void;
  onRunTest: () => void;
}

export function NotificationSoundSettings({
  settings,
  customTone,
  previewingTone,
  isUploadingTone,
  toneUploadError,
  permission,
  isTesting,
  onUpdateSetting,
  onPreviewTone,
  onUploadFile,
  onDeleteCustomTone,
  onRequestPermission,
  onRunTest,
}: NotificationSoundSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLabel =
    settings.reminderTone === 'custom' && customTone
      ? customTone.name
      : BUILT_IN_TONES.find((t) => t.id === settings.reminderTone)?.name || 'Zen Chime';

  return (
    <section
      id="sound-settings"
      className="rounded-[20px] bg-white dark:bg-[#181822] p-5 shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] space-y-4 transition-colors duration-200"
    >
      {/* Header + Master Sound Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-[12px] bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4 stroke-[1.9]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#25233A] dark:text-[#F5F3FF]">
              Notification Sound
            </h3>
            <p className="text-xs text-[#77758A] dark:text-[#B0ADBF] truncate">
              {settings.soundEnabled ? `Selected: ${selectedLabel}` : 'Sound alerts muted'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={settings.soundEnabled}
          aria-label="Toggle notification sound"
          onClick={() => onUpdateSetting('soundEnabled', !settings.soundEnabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/45 ${
            settings.soundEnabled
              ? 'bg-[#7667C8] dark:bg-[#8D7BE0]'
              : 'bg-[#D9D4EA] dark:bg-[#302A48]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
              settings.soundEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`}
          />
        </button>
      </div>

      {/* Sound List */}
      {settings.soundEnabled && (
        <div className="space-y-2">
          <div className="space-y-1.5">
            {BUILT_IN_TONES.map((tone) => {
              const selected = settings.reminderTone === tone.id;
              const isPlaying = previewingTone === tone.id;
              return (
                <div
                  key={tone.id}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-[12px] transition-colors ${
                    selected
                      ? 'bg-[#EAE5FA] dark:bg-[#302A48]'
                      : 'bg-[#F0EDF8]/70 hover:bg-[#EAE6F5] dark:bg-[#20202C] dark:hover:bg-[#29283A]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onUpdateSetting('reminderTone', tone.id)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                          : 'bg-white dark:bg-[#181822]'
                      }`}
                    >
                      {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
                        {tone.name}
                      </p>
                      <p className="text-[11px] text-[#77758A] dark:text-[#B0ADBF] truncate">
                        {tone.desc}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPreviewTone(tone.id)}
                    aria-label={isPlaying ? `Stop ${tone.name}` : `Preview ${tone.name}`}
                    className="w-7 h-7 rounded-[10px] bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] hover:bg-[#EAE5FA] dark:hover:bg-[#29283A] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom Audio Upload & Controls */}
          <div className="rounded-[14px] bg-[#F0EDF8]/80 dark:bg-[#20202C] p-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
              onChange={onUploadFile}
              className="hidden"
            />

            {customTone ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => onPreviewTone('custom', customTone.dataUrl)}
                      aria-label={
                        previewingTone === 'custom'
                          ? 'Stop custom sound preview'
                          : 'Preview custom sound'
                      }
                      className="w-7 h-7 rounded-[10px] bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      {previewingTone === 'custom' ? (
                        <Square className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
                        {customTone.name}
                      </p>
                      <p className="text-[10px] text-[#A19EB1] dark:text-[#858195]">
                        Custom sound ({formatAudioSize(customTone.sizeBytes)})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onDeleteCustomTone}
                    aria-label="Delete custom sound"
                    className="p-1.5 rounded-[8px] text-[#77758A] hover:text-rose-600 dark:text-[#B0ADBF] dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSetting('reminderTone', 'custom')}
                    className={`flex-1 py-1.5 px-2.5 rounded-[10px] text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      settings.reminderTone === 'custom'
                        ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                        : 'bg-white dark:bg-[#181822] text-[#25233A] dark:text-[#F5F3FF] hover:bg-[#EAE5FA] dark:hover:bg-[#29283A]'
                    }`}
                  >
                    {settings.reminderTone === 'custom' && <Check className="w-3 h-3" />}
                    <span>{settings.reminderTone === 'custom' ? 'Active Sound' : 'Use Sound'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingTone}
                    className="py-1.5 px-2.5 rounded-[10px] text-[11px] font-medium bg-white dark:bg-[#181822] text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-[10px] bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] flex items-center justify-center shrink-0">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
                      Upload custom sound
                    </p>
                    <p className="text-[10px] text-[#A19EB1] dark:text-[#858195] truncate">
                      MP3, WAV, OGG, M4A
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isUploadingTone}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[11px] font-semibold bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] hover:bg-[#EAE5FA] dark:hover:bg-[#29283A] transition-colors cursor-pointer shrink-0"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploadingTone ? 'Saving...' : 'Upload'}</span>
                </button>
              </div>
            )}

            {toneUploadError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-2">
                {toneUploadError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Compact Haptic Vibration & Browser Alerts Strip */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-[12px] bg-[#F0EDF8]/65 dark:bg-[#20202C]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
            <span className="text-xs font-medium text-[#25233A] dark:text-[#F5F3FF]">
              Device Vibration
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.vibrationEnabled}
            aria-label="Toggle device vibration"
            onClick={() => onUpdateSetting('vibrationEnabled', !settings.vibrationEnabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/45 ${
              settings.vibrationEnabled
                ? 'bg-[#7667C8] dark:bg-[#8D7BE0]'
                : 'bg-[#D9D4EA] dark:bg-[#302A48]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                settings.vibrationEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-[12px] bg-[#F0EDF8]/65 dark:bg-[#20202C]">
          <div className="flex items-center gap-2 min-w-0">
            {permission === 'granted' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-[11px] font-medium text-[#77758A] dark:text-[#B0ADBF] truncate">
              {permission === 'granted'
                ? 'Browser notifications active'
                : permission === 'denied'
                  ? 'Notifications blocked in browser'
                  : 'Notification permission pending'}
            </span>
          </div>

          {permission !== 'granted' && permission !== 'unsupported' ? (
            <button
              type="button"
              onClick={onRequestPermission}
              className="px-2.5 py-1 rounded-[8px] text-[11px] font-semibold bg-[#7667C8] dark:bg-[#8D7BE0] text-white hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              Enable
            </button>
          ) : (
            <button
              type="button"
              disabled={isTesting}
              onClick={onRunTest}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-semibold bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] hover:bg-[#EAE5FA] dark:hover:bg-[#29283A] transition-colors cursor-pointer shrink-0"
            >
              <Bell className="w-3 h-3" />
              <span>{isTesting ? 'Testing...' : 'Test'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

