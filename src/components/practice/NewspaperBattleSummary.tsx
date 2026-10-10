'use client';

import Image from 'next/image';
import { Clock, Hash, Award, Zap, FileText, Crosshair, Trophy, Cog } from 'lucide-react';

/* ============================================================
   Exam Logo Configuration
   Maps exam codes to their logo images for the newspaper treatment.
   ============================================================ */

const EXAM_LOGO_MAP: Record<string, { logo?: string; abbrev: string }> = {
  ENGINEERING:           { logo: '/logos/gate.jpg',       abbrev: 'GATE' },
  ENGINEERING_ENTRANCE:  { logo: '/logos/jee.jpg',        abbrev: 'JEE' },
  STATE_ENTRANCE:        { logo: '/logos/wbjee.jpg',      abbrev: 'WBJEE' },
  CIVIL_SERVICES:        { logo: '/logos/upsc.jpg',       abbrev: 'UPSC' },
  UNIVERSITY:            { logo: '/logos/university.jpg', abbrev: 'UNIV' },
  COMPETITIVE:           { logo: '/logos/ssc.jpg',        abbrev: 'SSC+' },
  MEDICAL:               { logo: '/logos/neet.jpg',       abbrev: 'NEET' },
  CUSTOM:                {                                abbrev: 'CSTM' },
};

/* ============================================================
   Mode Icon Map — monochrome line icons for newspaper style
   ============================================================ */

const MODE_ICON_MAP: Record<string, React.ReactNode> = {
  quick_battle:    <Zap       className="w-3.5 h-3.5" />,
  practice_battle: <FileText  className="w-3.5 h-3.5" />,
  half_century:    <Crosshair className="w-3.5 h-3.5" />,
  full_century:    <Trophy    className="w-3.5 h-3.5" />,
  full_exam:       <FileText  className="w-3.5 h-3.5" />,
  topic_practice:  <Crosshair className="w-3.5 h-3.5" />,
  previous_year:   <FileText  className="w-3.5 h-3.5" />,
  speed_battle:    <Zap       className="w-3.5 h-3.5" />,
  custom:          <Cog       className="w-3.5 h-3.5" />,
};

/* ============================================================
   Props
   ============================================================ */

interface NewspaperBattleSummaryProps {
  examCode: string | null;
  examName: string;
  modeName: string;
  modeKey: string;
  questionCount: number;
  durationLabel: string;
  estimatedMarks: number;
}

/* ============================================================
   Component
   ============================================================ */

export function NewspaperBattleSummary({
  examCode,
  examName,
  modeName,
  modeKey,
  questionCount,
  durationLabel,
  estimatedMarks,
}: NewspaperBattleSummaryProps) {
  const examLogo = examCode ? EXAM_LOGO_MAP[examCode] : undefined;
  const modeIcon = MODE_ICON_MAP[modeKey] ?? <Zap className="w-3.5 h-3.5" />;
  const currentYear = new Date().getFullYear();

  const rows = [
    {
      label: 'Exam',
      value: (
        <span className="flex items-center gap-2">
          {examLogo?.logo ? (
            <Image
              src={examLogo.logo}
              alt={examName}
              width={22}
              height={22}
              className="rounded-full object-contain grayscale dark:brightness-90 border border-current/10"
              style={{ width: 22, height: 22 }}
            />
          ) : (
            <span className="newspaper-label text-[10px] font-bold border border-current/20 px-1 rounded">
              {examLogo?.abbrev ?? '—'}
            </span>
          )}
          {examName}
        </span>
      ),
      icon: null,
    },
    {
      label: 'Mode',
      value: (
        <span className="flex items-center gap-2">
          {modeIcon}
          {modeName}
        </span>
      ),
      icon: null,
    },
    {
      label: 'Questions',
      value: questionCount,
      icon: <Hash className="w-3 h-3" />,
    },
    {
      label: 'Duration',
      value: durationLabel,
      icon: <Clock className="w-3 h-3" />,
    },
    {
      label: 'Est. Marks',
      value: `~${estimatedMarks}`,
      icon: <Award className="w-3 h-3" />,
    },
  ];

  return (
    <div
      className="newspaper-paper rounded-sm border border-stone-300/60 dark:border-stone-600/30 overflow-hidden"
      style={{ transform: 'rotate(-0.3deg)' }}
    >
      {/* All content needs z-index above the ::before / ::after pseudo-elements */}
      <div className="relative z-10 px-6 py-5 md:px-8 md:py-6">

        {/* ── Masthead ──────────────────────────────── */}
        <div className="text-center mb-1">
          <div className="newspaper-rule-thick mx-auto max-w-[90%]" />

          <h2
            className="newspaper-masthead text-xl md:text-2xl font-black mt-2 mb-1 tracking-widest"
            style={{ color: 'var(--np-ink, #1a1610)' }}
          >
            The Battle Summary
          </h2>

          <div className="newspaper-rule-double mx-auto max-w-[90%]" />

          {/* Tiny metadata line */}
          <p
            className="newspaper-label text-[9px] md:text-[10px] mt-1.5 tracking-[0.2em] opacity-50"
            style={{ color: 'var(--np-ink, #1a1610)' }}
          >
            Exam Edition &nbsp;•&nbsp; Battle Report &nbsp;•&nbsp; {currentYear}
          </p>
        </div>

        {/* ── Info rows ─────────────────────────────── */}
        <div className="mt-4 space-y-0">
          {rows.map((row, i) => (
            <div key={row.label}>
              <div className="flex items-center justify-between py-2.5 md:py-3">
                {/* Label */}
                <span
                  className="newspaper-label text-[11px] md:text-xs flex items-center gap-1.5 opacity-60"
                  style={{ color: 'var(--np-ink, #1a1610)' }}
                >
                  {row.icon}
                  {row.label}
                </span>

                {/* Value */}
                <span
                  className="newspaper-value text-sm md:text-base flex items-center gap-2"
                  style={{ color: 'var(--np-ink, #1a1610)' }}
                >
                  {row.value}
                </span>
              </div>

              {/* Separator — skip after last row */}
              {i < rows.length - 1 && <div className="newspaper-rule" />}
            </div>
          ))}
        </div>

        {/* ── Bottom edition line ───────────────────── */}
        <div className="newspaper-rule-thick mt-4 mx-auto max-w-[90%]" />
        <p
          className="text-center newspaper-label text-[8px] mt-1.5 tracking-[0.25em] opacity-35"
          style={{ color: 'var(--np-ink, #1a1610)' }}
        >
          সময়যুদ্ধ &nbsp;•&nbsp; SamayYudh 2.0
        </p>
      </div>
    </div>
  );
}
