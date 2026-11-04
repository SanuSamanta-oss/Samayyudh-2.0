import type { AcademicLevel } from '@/types/formulas';

export const division5Vectors3D: AcademicLevel = {
  id: 'math-div-5',
  title: 'Vectors and Three-Dimensional Geometry',
  shortTitle: 'Vectors & 3D',
  description: 'Vector spaces: dot & cross products, projections, triple products, direction cosines/ratios, 3D coordinate geometry, planes, and skew line distances.',
  levelOrder: 5,
  chapters: [
    {
      id: 'm5-dot-cross-products',
      number: 1,
      title: 'Dot and Cross Products',
      description: 'Orthogonal component representations, scalar and vector products, geometric projections, scalar triple products (volumes), and vector triple expansions.',
      formulas: [
        {
          id: 'm-vec-representation',
          name: 'Cartesian Vector Representation in 3D',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Vector Foundations',
          expression: 'A = a_1 î + a_2 ĵ + a_3 k̂',
          latex: '\\vec{A}=a_1\\hat{i}+a_2\\hat{j}+a_3\\hat{k}',
          symbols: [
            { symbol: '\\vec{A}', meaning: 'Three-dimensional vector' },
            { symbol: 'a_1, a_2, a_3', meaning: 'Scalar components along the x, y, and z axes' },
            { symbol: '\\hat{i}, \\hat{j}, \\hat{k}', meaning: 'Standard orthonormal basis unit vectors' }
          ],
          explanation: 'Standard orthogonal coordinate decomposition of a vector in three-dimensional Euclidean space ℝ³.',
          conditions: 'Components are real numbers.',
          keywords: ['vector representation', 'i j k', 'unit vectors', 'cartesian vector'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-vec-magnitude',
          name: 'Magnitude (Norm) of 3D Vector',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Vector Foundations',
          expression: '|A| = √(a_1^2 + a_2^2 + a_3^2)',
          latex: '|\\vec{A}|=\\sqrt{a_1^2+a_2^2+a_3^2}',
          symbols: [
            { symbol: '|\\vec{A}|', meaning: 'Euclidean norm / length of vector A' },
            { symbol: 'a_1, a_2, a_3', meaning: 'Cartesian scalar components' }
          ],
          explanation: 'Calculates the length of vector A from the origin using the 3D Pythagorean theorem.',
          conditions: '|A| ≥ 0; equals 0 if and only if A is the zero vector.',
          keywords: ['magnitude', 'vector length', 'norm', 'euclidean norm'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-vec-dot-product-geometric',
          name: 'Dot (Scalar) Product Geometric Definition',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Dot Product',
          expression: 'A · B = |A| |B| cos θ',
          latex: '\\vec{A}\\cdot\\vec{B}=|\\vec{A}||\\vec{B}|\\cos\\theta',
          symbols: [
            { symbol: '\\vec{A}\\cdot\\vec{B}', meaning: 'Scalar dot product (inner product)' },
            { symbol: '\\theta', meaning: 'Angle between the two vectors (0 ≤ θ ≤ π)' },
            { symbol: '|\\vec{A}|, |\\vec{B}|', meaning: 'Magnitudes of vectors A and B' }
          ],
          explanation: 'Computes the scalar product measuring directional alignment; zero if and only if vectors are perpendicular (orthogonal).',
          conditions: 'Commutative: A · B = B · A.',
          keywords: ['dot product', 'scalar product', 'cos theta', 'inner product'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-vec-dot-product-components',
          name: 'Component Form of Dot Product',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Dot Product',
          expression: 'A · B = a_1 b_1 + a_2 b_2 + a_3 b_3',
          latex: '\\vec{A}\\cdot\\vec{B}=a_1b_1+a_2b_2+a_3b_3',
          symbols: [
            { symbol: 'a_1, a_2, a_3', meaning: 'Components of vector A' },
            { symbol: 'b_1, b_2, b_3', meaning: 'Components of vector B' }
          ],
          explanation: 'Algebraic computation of dot product by summing products of corresponding Cartesian coordinates.',
          conditions: 'Valid in standard orthonormal basis where î · î = 1 and î · ĵ = 0.',
          keywords: ['component dot product', 'a1 b1 + a2 b2 + a3 b3', 'inner product'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-vec-cross-product-magnitude',
          name: 'Magnitude of Cross (Vector) Product',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Cross Product',
          expression: '|A × B| = |A| |B| sin θ',
          latex: '|\\vec{A}\\times\\vec{B}|=|\\vec{A}||\\vec{B}|\\sin\\theta',
          symbols: [
            { symbol: '|\\vec{A}\\times\\vec{B}|', meaning: 'Magnitude of the cross product' },
            { symbol: '\\theta', meaning: 'Angle between vectors (0 ≤ θ ≤ π)' }
          ],
          explanation: 'Geometrically equals the area of the parallelogram spanned by vectors A and B in 3D space.',
          conditions: 'Zero if vectors are parallel or collinear (θ = 0 or π).',
          keywords: ['cross product magnitude', 'parallelogram area', 'sin theta'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-vec-cross-product-determinant',
          name: 'Cross Product via Determinant',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Cross Product',
          expression: 'A × B = |[î, ĵ, k̂], [a_1, a_2, a_3], [b_1, b_2, b_3]|',
          latex: '\\vec{A}\\times\\vec{B}=\\begin{vmatrix}\\hat{i}&\\hat{j}&\\hat{k}\\\\a_1&a_2&a_3\\\\b_1&b_2&b_3\\end{vmatrix}',
          symbols: [
            { symbol: '\\vec{A}\\times\\vec{B}', meaning: 'Vector perpendicular to both A and B following right-hand rule' }
          ],
          explanation: 'Formal 3 × 3 determinant generating the orthogonal cross product vector (a_2 b_3 - a_3 b_2)î - (a_1 b_3 - a_3 b_1)ĵ + (a_1 b_2 - a_2 b_1)k̂.',
          conditions: 'Anti-commutative: A × B = -(B × A).',
          keywords: ['cross product determinant', 'vector product', 'right hand rule'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-vec-projection',
          name: 'Vector Projection of A onto B',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Projections',
          expression: 'proj_B A = [(A · B) / |B|^2] B',
          latex: '\\operatorname{proj}_{\\vec{B}}\\vec{A}=\\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{B}|^2}\\vec{B}',
          symbols: [
            { symbol: '\\operatorname{proj}_{\\vec{B}}\\vec{A}', meaning: 'Vector shadow of A along direction of B' },
            { symbol: '\\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{B}|}', meaning: 'Scalar projection (component length)' },
            { symbol: '\\frac{\\vec{B}}{|\\vec{B}|}', meaning: 'Unit vector in direction of B' }
          ],
          explanation: 'Decomposes vector A into its parallel component along B; the orthogonal rejection is A - proj_B A.',
          conditions: 'B ≠ 0.',
          keywords: ['vector projection', 'shadow', 'scalar projection', 'orthogonal decomposition'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-vec-scalar-triple-product',
          name: 'Scalar Triple Product (Box Product)',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Triple Products',
          expression: '[A B C] = A · (B × C)',
          latex: '\\vec{A}\\cdot(\\vec{B}\\times\\vec{C})',
          alternateLatex: ['[\\vec{A}\\;\\vec{B}\\;\\vec{C}] = \\begin{vmatrix}a_1&a_2&a_3\\\\b_1&b_2&b_3\\\\c_1&c_2&c_3\\end{vmatrix}'],
          symbols: [
            { symbol: '\\vec{A}\\cdot(\\vec{B}\\times\\vec{C})', meaning: 'Scalar triple product' }
          ],
          explanation: 'Computes the signed volume of the parallelepiped formed by coterminous vectors A, B, and C. Three vectors are coplanar if and only if their scalar triple product is zero.',
          conditions: 'Invariant under cyclic permutations: A · (B × C) = B · (C × A) = C · (A × B).',
          keywords: ['scalar triple product', 'box product', 'parallelepiped volume', 'coplanar vectors'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-vec-vector-triple-product',
          name: 'Vector Triple Product (BAC-CAB Rule)',
          subject: 'mathematics',
          chapter: 'Dot and Cross Products',
          topic: 'Triple Products',
          expression: 'A × (B × C) = B(A · C) - C(A · B)',
          latex: '\\vec{A}\\times(\\vec{B}\\times\\vec{C})=\\vec{B}(\\vec{A}\\cdot\\vec{C})-\\vec{C}(\\vec{A}\\cdot\\vec{B})',
          symbols: [
            { symbol: '\\vec{A}\\times(\\vec{B}\\times\\vec{C})', meaning: 'Vector triple productlying in the plane of B and C' }
          ],
          explanation: 'Fundamental expansion theorem expressing the double cross product as a linear combination of B and C; mnemonic is "BAC minus CAB".',
          conditions: 'Non-associative: A × (B × C) ≠ (A × B) × C in general.',
          keywords: ['vector triple product', 'BAC-CAB rule', 'vector expansion'],
          difficulty: 'advanced',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm5-direction-cosines-ratios',
      number: 2,
      title: 'Direction Cosines and Direction Ratios',
      description: 'Direction angles α, β, γ, direction cosines l, m, n, normalizing direction ratios, angular separation of 3D lines, distance, and 3D section formulas.',
      formulas: [
        {
          id: 'm-dc-cosines-definition',
          name: 'Direction Cosines Definition',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: 'Direction Cosines',
          expression: 'l = cos α, m = cos β, n = cos γ',
          latex: 'l=\\cos\\alpha,\\quad m=\\cos\\beta,\\quad n=\\cos\\gamma',
          symbols: [
            { symbol: 'l, m, n', meaning: 'Direction cosines of a directed line' },
            { symbol: '\\alpha, \\beta, \\gamma', meaning: 'Angles subtended with positive x, y, and z axes' }
          ],
          explanation: 'Components of the unit vector aligned along a directed line in three-dimensional space.',
          conditions: 'Angles lie in [0, π].',
          keywords: ['direction cosines', 'l m n', 'cos alpha cos beta cos gamma'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dc-identity',
          name: 'Fundamental Direction Cosines Identity',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: 'Direction Cosines',
          expression: 'l^2 + m^2 + n^2 = 1',
          latex: 'l^2+m^2+n^2=1',
          symbols: [
            { symbol: 'l, m, n', meaning: 'Direction cosines' }
          ],
          explanation: 'Direct consequence that the unit vector û = l î + m ĵ + n k̂ has unit norm (|û|^2 = 1).',
          conditions: 'Universal identity for any straight line or vector in 3D Euclidean space.',
          keywords: ['l^2 + m^2 + n^2 = 1', 'direction cosine identity', 'unit norm'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dc-direction-ratios',
          name: 'Direction Ratios Definition',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: 'Direction Ratios',
          expression: 'a : b : c',
          latex: 'a:b:c',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Any numbers proportional to direction cosines: l/a = m/b = n/c = k' }
          ],
          explanation: 'A convenient set of numbers proportional to direction cosines, removing the unit length constraint for ease of calculation.',
          conditions: 'a, b, c not all zero.',
          keywords: ['direction ratios', 'proportional direction', 'a:b:c'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dc-from-ratios',
          name: 'Direction Cosines from Direction Ratios',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: 'Direction Cosines',
          expression: 'l = a/√(a^2+b^2+c^2), m = b/√(a^2+b^2+c^2), n = c/√(a^2+b^2+c^2)',
          latex: 'l=\\frac{a}{\\sqrt{a^2+b^2+c^2}},\\quad m=\\frac{b}{\\sqrt{a^2+b^2+c^2}},\\quad n=\\frac{c}{\\sqrt{a^2+b^2+c^2}}',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Known direction ratios' },
            { symbol: '\\sqrt{a^2+b^2+c^2}', meaning: 'Normalizing Euclidean magnitude' }
          ],
          explanation: 'Converts unnormalized direction ratios into normalized direction cosines.',
          conditions: 'a^2 + b^2 + c^2 > 0.',
          keywords: ['normalizing ratios', 'direction cosines from ratios'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dc-angle-between-vectors',
          name: 'Angle Between Two 3D Vectors',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: 'Angles in 3D',
          expression: 'cos θ = (A · B) / (|A| |B|)',
          latex: '\\cos\\theta=\\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{A}||\\vec{B}|}',
          alternateLatex: ['\\cos\\theta = l_1 l_2 + m_1 m_2 + n_1 n_2'],
          symbols: [
            { symbol: '\\theta', meaning: 'Angle between vectors in [0, π]' },
            { symbol: 'l_1, m_1, n_1', meaning: 'Direction cosines of line 1' },
            { symbol: 'l_2, m_2, n_2', meaning: 'Direction cosines of line 2' }
          ],
          explanation: 'Computes the spatial angle between two vectors or straight lines using the dot product formula.',
          conditions: 'Vectors non-zero. Lines are perpendicular if l_1 l_2 + m_1 m_2 + n_1 n_2 = 0.',
          keywords: ['angle between vectors 3D', 'cos theta 3D', 'directional angle'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dc-distance-two-points',
          name: 'Distance Between Two 3D Points',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: '3D Metric Formulas',
          expression: 'd = √((x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2)',
          latex: 'd=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}',
          symbols: [
            { symbol: 'd', meaning: 'Euclidean distance in 3D space' },
            { symbol: '(x_1, y_1, z_1), (x_2, y_2, z_2)', meaning: 'Spatial coordinates of the two points' }
          ],
          explanation: 'Standard Euclidean metric formula generalized to three dimensions.',
          conditions: 'd ≥ 0.',
          keywords: ['3D distance', 'distance between points', 'euclidean distance 3D'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dc-internal-section',
          name: 'Internal Section Formula in 3D',
          subject: 'mathematics',
          chapter: 'Direction Cosines and Direction Ratios',
          topic: '3D Metric Formulas',
          expression: 'P = ((m x_2 + n x_1)/(m + n), (m y_2 + n y_1)/(m + n), (m z_2 + n z_1)/(m + n))',
          latex: 'P=\\left(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n},\\frac{mz_2+nz_1}{m+n}\\right)',
          symbols: [
            { symbol: 'P', meaning: 'Point dividing segment joining (x_1, y_1, z_1) and (x_2, y_2, z_2)' },
            { symbol: 'm : n', meaning: 'Internal division ratio (m > 0, n > 0)' }
          ],
          explanation: 'Calculates the spatial coordinates of the point dividing a directed 3D line segment in the ratio m : n internally.',
          conditions: 'm + n ≠ 0. For midpoint, m = n = 1: ((x_1+x_2)/2, (y_1+y_2)/2, (z_1+z_2)/2).',
          keywords: ['section formula 3D', 'internal division', 'midpoint 3D'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm5-planes-distances',
      number: 3,
      title: 'Planes and Shortest Distance Between Lines',
      description: 'Cartesian and vector plane equations, point-plane distances, dihedral angles, symmetric line equations, skew lines, and parallel line distances.',
      formulas: [
        {
          id: 'm-plane-general-equation',
          name: 'General Linear Equation of a Plane',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Plane Equations',
          expression: 'ax + by + cz + d = 0',
          latex: 'ax+by+cz+d=0',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Direction ratios of normal vector n⃗ = a î + b ĵ + c k̂' },
            { symbol: 'd', meaning: 'Constant offset parameter' }
          ],
          explanation: 'Standard linear equation representing a flat 2D plane embedded in 3D space, with normal vector n⃗ = (a, b, c).',
          conditions: 'a, b, c cannot all be simultaneously zero (a^2 + b^2 + c^2 > 0).',
          keywords: ['general plane', 'ax + by + cz + d = 0', 'normal vector'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-plane-point-normal',
          name: 'Equation of Plane Through a Point',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Plane Equations',
          expression: 'a(x - x_1) + b(y - y_1) + c(z - z_1) = 0',
          latex: 'a(x-x_1)+b(y-y_1)+c(z-z_1)=0',
          symbols: [
            { symbol: '(x_1, y_1, z_1)', meaning: 'Known point lying on the plane' },
            { symbol: 'a, b, c', meaning: 'Direction ratios of normal vector perpendicular to the plane' }
          ],
          explanation: 'Expresses that any vector in the plane from (x_1, y_1, z_1) to (x, y, z) is perpendicular to the normal vector n⃗: n⃗ · (r⃗ - r⃗_1) = 0.',
          conditions: 'Normal vector n⃗ ≠ 0.',
          keywords: ['plane through point', 'point normal form', 'dot product plane'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-plane-intercept-form',
          name: 'Intercept Form of Plane Equation',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Plane Equations',
          expression: 'x / a + y / b + z / c = 1',
          latex: '\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1',
          symbols: [
            { symbol: 'a, b, c', meaning: 'Non-zero intercepts on x, y, and z axes: (a, 0, 0), (0, b, 0), (0, 0, c)' }
          ],
          explanation: 'Equation of a plane intersecting the three coordinate axes at distances a, b, and c from the origin.',
          conditions: 'a ≠ 0, b ≠ 0, c ≠ 0 (plane does not pass through origin).',
          keywords: ['intercept form plane', 'x/a + y/b + z/c = 1', 'axis intercepts'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-plane-point-to-plane-distance',
          name: 'Distance from Point to Plane',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Plane Distance Metrics',
          expression: 'D = |a x_1 + b y_1 + c z_1 + d| / √(a^2 + b^2 + c^2)',
          latex: 'D=\\frac{|ax_1+by_1+cz_1+d|}{\\sqrt{a^2+b^2+c^2}}',
          symbols: [
            { symbol: 'D', meaning: 'Shortest (perpendicular) distance from point to plane' },
            { symbol: '(x_1, y_1, z_1)', meaning: 'Coordinates of external point' },
            { symbol: 'ax + by + cz + d = 0', meaning: 'Equation of the plane' }
          ],
          explanation: 'Computes the shortest perpendicular distance from a 3D point to a plane by projecting the displacement onto the unit normal vector.',
          conditions: 'a^2 + b^2 + c^2 > 0.',
          keywords: ['distance point to plane', 'perpendicular distance 3D', 'shortest distance'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-plane-angle-between-planes',
          name: 'Angle Between Two Planes (Dihedral Angle)',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Angles in 3D',
          expression: 'cos θ = |a_1 a_2 + b_1 b_2 + c_1 c_2| / [√(a_1^2 + b_1^2 + c_1^2) √(a_2^2 + b_2^2 + c_2^2)]',
          latex: '\\cos\\theta=\\frac{|a_1a_2+b_1b_2+c_1c_2|}{\\sqrt{a_1^2+b_1^2+c_1^2}\\sqrt{a_2^2+b_2^2+c_2^2}}',
          symbols: [
            { symbol: '\\theta', meaning: 'Acute dihedral angle between two intersecting planes' },
            { symbol: '(a_1, b_1, c_1), (a_2, b_2, c_2)', meaning: 'Normal vectors n⃗_1 and n⃗_2 of the respective planes' }
          ],
          explanation: 'The dihedral angle between two planes equals the angle between their normal vectors.',
          conditions: 'Planes are perpendicular if a_1 a_2 + b_1 b_2 + c_1 c_2 = 0.',
          keywords: ['angle between planes', 'dihedral angle', 'normal vectors dot product'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-line-symmetric-equation-3d',
          name: 'Symmetric Equation of a Straight Line in 3D',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: '3D Lines',
          expression: '(x - x_1) / a = (y - y_1) / b = (z - z_1) / c',
          latex: '\\frac{x-x_1}{a}=\\frac{y-y_1}{b}=\\frac{z-z_1}{c}',
          symbols: [
            { symbol: '(x_1, y_1, z_1)', meaning: 'A point through which the line passes' },
            { symbol: 'a, b, c', meaning: 'Direction ratios of vector parallel to the line (d⃗ = a î + b ĵ + c k̂)' }
          ],
          explanation: 'Canonical Cartesian representation of a straight line in 3D space equating parameters λ from vector form r⃗ = a⃗ + λ d⃗.',
          conditions: 'a, b, c not all zero. If any denominator is zero, corresponding numerator is set to 0.',
          keywords: ['symmetric form line', 'cartesian line 3D', 'direction ratios line'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-line-shortest-distance-skew',
          name: 'Shortest Distance Between Skew Lines',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Skew Lines',
          expression: 'd = |(a_2 - a_1) · (b_1 × b_2)| / |b_1 × b_2|',
          latex: 'd=\\frac{|(\\vec{a}_2-\\vec{a}_1)\\cdot(\\vec{b}_1\\times\\vec{b}_2)|}{|\\vec{b}_1\\times\\vec{b}_2|}',
          symbols: [
            { symbol: 'd', meaning: 'Shortest distance between two non-parallel non-intersecting lines' },
            { symbol: '\\vec{a}_1, \\vec{a}_2', meaning: 'Position vectors of points on lines L_1 and L_2' },
            { symbol: '\\vec{b}_1, \\vec{b}_2', meaning: 'Direction vectors of lines L_1 and L_2' }
          ],
          explanation: 'Projects the connecting vector (a⃗_2 - a⃗_1) onto the common perpendicular unit vector (b⃗_1 × b⃗_2)/|b⃗_1 × b⃗_2|; if d = 0, lines intersect.',
          conditions: 'b⃗_1 × b⃗_2 ≠ 0 (lines must be non-parallel).',
          keywords: ['shortest distance skew lines', 'skew lines', 'common perpendicular', 'box product distance'],
          difficulty: 'advanced',
          status: 'verified'
        },
        {
          id: 'm-line-distance-parallel-lines',
          name: 'Distance Between Parallel Lines in 3D',
          subject: 'mathematics',
          chapter: 'Planes and Shortest Distance Between Lines',
          topic: 'Parallel Lines',
          expression: 'd = |(a_2 - a_1) × b| / |b|',
          latex: 'd=\\frac{|(\\vec{a}_2-\\vec{a}_1)\\times\\vec{b}|}{|\\vec{b}|}',
          symbols: [
            { symbol: 'd', meaning: 'Perpendicular distance between parallel lines' },
            { symbol: '\\vec{b}', meaning: 'Shared direction vector of both lines' },
            { symbol: '\\vec{a}_1, \\vec{a}_2', meaning: 'Points on each parallel line' }
          ],
          explanation: 'Calculates the height of the parallelogram formed by direction vector b⃗ and connecting vector (a⃗_2 - a⃗_1).',
          conditions: 'b⃗ ≠ 0.',
          keywords: ['distance parallel lines 3D', 'parallel lines distance'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    }
  ]
};

