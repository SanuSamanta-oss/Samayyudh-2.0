import type { AcademicLevel } from '@/types/formulas';

export const division2Calculus: AcademicLevel = {
  id: 'math-div-2',
  title: 'Differential and Integral Calculus',
  shortTitle: 'Calculus',
  description: 'Infinitesimal analysis: limits, continuity, differential operator rules, definite/indefinite integrations, fundamental theorems, and differential equations.',
  levelOrder: 2,
  chapters: [
    {
      id: 'm2-limits-continuity',
      number: 1,
      title: 'Limits and Continuity',
      description: 'Foundations of real analysis, one-sided limits, epsilon-delta definitions, fundamental trigonometric and exponential limits, and conditions for continuity.',
      formulas: [
        {
          id: 'm-lim-general-definition',
          name: 'Two-Sided Limit of a Function',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Limit Definition',
          expression: 'lim_{x -> a} f(x) = L',
          latex: '\\lim_{x\\to a}f(x)=L',
          symbols: [
            { symbol: 'L', meaning: 'The finite limit value as x approaches a' },
            { symbol: 'a', meaning: 'Point of approach on the real axis' },
            { symbol: 'f(x)', meaning: 'Evaluated function' }
          ],
          explanation: 'States that f(x) can be made arbitrarily close to L by choosing x sufficiently close to a (with x ≠ a).',
          conditions: 'Exists if and only if both left-hand and right-hand limits exist and are equal: lim_{x->a^-} f(x) = lim_{x->a^+} f(x) = L.',
          keywords: ['limit', 'two sided limit', 'calculus', 'real analysis'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-lim-left-hand',
          name: 'Left-Hand Limit (LHL)',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'One-Sided Limits',
          expression: 'lim_{x -> a^-} f(x)',
          latex: '\\lim_{x\\to a^-}f(x)',
          symbols: [
            { symbol: 'a^-', meaning: 'Approach to a from values strictly strictly less than a (x < a)' },
            { symbol: 'f(x)', meaning: 'Function' }
          ],
          explanation: 'The limiting value of f(x) as x approaches a from the left (x = a - h, h → 0+). Essential for analyzing jump discontinuities.',
          conditions: 'Domain of f must include values to the left of a.',
          keywords: ['left hand limit', 'LHL', 'one sided limit'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-lim-right-hand',
          name: 'Right-Hand Limit (RHL)',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'One-Sided Limits',
          expression: 'lim_{x -> a^+} f(x)',
          latex: '\\lim_{x\\to a^+}f(x)',
          symbols: [
            { symbol: 'a^+', meaning: 'Approach to a from values strictly greater than a (x > a)' },
            { symbol: 'f(x)', meaning: 'Function' }
          ],
          explanation: 'The limiting value of f(x) as x approaches a from the right (x = a + h, h → 0+).',
          conditions: 'Domain of f must include values to the right of a.',
          keywords: ['right hand limit', 'RHL', 'one sided limit'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-lim-continuity-at-a',
          name: 'Continuity Criterion at a Point',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Continuity',
          expression: 'lim_{x -> a} f(x) = f(a)',
          latex: '\\lim_{x\\to a}f(x)=f(a)',
          symbols: [
            { symbol: 'f(a)', meaning: 'Value of function defined at x = a' },
            { symbol: '\\lim_{x\\to a}f(x)', meaning: 'Two-sided limit of f(x) as x approaches a' }
          ],
          explanation: 'A function is continuous at x = a if f(a) is defined, the limit as x → a exists, and the limit matches f(a) exactly (LHL = RHL = f(a)).',
          conditions: 'x = a must belong to the domain of f(x).',
          keywords: ['continuity', 'continuous function', 'LHL RHL value'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-lim-sine-limit',
          name: 'Standard Trigonometric Sine Limit',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Standard Limits',
          expression: 'lim_{x -> 0} (sin x / x) = 1',
          latex: '\\lim_{x\\to 0}\\frac{\\sin x}{x}=1',
          symbols: [
            { symbol: 'x', meaning: 'Angle in radians' }
          ],
          explanation: 'Fundamental standard limit proved via the Squeeze (Sandwich) theorem; forms the bedrock for differentiating trigonometric functions.',
          conditions: 'x must be measured in radians. At x = 0, forms a 0/0 indeterminate form resolved to 1.',
          keywords: ['sin x / x', 'trigonometric limit', 'standard limit', 'squeeze theorem'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-lim-tan-limit',
          name: 'Standard Trigonometric Tangent Limit',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Standard Limits',
          expression: 'lim_{x -> 0} (tan x / x) = 1',
          latex: '\\lim_{x\\to 0}\\frac{\\tan x}{x}=1',
          symbols: [
            { symbol: 'x', meaning: 'Angle in radians' }
          ],
          explanation: 'Standard limit derived from (sin x / x) · (1 / cos x) = 1 · 1 = 1 as x → 0.',
          conditions: 'x in radians, x ≠ π/2 + kπ.',
          keywords: ['tan x / x', 'tangent limit', 'standard limit'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-lim-exp-limit',
          name: 'Standard Exponential Limit',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Standard Limits',
          expression: 'lim_{x -> 0} ((e^x - 1) / x) = 1',
          latex: '\\lim_{x\\to 0}\\frac{e^x-1}{x}=1',
          symbols: [
            { symbol: 'e', meaning: 'Base of the natural logarithm (Euler\'s number ≈ 2.71828)' },
            { symbol: 'x', meaning: 'Independent real variable approaching 0' }
          ],
          explanation: 'Standard indeterminate 0/0 limit representing the derivative of the exponential function e^x at x = 0.',
          conditions: 'Generalizes to lim_{x->0} (a^x - 1)/x = ln(a) for a > 0.',
          keywords: ['exponential limit', 'e^x - 1 / x', 'natural base limit'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-lim-log-limit',
          name: 'Standard Logarithmic Limit',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Standard Limits',
          expression: 'lim_{x -> 0} (ln(1 + x) / x) = 1',
          latex: '\\lim_{x\\to 0}\\frac{\\ln(1+x)}{x}=1',
          symbols: [
            { symbol: '\\ln', meaning: 'Natural logarithm (base e)' },
            { symbol: 'x', meaning: 'Real variable approaching 0' }
          ],
          explanation: 'Standard limit derived from the Taylor series ln(1+x) = x - x^2/2 + ... or as the derivative of ln(x) at x = 1.',
          conditions: 'x > -1.',
          keywords: ['logarithmic limit', 'ln(1+x)/x', 'natural log'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-lim-def-of-e',
          name: 'Limit Definition of Euler\'s Number e',
          subject: 'mathematics',
          chapter: 'Limits and Continuity',
          topic: 'Standard Limits',
          expression: 'lim_{x -> ∞} (1 + 1/x)^x = e',
          latex: '\\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x=e',
          alternateLatex: ['\\lim_{t\\to 0}(1+t)^{1/t}=e'],
          symbols: [
            { symbol: 'e', meaning: 'Euler\'s number (constant e ≈ 2.718281828...)' },
            { symbol: 'x', meaning: 'Variable growing without bound (x → ∞)' }
          ],
          explanation: 'Canonical definition of the constant e as continuous compound growth over time; forms a 1^∞ indeterminate form.',
          conditions: 'In equivalent form: lim_{t->0} (1 + t)^(1/t) = e.',
          keywords: ['definition of e', 'compound interest', 'euler number', '1 to infinity'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm2-derivatives-chain-rule',
      number: 2,
      title: 'Derivatives and Chain Rule',
      description: 'First principles, power rule, product, quotient, and chain rules, trigonometric and transcendental derivatives, and higher-order derivatives.',
      formulas: [
        {
          id: 'm-der-first-principles',
          name: 'Definition of Derivative from First Principles',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Foundations',
          expression: 'f\'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h',
          latex: 'f\'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}',
          symbols: [
            { symbol: 'f\'(x)', meaning: 'Instantaneous rate of change / derivative of f at x' },
            { symbol: 'h', meaning: 'Infinitesimal increment in independent variable x (Δx)' },
            { symbol: 'f(x+h) - f(x)', meaning: 'Increment in function value (Δy)' }
          ],
          explanation: 'The limit of the difference quotient representing the instantaneous slope of the tangent line to the curve y = f(x).',
          conditions: 'Function is differentiable at x if this two-sided limit exists finitely.',
          keywords: ['derivative', 'first principles', 'slope of tangent', 'difference quotient'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-power-rule',
          name: 'Power Rule of Differentiation',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Elementary Rules',
          expression: 'd/dx (x^n) = n x^(n-1)',
          latex: '\\frac{d}{dx}(x^n)=nx^{n-1}',
          symbols: [
            { symbol: 'n', meaning: 'Any constant real exponent (n ∈ ℝ)' },
            { symbol: 'x', meaning: 'Variable with x > 0 when n is non-integer' }
          ],
          explanation: 'Fundamental differentiation rule stating that the derivative of a monomial power multiplies by the exponent and reduces the power by 1.',
          conditions: 'Valid for all real n (for negative or rational powers, restricted to valid domains of x).',
          keywords: ['power rule', 'derivative of x^n', 'polynomial derivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-product-rule',
          name: 'Product Rule (Leibniz Rule)',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Combination Rules',
          expression: 'd/dx (uv) = u\'v + uv\'',
          latex: '\\frac{d}{dx}(uv)=u\'v+uv\'',
          symbols: [
            { symbol: 'u, v', meaning: 'Differentiable functions of x' },
            { symbol: 'u\', v\'', meaning: 'First derivatives du/dx and dv/dx' }
          ],
          explanation: 'Calculates the derivative of a product of two differentiable functions: the derivative of the first times the second plus the first times the derivative of the second.',
          conditions: 'Both u(x) and v(x) must be differentiable at x.',
          keywords: ['product rule', 'leibniz rule', 'derivative product'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-quotient-rule',
          name: 'Quotient Rule of Differentiation',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Combination Rules',
          expression: 'd/dx (u/v) = (v u\' - u v\') / v^2',
          latex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right)=\\frac{vu\'-uv\'}{v^2}',
          symbols: [
            { symbol: 'u', meaning: 'Numerator function' },
            { symbol: 'v', meaning: 'Denominator function' },
            { symbol: 'v^2', meaning: 'Square of denominator function' }
          ],
          explanation: 'Gives the derivative of the ratio of two functions: denominator times derivative of numerator minus numerator times derivative of denominator, all divided by denominator squared.',
          conditions: 'v(x) ≠ 0 and both u and v differentiable at x.',
          keywords: ['quotient rule', 'fraction derivative', 'rational function'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-chain-rule',
          name: 'Chain Rule for Composite Functions',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Composite Functions',
          expression: 'dy/dx = (dy/du) · (du/dx)',
          latex: '\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}',
          symbols: [
            { symbol: 'y = f(u)', meaning: 'Outer function dependent on intermediate variable u' },
            { symbol: 'u = g(x)', meaning: 'Inner function dependent on variable x' }
          ],
          explanation: 'Essential formula for differentiating composite functions y = f(g(x)), multiplying the derivative of the outer function by the derivative of the inner function.',
          conditions: 'g differentiable at x, and f differentiable at g(x).',
          keywords: ['chain rule', 'composite function', 'intermediate variable'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-der-exp',
          name: 'Derivative of Natural Exponential Function',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Transcendental Derivatives',
          expression: 'd/dx (e^x) = e^x',
          latex: '\\frac{d}{dx}(e^x)=e^x',
          symbols: [
            { symbol: 'e^x', meaning: 'Natural exponential function' }
          ],
          explanation: 'The natural exponential is unique because it is its own derivative at every point on the real line.',
          conditions: 'Valid for all x ∈ ℝ.',
          keywords: ['derivative of e^x', 'exponential derivative', 'natural exponential'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-log',
          name: 'Derivative of Natural Logarithm',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Transcendental Derivatives',
          expression: 'd/dx (ln x) = 1/x',
          latex: '\\frac{d}{dx}(\\ln x)=\\frac{1}{x}',
          symbols: [
            { symbol: '\\ln x', meaning: 'Natural logarithm (log base e)' }
          ],
          explanation: 'The derivative of the natural log function is the reciprocal function 1/x. For composite functions: d/dx [ln|u|] = u\'/u.',
          conditions: 'x > 0 (or x ≠ 0 for ln|x|).',
          keywords: ['derivative of ln x', 'reciprocal', 'logarithmic derivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-sin',
          name: 'Derivative of Sine Function',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Trigonometric Derivatives',
          expression: 'd/dx (sin x) = cos x',
          latex: '\\frac{d}{dx}(\\sin x)=\\cos x',
          symbols: [
            { symbol: 'x', meaning: 'Angle in radians' }
          ],
          explanation: 'The instantaneous rate of change of sin(x) produces the cosine function cos(x), with slope 1 at the origin.',
          conditions: 'x must be in radians.',
          keywords: ['derivative of sin', 'sine derivative', 'trigonometric derivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-cos',
          name: 'Derivative of Cosine Function',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Trigonometric Derivatives',
          expression: 'd/dx (cos x) = -sin x',
          latex: '\\frac{d}{dx}(\\cos x)=-\\sin x',
          symbols: [
            { symbol: 'x', meaning: 'Angle in radians' }
          ],
          explanation: 'The derivative of the cosine function is the negative sine function, reflecting the decreasing nature of cosine in [0, π].',
          conditions: 'x in radians.',
          keywords: ['derivative of cos', 'negative sine', 'cosine derivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-tan',
          name: 'Derivative of Tangent Function',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Trigonometric Derivatives',
          expression: 'd/dx (tan x) = sec^2 x',
          latex: '\\frac{d}{dx}(\\tan x)=\\sec^2 x',
          symbols: [
            { symbol: '\\sec^2 x', meaning: 'Square of the secant function: 1 / cos^2(x)' }
          ],
          explanation: 'Derived via quotient rule on sin(x)/cos(x); since sec^2(x) ≥ 1, tan(x) is strictly increasing across every interval of its domain.',
          conditions: 'x ≠ π/2 + kπ (where cos x ≠ 0).',
          keywords: ['derivative of tan', 'secant squared', 'tangent derivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-der-arcsin',
          name: 'Derivative of Inverse Sine (arcsin)',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Inverse Trigonometric Derivatives',
          expression: 'd/dx (sin^(-1) x) = 1 / √(1 - x^2)',
          latex: '\\frac{d}{dx}(\\sin^{-1}x)=\\frac{1}{\\sqrt{1-x^2}}',
          symbols: [
            { symbol: '\\sin^{-1}x', meaning: 'Principal branch of inverse sine with range [-π/2, π/2]' },
            { symbol: 'x', meaning: 'Input argument in open interval (-1, 1)' }
          ],
          explanation: 'Rate of change of the angle whose sine is x, derived via implicit differentiation on sin(y) = x.',
          conditions: '-1 < x < 1 (derivative has vertical asymptotes at x = ±1).',
          keywords: ['derivative of arcsin', 'inverse sine derivative', 'root 1 - x^2'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-der-arccos',
          name: 'Derivative of Inverse Cosine (arccos)',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Inverse Trigonometric Derivatives',
          expression: 'd/dx (cos^(-1) x) = -1 / √(1 - x^2)',
          latex: '\\frac{d}{dx}(\\cos^{-1}x)=-\\frac{1}{\\sqrt{1-x^2}}',
          symbols: [
            { symbol: '\\cos^{-1}x', meaning: 'Principal branch of inverse cosine with range [0, π]' }
          ],
          explanation: 'Rate of change of the angle whose cosine is x; exact opposite of arcsin derivative because arcsin(x) + arccos(x) = π/2.',
          conditions: '-1 < x < 1.',
          keywords: ['derivative of arccos', 'inverse cosine derivative'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-der-second-derivative',
          name: 'Second Derivative Definition',
          subject: 'mathematics',
          chapter: 'Derivatives and Chain Rule',
          topic: 'Higher Order Derivatives',
          expression: 'd^2y / dx^2 = d/dx (dy/dx)',
          latex: '\\frac{d^2y}{dx^2}=\\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)',
          symbols: [
            { symbol: '\\frac{d^2y}{dx^2}', meaning: 'Second derivative (acceleration, concavity/curvature)' },
            { symbol: '\\frac{dy}{dx}', meaning: 'First derivative (velocity, slope)' }
          ],
          explanation: 'Measures the rate of change of the first derivative; determines curvature and concavity (concave up if y\'\' > 0, concave down if y\'\' < 0) and inflections.',
          conditions: 'First derivative must be differentiable.',
          keywords: ['second derivative', 'concavity', 'inflection point', 'acceleration'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm2-integrals',
      number: 3,
      title: 'Definite and Indefinite Integrals',
      description: 'Antiderivatives, standard integral formulas, Fundamental Theorem of Calculus, integration by parts, substitution, and parity symmetry properties.',
      formulas: [
        {
          id: 'm-int-power-rule',
          name: 'Power Rule for Indefinite Integration',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Elementary Integrals',
          expression: '∫ x^n dx = (x^(n+1))/(n + 1) + C, n ≠ -1',
          latex: '\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C,\\quad n\\neq -1',
          symbols: [
            { symbol: 'n', meaning: 'Constant real power other than -1' },
            { symbol: 'C', meaning: 'Arbitrary constant of integration' }
          ],
          explanation: 'Fundamental antiderivative formula for power functions; inverses the power rule of differentiation.',
          conditions: 'n ≠ -1 (the case n = -1 yields the natural logarithm).',
          keywords: ['integral x^n', 'power rule integration', 'antiderivative'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-reciprocal',
          name: 'Reciprocal Function Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Elementary Integrals',
          expression: '∫ (1/x) dx = ln|x| + C',
          latex: '\\int\\frac{1}{x}\\,dx=\\ln|x|+C',
          symbols: [
            { symbol: '\\ln|x|', meaning: 'Natural logarithm of the absolute value of x' },
            { symbol: 'C', meaning: 'Constant of integration' }
          ],
          explanation: 'Fills the singularity gap in the power rule at n = -1. The absolute value ensures real validity for both x > 0 and x < 0.',
          conditions: 'x ≠ 0.',
          keywords: ['integral 1/x', 'reciprocal integral', 'natural log integral'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-exponential',
          name: 'Exponential Function Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Elementary Integrals',
          expression: '∫ e^x dx = e^x + C',
          latex: '\\int e^x\\,dx=e^x+C',
          symbols: [
            { symbol: 'e^x', meaning: 'Natural exponential function' },
            { symbol: 'C', meaning: 'Constant of integration' }
          ],
          explanation: 'The natural exponential function is invariant under integration as well as differentiation.',
          conditions: 'Generalizes to ∫ a^x dx = a^x / ln(a) + C for a > 0, a ≠ 1.',
          keywords: ['integral e^x', 'exponential integral'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-sine',
          name: 'Sine Function Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Trigonometric Integrals',
          expression: '∫ sin x dx = -cos x + C',
          latex: '\\int\\sin x\\,dx=-\\cos x+C',
          symbols: [
            { symbol: '-\\cos x', meaning: 'Negative cosine antiderivative' },
            { symbol: 'C', meaning: 'Integration constant' }
          ],
          explanation: 'Antiderivative of the sine function; note the negative sign because d/dx (-cos x) = sin x.',
          conditions: 'x in radians.',
          keywords: ['integral sin x', 'sine integral', 'trig integral'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-cosine',
          name: 'Cosine Function Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Trigonometric Integrals',
          expression: '∫ cos x dx = sin x + C',
          latex: '\\int\\cos x\\,dx=\\sin x+C',
          symbols: [
            { symbol: '\\sin x', meaning: 'Sine antiderivative' },
            { symbol: 'C', meaning: 'Integration constant' }
          ],
          explanation: 'Direct antiderivative of the cosine function with positive sign.',
          conditions: 'x in radians.',
          keywords: ['integral cos x', 'cosine integral'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-secant-squared',
          name: 'Secant-Squared Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Trigonometric Integrals',
          expression: '∫ sec^2 x dx = tan x + C',
          latex: '\\int\\sec^2 x\\,dx=\\tan x+C',
          symbols: [
            { symbol: '\\tan x', meaning: 'Tangent function' },
            { symbol: 'C', meaning: 'Integration constant' }
          ],
          explanation: 'Direct inversion of the derivative d/dx (tan x) = sec^2 x.',
          conditions: 'x ≠ π/2 + kπ.',
          keywords: ['integral sec^2 x', 'tan x integral', 'secant squared'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-cosecant-squared',
          name: 'Cosecant-Squared Integral',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Trigonometric Integrals',
          expression: '∫ csc^2 x dx = -cot x + C',
          latex: '\\int\\csc^2 x\\,dx=-\\cot x+C',
          symbols: [
            { symbol: '-\\cot x', meaning: 'Negative cotangent function' },
            { symbol: 'C', meaning: 'Integration constant' }
          ],
          explanation: 'Direct inversion of the derivative d/dx (cot x) = -csc^2 x.',
          conditions: 'x ≠ kπ.',
          keywords: ['integral csc^2 x', 'cotangent integral'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-int-standard-rational',
          name: 'Standard Rational Integral (Inverse Tangent Form)',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Rational Function Integrals',
          expression: '∫ dx / (a^2 + x^2) = (1/a) tan^(-1)(x/a) + C, a > 0',
          latex: '\\int\\frac{dx}{a^2+x^2}=\\frac{1}{a}\\tan^{-1}\\left(\\frac{x}{a}\\right)+C,\\quad a>0',
          symbols: [
            { symbol: 'a', meaning: 'Positive constant parameter (a > 0)' },
            { symbol: '\\tan^{-1}(x/a)', meaning: 'Arctangent function' },
            { symbol: 'C', meaning: 'Integration constant' }
          ],
          explanation: 'Standard foundational integral occurring widely in partial fractions and harmonic problems; scaled arctangent derivative.',
          conditions: 'a > 0.',
          keywords: ['arctan integral', '1 / (a^2 + x^2)', 'rational integral'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-int-ftc',
          name: 'Fundamental Theorem of Calculus (Definite Integral)',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Definite Integrals',
          expression: '∫_a^b f(x) dx = F(b) - F(a)',
          latex: '\\int_a^b f(x)\\,dx=F(b)-F(a)',
          symbols: [
            { symbol: 'F(x)', meaning: 'Antiderivative of f(x) such that F\'(x) = f(x)' },
            { symbol: 'a, b', meaning: 'Lower and upper integration limits' }
          ],
          explanation: 'Newton-Leibniz formula connecting integration to differentiation, computing exact net accumulation and signed area under a curve.',
          conditions: 'f(x) must be continuous on the closed interval [a, b].',
          keywords: ['fundamental theorem of calculus', 'FTC', 'definite integral', 'area under curve'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-int-by-parts',
          name: 'Integration by Parts Formula',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Integration Techniques',
          expression: '∫ u dv = uv - ∫ v du',
          latex: '\\int u\\,dv=uv-\\int v\\,du',
          symbols: [
            { symbol: 'u, v', meaning: 'Differentiable functions of x' },
            { symbol: 'du, dv', meaning: 'Differentials: du = u\'(x) dx and dv = v\'(x) dx' }
          ],
          explanation: 'Inversion of the product rule of differentiation, chosen strategically via priority order ILATE (Inverse, Logarithmic, Algebraic, Trigonometric, Exponential).',
          conditions: 'u and v must be continuously differentiable.',
          keywords: ['integration by parts', 'uv - int v du', 'ILATE rule'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-int-substitution',
          name: 'Integration by Substitution (u-Substitution)',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Integration Techniques',
          expression: '∫ f(g(x)) g\'(x) dx = ∫ f(u) du',
          latex: '\\int f(g(x))g\'(x)\\,dx=\\int f(u)\\,du',
          symbols: [
            { symbol: 'u = g(x)', meaning: 'Substituted inner variable' },
            { symbol: 'du = g\'(x) dx', meaning: 'Differential element' }
          ],
          explanation: 'Inversion of the chain rule; transforms a complicated integral into a simpler canonical form through variable change.',
          conditions: 'g must be continuously differentiable; for definite integrals limits must transform: g(a) to g(b).',
          keywords: ['substitution', 'u-sub', 'change of variable'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-int-even-symmetry',
          name: 'Definite Integral Symmetry for Even Functions',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Symmetry Properties',
          expression: '∫_{-a}^a f(x) dx = 2 ∫_0^a f(x) dx',
          latex: '\\int_{-a}^{a}f(x)\\,dx=2\\int_0^a f(x)\\,dx',
          symbols: [
            { symbol: 'f(x)', meaning: 'Even function satisfying f(-x) = f(x)' },
            { symbol: '[-a, a]', meaning: 'Symmetric interval about origin' }
          ],
          explanation: 'Since an even function has y-axis reflectional symmetry, the area on [-a, 0] equals the area on [0, a], doubling the integral.',
          conditions: 'f(-x) = f(x) for all x ∈ [-a, a].',
          keywords: ['even function', 'symmetric limits', 'definite integral property'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-int-odd-symmetry',
          name: 'Definite Integral Symmetry for Odd Functions',
          subject: 'mathematics',
          chapter: 'Definite and Indefinite Integrals',
          topic: 'Symmetry Properties',
          expression: '∫_{-a}^a f(x) dx = 0',
          latex: '\\int_{-a}^{a}f(x)\\,dx=0',
          symbols: [
            { symbol: 'f(x)', meaning: 'Odd function satisfying f(-x) = -f(x)' },
            { symbol: '[-a, a]', meaning: 'Symmetric interval about origin' }
          ],
          explanation: 'Because an odd function has origin point-symmetry, the signed area on [-a, 0] is the exact negative of the area on [0, a], cancelling to zero.',
          conditions: 'f(-x) = -f(x) for all x ∈ [-a, a].',
          keywords: ['odd function', 'zero integral', 'symmetric limits'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm2-differential-equations',
      number: 4,
      title: 'Differential Equations',
      description: 'First-order separable, linear, and homogeneous differential equations, integrating factors, second-order linear ODEs, and auxiliary characteristic roots.',
      formulas: [
        {
          id: 'm-ode-general-first-order',
          name: 'General Form of First-Order Ordinary Differential Equation',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'First-Order ODEs',
          expression: 'dy/dx = f(x, y)',
          latex: '\\frac{dy}{dx}=f(x,y)',
          symbols: [
            { symbol: 'dy/dx', meaning: 'First derivative (slope field at point (x, y))' },
            { symbol: 'f(x, y)', meaning: 'Given bivariate continuous function' }
          ],
          explanation: 'The explicit standard representation of an ordinary first-order differential equation specifying the slope at every point in the plane.',
          conditions: 'Picard-Lindelöf theorem guarantees a unique local solution through (x₀, y₀) if f and ∂f/∂y are continuous.',
          keywords: ['first order ODE', 'differential equation', 'slope field'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-separable',
          name: 'Variable Separable Form',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Analytical Solutions',
          expression: 'dy / g(y) = f(x) dx',
          latex: '\\frac{dy}{g(y)}=f(x)\\,dx',
          symbols: [
            { symbol: 'g(y)', meaning: 'Function depending solely on y (g(y) ≠ 0)' },
            { symbol: 'f(x)', meaning: 'Function depending solely on x' }
          ],
          explanation: 'Method where terms containing y and terms containing x are segregated to opposite sides of the equality, solved directly by integrating both sides: ∫ dy/g(y) = ∫ f(x) dx + C.',
          conditions: 'g(y) ≠ 0 (values where g(y) = 0 correspond to singular/equilibrium solutions).',
          keywords: ['variable separable', 'separable ODE', 'separation of variables'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-first-order-linear',
          name: 'First-Order Linear Differential Equation (Leibniz Form)',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Linear ODEs',
          expression: 'dy/dx + P(x)y = Q(x)',
          latex: '\\frac{dy}{dx}+P(x)y=Q(x)',
          symbols: [
            { symbol: 'P(x)', meaning: 'Continuous coefficient function of x' },
            { symbol: 'Q(x)', meaning: 'Continuous non-homogeneous forcing term of x' },
            { symbol: 'y', meaning: 'Dependent variable appearing linearly with exponent 1' }
          ],
          explanation: 'The standard canonical form of a first-order linear ODE solved by multiplying through by the integrating factor e^(∫ P dx).',
          conditions: 'P(x) and Q(x) must be continuous on the interval of interest.',
          keywords: ['linear differential equation', 'leibniz ODE', 'dy/dx + Py = Q'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-integrating-factor',
          name: 'Integrating Factor for Linear ODE',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Linear ODEs',
          expression: 'IF = e^(∫ P(x) dx)',
          latex: 'IF=e^{\\int P(x)\\,dx}',
          symbols: [
            { symbol: 'IF', meaning: 'Integrating Factor (μ(x))' },
            { symbol: 'P(x)', meaning: 'Coefficient of linear term y' }
          ],
          explanation: 'Multiplier that collapses the left side of dy/dx + P(x)y = Q(x) into the exact product derivative: d/dx [y · IF].',
          conditions: 'P(x) integrable over domain.',
          keywords: ['integrating factor', 'IF', 'e^int P dx'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-linear-solution',
          name: 'General Solution of First-Order Linear ODE',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Linear ODEs',
          expression: 'y(IF) = ∫ Q(x)(IF) dx + C',
          latex: 'y(IF)=\\int Q(x)(IF)\\,dx+C',
          symbols: [
            { symbol: 'y(IF)', meaning: 'Product of dependent variable y and integrating factor' },
            { symbol: 'Q(x)(IF)', meaning: 'Integrand on the right-hand side' },
            { symbol: 'C', meaning: 'Arbitrary constant of integration' }
          ],
          explanation: 'Explicit general solution formula for any first-order linear differential equation obtained after multiplying by IF and integrating.',
          conditions: 'Dividing by IF gives y explicitly: y = (1/IF) [∫ Q(x)(IF) dx + C].',
          keywords: ['linear ODE solution', 'general solution', 'integrating factor method'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-homogeneous',
          name: 'First-Order Homogeneous Differential Equation',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Homogeneous ODEs',
          expression: 'dy/dx = F(y/x)',
          latex: '\\frac{dy}{dx}=F\\left(\\frac{y}{x}\\right)',
          symbols: [
            { symbol: 'y/x', meaning: 'Ratio variable v = y/x' },
            { symbol: 'F', meaning: 'Function depending only on the ratio y/x' }
          ],
          explanation: 'Homogeneous equation where both numerator and denominator in dy/dx = f(x, y) have identical homogeneous degree; solved by the substitution y = vx so dy/dx = v + x(dv/dx).',
          conditions: 'x ≠ 0.',
          keywords: ['homogeneous ODE', 'y = vx substitution', 'ratio y/x'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-ode-second-order-homogeneous',
          name: 'Second-Order Linear Homogeneous ODE with Constant Coefficients',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Higher-Order ODEs',
          expression: 'a (d^2y/dx^2) + b (dy/dx) + cy = 0',
          latex: 'a\\frac{d^2y}{dx^2}+b\\frac{dy}{dx}+cy=0',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Real constant coefficients (a ≠ 0)' },
            { symbol: 'd^2y/dx^2', meaning: 'Second derivative' }
          ],
          explanation: 'Canonical differential equation governing free harmonic oscillations, electrical RLC circuits, and damped vibrations.',
          conditions: 'a ≠ 0. Solved via trial solution y = e^(mx).',
          keywords: ['second order ODE', 'constant coefficients', 'homogeneous second order', 'harmonic oscillator'],
          difficulty: 'advanced',
          status: 'verified'
        },
        {
          id: 'm-ode-auxiliary-equation',
          name: 'Auxiliary (Characteristic) Equation of Second-Order ODE',
          subject: 'mathematics',
          chapter: 'Differential Equations',
          topic: 'Higher-Order ODEs',
          expression: 'am^2 + bm + c = 0',
          latex: 'am^2+bm+c=0',
          symbols: [
            { symbol: 'm', meaning: 'Roots of characteristic polynomial' },
            { symbol: 'a, b, c', meaning: 'Coefficients matching the ODE' }
          ],
          explanation: 'Algebraic quadratic whose roots m_1, m_2 determine the basis solutions: real distinct (y = c_1 e^(m_1 x) + c_2 e^(m_2 x)), real repeated (y = (c_1 + c_2 x)e^(mx)), or complex conjugates (y = e^(αx)(c_1 cos βx + c_2 sin βx)).',
          conditions: 'Roots classified by discriminant b^2 - 4ac.',
          keywords: ['auxiliary equation', 'characteristic equation', 'characteristic roots'],
          difficulty: 'advanced',
          status: 'verified'
        }
      ]
    }
  ]
};

