# সময়যুদ্ধ 2.0 — SamayYudh
> **The Battle Between You & The Clock**  
> An AI-powered, offline-first exam preparation and practice platform for competitive examinations (GATE, JEE, WBJEE, UPSC, NEET, University, and more).

[![Live Website](https://img.shields.io/badge/Live_Site-samayyudh--2--0.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://samayyudh-2-0.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://samayyudh-2-0.vercel.app/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](LICENSE)

🔗 **Live Deployment:** [https://samayyudh-2-0.vercel.app/](https://samayyudh-2-0.vercel.app/)

---

## 🌟 Overview

**SamayYudh 2.0** helps students practice high-stakes exam questions under realistic time pressure. It features real-time answer evaluation powered by Google Gemini AI, seamless offline-first exam taking, automatic background cloud synchronization, gamified streaks & achievements, and an intelligent interactive assistant (**SOKHA**) equipped with voice search and speech response capabilities.

---

## 🚀 Key Features

### ⏱️ Real-Time Exam Simulator & Practice
- **Realistic Time Pressure:** Countdown timers, section pacing, and speed tracking simulating real test conditions.
- **Rich Answer Canvas & Scratchboard:** Write or type long-form solutions, take sticky notes, and manage answer revisions.
- **Support for Major Competitive Exams:** Curated question banks for **GATE, JEE Mains, JEE Advanced, WBJEE, UPSC, NEET, SSC, and University Examinations**.

### 🤖 AI Evaluation & Instant Grading
- **Google Gemini 2.0 AI Integration:** Instant evaluation of user-written answers with step-by-step scoring, breakdown of mistakes, and model exam-ready solutions.
- **Performance Analytics & Diagnostic Insights:** Deep breakdowns across subjects, topics, speed, and accuracy.

### 🌐 Offline-First Architecture & Auto-Sync
- **Zero Data Loss:** Never lose exam progress during internet cuts or network drops.
- **IndexedDB Local Storage:** Exam answers, session timers, sticky notes, and mock tests persist instantly on the user's device.
- **Automatic Cloud Sync:** Answers queued in an offline queue are automatically synchronized to Supabase PostgreSQL when internet connectivity is restored.
- **Interactive Offline Mode Screen:** A dedicated animated caveman overlay automatically notifies the user when disconnected, providing real-time reconnection checking and a "Continue in Offline Mode" option.
- **Creative 404 Error Screen:** Custom branded animation for missing routes and broken links.

### 🎙️ SOKHA — AI Study Assistant with Voice Capabilities
- **Animated 3D Companion:** An animated, expressive floating robot with life-like bobs, visor scans, and glow effects.
- **Voice Search (Speech-to-Text):** Search questions or ask doubts directly by speaking via the microphone.
- **AI Voice Answers (Text-to-Speech):** High-quality natural voice generation reads answers aloud (up to 3 voice answers limit).
- **Web Search Integration:** Live academic fact retrieval and reference citations.

### 🏆 Gamification, Streaks & Achievements
- **Dual-Tier Streaks:** Track consecutive study days, freezing logic, and qualifying daily goals.
- **Badges & Medals:** Unlock tier-based medals (Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster) with celebratory confetti.
- **Customizable Avatar Profile:** High-res avatar picker, personal best records, and social sharing cards.

### 📱 Progressive Web App (PWA)
- **Installable Desktop & Mobile App:** Native-like full-screen experience on Android, iOS, Windows, and macOS.
- **Custom Service Worker:** Offline asset caching for rapid load times and resilience.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | React Server Components, Turbopack, SSR, API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type-safety across client and server |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS variables, design tokens, responsive utilities |
| **Typography** | `next/font/google` | Geist, Geist Mono, and Arvo serif fonts |
| **Cloud Database & Auth** | [Supabase](https://supabase.com/) | Managed PostgreSQL, Row-Level Security (RLS), Supabase Auth |
| **Local Database** | [IndexedDB (`idb`)](https://github.com/jakearchibald/idb) | Client-side persistent storage for offline-first capabilities |
| **Data Management** | [Python 3 (`data_manager/`)](docs/DATA_MANAGEMENT.md) | Question ETL, PyMuPDF paper parsing, validation, Supabase/TS sync |
| **Artificial Intelligence** | [@google/genai (Gemini 2.0)](https://ai.google.dev/) | Answer scoring, step-by-step critique, SOKHA companion |
| **Voice & Speech APIs** | Web Speech API | `SpeechRecognition` (voice input) & `SpeechSynthesis` (voice output) |
| **Animations & Physics** | [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) | Fluid UI micro-interactions and floating physics |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Charts & Visualization** | [Recharts](https://recharts.org/) | Subject accuracy, time-spent trends, and score analytics |
| **Payments** | [Razorpay](https://razorpay.com/) | Secure checkout for premium exam mock packs |
| **PWA** | Service Worker (`sw.js`) | Offline cache-first asset storage & Web App Manifest |

---

## 📂 Project Structure

```text
samayyudh-2.0/
├── data/                   # Structured question banks and raw ingestion datasets
│   ├── questions/          # Modular exam JSON banks (GATE, JEE, UPSC, NEET, etc.)
│   └── raw/                # Staging folder for raw PDF/CSV/TXT question dumps
├── data_manager/           # Python 3 Data Management Package
│   ├── cli.py              # CLI suite (python -m data_manager)
│   ├── models.py           # Dataclass models matching database & TS interfaces
│   ├── cleaner.py          # Math unicode NFKC sanitization & deduplication
│   ├── repository.py       # Local question repository manager
│   ├── extractors/         # Parsers for PDF (PyMuPDF), CSV, JSON, and Raw Text
│   └── exporters/          # Exporters for TypeScript, Supabase SQL, and Cloud sync
├── public/                 # Static assets, icons, logos, manifest.json, sw.js
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (app)/          # Main dashboard, profile, analytics, exams, history
│   │   ├── api/            # Serverless API routes (Gemini, Supabase, Razorpay)
│   │   ├── auth/           # Authentication login/signup pages
│   │   ├── exam/           # Live interactive exam session
│   │   ├── globals.css     # Global styles, Tailwind configuration, design tokens
│   │   ├── layout.tsx      # Root layout, theme provider, offline screen mount
│   │   ├── not-found.tsx   # Custom animated 404 page
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable UI components
│   │   ├── achievements/   # Streaks, badges, medals, progress cards
│   │   ├── exam/           # Timer, Question card, Answer editor, Navigator
│   │   ├── layout/         # Navbar, footer, navigation controls
│   │   ├── offline/        # OfflineScreen network listener component
│   │   ├── providers/      # AuthProvider, ThemeInitializer
│   │   └── sokha/          # SOKHA assistant, SokhaBotCharacter, SokhaOrb
│   ├── lib/                # Core utilities and business logic
│   │   ├── achievements/   # Streak engine, achievement definitions
│   │   ├── sokha/          # Gemini companion logic and storage
│   │   ├── store/          # local-db (IndexedDB), sync-engine, exam-store
│   │   ├── supabase/       # Supabase client and server helpers
│   │   ├── gemini.ts       # AI answer evaluation prompts and logic
│   │   └── questions.ts    # Competitive exam question banks
│   └── types/              # TypeScript interfaces and schema declarations
├── supabase/               # SQL migrations, schema, and question seed files
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay (Optional - for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🏃 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Offline & Data Privacy
- Written answers are stored directly on the user's browser in IndexedDB first, ensuring student work is never lost due to unexpected disconnections.
- User data syncing uses encrypted Supabase Row-Level Security (RLS) policies.
- AI evaluations redact sensitive user identifiers before prompt submission.

---

## 📄 License
This project is open-source software licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).
