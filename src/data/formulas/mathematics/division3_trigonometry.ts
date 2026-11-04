import type { AcademicLevel } from '@/types/formulas';

export const division3Trigonometry: AcademicLevel = {
  id: 'math-div-3',
  title: 'Trigonometry and Inverse Functions',
  shortTitle: 'Trigonometry',
  description: 'Circular functions, Pythagorean identities, compound angles, multiple & submultiple angle formulas, transformation identities, and inverse trigonometric functions.',
  levelOrder: 3,
  chapters: [
    {
      id: 'm3-ratios-identities',
      number: 1,
      title: 'Trigonometric Ratios and Identities',
      description: 'Right triangle ratios, reciprocal relations, Pythagorean identities, and basic double-angle formulations.',
      formulas: [
        {
          id: 'm-trig-sine-ratio',
          name: 'Sine Ratio Definition',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Right Triangle Ratios',
          expression: 'sin θ = opposite / hypotenuse',
          latex: '\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}',
          symbols: [
            { symbol: '\\theta', meaning: 'Acute angle in a right triangle' },
            { symbol: '\\text{opposite}', meaning: 'Length of leg opposite to angle θ' },
            { symbol: '\\text{hypotenuse}', meaning: 'Length of the hypotenuse' }
          ],
          explanation: 'Fundamental trigonometric ratio representing the vertical projection of a unit radius on the Cartesian coordinate plane.',
          conditions: 'Range in real domain: -1 ≤ sin θ ≤ 1.',
          keywords: ['sine', 'sin', 'opposite hypotenuse', 'right triangle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cosine-ratio',
          name: 'Cosine Ratio Definition',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Right Triangle Ratios',
          expression: 'cos θ = adjacent / hypotenuse',
          latex: '\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}',
          symbols: [
            { symbol: '\\theta', meaning: 'Acute angle' },
            { symbol: '\\text{adjacent}', meaning: 'Length of leg adjacent to angle θ' },
            { symbol: '\\text{hypotenuse}', meaning: 'Length of the hypotenuse' }
          ],
          explanation: 'Fundamental trigonometric ratio representing the horizontal projection of a unit radius on the Cartesian plane.',
          conditions: '-1 ≤ cos θ ≤ 1.',
          keywords: ['cosine', 'cos', 'adjacent hypotenuse', 'right triangle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-tangent-identity',
          name: 'Tangent Quotient Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Quotient Identities',
          expression: 'tan θ = sin θ / cos θ',
          latex: '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}',
          symbols: [
            { symbol: '\\tan\\theta', meaning: 'Tangent function' },
            { symbol: '\\sin\\theta, \\cos\\theta', meaning: 'Sine and cosine functions' }
          ],
          explanation: 'Ratio of opposite to adjacent sides; corresponds to the geometric slope of the terminal ray at angle θ.',
          conditions: 'cos θ ≠ 0, so θ ≠ (2k + 1)π/2 for k ∈ ℤ.',
          keywords: ['tangent', 'tan', 'sin / cos', 'slope'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cotangent-identity',
          name: 'Cotangent Quotient Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Quotient Identities',
          expression: 'cot θ = cos θ / sin θ',
          latex: '\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}',
          symbols: [
            { symbol: '\\cot\\theta', meaning: 'Cotangent function (1 / tan θ)' }
          ],
          explanation: 'Reciprocal of tangent; ratio of adjacent leg to opposite leg in a right triangle.',
          conditions: 'sin θ ≠ 0, so θ ≠ kπ for k ∈ ℤ.',
          keywords: ['cotangent', 'cot', 'cos / sin'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-secant-identity',
          name: 'Secant Reciprocal Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Reciprocal Identities',
          expression: 'sec θ = 1 / cos θ',
          latex: '\\sec\\theta=\\frac{1}{\\cos\\theta}',
          symbols: [
            { symbol: '\\sec\\theta', meaning: 'Secant function' }
          ],
          explanation: 'Reciprocal circular function of cosine; ratio of hypotenuse to adjacent side.',
          conditions: 'cos θ ≠ 0 (θ ≠ π/2 + kπ). Range: (-∞, -1] ∪ [1, ∞).',
          keywords: ['secant', 'sec', '1 / cos'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cosecant-identity',
          name: 'Cosecant Reciprocal Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Reciprocal Identities',
          expression: 'csc θ = 1 / sin θ',
          latex: '\\csc\\theta=\\frac{1}{\\sin\\theta}',
          symbols: [
            { symbol: '\\csc\\theta', meaning: 'Cosecant function (cosec θ)' }
          ],
          explanation: 'Reciprocal circular function of sine; ratio of hypotenuse to opposite side.',
          conditions: 'sin θ ≠ 0 (θ ≠ kπ). Range: (-∞, -1] ∪ [1, ∞).',
          keywords: ['cosecant', 'csc', 'cosec', '1 / sin'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-pythagorean-fundamental',
          name: 'Fundamental Pythagorean Trigonometric Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Pythagorean Identities',
          expression: 'sin^2 θ + cos^2 θ = 1',
          latex: '\\sin^2\\theta+\\cos^2\\theta=1',
          symbols: [
            { symbol: '\\sin^2\\theta', meaning: 'Square of sine value (sin θ)^2' },
            { symbol: '\\cos^2\\theta', meaning: 'Square of cosine value (cos θ)^2' }
          ],
          explanation: 'Direct consequence of the Pythagorean theorem x^2 + y^2 = r^2 on the unit circle (r = 1); holds for all real and complex angles θ.',
          conditions: 'Universal identity true for all θ ∈ ℝ.',
          keywords: ['pythagorean identity', 'sin^2 + cos^2 = 1', 'fundamental identity'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-pythagorean-sec-tan',
          name: 'Secant-Tangent Pythagorean Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Pythagorean Identities',
          expression: '1 + tan^2 θ = sec^2 θ',
          latex: '1+\\tan^2\\theta=\\sec^2\\theta',
          alternateLatex: ['\\sec^2\\theta-\\tan^2\\theta=1'],
          symbols: [
            { symbol: '\\tan^2\\theta', meaning: 'Square of tangent value' },
            { symbol: '\\sec^2\\theta', meaning: 'Square of secant value' }
          ],
          explanation: 'Obtained by dividing the fundamental identity sin^2 θ + cos^2 θ = 1 through by cos^2 θ.',
          conditions: 'θ ≠ (2k + 1)π/2 for k ∈ ℤ.',
          keywords: ['1 + tan^2 = sec^2', 'secant tangent identity', 'pythagorean'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-pythagorean-csc-cot',
          name: 'Cosecant-Cotangent Pythagorean Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Pythagorean Identities',
          expression: '1 + cot^2 θ = csc^2 θ',
          latex: '1+\\cot^2\\theta=\\csc^2\\theta',
          alternateLatex: ['\\csc^2\\theta-\\cot^2\\theta=1'],
          symbols: [
            { symbol: '\\cot^2\\theta', meaning: 'Square of cotangent value' },
            { symbol: '\\csc^2\\theta', meaning: 'Square of cosecant value' }
          ],
          explanation: 'Obtained by dividing sin^2 θ + cos^2 θ = 1 through by sin^2 θ.',
          conditions: 'θ ≠ kπ for k ∈ ℤ.',
          keywords: ['1 + cot^2 = csc^2', 'cosecant cotangent identity'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-sine-double-angle',
          name: 'Sine Double Angle Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Double Angle Formulas',
          expression: 'sin 2θ = 2 sin θ cos θ',
          latex: '\\sin 2\\theta=2\\sin\\theta\\cos\\theta',
          alternateLatex: ['\\sin 2\\theta = \\frac{2\\tan\\theta}{1+\\tan^2\\theta}'],
          symbols: [
            { symbol: '2\\theta', meaning: 'Doubled angle' },
            { symbol: '\\sin\\theta, \\cos\\theta', meaning: 'Trigonometric values at single angle' }
          ],
          explanation: 'Expresses the sine of twice an angle in terms of single-angle sine and cosine products; also expressible rationally as 2 tan θ / (1 + tan^2 θ).',
          conditions: 'Valid for all real angles θ.',
          keywords: ['sin 2theta', 'double angle sine', '2 sin cos'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cosine-double-angle',
          name: 'Cosine Double Angle Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Double Angle Formulas',
          expression: 'cos 2θ = cos^2 θ - sin^2 θ',
          latex: '\\cos 2\\theta=\\cos^2\\theta-\\sin^2\\theta',
          alternateLatex: ['\\cos 2\\theta=2\\cos^2\\theta-1', '\\cos 2\\theta=1-2\\sin^2\\theta'],
          symbols: [
            { symbol: '2\\theta', meaning: 'Doubled angle' }
          ],
          explanation: 'Key double angle identity; equivalent forms include 2 cos^2 θ - 1, 1 - 2 sin^2 θ, and (1 - tan^2 θ)/(1 + tan^2 θ). Critical for power reduction in calculus.',
          conditions: 'Valid for all θ ∈ ℝ.',
          keywords: ['cos 2theta', 'double angle cosine', 'cos^2 - sin^2'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-tangent-double-angle',
          name: 'Tangent Double Angle Identity',
          subject: 'mathematics',
          chapter: 'Trigonometric Ratios and Identities',
          topic: 'Double Angle Formulas',
          expression: 'tan 2θ = (2 tan θ) / (1 - tan^2 θ)',
          latex: '\\tan 2\\theta=\\frac{2\\tan\\theta}{1-\\tan^2\\theta}',
          symbols: [
            { symbol: '\\tan\\theta', meaning: 'Tangent of single angle θ' }
          ],
          explanation: 'Expresses tangent of double angle as a rational function of tan θ; derived from tan(A + B) setting A = B = θ.',
          conditions: 'θ ≠ π/4 + kπ/2 and θ ≠ π/2 + kπ.',
          keywords: ['tan 2theta', 'double angle tangent', '2 tan / (1 - tan^2)'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm3-multiple-submultiple',
      number: 2,
      title: 'Multiple and Submultiple Angles',
      description: 'Addition and subtraction theorems for sine, cosine, and tangent, triple-angle expressions, half-angle formulas, and product-sum transformations.',
      formulas: [
        {
          id: 'm-trig-sin-addition',
          name: 'Sine of Angle Sum',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'sin(A + B) = sin A cos B + cos A sin B',
          latex: '\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B',
          symbols: [
            { symbol: 'A, B', meaning: 'Two arbitrary angles' }
          ],
          explanation: 'Fundamental angle addition theorem for sine; decomposes compound angle into cross products of sine and cosine.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['sin(A+B)', 'sine addition', 'compound angle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-sin-subtraction',
          name: 'Sine of Angle Difference',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'sin(A - B) = sin A cos B - cos A sin B',
          latex: '\\sin(A-B)=\\sin A\\cos B-\\cos A\\sin B',
          symbols: [
            { symbol: 'A, B', meaning: 'Two angles' }
          ],
          explanation: 'Angle difference formula for sine; obtained by replacing B with -B in the addition theorem.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['sin(A-B)', 'sine difference', 'compound angle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cos-addition',
          name: 'Cosine of Angle Sum',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'cos(A + B) = cos A cos B - sin A sin B',
          latex: '\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B',
          symbols: [
            { symbol: 'A, B', meaning: 'Two angles' }
          ],
          explanation: 'Fundamental angle addition theorem for cosine; features a minus sign between the cosine product and sine product.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['cos(A+B)', 'cosine addition', 'compound angle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-cos-subtraction',
          name: 'Cosine of Angle Difference',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'cos(A - B) = cos A cos B + sin A sin B',
          latex: '\\cos(A-B)=\\cos A\\cos B+\\sin A\\sin B',
          symbols: [
            { symbol: 'A, B', meaning: 'Two angles' }
          ],
          explanation: 'Angle difference formula for cosine; connects directly to the vector dot product of unit directional vectors.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['cos(A-B)', 'cosine difference', 'dot product angle'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-tan-addition',
          name: 'Tangent of Angle Sum',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'tan(A + B) = (tan A + tan B) / (1 - tan A tan B)',
          latex: '\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}',
          symbols: [
            { symbol: '\\tan A, \\tan B', meaning: 'Tangents of individual angles' }
          ],
          explanation: 'Expresses tangent of a sum as a rational function of individual tangents.',
          conditions: 'None of A, B, (A+B) is odd multiple of π/2, and tan A · tan B ≠ 1.',
          keywords: ['tan(A+B)', 'tangent addition', 'compound tangent'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-tan-subtraction',
          name: 'Tangent of Angle Difference',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Compound Angles',
          expression: 'tan(A - B) = (tan A - tan B) / (1 + tan A tan B)',
          latex: '\\tan(A-B)=\\frac{\\tan A-\\tan B}{1+\\tan A\\tan B}',
          symbols: [
            { symbol: '\\tan A, \\tan B', meaning: 'Individual tangents (slopes)' }
          ],
          explanation: 'Computes tangent of the angle between two straight lines of slopes m_1 = tan A and m_2 = tan B.',
          conditions: 'tan A · tan B ≠ -1.',
          keywords: ['tan(A-B)', 'tangent difference', 'angle between lines'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-trig-sin-3theta',
          name: 'Triple-Angle Sine Identity',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Triple Angles',
          expression: 'sin 3θ = 3 sin θ - 4 sin^3 θ',
          latex: '\\sin 3\\theta=3\\sin\\theta-4\\sin^3\\theta',
          symbols: [
            { symbol: '3\\theta', meaning: 'Triple angle' },
            { symbol: '\\sin^3\\theta', meaning: 'Cube of sine value' }
          ],
          explanation: 'Expresses sin(3θ) solely as a cubic polynomial in sin θ; derived from sin(2θ + θ).',
          conditions: 'Valid for all θ ∈ ℝ.',
          keywords: ['sin 3theta', 'triple angle sine', '3 sin - 4 sin^3'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-cos-3theta',
          name: 'Triple-Angle Cosine Identity',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Triple Angles',
          expression: 'cos 3θ = 4 cos^3 θ - 3 cos θ',
          latex: '\\cos 3\\theta=4\\cos^3\\theta-3\\cos\\theta',
          symbols: [
            { symbol: '3\\theta', meaning: 'Triple angle' },
            { symbol: '\\cos^3\\theta', meaning: 'Cube of cosine value' }
          ],
          explanation: 'Expresses cos(3θ) solely as a cubic polynomial in cos θ; related to Chebyshev polynomials of the first kind T_3(x) = 4x^3 - 3x.',
          conditions: 'Valid for all θ ∈ ℝ.',
          keywords: ['cos 3theta', 'triple angle cosine', '4 cos^3 - 3 cos', 'chebyshev'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-half-angle-sine',
          name: 'Half-Angle Sine Formula',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Submultiple Angles',
          expression: 'sin(θ / 2) = ± √((1 - cos θ) / 2)',
          latex: '\\sin\\frac{\\theta}{2}=\\pm\\sqrt{\\frac{1-\\cos\\theta}{2}}',
          symbols: [
            { symbol: '\\theta / 2', meaning: 'Half angle' },
            { symbol: '\\pm', meaning: 'Sign chosen based on the quadrant of θ/2' }
          ],
          explanation: 'Computes the sine of half an angle from cos θ, derived by inverting cos 2A = 1 - 2 sin^2 A.',
          conditions: 'Sign (+ or -) matches the quadrant in which the angle θ/2 lies.',
          keywords: ['half angle sine', 'sin(theta/2)', 'submultiple angle'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-half-angle-cosine',
          name: 'Half-Angle Cosine Formula',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Submultiple Angles',
          expression: 'cos(θ / 2) = ± √((1 + cos θ) / 2)',
          latex: '\\cos\\frac{\\theta}{2}=\\pm\\sqrt{\\frac{1+\\cos\\theta}{2}}',
          symbols: [
            { symbol: '\\theta / 2', meaning: 'Half angle' },
            { symbol: '\\pm', meaning: 'Sign chosen based on the quadrant of θ/2' }
          ],
          explanation: 'Computes the cosine of half an angle from cos θ, derived by inverting cos 2A = 2 cos^2 A - 1.',
          conditions: 'Sign selected according to the quadrant of θ/2.',
          keywords: ['half angle cosine', 'cos(theta/2)', 'submultiple angle'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-half-angle-tangent',
          name: 'Half-Angle Tangent Identity',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Submultiple Angles',
          expression: 'tan(θ / 2) = sin θ / (1 + cos θ)',
          latex: '\\tan\\frac{\\theta}{2}=\\frac{\\sin\\theta}{1+\\cos\\theta}',
          alternateLatex: ['\\tan\\frac{\\theta}{2}=\\frac{1-\\cos\\theta}{\\sin\\theta}'],
          symbols: [
            { symbol: '\\theta / 2', meaning: 'Half angle' }
          ],
          explanation: 'Unambiguous rational half-angle tangent formulation that does not require square root sign determination; foundational for the Weierstrass substitution t = tan(θ/2) in calculus.',
          conditions: 'cos θ ≠ -1 (θ ≠ (2k + 1)π).',
          keywords: ['half angle tangent', 'tan(theta/2)', 'weierstrass substitution'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-product-to-sum',
          name: 'Product-to-Sum Transformation',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Transformation Formulas',
          expression: '2 sin A cos B = sin(A + B) + sin(A - B)',
          latex: '2\\sin A\\cos B=\\sin(A+B)+\\sin(A-B)',
          symbols: [
            { symbol: 'A, B', meaning: 'Two angles' }
          ],
          explanation: 'Converts a product of sine and cosine into a sum of two sines, indispensable for integrating products of trigonometric functions.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['product to sum', '2 sin A cos B', 'transformation formula'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-trig-sum-to-product',
          name: 'Sum-to-Product Transformation',
          subject: 'mathematics',
          chapter: 'Multiple and Submultiple Angles',
          topic: 'Transformation Formulas',
          expression: 'sin A + sin B = 2 sin((A + B) / 2) cos((A - B) / 2)',
          latex: '\\sin A+\\sin B=2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}',
          symbols: [
            { symbol: 'A, B', meaning: 'Two given angles' },
            { symbol: '(A+B)/2', meaning: 'Average (carrier) frequency angle' },
            { symbol: '(A-B)/2', meaning: 'Difference (beat/modulation) frequency angle' }
          ],
          explanation: 'Converts the sum of two sine waves into a modulated product; explains the physics of acoustic beats and amplitude modulation.',
          conditions: 'Valid for all A, B ∈ ℝ.',
          keywords: ['sum to product', 'sin A + sin B', 'beats', 'prosthaphaeresis'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm3-inverse-trigonometric',
      number: 3,
      title: 'Inverse Trigonometric Functions',
      description: 'Principal value branches, complementary cofunction identities, parity reflections, and sum/difference arctangent identities.',
      formulas: [
        {
          id: 'm-inv-sin-cos-relation',
          name: 'Sine-Cosine Complementary Inverse Relation',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Cofunction Relations',
          expression: 'sin^(-1) x + cos^(-1) x = π / 2',
          latex: '\\sin^{-1}x+\\cos^{-1}x=\\frac{\\pi}{2}',
          symbols: [
            { symbol: '\\sin^{-1}x', meaning: 'Principal arcsin with range [-π/2, π/2]' },
            { symbol: '\\cos^{-1}x', meaning: 'Principal arccos with range [0, π]' },
            { symbol: 'x', meaning: 'Input argument in closed domain [-1, 1]' }
          ],
          explanation: 'The sum of the principal arcsin and arccos of any real number in [-1, 1] is constant and equal to a right angle (π/2 radians).',
          conditions: 'x ∈ [-1, 1].',
          keywords: ['arcsin + arccos', 'pi / 2', 'complementary inverse'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-inv-tan-cot-relation',
          name: 'Tangent-Cotangent Complementary Inverse Relation',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Cofunction Relations',
          expression: 'tan^(-1) x + cot^(-1) x = π / 2',
          latex: '\\tan^{-1}x+\\cot^{-1}x=\\frac{\\pi}{2}',
          symbols: [
            { symbol: '\\tan^{-1}x', meaning: 'Principal arctan with range (-π/2, π/2)' },
            { symbol: '\\cot^{-1}x', meaning: 'Principal arccot with range (0, π)' },
            { symbol: 'x', meaning: 'Any real number (x ∈ ℝ)' }
          ],
          explanation: 'The sum of arctan(x) and arccot(x) equals π/2 across the entire real number line.',
          conditions: 'Valid for all x ∈ ℝ.',
          keywords: ['arctan + arccot', 'pi / 2', 'complementary angles'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-inv-sin-odd-property',
          name: 'Odd Parity of Inverse Sine',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Parity Properties',
          expression: 'sin^(-1)(-x) = -sin^(-1) x',
          latex: '\\sin^{-1}(-x)=-\\sin^{-1}x',
          symbols: [
            { symbol: 'x', meaning: 'Real number in [-1, 1]' }
          ],
          explanation: 'The inverse sine function is strictly odd, possessing point symmetry with respect to the origin.',
          conditions: 'x ∈ [-1, 1]. In contrast, cos^(-1)(-x) = π - cos^(-1) x.',
          keywords: ['arcsin(-x)', 'odd function', 'inverse sine symmetry'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-inv-tan-odd-property',
          name: 'Odd Parity of Inverse Tangent',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Parity Properties',
          expression: 'tan^(-1)(-x) = -tan^(-1) x',
          latex: '\\tan^{-1}(-x)=-\\tan^{-1}x',
          symbols: [
            { symbol: 'x', meaning: 'Real number in (-∞, ∞)' }
          ],
          explanation: 'The inverse tangent function is strictly odd, with graph anti-symmetric about the origin.',
          conditions: 'Valid for all x ∈ ℝ.',
          keywords: ['arctan(-x)', 'odd function', 'inverse tangent symmetry'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-inv-tan-addition',
          name: 'Inverse Tangent Addition Identity',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Addition Formulas',
          expression: 'tan^(-1) x + tan^(-1) y = tan^(-1)((x + y) / (1 - xy))',
          latex: '\\tan^{-1}x+\\tan^{-1}y=\\tan^{-1}\\left(\\frac{x+y}{1-xy}\\right)',
          symbols: [
            { symbol: 'x, y', meaning: 'Real numbers satisfying xy < 1' }
          ],
          explanation: 'Combines two arctangents into a single arctangent; derived from the tangent angle addition formula.',
          conditions: 'Valid as stated for xy < 1. If xy > 1 with x, y > 0, add π: π + tan^(-1)((x+y)/(1-xy)). If xy > 1 with x, y < 0, subtract π: -π + tan^(-1)((x+y)/(1-xy)).',
          keywords: ['arctan addition', 'tan^-1 x + tan^-1 y', 'principal value branches'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-inv-tan-subtraction',
          name: 'Inverse Tangent Subtraction Identity',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Addition Formulas',
          expression: 'tan^(-1) x - tan^(-1) y = tan^(-1)((x - y) / (1 + xy))',
          latex: '\\tan^{-1}x-\\tan^{-1}y=\\tan^{-1}\\left(\\frac{x-y}{1+xy}\\right)',
          symbols: [
            { symbol: 'x, y', meaning: 'Real numbers satisfying xy > -1' }
          ],
          explanation: 'Difference formula for arctangents; fundamental in telescope series summations in competitive mathematics.',
          conditions: 'Valid for xy > -1. If xy < -1, quadrant corrections (+π or -π) apply depending on signs of x and y.',
          keywords: ['arctan subtraction', 'tan^-1 x - tan^-1 y', 'telescoping series'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-inv-tan-double-angle',
          name: 'Inverse Tangent Double-Angle Identity',
          subject: 'mathematics',
          chapter: 'Inverse Trigonometric Functions',
          topic: 'Multiple Relations',
          expression: '2 tan^(-1) x = tan^(-1)((2x) / (1 - x^2))',
          latex: '2\\tan^{-1}x=\\tan^{-1}\\left(\\frac{2x}{1-x^2}\\right)',
          symbols: [
            { symbol: 'x', meaning: 'Real number in (-1, 1)' }
          ],
          explanation: 'Special case of arctan addition where y = x; represents doubling of an arctangent angle.',
          conditions: 'Valid for |x| < 1. If x > 1, equals π + tan^(-1)(2x/(1-x^2)). If x < -1, equals -π + tan^(-1)(2x/(1-x^2)).',
          keywords: ['2 arctan x', '2 tan^-1', 'double angle inverse'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    }
  ]
};

