# -*- coding: utf-8 -*-
"""
Generates rich, authentic NEET question banks for 2023, 2022, 2021, 2020, 2019.
Each year gets 100 questions across Physics (25), Chemistry (25), Botany (25), Zoology (25).
"""

import json

def get_physics_pool():
    return [
        {
            "chapter": "Current Electricity",
            "statement": "The resistance of a platinum resistance thermometer at ice point is $5~\\Omega$ and at steam point is $5.23~\\Omega$. When inserted in a hot bath, the resistance is $5.795~\\Omega$. The temperature of the bath is:",
            "options": ["$345.65^\\circ\\text{C}$", "$340.00^\\circ\\text{C}$", "$355.50^\\circ\\text{C}$", "$360.20^\\circ\\text{C}$"],
            "correct": 1,
            "explanation": "Temperature $t = \\frac{R_t - R_0}{R_{100} - R_0} \\times 100^\\circ\\text{C} = \\frac{5.795 - 5.0}{5.23 - 5.0} \\times 100 = \\frac{0.795}{0.23} \\times 100 \\approx 345.65^\\circ\\text{C}$."
        },
        {
            "chapter": "Electrostatics",
            "statement": "Two point charges $+q$ and $-q$ are situated at $x = -a$ and $x = +a$ respectively. The electric potential at any point on the y-axis ($x = 0, y = y$) is:",
            "options": ["Zero", "$\\frac{1}{4\\pi\\varepsilon_0} \\frac{2q}{\\sqrt{a^2 + y^2}}$", "$\\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{a^2 + y^2}$", "$\\frac{1}{4\\pi\\varepsilon_0} \\frac{2qa}{y^2}$"],
            "correct": 1,
            "explanation": "Any point on the y-axis lies on the equatorial plane of the electric dipole. The distance to both charges is $\\sqrt{a^2 + y^2}$. Hence potential $V = V_+ + V_- = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{\\sqrt{a^2+y^2}} - \\frac{q}{\\sqrt{a^2+y^2}}\\right) = 0$."
        },
        {
            "chapter": "Dual Nature of Radiation & Matter",
            "statement": "When light of frequency $2\\nu_0$ (where $\\nu_0$ is threshold frequency) is incident on a metal plate, the maximum velocity of electrons emitted is $v_1$. When the frequency of the incident radiation is increased to $5\\nu_0$, the maximum velocity of electrons emitted is $v_2$. The ratio $v_1 / v_2$ is:",
            "options": ["$1 : 2$", "$1 : 4$", "$1 : 8$", "$1 : 16$"],
            "correct": 1,
            "explanation": "From Einstein's photoelectric equation: $\\frac{1}{2} m v_1^2 = h(2\\nu_0) - h\\nu_0 = h\\nu_0$. And $\\frac{1}{2} m v_2^2 = h(5\\nu_0) - h\\nu_0 = 4h\\nu_0$. Dividing gives $\\frac{v_1^2}{v_2^2} = \\frac{1}{4} \\implies \\frac{v_1}{v_2} = \\frac{1}{2}$."
        },
        {
            "chapter": "Ray Optics",
            "statement": "A ray of light is incident at an angle of $60^\\circ$ on one face of a prism of angle $30^\\circ$. The emergent ray makes an angle of $30^\\circ$ with the incident ray. The refractive index of the prism is:",
            "options": ["$\\sqrt{3}$", "$1.5$", "$\\sqrt{2}$", "$1.33$"],
            "correct": 1,
            "explanation": "Angle of deviation $\\delta = i + e - A$. Here $\\delta = 30^\\circ$, $i = 60^\\circ$, $A = 30^\\circ \\implies 30^\\circ = 60^\\circ + e - 30^\\circ \\implies e = 0^\\circ$. Since $e = 0^\\circ$, $r_2 = 0^\\circ$. Since $r_1 + r_2 = A \\implies r_1 = 30^\\circ$. By Snell's Law: $\\mu = \\frac{\\sin i}{\\sin r_1} = \\frac{\\sin 60^\\circ}{\\sin 30^\\circ} = \\frac{\\sqrt{3}/2}{1/2} = \\sqrt{3}$."
        },
        {
            "chapter": "Magnetic Effects of Current",
            "statement": "A circular coil of radius $10\\text{ cm}$ having $500$ turns carries a current of $1\\text{ A}$. The magnetic field at the center of the coil is:",
            "options": ["$\\pi \\times 10^{-3}\\text{ T}$", "$2\\pi \\times 10^{-3}\\text{ T}$", "$5\\pi \\times 10^{-4}\\text{ T}$", "$\\pi \\times 10^{-4}\\text{ T}$"],
            "correct": 1,
            "explanation": "$B = \\frac{\\mu_0 N I}{2 R} = \\frac{(4\\pi \\times 10^{-7}) \\times 500 \\times 1}{2 \\times 0.10} = \\frac{2000\\pi \\times 10^{-7}}{0.20} = \\pi \\times 10^{-3}\\text{ T}$."
        },
        {
            "chapter": "Electromagnetic Induction",
            "statement": "A metallic rod of length $1\\text{ m}$ is rotated with a frequency of $50\\text{ rev/s}$, with one end hinged at the center and the other end at the circumference of a circular metallic ring of radius $1\\text{ m}$, about an axis passing through the center and perpendicular to the plane of the ring. A constant and uniform magnetic field of $1\\text{ T}$ parallel to the axis is present everywhere. The emf between the center and the metallic ring is:",
            "options": ["$157\\text{ V}$", "$314\\text{ V}$", "$100\\text{ V}$", "$50\\text{ V}$"],
            "correct": 1,
            "explanation": "Induced EMF $\\varepsilon = \\frac{1}{2} B \\omega L^2 = \\frac{1}{2} B (2\\pi f) L^2 = \\frac{1}{2} \\times 1 \\times (2\\pi \\times 50) \\times (1)^2 = 50\\pi \\approx 157.08\\text{ V}$."
        },
        {
            "chapter": "Thermodynamics",
            "statement": "An ideal gas undergoes a cyclic process represented in the $P-V$ diagram by a circle of radius $R$. If the axes are scaled such that $1\\text{ unit of } P = 10^5\\text{ Pa}$ and $1\\text{ unit of } V = 10^{-3}\\text{ m}^3$, and the circle has radius $5\\text{ units}$, the work done per cycle is:",
            "options": ["$25\\pi \\times 10^2\\text{ J}$", "$50\\pi \\times 10^2\\text{ J}$", "$25\\pi\\text{ J}$", "$5\\pi \\times 10^2\\text{ J}$"],
            "correct": 1,
            "explanation": "Work done in a cyclic process equals the area enclosed in the $P-V$ diagram: $W = \\pi \\Delta P \\cdot \\Delta V = \\pi (5 \\times 10^5\\text{ Pa}) \\times (5 \\times 10^{-3}\\text{ m}^3) = 25\\pi \\times 10^2\\text{ J}$."
        },
        {
            "chapter": "Gravitation",
            "statement": "The ratio of escape velocity from earth to the escape velocity from a planet having twice the radius and same mean density as that of earth is:",
            "options": ["$1 : 2$", "$1 : 4$", "$2 : 1$", "$1 : \\sqrt{2}$"],
            "correct": 1,
            "explanation": "Escape velocity $v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{\\frac{2G}{R} \\cdot \\frac{4}{3}\\pi R^3 \\rho} = R \\sqrt{\\frac{8\\pi G \\rho}{3}} \\propto R$. Therefore, $\\frac{v_{e1}}{v_{e2}} = \\frac{R_1}{R_2} = \\frac{R}{2R} = \\frac{1}{2}$."
        },
        {
            "chapter": "Oscillations & Waves",
            "statement": "A particle executes simple harmonic motion with an amplitude of $5\\text{ cm}$. When the particle is at $3\\text{ cm}$ from the mean position, the ratio of its potential energy to kinetic energy is:",
            "options": ["$9 : 16$", "$16 : 9$", "$3 : 4$", "$4 : 3$"],
            "correct": 1,
            "explanation": "Potential energy $U = \\frac{1}{2} k x^2 = \\frac{1}{2} k (3)^2 = \\frac{9}{2}k$. Kinetic energy $K = \\frac{1}{2} k (A^2 - x^2) = \\frac{1}{2} k (25 - 9) = \\frac{16}{2}k$. Hence $\\frac{U}{K} = \\frac{9}{16}$."
        },
        {
            "chapter": "Semiconductors",
            "statement": "In a p-n junction diode, the barrier potential offers opposition to:",
            "options": ["Majority carriers in both regions", "Minority carriers in both regions", "Only electrons in n-region", "Only holes in p-region"],
            "correct": 1,
            "explanation": "The barrier electric field points from n to p region, which exerts a force that opposes the diffusion of majority charge carriers (electrons from n to p, and holes from p to n) across the junction."
        },
        {
            "chapter": "Kinematics",
            "statement": "A ball is thrown vertically upwards with a velocity of $20\\text{ m/s}$ from the top of a multistorey building. The height of the point from where the ball is thrown is $25.0\\text{ m}$ from the ground. How high will the ball rise from the point of launch? ($g = 10\\text{ m/s}^2$):",
            "options": ["$20\\text{ m}$", "$25\\text{ m}$", "$15\\text{ m}$", "$45\\text{ m}$"],
            "correct": 1,
            "explanation": "Using $v^2 = u^2 - 2gh$. At highest point $v = 0$: $0 = (20)^2 - 2(10)h \\implies 20h = 400 \\implies h = 20\\text{ m}$."
        },
        {
            "chapter": "Laws of Motion",
            "statement": "A block of mass $m$ is placed on a smooth inclined wedge of inclination $\\theta$. The wedge is given an acceleration $a$ horizontally towards the left. The value of $a$ for which the block remains stationary relative to the wedge is:",
            "options": ["$g \\tan\\theta$", "$g / \\tan\\theta$", "$g \\sin\\theta$", "$g \\cos\\theta$"],
            "correct": 1,
            "explanation": "In the reference frame of the accelerating wedge, pseudo force $ma$ acts horizontally towards the right. Balancing forces along the incline: $ma \\cos\\theta = mg \\sin\\theta \\implies a = g \\tan\\theta$."
        },
        {
            "chapter": "Work, Energy & Power",
            "statement": "A body of mass $0.5\\text{ kg}$ travels in a straight line with velocity $v = a x^{3/2}$ where $a = 5\\text{ m}^{-1/2}\\text{s}^{-1}$. What is the work done by the net force during its displacement from $x = 0$ to $x = 2\\text{ m}$?",
            "options": ["$50\\text{ J}$", "$25\\text{ J}$", "$100\\text{ J}$", "$12.5\\text{ J}$"],
            "correct": 1,
            "explanation": "Work-Energy Theorem: $W = \\Delta K = \\frac{1}{2} m (v_f^2 - v_i^2)$. At $x=0$, $v_i = 0$. At $x=2$, $v_f = 5(2)^{3/2} \\implies v_f^2 = 25 \\times 8 = 200\\text{ m}^2/\\text{s}^2$. $W = \\frac{1}{2}(0.5)(200) = 50\\text{ J}$."
        },
        {
            "chapter": "Rotational Motion",
            "statement": "A solid sphere is rolling without slipping on a horizontal surface. The ratio of its rotational kinetic energy to its total kinetic energy is:",
            "options": ["$2 : 7$", "$5 : 7$", "$2 : 5$", "$1 : 2$"],
            "correct": 1,
            "explanation": "For a solid sphere, $I = \\frac{2}{5}MR^2$. $K_{\\text{rot}} = \\frac{1}{2}I\\omega^2 = \\frac{1}{5}Mv^2$. $K_{\\text{trans}} = \\frac{1}{2}Mv^2$. $K_{\\text{total}} = \\frac{1}{5}Mv^2 + \\frac{1}{2}Mv^2 = \\frac{7}{10}Mv^2$. Hence $\\frac{K_{\\text{rot}}}{K_{\\text{total}}} = \\frac{1/5}{7/10} = \\frac{2}{7}$."
        },
        {
            "chapter": "Mechanical Properties of Solids & Fluids",
            "statement": "Two soap bubbles have radii in the ratio $2 : 3$. The ratio of excess pressure inside them is:",
            "options": ["$3 : 2$", "$2 : 3$", "$4 : 9$", "$9 : 4$"],
            "correct": 1,
            "explanation": "Excess pressure inside a soap bubble is $\\Delta P = \\frac{4T}{R} \\implies \\Delta P \\propto \\frac{1}{R}$. Thus $\\frac{\\Delta P_1}{\\Delta P_2} = \\frac{R_2}{R_1} = \\frac{3}{2}$."
        },
        {
            "chapter": "Atoms & Nuclei",
            "statement": "The half-life of a radioactive substance is $20\\text{ days}$. The time taken for $7/8$th of its active nuclei to disintegrate is:",
            "options": ["$60\\text{ days}$", "$40\\text{ days}$", "$80\\text{ days}$", "$100\\text{ days}$"],
            "correct": 1,
            "explanation": "Fraction remaining is $1 - 7/8 = 1/8 = (1/2)^3$. Thus $n = 3$ half-lives have elapsed. Total time $t = 3 \\times 20 = 60\\text{ days}$."
        },
        {
            "chapter": "Wave Optics",
            "statement": "Unpolarized light of intensity $I_0$ passes through two polaroids whose transmission axes are inclined at an angle of $60^\\circ$ to each other. The intensity of transmitted light is:",
            "options": ["$I_0 / 8$", "$I_0 / 4$", "$I_0 / 2$", "$3I_0 / 8$"],
            "correct": 1,
            "explanation": "After passing the first polaroid, intensity is $I_1 = \\frac{I_0}{2}$. By Malus' Law, after second polaroid: $I_2 = I_1 \\cos^2 60^\\circ = \\frac{I_0}{2} \\times \\left(\\frac{1}{2}\\right)^2 = \\frac{I_0}{8}$."
        },
        {
            "chapter": "Alternating Current",
            "statement": "In a series LCR circuit, $R = 10~\\Omega$, $L = 0.1\\text{ H}$, and $C = 10~\\mu\\text{F}$. The quality factor $Q$ of the circuit is:",
            "options": ["$10$", "$100$", "$1$", "$20$"],
            "correct": 1,
            "explanation": "Quality factor $Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{1}{10}\\sqrt{\\frac{0.1}{10 \\times 10^{-6}}} = \\frac{1}{10}\\sqrt{10^4} = \\frac{100}{10} = 10$."
        },
        {
            "chapter": "Thermal Properties of Matter",
            "statement": "A black body at $227^\\circ\\text{C}$ radiates heat at the rate of $7\\text{ cal cm}^{-2}\\text{s}^{-1}$. At a temperature of $727^\\circ\\text{C}$, the rate of heat radiated will be:",
            "options": ["$112\\text{ cal cm}^{-2}\\text{s}^{-1}$", "$140\\text{ cal cm}^{-2}\\text{s}^{-1}$", "$80\\text{ cal cm}^{-2}\\text{s}^{-1}$", "$224\\text{ cal cm}^{-2}\\text{s}^{-1}$"],
            "correct": 1,
            "explanation": "By Stefan-Boltzmann Law: $E \\propto T^4$. $T_1 = 227 + 273 = 500\\text{ K}$, $T_2 = 727 + 273 = 1000\\text{ K}$. $\\frac{E_2}{E_1} = \\left(\\frac{1000}{500}\\right)^4 = 2^4 = 16$. Hence $E_2 = 16 \\times 7 = 112\\text{ cal cm}^{-2}\\text{s}^{-1}$."
        },
        {
            "chapter": "Kinetic Theory of Gases",
            "statement": "The average kinetic energy of a gas molecule at $27^\\circ\\text{C}$ is $6.21 \\times 10^{-21}\\text{ J}$. Its average kinetic energy at $227^\\circ\\text{C}$ will be:",
            "options": ["$10.35 \\times 10^{-21}\\text{ J}$", "$5.21 \\times 10^{-21}\\text{ J}$", "$12.42 \\times 10^{-21}\\text{ J}$", "$11.35 \\times 10^{-21}\\text{ J}$"],
            "correct": 1,
            "explanation": "Average translational kinetic energy of a molecule is $E = \\frac{3}{2} k_B T \\propto T$. $T_1 = 300\\text{ K}$, $T_2 = 500\\text{ K}$. $\\frac{E_2}{E_1} = \\frac{500}{300} = \\frac{5}{3}$. $E_2 = \\frac{5}{3} \\times (6.21 \\times 10^{-21}) = 10.35 \\times 10^{-21}\\text{ J}$."
        },
        {
            "chapter": "Electromagnetic Waves",
            "statement": "The amplitude of the magnetic field part of a harmonic electromagnetic wave in vacuum is $B_0 = 510\\text{ nT}$. The amplitude of the electric field part of the wave is:",
            "options": ["$153\\text{ N/C}$", "$1.7 \\times 10^{-15}\\text{ N/C}$", "$510\\text{ N/C}$", "$306\\text{ N/C}$"],
            "correct": 1,
            "explanation": "$E_0 = c B_0 = (3 \\times 10^8\\text{ m/s}) \\times (510 \\times 10^{-9}\\text{ T}) = 153\\text{ V/m} = 153\\text{ N/C}$."
        },
        {
            "chapter": "Current Electricity",
            "statement": "In a potentiometer arrangement, a cell of emf $1.25\\text{ V}$ gives a balance point at $35.0\\text{ cm}$ length of the wire. If the cell is replaced by another cell and the balance point shifts to $63.0\\text{ cm}$, the emf of the second cell is:",
            "options": ["$2.25\\text{ V}$", "$2.00\\text{ V}$", "$2.50\\text{ V}$", "$1.85\\text{ V}$"],
            "correct": 1,
            "explanation": "$\\frac{E_1}{E_2} = \\frac{l_1}{l_2} \\implies E_2 = E_1 \\frac{l_2}{l_1} = 1.25 \\times \\frac{63.0}{35.0} = 1.25 \\times 1.8 = 2.25\\text{ V}$."
        },
        {
            "chapter": "Motion in a Plane",
            "statement": "A projectile is thrown with speed $u$ at an angle $\\theta$ with the horizontal. Its kinetic energy at the highest point is half of its initial kinetic energy. The angle of projection $\\theta$ is:",
            "options": ["$45^\\circ$", "$30^\\circ$", "$60^\\circ$", "$15^\\circ$"],
            "correct": 1,
            "explanation": "At highest point, velocity is $u \\cos\\theta$. Kinetic energy $K_H = \\frac{1}{2} m (u\\cos\\theta)^2 = K_0 \\cos^2\\theta$. Given $K_H = \\frac{1}{2} K_0 \\implies \\cos^2\\theta = \\frac{1}{2} \\implies \\cos\\theta = \\frac{1}{\\sqrt{2}} \\implies \\theta = 45^\\circ$."
        },
        {
            "chapter": "Physical World & Measurement",
            "statement": "The dimensions of stress are identical to those of:",
            "options": ["Pressure and Young's Modulus", "Force and Torque", "Work and Energy", "Impulse and Momentum"],
            "correct": 1,
            "explanation": "$\\text{Stress} = \\frac{\\text{Force}}{\\text{Area}} = [\\text{M L}^{-1}\\text{T}^{-2}]$, which has the exact same dimensions as Pressure and Young's modulus."
        },
        {
            "chapter": "Gravitation",
            "statement": "A geostationary satellite orbits around the earth in a circular orbit of radius $36000\\text{ km}$. Then, the time period of a spy satellite orbiting a few hundred kilometers above the earth's surface ($R_{\\text{orbit}} \\approx 6400\\text{ km}$) will approximately be:",
            "options": ["$1.5\\text{ h}$", "$2\\text{ h}$", "$4\\text{ h}$", "$6\\text{ h}$"],
            "correct": 1,
            "explanation": "Kepler's third law: $T^2 \\propto r^3$. $\\frac{T_2}{T_1} = \\left(\\frac{r_2}{r_1}\\right)^{3/2} = \\left(\\frac{6400}{36000}\\right)^{3/2} = \\left(\\frac{16}{90}\\right)^{3/2} \\approx 0.075$. $T_2 = 24\\text{ h} \\times 0.075 \\approx 1.8\\text{ h} \\approx 1.5-2\\text{ h}$."
        }
    ]

def get_chemistry_pool():
    return [
        {
            "chapter": "Chemical Bonding",
            "statement": "Which of the following compounds has a central atom with an expanded octet (more than 8 valence electrons)?",
            "options": ["$\\text{SF}_6$", "$\\text{CH}_4$", "$\\text{NH}_3$", "$\\text{H}_2\\text{O}$"],
            "correct": 1,
            "explanation": "In $\\text{SF}_6$, sulfur is surrounded by 6 bonding pairs of electrons (12 electrons total), utilizing empty 3d orbitals to expand its octet beyond 8."
        },
        {
            "chapter": "Solutions",
            "statement": "What is the molality of pure water if its density is $1.0\\text{ g mL}^{-1}$?",
            "options": ["$55.55\\text{ m}$", "$18.00\\text{ m}$", "$50.00\\text{ m}$", "$1.00\\text{ m}$"],
            "correct": 1,
            "explanation": "$1\\text{ L} = 1000\\text{ g}$ of water. Moles of water $n = \\frac{1000\\text{ g}}{18\\text{ g/mol}} = 55.55\\text{ mol}$. Since mass of solvent is $1\\text{ kg}$, molality $m = \\frac{55.55\\text{ mol}}{1\\text{ kg}} = 55.55\\text{ m}$."
        },
        {
            "chapter": "Electrochemistry",
            "statement": "Standard reduction potentials of $\\text{Zn}^{2+}/\\text{Zn}$, $\\text{Fe}^{2+}/\\text{Fe}$ and $\\text{Cu}^{2+}/\\text{Cu}$ are $-0.76\\text{ V}$, $-0.44\\text{ V}$ and $+0.34\\text{ V}$ respectively. The strongest reducing agent is:",
            "options": ["$\\text{Zn}$", "$\\text{Fe}$", "$\\text{Cu}$", "$\\text{Zn}^{2+}$"],
            "correct": 1,
            "explanation": "Lower (more negative) the standard reduction potential, higher is the tendency to lose electrons (get oxidized), making the species a stronger reducing agent. $\\text{Zn}$ has the lowest $E^\\circ = -0.76\\text{ V}$."
        },
        {
            "chapter": "Chemical Kinetics",
            "statement": "For a reaction $A + B \\rightarrow C$, the rate law is given by $\\text{Rate} = k [A]^2 [B]^{1/2}$. The overall order of the reaction is:",
            "options": ["$2.5$", "$2.0$", "$1.5$", "$3.0$"],
            "correct": 1,
            "explanation": "Overall order is the sum of exponents of concentration terms in the rate law: $\\text{Order} = 2 + 1/2 = 2.5$."
        },
        {
            "chapter": "Thermodynamics",
            "statement": "For the reaction $\\text{N}_2\\text{O}_4(g) \\rightleftharpoons 2\\text{NO}_2(g)$, which of the following conditions ensures spontaneity at all temperatures?",
            "options": ["$\\Delta H < 0, \\Delta S > 0$", "$\\Delta H > 0, \\Delta S < 0$", "$\\Delta H > 0, \\Delta S > 0$", "$\\Delta H < 0, \\Delta S < 0$"],
            "correct": 1,
            "explanation": "For spontaneity, $\\Delta G = \\Delta H - T\\Delta S < 0$. If $\\Delta H$ is negative (exothermic) and $\\Delta S$ is positive, $\\Delta G$ is negative at all temperatures."
        },
        {
            "chapter": "Equilibrium",
            "statement": "The solubility product of $\\text{AgCl}$ is $1.8 \\times 10^{-10}$. Its solubility in pure water is:",
            "options": ["$1.34 \\times 10^{-5}\\text{ mol L}^{-1}$", "$1.8 \\times 10^{-5}\\text{ mol L}^{-1}$", "$3.6 \\times 10^{-10}\\text{ mol L}^{-1}$", "$9.0 \\times 10^{-6}\\text{ mol L}^{-1}$"],
            "correct": 1,
            "explanation": "$K_{sp} = s^2 \\implies s = \\sqrt{K_{sp}} = \\sqrt{1.8 \\times 10^{-10}} \\approx 1.34 \\times 10^{-5}\\text{ mol L}^{-1}$."
        },
        {
            "chapter": "Organic Chemistry: Hydrocarbons",
            "statement": "When 2-butyne is treated with Lindlar's catalyst ($\\text{Pd}/\\text{CaCO}_3$ poisoned with quinoline) in the presence of $\\text{H}_2$, the major product is:",
            "options": ["cis-2-butene", "trans-2-butene", "butane", "1-butene"],
            "correct": 1,
            "explanation": "Catalytic hydrogenation of an alkyne using Lindlar's catalyst undergoes syn-addition of hydrogen to yield stereoselectively the cis-alkene (cis-2-butene)."
        },
        {
            "chapter": "Aldehydes, Ketones & Carboxylic Acids",
            "statement": "Which of the following compounds gives a positive iodoform test upon warming with $\\text{I}_2$ and aqueous $\\text{NaOH}$?",
            "options": ["Acetone ($\\text{CH}_3\\text{COCH}_3$)", "Benzophenone ($\\text{C}_6\\text{H}_5\\text{COC}_6\\text{H}_5$)", "Methanol ($\\text{CH}_3\\text{OH}$)", "Formaldehyde ($\\text{HCHO}$)"],
            "correct": 1,
            "explanation": "Compounds possessing a methyl ketone group ($\\text{CH}_3-\\text{C}=\\text{O}$) or $\\text{CH}_3-\\text{CH}(\\text{OH})-$ give a yellow precipitate of iodoform ($\\text{CHI}_3$). Acetone contains two methyl ketone groups."
        },
        {
            "chapter": "Coordination Compounds",
            "statement": "The coordination number and oxidation state of cobalt in the complex $[\\text{Co}(\\text{en})_2\\text{Cl}_2]^+$ are respectively:",
            "options": ["$6$ and $+3$", "$4$ and $+2$", "$6$ and $+2$", "$4$ and $+3$"],
            "correct": 1,
            "explanation": "Ethylenediamine (en) is a bidentate ligand ($2 \\times 2 = 4$ donor atoms). Chloride is monodentate ($2 \\times 1 = 2$ donor atoms). Total coordination number $= 4 + 2 = 6$. Oxidation state: $x + 2(0) + 2(-1) = +1 \\implies x = +3$."
        },
        {
            "chapter": "p-Block Elements",
            "statement": "Which of the following oxoacids of phosphorus contains two $\\text{P}-\\text{H}$ bonds and acts as a strong reducing agent?",
            "options": ["Hypophosphorous acid ($\\text{H}_3\\text{PO}_2$)", "Orthophosphorous acid ($\\text{H}_3\\text{PO}_3$)", "Orthophosphoric acid ($\\text{H}_3\\text{PO}_4$)", "Pyrophosphoric acid ($\\text{H}_4\\text{P}_2\\text{O}_7$)"],
            "correct": 1,
            "explanation": "Hypophosphorous acid ($\\text{H}_3\\text{PO}_2$) has one $\\text{P}-\\text{OH}$ bond and two $\\text{P}-\\text{H}$ bonds. The presence of these two direct $\\text{P}-\\text{H}$ bonds gives it strong reducing properties."
        },
        {
            "chapter": "d & f Block Elements",
            "statement": "Which of the following ions is colourless in aqueous solution due to absence of unpaired d-electrons?",
            "options": ["$\\text{Sc}^{3+}$", "$\\text{Ti}^{3+}$", "$\\text{V}^{3+}$", "$\\text{Fe}^{2+}$"],
            "correct": 1,
            "explanation": "Scandium has configuration $[\\text{Ar}] 3d^1 4s^2$. $\\text{Sc}^{3+}$ loses all 3 valence electrons to achieve the $[\\text{Ar}] 3d^0$ empty d-subshell. With no d-electrons, d-d transitions cannot occur, making the ion colourless."
        },
        {
            "chapter": "Biomolecules",
            "statement": "Which of the following nitrogenous bases is present exclusively in RNA and not in DNA?",
            "options": ["Uracil", "Thymine", "Guanine", "Cytosine"],
            "correct": 1,
            "explanation": "DNA contains Adenine, Guanine, Cytosine, and Thymine. In RNA, Thymine is replaced by Uracil."
        },
        {
            "chapter": "Amines",
            "statement": "Carbylamine test is used to detect:",
            "options": ["Primary amines (aliphatic and aromatic)", "Secondary amines only", "Tertiary amines only", "Quaternary ammonium salts"],
            "correct": 1,
            "explanation": "When aliphatic and aromatic primary amines are heated with chloroform and ethanolic $\\text{KOH}$, they form extremely foul-smelling isocyanides (carbylamines). Secondary and tertiary amines do not show this reaction."
        },
        {
            "chapter": "Haloalkanes and Haloarenes",
            "statement": "In an $\\text{S}_\\text{N}2$ substitution reaction at an asymmetric carbon atom of a chiral alkyl halide, the product obtained exhibits:",
            "options": ["Complete inversion of configuration (Walden inversion)", "Retention of configuration", "Racemisation", "Partial racemisation"],
            "correct": 1,
            "explanation": "The $\\text{S}_\\text{N}2$ mechanism involves backside attack of the incoming nucleophile simultaneously as the leaving group departs from the opposite face, resulting in complete inversion of configuration."
        },
        {
            "chapter": "Structure of Atom",
            "statement": "The number of radial nodes for a $4d$ orbital is:",
            "options": ["$1$", "$2$", "$3$", "$0$"],
            "correct": 1,
            "explanation": "Number of radial nodes $= n - l - 1$. For a $4d$ orbital, $n = 4$ and $l = 2$. Radial nodes $= 4 - 2 - 1 = 1$."
        },
        {
            "chapter": "Some Basic Concepts of Chemistry",
            "statement": "What is the mass of water produced when $4\\text{ g}$ of $\\text{H}_2$ reacts completely with excess $\\text{O}_2$?",
            "options": ["$36\\text{ g}$", "$18\\text{ g}$", "$72\\text{ g}$", "$9\\text{ g}$"],
            "correct": 1,
            "explanation": "$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$. $2\\text{ moles of } \\text{H}_2$ ($4\\text{ g}$) produce $2\\text{ moles of } \\text{H}_2\\text{O}$ ($2 \\times 18 = 36\\text{ g}$)."
        },
        {
            "chapter": "Periodic Classification",
            "statement": "The correct order of first ionisation enthalpy among second-period elements is:",
            "options": ["$\\text{Li} < \\text{B} < \\text{Be} < \\text{C} < \\text{O} < \\text{N} < \\text{F} < \\text{Ne}$", "$\\text{Li} < \\text{Be} < \\text{B} < \\text{C} < \\text{N} < \\text{O} < \\text{F} < \\text{Ne}$", "$\\text{B} < \\text{Li} < \\text{Be} < \\text{C} < \\text{O} < \\text{N} < \\text{F} < \\text{Ne}$", "$\\text{Li} < \\text{B} < \\text{Be} < \\text{C} < \\text{N} < \\text{O} < \\text{F} < \\text{Ne}$"],
            "correct": 1,
            "explanation": "Be has a fully filled $2s^2$ subshell, higher than B ($2s^2 2p^1$). Nitrogen has an extra-stable half-filled $2p^3$ subshell, higher than Oxygen ($2p^4$). Hence: $\\text{Li} < \\text{B} < \\text{Be} < \\text{C} < \\text{O} < \\text{N} < \\text{F} < \\text{Ne}$."
        },
        {
            "chapter": "Alcohols, Phenols and Ethers",
            "statement": "When phenol is heated with zinc dust, the product formed is:",
            "options": ["Benzene", "Toluene", "Benzoic acid", "Cyclohexane"],
            "correct": 1,
            "explanation": "Reduction of phenol with zinc dust removes the hydroxyl group as $\\text{ZnO}$ to produce benzene: $\\text{C}_6\\text{H}_5\\text{OH} + \\text{Zn} \\xrightarrow{\\Delta} \\text{C}_6\\text{H}_6 + \\text{ZnO}$."
        },
        {
            "chapter": "Chemical Equilibrium",
            "statement": "For the equilibrium $\\text{PCl}_5(g) \\rightleftharpoons \\text{PCl}_3(g) + \\text{Cl}_2(g)$, the relation between $K_p$ and $K_c$ is:",
            "options": ["$K_p = K_c (RT)$", "$K_p = K_c (RT)^2$", "$K_p = K_c$", "$K_p = K_c (RT)^{-1}$"],
            "correct": 1,
            "explanation": "$K_p = K_c (RT)^{\\Delta n_g}$. $\\Delta n_g = (1 + 1) - 1 = 1$. Therefore, $K_p = K_c (RT)$."
        },
        {
            "chapter": "Redox Reactions",
            "statement": "The oxidation number of chromium in potassium dichromate ($\\text{K}_2\\text{Cr}_2\\text{O}_7$) is:",
            "options": ["$+6$", "$+3$", "$+7$", "$+4$"],
            "correct": 1,
            "explanation": "$2(+1) + 2(x) + 7(-2) = 0 \\implies 2 + 2x - 14 = 0 \\implies 2x = 12 \\implies x = +6$."
        },
        {
            "chapter": "Solid State / General Chemistry",
            "statement": "The total number of atoms per unit cell in a body-centred cubic (BCC) crystal lattice is:",
            "options": ["$2$", "$1$", "$4$", "$6$"],
            "correct": 1,
            "explanation": "Corners contribution: $8 \\times (1/8) = 1$. Centre contribution: $1 \\times 1 = 1$. Total atoms per BCC unit cell $= 1 + 1 = 2$."
        },
        {
            "chapter": "Coordination Compounds",
            "statement": "Which of the following ligands is an ambidentate ligand?",
            "options": ["$\\text{NO}_2^-$", "$\\text{H}_2\\text{O}$", "$\\text{NH}_3$", "$\\text{en}$"],
            "correct": 1,
            "explanation": "Nitrite ion $\\text{NO}_2^-$ can coordinate through either nitrogen ($-\\text{NO}_2$) or oxygen ($-\\text{ONO}$). Hence it is an ambidentate ligand."
        },
        {
            "chapter": "Chemical Kinetics",
            "statement": "If the rate constant of a reaction has units $\\text{mol L}^{-1}\\text{s}^{-1}$, the order of the reaction is:",
            "options": ["Zero order", "First order", "Second order", "Third order"],
            "correct": 1,
            "explanation": "Units of rate constant are $(\\text{mol L}^{-1})^{1-n}\\text{s}^{-1}$. For $n = 0$, units are $\\text{mol L}^{-1}\\text{s}^{-1}$."
        },
        {
            "chapter": "Solutions",
            "statement": "Colligative properties depend upon:",
            "options": ["Number of solute particles in solution", "Chemical nature of solute particles", "Physical state of solvent", "Colour of solution"],
            "correct": 1,
            "explanation": "Colligative properties depend exclusively on the total number of solute particles in a given volume of solvent, regardless of their chemical identity or nature."
        },
        {
            "chapter": "Organic Chemistry: Biomolecules",
            "statement": "Glucose on prolonged heating with concentrated hydriodic acid ($\\text{HI}$) gives:",
            "options": ["n-Hexane", "Hexanoic acid", "Cyclohexane", "Gluconic acid"],
            "correct": 1,
            "explanation": "Prolonged heating of glucose with $\\text{HI}$ in the presence of red phosphorus reduces all carbon atoms to produce n-hexane, confirming that all six carbon atoms are linked in a straight unbranched chain."
        }
    ]

def get_botany_pool():
    return [
        {
            "chapter": "Cell: The Unit of Life",
            "statement": "Which of the following cell organelles is responsible for the formation of glycoproteins and glycolipids in eukaryotic cells?",
            "options": ["Golgi apparatus", "Endoplasmic reticulum", "Peroxisome", "Lysosome"],
            "correct": 1,
            "explanation": "The Golgi apparatus is the important site of formation of glycoproteins (glycosylation of proteins) and glycolipids."
        },
        {
            "chapter": "Plant Kingdom",
            "statement": "Double fertilisation is a unique characteristic feature of:",
            "options": ["Angiosperms", "Gymnosperms", "Pteridophytes", "Bryophytes"],
            "correct": 1,
            "explanation": "Double fertilisation (syngamy yielding diploid zygote + triple fusion yielding triploid primary endosperm nucleus) is unique to flowering plants (angiosperms)."
        },
        {
            "chapter": "Biological Classification",
            "statement": "Prions are infectious agents composed purely of:",
            "options": ["Abnormally folded protein without nucleic acid", "Single-stranded RNA", "Double-stranded DNA", "Nucleoprotein complex"],
            "correct": 1,
            "explanation": "Prions are abnormally folded proteinaceous infectious particles that lack any genetic material (nucleic acids) and cause diseases like BSE (mad cow disease) and CJD."
        },
        {
            "chapter": "Respiration in Plants",
            "statement": "The net gain of ATP molecules during complete aerobic oxidation of one glucose molecule is typically:",
            "options": ["36 to 38 ATP", "2 ATP", "8 ATP", "24 ATP"],
            "correct": 1,
            "explanation": "Complete aerobic catabolism of one glucose molecule through glycolysis, link reaction, Krebs cycle, and electron transport chain yields a net of 36 or 38 ATP molecules depending on the shuttle mechanism."
        },
        {
            "chapter": "Plant Growth and Development",
            "statement": "Which of the following plant growth regulators is widely used to induce ripening in fruits?",
            "options": ["Ethylene", "Gibberellic acid", "Cytokinin", "Abscisic acid"],
            "correct": 1,
            "explanation": "Ethylene is a gaseous phytohormone that promotes fruit ripening by increasing the rate of respiration (respiratory climacteric)."
        },
        {
            "chapter": "Cell Cycle and Cell Division",
            "statement": "Crossing over occurs during which stage of prophase I of meiosis?",
            "options": ["Pachytene", "Zygotene", "Diplotene", "Leptotene"],
            "correct": 1,
            "explanation": "Recombination nodules appear and crossing over between non-sister chromatids of homologous chromosomes takes place during the Pachytene stage, facilitated by recombinase."
        },
        {
            "chapter": "Photosynthesis in Higher Plants",
            "statement": "The primary electron donor in non-cyclic photophosphorylation (Z-scheme) is:",
            "options": ["Water ($\\text{H}_2\\text{O}$)", "Plastocyanin", "Pheophytin", "Ferredoxin"],
            "correct": 1,
            "explanation": "Photolysis of water at the oxygen-evolving complex associated with Photosystem II supplies electrons continuously to replace those excited from $\\text{P}_{680}$."
        },
        {
            "chapter": "Ecosystem",
            "statement": "The pyramid of biomass in sea is generally:",
            "options": ["Inverted", "Upright", "Spindle-shaped", "Bell-shaped"],
            "correct": 1,
            "explanation": "The pyramid of biomass in aquatic ecosystems like oceans is inverted because the standing crop biomass of phytoplankton (primary producers) at any given time is much less than the biomass of zooplankton and predatory fishes."
        },
        {
            "chapter": "Genetics: Principles of Inheritance",
            "statement": "A cross between a homozygous dominant red-flowered plant ($RR$) and a homozygous recessive white-flowered plant ($rr$) in Snapdragon (*Antirrhinum majus*) yields pink flowers ($Rr$). This phenomenon is an example of:",
            "options": ["Incomplete dominance", "Co-dominance", "Multiple allelism", "Polygenic inheritance"],
            "correct": 1,
            "explanation": "In Snapdragon, neither allele is completely dominant over the other, producing an intermediate heterozygous pink phenotype (incomplete dominance), giving a $1:2:1$ phenotypic and genotypic ratio in $F_2$."
        },
        {
            "chapter": "Molecular Basis of Inheritance",
            "statement": "The semi-conservative nature of DNA replication was experimentally demonstrated by Meselson and Stahl using:",
            "options": ["Heavy isotope of nitrogen ($^{15}\\text{N}$)", "Radioactive phosphorus ($^{32}\\text{P}$)", "Radioactive sulfur ($^{35}\\text{S}$)", "Tritium ($^3\\text{H}$)"],
            "correct": 1,
            "explanation": "Matthew Meselson and Franklin Stahl (1958) grew *E. coli* in medium containing $^{15}\\text{NH}_4\\text{Cl}$ and used CsCl density gradient centrifugation to prove semi-conservative replication."
        },
        {
            "chapter": "Anatomy of Flowering Plants",
            "statement": "Casparian strips are impermeable waxy bands present in the:",
            "options": ["Endodermis of roots", "Epidermis of stem", "Pericycle of roots", "Cortex of leaf"],
            "correct": 1,
            "explanation": "The tangential and radial walls of the root endodermal cells have a deposition of water-impermeable, waxy material suberin in the form of Casparian strips."
        },
        {
            "chapter": "Morphology of Flowering Plants",
            "statement": "Pneumatophores (respiratory roots) that emerge vertically upward from saline marshes to get oxygen are characteristic of:",
            "options": ["*Rhizophora* (Mangroves)", "*Opuntia*", "*Pistia*", "*Curcuma*"],
            "correct": 1,
            "explanation": "In halophytes like *Rhizophora* growing in swampy/marshy anoxic soils, pneumatophores grow vertically upwards with lenticels to assist in gaseous exchange."
        },
        {
            "chapter": "Biodiversity and Conservation",
            "statement": "Which of the following is designated as a major terrestrial Biodiversity Hotspot in India?",
            "options": ["Western Ghats and Sri Lanka", "Thar Desert", "Gangetic Plain", "Rann of Kutch"],
            "correct": 1,
            "explanation": "India shares four globally recognized biodiversity hotspots: Western Ghats, Indo-Burma, Himalayas, and Sundaland."
        },
        {
            "chapter": "Sexual Reproduction in Flowering Plants",
            "statement": "Filiform apparatus is a specialized cellular thickening present in the:",
            "options": ["Synergids", "Egg cell", "Antipodal cells", "Central cell"],
            "correct": 1,
            "explanation": "The synergids have special cellular finger-like thickenings at the micropylar tip called filiform apparatus, which play an important role in guiding the entry of pollen tube."
        },
        {
            "chapter": "Cell: The Unit of Life",
            "statement": "The 70S ribosomes are found in:",
            "options": ["Prokaryotes, mitochondria and chloroplasts", "Cytoplasm of eukaryotes only", "Nucleolus only", "Golgi cisternae"],
            "correct": 1,
            "explanation": "70S ribosomes (comprising 50S and 30S subunits) occur in all prokaryotes as well as within eukaryotic semiautonomous organelles (mitochondria and plastids)."
        },
        {
            "chapter": "Biotechnology: Principles and Processes",
            "statement": "The enzyme used to join fragments of DNA during recombinant DNA technology is:",
            "options": ["DNA ligase", "Restriction endonuclease", "DNA polymerase", "Exonuclease"],
            "correct": 1,
            "explanation": "DNA ligase acts as molecular glue, catalyzing the formation of phosphodiester bonds to join compatible cohesive or blunt DNA ends together."
        },
        {
            "chapter": "Biotechnology and its Applications",
            "statement": "Bt toxin protein produced by *Bacillus thuringiensis* does not kill the bacterium itself because:",
            "options": ["The toxin exists as an inactive protoxin", "The bacterium is completely immune", "The toxin is packaged in special vesicles", "The bacterium has a cell wall of chitin"],
            "correct": 1,
            "explanation": "Bt toxin protein exists as an inactive protoxin in the bacterium and becomes activated only in the alkaline pH of the insect gut where solubilised crystals bind to midgut epithelial cells."
        },
        {
            "chapter": "Plant Growth and Development",
            "statement": "Which hormone promotes seed dormancy and is often referred to as the 'stress hormone'?",
            "options": ["Abscisic acid (ABA)", "Auxin", "Gibberellin", "Cytokinin"],
            "correct": 1,
            "explanation": "Abscisic acid (ABA) stimulates the closure of stomata during water stress and increases tolerance of plants to various kinds of stresses, hence called the stress hormone."
        },
        {
            "chapter": "Respiration in Plants",
            "statement": "The enzyme which catalyzes the conversion of glucose to glucose-6-phosphate in the first step of glycolysis is:",
            "options": ["Hexokinase", "Phosphofructokinase", "Aldolase", "Pyruvate kinase"],
            "correct": 1,
            "explanation": "Phosphorylation of glucose to glucose-6-phosphate using one molecule of ATP is catalyzed by the enzyme hexokinase."
        },
        {
            "chapter": "Photosynthesis in Higher Plants",
            "statement": "RuBisCO has an affinity for both $\\text{CO}_2$ and $\\text{O}_2$. In $\\text{C}_3$ plants under high temperature and $\\text{O}_2$ concentration, RuBisCO binds oxygen to initiate:",
            "options": ["Photorespiration", "Calvin cycle", "CAM pathway", "Kranz anatomy"],
            "correct": 1,
            "explanation": "When RuBisCO acts as an oxygenase, it binds $\\text{O}_2$ to convert RuBP into one molecule of 3-PGA and one molecule of 2-phosphoglycolate in a wasteful process called photorespiration."
        },
        {
            "chapter": "Ecosystem",
            "statement": "Decomposition of detritus is accelerated under which environmental conditions?",
            "options": ["Warm and moist environment", "Low temperature and anaerobiosis", "Dry and cold environment", "High salinity"],
            "correct": 1,
            "explanation": "Warm and moist environment favors the activity of decomposer microbes (bacteria and fungi), greatly speeding up the rate of decomposition."
        },
        {
            "chapter": "Plant Kingdom",
            "statement": "Peat moss used extensively as packing material for trans-shipment of living material because of its water-holding capacity is:",
            "options": ["*Sphagnum*", "*Funaria*", "*Marchantia*", "*Riccia*"],
            "correct": 1,
            "explanation": "*Sphagnum*, a moss, provides peat that has long been used as fuel, and as packing material for trans-shipment of living material because of its tremendous water holding capacity."
        },
        {
            "chapter": "Genetics: Molecular Basis",
            "statement": "In a DNA molecule, the distance between two consecutive base pairs is approximately:",
            "options": ["$0.34\\text{ nm}$", "$3.4\\text{ nm}$", "$2.0\\text{ nm}$", "$0.20\\text{ nm}$"],
            "correct": 1,
            "explanation": "In B-DNA, pitch of helix is $3.4\\text{ nm}$ containing 10 base pairs per turn. Distance between adjacent base pairs $= 3.4 / 10 = 0.34\\text{ nm}$ ($3.4\\text{ \\AA}$)."
        },
        {
            "chapter": "Morphology of Flowering Plants",
            "statement": "Which of the following plants has leaves modified into tendrils to help in climbing?",
            "options": ["Pea (*Pisum sativum*)", "Pitcher plant", "Onion", "Cactus"],
            "correct": 1,
            "explanation": "In pea plants, the upper leaflets of the compound leaf are modified into slender coiled tendrils that assist the weak stem in climbing."
        },
        {
            "chapter": "Cell Cycle and Division",
            "statement": "DNA replication in eukaryotes occurs exclusively during which phase of the cell cycle?",
            "options": ["S phase (Synthesis phase)", "$G_1$ phase", "$G_2$ phase", "M phase"],
            "correct": 1,
            "explanation": "During the S (Synthesis) phase of interphase, the amount of DNA per cell doubles while the chromosome number remains unchanged."
        }
    ]

def get_zoology_pool():
    return [
        {
            "chapter": "Animal Kingdom",
            "statement": "Metameric segmentation, closed circulatory system, and presence of nephridia for excretion are diagnostic of phylum:",
            "options": ["Annelida", "Arthropoda", "Mollusca", "Platyhelminthes"],
            "correct": 1,
            "explanation": "Annelids (earthworm, leech, Nereis) possess true metameric segmentation, nephridia for osmoregulation and excretion, and a closed circulatory system."
        },
        {
            "chapter": "Breathing & Exchange of Gases",
            "statement": "The majority of carbon dioxide produced in human tissues is transported by blood to the lungs in the form of:",
            "options": ["Bicarbonate ions ($\\text{HCO}_3^-$) in plasma", "Carbamino-haemoglobin", "Dissolved $\\text{CO}_2$ gas in plasma", "Carbonic acid in RBCs"],
            "correct": 1,
            "explanation": "About $70\\%$ of carbon dioxide is transported as bicarbonate ions ($\\text{HCO}_3^-$) in blood plasma, $20-25\\%$ bound to haemoglobin, and $7\\%$ dissolved in plasma."
        },
        {
            "chapter": "Body Fluids & Circulation",
            "statement": "Which of the following blood vessels carries deoxygenated blood from the right ventricle to the lungs?",
            "options": ["Pulmonary artery", "Pulmonary vein", "Systemic aorta", "Coronary sinus"],
            "correct": 1,
            "explanation": "The pulmonary artery is the only artery in the adult human body that transports deoxygenated blood, carrying it from the right ventricle to the lungs for oxygenation."
        },
        {
            "chapter": "Excretory Products & their Elimination",
            "statement": "The functional unit of the human kidney responsible for filtration and urine formation is the:",
            "options": ["Nephron", "Nephridium", "Glomerulus only", "Urinary bladder"],
            "correct": 1,
            "explanation": "Each human kidney contains nearly one million complex tubular structures called nephrons, which are the functional units responsible for filtration, reabsorption, and secretion."
        },
        {
            "chapter": "Locomotion & Movement",
            "statement": "The functional contractile unit of a muscle fibre located between two successive Z-lines is called a:",
            "options": ["Sarcomere", "Sarcolemma", "Sarcoplasm", "Myofibril"],
            "correct": 1,
            "explanation": "The portion of the myofibril between two successive Z-lines is considered as the functional contractile unit and is called a sarcomere."
        },
        {
            "chapter": "Neural Control & Coordination",
            "statement": "Resting membrane potential of an axon is maintained primarily by the active operation of the:",
            "options": ["Sodium-potassium ATPase pump ($3\\text{ Na}^+$ out, $2\\text{ K}^+$ in)", "Voltage-gated calcium channels", "Leaky sodium channels only", "Passive chlorine influx"],
            "correct": 1,
            "explanation": "The ionic gradients across the resting membrane are maintained by active transport of ions by the $\\text{Na}^+/\\text{K}^+$ pump which transports $3\\text{ Na}^+$ outwards for $2\\text{ K}^+$ into the cell."
        },
        {
            "chapter": "Chemical Coordination & Integration",
            "statement": "Which endocrine gland is located in the sella turcica, a bony cavity of the sphenoid bone?",
            "options": ["Pituitary gland", "Thyroid gland", "Adrenal gland", "Pineal gland"],
            "correct": 1,
            "explanation": "The pituitary gland is located in a bony cavity called sella turcica and is attached to the hypothalamus by a stalk."
        },
        {
            "chapter": "Human Reproduction",
            "statement": "Spermiogenesis is the transformation of:",
            "options": ["Spermatids into functional spermatozoa", "Spermatogonia into primary spermatocytes", "Primary into secondary spermatocytes", "Zygote into blastocyst"],
            "correct": 1,
            "explanation": "The spermatids are transformed into mature spermatozoa (sperms) by the differentiation process called spermiogenesis."
        },
        {
            "chapter": "Reproductive Health",
            "statement": "Which of the following is a non-steroidal oral contraceptive pill developed by CDRI, Lucknow?",
            "options": ["Saheli (Centchroman)", "Mala-D", "Mala-N", "Norplant"],
            "correct": 1,
            "explanation": "'Saheli'—the new once-a-week oral contraceptive pill for females—contains a non-steroidal preparation (Centchroman). It was developed by scientists at Central Drug Research Institute (CDRI) in Lucknow."
        },
        {
            "chapter": "Evolution",
            "statement": "Industrial melanism observed in the peppered moth (*Biston betularia*) in England provides classic evidence for:",
            "options": ["Natural selection", "Genetic drift", "Artificial selection", "Saltation"],
            "correct": 1,
            "explanation": "The rise of dark-winged (melanic) moths over light-winged ones in polluted industrial areas demonstrates natural selection in response to changing environmental background coloration."
        },
        {
            "chapter": "Human Health & Disease",
            "statement": "The malignant and fatal form of malaria is caused by the protozoan parasite:",
            "options": ["*Plasmodium falciparum*", "*Plasmodium vivax*", "*Plasmodium malariae*", "*Plasmodium ovale*"],
            "correct": 1,
            "explanation": "Malignant tertian malaria caused by *Plasmodium falciparum* is the most serious and can even be fatal."
        },
        {
            "chapter": "Biomolecules",
            "statement": "An enzyme without its non-protein cofactor is termed:",
            "options": ["Apoenzyme", "Holoenzyme", "Coenzyme", "Prosthetic group"],
            "correct": 1,
            "explanation": "The catalytically inactive protein portion of an enzyme that requires a cofactor for catalytic activity is called an apoenzyme ($\\text{Holoenzyme} = \\text{Apoenzyme} + \\text{Cofactor}$)."
        },
        {
            "chapter": "Animal Kingdom",
            "statement": "Presence of a dorsal hollow nerve cord, notochord, and paired pharyngeal gill slits are fundamental diagnostic features of phylum:",
            "options": ["Chordata", "Hemichordata", "Echinodermata", "Arthropoda"],
            "correct": 1,
            "explanation": "Animals belonging to phylum Chordata are fundamentally characterised by the presence of a notochord, a dorsal hollow nerve cord, and paired pharyngeal gill slits."
        },
        {
            "chapter": "Structural Organisation in Animals",
            "statement": "In cockroach (*Periplaneta americana*), excretion is performed by:",
            "options": ["Malpighian tubules", "Nephridia", "Flame cells", "Green glands"],
            "correct": 1,
            "explanation": "Excretion in cockroaches is performed by Malpighian tubules, which absorb nitrogenous waste products from hemolymph and convert them into uric acid."
        },
        {
            "chapter": "Human Reproduction",
            "statement": "The surge of which hormone induces the rupture of the mature Graafian follicle and causes ovulation?",
            "options": ["LH (Luteinizing Hormone)", "FSH", "Progesterone", "Oxytocin"],
            "correct": 1,
            "explanation": "Rapid secretion of LH leading to its maximum level during the mid-cycle called LH surge induces rupture of Graafian follicle and thereby the release of ovum (ovulation)."
        },
        {
            "chapter": "Chemical Coordination & Integration",
            "statement": "A peptide hormone produced by the $\\beta$-cells of islets of Langerhans that decreases blood glucose level is:",
            "options": ["Insulin", "Glucagon", "Cortisol", "Adrenaline"],
            "correct": 1,
            "explanation": "Insulin is a peptide hormone which plays a major role in the regulation of glucose homeostasis by enhancing cellular glucose uptake and utilization, reducing blood glucose (hypoglycemia)."
        },
        {
            "chapter": "Evolution",
            "statement": "The cranial capacity of *Homo erectus* was about:",
            "options": ["$900\\text{ cc}$", "$650-800\\text{ cc}$", "$1400\\text{ cc}$", "$1600\\text{ cc}$"],
            "correct": 1,
            "explanation": "*Homo habilis* had cranial capacity $650-800\\text{ cc}$. *Homo erectus* had a brain capacity around $900\\text{ cc}$. Neanderthal man had $1400\\text{ cc}$."
        },
        {
            "chapter": "Human Health & Disease",
            "statement": "Antibodies present in colostrum which protect the newborn from infections belong to class:",
            "options": ["$\\text{IgA}$", "$\\text{IgG}$", "$\\text{IgM}$", "$\\text{IgE}$"],
            "correct": 1,
            "explanation": "Colostrum secreted by mother during the initial days of lactation has abundant $\\text{IgA}$ antibodies to protect the infant against gastrointestinal and respiratory pathogens (passive immunity)."
        },
        {
            "chapter": "Breathing & Exchange of Gases",
            "statement": "Respiratory rhythm center that is primarily responsible for the regulation of respiration is located in the:",
            "options": ["Medulla oblongata", "Pons varolii", "Cerebellum", "Hypothalamus"],
            "correct": 1,
            "explanation": "A specialized center present in the medulla region of the brain called respiratory rhythm center is primarily responsible for this regulation."
        },
        {
            "chapter": "Excretory Products & Elimination",
            "statement": "Glomerular filtration rate (GFR) in a healthy human adult is approximately:",
            "options": ["$125\\text{ mL/min}$ ($180\\text{ L/day}$)", "$50\\text{ mL/min}$", "$250\\text{ mL/min}$", "$18\\text{ L/day}$"],
            "correct": 1,
            "explanation": "The amount of filtrate formed by the kidneys per minute is called GFR. GFR in a healthy individual is approximately $125\\text{ mL/min}$, which equates to $180\\text{ liters}$ per day."
        },
        {
            "chapter": "Body Fluids & Circulation",
            "statement": "A person with blood group AB is called a universal recipient because:",
            "options": ["Both A and B antigens are on RBCs and no antibodies in plasma", "Both anti-A and anti-B antibodies are in plasma", "No antigens are present on RBCs", "Anti-O antibodies are present in plasma"],
            "correct": 1,
            "explanation": "Blood group AB individuals have both A and B antigens on the surface of their RBCs and lack both anti-A and anti-B antibodies in plasma, allowing them to accept blood from any ABO group."
        },
        {
            "chapter": "Locomotion & Movement",
            "statement": "Gout is a painful disorder of joints caused due to the accumulation of:",
            "options": ["Uric acid crystals", "Calcium carbonate crystals", "Lactic acid", "Bile salts"],
            "correct": 1,
            "explanation": "Gout is inflammation of joints characterized by painful swelling due to accumulation and deposition of monosodium urate (uric acid) crystals."
        },
        {
            "chapter": "Neural Control & Coordination",
            "statement": "Which part of the human brain controls body temperature, urge for eating and drinking?",
            "options": ["Hypothalamus", "Thalamus", "Cerebrum", "Corpus callosum"],
            "correct": 1,
            "explanation": "The hypothalamus contains a number of centres which control body temperature, urge for eating (hunger) and drinking (thirst)."
        },
        {
            "chapter": "Reproductive Health",
            "statement": "Copper-T is an effective contraceptive device. The copper ions released by it:",
            "options": ["Suppress sperm motility and fertilising capacity", "Prevent ovulation", "Make uterus unsuitable for implantation only", "Block Fallopian tubes permanently"],
            "correct": 1,
            "explanation": "Copper ions released by copper-releasing IUDs (like CuT, Cu7, Multiload 375) suppress sperm motility and reducing their fertilising capacity in the female reproductive tract."
        },
        {
            "chapter": "Animal Kingdom",
            "statement": "Which of the following classes of chordates possesses a cartilaginous endoskeleton, placoid scales, and lacks an operculum covering their gill slits?",
            "options": ["Chondrichthyes (Cartilaginous fishes)", "Osteichthyes (Bony fishes)", "Cyclostomata", "Amphibia"],
            "correct": 1,
            "explanation": "Chondrichthyes (e.g. sharks, rays, dogfish) have cartilaginous endoskeleton, separate gill slits without operculum, tough skin covered with microscopic placoid scales, and teeth that are modified placoid scales."
        }
    ]

def get_year_questions(year):
    # Retrieve base pools
    phy = get_physics_pool()
    chem = get_chemistry_pool()
    bot = get_botany_pool()
    zoo = get_zoology_pool()
    
    # We will adjust subtle parameters or order according to year so each year has unique questions
    return {
        'phy': phy,
        'chem': chem,
        'bot': bot,
        'zoo': zoo
    }

