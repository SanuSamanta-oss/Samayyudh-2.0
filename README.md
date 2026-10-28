# সময়যুদ্ধ 2.0 — SamayYudh
> **The Battle Between You & The Clock**  
> An AI-powered, offline-first exam preparation, practice, and time-pressure simulation platform designed for high-stakes competitive examinations (GATE, JEE Mains & Advanced, WBJEE, UPSC Civil Services, NEET, University & College Exams, SSC, Banking, and more).

[![Live Website](https://img.shields.io/badge/Live_Site-samayyudh--2--0.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://samayyudh-2-0.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://samayyudh-2-0.vercel.app/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-purple.svg?style=for-the-badge)](LICENSE)

🔗 **Live Deployment:** [https://samayyudh-2-0.vercel.app/](https://samayyudh-2-0.vercel.app/)

---

## 📖 Table of Contents
1. [🌟 Mission & Vision](#-mission--vision)
2. [✨ Comprehensive Feature Breakdown](#-comprehensive-feature-breakdown)
   - [⏱️ Real-Time Exam Simulator & Battle Engine](#1-⏱️-real-time-exam-simulator--battle-engine)
   - [🤖 Google Gemini 2.0 AI Evaluation Engine](#2-🤖-google-gemini-20-ai-evaluation-engine)
   - [📱 Native-Like PWA & Android App Experience](#3-📱-native-like-pwa--android-app-experience)
   - [🎙️ SOKHA — 3D AI Study Assistant with Voice Capabilities](#4-🎙️-sokha--3d-ai-study-assistant-with-voice-capabilities)
   - [📐 Formula Library & Cheatsheets](#5-📐-formula-library--cheatsheets)
   - [🌐 Offline-First Architecture & Auto-Sync Engine](#6-🌐-offline-first-architecture--auto-sync-engine)
   - [🎨 Futuristic & Fluid UI/UX Micro-Interactions](#7-🎨-futuristic--fluid-uiux-micro-interactions)
   - [🏆 Gamification, Streaks, Medals & Badges](#8-🏆-gamification-streaks-medals--badges)
   - [⏰ Study Alarms & Notification Scheduler](#9-⏰-study-alarms--notification-scheduler)
   - [🐍 Python Data Management & Exam Paper Parsing Suite](#10-🐍-python-data-management--exam-paper-parsing-suite)
3. [🛠️ Technology Stack](#️-technology-stack)
4. [📂 Project Architecture](#-project-architecture)
5. [⚙️ Environment Variables](#️-environment-variables)
6. [🏃 Local Setup & Development](#-local-setup--development)
7. [🔒 Security, Data Privacy & Reliability](#-security-data-privacy--reliability)
8. [📄 License](#-license)

---

## 🌟 Mission & Vision

The single biggest factor separating students who crack top competitive exams from those who don't is **time management under pressure**. Knowing the theory isn't enough; you must be able to recall, formulate, solve, and write full answers before the clock runs out.

**সময়যুদ্ধ (SamayYudh) 2.0** turns exam preparation into an interactive battle against the clock. It combines strict countdown pacing, instant AI feedback, deep analytical diagnostics, and complete offline reliability so that no student ever loses to time.

---

## ✨ Comprehensive Feature Breakdown

### 1. ⏱️ Real-Time Exam Simulator & Battle Engine
- **Omnitrix Battle Launch (`OmnitrixLoader`):** Engaging Ben 10 Omnitrix unlocking animation that primes student focus before commencing each timed practice battle.
- **Realistic Time Pressure Countdown:** Live countdown timers with visual urgency states, split-second tracking, and customizable test durations (from 10-minute quick sprints to 3-hour mock century battles).
- **Interactive Question Palette & Navigator:** Instant jump-to-question navigation, flag-for-review markers, answered/unanswered counts, and progress tracking.
- **Answer Canvas & Scratchboard:** Full-featured workspace allowing students to write out long-form derivations, structured answers, and quick scratch calculations.
- **Multi-Exam Pattern Support:**
  - 🎓 **GATE:** Graduate Aptitude Test in Engineering (CS, ME, EE, EC, CE)
  - 🚀 **JEE Mains & Advanced:** Engineering Entrance Examination
  - 📐 **WBJEE:** West Bengal Joint Entrance Examination
  - 🏛️ **UPSC Civil Services:** General Studies, Mains answer-writing simulator
  - 🏥 **NEET:** Medical Entrance Examination
  - 🏫 **University & Semester Exams:** College subject tests
  - ⚔️ **Competitive:** SSC CGL, Banking (IBPS/SBI), Railways (RRB)

### 2. 🤖 Google Gemini 2.0 AI Evaluation Engine
- **Instant Objective & Descriptive Grading:** Evaluates written solutions in seconds, providing a total score (0–100%) and percentage accuracy.
- **Step-by-Step Marking & Deduction Breakdown:** Highlights exactly where points were lost (calculation slips, missing theoretical formulas, poor explanation structure).
- **Missing Concepts Identification:** pinpoints specific formulas, theorems, or definitions that were omitted.
- **Model Exam-Ready Solutions:** Generates benchmark exemplar answers tailored to what top-ranking examiners look for.
- **Speed & Time-Management Diagnostics:** Measures whether the user's writing speed meets the required pace for competitive scoring.

### 3. 📱 Native-Like PWA & Android App Experience
- **Direct-to-Login Launch:** PWA app manifest configured with `start_url: "/auth?platform=android"`, presenting the mobile-optimized login screen as the very first screen.
- **Locked Viewport Physics (`100dvh`):** Entire mobile app view is strictly constrained to the dynamic viewport height (`100dvh`) with `overflow-hidden` and `overscroll-none`. **Zero sliding or rubber-band bouncing** on any Android device.
- **Adaptive Illustration & UI Scaling:** The study illustration and form elements scale responsively (`h-[18vh] min-h-[105px] max-h-[175px]`), guaranteeing a pristine fit on compact 5.5" phones and tall 20:9 displays alike.
- **Passwordless OTP-Only Sign-In:** Clean mobile authentication supporting **Email OTP** and **SMS OTP**, eliminating forgotten password frustrations.
- **Seamless Google OAuth:** One-tap Google authentication with clean centered "Or" separator.
- **Bored Hand Tapping Animation:** Playful retro loader that entertains the user during initial authentication and profile setup.
- **Post-Login Landing View:** Automatically directs users to the full Landing Page after successful authentication so they can choose their target exam.
- **Service Worker v5:** Instant offline caching, background asset updates, and background sync.

### 4. 🎙️ SOKHA — 3D AI Study Assistant with Voice Capabilities
- **Futuristic 3D Bot Character (`SokhaBotCharacter`):** Interactive floating cybernetic robot with animated LED visor eyes, blinking cycles, hover blush, and cyan thruster plasma.
- **1-Minute Interval Wakeup Cycle:** SOKHA automatically pops up its speech bubble every **1 minute (60s)**, stays awake for **5 seconds** displaying `"🔥 Awaken Your Focus! Ask doubts"`, and then smoothly fades to sleep using Framer Motion `<AnimatePresence>`.
- **First-Login Guidance System:** After logging in, SOKHA greets the student with `"👉 Click on your profile photo to unlock full potential!"` for 5 seconds while simultaneously triggering a glowing purple aura (`ring-4 ring-purple-500 scale-110`) and a bouncing `👆 Unlock Full Potential` tooltip over their profile photo.
- **Voice Search (Speech-to-Text):** Tap the microphone to dictate queries and complex study doubts in real-time.
- **AI Voice Speech Responses (Text-to-Speech):** Speaks answers out loud using the Web Speech Synthesis API.
- **Live Academic Web Search:** Live fact retrieval with verified web citations.
- **Thread Management:** Full history drawer, thread renaming, export, and granular deletion confirmations.

### 5. 📐 Formula Library & Cheatsheets
- **Curated Multi-Subject Formula Bank:** Fast access to core formulas across **Physics, Mathematics, Chemistry, Electrical Engineering, Algorithms, and Core CS**.
- **KaTeX LaTeX Math Rendering:** Crystal-clear typographic equations and expressions.
- **Filter by Exam & Category:** Instantly sort by GATE, JEE, or specific academic branches.
- **Accessible Across Devices:** Integrated directly into both the desktop navigation bar and the mobile 7-tab bar.

### 6. 🌐 Offline-First Architecture & Auto-Sync Engine
- **Local-First IndexedDB (`idb`):** All student answers, scratchpad notes, active session timers, and mock tests are saved instantly to local browser storage first.
- **Seamless Resilience:** If Wi-Fi drops or mobile network fails during an exam, the student continues writing without interruption.
- **Automatic Cloud Background Sync:** When network connectivity is restored, an offline queue reconciles and synchronizes all pending answers to Supabase PostgreSQL.
- **Animated Caveman Offline Screen (`OfflineScreen`):** Animated prehistoric caveman interface that slides into view upon network loss, featuring a real-time **"Retry Connection"** detector and **"Continue Offline"** option.
- **Custom Branded 404 Page:** Unique animated error screen for missing routes.

### 7. 🎨 Futuristic & Fluid UI/UX Micro-Interactions
- **Interactive Pull-Cord Light Bulb Toggle (`PullBulbToggle`):** A physical-feeling hanging incandescent bulb that students can drag and release with spring physics to toggle between Dark and Light mode.
- **Desktop Gooey Liquid Wave Navigation:** Fluid mercury-droplet bubble that glides and dips with GSAP timeline animation under the active navigation tab.
- **Purrweb Curved Mobile Tab Bar (`CurvedTabBar`):** 7-item bottom navigation bar (Home, Practice, Exams, Formulas, Badges, Stats, Me) featuring smooth SVG cutouts and spring icon elevation.
- **Wavy Exam Badges Showcase (`FeatureIdCards`):** Interactive exam identification cards displaying badges, syllabi, and official exam details.

### 8. 🏆 Gamification, Streaks, Medals & Badges
- **Dual-Tier Daily Streaks:** Rewards consistent daily study with streak counters, freeze shields, and daily minimum practice goals.
- **Tiered Achievement Medals:** Earn Bronze, Silver, Gold, Platinum, Diamond, Master, and Grandmaster badges based on speed, accuracy, and questions solved.
- **Confetti Celebrations:** Celebratory particles trigger when clearing difficult time thresholds and leveling up.
- **Personalized Warrior Profiles:** Avatar customization, percentile rankings, personal best records, and printable report certificates.

### 9. ⏰ Study Alarms & Notification Scheduler
- **Custom Study Alarms (`ReminderScheduler`, `/settings`):** Set daily recurring practice reminders to maintain study habits.
- **Browser Push Notifications:** Opt-in browser alerts reminding students when their battle against the clock is scheduled.

### 10. 🐍 Python Data Management & Exam Paper Parsing Suite
- **Modular Data Management CLI (`python -m data_manager`):** Complete backend ingestion toolkit located in `data_manager/`.
- **PyMuPDF PDF Parsing:** Extracts past-year question papers (GATE, JEE, etc.) from raw PDF documents.
- **LaTeX & Unicode NFKC Sanitization:** Cleans equations, removes duplicates, and standardizes mathematical formatting.
- **Direct Cloud Exporter:** Seamlessly outputs validated question sets into TypeScript files and Supabase SQL seed tables.

---

## 🛠️ Technology Stack

| Component | Technology | Role & Functionality |
|---|---|---|
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | React Server Components, Turbopack, dynamic routing |
| **Language** | [TypeScript 5.0](https://www.typescriptlang.org/) | End-to-end type safety across client and server |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern design tokens, dynamic CSS variables |
| **Typography** | `next/font/google` | Geist Sans, Geist Mono, and Arvo serif fonts |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL database, Auth with OTP, Row-Level Security |
| **Client Storage** | [IndexedDB (`idb`)](https://github.com/jakearchibald/idb) | Offline-first persistent storage for exam sessions |
| **Artificial Intelligence** | [@google/genai (Gemini 2.0)](https://ai.google.dev/) | Instant answer grading, SOKHA study assistant |
| **Speech & Audio** | Web Speech API | `SpeechRecognition` (voice input) & `SpeechSynthesis` (audio output) |
| **Math Rendering** | [KaTeX](https://katex.org/) | High-speed LaTeX mathematical equation typography |
| **Animations & Physics** | [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) | Liquid nav indicators, spring interactions, 3D bot bobs |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography |
| **Data Visualization** | [Recharts](https://recharts.org/) | Performance speed curves, accuracy radar charts |
| **PWA & Offline** | Service Worker (`public/sw.js`) | Offline cache v5, background sync, manifest |
| **Data ETL Pipeline** | Python 3 + PyMuPDF | Question extraction, sanitization, and SQL generation |

---

## 📂 Project Architecture

```text
samayyudh-2.0/
├── data/                         # Question datasets and modular exam banks
│   ├── questions/                # Cleaned question JSON banks (GATE, JEE, UPSC, etc.)
│   └── raw/                      # Raw incoming PDF/CSV/text test papers
├── data_manager/                 # Python 3 Data Management Package
│   ├── cli.py                    # Interactive CLI runner
│   ├── models.py                 # Dataclasses matching TS schemas
│   ├── cleaner.py                # Unicode normalization & math sanitizer
│   ├── repository.py             # Local question bank manager
│   ├── extractors/               # PyMuPDF and text extractors
│   └── exporters/                # Supabase SQL & TypeScript question exporters
├── public/                       # Static public assets
│   ├── illustrations/            # Study art & transparent app illustrations
│   ├── logos/                    # Official exam logos (GATE, JEE, UPSC, etc.)
│   ├── manifest.json             # PWA Web App Manifest (start_url: /auth?platform=android)
│   ├── offline.html              # Standalone offline emergency fallback
│   └── sw.js                     # Service Worker v5 (offline caching & background sync)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (app)/                # Authenticated App Shell
│   │   │   ├── dashboard/        # Main student battle command center
│   │   │   ├── practice/         # Question practice engine
│   │   │   ├── exams/            # Available competitive exam catalogues
│   │   │   ├── formulas/         # Searchable Formula Library
│   │   │   ├── achievements/     # Streaks, badges, and medal showcases
│   │   │   ├── analytics/        # Speed and score diagnostic charts
│   │   │   ├── history/          # Historical exam attempt logs
│   │   │   ├── notes/            # Saved scratchpads and study notes
│   │   │   ├── profile/          # User profile, warrior name, avatar picker
│   │   │   ├── settings/         # Alarms, notifications, audio toggles
│   │   │   └── layout.tsx        # Shell layout with desktop/mobile navbar
│   │   ├── api/                  # Serverless API routes
│   │   │   ├── evaluate/         # Gemini 2.0 answer evaluation endpoint
│   │   │   ├── razorpay/         # Optional payment gateway routes
│   │   │   └── sync/             # Background synchronization endpoints
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── callback/         # OAuth PKCE redirect handler with Bored Hand loader
│   │   │   └── page.tsx          # Adaptive Web & Android login coordinator
│   │   ├── exam/                 # Live full-screen timed exam battle interface
│   │   ├── globals.css           # Tailwind CSS variables and global theme styles
│   │   ├── layout.tsx            # Root HTML layout, ThemeInitializer, Sokha, Offline
│   │   ├── not-found.tsx         # Animated 404 page
│   │   └── page.tsx              # Main Landing Page with Exam Badges & Hero
│   ├── components/               # UI Component Hierarchy
│   │   ├── achievements/         # Badges, medals, confetti triggers
│   │   ├── auth/                 # AndroidLoginView (100dvh locked), AndroidSplashScreen
│   │   ├── exam/                 # Timers, Question cards, Answer editor, Navigation
│   │   ├── home/                 # FeatureIdCards, DonationTicket
│   │   ├── layout/               # Navbar (Gooey GSAP desktop, CurvedTabBar mobile)
│   │   ├── notifications/        # ReminderScheduler background alarm checker
│   │   ├── offline/              # Animated Caveman OfflineScreen
│   │   ├── providers/            # AuthProvider, ThemeInitializer
│   │   ├── sokha/                # SokhaWidget, SokhaBotCharacter, SokhaMarkdown
│   │   ├── BoredHandLoader.tsx   # Retro bored hand tapping loader
│   │   ├── OmnitrixLoader.tsx    # Ben 10 Omnitrix battle preparation animation
│   │   ├── PullBulbToggle.tsx    # Hanging pull-cord incandescent theme switch
│   │   └── ThemeToggle.tsx       # Standard light/dark switch
│   ├── lib/                      # Core business logic & SDK integrations
│   │   ├── achievements/         # Streak calculation & medal criteria
│   │   ├── sokha/                # Gemini client, conversation storage, voice engine
│   │   ├── store/                # local-db (IndexedDB), sync-engine, exam-store
│   │   ├── supabase/             # Supabase client helpers
│   │   ├── avatars.ts            # Avatar presets & custom selection
│   │   ├── gemini.ts             # Evaluation prompts & scoring algorithms
│   │   └── platform.ts           # Android standalone app detection
│   └── types/                    # Shared TypeScript interfaces & types
├── supabase/                     # SQL database migrations and seed scripts
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in your root directory:

```env
# ── Supabase Cloud Database & Authentication ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ── Google Gemini AI ──
GEMINI_API_KEY=your-google-gemini-api-key

# ── Razorpay (Optional - for donation / test pack checkouts) ──
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

---

## 🏃 Local Setup & Development

### 1. Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** or **pnpm**
- **Python 3.10+** (only if utilizing the `data_manager` question ETL pipeline)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/SanuSamanta-oss/Samayyudh-2.0.git
cd Samayyudh-2.0

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build & Verification
```bash
# Verify TypeScript strict type-checking
npx tsc --noEmit

# Compile production build
npm run build

# Start production server
npm start
```

---

## 🔒 Security, Data Privacy & Reliability

1. **Student Work Protection:** Written answers are immediately committed to client-side **IndexedDB**, guaranteeing that browser crashes or battery cutouts do not result in lost work.
2. **Encrypted Row-Level Security (RLS):** All user scores, exam submissions, and profile information stored in Supabase are governed by strict RLS policies accessible only by the authenticated owner.
3. **Privacy-Preserving AI Scoring:** Personal identifying data (email, name, device data) is scrubbed before prompts are evaluated by the Google Gemini API.

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for complete details.

---

<p align="center">
  <b>সময়যুদ্ধ 2.0 — The Battle Between You & The Clock</b><br>
  <i>Built with 💜 for ambitious students who refuse to lose to time.</i>
</p>
