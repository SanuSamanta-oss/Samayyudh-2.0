import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

def create_complete_template_presentation(output_path="SamayYudh_2.0_Business_Template_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette from Template:
    NAVY_DARK = RGBColor(11, 27, 61)       # #0B1B3D - Deep corporate navy
    NAVY_MID = RGBColor(15, 34, 74)        # #0F224A - Mid navy
    TEAL_CYAN = RGBColor(0, 180, 216)      # #00B4D8 - Vibrant cyan accent
    TEAL_DEEP = RGBColor(2, 128, 144)      # #028090 - Deep teal accent
    WHITE = RGBColor(255, 255, 255)        # Pure white
    TEXT_DARK = RGBColor(30, 41, 59)       # Slate 800 for dark text on white
    TEXT_MUTED = RGBColor(100, 116, 139)   # Slate 500 for secondary text
    TEXT_LIGHT = RGBColor(226, 232, 240)   # Slate 200 for text on navy
    CARD_BG = RGBColor(241, 245, 249)      # Slate 100 for light cards

    def add_solid_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_accent_strip(slide, left, top, width, height, color=TEAL_CYAN):
        strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        strip.fill.solid()
        strip.fill.fore_color.rgb = color
        strip.line.fill.background()
        return strip

    # =========================================================================
    # SLIDE 1: Cover Slide — Cinematic Airplane Clouds & Swinging Stopwatch
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)

    # 1. Full 16:9 Photographic Background with Dim White Translucent Overlay
    bg_img_path = "public/images/presentation/cinematic_bg.jpg"
    if os.path.exists(bg_img_path):
        slide1.shapes.add_picture(bg_img_path, 0, 0, Inches(13.333), Inches(7.5))
    else:
        add_solid_bg(slide1, NAVY_DARK)

    # 2. Main Visual Element: Hanging Pocket Stopwatch with Cord (Animated GIF Pendulum)
    sw_gif_path = "public/images/presentation/stopwatch_pendulum.gif"
    if os.path.exists(sw_gif_path):
        slide1.shapes.add_picture(sw_gif_path, Inches(8.8), Inches(0), Inches(3.8), Inches(5.7))

    # Color Constants for Times New Roman Typography
    NAVY_HEAD = RGBColor(11, 27, 61)       # #0B1B3D Deep Navy
    CHARCOAL_TEXT = RGBColor(26, 32, 44)   # #1A202C Charcoal
    TEAL_LINE = RGBColor(2, 128, 144)      # #028090 Deep Teal Accent

    # 3. Main Project Title & Subtitle Block (Times New Roman)
    tb_title = slide1.shapes.add_textbox(Inches(0.9), Inches(0.9), Inches(7.6), Inches(2.2))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0

    # Heading
    p_main = tf_title.paragraphs[0]
    p_main.text = "SAMAYYUDH 2.0"
    p_main.font.name = "Times New Roman"
    p_main.font.size = Pt(46)
    p_main.font.bold = True
    p_main.font.color.rgb = NAVY_HEAD
    p_main.space_after = Pt(4)

    # Subtitle
    p_sub = tf_title.add_paragraph()
    p_sub.text = "EXAMINATION TIME-PRESSURE SIMULATOR"
    p_sub.font.name = "Times New Roman"
    p_sub.font.size = Pt(19)
    p_sub.font.bold = True
    p_sub.font.color.rgb = NAVY_HEAD
    p_sub.space_after = Pt(6)

    # Tagline
    p_tag = tf_title.add_paragraph()
    p_tag.text = "The Battle Between You & The Clock"
    p_tag.font.name = "Times New Roman"
    p_tag.font.size = Pt(16)
    p_tag.font.italic = True
    p_tag.font.color.rgb = CHARCOAL_TEXT

    # Elegant Accent Divider Line
    line = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(3.1), Inches(4.2), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = TEAL_LINE
    line.line.fill.background()

    # 4. Group Information Block (Times New Roman)
    tb_group = slide1.shapes.add_textbox(Inches(0.9), Inches(3.3), Inches(7.2), Inches(3.8))
    tf_group = tb_group.text_frame
    tf_group.word_wrap = True
    tf_group.margin_left = tf_group.margin_top = tf_group.margin_right = tf_group.margin_bottom = 0

    p_grp = tf_group.paragraphs[0]
    p_grp.text = "GROUP - 010"
    p_grp.font.name = "Times New Roman"
    p_grp.font.size = Pt(22)
    p_grp.font.bold = True
    p_grp.font.color.rgb = NAVY_HEAD
    p_grp.space_after = Pt(3)

    p_dept = tf_group.add_paragraph()
    p_dept.text = "DEPARTMENT - CSE-AIML (2ND YEAR)"
    p_dept.font.name = "Times New Roman"
    p_dept.font.size = Pt(15)
    p_dept.font.bold = True
    p_dept.font.color.rgb = CHARCOAL_TEXT
    p_dept.space_after = Pt(12)

    p_mem_head = tf_group.add_paragraph()
    p_mem_head.text = "GROUP MEMBERS"
    p_mem_head.font.name = "Times New Roman"
    p_mem_head.font.size = Pt(16)
    p_mem_head.font.bold = True
    p_mem_head.font.color.rgb = NAVY_HEAD
    p_mem_head.space_after = Pt(6)

    members_list = [
        "1. SAMBITA SINGHA ROY (JIS/2025/0424)",
        "2. SHREYA BOSE (JIS/2025/0577)",
        "3. SARBAJIT SAHA (JIS/2025/1177)",
        "4. SANU SAMANTA (JIS/2025/0721)"
    ]

    for member_info in members_list:
        p_m = tf_group.add_paragraph()
        p_m.text = member_info
        p_m.font.name = "Times New Roman"
        p_m.font.size = Pt(14)
        p_m.font.color.rgb = CHARCOAL_TEXT
        p_m.space_after = Pt(4)

    # =========================================================================
    # SLIDE 2: INTRODUCTION (NEW)
    # Angled dark navy left block + clean white card with 3 strategic intro pillars
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide2, WHITE)

    top_banner = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(8.5), Inches(1.5))
    top_banner.fill.solid()
    top_banner.fill.fore_color.rgb = NAVY_DARK
    top_banner.line.fill.background()

    top_wedge = slide2.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(8.5), Inches(0), Inches(2.2), Inches(1.5))
    top_wedge.fill.solid()
    top_wedge.fill.fore_color.rgb = NAVY_DARK
    top_wedge.line.fill.background()

    add_accent_strip(slide2, 0, 1.45, 10.7, 0.08, TEAL_CYAN)

    tb_top = slide2.shapes.add_textbox(Inches(0.8), Inches(0.3), Inches(8.0), Inches(1.0))
    tf_top = tb_top.text_frame
    p = tf_top.paragraphs[0]
    p.text = "PROJECT INTRODUCTION"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p2 = tf_top.add_paragraph()
    p2.text = "Executive Summary & Core Objectives of SamayYudh 2.0"
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEAL_CYAN

    intro_cards = [
        ("Platform Genesis", "Born from the observation that 85%+ of competitive test-takers underperform due to anxiety and timer panic rather than lack of knowledge. SamayYudh 2.0 recreates true examination pressure.", TEAL_CYAN),
        ("Target Aspirants", "Engineered for candidates preparing for high-stakes examinations: JEE Main, JEE Advanced, NEET UG, GATE, UPSC CSE, SSC, and Higher Secondary Board exams.", NAVY_MID),
        ("Core Value Proposition", "Combines real-time mark-proportionate countdowns with 1,352+ verified PYQs, 206+ KaTeX formulas, zero-data-loss offline storage, and Gemini AI performance diagnostics.", TEAL_DEEP)
    ]

    for idx, (c_title, c_desc, c_color) in enumerate(intro_cards):
        left_pos = 0.8 + idx * 4.0
        c_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_pos), Inches(2.1), Inches(3.7), Inches(4.7))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = RGBColor(203, 213, 225)
        c_box.line.width = Pt(1)

        c_tb = slide2.shapes.add_textbox(Inches(left_pos + 0.3), Inches(2.4), Inches(3.1), Inches(4.1))
        c_tf = c_tb.text_frame
        c_tf.word_wrap = True

        p = c_tf.paragraphs[0]
        p.text = f"0{idx + 1}"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = c_color
        p.space_after = Pt(2)

        p = c_tf.add_paragraph()
        p.text = c_title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.space_after = Pt(12)

        p = c_tf.add_paragraph()
        p.text = c_desc
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 3: About Us & The Problem Context
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide3, WHITE)

    rect_left = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(5.5), Inches(7.5))
    rect_left.fill.solid()
    rect_left.fill.fore_color.rgb = NAVY_DARK
    rect_left.line.fill.background()

    w2 = slide3.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(5.5), Inches(0), Inches(1.5), Inches(7.5))
    w2.fill.solid()
    w2.fill.fore_color.rgb = NAVY_DARK
    w2.line.fill.background()

    add_accent_strip(slide3, 6.9, 0, 0.08, 7.5, TEAL_CYAN)

    tb_left = slide3.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(4.5), Inches(4.5))
    tf_l = tb_left.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "THE PROBLEM"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_CYAN
    p.space_after = Pt(8)
    p = tf_l.add_paragraph()
    p.text = "The Psychological Barrier of the Exam Clock"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_after = Pt(16)
    p = tf_l.add_paragraph()
    p.text = "Traditional mock tests measure what a student knows, but fail to train how they think under countdown pressure.\n\nStudents freeze, spend 15 minutes on a 2-mark trap, and leave the easiest questions unread."
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_LIGHT

    tb_right = slide3.shapes.add_textbox(Inches(7.5), Inches(1.5), Inches(5.2), Inches(5.0))
    tf_r = tb_right.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "THE ATHLETIC SOLUTION"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK
    p.space_after = Pt(12)

    bullets = [
        ("Conditioned Pacing", "Transforms study from passive reading into high-frequency, timed micro-battles."),
        ("Instant Biofeedback", "Students develop a subconscious, internal clock calibrated to mark weights."),
        ("100% Offline PWA", "Operates seamlessly on mobile and desktop with IndexedDB local caching."),
        ("Comprehensive Knowledge", "Built-in KaTeX formula encyclopedia and authentic diagram library."),
    ]
    for b_title, b_desc in bullets:
        p = tf_r.add_paragraph()
        p.text = f"•  {b_title}: {b_desc}"
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(10)

    # =========================================================================
    # SLIDE 4: Strategy & Methodology
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide4, WHITE)

    top_banner = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(8.5), Inches(1.6))
    top_banner.fill.solid()
    top_banner.fill.fore_color.rgb = NAVY_DARK
    top_banner.line.fill.background()

    top_wedge = slide4.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(8.5), Inches(0), Inches(2.2), Inches(1.6))
    top_wedge.fill.solid()
    top_wedge.fill.fore_color.rgb = NAVY_DARK
    top_wedge.line.fill.background()

    add_accent_strip(slide4, 0, 1.55, 10.7, 0.08, TEAL_CYAN)

    tb_top = slide4.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(8.0), Inches(1.0))
    tf_top = tb_top.text_frame
    p = tf_top.paragraphs[0]
    p.text = "TIME-PRESSURE METHODOLOGY"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p2 = tf_top.add_paragraph()
    p2.text = "Marks-to-Time Proportioning & The Golden Rules of SamayYudh"
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEAL_CYAN

    cols = [
        ("2-Mark Questions", "2 Minutes Allotted", "Fast conceptual recall, formula identification, and immediate direct calculation.", TEAL_CYAN),
        ("5-Mark Questions", "6 Minutes Allotted", "Stepwise algebraic derivation, intermediate diagrams, and justified final answer.", NAVY_MID),
        ("10-Mark Questions", "12 Minutes Allotted", "Comprehensive multi-concept solution, boundary check, and neat formal presentation.", TEAL_DEEP)
    ]

    for idx, (col_title, col_time, col_desc, col_color) in enumerate(cols):
        left_pos = 0.8 + idx * 4.0
        c_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_pos), Inches(2.2), Inches(3.7), Inches(4.6))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = RGBColor(203, 213, 225)
        c_box.line.width = Pt(1)

        c_tb = slide4.shapes.add_textbox(Inches(left_pos + 0.3), Inches(2.5), Inches(3.1), Inches(4.0))
        c_tf = c_tb.text_frame
        c_tf.word_wrap = True

        p = c_tf.paragraphs[0]
        p.text = col_title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.space_after = Pt(4)

        p = c_tf.add_paragraph()
        p.text = col_time.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col_color
        p.space_after = Pt(12)

        p = c_tf.add_paragraph()
        p.text = col_desc
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(16)

        p = c_tf.add_paragraph()
        p.text = "✦ Pacing Discipline: Never exceed the golden quota. If stalled, move forward to secure available points."
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 5: Student Performance Telemetry (Bar Chart)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide5, WHITE)

    tb = slide5.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(6.5), Inches(1.0))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "STUDENT PERFORMANCE TELEMETRY"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK
    p2 = tf.add_paragraph()
    p2.text = "Speed vs. Accuracy Calibration Across Practice Sessions"
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    chart_data = CategoryChartData()
    chart_data.categories = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    chart_data.add_series('Speed Index (%)', (42, 65, 78, 91))
    chart_data.add_series('Accuracy (%)', (55, 68, 82, 89))
    chart_data.add_series('Time Saved (min)', (12, 22, 34, 45))

    x, y, cx, cy = Inches(0.8), Inches(1.8), Inches(6.8), Inches(5.0)
    chart = slide5.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, chart_data).chart
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM

    r_navy = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.2), Inches(0.5), Inches(4.3), Inches(6.5))
    r_navy.fill.solid()
    r_navy.fill.fore_color.rgb = NAVY_DARK
    r_navy.line.fill.background()

    add_accent_strip(slide5, 8.2, 0.5, 0.1, 6.5, TEAL_CYAN)

    tb_rn = slide5.shapes.add_textbox(Inches(8.6), Inches(0.9), Inches(3.6), Inches(5.6))
    tf_rn = tb_rn.text_frame
    tf_rn.word_wrap = True

    p = tf_rn.paragraphs[0]
    p.text = "KEY TELEMETRY METRICS"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_after = Pt(12)

    p = tf_rn.add_paragraph()
    p.text = "Captured live during exam battles:"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_LIGHT
    p.space_after = Pt(14)

    metrics = [
        "Speed Index: Measures seconds spent per mark versus golden quota.",
        "Accuracy Ratio: Percentage of full-mark questions correctly solved under countdown.",
        "Endurance Factor: Measure of answer stability from question 1 to question 100.",
        "Panic Recovery: Time taken to regain composure following difficult questions.",
    ]
    for m in metrics:
        p = tf_rn.add_paragraph()
        p.text = f"✦  {m}"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 6: PYQ Repository (Donut Chart)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide6, WHITE)

    top_h = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.2))
    top_h.fill.solid()
    top_h.fill.fore_color.rgb = NAVY_DARK
    top_h.line.fill.background()
    add_accent_strip(slide6, 0, 1.15, 13.333, 0.08, TEAL_CYAN)

    tb_h = slide6.shapes.add_textbox(Inches(0.8), Inches(0.25), Inches(11.0), Inches(0.8))
    tf_h = tb_h.text_frame
    p = tf_h.paragraphs[0]
    p.text = "EXPLORE PYQ REPOSITORY (/pyq)"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p = tf_h.add_paragraph()
    p.text = "1,352 Questions Across JEE Main, Advanced & Competitive Syllabus"
    p.font.size = Pt(12)
    p.font.color.rgb = TEAL_CYAN

    tb_l5 = slide6.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.2), Inches(5.0))
    tf_l5 = tb_l5.text_frame
    tf_l5.word_wrap = True

    p = tf_l5.paragraphs[0]
    p.text = "DATABASE ARCHITECTURE"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK
    p.space_after = Pt(8)

    pyq_bullets = [
        "JEE Main 2025: 22 January Shift 1 & 2 transcribed with exact Section A (MCQ) and Section B (Numerical inputs).",
        "JEE Advanced 95 Chapters: Physics (33 ch, 388 Qs), Chemistry (31 ch, 306 Qs), and Math (31 ch, 300 Qs).",
        "394 Local Diagrams: Stored locally in public/jee_advanced_diagrams/ with zero 404s or broken links.",
        "Interactive Battle Actions: Click 'Solve in Battle' on any question, or 'Battle This Section' for paper sprints.",
    ]
    for b in pyq_bullets:
        p = tf_l5.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(10)

    doughnut_data = CategoryChartData()
    doughnut_data.categories = ['Physics (410 Qs)', 'Chemistry (326 Qs)', 'Mathematics (320 Qs)', 'JEE Main 2025 (296 Qs)']
    doughnut_data.add_series('Question Distribution', (410, 326, 320, 296))

    x, y, cx, cy = Inches(6.5), Inches(1.8), Inches(6.0), Inches(5.0)
    chart5 = slide6.shapes.add_chart(XL_CHART_TYPE.DOUGHNUT, x, y, cx, cy, doughnut_data).chart
    chart5.has_legend = True
    chart5.legend.position = XL_LEGEND_POSITION.RIGHT

    # =========================================================================
    # SLIDE 7: Formula Library
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide7, WHITE)

    tb6 = slide7.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.0))
    tf6 = tb6.text_frame
    p = tf6.paragraphs[0]
    p.text = "MATHEMATICS & SCIENCE FORMULA SUITE (/formulas)"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK
    p = tf6.add_paragraph()
    p.text = "206+ Formulations Across 6 Curriculum Divisions with KaTeX & Slide Drawer"
    p.font.size = Pt(12)
    p.font.color.rgb = TEAL_DEEP

    divisions = [
        ("Div 1: Algebra & Polynomials", "40 Formulas", "Quadratics, AP, Binomial, Matrices, Complex Numbers"),
        ("Div 2: Calculus & Integrals", "43 Formulas", "Limits, Derivatives, Definite/Indefinite Integrals, ODEs"),
        ("Div 3: Trigonometry & Inverses", "32 Formulas", "Ratios, Identities, Compound/Submultiples, Inverses"),
        ("Div 4: Coordinate Geometry", "32 Formulas", "Straight Lines, Circles, Parabolas, Ellipses, Hyperbolas"),
        ("Div 5: Vectors & 3D Geometry", "24 Formulas", "Dot/Cross Products, Direction Cosines, Planes, Skew Lines"),
        ("Div 6: Probability & Statistics", "35 Formulas", "Dispersion, Bayes' Theorem, Binomial, Poisson, Normal")
    ]

    for idx, (d_title, d_count, d_sub) in enumerate(divisions):
        row = idx // 3
        col = idx % 3
        c_left = 0.8 + col * 4.0
        c_top = 1.8 + row * 2.5

        box = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_left), Inches(c_top), Inches(3.7), Inches(2.2))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = RGBColor(203, 213, 225)
        box.line.width = Pt(1)

        tb_c = slide7.shapes.add_textbox(Inches(c_left + 0.2), Inches(c_top + 0.2), Inches(3.3), Inches(1.8))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True

        p = tf_c.paragraphs[0]
        p.text = d_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK

        p = tf_c.add_paragraph()
        p.text = d_count
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEAL_CYAN
        p.space_after = Pt(4)

        p = tf_c.add_paragraph()
        p.text = d_sub
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_DARK

    add_accent_strip(slide7, 0.8, 6.9, 11.7, 0.08, TEAL_CYAN)

    # =========================================================================
    # SLIDE 8: The 4 Core Pillars (SWOT Style)
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide8, NAVY_DARK)

    tb7 = slide8.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.0))
    tf7 = tb7.text_frame
    p = tf7.paragraphs[0]
    p.text = "THE 4 CORE PILLARS OF SAMAYYUDH 2.0"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p = tf7.add_paragraph()
    p.text = "Comprehensive Architecture Designed for Maximum Academic Acceleration"
    p.font.size = Pt(12)
    p.font.color.rgb = TEAL_CYAN

    add_accent_strip(slide8, 0.8, 1.4, 11.7, 0.05, TEAL_CYAN)

    pillars = [
        ("T", "TIME-PRESSURE", [
            "Universal exam clock simulator.",
            "Mark-to-time proportioning (2m, 6m, 12m).",
            "Auto-save every 2 seconds to IndexedDB.",
            "Timers persist across tab reloads.",
        ], TEAL_CYAN),
        ("P", "PYQ REPOSITORY", [
            "1,352+ digitized questions.",
            "JEE Main 2025 Jan 22 Shift 1 & 2.",
            "JEE Advanced 95 chapters.",
            "394 local verified diagrams.",
        ], RGBColor(56, 189, 248)),
        ("F", "FORMULA LIBRARY", [
            "206+ math formulas in 6 divisions.",
            "Physics Class 10, 11, 12 & Higher Ed.",
            "20 SI physical constants matrix.",
            "Slide-in detail drawer & KaTeX.",
        ], RGBColor(168, 85, 247)),
        ("A", "AI EVALUATION", [
            "Google Gemini 2.5 scoring.",
            "Speed pace diagnostics.",
            "SOKHA live companion bot.",
            "Zero-NSFW academic guardian.",
        ], RGBColor(52, 211, 153))
    ]

    for idx, (letter, p_name, p_points, p_color) in enumerate(pillars):
        col_x = 0.8 + idx * 3.0
        tb_col = slide8.shapes.add_textbox(Inches(col_x), Inches(1.8), Inches(2.7), Inches(5.2))
        tf_col = tb_col.text_frame
        tf_col.word_wrap = True

        p_let = tf_col.paragraphs[0]
        p_let.text = letter
        p_let.font.size = Pt(54)
        p_let.font.bold = True
        p_let.font.color.rgb = p_color
        p_let.space_after = Pt(2)

        p_nm = tf_col.add_paragraph()
        p_nm.text = p_name
        p_nm.font.size = Pt(13)
        p_nm.font.bold = True
        p_nm.font.color.rgb = WHITE
        p_nm.space_after = Pt(14)

        for pt in p_points:
            p_pt = tf_col.add_paragraph()
            p_pt.text = f"• {pt}"
            p_pt.font.size = Pt(11)
            p_pt.font.color.rgb = TEXT_LIGHT
            p_pt.space_after = Pt(8)

    # =========================================================================
    # SLIDE 9: SOKHA AI Study Companion & Architecture
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide9, NAVY_DARK)

    w8 = slide9.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(8.0), Inches(0), Inches(2.0), Inches(7.5))
    w8.fill.solid()
    w8.fill.fore_color.rgb = NAVY_MID
    w8.line.fill.background()
    w8.rotation = 180

    rect_r8 = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(10.0), Inches(0), Inches(3.333), Inches(7.5))
    rect_r8.fill.solid()
    rect_r8.fill.fore_color.rgb = NAVY_MID
    rect_r8.line.fill.background()

    tb8 = slide9.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(7.5), Inches(6.0))
    tf8 = tb8.text_frame
    tf8.word_wrap = True

    p = tf8.paragraphs[0]
    p.text = "SOKHA AI STUDY COMPANION"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_after = Pt(6)

    p = tf8.add_paragraph()
    p.text = "Context-Aware Personal Academic Mentor with Living Platform Memory"
    p.font.size = Pt(13)
    p.font.color.rgb = TEAL_CYAN
    p.space_after = Pt(16)

    features = [
        ("Live Route Awareness", "Dynamically detects student's current URL (/pyq, /formulas, /practice) and offers contextual shortcuts."),
        ("Comprehensive Memory Engine", "Possesses exhaustive knowledge of all 95 chapters, 206+ formulas, exams, and timing rules."),
        ("Strict Zero-Tolerance NSFW", "Rejects adult, erotic, or non-academic queries immediately and courteously with zero jailbreak risk."),
        ("PII & Privacy Protection", "Client-side and server-side redaction ensures student credentials and phone numbers are never exposed."),
        ("Mystic Chakra Visuals", "Doctor Strange-inspired rotating visual chakra with companion voice synthesis."),
    ]
    for f_title, f_desc in features:
        p = tf8.add_paragraph()
        p.text = f"✦  {f_title}: {f_desc}"
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(10)

    tb_spec = slide9.shapes.add_textbox(Inches(9.2), Inches(1.5), Inches(3.5), Inches(5.0))
    tf_spec = tb_spec.text_frame
    tf_spec.word_wrap = True

    p = tf_spec.paragraphs[0]
    p.text = "ENGINEERING SPECS"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = TEAL_CYAN
    p.space_after = Pt(14)

    specs = [
        "LLM: Google Gemini 2.5 Flash",
        "Grounding: Google Search Tool",
        "Stream: Server-Sent Events (SSE)",
        "Safety: Client & Server Redaction",
        "Client: Next.js 16 + React 19",
        "Cache: LocalStorage Thread Sync",
    ]
    for s in specs:
        p = tf_spec.add_paragraph()
        p.text = f"• {s}"
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 10: Strategic Roadmap
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide10, NAVY_DARK)

    rect_bot = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(2.2), Inches(13.333), Inches(5.3))
    rect_bot.fill.solid()
    rect_bot.fill.fore_color.rgb = WHITE
    rect_bot.line.fill.background()

    w9 = slide10.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, 0, Inches(1.2), Inches(13.333), Inches(1.0))
    w9.fill.solid()
    w9.fill.fore_color.rgb = WHITE
    w9.line.fill.background()
    w9.rotation = 180

    add_accent_strip(slide10, 0, 2.15, 13.333, 0.08, TEAL_CYAN)

    tb_top9 = slide10.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.0))
    tf_top9 = tb_top9.text_frame
    p = tf_top9.paragraphs[0]
    p.text = "STRATEGIC ROADMAP"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p = tf_top9.add_paragraph()
    p.text = "Scaling the Universal Examination Battle Platform"
    p.font.size = Pt(12)
    p.font.color.rgb = TEAL_CYAN

    phases = [
        ("Phase 1: Expansion", "Q1 2027", "10-year NEET UG repository, GATE CS bank, and UPSC Prelims GS Paper 1 & 2 archive."),
        ("Phase 2: Multiplayer", "Q2 2027", "1v1 Live Clock Duels: Real-time peer battle arena with room codes and national speed leaderboards."),
        ("Phase 3: Adaptive AI", "Q3 2027", "Generative test synthesizer tailoring question difficulty dynamically to detected student weaknesses."),
        ("Phase 4: Institutional", "Q4 2027", "Coaching Institute White-Label Portal with batch analytics and printable mock papers with QR codes.")
    ]

    for idx, (p_title, p_time, p_desc) in enumerate(phases):
        c_x = 0.8 + idx * 3.0
        box = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_x), Inches(2.8), Inches(2.7), Inches(4.0))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = RGBColor(203, 213, 225)
        box.line.width = Pt(1)

        tb_ph = slide10.shapes.add_textbox(Inches(c_x + 0.2), Inches(3.0), Inches(2.3), Inches(3.6))
        tf_ph = tb_ph.text_frame
        tf_ph.word_wrap = True

        p = tf_ph.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK

        p = tf_ph.add_paragraph()
        p.text = p_time
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEAL_CYAN
        p.space_after = Pt(10)

        p = tf_ph.add_paragraph()
        p.text = p_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 11: CONCLUSION & KEY TAKEAWAYS (NEW)
    # Angled dual-tone layout summarizing impact, measurable results & readiness
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide11, WHITE)

    c_banner = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(8.5), Inches(1.5))
    c_banner.fill.solid()
    c_banner.fill.fore_color.rgb = NAVY_DARK
    c_banner.line.fill.background()

    c_wedge = slide11.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(8.5), Inches(0), Inches(2.2), Inches(1.5))
    c_wedge.fill.solid()
    c_wedge.fill.fore_color.rgb = NAVY_DARK
    c_wedge.line.fill.background()

    add_accent_strip(slide11, 0, 1.45, 10.7, 0.08, TEAL_CYAN)

    tb_c = slide11.shapes.add_textbox(Inches(0.8), Inches(0.3), Inches(8.0), Inches(1.0))
    tf_c = tb_c.text_frame
    p = tf_c.paragraphs[0]
    p.text = "CONCLUSION & PLATFORM IMPACT"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p2 = tf_c.add_paragraph()
    p2.text = "The Paradigm Shift: From Passive Reading to Neurological Time Mastery"
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEAL_CYAN

    concl_items = [
        ("Conditioned Time Instinct", "SamayYudh 2.0 replaces exam anxiety with an instinctive, internalized timing rhythm. Students no longer look at the clock with dread; they control it with structured discipline.", TEAL_CYAN),
        ("Unrivaled Academic Rigor", "With 1,352+ synchronized PYQs, 394 local diagram graphics, 206+ KaTeX mathematical formulas, and SOKHA's living memory, the platform delivers elite competitive prep right into student hands.", NAVY_MID),
        ("Production & Scale Ready", "Fully verified TypeScript codebase (0 errors), 100% offline-first PWA architecture, and CI/CD live on GitHub. The system is engineered to support hundreds of thousands of concurrent learners.", TEAL_DEEP)
    ]

    for idx, (c_title, c_desc, c_color) in enumerate(concl_items):
        left_pos = 0.8 + idx * 4.0
        c_box = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_pos), Inches(2.1), Inches(3.7), Inches(4.7))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = RGBColor(203, 213, 225)
        c_box.line.width = Pt(1)

        c_tb = slide11.shapes.add_textbox(Inches(left_pos + 0.3), Inches(2.4), Inches(3.1), Inches(4.1))
        c_tf = c_tb.text_frame
        c_tf.word_wrap = True

        p = c_tf.paragraphs[0]
        p.text = "TAKEAWAY"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = c_color
        p.space_after = Pt(2)

        p = c_tf.add_paragraph()
        p.text = c_title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.space_after = Pt(12)

        p = c_tf.add_paragraph()
        p.text = c_desc
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 12: THANK YOU & ANY QUESTIONS / DOUBTS (NEW)
    # Elegant Deep Navy closing slide with cyan accents, Q&A invite & live links
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_solid_bg(slide12, NAVY_DARK)

    w_end = slide12.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(0), Inches(0), Inches(4.5), Inches(7.5))
    w_end.fill.solid()
    w_end.fill.fore_color.rgb = NAVY_MID
    w_end.line.fill.background()
    w_end.rotation = 180

    w_end_r = slide12.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(9.5), Inches(0), Inches(3.833), Inches(7.5))
    w_end_r.fill.solid()
    w_end_r.fill.fore_color.rgb = NAVY_MID
    w_end_r.line.fill.background()

    add_accent_strip(slide12, 0, 0.5, 13.333, 0.08, TEAL_CYAN)
    add_accent_strip(slide12, 0, 6.9, 13.333, 0.08, TEAL_CYAN)

    tb_end = slide12.shapes.add_textbox(Inches(2.5), Inches(1.5), Inches(8.333), Inches(4.8))
    tf_end = tb_end.text_frame
    tf_end.word_wrap = True

    p = tf_end.paragraphs[0]
    p.text = "THANK YOU!"
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(8)

    p = tf_end.add_paragraph()
    p.text = "ANY QUESTIONS OR DOUBTS?"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = TEAL_CYAN
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(18)

    p = tf_end.add_paragraph()
    p.text = "We welcome your thoughts, feedback, and technical inquiries.\nLet's discuss architecture, pedagogical strategy, and scaling roadmap."
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_LIGHT
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(28)

    p = tf_end.add_paragraph()
    p.text = "✦ SAMAYYUDH 2.0 (সময়যুদ্ধ ২.০) — The Battle Between You & The Clock ✦"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_CYAN
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(8)

    p = tf_end.add_paragraph()
    p.text = "Repository: https://github.com/SanuSamanta-oss/Samayyudh-2.0.git"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_MUTED
    p.alignment = PP_ALIGN.CENTER

    try:
        prs.save(output_path)
        print(f"Presentation saved successfully to: {output_path}")
    except PermissionError:
        alt_path = "SamayYudh_2.0_Business_Template_Deck.pptx"
        prs.save(alt_path)
        print(f"Note: '{output_path}' was locked by another application. Saved presentation successfully to: {alt_path}")

if __name__ == "__main__":
    create_complete_template_presentation()
