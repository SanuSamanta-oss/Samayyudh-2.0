import type { AcademicLevel } from '@/types/formulas';

export const class10Physics: AcademicLevel = {
  id: 'class-10',
  title: 'Class 10 Physics',
  shortTitle: 'Class 10',
  description: 'Foundational secondary school physics covering optics, human vision, electrodynamics, and magnetism.',
  levelOrder: 1,
  chapters: [
    {
      id: 'c10-light',
      number: 1,
      title: 'Light — Reflection and Refraction',
      description: 'Reflection by spherical mirrors, refraction through glass media, lenses, and optical power.',
      formulas: [
        {
          id: 'c10-mirror-formula',
          name: 'Spherical Mirror Formula',
          expression: '1/f = 1/v + 1/u',
          latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}',
          alternateLatex: ['v = \\frac{uf}{u - f}'],
          symbols: [
            { symbol: 'f', meaning: 'Focal length of spherical mirror', unit: 'metres (m)' },
            { symbol: 'v', meaning: 'Image distance from optical pole', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Object distance from optical pole', unit: 'metres (m)' }
          ],
          siUnit: 'm⁻¹ (dioptric power balance)',
          explanation: 'Relates object distance, image distance, and focal length for spherical mirrors according to the New Cartesian sign convention.',
          conditions: 'Paraxial rays reflecting off spherical surfaces of small aperture.',
          signConvention: 'Distances in direction of incident light are positive; opposite are negative. Concave mirror f < 0, Convex mirror f > 0.',
          example: 'For a concave mirror (f = -15 cm) with object at u = -30 cm: 1/v = 1/(-15) - 1/(-30) = -1/30, so v = -30 cm (real, inverted image at centre of curvature).',
          keywords: ['mirror', 'focal length', 'reflection', 'image distance', 'concave', 'convex', 'optics'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-mirror-magnification',
          name: 'Linear Magnification of Spherical Mirror',
          expression: 'm = h_i / h_o = -v / u',
          latex: 'm = \\frac{h_i}{h_o} = -\\frac{v}{u}',
          symbols: [
            { symbol: 'm', meaning: 'Linear lateral magnification' },
            { symbol: 'h_i', meaning: 'Height of image', unit: 'metres (m)' },
            { symbol: 'h_o', meaning: 'Height of object', unit: 'metres (m)' },
            { symbol: 'v', meaning: 'Image distance from pole', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Object distance from pole', unit: 'metres (m)' }
          ],
          siUnit: 'Dimensionless (ratio)',
          explanation: 'Expresses the ratio of the height of an image produced by a spherical mirror to the height of the object.',
          conditions: 'Paraxial approximation under Cartesian sign rules.',
          signConvention: 'Negative m indicates a real, inverted image; positive m indicates a virtual, erect image.',
          example: 'If u = -20 cm and v = -40 cm: m = -(-40)/(-20) = -2 (real, inverted, magnified 2x).',
          keywords: ['magnification', 'mirror', 'image height', 'object height', 'inverted', 'erect'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-radius-curvature',
          name: 'Radius of Curvature Relation',
          expression: 'R = 2f',
          latex: 'R = 2f',
          symbols: [
            { symbol: 'R', meaning: 'Radius of curvature of spherical mirror', unit: 'metres (m)' },
            { symbol: 'f', meaning: 'Focal length of spherical mirror', unit: 'metres (m)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'For spherical mirrors of small aperture, the principal focus lies precisely halfway between the pole and centre of curvature.',
          conditions: 'Aperture of the mirror is much smaller than its radius of curvature.',
          example: 'A convex rear-view mirror with radius of curvature R = 3.0 m has focal length f = 3.0 / 2 = +1.5 m.',
          keywords: ['radius of curvature', 'focal length', 'spherical mirror', 'paraxial'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-refractive-index',
          name: 'Absolute Refractive Index',
          expression: 'n = c / v',
          latex: 'n = \\frac{c}{v}',
          symbols: [
            { symbol: 'n', meaning: 'Absolute refractive index of medium' },
            { symbol: 'c', meaning: 'Speed of light in vacuum', unit: 'm/s (≈ 3.00 × 10⁸ m/s)' },
            { symbol: 'v', meaning: 'Speed of light in optical medium', unit: 'm/s' }
          ],
          siUnit: 'Dimensionless',
          explanation: 'Quantifies optical density and the reduction in phase speed of light when traversing a transparent medium from vacuum.',
          conditions: 'Monochromatic light in a homogeneous isotropic medium.',
          example: 'In crown glass where light speed is 2.0 × 10⁸ m/s: n = (3.0 × 10⁸) / (2.0 × 10⁸) = 1.50.',
          keywords: ['refractive index', 'speed of light', 'refraction', 'optical density'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-snells-law',
          name: 'Snell’s Law of Refraction',
          expression: 'n_1 sin(i) = n_2 sin(r)',
          latex: 'n_1 \\sin(i) = n_2 \\sin(r)',
          alternateLatex: ['\\frac{\\sin(i)}{\\sin(r)} = \\frac{n_2}{n_1} = n_{21}'],
          symbols: [
            { symbol: 'n_1', meaning: 'Refractive index of incident medium' },
            { symbol: 'n_2', meaning: 'Refractive index of refracting medium' },
            { symbol: 'i', meaning: 'Angle of incidence measured from surface normal', unit: 'degrees' },
            { symbol: 'r', meaning: 'Angle of refraction measured from surface normal', unit: 'degrees' }
          ],
          siUnit: 'Dimensionless',
          explanation: 'Governs ray bending across a planar boundary between two optically transparent media.',
          conditions: 'Planar boundary between linear isotropic non-dispersive media.',
          example: 'Light rays passing from air (n₁ = 1.00) into water (n₂ = 1.33) at i = 30° give sin(r) = (1.00 × sin 30°) / 1.33 = 0.376, so r ≈ 22.1°.',
          keywords: ['snell', 'refraction', 'angle of incidence', 'angle of refraction'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-lens-formula',
          name: 'Thin Lens Formula',
          expression: '1/f = 1/v - 1/u',
          latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}',
          alternateLatex: ['v = \\frac{uf}{u + f}'],
          symbols: [
            { symbol: 'f', meaning: 'Focal length of thin lens', unit: 'metres (m)' },
            { symbol: 'v', meaning: 'Image distance from optical centre', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Object distance from optical centre', unit: 'metres (m)' }
          ],
          siUnit: 'm⁻¹',
          explanation: 'Fundamental relation connecting object distance, image distance, and focal length for spherical thin lenses.',
          conditions: 'Thin lens whose axial thickness is negligible compared to radii of curvature.',
          signConvention: 'Convex lens f > 0; Concave lens f < 0. Distances measured from optical centre.',
          example: 'For a convex lens (f = +10 cm) with object at u = -15 cm: 1/v = 1/10 + 1/(-15) = 1/30, yielding v = +30 cm (real, inverted image on opposite side).',
          keywords: ['lens formula', 'thin lens', 'convex lens', 'concave lens', 'focal length'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-lens-magnification',
          name: 'Linear Magnification of Lens',
          expression: 'm = h_i / h_o = v / u',
          latex: 'm = \\frac{h_i}{h_o} = \\frac{v}{u}',
          symbols: [
            { symbol: 'm', meaning: 'Linear transverse magnification' },
            { symbol: 'h_i', meaning: 'Height of image', unit: 'metres (m)' },
            { symbol: 'h_o', meaning: 'Height of object', unit: 'metres (m)' },
            { symbol: 'v', meaning: 'Image distance', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Object distance', unit: 'metres (m)' }
          ],
          siUnit: 'Dimensionless',
          explanation: 'Ratio of image height to object height produced by a thin lens. Notice positive sign unlike spherical mirrors.',
          conditions: 'Paraxial approximation within thin lens limit.',
          example: 'With u = -15 cm and v = +30 cm: m = 30 / (-15) = -2 (real, inverted, 2x enlarged image).',
          keywords: ['lens magnification', 'image height', 'object height', 'inverted'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-lens-power',
          name: 'Optical Power of a Lens',
          expression: 'P = 1 / f',
          latex: 'P = \\frac{1}{f}',
          symbols: [
            { symbol: 'P', meaning: 'Optical power of lens', unit: 'dioptres (D = m⁻¹)' },
            { symbol: 'f', meaning: 'Focal length of lens in metres', unit: 'metres (m)' }
          ],
          siUnit: 'dioptre (D, where 1 D = 1 m⁻¹)',
          explanation: 'Reciprocal of focal length measuring the degree of convergence or divergence imparted to incident light.',
          conditions: 'Focal length f must strictly be converted into metres.',
          example: 'A convex lens of focal length f = +0.5 m has optical power P = 1 / (+0.5) = +2.0 D. A concave lens of f = -0.25 m has P = -4.0 D.',
          keywords: ['power', 'dioptre', 'focal length', 'convergence', 'divergence'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-lenses-contact',
          name: 'Combination of Thin Lenses in Contact',
          expression: 'P_total = P_1 + P_2 + ... + P_n',
          latex: 'P_{\\text{total}} = P_1 + P_2 + \\dots + P_n',
          alternateLatex: ['\\frac{1}{F_{\\text{eq}}} = \\frac{1}{f_1} + \\frac{1}{f_2} + \\dots + \\frac{1}{f_n}'],
          symbols: [
            { symbol: 'P_total', meaning: 'Equivalent net optical power', unit: 'dioptres (D)' },
            { symbol: 'P_1, P_2', meaning: 'Individual optical powers of lenses in contact', unit: 'dioptres (D)' }
          ],
          siUnit: 'dioptres (D)',
          explanation: 'When two or more thin lenses are placed coaxially in direct physical contact, their optical powers add algebraically.',
          conditions: 'Thin lenses in direct coaxial contact without separation.',
          example: 'Combining a convex lens of +2.5 D with a concave lens of -1.0 D yields P_total = +2.5 - 1.0 = +1.5 D.',
          keywords: ['lenses in contact', 'equivalent power', 'net focal length'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c10-human-eye',
      number: 2,
      title: 'The Human Eye and the Colourful World',
      description: 'Refraction through prisms, dispersion of white light, atmospheric refraction, and visual defect corrections.',
      formulas: [
        {
          id: 'c10-near-point',
          name: 'Least Distance of Distinct Vision (Near Point)',
          expression: 'D ≈ 25 cm = 0.25 m',
          latex: 'D \\approx 25\\text{ cm} = 0.25\\text{ m}',
          symbols: [
            { symbol: 'D', meaning: 'Standard least distance of distinct vision for normal eye', unit: 'metres (m)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Closest distance at which an object can be clearly focused by ciliary accommodation without eye strain.',
          conditions: 'Healthy adult eye without uncorrected presbyopia.',
          example: 'Standard reading distance is maintained at 25 cm to preserve comfortable ocular accommodation.',
          keywords: ['near point', 'distinct vision', 'ciliary muscles', 'accommodation'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-myopia-correction',
          name: 'Myopia (Near-Sightedness) Corrective Lens Power',
          expression: 'P = -1 / d_far',
          latex: 'P = -\\frac{1}{d_{\\text{far}}}',
          alternateLatex: ['\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} = -\\frac{1}{d_{\\text{far}}} - 0'],
          symbols: [
            { symbol: 'P', meaning: 'Power of diverging corrective lens', unit: 'dioptres (D)' },
            { symbol: 'd_far', meaning: 'Defective far point distance of myopic eye', unit: 'metres (m)' }
          ],
          siUnit: 'dioptres (D)',
          explanation: 'A myopic eye cannot clearly view distant objects because the image forms in front of the retina. A diverging lens forms a virtual image of infinity at the eye’s defective far point.',
          conditions: 'Object assumed at infinity (u = -∞), image formed at v = -d_far.',
          example: 'If a myopic eye has a far point of 80 cm (0.8 m), the required focal length is f = -0.8 m, giving P = -1.25 D (concave lens).',
          keywords: ['myopia', 'far point', 'concave lens', 'defect of vision'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-hypermetropia-correction',
          name: 'Hypermetropia (Far-Sightedness) Corrective Lens Power',
          expression: '1/f = -1/d_near - (-1/D)',
          latex: '\\frac{1}{f} = -\\frac{1}{d_{\\text{near}}} - \\left(-\\frac{1}{D}\\right) = \\frac{1}{D} - \\frac{1}{d_{\\text{near}}}',
          symbols: [
            { symbol: 'f', meaning: 'Focal length of converging corrective lens', unit: 'metres (m)' },
            { symbol: 'd_near', meaning: 'Defective receded near point distance', unit: 'metres (m)' },
            { symbol: 'D', meaning: 'Normal near point distance (0.25 m)' }
          ],
          siUnit: 'dioptres (D = 1/f)',
          explanation: 'A hypermetropic eye focuses near light behind the retina. A convex lens forms a virtual image of an object at 25 cm at the eye’s defective near point.',
          conditions: 'Object distance u = -25 cm = -0.25 m, image distance v = -d_near.',
          example: 'If near point has receded to 1.0 m: 1/f = 1/0.25 - 1/1.0 = 4 - 1 = +3 D, so a convex lens of +3.0 D is prescribed.',
          keywords: ['hypermetropia', 'near point', 'convex lens', 'presbyopia'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c10-electricity',
      number: 3,
      title: 'Electricity',
      description: 'Electric current, potential difference, Ohm’s law, resistance, series-parallel combinations, and Joule heating.',
      formulas: [
        {
          id: 'c10-electric-current',
          name: 'Electric Current Definition',
          expression: 'I = Q / t',
          latex: 'I = \\frac{Q}{t}',
          alternateLatex: ['Q = I t = n e'],
          symbols: [
            { symbol: 'I', meaning: 'Electric current', unit: 'amperes (A)' },
            { symbol: 'Q', meaning: 'Electric charge passing through cross-section', unit: 'coulombs (C)' },
            { symbol: 't', meaning: 'Time interval', unit: 'seconds (s)' }
          ],
          siUnit: 'ampere (A, where 1 A = 1 C/s)',
          explanation: 'Rate of flow of electric charge through any cross-section of a conductor.',
          conditions: 'Steady, direct electric current.',
          example: 'If 300 C flows through an electric bulb filament in 5 minutes (300 s): I = 300 / 300 = 1.0 A.',
          keywords: ['current', 'charge', 'time', 'ampere', 'coulomb'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-potential-difference',
          name: 'Electric Potential Difference',
          expression: 'V = W / Q',
          latex: 'V = \\frac{W}{Q}',
          alternateLatex: ['W = Q V'],
          symbols: [
            { symbol: 'V', meaning: 'Potential difference between two terminals', unit: 'volts (V)' },
            { symbol: 'W', meaning: 'Work done in transporting charge', unit: 'joules (J)' },
            { symbol: 'Q', meaning: 'Magnitude of charge transported', unit: 'coulombs (C)' }
          ],
          siUnit: 'volt (V, where 1 V = 1 J/C)',
          explanation: 'Amount of work done in moving a unit positive charge from one point to another in an electrostatic field.',
          conditions: 'Quasi-static transfer without imparting kinetic energy.',
          example: 'Moving 2 C of charge across two points at 12 V potential difference requires work W = 12 × 2 = 24 J.',
          keywords: ['potential difference', 'voltage', 'work done', 'volt'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-ohms-law',
          name: 'Ohm’s Law',
          expression: 'V = IR',
          latex: 'V = I R',
          alternateLatex: ['I = \\frac{V}{R}', 'R = \\frac{V}{I}'],
          symbols: [
            { symbol: 'V', meaning: 'Potential difference across conductor', unit: 'volts (V)' },
            { symbol: 'I', meaning: 'Current flowing through conductor', unit: 'amperes (A)' },
            { symbol: 'R', meaning: 'Resistance of conductor', unit: 'ohms (Ω)' }
          ],
          siUnit: 'ohm (Ω, where 1 Ω = 1 V/A)',
          explanation: 'Potential difference across an ideal ohmic conductor is directly proportional to the current through it, provided temperature and physical state remain constant.',
          conditions: 'Constant temperature, pressure, strain, and material composition (linear Ohmic conductor).',
          example: 'If a resistor of 5 Ω carries current of 2 A, the potential difference across it is V = 2 × 5 = 10 V.',
          keywords: ['ohms law', 'resistance', 'voltage', 'current', 'linear resistor'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-resistance-dimensions',
          name: 'Resistance in Terms of Dimensions and Resistivity',
          expression: 'R = ρ L / A',
          latex: 'R = \\rho \\frac{L}{A}',
          symbols: [
            { symbol: 'R', meaning: 'Electrical resistance', unit: 'ohms (Ω)' },
            { symbol: '\\rho', meaning: 'Electrical resistivity of material', unit: 'ohm-metres (Ω·m)' },
            { symbol: 'L', meaning: 'Length of conductor', unit: 'metres (m)' },
            { symbol: 'A', meaning: 'Cross-sectional area of conductor', unit: 'square metres (m²)' }
          ],
          siUnit: 'ohm (Ω)',
          explanation: 'Resistance is directly proportional to conductor length and inversely proportional to its cross-sectional area.',
          conditions: 'Uniform cross-section along the length and constant temperature.',
          example: 'A copper wire (ρ = 1.7 × 10⁻⁸ Ω·m) of length 2 m and area 1.0 × 10⁻⁶ m² has resistance R = (1.7 × 10⁻⁸ × 2) / (1.0 × 10⁻⁶) = 0.034 Ω.',
          keywords: ['resistivity', 'length', 'area', 'conductor dimensions'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-series-resistors',
          name: 'Equivalent Resistance in Series',
          expression: 'R_eq = R_1 + R_2 + ... + R_n',
          latex: 'R_{\\text{eq}} = R_1 + R_2 + \\dots + R_n',
          symbols: [
            { symbol: 'R_eq', meaning: 'Equivalent resistance of series circuit', unit: 'ohms (Ω)' },
            { symbol: 'R_1, R_2', meaning: 'Individual resistors connected end-to-end', unit: 'ohms (Ω)' }
          ],
          siUnit: 'ohm (Ω)',
          explanation: 'In a series circuit, identical current passes through each resistor, and total voltage drop equals the sum of individual voltage drops.',
          conditions: 'Unbranched circuit loop with identical current throughout.',
          example: 'Three resistors of 4 Ω, 6 Ω, and 10 Ω connected in series yield R_eq = 4 + 6 + 10 = 20 Ω.',
          keywords: ['series', 'equivalent resistance', 'resistors'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-parallel-resistors',
          name: 'Equivalent Resistance in Parallel',
          expression: '1/R_eq = 1/R_1 + 1/R_2 + ... + 1/R_n',
          latex: '\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots + \\frac{1}{R_n}',
          alternateLatex: ['R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}'],
          symbols: [
            { symbol: 'R_eq', meaning: 'Equivalent resistance of parallel circuit', unit: 'ohms (Ω)' },
            { symbol: 'R_1, R_2', meaning: 'Individual resistors connected across identical potential', unit: 'ohms (Ω)' }
          ],
          siUnit: 'ohm (Ω)',
          explanation: 'In parallel connection, potential difference across every resistor is identical, and total incoming current splits across the branches.',
          conditions: 'All resistors connected between common node pairs.',
          example: 'Two resistors of 6 Ω and 3 Ω in parallel yield R_eq = (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω.',
          keywords: ['parallel', 'equivalent resistance', 'current division'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-electrical-power',
          name: 'Electrical Power',
          expression: 'P = V I = I^2 R = V^2 / R',
          latex: 'P = V I = I^2 R = \\frac{V^2}{R}',
          symbols: [
            { symbol: 'P', meaning: 'Electric power consumed or supplied', unit: 'watts (W)' },
            { symbol: 'V', meaning: 'Potential difference', unit: 'volts (V)' },
            { symbol: 'I', meaning: 'Electric current', unit: 'amperes (A)' },
            { symbol: 'R', meaning: 'Resistance', unit: 'ohms (Ω)' }
          ],
          siUnit: 'watt (W, where 1 W = 1 J/s = 1 V·A)',
          explanation: 'Rate at which electrical energy is dissipated or transformed into work in an electric circuit.',
          conditions: 'Ohmic load under steady direct current or instantaneous AC values.',
          example: 'An electric heater drawing 5 A from 220 V consumes power P = 220 × 5 = 1100 W (1.1 kW).',
          keywords: ['power', 'watt', 'joules per second', 'voltage', 'current'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-joules-heating',
          name: 'Joule’s Law of Heating',
          expression: 'H = I^2 R t',
          latex: 'H = I^2 R t = V I t = \\frac{V^2}{R} t',
          symbols: [
            { symbol: 'H', meaning: 'Heat energy dissipated in conductor', unit: 'joules (J)' },
            { symbol: 'I', meaning: 'Electric current through conductor', unit: 'amperes (A)' },
            { symbol: 'R', meaning: 'Resistance of conductor', unit: 'ohms (Ω)' },
            { symbol: 't', meaning: 'Duration of current flow', unit: 'seconds (s)' }
          ],
          siUnit: 'joules (J)',
          explanation: 'Heat generated in a resistor is proportional to the square of current, resistance of conductor, and duration of current flow.',
          conditions: 'Pure ohmic dissipation without mechanical or chemical energy generation.',
          example: 'A 100 Ω resistor carrying 2 A for 30 s generates heat H = 2² × 100 × 30 = 4 × 100 × 30 = 12000 J = 12 kJ.',
          keywords: ['joule heating', 'heat energy', 'thermal dissipation', 'resistor'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-commercial-energy',
          name: 'Commercial Unit of Electrical Energy',
          expression: '1 kWh = 3.6 × 10^6 J',
          latex: '1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}',
          symbols: [
            { symbol: '1\\text{ kWh}', meaning: 'Kilowatt-hour (commercial unit of electric energy)' },
            { symbol: 'J', meaning: 'Joules (standard SI energy unit)' }
          ],
          siUnit: 'joules (J)',
          explanation: 'One kilowatt-hour represents the electrical energy consumed by a device of 1 kilowatt power operating continuously for 1 hour.',
          conditions: '1000 W × 3600 s = 3,600,000 J.',
          example: 'A 500 W refrigerator operating 10 hours daily consumes 0.5 kW × 10 h = 5 kWh per day.',
          keywords: ['kilowatt hour', 'commercial energy', 'electricity bill', 'units'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c10-magnetic-effects',
      number: 4,
      title: 'Magnetic Effects of Electric Current',
      description: 'Oersted discovery, right-hand thumb rule, solenoid magnetic field, Lorentz magnetic force, and electromagnetic induction.',
      formulas: [
        {
          id: 'c10-magnetic-force-wire',
          name: 'Magnetic Force on a Current-Carrying Conductor',
          expression: 'F = B I L sin(θ)',
          latex: 'F = B I L \\sin(\\theta)',
          alternateLatex: ['\\mathbf{F} = I (\\mathbf{L} \\times \\mathbf{B})'],
          symbols: [
            { symbol: 'F', meaning: 'Mechanical magnetic force exerted on wire', unit: 'newtons (N)' },
            { symbol: 'B', meaning: 'External magnetic flux density', unit: 'tesla (T)' },
            { symbol: 'I', meaning: 'Current flowing through wire', unit: 'amperes (A)' },
            { symbol: 'L', meaning: 'Length of wire segment inside field', unit: 'metres (m)' },
            { symbol: '\\theta', meaning: 'Angle between direction of current and magnetic field vector', unit: 'degrees' }
          ],
          siUnit: 'newton (N)',
          explanation: 'Mechanical force experienced by a current-carrying conductor placed inside an external magnetic field, determined by Fleming’s Left-Hand Rule.',
          conditions: 'Uniform magnetic field over straight segment length L.',
          example: 'A 0.2 m wire carrying 3 A placed perpendicular (θ = 90°) to a 0.5 T magnetic field experiences F = 0.5 × 3 × 0.2 × sin(90°) = 0.3 N.',
          keywords: ['magnetic force', 'flemings left hand rule', 'current carrying wire', 'tesla'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c10-solenoid-field',
          name: 'Magnetic Field inside a Solenoid',
          expression: 'B = μ_0 n I',
          latex: 'B = \\mu_0 n I',
          alternateLatex: ['B = \\mu_0 \\frac{N}{L} I'],
          symbols: [
            { symbol: 'B', meaning: 'Uniform magnetic field inside solenoid core', unit: 'tesla (T)' },
            { symbol: '\\mu_0', meaning: 'Permeability of free space (4π × 10⁻⁷ T·m/A)' },
            { symbol: 'n', meaning: 'Number of turns per unit length (N / L)', unit: 'm⁻¹' },
            { symbol: 'I', meaning: 'Current flowing through windings', unit: 'amperes (A)' }
          ],
          siUnit: 'tesla (T)',
          explanation: 'Magnetic field lines inside a long, tightly wound current-carrying solenoid are parallel and uniform, resembling the field of a bar magnet.',
          conditions: 'Length of solenoid significantly greater than its radius; interior region away from edges.',
          example: 'A solenoid of 500 turns/m carrying 2 A has central field B ≈ (4π × 10⁻⁷) × 500 × 2 ≈ 1.26 × 10⁻³ T (1.26 mT).',
          keywords: ['solenoid', 'magnetic field', 'electromagnet', 'turns per length'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    }
  ]
};
