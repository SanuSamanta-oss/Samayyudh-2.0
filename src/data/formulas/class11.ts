import type { AcademicLevel } from '@/types/formulas';

export const class11Physics: AcademicLevel = {
  id: 'class-11',
  title: 'Class 11 Physics',
  shortTitle: 'Class 11',
  description: 'Comprehensive classical mechanics, kinematics, gravitation, fluid statics/dynamics, thermodynamics, oscillations, and acoustic waves.',
  levelOrder: 2,
  chapters: [
    {
      id: 'c11-units-measurements',
      number: 1,
      title: 'Units and Measurements',
      description: 'Dimensional analysis, SI base units, significant figures, and error propagation in experimental measurements.',
      formulas: [
        {
          id: 'c11-percentage-error',
          name: 'Percentage Error in Measurement',
          expression: 'Percentage Error = (Δa_mean / a_mean) × 100%',
          latex: '\\text{Percentage Error} = \\left( \\frac{\\Delta a_{\\text{mean}}}{a_{\\text{mean}}} \\right) \\times 100\\%',
          symbols: [
            { symbol: '\\Delta a_{\\text{mean}}', meaning: 'Mean absolute error of measured values', unit: 'same as quantity' },
            { symbol: 'a_{\\text{mean}}', meaning: 'Arithmetic mean of experimental values', unit: 'same as quantity' }
          ],
          siUnit: 'percentage (%)',
          explanation: 'Relative fractional error expressed as a percentage, indicating experimental measurement precision.',
          conditions: 'Random errors normally distributed across multiple observations.',
          example: 'For measured length (20.0 ± 0.2) cm: fractional error = 0.2 / 20.0 = 0.01, so percentage error = 1.0%.',
          keywords: ['error', 'percentage error', 'relative error', 'precision', 'measurement'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-error-combination-product',
          name: 'Error Propagation in Multiplication and Division',
          expression: 'ΔZ / Z = ΔA / A + ΔB / B',
          latex: '\\frac{\\Delta Z}{Z} = \\frac{\\Delta A}{A} + \\frac{\\Delta B}{B}',
          symbols: [
            { symbol: 'Z', meaning: 'Computed physical quantity Z = A × B or Z = A / B' },
            { symbol: '\\Delta A, \\Delta B', meaning: 'Absolute errors in independent measurements A and B' }
          ],
          siUnit: 'Dimensionless (fractional ratio)',
          explanation: 'When two physical quantities are multiplied or divided, fractional error in the result equals the sum of fractional errors in the individual measurements.',
          conditions: 'Small independent uncertainties; higher-order terms neglected.',
          example: 'If mass error is 2% and volume error is 3%, density error is Δρ/ρ = 2% + 3% = 5%.',
          keywords: ['error propagation', 'fractional error', 'multiplication error'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-error-power',
          name: 'Error Propagation for Powers',
          expression: 'ΔZ / Z = p (ΔA / A)',
          latex: '\\frac{\\Delta Z}{Z} = p \\left( \\frac{\\Delta A}{A} \\right)',
          symbols: [
            { symbol: 'Z', meaning: 'Quantity given by Z = A^p' },
            { symbol: 'p', meaning: 'Exponential power index' },
            { symbol: '\\Delta A / A', meaning: 'Relative fractional error in measured quantity A' }
          ],
          siUnit: 'Dimensionless',
          explanation: 'Relative error in a quantity raised to the power p is p times the relative error in the individual measurement.',
          conditions: 'Small fractional error ΔA / A ≪ 1.',
          example: 'For sphere volume V ∝ r³, if radius error is 1.5%, volume error is 3 × 1.5% = 4.5%.',
          keywords: ['power error', 'dimensional analysis', 'uncertainty'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-straight-line',
      number: 2,
      title: 'Motion in a Straight Line',
      description: 'One-dimensional kinematics, uniform acceleration equations, displacement in nth second, and relative velocity.',
      formulas: [
        {
          id: 'c11-kinematics-1',
          name: 'First Kinematic Equation (Velocity-Time Relation)',
          expression: 'v = v_0 + a t',
          latex: 'v = v_0 + a t',
          alternateLatex: ['v = u + a t'],
          symbols: [
            { symbol: 'v', meaning: 'Final velocity', unit: 'm/s' },
            { symbol: 'v_0', meaning: 'Initial velocity (u)', unit: 'm/s' },
            { symbol: 'a', meaning: 'Constant linear acceleration', unit: 'm/s²' },
            { symbol: 't', meaning: 'Elapsed time interval', unit: 'seconds (s)' }
          ],
          siUnit: 'm/s',
          explanation: 'Relates final velocity of a particle to initial velocity, acceleration, and time under constant acceleration.',
          conditions: 'Acceleration must remain strictly constant in magnitude and direction.',
          example: 'A car accelerating from rest (v₀ = 0) at 3 m/s² for 5 s achieves v = 0 + 3 × 5 = 15 m/s.',
          keywords: ['kinematics', 'velocity', 'acceleration', 'rectilinear motion'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-kinematics-2',
          name: 'Second Kinematic Equation (Position-Time Relation)',
          expression: 's = u t + (1/2) a t^2',
          latex: 's = u t + \\frac{1}{2} a t^2',
          alternateLatex: ['x - x_0 = v_0 t + \\frac{1}{2} a t^2'],
          symbols: [
            { symbol: 's', meaning: 'Net linear displacement (x - x₀)', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Initial velocity (v₀)', unit: 'm/s' },
            { symbol: 'a', meaning: 'Constant linear acceleration', unit: 'm/s²' },
            { symbol: 't', meaning: 'Time interval', unit: 'seconds (s)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Gives the displacement of an object moving with uniform linear acceleration as a quadratic function of time.',
          conditions: 'Constant acceleration along a straight axis.',
          example: 'An object dropped from rest (u = 0, a = 9.8 m/s²) falls s = 0.5 × 9.8 × 2² = 19.6 m in 2 seconds.',
          keywords: ['displacement', 'free fall', 'uniform acceleration', 'motion'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-kinematics-3',
          name: 'Third Kinematic Equation (Velocity-Position Relation)',
          expression: 'v^2 = u^2 + 2 a s',
          latex: 'v^2 = u^2 + 2 a s',
          alternateLatex: ['v^2 = v_0^2 + 2 a (x - x_0)'],
          symbols: [
            { symbol: 'v', meaning: 'Final velocity', unit: 'm/s' },
            { symbol: 'u', meaning: 'Initial velocity (v₀)', unit: 'm/s' },
            { symbol: 'a', meaning: 'Constant linear acceleration', unit: 'm/s²' },
            { symbol: 's', meaning: 'Displacement', unit: 'metres (m)' }
          ],
          siUnit: 'm²/s²',
          explanation: 'Relates initial and final speeds directly to displacement and acceleration without involving elapsed time.',
          conditions: 'Straight-line motion with constant acceleration.',
          example: 'A car braking from 20 m/s to rest (v = 0) with a = -4 m/s² stops in s = (0 - 400) / (2 × -4) = 50 m.',
          keywords: ['stopping distance', 'velocity', 'braking distance', 'displacement'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-displacement-nth-sec',
          name: 'Displacement in the n-th Second',
          expression: 's_n = u + (a / 2)(2n - 1)',
          latex: 's_n = u + \\frac{a}{2}(2n - 1)',
          symbols: [
            { symbol: 's_n', meaning: 'Displacement during the specific n-th second interval', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Initial velocity', unit: 'm/s' },
            { symbol: 'a', meaning: 'Uniform acceleration', unit: 'm/s²' },
            { symbol: 'n', meaning: 'Integer second index (1, 2, 3...)', unit: 'seconds (s)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Calculates the distance travelled specifically during the 1-second interval between t = (n - 1) and t = n.',
          conditions: 'Constant acceleration across all elapsed intervals.',
          example: 'Body falling from rest (u = 0, a = 9.8 m/s²): displacement in 3rd second is s₃ = 0 + (9.8 / 2)(2 × 3 - 1) = 4.9 × 5 = 24.5 m.',
          keywords: ['nth second', 'displacement in nth second', 'free fall'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-relative-velocity-1d',
          name: 'Relative Velocity in One Dimension',
          expression: 'v_AB = v_A - v_B',
          latex: 'v_{AB} = v_A - v_B',
          symbols: [
            { symbol: 'v_{AB}', meaning: 'Velocity of body A relative to observer B', unit: 'm/s' },
            { symbol: 'v_A', meaning: 'Velocity of body A relative to ground frame', unit: 'm/s' },
            { symbol: 'v_B', meaning: 'Velocity of body B relative to ground frame', unit: 'm/s' }
          ],
          siUnit: 'm/s',
          explanation: 'The apparent velocity of particle A observed from the inertial frame of reference moving with particle B.',
          conditions: 'Non-relativistic 1D motion along a common axis.',
          example: 'Train A moving east at 80 km/h and Train B moving west at 60 km/h: relative speed of A relative to B is 80 - (-60) = 140 km/h.',
          keywords: ['relative velocity', 'reference frame', 'inertial frame'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-plane-motion',
      number: 3,
      title: 'Motion in a Plane',
      description: 'Two-dimensional vector kinematics, projectile trajectory, maximum height, horizontal range, and uniform circular motion.',
      formulas: [
        {
          id: 'c11-projectile-trajectory',
          name: 'Equation of Projectile Trajectory',
          expression: 'y = x tan(θ) - (g x^2) / (2 u^2 cos^2(θ))',
          latex: 'y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}',
          alternateLatex: ['y = x \\tan\\theta \\left( 1 - \\frac{x}{R} \\right)'],
          symbols: [
            { symbol: 'x, y', meaning: 'Horizontal and vertical coordinates of projectile', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Initial launch speed', unit: 'm/s' },
            { symbol: '\\theta', meaning: 'Launch angle above horizontal', unit: 'degrees' },
            { symbol: 'g', meaning: 'Acceleration due to gravity', unit: 'm/s²' },
            { symbol: 'R', meaning: 'Horizontal range', unit: 'metres (m)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Defines the inverted parabolic trajectory of an unpowered projectile under uniform downward gravity.',
          conditions: 'Zero aerodynamic drag; flat level ground; uniform constant gravitational acceleration g.',
          example: 'A projectile launched at 45° with u = 20 m/s (g = 10 m/s²): y = x - (10 x²) / (2 × 400 × 0.5) = x - x² / 40.',
          keywords: ['projectile', 'parabola', 'trajectory', 'launch angle', '2d motion'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-projectile-time-flight',
          name: 'Time of Flight of Projectile',
          expression: 'T = (2 u sin(θ)) / g',
          latex: 'T = \\frac{2 u \\sin\\theta}{g}',
          symbols: [
            { symbol: 'T', meaning: 'Total time spent by projectile in air', unit: 'seconds (s)' },
            { symbol: 'u', meaning: 'Initial launch speed', unit: 'm/s' },
            { symbol: '\\theta', meaning: 'Angle of projection with horizontal', unit: 'degrees' },
            { symbol: 'g', meaning: 'Acceleration due to gravity', unit: 'm/s²' }
          ],
          siUnit: 'seconds (s)',
          explanation: 'The duration from launch until the projectile returns to the horizontal launch altitude.',
          conditions: 'Launch and landing at identical vertical elevations; zero air drag.',
          example: 'If u = 29.4 m/s at θ = 30° (g = 9.8 m/s²): T = (2 × 29.4 × 0.5) / 9.8 = 3.0 s.',
          keywords: ['time of flight', 'projectile', 'flight duration'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-projectile-max-height',
          name: 'Maximum Height of Projectile',
          expression: 'H = (u^2 sin^2(θ)) / (2 g)',
          latex: 'H = \\frac{u^2 \\sin^2\\theta}{2 g}',
          symbols: [
            { symbol: 'H', meaning: 'Peak vertical elevation reached by projectile', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Initial launch speed', unit: 'm/s' },
            { symbol: '\\theta', meaning: 'Launch angle', unit: 'degrees' },
            { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Peak vertical distance above launch level at the instant vertical velocity component decelerates to zero.',
          conditions: 'Negligible aerodynamic drag; flat uniform gravitational field.',
          example: 'Launching at u = 20 m/s at θ = 30° (g = 10 m/s²): H = (400 × 0.25) / (2 × 10) = 5.0 m.',
          keywords: ['maximum height', 'apex', 'projectile height'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-projectile-range',
          name: 'Horizontal Range of Projectile',
          expression: 'R = (u^2 sin(2θ)) / g',
          latex: 'R = \\frac{u^2 \\sin(2\\theta)}{g}',
          alternateLatex: ['R_{\\max} = \\frac{u^2}{g} \\quad (\\text{at } \\theta = 45^\\circ)'],
          symbols: [
            { symbol: 'R', meaning: 'Horizontal distance traversed before landing', unit: 'metres (m)' },
            { symbol: 'u', meaning: 'Launch speed', unit: 'm/s' },
            { symbol: '\\theta', meaning: 'Launch angle', unit: 'degrees' },
            { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Horizontal span covered by projectile. Maximum range R_max = u² / g occurs at launch angle θ = 45°.',
          conditions: 'Flat level ground; identical launch and landing heights; zero air resistance.',
          example: 'Launching with u = 14 m/s at θ = 45° (g = 9.8 m/s²): R = (196 × sin 90°) / 9.8 = 20 m.',
          keywords: ['range', 'horizontal range', '45 degrees', 'maximum range'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-centripetal-acceleration',
          name: 'Centripetal Acceleration in Circular Motion',
          expression: 'a_c = v^2 / r = ω^2 r',
          latex: 'a_c = \\frac{v^2}{r} = \\omega^2 r',
          alternateLatex: ['a_c = \\omega v'],
          symbols: [
            { symbol: 'a_c', meaning: 'Centripetal inward radial acceleration', unit: 'm/s²' },
            { symbol: 'v', meaning: 'Linear tangential speed', unit: 'm/s' },
            { symbol: 'r', meaning: 'Radius of circular trajectory', unit: 'metres (m)' },
            { symbol: '\\omega', meaning: 'Angular velocity', unit: 'rad/s' }
          ],
          siUnit: 'm/s²',
          explanation: 'Inward radial acceleration required to continuously change the direction of velocity vector in circular motion.',
          conditions: 'Motion along a circle of radius r.',
          example: 'A car navigating a curve of radius r = 50 m at speed v = 10 m/s experiences radial acceleration a_c = 10² / 50 = 2.0 m/s².',
          keywords: ['centripetal acceleration', 'circular motion', 'radial acceleration', 'angular velocity'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-laws-motion',
      number: 4,
      title: 'Laws of Motion',
      description: 'Newtonian dynamics, linear momentum, impulse-momentum theorem, friction laws, banking of roads, and tension.',
      formulas: [
        {
          id: 'c11-newton-second-law',
          name: 'Newton’s Second Law of Motion',
          expression: 'F_net = dp/dt = ma',
          latex: 'F_{\\text{net}} = \\frac{dp}{dt} = m a',
          alternateLatex: ['\\mathbf{F} = \\frac{d\\mathbf{p}}{dt} = m \\mathbf{a}'],
          symbols: [
            { symbol: 'F_{\\text{net}}', meaning: 'Net resultant external force vector', unit: 'newtons (N)' },
            { symbol: 'p', meaning: 'Linear momentum (p = m v)', unit: 'kg·m/s' },
            { symbol: 'm', meaning: 'Inertial mass of body', unit: 'kilograms (kg)' },
            { symbol: 'a', meaning: 'Acceleration of body', unit: 'm/s²' }
          ],
          siUnit: 'newton (N, where 1 N = 1 kg·m/s²)',
          explanation: 'The rate of change of linear momentum of an object is proportional to the net applied force and occurs in the direction of the force.',
          conditions: 'Constant mass system in an inertial frame of reference.',
          example: 'Accelerating a 5 kg mass at 4 m/s² requires net force F = 5 × 4 = 20 N.',
          keywords: ['newtons second law', 'force', 'mass', 'acceleration', 'momentum'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-impulse-momentum',
          name: 'Impulse-Momentum Theorem',
          expression: 'J = ∫ F dt = Δp',
          latex: 'J = \\int_{t_1}^{t_2} F(t)\\,dt = \\Delta p = m v - m u',
          symbols: [
            { symbol: 'J', meaning: 'Impulse of the force', unit: 'N·s or kg·m/s' },
            { symbol: 'F(t)', meaning: 'Time-varying applied force', unit: 'newtons (N)' },
            { symbol: '\\Delta p', meaning: 'Net change in linear momentum', unit: 'kg·m/s' }
          ],
          siUnit: 'newton-second (N·s = kg·m/s)',
          explanation: 'The impulse delivered by an external force over a time duration equals the overall change in linear momentum of the body.',
          conditions: 'Inertial reference frame.',
          example: 'A 0.15 kg cricket ball arriving at 20 m/s struck back at 20 m/s experiences impulse J = 0.15 × (20 - (-20)) = 6.0 N·s.',
          keywords: ['impulse', 'change in momentum', 'collision', 'impact'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-static-kinetic-friction',
          name: 'Friction Force Laws',
          expression: 'f_s <= μ_s N,   f_k = μ_k N',
          latex: 'f_{s,\\max} = \\mu_s N, \\quad f_k = \\mu_k N',
          symbols: [
            { symbol: 'f_{s,\\max}', meaning: 'Limiting static friction force', unit: 'newtons (N)' },
            { symbol: 'f_k', meaning: 'Kinetic sliding friction force', unit: 'newtons (N)' },
            { symbol: '\\mu_s, \\mu_k', meaning: 'Coefficients of static and kinetic friction (dimensionless)' },
            { symbol: 'N', meaning: 'Normal contact reaction force', unit: 'newtons (N)' }
          ],
          siUnit: 'newton (N)',
          explanation: 'Static friction opposes impending motion up to a maximum limiting threshold μ_s N. Once sliding begins, kinetic friction μ_k N acts.',
          conditions: 'Dry contact surfaces (Coulomb-Amontons friction approximation). In general, μ_k ≤ μ_s.',
          example: 'A 10 kg block (N = 98 N) on surface with μ_s = 0.4 requires horizontal force F > 0.4 × 98 = 39.2 N to initiate motion.',
          keywords: ['friction', 'static friction', 'kinetic friction', 'normal reaction'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-banking-roads',
          name: 'Maximum Safe Speed on a Banked Road',
          expression: 'v_max = √[ r g (tan(θ) + μ_s) / (1 - μ_s tan(θ)) ]',
          latex: 'v_{\\max} = \\sqrt{r g \\left( \\frac{\\tan\\theta + \\mu_s}{1 - \\mu_s \\tan\\theta} \\right)}',
          alternateLatex: ['v_0 = \\sqrt{r g \\tan\\theta} \\quad (\\text{optimum speed, } \\mu_s = 0)'],
          symbols: [
            { symbol: 'v_{\\max}', meaning: 'Maximum safe negotiation speed', unit: 'm/s' },
            { symbol: 'r', meaning: 'Radius of curvature of turn', unit: 'metres (m)' },
            { symbol: '\\theta', meaning: 'Banking angle of inclination', unit: 'degrees' },
            { symbol: '\\mu_s', meaning: 'Coefficient of static friction between tyres and road' }
          ],
          siUnit: 'm/s',
          explanation: 'Maximum speed at which a vehicle can round a curve without skidding outwards. For frictionless banking: v_0 = √(rg tan θ).',
          conditions: 'Uniform circular curve with steady speed.',
          example: 'On an unbanked road (θ = 0°), maximum safe speed reduces to v_max = √(μ_s r g). For r = 20 m and μ_s = 0.5: v = √(0.5 × 20 × 9.8) ≈ 9.9 m/s.',
          keywords: ['banking of roads', 'optimum speed', 'skidding', 'centripetal force'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-work-energy-power',
      number: 5,
      title: 'Work, Energy and Power',
      description: 'Work-energy theorem, conservative forces, kinetic/potential energy, spring potential, and elastic collisions.',
      formulas: [
        {
          id: 'c11-work-dot-product',
          name: 'Work Done by a Constant Force',
          expression: 'W = F · s = F s cos(θ)',
          latex: 'W = \\mathbf{F} \\cdot \\mathbf{s} = F s \\cos\\theta',
          alternateLatex: ['W = \\int_{x_1}^{x_2} F(x)\\,dx \\quad (\\text{variable force})'],
          symbols: [
            { symbol: 'W', meaning: 'Work performed on object', unit: 'joules (J)' },
            { symbol: 'F', meaning: 'Applied force magnitude', unit: 'newtons (N)' },
            { symbol: 's', meaning: 'Displacement magnitude', unit: 'metres (m)' },
            { symbol: '\\theta', meaning: 'Angle between force and displacement vectors', unit: 'degrees' }
          ],
          siUnit: 'joule (J, where 1 J = 1 N·m = 1 kg·m²/s²)',
          explanation: 'Scalar product of applied force and displacement. When force is perpendicular to displacement (θ = 90°), zero work is performed.',
          conditions: 'Constant force acting over a straight displacement.',
          example: 'Pulling a sled with force F = 50 N at angle θ = 60° over s = 10 m: W = 50 × 10 × cos 60° = 250 J.',
          keywords: ['work done', 'scalar product', 'dot product', 'joules'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-work-energy-theorem',
          name: 'Work-Energy Theorem and Kinetic Energy',
          expression: 'W_net = ΔK = (1/2) m v^2 - (1/2) m u^2',
          latex: 'W_{\\text{net}} = \\Delta K = \\frac{1}{2} m v^2 - \\frac{1}{2} m u^2, \\quad E_k = \\frac{1}{2} m v^2',
          symbols: [
            { symbol: 'W_{\\text{net}}', meaning: 'Total work done by all forces', unit: 'joules (J)' },
            { symbol: '\\Delta K', meaning: 'Change in translational kinetic energy', unit: 'joules (J)' },
            { symbol: 'm', meaning: 'Mass of particle', unit: 'kilograms (kg)' },
            { symbol: 'v', meaning: 'Final speed', unit: 'm/s' },
            { symbol: 'u', meaning: 'Initial speed', unit: 'm/s' }
          ],
          siUnit: 'joule (J)',
          explanation: 'The net work done by all forces acting upon a particle equals the resultant change in its kinetic energy.',
          conditions: 'Valid in any inertial reference frame for both constant and variable forces.',
          example: 'A 2 kg mass accelerating from 3 m/s to 5 m/s requires net work W_net = 0.5 × 2 × (25 - 9) = 16 J.',
          keywords: ['work energy theorem', 'kinetic energy', 'net work'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-spring-potential-energy',
          name: 'Elastic Potential Energy of a Spring',
          expression: 'U = (1/2) k x^2',
          latex: 'U = \\frac{1}{2} k x^2',
          symbols: [
            { symbol: 'U', meaning: 'Stored elastic potential energy', unit: 'joules (J)' },
            { symbol: 'k', meaning: 'Spring stiffness constant', unit: 'N/m' },
            { symbol: 'x', meaning: 'Elongation or compression from natural length', unit: 'metres (m)' }
          ],
          siUnit: 'joule (J)',
          explanation: 'Work done against the restoring Hookean spring force (F = -k x) stored as potential energy.',
          conditions: 'Spring obeys Hooke’s law within its elastic limit; negligible spring mass.',
          example: 'Compressing a spring of k = 400 N/m by x = 0.05 m stores U = 0.5 × 400 × (0.05)² = 0.5 J.',
          keywords: ['spring energy', 'hookes law', 'elastic potential energy', 'stiffness'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-power-instantaneous',
          name: 'Mechanical Power (Instantaneous and Average)',
          expression: 'P = dW / dt = F · v',
          latex: 'P = \\frac{dW}{dt} = \\mathbf{F} \\cdot \\mathbf{v} = F v \\cos\\theta',
          symbols: [
            { symbol: 'P', meaning: 'Power delivered', unit: 'watts (W)' },
            { symbol: '\\mathbf{F}', meaning: 'Applied driving force vector', unit: 'newtons (N)' },
            { symbol: '\\mathbf{v}', meaning: 'Instantaneous velocity vector', unit: 'm/s' }
          ],
          siUnit: 'watt (W, where 1 W = 1 J/s; 1 hp = 746 W)',
          explanation: 'The instantaneous rate of doing work or transferring mechanical energy.',
          conditions: 'Force and velocity evaluated at the same instant.',
          example: 'A crane lifting a 5000 N weight vertically at a steady 2 m/s delivers power P = 5000 × 2 = 10,000 W (10 kW).',
          keywords: ['power', 'watt', 'force times velocity', 'horsepower'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-rotational-motion',
      number: 6,
      title: 'System of Particles and Rotational Motion',
      description: 'Centre of mass, torque, angular momentum, moment of inertia, parallel and perpendicular axis theorems, and pure rolling.',
      formulas: [
        {
          id: 'c11-centre-of-mass',
          name: 'Centre of Mass Position Vector',
          expression: 'r_cm = (∑ m_i r_i) / (∑ m_i)',
          latex: '\\mathbf{r}_{\\text{cm}} = \\frac{\\sum_i m_i \\mathbf{r}_i}{\\sum_i m_i} = \\frac{1}{M} \\int \\mathbf{r}\\,dm',
          symbols: [
            { symbol: '\\mathbf{r}_{\\text{cm}}', meaning: 'Position vector of centre of mass', unit: 'metres (m)' },
            { symbol: 'm_i', meaning: 'Mass of i-th particle', unit: 'kilograms (kg)' },
            { symbol: '\\mathbf{r}_i', meaning: 'Position vector of i-th particle', unit: 'metres (m)' },
            { symbol: 'M', meaning: 'Total mass of the system', unit: 'kilograms (kg)' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Unique point representing the mean position of distributed mass in a physical system.',
          conditions: 'Discrete or continuous mass distribution.',
          example: 'Two masses m₁ = 2 kg at x = 0 m and m₂ = 3 kg at x = 5 m have centre of mass at x_cm = (2×0 + 3×5) / 5 = 3.0 m.',
          keywords: ['centre of mass', 'discrete particles', 'mass distribution'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-torque-vector',
          name: 'Torque (Moment of Force)',
          expression: 'τ = r × F,   |τ| = r F sin(θ)',
          latex: '\\boldsymbol{\\tau} = \\mathbf{r} \\times \\mathbf{F}, \\quad |\\boldsymbol{\\tau}| = r F \\sin\\theta',
          symbols: [
            { symbol: '\\boldsymbol{\\tau}', meaning: 'Torque vector about pivot axis', unit: 'N·m' },
            { symbol: '\\mathbf{r}', meaning: 'Position vector from pivot to point of force application', unit: 'metres (m)' },
            { symbol: '\\mathbf{F}', meaning: 'Applied force vector', unit: 'newtons (N)' },
            { symbol: '\\theta', meaning: 'Angle between r and F', unit: 'degrees' }
          ],
          siUnit: 'newton-metre (N·m)',
          explanation: 'Rotational analogue of linear force that measures the turning tendency around an axis of rotation.',
          conditions: 'Rigid body pivoting around a specified point or axis.',
          example: 'Applying 40 N perpendicular (θ = 90°) to a spanner of length 0.25 m yields torque τ = 0.25 × 40 = 10 N·m.',
          keywords: ['torque', 'moment of force', 'lever arm', 'cross product'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-angular-momentum',
          name: 'Angular Momentum and Conservation',
          expression: 'L = r × p = I ω',
          latex: '\\mathbf{L} = \\mathbf{r} \\times \\mathbf{p} = I \\boldsymbol{\\omega}, \\quad \\boldsymbol{\\tau}_{\\text{ext}} = \\frac{d\\mathbf{L}}{dt}',
          alternateLatex: ['I_1 \\omega_1 = I_2 \\omega_2 \\quad (\\text{when } \\tau_{\\text{ext}} = 0)'],
          symbols: [
            { symbol: '\\mathbf{L}', meaning: 'Angular momentum', unit: 'kg·m²/s or J·s' },
            { symbol: 'I', meaning: 'Moment of inertia about rotation axis', unit: 'kg·m²' },
            { symbol: '\\boldsymbol{\\omega}', meaning: 'Angular velocity vector', unit: 'rad/s' }
          ],
          siUnit: 'kg·m²/s (or J·s)',
          explanation: 'Rotational analogue of linear momentum. If net external torque is zero (τ_ext = 0), total angular momentum remains conserved.',
          conditions: 'Rigid rotation about a fixed axis or isolated system.',
          example: 'A figure skater pulling arms inward halves moment of inertia (I₂ = I₁ / 2), doubling spin rate (ω₂ = 2ω₁).',
          keywords: ['angular momentum', 'conservation of angular momentum', 'moment of inertia'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-parallel-axis-theorem',
          name: 'Parallel-Axis Theorem',
          expression: 'I = I_cm + M d^2',
          latex: 'I = I_{\\text{cm}} + M d^2',
          symbols: [
            { symbol: 'I', meaning: 'Moment of inertia about arbitrary parallel axis', unit: 'kg·m²' },
            { symbol: 'I_{\\text{cm}}', meaning: 'Moment of inertia about parallel axis passing through centre of mass', unit: 'kg·m²' },
            { symbol: 'M', meaning: 'Total mass of the body', unit: 'kilograms (kg)' },
            { symbol: 'd', meaning: 'Perpendicular separation between the two parallel axes', unit: 'metres (m)' }
          ],
          siUnit: 'kg·m²',
          explanation: 'Determines the moment of inertia about any axis parallel to an axis passing through the body’s centre of mass.',
          conditions: 'The reference axis must be strictly parallel to the axis passing through the centre of mass.',
          example: 'For a uniform rod of length L: I_cm = (1/12)ML². About an end axis (d = L/2): I = (1/12)ML² + M(L/2)² = (1/3)ML².',
          keywords: ['parallel axis theorem', 'moment of inertia', 'rod', 'centre of mass'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-rolling-without-slipping',
          name: 'Total Kinetic Energy in Pure Rolling',
          expression: 'K_total = (1/2) M v_cm^2 + (1/2) I_cm ω^2',
          latex: 'K_{\\text{total}} = \\frac{1}{2} M v_{\\text{cm}}^2 + \\frac{1}{2} I_{\\text{cm}} \\omega^2 = \\frac{1}{2} M v_{\\text{cm}}^2 \\left( 1 + \\frac{k^2}{R^2} \\right)',
          symbols: [
            { symbol: 'K_{\\text{total}}', meaning: 'Total kinetic energy of rolling body', unit: 'joules (J)' },
            { symbol: 'v_{\\text{cm}}', meaning: 'Linear velocity of centre of mass', unit: 'm/s' },
            { symbol: 'I_{\\text{cm}}', meaning: 'Moment of inertia about centre of mass', unit: 'kg·m²' },
            { symbol: '\\omega', meaning: 'Angular velocity (ω = v_cm / R for pure rolling)', unit: 'rad/s' },
            { symbol: 'k', meaning: 'Radius of gyration (I_cm = M k²)', unit: 'metres (m)' }
          ],
          siUnit: 'joules (J)',
          explanation: 'Pure rolling without slipping is a superposition of pure translational motion of centre of mass and pure rotation about centre of mass.',
          conditions: 'No slipping at contact point: v_contact = 0.',
          example: 'For a solid cylinder (k² / R² = 1/2): K_total = (1/2) M v_cm² (1 + 0.5) = (3/4) M v_cm².',
          keywords: ['pure rolling', 'rolling without slipping', 'kinetic energy', 'radius of gyration'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-gravitation',
      number: 7,
      title: 'Gravitation',
      description: 'Newton’s universal law of gravitation, gravitational potential and field, variation of g with height/depth, orbital and escape velocity.',
      formulas: [
        {
          id: 'c11-newton-gravitation',
          name: 'Newton’s Universal Law of Gravitation',
          expression: 'F = (G M m) / r^2',
          latex: 'F = \\frac{G M m}{r^2}',
          alternateLatex: ['\\mathbf{F} = -\\frac{G M m}{r^2} \\hat{\\mathbf{r}}'],
          symbols: [
            { symbol: 'F', meaning: 'Attractive gravitational force', unit: 'newtons (N)' },
            { symbol: 'G', meaning: 'Universal gravitational constant (6.674 × 10⁻¹¹ N·m²/kg²)' },
            { symbol: 'M, m', meaning: 'Masses of the interacting bodies', unit: 'kilograms (kg)' },
            { symbol: 'r', meaning: 'Distance separating centres of mass', unit: 'metres (m)' }
          ],
          siUnit: 'newton (N)',
          explanation: 'Mutual attractive force directly proportional to the product of masses and inversely proportional to the square of distance.',
          conditions: 'Point masses or spherically symmetric mass distributions.',
          example: 'Two 1 kg masses placed 1 m apart attract with force F = 6.674 × 10⁻¹¹ N.',
          keywords: ['gravitation', 'newtons law', 'gravitational constant', 'inverse square'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-g-altitude-depth',
          name: 'Variation of Acceleration Due to Gravity',
          expression: 'g_h = g (1 - 2h/R),   g_d = g (1 - d/R)',
          latex: 'g_h = g \\left( 1 - \\frac{2h}{R} \\right) \\quad (h \\ll R), \\qquad g_d = g \\left( 1 - \\frac{d}{R} \\right)',
          symbols: [
            { symbol: 'g', meaning: 'Surface gravity (≈ 9.8 m/s²)' },
            { symbol: 'g_h', meaning: 'Gravity at altitude h above surface', unit: 'm/s²' },
            { symbol: 'g_d', meaning: 'Gravity at depth d below surface', unit: 'm/s²' },
            { symbol: 'R', meaning: 'Earth radius (≈ 6400 km = 6.4 × 10⁶ m)' }
          ],
          siUnit: 'm/s²',
          explanation: 'Acceleration due to gravity decreases monotonically both as altitude increases above Earth’s surface and as depth increases below the surface.',
          conditions: 'Uniform spherically symmetric density distribution assumed for depth formula.',
          example: 'At depth d = R / 2 (halfway to core): g_d = g(1 - 0.5) = 4.9 m/s².',
          keywords: ['gravity variation', 'altitude', 'depth', 'earth radius'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-escape-velocity',
          name: 'Escape Velocity from Planetary Surface',
          expression: 'v_e = √((2 G M) / R) = √(2 g R)',
          latex: 'v_e = \\sqrt{\\frac{2 G M}{R}} = \\sqrt{2 g R}',
          symbols: [
            { symbol: 'v_e', meaning: 'Escape speed from gravitational field', unit: 'm/s' },
            { symbol: 'G', meaning: 'Gravitational constant', unit: 'N·m²/kg²' },
            { symbol: 'M', meaning: 'Mass of celestial body', unit: 'kilograms (kg)' },
            { symbol: 'R', meaning: 'Radius of celestial body', unit: 'metres (m)' },
            { symbol: 'g', meaning: 'Surface gravitational acceleration', unit: 'm/s²' }
          ],
          siUnit: 'm/s (or km/s)',
          explanation: 'The minimum launch speed required for a projectile to escape indefinitely from the gravitational field of a planet without additional propulsion.',
          conditions: 'Neglecting atmospheric friction and rotational speed of planet.',
          example: 'For Earth (R ≈ 6.4 × 10⁶ m, g ≈ 9.8 m/s²): v_e = √(2 × 9.8 × 6.4 × 10⁶) ≈ 11.2 km/s.',
          keywords: ['escape velocity', 'gravitational potential', 'orbit'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-orbital-velocity',
          name: 'Orbital Velocity of Satellite',
          expression: 'v_o = √((G M) / r)',
          latex: 'v_o = \\sqrt{\\frac{G M}{r}} = \\sqrt{\\frac{G M}{R + h}}',
          alternateLatex: ['v_o \\approx \\sqrt{g R} = \\frac{v_e}{\\sqrt{2}} \\quad (\\text{near surface})'],
          symbols: [
            { symbol: 'v_o', meaning: 'Circular orbital speed', unit: 'm/s' },
            { symbol: 'M', meaning: 'Mass of central planet', unit: 'kilograms (kg)' },
            { symbol: 'r', meaning: 'Orbital radius from centre of planet (R + h)', unit: 'metres (m)' }
          ],
          siUnit: 'm/s',
          explanation: 'Speed required by an artificial satellite to orbit in a stable circular path around a central planet.',
          conditions: 'Circular orbit under central gravitational attraction.',
          example: 'For a near-Earth satellite (h ≈ 0): v_o = √(9.8 × 6.4 × 10⁶) ≈ 7.92 km/s.',
          keywords: ['orbital velocity', 'satellite', 'kepler', 'circular orbit'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-kepler-third-law',
          name: 'Kepler’s Third Law of Planetary Motion',
          expression: 'T^2 = (4π^2 / (G M)) r^3',
          latex: 'T^2 = \\left( \\frac{4\\pi^2}{G M} \\right) r^3 \\implies T^2 \\propto r^3',
          symbols: [
            { symbol: 'T', meaning: 'Orbital period of revolution', unit: 'seconds (s)' },
            { symbol: 'r', meaning: 'Semi-major axis of orbit or circular radius', unit: 'metres (m)' },
            { symbol: 'M', meaning: 'Mass of central star or planet', unit: 'kilograms (kg)' }
          ],
          siUnit: 's²',
          explanation: 'The square of the orbital period is directly proportional to the cube of the semi-major axis of the orbit.',
          conditions: 'Two-body gravitational system with satellite mass m ≪ M.',
          example: 'If orbital radius is multiplied by 4, orbital period increases by 4^(3/2) = 8 times.',
          keywords: ['kepler', 'period', 'orbit', 'semi major axis'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-mechanical-solids',
      number: 8,
      title: 'Mechanical Properties of Solids',
      description: 'Stress, strain, Hooke’s law, Young’s modulus, bulk modulus, shear modulus, and elastic potential energy density.',
      formulas: [
        {
          id: 'c11-youngs-modulus',
          name: 'Young’s Modulus of Elasticity',
          expression: 'Y = (F L) / (A ΔL)',
          latex: 'Y = \\frac{\\text{Longitudinal Stress}}{\\text{Longitudinal Strain}} = \\frac{F L}{A \\Delta L}',
          symbols: [
            { symbol: 'Y', meaning: 'Young’s modulus of material', unit: 'pascal (Pa = N/m²)' },
            { symbol: 'F', meaning: 'Tensile or compressive load force', unit: 'newtons (N)' },
            { symbol: 'L', meaning: 'Original natural length of wire', unit: 'metres (m)' },
            { symbol: 'A', meaning: 'Cross-sectional area of wire', unit: 'square metres (m²)' },
            { symbol: '\\Delta L', meaning: 'Elongation in wire', unit: 'metres (m)' }
          ],
          siUnit: 'pascal (Pa, where 1 Pa = 1 N/m²)',
          explanation: 'Characterises the tensile stiffness of an elastic material within its proportionality limit.',
          conditions: 'Valid within the proportional elastic limit of the material.',
          example: 'A steel wire (Y = 2 × 10¹¹ Pa) of length 2 m and area 1 mm² carrying 200 N stretches by ΔL = (200 × 2) / (10⁻⁶ × 2 × 10¹¹) = 2 mm.',
          keywords: ['youngs modulus', 'stress', 'strain', 'elasticity', 'hookes law'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-bulk-modulus',
          name: 'Bulk Modulus of Elasticity',
          expression: 'B = - ΔP / (ΔV / V)',
          latex: 'B = - \\frac{\\Delta P}{\\Delta V / V} = - V \\frac{\\Delta P}{\\Delta V}',
          alternateLatex: ['k = \\frac{1}{B} \\quad (\\text{compressibility})'],
          symbols: [
            { symbol: 'B', meaning: 'Bulk modulus of elasticity', unit: 'pascal (Pa)' },
            { symbol: '\\Delta P', meaning: 'Change in hydraulic pressure applied', unit: 'pascal (Pa)' },
            { symbol: '\\Delta V', meaning: 'Change in volume', unit: 'cubic metres (m³)' },
            { symbol: 'V', meaning: 'Original volume', unit: 'cubic metres (m³)' }
          ],
          siUnit: 'pascal (Pa)',
          explanation: 'Measures the incompressibility of a substance when subjected to uniform hydraulic stress. Compressibility k = 1 / B.',
          conditions: 'Isotropic substance under uniform hydrostatic pressure. Negative sign ensures B > 0.',
          example: 'Water has B ≈ 2.2 × 10⁹ Pa, requiring a pressure increase of 2.2 × 10⁷ Pa (≈ 220 atm) to compress its volume by 1%.',
          keywords: ['bulk modulus', 'compressibility', 'hydraulic stress', 'volume strain'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-elastic-energy-density',
          name: 'Elastic Potential Energy Density',
          expression: 'u = (1/2) Stress × Strain',
          latex: 'u = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} = \\frac{1}{2} Y (\\text{Strain})^2',
          symbols: [
            { symbol: 'u', meaning: 'Stored elastic potential energy per unit volume', unit: 'J/m³' },
            { symbol: 'Y', meaning: 'Young’s modulus of material', unit: 'pascal (Pa)' }
          ],
          siUnit: 'joules per cubic metre (J/m³)',
          explanation: 'Internal mechanical strain energy stored per unit volume within an elastic material undergoing reversible deformation.',
          conditions: 'Material stressed within its Hookean linear proportionality limit.',
          example: 'Under longitudinal strain of 10⁻³ in steel (Y = 2 × 10¹¹ Pa), energy density u = 0.5 × (2 × 10¹¹) × (10⁻³)² = 10⁵ J/m³.',
          keywords: ['energy density', 'strain energy', 'elastic potential'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-mechanical-fluids',
      number: 9,
      title: 'Mechanical Properties of Fluids',
      description: 'Pascal’s law, hydrostatic pressure, buoyant force, equation of continuity, Bernoulli’s theorem, Torricelli’s law, viscosity, Stokes’ law, and surface tension.',
      formulas: [
        {
          id: 'c11-hydrostatic-pressure',
          name: 'Hydrostatic Fluid Pressure',
          expression: 'P = P_0 + ρ g h',
          latex: 'P = P_0 + \\rho g h',
          symbols: [
            { symbol: 'P', meaning: 'Total absolute fluid pressure at depth h', unit: 'pascal (Pa)' },
            { symbol: 'P_0', meaning: 'Atmospheric pressure at surface (≈ 1.013 × 10⁵ Pa)' },
            { symbol: '\\rho', meaning: 'Fluid density', unit: 'kg/m³' },
            { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
            { symbol: 'h', meaning: 'Vertical depth beneath fluid surface', unit: 'metres (m)' }
          ],
          siUnit: 'pascal (Pa)',
          explanation: 'Pressure in a static incompressible fluid increases linearly with depth due to the weight of the fluid column above.',
          conditions: 'Static, incompressible fluid of uniform density in a uniform gravitational field.',
          example: 'At 10 m depth in fresh water (ρ = 1000 kg/m³): gauge pressure is ρ g h = 1000 × 9.8 × 10 = 9.8 × 10⁴ Pa ≈ 1 atm.',
          keywords: ['hydrostatic pressure', 'depth', 'gauge pressure', 'density'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-continuity-equation',
          name: 'Equation of Continuity',
          expression: 'A_1 v_1 = A_2 v_2',
          latex: 'A_1 v_1 = A_2 v_2 \\implies A v = \\text{constant}',
          symbols: [
            { symbol: 'A_1, A_2', meaning: 'Cross-sectional areas at two points in pipe', unit: 'm²' },
            { symbol: 'v_1, v_2', meaning: 'Flow velocities at the respective sections', unit: 'm/s' }
          ],
          siUnit: 'm³/s (volume flow rate)',
          explanation: 'Expresses conservation of mass for steady, streamline flow of an incompressible fluid.',
          conditions: 'Steady, non-turbulent streamline flow of an incompressible fluid.',
          example: 'Water flowing at 2 m/s through a pipe of diameter 4 cm entering a constriction of diameter 2 cm (area 1/4) speeds up to 8 m/s.',
          keywords: ['continuity equation', 'flow rate', 'incompressible fluid', 'conservation of mass'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-bernoulli-equation',
          name: 'Bernoulli’s Principle',
          expression: 'P + (1/2) ρ v^2 + ρ g h = constant',
          latex: 'P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant}',
          symbols: [
            { symbol: 'P', meaning: 'Static fluid pressure', unit: 'pascal (Pa)' },
            { symbol: '\\rho', meaning: 'Fluid density', unit: 'kg/m³' },
            { symbol: 'v', meaning: 'Fluid flow velocity', unit: 'm/s' },
            { symbol: 'h', meaning: 'Elevation head above reference datum', unit: 'metres (m)' }
          ],
          siUnit: 'pascal (Pa = J/m³)',
          explanation: 'Expresses conservation of mechanical energy per unit volume along a streamline in ideal fluid flow.',
          conditions: 'Steady, incompressible, irrotational, non-viscous streamline flow.',
          example: 'Air flowing over an aerofoil accelerates, reducing static pressure P above the wing relative to below, generating aerodynamic lift.',
          keywords: ['bernoulli', 'fluid dynamics', 'streamline', 'energy conservation'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-stokes-law',
          name: 'Stokes’ Law of Viscous Drag',
          expression: 'F_v = 6 π η r v',
          latex: 'F_v = 6 \\pi \\eta r v',
          symbols: [
            { symbol: 'F_v', meaning: 'Viscous retarding drag force', unit: 'newtons (N)' },
            { symbol: '\\eta', meaning: 'Dynamic viscosity coefficient of fluid', unit: 'Pa·s (or poiseuille)' },
            { symbol: 'r', meaning: 'Radius of spherical body', unit: 'metres (m)' },
            { symbol: 'v', meaning: 'Speed of sphere relative to fluid', unit: 'm/s' }
          ],
          siUnit: 'newton (N)',
          explanation: 'Viscous retarding force experienced by a small spherical particle moving smoothly through a viscous fluid at low Reynolds numbers.',
          conditions: 'Laminar, non-turbulent creeping flow around a smooth, rigid sphere.',
          example: 'A raindrop of radius 1 mm falling through air (η ≈ 1.8 × 10⁻⁵ Pa·s) at 5 m/s experiences drag F_v = 6π × (1.8 × 10⁻⁵) × 0.001 × 5 ≈ 1.7 × 10⁻⁶ N.',
          keywords: ['stokes law', 'viscosity', 'drag force', 'laminar flow'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-terminal-velocity',
          name: 'Terminal Velocity of Falling Sphere',
          expression: 'v_t = (2 r^2 (ρ_s - ρ_f) g) / (9 η)',
          latex: 'v_t = \\frac{2 r^2 (\\rho_s - \\rho_f) g}{9 \\eta}',
          symbols: [
            { symbol: 'v_t', meaning: 'Constant terminal falling speed', unit: 'm/s' },
            { symbol: 'r', meaning: 'Radius of spherical particle', unit: 'metres (m)' },
            { symbol: '\\rho_s', meaning: 'Density of sphere material', unit: 'kg/m³' },
            { symbol: '\\rho_f', meaning: 'Density of surrounding fluid', unit: 'kg/m³' },
            { symbol: '\\eta', meaning: 'Coefficient of fluid viscosity', unit: 'Pa·s' }
          ],
          siUnit: 'm/s',
          explanation: 'Steady constant speed attained when downward weight is exactly balanced by the sum of upward buoyant force and viscous drag.',
          conditions: 'Low Reynolds number flow in an infinite fluid domain.',
          example: 'Millikan’s oil drop experiment relies on measuring the terminal fall velocity of charged microscopic oil droplets.',
          keywords: ['terminal velocity', 'stokes law', 'buoyancy', 'viscous drag'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-excess-pressure-drop',
          name: 'Excess Pressure in Liquid Drop and Soap Bubble',
          expression: 'Drop: ΔP = 2S / r,   Soap Bubble: ΔP = 4S / r',
          latex: '\\Delta P_{\\text{drop}} = \\frac{2S}{r}, \\qquad \\Delta P_{\\text{bubble}} = \\frac{4S}{r}',
          symbols: [
            { symbol: '\\Delta P', meaning: 'Excess internal pressure over outside atmosphere', unit: 'pascal (Pa)' },
            { symbol: 'S', meaning: 'Surface tension coefficient of liquid', unit: 'N/m' },
            { symbol: 'r', meaning: 'Radius of droplet or bubble', unit: 'metres (m)' }
          ],
          siUnit: 'pascal (Pa)',
          explanation: 'Surface tension creates curved interfaces that exert inward compressive forces. A soap bubble has two free air-liquid surfaces, doubling the excess pressure.',
          conditions: 'Spherical equilibrium droplet or bubble.',
          example: 'A water drop of radius 1 mm with surface tension S = 0.073 N/m has excess internal pressure ΔP = (2 × 0.073) / 0.001 = 146 Pa.',
          keywords: ['surface tension', 'excess pressure', 'soap bubble', 'capillarity'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-thermal-properties',
      number: 10,
      title: 'Thermal Properties of Matter',
      description: 'Thermal expansion, specific heat capacity, calorimetry, latent heat, conduction, Stefan-Boltzmann law, and Wien’s displacement law.',
      formulas: [
        {
          id: 'c11-thermal-expansion',
          name: 'Thermal Expansion Coefficients',
          expression: 'ΔL = α L_0 ΔT,   ΔV = γ V_0 ΔT',
          latex: '\\Delta L = \\alpha L_0 \\Delta T, \\quad \\Delta A = \\beta A_0 \\Delta T, \\quad \\Delta V = \\gamma V_0 \\Delta T \\quad (\\gamma \\approx 3\\alpha, \\ \\beta \\approx 2\\alpha)',
          symbols: [
            { symbol: '\\alpha, \\beta, \\gamma', meaning: 'Coefficients of linear, area, and volumetric expansion', unit: 'K⁻¹ or °C⁻¹' },
            { symbol: 'L_0, A_0, V_0', meaning: 'Initial length, area, and volume' },
            { symbol: '\\Delta T', meaning: 'Temperature change', unit: 'kelvin (K)' }
          ],
          siUnit: 'K⁻¹ (or °C⁻¹)',
          explanation: 'Fractional increase in dimensions of a substance per unit rise in temperature. For isotropic solids, area expansion β ≈ 2α and volumetric expansion γ ≈ 3α.',
          conditions: 'Moderate temperature changes without phase transitions.',
          example: 'A 10 m steel rail (α = 1.2 × 10⁻⁵ K⁻¹) heated by 30 °C expands by ΔL = 1.2 × 10⁻⁵ × 10 × 30 = 3.6 mm.',
          keywords: ['thermal expansion', 'linear expansion', 'cubical expansion', 'expansion coefficient'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-calorimetry',
          name: 'Heat Capacity and Principle of Calorimetry',
          expression: 'Q = m c ΔT,   Q_latent = m L',
          latex: 'Q = m c \\Delta T, \\qquad Q_{\\text{latent}} = m L, \\qquad Q_{\\text{lost}} = Q_{\\text{gained}}',
          symbols: [
            { symbol: 'Q', meaning: 'Sensible heat energy transferred', unit: 'joules (J)' },
            { symbol: 'm', meaning: 'Mass of substance', unit: 'kilograms (kg)' },
            { symbol: 'c', meaning: 'Specific heat capacity', unit: 'J/(kg·K)' },
            { symbol: 'L', meaning: 'Specific latent heat of fusion/vaporisation', unit: 'J/kg' }
          ],
          siUnit: 'joules (J)',
          explanation: 'In an isolated thermal enclosure, heat released by warmer bodies equals the heat absorbed by colder bodies until thermal equilibrium is established.',
          conditions: 'Thermally insulated calorimeter; no chemical reaction.',
          example: 'Energy required to heat 2 kg of water (c = 4184 J/(kg·K)) by ΔT = 50 K is Q = 2 × 4184 × 50 = 418.4 kJ.',
          keywords: ['specific heat', 'calorimetry', 'latent heat', 'thermal equilibrium'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-heat-conduction',
          name: 'Rate of Thermal Conduction',
          expression: 'dQ / dt = (k A (T_hot - T_cold)) / L',
          latex: '\\frac{dQ}{dt} = \\frac{k A (T_{\\text{hot}} - T_{\\text{cold}})}{L}',
          symbols: [
            { symbol: 'dQ/dt', meaning: 'Rate of heat transfer', unit: 'watts (W = J/s)' },
            { symbol: 'k', meaning: 'Thermal conductivity of material', unit: 'W/(m·K)' },
            { symbol: 'A', meaning: 'Cross-sectional conduction area', unit: 'square metres (m²)' },
            { symbol: 'L', meaning: 'Thickness of slab', unit: 'metres (m)' },
            { symbol: 'T_{\\text{hot}}, T_{\\text{cold}}', meaning: 'Temperatures of opposite faces', unit: 'kelvin (K)' }
          ],
          siUnit: 'watt (W)',
          explanation: 'Fourier’s law of heat conduction through a uniform planar slab under steady-state conditions.',
          conditions: 'Steady-state 1D temperature gradient without internal heat sources.',
          example: 'Heat conducted through a 0.05 m thick aluminium slab (k = 205 W/(m·K)) of area 0.2 m² with ΔT = 10 K is dQ/dt = (205 × 0.2 × 10) / 0.05 = 8200 W.',
          keywords: ['thermal conduction', 'fouriers law', 'thermal conductivity', 'steady state'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-stefan-boltzmann',
          name: 'Stefan-Boltzmann Law of Radiation',
          expression: 'P = e σ A (T^4 - T_0^4)',
          latex: 'P = e \\sigma A (T^4 - T_0^4)',
          symbols: [
            { symbol: 'P', meaning: 'Net radiated power', unit: 'watts (W)' },
            { symbol: 'e', meaning: 'Emissivity of body surface (0 ≤ e ≤ 1, blackbody e = 1)' },
            { symbol: '\\sigma', meaning: 'Stefan-Boltzmann constant (5.670 × 10⁻⁸ W/(m²·K⁴))' },
            { symbol: 'A', meaning: 'Surface radiating area', unit: 'square metres (m²)' },
            { symbol: 'T, T_0', meaning: 'Absolute temperatures of body and surroundings', unit: 'kelvin (K)' }
          ],
          siUnit: 'watt (W)',
          explanation: 'Total thermal radiant power emitted by an object is proportional to the fourth power of its absolute thermodynamic temperature.',
          conditions: 'Radiative exchange in vacuum or non-absorbing medium.',
          example: 'A blackbody (e = 1) of area 1 m² at 1000 K radiates P = 1 × (5.67 × 10⁻⁸) × 1 × (1000)⁴ = 56.7 kW.',
          keywords: ['stefan boltzmann', 'radiation', 'blackbody', 'fourth power'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-wien-displacement',
          name: 'Wien’s Displacement Law',
          expression: 'λ_max T = b',
          latex: '\\lambda_{\\max} T = b',
          symbols: [
            { symbol: '\\lambda_{\\max}', meaning: 'Wavelength corresponding to peak spectral emittance', unit: 'metres (m)' },
            { symbol: 'T', meaning: 'Absolute temperature of blackbody', unit: 'kelvin (K)' },
            { symbol: 'b', meaning: 'Wien displacement constant (2.898 × 10⁻³ m·K)' }
          ],
          siUnit: 'm·K',
          explanation: 'As the temperature of a blackbody increases, the peak of its spectral radiation distribution shifts towards shorter wavelengths.',
          conditions: 'Ideal blackbody spectral emission.',
          example: 'The Sun’s surface at T ≈ 5800 K peaks at λ_max = (2.898 × 10⁻³) / 5800 ≈ 500 nm (visible green spectrum).',
          keywords: ['wiens law', 'blackbody', 'peak wavelength', 'stellar temperature'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-thermodynamics',
      number: 11,
      title: 'Thermodynamics',
      description: 'First law, work in thermodynamic processes, Mayer’s relation, Carnot engine efficiency, refrigerator COP, and entropy.',
      formulas: [
        {
          id: 'c11-first-law-thermo',
          name: 'First Law of Thermodynamics',
          expression: 'ΔU = Q - W',
          latex: '\\Delta U = Q - W',
          alternateLatex: ['dQ = dU + dW = dU + P\\,dV'],
          symbols: [
            { symbol: '\\Delta U', meaning: 'Change in internal energy of system', unit: 'joules (J)' },
            { symbol: 'Q', meaning: 'Heat energy absorbed by system from surroundings', unit: 'joules (J)' },
            { symbol: 'W', meaning: 'Work done by system on surroundings', unit: 'joules (J)' }
          ],
          siUnit: 'joule (J)',
          explanation: 'Universal conservation of energy applied to thermodynamic processes: heat added increases internal energy and performs work.',
          conditions: 'Closed thermodynamic system.',
          example: 'If 500 J of heat is added to a gas while it expands doing 200 J of work, internal energy increases by ΔU = 500 - 200 = 300 J.',
          keywords: ['first law', 'internal energy', 'heat', 'work', 'conservation of energy'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-process-work',
          name: 'Work Done in Thermodynamic Processes',
          expression: 'Isobaric: W = P ΔV,   Isothermal: W = n R T ln(V_f / V_i)',
          latex: 'W_{\\text{isobaric}} = P \\Delta V, \\qquad W_{\\text{isothermal}} = n R T \\ln\\left( \\frac{V_f}{V_i} \\right), \\qquad W_{\\text{isochoric}} = 0',
          symbols: [
            { symbol: 'W', meaning: 'Work performed by expanding gas', unit: 'joules (J)' },
            { symbol: 'P', meaning: 'Pressure', unit: 'pascal (Pa)' },
            { symbol: 'V_i, V_f', meaning: 'Initial and final gas volumes', unit: 'm³' },
            { symbol: 'n', meaning: 'Number of moles of gas', unit: 'mol' },
            { symbol: 'T', meaning: 'Constant absolute temperature', unit: 'kelvin (K)' }
          ],
          siUnit: 'joule (J)',
          explanation: 'Area under the P-V curve for a quasi-static expansion or compression path.',
          conditions: 'Quasi-static reversible processes in an ideal gas.',
          example: 'In an isochoric process (constant volume), ΔV = 0, so work done is strictly W = 0.',
          keywords: ['isothermal work', 'isobaric work', 'isochoric', 'p-v diagram'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-adiabatic-relation',
          name: 'Adiabatic Process Equation',
          expression: 'P V^γ = constant,   T V^(γ-1) = constant',
          latex: 'P V^\\gamma = \\text{constant}, \\qquad T V^{\\gamma - 1} = \\text{constant}',
          symbols: [
            { symbol: 'P', meaning: 'Gas pressure', unit: 'pascal (Pa)' },
            { symbol: 'V', meaning: 'Gas volume', unit: 'm³' },
            { symbol: 'T', meaning: 'Thermodynamic temperature', unit: 'kelvin (K)' },
            { symbol: '\\gamma', meaning: 'Heat capacity ratio (γ = C_P / C_V > 1)' }
          ],
          siUnit: 'Dimensionless power relations',
          explanation: 'Describes expansion or compression of an ideal gas under perfect thermal insulation where Q = 0.',
          conditions: 'Reversible adiabatic process; zero heat exchange with surroundings.',
          example: 'For diatomic air (γ = 1.4), rapid compression halving volume increases pressure by 2^1.4 ≈ 2.64 times.',
          keywords: ['adiabatic', 'gamma', 'heat capacity ratio', 'thermal insulation'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-mayers-relation',
          name: 'Mayer’s Relation for Molar Heat Capacities',
          expression: 'C_P - C_V = R',
          latex: 'C_P - C_V = R',
          symbols: [
            { symbol: 'C_P', meaning: 'Molar heat capacity at constant pressure', unit: 'J/(mol·K)' },
            { symbol: 'C_V', meaning: 'Molar heat capacity at constant volume', unit: 'J/(mol·K)' },
            { symbol: 'R', meaning: 'Universal gas constant (8.314 J/(mol·K))' }
          ],
          siUnit: 'J/(mol·K)',
          explanation: 'Heat added at constant pressure raises temperature and performs external expansion work against atmospheric pressure.',
          conditions: 'Ideal gas behavior.',
          example: 'For a monatomic gas (C_V = 1.5 R), C_P = 1.5 R + R = 2.5 R, yielding γ = 2.5 / 1.5 = 5/3 ≈ 1.67.',
          keywords: ['mayers formula', 'molar heat capacity', 'gas constant', 'cp cv'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-carnot-efficiency',
          name: 'Carnot Heat Engine Efficiency',
          expression: 'η_Carnot = 1 - T_C / T_H',
          latex: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = \\frac{W_{\\text{net}}}{Q_H}',
          symbols: [
            { symbol: '\\eta_{\\text{Carnot}}', meaning: 'Maximum theoretical thermal efficiency' },
            { symbol: 'T_H', meaning: 'Absolute temperature of hot heat source', unit: 'kelvin (K)' },
            { symbol: 'T_C', meaning: 'Absolute temperature of cold heat sink', unit: 'kelvin (K)' },
            { symbol: 'W_{\\text{net}}', meaning: 'Net mechanical work output per cycle', unit: 'joules (J)' },
            { symbol: 'Q_H', meaning: 'Heat absorbed from hot reservoir', unit: 'joules (J)' }
          ],
          siUnit: 'Dimensionless (fraction or percentage)',
          explanation: 'Upper theoretical limit on the efficiency of any heat engine operating between two thermal reservoirs.',
          conditions: 'Reversible Carnot cycle operating strictly between two fixed thermal reservoirs (temperatures in kelvin).',
          example: 'An engine operating between T_H = 600 K and T_C = 300 K has maximum theoretical efficiency η = 1 - 300 / 600 = 0.50 (50%).',
          keywords: ['carnot engine', 'thermal efficiency', 'second law', 'heat engine'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-kinetic-theory',
      number: 12,
      title: 'Kinetic Theory',
      description: 'Microscopic pressure derivation, root-mean-square velocity, kinetic energy per molecule, equipartition theorem, and mean free path.',
      formulas: [
        {
          id: 'c11-kinetic-pressure',
          name: 'Pressure of an Ideal Gas (Kinetic Theory)',
          expression: 'P = (1/3) ρ v_rms^2',
          latex: 'P = \\frac{1}{3} \\rho v_{\\text{rms}}^2 = \\frac{1}{3} \\frac{M}{V} v_{\\text{rms}}^2',
          symbols: [
            { symbol: 'P', meaning: 'Gas pressure', unit: 'pascal (Pa)' },
            { symbol: '\\rho', meaning: 'Mass density of gas (M / V)', unit: 'kg/m³' },
            { symbol: 'v_{\\text{rms}}', meaning: 'Root-mean-square molecular speed', unit: 'm/s' }
          ],
          siUnit: 'pascal (Pa)',
          explanation: 'Relates macroscopic pressure directly to the microscopic momentum transfer of elastic collisions between molecules and container walls.',
          conditions: 'Point particles undergoing perfectly elastic collisions with negligible intermolecular potential energy.',
          example: 'For nitrogen gas (ρ = 1.25 kg/m³) with v_rms = 500 m/s: P = (1/3) × 1.25 × (500)² ≈ 1.04 × 10⁵ Pa (≈ 1 atm).',
          keywords: ['kinetic theory', 'rms speed', 'pressure derivation', 'molecular velocity'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-rms-speed',
          name: 'Root-Mean-Square Speed of Gas Molecules',
          expression: 'v_rms = √(3 k_B T / m) = √(3 R T / M_mol)',
          latex: 'v_{\\text{rms}} = \\sqrt{\\frac{3 k_B T}{m}} = \\sqrt{\\frac{3 R T}{M_{\\text{mol}}}}',
          symbols: [
            { symbol: 'v_{\\text{rms}}', meaning: 'Root-mean-square molecular velocity', unit: 'm/s' },
            { symbol: 'k_B', meaning: 'Boltzmann constant (1.381 × 10⁻²³ J/K)' },
            { symbol: 'T', meaning: 'Thermodynamic absolute temperature', unit: 'kelvin (K)' },
            { symbol: 'm', meaning: 'Mass of a single molecule', unit: 'kg' },
            { symbol: 'M_{\\text{mol}}', meaning: 'Molar mass of gas', unit: 'kg/mol' }
          ],
          siUnit: 'm/s',
          explanation: 'Measure of the average molecular speed in a Maxwell-Boltzmann thermal distribution.',
          conditions: 'Thermal equilibrium in an ideal gas.',
          example: 'For hydrogen gas (M_mol = 0.002 kg/mol) at 300 K: v_rms = √(3 × 8.314 × 300 / 0.002) ≈ 1934 m/s.',
          keywords: ['v_rms', 'root mean square', 'boltzmann', 'molecular speed'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-kinetic-energy-molecule',
          name: 'Average Translational Kinetic Energy per Molecule',
          expression: 'E_k = (3/2) k_B T',
          latex: 'E_k = \\frac{3}{2} k_B T, \\qquad U = \\frac{f}{2} n R T',
          symbols: [
            { symbol: 'E_k', meaning: 'Mean translational kinetic energy of one molecule', unit: 'joules (J)' },
            { symbol: 'k_B', meaning: 'Boltzmann constant', unit: 'J/K' },
            { symbol: 'T', meaning: 'Thermodynamic temperature', unit: 'kelvin (K)' },
            { symbol: 'f', meaning: 'Degrees of freedom (f = 3 for monatomic, f = 5 for diatomic)' }
          ],
          siUnit: 'joules (J)',
          explanation: 'Shows that temperature is a direct measure of the average translational kinetic energy of gas molecules.',
          conditions: 'Equipartition theorem for 3 translational degrees of freedom.',
          example: 'At room temperature T = 300 K: E_k = 1.5 × (1.381 × 10⁻²³) × 300 ≈ 6.21 × 10⁻²¹ J.',
          keywords: ['kinetic energy', 'degrees of freedom', 'temperature meaning', 'equipartition'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-mean-free-path',
          name: 'Mean Free Path of Gas Molecules',
          expression: 'λ = 1 / (√2 π d^2 n_v)',
          latex: '\\lambda = \\frac{1}{\\sqrt{2} \\pi d^2 n_v} = \\frac{k_B T}{\\sqrt{2} \\pi d^2 P}',
          symbols: [
            { symbol: '\\lambda', meaning: 'Mean free path between successive collisions', unit: 'metres (m)' },
            { symbol: 'd', meaning: 'Effective molecular collision diameter', unit: 'metres (m)' },
            { symbol: 'n_v', meaning: 'Number density of gas molecules (N / V = P / (k_B T))', unit: 'm⁻³' }
          ],
          siUnit: 'metres (m)',
          explanation: 'Average distance traversed by a moving gas molecule between successive collisions with other gas molecules.',
          conditions: 'Rigid hard-sphere model for identical colliding particles.',
          example: 'At STP, air molecules have mean free path λ ≈ 6.8 × 10⁻⁸ m (≈ 68 nm).',
          keywords: ['mean free path', 'collisions', 'number density', 'scattering'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-oscillations',
      number: 13,
      title: 'Oscillations',
      description: 'Simple harmonic motion kinematics, mass-spring system, simple pendulum, energy in SHM, and damped oscillations.',
      formulas: [
        {
          id: 'c11-shm-displacement-velocity',
          name: 'Kinematics of Simple Harmonic Motion',
          expression: 'x(t) = A cos(ω t + φ),   v(t) = ± ω √(A^2 - x^2),   a(t) = - ω^2 x',
          latex: 'x(t) = A \\cos(\\omega t + \\phi), \\quad v(t) = \\pm \\omega \\sqrt{A^2 - x^2}, \\quad a(t) = -\\omega^2 x',
          symbols: [
            { symbol: 'x(t)', meaning: 'Instantaneous displacement from mean equilibrium position', unit: 'metres (m)' },
            { symbol: 'A', meaning: 'Oscillation amplitude', unit: 'metres (m)' },
            { symbol: '\\omega', meaning: 'Angular frequency (ω = 2π / T = 2π f)', unit: 'rad/s' },
            { symbol: '\\phi', meaning: 'Initial phase constant', unit: 'radians' },
            { symbol: 'a', meaning: 'Instantaneous restoring acceleration', unit: 'm/s²' }
          ],
          siUnit: 'm (displacement), m/s (velocity), m/s² (acceleration)',
          explanation: 'Defining characteristic of SHM: restoring acceleration is directly proportional to displacement and directed towards the mean position.',
          conditions: 'Hookean restoring force (F = -m ω² x); zero damping.',
          example: 'An oscillator with A = 0.1 m and ω = 10 rad/s passing through x = 0.06 m has speed v = 10 × √(0.01 - 0.0036) = 0.8 m/s.',
          keywords: ['shm', 'simple harmonic motion', 'amplitude', 'angular frequency', 'phase'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-spring-mass-period',
          name: 'Time Period of Mass-Spring Oscillator',
          expression: 'T = 2π √(m / k)',
          latex: 'T = 2\\pi \\sqrt{\\frac{m}{k}}, \\qquad \\omega = \\sqrt{\\frac{k}{m}}',
          symbols: [
            { symbol: 'T', meaning: 'Time period of one complete cycle', unit: 'seconds (s)' },
            { symbol: 'm', meaning: 'Oscillating inertial mass', unit: 'kilograms (kg)' },
            { symbol: 'k', meaning: 'Spring force stiffness constant', unit: 'N/m' }
          ],
          siUnit: 'seconds (s)',
          explanation: 'Period depends only on oscillating mass and spring stiffness, independent of vibration amplitude.',
          conditions: 'Ideal massless linear elastic spring obeying Hooke’s law.',
          example: 'A 0.25 kg mass suspended from a spring of k = 100 N/m oscillates with period T = 2π √(0.25 / 100) ≈ 0.314 s.',
          keywords: ['spring mass', 'time period', 'stiffness', 'frequency'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-simple-pendulum',
          name: 'Time Period of a Simple Pendulum',
          expression: 'T = 2π √(L / g)',
          latex: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
          symbols: [
            { symbol: 'T', meaning: 'Oscillation period', unit: 'seconds (s)' },
            { symbol: 'L', meaning: 'Length of pendulum from pivot to centre of bob', unit: 'metres (m)' },
            { symbol: 'g', meaning: 'Local gravitational acceleration', unit: 'm/s²' }
          ],
          siUnit: 'seconds (s)',
          explanation: 'Period is independent of bob mass and depends only on pendulum length and local gravity.',
          conditions: 'Small angular amplitude approximation (sin θ ≈ θ, typically θ ≤ 5°).',
          example: 'A seconds pendulum has period T = 2.0 s. Its length on Earth (g ≈ 9.8 m/s²) is L = (g T²) / (4π²) ≈ 0.993 m ≈ 1.0 m.',
          keywords: ['simple pendulum', 'small angle', 'seconds pendulum', 'gravity'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-shm-energy',
          name: 'Total Mechanical Energy in SHM',
          expression: 'E_total = (1/2) k A^2 = (1/2) m ω^2 A^2',
          latex: 'E_{\\text{total}} = K + U = \\frac{1}{2} k A^2 = \\frac{1}{2} m \\omega^2 A^2',
          alternateLatex: ['K = \\frac{1}{2} m \\omega^2 (A^2 - x^2), \\quad U = \\frac{1}{2} m \\omega^2 x^2'],
          symbols: [
            { symbol: 'E_{\\text{total}}', meaning: 'Constant total mechanical energy', unit: 'joules (J)' },
            { symbol: 'A', meaning: 'Oscillation amplitude', unit: 'metres (m)' },
            { symbol: 'k', meaning: 'Spring constant (m ω²)', unit: 'N/m' }
          ],
          siUnit: 'joule (J)',
          explanation: 'Kinetic and potential energies continuously interchange, but their sum remains constant and proportional to amplitude squared.',
          conditions: 'Conservative system with zero dissipative damping.',
          example: 'At the midpoint (x = 0), potential energy is zero and all energy is kinetic. At extremes (x = ±A), all energy is potential.',
          keywords: ['energy conservation in shm', 'kinetic energy', 'potential energy'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'c11-waves',
      number: 14,
      title: 'Waves',
      description: 'Travelling wave equation, speed of transverse waves on strings, Laplace formula for sound speed, standing waves, organ pipes, beats, and Doppler effect.',
      formulas: [
        {
          id: 'c11-wave-speed-frequency',
          name: 'Fundamental Wave Speed Equation',
          expression: 'v = f λ = ω / k',
          latex: 'v = f \\lambda = \\frac{\\omega}{k}, \\qquad \\omega = 2\\pi f, \\qquad k = \\frac{2\\pi}{\\lambda}',
          symbols: [
            { symbol: 'v', meaning: 'Wave phase propagation speed', unit: 'm/s' },
            { symbol: 'f', meaning: 'Frequency of wave', unit: 'hertz (Hz = s⁻¹)' },
            { symbol: '\\lambda', meaning: 'Wavelength', unit: 'metres (m)' },
            { symbol: '\\omega', meaning: 'Angular frequency (2π f)', unit: 'rad/s' },
            { symbol: 'k', meaning: 'Wave number (2π / λ)', unit: 'rad/m' }
          ],
          siUnit: 'm/s',
          explanation: 'Fundamental kinematic relation connecting wave speed, frequency, and wavelength for all mechanical and electromagnetic waves.',
          conditions: 'Non-dispersive wave propagation in a linear medium.',
          example: 'A sound wave of frequency 440 Hz travelling at 343 m/s has wavelength λ = 343 / 440 ≈ 0.78 m.',
          keywords: ['wave speed', 'wavelength', 'frequency', 'wave number'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-string-wave-speed',
          name: 'Speed of Transverse Wave on a Stretched String',
          expression: 'v = √(T / μ)',
          latex: 'v = \\sqrt{\\frac{T}{\\mu}}',
          symbols: [
            { symbol: 'v', meaning: 'Transverse wave speed', unit: 'm/s' },
            { symbol: 'T', meaning: 'Tension in the stretched string', unit: 'newtons (N)' },
            { symbol: '\\mu', meaning: 'Linear mass density of string (m / L)', unit: 'kg/m' }
          ],
          siUnit: 'm/s',
          explanation: 'Wave speed depends solely on elastic tension restoring force and inertial mass density of the string.',
          conditions: 'Small amplitude transverse vibrations on a flexible uniform string.',
          example: 'A string under tension T = 100 N with linear mass density μ = 0.01 kg/m supports wave speed v = √(100 / 0.01) = 100 m/s.',
          keywords: ['string waves', 'tension', 'linear mass density', 'transverse waves'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-sound-laplace',
          name: 'Speed of Sound in Ideal Gas (Laplace Formula)',
          expression: 'v = √(γ P / ρ) = √(γ R T / M_mol)',
          latex: 'v = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma R T}{M_{\\text{mol}}}}',
          symbols: [
            { symbol: 'v', meaning: 'Speed of acoustic compression waves', unit: 'm/s' },
            { symbol: '\\gamma', meaning: 'Adiabatic index (C_P / C_V ≈ 1.4 for air)' },
            { symbol: 'P', meaning: 'Equilibrium gas pressure', unit: 'pascal (Pa)' },
            { symbol: '\\rho', meaning: 'Equilibrium gas density', unit: 'kg/m³' },
            { symbol: 'T', meaning: 'Absolute temperature', unit: 'kelvin (K)' }
          ],
          siUnit: 'm/s',
          explanation: 'Sound propagation in gases is an adiabatic process (Laplace correction) because compressions and rarefactions occur too rapidly for thermal exchange.',
          conditions: 'Homogeneous ideal gas undergoing small-amplitude adiabatic compressions.',
          example: 'In air at 20 °C (293 K) with M_mol ≈ 0.029 kg/mol: v = √(1.4 × 8.314 × 293 / 0.029) ≈ 343 m/s.',
          keywords: ['speed of sound', 'laplace formula', 'adiabatic index', 'acoustics'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-organ-pipes-harmonics',
          name: 'Harmonics in Open and Closed Organ Pipes',
          expression: 'Open: f_n = n v / (2L),   Closed: f_m = m v / (4L)',
          latex: 'f_n^{\\text{open}} = \\frac{n v}{2L} \\quad (n = 1, 2, 3\\dots), \\qquad f_m^{\\text{closed}} = \\frac{m v}{4L} \\quad (m = 1, 3, 5\\dots)',
          symbols: [
            { symbol: 'f_n, f_m', meaning: 'Resonant standing wave frequencies', unit: 'hertz (Hz)' },
            { symbol: 'v', meaning: 'Speed of sound in air column', unit: 'm/s' },
            { symbol: 'L', meaning: 'Length of resonating acoustic air column', unit: 'metres (m)' }
          ],
          siUnit: 'hertz (Hz)',
          explanation: 'Open pipes produce all integer harmonics (1, 2, 3...), whereas closed pipes support only odd harmonics (1, 3, 5...).',
          conditions: 'Ideal acoustic boundary conditions with zero end-correction.',
          example: 'A closed organ pipe of length L = 0.85 m (v = 340 m/s) has fundamental frequency f₁ = (1 × 340) / (4 × 0.85) = 100 Hz.',
          keywords: ['organ pipes', 'standing waves', 'harmonics', 'acoustics', 'open pipe', 'closed pipe'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'c11-beat-frequency',
          name: 'Beat Frequency',
          expression: 'f_beat = |f_1 - f_2|',
          latex: 'f_{\\text{beat}} = |f_1 - f_2|',
          symbols: [
            { symbol: 'f_{\\text{beat}}', meaning: 'Number of amplitude intensity beats heard per second', unit: 'Hz' },
            { symbol: 'f_1, f_2', meaning: 'Frequencies of two superposing sound waves', unit: 'Hz' }
          ],
          siUnit: 'hertz (Hz)',
          explanation: 'Periodic waxing and waning of sound intensity produced by the acoustic interference of two harmonic waves having slightly different frequencies.',
          conditions: 'Two superposing sound waves of nearly equal amplitudes and close frequencies.',
          example: 'Tuning forks of frequencies 256 Hz and 260 Hz sounding simultaneously produce f_beat = |256 - 260| = 4 beats/s.',
          keywords: ['beats', 'beat frequency', 'acoustic interference', 'tuning fork'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'c11-doppler-effect',
          name: 'Doppler Effect for Sound Waves',
          expression: 'f\' = f [ (v ± v_o) / (v ∓ v_s) ]',
          latex: 'f\' = f \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right)',
          symbols: [
            { symbol: 'f\'', meaning: 'Apparent frequency perceived by observer', unit: 'Hz' },
            { symbol: 'f', meaning: 'True source emission frequency', unit: 'Hz' },
            { symbol: 'v', meaning: 'Speed of sound in medium', unit: 'm/s' },
            { symbol: 'v_o', meaning: 'Speed of observer relative to medium', unit: 'm/s' },
            { symbol: 'v_s', meaning: 'Speed of source relative to medium', unit: 'm/s' }
          ],
          siUnit: 'hertz (Hz)',
          explanation: 'Apparent frequency shift caused by relative motion between sound source, observer, and medium. Top signs for mutual approach, bottom signs for recession.',
          conditions: 'Relative speeds much less than sound speed; stationary medium.',
          example: 'Source emitting 500 Hz approaching stationary observer (v_o = 0) at v_s = 34 m/s (v = 340 m/s): f\' = 500 × (340 / 306) ≈ 555.6 Hz.',
          keywords: ['doppler effect', 'frequency shift', 'source observer approach', 'acoustics'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    }
  ]
};
