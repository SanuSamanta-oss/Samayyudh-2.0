import type { AcademicLevel } from '@/types/formulas';

export const division4CoordinateGeometry: AcademicLevel = {
  id: 'math-div-4',
  title: 'Coordinate Geometry and Conic Sections',
  shortTitle: 'Coordinate Geometry',
  description: 'Cartesian geometry: linear equations, point-line distances, circle geometry, tangents, chords, and conic sections (parabolas, ellipses, hyperbolas).',
  levelOrder: 4,
  chapters: [
    {
      id: 'm4-straight-lines',
      number: 1,
      title: 'Straight Lines and Slopes',
      description: 'Gradient, standard algebraic line forms, angular separation, parallel/perpendicular conditions, and perpendicular distance from a point.',
      formulas: [
        {
          id: 'm-line-slope-two-points',
          name: 'Slope (Gradient) Between Two Points',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Slope and Inclination',
          expression: 'm = (y_2 - y_1) / (x_2 - x_1)',
          latex: 'm=\\frac{y_2-y_1}{x_2-x_1}',
          symbols: [
            { symbol: 'm', meaning: 'Slope / gradient of line (m = tan θ)' },
            { symbol: '(x_1, y_1), (x_2, y_2)', meaning: 'Cartesian coordinates of two distinct points on the line' }
          ],
          explanation: 'Measures the steepness and direction of a non-vertical line as the ratio of vertical change (rise) to horizontal change (run).',
          conditions: 'x_1 ≠ x_2 (vertical lines have undefined slope).',
          keywords: ['slope', 'gradient', 'rise over run', 'straight line'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-point-slope-form',
          name: 'Point-Slope Form of Line Equation',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Forms of Line Equation',
          expression: 'y - y_1 = m(x - x_1)',
          latex: 'y-y_1=m(x-x_1)',
          symbols: [
            { symbol: 'm', meaning: 'Slope of line' },
            { symbol: '(x_1, y_1)', meaning: 'Coordinates of known point on the line' }
          ],
          explanation: 'Standard formulation to write the equation of a straight line when one point and the slope are known.',
          conditions: 'Non-vertical line.',
          keywords: ['point slope form', 'line equation', 'tangent line form'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-slope-intercept-form',
          name: 'Slope-Intercept Form',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Forms of Line Equation',
          expression: 'y = mx + c',
          latex: 'y=mx+c',
          symbols: [
            { symbol: 'm', meaning: 'Slope of line' },
            { symbol: 'c', meaning: 'y-intercept (line passes through (0, c))' }
          ],
          explanation: 'Canonical explicit form of a linear equation expressing y as a function of x.',
          conditions: 'Non-vertical line.',
          keywords: ['slope intercept form', 'y = mx + c', 'intercept'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-two-point-form',
          name: 'Two-Point Form of Line Equation',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Forms of Line Equation',
          expression: '(y - y_1) / (y_2 - y_1) = (x - x_1) / (x_2 - x_1)',
          latex: '\\frac{y-y_1}{y_2-y_1}=\\frac{x-x_1}{x_2-x_1}',
          symbols: [
            { symbol: '(x_1, y_1), (x_2, y_2)', meaning: 'Two distinct points defining the unique straight line' }
          ],
          explanation: 'Equation of the unique straight line determined by two distinct points on the plane.',
          conditions: 'x_1 ≠ x_2 and y_1 ≠ y_2.',
          keywords: ['two point form', 'line through two points'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-intercept-form',
          name: 'Intercept Form of Line Equation',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Forms of Line Equation',
          expression: 'x / a + y / b = 1',
          latex: '\\frac{x}{a}+\\frac{y}{b}=1',
          symbols: [
            { symbol: 'a', meaning: 'Non-zero x-intercept (point (a, 0))' },
            { symbol: 'b', meaning: 'Non-zero y-intercept (point (0, b))' }
          ],
          explanation: 'Symmetric formulation highlighting the points where the line intersects both Cartesian coordinate axes.',
          conditions: 'a ≠ 0, b ≠ 0 (line does not pass through origin and is neither horizontal nor vertical).',
          keywords: ['intercept form', 'x/a + y/b = 1', 'axis intercepts'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-general-equation',
          name: 'General Form of Linear Equation',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Forms of Line Equation',
          expression: 'ax + by + c = 0',
          latex: 'ax+by+c=0',
          symbols: [
            { symbol: 'a, b', meaning: 'Coefficients such that a^2 + b^2 ≠ 0' },
            { symbol: 'c', meaning: 'Constant term' }
          ],
          explanation: 'Universal linear equation representing any line in the 2D plane including vertical lines (b = 0). Slope is m = -a/b when b ≠ 0.',
          conditions: 'a and b cannot both be 0.',
          keywords: ['general equation of line', 'ax + by + c = 0'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-angle-between-lines',
          name: 'Angle Between Two Straight Lines',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Intersections and Angles',
          expression: 'tan θ = |(m_1 - m_2) / (1 + m_1 m_2)|',
          latex: '\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|',
          symbols: [
            { symbol: '\\theta', meaning: 'Acute angle between the two lines (0 ≤ θ ≤ π/2)' },
            { symbol: 'm_1, m_2', meaning: 'Slopes of the two intersecting lines' }
          ],
          explanation: 'Calculates the acute angle between two lines with known slopes using the tangent subtraction identity.',
          conditions: '1 + m_1 m_2 ≠ 0 (if 1 + m_1 m_2 = 0, lines are mutually perpendicular).',
          keywords: ['angle between lines', 'tan theta', 'intersection angle'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-line-parallel-condition',
          name: 'Parallel Lines Condition',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Relative Orientation',
          expression: 'm_1 = m_2',
          latex: 'm_1=m_2',
          symbols: [
            { symbol: 'm_1, m_2', meaning: 'Slopes of the two lines' }
          ],
          explanation: 'Two non-vertical lines are parallel if and only if their slopes are identical (equal inclination angles).',
          conditions: 'Lines must be non-vertical (for vertical lines, both slopes are undefined).',
          keywords: ['parallel lines', 'm1 = m2', 'equal slopes'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-perpendicular-condition',
          name: 'Perpendicular (Orthogonal) Lines Condition',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Relative Orientation',
          expression: 'm_1 m_2 = -1',
          latex: 'm_1m_2=-1',
          symbols: [
            { symbol: 'm_1, m_2', meaning: 'Slopes of the two intersecting lines' }
          ],
          explanation: 'Two non-vertical lines are perpendicular (meet at 90°) if and only if their slopes are negative reciprocals: m_2 = -1/m_1.',
          conditions: 'Neither line is vertical or horizontal (perpendicularity between horizontal y = c and vertical x = k is trivial).',
          keywords: ['perpendicular lines', 'm1 m2 = -1', 'orthogonality'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-line-point-to-line-distance',
          name: 'Perpendicular Distance from Point to Line',
          subject: 'mathematics',
          chapter: 'Straight Lines and Slopes',
          topic: 'Distance Metrics',
          expression: 'd = |a x_1 + b y_1 + c| / √(a^2 + b^2)',
          latex: 'd=\\frac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}',
          symbols: [
            { symbol: 'd', meaning: 'Shortest (perpendicular) Euclidean distance from point to line' },
            { symbol: '(x_1, y_1)', meaning: 'Coordinates of external point' },
            { symbol: 'ax + by + c = 0', meaning: 'General equation of the line' }
          ],
          explanation: 'Calculates the shortest distance from an arbitrary point P(x_1, y_1) to a straight line ax + by + c = 0.',
          conditions: 'a^2 + b^2 > 0. If d = 0, the point lies on the line.',
          keywords: ['distance point to line', 'perpendicular distance', 'shortest distance'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm4-circles-tangents',
      number: 2,
      title: 'Circles and Tangents',
      description: 'Standard and general second-degree circular equations, radius, center, diameter forms, tangent lines, and chord lengths.',
      formulas: [
        {
          id: 'm-circ-standard-form',
          name: 'Standard Central Circle Equation',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Equations',
          expression: '(x - h)^2 + (y - k)^2 = r^2',
          latex: '(x-h)^2+(y-k)^2=r^2',
          symbols: [
            { symbol: '(h, k)', meaning: 'Coordinates of the center of the circle' },
            { symbol: 'r', meaning: 'Radius of the circle (r > 0)' },
            { symbol: '(x, y)', meaning: 'Arbitrary point on the circular circumference' }
          ],
          explanation: 'Locus of points equidistant (distance r) from a fixed center (h, k) in the Euclidean plane.',
          conditions: 'r > 0 (if r = 0, represents a single point circle (h, k)).',
          keywords: ['standard circle', 'center radius form', '(x-h)^2 + (y-k)^2 = r^2'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-circ-origin-centre',
          name: 'Circle Centred at Origin',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Equations',
          expression: 'x^2 + y^2 = r^2',
          latex: 'x^2+y^2=r^2',
          symbols: [
            { symbol: 'r', meaning: 'Radius of the circle centered at (0, 0)' }
          ],
          explanation: 'Special case of the standard circle with center located at the origin (0, 0).',
          conditions: 'r > 0.',
          keywords: ['circle origin', 'x^2 + y^2 = r^2'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-circ-general-equation',
          name: 'General Second-Degree Equation of a Circle',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Equations',
          expression: 'x^2 + y^2 + 2gx + 2fy + c = 0',
          latex: 'x^2+y^2+2gx+2fy+c=0',
          symbols: [
            { symbol: 'g, f, c', meaning: 'Real constants parameterizing the circle' }
          ],
          explanation: 'Standard expanded form of any circle equation characterized by equal quadratic coefficients for x^2 and y^2 and no cross xy term.',
          conditions: 'g^2 + f^2 - c ≥ 0 for a real circle.',
          keywords: ['general circle', 'x^2 + y^2 + 2gx + 2fy + c = 0'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-circ-general-centre',
          name: 'Center Coordinates of General Circle',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Elements',
          expression: 'Center = (-g, -f)',
          latex: '(-g,-f)',
          symbols: [
            { symbol: '-g', meaning: 'x-coordinate of center: -(coefficient of x)/2' },
            { symbol: '-f', meaning: 'y-coordinate of center: -(coefficient of y)/2' }
          ],
          explanation: 'Determines the center of the general circle by completing the square.',
          conditions: 'Derived directly from x^2 + y^2 + 2gx + 2fy + c = 0.',
          keywords: ['circle center', '(-g, -f)', 'general circle center'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-circ-general-radius',
          name: 'Radius of General Circle',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Elements',
          expression: 'r = √(g^2 + f^2 - c)',
          latex: 'r=\\sqrt{g^2+f^2-c}',
          symbols: [
            { symbol: 'r', meaning: 'Radius of circle' },
            { symbol: 'g, f, c', meaning: 'Parameters from general equation' }
          ],
          explanation: 'Computes radius from general equation parameters: real if g^2 + f^2 - c > 0, point circle if equal to 0, imaginary if negative.',
          conditions: 'g^2 + f^2 - c > 0.',
          keywords: ['circle radius', 'root(g^2 + f^2 - c)'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-circ-diameter-endpoints',
          name: 'Circle with Given Diameter Endpoints',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Circle Equations',
          expression: '(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0',
          latex: '(x-x_1)(x-x_2)+(y-y_1)(y-y_2)=0',
          symbols: [
            { symbol: '(x_1, y_1), (x_2, y_2)', meaning: 'Endpoints of a diameter of the circle' }
          ],
          explanation: 'Derived from Thales\' theorem: the angle subtended by a diameter at any point (x, y) on the circle is a right angle (vectors are orthogonal, dot product = 0).',
          conditions: '(x_1, y_1) ≠ (x_2, y_2).',
          keywords: ['diameter form', 'thales theorem', 'circle endpoints'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-circ-tangent-origin',
          name: 'Tangent to Origin-Centred Circle at (x₁, y₁)',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Tangents to Circle',
          expression: 'x x_1 + y y_1 = r^2',
          latex: 'xx_1+yy_1=r^2',
          symbols: [
            { symbol: '(x_1, y_1)', meaning: 'Point of tangency lying on the circle x^2 + y^2 = r^2' },
            { symbol: 'r', meaning: 'Radius of circle' }
          ],
          explanation: 'Equation of the straight line tangent to the circle x^2 + y^2 = r^2 at point P(x_1, y_1), perpendicular to the radius vector.',
          conditions: 'x_1^2 + y_1^2 = r^2.',
          keywords: ['tangent to circle', 'T = 0', 'xx1 + yy1 = r^2'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-circ-tangent-general',
          name: 'Tangent to General Circle at (x₁, y₁)',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Tangents to Circle',
          expression: 'x x_1 + y y_1 + g(x + x_1) + f(y + y_1) + c = 0',
          latex: 'xx_1+yy_1+g(x+x_1)+f(y+y_1)+c=0',
          symbols: [
            { symbol: '(x_1, y_1)', meaning: 'Point of tangency on the circle' },
            { symbol: 'g, f, c', meaning: 'General circle parameters' }
          ],
          explanation: 'Standard T = 0 substitution rule for quadrics (replacing x^2 → xx_1, 2x → x + x_1) providing tangent line at point on the circle.',
          conditions: 'Point (x_1, y_1) must satisfy the circle equation.',
          keywords: ['general tangent', 'T = 0 rule', 'tangent line'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-circ-tangent-length-external',
          name: 'Length of Tangent from External Point',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Tangents to Circle',
          expression: 'L = √(OP^2 - r^2)',
          latex: 'L=\\sqrt{OP^2-r^2}',
          alternateLatex: ['L = \\sqrt{S_1} = \\sqrt{x_1^2+y_1^2+2gx_1+2fy_1+c}'],
          symbols: [
            { symbol: 'L', meaning: 'Length of tangent segment from external point P to point of tangency' },
            { symbol: 'OP', meaning: 'Distance from circle center O to external point P' },
            { symbol: 'r', meaning: 'Radius of circle' }
          ],
          explanation: 'Calculated via the Pythagorean theorem in the right-angled triangle formed by center O, point of tangency T, and external point P.',
          conditions: 'OP > r (point P must lie outside the circle).',
          keywords: ['length of tangent', 'external point', 'root S1'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-circ-chord-length',
          name: 'Chord Length at Distance d from Center',
          subject: 'mathematics',
          chapter: 'Circles and Tangents',
          topic: 'Chords of Circle',
          expression: 'L = 2 √(r^2 - d^2)',
          latex: 'L=2\\sqrt{r^2-d^2}',
          symbols: [
            { symbol: 'L', meaning: 'Length of chord' },
            { symbol: 'r', meaning: 'Radius of circle' },
            { symbol: 'd', meaning: 'Perpendicular distance from circle center to chord line' }
          ],
          explanation: 'The perpendicular from the center bisects the chord into two right triangles of leg d and hypotenuse r.',
          conditions: 'd < r (if d = r, chord reduces to a tangent point of length 0).',
          keywords: ['chord length', 'perpendicular distance chord', '2 root(r^2 - d^2)'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm4-conic-sections',
      number: 3,
      title: 'Parabolas, Ellipses, and Hyperbolas',
      description: 'Conic section definitions via focus-directrix eccentricity e, standard quadratic forms, focal relations, latus rectum lengths, and asymptotes.',
      formulas: [
        {
          id: 'm-conic-parabola-standard',
          name: 'Standard Parabola Equation',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Parabola',
          expression: 'y^2 = 4ax',
          latex: 'y^2=4ax',
          symbols: [
            { symbol: 'a', meaning: 'Focal parameter (distance from vertex to focus)' },
            { symbol: '(x, y)', meaning: 'Points on the parabolic curve' }
          ],
          explanation: 'Locus of points equidistant from focus (a, 0) and vertical directrix line x = -a (eccentricity e = 1). Vertex at (0, 0), opens to the right.',
          conditions: 'a > 0.',
          keywords: ['standard parabola', 'y^2 = 4ax', 'conic section'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-parabola-focus',
          name: 'Focus of Standard Parabola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Parabola',
          expression: 'Focus = (a, 0)',
          latex: '(a,0)',
          symbols: [
            { symbol: 'a', meaning: 'Distance from vertex (0, 0) to focus' }
          ],
          explanation: 'The fixed point defining the parabola; rays emitted from the focus reflect parallel to the axis of symmetry.',
          conditions: 'For y^2 = 4ax with a > 0.',
          keywords: ['parabola focus', '(a, 0)'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-parabola-directrix',
          name: 'Directrix of Standard Parabola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Parabola',
          expression: 'x = -a',
          latex: 'x=-a',
          symbols: [
            { symbol: 'x = -a', meaning: 'Vertical line perpendicular to axis of symmetry' }
          ],
          explanation: 'Fixed line such that distance from any point on parabola to focus equals perpendicular distance to this line.',
          conditions: 'Distance from vertex to directrix equals distance from vertex to focus.',
          keywords: ['directrix', 'x = -a', 'parabola directrix'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-parabola-latus-rectum',
          name: 'Length of Latus Rectum of Parabola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Parabola',
          expression: 'Length of Latus Rectum = 4a',
          latex: '4a',
          symbols: [
            { symbol: '4a', meaning: 'Total width of focal chord perpendicular to symmetry axis' }
          ],
          explanation: 'Length of the focal chord passing through focus (a, 0) parallel to the directrix, joining points (a, 2a) and (a, -2a).',
          conditions: 'a > 0.',
          keywords: ['latus rectum', '4a', 'focal chord'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-ellipse-standard',
          name: 'Standard Ellipse Equation',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Ellipse',
          expression: 'x^2 / a^2 + y^2 / b^2 = 1, a > b > 0',
          latex: '\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\quad a>b>0',
          symbols: [
            { symbol: 'a', meaning: 'Semi-major axis length' },
            { symbol: 'b', meaning: 'Semi-minor axis length' }
          ],
          explanation: 'Locus of points where sum of distances to two foci (±ae, 0) is constant and equal to 2a (eccentricity 0 < e < 1).',
          conditions: 'a > b > 0.',
          keywords: ['ellipse equation', 'standard ellipse', 'major axis', 'minor axis'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-ellipse-eccentricity',
          name: 'Eccentricity of Ellipse',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Ellipse',
          expression: 'e = √(1 - b^2 / a^2)',
          latex: 'e=\\sqrt{1-\\frac{b^2}{a^2}}',
          symbols: [
            { symbol: 'e', meaning: 'Eccentricity parameter (0 < e < 1)' },
            { symbol: 'a, b', meaning: 'Semi-major and semi-minor axes' }
          ],
          explanation: 'Degree of elongation of the ellipse; as e → 0 ellipse approaches a circle; as e → 1 ellipse flattens into a line segment.',
          conditions: '0 < e < 1.',
          keywords: ['ellipse eccentricity', 'root(1 - b^2/a^2)'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-conic-ellipse-focal-relation',
          name: 'Focal Distance Relation of Ellipse',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Ellipse',
          expression: 'c^2 = a^2 - b^2',
          latex: 'c^2=a^2-b^2',
          symbols: [
            { symbol: 'c', meaning: 'Linear focal distance from center to each focus (c = ae)' },
            { symbol: 'a', meaning: 'Semi-major axis' },
            { symbol: 'b', meaning: 'Semi-minor axis' }
          ],
          explanation: 'Pythagorean relationship between semi-major axis, semi-minor axis, and focal distance in an ellipse.',
          conditions: 'a > b, with foci at (±c, 0).',
          keywords: ['focal relation', 'c^2 = a^2 - b^2', 'focal distance'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-conic-hyperbola-standard',
          name: 'Standard Hyperbola Equation',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Hyperbola',
          expression: 'x^2 / a^2 - y^2 / b^2 = 1',
          latex: '\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1',
          symbols: [
            { symbol: 'a', meaning: 'Semi-transverse axis length' },
            { symbol: 'b', meaning: 'Semi-conjugate axis length' }
          ],
          explanation: 'Locus of points where the absolute difference of distances to two fixed foci (±c, 0) is constant and equal to 2a (eccentricity e > 1).',
          conditions: 'Opens horizontally with vertices at (±a, 0).',
          keywords: ['hyperbola equation', 'standard hyperbola', 'transverse axis'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-conic-hyperbola-eccentricity',
          name: 'Eccentricity of Hyperbola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Hyperbola',
          expression: 'e = √(1 + b^2 / a^2)',
          latex: 'e=\\sqrt{1+\\frac{b^2}{a^2}}',
          symbols: [
            { symbol: 'e', meaning: 'Eccentricity (e > 1)' },
            { symbol: 'a, b', meaning: 'Transverse and conjugate semi-axes' }
          ],
          explanation: 'Eccentricity of a hyperbola is strictly greater than 1; for rectangular (equilateral) hyperbola a = b, e = √2.',
          conditions: 'e > 1.',
          keywords: ['hyperbola eccentricity', 'root(1 + b^2/a^2)', 'e > 1'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-conic-hyperbola-focal-relation',
          name: 'Focal Distance Relation of Hyperbola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Hyperbola',
          expression: 'c^2 = a^2 + b^2',
          latex: 'c^2=a^2+b^2',
          symbols: [
            { symbol: 'c', meaning: 'Focal distance from center to foci (c = ae)' },
            { symbol: 'a, b', meaning: 'Transverse and conjugate parameters' }
          ],
          explanation: 'Relates focal separation to the transverse and conjugate axes; foci lie at (±c, 0) outside the vertices.',
          conditions: 'c > a > 0.',
          keywords: ['c^2 = a^2 + b^2', 'hyperbola focal relation'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-conic-hyperbola-asymptotes',
          name: 'Asymptotes of Standard Hyperbola',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'Hyperbola',
          expression: 'y = ± (b / a) x',
          latex: 'y=\\pm\\frac{b}{a}x',
          symbols: [
            { symbol: 'b / a', meaning: 'Slopes of the two diagonal asymptotes' }
          ],
          explanation: 'Pair of straight lines passing through the center that the hyperbola branches approach asymptotically as x → ±∞.',
          conditions: 'Derived from x^2/a^2 - y^2/b^2 = 0.',
          keywords: ['hyperbola asymptotes', 'y = +- (b/a)x', 'diagonal asymptotes'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-conic-general-second-degree',
          name: 'General Second-Degree Conic Equation',
          subject: 'mathematics',
          chapter: 'Parabolas, Ellipses, and Hyperbolas',
          topic: 'General Conics',
          expression: 'Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0',
          latex: 'Ax^2+Bxy+Cy^2+Dx+Ey+F=0',
          symbols: [
            { symbol: 'A, B, C, D, E, F', meaning: 'Real polynomial coefficients' },
            { symbol: 'B^2 - 4AC', meaning: 'Discriminant classifying non-degenerate conics' }
          ],
          explanation: 'Universal quadratic equation in two variables representing all planar conics: parabola if B^2 - 4AC = 0, ellipse/circle if < 0, hyperbola if > 0.',
          conditions: 'Degeneracy classified by determinant of 3 × 3 matrix [[A, B/2, D/2], [B/2, C, E/2], [D/2, E/2, F]].',
          keywords: ['general conic', 'B^2 - 4AC', 'conic discriminant'],
          difficulty: 'advanced',
          status: 'verified'
        }
      ]
    }
  ]
};

