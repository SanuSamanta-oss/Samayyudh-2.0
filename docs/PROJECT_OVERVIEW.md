# সময়যুদ্ধ 2.0 — SamayYudh 2.0

> **The Battle Between You & The Clock**

A universal exam time-pressure simulator for academic and competitive examinations. Students practice writing real answers under realistic time pressure, track their speed, and get AI-powered feedback on exam readiness.

## Architecture

```
SamayYudh 2.0 (Next.js 16 / App Router)
├── Universal Exam Engine (config-driven, not per-exam code)
├── Multi-Exam Support (GATE, JEE, WBJEE, UPSC, University, Competitive, Custom)
├── Local-First Storage (IndexedDB via idb — works offline)
├── Supabase Auth (Email OTP / Phone OTP — scaffold ready)
├── Gemini AI Evaluation (Phase 4 — scaffold ready)
└── Recharts Analytics (Phase 5 — scaffold ready)
```

## Tech Stack

| Layer        | Technology                  |
|-------------|----------------------------|
| Framework   | Next.js 16.3.6 (App Router, Turbopack) |
| Language    | TypeScript 5               |
| Styling     | Tailwind CSS 4             |
| Animations  | Framer Motion              |
| Icons       | Lucide React               |
| Local DB    | IndexedDB (idb)            |
| Auth        | Supabase Auth (scaffold)   |
| AI          | Gemini API (scaffold)      |
| Charts      | Recharts                   |
| Forms       | React Hook Form + Zod      |

## Routes

| Route           | Purpose                     |
|----------------|-----------------------------|
| `/`            | Landing page                |
| `/auth`        | Login (Email/Phone OTP)     |
| `/dashboard`   | Home dashboard              |
| `/practice`    | Exam setup wizard           |
| `/exams`       | Exam category listing       |
| `/exam/session`| Active exam interface       |
| `/results`     | Post-exam results           |
| `/questions`   | Question bank browser       |
| `/history`     | Past sessions               |
| `/analytics`   | Performance insights        |
| `/notes`       | Sticky notes collection     |
| `/profile`     | User profile                |

## Exam Engine Rules

- **2-mark** → 2 minutes recommended
- **5-mark** → 6 minutes recommended
- **10-mark** → 12 minutes recommended
- Timer survives refresh (persisted `endsAt` timestamp)
- Answers auto-save to IndexedDB (debounced 2s)
- Milestone celebrations at 50 (Half Century 🏏) and 100 (Century 🏆)

## Supported Exams (Config-Driven)

GATE · JEE Main · JEE Advanced · WBJEE · UPSC · SSC · Banking · Railway · CAT · NEET · University · Custom

New exams are added via configuration, not code changes.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Copy and configure environment
cp .env.example .env.local
```

## Phase Status

| Phase | Feature              | Status    |
|-------|---------------------|-----------|
| 1     | Foundation          | ✅ Done    |
| 2     | Question System     | ✅ Done    |
| 3     | Exam Engine (UI)    | ✅ Done    |
| 4     | AI Evaluation       | ✅ Done    |
| 5     | Analytics           | ✅ Done    |
| 6     | Reporting           | ✅ Done    |
| 7     | Mobile Optimization | ✅ Responsive |
| 8     | Admin Dashboard     | ✅ Done    |
