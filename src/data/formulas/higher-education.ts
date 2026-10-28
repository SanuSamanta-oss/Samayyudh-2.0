import type { AcademicLevel } from '@/types/formulas';

export const higherEducationPhysics: AcademicLevel = {
  "id": "higher-education",
  "title": "Higher-Education Physics",
  "shortTitle": "Higher Education",
  "description": "Undergraduate and advanced university physics covering analytical mechanics, quantum theory, relativity, electrodynamics, and astrophysics.",
  "levelOrder": 4,
  "chapters": [
    {
      "id": "he-classical-mechanics",
      "number": 1,
      "title": "Classical Mechanics",
      "description": "Lagrangian mechanics, Euler-Lagrange equations, Hamiltonian formulation, central force motion, and rigid-body inertia tensors.",
      "formulas": [
        {
          "id": "he-euler-lagrange",
          "name": "Euler-Lagrange Equations of Motion",
          "expression": "d/dt (∂L / ∂q̇_i) - ∂L / ∂q_i = 0,   L = T - V",
          "latex": "\\frac{d}{dt}\\left( \\frac{\\partial L}{\\partial \\dot{q}_i} \\right) - \\frac{\\partial L}{\\partial q_i} = 0, \\quad L = T - V",
          "symbols": [
            {
              "symbol": "L",
              "meaning": "Lagrangian function of mechanical system",
              "unit": "joules (J)"
            },
            {
              "symbol": "T",
              "meaning": "Total kinetic energy in generalised coordinates",
              "unit": "joules (J)"
            },
            {
              "symbol": "V",
              "meaning": "Total generalised potential energy",
              "unit": "joules (J)"
            },
            {
              "symbol": "q_i",
              "meaning": "Generalised position coordinate"
            },
            {
              "symbol": "\\dot{q}_i",
              "meaning": "Generalised velocity (dq_i / dt)"
            }
          ],
          "siUnit": "newtons (N) or generalised force units",
          "explanation": "Fundamental variational principle of analytical mechanics derived from Hamilton’s Principle of Least Action (δS = δ ∫ L dt = 0).",
          "conditions": "Holonomic constraints and monogenic/conservative physical systems.",
          "example": "For a 1D harmonic oscillator: T = (1/2)m ẋ², V = (1/2)k x², L = (1/2)m ẋ² - (1/2)k x². The Euler-Lagrange equation yields m ẍ + k x = 0.",
          "keywords": [
            "lagrangian",
            "euler lagrange",
            "generalised coordinates",
            "least action",
            "analytical mechanics"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-hamilton-equations",
          "name": "Hamilton’s Canonical Equations",
          "expression": "q̇_i = ∂H / ∂p_i,   ṗ_i = - ∂H / ∂q_i,   H = ∑ p_i q̇_i - L",
          "latex": "\\dot{q}_i = \\frac{\\partial H}{\\partial p_i}, \\quad \\dot{p}_i = -\\frac{\\partial H}{\\partial q_i}, \\quad H = \\sum_i p_i \\dot{q}_i - L",
          "symbols": [
            {
              "symbol": "H",
              "meaning": "Hamiltonian function (total energy for scleronomous systems)",
              "unit": "joules (J)"
            },
            {
              "symbol": "p_i",
              "meaning": "Generalised canonical momentum (p_i = ∂L / ∂q̇_i)"
            },
            {
              "symbol": "q_i",
              "meaning": "Generalised position coordinate"
            }
          ],
          "siUnit": "Phase-space canonical equations",
          "explanation": "Transforms n second-order Lagrangian differential equations into 2n first-order symmetric differential equations on phase space.",
          "conditions": "Conservative system with invertible Legendre transform between q̇ and p.",
          "example": "For a free particle: H = p² / (2m). Hamilton’s equations give ẋ = p / m and ṗ = 0 (momentum conservation).",
          "keywords": [
            "hamiltonian",
            "canonical equations",
            "phase space",
            "generalised momentum"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-inertia-tensor",
          "name": "Rigid Body Inertia Tensor",
          "expression": "I_ij = ∫ (r² δ_ij - x_i x_j) dm,   L = I · ω",
          "latex": "I_{ij} = \\int (r^2 \\delta_{ij} - x_i x_j)\\,dm, \\quad \\mathbf{L} = \\mathbf{I} \\cdot \\boldsymbol{\\omega}",
          "symbols": [
            {
              "symbol": "I_{ij}",
              "meaning": "Components of symmetric 3×3 moment of inertia tensor",
              "unit": "kg m²"
            },
            {
              "symbol": "\\delta_{ij}",
              "meaning": "Kronecker delta function (1 if i=j, 0 otherwise)"
            },
            {
              "symbol": "x_i, x_j",
              "meaning": "Cartesian position coordinates (x, y, z)",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\mathbf{L}",
              "meaning": "Total angular momentum vector",
              "unit": "kg m² s⁻¹"
            },
            {
              "symbol": "\\boldsymbol{\\omega}",
              "meaning": "Angular velocity vector",
              "unit": "rad s⁻¹"
            }
          ],
          "siUnit": "kg m²",
          "explanation": "In 3D rigid body dynamics, angular momentum L and angular velocity ω are generally not collinear, requiring tensor multiplication.",
          "conditions": "Rigid body rotation about a fixed point or centre of mass.",
          "example": "Diagonalising the inertia tensor identifies the three mutually perpendicular principal axes of rotation.",
          "keywords": [
            "inertia tensor",
            "rigid body",
            "principal axes",
            "angular momentum tensor"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-math-physics",
      "number": 2,
      "title": "Mathematical Physics and Vector Calculus",
      "description": "Vector differential operators, divergence theorem, Stokes’ theorem, Green’s identities, and Fourier series analysis.",
      "formulas": [
        {
          "id": "he-vector-operators",
          "name": "Vector Differential Operators (Grad, Div, Curl, Laplacian)",
          "expression": "∇φ = grad φ,   ∇ · A = div A,   ∇ × A = curl A,   ∇²φ = ∇ · ∇φ = div(grad φ)",
          "latex": "\\nabla\\phi = \\text{grad }\\phi, \\quad \\nabla \\cdot \\mathbf{A} = \\text{div }\\mathbf{A}, \\quad \\nabla \\times \\mathbf{A} = \\text{curl }\\mathbf{A}, \\quad \\nabla^2\\phi = \\nabla \\cdot \\nabla\\phi",
          "symbols": [
            {
              "symbol": "\\nabla",
              "meaning": "Del (nabla) vector spatial differential operator (î ∂/∂x + ĵ ∂/∂y + k̂ ∂/∂z)"
            },
            {
              "symbol": "\\phi",
              "meaning": "Scalar field function"
            },
            {
              "symbol": "\\mathbf{A}",
              "meaning": "Vector field function"
            }
          ],
          "siUnit": "m⁻¹ differential operator",
          "explanation": "Fundamental building blocks of field theories in continuum mechanics, acoustics, electromagnetism, and fluid flow.",
          "conditions": "Continuously differentiable scalar and vector fields in Euclidean space.",
          "example": "For an electrostatic conservative field: E = -∇V, which guarantees ∇ × E = -∇ × (∇V) ≡ 0 (irrotational field).",
          "keywords": [
            "gradient",
            "divergence",
            "curl",
            "laplacian",
            "vector calculus"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-divergence-stokes-theorem",
          "name": "Divergence and Stokes’ Theorems",
          "expression": "Gauss-Ostrogradsky: ∭_V (∇ · A) dV = ∬_∂V A · dS,    Stokes: ∬_S (∇ × A) · dS = ∮_∂S A · dl",
          "latex": "\\iiint_V (\\nabla \\cdot \\mathbf{A})\\,dV = \\iint_{\\partial V} \\mathbf{A} \\cdot d\\mathbf{S}, \\quad \\iint_S (\\nabla \\times \\mathbf{A}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{A} \\cdot d\\mathbf{l}",
          "symbols": [
            {
              "symbol": "V",
              "meaning": "Volume domain bounded by closed surface ∂V",
              "unit": "m³"
            },
            {
              "symbol": "S",
              "meaning": "Open surface bounded by closed oriented contour ∂S",
              "unit": "m²"
            },
            {
              "symbol": "\\mathbf{A}",
              "meaning": "Differentiable vector field"
            }
          ],
          "siUnit": "Integral conservation theorems",
          "explanation": "Relates volume integrals of divergence to boundary surface flux, and surface integrals of curl to boundary line circulation.",
          "conditions": "Smooth vector fields and orientable piecewise-smooth bounding surfaces.",
          "example": "Applying the divergence theorem to Maxwell’s equation ∇ · E = ρ / ε₀ directly derives the integral form of Gauss’s law.",
          "keywords": [
            "divergence theorem",
            "stokes theorem",
            "flux",
            "circulation",
            "surface integral"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-fourier-series",
          "name": "Fourier Series Decomposition",
          "expression": "f(x) = a_0 / 2 + ∑ [ a_n cos(n x) + b_n sin(n x) ],   a_n = (1/π) ∫_{-π}^{π} f(x) cos(n x) dx",
          "latex": "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} [a_n \\cos(nx) + b_n \\sin(nx)], \\quad a_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos(nx)\\,dx",
          "symbols": [
            {
              "symbol": "f(x)",
              "meaning": "Periodic function of period 2π"
            },
            {
              "symbol": "a_n, b_n",
              "meaning": "Fourier coefficient amplitudes"
            },
            {
              "symbol": "n",
              "meaning": "Positive harmonic integer index (1, 2, 3...)"
            }
          ],
          "siUnit": "Spectral decomposition",
          "explanation": "Decomposes any piecewise-continuous periodic function into a superposition of orthogonal harmonic sinusoidal basis functions.",
          "conditions": "Dirichlet conditions satisfied over the fundamental period.",
          "example": "Decomposing a square wave reveals that it contains only odd harmonics with amplitudes decaying as 1/n.",
          "keywords": [
            "fourier series",
            "harmonic analysis",
            "orthogonality",
            "coefficients"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-advanced-em",
      "number": 3,
      "title": "Advanced Electromagnetism",
      "description": "Poisson and Laplace equations, electrostatic boundary value problems, multipole expansion, Poynting vector, and radiation pressure.",
      "formulas": [
        {
          "id": "he-poisson-laplace",
          "name": "Poisson and Laplace Equations",
          "expression": "Poisson: ∇²V = - ρ / ε₀,    Laplace: ∇²V = 0   [in charge-free regions]",
          "latex": "\\nabla^2 V = -\\frac{\\rho}{\\varepsilon_0} \\quad \\text{(Poisson)}, \\quad \\nabla^2 V = 0 \\quad \\text{(Laplace)}",
          "symbols": [
            {
              "symbol": "V",
              "meaning": "Electrostatic scalar potential",
              "unit": "volts (V)"
            },
            {
              "symbol": "\\rho",
              "meaning": "Local volume charge density",
              "unit": "C m⁻³"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of free space",
              "unit": "F m⁻¹"
            },
            {
              "symbol": "\\nabla^2",
              "meaning": "Laplacian operator (∂²/∂x² + ∂²/∂y² + ∂²/∂z²)"
            }
          ],
          "siUnit": "V m⁻²",
          "explanation": "Fundamental partial differential equations governing electrostatic potentials subject to specified boundary conditions.",
          "conditions": "Electrostatic equilibrium with specified Dirichlet or Neumann boundary conditions.",
          "example": "Laplace’s equation guarantees Earnshaw’s theorem: a collection of point charges cannot be maintained in a stable stationary equilibrium solely by electrostatic interactions.",
          "keywords": [
            "poisson equation",
            "laplace equation",
            "boundary value",
            "electrostatic potential"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-poynting-vector",
          "name": "Poynting Vector and Radiation Pressure",
          "expression": "S = (1 / μ₀) (E × B),   P_rad = I / c   [absorbing],   P_rad = (2 I) / c   [reflecting]",
          "latex": "\\mathbf{S} = \\frac{1}{\\mu_0} (\\mathbf{E} \\times \\mathbf{B}), \\quad P_{\\text{rad}} = \\frac{I}{c} \\quad \\text{(Absorbing)}, \\quad P_{\\text{rad}} = \\frac{2I}{c} \\quad \\text{(Reflecting)}",
          "symbols": [
            {
              "symbol": "\\mathbf{S}",
              "meaning": "Poynting vector representing directional electromagnetic energy flux",
              "unit": "W m⁻²"
            },
            {
              "symbol": "I",
              "meaning": "Time-averaged wave intensity",
              "unit": "W m⁻²"
            },
            {
              "symbol": "c",
              "meaning": "Speed of light in vacuum",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "P_{\\text{rad}}",
              "meaning": "Mechanical radiation pressure exerted on surface",
              "unit": "pascal (Pa = N m⁻²)"
            }
          ],
          "siUnit": "W m⁻² for Poynting vector; Pa for radiation pressure",
          "explanation": "The Poynting vector represents the instantaneous directional rate of electromagnetic energy transport per unit area. Photons transfer momentum, exerting radiation pressure.",
          "conditions": "Plane electromagnetic wave incident normally on planar boundary.",
          "example": "Direct sunlight with intensity I ≈ 1360 W m⁻² incident on a perfectly absorbing solar sail exerts radiation pressure P_rad = 1360 / (3 × 10⁸) ≈ 4.53 × 10⁻⁶ Pa.",
          "keywords": [
            "poynting vector",
            "radiation pressure",
            "energy flux",
            "electromagnetic momentum"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-quantum-mechanics",
      "number": 4,
      "title": "Quantum Mechanics",
      "description": "Schrödinger equations, quantum operators, commutator algebra, Heisenberg uncertainty principle, 1D infinite square well, and quantum tunneling.",
      "formulas": [
        {
          "id": "he-schrodinger-equation",
          "name": "Time-Dependent and Time-Independent Schrödinger Equations",
          "expression": "i ℏ (∂ψ / ∂t) = Ĥ ψ = [ - (ℏ² / (2m)) ∇² + V ] ψ,   Ĥ ψ = E ψ",
          "latex": "i \\hbar \\frac{\\partial\\psi}{\\partial t} = \\hat{H}\\psi = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r}) \\right]\\psi, \\quad \\hat{H}\\psi = E\\psi",
          "symbols": [
            {
              "symbol": "\\psi(\\mathbf{r}, t)",
              "meaning": "Complex quantum state wave function"
            },
            {
              "symbol": "\\hbar",
              "meaning": "Reduced Planck constant (1.055 × 10⁻³⁴ J s)",
              "unit": "J s"
            },
            {
              "symbol": "\\hat{H}",
              "meaning": "Hamiltonian energy operator",
              "unit": "joules (J)"
            },
            {
              "symbol": "m",
              "meaning": "Particle mass",
              "unit": "kilograms (kg)"
            },
            {
              "symbol": "V(\\mathbf{r})",
              "meaning": "Potential energy function",
              "unit": "joules (J)"
            },
            {
              "symbol": "E",
              "meaning": "Energy eigenvalue of stationary state",
              "unit": "joules (J)"
            }
          ],
          "siUnit": "Differential equation governing probability amplitudes",
          "explanation": "Fundamental dynamical law of non-relativistic quantum mechanics. The probability density of finding the particle in volume dV is given by |ψ|² dV.",
          "conditions": "Non-relativistic quantum system.",
          "example": "For a free particle (V = 0), solutions are plane waves ψ(x, t) = A exp[i(k x - ω t)] with dispersion relation E = ℏ² k² / (2m).",
          "keywords": [
            "schrodinger equation",
            "hamiltonian",
            "wave function",
            "quantum mechanics",
            "eigenvalue"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-heisenberg-uncertainty",
          "name": "Heisenberg Generalized Uncertainty Principle",
          "expression": "Δx Δp_x ≥ ℏ / 2,   [x̂, p̂_x] = i ℏ,   ΔA ΔB ≥ (1/2) |⟨[Â, B̂]⟩|",
          "latex": "\\Delta x \\Delta p_x \\ge \\frac{\\hbar}{2}, \\quad [\\hat{x}, \\hat{p}_x] = i\\hbar, \\quad \\sigma_A \\sigma_B \\ge \\frac{1}{2} |\\langle [\\hat{A}, \\hat{B}] \\rangle|",
          "symbols": [
            {
              "symbol": "\\Delta x, \\Delta p_x",
              "meaning": "Standard deviation measurement uncertainties in position and momentum"
            },
            {
              "symbol": "[\\hat{A}, \\hat{B}]",
              "meaning": "Commutator bracket between two Hermitian quantum operators (ÂB̂ - B̂Â)"
            }
          ],
          "siUnit": "J s (action units)",
          "explanation": "Fundamental quantum limit: incompatible observables whose operators do not commute cannot be simultaneously measured with arbitrary precision.",
          "conditions": "Any quantum mechanical state space.",
          "example": "Confining an electron within a 1 Å (10⁻¹⁰ m) atomic diameter creates a minimum momentum uncertainty Δp ≥ ℏ / (2 × 10⁻¹⁰) ≈ 5.3 × 10⁻²⁵ kg m s⁻¹, prohibiting it from collapsing to rest in the nucleus.",
          "keywords": [
            "heisenberg uncertainty",
            "commutator",
            "quantum limits",
            "conjugate variables"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-infinite-square-well",
          "name": "Energy Eigenvalues of 1D Infinite Potential Well",
          "expression": "E_n = (n² π² ℏ²) / (2 m L²) = (n² h²) / (8 m L²)   (n = 1, 2, 3...)",
          "latex": "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m L^2} = \\frac{n^2 h^2}{8 m L^2} \\quad (n = 1, 2, 3, \\dots)",
          "symbols": [
            {
              "symbol": "E_n",
              "meaning": "Quantised energy level of n-th bound state",
              "unit": "joules (J) or eV"
            },
            {
              "symbol": "n",
              "meaning": "Quantum state integer index"
            },
            {
              "symbol": "L",
              "meaning": "Width of infinite potential box",
              "unit": "metres (m)"
            },
            {
              "symbol": "m",
              "meaning": "Mass of confined particle",
              "unit": "kilograms (kg)"
            }
          ],
          "siUnit": "joule (J) or eV",
          "explanation": "Boundary condition requirements (ψ = 0 at x = 0 and x = L) restrict allowable wavelengths to standing waves, quantising the energy spectrum.",
          "conditions": "One-dimensional box with infinitely rigid boundaries (V = 0 for 0 < x < L, V = ∞ elsewhere).",
          "example": "The ground state (n = 1) has non-zero zero-point energy E₁ = π² ℏ² / (2mL²), demonstrating that quantum particles cannot be at rest.",
          "keywords": [
            "infinite square well",
            "particle in a box",
            "energy quantisation",
            "zero point energy"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-special-relativity",
      "number": 5,
      "title": "Special Relativity",
      "description": "Lorentz transformation factor, relativistic time dilation, length contraction, relativistic momentum, energy-momentum invariant, and velocity addition.",
      "formulas": [
        {
          "id": "he-lorentz-factor",
          "name": "Lorentz Transformation Factor (Gamma)",
          "expression": "γ = 1 / √(1 - v² / c²) = 1 / √(1 - β²),   β = v / c",
          "latex": "\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} = \\frac{1}{\\sqrt{1 - \\beta^2}}, \\quad \\beta = \\frac{v}{c}",
          "symbols": [
            {
              "symbol": "\\gamma",
              "meaning": "Lorentz dilation factor (γ ≥ 1)"
            },
            {
              "symbol": "v",
              "meaning": "Relative velocity between two inertial frames",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "c",
              "meaning": "Speed of light in vacuum (3.00 × 10⁸ m s⁻¹)",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "\\beta",
              "meaning": "Velocity normalized to speed of light"
            }
          ],
          "siUnit": "Dimensionless scaling factor",
          "explanation": "Scale factor governing kinematic changes between frames in special relativity. As v approaches c, γ approaches infinity.",
          "conditions": "Inertial reference frames moving with constant relative velocity.",
          "example": "At speed v = 0.6 c: γ = 1 / √(1 - 0.36) = 1 / √0.64 = 1 / 0.8 = 1.25. At v = 0.8 c: γ = 1 / 0.6 ≈ 1.67.",
          "keywords": [
            "lorentz factor",
            "gamma",
            "special relativity",
            "inertial frame"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-time-dilation-length-contraction",
          "name": "Relativistic Time Dilation and Length Contraction",
          "expression": "Δt = γ Δt_0   (moving clocks run slower),    L = L_0 / γ   (moving lengths contract)",
          "latex": "\\Delta t = \\gamma \\Delta t_0 \\quad \\text{(Time Dilation)}, \\quad L = \\frac{L_0}{\\gamma} \\quad \\text{(Length Contraction)}",
          "symbols": [
            {
              "symbol": "\\Delta t",
              "meaning": "Dilated time interval measured by stationary observer",
              "unit": "seconds (s)"
            },
            {
              "symbol": "\\Delta t_0",
              "meaning": "Proper time measured in rest frame of clock",
              "unit": "seconds (s)"
            },
            {
              "symbol": "L",
              "meaning": "Contracted length along the direction of motion",
              "unit": "metres (m)"
            },
            {
              "symbol": "L_0",
              "meaning": "Proper length measured in rest frame of object",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "seconds (s) for time; metres (m) for length",
          "explanation": "Consequence of the constancy of the speed of light. Moving clocks tick more slowly, and objects appear foreshortened along their direction of motion.",
          "conditions": "Length contraction occurs strictly along the axis of relative translation.",
          "example": "Atmospheric muons (lifetime τ_0 = 2.2 μs) travelling at v = 0.995 c (γ ≈ 10) have dilated lab lifetime Δt = 10 × 2.2 = 22 μs, allowing them to reach Earth’s surface.",
          "keywords": [
            "time dilation",
            "length contraction",
            "proper time",
            "proper length",
            "muon experiment"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-energy-momentum-invariant",
          "name": "Relativistic Energy-Momentum Invariant Relation",
          "expression": "E² = p² c² + m₀² c⁴,   E = γ m₀ c²,   p = γ m₀ v",
          "latex": "E^2 = p^2 c^2 + m_0^2 c^4, \\quad E = \\gamma m_0 c^2, \\quad \\mathbf{p} = \\gamma m_0 \\mathbf{v}",
          "symbols": [
            {
              "symbol": "E",
              "meaning": "Total relativistic energy of particle",
              "unit": "joules (J) or MeV"
            },
            {
              "symbol": "p",
              "meaning": "Relativistic linear momentum",
              "unit": "kg m s⁻¹ or MeV/c"
            },
            {
              "symbol": "m_0",
              "meaning": "Invariant rest mass of particle",
              "unit": "kilograms (kg)"
            },
            {
              "symbol": "c",
              "meaning": "Speed of light in vacuum",
              "unit": "m s⁻¹"
            }
          ],
          "siUnit": "joule (J) or electron-volt (eV)",
          "explanation": "Fundamental 4-vector invariant relation connecting relativistic momentum, rest mass, and total energy. For massless photons (m₀ = 0), E = p c.",
          "conditions": "Valid for all particles (both massive and massless) in any inertial frame.",
          "example": "For an electron at rest (p = 0): E_0 = m_e c² ≈ 0.511 MeV. For a photon: E = hf = pc.",
          "keywords": [
            "energy momentum relation",
            "rest energy",
            "invariant mass",
            "relativistic kinematics"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-stat-mech",
      "number": 6,
      "title": "Statistical Mechanics and Thermodynamics",
      "description": "Boltzmann entropy, canonical partition function, Helmholtz free energy, Maxwell-Boltzmann, Fermi-Dirac, and Bose-Einstein distributions.",
      "formulas": [
        {
          "id": "he-boltzmann-entropy",
          "name": "Boltzmann Entropy Formula",
          "expression": "S = k_B ln(Ω)",
          "latex": "S = k_B \\ln\\Omega",
          "symbols": [
            {
              "symbol": "S",
              "meaning": "Statistical thermodynamic entropy",
              "unit": "J K⁻¹"
            },
            {
              "symbol": "k_B",
              "meaning": "Boltzmann constant (1.381 × 10⁻²³ J K⁻¹)",
              "unit": "J K⁻¹"
            },
            {
              "symbol": "\\Omega",
              "meaning": "Thermodynamic probability (number of accessible microstates)"
            }
          ],
          "siUnit": "joules per kelvin (J K⁻¹)",
          "explanation": "Bridge connecting microscopic statistical mechanics with macroscopic thermodynamics: entropy is a direct logarithmic measure of multiplicity.",
          "conditions": "Microcanonical ensemble at equilibrium.",
          "example": "For a perfectly ordered crystal at absolute zero (T = 0 K), there is only one unique ground state (Ω = 1), so S = k_B ln(1) = 0 (Third Law of Thermodynamics).",
          "keywords": [
            "boltzmann entropy",
            "microstates",
            "multiplicity",
            "third law"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-canonical-partition",
          "name": "Canonical Partition Function and Helmholtz Free Energy",
          "expression": "Z = ∑_i e^(- β E_i),   F = - k_B T ln(Z),   β = 1 / (k_B T)",
          "latex": "Z = \\sum_i e^{-\\beta E_i}, \\quad F = -k_B T \\ln Z, \\quad \\beta = \\frac{1}{k_B T}",
          "symbols": [
            {
              "symbol": "Z",
              "meaning": "Canonical partition function (sum over all microstates)"
            },
            {
              "symbol": "E_i",
              "meaning": "Energy eigenvalue of i-th microstate",
              "unit": "joules (J)"
            },
            {
              "symbol": "F",
              "meaning": "Helmholtz free energy (F = U - T S)",
              "unit": "joules (J)"
            },
            {
              "symbol": "\\beta",
              "meaning": "Thermodynamic beta parameter",
              "unit": "J⁻¹"
            }
          ],
          "siUnit": "Dimensionless for Z; joules (J) for free energy F",
          "explanation": "The partition function encodes all thermodynamic information about a system in thermal contact with a heat reservoir at temperature T.",
          "conditions": "Canonical ensemble with fixed N, V, T.",
          "example": "Internal energy is obtained by differentiating: U = - ∂ ln Z / ∂β.",
          "keywords": [
            "partition function",
            "canonical ensemble",
            "helmholtz free energy",
            "thermal average"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-quantum-distributions",
          "name": "Fermi-Dirac and Bose-Einstein Quantum Distributions",
          "expression": "Fermi-Dirac: f_FD(E) = 1 / [ e^((E - μ)/(k_BT)) + 1 ],   Bose-Einstein: f_BE(E) = 1 / [ e^((E - μ)/(k_BT)) - 1 ]",
          "latex": "f_{\\text{FD}}(E) = \\frac{1}{e^{(E - \\mu)/(k_B T)} + 1}, \\quad f_{\\text{BE}}(E) = \\frac{1}{e^{(E - \\mu)/(k_B T)} - 1}",
          "symbols": [
            {
              "symbol": "f(E)",
              "meaning": "Average occupation number of single-particle energy level E"
            },
            {
              "symbol": "\\mu",
              "meaning": "Chemical potential of the quantum gas",
              "unit": "joules (J)"
            },
            {
              "symbol": "k_B T",
              "meaning": "Thermal energy scale",
              "unit": "joules (J)"
            }
          ],
          "siUnit": "Dimensionless average particle occupation number",
          "explanation": "Governs identical quantum particles: Fermi-Dirac applies to fermions (spin 1/2, obeys Pauli exclusion: f ≤ 1); Bose-Einstein applies to bosons (integer spin: supports condensation).",
          "conditions": "Indistinguishable quantum particles in thermal equilibrium.",
          "example": "For electrons in metals at T = 0 K, f_FD(E) = 1 for E < E_F and f_FD(E) = 0 for E > E_F, forming a sharp Fermi surface.",
          "keywords": [
            "fermi dirac",
            "bose einstein",
            "quantum statistics",
            "chemical potential",
            "pauli exclusion"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-solid-state",
      "number": 7,
      "title": "Solid-State Physics",
      "description": "Bragg diffraction, reciprocal lattice vectors, Fermi energy of free-electron gas, Drude conductivity, and the Hall coefficient.",
      "formulas": [
        {
          "id": "he-bragg-diffraction",
          "name": "Bragg’s Law of X-Ray Diffraction",
          "expression": "2 d sin(θ) = n λ",
          "latex": "2 d \\sin\\theta = n \\lambda",
          "symbols": [
            {
              "symbol": "d",
              "meaning": "Interplanar spacing between parallel crystal lattice planes",
              "unit": "metres (m) or Å"
            },
            {
              "symbol": "\\theta",
              "meaning": "Glancing angle of incidence measured from atomic plane",
              "unit": "degrees"
            },
            {
              "symbol": "n",
              "meaning": "Diffraction reflection order index"
            },
            {
              "symbol": "\\lambda",
              "meaning": "X-ray beam wavelength",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Condition for constructive interference of waves scattered specularly from successive parallel lattice planes of an atomic crystal.",
          "conditions": "Monochromatic X-ray beam scattering from periodic single crystal lattice.",
          "example": "X-rays of λ = 1.54 Å incident on crystal planes with d = 2.0 Å satisfy first-order (n = 1) reflection at sin θ = (1 × 1.54) / (2 × 2.0) = 0.385, so θ ≈ 22.6°.",
          "keywords": [
            "braggs law",
            "x ray diffraction",
            "interplanar spacing",
            "crystal lattice"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-fermi-energy",
          "name": "Fermi Energy of 3D Free-Electron Gas",
          "expression": "E_F = (ℏ² / (2 m_e)) (3 π² n)^(2/3)",
          "latex": "E_F = \\frac{\\hbar^2}{2 m_e} (3 \\pi^2 n)^{2/3}",
          "symbols": [
            {
              "symbol": "E_F",
              "meaning": "Fermi energy at absolute zero temperature (T = 0 K)",
              "unit": "eV or J"
            },
            {
              "symbol": "n",
              "meaning": "Conduction electron number density (N / V)",
              "unit": "m⁻³"
            },
            {
              "symbol": "m_e",
              "meaning": "Effective mass of conduction electron",
              "unit": "kg"
            }
          ],
          "siUnit": "electron-volt (eV) or joules (J)",
          "explanation": "Highest occupied single-particle energy level in a degenerate quantum electron gas at absolute zero temperature.",
          "conditions": "Sommerfeld free-electron model in three dimensions.",
          "example": "For copper (n ≈ 8.5 × 10²⁸ m⁻³): Fermi energy is E_F ≈ 7.0 eV, corresponding to a Fermi velocity v_F ≈ 1.57 × 10⁶ m s⁻¹.",
          "keywords": [
            "fermi energy",
            "fermi level",
            "electron gas",
            "sommerfeld model",
            "density of states"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-hall-effect",
          "name": "Hall Coefficient and Hall Voltage",
          "expression": "R_H = 1 / (n q),   V_H = (I B) / (n q t)",
          "latex": "R_H = \\frac{1}{n q}, \\quad V_H = \\frac{I B}{n q t}",
          "symbols": [
            {
              "symbol": "R_H",
              "meaning": "Hall coefficient of conductor",
              "unit": "m³ C⁻¹"
            },
            {
              "symbol": "V_H",
              "meaning": "Transverse Hall potential developed",
              "unit": "volts (V)"
            },
            {
              "symbol": "n",
              "meaning": "Charge carrier concentration density",
              "unit": "m⁻³"
            },
            {
              "symbol": "q",
              "meaning": "Charge of dominant carrier (-e for electrons, +e for holes)"
            },
            {
              "symbol": "t",
              "meaning": "Sample thickness along magnetic field direction",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "m³ C⁻¹ for R_H; volts (V) for V_H",
          "explanation": "Transverse electric voltage generated when a magnetic field deflects moving charge carriers. The sign of R_H reveals whether conduction is dominated by electrons or holes.",
          "conditions": "Uniform magnetic field perpendicular to current flow in thin rectangular sample.",
          "example": "Measuring negative R_H verifies that conduction in metals is mediated by negative electrons; positive R_H in p-type semiconductors verifies hole conduction.",
          "keywords": [
            "hall effect",
            "hall coefficient",
            "carrier density",
            "lorentz deflection"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-nuclear-particle",
      "number": 8,
      "title": "Nuclear and Particle Physics",
      "description": "Nuclear reaction Q-value, Compton scattering wavelength shift, pair production threshold, and conservation laws in particle physics.",
      "formulas": [
        {
          "id": "he-reaction-q-value",
          "name": "Q-Value of Nuclear Reactions",
          "expression": "Q = (∑ m_initial - ∑ m_final) c²",
          "latex": "Q = \\left( \\sum m_{\\text{initial}} - \\sum m_{\\text{final}} \\right) c^2",
          "symbols": [
            {
              "symbol": "Q",
              "meaning": "Net energy balance of nuclear reaction (exoergic if Q > 0, endoergic if Q < 0)",
              "unit": "MeV"
            },
            {
              "symbol": "\\sum m_{\\text{initial}}",
              "meaning": "Sum of rest masses of reactant particles",
              "unit": "u or kg"
            },
            {
              "symbol": "\\sum m_{\\text{final}}",
              "meaning": "Sum of rest masses of product particles",
              "unit": "u or kg"
            }
          ],
          "siUnit": "MeV (where 1 u c² ≈ 931.5 MeV)",
          "explanation": "Calculates the net kinetic energy released or absorbed during a nuclear transmutation or fission/fusion reaction.",
          "conditions": "Isolated nuclear reaction in centre-of-mass frame.",
          "example": "In D-T fusion (²H + ³H → ⁴He + n): mass difference Δm ≈ 0.01888 u yields exothermic energy release Q ≈ 0.01888 × 931.5 ≈ 17.6 MeV.",
          "keywords": [
            "q value",
            "nuclear reaction",
            "fusion",
            "fission",
            "exoergic"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-compton-scattering",
          "name": "Compton Scattering Wavelength Shift",
          "expression": "Δλ = λ' - λ = (h / (m_e c)) (1 - cos θ) = λ_c (1 - cos θ)",
          "latex": "\\Delta\\lambda = \\lambda' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta) = \\lambda_c (1 - \\cos\\theta)",
          "symbols": [
            {
              "symbol": "\\Delta\\lambda",
              "meaning": "Compton wavelength shift of scattered photon",
              "unit": "metres (m) or pm"
            },
            {
              "symbol": "\\lambda_c",
              "meaning": "Compton wavelength of electron (h / (m_e c) ≈ 2.426 × 10⁻¹² m)",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Scattering deflection angle of photon",
              "unit": "degrees"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Elastic scattering of an X-ray or gamma-ray photon by a stationary electron, providing definitive experimental proof of photon particle momentum.",
          "conditions": "Stationary free electron before collision.",
          "example": "For 90° scattering (θ = 90°, cos 90° = 0): wavelength shift is exactly Δλ = λ_c ≈ 2.426 pm.",
          "keywords": [
            "compton scattering",
            "compton wavelength",
            "photon collision",
            "quantum scattering"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-fluid-dynamics",
      "number": 9,
      "title": "Fluid Dynamics",
      "description": "Navier-Stokes equation, continuity equation for compressible flow, Reynolds number, and kinematic viscosity.",
      "formulas": [
        {
          "id": "he-navier-stokes",
          "name": "Navier-Stokes Equation of Fluid Motion",
          "expression": "ρ [ ∂v/∂t + (v · ∇)v ] = - ∇P + η ∇²v + ρ g",
          "latex": "\\rho \\left[ \\frac{\\partial\\mathbf{v}}{\\partial t} + (\\mathbf{v} \\cdot \\nabla)\\mathbf{v} \\right] = -\\nabla P + \\eta \\nabla^2 \\mathbf{v} + \\rho\\mathbf{g}",
          "symbols": [
            {
              "symbol": "\\mathbf{v}",
              "meaning": "Velocity vector field of fluid",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "\\rho",
              "meaning": "Fluid density",
              "unit": "kg m⁻³"
            },
            {
              "symbol": "P",
              "meaning": "Thermodynamic pressure field",
              "unit": "pascal (Pa)"
            },
            {
              "symbol": "\\eta",
              "meaning": "Dynamic shear viscosity",
              "unit": "Pa s"
            },
            {
              "symbol": "\\mathbf{g}",
              "meaning": "Gravitational acceleration vector",
              "unit": "m s⁻²"
            }
          ],
          "siUnit": "N m⁻³ (force per unit volume equation)",
          "explanation": "Newton’s second law applied to viscous fluid elements, balancing fluid inertia, pressure gradients, viscous shear forces, and body gravity forces.",
          "conditions": "Incompressible Newtonian fluid.",
          "example": "Neglecting viscosity (η = 0) reduces the Navier-Stokes equation to the Euler equation of inviscid fluid dynamics.",
          "keywords": [
            "navier stokes",
            "viscous flow",
            "convective acceleration",
            "fluid dynamics"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-reynolds-number",
          "name": "Reynolds Number",
          "expression": "Re = (ρ v L) / η = (v L) / ν",
          "latex": "\\text{Re} = \\frac{\\rho v L}{\\eta} = \\frac{v L}{\\nu}",
          "symbols": [
            {
              "symbol": "\\text{Re}",
              "meaning": "Reynolds number (dimensionless)"
            },
            {
              "symbol": "v",
              "meaning": "Characteristic flow velocity",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "L",
              "meaning": "Characteristic linear dimension (e.g. pipe diameter)",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\nu",
              "meaning": "Kinematic viscosity (ν = η / ρ)",
              "unit": "m² s⁻¹"
            }
          ],
          "siUnit": "Dimensionless ratio of inertial to viscous forces",
          "explanation": "Predicts fluid flow regime: low Re (Re < 2000) corresponds to smooth laminar flow; high Re (Re > 4000) corresponds to turbulent flow.",
          "conditions": "Flow of Newtonian fluid through geometrically similar channels.",
          "example": "Water (ν = 10⁻⁶ m² s⁻¹) flowing at 0.5 m s⁻¹ through a 0.05 m diameter pipe has Re = (0.5 × 0.05) / 10⁻⁶ = 25,000 (turbulent flow).",
          "keywords": [
            "reynolds number",
            "laminar",
            "turbulent",
            "kinematic viscosity"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-plasma-physics",
      "number": 10,
      "title": "Plasma Physics",
      "description": "Debye screening length, electron plasma frequency, cyclotron frequency, and Alfvén speed in magnetohydrodynamics.",
      "formulas": [
        {
          "id": "he-debye-length",
          "name": "Debye Screening Length",
          "expression": "λ_D = √[ (ε₀ k_B T_e) / (n_e e²) ]",
          "latex": "\\lambda_D = \\sqrt{\\frac{\\varepsilon_0 k_B T_e}{n_e e^2}}",
          "symbols": [
            {
              "symbol": "\\lambda_D",
              "meaning": "Debye screening length",
              "unit": "metres (m)"
            },
            {
              "symbol": "T_e",
              "meaning": "Electron temperature",
              "unit": "kelvin (K)"
            },
            {
              "symbol": "n_e",
              "meaning": "Plasma electron number density",
              "unit": "m⁻³"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of free space",
              "unit": "F m⁻¹"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Characteristic spatial scale over which local electric potentials are screened out by mobile electrons in quasi-neutral plasma.",
          "conditions": "Thermal equilibrium plasma where thermal energy dominates over inter-particle potential energy.",
          "example": "For solar wind plasma (n_e ≈ 10⁷ m⁻³, T_e ≈ 10⁵ K): Debye length is λ_D ≈ 10 m.",
          "keywords": [
            "debye length",
            "plasma shielding",
            "quasi neutrality",
            "plasma physics"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-plasma-frequency-alfven",
          "name": "Plasma Frequency and Alfvén Wave Speed",
          "expression": "ω_pe = √[ (n_e e²) / (ε₀ m_e) ],   v_A = B / √(μ₀ ρ)",
          "latex": "\\omega_{pe} = \\sqrt{\\frac{n_e e^2}{\\varepsilon_0 m_e}}, \\quad v_A = \\frac{B}{\\sqrt{\\mu_0 \\rho}}",
          "symbols": [
            {
              "symbol": "\\omega_{pe}",
              "meaning": "Electron plasma oscillation frequency",
              "unit": "rad s⁻¹"
            },
            {
              "symbol": "v_A",
              "meaning": "Alfvén speed of magnetohydrodynamic wave",
              "unit": "m s⁻¹"
            },
            {
              "symbol": "B",
              "meaning": "Ambient magnetic flux density",
              "unit": "tesla (T)"
            },
            {
              "symbol": "\\rho",
              "meaning": "Mass density of plasma (ρ ≈ n_i m_i)",
              "unit": "kg m⁻³"
            }
          ],
          "siUnit": "rad s⁻¹ for ω_pe; m s⁻¹ for Alfvén speed",
          "explanation": "Plasma frequency is the natural collective oscillation frequency of electrons relative to ions. The Alfvén speed is the propagation velocity of magnetic tension waves in magnetized plasma.",
          "conditions": "Ideal magnetohydrodynamics (MHD) approximation.",
          "example": "In the solar corona where B ≈ 10⁻³ T and density is low, Alfvén speeds frequently exceed 1000 km s⁻¹.",
          "keywords": [
            "plasma frequency",
            "alfven speed",
            "magnetohydrodynamics",
            "mhd"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-astrophysics",
      "number": 11,
      "title": "Astrophysics and Cosmology",
      "description": "Stellar luminosity, distance modulus, Hubble-Lemaître law, Schwarzschild black hole radius, and stellar Stefan-Boltzmann luminosity.",
      "formulas": [
        {
          "id": "he-stellar-luminosity-flux",
          "name": "Stellar Luminosity and Radiant Flux Relation",
          "expression": "F = L / (4π d²),   L = 4π R² σ T_eff⁴",
          "latex": "F = \\frac{L}{4\\pi d^2}, \\quad L = 4\\pi R^2 \\sigma T_{\\text{eff}}^4",
          "symbols": [
            {
              "symbol": "F",
              "meaning": "Apparent radiant flux received at Earth",
              "unit": "W m⁻²"
            },
            {
              "symbol": "L",
              "meaning": "Total bolometric luminosity emitted by star",
              "unit": "watts (W)"
            },
            {
              "symbol": "d",
              "meaning": "Distance to star",
              "unit": "metres (m)"
            },
            {
              "symbol": "R",
              "meaning": "Radius of star",
              "unit": "metres (m)"
            },
            {
              "symbol": "T_{\\text{eff}}",
              "meaning": "Effective stellar surface temperature",
              "unit": "kelvin (K)"
            }
          ],
          "siUnit": "W m⁻² for flux; watts (W) for luminosity",
          "explanation": "Relates total energy radiated by a spherical star to its effective surface temperature and radius, and calculates flux diminishing by inverse square distance law.",
          "conditions": "Isotropic spherical blackbody radiation in transparent space.",
          "example": "Sun has luminosity L_Sun ≈ 3.828 × 10²⁶ W. At Earth distance (d = 1 AU ≈ 1.496 × 10¹¹ m), solar constant flux is F ≈ 1360 W m⁻².",
          "keywords": [
            "luminosity",
            "radiant flux",
            "inverse square law",
            "effective temperature",
            "stefan boltzmann"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-hubble-schwarzschild",
          "name": "Hubble’s Law and Schwarzschild Radius",
          "expression": "Hubble: v = H_0 d,   Schwarzschild Radius: r_s = (2 G M) / c²",
          "latex": "v = H_0 d, \\quad r_s = \\frac{2 G M}{c^2}",
          "symbols": [
            {
              "symbol": "v",
              "meaning": "Recession velocity of distant galaxy",
              "unit": "km s⁻¹"
            },
            {
              "symbol": "H_0",
              "meaning": "Hubble constant (≈ 70 km s⁻¹ Mpc⁻¹)",
              "unit": "km s⁻¹ Mpc⁻¹"
            },
            {
              "symbol": "d",
              "meaning": "Proper cosmological distance",
              "unit": "megaparsecs (Mpc)"
            },
            {
              "symbol": "r_s",
              "meaning": "Schwarzschild event horizon radius",
              "unit": "metres (m)"
            },
            {
              "symbol": "M",
              "meaning": "Mass of gravitating black hole",
              "unit": "kilograms (kg)"
            }
          ],
          "siUnit": "km s⁻¹ for recession velocity; metres (m) for event horizon radius",
          "explanation": "Hubble’s law quantifies universal cosmic expansion. The Schwarzschild radius defines the event horizon from within which even light cannot escape in General Relativity.",
          "conditions": "Low redshift (z ≪ 1) for Hubble law; non-rotating uncharged (Schwarzschild) black hole.",
          "example": "For Earth’s mass (M ≈ 6.0 × 10²⁴ kg), Schwarzschild radius is r_s = (2 × 6.67 × 10⁻¹¹ × 6 × 10²⁴) / (9 × 10¹⁶) ≈ 8.9 × 10⁻³ m ≈ 9 mm.",
          "keywords": [
            "hubbles law",
            "cosmic expansion",
            "schwarzschild radius",
            "event horizon",
            "black hole"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-optics-lasers",
      "number": 12,
      "title": "Optics and Laser Physics",
      "description": "Gaussian beam propagation, Rayleigh range, diffraction grating formula, Einstein A and B coefficients, and optical resonator threshold condition.",
      "formulas": [
        {
          "id": "he-gaussian-beam",
          "name": "Gaussian Laser Beam Propagation",
          "expression": "w(z) = w_0 √[ 1 + (z / z_R)² ],   z_R = (π w_0²) / λ",
          "latex": "w(z) = w_0 \\sqrt{1 + \\left(\\frac{z}{z_R}\\right)^2}, \\quad z_R = \\frac{\\pi w_0^2}{\\lambda}",
          "symbols": [
            {
              "symbol": "w(z)",
              "meaning": "Beam spot radius at axial distance z from waist",
              "unit": "metres (m)"
            },
            {
              "symbol": "w_0",
              "meaning": "Minimum beam waist radius",
              "unit": "metres (m)"
            },
            {
              "symbol": "z_R",
              "meaning": "Rayleigh range (depth of focus)",
              "unit": "metres (m)"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Laser wavelength",
              "unit": "metres (m)"
            }
          ],
          "siUnit": "metres (m)",
          "explanation": "Describes the transverse intensity profile and diffraction expansion of a fundamental TEM₀₀ laser beam propagating along optical axis z.",
          "conditions": "Paraxial propagation of fundamental spatial mode in homogeneous medium.",
          "example": "For a He-Ne laser (λ = 632.8 nm) focused to waist w_0 = 0.1 mm, the Rayleigh range is z_R = π × (10⁻⁴)² / (6.328 × 10⁻⁷) ≈ 0.0496 m ≈ 5.0 cm.",
          "keywords": [
            "gaussian beam",
            "beam waist",
            "rayleigh range",
            "laser physics",
            "tem00"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-diffraction-grating-lasers",
          "name": "Diffraction Grating and Laser Gain Threshold",
          "expression": "Grating: d sin(θ) = m λ,   Threshold Gain: γ_th = α_loss + (1 / (2L)) ln(1 / (R₁ R₂))",
          "latex": "d \\sin\\theta = m \\lambda, \\quad \\gamma_{\\text{th}} = \\alpha_{\\text{loss}} + \\frac{1}{2L}\\ln\\left( \\frac{1}{R_1 R_2} \\right)",
          "symbols": [
            {
              "symbol": "d",
              "meaning": "Grating element spacing (1 / N_lines)",
              "unit": "metres (m)"
            },
            {
              "symbol": "m",
              "meaning": "Diffraction spectrum order"
            },
            {
              "symbol": "\\gamma_{\\text{th}}",
              "meaning": "Threshold optical gain coefficient per unit length",
              "unit": "m⁻¹"
            },
            {
              "symbol": "L",
              "meaning": "Length of laser gain medium cavity",
              "unit": "metres (m)"
            },
            {
              "symbol": "R_1, R_2",
              "meaning": "Reflectivities of resonator end mirrors"
            },
            {
              "symbol": "\\alpha_{\\text{loss}}",
              "meaning": "Internal distributed cavity loss coefficient",
              "unit": "m⁻¹"
            }
          ],
          "siUnit": "m⁻¹ for threshold gain; metres for grating equation",
          "explanation": "Grating disperses multi-wavelength spectra. In a laser cavity, round-trip optical gain must exactly balance round-trip transmission and scattering losses to sustain coherent oscillation.",
          "conditions": "Steady-state single-mode or multi-mode laser oscillation.",
          "example": "A grating with 500 lines per mm has d = 1 / 500,000 = 2 × 10⁻⁶ m = 2 μm.",
          "keywords": [
            "diffraction grating",
            "laser threshold",
            "round trip gain",
            "resonator cavity"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-electronics-circuits",
      "number": 13,
      "title": "Electronics and Circuit Theory",
      "description": "RC/RL transient step response, op-amp inverting and non-inverting amplifier closed-loop gain, and active filter cutoff frequencies.",
      "formulas": [
        {
          "id": "he-rc-transient",
          "name": "RC and RL Transient Circuit Response",
          "expression": "Charging: V_C(t) = V_0 [ 1 - e^(-t / τ) ],   Discharging: V_C(t) = V_0 e^(-t / τ),   τ_RC = R C,   τ_RL = L / R",
          "latex": "V_C(t) = V_0 [1 - e^{-t / \\tau}], \\quad \\tau_{\\text{RC}} = R C, \\quad \\tau_{\\text{RL}} = \\frac{L}{R}",
          "symbols": [
            {
              "symbol": "V_C(t)",
              "meaning": "Instantaneous voltage across capacitor",
              "unit": "volts (V)"
            },
            {
              "symbol": "V_0",
              "meaning": "Source step voltage",
              "unit": "volts (V)"
            },
            {
              "symbol": "\\tau",
              "meaning": "Circuit time constant",
              "unit": "seconds (s)"
            },
            {
              "symbol": "R",
              "meaning": "Series resistance",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "farads (F)"
            },
            {
              "symbol": "L",
              "meaning": "Inductance",
              "unit": "henries (H)"
            }
          ],
          "siUnit": "seconds (s) for time constant τ",
          "explanation": "Exponential charging and discharging dynamics of energy-storage reactive components responding to a DC step voltage.",
          "conditions": "First-order linear time-invariant circuit.",
          "example": "After t = τ, a charging capacitor reaches (1 - 1/e) ≈ 63.2% of its final maximum voltage.",
          "keywords": [
            "rc transient",
            "time constant",
            "exponential charging",
            "rl circuit"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-opamp-circuits",
          "name": "Operational Amplifier Closed-Loop Gain",
          "expression": "Inverting: A_v = - R_f / R_in,    Non-Inverting: A_v = 1 + R_f / R_1",
          "latex": "A_{v,\\text{inv}} = -\\frac{R_f}{R_{\\text{in}}}, \\quad A_{v,\\text{non-inv}} = 1 + \\frac{R_f}{R_1}",
          "symbols": [
            {
              "symbol": "A_v",
              "meaning": "Closed-loop voltage amplification gain (V_out / V_in)"
            },
            {
              "symbol": "R_f",
              "meaning": "Feedback resistor connected from output to inverting terminal",
              "unit": "ohms (Ω)"
            },
            {
              "symbol": "R_{\\text{in}}, R_1",
              "meaning": "Input resistor",
              "unit": "ohms (Ω)"
            }
          ],
          "siUnit": "Dimensionless voltage gain",
          "explanation": "Assuming an ideal op-amp (infinite open-loop gain, infinite input impedance, virtual ground at inverting node: V₊ ≈ V₋), closed-loop gain depends solely on external feedback resistors.",
          "conditions": "Negative feedback configuration with op-amp operating in its linear range.",
          "example": "An inverting amplifier with R_in = 10 kΩ and R_f = 100 kΩ produces closed-loop voltage gain A_v = -100 / 10 = -10 (180° phase inversion).",
          "keywords": [
            "opamp",
            "inverting amplifier",
            "non inverting",
            "virtual ground",
            "feedback"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    },
    {
      "id": "he-dimensional-error",
      "number": 14,
      "title": "Dimensional Analysis and Error Analysis",
      "description": "Dimensional homogeneity principle, propagation of independent errors in quadrature, Gaussian uncertainty, and significant figures.",
      "formulas": [
        {
          "id": "he-error-quadrature",
          "name": "Error Propagation in Quadrature (Independent Random Errors)",
          "expression": "σ_f² = ∑ [ (∂f / ∂x_i)² σ_{x_i}² ],   For Z = A^a B^b: (σ_Z / Z)² = a² (σ_A / A)² + b² (σ_B / B)²",
          "latex": "\\sigma_f^2 = \\sum_{i} \\left( \\frac{\\partial f}{\\partial x_i} \\right)^2 \\sigma_{x_i}^2, \\quad \\left( \\frac{\\sigma_Z}{Z} \\right)^2 = a^2 \\left( \\frac{\\sigma_A}{A} \\right)^2 + b^2 \\left( \\frac{\\sigma_B}{B} \\right)^2",
          "symbols": [
            {
              "symbol": "\\sigma_f",
              "meaning": "Total propagated standard uncertainty in computed quantity f"
            },
            {
              "symbol": "\\sigma_{x_i}",
              "meaning": "Standard uncertainties in independent experimental parameters x_i"
            },
            {
              "symbol": "\\partial f/\\partial x_i",
              "meaning": "Partial derivative sensitivity coefficients"
            }
          ],
          "siUnit": "Same unit as quantity f",
          "explanation": "Standard Gaussian method for propagating independent, uncorrelated random experimental uncertainties via first-order Taylor expansion.",
          "conditions": "Small, uncorrelated random errors obeying normal Gaussian distributions.",
          "example": "For kinetic energy K = 0.5 m v² with 1% error in m and 2% error in v: relative error is √[ (1%)² + (2 × 2%)² ] = √[ 1 + 16 ]% = √17% ≈ 4.12%.",
          "keywords": [
            "quadrature",
            "error propagation",
            "standard uncertainty",
            "partial derivatives"
          ],
          "difficulty": "advanced",
          "status": "verified"
        },
        {
          "id": "he-dimensional-homogeneity",
          "name": "Principle of Dimensional Homogeneity",
          "expression": "[LHS] = [RHS] = M^a L^b T^c I^d Θ^e N^f J^g",
          "latex": "[\\text{LHS}] = [\\text{RHS}] = M^a L^b T^c I^d \\Theta^e N^f J^g",
          "symbols": [
            {
              "symbol": "M, L, T, I, \\Theta, N, J",
              "meaning": "Seven fundamental base dimensional dimensions (mass, length, time, electric current, temperature, amount of substance, luminous intensity)"
            }
          ],
          "siUnit": "Dimensional analysis formulation",
          "explanation": "Every physically meaningful equation must be dimensionally homogeneous: terms added or equated on both sides must share identical dimensional powers.",
          "conditions": "Universal consistency rule for physical relationships.",
          "example": "Testing period of pendulum T = 2π √(L/g): [√(L/g)] = [L / (L T⁻²)]^(1/2) = [T²]^(1/2) = T, verifying dimensional validity.",
          "keywords": [
            "dimensional homogeneity",
            "dimensions",
            "buckingham pi",
            "consistency check"
          ],
          "difficulty": "advanced",
          "status": "verified"
        }
      ]
    }
  ]
};
