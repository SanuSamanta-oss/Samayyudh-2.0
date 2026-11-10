# -*- coding: utf-8 -*-
import sys, json

def build_rich_archive():
    with open('data/neet_questions.json', 'r', encoding='utf-8') as f:
        existing = json.load(f)

    existing_ids = {q['id'] for q in existing}
    new_questions = []

    # 2023 additional questions
    neet_2023_more = [
        {
            "id": "neet_2023_phy_08",
            "exam": "NEET", "year": 2023, "subject": "Physics", "chapter": "Magnetic Effects of Current", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 8, "question_type": "mcq",
            "question_statement": "A wire carrying a current $I$ along the positive x-axis has length $L$. It is kept in a magnetic field $\\vec{B} = (2\\hat{i} + 3\\hat{j} - 4\\hat{k})\\text{ T}$. The magnitude of the magnetic force acting on the wire is:",
            "options": [
                {"id": "1", "text": "$5 I L$", "is_correct": True},
                {"id": "2", "text": "$\\sqrt{29} I L$", "is_correct": False},
                {"id": "3", "text": "$3 I L$", "is_correct": False},
                {"id": "4", "text": "$7 I L$", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Magnetic force on a current-carrying wire is $\\vec{F} = I (\\vec{L} \\times \\vec{B})$. Here $\\vec{L} = L \\hat{i}$. $\\vec{L} \\times \\vec{B} = L\\hat{i} \\times (2\\hat{i} + 3\\hat{j} - 4\\hat{k}) = 3L \\hat{k} + 4L \\hat{j}$. Magnitude $|\\vec{F}| = I \\sqrt{(3L)^2 + (4L)^2} = I \\sqrt{9L^2 + 16L^2} = 5 I L$."
        },
        {
            "id": "neet_2023_chem_06",
            "exam": "NEET", "year": 2023, "subject": "Chemistry", "chapter": "Coordination Compounds", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 56, "question_type": "mcq",
            "question_statement": "The IUPAC name of the complex $[\\text{Co}(\\text{NH}_3)_5(\\text{CO}_3)]\\text{Cl}$ is:",
            "options": [
                {"id": "1", "text": "Pentaamminecarbonatocobalt(III) chloride", "is_correct": True},
                {"id": "2", "text": "Carbonatopentaamminecobalt(III) chloride", "is_correct": False},
                {"id": "3", "text": "Pentaamminecarbonatocobalt(II) chloride", "is_correct": False},
                {"id": "4", "text": "Pentaamminechloridocobalt(III) carbonate", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Ligands are named in alphabetical order: 'ammine' comes before 'carbonato'. Oxidation state of Co: $x + 5(0) + (-2) + (-1) = 0 \\implies x = +3$. Hence, the IUPAC name is Pentaamminecarbonatocobalt(III) chloride."
        },
        {
            "id": "neet_2023_bot_04",
            "exam": "NEET", "year": 2023, "subject": "Botany", "chapter": "Microbes in Human Welfare", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 104, "question_type": "mcq",
            "question_statement": "Which of the following is used as a clot buster for removing clots from the blood vessels of patients who have undergone myocardial infarction?",
            "options": [
                {"id": "1", "text": "Streptokinase produced by *Streptococcus*", "is_correct": True},
                {"id": "2", "text": "Cyclosporin A produced by *Trichoderma*", "is_correct": False},
                {"id": "3", "text": "Statins produced by *Monascus*", "is_correct": False},
                {"id": "4", "text": "Lipase produced by *Candida*", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Streptokinase produced by the bacterium *Streptococcus* and modified by genetic engineering is used as a 'clot buster' for removing clots from the blood vessels of patients who have suffered myocardial infarction leading to heart attack."
        },
        {
            "id": "neet_2023_zoo_04",
            "exam": "NEET", "year": 2023, "subject": "Zoology", "chapter": "Chemical Coordination & Integration", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 154, "question_type": "mcq",
            "question_statement": "Select the hormone that stimulates the reabsorption of water and electrolytes by the DCT to prevent diuresis:",
            "options": [
                {"id": "1", "text": "Vasopressin (Anti-Diuretic Hormone, ADH)", "is_correct": True},
                {"id": "2", "text": "Oxytocin", "is_correct": False},
                {"id": "3", "text": "Prolactin", "is_correct": False},
                {"id": "4", "text": "Luteinizing Hormone (LH)", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Vasopressin or ADH acts mainly at the kidney and stimulates resorption of water and electrolytes by the distal tubules and collecting ducts, thereby preventing diuresis (excess water loss)."
        }
    ]

    # 2022 additional questions
    neet_2022_more = [
        {
            "id": "neet_2022_phy_04",
            "exam": "NEET", "year": 2022, "subject": "Physics", "chapter": "Gravitation", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 4, "question_type": "mcq",
            "question_statement": "A body weighs $250\\text{ N}$ on the surface of the earth. How much will it weigh half way down to the centre of the earth?",
            "options": [
                {"id": "1", "text": "$125\\text{ N}$", "is_correct": True},
                {"id": "2", "text": "$150\\text{ N}$", "is_correct": False},
                {"id": "3", "text": "$200\\text{ N}$", "is_correct": False},
                {"id": "4", "text": "$62.5\\text{ N}$", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Acceleration due to gravity at depth $d$ is $g' = g\\left(1 - \\frac{d}{R}\\right)$. At $d = \\frac{R}{2}$, $g' = g\\left(1 - \\frac{1}{2}\\right) = \\frac{g}{2}$. Hence, weight $W' = m g' = \\frac{W}{2} = \\frac{250}{2} = 125\\text{ N}$."
        },
        {
            "id": "neet_2022_chem_03",
            "exam": "NEET", "year": 2022, "subject": "Chemistry", "chapter": "Organic Chemistry: Biomolecules", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 53, "question_type": "mcq",
            "question_statement": "The deficiency of which vitamin causes Cheilosis (fissuring at corners of mouth and lips)?",
            "options": [
                {"id": "1", "text": "Vitamin $\\text{B}_2$ (Riboflavin)", "is_correct": True},
                {"id": "2", "text": "Vitamin $\\text{B}_1$ (Thiamine)", "is_correct": False},
                {"id": "3", "text": "Vitamin $\\text{B}_{12}$", "is_correct": False},
                {"id": "4", "text": "Vitamin C (Ascorbic acid)", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Deficiency of Vitamin $\\text{B}_2$ (Riboflavin) causes cheilosis, glossitis (inflammation of the tongue), and digestive disorders."
        },
        {
            "id": "neet_2022_bot_03",
            "exam": "NEET", "year": 2022, "subject": "Botany", "chapter": "Ecology & Environment", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 103, "question_type": "mcq",
            "question_statement": "Which of the following is an ex-situ conservation method for endangered species?",
            "options": [
                {"id": "1", "text": "Cryopreservation of gametes and Botanical Gardens", "is_correct": True},
                {"id": "2", "text": "National Parks", "is_correct": False},
                {"id": "3", "text": "Wildlife Sanctuaries", "is_correct": False},
                {"id": "4", "text": "Biosphere Reserves", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "In ex-situ conservation, threatened animals and plants are taken out from their natural habitat and placed in special settings like zoological parks, botanical gardens, wildlife safari parks, seed banks, and cryopreservation facilities."
        },
        {
            "id": "neet_2022_zoo_03",
            "exam": "NEET", "year": 2022, "subject": "Zoology", "chapter": "Structural Organisation in Animals", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 153, "question_type": "mcq",
            "question_statement": "Ciliated epithelial cells are required to move particles or mucus in a specific direction. In humans, these cells are mainly present in:",
            "options": [
                {"id": "1", "text": "Bronchioles and Fallopian tubes", "is_correct": True},
                {"id": "2", "text": "Bile duct and Bronchioles", "is_correct": False},
                {"id": "3", "text": "Fallopian tubes and Pancreatic duct", "is_correct": False},
                {"id": "4", "text": "Eustachian tube and Stomach", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Ciliated epithelium is found on the inner surface of hollow organs like bronchioles (to move mucus towards the pharynx) and Fallopian tubes (to move the ovum towards the uterus)."
        }
    ]

    # 2021 additional questions
    neet_2021_more = [
        {
            "id": "neet_2021_phy_03",
            "exam": "NEET", "year": 2021, "subject": "Physics", "chapter": "Wave Optics", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 3, "question_type": "mcq",
            "question_statement": "In Young's double slit experiment, if the separation between the slits is halved and the distance between the slits and screen is doubled, the fringe width will:",
            "options": [
                {"id": "1", "text": "Become four times", "is_correct": True},
                {"id": "2", "text": "Remain unchanged", "is_correct": False},
                {"id": "3", "text": "Be halved", "is_correct": False},
                {"id": "4", "text": "Become two times", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Fringe width is $\\beta = \\frac{\\lambda D}{d}$. Given $d' = d/2$ and $D' = 2D$. New fringe width $\\beta' = \\frac{\\lambda (2D)}{(d/2)} = 4 \\frac{\\lambda D}{d} = 4\\beta$. It becomes four times."
        },
        {
            "id": "neet_2021_chem_03",
            "exam": "NEET", "year": 2021, "subject": "Chemistry", "chapter": "Atomic Structure", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 53, "question_type": "mcq",
            "question_statement": "A particular station of All India Radio, New Delhi broadcasts on a frequency of $1368\\text{ kHz}$. The wavelength of the electromagnetic radiation emitted by the transmitter is:",
            "options": [
                {"id": "1", "text": "$219.3\\text{ m}$", "is_correct": True},
                {"id": "2", "text": "$219.2\\text{ cm}$", "is_correct": False},
                {"id": "3", "text": "$21.92\\text{ m}$", "is_correct": False},
                {"id": "4", "text": "$2193\\text{ m}$", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Wavelength $\\lambda = \\frac{c}{\\nu} = \\frac{3 \\times 10^8\\text{ m/s}}{1368 \\times 10^3\\text{ s}^{-1}} \\approx 219.3\\text{ m}$."
        },
        {
            "id": "neet_2021_bot_03",
            "exam": "NEET", "year": 2021, "subject": "Botany", "chapter": "Principles of Inheritance & Variation", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 103, "question_type": "mcq",
            "question_statement": "The production of gametes by the parents, formation of zygotes, the $F_1$ and $F_2$ plants, can be understood from a diagrammatic representation called:",
            "options": [
                {"id": "1", "text": "Punnett square", "is_correct": True},
                {"id": "2", "text": "Net square", "is_correct": False},
                {"id": "3", "text": "Bullet square", "is_correct": False},
                {"id": "4", "text": "Punch square", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "The production of gametes by the parents, the formation of the zygotes, the $F_1$ and $F_2$ plants can be understood from a diagram called Punnett square developed by the British geneticist, Reginald C. Punnett."
        },
        {
            "id": "neet_2021_zoo_03",
            "exam": "NEET", "year": 2021, "subject": "Zoology", "chapter": "Animal Kingdom", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 153, "question_type": "mcq",
            "question_statement": "Which of the following organisms possesses a water vascular system that helps in locomotion, capture and transport of food and respiration?",
            "options": [
                {"id": "1", "text": "*Asterias* (Starfish)", "is_correct": True},
                {"id": "2", "text": "*Pila* (Apple snail)", "is_correct": False},
                {"id": "3", "text": "*Ascaris*", "is_correct": False},
                {"id": "4", "text": "*Hirudinaria*", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "The most distinctive feature of echinoderms (e.g. *Asterias*, sea urchin) is the presence of a water vascular system which helps in locomotion, capture and transport of food, and respiration."
        }
    ]

    # 2020 additional questions
    neet_2020_more = [
        {
            "id": "neet_2020_phy_03",
            "exam": "NEET", "year": 2020, "subject": "Physics", "chapter": "Atomic Physics", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 3, "question_type": "mcq",
            "question_statement": "For which one of the following Bohr's model is not valid?",
            "options": [
                {"id": "1", "text": "Singly ionised neon atom ($\\text{Ne}^+$)", "is_correct": True},
                {"id": "2", "text": "Hydrogen atom", "is_correct": False},
                {"id": "3", "text": "Singly ionised helium atom ($\\text{He}^+$)", "is_correct": False},
                {"id": "4", "text": "Deuteron atom", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Bohr's model is applicable only to single-electron species (hydrogen-like atoms). Singly ionised neon ($\\text{Ne}^+$) has 9 electrons, so Bohr's model is not applicable."
        },
        {
            "id": "neet_2020_chem_03",
            "exam": "NEET", "year": 2020, "subject": "Chemistry", "chapter": "Aldehydes, Ketones & Carboxylic Acids", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 53, "question_type": "mcq",
            "question_statement": "Reaction between benzaldehyde and acetophenone in presence of dilute $\\text{NaOH}$ is known as:",
            "options": [
                {"id": "1", "text": "Cross Aldol condensation", "is_correct": True},
                {"id": "2", "text": "Cannizzaro reaction", "is_correct": False},
                {"id": "3", "text": "Cross Cannizzaro reaction", "is_correct": False},
                {"id": "4", "text": "Aldol condensation", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Benzaldehyde (no $\\alpha$-hydrogen) reacts with acetophenone (has $\\alpha$-hydrogen) in the presence of dilute base. This is an example of a Cross Aldol condensation (Claisen-Schmidt condensation)."
        },
        {
            "id": "neet_2020_bot_03",
            "exam": "NEET", "year": 2020, "subject": "Botany", "chapter": "Photosynthesis in Higher Plants", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 103, "question_type": "mcq",
            "question_statement": "In light reaction, plastocyanin facilitates the transfer of electrons from:",
            "options": [
                {"id": "1", "text": "Cyt $b_6f$ complex to PS I", "is_correct": True},
                {"id": "2", "text": "PS I to $\\text{NADP}^+$", "is_correct": False},
                {"id": "3", "text": "PS I to ATP synthase", "is_correct": False},
                {"id": "4", "text": "PS II to Cyt $b_6f$ complex", "is_correct": False}
            ],
            "correct_option": "1",
            "explanation": "Plastocyanin is a small, mobile, copper-containing protein found on the inner surface of the thylakoid membrane. It accepts electrons from the Cytochrome $b_6f$ complex and delivers them to the reaction center $\\text{P}_{700}$ of Photosystem I (PS I)."
        },
        {
            "id": "neet_2020_zoo_03",
            "exam": "NEET", "year": 2020, "subject": "Zoology", "chapter": "Reproduction in Organisms", "section": "Section A",
            "marks": 4, "negative_marks": 1, "question_number": 153, "question_type": "mcq",
            "question_statement": "Which of the following is not an invasive alien species introduced into India?",
            "options": [
                {"id": "1", "text": "*Parthenium hysterophorus* (Carrot grass)", "is_correct": False},
                {"id": "2", "text": "*Eichhornia crassipes* (Water hyacinth)", "is_correct": False},
                {"id": "3", "text": "*Lantana camara*", "is_correct": False},
                {"id": "4", "text": "*Ocimum sanctum* (Tulsi)", "is_correct": True}
            ],
            "correct_option": "4",
            "explanation": "*Ocimum sanctum* (Tulsi) is an indigenous sacred medicinal plant native to the Indian subcontinent. *Parthenium*, *Eichhornia*, and *Lantana* are notorious alien invasive species introduced from the Americas."
        }
    ]

    # Combine
    all_new = neet_2023_more + neet_2022_more + neet_2021_more + neet_2020_more
    added_count = 0
    for q in all_new:
        if q['id'] not in existing_ids:
            existing.append(q)
            existing_ids.add(q['id'])
            added_count += 1

    with open('data/neet_questions.json', 'w', encoding='utf-8') as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"Added {added_count} more questions. Total now: {len(existing)}")

if __name__ == '__main__':
    build_rich_archive()

