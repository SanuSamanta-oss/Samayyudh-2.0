import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_samayyudh_presentation(output_path="SamayYudh_2.0_Project_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette - Modern Deep Navy / Slate with Indigo & Emerald Accents
    BG_DARK = RGBColor(11, 17, 32)        # #0B1120
    BG_CARD = RGBColor(26, 36, 56)        # #1A2438
    CARD_BORDER = RGBColor(46, 60, 88)    # #2E3C58
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_LIGHT = RGBColor(203, 213, 225)  # #CBD5E1
    ACCENT_INDIGO = RGBColor(99, 102, 241)# #6366F1
    ACCENT_PURPLE = RGBColor(168, 85, 247)# #A855F7
    ACCENT_EMERALD = RGBColor(16, 185, 129)# #10B981
    ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B
    ACCENT_CYAN = RGBColor(6, 182, 212)   # #06B6D4

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, category, title, subtitle=None):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(1.2))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Category Pill / Tag
        p_cat = tf.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_INDIGO
        p_cat.space_after = Pt(4)

        # Title
        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_after = Pt(2)

        # Subtitle
        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title, items, tag=None, tag_color=ACCENT_INDIGO, bg_color=BG_CARD):
        # Card Background Box
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.25), Inches(width - 0.5), Inches(height - 0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        first_p = tf.paragraphs[0]
        if tag:
            first_p.text = tag.upper()
            first_p.font.size = Pt(10)
            first_p.font.bold = True
            first_p.font.color.rgb = tag_color
            first_p.space_after = Pt(4)
            p_title = tf.add_paragraph()
        else:
            p_title = first_p

        p_title.text = title
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_after = Pt(10)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(12)
            p_item.font.color.rgb = TEXT_LIGHT
            p_item.space_after = Pt(6)

        return card

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)

    # Accent decorative banner shape
    glow = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.12), Inches(4.0))
    glow.fill.solid()
    glow.fill.fore_color.rgb = ACCENT_INDIGO
    glow.line.fill.background()

    tb1 = slide1.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(11.0), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "SAMAYYUDH 2.0  |  সময়যুদ্ধ ২.০"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.space_after = Pt(10)

    p = tf1.add_paragraph()
    p.text = "The Battle Between You & The Clock"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "Universal Examination Time-Pressure Simulator & Competitive Prep Ecosystem\nEngineered for JEE Main, JEE Advanced, NEET, GATE, UPSC & College Boards"
    p.font.size = Pt(16)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(36)

    p = tf1.add_paragraph()
    p.text = "✦ Next.js 16 + React 19  ✦ 100% Offline PWA  ✦ Gemini AI Evaluation  ✦ SOKHA AI Companion  ✦ 206+ Formulas"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    # =========================================================================
    # SLIDE 2: The Problem & The Mission
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "The Crisis & Mission", "Why SamayYudh 2.0 Was Built", "Overcoming the psychological trap of examination clock panic.")

    add_card(slide2, 0.8, 1.8, 3.64, 5.0, "The Clock Panic Trap", [
        "85% of competitive exam failures stem not from lack of conceptual grasp, but from panic against the ticking clock.",
        "Students freeze, mismanage marks allocation, and leave solvable high-yield questions untouched.",
        "Standard test series provide static mock tests without active pacing biofeedback or speed-accuracy calibration.",
    ], tag="The Problem", tag_color=RGBColor(239, 68, 68))

    add_card(slide2, 4.84, 1.8, 3.64, 5.0, "The SamayYudh Philosophy", [
        "Treat exam preparation as an athletic endurance battle: mind versus time limit.",
        "Marks-to-Time Proportioning: Every question type has an exact golden time quota (2m, 6m, 12m).",
        "Neurological Conditioning: Frequent high-intensity micro-battles train calm decision making under pressure.",
    ], tag="The Methodology", tag_color=ACCENT_INDIGO)

    add_card(slide2, 8.88, 1.8, 3.64, 5.0, "The Product Solution", [
        "Simulation-First Workspace: Real-time timers, distraction-free answer pad, auto-save every 2 seconds.",
        "100% Offline-Resilient: Powered by client-side IndexedDB & Service Worker (PWA).",
        "AI Evaluation with Timing Telemetry: Gemini AI analyzes not just answer accuracy, but answer pace.",
    ], tag="The Platform", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 3: System Architecture & Tech Stack
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "Engineering Architecture", "Production Technology Stack", "Engineered for blistering speed, offline resilience, and mathematical precision.")

    add_card(slide3, 0.8, 1.8, 2.7, 5.0, "Frontend Core", [
        "Next.js 16 (App Router)",
        "React 19 & Turbopack",
        "Tailwind CSS v4 Engine",
        "Framer Motion Springs",
        "Dual Dark/Light Themes",
        "100% Responsive Grid",
    ], tag="Client Tier", tag_color=ACCENT_CYAN)

    add_card(slide3, 3.8, 1.8, 2.7, 5.0, "Mathematical Engine", [
        "KaTeX Full Typesetting",
        "206+ Math Formulations",
        "SI Constants Matrix",
        "Physics Equations Suite",
        "LaTeX Source & Preview",
        "IUPAC Reaction Chains",
    ], tag="Math & Science", tag_color=ACCENT_PURPLE)

    add_card(slide3, 6.8, 1.8, 2.7, 5.0, "AI & Intelligence", [
        "Google Gemini 2.5 Flash",
        "SOKHA Study Companion",
        "Rubric-based AI Scoring",
        "Timing Pace Diagnostics",
        "Google Search Grounding",
        "Zero-NSFW Privacy Engine",
    ], tag="Intelligence", tag_color=ACCENT_INDIGO)

    add_card(slide3, 9.8, 1.8, 2.7, 5.0, "Storage & PWA", [
        "Client-side IndexedDB",
        "Service Worker (sw.js)",
        "Zero-Loss 2s Auto-save",
        "Supabase Auth & Sync",
        "Razorpay Payments",
        "Local Diagram Cache",
    ], tag="Infrastructure", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 4: The Time-Pressure Engine
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "Core Innovation", "The Examination Time-Pressure Engine", "Translating mark allocations into disciplined, reflexive timing rules.")

    add_card(slide4, 0.8, 1.8, 3.64, 5.0, "Marks-to-Time Quotas", [
        "2-Mark Questions → 2 Minutes: Fast conceptual deduction, definition, formula statement, and core calculation.",
        "5-Mark Questions → 6 Minutes: Detailed stepwise proof, intermediate diagrams, and algebraic derivation.",
        "10-Mark Questions → 12 Minutes: Full essay / engineering derivation with boundary cases and conclusions.",
    ], tag="Timing Rules", tag_color=ACCENT_AMBER)

    add_card(slide4, 4.84, 1.8, 3.64, 5.0, "Session Resilience", [
        "Persistent Timer: Timestamps are stored in local storage; timer continues uninterrupted across reloads.",
        "Zero Work Loss: Answers are saved every 2 seconds into IndexedDB; accidental crashes lose zero progress.",
        "Sticky Scratchpad: Embedded drawer for calculations without switching browser tabs or windows.",
    ], tag="Zero Failure", tag_color=ACCENT_INDIGO)

    add_card(slide4, 8.88, 1.8, 3.64, 5.0, "Battle Formats", [
        "Quick Battle (10 Qs, ~10m): High-speed sprint to maintain daily study streaks.",
        "Practice Battle (25 Qs, ~25m): Standard chapter-wise revision workout.",
        "Half Century (50 Qs, ~50m): Rigorous mid-length endurance trial 🏏.",
        "Full Century (100 Qs, ~100m): Comprehensive multi-topic marathon 🏆.",
    ], tag="Battle Modes", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 5: Explore PYQ Module (Previous Year Questions)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Question Repository", "Explore PYQ Module (/pyq)", "1,352+ digitized questions with authentic diagrams and one-click battle mode.")

    add_card(slide5, 0.8, 1.8, 3.64, 5.0, "JEE Main 2025 Archive", [
        "22 January Shift 1 & Shift 2 fully transcribed and structured.",
        "Section A: 20 Multiple Choice Questions with instant option verification and LaTeX explanations.",
        "Section B: 5 Numerical Value Questions with direct numerical inputs.",
        "Filterable by subject, shift, and question type with zero corruptions.",
    ], tag="JEE Main", tag_color=ACCENT_CYAN)

    add_card(slide5, 4.84, 1.8, 3.64, 5.0, "JEE Advanced 95 Chapters", [
        "Complete 95-chapter coverage extracted from verified examination sources:",
        "• Physics: 33 chapters (Kinematics to Modern Physics, 388 Qs)",
        "• Chemistry: 31 chapters (Physical, Inorganic, Organic, 306 Qs)",
        "• Mathematics: 31 chapters (Calculus, Conics, 3D, 300 Qs)",
        "Total 994 JEE Advanced questions synchronized in pyq_database.json.",
    ], tag="JEE Advanced", tag_color=ACCENT_PURPLE)

    add_card(slide5, 8.88, 1.8, 3.64, 5.0, "Visuals & Battle Actions", [
        "394 Local Diagrams: Stored locally in public/jee_advanced_diagrams/ with zero broken web links.",
        "Chemical Reaction Schemes: Exact IUPAC reaction flowcharts and organic mechanisms.",
        "'Solve in Battle': Instantly opens any question into a timed battle session.",
        "'Battle This Section': Takes an entire paper section into exam simulation.",
    ], tag="Live Integration", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 6: Complete Mathematics Formula Library
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "Mathematical Suite", "Comprehensive Formula Library (/formulas)", "206+ mathematical formulations across all 6 curriculum divisions.")

    add_card(slide6, 0.8, 1.8, 3.64, 5.0, "6 Core Curriculum Divisions", [
        "Div 1: Algebra & Polynomials (Quadratics, AP, Binomial, Matrices, Complex - 40 Qs)",
        "Div 2: Differential & Integral Calculus (Limits, Derivatives, Integrals, ODEs - 43 Qs)",
        "Div 3: Trigonometry & Inverses (Identities, Compound, Multiples, Inverses - 32 Qs)",
        "Div 4: Coordinate Geometry (Lines, Circles, Parabolas, Ellipses, Hyperbolas - 32 Qs)",
        "Div 5: Vectors & 3D (Dot, Cross, Direction Cosines, Planes, Skew Lines - 24 Qs)",
        "Div 6: Probability & Stats (Dispersion, Bayes, Binomial, Poisson, Normal - 35 Qs)",
    ], tag="Curriculum Structure", tag_color=ACCENT_INDIGO)

    add_card(slide6, 4.84, 1.8, 3.64, 5.0, "Smooth Slide-In Detail View", [
        "Spring-animated slide-over drawer triggered on formula selection.",
        "Displays complete KaTeX rendered equation, variable definitions table, and applicable domains.",
        "Supports keyboard shortcuts: Left/Right arrows to flip formulas, Esc to dismiss.",
        "One-click LaTeX code copy button with instant feedback.",
    ], tag="Interactive UX", tag_color=ACCENT_CYAN)

    add_card(slide6, 8.88, 1.8, 3.64, 5.0, "Physics & SI Constants", [
        "Physics Formula Library: Comprehensive level-wise catalog for Class 10, 11, 12, and Higher Education.",
        "20 SI Physical Constants: Speed of light c, Planck h, G, electron charge e, Boltzmann kB, and Stefan-Boltzmann.",
        "Dimensional formulas, exact SI units, and relational defining formulas included for every constant.",
    ], tag="Physics & Constants", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 7: SOKHA — The Official AI Study Companion
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, "Artificial Intelligence", "SOKHA — AI Study Companion", "Context-aware, zero-NSFW mentor with living memory of the entire platform.")

    add_card(slide7, 0.8, 1.8, 3.64, 5.0, "Living Platform Memory", [
        "Real-Time Page Awareness: Receives student's live route (/pyq, /formulas, /practice) and offers targeted shortcuts.",
        "Complete Feature Map: Knows every examination, timing rule, battle mode, formula division, and PYQ paper.",
        "Future-Ready Adaptability: Seamlessly guides students through platform expansions and updates.",
    ], tag="Cognitive Memory", tag_color=ACCENT_PURPLE)

    add_card(slide7, 4.84, 1.8, 3.64, 5.0, "Academic Safeguards", [
        "Strict Zero-Tolerance NSFW Policy: Rejects sexual, erotic, romantic, or non-academic inputs immediately and politely.",
        "PII Redaction: Protects student identities, phone numbers, and emails with client/server redaction.",
        "Anti-Jailbreak Protection: Neutralizes prompt injection, hypothetical bypasses, and roleplay attempts.",
    ], tag="Safety & Security", tag_color=RGBColor(239, 68, 68))

    add_card(slide7, 8.88, 1.8, 3.64, 5.0, "Interactive Experience", [
        "3D Futuristic Character & Doctor Strange Mystic Chakra visuals.",
        "Natural Voice Synthesis: Uses human-tuned companion speech synthesis.",
        "Markdown & KaTeX Math Formatter: Outputs clean equations, tables, and verified citations.",
        "Google Search Grounding: Pulls real-time academic facts when needed.",
    ], tag="User Experience", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 8: AI Evaluation & Rubric Scoring
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "Assessment Intelligence", "AI Evaluator & Timing Telemetry", "Transforming post-exam feedback with quantitative pace diagnostics.")

    add_card(slide8, 0.8, 1.8, 3.64, 5.0, "Rubric-Based Scoring", [
        "Powered by Google Gemini AI with customized examination rubrics.",
        "Scores across content depth, conceptual correctness, mathematical derivation, and structuring.",
        "Identifies overlooked assumptions and step omissions.",
    ], tag="Qualitative Review", tag_color=ACCENT_INDIGO)

    add_card(slide8, 4.84, 1.8, 3.64, 5.0, "Pace Telemetry", [
        "Categorizes answer speed into three definitive behavioral zones:",
        "• Too Fast: Rushed submission, missing intermediate derivation steps and nuances.",
        "• On Time: Optimal pace, high precision, balanced time-to-mark ratio.",
        "• Too Slow: Correct but exceeded quota; incurs time-overrun penalty.",
    ], tag="Pacing Diagnostics", tag_color=ACCENT_AMBER)

    add_card(slide8, 8.88, 1.8, 3.64, 5.0, "Actionable Feedback", [
        "Generates clean model answers for every submitted question.",
        "Provides constructive examiner remarks tailored to the student's level.",
        "Saves all evaluations in History (/history) for periodic review.",
    ], tag="Continuous Growth", tag_color=ACCENT_EMERALD)

    # =========================================================================
    # SLIDE 9: Examination Syllabus Coverage
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, "National Coverage", "Supported Competitive Examinations", "Unified training ecosystem covering India's toughest academic and civil selections.")

    add_card(slide9, 0.8, 1.8, 2.7, 5.0, "Engineering", [
        "JEE Main (Paper 1 & 2)",
        "JEE Advanced",
        "GATE (CS, ME, CE, EE, EC)",
        "WBJEE (State Engineering)",
        "BITSAT & State CETs",
    ], tag="Engineering", tag_color=ACCENT_CYAN)

    add_card(slide9, 3.8, 1.8, 2.7, 5.0, "Medical & Science", [
        "NEET UG (Physics, Chem, Bio)",
        "AIIMS Mock Formats",
        "Class 10 Board Exams",
        "Class 11 Academic Core",
        "Class 12 Board Exams",
    ], tag="Medical & Boards", tag_color=ACCENT_EMERALD)

    add_card(slide9, 6.8, 1.8, 2.7, 5.0, "Civil & Gov Services", [
        "UPSC CSE (Prelims & Mains)",
        "SSC CGL & CHSL",
        "Banking (IBPS PO, SBI PO)",
        "Railways (RRB NTPC)",
        "State PSC General Studies",
    ], tag="Government", tag_color=ACCENT_AMBER)

    add_card(slide9, 9.8, 1.8, 2.7, 5.0, "Management & Custom", [
        "CAT (QA, DILR, VARC)",
        "XAT & Management Tests",
        "University Semester Exams",
        "Custom Exam Creator (User-defined syllabus)",
    ], tag="Management", tag_color=ACCENT_PURPLE)

    # =========================================================================
    # SLIDE 10: Gamification, Analytics & Retention
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, "Student Psychology", "Gamification, Medals & Telemetry", "Building sustainable study habits through milestone rewards and habit loops.")

    add_card(slide10, 0.8, 1.8, 3.64, 5.0, "Streak Mechanics", [
        "Daily Study Streak tracking with dynamic flame visual states.",
        "Streak Shields: Prevents streak loss during unexpected emergency days.",
        "Daily Study Alarms: Customizable browser notification reminders (e.g. 8:00 PM).",
    ], tag="Daily Discipline", tag_color=RGBColor(249, 115, 22))

    add_card(slide10, 4.84, 1.8, 3.64, 5.0, "Milestone Badges", [
        "Cricket-themed milestone celebrations: Half Century 🏏 (50 Qs) and Full Century 🏆 (100 Qs).",
        "Speed Demon & Accuracy Master badges for exceptional pace performance.",
        "Profile Badge Showcase to share accomplishments.",
    ], tag="Achievements", tag_color=ACCENT_AMBER)

    add_card(slide10, 8.88, 1.8, 3.64, 5.0, "Performance Telemetry", [
        "Speed vs. Accuracy curves across days and weeks.",
        "Chapter-wise weakness heatmaps showing where clock panic peaks.",
        "Time allocation distribution: tracks minutes spent per subject and chapter.",
    ], tag="Analytics (/analytics)", tag_color=ACCENT_CYAN)

    # =========================================================================
    # SLIDE 11: Production Deployment & Live Status
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11)
    add_header(slide11, "Live Operations", "Production Readiness & Live Status", "Clean codebase, zero errors, fully synchronized on GitHub and live deployments.")

    add_card(slide11, 0.8, 1.8, 3.64, 5.0, "Verified Quality Metrics", [
        "TypeScript Compilation: 100% verified with npx tsc --noEmit (0 type errors).",
        "KaTeX Verification: All 206+ math formulas and 1,352 questions typeset cleanly.",
        "Asset Integrity: 394 local diagrams verified with zero broken URLs or 404s.",
        "React Key Integrity: Unique option keys across all exam components.",
    ], tag="Code Quality", tag_color=ACCENT_EMERALD)

    add_card(slide11, 4.84, 1.8, 3.64, 5.0, "Cross-Platform Access", [
        "Web: High-performance Next.js web application running on desktop & laptops.",
        "PWA: Installable Progressive Web App on Android, iOS, Windows, and macOS.",
        "Offline Execution: Full formula library and battle engine work with zero WiFi.",
        "Theme Consistency: Handcrafted high-contrast dark and light themes.",
    ], tag="Multi-Device", tag_color=ACCENT_INDIGO)

    add_card(slide11, 8.88, 1.8, 3.64, 5.0, "Live CI/CD Deployment", [
        "Repository: https://github.com/SanuSamanta-oss/Samayyudh-2.0.git",
        "Branch: main (Clean tree, latest commits verified).",
        "Instant Sync: Automatic live web & app updates triggered on git push.",
    ], tag="Deployment", tag_color=ACCENT_CYAN)

    # =========================================================================
    # SLIDE 12: Roadmap & Future Horizons
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12)
    add_header(slide12, "Future Horizons", "Roadmap & Scaling Vision", "The upcoming phases of SamayYudh 2.0 evolution.")

    add_card(slide12, 0.8, 1.8, 2.7, 5.0, "Phase 1: PYQ Expansion", [
        "Multi-year JEE Main shifts (2020-2024)",
        "NEET UG 10-year question repository",
        "GATE Computer Science full bank",
        "UPSC Prelims GS Paper 1 & 2 archive",
    ], tag="Q1 2027", tag_color=ACCENT_CYAN)

    add_card(slide12, 3.8, 1.8, 2.7, 5.0, "Phase 2: Multiplayer", [
        "1v1 Live Clock Duels: Real-time peer battle arena",
        "Room Codes & Team Challenges",
        "National Speed Leaderboards",
        "College / Coaching Cohort Battles",
    ], tag="Q2 2027", tag_color=ACCENT_PURPLE)

    add_card(slide12, 6.8, 1.8, 2.7, 5.0, "Phase 3: Adaptive AI", [
        "Generative Exam Paper Synthesizer",
        "Dynamic difficulty adjustment to student weaknesses",
        "AI Voice-Guided Meditation & Exam Calm Audio",
        "Personalized revision schedules",
    ], tag="Q3 2027", tag_color=ACCENT_AMBER)

    add_card(slide12, 9.8, 1.8, 2.7, 5.0, "Phase 4: Institutional", [
        "Coaching Institute White-Label Portal",
        "Batch & Classroom Analytics",
        "Printable Mock Papers with Watermark & QR",
        "Custom Test Creation API",
    ], tag="Q4 2027", tag_color=ACCENT_EMERALD)

    # Save presentation
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_samayyudh_presentation()

