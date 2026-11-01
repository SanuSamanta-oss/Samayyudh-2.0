-- SamayYudh 2.0 PYQ Import SQL
-- Generated from data/pyq_database.json
-- 5 papers, 352 questions — JEE Main 2025 B.Tech

-- ================================================
-- STEP 1: Make sure tables exist.
--   Run supabase/pyq_schema.sql in SQL Editor first.
-- ================================================

-- STEP 2: Insert Papers (5 rows)
INSERT INTO public.pyq_exam_papers (id,exam,year,course,exam_date,exam_date_str,shift,session,source_filename,source_classification,checksum,total_questions,physics_count,chemistry_count,mathematics_count,import_status,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','2025-01-22','22 January 2025','Shift 1','Morning','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf','Memory Based','0a24d7f75822e8d65daa53f8e030c91617ed488ff68d4e2d530a00b1279dd6d2',71,23,25,23,'Successfully Imported',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_exam_papers (id,exam,year,course,exam_date,exam_date_str,shift,session,source_filename,source_classification,checksum,total_questions,physics_count,chemistry_count,mathematics_count,import_status,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','2025-01-22','22 January 2025','Shift 2','Evening','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf','Memory Based','05bb6f56628e948ba2c28f3d8e7a2c2c08632ffbfa9f07f0d100a43fd2900361',72,23,25,24,'Successfully Imported',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_exam_papers (id,exam,year,course,exam_date,exam_date_str,shift,session,source_filename,source_classification,checksum,total_questions,physics_count,chemistry_count,mathematics_count,import_status,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','2025-01-23','23 January 2025','Shift 2','Evening','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf','Memory Based','738e1956b20b87d3d75a600bc4778b18e5e593e8fcdb1ae08b934ebd4487b0ef',65,25,25,15,'Successfully Imported',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_exam_papers (id,exam,year,course,exam_date,exam_date_str,shift,session,source_filename,source_classification,checksum,total_questions,physics_count,chemistry_count,mathematics_count,import_status,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','2025-01-24','24 January 2025','Shift 1','Morning','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf','Memory Based','8bf83f93a0536ac1588a3e85b8fe9e5abf5778edfacb5853b9f93f1b527e6841',74,24,25,25,'Successfully Imported',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_exam_papers (id,exam,year,course,exam_date,exam_date_str,shift,session,source_filename,source_classification,checksum,total_questions,physics_count,chemistry_count,mathematics_count,import_status,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','2025-01-23','23 January 2025','Shift 1','Morning','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf','Memory Based','7212cea74cbd513a06b80fba9c4ff78e78f7d8ffe7b4918023f18d861585ab4d',70,25,25,20,'Successfully Imported',now(),now()) ON CONFLICT (id) DO NOTHING;

-- STEP 3: Insert Questions (352 rows)
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q1','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',1,'Section A','MCQ','Now
the battery is disconnected and dielectric slab of 
dielectric constant K is inserted between the gaps of
Q
Q
1
the plates. Now charge on capacitor is Q2. Find 
.
2
2
1','[{"key": "1", "text": "1"}, {"key": "2", "text": "3\n2"}, {"key": "3", "text": "2 \n(4)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 5)','3503e241e31bcd79ac59f571bc9260bd25968879633afca74f988230e89e10c1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q2','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',2,'Section A','MCQ','Solid sphere of mass M, radius R exerts force F on a
7
M is
point mass. Now a concentric spherical mass
removed. What is new force?
7
F','[{"key": "2", "text": "6"}, {"key": "1", "text": "7 F"}, {"key": "3", "text": "5\n7\nF"}, {"key": "4", "text": "3\n7\nF"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 2)','cf30390c30bad9d65e38bb3f1f0e7646af77fa8356aa5dee00e4ebf822785658',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q3','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',3,'Section A','MCQ','Find out equivalent capacitance for the situation show 
in figure.
(
)
\varepsilon
+
+
=
(
)
(
)
+
(
)
A
K K
K K
K K
C
d
K
K','[{"key": "1", "text": "0\n1 2\n2\n3\n3\n1\neq\n1\n2\n(\n)\n\\varepsilon\n+\n+\n=\n(\n)\n(\n)\n+\n(\n)\nA\nK K\nK K\nK K\nC\nd\nK\nK\n2"}, {"key": "2", "text": "0\n1 2\n2\n3\n3\n1\neq\n2(\n)\n1\n2\n(\n)\n\\varepsilon\n+\n+\n=\n(\n)\n(\n)\n+\n(\n)\nA\nK K\nK K\nK K\nC\nd\nK\nK"}, {"key": "3", "text": "0\n1 2\n2\n3\n3\n1\neq\n1\n2\n2(\n)\n(\n)\n\\varepsilon\n+\n+\n=\n(\n)\n(\n)\n+\n(\n)\nA\nK K\nK K\nK K\nC\nd\nK\nK"}, {"key": "4", "text": "0\n1 2\n2\n3\n3\n1\neq\n1\n2\n2\n(\n)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q3.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 2)','b7500a005ba407bec26f1ebd3c2e649ece3111b2d2191be96b571799082d70cf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q4','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',4,'Section A','MCQ','From a sphere of mass M and radius R, a cavity of
R
radius 
 is created. Find the moment of inertia
2
about an axis passing through the centre of sphere
and cavity.
48 MR 
31 
2','[{"key": "1", "text": "80 MR \n31 \n2"}, {"key": "2", "text": "32 MR \n13 \n2"}, {"key": "3", "text": "32 MR \n21 \n2\n(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q4.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 3)','69d07ff17befa6b3246cfd2560325a53f8d166b983b1a1a1f0adefbc6461d382',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q5','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',5,'Section A','MCQ','Find the radius of curvature of the common surface of 
two bubbles (R1 > R2)
R
R
R R
R =
+
1 2','[{"key": "1", "text": "1\n2\nR\nR\nR\n=\nR R\n2\n-\n1 2"}, {"key": "2", "text": "1\n2\nR\nR\nR R\nR\n-\n=\n1 2"}, {"key": "3", "text": "1\n2\nR\nR\nR R\nR\n(\n-\n)\n=\n1 2"}, {"key": "4", "text": "1\n2"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q5.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 3)','e19018fbad56b8c7ffaed63df4b8366e992fe2cdbb7679389715bf70f1c11eb5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q6','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',6,'Section A','MCQ','From the given option, identify the diode connected in 
forward bias.','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q6.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 3)','7ed31b33456994abc85b397583085bbdf0c08c477550951d6275915fdb30da7c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q7','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',7,'Section A','MCQ','Radius of electron in ground state for hydrogen is a0,
then radius of electron in He+ ion in 3rd excited state is
a
0
a. Then 
 is
a
2
1','[{"key": "1", "text": "4\n1"}, {"key": "2", "text": "16\n1"}, {"key": "3", "text": "8\n1\n(4)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 4)','c0abdf31573728a2828f2261b13d5c892def10d93fc08255b5f7e183d7b39e7a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q8','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',8,'Section A','MCQ','Ice at -10°C is to be converted into steam at 110°C. 
Mass of ice is 10-3 kg. What amount of heat is
required?','[{"key": "1", "text": "Q = 730 cal"}, {"key": "2", "text": "Q = 900 cal"}, {"key": "3", "text": "Q = 1210 cal"}, {"key": "4", "text": "Q = 870 cal"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 4)','11b46e7baf9ba8ac31701e7b791222943798a40aa82aad3f4d9322fe7fd747fa',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q9','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',9,'Section A','MCQ','A charge of value q is placed at the edge of a
imaginary cube of side a as shown in figure. Find the 
net flux through the cube
\varepsilon
4
q
0
\varepsilon
6
q','[{"key": "1", "text": ""}, {"key": "2", "text": "0\n\\varepsilon\n2\nq\n0\n\\varepsilon\n8\nq"}, {"key": "3", "text": ""}, {"key": "4", "text": "0"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q9.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 4)','9394675f75629c972daabf9bf7ddcf652e101bb0e7a48bf62ad5d27a96bd3223',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q10','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',10,'Section A','MCQ','A closed organ pipe in 9th harmonic resonates with 4th
harmonic of open organ pipe [lclosed = 10 cm]. Find 
length of open organ pipe.
15 cm
L =
 
0','[{"key": "1", "text": "9\nL =\n \n100 cm\n0"}, {"key": "2", "text": "7\nL =\n \n110 cm\n0"}, {"key": "3", "text": "9\nL =\n \n80 cm\n0\n(4)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 4)','0124e05bb15cb38b67ceb3eeda4a25937dd564d7f50e0f08a58f91b248e6c9ac',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q12','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',12,'Section A','MCQ','Which of the following graphs correctly represents
the variation of resistivity () with temperature (T).','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q12.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 5)','c320d7b78459359a301ca1b0ab5e48fbcf9f649f5b63082153462ecedd8b9f36',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q13','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',13,'Section A','MCQ','If whole YDSE apparatus is immersed in a liquid of
refractive index \mu then what is the effect on fringe
width?','[{"key": "1", "text": "Fringe width increases"}, {"key": "2", "text": "Fringe width decreases"}, {"key": "3", "text": "Fringe width remains unchanged"}, {"key": "4", "text": "It may increase on one side and decrease on\nother side"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 5)','d1d78c3f5ce762b8f40af39395dc7bfe4d00f29533b7f33eb43e6dac1c5a8af7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q14','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',14,'Section A','MCQ','Two spherical black bodies of radius 0.8 m and 0.2 m
are at temperatures of 400 K and 800 K respectively.
Find ratio of rate of heat loss.','[{"key": "1", "text": "8"}, {"key": "2", "text": "4"}, {"key": "3", "text": "2"}, {"key": "4", "text": "1"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 5)','3afaa58917cca36182233c7392923f403ddbe4853387a987399b545149236164',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q15','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',15,'Section A','MCQ','The equiconvex lens shown in figure is silvered on 
one side. For what distance of object from the lens is 
the image formed on the object itself?
R','[{"key": "1", "text": "\\muR"}, {"key": "2", "text": "\\mu\nR\n\\mu-\n2\n2\nR\n\\mu-\n2\n1"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q15.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 6)','6d5b30350741676542eca0cfbfa6362df3ac1719032392515054f294440c5eb0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q16','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',16,'Section A','MCQ','Light of wavelength 550 nm is incident an surfaces of 
cerium and lithium. Work function are respectively 
1.9 eV and 2.5 eV. Then electron will be ejected from','[{"key": "1", "text": "Cerium only"}, {"key": "2", "text": "Lithium only"}, {"key": "3", "text": "From both of them"}, {"key": "4", "text": "None of them"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 6)','e24f721019bf4dcb096c2632b8fc5d38c80fe41f9bfeddcfd700eb5abc5c8e4a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q17','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',17,'Section A','MCQ','The figure shows an electron entering the space 
between the plates of a parallel plate capacitor with an 
initial velocity, vx = 106 m/s parallel to the plates. If the 
length of plates is l = 10 cm and the electric field in the 
region E = 9.1 N/C, then the value of vy when the 
electron comes out of the plates is (Electronic mass = 
9.1 × 10-31 kg)',NULL,NULL,TRUE,'Options incomplete or rendered as diagram','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 6)','cb58eff99ebc0b4e21d29b88322c7b51487a4cc0b1bd4c9d59bb04c34457c2e8',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q19','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','33415e32408acdff0496d19040d4add3fd3f5e455ce76ac4900ef0c1899e2d1c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q20','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','54c76cafd3d65cb9020194d9e7d7bcfc6130fb957e858a64872df89bd6f647bf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q21','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',21,'Section B','Numerical Value','The particle shown in figure is just able to complete 
the vertical circular motion. Find the ratio of kinetic 
energy at A to the kinetic energy at B.',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','51ff7a728f3126c793bb9673bb7d6bf23e52cfe9c9eb1d43d89cb81889cfafbb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q22','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',22,'Section B','Numerical Value','The current drawn from battery in the circuit shown
below is _____ A',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','76cf924aedbbbd8e4540de8289f87bf0be405ae862a7f8aeb3286d1e0e6d93a5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q23','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',23,'Section B','Numerical Value','Question 23',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','1fd57111f9186326a453179e77523006718891442a9c260fd76884dfb07f2761',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q24','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','d5bdd58e241fe33410063cdd6c4cc1c51dafb68748e25dcf6e9789a426e405de',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_phys_q25','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Physics',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 7)','c477f9f39c2d7f1baac1abda4e39bf93e18b3d82fb733228b0206bebb753c094',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q1','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',1,'Section A','MCQ','For complex ion [NiCl4]2- what is the charge on 
metal and shape of complex respectively?','[{"key": "1", "text": "+2, Tetrahedral"}, {"key": "2", "text": "+2, Square planar"}, {"key": "3", "text": "+4, Tetrahedral"}, {"key": "4", "text": "+4, Square Planar"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','2ab634a593ddfdbdf3ac4bbd6afb3626ff8d93ec1de7de3463316af11e5d8695',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q2','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',2,'Section A','MCQ','Compare boiling point of given solutions
(i) 10-4 M NaCl 
(ii) 10-3 M NaCl
(iii) 10-2 M NaCl 
(iv) 10-4 M urea','[{"key": "1", "text": "I > II > III > IV"}, {"key": "2", "text": "III > II > I > IV"}, {"key": "3", "text": "II > I > III > IV"}, {"key": "4", "text": "III > I > II > IV"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','b05782735fae2533056ace758d7a985341abe5a58fd0f86123033354eca270f1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q3','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',3,'Section A','MCQ','The correct decreasing order of electronegativity is','[{"key": "1", "text": "F > Cl > I > Br"}, {"key": "2", "text": "Cl > F > Br > I"}, {"key": "3", "text": "F > Cl > Br > I"}, {"key": "4", "text": "Br > F > I > Cl"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','d1e25271fbd2f6ad31d25d9905157424bb7d6fa0579d5dd274191aad6c5028a6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q4','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',4,'Section A','MCQ','Which of the following has maximum size out of
-, Na+?
Al3+, Mg2+, F','[{"key": "1", "text": "Al3+"}, {"key": "2", "text": "Mg2+\n-"}, {"key": "4", "text": "Na+"}, {"key": "3", "text": "F"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','b9956f670ea97f0472cfcaad1eb6463d84bf6b74a8b0d00c39b2626b6c8104b0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q5','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',5,'Section A','MCQ','The IUPAC name of given specie is','[{"key": "1", "text": "2, 3-dimethyl methyl carboxy butanoic acid"}, {"key": "2", "text": "4-methoxy carbonyl-2, 3-dimethyl propanoic\nacid"}, {"key": "3", "text": "3-methoxycarbonyl-2-methyl butanoic acid"}, {"key": "4", "text": "1-carboxy-2, 3-dimethyl methyl butanoate"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q5.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','96cf02bd184565811e6194c4ddd393a4474eab9a3dfed196ea3a9ebaac86cd62',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q6','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',6,'Section A','MCQ','Compare crystal field splitting energy() for given 
complexes
2
3 4
K [Fe(CN) ] 
(ii) 

4
6
+
Cu(NH )
(i) 
s
Fe(en)
Cl 
3
3
K
Fe(SCN)
 
(iv) 

4
6
 
(iii) 

','[{"key": "1", "text": "I > II > III > IV"}, {"key": "2", "text": "II > I > IV > III"}, {"key": "3", "text": "IV > I > III > II"}, {"key": "4", "text": "IV > III > I > II"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 8)','b38ce0077199b44ed1ec157d1dfc293ae5d2762f43b8373f0a83106e6fe6bada',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q7','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',7,'Section A','MCQ','Consider 
the 
given 
equilibrium 
reaction
CO (g)
C(s)
2CO(g)
+
 
2
If initial pressure of CO2 is 0.6 atm and after 
equilibrium is established, total pressure is 0.8 atm. 
Then, find Kp.','[{"key": "1", "text": "0.4"}, {"key": "2", "text": "0.2"}, {"key": "3", "text": "0.6"}, {"key": "4", "text": "0.8"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q7.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 9)','71b2e241122018f17f86b53bdee231f7f728f6363db5ba0dffcaf4c59f503a46',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q8','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',8,'Section A','MCQ','Statement-I: CH3 - O - CH2 - Cl will show 
nucleophilic substitution by SN1 mechanism in 
protic medium.
Statement-II: 
 will not undergo
nucleophilic substitution via SN2 mechanism easily.','[{"key": "1", "text": "Statement-I and statement-II both are correct"}, {"key": "2", "text": "Statement-I and statement-II both are incorrect"}, {"key": "3", "text": "Statement-I is correct but statement-II is\nincorrect"}, {"key": "4", "text": "Statement-I is incorrect but statement-II is\ncorrect"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q8.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 9)','99f3d2d0e08d8020bc9c43c831f9a7e9450350d94bba2c99015eb1852423bdf6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q9','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',9,'Section A','MCQ','Which of the following acids is also known as 
vitamin C?','[{"key": "1", "text": "Adipic acid"}, {"key": "2", "text": "Ascorbic acid"}, {"key": "3", "text": "Saccharic acid"}, {"key": "4", "text": "Aspartic acid"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 9)','de1914c8f8af7738fa85c83b61d176f1492122b8d07f5f34764528df070fa5f9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q10','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',10,'Section A','MCQ','An electron of He+ is present in 3rd excited state. 
Find its de-Broglie wavelength.','[{"key": "1", "text": "6.64 Å"}, {"key": "2", "text": "1.66 Å"}, {"key": "3", "text": "3.32 Å"}, {"key": "4", "text": "13.28 Å"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 9)','65253a25ab2e07f510f1feac63a785151ff185ab1a5229aa60e275b85abe0cf7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q11','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',11,'Section A','MCQ','Which of the following will show positive Fehling 
test?','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q11.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 9)','4a74852aa19a3c72ada43bfa62c251c1620b7966248ed630c0ac8c6d52cc65ad',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q12','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',12,'Section A','MCQ','4f7 configuration is possible for
(a) Eu3+, (b) Eu2+, (c) Gd3+, (d) Tb3+, (e) Sm2+','[{"key": "1", "text": "(a) and (c)"}, {"key": "2", "text": "(b) and (c)"}, {"key": "3", "text": "(d) and (e)"}, {"key": "4", "text": "Only (c)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 10)','4b50df6179567075b467b31ef2506d0bab968f6d0eb4b9e1924df7a9fe89fd6d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q13','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',13,'Section A','MCQ','Given :
If the partial pressure of CO2 gas at equilibrium is 
0.4 atm and the total pressure is 1 atm, then the 
value of Kp at the same temperature is','[{"key": "1", "text": "0.027 atm3"}, {"key": "2", "text": "0.064 atm3"}, {"key": "3", "text": "0.144 atm3"}, {"key": "4", "text": "0.216 atm3"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q13.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 10)','6751e8a04512d46263d947f06be86899dd127d08d5e29c9396850e33413146e5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q14','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',14,'Section A','MCQ','Question 14','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q14.png',TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 10)','d0b327333d74f6b013a67ce3116eb0801cfc257db11d8ae3105f60751c45a0ff',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q15','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',15,'Section A','MCQ','CO2 gas is taken at 1 atm, 273K. Now it is allowed 
to pass through 0.1 M Ca(OH)2 aq. solution. Excess 
amount of Ca(OH)2 is neutralised with 40 mL of 0.1 
M HCl. Then find volume of Ca(OH)2 initially taken 
if 50% Ca(OH)2 is react with CO2','[{"key": "1", "text": "40 mL"}, {"key": "2", "text": "20 mL"}, {"key": "3", "text": "80 mL"}, {"key": "4", "text": "50 mL"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 10)','78193f062bec6c8be07f7af0ec411c4c374857e369e8c3b44bc27e78ed3afc58',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q16','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',16,'Section A','MCQ','In a closed insulated container, a liquid is stirred
with a paddle to increase the temperature, which of
the following is true?','[{"key": "1", "text": "w = 0, E = q  0"}, {"key": "2", "text": "E = w  0, q = 0"}, {"key": "3", "text": "E = w = 0, q  0"}, {"key": "4", "text": "E = 0, w = q  0"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','a3b71c893548b63b62272aef7113d5a9c1e185ecbfbec847836ad190ebc0d882',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q17','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',17,'Section A','MCQ','Match the column and choose the correct option
Column-I
Column-II
(Properties)
(Order)
(A) 
Electronegativity','[{"key": "1", "text": "B < C < N < O\n(B) \nCationic size"}, {"key": "2", "text": "Li > Mg > Be\n(C) \nMetallic Character"}, {"key": "3", "text": "K > Mg > AI\n(D) \nElectron affinity"}, {"key": "4", "text": "Cl > F > Br > I"}, {"key": "1", "text": "A-1, B-2, C-3, D-4"}, {"key": "2", "text": "A-4, B-3, C-2, D-1"}, {"key": "3", "text": "A-2, B-3, C-4, D-1"}, {"key": "4", "text": "A-3, B-2, C-4, D-1"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','73f0e218c0b3a516b56d8d36ce2b06a9a62a49354cd0a81384874c15959264f5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q18','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',18,'Section A','MCQ','Identify C.','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift1_chemistry_q18.png',FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','ac4658a91d47d039d6c9a4ef3cf6df3915fb5098ce7c5276c0008b02b250dc0d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q19','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','d57085372b826e7dad84d5f82940417a9c0da002152ca4332ffc3e3addc533d2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q20','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',20,'Section B','Numerical Value','contains 5 Numerical based questions. The answer to
each question should be rounded-off to the nearest
integer.',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','9fcef2bfe45b8e1c98e1cde7d502448c48712738718f416b5cd99ad9378816fb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q21','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',21,'Section B','Numerical Value','Find molecular weight of (A) in g mol-1',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 11)','73a43d38a77a8b37e775af26b587bcbce743950d8ac2ba7c99ab75e8f97fa2f6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q22','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',22,'Section B','Numerical Value','Calculate 
Number 
of 
stereoisomers 
of
=
CH - CH
CH - CH -CH
|
3
3
OH',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 12)','778cf6bd8b4be2095f37d8dda2dd0de5d466707d448ed98dbe76c17dcf3be382',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q23','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',23,'Section B','Numerical Value','How many compounds have linear shape SO2,
-
-
+
N , I , NO , NO
3
3
2
2
BeCl2, 
?',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 12)','2e0fb060791d201386dcd4a94613d9d1c6d6d83d9eb8f001e07b5345e8145ba5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q24','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',24,'Section B','Numerical Value','In Carius method 180 mg of organic compound
gives 143.5 mg of AgCl. Find the percentage of Cl
in the organic compound. (Nearest integer)',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 12)','1ff689ba96504865990ea92475a2dc974c94058f007de8865c1837678ddd0660',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_chem_q25','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Chemistry',25,'Section B','Numerical Value','Two ampere current is allowed to pass through
molten AlCl3 for 30 min. Find the mass (in mg) of
aluminium deposited at cathode. (Nearest integer)',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 12)','4cbde4dcccf67106d275a663ab8dad0632491984f60e488b3f1aa8d932b47eed',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q1','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',1,'Section A','MCQ','The shortest distance between the lines
1
2
1
2
3
4
x
y
z
-
-
-
=
=
 and
2
2
1
7
8
2
x
y
z
+
-
+
=
=
 is
88
78','[{"key": "1", "text": "1277"}, {"key": "2", "text": "1277\n55\n66\n1277"}, {"key": "3", "text": "1277 \n(4)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 13)','96d8d672a45021a982cda901845d9fa671b836367bfb255e04a32317ba0fc6af',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q2','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',2,'Section A','MCQ','In a bag there are 6 white and 4 black balls two balls 
are drawn at random, then the probability that both 
ball are white are
2','[{"key": "2", "text": "1"}, {"key": "1", "text": "1\n3"}, {"key": "3", "text": "2\n3"}, {"key": "4", "text": "1\n4"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 13)','644b130d4cfbd3c20c46af4a8225cf1e532a9ec556189a5b40e5be767f5f4ba6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q3','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',3,'Section A','MCQ','Let A = {1, 2, 3} number of non-empty equivalence 
relations from A to A are','[{"key": "1", "text": "4"}, {"key": "2", "text": "5"}, {"key": "3", "text": "6"}, {"key": "4", "text": "8"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 13)','e915e22e78c2d591d23841a7edba0af59f4479fd8978996f7dc949115cd661ec',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q4','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',4,'Section A','MCQ','If 
1
2
1
2
( )
16(sec
)
(cosec
)
f x
x
x
-
-
=
+
. 
Then 
the
maximum and minimum value of f(x) is
2
2
1001
2
and
33
9
π
π
2
2
1105
4
and
68
17
π
π','[{"key": "1", "text": "(2)"}, {"key": "4", "text": "2"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 13)','fe6362a7353adcfba758ba48ba29bb4e820f996fde4762c70149735ecf932478',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q5','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',5,'Section A','MCQ','If 
(
)
(
)
2
2
1
1
8
3
3
3
...
4
4
p
p
=
+
+
+
+
+
∞ then the
value of p is
5','[{"key": "2", "text": "16"}, {"key": "1", "text": "14\n5\n5"}, {"key": "4", "text": "4"}, {"key": "3", "text": "3\n5"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 14)','5ba48968977dc9ccf4ea6c40246e5708a47593fd42758130783c95c35fb43c10',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q6','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',6,'Section A','MCQ','If 
2
3
1
dx
x
dy
y
y
+
=
, x(1) = 1. Then 
1
2
x',NULL,NULL,TRUE,'Options incomplete or rendered as diagram','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 14)','9e6609177a777b11b4d22a037b91102d3f8bd7c6f760588927d7b8d0c6dfad3f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q7','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',7,'Section A','MCQ','Let 
(2
1)(2
1)(2
3)(2
5)
64
-
+
+
+
=
r
r
r
r
r
T
, then
n
1
lim
→∞
=∑
n
r
r
T is equal to
1
45','[{"key": "2", "text": "32"}, {"key": "1", "text": "22\n35"}, {"key": "3", "text": "27\n45"}, {"key": "4", "text": "32\n45"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 15)','174f0273bf337eed615f1deacd0f28e3d700c9130c69f1f50fc7f0bbb53859eb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q8','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',8,'Section A','MCQ','Coefficient of x2012 in (1 - x)2008 (1 + x + x2)2007','[{"key": "1", "text": "0"}, {"key": "2", "text": "1"}, {"key": "3", "text": "2"}, {"key": "4", "text": "3 \nAnswer (1)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 15)','83fee2ea84a4ab999bdb1e7abbb8ab90a7f7e1257b0cc2f81b80771bd3dd1a83',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q10','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',10,'Section A','MCQ','If A = {1, 2, 3, …., 10}.
,
,
and
and gcd of (
, )
1}.
m
B
m n
A
m
n
m n
n

=
∈
<
=

Then number of elements in set B is','[{"key": "1", "text": "30"}, {"key": "2", "text": "31"}, {"key": "3", "text": "28"}, {"key": "4", "text": "29"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 15)','30de1be91810f70caeef663e2c79d65c66c335ba1de6b41b98c46dd945d72045',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q11','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',11,'Section A','MCQ','How many ways are there to pick 5 letters from 
English alphabets such that M is the middle of the 
letters (repetition not allowed).','[{"key": "1", "text": "26\n5\nC .5!"}, {"key": "2", "text": "25\n4\nC .4!"}, {"key": "3", "text": "26\n4\nC .4!"}, {"key": "4", "text": "25\n5\nC .5!"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 16)','ca782b7ac9c605c830dea9adda5a401d3d00f65bb3d26574ff309f849186b00a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q12','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',12,'Section A','MCQ','Let |Zi| = 1 for i = 1, 2, 3 satisfying
2
1
2
2
3
3
1
2
+
+
=
+
Z Z
Z Z
Z Z
a
b
, where a, b an
rational numbers such that 
1
2
arg(
)
, arg(
)
0
4
π
=
=
Z
Z
and 
3
arg(
)
4
-π
=
Z
, then find (a, b)','[{"key": "1", "text": "(5, 2)"}, {"key": "2", "text": "(-5, -2)"}, {"key": "3", "text": "(5, -2)"}, {"key": "4", "text": "(-5, 2)"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 16)','ca30e3f3259eba31d36ac5cc08ee78e4899bf36f65ba81b30d2dd3e3ec05119f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q14','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',14,'Section A','MCQ','Let 
( )
3
(3
)
(0,3)
3
x
g x
f
f
x
x


=
+
-
∀∈




and
( )
0
(0,3)
f
x
x
′′
>
∀∈
 then g(x) decreases in interval
(0, α), then α is
4','[{"key": "2", "text": "2"}, {"key": "1", "text": "7\n3\n4"}, {"key": "4", "text": "7"}, {"key": "3", "text": "9\n3"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 17)','0aeff9b8d0a124072a11e7059d04ca940a3c3287fe83b61e6746af4ecef1347a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q15','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',15,'Section A','MCQ','Let 
ˆ
ˆ
4 ,
0
b
i
k
= λ +
λ >

and the projection vector of

on 
ˆ
ˆ
ˆ
2
2
a
i
j
k
=
+
-

 is c. If |
|
7
a
c
+
=


, then the
b

area of the parallelogram formed by vector b
and
c is (in square units)','[{"key": "1", "text": "8"}, {"key": "2", "text": "16"}, {"key": "3", "text": "32"}, {"key": "4", "text": "64"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 17)','71e8e9b662852389f028399dca077c842394761fed32849527a4c105951307dc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q16','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',16,'Section A','MCQ','Let the parabola y = x2 + px - 3 cuts the coordinate 
axes at P, Q and R. A circle with centre (-1, -1) 
passes through P, Q and R, then the area of 
triangle PQR.','[{"key": "1", "text": "5"}, {"key": "2", "text": "3"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 18)','666a98801cef9e3f653f8bd466c466d4bec8a7ac74c83ea6a3a51e0fb8d9aec6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q17','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',17,'Section A','MCQ','If the circle (
)
2
2
2 3
12
x
y
-
+
=
 and parabola',NULL,NULL,TRUE,'Options incomplete or rendered as diagram','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 18)','c787b4160758b5c7bde671764088722e56bb9985fb034effc579dfdf6f2382ec',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q18','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',18,'Section A','MCQ','A hyperbola with foci (1, 14) and (1, -12) passes
through the point (1, 6). The length of the latus
rectum of the hyperbola is','[{"key": "1", "text": "144\n5"}, {"key": "2", "text": "50"}, {"key": "3", "text": "288\n5"}, {"key": "4", "text": "100"}]',NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 18)','466b18e714529fadda8f31f40181784456f6cf8dece088b834087c08602529fc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q19','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 18)','f00fa43b599a14c9e0ef6807b61cd686b3501c0b2b317c7a4438ae37f82055af',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q20','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 18)','e285fff9c31eb83bfd50c7b7b1e3bfbbaf61579ebc062570e22e635876e0d760',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q21','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',21,'Section B','Numerical Value','If A be a 3 × 3 square matrix such that det(A) = -2. 
If det(3 adj(-6 adj(3A)) = 2n ⋅ 3m, where m ≥ n, then 
4m + 2n is equal to',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 19)','2d26f00b575a0821d7be09130b560b3a3cb261401104b2c8f7f0991e9dc8e5bb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q22','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',22,'Section B','Numerical Value','If a1, a2, a3..., an are in geometric progression such 
that a1a5 = 28, a2 + a4 = 29, then the value of a6 is
(1) 635 
(2) 784
(3) 872 
(4) 898',NULL,NULL,FALSE,NULL,'12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 19)','86558cf51037f87ba75de553700deecea17e740f654a0bd388dad51b0b1eee57',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q23','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',23,'Section B','Numerical Value','Question 23',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 19)','451c4bcd7458eea164411f979200677b6f1b67ff8bb4441e04f8078e5166ca64',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q24','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 19)','212243171b357b43a022bc9fe95de885e0c896221e41352825817139690544c9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift1_math_q25','jee_main_2025_btech_20250122_shift1','JEE Main',2025,'B.Tech','22 January 2025','Shift 1','Morning','Mathematics',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','12244-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025_Shift_1-PDF-Download.pdf (Page 19)','5dd113fc40d6f23e20d1f9640a0e055f571ba13880a1c96e073f4f5310587e8c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q1','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',1,'Section A','MCQ','An equiconvex lens of focal length f, is cut into four 
parts as shown in the diagram. The focal length of 
each part is','[{"key": "1", "text": "f"}, {"key": "2", "text": "2f"}, {"key": "3", "text": "f/2"}, {"key": "4", "text": "4f"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q1.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 2)','63d8f3afa5325830dc3bd6e22b3fa42ca59584f9df3b8e304bba22ed24573997',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q2','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',2,'Section A','MCQ','Radius of a tube decreases from 2R to R in which 
ideal liquid is flowing at same level.
Speed at one end is 2 m/s as shown, find speed v at 
other end','[{"key": "1", "text": "4 m/s"}, {"key": "2", "text": "1 m/s"}, {"key": "3", "text": "2 m/s"}, {"key": "4", "text": "8 m/s"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q2.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 2)','56847be136729024b27dedf8c89cae7c218fd8690135648e74e042feb04b424b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q3','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',3,'Section A','MCQ','The dimensional formula of capacitance is','[{"key": "1", "text": "[M-1L2T2A-3]"}, {"key": "2", "text": "[M-1L-2T4A3]"}, {"key": "3", "text": "[M-1L-2T4A2]"}, {"key": "4", "text": "[M-1L-2T2A2]"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 2)','fd33fdacbf076f087736892cbbd20275ba882e81dee5343c21cfb5289461f4d3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q4','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',4,'Section A','MCQ','A proton is moving with uniform velocity of 2 × 108 m/s 
in uniform magnetic and electric fields which are 
perpendicular to each other. If electric field is switched 
off then proton moves in circular path of radius 1.6 × 
10-5 m. Then magnetic field is B','[{"key": "1", "text": "5 × 10-5 T"}, {"key": "2", "text": "1.2 × 105 T"}, {"key": "3", "text": "2.5 × 104 T"}, {"key": "4", "text": "2. 5 × 102 T"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 2)','61c97bc6c5de1097965bdd372811b1cdffde82eb52668eb65e25b73290f4acf4',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q5','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',5,'Section A','MCQ','A conducting circular ring is moving with a constant 
velocity in a uniform magnetic field as shown. Identify 
the correct graph between induced emf vs time','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q5.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 2)','b50df22375055878ed34371c953d137427ec2d81aecbad3fba9d00cac8d0335d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q6','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',6,'Section A','MCQ','The displacement of a particle moving under the 
action of a force
=
+
+
d
i
j
k . 
ˆ
ˆ
ˆ
2
=
+
+
F
i
bj
k is 
ˆ
ˆ
ˆ
Find the value of b if the work done by the force is 
zero.','[{"key": "1", "text": "0"}, {"key": "2", "text": "+3"}, {"key": "3", "text": "-3"}, {"key": "4", "text": "-1"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q6.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 3)','d8506096b501e544143e06e9b1782f361a00857d72ff62fd26050ea250d9d36e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q7','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',7,'Section A','MCQ','In a series LCR circuit the maximum amplitude of 
current is I0 when the resistance is R. What is the
maximum amplitude of current if the resistor is
R
replaced by a resistor of resistance 
.
2','[{"key": "1", "text": "I0"}, {"key": "2", "text": "2I0\n2\n3\nI0\n2\nI0"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 3)','8947dd80648df7bd7f75c134af2329ea0ce74e0745aa72192e23628ec0d2199d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q8','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',8,'Section A','MCQ','Statement-I : Fringe width of red light is more than 
fringe width of violet light.
Statement-II : Fringe width is directly proportional to 
the wavelength of light used.
Choose the correct option.','[{"key": "1", "text": "Statement-I is correct and statement-II is\nincorrect"}, {"key": "2", "text": "Both statement-I and statement-II are correct"}, {"key": "3", "text": "Statement-I is incorrect and statement-II is\ncorrect"}, {"key": "4", "text": "Both statement-I and statement-II are incorrect"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 3)','9e3cbf61325211aebc2b3d3c26e925d2727e426b2b6640ef6ff061c5bc9b204c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q9','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',9,'Section A','MCQ','For non-vibrating diatomic gas has adiabatic constant
of 1 & for vibrating diatomic gas has adiabatic
constant of 2 then','[{"key": "1", "text": "1 > 2"}, {"key": "2", "text": "1 < 2"}, {"key": "3", "text": "1 = 2"}, {"key": "4", "text": "None of these"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 4)','81bd72ca0bbef808dd174f3777f50f2fccc8c7a3767f287435cdcfb0d67989a1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q11','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',11,'Section A','MCQ','The net magnetic field at point O due to the two infinite 
current carrying wires shown in the figure is','[{"key": "1", "text": "1 × 10-5 T"}, {"key": "2", "text": "1.2 × 10-5 T"}, {"key": "3", "text": "1.5 × 10-5 T"}, {"key": "4", "text": "2 × 10-5 T"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q11.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 4)','69b9781a352516fb62ba0ad97a884bfe71b625e356d120f776a829affa440729',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q12','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',12,'Section A','MCQ','Read the statements and select the correct option.
Statement I : A pendulum is taken from Earth to 
another planet having mass four times and radius 
double than earth, then time period of pendulum 
remain same as on earth.
Statement II : The time period of pendulum only 
depends on the gravity of the planet.','[{"key": "1", "text": "Statement I is true but statement II is false."}, {"key": "2", "text": "Statement II is true but statement I is false."}, {"key": "3", "text": "Both statements are false."}, {"key": "4", "text": "Both statements are true."}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 4)','cad1d7a259549f224ab8c3ca6de4dd03b4765f1eca7398770ebe582e22d2ac94',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q13','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',13,'Section A','MCQ','For a given logic circuit truth table is given identify the 
gate G.','[{"key": "1", "text": "AND"}, {"key": "2", "text": "NOR"}, {"key": "3", "text": "NAND"}, {"key": "4", "text": "OR"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q13.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 5)','1ec09d390ec52f6e9560aeaef05416978c94fb9cd8216e3acedef8cb617c6e50',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q14','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',14,'Section A','MCQ','Name the logic gate','[{"key": "1", "text": "OR"}, {"key": "2", "text": "AND"}, {"key": "3", "text": "NOT"}, {"key": "4", "text": "NAND"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q14.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 5)','7e36f462d21bfdbfc694ec8d2172bab7ac98be6b526e80157dfc8ddcc4923b9a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q15','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',15,'Section A','MCQ','Displacement current in capacitor of area 16 cm2 is 
6 A at an instant. Find displacement current across 
area 3.2 cm2','[{"key": "1", "text": "1.2 A"}, {"key": "2", "text": "1.6 A"}, {"key": "3", "text": "2.1 A"}, {"key": "4", "text": "0.5 A"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q15.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 5)','4351539d545f16a95901cf5f9ba3e48b55e5e1e31b41e06abe560fa043123197',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q16','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',16,'Section A','MCQ','In the RC circuit shown, find I.
V
R
5
3
R
5
V','[{"key": "1", "text": ""}, {"key": "2", "text": "3V\nR\nR\n13\nV\n8"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q16.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 5)','0e2a8f34ad7b64ab0d5fa6719a0bb06751fcfea0241094aae1a149ba3e6be80d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q17','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',17,'Section A','MCQ','A glass slab of refractive index \mug = 1.44 is coated with
a thin film of refractive index \muf = 2. The minimum 
thickness of the film so that maximum transmission of
=
 (incident 
 A
5000
o
green light of wavelength 
normally) takes place is','[{"key": "1", "text": "0.500 \\mum"}, {"key": "2", "text": "0.250 \\mum"}, {"key": "3", "text": "0.125 \\mum"}, {"key": "4", "text": "1.00 \\mum"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 5)','996c589b66afc52803b4d138d41b7834369ab28be596bb65c74eadac46c956e3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q18','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',18,'Section A','MCQ','For the electric dipole shown in the figure, the
electric field and the electric potential are E0, V0 at
a distance r on the axis. Then what is the electric
field and the electric potential at a point on the
equatorial plane at a distance 2r.
E , 0
16
0','[{"key": "1", "text": "E , 0"}, {"key": "2", "text": "(3) E0, V0"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q18.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','8125659bc6adbd1372a2327e421089ad27819ffd3677189309810f3a997ada54',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q19','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','7bd570b9c2cd53931dc0ad9c5acbc8cdaaa4e6c634d0d0a34f31edd8bd5110bf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q20','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',20,'Section B','Numerical Value','Choose the correct answer:',NULL,'/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q20.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','fb5098b6e0f1d86834aab3107887ce26bff15e86ca87746741d30963d5cb92e8',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q21','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',21,'Section B','Numerical Value','A projectile is fired with speed of 20 m/s at angle of
60° with horizontal. The speed at highest point of
trajectory is x m/s then x is',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','4aad475d9cd9ac43c8df0672f03b86ccfa89f4a2aa83157864a8cade15f9cbe2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q23','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',23,'Section B','Numerical Value','Question 23',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','fbae8777cdf14a00e1c3c52ac78507bf70a7aaee3834bd2e536aa22368d0586f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q24','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','0c9c3a7e23789ac79f37b932702ea04c4979fda7c5b5c46d69b055a595e1fa0e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_phys_q25','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Physics',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)','22081a12e4d6ae93e131c357bfe3ee33f8abca77389ffb5aba57e0db6c0409ab',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q1','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',1,'Section A','MCQ','The product is','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q1.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 7)','74880e9158d2bb7d21c0bd3a9e5a4bb0ff7ee699d439d9b8b07485f0b5c3ca15',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q2','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',2,'Section A','MCQ','Density of 3 M NaOH is 1.25 g/ml. Molality of
solution is','[{"key": "1", "text": "2.65"}, {"key": "2", "text": "2.5"}, {"key": "3", "text": "2.8"}, {"key": "4", "text": "3"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 7)','434268e2a7145685b0eaf96a497767afd5a887357ad77c927a7c4f7de7b945dd',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q3','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',3,'Section A','MCQ','Arrange according to CFSE.
(i) [Co(NH3)4]2+
(ii) [Co(NH3)6]3+
(iii) [Co(NH3)6]2+
(iv) [Co(en)3]3+','[{"key": "1", "text": "(iv) > (ii) > (iii) > (i)"}, {"key": "2", "text": "(iv) > (iii) > (ii) > (i)"}, {"key": "3", "text": "(i) > (iii) > (ii) > (iv)"}, {"key": "4", "text": "(i) > (ii) > (iii) > (iv)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 7)','9fd6ac9a0546d55ea7f86c3185298188c42bea0c6b71a61fe7d07ee0771431cb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q4','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',4,'Section A','MCQ','What is correct order of stability of carbocation.','[{"key": "1", "text": "a > b > c > d"}, {"key": "2", "text": "c > a > d > b"}, {"key": "3", "text": "a > c > d > b"}, {"key": "4", "text": "c > b > a > d"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q4.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 8)','4743d509354be05e892f44092120e3ef6af4264e38c044b783b31b772b4512b9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q5','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',5,'Section A','MCQ','Which of the following anion will not undergoe
disproportionation?
- 
ClO
-','[{"key": "2", "text": "3\nClO"}, {"key": "1", "text": "4\n-"}, {"key": "4", "text": "ClO\n-\nClO2\n(3)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 8)','ef9557e695014333fb75914b2222ff93d11e89c13b28177d8595f3be8542f24b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q6','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',6,'Section A','MCQ','Compare dipole moment of
(I) NF3 
(II) CHCl3
(III) H2S 
(IV) HBr','[{"key": "1", "text": "I > II > III > IV"}, {"key": "2", "text": "II > III > I > IV"}, {"key": "3", "text": "II > III > IV > I"}, {"key": "4", "text": "III > I > IV > II"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 8)','90e808e7bc9352652b48a97323e85e3eacad687017bae155e7f84cb2ef0793ff',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q7','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',7,'Section A','MCQ','Given below are two statements
S-I: Lassaigne test is used for detection of Nitrogen, 
phosphorous, sulphur and Halogens.
S-II: Lassaigne extract is made with magnesium 
metal.','[{"key": "1", "text": "Both S-I and S-II are correct."}, {"key": "2", "text": "Both S-I and S-II are incorrect."}, {"key": "3", "text": "S-I is correct but S-II is incorrect."}, {"key": "4", "text": "S-I is incorrect but S-II is correct"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 8)','94a3d56afc786a12a657d85969e5419b2ad60e63a19a83ebda6ae92a288e1eae',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q8','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',8,'Section A','MCQ','Which one has two secondary Hydrogen atoms?','[{"key": "1", "text": "2, 2, 4, 4-tetramethylheptane"}, {"key": "2", "text": "2, 2, 3, 4-tetramethylheptane"}, {"key": "3", "text": "2, 2, 3, 3-tetramethyloctane"}, {"key": "4", "text": "3-ethyl-2, 2-dimethylpentane"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 8)','36304d77b7ba69ed53a3474a804ef6ca0c06ffbdc7a8de2fdadc4925a64454ad',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q9','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',9,'Section A','MCQ','Secondary butyl cyclohexane when reacts with Br2
in presence of sunlight produce','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q9.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 9)','f683795368f002d4cda0653809866f454d9ccf9a343ac5bfc6cf449049a4d215',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q10','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',10,'Section A','MCQ','200 mL of 0.2 M solution of NaOH is mixed with 400
mL of 0.5 M NaOH solution. Molarity of mixture is','[{"key": "1", "text": "0.4"}, {"key": "2", "text": "0.6"}, {"key": "3", "text": "4 M"}, {"key": "4", "text": "0.8 M"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 9)','66d2d8a4fd080d0dd09a549b0e1f47949ffe89f3319093693aa7cf986f6a5219',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q11','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',11,'Section A','MCQ','Correct structure of L-Glyceraldehyde is','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q11.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 9)','ff1ee406aaad659dc98c5e7748c08e9954c945e05fdd8783968420c826989bb5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q12','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',12,'Section A','MCQ','Identify the extensive and intensive property?','[{"key": "1", "text": "Mass, volume, conductivity - Intensive property"}, {"key": "2", "text": "Mass, temperature, heat, volume - Extensive\nproperty"}, {"key": "3", "text": "Mass, volume, internal energy - Extensive\nproperty"}, {"key": "4", "text": "Density, temperature, moles, internal energy -\nIntensive property"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 9)','8081bf8e65519cfd4acd9ca4edb68d7537588d30d6e4c9f19419daaaf206f813',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q13','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',13,'Section A','MCQ','Among Group-15 elements, what is the maximum
covalency of an element having weakest E-E bond
(E = element)','[{"key": "1", "text": "4"}, {"key": "2", "text": "3"}, {"key": "3", "text": "5"}, {"key": "4", "text": "2"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 9)','2f4c2da54e004e34ad30776d9021e1fb88ff0b3b1f38463a4f8196bb02d7cac0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q14','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',14,'Section A','MCQ','What is the relation between Ksp and S of Zr3 (PO4)4
1
7
1
7
(
)
(
)
=
6912
(
)
K
S
sp
(
)
K
S
sp
(
)
(
)
= 144','[{"key": "1", "text": ""}, {"key": "2", "text": "6912\n="}, {"key": "4", "text": "None \nK\nS\nsp\n(3)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','ec0143dc5a717cccd57219a3b4182aa19ad5a5c638bd46753bcf0db88c0fcef3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q15','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',15,'Section A','MCQ','Match the column and choose the correct option
(A) 
 
(P) 
CP
(
)

(
)
(
)
H
T
P
(B) 
 
(Q) 
CV
(
)

(
)
(
)
G
P
T
(C) 
 
(R) 
-S
(
)

(
)
(
)
U
T
V
(D) 
 
(S) 
V
(
)

(
)
(
)
G
T
P','[{"key": "1", "text": "(A) - (P), (B) - (S), (C) - (Q), (D) - (R)"}, {"key": "2", "text": "(A) - (P), (B) - (S), (C) - (R), (D) - (Q)"}, {"key": "3", "text": "(A) - (P), (B) - (R), (C) - (Q), (D) - (S)"}, {"key": "4", "text": "(A) - (Q), (B) - (S), (C) - (P), (D) - (R)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','8760d05a973bc2fc240a26f089bc216ac5d62d846f228bf5744f2631ba085576',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q16','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',16,'Section A','MCQ','Consider the following statements S-1 and S-2 and 
choose the correct option.
S-1 : During corrosion pure metal acts as anode 
and impure metal acts as cathode.
S-2 : Rate of corrosion is more in alkaline medium 
than in acidic medium.','[{"key": "1", "text": "Both S-1 and S-2 are correct"}, {"key": "2", "text": "Both S-1 and S-2 are incorrect"}, {"key": "3", "text": "S-1 is correct but S-2 is incorrect"}, {"key": "4", "text": "S-1 is incorrect but S-2 is correct"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','9f7df567b5f0ee2ac64c931047e88c3bcf8d837bf363853fcdde4858fbd67f94',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q17','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','7a43a69539ca2f2e1a0893227713168d3e9c7f8d404df8cc647008d4515634ce',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q18','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','e9de9ddc0f598e7f93a28190e0e363f1f9640ebf91d7cb6d920c7f30e17dbbaf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q19','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','1f8c90399bf128644c91067b5c363103025a1c97ba495fcc59d143c82140300d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q20','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',20,'Section B','Numerical Value','contains 5 Numerical based questions. The answer to
each question should be rounded-off to the nearest
integer.',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','7e3483a8848d5ef198bd0efe03d209e88a2fdcddc7df4323009ab96d2db1bb8b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q21','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',21,'Section B','Numerical Value','In Ru and Nb, if in Ru, 4d electrons are x and in Nb,
4d electrons are y then find the sum of x and y.',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 10)','26a2c55db54adb11ba38dc4392a264ef1e878397b970924c37b0c6ce319f8c8f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q22','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',22,'Section B','Numerical Value','2
Ni
2DMG
Complex
+ +
⎯⎯→
How many hydrogen bonds are present in a 
molecule of the complex?',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 11)','a172eaf2bf6172064fd10c61877efe10550c9a7bb209e2de62587948636aa13d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q23','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',23,'Section B','Numerical Value','How many R - Br can form isopentane?',NULL,'/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q23.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 11)','bf5102b7bc1e39fc5a2a66360d5b89f1e6f900c85733fe48c3fb1a31233317f0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q24','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',24,'Section B','Numerical Value','Find the number of -electrons in C6H6.',NULL,'/pyq_diagrams/jee_main_2025_btech_20250122_shift2_chemistry_q24.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 11)','8437fe77cf26c30a7511fb953b8361d2655b0842929ea7ce1ce298bc2a9bc152',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_chem_q25','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Chemistry',25,'Section B','Numerical Value','Calculate the radius of first excited state of He+ ion
(in Å)',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 11)','7bbc5925ba8f5bce6fb48d96e1579547590102d4fd7e3a92d810a95e0d3fc7bd',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q1','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',1,'Section A','MCQ','If 2x2 + (cos)x - 1 = 0,  [0, 2] has roots  and 
. Then the sum of maximum and minimum value 
of 4 + 4.
16
25','[{"key": "1", "text": "16\n9"}, {"key": "2", "text": "16\n41"}, {"key": "3", "text": "17\n8\n(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 12)','c6d911bd5f6c20208393f0d0c642c4e58f7186688711772e209205056e40b78c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q2','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',2,'Section A','MCQ','If   [0, 2] satisfying the system of equations 
2sin2 = cos2 and 2cos2 = 3sin. Then the sum 
of all real values of  is
2

3','[{"key": "1", "text": ""}, {"key": "2", "text": "\n\n5\n6\n\n2"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 12)','c9245af0c2d74a8b6fd4e4c0e2280857b0eb566aa78f24cd458cb9879c1a27c7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q3','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',3,'Section A','MCQ','Let  A = {1, 2, 3, 4} and B = {1, 4, 9, 16}.
If f : A → B, number of many-one functions from A 
to B are','[{"key": "1", "text": "24"}, {"key": "2", "text": "232"}, {"key": "3", "text": "256"}, {"key": "4", "text": "252"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 12)','2a21f6c8d591211a45728fea13b6192abc361ca974b228279eb41b2d46948c23',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q4','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',4,'Section A','MCQ','4 boys and 3 girls are to be seated in a row such 
that all girls seat together and two particular boys 
B1 and B2 are not adjacent to each other. Then the 
number of ways in which this arrangement can be 
done.','[{"key": "1", "text": "432"}, {"key": "2", "text": "430"}, {"key": "3", "text": "516"}, {"key": "4", "text": "1002"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 13)','b754f98a5ecfe871172aeaf8560b644fbc9280c448b501d6fb82e36aa1a35a6b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q5','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',5,'Section A','MCQ','If the sum 
, then  is equal
.2
30
0
-1
C
=
r
r
to','[{"key": "1", "text": "225"}, {"key": "2", "text": "465"}, {"key": "3", "text": "345"}, {"key": "4", "text": "425"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 13)','20a0a841badbfde480cd69b0172f6fadc3fcf517a373a24c5e6e34d488f15dc7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q6','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',6,'Section A','MCQ','Consider a function 
. The
e
0
number of points of extrema are','[{"key": "1", "text": "3"}, {"key": "2", "text": "5"}, {"key": "3", "text": "7"}, {"key": "4", "text": "9"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 13)','1defac1c0b5486cd8892bf6b75cae1d74517f14dbb5f79fc23617fa6430e5231',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q7','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',7,'Section A','MCQ','Let A and B are two events such that
10

=
P A
B
 and P(A/B) and P(B/A) are the 
1
(
)
roots of the equation 12x2 - 7x + 1 = 0, then

(
)
(
)
P A
B

is equal to
P A
B
9
4
9
4','[{"key": "1", "text": ""}, {"key": "2", "text": "2\n3\n2\n3"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 13)','3673d6612445b1aa1347bf2434d7f4d8a7ba0d1d2cad406ec8036cdd47f3a63a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q8','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',8,'Section A','MCQ','Number of terms in an arithmetic progression is 2n. 
Sum of terms occurring at even places is 40 and 
sum of terms occurring at odd places is 55. If the 
first term exceeds the last term by 27, then n equals 
to','[{"key": "1", "text": "3"}, {"key": "2", "text": "5"}, {"key": "3", "text": "7"}, {"key": "4", "text": "4"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 14)','12629a15e46ddbc773b5727862ba0254c96db827294e55f5f65c6a074b6e68a0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q9','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',9,'Section A','MCQ','The perpendicular distance of point P(3, 4, 5) from 
the line
2
(4
5 )
r
i
j
k
i
j
k
=
-
+
+ 
-
+
 is  
ˆ
ˆ
ˆ
ˆ
ˆ
ˆ
19
21
42
19','[{"key": "1", "text": ""}, {"key": "2", "text": "21\n19\n19\n42"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250122_shift2_mathematics_q9.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 14)','6bf0b1e0b076130418d6af01cf3fb1b765a6a5df1e0c9b9b3e8a8ae3382ebd04',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q10','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',10,'Section A','MCQ','In the expansion of 
,
where , ,  and  are the coefficient of x, x3, x5 
and x7 respectively. If u - v = 18, u + v = 20 
then u + v equal to.
-13
15
15
-14','[{"key": "1", "text": ""}, {"key": "2", "text": "-2\n3\n5\n-3"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 15)','d25d0a32e9a867693fe48f0c5bb000cf439b20445ead37dd98923a2f4918df7b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q11','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',11,'Section A','MCQ','Let A(6, 8), B(10 cos, - 10sin) and C(-10sin,  
-10cos) be 3 points and if orthocentre of the 
triangle ABC is (0, 9) then 100sin2 is equal to
4
25','[{"key": "1", "text": ""}, {"key": "2", "text": "25\n5\n4\n4\n15"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 15)','cf2bcb690e08a6556fdfd12ab8dbf187626adb04de4010ef52cb8c52c9f120c6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q12','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',12,'Section A','MCQ','If z be a complex number such that |z - 3|  1, then 
the equation of line with largest slope passing 
through origin and z
x
y
 
+
=
x
y','[{"key": "2", "text": "2 2\n0\n-\n="}, {"key": "1", "text": "2 2\n0\nx\ny\n \n-\n=\nx\ny"}, {"key": "4", "text": "2 2\n0\n+\n="}, {"key": "3", "text": "2 2\n0"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 15)','7966f5ae93dbea93fd41d75ba9cb232a44f973b796887926214ebfe4711e6c92',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q13','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',13,'Section A','MCQ','A relation R is defined on set A, A = {1, 2, 3} and  
R = {(1, 2), (2, 3)}. Elements are added such that R 
becomes reflexive and transitive but not symmetric. 
Find the number of such relations.','[{"key": "1", "text": "3"}, {"key": "2", "text": "4"}, {"key": "3", "text": "2"}, {"key": "4", "text": "9"}]',NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','f15b873e140de3455c6a676bb591f22768400545df65bc33a6c448fcbe826445',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q14','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',14,'Section A','MCQ','Question 14',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','d9b6ea78b60645f38fed49ea60a2e78e981fd10277c625711760c49cc0320a47',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q15','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',15,'Section A','MCQ','Question 15',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','adc795ac83b81fa0e62e214a00d805984e92f70ebce0d972d54260a8e3e6b01c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q16','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','d7afe675806cefa056bcdc34e9e85a8be721287615a55449cd55b267c7b08f65',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q17','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','8d45319d77e9b7fe09b2d27297f14cb94c1f2e7164396479535744aeda4605df',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q18','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','021e106ca7a7d5703c03d45c9f0048126ab0b9d87f90295470d8676d77ba2e62',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q19','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','6431b2829bdced00518b5057a728bcc6b1620503edff7932f0979b936232016b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q20','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',20,'Section B','Numerical Value','+ 
 

+
 and 2a
b
. If 
a
3b
3

21. 21. Let a and b be two unit vectors such that angle
between  a and b is
are perpendicular to each other, then the product of 
all possible values of  is ____',NULL,'/pyq_diagrams/jee_main_2025_btech_20250122_shift2_mathematics_q20.png',FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','ce5f8590e94c9150f96b713258df62c01078bab1d75e6b3c613213145ddfe73e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q22','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',22,'Section B','Numerical Value','If A is the 3 × 3 matrix of order 3 × 3, such that
2
1
det(A) = 
, tr(A) = 10 and B be another matrix of
order 3 × 3 and defined as B = adj(adj(2A)), then 
det(B) + tr(B) is equal to (where tr(A) denotes trace 
of matrix A)',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)','404c7c1be4f1edcaf3db8337da635f19c76e7798be8b7452d099b44314f281fc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q23','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',23,'Section B','Numerical Value','Consider 
two 
curves 
 
with
E
1
2
2
A
B
+
=
x
y
:
1
2
2
eccentricity 
e1 
and 
 
with
E
2
e
=
e
1
3
1
eccentricity e2. If 
and distance between foci
2
of both curves is 2 3 and a - A = 4, then the sum
of lengths of latus rectum of both curves is',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 17)','db752ff2a65da45fe12f4860d594cc04c923e63d28e6d8894b9e3c10037fb6f7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q24','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',24,'Section B','Numerical Value','The number of maximum number of common 
tangents to the curves y = (x - 2)2 and y2 = 16 - 8x 
is',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 17)','184fc958b4230f6a3cf0424c0abfd83b37d197bf76afe15e3849b5bc68420036',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250122_shift2_math_q25','jee_main_2025_btech_20250122_shift2','JEE Main',2025,'B.Tech','22 January 2025','Shift 2','Evening','Mathematics',25,'Section B','Numerical Value','Let P(10, -2, -1) and Q be the point of 
perpendicular drawn from point R(1, 7, 6) on the line 
joining the points (2, -5, 11) and (-6, 7, -5). Then 
the length PQ is',NULL,NULL,FALSE,NULL,'122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 17)','2789d8e4cb8313cb306f3617d893350b41784765f241cce31aebdfc9fdc4573e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q1','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',1,'Section A','MCQ','Find total work done from A to E.','[{"key": "1", "text": "-3 P0V0"}, {"key": "2", "text": "3 P0V0"}, {"key": "3", "text": "3 P0V0"}, {"key": "4", "text": "5 P0V0"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_physics_q1.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 2)','991b0bc838c3e4ca19bc0e8a59eec9cd92ed922351b56222c7751adecfcea430',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q2','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',2,'Section A','MCQ','Statement 1: Graph of frequency f of X ray and 
atomic number Z of heavy nucleus is straight line, in 
X ray emission.
Statement 2: Graph of square root of frequency 
f
of X ray and atomic number Z of heavy nucleus is 
straight line, in X ray emission.','[{"key": "1", "text": "Statement 1 is correct and statement 2 is\ncorrect"}, {"key": "2", "text": "Statement 1 is incorrect and statement 2 is\ncorrect"}, {"key": "3", "text": "Statement 1 is correct and statement 2 is\nincorrect"}, {"key": "4", "text": "Statement 1 is incorrect and statement 2 is\nincorrect"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 2)','5c884d6b54cb1fc95f208847dbeaa32621cd1d95cf5c454e7efa6108b0c90cba',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q3','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',3,'Section A','MCQ','Two ideal diodes are connected in circuit as shown. 
Find current through battery.','[{"key": "1", "text": "0.3 A"}, {"key": "2", "text": "1 A"}, {"key": "3", "text": "0.5 A"}, {"key": "4", "text": "0.25 A"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_physics_q3.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 2)','ff939f2d972406cb89af44f5b0372b69da3dfb255faee4a8783b6ff8ff8b037f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q4','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',4,'Section A','MCQ','In a series LCR circuit, inductance L = 100 mH and 
capacitance C = 1nF. The angular frequency of the 
source when current has maximum amplitude in the 
circuit is
5
rad
10
2
s
4
rad
10
2
s','[{"key": "1", "text": ""}, {"key": "2", "text": "10\n \nrads\n6\n10"}, {"key": "4", "text": "rads\n5\n(3)"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 2)','95d0eb9f4a5175c4f46bc1fc2bfc58d59ffe591134c3fe52a3e782488aa4cce3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q5','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',5,'Section A','MCQ','Two charges +7 C and -4 C are located at (-7, 0, 0)
and (7, 0, 0), find electrostatic potential energy of the
(
)

(
)
=
=
\times
(
)
4
k
1
9 10 SI units
9
system.
0','[{"key": "1", "text": "-6 × 109 J"}, {"key": "2", "text": "-18 × 109 J"}, {"key": "3", "text": "18 × 109 J"}, {"key": "4", "text": "6 × 109 J"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 3)','0888ba3ea5bff9e1a21ab345a40586a3f3389d51bd3cde51b799704eecbe7ea2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q6','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',6,'Section A','MCQ','A satellite is nine times closer to earth compared to
moon. Time period of moon is 27 days then period of
satellite is','[{"key": "1", "text": "3 days"}, {"key": "2", "text": "9 days"}, {"key": "3", "text": "1 day"}, {"key": "4", "text": "3 3 days"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 3)','45b7d276fe1c0de7917e1be168f596d40b0e990223d7408cd3bb5092d1e390ea',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q7','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',7,'Section A','MCQ','A concave mirror of focal length f dipped into a fluid of
refractive index \mu. The new focal length mirror is','[{"key": "1", "text": "\\muf"}, {"key": "2", "text": "f\nf\nf\n\\mu-1"}, {"key": "3", "text": ""}, {"key": "4", "text": "\\mu"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 3)','b74ed5c41a34946310c5462bba449d90747eb415853eae7217daf3dcd7c82fd1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q8','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',8,'Section A','MCQ','In an electromagnetic wave of frequency 20 MHz, 
value of electric field is 9.3 V/m, then magnitude of 
magnetic field at that instant is','[{"key": "1", "text": "3.1 × 108"}, {"key": "2", "text": "27.9 × 108"}, {"key": "3", "text": "3.1 × 10-8"}, {"key": "4", "text": "18.6 × 10-6"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 3)','34a028c79ff8383d6caeee8d228ff193597ab4d2c33d24d6d10916c5c9a2455a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q9','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',9,'Section A','MCQ','Match the correct dimensions
(a) 
Magnetic field 
(i) 
ML2
(b) 
Permittivity of 
free space
(ii) 
M-1L-3T4A2
(c) 
Moment of 
inertia
(iii) 
MT-2A-1
(d) 
Velocity 
(iv) 
LT-1','[{"key": "1", "text": "(a) → (iii), (b) → (ii), (c) → (i), (d) → (iii)"}, {"key": "2", "text": "(a) → (iii), (b) → (iv), (c) → (iv), (d) → (iv)"}, {"key": "3", "text": "(a) → (iii), (b) → (ii), (c) → (i), (d) → (iv)"}, {"key": "4", "text": "(a) → (i), (b) → (ii), (c) → (iii), (d) → (iv)"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 3)','7c17c2955ef6ff0d7f7938fbec064fc3db48d1e20238f24eeb98ef495cd19e5c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q10','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',10,'Section A','MCQ','The temperature of a body of mass m and specific
heat capacity s is raised slowly from T1 to T2. The
change is entropy of the system is
(
)
(
)
(
)
ms
T
ln T2','[{"key": "1", "text": "1"}, {"key": "2", "text": "ms\n(\n)\nT\nms\n1\nln\n(3)\n(\n)\n(\n)\nT\n2"}, {"key": "4", "text": "Zero"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 4)','4b6f6b7d7f54f2c378cb3e0c2af8f353e78d337f2a607af7110bb3be0efcc370',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q11','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',11,'Section A','MCQ','A moving coil galvanometer with coil resistance
G = 30 , shows full scale deflection when the current
through it is 20 mA. The galvanometer is converted to
an ammeter of range 3 A by using a shunt resistance
S, then resistance S is','[{"key": "1", "text": "0.2 "}, {"key": "2", "text": "2 "}, {"key": "3", "text": "0.8 "}, {"key": "4", "text": "1.2 "}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 4)','9f90916fa8b9cef5dbcb6cb6d7ab0872514efcbfaa6ffd06a98484b0b1130c92',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q12','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',12,'Section A','MCQ','Torque on a uniform disk of mass 2 kg, radius 1 m is
given as (t) = 5t2 - 8t. If the disk was initially at rest,
find power by torque at t = 1s.','[{"key": "1", "text": "5 W"}, {"key": "2", "text": "3 W"}, {"key": "3", "text": "7 W"}, {"key": "4", "text": "9 W"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 4)','8c489e0a3982b23743894d422c1a60b655f15df1dc1999cdcbd1644ba79bd63f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q13','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',13,'Section A','MCQ','During charging of capacitor of 2.5 \muF in DC circuit,
the displacement current is found to be 0.25 mA then
dt
find rate of change of voltage V w.r.t. time  
.
dV','[{"key": "1", "text": "1 V/s"}, {"key": "2", "text": "10 V/s"}, {"key": "3", "text": "100 V/s"}, {"key": "4", "text": "0.1 V/s"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','87ac65e08dad10e95fe6fb942968e820e01632aabf5e93b04e5f8c597deb0646',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q14','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',14,'Section A','MCQ','In a photoelectric experiment, the stopping potential
of 2 V, the work function of metal is 2.14 eV. Find the
wavelength of incident light (given hc = 1242 eV-nm)','[{"key": "1", "text": "200 nm"}, {"key": "2", "text": "300 nm"}, {"key": "3", "text": "600 nm"}, {"key": "4", "text": "400 nm"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','cbcbeeba406bb66efd332ca9df378eb82117d16761b689ed1d73d183951c1c5f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q15','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',15,'Section A','MCQ','The equation of wave travelling in a medium is given 
by y(x, t) = 4.0 sin(20 × 10-3x + 600t)mm. The velocity 
of wave is n × 104 m/s. Find n.','[{"key": "1", "text": "7"}, {"key": "2", "text": "5"}, {"key": "3", "text": "4"}, {"key": "4", "text": "3"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','f0324ad9d13e0fb3b56af0332edbf868e5cd7b9068f0649662c4566967c180c6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q16','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','c4a4301e9874be6200bcc83a9c1046edbae6efbf13e0ab193069659ced29a3de',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q17','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','71342a54840ec3df909ad6a9d095e122b5523779d9db0dfac539b342bbab7e7d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q18','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','0d74f2b09d2106aecb7abf98d47c7cc173d2d159498a1eaf0aabc98e67bdfa4f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q19','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','046333f933434e2f284071a0122a2363dfc9d3b84bb7adcb3a0973d81528d484',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q20','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','f3ef8edc1475d980fc57a3b9ca7f664348fb299492f63637d70e413d2caac17a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q21','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',21,'Section B','Numerical Value','Find charge on the capacitor (in \muF) at steady state.',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 5)','8194df26f7215571b19ff2c1e87076cfc1c8033e9d0c69120c84e3c763687aac',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q22','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',22,'Section B','Numerical Value','A particle of mass m is projected at angle 60° with
horizontal. If initial kinetic energy is KE0 and kinetic
KE
0
energy at maximum height is 
, find value of x.
x',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 6)','bb5f136e2c232902ac4c49fb212f500cad9c26edeb2570e9fe2b8ea5494f0545',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q23','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',23,'Section B','Numerical Value','The energy in a system varies with position and time
=
, where  = 0.3 sec-1. Given that 

E x t
x e
t
( , )
3
-
as
the percentage error in x = 1.2% and that the %
error in t = 1.6%, find the maximum % error in E at
t = 5 sec.',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 6)','e408cbb904bf22e34c79edd0781193968fa7a155ae58664f5d368bc2e9ef5684',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q24','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',24,'Section B','Numerical Value','For a prism, the minimum deviation is equal to the
angle of prism. If the refractive index is 
3 , find the
minimum deviation (in degrees)',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 6)','3379c657602553947c820d8086ddccbb3cf0a3baa81be7355ab8e66ef272087e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_phys_q25','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Physics',25,'Section B','Numerical Value','A satellite of mass m is moving in circular orbit at a
heigh R from surface of Earth (mass M, radius R). If
the angular momentum of the satellite is 
,
m NGMR
find N.',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 6)','b069df84031285a5e1196f15ef1e35c87f39c876500ca1010c5b7973e0fd861a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q1','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',1,'Section A','MCQ','The correct order of melting points of Group-14 
elements is','[{"key": "1", "text": "C > Si > Ge > Sn > Pb"}, {"key": "2", "text": "Si > C > Ge > Sn > Pb"}, {"key": "3", "text": "Ge > Sn > C > Si > Pb"}, {"key": "4", "text": "C > Si > Ge > Pb > Sn"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 7)','4a8454e9fb73fbd74226e44ba6452633bd2141a7c23e04755c6c41546539a6e5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q2','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',2,'Section A','MCQ','-helix protein and -pleated sheets protein belong 
to which one of the following types of protein?','[{"key": "1", "text": "Primary"}, {"key": "2", "text": "Secondary"}, {"key": "3", "text": "Tertiary"}, {"key": "4", "text": "Quarternary"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 7)','a1fa1738a2b2bf7ef2b4a434952ce52c1815eeb934ec5c1b120a001f9423eceb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q3','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',3,'Section A','MCQ','What will be effect on pH of water when it is heated?','[{"key": "1", "text": "Increase"}, {"key": "2", "text": "Decrease"}, {"key": "3", "text": "Remains same"}, {"key": "4", "text": "pH first increases then decreases"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 7)','7e25a8f84e9b1e791d6083858281f354baa55d7cbf4da60678073d1b98b2671a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q4','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',4,'Section A','MCQ','Match the following List I with List II.
List-I (Alloys) 
List-II (Metals)
A.
Bronze 
(i) 
Fe, Cr, and Ni
B 
Stainless steel 
(ii) 
Cu and Sn
C 
UK Gold Coin 
(iii) 
Cu and Zn
D 
Brass 
(iv)
Au, Ag, Cu, Zn and 
Ni','[{"key": "1", "text": "A-(ii), B-(i), C-(iv), D-(iii)"}, {"key": "2", "text": "A-(iii), B-(iv), C-(i), D-(ii)"}, {"key": "3", "text": "A-(iv), B-(iii), C-(ii), D-(i)"}, {"key": "4", "text": "A-(i), B-(ii), C-(iii), D-(iv)"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 7)','d4928085f34fe475fb422618724e902335ac127191f60c39b95beb9bb50b2345',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q5','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',5,'Section A','MCQ','Which one of the following plots represents zero 
order reaction?','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q5.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 7)','7ebdf6cc137bc43382b6c90c4b1cd405179abb991912b1b6bd6b3cbd61ed59ef',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q6','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',6,'Section A','MCQ','By using relation
G = H - TS
Which of the following relation is incorrect for 
spontaneous reaction at a given temperature?','[{"key": "1", "text": "H > 0, S > 0"}, {"key": "2", "text": "H > 0, S < 0"}, {"key": "3", "text": "H < 0, S > 0"}, {"key": "4", "text": "H < 0, S < 0"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 8)','8be45b5fabb5e350b4edca22d3eaaf09e28f1165605811b22ab8eeb5507e0b4b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q7','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',7,'Section A','MCQ','Statement-I : For a particular shell, maximum 
number of orbitals is n2.
Statement-II : For a subshell, possible orientations 
lies between -l to +l including zero.','[{"key": "1", "text": "Statement-I and Statement -II both are correct"}, {"key": "2", "text": "Statement-I and Statement-II both are incorrect"}, {"key": "3", "text": "Statement-I is correct, Statement-II is incorrect"}, {"key": "4", "text": "Statement-I is incorrect, Statement-II is correct"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 8)','3114b6ad78cea46935186262956d0492bae6c63c979e0f009c0a01ad968b0860',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q8','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',8,'Section A','MCQ','Predict A and B?','[{"key": "1", "text": "(2)"}, {"key": "3", "text": ""}, {"key": "4", "text": "None of these"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q8.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 8)','3c9fe601bed2596259c0ac4f197e0b86457d785251383f25d61883cafba8bd41',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q9','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',9,'Section A','MCQ','Which 
of 
the 
following 
complex 
has 
d4 
configuration?','[{"key": "1", "text": "[Fe(CN)6]3-"}, {"key": "2", "text": "[MnF6]3-"}, {"key": "3", "text": "[Co(CN)6]3-"}, {"key": "4", "text": "[CoCl4]2-"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 8)','e136ef7921139e7ef8e821d4c1e4f1c774bd6b719098bd6f543b8e3e26156537',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q10','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',10,'Section A','MCQ','The total number of isomers possible (aldehyde & 
ketones) for C4H8O are','[{"key": "1", "text": "3"}, {"key": "2", "text": "4"}, {"key": "3", "text": "5"}, {"key": "4", "text": "6"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 8)','41d4a23da5d58753986310266225114d58847607d79d9c6892e01b5d2ac0499a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q11','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',11,'Section A','MCQ','Consider the following reaction
2
2
2
1
X Y(s)
X (g)
Y (g)
2



. If  is the degree
of dissociation. Calculate KP in terms of P (total 
pressure)
3/2
3/2
P
3/2
2P
K
2P
K
3

3

 
(2)','[{"key": "1", "text": "P\n2P\nK\n3\n\n2P\nK\n3\n"}, {"key": "4", "text": "P"}, {"key": "3", "text": "P"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 9)','a0b040c5f0a6e5fd6640af197d141c766e1d78057eae6e4bc1d000e828574127',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q12','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',12,'Section A','MCQ','An ideal gas undergoes following process from
A  B  C  D  E. Find work done.','[{"key": "1", "text": "-3P0V0"}, {"key": "2", "text": "2P0V0"}, {"key": "3", "text": "3P0V0"}, {"key": "4", "text": "0\n0\n3P V\n2"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q12.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 9)','774fe8513c53a9bc7980c7555e3dc7e9a04a7d37b6ad3a6b7b63a8fdd49090a1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q13','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',13,'Section A','MCQ','When a non-volatile solute (A) is added to a volatile
solvent, the vapour pressure of solvent decreases
by 10 mm Hg. Mole fraction of solute in solution is
0.2. If another non-volatile solute (B) is further
added to the same solution and vapour pressure of
solution decreases by 20 mm Hg, calculate mole
fraction of 2nd solute in the final solution.','[{"key": "1", "text": "0.3"}, {"key": "2", "text": "0.4"}, {"key": "3", "text": "0.5"}, {"key": "4", "text": "0.6"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 9)','7e68fc4200bfc467087f48ee460518fd42f56778d6fd9adb949e825e7e4bcc96',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q14','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',14,'Section A','MCQ','Consider the following E° values of given half cell
2
Ag /Ag
Zn
/Zn
E
0.8 V, E
0.76 V






2
2
Cu
/Cu
Mg
/Mg
E
0.34 V, E
2.36 V






Then which of the following will have the most
negative value of G°?','[{"key": "1", "text": "Zn|Zn2+||Cu2+|Cu"}, {"key": "2", "text": "Mg|Mg2+||Ag+|Ag"}, {"key": "3", "text": "Mg|Mg2+||Zn2+|Zn"}, {"key": "4", "text": "Cu|Cu2+||Ag2+|Ag"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 10)','a9ccab8a459b3de0425b2473cd6f48630dfc56d21b63a0b54abf7a62f2456eb6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q15','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',15,'Section A','MCQ','Match the following
Reactant  
 
Product
(A)
(i)
(B)
(ii)
(C)
(iii)
(D)
(iv)
Give correct product of oxidative ozonolysis 
(O3/H2O)','[{"key": "1", "text": "A-ii, B-i,  C-iii, D-iv"}, {"key": "2", "text": "A-i, B-ii,  C-iii, D-iv"}, {"key": "3", "text": "A-i, B-ii,  C-iv, D-iii"}, {"key": "4", "text": "A-i, B-iv,  C-ii, D-iii"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q15.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 10)','4a2f8959fe239193bf9d1ebf28174ff601b92580f9cd03382ec628625f95585a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q16','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',16,'Section A','MCQ','Arrange the following compounds in the decreasing 
order of rate of hydrolysis','[{"key": "1", "text": "(I) > (II) > (III) > (IV)"}, {"key": "2", "text": "(III) > (IV) > (I) > (II)"}, {"key": "3", "text": "(IV) > (III) > (I) > (II)"}, {"key": "4", "text": "(III) > (II) > (IV) > (I)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q16.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 10)','0c60fbe93db27a1e9e6e0be95a196e8848a24bba929a10a4a5377340a736c799',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q17','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',17,'Section A','MCQ','0.01 mole of an organic compound (Hydrocarbon)
gives 1.76 gm CO2 and 0.9 gm H2O on complete
combustion. 
Find 
out 
chemical 
formula 
of
compound.','[{"key": "1", "text": "C3H8"}, {"key": "2", "text": "C4H10"}, {"key": "3", "text": "C5H12"}, {"key": "4", "text": "C6H14"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','59fdd5f2db5ed118a23983a04ebafc39a2c7da3079a609257f3f9fd100c5d609',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q18','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','b10909a253219a1a82bd8be05495b0975fa2726edfee89c53e5fdabac25d72b3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q19','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','41be444e7ea67844d7f963224203d94c3ecaf2a47da43d89b3ff7dc4c7641a1f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q20','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',20,'Section B','Numerical Value','contains 5 Numerical based questions. The answer to
each question should be rounded-off to the nearest
integer.',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','1ad2319e158e8d88d59df71c27b37c3c17e894c50b2a86a61b2c9fd604a58e10',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q21','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',21,'Section B','Numerical Value','Number of sp3 hybridised carbon atoms in C is :',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','604d22b6e58af873d579c429d98de037e7cc73b67423ec68faf1fd9fd5cba4c6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q22','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',22,'Section B','Numerical Value','A compound X consumes two moles of H2 and
when ‘X’ heated with KMnO4/H+ gives
Number of  bonds in X are ______.',NULL,'/pyq_diagrams/jee_main_2025_btech_20250123_shift2_chemistry_q22.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','11387c08b21ead75f19917020c17d1e680d99eb6663753ebb765a420d3011267',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q23','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',23,'Section B','Numerical Value','Question 23',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','3ef6c3b2376f264528e28349271af36e3a583d18d35d31ed098d246c86f0cc49',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q24','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','6d8117f9cc97eafbd4b25a70e7b877151b0e18aec1af618475290767e201ff74',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_chem_q25','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Chemistry',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 11)','724f3fa5ac4ab96a1598317c2bc85a5d413d1afb882e057ac91fd0d7dbe22e9f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q1','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',1,'Section A','MCQ','If a square is divided in 4 × 4 squares.
If two squares are chosen randomly then the 
probability that the squares doesn’t share common 
side is','[{"key": "1", "text": "3\n5"}, {"key": "2", "text": "4\n5"}, {"key": "3", "text": "3\n20"}, {"key": "4", "text": "7\n10"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift2_mathematics_q1.png',FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 12)','e5362a79f0e23cda9a12161de17bd67efaaf30d0e49243fbd4f213f05403ae3c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q2','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',2,'Section A','MCQ','If
=
3
3
0
2
2
sin
cos
x
x
2
I
x
x
x dx
x
x
+
∫
 is
sin
cos
integration
4
4
0
sin
cos
2
16
π
16
π','[{"key": "2", "text": "(1)"}, {"key": "4", "text": "(3)"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 12)','758b152d44f9b9e545a75433ced3acfdbe26e787d7a13c7ae2e751cbb0102cdd',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q3','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',3,'Section A','MCQ','Consider the terms 8, 21, 34, 47, …, 320. The
variance of the given data set is','[{"key": "1", "text": "8788"}, {"key": "2", "text": "8614"}, {"key": "3", "text": "720"}, {"key": "4", "text": "9402"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 13)','4e2e1072306c4cf3173b3e0d3d950b20b02b4d020b34cecb23e7b25a79b8a9f7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q4','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',4,'Section A','MCQ','Let 
1,1
2
M 





be the mid-point of a chord to the
2
2
1,
2
4
x
y
+
=
 then the length of chord is
Ellipse','[{"key": "1", "text": "2\n5\n3"}, {"key": "2", "text": "5\n3"}, {"key": "3", "text": "5\n2 3"}, {"key": "4", "text": "5\n2"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 13)','c0911c60e217fd766d98a508bdaf73f2a35eb3425bdf98e18e2d63e9244d649c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q5','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',5,'Section A','MCQ','If the square of the shortest distance between the
lines 
2
1
3
1
2
3
-
-
+
=
=
-
x
y
z
 
and 
1
3
2
4
+
+
=
x
y
5
5
+
=
-
z
 is m
n (where m, n are coprime number)
then m + n equals to','[{"key": "1", "text": "6"}, {"key": "2", "text": "9"}, {"key": "3", "text": "21"}, {"key": "4", "text": "14"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 14)','b254582df028739a22d0b162bbd9d41b1229d82dd17be8ea9253c01cc8ed090b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q6','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',6,'Section A','MCQ','A rod of length 8 units having two end points always 
lie on x - y + 2 = 0 and x + y + 2 = 0. A point P divide 
this line in ratio 2 : 1. Then locus of P is','[{"key": "1", "text": "9x2 + 9y2 + 36x - 28 = 0"}, {"key": "2", "text": "8x2 + 8y2 + 36x + 27 = 0"}, {"key": "3", "text": "9x2 + 9y2 - 36x + 28 = 0"}, {"key": "4", "text": "8x2 + 8y2 - 36x - 27 = 0"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 14)','cef881dc571910a8ee8748b8ff9b33ff11b51307b1cdbad945591c3e55f83fbc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q7','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',7,'Section A','MCQ','Evaluate
x
7
2


+
-
-




+
-


+
7
2
3
5
(3
1)
lim
x
x
x
(
)
x
x
3
5
2
3
2
x
x
x
→∞
3 e','[{"key": "2", "text": "3"}, {"key": "1", "text": "2\ne\n5 e"}, {"key": "4", "text": "2"}, {"key": "3", "text": "2\ne"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 14)','121da2e805111d6d3ada28025e64b4cc9b76d8294c2e5a9bbc26a3e46c78886d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q8','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',8,'Section A','MCQ','Let S be the region consisting of points (x, y) such 
that -1 ≤ x ≤ 1 and 0 ≤ y ≤ a + e|x| - e-|x|. If area of
2(𝑒𝑒2+8𝑒𝑒+1)
𝑒𝑒
 square units, then a is
bounded region is
equal to','[{"key": "1", "text": "8"}, {"key": "2", "text": "10"}, {"key": "3", "text": "7"}, {"key": "4", "text": "5"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 15)','689d3c23ee1bdc4fc214c60fd35dc7ace816064f70e088c4cf31f3acf997ea55',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q9','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',9,'Section A','MCQ','If z is a complex number such that |z| = 1 and
1,
z
z
z
z
+
=
 then the number of complex number z
is','[{"key": "1", "text": "8"}, {"key": "2", "text": "4"}, {"key": "3", "text": "2"}, {"key": "4", "text": "Zero"}]',NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 15)','52c0fec7551f69440b8aacffdcbc3f6bee8b3aa67ac997ccee8619a99a7bb1ca',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q10','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',10,'Section A','MCQ','If 
0
0
4
0
2
1












=
=
=


















A
A
A
. Then a23
1
0 ,
1
1 ,
1
0
0
1
3
0
2
0',NULL,NULL,TRUE,'Options incomplete or rendered as diagram','131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 16)','9d039c3835bd6731f6b556924b7866a659df15b85d4b106e6e4c7e75cfed2462',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q21','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',21,'Section B','Numerical Value','There are 5 boys and 4 girls. The sum of number of 
ways in which they can be seated such that all boys 
sit together and number of ways such that no boys 
sit together is equal to',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 17)','f119cf326e4d925dc29d05aa0efd242153ee57ef4cfee5661f9b0420790ec7a6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q22','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',22,'Section B','Numerical Value','Let f(x) = 6 + 16cos
cos
cos
3
3
x
x
x
π
π




-
+








sin3x',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 17)','455f4e208d4f69b58b59ae9d0b77c12f587a14207476cd0f2b40405c770f2601',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q23','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',23,'Section B','Numerical Value','{
}
( ,
) | |
|
3
A
x y
x
y
=
+
≥
;
{
}
( ,
) | |
|
|
|
3
B
x y
x
y
=
+
≤
Let C
A
B
=

. Find the sum of ( ,
)
,
∀
∈
x y
x y
C .',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 17)','bca50874e9573757afc4b0b301c0a337f2b75da50b5e8ce9dd51e2b528ca3e03',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q24','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',24,'Section B','Numerical Value','If system of linear equations
x + y + z = 6
x + 2y + 5z = 9
x + 5y + λz = µ
has no solutions. Then value of λ equals to',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 18)','f8d6d0ba7abbf51919443e882e6b10ef45c68e577b4f2b21c70a03150334a640',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift2_math_q25','jee_main_2025_btech_20250123_shift2','JEE Main',2025,'B.Tech','23 January 2025','Shift 2','Evening','Mathematics',25,'Section B','Numerical Value','Let 
3 sin
( )
=
+
∫x
xdx
g x
C , where g(0) = 0. If
3
2
8
2
2


π
π




′
+
= απ + βπ + γ












g
g
, where α, β and
γ are integers, then the value of α + β + γ is',NULL,NULL,FALSE,NULL,'131125-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-2-PDF-Download.pdf (Page 18)','0167268130e5438209ec7b5e52dfa33ff25b08a7f93848f9abffa627e6e9b6e0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q1','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',1,'Section A','MCQ','It I = IA sint + IB cost, then find rms value of current','[{"key": "1", "text": "Irms = IA + IB\n=\n+\n \nI\nI\nI\n2\n2\nrms\nA\nB"}, {"key": "2", "text": "2\n2\n+\n=\n \nI\nI\nI\nA\nB\n2"}, {"key": "3", "text": "rms\n=\n+\n \nI\nI\nI\nA\nB\n1\n2\n2\n2\nrms\n(4)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','ddb601a7d6bb32eaa3dfbb7dee2d5a6410e756f0ffcfdb072722664d8a2db2f7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q2','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',2,'Section A','MCQ','What is relative shift of focal length of a lens when optical 
power is increased from 0.1 D to 2.5 D
25
24','[{"key": "1", "text": "10\n13"}, {"key": "2", "text": "25\n21"}, {"key": "3", "text": "10\n11\n(4)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','ec26c2b05aa2a1e3294856fe6995d5bc27e8b0f54c9e2c886619942487753fdf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q3','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',3,'Section A','MCQ','Satellite A is launched in a circular orbit of radius R. Satellite 
B is launched in circular orbit of radius 1.03R. Time period 
of B is greater than A by approximately','[{"key": "1", "text": "9%"}, {"key": "2", "text": "4.5%"}, {"key": "3", "text": "3%"}, {"key": "4", "text": "2.5%"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','9b646591a22be481a6e26a3e5588e3b4b522efe287d7a40f5454cd09f4975e4b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q4','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',4,'Section A','MCQ','An electron jumps from principle quantum state A to C by 
releasing photon of wavelength 2000 Å and from state B 
to C by releasing of photon of wavelength 6000 Å, then 
final the wavelength of photon for transition from A to B.','[{"key": "1", "text": "3000 Å"}, {"key": "2", "text": "4000 Å"}, {"key": "3", "text": "8000 Å"}, {"key": "4", "text": "2000 Å"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','4c3a73c55b7a3e3659c5d5043bbb5441fb154ad488fcd86e9e83db8373210ddc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q5','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',5,'Section A','MCQ','An electron of mass m enters in a region of uniform
0
electric field 
= -
E
E k at t = 0 with an initial velocity
=
V
V i . If the de-Broglie wavelength is 0 initially, 
0
the de-Broglie wavelength at a time t is
2 2 2
0
e E t
2 2
0','[{"key": "1", "text": "\n+\nm V\n1\ne E t"}, {"key": "2", "text": "\n+\n1\nm V\n2 2\n0\n0\n2 2 2\n0\n0\n\n0\n2 2 2\n0\n\nm V\n1 e E t\n2 2\n0\n+\n0"}, {"key": "3", "text": ""}, {"key": "4", "text": "2 2\n0\ne E t\n1\nm V\n+\n2 2 2\n0"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q5.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','ce35c1ef90b8a961c3fa3f77210e7fb0e3238c9d085dca01cbedccaabfa8b446',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q6','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',6,'Section A','MCQ','For an ideal mono atomic gas undergoing an isobaric
Q

process, the ratio of 
 is
U

3
5','[{"key": "1", "text": "5\n7"}, {"key": "2", "text": "3\n4"}, {"key": "3", "text": "4\n5\n(4)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','900025fc2bc2a8147a5634e5987cc03340cbeb061b71efdfc7a05b0899d0541d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q7','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',7,'Section A','MCQ','In a process pressure of the gas is directly proportional
to temperature then choose correct option.
A : Process is isochoric.
B : Work done in process is zero.
C : Internal 
energy 
increase 
with 
increase 
in
temperature.','[{"key": "1", "text": "A and B are correct"}, {"key": "2", "text": "A and C are correct"}, {"key": "3", "text": "A, B and C are correct"}, {"key": "4", "text": "B and C are correct"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','7a45023b3ef4edaa1db5d3bc0a9e9268e3c888fb3378cbd75614a2066e86e78a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q8','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',8,'Section A','MCQ','If the distance two parallel plate of a capacitor is d, A is the
area of each plate, and E is the electric field. Find the
energy stored in capacitor
4 E A
d 
1
2
0
E A
d','[{"key": "2", "text": "\\varepsilon\n1\n2\n2\n0"}, {"key": "1", "text": "\\varepsilon\nE A\nd \n2\n0\nE A\nd"}, {"key": "4", "text": "\\varepsilon\n3\n4\n2\n0"}, {"key": "3", "text": "\\varepsilon"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','cdfaadb2e99db2d33ae12c78814ed08ac4952af076e46b206b9bcc95b96ba9a6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q9','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',9,'Section A','MCQ','In YDSE, lights of wavelength 600 nm and 480 nm are used.
What is the minimum order of bright fringe of 480 nm
coincides with bright fringe of 600 nm.','[{"key": "1", "text": "8"}, {"key": "2", "text": "7"}, {"key": "3", "text": "6"}, {"key": "4", "text": "5"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','7cbf86b7571fe4b9592fa3c2c1b4e5ac940135c2fce645b58f2adecf1f078bf2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q10','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',10,'Section A','MCQ','A body of mass m is projected with initial velocity v0 at 45°
with horizontal. Find it’s angular momentum at highest
point about point of projection.
0
g
4
mv3
mv3
0','[{"key": "1", "text": ""}, {"key": "2", "text": "g\n4 2\nmv2\nmv0\ng\n4 2\n0"}, {"key": "3", "text": ""}, {"key": "4", "text": "g\n2 2"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','14f272e8ede7dab2dd4272060694b79251726bb2e28559d3b788b9dfa1d2cb6c',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q11','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',11,'Section A','MCQ','A Plano convex lens of refractive index 1.5 & radius of 
curvature of curved surface of 20 cm present in air is 
having focal length of f1. There is another Plano convex
lens of refractive index of 1.5 & ROC of 30 cm placed in
f
f
1
liquid of RI of 1.2 having focal length of f2 the 
 is
2
3
2
2
1','[{"key": "1", "text": ""}, {"key": "2", "text": "3\n1\n3\n2"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','dd2c9b4ba6f10002f8db3ec90f20361cc9b5a3baa70dac43e12f0f5985cb3640',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q12','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',12,'Section A','MCQ','Acceleration of solid cylinder purely rolling an inclined
plane of inclination of  is
g
 
sin
2
g
','[{"key": "2", "text": "3\nsin\n5\n2"}, {"key": "1", "text": "g\n \nsin\n3\ng\n"}, {"key": "4", "text": "1\nsin\n3\n2\n(3)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','52c0b989ac7b10cdfd70c21c2aa2f2efcb045dd6939bb4396306d3c5bdfc33b5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q13','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',13,'Section A','MCQ','Find the maximum possible speed for the given angle of 
banking ‘’ on a curved road of radius r having 
coefficient of friction \mu.
\mu-

=
(
)
(
)
\mu+

=
(
)
(
)
gr
v
 
tan
gr
v','[{"key": "2", "text": "tan"}, {"key": "1", "text": "1\ntan\nmax\n-\\mu\n\n1\ntan\nmax\n-\\mu\n\n\\mu-\n\n=\n(\n)\n(\n)\n+ \\mu\n\n=\n(\n)\n(\n)\ngr\nv\n \ntan\ngr\nv\n1\ntan"}, {"key": "3", "text": ""}, {"key": "4", "text": "1\ntan\nmax\n+ \\mu\n\n1\ntan\nmax\n-\\mu\n"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','4f79f597c663f7214442599dbe5e80d2cb09fdde97088d360e1a93c75ca98c82',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q14','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',14,'Section A','MCQ','In a parallel plate capacitor length l and width b are 3 cm
and 1 cm respectively. Separation between plates d is 3
\mum. By which of the following values capacitance increases
by a factor of 10.
(A) l = 6 cm, b = 5 cm, d = 3 \mum
(B) l = 5 cm, b = 2 cm, d = 1 \mum
(C) l = 5 cm, b = 1 cm, d = 30 \mum
(D) l = 1 cm, b = 1 cm, d = 30 \mum','[{"key": "1", "text": "A, B"}, {"key": "2", "text": "A, C"}, {"key": "3", "text": "B, C"}, {"key": "4", "text": "B, C, D"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q14.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','498eed0ab38d6a757f0a5893db83fc460beded25656e99366c08f67c29a315fb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q15','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',15,'Section A','MCQ','In SHM given by equation x = Asint of time period 2
distance
displacement
sec and amplitude 1 cm, ratio of 
 in first',NULL,NULL,TRUE,'Options incomplete or rendered as diagram','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','cc8b297e232b814c00d4d7c7058d462f7f21c8403f5925c272780ad7e69ee61d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q16','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','7dbeeeca0d44041289085d7b7afd63fb0fb5d5548729c8b8175a10033816dcf9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q17','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','04ebc724cfed8320e5feaac5c82df89307fa1bff3d38b3069ee2c20b66ff85e6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q18','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','7d2498f95abbe74c3f2583cb8df250ac9e70780a9a2f0e104aba1c2448d8d0c2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q19','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','4ef071a4cf298fc4d6b79f04d4ca1774be18685dd8587ce5e9d543abdd0f8c72',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q20','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','6f7767a1b5c18e390cd66e11c04470c19d5491bd3cf228a0c5e17e571bafbb83',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q21','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',21,'Section B','Numerical Value','The electric flux through the shaded area of square
plate of side a due to point charge placed at distance
48
NQ
a
of 
 from it as shown in figure, is 
. Then N is
0
\varepsilon
2',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','5a8b6352a1761341c7596e1af52c015929176bb206284901c90fa2f91a8f87ac',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q22','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',22,'Section B','Numerical Value','In a square loop of side length 
a current of 5 A is
flowing. Find magnetic field at its centre in (\muT).',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','c5c67732c35ecabf0a767d467cde226eafa892277e0618b446917c2d9fc3af71',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q23','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',23,'Section B','Numerical Value','A wire of resistance 9  is bent in form of an equilateral 
triangle. Find equivalent resistance between two vertices 
of triangle.',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','8efae5009058e16bce64c51693e2018e60f069d455b682819d2ab46dc7ba2a58',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_phys_q24','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Physics',24,'Section B','Numerical Value','Work done required to break a drop of radius R to 27 drops 
of equal radius is 10 J. Then work done to break drop of 
radius R in 64 drops of equal radii is X J, then X is',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','080ade83896e61fd239fe7e4023edaf337043bc0ecd2e145d2a79fb353739752',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q1','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',1,'Section A','MCQ','Which of the following is the strongest oxidising agent?','[{"key": "1", "text": "Eu2+"}, {"key": "2", "text": "Ce2+"}, {"key": "3", "text": "Ce4+"}, {"key": "4", "text": "Eu3+"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','3d2a12bb8fe3b31860b58250eded29e11b5f565a31a30da7cb709f9137272a83',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q2','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',2,'Section A','MCQ','The difference in melting point and boiling point of 
oxygen and sulphur can be explained by','[{"key": "1", "text": "Electronegativity"}, {"key": "2", "text": "Electron gain enthalpy"}, {"key": "3", "text": "Atomicity"}, {"key": "4", "text": "Ionisation energy"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','17f60790a2ebaf78c9fcae82d07db5a628c0cca641adc7d7a9c2a81e76eca1ab',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q3','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',3,'Section A','MCQ','Ribose present in DNA is
(A) A pentose sugar
(B) Present in pyranose form
(C)  anomeric carbon is present
(D) Present in D configuration
(E) A reducing sugar in free form
Choose the correct statement :','[{"key": "1", "text": "A, C & E only"}, {"key": "2", "text": "A, D & E only"}, {"key": "3", "text": "A, B, C, D & E"}, {"key": "4", "text": "A & E only"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','83409b730f9d8f7bceb1510c3b778358f61b9604040d65b5c21e858ff24d4be7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q4','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',4,'Section A','MCQ','Consider the following reaction
2+
2
4
\equiv
⎯⎯⎯⎯⎯→
( )
i Hg
/H SO
3
CH -C
CH
P 
ii HCN
(iii)H /Ni
( )
2
Product P is','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q4.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','7c90b18a055c81fb6aa4e0b9e28ef7a58a63e54cc896de18ecd425811eb3e991',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q5','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',5,'Section A','MCQ','The most stable carbocation among the following is.','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q5.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','ca73ea56b5c0b122bc07e78a558bc9836f4891db1db291d19c96ed6e05a08307',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q6','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',6,'Section A','MCQ','Which of the following is most reactive towards 
nucleophilic addition reaction.','[{"key": "1", "text": "Para-nitro benzaldehyde"}, {"key": "2", "text": "Para-methyl benzaldehyde"}, {"key": "3", "text": "Benzaldehyde"}, {"key": "4", "text": "Acetophenone"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','4f7820b934ed095beb1ca094f78d29e79cdeea960a2b2608ddd18d343c6705ca',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q7','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',7,'Section A','MCQ','Consider the following statements about H2O, NH3 and 
CH4
(A) All central atoms are sp3 hybridised
(B) Order of dipole moment is CH4 < NH3 < H2O
(C) NH3 in H2O is basic in nature, NH3 and H2O are
Bronsted-Lowry acid and base respectively
(D) Bond angle of H2O, NH3 and CH4 respectively are
104.5°, 107° and 109.5°
Which of the above statements are correct','[{"key": "1", "text": "A and B only"}, {"key": "2", "text": "A, B and C only"}, {"key": "3", "text": "A, B, C and D"}, {"key": "4", "text": "A, B and D only"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q7.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','c15b9da8d8f9a2fb6fc05ee690a4a3af82fe3bac99d5b167df85f37a99b0ca4e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q8','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',8,'Section A','MCQ','Which of the following is most reactive towards aq. 
HBr?','[{"key": "1", "text": "(P)"}, {"key": "2", "text": "(Q)"}, {"key": "3", "text": "(R)"}, {"key": "4", "text": "(S)"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q8.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','774b93bdcc807b9a1572fe4b47a3723e689e84ad0e8c439072c4619324e70539',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q9','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',9,'Section A','MCQ','At the freezing point of water, process is non 
spontaneous, it becomes spontaneous at boiling point 
(Temperature varies linearly with pressure). The correct 
option is','[{"key": "1", "text": "H = +ve\nS = +ve"}, {"key": "2", "text": "H = -ve\nH = -ve"}, {"key": "3", "text": "H = +ve\nS = -ve"}, {"key": "4", "text": "H = -ve\nS = +ve"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','d30e1e38d80de33b9957a1464ca71d8e00750cdbf7296b01ba8fea8569ff20fe',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q10','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',10,'Section A','MCQ','In the preparation of potassium permanganate from
pyrolusite ore (MnO2), the fusion of pyrolusite ore is
done with an alkali metal hydroxide like KOH in the
presence of air or an oxidising agent like KNO3, which
first produces.','[{"key": "1", "text": "K2MnO6"}, {"key": "2", "text": "K2MnO4"}, {"key": "3", "text": "KMnO4"}, {"key": "4", "text": "K2MnO"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','42d3a5117bede6be6303aff90d356ad357ac48df4764bfbaff69f443ec23b0fa',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q11','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',11,'Section A','MCQ','S-I : Duma’s method is used for estimation of nitrogen
S-II : In Duma’s method N present in compound is 
converted to (NH4)2SO4','[{"key": "1", "text": "S-I  is correct statement.\nS-II is incorrect statement"}, {"key": "2", "text": "S-I  is incorrect statement\nS-II is also incorrect statement"}, {"key": "3", "text": "S-I  is correct statement\nS-II is also correct statement"}, {"key": "4", "text": "S-I  is incorrect statement\nS-II is correct statement"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','668e491109c7242f452d81c2bc86e1d31fe20f0ea5870049fd0be1f5fd062574',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q12','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',12,'Section A','MCQ','An electron jumps from A → C by emitting a wavelength 
of 2000 Å and also jumps from B → C by emitting a 
wavelength of 6000 Å, then wavelength of that 
electron; if it jumps from A → B','[{"key": "1", "text": "4000 Å"}, {"key": "2", "text": "3000 Å"}, {"key": "3", "text": "8000 Å"}, {"key": "4", "text": "5000 Å"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','3f8a90b04641975a6578e236c7f50ac030b433819ce56d3cd1f9fb695a0990ce',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q13','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',13,'Section A','MCQ','Calculate the value of 
cell
E
 for given cell based on
given information
Fe2+ + Ag+ → Fe3+ + Ag;
Ag+ + e- → Ag; E° = xV
Fe2+ + 2e- → Fe; E° = yV
Fe3+ + 3e- → Fe; E° = zV','[{"key": "1", "text": "x + y - z"}, {"key": "2", "text": "x + 3y - 2z"}, {"key": "3", "text": "y - 2x"}, {"key": "4", "text": "x - 3z + 2y"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q13.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','47bfaccefa655478c0b4d334af4acc4e965ca232e42820e759119b6a6770ecdd',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q14','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',14,'Section A','MCQ','Consider the given reactions and choose proper solvent.
OH- 
→
Reaction-I: CH3 - CH2 - CH2 - CH2 - Cl
CH3 - CH2 - CH2 - CH2 - OH
R3N 
→
Reaction -II: CH3 - CH2 - CH2 - CH2 - Cl
+','[{"key": "1", "text": "Reaction-I : polar protic, Reaction-II : polar aprotic"}, {"key": "2", "text": "Reaction-I : polar aprotic, Reaction-II : polar protic"}, {"key": "3", "text": "Reaction-I : polar aprotic, Reaction-II : polar aprotic"}, {"key": "4", "text": "Reaction-I : polar protic, Reaction-II : polar protic"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q14.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','b617c527d5e65b805f8c3f55a653d5b528105ac8caab7611660d48a8f11f7d85',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q15','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',15,'Section A','MCQ','2.32 × 103 kg of Fe3O4 reacts with 2.8 × 103 kg of CO
according to the following reaction :
Fe3O4 + CO → CO2 + Fe
If x kg of Fe is formed. Find the value of x?','[{"key": "1", "text": "2000 kg"}, {"key": "2", "text": "1680 kg"}, {"key": "3", "text": "2780 kg"}, {"key": "4", "text": "1500 kg"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','65a51cba2025dd967a0a5cb5a6b295918c69499f6a84a96703de392e5edb28ab',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q16','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',16,'Section A','MCQ','Consider the following reaction of a complex
compound
The formula of complex is','[{"key": "1", "text": "[Co(NH3)5Cl] Cl2"}, {"key": "2", "text": "[Co(NH3)6] Cl3"}, {"key": "3", "text": "[Co(NH3)3Cl3] .3NH3"}, {"key": "4", "text": "[Co(NH3)4Cl2] Cl"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q16.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','70a1d4b525945b02f410ea1e810b65c92e964be6bef2de8e6c819645362647d9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q17','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',17,'Section A','MCQ','Consider the following plots of vapour pressure of a 
solution 
containing 
non-volatile 
solute 
versus 
temperature (in K) and choose the correct graph which 
represents depression in freezing of solvent.','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q17.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','2ff621077853e86e1bcacc51e100f9dc39652db56c5bf95909c8a8f23256e676',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q18','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',18,'Section A','MCQ','A student synthesised the compound given below
By using one of the following compounds available in 
the lab and using following reagents.
-+
Reactant
 
Me CO K
(i)B H /THF
NBS
PCC
Me COH
(ii)H O /OH
2
2
3
→⎯⎯→
⎯⎯→⎯⎯⎯⎯→⎯⎯⎯⎯⎯
3
2 6
-
Choose the suitable compound which can be used 
as reactant','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250124_shift1_chemistry_q18.png',FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','0fa975b0a214f0ab257be2553b5732a9f72cba989c9704bd9bdd6a72c6717aa3',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q19','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',19,'Section A','MCQ','Select the incorrect statements about the modern 
periodic table.','[{"key": "1", "text": "The Physical and chemical properties of elements\nare periodic function of their atomic weight"}, {"key": "2", "text": "The Physical and chemical properties of elements\nare periodic function of their atomic numbers"}, {"key": "3", "text": "Non-metallic elements are lesser in number than\nmetallic elements"}, {"key": "4", "text": "In periodic table, 18 groups are present"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','3ea0a0c2a34e0bad4cdfcb4c59a99530a91ad2fd8f694e5e35875318db438b86',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q20','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',20,'Section B','Numerical Value','Numerical based questions. The answer to each question
should be rounded-off to the nearest integer.',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','0eeb8e2d0425abfe3a8b637fd1ab696484ac8d2209cc6fdf7db8a3421b5d725d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q21','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',21,'Section B','Numerical Value','If the Ksp of Cr(OH)3 is 1.6 × 10-30 M4. The molar solubility
of salt in water is 1.56 × 10-x, then value of x is',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','2a83c9f54073de7feae2ecd4dd96b90014940d326e44a0dc61bd22bd62bbd45f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q22','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',22,'Section B','Numerical Value','When x g of Benzoic acid reacts with NaHCO3, 11.2 L of 
CO2 is released at 273 K and 1 atm pressure, calculate 
mass of benzoic acid in gram?',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','d2337a61ee0132e3229f3774457bf50573dea57837c0dd66ee288c421f42586e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q23','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',23,'Section B','Numerical Value','How many of the following cation shows characteristic 
coloured ppt. with K4[Fe(CN)6]?
Cu2+, Ca2+, Ba2+, Fe3+, Zn2+, Mg2+, Mn2+',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','edf240ee90f96aad185e409e3441fc366c8f9b70e104e37ee15a71719b388a4e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q24','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','3d628be7d751be1c8d86d84c2b159529e0d18e4eecd03259be2f9ea8ffc3e292',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_chem_q25','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Chemistry',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','34aae73a39243f112d39bca5f966d687e72211af6e8c50a5a2d046a3dd46cb67',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q1','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',1,'Section A','MCQ','If the 5th, 6th and 7th term of the binomial expansion of 
(1 + x2)n+4 are in A.P. Then the greatest binomial 
coefficient in the expansion of (1 + x2)n+4  is','[{"key": "1", "text": "10"}, {"key": "2", "text": "35"}, {"key": "3", "text": "25"}, {"key": "4", "text": "14"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','139706e447c2299edbf08bd25c6fd87890c51616e3cf03a1c62c7931a1d607fc',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q2','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',2,'Section A','MCQ','If A is 3 × 3 matrix such that det(A) = 2. Then
(
)
(
)
(
)
(
)
det adj adj adj adjA
 is','[{"key": "1", "text": "232"}, {"key": "2", "text": "216"}, {"key": "3", "text": "28"}, {"key": "4", "text": "212"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','2925141cf51aa0f8ca830a33ee7129ddcad0174e1908e331059c7156df27d45e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q3','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',3,'Section A','MCQ','Evaluate
(
)
→
+
+
+
2
2
0
lim cos
.
2cos
3cos
-
cos
sin
4
x
ecx
x
x
x
x','[{"key": "1", "text": "0"}, {"key": "2", "text": "1"}, {"key": "3", "text": "1\n2 5"}, {"key": "4", "text": "1\n-\n2 5"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','9e8fe24e42ef22e8dd5d6fd1727c0357aab2fbbf1e4ce1edde138c2b29678e05',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q4','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',4,'Section A','MCQ','If 
= +
+
=
+ -








2
3 ,
3
a
i
j
k b
i
j
k and

b . Also 
⋅=


c is perpendicular to

b . Then 

c is
and
5
a c
 and','[{"key": "1", "text": "18"}, {"key": "2", "text": "16"}, {"key": "3", "text": "5\n14"}, {"key": "4", "text": "11\n6"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','c5d05aed9a339679b7473c4cb4c82c56cad16a55c283456c8013965fef7b798d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q5','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',5,'Section A','MCQ','The area of the region bounded by S(x, y) such that  
S = {(x, y) : x2 + 4x + 2 ≤ y ≤ |x + 2|} is (in sq. units)','[{"key": "1", "text": "24\n5"}, {"key": "2", "text": "5"}, {"key": "3", "text": "20\n3"}, {"key": "4", "text": "7"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','5632acffa20faa8b0f622063dec6c758b7f5a856dcd57777a0f476889fb7c19b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q6','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',6,'Section A','MCQ','If 


+
=


+


+
2
2
1
1
; y(0) = 0, then y','[{"key": "1", "text": "is\n3"}, {"key": "2", "text": "2\n3"}, {"key": "1", "text": "2"}, {"key": "3", "text": "2\n3"}, {"key": "4", "text": "2\n3"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','4c15b62ec3b1bf3b0e65f46933c294ffe38ed8794faf25c643ecee7b4e5d965e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q7','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',7,'Section A','MCQ','If α and β are real numbers such that sec2(tan-1(α)) + 
cosec2(cot-1(β)) = 36 and α + β = 8, then (α2 + β) is  
(α < β)','[{"key": "1", "text": "23"}, {"key": "2", "text": "14"}, {"key": "3", "text": "24"}, {"key": "4", "text": "27"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','7194179a681fffedf588e92abb26ff691741c7551ca1b3e48ac2d32079ddeb2d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q8','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',8,'Section A','MCQ','Two persons A and B throws a pair of dice alternatively. 
For A to win he should throw sum of 5 before B throws 
sum of 8. If A throws first, then the probability that A 
wins, is','[{"key": "1", "text": "8\n19"}, {"key": "2", "text": "9\n19"}, {"key": "3", "text": "8\n17"}, {"key": "4", "text": "9\n17"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','098778337a20d0c1bd9d2e58be51a9beaad31936691bb28f87848ad3af5b90fe',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q9','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',9,'Section A','MCQ','For a distribution of 10 observations,
1
55
i
i
=
10
2
=
∑
x
. If the observations 4 and 5 are replaced by
1
328
i
i
=
6 and 8 respectively, then the new variance is','[{"key": "1", "text": "2.5"}, {"key": "2", "text": "2.7"}, {"key": "3", "text": "3.4"}, {"key": "4", "text": "3.6"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','ab33235155d2bdd42a704d1d12c5045dad86e092fd1e95063346e094148e8f56',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q10','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',10,'Section A','MCQ','If S be the set of 10 distinct primes and let A be the set 
of products of two or more elements from the set S. If  
P = {(x, y) : x ∈S and y ∈A and y is divided by x}. 
Then n(P) is equal to','[{"key": "1", "text": "5110"}, {"key": "2", "text": "5000"}, {"key": "3", "text": "5220"}, {"key": "4", "text": "5420"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','77cc5c373f9691314251cc4fe2d40a5da3de88caf5f99f6686b4218d8f00598b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q11','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',11,'Section A','MCQ','If 
-
-
=
-
∫
0
( , )
(1
)
m
n
I m n
x
x
dx , m, n > 0, then I(9, 14) + I(10,
13) is equal to','[{"key": "1", "text": "I(1, 13)"}, {"key": "2", "text": "I(9, 1)"}, {"key": "3", "text": "I(9, 13)"}, {"key": "4", "text": "I(19, 29)"}]',NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','5fab545fb04c8667a9005908dc9fad904eff81952afd9d71455859233a9826e9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q12','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',12,'Section A','MCQ','Question 12',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','24e5d2f0a85bc5ab539b553fa1df3048913c65999fd8c68ef23ad0da91761692',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q13','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',13,'Section A','MCQ','Question 13',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','4477513527f5781be9d2a16d22a7ca7070faee3341ec5014e12ce9100dad507f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q14','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',14,'Section A','MCQ','Question 14',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','bb646a67260734d7f0c0b9e57995ad6d19b32b837ac31ae58101982bec0e4b02',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q15','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',15,'Section A','MCQ','Question 15',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','b1c81d1748fc01e6c1eff5756874a1612b5697144a322060f9e984d5354d1101',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q16','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','7535fed29ca98420adca5b134212fc969827c04156ed7dd2b2fe05c0d240147d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q17','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','83c2eb17a89d772ff5b0109da2e90990cff2246599eb72b47a39c62a11643709',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q18','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','f84fbb0aad94f0cfeee514c6e2079a36d4eebbdda695ace1dab865fbc80b3ec9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q19','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','30e888673b2b8e79e81510690238979c6d1d24c7ec7a0a192137bab9f7e765c2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q20','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','ad792acc85ee901a375333802fe27a2bcc8088a57ae9d7d74b814e212dbf7118',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q21','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',21,'Section B','Numerical Value','The number of 3 digit numbers which is divisible by 2 
and 3 but not divisible by 4 and 9?',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','a44c641080e4543d9669800c4e5e3e1fd62ffef0742888381f773b1d31ac5a27',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q22','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',22,'Section B','Numerical Value','The 
product 
of 
all 
real 
roots 
of 
equation 
(x2 - 9x + 11)2 - (x - 4) (x - 5) = 2 is',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','d0de38558804c64e1622d79b757dc622556eb0a8a8854797a98c7d4e9eb8798e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q23','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',23,'Section B','Numerical Value','If 
=
+
+
+
1
1
1
...
2
6
12
n
S
n terms. The sum of first six terms
in A.P. with first term equal to -p and common
difference p is 
2025
2026. S
. The absolute value of
difference between 20th and 15th terms in A.P. is',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 17)','b8dbb31684746e518198817556dcfb0d1c644a12456d09379dc60a3a981e7cf9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q24','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',24,'Section B','Numerical Value','If 
f(x) 
satisfies 
the 
functional 
equation
+

=
-




( )
6
1
35
7 ,
3
2
f x
f
x
x
{ }
∈
-0
x
R
and 
if


+


α


0
1
lim
( )
x
f x
x
exist finitely and is equal to β, then (α
→',NULL,NULL,FALSE,NULL,'134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 17)','48a2d176e02deb94f7f616ed6581871401398db213ab362d359eb8db1190b8f2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250124_shift1_math_q25','jee_main_2025_btech_20250124_shift1','JEE Main',2025,'B.Tech','24 January 2025','Shift 1','Morning','Mathematics',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 17)','336669bd1ba6c259b75f128e25a9a8ea19f6e7341a20996b64338b16c7649b43',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q1','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',1,'Section A','MCQ','Electric flux  is related with linear charge density 
and surface charge density  as  =  +  where 
(
)

(
)
(
)

and  are of appropriate dimensions of 
 is','[{"key": "1", "text": "Displacement"}, {"key": "2", "text": "Area"}, {"key": "3", "text": "Electric field"}, {"key": "4", "text": "Velocity"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','ee3f6f28a5cfc9ff79d7db4149ceb3d780de9ce84178ab0b956d02bfe75535bf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q2','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',2,'Section A','MCQ','For given velocity-time (v - t) graph, find distance
travelled at 0.5 sec.','[{"key": "1", "text": "125 m"}, {"key": "2", "text": "112.5 m"}, {"key": "3", "text": "137.5 m"}, {"key": "4", "text": "150 m"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_physics_q2.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','046817afb144919f7eab6d0e1e4a5409e27ae4f223434ff613032ee988a0edf5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q3','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',3,'Section A','MCQ','The displacement of a particle as function of time is
x(t) = A sin(t) + B cos2(t) + Ct2 + D.  Find dimension of
D
[
]
ABC
[
]
[
]','[{"key": "1", "text": "L2"}, {"key": "2", "text": "L2T-2"}, {"key": "3", "text": "LT-2"}, {"key": "4", "text": "L3T"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','2f30ac9ac95c8402663de3fffaf1293f3fe93a1b524fe9beb63fd67dc250586d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q4','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',4,'Section A','MCQ','The ratio of electric force to gravitational force
between two particles having charges q1, q2 and
masses m1 and m2 respectively is (where symbols
have their usual meanings)
0
1
2
\varepsilon
4
m m G
q q
0
1
2
\varepsilon
4
Gm m','[{"key": "1", "text": ""}, {"key": "2", "text": "q q r 4\n1 2\n1 2\n4\n1 2\nGm m\n\\varepsilon\n4\nq q\n1 2\n0\n1\n2\nGm m\n\\varepsilon\n4\nq q r"}, {"key": "3", "text": ""}, {"key": "4", "text": "0\n1\n2"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 2)','2ff823bf44628da4765fd31c320289f8d67945438e8b65cb0e08d8a226c8eac4',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q5','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',5,'Section A','MCQ','Match 
the 
column 
appropriately 
regarding 
thermodynamic process.
Column-I 
Column-II
(i) 
W = 0
(P) 
When 
volume 
change is zero
(ii) 
Q = 0
(Q) 
When pressure is 
constant
(R) 
When no heat is 
exchanged
(iii) 
Isobaric
(S) 
Work done by the 
gas is equal to 
heat given to the 
gas
(iv) 
Isothermal','[{"key": "1", "text": "P(iv), Q(iii), R(i), S(ii)"}, {"key": "2", "text": "P(i), Q(iii), R(ii), S(iv)"}, {"key": "3", "text": "P(ii), Q(iii), R(iv), S(i)"}, {"key": "4", "text": "P(ii), Q(iii), R(i), S(iv)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','62e99c90717af2a47048812843ac4b5fe0d25f585cd341ba77eb3236520b4fc8',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q6','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',6,'Section A','MCQ','In given DC circuit, find current for R = 12  in 
steady state.','[{"key": "1", "text": "2 A"}, {"key": "2", "text": "1 A"}, {"key": "3", "text": "3 A"}, {"key": "4", "text": "4 A"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_physics_q6.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','66576cdaaef4d7e1b60f95dad52c546c56dbf3a2588991173f145b6a306231d1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q7','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',7,'Section A','MCQ','Statement-I : Hot water is less viscous than of cold 
water.
Statement-II : Surface tension of soap bubble is more 
than that of a drop of water.','[{"key": "1", "text": "Statement-I is true and statement-II true"}, {"key": "2", "text": "Statement-I is true and statement-II false"}, {"key": "3", "text": "Statement-I is false and statement-II true"}, {"key": "4", "text": "Statement-I is false and statement-II false"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','3819ea2c53f4fd01b42592026d02d432274ee7718f276344889ddee715ea17e5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q8','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',8,'Section A','MCQ','The key shown in the circuit is closed at t = 0.
Choose the incorrect option regarding the conditions 
at t = 0.','[{"key": "1", "text": "Current in the circuit is zero"}, {"key": "2", "text": "Voltage across the capacitor is minimum"}, {"key": "3", "text": "Current in the circuit is maximum"}, {"key": "4", "text": "Voltage across resistance is maximum"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_physics_q8.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','c4eba9248959816b6e4f16b0d4cfcfcbeb2e7aa0ad5880e78e98e0e1b5557120',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q9','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',9,'Section A','MCQ','A uniform solid sphere of mass m rolls down from rest 
to achieve speed v1 on an inclined plane of 30°.
Sphere achieves speed v2 on an inclined plane of 45°
2
1
2
2
v
v
when released from same height then 
 is
(assume no slipping)
2
5','[{"key": "1", "text": "1"}, {"key": "2", "text": "2\n5\n2\n3"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 3)','f35df2a6b1c3291ef9ca88da7aca5c8f3d65fcbbf2f61f10442d9fdfe4cc36d5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q10','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',10,'Section A','MCQ','Find the equation of magnetic field for the give 
equation of electric field (for EM wave).
4
3
cos(
)
E
E
i
j
t
kz
=
-
-
 
ˆ
ˆ
 
(
)
0
=
+
-
 
B
i
j
t
kz
C
3
4
cos
E
ˆ
ˆ
(
)
(
)
0','[{"key": "1", "text": "=\n-\n-\n-\n \nB\ni\nj\nt\nkz\nC\n3\n4\ncos\nE\nˆ\nˆ\n(\n)\n(\n)\n0"}, {"key": "2", "text": "=\n-\n-\n \nB\ni\nj\nt\nkz\nC\n3\n4\nsin\nE\nˆ\nˆ\n(\n)\n(\n)\n0"}, {"key": "3", "text": "=\n-\n-\n-\n \nB\ni\nj\nt\nkz\nC\n3\n4\nsin\nE\nˆ\nˆ\n(\n)\n(\n)\n0\n(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_physics_q10.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','07175b25f1a2f8f8cb2ec6409a82a10db41fe229a47174d4e67343ff03d935b5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q11','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',11,'Section A','MCQ','Self-inductance depends on :','[{"key": "1", "text": "Only on geometry"}, {"key": "2", "text": "Only on medium property"}, {"key": "3", "text": "Geometry and medium property"}, {"key": "4", "text": "Value of current through inductor"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','1e6e4756c3a2cf06a3bf0a8e91e7575526f2c380eaa424036030cb2eb11a1796',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q12','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',12,'Section A','MCQ','For the circuit shown below
(A) Current in ammeter is 2 A
(B) Net resistance is 8 
(C) Voltage across BC is 4 V
(D) Current through diode is 1 A
Choose the correct option.','[{"key": "1", "text": "Only ABC are correct"}, {"key": "2", "text": "Only ACD are correct"}, {"key": "3", "text": "Only ABD are correct"}, {"key": "4", "text": "Only AD are correct"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_physics_q12.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 4)','c26e72a0c3c37ed6e87d3eadfc932b893623181dffe00972996d7cd7c8648eb0',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q13','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',13,'Section A','MCQ','Find the time period of a cube of side length 10 cm
and mass 10 g oscillating in water. (density of
water = 103 kg/m3 and g = 10 m/s2)
','[{"key": "1", "text": "second\n25\n"}, {"key": "2", "text": "second\n50\n"}, {"key": "3", "text": "second\n100\nsecond\n25\n2\n(4)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','d8d9353d05a6d4be52eb04614a6467a1777c3897f5c6cba46b31a36caf3c373a',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q14','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',14,'Section A','MCQ','Adiabatic constant of a gas is 
. If volume of gas
initially at 0°C is reduced to one fourth of the original
volume then new temperature is','[{"key": "1", "text": "0 K"}, {"key": "2", "text": "273 K"}, {"key": "3", "text": "546°C"}, {"key": "4", "text": "546 K"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','7d8b27e12eab7254c4b0ba3c4ffc7fe21cc37a4b1579716e9fa361ab765397eb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q15','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',15,'Section A','MCQ','Two objects are equal distances from sphere of radius
R & refractive index \mu such that the image of one
object forms on other object. Find the object distance
from the surface of sphere.
R','[{"key": "1", "text": "\\mu\nR"}, {"key": "2", "text": "\\mu-\n1"}, {"key": "3", "text": "R\nR"}, {"key": "4", "text": "\\mu+\n1"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 5)','80c5b56019dc63635f3497fda1019998338d8b225e8e07721ceef92283cd0096',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q16','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',16,'Section A','MCQ','There is force field
particle moves along the line x = y. Find work done 
by the force as the particle moves from (0, 0) to (2, 
2)
136
15
15
173','[{"key": "1", "text": ""}, {"key": "2", "text": "171\n17\n17\n139"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','0faf29410b867a93572b9b9e9fa1431875eb83cac4ccb815497666d2b69e7886',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q17','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',17,'Section A','MCQ','In a radioactive decay, decay constant of element A2
is 3 times that of element A1. Find the ratio of nuclei
of element 1 to element 2 after one half life of A2
(Assume initial number of nuclei are same for both 
elements)','[{"key": "1", "text": "21/3"}, {"key": "2", "text": "22/3"}, {"key": "3", "text": "2"}, {"key": "4", "text": "25/3"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','2b8de6fef034dd7f29c3cfac971b1b2eae422a339b5084adab2c8e13c0866c88',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q18','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','5b6afbe5f0640be003176c63091691e31b7005b5dba59364599fa465ed626ac2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q19','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','58f3b41af9d43fddcfa4713e64fa4fb2146dcd454359e286a1006f8137d84372',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q20','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','721cb4d74e372998c9c6cdf10c47f70a511d4719556c1722933c9936e72b1081',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q21','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',21,'Section B','Numerical Value','From a uniform circular disc of radius 20 cm a circular
portion of radius 5 cm is removed. The shift in the
position of centre of mass (in cm).',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','86e43eec072a06373ffdb00c7c0e2c67609920e9d1d6a5121d3d89bd3bb196a2',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q22','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',22,'Section B','Numerical Value','A bullet of kinetic energy of 125 J strikes a lead block
where temperature rises by 50°C. If specific heat of
lead is 0.1 J/g-°C then mass of lead block is (Assume
half of kinetic energy of bullet is converted to heat) m
gram then 2m is',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','ffc555316315658010894baf7e6aa736a2b53cd3b561861c8913f35508955c83',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q23','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',23,'Section B','Numerical Value','Question 23',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','2f607c86a6b1e21b9147759f8ce7056daada90b8766dee1dcd9e55a7bd8245d4',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q24','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',24,'Section B','Numerical Value','Question 24',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','a7d72baf36783538bc51594a8cb13fc97931ecbe108ec01a2c8088a831e80e0d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_phys_q25','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Physics',25,'Section B','Numerical Value','Question 25',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)','beb7f5c91f4311d1f788035ede86a527eb90db250b8c7cf666a578df70db9200',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q1','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',1,'Section A','MCQ','Which of the following compound can react with
Hinsberg reagent?
(A) Aniline
(B) N,N-Dimethyl aniline
(C) Methyl amine
(D) N-phenyl aniline','[{"key": "1", "text": "A only"}, {"key": "2", "text": "A and C only"}, {"key": "3", "text": "A, C and D"}, {"key": "4", "text": "A and B only"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','3687063e9b05df4b33e3b0c1809329db27d90e8ddb0370cc8f7aed802bb843b9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q2','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',2,'Section A','MCQ','Among the following, the most stable carbanion is','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_chemistry_q2.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','918c8a98a40e1c725c974b019516f1cb02537f2d9b20769d48cef5e003b2ac4d',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q3','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',3,'Section A','MCQ','Which of the following compound can show fac-mer
isomerism?','[{"key": "1", "text": "[Co(NH3)6]Cl3"}, {"key": "2", "text": "[Co(NH3)3Cl3]"}, {"key": "3", "text": "[Co(en)2(NH3)2]Cl3"}, {"key": "4", "text": "[Co(H2O)6]Cl3"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','85dedd0b83af70ba77e41206f232388d105b5c59ea2a5650e61f9687be1f2df7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q4','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',4,'Section A','MCQ','Which of the following pair of ions have same
colour?','[{"key": "1", "text": "Ti4+, V3+"}, {"key": "2", "text": "Cr2+, Cu2+"}, {"key": "3", "text": "Cr3+, Ni2+"}, {"key": "4", "text": "Mn3+, Fe2+"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','5298be8d6bc733938511d36d134918773be487ef2b9421a5abd915dd2cab3d39',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q5','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',5,'Section A','MCQ','Which of the following does not belong to the same
period in the modern periodic table?','[{"key": "1", "text": "Pd"}, {"key": "2", "text": "Ir"}, {"key": "3", "text": "Pt"}, {"key": "4", "text": "Os"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 7)','ebe52293b9d4a21d2ed358bd45a3c8c684aa804bb8a75d428e71de4a9d9fed41',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q6','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',6,'Section A','MCQ','Identify the product formed in the following reaction
-
CH
CH
CHO
HCHO
OH
3
2
→  
-
-
+
⎯⎯⎯⎯
Excess
Reflux','[{"key": "1", "text": "(2)"}, {"key": "3", "text": "(4)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_chemistry_q6.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','1e25a21e69ac3f141fac1447a2bb19b7f06ce6b2ea9bd22ce084d167952e8759',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q7','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',7,'Section A','MCQ','Incorrect statement among the following is','[{"key": "1", "text": "SO2 act as oxidising agent but not reducing\nagent"}, {"key": "2", "text": "NO2 exists as dimer"}, {"key": "3", "text": "PF5 exists but NF5 does not"}, {"key": "4", "text": "PH3 has lower proton affinity than NH3"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','d4f98ebaad0dde1b4d59e8f4ac28edb32a27f7a51dd04c88997b3bba9331f2a6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q8','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',8,'Section A','MCQ','Consider the following sequence of reactions and
find the molecular mass of the final product (A)
formed in g mol-1.','[{"key": "1", "text": "108"}, {"key": "2", "text": "216"}, {"key": "3", "text": "171"}, {"key": "4", "text": "186"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_chemistry_q8.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','28ce8bc51abb6089c540ca4a0dc6ed988beab8e941d943caee86bc4f263f4f0e',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q9','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',9,'Section A','MCQ','Match the Column I with Column II and choose the
correct option.
Column I 
 
Column II
A. 
BF3 
(i) 
Odd e- species
B. 
CCl4, CO2 
(ii) 
Expanded octet
C. 
PCl5, BrF5 
(iii) 
Complete octet
D. 
NO 
(iv) 
Electron deficient','[{"key": "1", "text": "A - (iii), B - (iv), C - (i), D - (ii)"}, {"key": "2", "text": "A - (iv), B - (ii), C - (iii), D - (i)"}, {"key": "3", "text": "A - (iv), B - (iii), C - (ii), D - (i)"}, {"key": "4", "text": "A - (i), B - (ii), C - (iii), D - (iv)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 8)','d56238a0ae65727b2c83dc338fd25ce5a634fbbb830309c74453e96ee57b4909',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q10','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',10,'Section A','MCQ','Match the column and choose the correct option
Column-I 
 
Column-II
(A)
(P) 
Sandmeyer
reaction
(B)
(Q) 
Fittig
reaction
(C)
(R) 
Wurtz-Fittig
reaction
(D) 
CH3 - CI + AgF → 
(S) 
Swarts
reaction','[{"key": "1", "text": "(A) - (Q), (B) - (P), (C) - (R), (D) - (S)"}, {"key": "2", "text": "(A) - (Q), (B) - (P), (C) - (S), (D) - (R)"}, {"key": "3", "text": "(A) - (Q), (B) - (R), (C) - (S), (D) - (P)"}, {"key": "4", "text": "(A) - (P), (B) - (Q), (C) - (R), (D) - (S)"}]','/pyq_diagrams/jee_main_2025_btech_20250123_shift1_chemistry_q10.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','97d4b133b12ec6c840e8ce77c8611f5f46e2d1618b8e805f55ff12c307f88db9',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q11','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',11,'Section A','MCQ','Co2+ is forming an octahedral complex with spin
only magnetic moment 3.83 BM. The correct
electronic configuration for cobalt in the complex is?
t
e 
5
2
2g
g','[{"key": "1", "text": "t\ne \n \n6\n1\n2g\ng"}, {"key": "2", "text": "t\ne \n4\n3\n2g\ng"}, {"key": "3", "text": "e t"}, {"key": "4", "text": "4 3\n2"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','7ffbfdd9ad4ce167fbdd515fb868a16528e60e42a67dccc33f3c95e14dd15b97',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q12','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',12,'Section A','MCQ','Given below are two statements :
Statement-I : During Lassaigne’s test, covalent
compound is converted to ionic compound.
Statement-II : Na4[Fe(CN)6] gives Prussian blue
colour on reaction with Fe2(SO4)3.','[{"key": "1", "text": "S-I is correct, S-II is incorrect"}, {"key": "2", "text": "S-I is incorrect, S-II is correct"}, {"key": "3", "text": "Both S-I and S-II are correct"}, {"key": "4", "text": "Both S-I and S-II are incorrect"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 9)','29fe8d9b298e595f9f233681efd314e0065cc9f657db9fd5acb80159d9eff05b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q13','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',13,'Section A','MCQ','A(g) 
 2B(g)
→
For the given reaction, initial pressure was 0.6 atm
and rate constant is 4.606 × 10-2 sec-1. Find the 
pressure at 100 sec','[{"key": "1", "text": "0.6 atm"}, {"key": "2", "text": "1.194 atm"}, {"key": "3", "text": "0.594 atm"}, {"key": "4", "text": "0.006 atm"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','07d26e2cefd6a217c041a527a1f144a3f24e5abd7da56effc193a66f5cfb9a64',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q14','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',14,'Section A','MCQ','Consider the following statements and choose the 
correct option.
Statement-I: Fructose does not contain aldehyde 
group but it gives Tollen''s test.
Statement-II: In disaccharides, if the reducing 
groups are bonded, these are non-reducing sugar
e.g., sucrose. If these functional groups are free 
then they are reducing sugar e.g. maltose and
Lactose.','[{"key": "1", "text": "Statement-I and Statement-II are correct"}, {"key": "2", "text": "Statement-I is correct and Statement-II is\nincorrect"}, {"key": "3", "text": "Statement-I in incorrect Statement-II is correct"}, {"key": "4", "text": "Statement-I and Statement-II both are incorrect"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','2b1b5b075e1d612344d26b10f74e563fea2439a25a1ec39ab96629194cc2c186',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q15','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',15,'Section A','MCQ','For a sample of Hydrogen atom, the wavelength
observed is 656 nm during a transition. The
transition and corresponding series in hydrogen
spectrum will be','[{"key": "1", "text": "3 → 2, Balmer"}, {"key": "2", "text": "4 → 1, Lyman"}, {"key": "3", "text": "5 → 2, Balmer"}, {"key": "4", "text": "4 → 3, Paschen"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','dd79806350e8e6d4b64815c2f5373ba52da6787e4dcf5c182c78ac2d60c72663',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q16','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','652c8402b162d5fd604c40c663d605a97dce1647bbab354dd580a9cfdd6f9cd1',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q17','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','69fad67d35d718f1ca913ffff7f1e2ea58606833128e4b32bcdafa0738b585cb',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q18','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','d005fd342bed327d376cb1b4ea9f9cde29c6d059126f1ec055f1822c20168b96',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q19','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',19,'Section A','MCQ','Question 19',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','a13c32548b391e2514739675382005031d0e2346288f19f09055511060db7179',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q20','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',20,'Section B','Numerical Value','contains 5 Numerical based questions. The answer to
each question should be rounded-off to the nearest
integer.',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 10)','d40be2aeb5fc3212ef864538689da1e8117ca3f09b5ffd0419092f6172c6338f',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q21','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',21,'Section B','Numerical Value','If 2 g phenol is allowed to react with Br2/H2O. How
much Br2 (in g) will be required to produce 2, 4, 6
tribromophenol (Rounded off to nearest integer).',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','de9b1d16f63db29d7c15e787fd1c9f850ea1a75a44d3f3babcfd0d5bda982ae5',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q22','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',22,'Section B','Numerical Value','When 1021 molecules are removed from x mg of
CO2(g), then 2.4 × 10-3 moles of CO2 are left.
Calculate the value of x. [Take \implies NA = 6 × 1023]',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','4789428ab280b2fd0a8884b5addf6f2891ae217af0fff43aad259758b8ee480b',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q23','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',23,'Section B','Numerical Value','Consider the following Latimer diagram
⎯⎯⎯→
⎯⎯⎯→
⎯⎯⎯⎯
-
-
+
+
FeO
Fe
Fe
Fe
2.0 V
0.8 V
0.5 V
2
3
2
0
4
→
E
-
+ 
FeO
/Fe
4
Find 
2
2',NULL,'/pyq_diagrams/jee_main_2025_btech_20250123_shift1_chemistry_q23.png',FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','f3c98e9594c566e1acb14808debf9690b65938cb7e1007f8aeed1fdc53cd99cf',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q24','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',24,'Section B','Numerical Value','Consider the given values :
H = 55 kJ mol-1
S = 175 J mol-1 K-1
T = 25°C
Calculate the value of Gibbs free energy change 
(G) in J mol-1.',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','b15ede50d104f3a0ce2998c6c588d59c3aa1004ce5fdbcf0ec415cfb0194a857',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_chem_q25','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Chemistry',25,'Section B','Numerical Value','In estimation of sulphur by Carius method, 160 g of 
organic compound gives 466 g of Barium sulphate. 
% of sulphur in the organic compound is _____.',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 11)','6d92bebfb0c118da8b8fed650f6ba5993828b277e04cb868f87075df65f9fcf4',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q1','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',1,'Section A','MCQ','If for an arithmetic progression, if first term is 3 and
5
1
sum of first four terms is equal to 
 of the sum of
next four terms, then the sum of first 20 terms is','[{"key": "1", "text": "1080"}, {"key": "2", "text": "364"}, {"key": "3", "text": "-1080"}, {"key": "4", "text": "- 364"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','140ba63cda53cc0e3de300a8efdbbe172b0993a7e70a6d9aaba2cf4bc8ec02df',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q2','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',2,'Section A','MCQ','How many words can be formed from the word 
“DAUGHTER” such that any vowels are not 
together','[{"key": "1", "text": "34000"}, {"key": "2", "text": "35000"}, {"key": "3", "text": "36000"}, {"key": "4", "text": "37000"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','76ca0585830b5479fb644bfc5b5765466c23c2bff01a295e88e70af289cac122',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q3','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',3,'Section A','MCQ','Two biased dies are tossed. Die 1 has 1 on two 
faces, 2 on two faces, 3 and 4 on other faces, while 
die 2 has 2 on 2 faces, 4 on 2 faces and 1 and 3 on 
other faces. Then the probability that when throwing 
these dices we get sum of 4 or 5.
2
3
7
3','[{"key": "1", "text": ""}, {"key": "2", "text": "8\n9\n9\n4"}, {"key": "3", "text": "(4)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','fbb0298a63f3c9b77ac33bb291d31e0d4c252be875c67a276fe2e13d952fb6d6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q4','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',4,'Section A','MCQ','Value of 
 is
(
)
[
]
[
]
(
)


[
]
x
(
)

 
,
2
13
x
12
tan 1
+','[{"key": "2", "text": "-\n13\nx\n12\ntan 1\n-\n \n-"}, {"key": "1", "text": "12\nx\n5\ntan 1\n(\n)\n(\n)\n+\n(\n)\n-\n5\nx\n4\ntan 1\n-"}, {"key": "4", "text": "-\n(3)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 12)','331ec1406d7f085447c2e5b34749ec0c1e3919f1709388312fcedd2fc0f2c0ba',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q5','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',5,'Section A','MCQ','A relation defined on set A = {1, 2, 3, 4}, then how 
many ordered pairs are added to
R = {(1, 2), (2, 3), (3, 3)} so that it becomes 
equivalence relation?','[{"key": "1", "text": "10"}, {"key": "2", "text": "9"}, {"key": "3", "text": "7"}, {"key": "4", "text": "8"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','1247560de6f9bc40d7b46a9a8b1e4b9e221cb2a5abd813fb0f03a7fed1a58271',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q6','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',6,'Section A','MCQ','The sum of all rational terms in the expansion of
6
+
+
(
)
(
)
1
2
3
(
)
(
)
1
1
3
2
is','[{"key": "1", "text": "638"}, {"key": "2", "text": "728"}, {"key": "3", "text": "528"}, {"key": "4", "text": "729"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 13)','c1cca0383e0ec52e2093f3a89b0281541085e8a75978e9dad32cdab413aca534',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q8','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',8,'Section A','MCQ','Consider the set S = {1, 2, 3, …, 1000}. Then the 
number of arithmetic progression that can be 
formed using elements of set S such that first term 
is 1 and last term is 1000 is','[{"key": "1", "text": "8"}, {"key": "2", "text": "12"}, {"key": "3", "text": "15"}, {"key": "4", "text": "4"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','8620152c1a232afc049e2450a9ad5be4aa7bd890f748224f62ed5b8c97f6f1d7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q9','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',9,'Section A','MCQ','Let A and B are non-singular commutative 
matrices. Then A[(adj A-1) (adj(B-1))]-1 B is equal to','[{"key": "1", "text": "|A| |B| ln\nl\nA\nB\nn\n|\n| |\n|"}, {"key": "2", "text": "l\nn\n|\n|"}, {"key": "3", "text": "A\nl\nn\n|\n|"}, {"key": "4", "text": "B"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','2f9d64649977516cc21944bd33a98fbb592667cf7043766d9ea3fdb4c16044c8',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q10','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',10,'Section A','MCQ','Let f(x) = logex and g(x) =
2
(
)
+
2
- 2
1
then domain of f(g(x)) for x > 0 is','[{"key": "1", "text": "(1, )"}, {"key": "2", "text": "(0, )\n(\n)\n(\n)\n\n(\n)\n,\n2\n1\n(3)"}, {"key": "4", "text": "(0, 1)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','b7a8ebe9bb9dc3bc06694532aa24a07a16db96297a8cac5cbd548b597b883596',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q11','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',11,'Section A','MCQ','If the curve satisfying the differential equation
x
2
-
dy
e
y
dx
x
6
2
=
passes through (0, 0) and (ln 2, k),
2
+ e
1
then k is
ln3
5
3','[{"key": "1", "text": "ln2\n5\n6"}, {"key": "2", "text": "ln3\n9\n8"}, {"key": "3", "text": "ln2\n2\n7\n(4)"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 14)','be012a7bc32de73b4feb380184fdf9d27a9f10b81b93681778ba4c276801f630',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q12','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',12,'Section A','MCQ','Let
2
13
(
)
+
(
)
-
(
)
x
x
13
1
32
15','[{"key": "1", "text": "+ C\n2\n13\n(\n)\n+\n(\n)\n-\n(\n)\nx\nx\n32\n1\n13\n15"}, {"key": "2", "text": "+ C\n2\n13\n(\n)\n-\n(\n)\n+\n(\n)\nx\nx\n1\n15\n32\n1"}, {"key": "3", "text": "+ C\n15\n13\n(\n)\n-\n(\n)\n+\n(\n)\nx\nx\n13\n15\n32\n1"}, {"key": "4", "text": "+ C"}]',NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','7079a2f03090db307a6cdbe2f5c0a5d6290c301fcc7f17304e22b83174adc785',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q13','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',13,'Section A','MCQ','Question 13',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','0ba70b528f665d779a7ad5b7227ddc9ec50f5df8c53e489758d1ce05174c3ee6',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q14','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',14,'Section A','MCQ','Question 14',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','89d1584a9737e995cd7f25987b9a8f7a1269534e6d55f448297b92502703b6af',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q15','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',15,'Section A','MCQ','Question 15',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','285102122a152143069a7e3864c21e4f458667936c458e2af095ae23f13c9e05',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q16','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',16,'Section A','MCQ','Question 16',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','3273037a992f7df394b3fda543004605ce6ca2a7a3f74111ed06c6d64ccf6700',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q17','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',17,'Section A','MCQ','Question 17',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','72640d9c0de5a707c0690bff9b9299854899a1b7cbc92ea9e45da380c0c42e39',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q18','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',18,'Section A','MCQ','Question 18',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','8b3268285068b29ea4cda6e1d721b7323b003ea0e4e14351284ad95a285e5475',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q20','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',20,'Section B','Numerical Value','Question 20',NULL,NULL,TRUE,'Question statement incomplete in memory-based PDF','192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','c66c3f9e0ad715c6f0a83d849c44a970bcf07b2981c468caa012e55f2191f453',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q21','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',21,'Section B','Numerical Value','If f(x) is continuous at x = 0, where
+
+
+



0
2
1
2
(
)

x
k
x
k
x
x
sin(
1)
sin(
1)
=

= 
f x
( )
4
x
k x
0
1
2
[
]


+
[
]


[
]
+
2
log
0
1
x
x
k x
1
k
k
+
 is 
2
2
1
2
Then',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 15)','7ab33c22c0d72bd57578d560f1158086e58d66a32979d797d630ed883abdf0a7',now(),now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.pyq_questions (id,paper_id,exam,year,course,exam_date_str,shift,session,subject,question_number,section,question_type,question_statement,options,diagram_url,review_required,review_reason,source_reference,fingerprint,created_at,updated_at) VALUES ('jee_main_2025_btech_20250123_shift1_math_q22','jee_main_2025_btech_20250123_shift1','JEE Main',2025,'B.Tech','23 January 2025','Shift 1','Morning','Mathematics',22,'Section B','Numerical Value','If for the system of linear equations having infinite 
solutions 
 
( - 4)x + ( - 2)y + z = 0 
 
2x + 3y + 5z = 0 
 
x + 2y + 6z = 0 
 
then 2 +  is 
Answer (90) 
Sol. For infinite solutions  = 0
-
-

4
2
=
 
2
3
5
0
1
2
6
\implies 2 - 18 = 0 
 
 
 = 9 
 
Now 2 +  = 92 + 9 = 81 + 9 = 90 
23. If the equation a(b - c)x2 + b(c - a)x + c(a - b) = 0
5
=
b
, then 
16
has equal roots and if a + c = 5 and',NULL,NULL,FALSE,NULL,'192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)','da19ac125f2f412d9c2407b4adcf78fe8638430172a27a817266fc4c58fa4b80',now(),now()) ON CONFLICT (id) DO NOTHING;

-- Done. Run SELECT COUNT(*) FROM public.pyq_questions; to verify.