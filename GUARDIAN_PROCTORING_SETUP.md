# SAMAYYUDH 2.0 — GUARDIAN CONNECT & HYBRID PROCTORING
## Complete Architecture, Setup & Production Deployment Specification

---

### 1. Architectural Overview

The **Guardian Connect & Hybrid Examination Supervision Ecosystem** brings real-time transparency, physical attendance invigilation, and WebRTC live proctoring into a single, unified academic platform.

```
                              ┌─────────────────────────────────────────┐
                              │            STUDENT EXAM HUB             │
                              │  - Pre-Exam Camera Check                │
                              │  - Circular Floating HUD Bubble         │
                              │  - Non-Scientific Basic Calculator      │
                              │  - Dynamic Signed QR Invigilation Pass  │
                              └───────────────────┬─────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
┌─────────────────────────────────┐                               ┌─────────────────────────────────┐
│     GUARDIAN CONNECT PORTAL     │                               │   TEACHER LIVE SUPERVISION HUB  │
│  - Progressive 5-Step Onboard   │                               │  - Mode A: Remote Monitoring    │
│  - 6-Digit Mobile & Email OTP   │                               │  - Mode B: QR Physical Scan     │
│  - LCG Unique Parent Identity   │                               │  - Mode C: Meet-Style Face Live │
│  - Read-Only Live Stream View   │                               │  - Live Advisories & Telemetry  │
│  - Event Notifications (SMS/App)│                               │  - LCT Unique Faculty Identity  │
└─────────────────────────────────┘                               └─────────────────────────────────┘
```

---

### 2. Unique Concurrency-Safe Identification System

| Entity | Code Format | Generation Function | Sequence | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `LCE%03d` | `generate_unique_identity_code('student')` | `seq_student_lce` | `LCE001` |
| **Guardian** | `LCG%03d` | `generate_unique_identity_code('guardian')` | `seq_guardian_lcg` | `LCG001` |
| **Teacher / Invigilator** | `LCT%03d` | `generate_unique_identity_code('teacher')` | `seq_teacher_lct` | `LCT001` |
| **Examination** | `LCE-EX-%04d` | `generate_unique_identity_code('examination')` | `seq_exam_lce` | `LCE-EX-0001` |
| **Live Session** | `LCS-YYYY-%04d` | `generate_unique_identity_code('session')` | `seq_session_lcs` | `LCS-2026-0001` |

---

### 3. Database Migration Deployment

To deploy the schema to your Supabase PostgreSQL instance:

1. Open your **Supabase Dashboard** &rarr; **SQL Editor**.
2. Run the migration script located at:
   ```
   supabase/guardian_hybrid_proctoring.sql
   ```
3. The migration is idempotent and sets up:
   - Database sequences (`seq_student_lce`, `seq_guardian_lcg`, `seq_teacher_lct`, etc.)
   - Unique identity codes table (`public_identity_codes`)
   - Guardian profiles (`public.guardian_profiles`)
   - Guardian-student relationships (`public.guardian_student_relationships`)
   - Independent verification records (`public.guardian_verification_records`)
   - Notification preferences & audit outbox (`public.guardian_notification_logs`, `public.notification_outbox`)
   - QR physical verification tokens & events (`public.qr_verification_tokens`, `public.qr_verification_events`)
   - Multi-viewer access permissions & presence tracking (`public.guardian_access_permissions`, `public.proctoring_viewers`)

---

### 4. Environment Variables Configuration

Add the following environment variables to `.env.local` or your production deployment manager:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# QR Cryptographic Signing Salt
ADMIN_JWT_SECRET=your-secure-random-256-bit-key

# SMS & OTP Carrier Configuration (Twilio / MSG91 / Fast2SMS)
SMS_PROVIDER=msg91 # or twilio
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=SAMAYD

# Email Gateway Configuration (Resend / SendGrid / Postmark)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM="SamayYudh Invigilation <notifications@samayyudh.com>"

# WebRTC & STUN / TURN Configuration
NEXT_PUBLIC_ICE_SERVERS='[{"urls":["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302"]}]'
```

---

### 5. Multi-Mode Invigilation Workflow

#### Mode A: Live Remote Monitoring
- Teachers view a responsive grid of active student examinees.
- Each tile displays student name, `LCE` code, examination title, elapsed time, and camera/network signal badges.
- Real-time search by candidate name or LCE code, filtering by classroom or anomaly flags.

#### Mode B: QR Physical Verification
- Invigilators point mobile camera at student's examination pass or screen.
- Scans signed single-use token (`SYQR:...`) with automatic 10-minute expiry and anti-replay protection.
- Instant attendance confirmation with candidate name, photo, and LCE code matching.
- Manual fallback code entry available if student camera or screen is damaged.

#### Mode C: Live Face Supervision (Meet-Inspired)
- Large central video feed with high-contrast metadata overlays.
- Real-time telemetry sidebar showing question answering velocity, window blur events, and intervention history.
- Invigilator toolbar providing fullscreen viewing, warnings, exam pause, and live advisories.

---

### 6. Guardian Connect Experience

1. **First-Time Student Onboarding**:
   - Progressive 5-step modal introduces parental supervision transparency.
   - Collects guardian full name, relationship, mobile, and email.
   - Independent 6-digit mobile OTP verification with 60s cooldown and automatic digit advancement.
   - Independent 6-digit email confirmation.
   - Generates and presents `LCG` code and `LCE` linked pairing card.
2. **Guardian Dashboard (`/guardian` or `/parent`)**:
   - Mobile-first, responsive interface.
   - Shows linked children and active examination banner.
   - Read-only WebRTC video feed during scheduled tests.
   - Automatic termination when candidate submits or test concludes.
   - Real-time notification log (exam start, submission, advisories).

---

### 7. Quality Assurance & Verification Checklist

- [x] **Zero Emojis**: Codebase uses pure Lucide vector iconography throughout.
- [x] **Zero Outlines**: All interactive cards, inputs, and buttons use borderless and low-contrast surface styling (`border-0 outline-none`).
- [x] **Dark & Light Themes**: All components natively adapt to dark (#101218 / #171B24) and light (#F7F8FC / #FFFFFF) surfaces.
- [x] **Concurrency Safety**: Sequence-based ID generation prevents duplicate LCE/LCG/LCT codes under high load.
- [x] **Type Safety**: Verified clean compilation with `npx tsc --noEmit`.
- [x] **Production Build**: Verified with Next.js webpack production build.
