import type { AcademicLevel } from '@/types/formulas';

export const division1Algebra: AcademicLevel = {
  id: 'math-div-1',
  title: 'Algebra and Polynomials',
  shortTitle: 'Algebra',
  description: 'Foundations of algebra: quadratic theory, progressions, binomial theorem, linear systems via matrices & determinants, and complex field properties.',
  levelOrder: 1,
  chapters: [
    {
      id: 'm1-quadratic-equations',
      number: 1,
      title: 'Quadratic Equations',
      description: 'Second-degree polynomial equations, discriminant analysis, nature and relations of roots, and parabolic vertex geometry.',
      formulas: [
        {
          id: 'm-quad-standard-form',
          name: 'Standard Form of Quadratic Equation',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Standard Representation',
          expression: 'ax^2 + bx + c = 0',
          latex: 'ax^2 + bx + c = 0',
          symbols: [
            { symbol: 'a', meaning: 'Coefficient of quadratic term x^2 (leading coefficient)' },
            { symbol: 'b', meaning: 'Coefficient of linear term x' },
            { symbol: 'c', meaning: 'Constant term' },
            { symbol: 'x', meaning: 'Unknown variable in the polynomial' }
          ],
          explanation: 'The canonical second-degree polynomial equation in a single variable x with real or complex coefficients.',
          conditions: 'Leading coefficient a ≠ 0 (if a = 0, the equation reduces to a linear equation bx + c = 0).',
          keywords: ['quadratic', 'standard form', 'polynomial', 'parabola', 'algebra'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-quad-quadratic-formula',
          name: 'Quadratic Formula (Sridharacharya Formula)',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Root Calculation',
          expression: 'x = (-b ± √(b^2 - 4ac)) / (2a)',
          latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
          alternateLatex: ['x = -\\frac{b}{2a} \\pm \\frac{\\sqrt{\\Delta}}{2a}'],
          symbols: [
            { symbol: 'x', meaning: 'Roots (solutions) of the quadratic equation' },
            { symbol: 'a, b, c', meaning: 'Quadratic, linear, and constant coefficients' },
            { symbol: '\\pm', meaning: 'Indicates the two conjugate branches of roots' }
          ],
          explanation: 'Universal closed-form algebraic formula to compute the two roots of any quadratic equation ax^2 + bx + c = 0.',
          conditions: 'a ≠ 0. If b^2 - 4ac < 0, roots form a pair of complex conjugates.',
          keywords: ['quadratic formula', 'sridharacharya', 'roots', 'solutions'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-quad-discriminant',
          name: 'Discriminant of Quadratic Equation',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Nature of Roots',
          expression: 'Δ = b^2 - 4ac',
          latex: '\\Delta = b^2 - 4ac',
          symbols: [
            { symbol: '\\Delta', meaning: 'Discriminant (or D)' },
            { symbol: 'a, b, c', meaning: 'Coefficients of the quadratic polynomial' }
          ],
          explanation: 'The discriminant characterizes the geometric and algebraic nature of the roots without explicitly solving the equation.',
          conditions: 'If Δ > 0: two distinct real roots; if Δ = 0: two equal real roots (touching x-axis); if Δ < 0: two non-real complex conjugate roots.',
          keywords: ['discriminant', 'delta', 'nature of roots', 'real roots', 'complex roots'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-quad-sum-of-roots',
          name: 'Sum of Roots (Vieta\'s Formula)',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Relations Between Roots and Coefficients',
          expression: 'α + β = -b / a',
          latex: '\\alpha + \\beta = -\\frac{b}{a}',
          symbols: [
            { symbol: '\\alpha, \\beta', meaning: 'Roots of the quadratic equation' },
            { symbol: 'a, b', meaning: 'Leading coefficient and coefficient of x' }
          ],
          explanation: 'First Vieta relation connecting the sum of algebraic roots to the linear and leading coefficients.',
          conditions: 'Valid for all quadratic equations with a ≠ 0, including real and complex roots.',
          keywords: ['sum of roots', 'vieta', 'coefficients', 'roots relation'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-quad-product-of-roots',
          name: 'Product of Roots (Vieta\'s Formula)',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Relations Between Roots and Coefficients',
          expression: 'α · β = c / a',
          latex: '\\alpha\\beta = \\frac{c}{a}',
          symbols: [
            { symbol: '\\alpha, \\beta', meaning: 'Roots of the quadratic equation' },
            { symbol: 'a, c', meaning: 'Leading coefficient and constant term' }
          ],
          explanation: 'Second Vieta relation expressing the product of the roots as the ratio of the constant term to the leading coefficient.',
          conditions: 'Valid for all quadratic equations with a ≠ 0.',
          keywords: ['product of roots', 'vieta', 'coefficients', 'constant term'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-quad-vertex-x',
          name: 'Vertex x-Coordinate (Axis of Symmetry)',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Parabolic Geometry',
          expression: 'x = -b / (2a)',
          latex: 'x = -\\frac{b}{2a}',
          symbols: [
            { symbol: 'x', meaning: 'x-coordinate of vertex / axis of symmetry line' },
            { symbol: 'a, b', meaning: 'Coefficients of x^2 and x' }
          ],
          explanation: 'Gives the line of symmetry x = -b/(2a) and the x-location where the parabola y = ax^2 + bx + c achieves its extremum (minimum if a > 0, maximum if a < 0).',
          conditions: 'a ≠ 0.',
          keywords: ['vertex', 'axis of symmetry', 'parabola', 'extremum', 'minimum', 'maximum'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-quad-vertex-y',
          name: 'Vertex y-Coordinate (Extremum Value)',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Parabolic Geometry',
          expression: 'y = -Δ / (4a)',
          latex: 'y = -\\frac{\\Delta}{4a}',
          alternateLatex: ['y = -\\frac{b^2 - 4ac}{4a}'],
          symbols: [
            { symbol: 'y', meaning: 'Extreme value (global minimum for a>0, global maximum for a<0)' },
            { symbol: '\\Delta', meaning: 'Discriminant b^2 - 4ac' },
            { symbol: 'a', meaning: 'Leading coefficient' }
          ],
          explanation: 'The vertical position of the parabola vertex, representing the maximum or minimum value achieved by the quadratic polynomial.',
          conditions: 'a ≠ 0. If a > 0, range is [-Δ/(4a), ∞); if a < 0, range is (-∞, -Δ/(4a)].',
          keywords: ['vertex y', 'extremum value', 'minimum', 'maximum', 'parabola'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-quad-completing-square',
          name: 'Completing the Square Identity',
          subject: 'mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Algebraic Transformation',
          expression: 'x^2 + px + (p/2)^2 = (x + p/2)^2',
          latex: 'x^2 + px + \\left(\\frac{p}{2}\\right)^2 = \\left(x + \\frac{p}{2}\\right)^2',
          symbols: [
            { symbol: 'p', meaning: 'Coefficient of the linear term' },
            { symbol: '(p/2)^2', meaning: 'Term added to create a perfect square trinomial' }
          ],
          explanation: 'Algebraic transformation that rewrites a quadratic binomial into a perfect square trinomial, foundational for deriving the quadratic formula and conic equations.',
          conditions: 'Applied after monic scaling (coefficient of x^2 made equal to 1).',
          keywords: ['completing the square', 'perfect square', 'algebraic manipulation'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm1-arithmetic-progressions',
      number: 2,
      title: 'Arithmetic Progressions',
      description: 'Linear sequences characterized by a constant common difference, nth terms, partial series summations, and arithmetic means.',
      formulas: [
        {
          id: 'm-ap-nth-term',
          name: 'nth Term of an Arithmetic Progression',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'General Term',
          expression: 'a_n = a + (n - 1)d',
          latex: 'a_n = a + (n - 1)d',
          symbols: [
            { symbol: 'a_n', meaning: 'Value of the nth term' },
            { symbol: 'a', meaning: 'First term of the progression (a_1)' },
            { symbol: 'n', meaning: 'Positive integer position (n ∈ ℕ)' },
            { symbol: 'd', meaning: 'Common difference between successive terms' }
          ],
          explanation: 'Gives the explicit general value of any term in an arithmetic progression without iterative additions.',
          conditions: 'n is a positive integer (n ≥ 1).',
          keywords: ['nth term', 'AP', 'arithmetic progression', 'general term'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-ap-common-difference',
          name: 'Common Difference of an AP',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'Recurrence Relation',
          expression: 'd = a_n - a_{n-1}',
          latex: 'd = a_n - a_{n-1}',
          symbols: [
            { symbol: 'd', meaning: 'Common difference' },
            { symbol: 'a_n', meaning: 'Term at index n' },
            { symbol: 'a_{n-1}', meaning: 'Immediately preceding term at index n - 1' }
          ],
          explanation: 'The defining characteristic constant of an arithmetic progression; difference between any term and its predecessor.',
          conditions: 'Consistent for all n ≥ 2; d can be positive (increasing), negative (decreasing), or zero (constant).',
          keywords: ['common difference', 'step size', 'AP'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-ap-sum-n-terms',
          name: 'Sum of First n Terms of an AP',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'Series Summation',
          expression: 'S_n = (n / 2)[2a + (n - 1)d]',
          latex: 'S_n = \\frac{n}{2}[2a + (n - 1)d]',
          symbols: [
            { symbol: 'S_n', meaning: 'Sum of the first n consecutive terms' },
            { symbol: 'a', meaning: 'First term' },
            { symbol: 'd', meaning: 'Common difference' },
            { symbol: 'n', meaning: 'Number of terms summed' }
          ],
          explanation: 'Calculates the sum of an arithmetic series given the initial term, common difference, and number of terms.',
          conditions: 'n ∈ ℕ.',
          keywords: ['sum of AP', 'series sum', 'arithmetic series'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-ap-sum-using-last-term',
          name: 'Sum of an AP Using First and Last Terms',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'Series Summation',
          expression: 'S_n = (n / 2)(a + l)',
          latex: 'S_n = \\frac{n}{2}(a + l)',
          symbols: [
            { symbol: 'S_n', meaning: 'Sum of the first n terms' },
            { symbol: 'a', meaning: 'First term' },
            { symbol: 'l', meaning: 'Last term (l = a_n)' },
            { symbol: 'n', meaning: 'Number of terms' }
          ],
          explanation: 'Gauss summation identity expressing the series sum as the product of the number of terms and the average of the first and last terms.',
          conditions: 'Applicable when the last term l = a_n is explicitly known.',
          keywords: ['sum last term', 'gauss sum', 'AP sum'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-ap-arithmetic-mean',
          name: 'Arithmetic Mean Between Two Numbers',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'Means',
          expression: 'A = (a + b) / 2',
          latex: 'A = \\frac{a + b}{2}',
          symbols: [
            { symbol: 'A', meaning: 'Arithmetic mean of two numbers a and b' },
            { symbol: 'a, b', meaning: 'The two given numbers' }
          ],
          explanation: 'The number A inserted between a and b such that a, A, b form an arithmetic progression.',
          conditions: 'If n arithmetic means are inserted between a and b, the common difference is d = (b - a)/(n + 1).',
          keywords: ['arithmetic mean', 'average', 'mean insertion'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-ap-number-of-terms',
          name: 'Number of Terms in a Finite AP',
          subject: 'mathematics',
          chapter: 'Arithmetic Progressions',
          topic: 'Sequence Indexing',
          expression: 'n = (l - a)/d + 1',
          latex: 'n = \\frac{l - a}{d} + 1',
          symbols: [
            { symbol: 'n', meaning: 'Total number of terms in the finite AP' },
            { symbol: 'l', meaning: 'Last term of the AP' },
            { symbol: 'a', meaning: 'First term of the AP' },
            { symbol: 'd', meaning: 'Common difference (d ≠ 0)' }
          ],
          explanation: 'Formula derived by inverting l = a + (n - 1)d to find the count of terms between a and l.',
          conditions: 'd ≠ 0. The expression (l - a)/d must evaluate to a non-negative integer.',
          keywords: ['number of terms', 'count', 'finite sequence'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm1-binomial-theorem',
      number: 3,
      title: 'Binomial Theorem',
      description: 'Algebraic expansion of binomial powers for positive integers, combinatorial coefficients, general and middle terms, and coefficient identities.',
      formulas: [
        {
          id: 'm-bin-expansion',
          name: 'Binomial Theorem Expansion',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'General Expansion',
          expression: '(x + y)^n = Σ_{r=0}^n C(n, r) x^(n-r) y^r',
          latex: '(x + y)^n = \\sum_{r=0}^{n} \\binom{n}{r} x^{n-r} y^r',
          symbols: [
            { symbol: 'x, y', meaning: 'Terms of the binomial' },
            { symbol: 'n', meaning: 'Positive integer exponent' },
            { symbol: '\\binom{n}{r}', meaning: 'Binomial coefficient "n choose r"' },
            { symbol: 'r', meaning: 'Summation index from 0 to n' }
          ],
          explanation: 'Expands any power n of a binomial sum (x + y) into a homogeneous polynomial of degree n containing n + 1 terms.',
          conditions: 'n ∈ ℕ (positive integer). For fractional or negative powers, an infinite binomial series applies with |y/x| < 1.',
          keywords: ['binomial expansion', 'binomial theorem', 'polynomial expansion'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-bin-coefficient',
          name: 'Binomial Coefficient Formula',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Combinatorics',
          expression: 'C(n, r) = n! / [r! (n - r)!]',
          latex: '\\binom{n}{r} = \\frac{n!}{r!(n - r)!}',
          symbols: [
            { symbol: '\\binom{n}{r}', meaning: 'Binomial coefficient ("n choose r")' },
            { symbol: 'n!', meaning: 'Factorial of n: n × (n-1) × ... × 1' },
            { symbol: 'r!', meaning: 'Factorial of r' },
            { symbol: '0!', meaning: 'Defined as 1' }
          ],
          explanation: 'Computes the number of ways to choose r elements from a set of n elements without order; also represents entries of Pascal\'s triangle.',
          conditions: '0 ≤ r ≤ n with n, r ∈ ℕ₀. Identity: \\binom{n}{r} = \\binom{n}{n-r}.',
          keywords: ['binomial coefficient', 'combination', 'combinations', 'factorial'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-bin-general-term',
          name: 'General Term of Binomial Expansion (r+1 th Term)',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Term Extraction',
          expression: 'T_{r+1} = C(n, r) x^(n-r) y^r',
          latex: 'T_{r+1} = \\binom{n}{r} x^{n-r} y^r',
          symbols: [
            { symbol: 'T_{r+1}', meaning: 'The (r + 1)-th term in the expansion of (x + y)^n' },
            { symbol: 'r', meaning: 'Index parameter (0 ≤ r ≤ n)' },
            { symbol: 'n - r, r', meaning: 'Powers of x and y, summing to n' }
          ],
          explanation: 'Standard formula to isolate any specific term in a binomial expansion, critical for finding terms independent of x.',
          conditions: 'Expansion indexed starting from r = 0 (1st term is T_1 with r = 0).',
          keywords: ['general term', 'r-th term', 'term extraction'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-bin-middle-term-even',
          name: 'Middle Term When n is Even',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Middle Term',
          expression: 'T_{n/2 + 1}',
          latex: 'T_{\\frac{n}{2} + 1} = \\binom{n}{n/2} x^{n/2} y^{n/2}',
          symbols: [
            { symbol: 'n', meaning: 'Even positive integer' },
            { symbol: 'T_{\\frac{n}{2} + 1}', meaning: 'The unique middle term of the expansion' }
          ],
          explanation: 'When n is even, (x + y)^n contains an odd number of terms (n + 1), yielding a single central maximum binomial coefficient at r = n/2.',
          conditions: 'n is an even integer (n = 2k).',
          keywords: ['middle term', 'even power', 'central coefficient'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-bin-middle-terms-odd',
          name: 'Middle Terms When n is Odd',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Middle Term',
          expression: 'T_{(n+1)/2} and T_{(n+3)/2}',
          latex: 'T_{\\frac{n+1}{2}},\\quad T_{\\frac{n+3}{2}}',
          symbols: [
            { symbol: 'n', meaning: 'Odd positive integer' },
            { symbol: 'T_{\\frac{n+1}{2}}, T_{\\frac{n+3}{2}}', meaning: 'The two central symmetric middle terms' }
          ],
          explanation: 'When n is odd, (x + y)^n has an even number of terms (n + 1), resulting in two equidistant middle terms with identical binomial coefficients.',
          conditions: 'n is an odd integer (n = 2k + 1). Coefficients: \\binom{n}{(n-1)/2} = \\binom{n}{(n+1)/2}.',
          keywords: ['middle terms', 'odd power', 'symmetric terms'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-bin-sum-of-coefficients',
          name: 'Sum of Binomial Coefficients',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Coefficient Identities',
          expression: 'C(n, 0) + C(n, 1) + ... + C(n, n) = 2^n',
          latex: '\\sum_{r=0}^{n} \\binom{n}{r} = 2^n',
          alternateLatex: ['2^n'],
          symbols: [
            { symbol: '2^n', meaning: 'Total sum of all binomial coefficients for degree n' },
            { symbol: 'n', meaning: 'Positive integer exponent' }
          ],
          explanation: 'Obtained by substituting x = 1 and y = 1 into the binomial expansion (1 + 1)^n = 2^n. Also equals the total number of subsets of an n-element set.',
          conditions: 'n ≥ 0, n ∈ ℕ₀.',
          keywords: ['sum of coefficients', 'power of 2', 'subsets'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-bin-alternating-sum',
          name: 'Alternating Sum of Binomial Coefficients',
          subject: 'mathematics',
          chapter: 'Binomial Theorem',
          topic: 'Coefficient Identities',
          expression: 'C(n, 0) - C(n, 1) + C(n, 2) - ... = 0',
          latex: '\\sum_{r=0}^{n} (-1)^r \\binom{n}{r} = 0,\\quad n \\geq 1',
          alternateLatex: ['0,\\quad n\\geq 1'],
          symbols: [
            { symbol: '(-1)^r', meaning: 'Alternating sign factor' },
            { symbol: 'n', meaning: 'Positive integer (n ≥ 1)' }
          ],
          explanation: 'Obtained by substituting x = 1 and y = -1 into (1 - 1)^n = 0. Implies that the sum of even-indexed coefficients equals the sum of odd-indexed coefficients: 2^(n-1).',
          conditions: 'n ≥ 1 (if n = 0, sum equals 1).',
          keywords: ['alternating sum', 'even odd coefficients', 'zero sum'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm1-matrices-determinants',
      number: 4,
      title: 'Matrices and Determinants',
      description: 'Matrix algebra, determinant evaluation, transposition, matrix inversion, multiplicative determinants, Cramer\'s rule, and systems of linear equations.',
      formulas: [
        {
          id: 'm-mat-det-2x2',
          name: '2 × 2 Determinant Evaluation',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Determinants',
          expression: '|[a, b], [c, d]| = ad - bc',
          latex: '\\begin{vmatrix}a & b\\\\ c & d\\end{vmatrix} = ad - bc',
          symbols: [
            { symbol: 'a, d', meaning: 'Elements along the main (principal) diagonal' },
            { symbol: 'b, c', meaning: 'Elements along the off-diagonal' }
          ],
          explanation: 'Calculates the determinant of a 2nd-order square matrix; geometrically represents the signed area of the parallelogram spanned by columns.',
          conditions: 'Square matrix of order 2.',
          keywords: ['2x2 determinant', 'determinant', 'ad - bc'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-mat-det-3x3',
          name: '3 × 3 Determinant Expansion (Laplace Expansion)',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Determinants',
          expression: 'det(A) = a(ei - fh) - b(di - fg) + c(dh - eg)',
          latex: '\\begin{vmatrix}a & b & c\\\\ d & e & f\\\\ g & h & i\\end{vmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Elements of the first row used for cofactor expansion' },
            { symbol: 'ei - fh, etc.', meaning: '2 × 2 sub-determinants (minors) formed by deleting corresponding row and column' }
          ],
          explanation: 'First-row cofactor expansion of a 3 × 3 matrix; geometrically represents the signed oriented volume of the parallelepiped spanned by row/column vectors.',
          conditions: 'Square matrix of order 3.',
          keywords: ['3x3 determinant', 'cofactor expansion', 'laplace expansion', 'volume'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-mat-multiplication',
          name: 'Matrix Multiplication Definition',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Matrix Algebra',
          expression: '(AB)_{ij} = Σ_{k=1}^n a_{ik} b_{kj}',
          latex: '(AB)_{ij} = \\sum_{k=1}^{n} a_{ik} b_{kj}',
          symbols: [
            { symbol: '(AB)_{ij}', meaning: 'Element in row i and column j of product matrix AB' },
            { symbol: 'a_{ik}', meaning: 'Element of first matrix A (m × n)' },
            { symbol: 'b_{kj}', meaning: 'Element of second matrix B (n × p)' },
            { symbol: 'n', meaning: 'Inner shared dimension (columns of A = rows of B)' }
          ],
          explanation: 'Row-by-column inner product operation defining the composition of linear maps represented by matrices A and B.',
          conditions: 'Columns of A must equal rows of B. In general non-commutative: AB ≠ BA.',
          keywords: ['matrix multiplication', 'matrix product', 'row by column'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-mat-transpose',
          name: 'Matrix Transpose Definition',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Matrix Operations',
          expression: '(A^T)_{ij} = A_{ji}',
          latex: '(A^T)_{ij} = A_{ji}',
          symbols: [
            { symbol: 'A^T', meaning: 'Transpose of matrix A (rows swapped with columns)' },
            { symbol: 'A_{ji}', meaning: 'Element of original matrix A at row j, column i' }
          ],
          explanation: 'Flips a matrix over its diagonal, switching the row and column indices. If A = A^T the matrix is symmetric; if A = -A^T it is skew-symmetric.',
          conditions: 'Properties: (A^T)^T = A, (AB)^T = B^T A^T, (A + B)^T = A^T + B^T.',
          keywords: ['transpose', 'symmetric', 'skew symmetric', 'matrix transpose'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-mat-inverse',
          name: 'Inverse Matrix via Adjugate Formula',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Matrix Inversion',
          expression: 'A^(-1) = adj(A) / det(A)',
          latex: 'A^{-1} = \\frac{\\operatorname{adj}(A)}{\\det(A)}',
          symbols: [
            { symbol: 'A^{-1}', meaning: 'Multiplicative inverse matrix satisfying A A^{-1} = I' },
            { symbol: '\\operatorname{adj}(A)', meaning: 'Adjugate (adjoint) matrix: transpose of cofactor matrix C^T' },
            { symbol: '\\det(A)', meaning: 'Determinant of matrix A' }
          ],
          explanation: 'Analytical method to compute the matrix inverse of any non-singular square matrix using the transposed cofactor matrix.',
          conditions: 'A must be square and non-singular: \\det(A) ≠ 0.',
          keywords: ['inverse matrix', 'adjugate', 'adjoint', 'determinant', 'non-singular'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-mat-det-product',
          name: 'Determinant of a Matrix Product',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Determinant Properties',
          expression: 'det(AB) = det(A) det(B)',
          latex: '\\det(AB) = \\det(A)\\det(B)',
          symbols: [
            { symbol: '\\det(AB)', meaning: 'Determinant of the product matrix AB' },
            { symbol: '\\det(A), \\det(B)', meaning: 'Determinants of individual square matrices A and B' }
          ],
          explanation: 'The determinant is a multiplicative map on square matrices, reflecting scaling of oriented volume under composed linear transformations.',
          conditions: 'A and B must be square matrices of the same order.',
          keywords: ['determinant product', 'multiplicative property', 'det(AB)'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-mat-identity',
          name: 'Identity Matrix Multiplication',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Identity Matrix',
          expression: 'AI = IA = A',
          latex: 'AI = IA = A',
          symbols: [
            { symbol: 'I', meaning: 'Identity matrix with 1s on main diagonal and 0s elsewhere' },
            { symbol: 'A', meaning: 'Any compatible square matrix' }
          ],
          explanation: 'The identity matrix acts as the neutral element under matrix multiplication.',
          conditions: 'Order of I matches dimensions required for multiplication.',
          keywords: ['identity matrix', 'neutral element', 'unit matrix'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-mat-cramers-rule',
          name: 'Cramer\'s Rule for Linear Systems',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Linear Systems',
          expression: 'x_i = Δ_i / Δ',
          latex: 'x_i = \\frac{\\Delta_i}{\\Delta}',
          symbols: [
            { symbol: 'x_i', meaning: 'i-th variable in the system of linear equations' },
            { symbol: '\\Delta', meaning: 'Determinant of the system\'s coefficient matrix' },
            { symbol: '\\Delta_i', meaning: 'Determinant obtained by replacing the i-th column of coefficient matrix with constants vector B' }
          ],
          explanation: 'Explicit algebraic formula for solving a system of n linear equations in n variables using determinants.',
          conditions: 'Coefficient determinant Δ ≠ 0. If Δ = 0 and any Δ_i ≠ 0, no solution (inconsistent); if all Δ_i = 0, infinitely many solutions or inconsistent.',
          keywords: ['cramer\'s rule', 'linear system', 'determinants', 'system of equations'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-mat-matrix-equation',
          name: 'Matrix Equation of Linear System',
          subject: 'mathematics',
          chapter: 'Matrices and Determinants',
          topic: 'Linear Systems',
          expression: 'AX = B',
          latex: 'AX = B',
          symbols: [
            { symbol: 'A', meaning: 'Coefficient matrix of order m × n' },
            { symbol: 'X', meaning: 'Column vector of n unknown variables' },
            { symbol: 'B', meaning: 'Column vector of m constant terms' }
          ],
          explanation: 'Compact vector-matrix formulation of a system of simultaneous linear equations; solved as X = A^(-1) B when A is invertible.',
          conditions: 'Consistent if rank(A) = rank([A|B]). Unique solution if rank(A) = number of variables.',
          keywords: ['matrix equation', 'AX = B', 'linear system', 'vector form'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm1-complex-numbers',
      number: 5,
      title: 'Complex Numbers',
      description: 'The complex plane ℂ: imaginary unit i, conjugation, modulus, argument, polar and exponential representations, and De Moivre\'s theorem.',
      formulas: [
        {
          id: 'm-cplx-standard-form',
          name: 'Standard Form of Complex Number (Cartesian Form)',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Representation',
          expression: 'z = a + ib',
          latex: 'z = a + ib',
          symbols: [
            { symbol: 'z', meaning: 'Complex number' },
            { symbol: 'a', meaning: 'Real part: Re(z)' },
            { symbol: 'b', meaning: 'Imaginary part: Im(z)' },
            { symbol: 'i', meaning: 'Imaginary unit (√(-1))' }
          ],
          explanation: 'Standard rectangular algebraic representation of an element in the complex field ℂ.',
          conditions: 'a, b ∈ ℝ.',
          keywords: ['complex number', 'real part', 'imaginary part', 'cartesian form'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-cplx-imaginary-unit',
          name: 'Imaginary Unit Definition',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Foundations',
          expression: 'i^2 = -1',
          latex: 'i^2 = -1',
          alternateLatex: ['i = \\sqrt{-1}'],
          symbols: [
            { symbol: 'i', meaning: 'Imaginary unit' }
          ],
          explanation: 'Fundamental algebraic definition enabling square roots of negative real numbers. Cyclic powers: i^1 = i, i^2 = -1, i^3 = -i, i^4 = 1.',
          conditions: 'Periodic with period 4: i^(4k+r) = i^r.',
          keywords: ['imaginary unit', 'i squared', 'root minus one'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-cplx-conjugate',
          name: 'Complex Conjugate',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Conjugation',
          expression: 'z̄ = a - ib',
          latex: '\\overline{z} = a - ib',
          symbols: [
            { symbol: '\\overline{z}', meaning: 'Complex conjugate of z = a + ib' },
            { symbol: 'a, b', meaning: 'Real and imaginary parts of z' }
          ],
          explanation: 'Reflection of the complex number z across the real axis in the Argand plane. Product z z̄ = a^2 + b^2 = |z|^2 is always real and non-negative.',
          conditions: 'Properties: \\overline{z_1 + z_2} = \\overline{z}_1 + \\overline{z}_2, \\overline{z_1 z_2} = \\overline{z}_1 \\overline{z}_2.',
          keywords: ['conjugate', 'complex conjugate', 'argand plane reflection'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-cplx-modulus',
          name: 'Modulus (Absolute Value) of Complex Number',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Metric Properties',
          expression: '|z| = √(a^2 + b^2)',
          latex: '|z| = \\sqrt{a^2 + b^2}',
          symbols: [
            { symbol: '|z|', meaning: 'Modulus of z (distance from origin in Argand diagram)' },
            { symbol: 'a, b', meaning: 'Real and imaginary components' }
          ],
          explanation: 'Euclidean distance of the point (a, b) from the origin (0, 0) in the complex plane. Satisfies the triangle inequality |z_1 + z_2| ≤ |z_1| + |z_2|.',
          conditions: '|z| ≥ 0; |z| = 0 if and only if z = 0.',
          keywords: ['modulus', 'absolute value', 'distance', 'magnitude'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-cplx-argument',
          name: 'Argument of Complex Number',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Angular Coordinate',
          expression: 'θ = arg(z)',
          latex: '\\theta = \\arg(z)',
          symbols: [
            { symbol: '\\theta', meaning: 'Argument (angle with positive real axis in radians)' },
            { symbol: 'z', meaning: 'Non-zero complex number' }
          ],
          explanation: 'Counter-clockwise angle subtended by the vector representation of z with the positive real axis. Principal argument Arg(z) is conventionally taken in (-π, π].',
          conditions: 'z ≠ 0 (undefined at the origin). For z = a + ib: tan θ = b/a adjusted for quadrant.',
          keywords: ['argument', 'phase', 'arg(z)', 'angle', 'polar angle'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-cplx-polar-form',
          name: 'Polar Form (Trigonometric Form)',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Polar Form',
          expression: 'z = r(cos θ + i sin θ)',
          latex: 'z = r(\\cos\\theta + i\\sin\\theta)',
          symbols: [
            { symbol: 'r', meaning: 'Modulus r = |z| ≥ 0' },
            { symbol: '\\theta', meaning: 'Argument θ = arg(z)' }
          ],
          explanation: 'Decomposition of complex number into magnitude and direction coordinates, ideal for multiplication and exponentiation.',
          conditions: 'r ≥ 0, θ ∈ ℝ.',
          keywords: ['polar form', 'modulus argument form', 'trigonometric form'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-cplx-euler-formula',
          name: 'Euler\'s Formula',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Exponential Representation',
          expression: 'e^(iθ) = cos θ + i sin θ',
          latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
          symbols: [
            { symbol: 'e', meaning: 'Euler\'s number (base of natural logarithm)' },
            { symbol: 'i', meaning: 'Imaginary unit' },
            { symbol: '\\theta', meaning: 'Angle in radians' }
          ],
          explanation: 'Profound identity establishing a fundamental bridge between trigonometric functions and complex exponentials. For θ = π, yields Euler\'s identity: e^(iπ) + 1 = 0.',
          conditions: 'Valid for all real and complex values of θ.',
          keywords: ['euler\'s formula', 'complex exponential', 'e^itheta'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-cplx-de-moivre',
          name: 'De Moivre\'s Theorem',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Powers and Roots',
          expression: '(cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)',
          latex: '(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)',
          symbols: [
            { symbol: 'n', meaning: 'Integer (or rational number for roots)' },
            { symbol: '\\theta', meaning: 'Angle parameter' }
          ],
          explanation: 'Allows direct computation of integer powers and nth roots of complex numbers by multiplying arguments.',
          conditions: 'True for all integers n. For rational n = p/q, gives one of the q distinct values of the q-th roots.',
          keywords: ['de moivre', 'powers of complex numbers', 'roots of unity'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-cplx-polar-product',
          name: 'Product of Complex Numbers in Polar Form',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Polar Operations',
          expression: 'z_1 z_2 = r_1 r_2 [cos(θ_1 + θ_2) + i sin(θ_1 + θ_2)]',
          latex: 'z_1 z_2 = r_1 r_2 [\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)]',
          symbols: [
            { symbol: 'r_1, r_2', meaning: 'Moduli |z_1| and |z_2|' },
            { symbol: '\\theta_1, \\theta_2', meaning: 'Arguments of z_1 and z_2' }
          ],
          explanation: 'Multiplication in the complex plane magnifies distances by the product of moduli and rotates vectors by the sum of angles: |z_1 z_2| = |z_1||z_2| and arg(z_1 z_2) = arg(z_1) + arg(z_2).',
          conditions: 'Valid for all complex numbers.',
          keywords: ['polar product', 'rotation', 'multiplication in polar form'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-cplx-polar-quotient',
          name: 'Quotient of Complex Numbers in Polar Form',
          subject: 'mathematics',
          chapter: 'Complex Numbers',
          topic: 'Polar Operations',
          expression: 'z_1 / z_2 = (r_1 / r_2) [cos(θ_1 - θ_2) + i sin(θ_1 - θ_2)]',
          latex: '\\frac{z_1}{z_2} = \\frac{r_1}{r_2}[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)]',
          symbols: [
            { symbol: 'r_1 / r_2', meaning: 'Modulus of quotient |z_1| / |z_2|' },
            { symbol: '\\theta_1 - \\theta_2', meaning: 'Argument of quotient: difference of arguments' }
          ],
          explanation: 'Division divides the moduli and subtracts the divisor argument: |z_1 / z_2| = |z_1|/|z_2| and arg(z_1 / z_2) = arg(z_1) - arg(z_2).',
          conditions: 'z_2 ≠ 0 (r_2 > 0).',
          keywords: ['polar quotient', 'division in polar form', 'complex division'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    }
  ]
};

