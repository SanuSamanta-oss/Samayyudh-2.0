import type { AcademicLevel } from '@/types/formulas';

export const class12Physics: AcademicLevel = {
  "id": "class-12",
  "title": "Class 12 Physics",
  "shortTitle": "Class 12",
  "description": "Electrodynamics, capacitance, electromagnetism, wave optics, modern physics, nuclear structure, and semiconductor electronics.",
  "levelOrder": 3,
  "chapters": [
    {
      "id": "c12-charges-fields",
      "number": 1,
      "title": "Electric Charges and Fields",
      "description": "Quantisation of charge, Coulomb’s law, electric field intensity, dipole moment, electric flux, and Gauss’s law applications.",
      "formulas": [
        {
          "id": "c12-coulomb-law",
          "name": "Coulomb’s Law of Electrostatics",
          "expression": "F = (1 / (4πε₀)) × (|q₁ q₂| / r²)",
          "latex": "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}",
          "alternateLatex": [
            "F = k_e \\frac{|q_1 q_2|}{r^2}"
          ],
          "symbols": [
            {
              "symbol": "F",
              "meaning": "Electrostatic force magnitude",
              "unit": "newtons (N)"
            },
            {
              "symbol": "\\frac{1}{4\\pi\\varepsilon_0}",
              "meaning": "Coulomb constant (≈ 8.988 × 10⁹ N m² C⁻²)",
              "unit": "N m² C⁻²"
            },
            {
              "symbol": "q_1, q_2",
              "meaning": "Stationary point charges",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "r",
              "meaning": "Separation distance between charges",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "newton (N)",
          "explanation": "Calculates the electrostatic attraction or repulsion force between two stationary point charges in vacuum.",
          "conditions": "Stationary point charges in vacuum or free space.",
          "example": "Two equal charges of +1 μC (10⁻⁶ C) separated by 0.1 m repel with F = (9 × 10⁹) × (10⁻¹²) / (0.01) = 0.9 N.",
          "keywords": [
            "coulomb law",
            "electrostatics",
            "point charge",
            "permittivity",
            "force"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-electric-field-point",
          "name": "Electric Field Due to a Point Charge",
          "expression": "E = (1 / (4πε₀)) × (q / r²)",
          "latex": "E = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2}",
          "alternateLatex": [
            "\\mathbf{E} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\hat{r}"
          ],
          "symbols": [
            {
              "symbol": "E",
              "meaning": "Electric field intensity magnitude",
              "unit": "N C⁻¹ or V m⁻¹"
            },
            {
              "symbol": "q",
              "meaning": "Source point charge",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "r",
              "meaning": "Distance from source charge",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "newton per coulomb (N C⁻¹ or V m⁻¹)",
          "explanation": "Electrostatic force experienced per unit positive test charge placed at a distance r from the source charge.",
          "conditions": "Point charge in vacuum; test charge infinitesimal to prevent source distortion.",
          "example": "At r = 0.3 m from a charge q = +2 nC: E = (9 × 10⁹ × 2 × 10⁻⁹) / (0.09) = 18 / 0.09 = 200 N C⁻¹.",
          "keywords": [
            "electric field",
            "field intensity",
            "point charge"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-electric-dipole-moment",
          "name": "Electric Dipole Moment and Torque",
          "expression": "p = q (2a),   τ = p × E,   |τ| = p E sin(θ),   U = - p · E",
          "latex": "p = q(2a), \\quad \\boldsymbol{\\tau} = \\mathbf{p} \\times \\mathbf{E}, \\quad U = -\\mathbf{p} \\cdot \\mathbf{E}",
          "alternateLatex": [
            "|\\tau| = p E \\sin\\theta"
          ],
          "symbols": [
            {
              "symbol": "\\mathbf{p}",
              "meaning": "Electric dipole moment vector (directed from -q to +q)",
              "unit": "C m"
            },
            {
              "symbol": "q",
              "meaning": "Magnitude of either charge",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "2a",
              "meaning": "Separation vector between opposite charges",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\boldsymbol{\\tau}",
              "meaning": "Restoring torque in uniform field E",
              "unit": "N m"
            },
            {
              "symbol": "U",
              "meaning": "Electrostatic potential energy of dipole",
              "unit": "joules (J)"
            }
          ],
          "siUnit": "coulomb-metre (C m)",
          "explanation": "Measures polarity of a pair of equal and opposite charges. In a uniform electric field, a dipole experiences zero net translational force but a restoring torque.",
          "conditions": "Uniform external electrostatic field.",
          "example": "A dipole of p = 4 × 10⁻⁹ C m at θ = 30° in field E = 10⁴ N C⁻¹ experiences torque τ = (4 × 10⁻⁹) × 10⁴ × sin 30° = 2 × 10⁻⁵ N m.",
          "keywords": [
            "dipole moment",
            "torque",
            "potential energy",
            "uniform field"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-gauss-law",
          "name": "Gauss’s Law of Electrostatics",
          "expression": "Φ_E = ∮ E · dA = Q_enclosed / ε₀",
          "latex": "\\Phi_E = \\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enclosed}}}{\\varepsilon_0}",
          "symbols": [
            {
              "symbol": "\\Phi_E",
              "meaning": "Total electric flux through closed surface",
              "unit": "N m² C⁻¹ or V m"
            },
            {
              "symbol": "\\mathbf{E}",
              "meaning": "Electric field vector at surface element",
              "unit": "N C⁻¹"
            },
            {
              "symbol": "d\\mathbf{A}",
              "meaning": "Outward normal surface area vector element",
              "unit": "m²"
            },
            {
              "symbol": "Q_{\\text{enclosed}}",
              "meaning": "Net total charge enclosed inside closed Gaussian surface",
              "unit": "coulombs (C)"
            }
          ],
          "siUnit": "N m² C⁻¹ (or V m)",
          "explanation": "The net outward electrostatic flux traversing any arbitrary closed Gaussian surface equals the net enclosed charge divided by vacuum permittivity.",
          "conditions": "Any closed surface (Gaussian surface) in free space.",
          "example": "An infinite line charge of linear density λ produces radial electric field E = λ / (2πε₀ r). An infinite non-conducting sheet of surface density σ produces uniform E = σ / (2ε₀).",
          "keywords": [
            "gauss law",
            "electric flux",
            "gaussian surface",
            "enclosed charge"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-potential-capacitance",
      "number": 2,
      "title": "Electrostatic Potential and Capacitance",
      "description": "Electric potential, potential gradient, parallel-plate capacitor, dielectric constant, series-parallel capacitors, and stored electrostatic energy.",
      "formulas": [
        {
          "id": "c12-electric-potential-point",
          "name": "Electric Potential Due to a Point Charge",
          "expression": "V = (1 / (4πε₀)) × (q / r)",
          "latex": "V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}",
          "symbols": [
            {
              "symbol": "V",
              "meaning": "Electrostatic potential at point",
              "unit": "volts (V = J C⁻¹)"
            },
            {
              "symbol": "q",
              "meaning": "Source point charge",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "r",
              "meaning": "Distance from point charge",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "volt (V)",
          "explanation": "Amount of work done per unit positive charge in bringing it quasi-statically from infinity to a distance r from the charge.",
          "conditions": "Zero reference potential chosen at infinity.",
          "example": "Potential at 0.1 m from a +10 nC charge: V = (9 × 10⁹ × 10 × 10⁻⁹) / 0.1 = 90 / 0.1 = 900 V.",
          "keywords": [
            "electric potential",
            "point charge",
            "voltage",
            "work done"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-parallel-plate-capacitor",
          "name": "Capacitance of a Parallel-Plate Capacitor",
          "expression": "C = (ε₀ A) / d,   C_dielectric = (κ ε₀ A) / d",
          "latex": "C = \\frac{\\varepsilon_0 A}{d}, \\quad C_{\\text{dielectric}} = \\frac{\\kappa \\varepsilon_0 A}{d}",
          "symbols": [
            {
              "symbol": "C",
              "meaning": "Capacitance in vacuum",
              "unit": "farads (F)"
            },
            {
              "symbol": "\\kappa",
              "meaning": "Dielectric constant (relative permittivity ε_r) of medium"
            },
            {
              "symbol": "A",
              "meaning": "Area of each conducting plate",
              "unit": "square metres (m²)"
            },
            {
              "symbol": "d",
              "meaning": "Plate separation distance",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "farad (F, where 1 F = 1 C V⁻¹)",
          "explanation": "Quantifies the charge storage capability per unit potential difference. Introducing a dielectric of constant κ increases capacitance by a factor of κ.",
          "conditions": "Plate linear dimensions much larger than separation d (fringing fields neglected).",
          "example": "Plates of area 0.02 m² separated by 1 mm (10⁻³ m) with mica (κ = 6): C = 6 × (8.854 × 10⁻¹² × 0.02) / 10⁻³ ≈ 1.06 × 10⁻⁹ F = 1.06 nF.",
          "keywords": [
            "capacitance",
            "parallel plate",
            "dielectric",
            "permittivity"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-capacitor-combinations",
          "name": "Series and Parallel Capacitor Combinations",
          "expression": "Series: 1/C_eq = ∑ (1/C_i),   Parallel: C_eq = ∑ C_i",
          "latex": "\\text{Series: } \\frac{1}{C_{\\text{eq}}} = \\sum_{i} \\frac{1}{C_i}, \\quad \\text{Parallel: } C_{\\text{eq}} = \\sum_{i} C_i",
          "symbols": [
            {
              "symbol": "C_{\\text{eq}}",
              "meaning": "Equivalent total capacitance",
              "unit": "farads (F)"
            },
            {
              "symbol": "C_i",
              "meaning": "Individual constituent capacitors",
              "unit": "farads (F)"
            }
          ],
          "siUnit": "farad (F)",
          "explanation": "In series, charge Q on every capacitor is identical, and reciprocal capacitances add. In parallel, voltage V across each capacitor is identical, and capacitances add directly.",
          "conditions": "Ideal conductors without leakage current.",
          "example": "Two capacitors of 6 μF and 3 μF connected in series have C_eq = (6 × 3) / (6 + 3) = 2 μF. In parallel, C_eq = 6 + 3 = 9 μF.",
          "keywords": [
            "series capacitors",
            "parallel capacitors",
            "equivalent capacitance"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-capacitor-energy-density",
          "name": "Energy Stored in Capacitor and Field Energy Density",
          "expression": "U = (1/2) C V² = Q² / (2C) = (1/2) Q V,   u_E = (1/2) ε₀ E²",
          "latex": "U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C} = \\frac{1}{2} Q V, \\quad u_E = \\frac{1}{2} \\varepsilon_0 E^2",
          "symbols": [
            {
              "symbol": "U",
              "meaning": "Total electrostatic potential energy stored in capacitor",
              "unit": "joules (J)"
            },
            {
              "symbol": "u_E",
              "meaning": "Energy density per unit volume of electric field",
              "unit": "J m⁻³"
            },
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "farads (F)"
            },
            {
              "symbol": "V",
              "meaning": "Potential difference between plates",
              "unit": "volts (V)"
            },
            {
              "symbol": "E",
              "meaning": "Electric field magnitude",
              "unit": "V m⁻¹"
            }
          ],
          "siUnit": "joule (J) for total energy; J m⁻³ for energy density",
          "explanation": "Electrostatic energy is physically stored in the electric field between the conducting plates.",
          "conditions": "Linear dielectric medium without breakdown.",
          "example": "A 10 μF capacitor charged to 100 V stores U = 0.5 × (10 × 10⁻⁶) × (100)² = 0.5 × 10⁻⁵ × 10⁴ = 0.05 J.",
          "keywords": [
            "stored energy",
            "energy density",
            "electric field energy",
            "capacitor"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-current-electricity",
      "number": 3,
      "title": "Current Electricity",
      "description": "Drift velocity, mobility, microscopic Ohm’s law, temperature coefficient of resistance, Kirchhoff’s rules, Wheatstone bridge, and potentiometer.",
      "formulas": [
        {
          "id": "c12-drift-velocity",
          "name": "Drift Velocity and Current Density",
          "expression": "I = n e A v_d,   v_d = (e E τ) / m_e,   J = n e v_d = σ E",
          "latex": "I = n e A v_d, \\quad v_d = \\frac{e E \\tau}{m_e}, \\quad J = n e v_d = \\sigma E",
          "symbols": [
            {
              "symbol": "I",
              "meaning": "Electric current",
              "unit": "amperes (A)"
            },
            {
              "symbol": "n",
              "meaning": "Free electron number density",
              "unit": "m⁻³"
            },
            {
              "symbol": "e",
              "meaning": "Elementary charge magnitude (1.602 × 10⁻¹⁹ C)"
            },
            {
              "symbol": "A",
              "meaning": "Cross-sectional area of conductor",
              "unit": "m²"
            },
            {
              "symbol": "v_d",
              "meaning": "Average electron drift velocity",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "\\tau",
              "meaning": "Average relaxation time between collisions",
              "unit": "seconds (s)"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Electrical conductivity (σ = 1 / ρ)",
              "unit": "S m⁻¹"
            }
          ],
          "siUnit": "m s⁻¹ for drift velocity; A m⁻² for current density J",
          "explanation": "Relates microscopic electron transport under an applied electric field to macroscopic conduction current.",
          "conditions": "Conductor obeying Drude model at steady state.",
          "example": "In copper (n ≈ 8.5 × 10²⁸ m⁻³), a 1 A current in a 1 mm² wire produces drift speed v_d ≈ 7.4 × 10⁻⁵ m s⁻¹ (less than 0.1 mm s⁻¹).",
          "keywords": [
            "drift velocity",
            "current density",
            "relaxation time",
            "mobility"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-temperature-resistance",
          "name": "Temperature Dependence of Resistance",
          "expression": "R(T) = R_0 [ 1 + α (T - T_0) ]",
          "latex": "R(T) = R_0 [1 + \\alpha (T - T_0)]",
          "symbols": [
            {
              "symbol": "R(T)",
              "meaning": "Resistance at temperature T",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "R_0",
              "meaning": "Resistance at reference temperature T_0",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "\\alpha",
              "meaning": "Temperature coefficient of resistance",
              "unit": "K⁻¹ or °C⁻¹"
            }
          ],
          "siUnit": "K⁻¹ (or °C⁻¹)",
          "explanation": "In metallic conductors, increased lattice thermal vibrations increase electron scattering, raising resistance linearly over moderate temperature ranges.",
          "conditions": "Moderate temperature intervals where α remains approximately constant.",
          "example": "A platinum resistance thermometer (R_0 = 100 Ω, α = 0.00392 °C⁻¹) at 50 °C has resistance R = 100 × [1 + 0.00392 × 50] = 119.6 Ω.",
          "keywords": [
            "temperature coefficient",
            "resistance variation",
            "thermometer"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-cell-terminal-voltage",
          "name": "Terminal Potential Difference of a Cell",
          "expression": "Discharging: V = ε - I r,   Charging: V = ε + I r",
          "latex": "V = \\varepsilon - I r \\quad \\text{(Discharging)}, \\quad V = \\varepsilon + I r \\quad \\text{(Charging)}",
          "symbols": [
            {
              "symbol": "V",
              "meaning": "Terminal voltage across cell electrodes",
              "unit": "volts (V)"
            },
            {
              "symbol": "\\varepsilon",
              "meaning": "Electromotive force (emf) of cell",
              "unit": "volts (V)"
            },
            {
              "symbol": "I",
              "meaning": "Circuit current",
              "unit": "amperes (A)"
            },
            {
              "symbol": "r",
              "meaning": "Internal resistance of cell",
              "unit": "ohms (Ω)"
            }
          ],
          "siUnit": "volt (V)",
          "explanation": "The terminal potential difference of a discharging chemical cell is less than its electromotive force due to internal ohmic voltage drop I r.",
          "conditions": "Direct current delivery with steady internal resistance.",
          "example": "A battery of emf ε = 12 V and internal resistance r = 0.5 Ω supplying 4 A has terminal voltage V = 12 - (4 × 0.5) = 10 V.",
          "keywords": [
            "emf",
            "internal resistance",
            "terminal voltage",
            "cell discharge"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-kirchhoff-rules",
          "name": "Kirchhoff’s Circuit Laws",
          "expression": "Junction Rule: ∑ I_in = ∑ I_out,    Loop Rule: ∑ ΔV = ∑ ε - ∑ (I R) = 0",
          "latex": "\\sum I_{\\text{junction}} = 0, \\quad \\sum \\Delta V = \\sum \\varepsilon - \\sum (I R) = 0",
          "symbols": [
            {
              "symbol": "\\sum I",
              "meaning": "Algebraic sum of currents meeting at any electrical node",
              "unit": "amperes (A)"
            },
            {
              "symbol": "\\sum \\Delta V",
              "meaning": "Algebraic sum of potential differences around any closed circuit mesh",
              "unit": "volts (V)"
            }
          ],
          "siUnit": "ampere (A) for junction rule; volt (V) for loop rule",
          "explanation": "The junction rule is a direct consequence of the conservation of electric charge. The loop rule is a direct consequence of the conservation of energy in electrostatic fields.",
          "conditions": "Lumped circuit elements without time-varying magnetic flux linkage inside loop.",
          "example": "At a 3-way junction, if currents of 2 A and 3 A flow inward, exactly 2 + 3 = 5 A must leave through the third branch.",
          "keywords": [
            "kirchhoff rules",
            "junction rule",
            "loop rule",
            "circuit analysis"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-wheatstone-bridge",
          "name": "Balanced Wheatstone Bridge Condition",
          "expression": "P / Q = R / S   ⇒   I_Galvanometer = 0",
          "latex": "\\frac{P}{Q} = \\frac{R}{S} \\implies I_{\\text{Galvanometer}} = 0",
          "symbols": [
            {
              "symbol": "P, Q, R, S",
              "meaning": "Resistances forming the four bridge arms",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "I_{\\text{Galvanometer}}",
              "meaning": "Current through central galvanometer null detector",
              "unit": "A"
            }
          ],
          "siUnit": "Dimensionless resistance ratio equality",
          "explanation": "When the ratio of resistances in adjacent arms is equal, potentials at the two bridge detector nodes become identical, resulting in zero galvanometer deflection.",
          "conditions": "DC bridge network at balance point null condition.",
          "example": "If P = 10 Ω, Q = 20 Ω, and R = 15 Ω, then the unknown resistance S for balance is S = (Q × R) / P = (20 × 15) / 10 = 30 Ω.",
          "keywords": [
            "wheatstone bridge",
            "null condition",
            "meter bridge",
            "galvanometer"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-moving-charges",
      "number": 4,
      "title": "Moving Charges and Magnetism",
      "description": "Biot-Savart law, Ampere’s circuital law, magnetic field of circular coil, Lorentz force, cyclotron frequency, and magnetic torque on a loop.",
      "formulas": [
        {
          "id": "c12-lorentz-force",
          "name": "Lorentz Force on a Moving Charge",
          "expression": "F = q (E + v × B),   F_magnetic = q (v × B)",
          "latex": "\\mathbf{F} = q (\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})",
          "alternateLatex": [
            "F_{\\text{mag}} = q v B \\sin\\theta"
          ],
          "symbols": [
            {
              "symbol": "\\mathbf{F}",
              "meaning": "Total Lorentz force vector",
              "unit": "newtons (N)"
            },
            {
              "symbol": "q",
              "meaning": "Charge of moving particle",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "\\mathbf{v}",
              "meaning": "Particle velocity vector",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "\\mathbf{E}",
              "meaning": "Electric field vector",
              "unit": "V m⁻¹"
            },
            {
              "symbol": "\\mathbf{B}",
              "meaning": "Magnetic flux density vector",
              "unit": "tesla (T)"
            }
          ],
          "siUnit": "newton (N)",
          "explanation": "The magnetic force acts strictly perpendicular to both particle velocity and magnetic field, doing zero work and altering only the direction of motion.",
          "conditions": "Charged particle in combined electric and magnetic fields.",
          "example": "A proton (q = 1.6 × 10⁻¹⁹ C) moving at 10⁶ m s⁻¹ perpendicular to B = 0.5 T experiences magnetic force F = (1.6 × 10⁻¹⁹) × 10⁶ × 0.5 = 8.0 × 10⁻¹⁴ N.",
          "keywords": [
            "lorentz force",
            "magnetic force",
            "cross product",
            "right hand rule"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-biot-savart",
          "name": "Biot-Savart Law",
          "expression": "dB = (μ₀ / (4π)) × (I dl × r̂) / r² = (μ₀ / (4π)) × (I dl sin(θ)) / r²",
          "latex": "d\\mathbf{B} = \\frac{\\mu_0}{4\\pi} \\frac{I (d\\mathbf{l} \\times \\hat{r})}{r^2}, \\quad dB = \\frac{\\mu_0}{4\\pi} \\frac{I dl \\sin\\theta}{r^2}",
          "symbols": [
            {
              "symbol": "d\\mathbf{B}",
              "meaning": "Differential magnetic field vector",
              "unit": "tesla (T)"
            },
            {
              "symbol": "\\frac{\\mu_0}{4\\pi}",
              "meaning": "Magnetic constant factor (10⁻⁷ T m A⁻¹)",
              "unit": "T m A⁻¹"
            },
            {
              "symbol": "I d\\mathbf{l}",
              "meaning": "Current element vector",
              "unit": "A m"
            },
            {
              "symbol": "r",
              "meaning": "Distance from current element to observation point",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\theta",
              "meaning": "Angle between dl and position vector r",
              "unit": "degrees or radians"
            }
          ],
          "siUnit": "tesla (T, where 1 T = 1 N A⁻¹ m⁻¹ = 1 Wb m⁻²)",
          "explanation": "Fundamental relation yielding the magnetic field generated by an infinitesimal current element.",
          "conditions": "Steady, non-varying direct currents.",
          "example": "At the centre of a circular loop of radius R carrying current I, integrating Biot-Savart law yields B = (μ₀ I) / (2 R).",
          "keywords": [
            "biot savart",
            "current element",
            "magnetic field",
            "permeability"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-amperes-law",
          "name": "Ampere’s Circuital Law",
          "expression": "∮ B · dl = μ₀ I_enclosed",
          "latex": "\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enclosed}}",
          "symbols": [
            {
              "symbol": "\\mathbf{B}",
              "meaning": "Magnetic flux density vector",
              "unit": "tesla (T)"
            },
            {
              "symbol": "d\\mathbf{l}",
              "meaning": "Infinitesimal directed line element along closed Amperian loop",
              "unit": "metres (m)"
            },
            {
              "symbol": "I_{\\text{enclosed}}",
              "meaning": "Net steady electric current threading through the closed loop",
              "unit": "amperes (A)"
            }
          ],
          "siUnit": "tesla-metre (T m)",
          "explanation": "The line integral of magnetic field around any arbitrary closed loop equals μ₀ times the total steady current enclosed within the loop.",
          "conditions": "Steady direct currents with symmetrical geometries.",
          "example": "For an infinitely long straight wire, evaluating along a circle of radius r yields B(2π r) = μ₀ I, so B = (μ₀ I) / (2π r).",
          "keywords": [
            "amperes law",
            "circuital law",
            "straight wire field",
            "enclosed current"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-cyclotron-radius-freq",
          "name": "Radius and Frequency of Cyclotron Orbit",
          "expression": "r = (m v) / (q B),   f_c = (q B) / (2π m)",
          "latex": "r = \\frac{m v}{q B}, \\quad f_c = \\frac{q B}{2\\pi m}",
          "symbols": [
            {
              "symbol": "r",
              "meaning": "Gyroradius of circular helical trajectory",
              "unit": "metres (m)"
            },
            {
              "symbol": "f_c",
              "meaning": "Cyclotron resonance frequency",
              "unit": "hertz (Hz)"
            },
            {
              "symbol": "m",
              "meaning": "Mass of charged particle",
              "unit": "kilograms (kg)"
            },
            {
              "symbol": "q",
              "meaning": "Charge of particle",
              "unit": "coulombs (C)"
            },
            {
              "symbol": "B",
              "meaning": "Uniform perpendicular magnetic field",
              "unit": "tesla (T)"
            }
          ],
          "siUnit": "metres (m) for radius; hertz (Hz) for cyclotron frequency",
          "explanation": "In a uniform magnetic field, magnetic Lorentz force acts as the centripetal force: q v B = m v² / r. The cyclotron frequency is independent of orbit radius and particle speed.",
          "conditions": "Non-relativistic particle speeds (v ≪ c).",
          "example": "An electron (m = 9.1 × 10⁻³¹ kg, q = 1.6 × 10⁻¹⁹ C) in B = 0.01 T has cyclotron frequency f_c = (1.6 × 10⁻¹⁹ × 0.01) / (2π × 9.1 × 10⁻³¹) ≈ 2.8 × 10⁸ Hz = 280 MHz.",
          "keywords": [
            "cyclotron",
            "gyroradius",
            "resonance frequency",
            "magnetic deflection"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-magnetism-matter",
      "number": 5,
      "title": "Magnetism and Matter",
      "description": "Gauss’s law for magnetism, Earth’s magnetic elements, magnetisation, magnetic susceptibility, and relative permeability.",
      "formulas": [
        {
          "id": "c12-gauss-law-magnetism",
          "name": "Gauss’s Law for Magnetism",
          "expression": "∮ B · dA = 0",
          "latex": "\\oint \\mathbf{B} \\cdot d\\mathbf{A} = 0",
          "symbols": [
            {
              "symbol": "\\mathbf{B}",
              "meaning": "Magnetic flux density vector",
              "unit": "tesla (T)"
            },
            {
              "symbol": "d\\mathbf{A}",
              "meaning": "Outward area element of closed surface",
              "unit": "m²"
            }
          ],
          "siUnit": "weber (Wb, where 1 Wb = 1 T m²)",
          "explanation": "The net magnetic flux through any closed surface is identically zero, establishing that isolated magnetic monopoles do not exist in nature.",
          "conditions": "Universal law valid for any closed surface.",
          "example": "Every magnetic field line entering a closed volume must emerge from it, forming continuous closed loops.",
          "keywords": [
            "gauss law for magnetism",
            "magnetic monopoles",
            "closed field lines",
            "flux"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-magnetic-permeability-susceptibility",
          "name": "Magnetic Susceptibility and Relative Permeability",
          "expression": "M = χ_m H,   B = μ₀ (H + M) = μ H,   μ_r = 1 + χ_m",
          "latex": "\\mathbf{M} = \\chi_m \\mathbf{H}, \\quad \\mathbf{B} = \\mu_0 (\\mathbf{H} + \\mathbf{M}) = \\mu \\mathbf{H}, \\quad \\mu_r = 1 + \\chi_m",
          "symbols": [
            {
              "symbol": "\\mathbf{M}",
              "meaning": "Magnetisation (dipole moment per unit volume)",
              "unit": "A m⁻¹"
            },
            {
              "symbol": "\\mathbf{H}",
              "meaning": "Magnetic field intensity (magnetising field)",
              "unit": "A m⁻¹"
            },
            {
              "symbol": "\\chi_m",
              "meaning": "Magnetic susceptibility (dimensionless)"
            },
            {
              "symbol": "\\mu_r",
              "meaning": "Relative magnetic permeability (μ / μ₀, dimensionless)"
            },
            {
              "symbol": "\\mathbf{B}",
              "meaning": "Total magnetic flux density inside material",
              "unit": "tesla (T)"
            }
          ],
          "siUnit": "A m⁻¹ for M and H; dimensionless for χ_m and μ_r",
          "explanation": "Classifies magnetic materials: diamagnetic (χ_m small and negative, μ_r < 1), paramagnetic (χ_m small and positive, μ_r > 1), ferromagnetic (χ_m very large positive, μ_r ≫ 1).",
          "conditions": "Linear, isotropic, homogeneous magnetic media.",
          "example": "For aluminium (paramagnetic with χ_m = 2.2 × 10⁻⁵): relative permeability is μ_r = 1 + 2.2 × 10⁻⁵ = 1.000022.",
          "keywords": [
            "susceptibility",
            "relative permeability",
            "magnetisation",
            "diamagnetic",
            "paramagnetic"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-emi",
      "number": 6,
      "title": "Electromagnetic Induction",
      "description": "Faraday’s law, Lenz’s law, motional electromotive force, self-inductance, mutual inductance, and stored magnetic energy.",
      "formulas": [
        {
          "id": "c12-faraday-lenz-law",
          "name": "Faraday-Lenz Law of Induction",
          "expression": "ε = - N (dΦ_B / dt)",
          "latex": "\\varepsilon = - N \\frac{d\\Phi_B}{dt}",
          "alternateLatex": [
            "\\Phi_B = \\mathbf{B} \\cdot \\mathbf{A} = B A \\cos\\theta"
          ],
          "symbols": [
            {
              "symbol": "\\varepsilon",
              "meaning": "Induced electromotive force (emf)",
              "unit": "volts (V)"
            },
            {
              "symbol": "N",
              "meaning": "Number of turns in the coil"
            },
            {
              "symbol": "\\Phi_B",
              "meaning": "Magnetic flux linkage (B · A = B A cos θ)",
              "unit": "webers (Wb)"
            },
            {
              "symbol": "t",
              "meaning": "Time",
              "unit": "seconds (s)"
            }
          ],
          "siUnit": "volt (V, where 1 V = 1 Wb s⁻¹)",
          "explanation": "The magnitude of induced emf is proportional to the time rate of change of magnetic flux. The negative sign represents Lenz’s law: the polarity of induced emf opposes the change that produces it.",
          "conditions": "Valid for time-varying magnetic fields, varying area, or rotating orientation.",
          "signConvention": "Negative sign signifies Lenz’s law: the polarity of induced electromotive force opposes the change in magnetic flux that produces it.",
          "example": "Magnetic flux through a 100-turn coil changing uniformly from 0.05 Wb to 0.01 Wb in 0.1 s produces induced emf ε = -100 × (0.01 - 0.05) / 0.1 = -100 × (-0.4) = +40 V.",
          "keywords": [
            "faradays law",
            "lenzs law",
            "induced emf",
            "magnetic flux",
            "conservation of energy"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-motional-emf",
          "name": "Motional EMF",
          "expression": "ε = B L v",
          "latex": "\\varepsilon = B L v",
          "symbols": [
            {
              "symbol": "\\varepsilon",
              "meaning": "Motional emf induced across conducting rod",
              "unit": "volts (V)"
            },
            {
              "symbol": "B",
              "meaning": "Perpendicular magnetic flux density",
              "unit": "tesla (T)"
            },
            {
              "symbol": "L",
              "meaning": "Length of conducting rod",
              "unit": "metres (m)"
            },
            {
              "symbol": "v",
              "meaning": "Speed of translation across field lines",
              "unit": "m s⁻¹"
            }
          ],
          "siUnit": "volt (V)",
          "explanation": "EMF generated across the ends of a conductor translating through a magnetic field due to magnetic Lorentz forces acting on mobile conduction electrons.",
          "conditions": "Rod, magnetic field, and velocity vectors mutually perpendicular.",
          "example": "An aircraft with wingspan L = 30 m flying at v = 200 m s⁻¹ through vertical magnetic field B = 4 × 10⁻⁵ T develops wingspan potential ε = (4 × 10⁻⁵) × 30 × 200 = 0.24 V.",
          "keywords": [
            "motional emf",
            "conducting rod",
            "lorentz force",
            "flux cutting"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-self-inductance",
          "name": "Self-Inductance and Stored Magnetic Energy",
          "expression": "ε = - L (dI / dt),   Φ_total = L I,   U_B = (1/2) L I²",
          "latex": "\\varepsilon = - L \\frac{dI}{dt}, \\quad \\Phi_{\\text{total}} = L I, \\quad U_B = \\frac{1}{2} L I^2",
          "symbols": [
            {
              "symbol": "L",
              "meaning": "Self-inductance coefficient of inductor",
              "unit": "henries (H)"
            },
            {
              "symbol": "\\varepsilon",
              "meaning": "Self-induced back emf opposing current change",
              "unit": "volts (V)"
            },
            {
              "symbol": "I",
              "meaning": "Current flowing through inductor",
              "unit": "amperes (A)"
            },
            {
              "symbol": "U_B",
              "meaning": "Magnetic energy stored in field",
              "unit": "joules (J)"
            }
          ],
          "siUnit": "henry (H, where 1 H = 1 V s A⁻¹ = 1 Wb A⁻¹)",
          "explanation": "Inductance is electrical inertia opposing any temporal variation in current. Energy is stored in the surrounding magnetic field.",
          "conditions": "Linear non-saturating inductor core.",
          "example": "A 2 H inductor carrying 3 A stores magnetic energy U_B = 0.5 × 2 × 3² = 9.0 J.",
          "keywords": [
            "self inductance",
            "henry",
            "back emf",
            "stored magnetic energy"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-alternating-current",
      "number": 7,
      "title": "Alternating Current",
      "description": "RMS values, inductive/capacitive reactance, LCR series circuit impedance, electrical resonance, power factor, and ideal transformers.",
      "formulas": [
        {
          "id": "c12-rms-values",
          "name": "RMS and Peak Values for Sinusoidal AC",
          "expression": "V_rms = V_0 / √2 ≈ 0.707 V_0,   I_rms = I_0 / √2 ≈ 0.707 I_0",
          "latex": "V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}} \\approx 0.707 V_0, \\quad I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}} \\approx 0.707 I_0",
          "symbols": [
            {
              "symbol": "V_{\\text{rms}}, I_{\\text{rms}}",
              "meaning": "Root-mean-square (effective) AC voltage and current",
              "unit": "V, A"
            },
            {
              "symbol": "V_0, I_0",
              "meaning": "Peak sinusoidal AC voltage and current amplitudes",
              "unit": "V, A"
            }
          ],
          "siUnit": "volt (V) and ampere (A)",
          "explanation": "The RMS value of an alternating current equals the equivalent steady direct current (DC) that generates identical Joule heating in a given resistor over one full cycle.",
          "conditions": "Pure sinusoidal AC waveforms.",
          "example": "Standard Indian domestic AC supply is 220 V RMS; its peak voltage is V_0 = 220 × √2 ≈ 311 V.",
          "keywords": [
            "rms value",
            "peak voltage",
            "effective current",
            "alternating current"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-reactance-formulas",
          "name": "Inductive and Capacitive Reactance",
          "expression": "X_L = ω L = 2π f L,   X_C = 1 / (ω C) = 1 / (2π f C)",
          "latex": "X_L = \\omega L = 2\\pi f L, \\quad X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}",
          "symbols": [
            {
              "symbol": "X_L",
              "meaning": "Inductive reactance",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "X_C",
              "meaning": "Capacitive reactance",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "f",
              "meaning": "AC frequency",
              "unit": "hertz (Hz)"
            },
            {
              "symbol": "L",
              "meaning": "Inductance",
              "unit": "henries (H)"
            },
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "farads (F)"
            }
          ],
          "siUnit": "ohm (Ω)",
          "explanation": "Reactances measure the opposition presented by inductors and capacitors to alternating current without consuming real power. X_L increases with frequency; X_C decreases with frequency.",
          "conditions": "Sinusoidal steady-state AC excitation.",
          "example": "At 50 Hz, an inductor of L = 0.318 H (1 / π H) has X_L = 2π × 50 × (1/π) = 100 Ω.",
          "keywords": [
            "inductive reactance",
            "capacitive reactance",
            "frequency response"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-lcr-impedance",
          "name": "Series LCR Circuit Impedance and Resonance",
          "expression": "Z = √[ R² + (X_L - X_C)² ],   f_0 = 1 / (2π √(L C))",
          "latex": "Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad f_0 = \\frac{1}{2\\pi \\sqrt{L C}}",
          "symbols": [
            {
              "symbol": "Z",
              "meaning": "Total electrical impedance of series LCR circuit",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "R",
              "meaning": "Ohmic resistance",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "f_0",
              "meaning": "Resonant frequency where X_L = X_C",
              "unit": "hertz (Hz)"
            }
          ],
          "siUnit": "ohm (Ω) for impedance; hertz (Hz) for resonance frequency",
          "explanation": "At electrical resonance, inductive and capacitive reactances cancel (X_L = X_C), minimizing impedance to Z = R and maximizing current amplitude.",
          "conditions": "Series RLC circuit driven by variable frequency sinusoidal source.",
          "example": "In a circuit with L = 10 mH, C = 1 μF: resonant frequency is f_0 = 1 / (2π √(10⁻² × 10⁻⁶)) = 1 / (2π × 10⁻⁴) ≈ 1592 Hz.",
          "keywords": [
            "lcr circuit",
            "impedance",
            "resonance",
            "tuning circuit"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-transformer-ratio",
          "name": "Ideal Transformer Transformation Ratio",
          "expression": "V_s / V_p = N_s / N_p = I_p / I_s = k",
          "latex": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s} = k",
          "symbols": [
            {
              "symbol": "V_p, V_s",
              "meaning": "Primary and secondary terminal voltages",
              "unit": "volts (V)"
            },
            {
              "symbol": "N_p, N_s",
              "meaning": "Number of turns on primary and secondary coils"
            },
            {
              "symbol": "I_p, I_s",
              "meaning": "Primary and secondary currents",
              "unit": "amperes (A)"
            },
            {
              "symbol": "k",
              "meaning": "Transformation ratio (step-up: k > 1, step-down: k < 1)"
            }
          ],
          "siUnit": "Dimensionless ratio",
          "explanation": "Relates voltages and currents between primary and secondary windings through mutual magnetic flux linkage, assuming 100% efficiency (P_in = P_out).",
          "conditions": "Ideal transformer: zero winding resistance, zero core hysteresis/eddy-current losses, zero flux leakage.",
          "example": "A step-down transformer converting 2200 V to 220 V (k = 0.1) delivering 10 A secondary current draws primary current I_p = 10 × 0.1 = 1.0 A.",
          "keywords": [
            "transformer",
            "turns ratio",
            "step up",
            "step down",
            "mutual induction"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-em-waves",
      "number": 8,
      "title": "Electromagnetic Waves",
      "description": "Displacement current, Maxwell’s equations, speed of EM waves in vacuum, and electromagnetic spectrum characteristics.",
      "formulas": [
        {
          "id": "c12-maxwell-displacement-current",
          "name": "Maxwell’s Displacement Current",
          "expression": "I_d = ε₀ (dΦ_E / dt)",
          "latex": "I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}",
          "symbols": [
            {
              "symbol": "I_d",
              "meaning": "Displacement current between capacitor plates",
              "unit": "amperes (A)"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Vacuum permittivity (8.854 × 10⁻¹² F m⁻¹)",
              "unit": "F m⁻¹"
            },
            {
              "symbol": "\\Phi_E",
              "meaning": "Time-varying electric flux",
              "unit": "V m"
            }
          ],
          "siUnit": "ampere (A)",
          "explanation": "A changing electric field produces a magnetic field just as a real conduction current does, completing Ampere-Maxwell law: ∮ B · dl = μ₀(I_c + I_d).",
          "conditions": "Regions with time-varying electric fields.",
          "example": "Inside a charging capacitor where conduction current I_c = 2 A, the displacement current I_d between the plates is also exactly 2 A, preserving current continuity.",
          "keywords": [
            "displacement current",
            "maxwell",
            "changing electric field",
            "ampere maxwell"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-em-wave-speed",
          "name": "Speed and Field Ratio of Electromagnetic Waves",
          "expression": "c = 1 / √(μ₀ ε₀) ≈ 3.00 × 10⁸ m s⁻¹,   E_0 / B_0 = c",
          "latex": "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 3.00 \\times 10^8 \\text{ m/s}, \\quad \\frac{E_0}{B_0} = c",
          "symbols": [
            {
              "symbol": "c",
              "meaning": "Speed of light in vacuum",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "E_0",
              "meaning": "Electric field amplitude",
              "unit": "V m⁻¹"
            },
            {
              "symbol": "B_0",
              "meaning": "Magnetic field amplitude",
              "unit": "tesla (T)"
            }
          ],
          "siUnit": "m s⁻¹",
          "explanation": "Electromagnetic waves consist of self-sustaining transverse oscillating electric and magnetic fields perpendicular to each other and to the propagation direction.",
          "conditions": "Propagation through free space (vacuum).",
          "example": "If electric field amplitude is E_0 = 600 V m⁻¹, the associated magnetic field amplitude is B_0 = 600 / (3 × 10⁸) = 2.0 × 10⁻⁶ T (2.0 μT).",
          "keywords": [
            "speed of light",
            "em waves",
            "field ratio",
            "permittivity",
            "permeability"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-ray-optics",
      "number": 9,
      "title": "Ray Optics and Optical Instruments",
      "description": "Lens Maker’s formula, refraction through prism, compound microscope magnification, and astronomical telescope.",
      "formulas": [
        {
          "id": "c12-lens-maker",
          "name": "Lens Maker’s Formula",
          "expression": "1 / f = (n - 1) [ 1 / R₁ - 1 / R₂ ]",
          "latex": "\\frac{1}{f} = (n - 1) \\left[ \\frac{1}{R_1} - \\frac{1}{R_2} \\right]",
          "symbols": [
            {
              "symbol": "f",
              "meaning": "Focal length of thin lens in air",
              "unit": "metres (m)"
            },
            {
              "symbol": "n",
              "meaning": "Refractive index of lens glass relative to surrounding medium"
            },
            {
              "symbol": "R_1, R_2",
              "meaning": "Radii of curvature of the two optical surfaces",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "m⁻¹ (dioptres)",
          "explanation": "Relates focal length to the refractive index of the lens glass and radii of curvature of both spherical surfaces using Cartesian sign conventions.",
          "conditions": "Thin lens surrounded by air or uniform medium.",
          "signConvention": "Standard Cartesian sign convention: light travels from left to right; distances in incident direction are positive; convex surface R > 0, concave surface R < 0.",
          "example": "For an equiconvex glass lens (n = 1.5, R₁ = +20 cm, R₂ = -20 cm): 1/f = (1.5 - 1)[1/20 - (-1/20)] = 0.5 × (2/20) = 1/20, so f = +20 cm.",
          "keywords": [
            "lens maker",
            "curvature",
            "refractive index",
            "focal length"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-prism-deviation",
          "name": "Refraction Through a Triangular Prism",
          "expression": "A + δ = i + e,   n = sin((A + δ_min) / 2) / sin(A / 2)",
          "latex": "A + \\delta = i + e, \\quad n = \\frac{\\sin\\left(\\frac{A + \\delta_{\\text{min}}}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}",
          "symbols": [
            {
              "symbol": "A",
              "meaning": "Prism angle of refraction",
              "unit": "degrees"
            },
            {
              "symbol": "\\delta",
              "meaning": "Angle of deviation",
              "unit": "degrees"
            },
            {
              "symbol": "\\delta_{\\text{min}}",
              "meaning": "Minimum angle of deviation",
              "unit": "degrees"
            },
            {
              "symbol": "i",
              "meaning": "Angle of incidence",
              "unit": "degrees"
            },
            {
              "symbol": "e",
              "meaning": "Angle of emergence",
              "unit": "degrees"
            },
            {
              "symbol": "n",
              "meaning": "Refractive index of prism glass"
            }
          ],
          "siUnit": "Dimensionless for index n; degrees for angles",
          "explanation": "At minimum deviation (δ = δ_min), the refracted ray travels symmetrically through the prism parallel to the base, and angle of incidence equals emergence (i = e).",
          "conditions": "Monochromatic light refracting symmetrically through a triangular glass prism.",
          "example": "For an equilateral prism (A = 60°) with δ_min = 30°: n = sin(45°) / sin(30°) = (1 / √2) / 0.5 = √2 ≈ 1.414.",
          "keywords": [
            "prism",
            "minimum deviation",
            "refraction",
            "dispersion"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-compound-microscope",
          "name": "Magnifying Power of a Compound Microscope",
          "expression": "Image at D: M = - (v_o / u_o) [ 1 + D / f_e ] ≈ - (L / f_o)(D / f_e)",
          "latex": "M = -\\frac{v_o}{u_o} \\left[ 1 + \\frac{D}{f_e} \\right] \\approx -\\frac{L}{f_o} \\left( \\frac{D}{f_e} \\right)",
          "symbols": [
            {
              "symbol": "M",
              "meaning": "Total angular magnification"
            },
            {
              "symbol": "v_o, u_o",
              "meaning": "Image and object distances for objective lens",
              "unit": "metres (m)"
            },
            {
              "symbol": "f_o, f_e",
              "meaning": "Focal lengths of objective and eyepiece lenses",
              "unit": "metres (m)"
            },
            {
              "symbol": "D",
              "meaning": "Least distance of distinct vision (25 cm = 0.25 m)"
            },
            {
              "symbol": "L",
              "meaning": "Tube length of microscope",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "Dimensionless (angular magnification)",
          "explanation": "Compound microscope uses a short focal length objective to form a magnified real image, which is further magnified as a virtual image by the eyepiece.",
          "conditions": "Final image formed at near point D = 25 cm.",
          "signConvention": "Negative sign indicates the final image formed is inverted with respect to the initial object.",
          "example": "With f_o = 1 cm, f_e = 5 cm, and tube length L = 20 cm: M ≈ -(20 / 1) × (25 / 5) = -20 × 5 = -100 (inverted image).",
          "keywords": [
            "compound microscope",
            "magnification",
            "objective",
            "eyepiece"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-astronomical-telescope",
          "name": "Magnifying Power of an Astronomical Telescope",
          "expression": "Normal Adjustment (Image at ∞): M = - f_o / f_e,   Length of Tube = f_o + f_e",
          "latex": "M = -\\frac{f_o}{f_e}, \\quad L_{\\text{tube}} = f_o + f_e",
          "symbols": [
            {
              "symbol": "M",
              "meaning": "Angular magnifying power in normal adjustment"
            },
            {
              "symbol": "f_o",
              "meaning": "Focal length of objective lens (large aperture)",
              "unit": "metres (m)"
            },
            {
              "symbol": "f_e",
              "meaning": "Focal length of eyepiece lens",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "Dimensionless",
          "explanation": "In normal adjustment, parallel rays from a distant celestial object focus at the common focal plane of objective and eyepiece, exiting as parallel rays for strain-free viewing.",
          "conditions": "Normal adjustment with both object and final image at infinity.",
          "signConvention": "Negative sign signifies an inverted final image when viewed in normal adjustment.",
          "example": "A telescope with objective f_o = 100 cm and eyepiece f_e = 5 cm has magnifying power M = -(100 / 5) = -20 and tube length L = 100 + 5 = 105 cm.",
          "keywords": [
            "telescope",
            "normal adjustment",
            "angular magnification",
            "astronomical"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-wave-optics",
      "number": 10,
      "title": "Wave Optics",
      "description": "Huygens’ principle, Young’s double slit interference, fringe width, single slit diffraction, Brewster’s law, and Malus’ law.",
      "formulas": [
        {
          "id": "c12-ydse-fringe-width",
          "name": "Fringe Width in Young’s Double Slit Experiment",
          "expression": "β = (λ D) / d,   Bright: y_n = (n λ D) / d,   Dark: y_n = (n - 1/2)(λ D) / d",
          "latex": "\\beta = \\frac{\\lambda D}{d}, \\quad y_{\\text{bright}} = \\frac{n \\lambda D}{d}, \\quad y_{\\text{dark}} = \\left( n - \\frac{1}{2} \\right) \\frac{\\lambda D}{d}",
          "symbols": [
            {
              "symbol": "\\beta",
              "meaning": "Fringe width (separation between adjacent bright or dark fringes)",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Wavelength of monochromatic light source",
              "unit": "metres (m)"
            },
            {
              "symbol": "D",
              "meaning": "Distance from slits to observation screen",
              "unit": "metres (m)"
            },
            {
              "symbol": "d",
              "meaning": "Separation distance between the two coherent slits",
              "unit": "metres (m)"
            },
            {
              "symbol": "n",
              "meaning": "Fringe order index (0, 1, 2...)"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Monochromatic light passing through two parallel coherent slits interferes constructively and destructively, producing equally spaced alternate bright and dark interference fringes.",
          "conditions": "D ≫ d and d ≫ λ (small angle paraxial approximation); coherent sources.",
          "example": "Using λ = 600 nm, slit separation d = 1 mm (10⁻³ m), and screen distance D = 1 m: fringe width β = (600 × 10⁻⁹ × 1) / 10⁻³ = 6.0 × 10⁻⁴ m = 0.6 mm.",
          "keywords": [
            "ydse",
            "fringe width",
            "interference",
            "coherent slits",
            "youngs experiment"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-single-slit-diffraction",
          "name": "Single Slit Fraunhofer Diffraction Minima",
          "expression": "a sin(θ) = n λ   (n = ±1, ±2, ...),   Angular Width of Central Max = (2λ) / a",
          "latex": "a \\sin\\theta = n \\lambda \\quad (n = \\pm 1, \\pm 2, \\dots), \\quad 2\\theta_0 = \\frac{2\\lambda}{a}",
          "symbols": [
            {
              "symbol": "a",
              "meaning": "Width of diffracting single slit",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\theta",
              "meaning": "Diffraction angle for minima",
              "unit": "radians"
            },
            {
              "symbol": "n",
              "meaning": "Non-zero integer order of secondary minimum"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Wavelength of incident planar wave",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "radians for angular width; metres for linear width",
          "explanation": "Diffraction from different segments of the same wavefront leads to destructive interference at angles satisfying a sin θ = n λ. The central maximum is twice as wide as secondary maxima.",
          "conditions": "Fraunhofer diffraction condition (incident and diffracted wavefronts planar).",
          "example": "A slit of width a = 0.2 mm illuminated by light of λ = 600 nm has central maximum angular width 2θ = (2 × 600 × 10⁻⁹) / (2 × 10⁻⁴) = 6.0 × 10⁻³ rad.",
          "keywords": [
            "diffraction",
            "single slit",
            "central maximum",
            "fraunhofer"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-malus-brewster-law",
          "name": "Polarisation: Brewster’s Law and Malus’ Law",
          "expression": "Brewster: tan(i_p) = n,   Malus: I = I_0 cos²(θ)",
          "latex": "\\tan i_p = n, \\quad I = I_0 \\cos^2\\theta",
          "symbols": [
            {
              "symbol": "i_p",
              "meaning": "Polarising angle (Brewster angle)",
              "unit": "degrees"
            },
            {
              "symbol": "n",
              "meaning": "Refractive index of dielectric medium"
            },
            {
              "symbol": "I",
              "meaning": "Transmitted light intensity through analyser",
              "unit": "W m⁻²"
            },
            {
              "symbol": "I_0",
              "meaning": "Intensity of linearly polarised light incident on analyser",
              "unit": "W m⁻²"
            },
            {
              "symbol": "\\theta",
              "meaning": "Angle between transmission axes of polariser and analyser",
              "unit": "degrees"
            }
          ],
          "siUnit": "W m⁻² for intensity; dimensionless for refractive index",
          "explanation": "Brewster’s law gives the incidence angle at which reflected light is completely plane-polarised. Malus’ law governs the intensity transmitted through crossed or tilted polarising filters.",
          "conditions": "Linear non-absorbing polarising sheets; reflection from dielectric interface.",
          "example": "For glass (n = 1.5): Brewster angle i_p = arctan(1.5) ≈ 56.3°. If two polarisers are crossed at 90° (θ = 90°), transmitted intensity is I = I_0 cos²(90°) = 0.",
          "keywords": [
            "polarisation",
            "brewsters law",
            "malus law",
            "polariser",
            "analyser"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-dual-nature",
      "number": 11,
      "title": "Dual Nature of Radiation and Matter",
      "description": "Photon energy, momentum, Einstein’s photoelectric equation, stopping potential, and de Broglie matter waves.",
      "formulas": [
        {
          "id": "c12-einstein-photoelectric",
          "name": "Einstein’s Photoelectric Equation",
          "expression": "K_max = h f - Φ_0 = e V_0,   Φ_0 = h f_0",
          "latex": "K_{\\text{max}} = h f - \\Phi_0 = e V_0, \\quad \\Phi_0 = h f_0",
          "symbols": [
            {
              "symbol": "K_{\\text{max}}",
              "meaning": "Maximum kinetic energy of emitted photoelectrons",
              "unit": "joules (J) or eV"
            },
            {
              "symbol": "h",
              "meaning": "Planck constant (6.626 × 10⁻³⁴ J s)",
              "unit": "J s"
            },
            {
              "symbol": "f",
              "meaning": "Frequency of incident light",
              "unit": "Hz"
            },
            {
              "symbol": "\\Phi_0",
              "meaning": "Work function of photosensitive cathode",
              "unit": "eV or J"
            },
            {
              "symbol": "e",
              "meaning": "Elementary charge (1.602 × 10⁻¹⁹ C)",
              "unit": "C"
            },
            {
              "symbol": "V_0",
              "meaning": "Stopping cut-off potential",
              "unit": "volts (V)"
            },
            {
              "symbol": "f_0",
              "meaning": "Threshold frequency below which no emission occurs",
              "unit": "Hz"
            }
          ],
          "siUnit": "joules (J) or electron-volts (1 eV = 1.602 × 10⁻¹⁹ J)",
          "explanation": "Light behaves as localised energy packets (photons). One photon delivers all its energy hf to a single electron; excess energy above work function Φ_0 becomes kinetic energy.",
          "conditions": "Instantaneous quantum single-photon absorption process.",
          "example": "Photons of 4.0 eV incident on a metal with work function Φ_0 = 2.5 eV emit photoelectrons with K_max = 4.0 - 2.5 = 1.5 eV, requiring stopping potential V_0 = 1.5 V.",
          "keywords": [
            "photoelectric effect",
            "einstein equation",
            "work function",
            "stopping potential",
            "photon"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-de-broglie-wavelength",
          "name": "de Broglie Matter Wave Equation",
          "expression": "λ = h / p = h / (m v) = h / √(2 m K) = 1.227 / √V nm   [for electron]",
          "latex": "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}} = \\frac{1.227}{\\sqrt{V}} \\text{ nm}",
          "symbols": [
            {
              "symbol": "\\lambda",
              "meaning": "de Broglie wavelength of matter particle",
              "unit": "metres (m) or nm"
            },
            {
              "symbol": "h",
              "meaning": "Planck constant",
              "unit": "J s"
            },
            {
              "symbol": "p",
              "meaning": "Linear momentum of particle",
              "unit": "kg m s⁻¹"
            },
            {
              "symbol": "m",
              "meaning": "Mass of particle",
              "unit": "kg"
            },
            {
              "symbol": "K",
              "meaning": "Kinetic energy (K = q V)",
              "unit": "joules (J)"
            },
            {
              "symbol": "V",
              "meaning": "Accelerating potential difference",
              "unit": "volts (V)"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Every moving material particle exhibits wave properties with wavelength inversely proportional to its linear momentum.",
          "conditions": "Non-relativistic particle speeds (v ≪ c).",
          "example": "An electron accelerated through potential difference V = 100 V has de Broglie wavelength λ = 1.227 / √100 = 1.227 / 10 = 0.1227 nm = 1.227 Å.",
          "keywords": [
            "de broglie",
            "matter waves",
            "wave particle duality",
            "electron wavelength"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-atoms",
      "number": 12,
      "title": "Atoms",
      "description": "Rutherford scattering, Bohr model of hydrogen atom, orbital radius, orbital velocity, energy levels, and Rydberg formula.",
      "formulas": [
        {
          "id": "c12-bohr-quantisation",
          "name": "Bohr’s Angular Momentum Postulate",
          "expression": "L = m v r = n ℏ = n (h / (2π))   (n = 1, 2, 3...)",
          "latex": "L = m v r = n \\hbar = n \\frac{h}{2\\pi} \\quad (n = 1, 2, 3, \\dots)",
          "symbols": [
            {
              "symbol": "L",
              "meaning": "Orbital angular momentum of electron",
              "unit": "J s or kg m² s⁻¹"
            },
            {
              "symbol": "n",
              "meaning": "Principal quantum number (positive integer)"
            },
            {
              "symbol": "\\hbar",
              "meaning": "Reduced Planck constant (h / 2π)",
              "unit": "J s"
            }
          ],
          "siUnit": "J s",
          "explanation": "Electrons revolve only in stable non-radiating discrete orbits where angular momentum is an integral multiple of h / (2π).",
          "conditions": "Hydrogen and single-electron hydrogenic ions (He⁺, Li²⁺).",
          "example": "In the ground state (n = 1), electron orbital angular momentum is exactly L = ℏ ≈ 1.055 × 10⁻³⁴ J s.",
          "keywords": [
            "bohr model",
            "angular momentum",
            "quantisation",
            "principal quantum number"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-bohr-radius-energy",
          "name": "Bohr Radius and Energy Levels for Hydrogen-like Atoms",
          "expression": "r_n = (a_0 n²) / Z,   E_n = - (13.6 Z²) / n² eV   (a_0 ≈ 0.529 Å)",
          "latex": "r_n = \\frac{a_0 n^2}{Z}, \\quad E_n = -\\frac{13.6 Z^2}{n^2} \\text{ eV} \\quad (a_0 \\approx 0.529 \\text{ \\AA})",
          "symbols": [
            {
              "symbol": "r_n",
              "meaning": "Radius of n-th permitted stationary orbit",
              "unit": "metres (m)"
            },
            {
              "symbol": "a_0",
              "meaning": "Bohr radius for hydrogen ground state (0.529 × 10⁻¹⁰ m)",
              "unit": "m"
            },
            {
              "symbol": "E_n",
              "meaning": "Total energy in n-th bound stationary state",
              "unit": "electron-volts (eV)"
            },
            {
              "symbol": "Z",
              "meaning": "Atomic number (number of nuclear protons)"
            },
            {
              "symbol": "n",
              "meaning": "Principal quantum number"
            }
          ],
          "siUnit": "electron-volt (eV) for energy; metres (m) for radius",
          "explanation": "Negative total energy indicates a bound state. Kinetic energy K_n = -E_n and electrostatic potential energy U_n = 2 E_n.",
          "conditions": "Single-electron ions in circular Bohr orbits.",
          "example": "For hydrogen (Z = 1), ground state energy is E₁ = -13.6 eV; first excited state (n = 2) energy is E₂ = -13.6 / 4 = -3.4 eV.",
          "keywords": [
            "bohr radius",
            "energy levels",
            "hydrogen atom",
            "rydberg"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-rydberg-formula",
          "name": "Rydberg Formula for Spectral Transitions",
          "expression": "1 / λ = R_H Z² [ 1 / n₁² - 1 / n₂² ]   (n₂ > n₁)",
          "latex": "\\frac{1}{\\lambda} = R_H Z^2 \\left[ \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right] \\quad (n_2 > n_1)",
          "symbols": [
            {
              "symbol": "\\lambda",
              "meaning": "Wavelength of emitted or absorbed spectral photon",
              "unit": "metres (m)"
            },
            {
              "symbol": "R_H",
              "meaning": "Rydberg constant (≈ 1.097 × 10⁷ m⁻¹)",
              "unit": "m⁻¹"
            },
            {
              "symbol": "n_1, n_2",
              "meaning": "Lower and higher principal quantum numbers"
            }
          ],
          "siUnit": "m⁻¹ (wave number)",
          "explanation": "Predicts the discrete spectral lines of hydrogen: Lyman series (n₁ = 1, UV), Balmer series (n₁ = 2, Visible), Paschen series (n₁ = 3, IR).",
          "conditions": "Radiative quantum transition between stationary states (ΔE = h f = h c / λ).",
          "example": "First line of Balmer series (H_α: n₁ = 2 to n₂ = 3): 1/λ = (1.097 × 10⁷) × (1/4 - 1/9) = 1.097 × 10⁷ × (5/36) ≈ 1.524 × 10⁶ m⁻¹, giving λ ≈ 656 nm (red line).",
          "keywords": [
            "rydberg formula",
            "spectral series",
            "balmer",
            "lyman",
            "emission spectrum"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-nuclei",
      "number": 13,
      "title": "Nuclei",
      "description": "Nuclear size, mass defect, binding energy per nucleon, law of radioactive decay, half-life, mean life, and nuclear fission/fusion.",
      "formulas": [
        {
          "id": "c12-nuclear-radius",
          "name": "Nuclear Radius Formula",
          "expression": "R = R_0 A^(1/3)",
          "latex": "R = R_0 A^{1/3}",
          "symbols": [
            {
              "symbol": "R",
              "meaning": "Radius of atomic nucleus",
              "unit": "femtometres (fm = 10⁻¹⁵ m)"
            },
            {
              "symbol": "R_0",
              "meaning": "Empirical nuclear radius parameter (≈ 1.2 fm)",
              "unit": "fm"
            },
            {
              "symbol": "A",
              "meaning": "Mass number (total nucleons = protons + neutrons)"
            }
          ],
          "siUnit": "femtometre (fm = 10⁻¹⁵ m)",
          "explanation": "Shows that nuclear volume is directly proportional to nucleon number A, meaning all atomic nuclei have roughly constant mass density (≈ 2.3 × 10¹⁷ kg m⁻³).",
          "conditions": "Spherical liquid drop nuclear model.",
          "example": "For an aluminium nucleus (A = 27): R = 1.2 × (27)^(1/3) = 1.2 × 3 = 3.6 fm.",
          "keywords": [
            "nuclear radius",
            "femtometre",
            "mass number",
            "nuclear density"
          ],
          "difficulty": "foundation",
          "status": "verified"
        },
        {
          "id": "c12-mass-defect-binding-energy",
          "name": "Mass Defect and Nuclear Binding Energy",
          "expression": "Δm = [ Z m_p + (A - Z) m_n ] - M_nucleus,   E_b = (Δm) c² ≈ (Δm in u) × 931.5 MeV",
          "latex": "\\Delta m = [Z m_p + (A - Z) m_n] - M_{\\text{nucleus}}, \\quad E_b = \\Delta m c^2 \\approx (\\Delta m \\text{ in u}) \\times 931.5 \\text{ MeV}",
          "symbols": [
            {
              "symbol": "E_b",
              "meaning": "Total nuclear binding energy",
              "unit": "MeV"
            },
            {
              "symbol": "\\Delta m",
              "meaning": "Nuclear mass defect",
              "unit": "unified atomic mass units (u)"
            },
            {
              "symbol": "Z",
              "meaning": "Number of protons"
            },
            {
              "symbol": "A - Z",
              "meaning": "Number of neutrons"
            },
            {
              "symbol": "m_p, m_n",
              "meaning": "Masses of free proton and free neutron",
              "unit": "u"
            },
            {
              "symbol": "M_{\\text{nucleus}}",
              "meaning": "Rest mass of bound nucleus",
              "unit": "u"
            }
          ],
          "siUnit": "MeV (where 1 u c² ≈ 931.5 MeV)",
          "explanation": "The mass of a stable bound nucleus is strictly less than the combined mass of its constituent nucleons. The missing mass corresponds to binding energy released upon formation.",
          "conditions": "Isolated ground-state atomic nucleus.",
          "example": "For alpha particle (helium-4 nucleus): Δm ≈ 0.0304 u, yielding binding energy E_b ≈ 0.0304 × 931.5 ≈ 28.3 MeV (binding energy per nucleon ≈ 7.07 MeV/nucleon).",
          "keywords": [
            "mass defect",
            "binding energy",
            "einstein relation",
            "nuclear stability"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-radioactive-decay-law",
          "name": "Radioactive Decay Law and Half-Life",
          "expression": "N(t) = N_0 e^(-λ t),   T_half = ln(2) / λ ≈ 0.693 / λ,   τ = 1 / λ",
          "latex": "N(t) = N_0 e^{-\\lambda t}, \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}, \\quad \\tau = \\frac{1}{\\lambda}",
          "symbols": [
            {
              "symbol": "N(t)",
              "meaning": "Number of undecayed radioactive nuclei remaining at time t"
            },
            {
              "symbol": "N_0",
              "meaning": "Initial number of radioactive nuclei at t = 0"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Radioactive disintegration constant",
              "unit": "s⁻¹ or year⁻¹"
            },
            {
              "symbol": "T_{1/2}",
              "meaning": "Half-life period of radioisotope",
              "unit": "seconds (s) or years"
            },
            {
              "symbol": "\\tau",
              "meaning": "Mean lifetime of radioactive nucleus",
              "unit": "seconds (s)"
            }
          ],
          "siUnit": "seconds (s) for half-life and mean life; s⁻¹ for decay constant λ",
          "explanation": "Statistical law stating that the rate of radioactive disintegration (-dN/dt = λ N) is proportional to the number of undecayed nuclei present at that instant.",
          "conditions": "Statistically large ensemble of identical unstable radioactive nuclei.",
          "example": "After n half-lives, remaining fraction is N / N_0 = (1/2)^n. After 3 half-lives, 1/8 (12.5%) of the radioactive sample remains.",
          "keywords": [
            "radioactive decay",
            "half life",
            "decay constant",
            "mean life",
            "exponential decay"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    },
    {
      "id": "c12-semiconductors",
      "number": 14,
      "title": "Semiconductor Electronics",
      "description": "Intrinsic/extrinsic semiconductors, p-n junction diode, forward/reverse bias, zener diode, transistor currents, and digital logic gates.",
      "formulas": [
        {
          "id": "c12-semiconductor-conductivity",
          "name": "Electrical Conductivity of Semiconductors",
          "expression": "σ = e (n_e μ_e + n_h μ_h),   n_e n_h = n_i²",
          "latex": "\\sigma = e (n_e \\mu_e + n_h \\mu_h), \\quad n_e n_h = n_i^2",
          "symbols": [
            {
              "symbol": "\\sigma",
              "meaning": "Total electrical conductivity of semiconductor",
              "unit": "S m⁻¹"
            },
            {
              "symbol": "e",
              "meaning": "Magnitude of electron charge (1.602 × 10⁻¹⁹ C)"
            },
            {
              "symbol": "n_e, n_h",
              "meaning": "Free electron and hole concentration densities",
              "unit": "m⁻³"
            },
            {
              "symbol": "\\mu_e, \\mu_h",
              "meaning": "Mobilities of electrons and holes",
              "unit": "m² V⁻¹ s⁻¹"
            },
            {
              "symbol": "n_i",
              "meaning": "Intrinsic carrier concentration at temperature T",
              "unit": "m⁻³"
            }
          ],
          "siUnit": "siemens per metre (S m⁻¹ = Ω⁻¹ m⁻¹)",
          "explanation": "Both conduction electrons and valence holes contribute to electric current. The mass action law (n_e n_h = n_i²) holds at thermal equilibrium for both intrinsic and doped semiconductors.",
          "conditions": "Thermal equilibrium in non-degenerately doped semiconductor.",
          "example": "In n-type silicon doped with phosphorus, n_e ≫ n_i, causing minority hole density n_h = n_i² / n_e to drop significantly.",
          "keywords": [
            "semiconductor",
            "conductivity",
            "mass action law",
            "mobility",
            "intrinsic"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-transistor-current-gain",
          "name": "Bipolar Junction Transistor Current Relations",
          "expression": "I_E = I_B + I_C,   β = I_C / I_B,   α = I_C / I_E = β / (1 + β)",
          "latex": "I_E = I_B + I_C, \\quad \\beta = \\frac{I_C}{I_B}, \\quad \\alpha = \\frac{I_C}{I_E} = \\frac{\\beta}{1 + \\beta}",
          "symbols": [
            {
              "symbol": "I_E",
              "meaning": "Emitter current",
              "unit": "milliamperes (mA)"
            },
            {
              "symbol": "I_B",
              "meaning": "Base current",
              "unit": "microamperes (μA)"
            },
            {
              "symbol": "I_C",
              "meaning": "Collector current",
              "unit": "milliamperes (mA)"
            },
            {
              "symbol": "\\beta",
              "meaning": "Common-emitter current amplification factor"
            },
            {
              "symbol": "\\alpha",
              "meaning": "Common-base current amplification factor (α < 1)"
            }
          ],
          "siUnit": "Dimensionless for gains α and β; milliamperes (mA) for currents",
          "explanation": "In an active BJT, emitter heavily supplies carriers, the thin base absorbs a tiny fraction (I_B), and the collector gathers the majority (I_C).",
          "conditions": "BJT biased in active region (emitter-base forward biased, collector-base reverse biased).",
          "example": "If common-emitter current gain is β = 100 and base current is I_B = 20 μA, collector current is I_C = 100 × 20 μA = 2 mA, and I_E = 2.02 mA.",
          "keywords": [
            "transistor",
            "bjt",
            "current gain",
            "beta",
            "alpha",
            "emitter current"
          ],
          "difficulty": "intermediate",
          "status": "verified"
        },
        {
          "id": "c12-logic-gates",
          "name": "Boolean Logic Gate Expressions",
          "expression": "AND: Y = A · B,   OR: Y = A + B,   NOT: Y = Ā,   NAND: Y = (A · B)̄,   NOR: Y = (A + B)̄,   XOR: Y = ĀB + AB̄",
          "latex": "Y_{\\text{AND}} = A \\cdot B, \\quad Y_{\\text{OR}} = A + B, \\quad Y_{\\text{NOT}} = \\bar{A}, \\quad Y_{\\text{NAND}} = \\overline{A \\cdot B}",
          "alternateLatex": [
            "Y_{\\text{NOR}} = \\overline{A + B}",
            "Y_{\\text{XOR}} = A \\oplus B = \\bar{A}B + A\\bar{B}"
          ],
          "symbols": [
            {
              "symbol": "A, B",
              "meaning": "Digital binary input logic levels (0 or 1)"
            },
            {
              "symbol": "Y",
              "meaning": "Binary output logic level (0 or 1)"
            }
          ],
          "siUnit": "Binary logic states (0 or 1)",
          "explanation": "Mathematical Boolean operators governing digital combinational logic circuits. NAND and NOR gates form universal gates capable of synthesizing any digital logic function.",
          "conditions": "Two-state binary Boolean logic.",
          "example": "For a NAND gate with inputs A = 1 and B = 1: Y = (1 · 1)̄ = 1̄ = 0.",
          "keywords": [
            "logic gates",
            "boolean algebra",
            "nand gate",
            "nor gate",
            "xor gate"
          ],
          "difficulty": "foundation",
          "status": "verified"
        }
      ]
    }
  ]
};
