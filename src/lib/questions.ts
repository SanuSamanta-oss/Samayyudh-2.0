// ============================================================
// SamayYudh 2.0 — Question Bank (GATE 2024 Papers)
// ============================================================

import { Question, ExamCategoryCode, QuestionType, Difficulty } from '@/types';

const rawQuestions: Omit<Question, 'exam_category' | 'question_type'>[] = [
  {
    "id": "gate-ag-24-q1",
    "question_number": 1,
    "question_text": "If \u2018\u2192\u2019 denotes increasing order of intensity, then the meaning of the words   [dry \u2192 arid \u2192 parched] is analogous to [diet \u2192 fast \u2192 ________ ].  Which one of the given options is appropriate to fill the blank?",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "starve",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "reject",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "feast",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "deny",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q2",
    "question_number": 2,
    "question_text": "If two distinct non-zero real variables \ud835\udc65 and \ud835\udc66 are such that (\ud835\udc65+ \ud835\udc66) is proportional  to (\ud835\udc65\u2212\ud835\udc66) then the value of   \ud835\udc65 \ud835\udc66",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "depends on \ud835\udc65\ud835\udc66",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "depends only on \ud835\udc65 and not on \ud835\udc66",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "depends only on \ud835\udc66 and not on \ud835\udc65",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "is a constant          Agricultural Engineering (AG)  Page 2 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q3",
    "question_number": 3,
    "question_text": "Consider the following sample of numbers:   9, 18, 11, 14, 15, 17, 10, 69, 11, 13  The median of the sample is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "13.5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "11",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "18.7",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q4",
    "question_number": 4,
    "question_text": "The number of coins of \u20b91, \u20b95, and \u20b910 denominations that a person has are in the   ratio 5:3:13. Of the total amount, the percentage of money in \u20b95 coins is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "21%",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14 2 7%",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "10%",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "30%               Agricultural Engineering (AG)  Page 3 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q5",
    "question_number": 5,
    "question_text": "For positive non-zero real variables \ud835\udc5d and \ud835\udc5e, if  log (\ud835\udc5d2 + \ud835\udc5e2) = log \ud835\udc5d+ log \ud835\udc5e+ 2 log 3 ,  then, the value of   \ud835\udc5d4+\ud835\udc5e4 \ud835\udc5d2\ud835\udc5e2  is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "79",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "81",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "9",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "83",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q6",
    "question_number": 6,
    "question_text": "In the given text, the blanks are numbered (i)\u2212(iv). Select the best match for all the  blanks.  Steve was advised to keep his head       (i)       before heading       (ii)       to bat;   for, while he had a head       (iii)       batting, he could only do so with a cool head   s       (iv)        his shoulders.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(i) down     (ii) down     (iii) on     (iv) for",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "(i) on     (ii) down     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "(i) down     (ii) out     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "(i) on     (ii) out     (iii) on    (iv) for    Agricultural Engineering (AG)  Page 4 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q7",
    "question_number": 7,
    "question_text": "A rectangular paper sheet of dimensions 54 cm \u00d7 4 cm is taken. The two longer  edges of the sheet are joined together to create a cylindrical tube. A cube whose  surface area is equal to the area of the sheet is also taken.   Then, the ratio of the volume of the cylindrical tube to the volume of the cube is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1/\u03c0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "2/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "3/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "4/\u03c0                                Agricultural Engineering (AG)  Page 5 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q8",
    "question_number": 8,
    "question_text": "The pie chart presents the percentage contribution of different macronutrients to a  typical 2,000 kcal diet of a person.     The typical energy density (kcal/g) of these macronutrients is given in the table.   Macronutrient  Energy density (kcal/g)  Carbohydrates  4  Proteins  4  Unsaturated fat  9  Saturated fat  9  Trans fat  9  The total fat (all three types), in grams, this person consumes is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "44.4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "77.8",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "100",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "3,600      Carbohydrates 35% Proteins 20% Unsaturated fat 20% Saturated fat 20% Trans  fat 5% Macronutrient energy contribution   Agricultural Engineering (AG)  Page 6 of 25  Organizing Institute: IIS",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q9",
    "question_number": 9,
    "question_text": "A rectangular paper of 20 cm \u00d7 8 cm is folded 3 times. Each fold is made along the  line of symmetry, which is perpendicular to its long edge. The perimeter of the final  folded sheet (in cm) is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "18",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "24",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "20",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "21",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q10",
    "question_number": 10,
    "question_text": "The least number of squares to be added in the figure to make AB a line of   symmetry is",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "6",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "7            Agricultural Engineering (AG)  Page 7 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q11",
    "question_number": 11,
    "question_text": "The divergence of the curl of a twice continuously differentiable vector function is  __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\u221e",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q12",
    "question_number": 12,
    "question_text": "Laplace transform of a function f(t) = t4 as a function of \u2018s\u2019 is __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "120 s5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "24 s5",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "120 s4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "24 s4            Agricultural Engineering (AG)  Page 8 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q13",
    "question_number": 13,
    "question_text": "If the dynamic weight on the front axle is lesser than 20% of the total weight of  tractor, the longitudinal instability of tractor can be avoided by __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "adding weight on the rear axle",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "adding weight on the front axle",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "reducing weight on the rear axle",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "reducing weight on the front axle",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q14",
    "question_number": 14,
    "question_text": "In places with severe cold climate, the most important fuel property to be considered  for running an internal combustion engine is __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "heating value",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "flash point",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "pour point",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "boiling point            Agricultural Engineering (AG)  Page 9 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q15",
    "question_number": 15,
    "question_text": "A towed rigid wheel with a total weight W is to be rolled on a hard horizontal surface  as well as up the slope on a hard surface inclined at an angle \u03b8 with the horizontal.  The rolling resistance of the wheel on inclined surface as compared to that on the  horizontal surface is __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "increased  by Wsin\u03b8",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "increased by Wcos\u03b8",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "decreased by Wsin\u03b8",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "decreased by Wcos\u03b8",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q16",
    "question_number": 16,
    "question_text": "The difference between advance curve and recession curve for a given surface  irrigation event is known as __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "time of concentration",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "lag time",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "time to peak",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "intake opportunity time            Agricultural Engineering (AG)  Page 10 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q17",
    "question_number": 17,
    "question_text": "Match the following instruments (in Column I) with corresponding measurements  (in Column II).        Column I    Column II  P  Current meter    1  Solar radiation  Q  Anemometer    2  Rainfall  R  Hygrometer     3  Stream flow velocity  S  Symon\u2019s gauge    4  Humidity   T  Pyranometer    5  Wind speed",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-3, Q-5, R-4, S-2, T-1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2, Q-3, R-5, S-1, T-4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-1, Q-2, R-3, S-4, T-5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-5, Q-4, R-1, S-3, T-2            Agricultural Engineering (AG)  Page 11 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q18",
    "question_number": 18,
    "question_text": "In wind erosion, the maximum portion of soil is transported by the process of  __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "suspension",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "saltation",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "surface creep",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "bed load",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q19",
    "question_number": 19,
    "question_text": "Hilly areas receiving heavy rainfall, where a major portion of the rainfall is to be  drained as surface runoff, are suggested to adopt bench terraces with __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "sloping inward",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "level tops",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "sloping outward",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "narrow width",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q20",
    "question_number": 20,
    "question_text": "Critical thickness of insulation (rcr) for a pipe having thermal conductivity (k) and  convective heat transfer coefficient (ho) is __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "2k/ho",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "k/ho",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "ho/k",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "2ho/k    Agricultural Engineering (AG)  Page 12 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q21",
    "question_number": 21,
    "question_text": "A continuously differentiable function y = f(x) satisfies one or more of the following  conditions at its point of inflection:",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "d2y dx2 \u2260 0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "d2y dx2 = 0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "d3y dx3 = 0",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "d3y dx3 \u2260 0",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q22",
    "question_number": 22,
    "question_text": "In-situ volumetric soil moisture content measuring method(s) is/are:",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Neutron probe",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Tensiometer",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Time domain reflectometry",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Piezometer             Agricultural Engineering (AG)  Page 13 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q23",
    "question_number": 23,
    "question_text": "Incorrect statement(s) with respect to hydrothermal treatment of paddy is/are:",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Process imparts hard texture to grain",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Retention of Vitamin B is less",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Cooking to the same degree of softness requires less time",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Bran obtained contains higher oil content",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q24",
    "question_number": 24,
    "question_text": "Falling rate period of drying can be explained by one/more of the following:",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Capillary rise of water",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Molecular diffusion of water",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Surface cooling",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Surface evaporation",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q25",
    "question_number": 25,
    "question_text": "The mean and variance of a dataset are 16 and 25, respectively. The coefficient of  variation of the dataset, in %, is __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q26",
    "question_number": 26,
    "question_text": "The chances for passing an endurance test for three threshers P, Q and R are 1/6,  1/4, and 1/2, respectively. The probability of passing the endurance test by at least  one thresher, in fraction, is __________. (Rounded off to 2 decimal places)            Agricultural Engineering (AG)  Page 14 of 25  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q27",
    "question_number": 27,
    "question_text": "The height of adult males at 5th, 50th and 95th percentiles are 162 cm, 173 cm and   185 cm, respectively. The minimum inside height of the tractor cab required to  ensure the satisfactory design based on the given data, in cm, is __________.  (Answer in integer)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q28",
    "question_number": 28,
    "question_text": "A chain drive is used to transmit power from a DC motor to the shaft of a solar  energy operated thresher by reducing the speed from 240 rpm to 120 rpm. The  number of teeth on the driving sprocket is 20 and the pitch circle diameter of the  driven sprocket is 600 mm. The pitch of the chain used, in mm, is __________.  (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q29",
    "question_number": 29,
    "question_text": "A tractor drawn rotavator with a rotor radius 300 mm has 6 flanges having 3 blades  in each flange acting in one plane. It is operated at a rotor speed of 180 rpm and a  forward speed of 3 km.h-1. Increasing the forward speed as well as the rotor speed  by 15% each, the change in length of soil slice, in mm, is __________. (Answer in  integer)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q30",
    "question_number": 30,
    "question_text": "The air standard cycle efficiency of the Otto cycle is 56% and heat supplied is   12.5 kJ, the heat rejected during the cycle, in kJ, is __________. (Rounded off to 2  decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q31",
    "question_number": 31,
    "question_text": "The slope length of an area having land slope of 6% is reduced to half while other  conditions are kept unchanged. The reduction in annual soil loss from the area,   in %, is __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q32",
    "question_number": 32,
    "question_text": "The excess water from a watershed of area 16.95 km2 is drained out through a  channel at an average rate of 2.8 m3.s-1. Drainage coefficient of the watershed,   in cm, is __________. (Rounded off to 2 decimal places)           Agricultural Engineering (AG)  Page 15 of 25  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q33",
    "question_number": 33,
    "question_text": "Freshly harvested shrimps of 100 kg having initial temperature of 25 \u00b0C are frozen  to \u221218 \u00b0C. The specific heat (cp) of shrimp above and below freezing point (0 \u00b0C)  are 3.64 kJ.kg-1.\u00b0C-1 and 2.01 kJ.kg-1.\u00b0C-1, respectively. Considering the latent heat  of fusion as 240 kJ.kg-1, the heat load removed during the process, in kJ, is  __________. (Rounded off to 1 decimal place)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q34",
    "question_number": 34,
    "question_text": "An indented cylinder type rice grader has been fed with milled rice containing 18 %  brokens. After separation, head rice stream contains 3 % brokens and the broken  stream carried away 4 % head rice. The effectiveness of the given rice grader on the  basis of head rice separation, in fraction, is __________. (Rounded off to 3 decimal  places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q35",
    "question_number": 35,
    "question_text": "A single effect evaporator concentrates 9090 kg.h-1 herbal extract of 12 % solids  entering at 300 K to a final solid concentration of 20 %. Assuming negligible product  loss through vapor, the amount of concentrated product, in kg, is __________.  (Answer in integer)                        Agricultural Engineering (AG)  Page 16 of 25  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q36",
    "question_number": 36,
    "question_text": "[P] = [ 2 3 7 4 1 5 ] and [Q] = [ 8 11 9 12 6 13 ] are two matrices. The matrix [P]T[Q]  is  __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "[  64 36 116 46 39 107 70 40 128  ]",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "[  64 46 70 36 39 40 116 107 128  ]",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "[ 112 113 88 89 ]",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "[ 112 88 113 89 ]",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q37",
    "question_number": 37,
    "question_text": "The complete solution for the differential equation  d2y dx2 + 2  dy dx \u2212 3y = 0 for y(0) = 0  and  \ud835\udc51\ud835\udc66 \ud835\udc51\ud835\udc65(0) = 8 is __________.",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "2(ex \u2212 e3x)",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "2(ex \u2212e\u22123x)",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "2(ex + e3x)",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "2(ex + e\u22123x)            Agricultural Engineering (AG)  Page 17 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q38",
    "question_number": 38,
    "question_text": "A power operated chaff cutter has an effective throat width of 450 mm and operating  clearance of 150 mm. It is used for chopping straw at a moisture content of 20 % with  bulk density of 60 kg.m-3 while passing through the feed rolls. The number of knives  on the cutter head are 4, speed of the cutter head is 540 rpm and the theoretical length  of cut is 10 mm. The theoretical capacity of the chaff cutter, in ton.h-1, is _________.  (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1.31",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "5.25",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "7.54",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "9.61",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q39",
    "question_number": 39,
    "question_text": "A 4.2 m self-propelled combine harvester operating at a forward speed of   3.5 km.h-1 is used to harvest wheat in an area of 300 ha in a year at a field efficiency  of 75 %. Consider the variable cost to be linearly related to the actual hours of  operation. To bring down the cost of operation per hour by 15 %, the change in area  required to be harvested per year, in ha, is __________. (Rounded off to 2 decimal  places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "52.94",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "53.74",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "55.80",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "57.65            Agricultural Engineering (AG)  Page 18 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q40",
    "question_number": 40,
    "question_text": "A 3-cylinder 4-stroke diesel engine with a bore 73 mm and stroke 78 mm is tested at  2200 rpm. When a braking torque 55 N.m is applied, the indicated mean effective  pressure is found to be 1050 kPa. The mechanical efficiency of the engine, in %, is  __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "57.21",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "61.45",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "67.21",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "71.25",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q41",
    "question_number": 41,
    "question_text": "The performance of a border irrigation event was evaluated by taking soil moisture  measurements at 12 locations along the border from the upstream end. The computed  irrigation depths at those locations were 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, and  39 mm. The Christiansen Uniformity Coefficient (CU) for the event, in %, is  __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "93.26",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "91.66",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "89.70",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "36.28             Agricultural Engineering (AG)  Page 19 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q42",
    "question_number": 42,
    "question_text": "A 10 ha watershed received a 4-hour rainfall storm with rainfall intensity of 2, 1, 1.5,  and 1 cm.h-1 in each subsequent hour, respectively. Assuming phi-index (\u03d5) of   1 cm.h-1, the volume of direct runoff, in m3, is __________. (Rounded off to 2 decimal  places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1500",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4500",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5500",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "15000",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q43",
    "question_number": 43,
    "question_text": "A surveyor started a longitudinal section leveling survey by taking starting bench  mark of elevation 53.85 m. During the survey, he takes an observation of intermediate  sight of 2.42 m with the staff held on another bench mark of 85.45 m. The sum of the  back sights from the start to the point is 50.28 m and that of fore sight is 16.30 m. If  the surveyor ends the survey operation on the second bench mark, the error of closure  on the second bench mark, in m, is __________. (Rounded off to 2 d",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0.02",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "0.04",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "0.06",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "0.08             Agricultural Engineering (AG)  Page 20 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q44",
    "question_number": 44,
    "question_text": "The decimal reduction time D121 and the z value of thermophilic spores in milk were  found to be 60 seconds and 11 \u00b0C, respectively. Heating time required at   141 \u00b0C for a 10 log cycle reduction in population, in seconds, is __________.  (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0.28",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "0.91",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "2.81",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "9.12",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q45",
    "question_number": 45,
    "question_text": "Match the following in material types (Column I) with their rheological properties  (Column II).    Column I  Column II  P. Bingham plastic  1. Viscosity increases with increase in shear rate  Q. Dilatant  2. Finite yield stress  R. Pseudoplastic  3. Shear rate proportional to shear stress   S. Newtonian  4. Viscosity decreases with increase in shear rate",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-1, Q-2, R-4, S-3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2, Q-1, R-4, S-3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-2, Q-4, R-1, S-3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-4, Q-3, R-2, S-1            Agricultural Engineering (AG)  Page 21 of 25  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q46",
    "question_number": 46,
    "question_text": "Match the following types of mill in Column I based on their grinding mechanisms  in Column II.    Column I  Column II  P. Attrition mill  1. Compression and shear  Q. Ball mill  2. Impact and abrasion   R. Hammer mill  3. Crushing and shear  S. Roller mill  4. Impact and shear",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-3; Q-2;  R-4; S-1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2; Q-3; R-4; S-1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-3; Q-1; R-4; S-2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-3; Q-4; R-1; S-2",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q47",
    "question_number": 47,
    "question_text": "The calculated value of e2x using Taylor\u2019s series with first four terms for x =  1 2 is  __________. (Rounded off to 3 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q48",
    "question_number": 48,
    "question_text": "The directional derivative of u(x, y, z) = x2y + y2z at the point (1, 2, 3) in the direction  i\u0302 +2 j\u0302 + 3 k\u0302 is __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q49",
    "question_number": 49,
    "question_text": "A single acting disk harrow having 5 disks in each gang with a gang angle of 20\u00ba is  operated at a forward speed of 3 km.h-1 and a depth of 10 cm. The horizontal soil  reaction force acting parallel to the face of each disk is found to be 250 N. The  drawbar power required to pull the harrow, in kW, is __________. (Rounded off to 2  decimal places)     Agricultural Engineering (AG)  Page 22 of 25  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q50",
    "question_number": 50,
    "question_text": "A tractor drawn rotary mower has a swath width 1.2 m when operated at a forward  speed of 5 km.h-1. The specific power loss due to air, stubble and gear train friction  per m of swath width is 1.5 kW and the specific cutting energy is 2 kJ.m-2. The total  weight of tractor with mower is 25 kN and the resistance to propel the tractor with  mower is 6 % of its total weight. Assuming transmission efficiency between engine  to drawbar as 75 % and engine to PTO as 87 %, the total engine power require",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q51",
    "question_number": 51,
    "question_text": "A farmer desires to run a diesel engine developing a brake power of 1.5 kW,  continuously for 2 hours using biogas and diesel in a dual fuel mode. If gas  requirement for running the engine in dual fuel mode is 0.67 m3.kW-1.h-1, the  minimum size of KVIC model biogas plant with a gas holding capacity of 60 %  suitable for running this diesel engine, in m3, is __________. (Answer in integer)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q52",
    "question_number": 52,
    "question_text": "An accelerator mounted to the waist of a seated tractor operator records an RMS  acceleration of 2.5 m.s-2. By improving the seat design, the vibration acceleration  level is decreased by 5 dB. After improvement, the RMS acceleration, in m.s-2, is  __________. (Rounded off to 3 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q53",
    "question_number": 53,
    "question_text": "A two-wheel drive tractor having a total weight of 20 kN is pulling an implement at  an actual speed of 3 km.h-1. The ratio of axle power (kW) to dynamic weight (kN) on  the rear axle is expressed as 1.79/V, where, V is the theoretical forward speed in   km.h-1. During pulling the implement, the weight distribution on the front and rear  axles of the tractor is 40 % and 60 % of the total weight, respectively, with wheel slip  12 % and coefficient of net traction 0.42. The tractive efficiency, in",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q54",
    "question_number": 54,
    "question_text": "A tractor drawn boom type sprayer fitted with 12 nozzles at a spacing of 50 cm is  used to carryout spraying at a forward speed of 3.5 km.h-1 and nozzle pressure of   250 kPa for an application rate of 1.5 m3.ha-1. Out of the total discharge from the  pump, 12 % is bypassed to the liquid tank and the total pressure drop in all pipe lines  from the pump is 10 % of the pressure developed by the pump. Considering the pump  efficiency as 60 %, if the nozzle pressure is increased by 10 %, the power r",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q55",
    "question_number": 55,
    "question_text": "A flow rate of 2 m3.s-1 is to be carried out in an open channel at a velocity of 1 m.s-1.  The cross section of the channel is rectangular with depth equal to one-half of the  width. Considering Manning\u2019s roughness coefficient (n) as 0.02, the slope of the  channel, in %, is __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q56",
    "question_number": 56,
    "question_text": "A catchment with 5 rain gauge stations recorded annual rainfall of 90, 100, 80, 120,  and 110 cm, respectively. Considering 5 % error in estimation of the mean annual  rainfall, additional number of rain gauge stations required is __________. (Answer in  integer)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q57",
    "question_number": 57,
    "question_text": "A soil sample of diameter 70 mm was used for constant head permeability test. The  observed head loss was 80 mm in the soil sample length of 100 mm and water  collected in one minute was 60 mL. The coefficient of permeability, in mm.s-1, is  __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q58",
    "question_number": 58,
    "question_text": "In an area, one tubewell of 15 cm diameter was operating such that groundwater table  is 40 m above the bottom of screen. The groundwater formation has permeability (K)  as 20 m.d-1 and well has radius of influence of 980 m with a maximum drawdown of  12 m. After some time, a second tubewell of same size was installed at a distance of  500 m from the first tubewell. If both the tubewells are running simultaneously and  have equal discharge, the loss of discharge in the first tubewell due to inst",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q59",
    "question_number": 59,
    "question_text": "In a semi-arid region with land slope of 3 %, contour bunding is planned to conserve  and store the rain water. In 10 years return period, the daily effective rainfall is  estimated as 20 cm maximum in the region. If the horizontal spacing between the  bunds is 30 m, the designed height of the bund, in m, is __________. (Rounded off to  2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q60",
    "question_number": 60,
    "question_text": "A single acting reciprocating pump, running at 40 rpm, has piston of 20 cm diameter  and stroke length of 40 cm. The suction and delivery heads are 5 m and 20 m,  respectively. Assuming overall pump efficiency as 80 %, the power requirement of  the pump, in kW, is __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q61",
    "question_number": 61,
    "question_text": "A steam jacketed kettle is filled with a 250 kg liquid food with a specific heat of   3.1 kJ.kg-1.K-1. Steam used at 121 \u00b0C has a heat transfer coefficient of 2 kW.m-2.K-1.  The area of heat transfer is 0.15 m2. Using lumped capacity method, the time required  to heat the product from 30 \u00b0C to 95 \u00b0C, in minutes, is __________. (Rounded off to  2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q62",
    "question_number": 62,
    "question_text": "Fruit juice entering at 30 \u00b0C is being pasteurized in a double pipe counter flow heat  exchanger using hot water entering at 97 \u00b0C and leaving at 65 \u00b0C. Specific heat of  juice and water are 3.8 kJ.kg-1.K-1 and 4.2 kJ.kg-1.K-1, respectively. Flow rate of juice  is 0.3 kg.s-1 and that of water is 0.4 kg.s-1. Considering an overall heat transfer  coefficient of 1 kW.m-2.K-1, the area of heat exchanger required, in m2, is  __________. (Rounded off to 3 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q63",
    "question_number": 63,
    "question_text": "Mango pulp at an initial temperature of 25 \u00b0C and a moisture content of 70 % (wb) is  to be dried into leather to a final moisture content of 10 % (wb) using hot air at   95 \u00b0C. The latent heat of vaporization of water at 95 \u00b0C and at standard atmospheric  pressure is 2250 kJ.kg-1. Considering the specific heat of mango pulp as   3.8 kJ.kg-1.\u00b0C-1, the energy required for drying per kg of mango pulp, in kJ, is  __________. (Rounded off to 1 decimal place)              Agricultural Engineering (AG",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q64",
    "question_number": 64,
    "question_text": "Sorghum flour obtained from a grinder was analyzed by IS sieves for particle size  determination. The data obtained are as follows:  IS sieve number  100  70  50  40  30  20  PAN  Mass of flour  retained (g)  0  10.1  16.5  36.2  82.8  95.0  9.4  The average particle size of the flour, in mm, is __________. (Rounded off to 3  decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ag-24-q65",
    "question_number": 65,
    "question_text": "Fish fillets at \u22121 \u00b0C are being frozen in Individual Quick Freezing (IQF) system using  air at \u221240 \u00b0C.  The product has a characteristic dimension of 10 cm with a density of  1200 kg.m-3. Thermal conductivity of the product is 2.5 W.m-2.K-1, the convective  heat transfer coefficient is 100 W.m-2.K-1 and the latent heat of fusion is 300 kJ.kg-1.  If the fillet is considered as an infinite plate, the freezing time, in minutes, is  __________. (Rounded off to 2 decimal places)",
    "exam_code": "GATE-AG",
    "subject": "Agricultural Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q1",
    "question_number": 1,
    "question_text": "If \u2018\u2192\u2019 denotes increasing order of intensity, then the meaning of the words   [dry \u2192 arid \u2192 parched] is analogous to [diet \u2192 fast \u2192 ________ ].  Which one of the given options is appropriate to fill the blank?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "starve",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "reject",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "feast",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "deny",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q2",
    "question_number": 2,
    "question_text": "If two distinct non-zero real variables \ud835\udc65 and \ud835\udc66 are such that (\ud835\udc65+ \ud835\udc66) is proportional  to (\ud835\udc65\u2212\ud835\udc66) then the value of   \ud835\udc65 \ud835\udc66",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "depends on \ud835\udc65\ud835\udc66",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "depends only on \ud835\udc65 and not on \ud835\udc66",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "depends only on \ud835\udc66 and not on \ud835\udc65",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "is a constant         Biotechnology (BT)  Page 2 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q3",
    "question_number": 3,
    "question_text": "Consider the following sample of numbers:   9, 18, 11, 14, 15, 17, 10, 69, 11, 13  The median of the sample is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "13.5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "11",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "18.7",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q4",
    "question_number": 4,
    "question_text": "The number of coins of \u20b91, \u20b95, and \u20b910 denominations that a person has are in the   ratio 5:3:13. Of the total amount, the percentage of money in \u20b95 coins is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "21%",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14 2 7%",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "10%",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "30%              Biotechnology (BT)  Page 3 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q5",
    "question_number": 5,
    "question_text": "For positive non-zero real variables \ud835\udc5d and \ud835\udc5e, if  log (\ud835\udc5d2 + \ud835\udc5e2) = log \ud835\udc5d+ log \ud835\udc5e+ 2 log 3 ,  then, the value of   \ud835\udc5d4+\ud835\udc5e4 \ud835\udc5d2\ud835\udc5e2  is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "79",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "81",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "9",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "83                                         Biotechnology (BT)  Page 4 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q6",
    "question_number": 6,
    "question_text": "In the given text, the blanks are numbered (i)\u2212(iv). Select the best match for all the  blanks.  Steve was advised to keep his head       (i)       before heading       (ii)       to bat;   for, while he had a head       (iii)       batting, he could only do so with a cool head   s       (iv)        his shoulders.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(i) down     (ii) down     (iii) on     (iv) for",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "(i) on     (ii) down     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "(i) down     (ii) out     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "(i) on     (ii) out     (iii) on    (iv) for                             Biotechnology (BT)  Page 5 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q7",
    "question_number": 7,
    "question_text": "A rectangular paper sheet of dimensions 54 cm \u00d7 4 cm is taken. The two longer  edges of the sheet are joined together to create a cylindrical tube. A cube whose  surface area is equal to the area of the sheet is also taken.   Then, the ratio of the volume of the cylindrical tube to the volume of the cube is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1/\u03c0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "2/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "3/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "4/\u03c0                                 Biotechnology (BT)  Page 6 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q8",
    "question_number": 8,
    "question_text": "The pie chart presents the percentage contribution of different macronutrients to a  typical 2,000 kcal diet of a person.     The typical energy density (kcal/g) of these macronutrients is given in the table.   Macronutrient  Energy density (kcal/g)  Carbohydrates  4  Proteins  4  Unsaturated fat  9  Saturated fat  9  Trans fat  9  The total fat (all three types), in grams, this person consumes is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "44.4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "77.8",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "100",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "3,600  Carbohydrates 35% Proteins 20% Unsaturated fat 20% Saturated fat 20% Trans  fat 5% Macronutrient energy contribution    Biotechnology (BT)  Page 7 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q9",
    "question_number": 9,
    "question_text": "A rectangular paper of 20 cm \u00d7 8 cm is folded 3 times. Each fold is made along the  line of symmetry, which is perpendicular to its long edge. The perimeter of the final  folded sheet (in cm) is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "18",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "24",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "20",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "21",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q10",
    "question_number": 10,
    "question_text": "The least number of squares to be added in the figure to make AB a line of   symmetry is",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "6",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "7           Biotechnology (BT)  Page 8 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q11",
    "question_number": 11,
    "question_text": "In adsorption chromatography, the adsorption of uncharged solute molecules onto  a silica-based stationary phase is by ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "covalent bonds",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "electrostatic interactions",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "ionic bonds",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "van der Waals forces",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q12",
    "question_number": 12,
    "question_text": "The transfer function of a process is \ud835\udc3a(\ud835\udc60) =  \ud835\udc3e\ud835\udc5d \uf074\ud835\udc5d \ud835\udc60+1, where \ud835\udc3e\ud835\udc5d is the gain and \uf074\ud835\udc5d is  the time constant. This is a ________ process.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "first order",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "multi-capacity",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "purely capacitive",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "second order                   Biotechnology (BT)  Page 9 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q13",
    "question_number": 13,
    "question_text": "Which one of the following statements is correct in the context of thermodynamics?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "In a closed system, neither mass nor energy is transferred across the system  boundary",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "In a closed system, both mass and energy can be transferred across the system  boundary",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The total energy of the system is the sum of kinetic and potential energies",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "In a closed system, only energy can be transferred across the system boundary and  not mass",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q14",
    "question_number": 14,
    "question_text": "Which one of the following statements is correct about Reynolds Number (\ud835\udc41\ud835\udc45\ud835\udc52) in  a stirred tank bioreactor?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc41\ud835\udc45\ud835\udc52 is independent of the viscosity of the medium",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "In laminar flow, mixing time increases with an increase in \ud835\udc41\ud835\udc45\ud835\udc52",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc41\ud835\udc45\ud835\udc52 is inversely proportional to the impeller speed",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "In turbulent flow, mixing time is independent of \ud835\udc41\ud835\udc45\ud835\udc52                     Biotechnology (BT)  Page 10 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q15",
    "question_number": 15,
    "question_text": "The relationship that involves the exchange of nutrients between two different  species for their mutual growth is called ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "antagonism",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "commensalism",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "parasitism",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "syntrophism",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q16",
    "question_number": 16,
    "question_text": "Mendel\u2019s \u2018law of segregation\u2019 applies to the segregation of ________ during  gamete formation.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "mitochondrial genes",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "alleles of a gene",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "linked genes on the same chromosome",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "unlinked genes on the same chromosome",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q17",
    "question_number": 17,
    "question_text": "Co-translational translocation of proteins is observed in ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "endoplasmic reticulum",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Golgi complex",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "mitochondria",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "peroxisomes     Biotechnology (BT)  Page 11 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q18",
    "question_number": 18,
    "question_text": "2-mercaptoethanol breaks the ________ covalent bond between light and heavy  chains of an immunoglobulin molecule.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "C-N",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "N-O",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "S-C",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "S-S",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q19",
    "question_number": 19,
    "question_text": "During normal embryonic development of the mice paw, elimination of cells from  the inter-digital space is due to ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "apoptosis",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "meiosis",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "mutagenesis",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "necrosis                         Biotechnology (BT)  Page 12 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q20",
    "question_number": 20,
    "question_text": "A cultured skin fibroblast cell of a goat \u2018P\u2019 was fused with an enucleated ovum of  a goat \u2018Q\u2019. The resultant activated early embryo was then transplanted into a  pseudopregnant (surrogate) female goat \u2018R\u2019 of the same strain as \u2018Q\u2019. On  completion of gestation, a female goat \u2018S\u2019 was born. With the exception of  mitochondrial DNA, \u2018S\u2019 is a clone of ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Only P",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Only Q",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Only R",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Both P and R",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q21",
    "question_number": 21,
    "question_text": "Which one of the following bacteriophages has a genome composed of single  stranded circular DNA?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\u00d8X174",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u03bb",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "T5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P1                     Biotechnology (BT)  Page 13 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q22",
    "question_number": 22,
    "question_text": "Which one of the following is an insect cell line?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "HEK 293",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Sf9",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "DH5\u03b1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "CHO",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q23",
    "question_number": 23,
    "question_text": "Which one of the following is the basic principle of Sanger\u2019s DNA sequencing  method?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Chain termination by incorporation of dideoxynucleotides",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Chain elongation by incorporation of dideoxynucleotides",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Release of inorganic pyrophosphate",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Chain cleavage by modification of dideoxynucleotides",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q24",
    "question_number": 24,
    "question_text": "An element that is present in a nucleotide but not in a nucleoside is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "carbon",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "nitrogen",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "oxygen",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "phosphorous     Biotechnology (BT)  Page 14 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q25",
    "question_number": 25,
    "question_text": "Krebs (TCA) cycle is ________ pathway.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "only an anabolic",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "only a catabolic",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "an amphibolic",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "a pyogenic",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q26",
    "question_number": 26,
    "question_text": "If a denatured protein of human origin is injected into a rabbit, antibodies generated  will recognize the ________ structure of the protein.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "primary",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "secondary",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "tertiary",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "quaternary",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q27",
    "question_number": 27,
    "question_text": "All pseudogenes DO NOT code for a ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "protein with original function",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "protein with altered function",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "RNA with coding sequence",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "RNA with regulatory function     Biotechnology (BT)  Page 15 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q28",
    "question_number": 28,
    "question_text": "A value of \ud835\udc58 for which the linear equations (\ud835\udc58\u22121)\ud835\udc65+ 3\ud835\udc66= 0 and 2\ud835\udc65+ \ud835\udc58\ud835\udc66= 0  have a non-zero solution is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "4",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q29",
    "question_number": 29,
    "question_text": "The value of the series 1+ sin \ud835\udc65+ cos2 \ud835\udc65+ sin3 \ud835\udc65+ \u22ef at \ud835\udc65= \ud835\udf0b 4 is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1 \u221a2+1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u221a2 \u221a2+1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "1 \u221a2\u22121",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\u221a2 \u221a2\u22121                      Biotechnology (BT)  Page 16 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q30",
    "question_number": 30,
    "question_text": "The solution of the differential equation  \ud835\udc51\ud835\udc66 \ud835\udc51\ud835\udc65= \ud835\udc66+ \ud835\udc52\u2212\ud835\udc65 that satisfies \ud835\udc66(0) = \u2212 1 2 is  ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\u2212 1 2 \ud835\udc52\u2212\ud835\udc65 2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u2212 1 2 \ud835\udc52\ud835\udc65",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\u2212 1 2 \ud835\udc52\u2212\ud835\udc65",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\u2212 1 2 \ud835\udc52 \ud835\udc65 2",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q31",
    "question_number": 31,
    "question_text": "The six faces of a cube (die) are numbered as 1, 2, 3, 4, 5 and 6, and it is rolled once.  An outcome is the observed number on the top face. If the probability of getting an  odd number as an outcome is twice that of an even number, then the probability of  getting a number less than 3 is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1 9    (B)  2 9",
        "is_correct": true
      },
      {
        "id": "opt_c",
        "text": "1 3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "4 9                  Biotechnology (BT)  Page 17 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q32",
    "question_number": 32,
    "question_text": "Let \ud835\udc42\ud835\udc45\u20d7\u20d7\u20d7\u20d7\u20d7  be the vector that is perpendicular to the vectors \ud835\udc42\ud835\udc43\u20d7\u20d7\u20d7\u20d7\u20d7 = 2\ud835\udc56\u0302 \u22123\ud835\udc57\u0302 + \ud835\udc58\u0302 and  \ud835\udc42\ud835\udc44\u20d7\u20d7\u20d7\u20d7\u20d7\u20d7 = \u22122\ud835\udc56\u0302 + \ud835\udc57\u0302 + \ud835\udc58\u0302. If the length of the vector \ud835\udc42\ud835\udc45\u20d7\u20d7\u20d7\u20d7\u20d7  is \ud835\udefc \u221a3, then \ud835\udefc is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "6",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q33",
    "question_number": 33,
    "question_text": "The degree of reduction (reductance) for oxalic acid (\ud835\udc362\ud835\udc3b2\ud835\udc424) is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q34",
    "question_number": 34,
    "question_text": "If the rate at which E. coli divides is 0.5 h-1, then its doubling time is ________ h.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q35",
    "question_number": 35,
    "question_text": "The decimal reduction time of a microbe during sterilization at 120 \uf0b0C with a first  order thermal death rate constant of 1 min-1 will be ________ min (rounded off to  1 decimal place).                         Biotechnology (BT)  Page 18 of 31  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q36",
    "question_number": 36,
    "question_text": "Match the disease (Column I) with its biological vector (Column II).  Column I  Column II  P. Chagas disease  1. Tsetse flies  Q. Trypanosomiasis  2. Mosquitoes  R. Leishmaniasis  3. Sandflies  S. Yellow Fever  4. Reduviid bugs",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-4; Q-1; R-3; S-2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2; Q-3; R-4; S-1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-1; Q-4; R-3; S-2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-3; Q-1; R-2; S-4                                        Biotechnology (BT)  Page 19 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q37",
    "question_number": 37,
    "question_text": "Match the industrial enzyme (Column I) with its application (Column II).  Column I  Column II  P. Lipase  1. Maltose syrup production  Q. Ficin  2. Oil degradation  R. Amylase   3. Oligosaccharide/monosaccharide production  S. Glucosidase  4. Meat tenderization",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-3; Q-4; R-2; S-1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2; Q-4; R-1; S-3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-2; Q-3; R-1; S-4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-1; Q-2; R-4; S-3                                          Biotechnology (BT)  Page 20 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q38",
    "question_number": 38,
    "question_text": "Match the enzyme (Column I) with its corresponding function (Column II).  Column I  Column II  P. Primase  1. RNA dependent RNA synthesis  Q. Reverse transcriptase  2. DNA dependent DNA synthesis  R.  RNA Replicase  3. RNA dependent DNA synthesis  S. DNA Polymerase III  4. DNA dependent RNA synthesis",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-4; Q-1; R-3; S-2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2; Q-1; R-3; S-4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-3; Q-4; R-2; S-1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-4; Q-3; R-1; S-2                             Biotechnology (BT)  Page 21 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q39",
    "question_number": 39,
    "question_text": "Match the item (Column I) with its corresponding use (Column II).  Column I  Column II  P. Glutamine  1. Detachment of adherent cells  Q. Trypsin  2. Selection of transfected mammalian cell lines  R.  Hypoxanthine  3. Source of carbon and nitrogen in animal cell  culture media  S. Neomycin  4. A component of medium for selection of  hybridoma in monoclonal antibody production",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-3; Q-1; R-4; S-2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-1; Q-2; R-4; S-3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-3; Q-1; R-2; S-4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-2; Q-3; R-1; S-4                           Biotechnology (BT)  Page 22 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q40",
    "question_number": 40,
    "question_text": "Match the chemical (Column I) with its use (Column II).  Column I  Column II  P. Diethylpyrocarbonate  1. Chelation of magnesium ion during  DNA purification  Q. Cesium chloride  2. Prevention of RNA degradation in  aqueous environment  R. Ethidium bromide  3. Separation of DNA by density gradient  centrifugation  S. Ethylenediaminetetraacetic acid  4. Staining of RNA in agarose gel",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-4; Q-1; R-3; S-2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-4; Q-3; R-2; S-1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-2; Q-1; R-4; S-3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-2; Q-3; R-4; S-1                           Biotechnology (BT)  Page 23 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q41",
    "question_number": 41,
    "question_text": "Match the item in Column I with the corresponding technique in Column II.  Column I  Column II  P. Blue laser  1. Electron microscopy  Q. Tungsten filament  2. Fluorescence activated cell sorting  R. 15N labelled protein  3. Electrophoresis  S. Polyacrylamide  4. Nuclear magnetic resonance spectroscopy",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-2; Q-3; R-1; S-4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-2; Q-1; R-4; S-3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-3; Q-1; R-4; S-2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-1; Q-2; R-4; S-3                             Biotechnology (BT)  Page 24 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q42",
    "question_number": 42,
    "question_text": "Match the genetic disorder (Column I) with its molecular basis (Column II)  Column I  Column II  P. Sickle-cell anemia  1. Mutation in nucleotide excision repair  Q. Xeroderma pigmentosum  2. Trisomy of chromosome 21  R. Tay-Sachs disease  3. Mutation in \u03b2-globin gene  S. Down Syndrome  4. Mutation in hexosaminidase A gene",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P-1; Q-4; R-2; S-3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P-3; Q-4; R-1; S-2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P-3; Q-1; R-4; S-2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P-4; Q-2; R-3; S-1",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q43",
    "question_number": 43,
    "question_text": "The evolution of wings in bats and insects is an example of ________ evolution.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "convergent",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "divergent",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "neutral",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "parallel          Biotechnology (BT)  Page 25 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q44",
    "question_number": 44,
    "question_text": "Which of the following statements is/are correct about an uncompetitive inhibitor  of an enzyme?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "It binds to the substrate binding site of the enzyme only",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "It binds to the enzyme-substrate complex only",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "It reduces the Vmax of the enzyme",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "It binds to both free enzyme and enzyme-substrate complex",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q45",
    "question_number": 45,
    "question_text": "Which of the following plant-based secondary metabolites belong(s) to the class  of alkaloids?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Ajmalicine (C21H24N2O3)",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Azadirachtin (C35H44O16)",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Camptothecin (C20H16N2O4)",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Vinblastine (C46H58N4O9)",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q46",
    "question_number": 46,
    "question_text": "Which of the following features help(s) in distinguishing alleles using restriction  fragment length polymorphism (RFLP)?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Differences in the number of recognition sites for a given restriction enzyme",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Differences in the ability of alleles to undergo recombination",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Differences in the ability of alleles to undergo segregation",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Differences in the number of tandem repeats     Biotechnology (BT)  Page 26 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q47",
    "question_number": 47,
    "question_text": "Which of the following is/are considered as biotic elicitor(s) in plant cell culture?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Cellulase",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Chitin",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Chitosan",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Mercuric chloride",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q48",
    "question_number": 48,
    "question_text": "Under which of the following conditions, a mammalian somatic cell fails to  undergo mitosis during cell cycle?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Initiation of cell plate formation",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Incomplete DNA replication",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Chiasmata formation",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Irreparable DNA damage",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q49",
    "question_number": 49,
    "question_text": "Which of the following is/are synthetic auxin(s) that does/do NOT occur naturally?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "2,4-Dichlorophenoxyacetic acid",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Indole-3-acetic acid",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Indole-3-butyric acid",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "1-Naphthaleneacetic acid     Biotechnology (BT)  Page 27 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q50",
    "question_number": 50,
    "question_text": "Which of the following statements regarding the below mentioned mRNA  sequence is/are TRUE?  5`-UGAUGAGCCUUAACCGGGAACGAAUUUAAG-3`",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "It contains nine codons in the reading frame",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "It contains ten codons in the reading frame",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "It codes for eight amino acids",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "It codes for nine amino acids",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q51",
    "question_number": 51,
    "question_text": "Which  of  the  following  conditions  induce(s)  the  expression  of   \u03b2-galactosidase gene in the lac operon?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Absence of glucose",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Absence of lactose",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Presence of glucose",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Presence of lactose                     Biotechnology (BT)  Page 28 of 31  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q52",
    "question_number": 52,
    "question_text": "Which of the following factors can affect the growth of a microbial culture in a  batch cultivation process?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "pH of the medium",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Osmolarity of the medium",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Substrate concentration in the medium",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Substrate feed rate",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q53",
    "question_number": 53,
    "question_text": "Under complete cell washout condition in a chemostat with sterile feed, which of  the following statements is/are correct?",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Biomass concentration in the reactor is maximum",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Substrate concentration in the exit stream is less than that in the inlet stream",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Substrate concentration in the exit stream is equal to that in the inlet stream",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Substrate concentration in the exit stream is zero",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q54",
    "question_number": 54,
    "question_text": "Fermentation medium is cooled from 121 \uf0b0C to 30 \uf0b0C in a double pipe heat  exchanger. If cold water is flowing in the counter-current direction and is heated  from 10 \uf0b0C to 70 \uf0b0C, then the Log-Mean Temperature Difference (LMTD) is  ________ \uf0b0C (rounded off to the nearest integer).               Biotechnology (BT)  Page 29 of 31  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q55",
    "question_number": 55,
    "question_text": "Aspergillus niger is grown in a 10,000 L stirred batch bioreactor under aerated  conditions to produce citric acid. At steady state oxygen transfer conditions, the  specific oxygen uptake rate of the organism and the volumetric mass transfer  coefficient are 1\u00d710-4  \ud835\udc54 \ud835\udc5c\ud835\udc65\ud835\udc66\ud835\udc54\ud835\udc52\ud835\udc5b \ud835\udc50\ud835\udc5c\ud835\udc5b\ud835\udc60\ud835\udc62\ud835\udc5a\ud835\udc52\ud835\udc51 \ud835\udc54 \ud835\udc4f\ud835\udc56\ud835\udc5c\ud835\udc5a\ud835\udc4e\ud835\udc60\ud835\udc60  s-1 and 60 min-1, respectively.   If the oxygen solubility is 8\u00d710-3 kg m-3 under the operating conditions, based  only on oxygen dynamics, the maximum possible cell concentration is  ________kg m-3 (Answ",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q56",
    "question_number": 56,
    "question_text": "Ethanol is produced in a 10,000 L stirred bioreactor using an impeller of diameter  1 m. The density and viscosity of fermentation broth are 1000 kg m-3 and 1 cp,  respectively. The data relating the Power number and Impeller Reynolds number  is given below:  Reynolds number  1-5  5-500  > 105  Power number  70  10  5  Using the above data, the power required for the stirrer to operate at 300 rpm is  ________ kW (Answer in integer).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q57",
    "question_number": 57,
    "question_text": "The free energy change of ATP hydrolysis at 25 \uf0b0C is -32.2 kJ mol-1. The free  energy change for hydrolysis of \u03b1-glycerophosphate to glycerol is -8.2 kJ mol-1 at  25 \uf0b0C. Using the above information, the free energy change for the formation of     \u03b1-glycerophosphate from glycerol and ATP is ________ kJ mol-1 (Answer in  integer).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q58",
    "question_number": 58,
    "question_text": "E. coli is inoculated in a shake flask containing nutrient rich medium. The initial  number of viable cells in the medium is 102. After few hours, the number of viable  cells is 106. Assuming cell divides by binary fission, the number of generations  that have taken place is ________ (rounded off to the nearest integer).         Biotechnology (BT)  Page 30 of 31  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q59",
    "question_number": 59,
    "question_text": "A fermentor is filled with medium at a rate of 1 L min-1. A leak develops at  the bottom of the fermentor when the medium in the fermentor reaches 200 L.   The rate of medium leakage is 2\ud835\udc61 L min-1, where \u2018\ud835\udc61\u2019 is the time at which the  leak begins.   The volume of medium in the fermentor after 10 min of leakage is ________ L  (Answer in integer).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q60",
    "question_number": 60,
    "question_text": "A fed batch process is running at quasi-steady state with respect to substrate and  biomass concentration. At 2 h, the culture volume is 500 L with a constant sterile  inlet feed at 50 L h-1 of glucose. The culture kinetic parameters \u00b5\ud835\udc5aand \ud835\udc3e\ud835\udc46 are           0.2 h-1 and 0.1 g L-1, respectively.   The substrate concentration in the reactor will be ________ g L-1 (rounded off to  one decimal place).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q61",
    "question_number": 61,
    "question_text": "Consider scale-up of fungal fermentation from a 20 L model-type to 20,000 L  prototype stirred tank reactor. The model-type and prototype have the same   aspect ratio during scale-up. The impeller speed in the model-type is 500 rpm   and the scale-up criterion is constant shear.  The impeller speed in the prototype reactor will be ________ rpm (Answer in  integer).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q62",
    "question_number": 62,
    "question_text": "If \ud835\udc63 = ( 2 2 2 ) is an eigenvector of the matrix ( 1 2 3 1 2 3 1 2 3 ) corresponding to the     non-zero eigenvalue, \ud835\udf06, then the value of \ud835\udf06 is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q63",
    "question_number": 63,
    "question_text": "The value of the limit lim \ud835\udc65\u2192\u221e  \ud835\udc65 2 ln(1 + 2024 \ud835\udc65) is ________.         Biotechnology (BT)  Page 31 of 31  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q64",
    "question_number": 64,
    "question_text": "Let \ud835\udc66(\ud835\udc65) = \ud835\udc652 ln \ud835\udc65 for \ud835\udc65> 0, be a solution of \ud835\udc652 \ud835\udc512\ud835\udc66 \ud835\udc51\ud835\udc652 + 4\ud835\udc66= \ud835\udefc\ud835\udc65 \ud835\udc51\ud835\udc66 \ud835\udc51\ud835\udc65. Then the value  of \ud835\udefc is ________.",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bt-24-q65",
    "question_number": 65,
    "question_text": "The absolute relative error in evaluating the integral \u222b\ud835\udc652\ud835\udc51\ud835\udc65 1 0  by the trapezoidal rule  with the step size 0.25 is ________ % (rounded off to 2 decimal places).",
    "exam_code": "GATE-BT",
    "subject": "Biotechnology",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q1",
    "question_number": 1,
    "question_text": "If \u2018\u2192\u2019 denotes increasing order of intensity, then the meaning of the words   [dry \u2192 arid \u2192 parched] is analogous to [diet \u2192 fast \u2192 ________ ].  Which one of the given options is appropriate to fill the blank?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "starve",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "reject",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "feast",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "deny",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q2",
    "question_number": 2,
    "question_text": "If two distinct non-zero real variables \ud835\udc65 and \ud835\udc66 are such that (\ud835\udc65+ \ud835\udc66) is proportional  to (\ud835\udc65\u2212\ud835\udc66) then the value of   \ud835\udc65 \ud835\udc66",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "depends on \ud835\udc65\ud835\udc66",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "depends only on \ud835\udc65 and not on \ud835\udc66",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "depends only on \ud835\udc66 and not on \ud835\udc65",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "is a constant                             Aerospace Engineering (AE)  Page 2 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q3",
    "question_number": 3,
    "question_text": "Consider the following sample of numbers:   9, 18, 11, 14, 15, 17, 10, 69, 11, 13  The median of the sample is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "13.5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "11",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "18.7",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q4",
    "question_number": 4,
    "question_text": "The number of coins of \u20b91, \u20b95, and \u20b910 denominations that a person has are in the   ratio 5:3:13. Of the total amount, the percentage of money in \u20b95 coins is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "21%",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14 2 7%",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "10%",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "30%                                  Aerospace Engineering (AE)  Page 3 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q5",
    "question_number": 5,
    "question_text": "For positive non-zero real variables \ud835\udc5d and \ud835\udc5e, if  log (\ud835\udc5d2 + \ud835\udc5e2) = log \ud835\udc5d+ log \ud835\udc5e+ 2 log 3 ,  then, the value of   \ud835\udc5d4+\ud835\udc5e4 \ud835\udc5d2\ud835\udc5e2  is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "79",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "81",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "9",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "83                                                             Aerospace Engineering (AE)  Page 4 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q6",
    "question_number": 6,
    "question_text": "In the given text, the blanks are numbered (i)\u2212(iv). Select the best match for all the  blanks.  Steve was advised to keep his head       (i)       before heading       (ii)       to bat;   for, while he had a head       (iii)       batting, he could only do so with a cool head   s       (iv)        his shoulders.",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(i) down     (ii) down     (iii) on     (iv) for",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "(i) on     (ii) down     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "(i) down     (ii) out     (iii) for     (iv) on",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "(i) on     (ii) out     (iii) on    (iv) for                                                 Aerospace Engineering (AE)  Page 5 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q7",
    "question_number": 7,
    "question_text": "A rectangular paper sheet of dimensions 54 cm \u00d7 4 cm is taken. The two longer  edges of the sheet are joined together to create a cylindrical tube. A cube whose  surface area is equal to the area of the sheet is also taken.   Then, the ratio of the volume of the cylindrical tube to the volume of the cube is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1/\u03c0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "2/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "3/\u03c0",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "4/\u03c0                                                     Aerospace Engineering (AE)  Page 6 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q8",
    "question_number": 8,
    "question_text": "The pie chart presents the percentage contribution of different macronutrients to a  typical 2,000 kcal diet of a person.     The typical energy density (kcal/g) of these macronutrients is given in the table.   Macronutrient  Energy density (kcal/g)  Carbohydrates  4  Proteins  4  Unsaturated fat  9  Saturated fat  9  Trans fat  9  The total fat (all three types), in grams, this person consumes is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "44.4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "77.8",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "100",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "3,600  Carbohydrates 35% Proteins 20% Unsaturated fat 20% Saturated fat 20% Trans  fat 5% Macronutrient energy contribution                        Aerospace Engineering (AE)  Page 7 of 40  Organizing ",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q9",
    "question_number": 9,
    "question_text": "A rectangular paper of 20 cm \u00d7 8 cm is folded 3 times. Each fold is made along the  line of symmetry, which is perpendicular to its long edge. The perimeter of the final  folded sheet (in cm) is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "18",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "24",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "20",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "21",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q10",
    "question_number": 10,
    "question_text": "The least number of squares to be added in the figure to make AB a line of   symmetry is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "6",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "7                               Aerospace Engineering (AE)  Page 8 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q11",
    "question_number": 11,
    "question_text": "The following system of linear equations  7\ud835\udc65\u22123\ud835\udc66+ \ud835\udc67= 0 3\ud835\udc65\u2212\ud835\udc66+ \ud835\udc67= 0 \ud835\udc65\u2212\ud835\udc66\u2212\ud835\udc67= 0   has:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "infinitely many solutions",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "a unique solution",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "no solution",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "three solutions                                                     Aerospace Engineering (AE)  Page 9 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q12",
    "question_number": 12,
    "question_text": "The acceleration of a body travelling in a straight line is given by \ud835\udc4e= \u2212\ud835\udc361 \u2212\ud835\udc362\ud835\udc632  where \ud835\udc63 is the velocity, and \ud835\udc361, \ud835\udc362 are positive constants. Starting with an initial  positive velocity \ud835\udc63\ud835\udc5c, the distance travelled by the body before coming to rest for the  first time is:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1 2\ud835\udc362 ln (1 + \ud835\udc362 \ud835\udc361 \ud835\udc63\ud835\udc5c 2)",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1 2\ud835\udc362 ln (1 \u2212\ud835\udc362 \ud835\udc361 \ud835\udc63\ud835\udc5c 2)",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "1 2\ud835\udc362 ln(\ud835\udc361 + \ud835\udc362\ud835\udc63\ud835\udc5c 2)",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "1 2\ud835\udc362 ln(1 + \ud835\udc362\ud835\udc63\ud835\udc5c 2)                                                     Aerospace Engineering (AE)  Page 10 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q13",
    "question_number": 13,
    "question_text": "The three-dimensional stress-strain relationship for an isotropic material is given as  {         \ud835\udf0e\ud835\udc65\ud835\udc65 \ud835\udf0e\ud835\udc66\ud835\udc66 \ud835\udf0e\ud835\udc67\ud835\udc67 \ud835\udf0f\ud835\udc66\ud835\udc67 \ud835\udf0f\ud835\udc65\ud835\udc67 \ud835\udf0f\ud835\udc65\ud835\udc66}         = [          \ud835\udc43 \ud835\udc44 \ud835\udc44 \ud835\udc44 \ud835\udc43 \ud835\udc44 \ud835\udc44 \ud835\udc44 \ud835\udc43 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 \ud835\udc45 0 0 0 \ud835\udc45 0 0 0 \ud835\udc45]           {         \ud835\udf00\ud835\udc65\ud835\udc65 \ud835\udf00\ud835\udc66\ud835\udc66 \ud835\udf00\ud835\udc67\ud835\udc67 \ud835\udefe\ud835\udc66\ud835\udc67 \ud835\udefe\ud835\udc65\ud835\udc67 \ud835\udefe\ud835\udc65\ud835\udc66}           where, P, Q and R are the three elastic constants, \ud835\udf0e and \ud835\udf0f represent normal and shear  stresses and \ud835\udf00 and \ud835\udefe represent normal and engineering shear strains. Which one of  the following options is correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc45= \ud835\udc43\u2212\ud835\udc44 2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udc45= \ud835\udc44\u2212\ud835\udc43 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc44= \ud835\udc43\u2212\ud835\udc45 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc44= \ud835\udc45\u2212\ud835\udc43 2                                              Aerospace Engineering (AE)  Page 11 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q14",
    "question_number": 14,
    "question_text": "Consider the free vibration responses P, Q, R and S (shown in the figure) of a single  degree of freedom spring-mass-damper system with the same initial conditions. For  the different damping cases listed below, which one of the following options is  correct?  1. Overdamped  2. Underdamped  3. Critically damped  4. Undamped",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 1, Q \u2013 4, R \u2013 2, S \u2013 3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 1, Q \u2013 2, R \u2013 4, S \u2013 3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 3, Q \u2013 4, R \u2013 2, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 3, Q \u2013 2, R \u2013 4, S \u2013 1                                       Aerospace Engineering (AE)  Page 12 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q15",
    "question_number": 15,
    "question_text": "For a single degree of freedom spring-mass-damper system subjected to harmonic  forcing, the part of the motion (response) that decays due to damping is known as:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "transient response",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "steady-state response",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "harmonic response",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "non-transient response",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q16",
    "question_number": 16,
    "question_text": "For an ideal gas, the specific heat at constant pressure is 1147 J/kg K and the ratio  of specific heats is equal to 1.33. What is the value of the gas constant for this gas  in J/kg K?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "284.6",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1005",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "862.4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "8314                                     Aerospace Engineering (AE)  Page 13 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q17",
    "question_number": 17,
    "question_text": "A surrogate liquid hydrocarbon fuel, approximated as C10H12, is being burned in a  land-based gas turbine combustor with dry air (79% N2 and 21% O2 by volume).  How many moles of dry air are required for the stoichiometric combustion of the  surrogate fuel with dry air at atmospheric temperature and pressure?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "61.9",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "30.95",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "13",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "10                                                         Aerospace Engineering (AE)  Page 14 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q18",
    "question_number": 18,
    "question_text": "In the figure shown below, various thermodynamics processes for an ideal gas are  represented. Match each curve with the process that it best represents.",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "aa\u2019 \u2013 Isentropic; bb\u2019 \u2013 Isothermal; cc\u2019 \u2013 Isobaric; dd\u2019 \u2013 Isochoric",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "aa\u2019 \u2013 Isothermal; bb\u2019 \u2013 Isentropic; cc\u2019 \u2013 Isochoric; dd\u2019 \u2013 Isobaric",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "aa\u2019 \u2013 Isothermal; bb\u2019 \u2013 Isentropic; cc\u2019 \u2013 Isobaric; dd\u2019 \u2013 Isochoric",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "aa\u2019 \u2013 Isothermal; bb\u2019 \u2013 Isobaric; cc\u2019 \u2013 Isentropic; dd\u2019 \u2013 Isochoric                                                 Aerospace Engineering (AE)  Page 15 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q19",
    "question_number": 19,
    "question_text": "In an airbreathing gas turbine engine, the combustor inlet temperature is 600 K. The  heating value of the fuel is 43.4 \u00d7 106 J/kg. Assume Cp to be 1100 J/kg K for air and  burned gases, and fuel-air ratio f << 1.0. Neglect kinetic energy at the inlet and exit  of the combustor and assume 100% burner efficiency. What is the fuel-air ratio  required to achieve 1300 K temperature at the combustor exit?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0.0177",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "0.0215",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "0.0127",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "0.0277                                                       Aerospace Engineering (AE)  Page 16 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q20",
    "question_number": 20,
    "question_text": "Which one of the following figures represents the drag polar of a general aviation  aircraft?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(B)",
        "is_correct": true
      },
      {
        "id": "opt_c",
        "text": "(D)                                   Aerospace Engineering (AE)  Page 17 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q21",
    "question_number": 21,
    "question_text": "In the context of steady, inviscid, incompressible flows, consider the superposition  of a uniform flow with speed U along the positive x-axis (from left to right), and a  source of strength \u039b located at the origin. Which one of the following statements is  NOT true regarding the location of the stagnation point of the resulting flow?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "It is located to the left of the origin",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "It moves closer to the origin for increasing \u039b, while U is held constant",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "It moves closer to the origin for increasing U, while \u039b is held constant",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "It is located along the x-axis",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q22",
    "question_number": 22,
    "question_text": "On Day 1, an aircraft flies with a speed of  \ud835\udc491 m/s at an altitude where the  temperature is T1 K. On Day 2, the same aircraft flies with a speed of \u221a1.2 \ud835\udc491 m/s  at an altitude where the temperature is 1.2 T1  K. How does the Mach number M2 on  Day 2 compare with the Mach number M1 on Day 1?   Assume ideal gas behavior for air. Also assume the ratio of specific heats and  molecular weight of air to be the same on both the days.",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "M2 = 0.6 M1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "M2 = M1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "M2 =  1 \u221a1.2 M1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "M2 = \u221a1.2 M1                               Aerospace Engineering (AE)  Page 18 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q23",
    "question_number": 23,
    "question_text": "Consider a steady, isentropic, supersonic flow (Mach number M > 1) entering a  Convergent-Divergent (CD) duct as shown in the figure. Which one of the  following options correctly describes the flow at the throat?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Can only be supersonic",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Can only be sonic",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Can either be sonic or supersonic",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Can only be subsonic                                                   Aerospace Engineering (AE)  Page 19 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q24",
    "question_number": 24,
    "question_text": "Consider steady, incompressible, inviscid flow past two airfoils shown in the figure.  The coefficient of pressure at the trailing edge of the airfoil with finite angle, shown  in figure (I), is \ud835\udc36\ud835\udc43\ud835\udc3c while that at the trailing edge of the airfoil with cusp, shown in  figure (II), is \ud835\udc36\ud835\udc43\ud835\udc3c\ud835\udc3c. Which one of the following options is TRUE?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc36\ud835\udc43\ud835\udc3c< 1,   \ud835\udc36\ud835\udc43\ud835\udc3c\ud835\udc3c< 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udc36\ud835\udc43\ud835\udc3c= 1,   \ud835\udc36\ud835\udc43\ud835\udc3c\ud835\udc3c= 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc36\ud835\udc43\ud835\udc3c= 1,   \ud835\udc36\ud835\udc43\ud835\udc3c\ud835\udc3c< 1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc36\ud835\udc43\ud835\udc3c< 1,   \ud835\udc36\ud835\udc43\ud835\udc3c\ud835\udc3c= 1                                                     Aerospace Engineering (AE)  Page 20 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q25",
    "question_number": 25,
    "question_text": "Which of the following options is/are correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The stress-strain graph for a nonlinear elastic material is   as shown in the figure",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Material properties are independent of position in a homogeneous material",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "An isotropic material has infinitely many planes of material symmetry",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The stress-strain graph for a linear elastic material is                                                   Aerospace Engineering (AE)  Page 21 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q26",
    "question_number": 26,
    "question_text": "Which of the following statements is/are correct about a satellite moving in a  geostationary orbit?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The orbit lies in the equatorial plane",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The orbit is circular about the center of the Earth",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The time period of motion is 90 minutes",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The satellite is visible from all parts of the Earth",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q27",
    "question_number": 27,
    "question_text": "In a conventional configuration airplane, the rudder can be used:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "to overcome adverse yaw during a turning maneuver",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "to overcome yawing moment due to failure of one engine in a multi engine airplane",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "for landing the airplane in crosswind conditions",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "for enhancing longitudinal stability                                     Aerospace Engineering (AE)  Page 22 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q28",
    "question_number": 28,
    "question_text": "Which of the following statements about a general aviation aircraft, while operating  at point Q in the V-n diagram, is/are true?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The aircraft has the highest turn rate",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The aircraft has the smallest turn radius",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The aircraft is flying with minimum drag",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The aircraft is operating at \ud835\udc36\ud835\udc3f,\ud835\udc5a\ud835\udc4e\ud835\udc65",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q29",
    "question_number": 29,
    "question_text": "Two fair dice with numbered faces are rolled together. The faces are numbered from  1 to 6. The probability of getting odd numbers on both the dice is  ________________ (rounded off to 2 decimal places).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q30",
    "question_number": 30,
    "question_text": "A particle acted upon by a constant force 4\ud835\udc56\u0302 + \ud835\udc57\u0302 \u22123\ud835\udc58\u0302 N is displaced from point A  with position vector \ud835\udc56\u0302 + 2\ud835\udc57\u0302 + 3\ud835\udc58\u0302 m to point B with position vector 5\ud835\udc56\u0302 + 4\ud835\udc57\u0302 + \ud835\udc58\u0302 m.  The work done by this force is _______ J (answer in integer).                             Aerospace Engineering (AE)  Page 23 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q31",
    "question_number": 31,
    "question_text": "Using Trapezoidal rule with one interval, the approximate value of the definite  integral:  \u222b \ud835\udc51\ud835\udc65 1 + \ud835\udc652 2 1 = ______  (rounded off to 2 decimal places).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q32",
    "question_number": 32,
    "question_text": "A material has Poisson\u2019s ratio \ud835\udf08= 0.5 and Young\u2019s modulus E=2500 MPa. The  percentage change in its volume when subjected to a hydrostatic stress of magnitude  10 MPa is ______ (answer in integer).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q33",
    "question_number": 33,
    "question_text": "An airplane experiences a net vertical ground reaction of 15000 N during landing.  The weight of the airplane is 10000 N. The landing vertical load factor, defined as  the ratio of inertial load to the weight of the aircraft, is __________ (rounded off to  1 decimal place).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q34",
    "question_number": 34,
    "question_text": "An aircraft with a turbojet engine is flying with 250 m/s speed at an altitude,  where the density of air is 1 kg/m3. The inlet area of the engine is 1 m2. The  average velocity of the exhaust gases at the exit of the nozzle, with respect to  aircraft, is 550 m/s. Assume the engine exit pressure is equal to the ambient  pressure and the fuel-air ratio is negligible. The uninstalled thrust produced   by the engine at these conditions is _________ N   (rounded off to the nearest integer).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q35",
    "question_number": 35,
    "question_text": "Using thin airfoil theory, the lift coefficient of a NACA 0012 airfoil placed at 5o  angle of attack in a uniform flow is _____________ (rounded off to 2 decimal  places).                                 Aerospace Engineering (AE)  Page 24 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q36",
    "question_number": 36,
    "question_text": "Given \ud835\udc66= \ud835\udc52\ud835\udc5d\ud835\udc65sin \ud835\udc5e\ud835\udc65, where \ud835\udc5d and \ud835\udc5e are non-zero real numbers, the value of  the differential expression   \ud835\udc512\ud835\udc66 \ud835\udc51\ud835\udc652 \u22122\ud835\udc5d\ud835\udc51\ud835\udc66 \ud835\udc51\ud835\udc65+ (\ud835\udc5d2 + \ud835\udc5e2)\ud835\udc66  is",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc5d2 + \ud835\udc5e2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc5d\ud835\udc5e                                                 Aerospace Engineering (AE)  Page 25 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q37",
    "question_number": 37,
    "question_text": "The volume of the solid formed by a complete rotation of the shaded portion of the  circle of radius R about the y-axis is \ud835\udc58\ud835\udf0bR3. The value of \ud835\udc58 is:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "5 12",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "5 24",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "7 12",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "7 24                                         Aerospace Engineering (AE)  Page 26 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q38",
    "question_number": 38,
    "question_text": "As per the International Standard Atmosphere model, which one of the following  options about density variation with increase in altitude in the isothermal layer is  correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "remains constant",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "increases linearly",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "decreases linearly",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "decreases exponentially",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q39",
    "question_number": 39,
    "question_text": "At a point in the trajectory of an unpowered space vehicle moving about the Earth,  the altitude above the mean sea level is 600 km, and the speed with reference to a  coordinate system fixed to the center of mass of the Earth is 9 km/s. Assume that  the Earth is a sphere with a radius 6400 km and \ud835\udc3a\ud835\udc40\ud835\udc38\ud835\udc4e\ud835\udc5f\ud835\udc61\u210e= 3.98 \u00d7 1014 m3/s2,  where, G is the universal gravitational constant and \ud835\udc40\ud835\udc38\ud835\udc4e\ud835\udc5f\ud835\udc61\u210e is mass of the Earth.  The trajectory is:",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Circular",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Elliptic",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Parabolic",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Hyperbolic                                 Aerospace Engineering (AE)  Page 27 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q40",
    "question_number": 40,
    "question_text": "A multistage axial compressor, with overall isentropic efficiency of 0.83, is used to  compress air at a stagnation temperature of 300 K through a pressure ratio of 10:1.   Each stage of the compressor is similar, and the stagnation temperature rise across  each compressor stage is 20 K. Assume Cp = 1005 J/kg K and \uf067 = 1.4 for air. How  many stages are there in the compressor?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "17",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "13",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "19",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "11",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q41",
    "question_number": 41,
    "question_text": "An aircraft with a turbojet engine is flying at 250 m/s. The uninstalled thrust  produced by the engine is 60000 N. The heating value of the fuel is 44 \u00d7 106 J/kg.  The engine has a thermal efficiency of 35% while burning the fuel at a rate of  3 kg/s. Assume the engine exit pressure to be equal to the ambient pressure. What  is the propulsion efficiency of the engine under these conditions (in percentage)?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "32.5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "35.0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "11.4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "92.4                               Aerospace Engineering (AE)  Page 28 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q42",
    "question_number": 42,
    "question_text": "Consider a flat plate, with a sharp leading edge, placed in a uniform flow of speed  U. The direction of the free-stream flow is aligned with the plate. Assume that the  flow is steady, incompressible and laminar. The thickness of the boundary layer at  a fixed stream-wise location L from the leading edge of the plate is \u03b4. Which one of  the following correctly describes the variation of \u03b4 with U?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\u03b4 \u221d U",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u03b4 \u221d U 3/2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\u03b4 \u221d U 1/2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\u03b4 \u221d U \u22121/2                                                       Aerospace Engineering (AE)  Page 29 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q43",
    "question_number": 43,
    "question_text": "Shock structures for flow at three different Mach numbers over a given wedge are  shown in the figure below. Assuming that only the weak shock solutions are  possible for the attached oblique shocks, which one of the following options is  TRUE?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "M1 < M2 < M3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "M1 > M2 > M3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "M1 < M3< M2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "M3 < M1 < M2                                             Aerospace Engineering (AE)  Page 30 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q44",
    "question_number": 44,
    "question_text": "Air flowing at Mach number M = 2 from left to right accelerates to M = 3 across an  expansion corner as shown in the figure. What is the value of \ud835\udeff (the angle between  the Forward and Rearward Mach lines) in degrees?  The values of the Prandtl-Meyer functions are \ud835\udf08(3) = 49.76o and \ud835\udf08(2) = 26.38o.",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "23.38",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "19.47",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "53.38",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "33.91                                             Aerospace Engineering (AE)  Page 31 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q45",
    "question_number": 45,
    "question_text": "Consider the function   \ud835\udc53(\ud835\udc65) = {\ud835\udc652       for     \ud835\udc65< 0 \ud835\udc65         for     \ud835\udc65\u22650  where x is real. Which of the following statements is/are correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The function is continuous for all x",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The derivative of the function is discontinuous at x = 0",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The derivative of the function is continuous at x = 1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The function is discontinuous at x = 0                                                     Aerospace Engineering (AE)  Page 32 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q46",
    "question_number": 46,
    "question_text": "The figure shows plots of two yield loci for an isotropic material, where \ud835\udf0e\ud835\udc3c and \ud835\udf0e\ud835\udc3c\ud835\udc3c  are the principal stresses, and \ud835\udf0e\ud835\udc4c is the yield stress in uniaxial tension. Which of the  following statements is/are correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Criterion P represents the von Mises criterion",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Criterion Q represents the Tresca criterion",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Criterion P represents the Tresca criterion",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Criterion Q represents the von Mises criterion                                             Aerospace Engineering (AE)  Page 33 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q47",
    "question_number": 47,
    "question_text": "Which of the following statements about absolute ceiling and service ceiling for a  piston-propeller aircraft is/are correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The altitude corresponding to absolute ceiling is higher than that for service ceiling",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "At the absolute ceiling, the power required for cruise equals the maximum power  available",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The altitude corresponding to absolute ceiling is lower than that for service ceiling",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "At the service ceiling, the maximum rate of climb is 50 ft/min                                                           Aerospace Engineering (AE)  Page 34 of 40  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q48",
    "question_number": 48,
    "question_text": "For an airplane having directional / weathercock static stability, which of the  following options is/are correct?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The airplane when disturbed in yaw, from an equilibrium state, will experience a  restoring moment",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The variation of yawing moment coefficient (\ud835\udc36\ud835\udc5b) with  sideslip angle (\u03b2) for the airplane will look like",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The airplane will always tend to point into the relative wind",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The airplane when disturbed in yaw will return to equilibrium state in a finite  amount of time after removing the disturbance",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q49",
    "question_number": 49,
    "question_text": "Which of the following statements is/are TRUE for an axial turbine?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "For a fixed rotational speed, the mass flow rate increases with increase in the flow  coefficient",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The absolute stagnation enthalpy of the flow decreases across the nozzle row",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The relative stagnation enthalpy remains unchanged through the rotor",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "For a fixed rotational speed, the mass flow rate remains unchanged with a change  in the flow coefficient                             Aerospace Engineering (AE)  Page 35 of 40  Organizing Institute: I",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q50",
    "question_number": 50,
    "question_text": "Which of the following statements is/are TRUE for a single stage axial compressor?",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Starting from design condition and keeping the mass flow rate constant, if the blade  RPM is increased, the compressor rotor may experience positive incidence flow  separation (actual relative flow an",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Starting from design condition at the same blade RPM, if the mass flow rate is  increased, the compressor rotor may experience positive incidence flow separation  (actual relative flow angle greater t",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Keeping the mass flow rate constant, if the blade RPM is increased, the compressor  may experience surge",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "At the same blade RPM, if the mass flow rate is increased, the compressor may  experience surge",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q51",
    "question_number": 51,
    "question_text": "Consider the matrix \ud835\udc34= [5 \u22124 \ud835\udc58 \u22121], where k is a constant. If the determinant of A is  3, then the ratio of the largest eigenvalue of A to the constant k is ___________  (rounded off to 1 decimal place).                                             Aerospace Engineering (AE)  Page 36 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q52",
    "question_number": 52,
    "question_text": "The state of stress at a point is caused by two separate loading cases. One of them  produces a pure uniaxial tension along the  \ud835\udc65\u2032 direction, and other one produces a  pure uniaxial compression along the \ud835\udc66\u2032 direction, as shown in the figure. The sum  of maximum and minimum principal stresses for the resultant state of stress caused  by both loads acting simultaneously is ___________ N/mm2 (rounded off to 1  decimal place).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q53",
    "question_number": 53,
    "question_text": "In the figure shown below, the magnitude of internal force in member BC   is ___________ N (rounded off to 1 decimal place).                                       Aerospace Engineering (AE)  Page 37 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q54",
    "question_number": 54,
    "question_text": "The cross section of a thin-walled beam with uniform wall thickness t, shown in the  figure, is subjected to a bending moment Mx = 10 Nm. If h = 1 m and   t = 0.001 m, the magnitude of maximum normal stress in the cross section  is _________N/m2 (answer in integer).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q55",
    "question_number": 55,
    "question_text": "The equations of motion for a two degrees of freedom undamped spring-mass  system are:  \ud835\udc5a\ud835\udc65\u03081 + 2\ud835\udc58\ud835\udc651 \u2212\ud835\udc58\ud835\udc652 = 0  \ud835\udc5a\ud835\udc65\u03082 \u2212\ud835\udc58\ud835\udc651 + 2\ud835\udc58\ud835\udc652 = 0  where m and k represent mass and stiffness respectively, in corresponding SI units,  and \ud835\udc651 and \ud835\udc652 are the degrees of freedom. The larger of the two natural frequencies  is given by: \ud835\udf14= \ud835\udefc\u221a\ud835\udc58 \ud835\udc5a rad/s. The value of \ud835\udefc is ________ (rounded off to 2 decimal  places).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q56",
    "question_number": 56,
    "question_text": "Consider the plane strain field given by  \ud835\udf00\ud835\udc65\ud835\udc65= 10 \ud835\udc65\ud835\udc662, \ud835\udf00\ud835\udc66\ud835\udc66= \u22125 \ud835\udc652\ud835\udc66    and \ud835\udefe\ud835\udc65\ud835\udc66= \ud835\udc34 \ud835\udc65\ud835\udc66 (2\ud835\udc65\u2212\ud835\udc66)  where, A is a constant and \ud835\udefe\ud835\udc65\ud835\udc66 is the engineering shear strain. The value of the  constant A for the strain field to be compatible is _____________ (rounded off to 1  decimal place).                             Aerospace Engineering (AE)  Page 38 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q57",
    "question_number": 57,
    "question_text": "A chemical rocket with an ideally expanded flow through the nozzle produces  5 \u00d7 106 N thrust at sea level. The specific impulse of the rocket is 200 s and  acceleration due to gravity at the sea level is 9.8 m/s2. The propellent mass flow  rate out of the rocket nozzle is _________ kg/s (rounded off to the nearest integer).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q58",
    "question_number": 58,
    "question_text": "A centrifugal compressor is designed to operate with air. At the leading edge of the  tip of the inducer (eye of the impeller), the blade angle is 45o, and the relative Mach  number is 1.0. The stagnation temperature of the incoming air is 300 K. Consider  \uf067 = 1.4. Neglect pre-whirl and slip. The inducer tip speed is ________ m/s (rounded  off to the nearest integer).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q59",
    "question_number": 59,
    "question_text": "Consider the following Fanno flow problem: Flow enters a constant area duct at a  temperature of 273 K and a Mach number 0.2 and eventually reaches sonic  condition (Mach number =1) due to friction. Assume \ud835\udefe= 1.4. The static  temperature at the location where sonic condition is reached is_____________ K  (rounded off to 2 decimal places).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q60",
    "question_number": 60,
    "question_text": "Consider an artificial satellite moving around the Moon in an elliptic orbit. The  altitude of the satellite from the Moon\u2019s surface at the perigee is 25 km and that at  the apogee is 134 km. Assume the Moon to be spherical with a radius of 1737 km.  The trajectory is considered with reference to a coordinate system fixed to the center  of mass of the Moon. The ratio of the speed of the satellite at the perigee to that at  the apogee is ___________ (rounded off to 2 decimal places).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q61",
    "question_number": 61,
    "question_text": "For an aircraft moving at 4 km altitude above mean sea level at a Mach number of  0.2, the ratio of equivalent air speed to true air speed is _______ (rounded off to 2  decimal places).   The density of air at mean sea level is 1.225 kg/m3 and at 4 km altitude is  0.819 kg/m3.                             Aerospace Engineering (AE)  Page 39 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q62",
    "question_number": 62,
    "question_text": "For a general aviation airplane, one of the complex conjugate pair of eigenvalues  for longitudinal dynamics is given by \u22120.039 \u00b1 0.0567 \ud835\udc56 (in SI units). If the  system is disturbed to excite only this mode, the time taken for the amplitude of  response to become half in magnitude is _______ s (rounded off to 1 decimal place).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q63",
    "question_number": 63,
    "question_text": "The figure (not to scale) shows a control volume to estimate the forces on the airfoil  with elliptic cross-section. Surfaces 2 and 3 are streamlines. Velocity profiles are  measured at the upstream end (surface 1) and at the downstream end (surface 4) of  the control volume. The drag coefficient for the airfoil is defined as Cd = \ud835\udc37 1 2 \ud835\udf0c \ud835\udc48\u221e  2 \ud835\udc50 ,  where D is the drag force on the airfoil per unit span and \uf072 is the density of the air.  The static pressure, p\uf0a5, is constant over the entire surfac",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q64",
    "question_number": 64,
    "question_text": "An airplane of mass 1000 kg is in a steady level flight with a speed of 50 m/s. The  wing has an elliptic planform with a span of 20 m and planform area 31.4 m2.  Assuming the density of air at that altitude to be 1 kg/m3 and acceleration due to  gravity to be 10 m/s2, the induced drag on the wing is _________ N (rounded off to  1 decimal place).                                 Aerospace Engineering (AE)  Page 40 of 40  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ae-24-q65",
    "question_number": 65,
    "question_text": "It is desired to estimate the aerodynamic drag, D, on a car traveling at a speed of   30 m/s. A one-third scale model of the car is tested in a wind-tunnel following the  principles of dynamic similarity. The drag on the scaled model is measured to be  Dm. The ratio D/Dm is _________ (rounded off to 1 decimal place).",
    "exam_code": "GATE-AE",
    "subject": "Aerospace Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q1",
    "question_number": 1,
    "question_text": "If \u2018\u2192\u2019 denotes increasing order of intensity, then the meaning of the words   [simmer \u2192 seethe \u2192 smolder] is analogous to [break \u2192 raze \u2192  ________ ].  Which one of the given options is appropriate to fill the blank?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "obfuscate",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "obliterate",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "fracture",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "fissure                                Biomedical Engineering (BM)  Page 2 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q2",
    "question_number": 2,
    "question_text": "In a locality, the houses are numbered in the following way:   The house-numbers on one side of a road are consecutive odd integers starting from  301, while the house-numbers on the other side of the road are consecutive even  numbers starting from 302. The total number of houses is the same on both sides of  the road.   If the difference of the sum of the house-numbers between the two sides of the road  is 27, then the number of houses on each side of the road is",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "27",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "52",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "54",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "26",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q3",
    "question_number": 3,
    "question_text": "For positive integers \ud835\udc5d and \ud835\udc5e, with  \ud835\udc5d \ud835\udc5e\u22601 , ( \ud835\udc5d \ud835\udc5e) \ud835\udc5d \ud835\udc5e= \ud835\udc5d (\ud835\udc5d \ud835\udc5e \u22121). Then,",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc5e\ud835\udc5d= \ud835\udc5d\ud835\udc5e",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udc5e\ud835\udc5d= \ud835\udc5d2\ud835\udc5e",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\u221a\ud835\udc5e= \u221a\ud835\udc5d",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\u221a\ud835\udc5e \ud835\udc5d = \u221a\ud835\udc5d \ud835\udc5e          Biomedical Engineering (BM)  Page 3 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q4",
    "question_number": 4,
    "question_text": "Which one of the given options is a possible value of x in the following sequence?                                                3, 7, 15, x, 63, 127, 255",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "35",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "40",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "45",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "31",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q5",
    "question_number": 5,
    "question_text": "On a given day, how many times will the second-hand and the minute-hand of a  clock cross each other during the clock time 12:05:00 hours to 12:55:00 hours?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "51",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "49",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "50",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "55                Biomedical Engineering (BM)  Page 4 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q6",
    "question_number": 6,
    "question_text": "In the given text, the blanks are numbered (i)\u2212(iv). Select the best match for   all the blanks.  From the ancient Athenian arena to the modern Olympic stadiums,   athletics       (i)        the potential for a spectacle. The crowd       (ii)       with bated  breath as the Olympian artist twists his body, stretching the javelin behind him.  Twelve strides in, he begins to cross-step. Six cross-steps       (iii)       in an abrupt  stop on his left foot. As his body       (iv)       like a door",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(i) hold  (ii) waits  (iii) culminates  (iv) pivot",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "(i) holds  (ii) wait     (iii) culminates  (iv) pivot",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "(i) hold  (ii) wait  (iii) culminate  (iv) pivots",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "(i) holds  (ii) waits  (iii) culminate  (iv) pivots                        Biomedical Engineering (BM)  Page 5 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q7",
    "question_number": 7,
    "question_text": "Three distinct sets of indistinguishable twins are to be seated at a circular table that   has 8 identical chairs. Unique seating arrangements are defined by the relative  positions of the people.  How many unique seating arrangements are possible such that each person is sitting  next to their twin?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "12",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "14",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "10",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "28                                Biomedical Engineering (BM)  Page 6 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q8",
    "question_number": 8,
    "question_text": "The chart given below compares the Installed Capacity (MW) of four power  generation technologies, T1, T2, T3, and T4, and their Electricity Generation   (MWh) in a time of 1000 hours (h).    The Capacity Factor of a power generation technology is:   Capacity Factor =  Electricity Generation (MWh) Installed Capacity (MW) \u00d7 1000 (h)  Which one of the given technologies has the highest Capacity Factor?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "T1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "T2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "T3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "T4        0 5 10 15 20 25 30 35 40 45 50 55 60 65 70 0 1000 2000 3000 4000 5000 6000 7000 8000 9000 10000 11000 12000 13000 14000 T1 T2 T3 T4 Installed Capacity (MW) Electricity Generation (MWh) Power",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q9",
    "question_number": 9,
    "question_text": "In the 4 \u00d7 4 array shown below, each cell of the first three columns has either a   cross (X) or a number, as per the given rule.     Rule: The number in a cell represents the count of crosses around its immediate  neighboring cells (left, right, top, bottom, diagonals).   As per this rule, the maximum number of crosses possible in the empty column is",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "3                      Biomedical Engineering (BM)  Page 8 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q10",
    "question_number": 10,
    "question_text": "During a half-moon phase, the Earth-Moon-Sun form a right triangle. If the   Moon-Earth-Sun angle at this half-moon phase is measured to be 89.85\u00b0, the ratio  of the Earth-Sun and Earth-Moon distances is closest to",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "328",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "382",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "238",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "283                                            Biomedical Engineering (BM)  Page 9 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q11",
    "question_number": 11,
    "question_text": "What is the value of the following complex line integral counter-clockwise?  \u222e 8 \ud835\udc67(\ud835\udc67\u22122)(\ud835\udc67\u22124) |\ud835\udc67|=3  \ud835\udc51\ud835\udc67",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "+\ud835\udc572\ud835\udf0b",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u2212\ud835\udc572\ud835\udf0b",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\u2212\ud835\udc5710\ud835\udf0b",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "+\ud835\udc5710\ud835\udf0b",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q12",
    "question_number": 12,
    "question_text": "To solve the equation \ud835\udc65= 2 cos \ud835\udc65 using Newton-Raphson\u2019s method, which one of  the following iterations should be used?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc65\ud835\udc5b+1 = \ud835\udc65\ud835\udc5b\u2212\ud835\udc65\ud835\udc5b\u22122\ud835\udc50\ud835\udc5c\ud835\udc60\ud835\udc65\ud835\udc5b 1 + 2\ud835\udc60\ud835\udc56\ud835\udc5b\ud835\udc65\ud835\udc5b",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udc65\ud835\udc5b+1 = \ud835\udc65\ud835\udc5b+ \ud835\udc65\ud835\udc5b\u22122\ud835\udc50\ud835\udc5c\ud835\udc60\ud835\udc65\ud835\udc5b 1 + 2\ud835\udc60\ud835\udc56\ud835\udc5b\ud835\udc65\ud835\udc5b",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc65\ud835\udc5b+1 = \ud835\udc65\ud835\udc5b+ 1 + 2\ud835\udc60\ud835\udc56\ud835\udc5b\ud835\udc65\ud835\udc5b \ud835\udc65\ud835\udc5b\u22122\ud835\udc50\ud835\udc5c\ud835\udc60\ud835\udc65\ud835\udc5b",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc65\ud835\udc5b+1 = \ud835\udc65\ud835\udc5b\u22121 + 2\ud835\udc60\ud835\udc56\ud835\udc5b\ud835\udc65\ud835\udc5b \ud835\udc65\ud835\udc5b\u22122\ud835\udc50\ud835\udc5c\ud835\udc60\ud835\udc65\ud835\udc5b         Biomedical Engineering (BM)  Page 10 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q13",
    "question_number": 13,
    "question_text": "During the repolarization phase of a neuron, the cell is brought back to the resting  potential by the action of a Sodium-Potassium pump. Which one of the following  statements is TRUE for the active transport of Na+ and K+ ions through the cell  membrane?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "For every 3 Na+ transported out of the cell 2 K+ is transported into the cell.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "For every 3 Na+ transported into the cell 2 K+ is transported out of the cell.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "For every 2 Na+ transported out of the cell 3 K+ is transported into the cell.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The ratio of Na+ and K+ transport is always equal to one.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q14",
    "question_number": 14,
    "question_text": "The cardiac rhythm in a healthy human heart originates from _____.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Sinu-atrial node (SA)",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Atrio-ventricular node (AV)",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Aorta",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Right atria                  Biomedical Engineering (BM)  Page 11 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q15",
    "question_number": 15,
    "question_text": "Which one of the following events is NOT typically encountered in diagnostic   X-ray projection radiography?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Pair production",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Photoelectric absorption",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Compton scattering",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Characteristic radiation",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q16",
    "question_number": 16,
    "question_text": "Which of the following statements is TRUE for a PET imaging system?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Two coincident photons of 511 keV energy are detected 180o apart.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Photons of 51.1 keV energy are detected 360o around the body.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Photons of energy 511 keV are detected 360o around the body.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Coincident photons with 51.1 keV energy are detected 180o apart.                    Biomedical Engineering (BM)  Page 12 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q17",
    "question_number": 17,
    "question_text": "Consider the following layers: subcutaneous fat, viable epidermis, stratum  corneum, and dermis. Which one of the following represents the correct sequence  of the layers from skin surface to within?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Dermis, subcutaneous fat, viable epidermis, stratum corneum",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Dermis, viable epidermis, subcutaneous fat, stratum corneum",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Stratum corneum, viable epidermis, dermis, subcutaneous fat",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Viable epidermis, stratum corneum, dermis, subcutaneous fat",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q18",
    "question_number": 18,
    "question_text": "Bioglass 45S5 has a composition of ________.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "45 wt% SiO2 and 5:1 molar ratio of Calcium to Phosphorus.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "45 wt% Hydroxyapatite and 5 wt%  SiO2.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "45 wt% Hydroxyapatite and 5:1 molar ratio of CaO and Ca3(PO4)2.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "45 wt% SiO2 and 5 wt% Hydroxyapatite.                  Biomedical Engineering (BM)  Page 13 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q19",
    "question_number": 19,
    "question_text": "Macrophages that are resident in the liver are _________________.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Histiocyte cells",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Langerhans cells",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Kupffer cells",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Fibroblast cells                                          Biomedical Engineering (BM)  Page 14 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q20",
    "question_number": 20,
    "question_text": "Which one of the following drug release kinetic curves will be ideal for developing  an implantable slow-release drug delivery device?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "time % cumulative  release",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "time % cumulative  release",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "time % cumulative  release",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "time % cumulative  release                   Biomedical Engineering (BM)  Page 15 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q21",
    "question_number": 21,
    "question_text": "The circuit shown in the figure functions as which one of the following digital  circuit blocks?    1  0 D clk Q",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Negative level triggered D-latch",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Positive level triggered D-latch",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Negative edge triggered D-flip-flop",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Positive edge triggered D-flip-flop",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q22",
    "question_number": 22,
    "question_text": "The Fourier transform of \ud835\udc52\u2212|2\ud835\udc61| is _________.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "4 4 \u2212\ud835\udf142",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4 4 + \ud835\udf142",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "2 2 + \ud835\udf14",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "2 2 \u2212\ud835\udf14      Biomedical Engineering (BM)  Page 16 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q23",
    "question_number": 23,
    "question_text": "The Bode plot of a 2nd order low pass filter is shown in the figure below. What is  the frequency at which the attenuation is 80 dB?    0 dB 1 kHz",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "10 kHz",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "10 MHz",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "100 kHz",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "100 MHz",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q24",
    "question_number": 24,
    "question_text": "The input \ud835\udc65(\ud835\udc61) and the output \ud835\udc66(\ud835\udc61) of a linear time invariant system are related as  follows:   \ud835\udc66(\ud835\udc61) + \ud835\udc51\ud835\udc66(\ud835\udc61) \ud835\udc51\ud835\udc61 + 0.5 \ud835\udc512\ud835\udc66(\ud835\udc61) \ud835\udc51\ud835\udc612 = \ud835\udc65(\ud835\udc61) + 0.1 \ud835\udc51\ud835\udc65(\ud835\udc61) \ud835\udc51\ud835\udc61  What is the Laplace transform of the impulse response of the system?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "0.5\ud835\udc602 + \ud835\udc60+ 1 0.1\ud835\udc60+ 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "0.1\ud835\udc60+ 1 0.5\ud835\udc602 + \ud835\udc60+ 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "0.1\ud835\udc60+ \ud835\udc602 \ud835\udc602 + \ud835\udc60+ 0.5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc602 + \ud835\udc60+ 0.5 0.1\ud835\udc602 + \ud835\udc60    Biomedical Engineering (BM)  Page 17 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q25",
    "question_number": 25,
    "question_text": "Match the different chambers/locations of a healthy human heart in Column-1 to  the ranges of diastolic pressures in Column-2.  Column-1  Column-2  (P)  Arterial  (I)  2-6 mm Hg  (Q)  Pulmonary artery  (II)  8-12 mm Hg  (R)  Right ventricle  (III)  60-80 mm Hg",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(P) \u2013 (II), (Q) \u2013 (III), (R) \u2013 (I)",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "(P) \u2013 (II), (Q) \u2013 (I), (R) \u2013 (III)",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "(P) \u2013 (III), (Q) \u2013 (II), (R) \u2013 (I)",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "(P) \u2013 (III), (Q) \u2013 (I), (R) \u2013 (II)",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q26",
    "question_number": 26,
    "question_text": "Which of the following is/are NOT TRUE about photoreceptor cells in a healthy  human retina?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The distribution of rod and cone cells is uniform all over the retina.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The number of rods are higher than the number of cones in the retina.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Rods contain photopsin pigment.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Cones are responsible for colour vision in bright light.    Biomedical Engineering (BM)  Page 18 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q27",
    "question_number": 27,
    "question_text": "A monochromatic beam of \u03b3-ray photons is incident on a homogenous tissue. Which  of the following relationships hold(s) TRUE for the half-value layer thickness?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The first half-value layer is thicker than the second half-value layer.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The second half-value layer is thicker than the first half-value layer.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "All the half-value layers have equal thickness.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The ratio of thickness of the first and second half-value layers change based on the  intensity of the incident beam.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q28",
    "question_number": 28,
    "question_text": "A group of four people were residing together when a new virus was detected. If  the probability of each person being infected is 0.1, then the probability that at least  two of them are infected is ____. Give your answer rounded off to 3 decimal places.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q29",
    "question_number": 29,
    "question_text": "A random noise signal with Gaussian distribution has a mean of zero and a standard  deviation of 1 mV. The probability that an instantaneous measurement of this signal  is greater than 2 mV or lesser than -2 mV is ______. Give your answer as a  percentage rounded off to the nearest integer.                Biomedical Engineering (BM)  Page 19 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q30",
    "question_number": 30,
    "question_text": "The trigonometric Fourier series expansion of the periodic function in the figure has  coefficients {\ud835\udc4e\ud835\udc5b} and {\ud835\udc4f\ud835\udc5b} for cosine and sine terms, respectively. The value of  \ud835\udc4e1/\ud835\udc4e3  is __________. Give your answer rounded off to 1 decimal place.     1 3 5 +1 -1 seconds 2 0",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q31",
    "question_number": 31,
    "question_text": "A cylindrical engineered tissue was developed with a diameter of 2 cm, height of 3  cm and Young\u2019s modulus of 20 MPa. If an axial tensile force of 10 N is applied, the  percentage change in the height of the tissue is ______ %. Give your answer  rounded off to 2 decimal places.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q32",
    "question_number": 32,
    "question_text": "The measured current through a device is 5 A, the voltage measured across the  device is 20 V. The ammeter and the voltmeter used for these measurements have  a measurement uncertainty of 1% each. The maximum error in estimation of  impedance of the device is _______ m\u03a9. Give your answer rounded to the nearest  integer.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q33",
    "question_number": 33,
    "question_text": "The Larmor frequency of a Na nucleus when placed in a magnetic field strength of  3 T is ___________. (The gyromagnetic ratio of Na is given as \u03b3 = 11.26 MHz/T.)  Give your answer in MHz rounded off to the nearest integer.        Biomedical Engineering (BM)  Page 20 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q34",
    "question_number": 34,
    "question_text": "A Doppler ultrasound transducer operating at 5 MHz gave maximum output  frequency shift of 3 kHz. The velocity of sound in blood is 1500 m/s. If the probe  was held at an angle of 45o to the direction of blood flow, the maximum velocity of  blood flow through the artery is _____ m/s. (Give your answer rounded off to two  decimal places.)",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q35",
    "question_number": 35,
    "question_text": "The wavelength of the peak emission from a human body at a temperature of 37oC  due to black-body radiation is ______ \u00b5m. The value of Wien\u2019s displacement  constant is 2.898 \u00d7 10\u22123 m K. (Give your answer rounded off to 2 decimal places.)        Biomedical Engineering (BM)  Page 21 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q36",
    "question_number": 36,
    "question_text": "If \ud835\udc34= (1 \u22121 2 \u22122), the eigenvalues of \ud835\udc34 are _____________.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\u22121 and 0.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\u22121 and +1.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\u22121 and \u22121.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "+1 and 0.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q37",
    "question_number": 37,
    "question_text": "Consider a system of the following two partial differential equations:  \ud835\udf15\ud835\udefc \ud835\udf15\ud835\udc65= \u22122 \ud835\udf15\ud835\udefd \ud835\udf15\ud835\udc61  \ud835\udf15\ud835\udefd \ud835\udf15\ud835\udc65= \u22122 \ud835\udf15\ud835\udefc \ud835\udf15\ud835\udc61  Which one of the following choices is a possible solution for the system?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udefc(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u2212\ud835\udc61)2 + (\ud835\udc65+ \ud835\udc61)2 and \ud835\udefd(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u2212\ud835\udc61)2 \u2212(\ud835\udc65+ \ud835\udc61)2.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udefc(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u22122\ud835\udc61)2 + (\ud835\udc65+ 2\ud835\udc61)2 and \ud835\udefd(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u22122\ud835\udc61)2 \u2212(\ud835\udc65+ 2\ud835\udc61)2.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udefc(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u2212 \ud835\udc61 2) 2 + (\ud835\udc65+ \ud835\udc61 2) 2  and \ud835\udefd(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u2212 \ud835\udc61 2) 2 \u2212(\ud835\udc65+ \ud835\udc61 2) 2 .",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udefc(\ud835\udc61, \ud835\udc65) = (\ud835\udc65\u2212 \ud835\udc61 2) 2 + 2 (\ud835\udc65+ \ud835\udc61 2) 2 and \ud835\udefd(\ud835\udc61, \ud835\udc65) = 2 (\ud835\udc65\u2212 \ud835\udc61 2) 2 \u2212(\ud835\udc65+ \ud835\udc61 2) 2 .    Biomedical Engineering (BM)  Page 22 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q38",
    "question_number": 38,
    "question_text": "The end-diastolic ventricular volume is found to be 125 mL and the end-systolic  ventricular volume is found to be 50 mL. If the heart rate is 65 beats/minute, what is  the cardiac output in liters per minute? (Rounded off to 2 decimal places.)",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "3.25",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "4.88",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5.20",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "3.00                                    Biomedical Engineering (BM)  Page 23 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q39",
    "question_number": 39,
    "question_text": "Which of the following waveforms represents the output Vo of the circuit given  below? The Zener diode used has a Zener breakdown voltage of 1 V and can be  assumed ideal while in forward bias.    Vs=2sin(2\u03c0t) V 1\u03a9  1V + -vo",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "1 -2 0 -1 vo t 1 2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1 -2 0 vo t 1 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "1 0 -1 vo t 1 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "1 0 -1 vo t 1 2     Biomedical Engineering (BM)  Page 24 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q40",
    "question_number": 40,
    "question_text": "In magnetic resonance imaging (MRI), pulse repetition time (\ud835\udc47\ud835\udc45), time to echo (\ud835\udc47\ud835\udc38),  \ud835\udc471 relaxation time, \ud835\udc472 relaxation time are some of the important pulse sequence design  parameters. Which one of the following specifications is used for proton density  weighted imaging?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udc47\ud835\udc45\u226b\ud835\udc471 , \ud835\udc47\ud835\udc38\u226a\ud835\udc472",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udc47\ud835\udc45\u226b\ud835\udc471 , \ud835\udc47\ud835\udc38\u226b\ud835\udc472",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udc47\ud835\udc45\u226a\ud835\udc471 , \ud835\udc47\ud835\udc38\u226a\ud835\udc472",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udc47\ud835\udc45\u226a\ud835\udc471 , \ud835\udc47\ud835\udc38\u226b\ud835\udc472                                  Biomedical Engineering (BM)  Page 25 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q41",
    "question_number": 41,
    "question_text": "An orthopaedic implant when monitored over 6 months showed the following  normalized curves for polymer molecular weight (MW), mass of implant and  mechanical strength. Among the choices, what is the most probable reason for the  observed changes?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Bulk erosion",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Surface erosion",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Bulk initially followed by surface erosion",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "No erosion but mechanical breakage due to injury                      Biomedical Engineering (BM)  Page 26 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q42",
    "question_number": 42,
    "question_text": "In an attempt to integrate engineered tissue with native tissue, three samples of  engineered tissue, X, Y, Z, with identical material properties, were co-cultured  adjacent to three different native tissues (bone, cartilage and liver). The adhesive  strengths of X, Y, Z were observed after 8 weeks as follows.  Adhesive strength for X = 150 kPa, Y= 250 kPa, Z= 350 kPa  Match the native tissue that were used to co-culture X, Y and Z from the following.  I: Liver Tissue  II: Articular Cartilage  I",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "X with I,  Y with II and Z with III",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "X with II,  Y with III and Z with I",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "X with I,  Y with III and Z with II",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "X with III,  Y with II and Z with I                                                     Biomedical Engineering (BM)  Page 27 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q43",
    "question_number": 43,
    "question_text": "In a catheter-sensor system to measure blood pressure (P) as shown in the below figure,  the liquid resistance (RL) of the catheter is due to friction between shearing molecules  flowing through the catheter. Which of the following is TRUE for RL if only the radius  of the catheter is doubled. Assume that the pressure difference across the catheter  segment is fixed.    P Catheter Diaphragm Liquid",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "RL will decrease by 16 times",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "RL  will decrease by 8 times",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "RL  will decrease by 4 times",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "RL  will decrease by 2 times",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q44",
    "question_number": 44,
    "question_text": "What is the value of the following integral using the residue integration method?  \u222b \ud835\udc51\ud835\udc65 1 + \ud835\udc654 \u221e \u2212\u221e",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "\ud835\udf0b \u221a2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "\ud835\udf0b 2\u221a2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "\ud835\udf0b 4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "\ud835\udf0b 2    Biomedical Engineering (BM)  Page 28 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q45",
    "question_number": 45,
    "question_text": "A neurologist needs to observe the alpha wave in EEG recordings of a patient. The  system block diagram with ideal filter blocks is shown below. Which one of the  following design choices is correct?    EEG Signal High Pass Filter Cut-Off fh Low Pass Filter Cut Off fl A/D Converter Sampling at fs",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "fh = 8 Hz, fl = 12 Hz, fs = 12 Hz",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "fh = 4 Hz, fl = 6 Hz, fs = 24 Hz",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "fh = 6 Hz, fl = 4 Hz, fs = 12 Hz",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "fh = 8 Hz, fl = 12 Hz, fs = 48 Hz                              Biomedical Engineering (BM)  Page 29 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q46",
    "question_number": 46,
    "question_text": "In the circuit below, what is the value of \ud835\udc3c\ud835\udc3f to transfer the maximum power to load?    5V 1\u03a9  1A  IL Load",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "3 A",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "6 A",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "4 A",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "2 A",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q47",
    "question_number": 47,
    "question_text": "A mechanical ventilator operating in volume controlled mode is set to deliver 600mL  of tidal volume (TV) with a flow rate of 40 L/min. The frequency of breathing is set  to 10 breaths per minute. If the flow rate is doubled which one of the following  happens?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The inspiratory time will increase.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The expiratory time will increase.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The tidal volume will increase.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The frequency of breathing will decrease.    Biomedical Engineering (BM)  Page 30 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q48",
    "question_number": 48,
    "question_text": "The X-ray attenuation coefficients as a function of photon energy for three materials  are shown in the figure below. A tissue phantom containing these three materials is  imaged at two different X-ray photon energies of 50 keV and 150 keV. When the  developed X-ray film is viewed, which of the following statements is/are TRUE?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Bone will appear relatively brighter than DCA in 50 keV.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "DCA will appear relatively brighter than bone in 50 keV.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Bone will appear relatively brighter than DCA in 150 keV.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "DCA will appear relatively brighter than bone in 150 keV.                      Biomedical Engineering (BM)  Page 31 of 37  Organizing Institute: IISc Bengaluru",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q49",
    "question_number": 49,
    "question_text": "Which of the following is/are TRUE for a surface electromyography (sEMG) signal  of a muscle experiencing fatigue?",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The median frequency of power spectral density of sEMG will decrease.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The median frequency of power spectral density of sEMG will increase.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The root mean square (RMS) value of sEMG will increase.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The root mean square (RMS) value of sEMG will decrease.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q50",
    "question_number": 50,
    "question_text": "For \ud835\udc39\u20d7= (\ud835\udc65+ \ud835\udc66)\ud835\udc56\u0302 + (\ud835\udc65+ \ud835\udc66)\ud835\udc57\u0302  the value of \u222e\ud835\udc39\u20d7\u2219\ud835\udc51\ud835\udc5f\u20d7 along the path shown in the  figure is ______. Give your answer as an integer.   (1,1) (1,0) (0,1) x y                             Biomedical Engineering (BM)  Page 32 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q51",
    "question_number": 51,
    "question_text": "The approximate total cross sectional areas of various types of blood vessels are given  below. It was estimated that the velocity of blood in the aorta is 30 cms-1. The time it  will take for the blood to travel through a capillary of length 0.5 mm is _____ seconds.  Give your answer rounded off to two decimal places.        Vessel Type  Approximate total cross  sectional area (cm2)  Aorta  4.5  Artery  20  Arteriole  400  Capillary  4500  Venule  40  Vein  15",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q52",
    "question_number": 52,
    "question_text": "A DNA extract solution with a concentration of 15 ng/\u00b5L placed in a micro-cuvette of  sample thickness 0.5 mm gave an absorbance of 0.24 at a wavelength of 260 nm in a  spectrophotometer. After further concentration, the sample was found to give an  absorbance of 0.38 at the same wavelength under identical conditions. The final  concentration of the sample is ______ ng/\u00b5L. (Give your answer rounded off to 2  decimal places.)",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q53",
    "question_number": 53,
    "question_text": "An X-ray beam of initial intensity I0 of 70 keV imaging the chest is assumed to undergo  attenuation through the muscle tissue for a thickness of 16 cm and further through the  bone tissue for a thickness of 4 cm. The half value layer (HVL) thicknesses for the  muscle and bone are 3.5 cm and 1.8 cm, respectively. The percentage of X-ray  intensity transmitted through the body is ______. Give your answer rounded off to 2  decimal places.        Biomedical Engineering (BM)  Page 33 of 37  Organizi",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q54",
    "question_number": 54,
    "question_text": "A person standing one meter away from a 4000 curie radioactive source receives a  lethal dose of radiation in about 5 minutes. At 3 meters away from the same source,  the time in which he will receive the same lethal dose is ______ minutes. Give your  answer rounded off to the nearest integer.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q55",
    "question_number": 55,
    "question_text": "If a circular ultrasound transducer of radius \ud835\udc4e = 8 mm operating at a central frequency  of 1 MHz has a pressure beam pattern in a medium as given below:  \ud835\udc43(\ud835\udc5f, 0) \u221dsin \ud835\udc58\ud835\udc4e2 4\ud835\udc5f  Here, \ud835\udc58 is the wave number, \ud835\udc5f is the axial distance from the center of aperture. The  speed of sound in the medium is 1600 ms-1.  The reduction in intensity between \ud835\udc5f= 8 cm and \ud835\udc5f= 16 cm is ______ dB. Give your  answer as a positive quantity rounded off to two decimal places.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q56",
    "question_number": 56,
    "question_text": "The source in the figure is a current source and the circuit is in steady state. At \ud835\udc61= 0.5\ud835\udf0b seconds, the value of v in the circuit given below is _____ volts. Give your  answer rounded off to 2 decimal digits.    1F 1H 2\u03a9  v  I=sin(t) A             Biomedical Engineering (BM)  Page 34 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q57",
    "question_number": 57,
    "question_text": "The equivalent impedance, ZAB, in the circuit given below is _____ \u03a9. Give your  answer rounded off to one decimal place.    + - + - V V ZAB 1\u03a9  1\u03a9  1\u03a9",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q58",
    "question_number": 58,
    "question_text": "The bandwidth of ECG signal ranges from 0.5 Hz to 100 Hz. If a single ADC is used  to digitize data from 8 ECG channels then the minimum ADC sampling rate is ______  Hz. Give your answer rounded off to the nearest integer.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q59",
    "question_number": 59,
    "question_text": "If \ud835\udc65[\ud835\udc5b] = \ud835\udc62[\ud835\udc5b] \u2212\ud835\udc62[\ud835\udc5b\u22125], and \u210e[\ud835\udc5b] = \ud835\udeff[\ud835\udc5b] \u2212\ud835\udeff[\ud835\udc5b\u22121] and \ud835\udc66[\ud835\udc5b] = \ud835\udc65[\ud835\udc5b] \u2217\u210e[\ud835\udc5b],  then the value of \u2211 \ud835\udc66[\ud835\udc5b] \u221e \ud835\udc5b=\u2212\u221e  is ______. Give your answer rounded off to the nearest  integer.                      Biomedical Engineering (BM)  Page 35 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q60",
    "question_number": 60,
    "question_text": "In the figure below, the diode is ideal. The current reading shown in the ammeter is  _____ A. Give your answer rounded off to the nearest integer.    1F 1H 1\u03a9  1\u03a9  Ammeter sin(t) V",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q61",
    "question_number": 61,
    "question_text": "In the figure below, the Fourier series of \ud835\udc63(\ud835\udc61), in volts, is given as:   \ud835\udc63(\ud835\udc61) = \ud835\udc630 + 2 cos(\ud835\udf140\ud835\udc61) + 5 cos(3\ud835\udf140\ud835\udc61) + cos (5\ud835\udf140\ud835\udc61)  The capacitor is a short circuit for all AC signals. The power absorbed by the 1\u03a9  resistor is _____ W. Give your answer rounded off to the nearest integer.    v(t) 1\u03a9  C=\u221e             Biomedical Engineering (BM)  Page 36 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q62",
    "question_number": 62,
    "question_text": "An artificial fore-arm has a moment-of-inertia around the center of mass as 0.3kg.m2.   The mass of the artificial fore-arm is 3 kg. If the distance from the elbow joint to the  center of mass of the fore-arm is 20 cm, the moment-of-inertia of the fore-arm about  the elbow joint is ______ kg.m2. Give your answer rounded off to two decimal places.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q63",
    "question_number": 63,
    "question_text": "A bio-potential signal of 4 mV on the skin surface was fed to an amplifier with a  differential gain of 2000. The noise in the signal is 1000 mV. If the amplifier output  produces a noise output of 200 mV, the common mode rejection ratio of the amplifier  is ______ dB. Give your answer rounded to the nearest integer.",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q64",
    "question_number": 64,
    "question_text": "In a motor nerve conduction velocity experiment, the distance between the distal and  the recording sites is 4 cm and the distance between the proximal and the recording  sites is 24 cm. The distal and proximal latencies were recorded as 6 ms and 10 ms,  respectively. The nerve conduction velocity is _____ meters per second. Give your  answer rounded off to the nearest integer.                            Biomedical Engineering (BM)  Page 37 of 37  Organizing Institute: IISc Bengaluru",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-bm-24-q65",
    "question_number": 65,
    "question_text": "A person creates an apparatus as shown in the figure to exercise the extensor muscle  of the hand. It is given that OP = 0.15 m, OQ = 0.35 m, \ud835\udf03 = 30\u2218, the weight of the  lower arm = 20 N, the center of mass of the lower arm is at point P, the magnitude   of the applied tensile force F = 50 N. If the extensor muscle is acting with a moment  arm of 0.25 m, the muscle force required to hold the hand at the position shown in  the figure is _____ N. Give your answer rounded off to the nearest integer",
    "exam_code": "GATE-BM",
    "subject": "Biomedical Engineering",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q1",
    "question_number": 1,
    "question_text": "If \u2018\u2192\u2019 denotes increasing order of intensity, then the meaning of the words   [sick \u2192 infirm \u2192 moribund] is analogous to [silly \u2192 _______ \u2192 daft].  Which one of the given options is appropriate to fill the blank?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "frown",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "fawn",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "vein",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "vain                              Architecture and Planning (AR)  Page | 2",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q2",
    "question_number": 2,
    "question_text": "The 15 parts of the given figure are to be painted such that no two adjacent parts  with shared boundaries (excluding corners) have the same color. The minimum  number of colors required is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "6                        Architecture and Planning (AR)  Page | 3",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q3",
    "question_number": 3,
    "question_text": "How many 4-digit positive integers divisible by 3 can be formed using only the  digits {1, 3, 4, 6, 7}, such that no digit appears more than once in a number?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "24",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "48",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "72",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "12",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q4",
    "question_number": 4,
    "question_text": "The sum of the following infinite series is  2 + 1 2 + 1 3 + 1 4 + 1 8 + 1 9 + 1 16 + 1 27 + \u22ef",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "11/3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "7/2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "13/4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "9/2                Architecture and Planning (AR)  Page | 4",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q5",
    "question_number": 5,
    "question_text": "In an election, the share of valid votes received by the four candidates A, B, C, and  D is represented by the pie chart shown. The total number of votes cast in the  election were 1,15,000, out of which 5,000 were invalid.     Based on the data provided, the total number of valid votes received by the  candidates B and C is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "45,000",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "49,500",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "51,750",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "54,000                  A 40% B 25% C 20% D 15% Share of valid votes   Architecture and Planning (AR)  Page | 5",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q6",
    "question_number": 6,
    "question_text": "Thousands of years ago, some people began dairy farming. This coincided with a  number of mutations in a particular gene that resulted in these people developing  the ability to digest dairy milk.  Based on the given passage, which of the following can be inferred?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "All human beings can digest dairy milk.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "No human being can digest dairy milk.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Digestion of dairy milk is essential for human beings.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "In human beings, digestion of dairy milk resulted from a mutated gene.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q7",
    "question_number": 7,
    "question_text": "The probability of a boy or a girl being born is 1/2. For a family having only   three children, what is the probability of having two girls and one boy?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "3/8",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "1/8",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "1/4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "1/2           Architecture and Planning (AR)  Page | 6",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q8",
    "question_number": 8,
    "question_text": "Person 1 and Person 2 invest in three mutual funds A, B, and C. The amounts they  invest in each of these mutual funds are given in the table.    Mutual fund A  Mutual fund B  Mutual fund C  Person 1  \u20b910,000  \u20b920,000  \u20b920,000  Person 2  \u20b920,000  \u20b915,000  \u20b915,000  At the end of one year, the total amount that Person 1 gets is \u20b9500 more than   Person 2. The annual rate of return for the mutual funds B and C is 15% each. What  is the annual rate of return for the mutual fund A?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "7.5%",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "10%",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "15%",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "20%                        Architecture and Planning (AR)  Page | 7",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q9",
    "question_number": 9,
    "question_text": "Three different views of a dice are shown in the figure below.     The piece of paper that can be folded to make this dice is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "(B)",
        "is_correct": true
      },
      {
        "id": "opt_c",
        "text": "(D)            Architecture and Planning (AR)  Page | 8",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q10",
    "question_number": 10,
    "question_text": "Visualize two identical right circular cones such that one is inverted over the other  and they share a common circular base. If a cutting plane passes through the vertices  of the assembled cones, what shape does the outer boundary of the   resulting cross-section make?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "A rhombus",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "A triangle",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "An ellipse",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "A hexagon                                          Architecture and Planning (AR)  Page | 9    PART A: Common FOR ALL CANDIDATES",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q11",
    "question_number": 11,
    "question_text": "The nature of curvature of the following structural form is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "monoclastic",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "synclastic",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "anticlastic",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "m\u00f6bius",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q12",
    "question_number": 12,
    "question_text": "As per the Ekistics Logarithmic Scale, the \u2018world city\u2019 is referred as",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Megalopolis",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Conurbation",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Acropolis",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Ecumenopolis        Architecture and Planning (AR)  Page | 10",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q13",
    "question_number": 13,
    "question_text": "In M\u0101nas\u0101ra Silpas\u0101stra, a bow-shaped town plan is known as",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Dandaka",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Prastara",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "K\u0101rmuka",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Nandy\u0101varta",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q14",
    "question_number": 14,
    "question_text": "The value of a property when sold at a lower price than its open market price is  called",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Distress Value",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Accommodation Value",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Speculative Value",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Replacement Value                Architecture and Planning (AR)  Page | 11",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q15",
    "question_number": 15,
    "question_text": "In a traffic survey, Enoscope is used to measure",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Volume to Capacity ratio",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Sight distance",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Spot speed",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Intersection delay",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q16",
    "question_number": 16,
    "question_text": "The author of the book Human Aspects of Urban Form is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Cliff Moughtin",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Amos Rapoport",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Peter Katz",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Lewis Mumford                Architecture and Planning (AR)  Page | 12",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q17",
    "question_number": 17,
    "question_text": "Which of the following statements is correct for Urban Cool Island (UCI)?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The UCI and Urban Heat Island (UHI) cannot happen in a city at the same time.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Air temperature of surrounding rural areas is warmer than that of the urban areas.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Air temperature of surrounding rural areas is cooler than that of the urban areas.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "UCI happens only in a snow-clad mountain.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q18",
    "question_number": 18,
    "question_text": "Which of the following statements is correct for an oxidation pond to treat waste  water?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "It is an aerobic pond.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "It is an anaerobic pond.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "It does not require sunlight.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "It does not remove Biological Oxygen Demand (BOD).                  Architecture and Planning (AR)  Page | 13",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q19",
    "question_number": 19,
    "question_text": "The conservation architect of the Maitreya Buddha Temple at Basgo, Ladakh which  won the 2007 UNESCO Asia-Pacific Heritage Award is",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Abha Narain Lambah",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Vinod Kumar M. M.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Rahul Mehrotra",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Saima Iqbal",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q20",
    "question_number": 20,
    "question_text": "Which of the following options is/are the right sequence(s) in water treatment  process?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Coagulation \u2192 Flocculation \u2192 Sedimentation",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Sedimentation \u2192 Filtration \u2192 Disinfection",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Sedimentation \u2192 Flocculation \u2192 Coagulation",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Disinfection \u2192 Filtration \u2192 Flocculation                   Architecture and Planning (AR)  Page | 14",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q21",
    "question_number": 21,
    "question_text": "Which of the following is/are associated with Gentrification in a neighbourhood?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Wealthier households displace poor households",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Poor households displace wealthier households",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Real estate value increases",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Real estate value decreases",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q22",
    "question_number": 22,
    "question_text": "Which of the following sites is/are included in the UNESCO World Heritage   List as on December 2022?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Capitol Complex, Chandigarh",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Moth ki Masjid, Delhi",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Keoladeo National Park, Bharatpur",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Paradesi Synagogue, Kochi                Architecture and Planning (AR)  Page | 15",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q23",
    "question_number": 23,
    "question_text": "The reference points, lines and planes for drawing a two-point perspective of an  object are marked in the Figure below. Select the correct option(s) that match(es)  with the corresponding nomenclature.",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "R \u2013 Station point, S \u2013 Picture plane",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "R \u2013 Vanishing point, T \u2013 Picture plane",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 Vanishing point, T \u2013 Ground line",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Q \u2013 Ground line, S \u2013 Horizon line                  Architecture and Planning (AR)  Page | 16",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q24",
    "question_number": 24,
    "question_text": "India\u2019s intended Nationally Determined Contribution to the United Nations  Framework Convention on Climate Change in 2022 include(s)",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "reduction of emissions intensity of India\u2019s GDP by 45% by 2030 from 2005 level",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "achieving about 50% cumulative electric power installed capacity from non-fossil  fuel-based energy resources by 2030",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "achieving the target of net-zero emission by 2030",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "reduction of total projected carbon emission by one billion tonnes from 2022 to  2025",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q25",
    "question_number": 25,
    "question_text": "As per the Census of India 2011, non-notified slums is/are categorised as",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Recognised",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Identified",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Unrecognised",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Authorised                Architecture and Planning (AR)  Page | 17",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q26",
    "question_number": 26,
    "question_text": "Which of the following is/are under the purview of the Energy Conservation  Building Code of India 2017 ?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Indoor Lighting",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Outdoor Lighting",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Plug Loads",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Embodied Energy",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q27",
    "question_number": 27,
    "question_text": "Which of the following is/are used for municipal fiscal resource mobilisation?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Property tax",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Development charges",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Income tax",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Salary of municipal staff",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q28",
    "question_number": 28,
    "question_text": "A ramp with a slope of 1:12 is required for wheelchair access. Intermediate landings  of length 1.5 m each have to be provided after every 9 m running length. The   running length of a straight ramp including landing, to negotiate a level difference  of 900 mm vertical height, in m, is _____________ (rounded off to two decimal  places).          Architecture and Planning (AR)  Page | 18",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q29",
    "question_number": 29,
    "question_text": "Match the features in Group\u2013I with the corresponding software tools in   Group\u2013II.     Group\u2013I  Group\u2013II  (P)  Raster Graphics Editing   (1)  OpenStudio  (Q)  Energy Modeling  (2)  GIMP  (R)  Visual Programming Interface  (3)  STAAD  (S)  Structural Analysis  (4)  Grasshopper      (5)  Radiance",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 3, Q \u2013 1, R \u2013 2, S \u2013 5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 2, Q \u2013 1, R \u2013 4, S \u2013 3",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 1, Q \u2013 4, R \u2013 5, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 2, Q \u2013 5, R \u2013 1, S \u2013 3                    Architecture and Planning (AR)  Page | 19",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q30",
    "question_number": 30,
    "question_text": "Match the elements in Group\u2013I with the corresponding buildings in Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Lightweight Structure  (1)  Taipei 101, Taipei by Lee and Wang  (Q)  Base Isolator  (2)  The Gherkin, London by Foster &  Partners   (R)  Tuned-mass Damper  (3)  Museum of New Zealand Te Papa  Tongarewa, Wellington by Ivan Mercep  (S)  Diagrid  (4)  Paper Log Houses, Kobe by Shigeru  Ban      (5)  Metropolitan Cathedral of Christ the  King, Liverpool by Lutyens and  Gibberd",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 1, Q \u2013 3, R \u2013 5, S \u2013 4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 1, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 4, Q \u2013 1, R \u2013 5, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 3, Q \u2013 2, R \u2013 1, S \u2013 5                    Architecture and Planning (AR)  Page | 20",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q31",
    "question_number": 31,
    "question_text": "Match the following concepts in Group\u2013I with their corresponding description in  Group\u2013II.    Group\u2013I  Group\u2013II  (P)  N I M B Y  (1)  Affording a clear view of the waterfront to a  plot through the abutting street  (Q)  Form based code   (2)  Planning and zoning tool to regulate  development primarily through urban form   (R)  Tactical urbanism  (3)  Establishment of residential areas on the  outskirts of a city  (S)  Suburbanisation   (4)  Short-term, low cost, scalable interventions  and polic",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 5, Q \u2013 2, R \u2013 4, S \u2013 3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 5, Q \u2013 4, R \u2013 3, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 1, Q \u2013 2, R \u2013 4, S \u2013 5",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 1, Q \u2013 5, R \u2013 4, S \u2013 3                    Architecture and Planning (AR)  Page | 21",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q32",
    "question_number": 32,
    "question_text": "Match the urban renewal projects in Group\u2013I with the corresponding cities in  Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Cheonggyecheon  (1)  New York  (Q)  The High Line  (2)  London  (R)  False Creek South  (3)  Seoul  (S)  Canary Wharf  (4)  Vancouver      (5)  Tokyo",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 3, Q \u2013 1, R \u2013 4, S \u2013 2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 1, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 5, Q \u2013 1, R \u2013 2, S \u2013 3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 2, Q \u2013 5, R \u2013 4, S \u2013 3                    Architecture and Planning (AR)  Page | 22",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q33",
    "question_number": 33,
    "question_text": "Match the Biosphere Reserves in Group\u2013I with their corresponding features in  Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Gulf of Mannar  (1)  Ridge, Glacier  (Q)  Sunderbans  (2)  Sub-tropical/Tropical Forest,  Stepped Hill  (R)  Nanda Devi  (3)  Swamp forest, Mangrove  (S)  Nilgiri  (4)  Coral Reefs, Seagrass bed      (5)  Salt Marsh, Flat Terrain",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 1, Q \u2013 3, R \u2013 4, S \u2013 5",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 1, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 1, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 4, Q \u2013 2, R \u2013 3, S \u2013 5                    Architecture and Planning (AR)  Page | 23",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q34",
    "question_number": 34,
    "question_text": "Match the terminologies in Group\u2013I with their descriptions in Group\u2013II.                   Group\u2013I  Group\u2013II  (P)  Edge City  (1)  Rapid expansion of geographical  areas of towns or cities   (Q) Synekism  (2)  Violence against the city  (R) Urbicide  (3)  A secondary CBD on the edge of  the city   (S)  Urban Sprawl  (4)  Rebuilding core city area      (5)  Union of several small urban  settlements under one rule",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 2, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 4, R \u2013 2, S \u2013 5",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 2, Q \u2013 5, R \u2013 3, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 4, Q \u2013 2, R \u2013 3, S \u2013 1                          Architecture and Planning (AR)  Page | 24",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q35",
    "question_number": 35,
    "question_text": "Match the items in Group\u2013I with their corresponding items in Group\u2013II.              Group\u2013I  Group\u2013II  (P) Floating floor  (1)  Overflow control  (Q) Float valve  (2)  Delay not affecting a project  (R) Metal float  (3)  Acoustical buffer  (S) Free float  (4)  Plastering equipment      (5)  Traffic flow control",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 3, Q \u2013 2, R \u2013 4, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 5, Q \u2013 1, R \u2013 3, S \u2013 4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 3, Q \u2013 1, R \u2013 4, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 1, Q \u2013 2, R \u2013 5, S \u2013 4                                                  Architecture and Planning (AR)  Page | 25",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q36",
    "question_number": 36,
    "question_text": "As per the URDPFI Guidelines 2015, match the type of educational facilities in  Group\u2013I with the corresponding minimum population to be served per facility   in Group\u2013II.                        Group\u2013I  Group\u2013II  (P) Integrated school  (1) 4,000  (Q) Senior secondary school  (2) 2,500  (R) College  (3) 90,000  (S) Primary school  (4) 1,25,000      (5) 7,500",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 4, Q \u2013 2, R \u2013 3, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 4, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 2, Q \u2013 5, R \u2013 1, S \u2013 3",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 3, Q \u2013 2, R \u2013 4, S \u2013 5",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q37",
    "question_number": 37,
    "question_text": "Which of the following statements is/are true?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Physiological Equivalent Temperature is used in outdoor thermal comfort  evaluation.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Thermal Performance Index is computed using outside surface temperature of  building envelope.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Reynolds number less than 2000 refers to laminar wind flow.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Reynolds number greater than 4000 refers to turbulent wind flow.        Architecture and Planning (AR)  Page | 26",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q38",
    "question_number": 38,
    "question_text": "Which of the following statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Yellow, blue-violet and red-violet are split complementary hues.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Orange, green and violet are analogous combinations.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "CMYK is a subtractive colour system.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Blue, green, orange and red are tetrad combinations.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q39",
    "question_number": 39,
    "question_text": "Which of the following statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The Royal Botanical Garden is in Kew, England.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The Villa d\u2019Este is in Tivoli, Italy.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Indira Gandhi Memorial Tulip Garden is in Srinagar, J&K, India.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Shinjuku Gyoen National Garden is in Beijing, China.                    Architecture and Planning (AR)  Page | 27",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q40",
    "question_number": 40,
    "question_text": "Which of the following statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Hibiscus or china rose (Hibiscus rosa-sinensis) is a shrub which has red, pink, white,  and yellow blossoms.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Frangipani, champa, and plumeria alba are names of the same flowering tree.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Jacaranda (Jacarenda mimisifolia), gulmohar (delonix regia), and amaltas  (laburnum) are flowering trees.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The fruit of the Kadam/cadamba tree (Neolamarckia cadamba) is conical in shape  and poisonous for humans.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q41",
    "question_number": 41,
    "question_text": "Which of the following is/are component(s) of Right of Way (RoW) of a road?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Building line",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Kerb",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Carriageway",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Sidewalk            Architecture and Planning (AR)  Page | 28",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q42",
    "question_number": 42,
    "question_text": "As per the National Building Code of India 2016, terminologies associated with fire  fighting in a building is/are",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Refuge area",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Water sprinkler system",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Panic bar",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Atrium",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q43",
    "question_number": 43,
    "question_text": "For the beam shown below, ignoring the self-weight, the maximum hogging  moment (in kN\u22c5m) generated for the loads indicated is _____________ (rounded  off to one decimal place).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q44",
    "question_number": 44,
    "question_text": "At present, the cost of a new office equipment is 50,000 (in Indian Rupees). It has  15% salvage value after a useful life of 5 years. Using straight line method of  depreciation, the book value of the equipment 3 years from now, in Indian Rupees,  will be _____________ (in integer).            Architecture and Planning (AR)  Page | 29",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q45",
    "question_number": 45,
    "question_text": "The network diagram of a construction project is shown in the following Figure. The  duration of each activity, in days, and the early start time of the project are denoted  in the diagram. The total project duration along the critical path, in days,   is _____________(in integer).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q46",
    "question_number": 46,
    "question_text": "The design of a 1200 capacity concert hall considers 1/3rd female audience and   2/3rd male audience. The Table below shows the guideline for calculating   Water Closet requirements.   Fixture  Male  Female  Water closet 1 number per 100 up to 400 and  over 400, 1 number for every  250 or part thereof  3 numbers per 100 up to 200  population  and  over  200,   2 numbers for every 100 or part  thereof  Using the above guideline, the number of Water Closets required for the   total audience is ___",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q47",
    "question_number": 47,
    "question_text": "A declining Industrial Town has proposed to improve water sustainability by  reducing stormwater runoff through change of land use land cover (LULC), as  shown in the Table below, to attract new residents.   LULC  Runoff  Coefficient  Existing Area  in hectare  Proposed Area  in hectare  Industrial  0.7  1500  800  Residential  0.5  1000  1200  Park and Playgrounds  0.25  1200  1000  Forest  0.15  300  1000  Considering a flat topography and zero additional runoff from the adjoining areas,  the",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q48",
    "question_number": 48,
    "question_text": "A real estate developer is developing a township on a PPP mode. The total area of  the site is 2.672 hectares with an allowable FAR of 2.25, of which 20% is earmarked  for MIG category. The gross area of each MIG unit including common areas and  services is 72 m2. Assuming super built up area to be same as FAR, the   maximum  number  of  MIG  apartments  that  can  be  constructed   is _____________ (in integer).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q49",
    "question_number": 49,
    "question_text": "A municipal town requires a volume of 70,000 m3 compacted solid waste to fill a  low lying land. The city has a total of 10,000 households.   Type of  House  Percentage of  Households  Equivalent volume of compacted solid  waste generated/ household/ day  LIG  30%  0.10 m3  MIG  60%  0.15 m3  HIG  10%  0.20 m3  Using the information as shown in the Table above, the estimated minimum number  of days required to fill the low lying land is _____________ (in integer).      Architecture and Planning",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q50",
    "question_number": 50,
    "question_text": "Rose window is a characteristic feature of",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Great Temple of Ammon, Karnak, Egypt",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Temple of Jupiter, Baalbek, Lebanon",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Notre-Dame, Paris, France",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Humayun Tomb, Nizamuddin, Delhi                                  Architecture and Planning (AR)  Page | 32",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q51",
    "question_number": 51,
    "question_text": "The schematic diagram of a unitary air-conditioner operating in cooling mode, is  shown in the following Figure. The component P marked in the figure represents",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Condenser",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Evaporator",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Compressor",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Expansion valve",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q52",
    "question_number": 52,
    "question_text": "Titan Integrity Campus, Bengaluru is designed by",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Christopher C. Benninger",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Sanjay Mohe",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Raj Rewal",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Anant Raje    Architecture and Planning (AR)  Page | 33",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q53",
    "question_number": 53,
    "question_text": "With reference to the Figure below, which of the following labelling is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 Extrados, Q \u2013 Key , R \u2013 Span",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Q \u2013 Key, S \u2013 Abutment, T \u2013 Rise",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 Abutment, R \u2013 Rise, T \u2013 Extrados",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Q \u2013 Key, S \u2013 Span, T \u2013 Extrados                         Architecture and Planning (AR)  Page | 34",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q54",
    "question_number": 54,
    "question_text": "Which of the following buildings has/have pendentives as a structural element?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "St. Mark\u2019s Basilica, Venice, Italy",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Westminster Cathedral, London, UK",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Dilwara Temple, Mount Abu, India",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Hagia Irene Museum and Concert Hall, Istanbul",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q55",
    "question_number": 55,
    "question_text": "Polytetrafluroethylene (PTFE) coated fiberglass has been used as a roofing  membrane in",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Jawaharlal Nehru Stadium, New Delhi",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Eden Gardens Stadium, Kolkata",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Melbourne Cricket Ground Stadium, Melbourne",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Beijing National Stadium, Beijing                Architecture and Planning (AR)  Page | 35",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q56",
    "question_number": 56,
    "question_text": "A non-stop express elevator directly connects the observatory level at 80th floor of  a tower with the podium at 2nd floor level. The tower has a uniform floor-floor  height of 4 m. The elevator attains a maximum speed of 8 m/s. Assume 2 m/s2 as  net vertical acceleration and net vertical deceleration (incorporating gravity). If the  elevator starts from a state of rest from the podium, the time taken to reach the  observatory, in seconds, is _____________ (rounded off to one decimal place).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q57",
    "question_number": 57,
    "question_text": "Match the elements in Group\u2013I with the corresponding religious buildings in  Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Bell capital  (1)  Mosque  (Q)  Mehrab  (2)  Hindu Temple  (R)  Gopuram  (3)  Greek Temple  (S)  Pediment  (4)  Romanesque Church      (5)  Egyptian Temple",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 5, Q \u2013 1, R \u2013 2, S \u2013 3",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 1, R \u2013 5, S \u2013 4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 5, Q \u2013 4, R \u2013 3, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 4, Q \u2013 1, R \u2013 2, S \u2013 3                  Architecture and Planning (AR)  Page | 37",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q58",
    "question_number": 58,
    "question_text": "Match the museums in Group\u2013I with their architects in Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Indira Gandhi Rashtriya  Manav Sangrahalaya, Bhopal  (1)  Charles Correa   (Q)  Bihar Museum, Patna  (2)  Ram Sharma  (R)  Gandhi Memorial Museum,  Ahmedabad  (3)  Romi Khosla  (S)  Museum of Art and  Photography, Bengaluru  (4)  Soumitro Ghosh & Nisha  Mathew      (5)  Fumihiko Maki",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 4, Q \u2013 5, R \u2013 3, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 1, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 2, Q \u2013 3, R \u2013 1, S \u2013 4",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 2, Q \u2013 5, R \u2013 1, S \u2013 4                      Architecture and Planning (AR)  Page | 38",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q59",
    "question_number": 59,
    "question_text": "Match the specially shaped bricks in Group\u2013I with their corresponding  nomenclature in Group\u2013II.                                Group\u2013I  Group\u2013II  (P)    (1)  Plinth Header  (Q)    (2)  Bird\u2019s mouth  (R)    (3)  Squint  (S)    (4)  Double cant      (5)  Plinth stretcher",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 5, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 2, R \u2013 4, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 5, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 4, Q \u2013 1, R \u2013 2, S \u2013 5          Architecture and Planning (AR)  Page | 39",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q60",
    "question_number": 60,
    "question_text": "Which of the following statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "The unit of Lighting Power Density is W/m2.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "The unit of Lighting Power Density is cd/m2.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "The unit of Sound Power is W.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "The unit of Energy Performance Index is kWh/m2/year.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q61",
    "question_number": 61,
    "question_text": "Which of the following statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Kath-kuni construction comprises layers of stone and timber.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "N\u0101lukettu houses have a courtyard.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Ikra is a two-storeyed house with stone masonry and a flat-roof.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Bhunga has a circular plan.                  Architecture and Planning (AR)  Page | 40",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q62",
    "question_number": 62,
    "question_text": "A 5 m long Aluminium tie rod of cross-section 0.20 m \u00d7 0.04 m is subjected to a  tensile force induced by its self-weight of 21.20 kg/m considering gravitational  acceleration of 10 m/s2. If tensile Young\u2019s modulus of Aluminium is   70,000 MPa, the maximum tensile strain in the rod is  _____________\u00d710\u20136  (rounded off to two decimal places).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q63",
    "question_number": 63,
    "question_text": "The following Figure shows the excavation plan of a two room structure, where the  trench has a uniform width of 1.10 meters. If the cumulative centre line length of  the trench is 41.10 meters and the required depth of concrete to be poured is 0.30  meters, the volume of concrete in foundation, in cubic meters, will be  _____________(rounded off to two decimal places).            Architecture and Planning (AR)  Page | 41",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q64",
    "question_number": 64,
    "question_text": "The decay of sound in an enclosed lecture hall of volume 3500 m3 is shown in the  Figure below. The sound source is switched off at point P. Using the Reverberation  Time (RT60) obtained from the figure, the calculated total sound absorption of the  hall, in Sabins, is  _____________ (rounded off to the nearest integer).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q65",
    "question_number": 65,
    "question_text": "A 2 TR window air-conditioner of Energy Efficiency Ratio (EER) 3.1 is catering to  a room of volume 40 m3. The air-conditioner is operational for 600 hours during  summer on cooling mode. The compressor is also operational for the complete  duration. The total energy consumption of the air-conditioner during the above  mentioned period, in kWh, is _____________ (rounded off to nearest integer).                          Architecture and Planning (AR)  Page | 42    PART B2: FOR Planning CANDIDATES",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q66",
    "question_number": 66,
    "question_text": "Which of the following aims is set under the SVAMITVA scheme of the   Ministry of Panchayati Raj, Government of India?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Provide tap water connection to all households in rural areas.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Provide \u2018right to work\u2019 to the rural people falling Below Poverty Line.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Establish clear ownership of property in rural inhabited (Abadi) areas, by mapping  of land parcels using improvised technology.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Provide effective and efficient institutional platforms to enable the rural poor to  increase their household income by means of sustainable livelihood enhancement.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q67",
    "question_number": 67,
    "question_text": "Mass Rapid Transit System is a",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Fixed Route and Fixed Schedule service.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Fixed Route and Flexible Schedule service.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Flexible Route and Fixed Schedule service.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Flexible Route and Flexible Schedule service.            Architecture and Planning (AR)  Page | 43",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q68",
    "question_number": 68,
    "question_text": "Which of the following initiatives of the Government of India is also known as the  National Master Plan for Multi-modal Connectivity?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "PM Gati Shakti",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Bharatmala",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Parvatmala",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Sagarmala                                      Architecture and Planning (AR)  Page | 44",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q69",
    "question_number": 69,
    "question_text": "With reference to the Speed-Density diagram given below, which of the following  statements is/are correct?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Point P represents Maximum Flow",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Point P represents Jam Density",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Point Q represents Space Mean Speed for Free Flow condition",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Point Q represents Time Mean Speed                    Architecture and Planning (AR)  Page | 45",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q70",
    "question_number": 70,
    "question_text": "Which  of  the  following  statements  correctly  represent(s)  the   Demographic dividend of a country?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Share of working age population is larger than dependent population.",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Share of  working age population is lesser than dependent population.",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Demographic dividend demands more job creation.",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Demographic dividend can never lead to demographic disaster.",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q71",
    "question_number": 71,
    "question_text": "As per the URDPFI Guidelines 2015, choose the option(s) which indicate(s) the  appropriate hierarchy of plans from higher to lower order.",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Perspective Plan > Development Plan > Local Area Plan",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Development Plan >  Special Purpose Plan  > Annual Plan",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Local Area Plan > Development Plan > Annual Plan",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Special Purpose Plan  > Perspective Plan > Local Area Plan",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q72",
    "question_number": 72,
    "question_text": "In 2021, a city survey report revealed a sex ratio of 930 with an estimated increase  of 2.16% over the next 20 years. In 2041, the total population of the city is projected  to be 15,00,000. The estimated female population in the year 2041   will be ____________ (in integer).          Architecture and Planning (AR)  Page | 46",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q73",
    "question_number": 73,
    "question_text": "Match the terms in Group\u2013I with their descriptions in Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Landfill site  (1)  Development on previously  developed site   (Q)  Greenfield development  (2)  Land to dispose solid waste  (R)  Green Belt  (3)  Development on previously  undeveloped land   (S)  Brownfield development  (4)  Policy to protect livestock       (5)  A buffer to control urban  development",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 2, Q \u2013 3, R \u2013 1, S \u2013 4",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 2, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 2, Q \u2013 3, R \u2013 5, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 3, Q \u2013 4, R \u2013 5, S \u2013 2                  Architecture and Planning (AR)  Page | 47",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q74",
    "question_number": 74,
    "question_text": "Match the following illustrations in Group\u2013I with their corresponding concepts in  Group\u2013II.  Group\u2013I  Group\u2013II  (P)                (1) Figure Ground  Relationship  (Q)    (2) Town Planning  Scheme (TPS)  (R)    (3) Transit Oriented  Development (TOD)  (S)    (4) Transferable  Development Rights  (TDR)    (5) Cul-de-Sac",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 3, Q \u2013 4, R \u2013 1, S \u2013 2",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 3, Q \u2013 5, R \u2013 2, S \u2013 4",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 1, Q \u2013 3, R \u2013 4, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 2, Q \u2013 4, R \u2013 1, S \u2013 5    Architecture and Planning (AR)  Page | 48",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q75",
    "question_number": 75,
    "question_text": "Match the following planning theories/concepts in Group\u2013I with their  corresponding proponents in Group\u2013II.    Group\u2013I  Group\u2013II  (P)  Valley Section  (1)  McGee and Gemburg  (Q)  Third Place Theory  (2)  Oscar Newman  (R)  Defensible Space  (3)  Ray Oldenberg  (S)  Desakota Model  (4)  Patrick Geddes      (5)  C. A. Doxiadis",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "P \u2013 4, Q \u2013 3, R \u2013 2, S \u2013 1",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "P \u2013 4, Q \u2013 2, R \u2013 3, S \u2013 1",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "P \u2013 1, Q \u2013 3, R \u2013 5, S \u2013 2",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "P \u2013 2, Q \u2013 4, R \u2013 1, S \u2013 5                  Architecture and Planning (AR)  Page | 49",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q76",
    "question_number": 76,
    "question_text": "Which of the following methods is/are used in traffic survey to measure the Running  Speed and Journey Speed?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Moving Observer Method",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Registration Number Method",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Elevated Observer Method",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Hardy Cross Method",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q77",
    "question_number": 77,
    "question_text": "In the context of regional planning, which of the following terms   represent(s) a region?",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": [
      {
        "id": "opt_a",
        "text": "Formal",
        "is_correct": true
      },
      {
        "id": "opt_b",
        "text": "Functional",
        "is_correct": false
      },
      {
        "id": "opt_c",
        "text": "Isometric",
        "is_correct": false
      },
      {
        "id": "opt_d",
        "text": "Planning",
        "is_correct": false
      }
    ],
    "correct_answer": "opt_a",
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q78",
    "question_number": 78,
    "question_text": "In a one-way single lane traffic stream, the observed average time headway   is 2.5 seconds. The traffic flow of the above mentioned lane, in vehicle/hr,   is _____________(in integer).        Architecture and Planning (AR)  Page | 50",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q79",
    "question_number": 79,
    "question_text": "The demand of a EcoCity theme park is estimated as P = 1500 \u2212 7.5Q,   where P (in Indian Rupees) is the price of a ticket for single entry, and Q (in integer)  is the number of tickets sold per hour. The maximum revenue per hour along the  demand curve, in Indian Rupees, is _____________(in integer).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q80",
    "question_number": 80,
    "question_text": "Labour supply and urban growth are represented in X and Y axis of the Figure  below. Curve OP represents the relationship between labour supply and urban  growth.   The ratios A:A\u2019 and B:B\u2019 are 1:1.2 and 3:1.2, respectively.   If 6 units of labour is supplied in B, then the number of units of urban growth in B\u2019  will be _____________ (rounded off to one decimal place).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "gate-ar-24-q81",
    "question_number": 81,
    "question_text": "A city with a present population of 1,75,000 is expecting an annual population  growth rate of 0.85%. In a traffic assessment study, the trip generation model has  been developed as Y = 142 + 0.675X, where Y is the number of daily trips generated  within the city and X is the population of the city. The number of daily trips to be  generated within the city after 10 years is _____________(in integer).",
    "exam_code": "GATE-AR",
    "subject": "Architecture and Planning",
    "topic": "General",
    "marks": 1,
    "difficulty": "medium",
    "recommended_minutes": 2,
    "expected_points": [],
    "keywords": [],
    "model_answer": "See options",
    "evaluation_rubric": "1 mark",
    "options": null,
    "correct_answer": null,
    "year": "2024",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
];

export const SAMPLE_QUESTIONS: Question[] = rawQuestions.map((q) => {
  let qType: QuestionType;
  if (q.options && q.options.length > 0) {
    qType = 'mcq';
  } else {
    qType = 'short_answer';
  }
  return {
    ...q as any,
    exam_category: 'ENGINEERING' as ExamCategoryCode,
    question_type: qType,
  };
});

export function getQuestionsByExam(examCode: string): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.exam_code === examCode);
}

export function getRandomQuestions(count: number, examCode?: string): Question[] {
  const pool = examCode ? getQuestionsByExam(examCode) : SAMPLE_QUESTIONS;
  if (pool.length <= count) return [...pool];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const questionBank = SAMPLE_QUESTIONS;
