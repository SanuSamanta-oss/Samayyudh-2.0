import type { AcademicLevel } from '@/types/formulas';

export const division6ProbabilityStats: AcademicLevel = {
  id: 'math-div-6',
  title: 'Probability and Statistics',
  shortTitle: 'Probability & Stats',
  description: 'Descriptive statistics: measures of central tendency, dispersion metrics, probability axioms, conditional probability, Bayes\' theorem, and random variable distributions.',
  levelOrder: 6,
  chapters: [
    {
      id: 'm6-central-tendency-dispersion',
      number: 1,
      title: 'Measures of Central Tendency and Dispersion',
      description: 'Arithmetic/weighted mean, median, grouped mode, range, variance (population & sample), standard deviation, coefficient of variation, and quartile dispersion.',
      formulas: [
        {
          id: 'm-stat-arithmetic-mean',
          name: 'Arithmetic Mean (Sample/Data Mean)',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Central Tendency',
          expression: 'x̄ = (Σ x_i) / n',
          latex: '\\bar{x}=\\frac{\\sum_{i=1}^{n}x_i}{n}',
          symbols: [
            { symbol: '\\bar{x}', meaning: 'Sample arithmetic mean' },
            { symbol: 'x_i', meaning: 'Individual observed data values' },
            { symbol: 'n', meaning: 'Total number of observations' }
          ],
          explanation: 'The primary measure of central tendency; balance point of the data where the sum of deviations Σ(x_i - x̄) = 0.',
          conditions: 'Sensitive to extreme outlier observations.',
          keywords: ['arithmetic mean', 'average', 'x bar', 'central tendency'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-weighted-mean',
          name: 'Weighted Arithmetic Mean',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Central Tendency',
          expression: 'x̄ = (Σ w_i x_i) / (Σ w_i)',
          latex: '\\bar{x}=\\frac{\\sum_{i=1}^{n}w_ix_i}{\\sum_{i=1}^{n}w_i}',
          symbols: [
            { symbol: 'w_i', meaning: 'Relative weight or frequency assigned to observation x_i' },
            { symbol: '\\sum w_i', meaning: 'Sum of all weights (total sample size N)' }
          ],
          explanation: 'Calculates the average when observations contribute unequal importance or represent grouped frequencies.',
          conditions: 'w_i ≥ 0 and Σ w_i > 0.',
          keywords: ['weighted mean', 'weighted average', 'frequency mean'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-median-odd',
          name: 'Median for Odd Number of Observations',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Central Tendency',
          expression: 'M = x_{(n + 1)/2}',
          latex: 'M=x_{\\frac{n+1}{2}}',
          symbols: [
            { symbol: 'M', meaning: 'Median value (50th percentile)' },
            { symbol: 'n', meaning: 'Odd number of observations sorted in ascending order' }
          ],
          explanation: 'The exact central observation dividing sorted data into two equal halves; robust against outliers.',
          conditions: 'Data must be sorted ascendingly: x_1 ≤ x_2 ≤ ... ≤ x_n.',
          keywords: ['median', 'odd median', 'middle value', 'percentile'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-median-even',
          name: 'Median for Even Number of Observations',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Central Tendency',
          expression: 'M = (x_{n/2} + x_{n/2 + 1}) / 2',
          latex: 'M=\\frac{x_{\\frac{n}{2}}+x_{\\frac{n}{2}+1}}{2}',
          symbols: [
            { symbol: 'M', meaning: 'Median' },
            { symbol: 'x_{n/2}, x_{n/2 + 1}', meaning: 'Two central middle observations in ordered dataset' }
          ],
          explanation: 'Arithmetic average of the two middle observations when the number of observations n is an even integer.',
          conditions: 'Data sorted in ascending order.',
          keywords: ['median even', 'average of middle terms', '50th percentile'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-mode-grouped',
          name: 'Mode for Grouped Frequency Data',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Central Tendency',
          expression: 'Mode = l + [(f_1 - f_0) / (2f_1 - f_0 - f_2)] h',
          latex: 'Mode=l+\\frac{f_1-f_0}{2f_1-f_0-f_2}h',
          symbols: [
            { symbol: 'l', meaning: 'Lower limit of the modal class' },
            { symbol: 'h', meaning: 'Class width (size of modal class interval)' },
            { symbol: 'f_1', meaning: 'Frequency of modal class' },
            { symbol: 'f_0', meaning: 'Frequency of class preceding modal class' },
            { symbol: 'f_2', meaning: 'Frequency of class succeeding modal class' }
          ],
          explanation: 'Interpolation formula estimating the mode (value of highest frequency concentration) in a grouped continuous distribution.',
          conditions: 'Modal class has strictly the highest frequency f_1 > f_0, f_1 > f_2.',
          keywords: ['grouped mode', 'modal class', 'mode interpolation'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-stat-range',
          name: 'Range of a Dataset',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 'R = X_max - X_min',
          latex: 'R=X_{\\max}-X_{\\min}',
          symbols: [
            { symbol: 'R', meaning: 'Range of dataset' },
            { symbol: 'X_{\\max}', meaning: 'Maximum observed value' },
            { symbol: 'X_{\\min}', meaning: 'Minimum observed value' }
          ],
          explanation: 'Simplest metric of statistical dispersion measuring the total spread between the extreme values.',
          conditions: 'R ≥ 0; sensitive to outliers.',
          keywords: ['range', 'dispersion', 'max minus min'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-pop-variance',
          name: 'Population Variance',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 'σ^2 = [Σ (x_i - μ)^2] / N',
          latex: '\\sigma^2=\\frac{\\sum_{i=1}^{N}(x_i-\\mu)^2}{N}',
          symbols: [
            { symbol: '\\sigma^2', meaning: 'Population variance (mean squared deviation)' },
            { symbol: '\\mu', meaning: 'Population mean' },
            { symbol: 'N', meaning: 'Total population size' }
          ],
          explanation: 'Measures the average squared distance of all population elements from the population mean μ.',
          conditions: 'σ^2 ≥ 0.',
          keywords: ['population variance', 'sigma squared', 'variance'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-pop-std-dev',
          name: 'Population Standard Deviation',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 'σ = √([Σ (x_i - μ)^2] / N)',
          latex: '\\sigma=\\sqrt{\\frac{\\sum_{i=1}^{N}(x_i-\\mu)^2}{N}}',
          symbols: [
            { symbol: '\\sigma', meaning: 'Population standard deviation' }
          ],
          explanation: 'Square root of variance returning dispersion to original measurement units; fundamental in empirical 68-95-99.7 normal distribution rules.',
          conditions: 'σ ≥ 0.',
          keywords: ['standard deviation', 'sigma', 'root variance'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-sample-variance',
          name: 'Sample Variance (Bessel\'s Correction)',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 's^2 = [Σ (x_i - x̄)^2] / (n - 1)',
          latex: 's^2=\\frac{\\sum_{i=1}^{n}(x_i-\\bar{x})^2}{n-1}',
          symbols: [
            { symbol: 's^2', meaning: 'Sample variance' },
            { symbol: 'n - 1', meaning: 'Degrees of freedom (Bessel\'s unbiased estimator correction)' }
          ],
          explanation: 'Unbiased estimator of population variance σ^2 from a sample; dividing by n - 1 corrects the systematic downward bias of using sample mean x̄.',
          conditions: 'n > 1.',
          keywords: ['sample variance', 'bessel correction', 'n - 1 divisor'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-stat-coeff-variation',
          name: 'Coefficient of Variation (CV)',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Relative Dispersion',
          expression: 'CV = (σ / μ) × 100%',
          latex: 'CV=\\frac{\\sigma}{\\mu}\\times100\\%',
          symbols: [
            { symbol: 'CV', meaning: 'Coefficient of variation in percent' },
            { symbol: '\\sigma', meaning: 'Standard deviation' },
            { symbol: '\\mu', meaning: 'Mean (μ ≠ 0)' }
          ],
          explanation: 'Dimensionless normalized relative dispersion index; allows comparing variability between datasets with different units or magnitudes.',
          conditions: 'μ > 0.',
          keywords: ['coefficient of variation', 'CV', 'relative dispersion'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-stat-mean-deviation',
          name: 'Mean Absolute Deviation (MAD) About Mean',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 'MD = [Σ |x_i - x̄|] / n',
          latex: 'MD=\\frac{\\sum_{i=1}^{n}|x_i-\\bar{x}|}{n}',
          symbols: [
            { symbol: 'MD', meaning: 'Mean absolute deviation' },
            { symbol: '|x_i - \\bar{x}|', meaning: 'Absolute distance of observation from mean' }
          ],
          explanation: 'Average absolute linear distance of data points from the mean; less sensitive to extreme outliers than standard deviation.',
          conditions: 'Can also be computed about median: [Σ|x_i - M|]/n which is mathematically minimal.',
          keywords: ['mean deviation', 'MAD', 'absolute deviation'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-stat-quartile-deviation',
          name: 'Quartile Deviation (Semi-Interquartile Range)',
          subject: 'mathematics',
          chapter: 'Measures of Central Tendency and Dispersion',
          topic: 'Dispersion Metrics',
          expression: 'QD = (Q_3 - Q_1) / 2',
          latex: 'QD=\\frac{Q_3-Q_1}{2}',
          symbols: [
            { symbol: 'QD', meaning: 'Quartile deviation' },
            { symbol: 'Q_3', meaning: 'Third (upper) quartile (75th percentile)' },
            { symbol: 'Q_1', meaning: 'First (lower) quartile (25th percentile)' }
          ],
          explanation: 'Half the distance between third and first quartiles; robust dispersion measure covering the central 50% of sorted observations.',
          conditions: 'Q_3 ≥ Q_1.',
          keywords: ['quartile deviation', 'semi interquartile range', 'IQR / 2'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm6-conditional-bayes',
      number: 2,
      title: 'Conditional Probability and Bayes\' Theorem',
      description: 'Probability axioms, complement rules, addition & multiplication theorems, statistical independence, total probability, Bayes\' theorem, permutations, and combinations.',
      formulas: [
        {
          id: 'm-prob-classical',
          name: 'Classical Definition of Probability (Laplace Rule)',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Axioms and Foundations',
          expression: 'P(A) = n(A) / n(S)',
          latex: 'P(A)=\\frac{n(A)}{n(S)}',
          symbols: [
            { symbol: 'P(A)', meaning: 'Probability of event A occurring' },
            { symbol: 'n(A)', meaning: 'Number of favorable outcomes for event A' },
            { symbol: 'n(S)', meaning: 'Total number of exhaustive, mutually exclusive, equally likely outcomes in sample space S' }
          ],
          explanation: 'Theoretical probability defined for finite sample spaces with symmetric equally likely outcomes.',
          conditions: '0 ≤ P(A) ≤ 1; outcomes must be equally probable.',
          keywords: ['classical probability', 'laplace rule', 'favorable over total'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-complement',
          name: 'Complementary Event Probability Rule',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Axioms and Foundations',
          expression: 'P(A\') = 1 - P(A)',
          latex: 'P(A\')=1-P(A)',
          symbols: [
            { symbol: 'A\'', meaning: 'Complementary event "not A" (or Aᶜ)' }
          ],
          explanation: 'The probability that event A does not occur equals 1 minus the probability that A occurs.',
          conditions: 'A ∪ A\' = S and A ∩ A\' = ∅.',
          keywords: ['complement rule', '1 - P(A)', 'not A'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-addition-theorem',
          name: 'Addition Theorem of Probability',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Compound Probability',
          expression: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
          latex: 'P(A\\cup B)=P(A)+P(B)-P(A\\cap B)',
          symbols: [
            { symbol: 'P(A\\cup B)', meaning: 'Probability that event A or event B (or both) occurs' },
            { symbol: 'P(A\\cap B)', meaning: 'Joint probability of both A and B occurring simultaneously' }
          ],
          explanation: 'Principle of inclusion-exclusion for two arbitrary events; if A and B are mutually exclusive (disjoint), P(A ∩ B) = 0 so P(A ∪ B) = P(A) + P(B).',
          conditions: 'Valid for all events in sample space S.',
          keywords: ['addition theorem', 'union probability', 'inclusion exclusion probability'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-conditional',
          name: 'Conditional Probability Definition',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Conditional Probability',
          expression: 'P(A | B) = P(A ∩ B) / P(B), P(B) > 0',
          latex: 'P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)},\\quad P(B)>0',
          symbols: [
            { symbol: 'P(A\\mid B)', meaning: 'Conditional probability of A given that event B has occurred' },
            { symbol: 'P(A\\cap B)', meaning: 'Joint probability of both A and B' },
            { symbol: 'P(B)', meaning: 'Prior probability of conditioning event B' }
          ],
          explanation: 'Measures probability of A when the sample space is restricted to outcomes where B has occurred.',
          conditions: 'P(B) > 0.',
          keywords: ['conditional probability', 'P(A|B)', 'given event B'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-prob-multiplication-theorem',
          name: 'Multiplication Theorem of Probability',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Conditional Probability',
          expression: 'P(A ∩ B) = P(A) P(B | A)',
          latex: 'P(A\\cap B)=P(A)P(B\\mid A)',
          symbols: [
            { symbol: 'P(B\\mid A)', meaning: 'Conditional probability of B given event A' }
          ],
          explanation: 'Expresses joint occurrence probability as prior probability of first event times conditional probability of second event given first.',
          conditions: 'P(A) > 0.',
          keywords: ['multiplication theorem', 'joint probability', 'sequential probability'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-independent-events',
          name: 'Statistical Independence Criterion',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Independence',
          expression: 'P(A ∩ B) = P(A) P(B)',
          latex: 'P(A\\cap B)=P(A)P(B)',
          symbols: [
            { symbol: 'P(A), P(B)', meaning: 'Marginal probabilities of independent events' }
          ],
          explanation: 'Two events are statistically independent if the occurrence of one does not affect the probability of the other: P(A | B) = P(A).',
          conditions: 'Events are independent; distinct from mutually exclusive events (which are dependent if non-zero).',
          keywords: ['independent events', 'P(A)P(B)', 'statistical independence'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-total-probability',
          name: 'Law of Total Probability',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Total Probability',
          expression: 'P(A) = Σ_{i=1}^n P(B_i) P(A | B_i)',
          latex: 'P(A)=\\sum_{i=1}^{n}P(B_i)P(A\\mid B_i)',
          symbols: [
            { symbol: 'B_1, B_2, \\dots, B_n', meaning: 'Exhaustive and mutually exclusive partition of sample space S' },
            { symbol: 'P(B_i)', meaning: 'Prior probability of partition hypothesis B_i' }
          ],
          explanation: 'Calculates the overall marginal probability of an event A by summing conditional contributions across all possible scenarios B_i.',
          conditions: 'Partition: B_i ∩ B_j = ∅ for i ≠ j, and ∪ B_i = S with P(B_i) > 0.',
          keywords: ['law of total probability', 'partition theorem', 'marginal probability'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-prob-bayes-theorem',
          name: 'Bayes\' Theorem (Posterior Probability)',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Bayesian Inference',
          expression: 'P(B_i | A) = [P(B_i) P(A | B_i)] / [Σ P(B_j) P(A | B_j)]',
          latex: 'P(B_i\\mid A)=\\frac{P(B_i)P(A\\mid B_i)}{\\sum_{j=1}^{n}P(B_j)P(A\\mid B_j)}',
          symbols: [
            { symbol: 'P(B_i\\mid A)', meaning: 'Posterior probability of cause B_i given observed evidence A' },
            { symbol: 'P(B_i)', meaning: 'Prior probability of hypothesis B_i' },
            { symbol: 'P(A\\mid B_i)', meaning: 'Likelihood of evidence A given hypothesis B_i' },
            { symbol: '\\sum P(B_j)P(A\\mid B_j)', meaning: 'Total evidence probability P(A)' }
          ],
          explanation: 'Fundamental formula of Bayesian inference updating the probability of a hypothesis upon observing empirical evidence A.',
          conditions: 'Partition B_j with P(A) > 0.',
          keywords: ['bayes\' theorem', 'posterior probability', 'prior likelihood', 'bayesian inference'],
          difficulty: 'advanced',
          status: 'verified'
        },
        {
          id: 'm-prob-permutation',
          name: 'Permutation Formula (Ordered Arrangements)',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Combinatorics',
          expression: 'P(n, r) = n! / (n - r)!',
          latex: '{}^nP_r=\\frac{n!}{(n-r)!}',
          symbols: [
            { symbol: '{}^nP_r', meaning: 'Number of permutations of n distinct items taken r at a time' },
            { symbol: 'n!', meaning: 'Factorial of total available items' }
          ],
          explanation: 'Computes the number of distinct ordered arrangements when selecting r objects from n distinct objects where order matters.',
          conditions: '0 ≤ r ≤ n with n, r ∈ ℕ₀.',
          keywords: ['permutation', 'nPr', 'ordered selection', 'arrangements'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-prob-combination',
          name: 'Combination Formula (Unordered Selections)',
          subject: 'mathematics',
          chapter: 'Conditional Probability and Bayes\' Theorem',
          topic: 'Combinatorics',
          expression: 'C(n, r) = n! / [r! (n - r)!]',
          latex: '{}^nC_r=\\frac{n!}{r!(n-r)!}',
          symbols: [
            { symbol: '{}^nC_r', meaning: 'Number of combinations of n objects taken r at a time' }
          ],
          explanation: 'Computes the number of distinct selections of r objects from n distinct objects where order is irrelevant; related by nPr = r! × nCr.',
          conditions: '0 ≤ r ≤ n with n, r ∈ ℕ₀.',
          keywords: ['combination', 'nCr', 'unordered selection', 'n choose r'],
          difficulty: 'foundation',
          status: 'verified'
        }
      ]
    },
    {
      id: 'm6-distributions',
      number: 3,
      title: 'Probability Distributions',
      description: 'Expected values, variance of random variables, discrete distributions (Binomial, Poisson), continuous normal/Gaussian distributions, and continuous uniform models.',
      formulas: [
        {
          id: 'm-dist-expected-value',
          name: 'Expected Value (Mean of Discrete Random Variable)',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Moments of Random Variables',
          expression: 'E(X) = Σ x P(X = x)',
          latex: 'E(X)=\\sum_x xP(X=x)',
          symbols: [
            { symbol: 'E(X)', meaning: 'Mathematical expectation / population mean μ of discrete random variable X' },
            { symbol: 'x', meaning: 'Possible real values assumed by random variable X' },
            { symbol: 'P(X = x)', meaning: 'Probability mass assigned to value x' }
          ],
          explanation: 'Long-term probability-weighted average value of random variable X across repeated independent trials.',
          conditions: 'Absolute convergence Σ |x| P(X = x) < ∞.',
          keywords: ['expected value', 'E(X)', 'discrete expectation', 'population mean'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dist-variance-expectation',
          name: 'Variance Expressed via Expectation',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Moments of Random Variables',
          expression: 'Var(X) = E(X^2) - [E(X)]^2',
          latex: '\\operatorname{Var}(X)=E(X^2)-[E(X)]^2',
          symbols: [
            { symbol: '\\operatorname{Var}(X)', meaning: 'Variance of random variable X (σ^2)' },
            { symbol: 'E(X^2)', meaning: 'Second raw moment (expectation of X squared)' },
            { symbol: '[E(X)]^2', meaning: 'Square of first moment (mean squared)' }
          ],
          explanation: 'Computational shortcut for computing variance: mean of squares minus square of mean.',
          conditions: 'Var(X) ≥ 0.',
          keywords: ['variance formula', 'Var(X)', 'E(X^2) - (EX)^2', 'second moment'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dist-binomial-pmf',
          name: 'Binomial Probability Mass Function (PMF)',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Binomial Distribution',
          expression: 'P(X = r) = C(n, r) p^r q^(n-r), q = 1 - p',
          latex: 'P(X=r)=\\binom{n}{r}p^rq^{n-r},\\quad q=1-p',
          symbols: [
            { symbol: 'P(X = r)', meaning: 'Probability of obtaining exactly r successes in n independent Bernoulli trials' },
            { symbol: 'n', meaning: 'Fixed total number of trials' },
            { symbol: 'p', meaning: 'Constant probability of success on each single trial' },
            { symbol: 'q', meaning: 'Probability of failure: q = 1 - p' },
            { symbol: 'r', meaning: 'Number of successes (r = 0, 1, 2, ..., n)' }
          ],
          explanation: 'Discrete probability distribution for the number of successes in n independent Bernoulli trials with constant probability p.',
          conditions: 'Independent trials, binary outcomes (success/failure), constant p ∈ [0, 1].',
          keywords: ['binomial distribution', 'PMF', 'bernoulli trials', 'nCr p^r q^(n-r)'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dist-binomial-mean',
          name: 'Mean of Binomial Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Binomial Distribution',
          expression: 'μ = np',
          latex: '\\mu=np',
          symbols: [
            { symbol: '\\mu', meaning: 'Expected number of successes' },
            { symbol: 'n', meaning: 'Number of trials' },
            { symbol: 'p', meaning: 'Success probability per trial' }
          ],
          explanation: 'The expected value of a binomial random variable; by linearity of expectation E(X) = Σ E(X_i) = n × p.',
          conditions: 'n ∈ ℕ, 0 ≤ p ≤ 1.',
          keywords: ['binomial mean', 'np', 'expected successes'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-binomial-variance',
          name: 'Variance of Binomial Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Binomial Distribution',
          expression: 'σ^2 = npq',
          latex: '\\sigma^2=npq',
          symbols: [
            { symbol: '\\sigma^2', meaning: 'Variance of binomial random variable' },
            { symbol: 'q', meaning: 'Failure probability (1 - p)' }
          ],
          explanation: 'Measures spread in binomial successes; maximized when outcomes are equally likely (p = q = 0.5, σ^2 = n/4). Standard deviation is √(npq).',
          conditions: 'q = 1 - p. Note: σ^2 < μ always in a binomial model.',
          keywords: ['binomial variance', 'npq', 'variance of binomial'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-poisson-pmf',
          name: 'Poisson Probability Mass Function (PMF)',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Poisson Distribution',
          expression: 'P(X = r) = [e^(-λ) λ^r] / r!',
          latex: 'P(X=r)=\\frac{e^{-\\lambda}\\lambda^r}{r!}',
          symbols: [
            { symbol: 'P(X = r)', meaning: 'Probability of observing r events in a fixed interval' },
            { symbol: '\\lambda', meaning: 'Average arrival/occurrence rate parameter (λ > 0)' },
            { symbol: 'r', meaning: 'Non-negative integer event count (r = 0, 1, 2, ...)' },
            { symbol: 'e', meaning: 'Euler\'s number' }
          ],
          explanation: 'Models counts of rare events occurring independently at a constant average rate λ in continuous time or space (limit of binomial as n → ∞, p → 0 with np = λ).',
          conditions: 'λ > 0, r ∈ {0, 1, 2, ...}.',
          keywords: ['poisson distribution', 'PMF', 'arrival rate', 'e^-lambda lambda^r / r!'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dist-poisson-mean',
          name: 'Mean of Poisson Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Poisson Distribution',
          expression: 'μ = λ',
          latex: '\\mu=\\lambda',
          symbols: [
            { symbol: '\\mu', meaning: 'Expected value of Poisson random variable' },
            { symbol: '\\lambda', meaning: 'Rate parameter' }
          ],
          explanation: 'The expected value of a Poisson random variable is identically equal to the rate parameter λ.',
          conditions: 'λ > 0.',
          keywords: ['poisson mean', 'lambda', 'expected count'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-poisson-variance',
          name: 'Variance of Poisson Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Poisson Distribution',
          expression: 'σ^2 = λ',
          latex: '\\sigma^2=\\lambda',
          symbols: [
            { symbol: '\\sigma^2', meaning: 'Variance of Poisson random variable' }
          ],
          explanation: 'Distinctive property of the Poisson distribution: the variance equals the mean (equidispersion: Mean = Variance = λ).',
          conditions: 'Equal to mean; if sample variance exceeds mean, data exhibits overdispersion.',
          keywords: ['poisson variance', 'equidispersion', 'variance equals mean'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-normal-density',
          name: 'Normal (Gaussian) Distribution Probability Density Function',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Normal Distribution',
          expression: 'f(x) = [1 / (σ √(2π))] e^(- (x - μ)^2 / (2σ^2))',
          latex: 'f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
          symbols: [
            { symbol: 'f(x)', meaning: 'Probability density function (bell curve)' },
            { symbol: '\\mu', meaning: 'Distribution mean (center of symmetry)' },
            { symbol: '\\sigma', meaning: 'Standard deviation (controls curve width/spread)' },
            { symbol: '\\pi, e', meaning: 'Mathematical constants' }
          ],
          explanation: 'The ubiquitous continuous bell curve distribution guaranteed by the Central Limit Theorem for sums of independent random variables.',
          conditions: '-∞ < x < ∞, σ > 0. Total area under curve equals 1: ∫_{-∞}^∞ f(x) dx = 1.',
          keywords: ['normal distribution', 'gaussian', 'bell curve', 'PDF', 'central limit theorem'],
          difficulty: 'intermediate',
          status: 'verified'
        },
        {
          id: 'm-dist-standard-normal-z',
          name: 'Standard Normal Transformation (Z-Score)',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Normal Distribution',
          expression: 'Z = (X - μ) / σ',
          latex: 'Z=\\frac{X-\\mu}{\\sigma}',
          symbols: [
            { symbol: 'Z', meaning: 'Standard normal variable (Z ~ N(0, 1))' },
            { symbol: 'X', meaning: 'Original normal variable (X ~ N(μ, σ^2))' },
            { symbol: '\\mu, \\sigma', meaning: 'Mean and standard deviation of X' }
          ],
          explanation: 'Standardizes any normal distribution into standard normal N(0, 1) with mean 0 and variance 1, enabling probability lookups in Z-tables.',
          conditions: 'σ > 0.',
          keywords: ['z score', 'standard normal', 'normalization', 'z transformation'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-uniform-density',
          name: 'Continuous Uniform Distribution Density Function',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Uniform Distribution',
          expression: 'f(x) = 1 / (b - a), a ≤ x ≤ b',
          latex: 'f(x)=\\frac{1}{b-a},\\quad a\\leq x\\leq b',
          symbols: [
            { symbol: 'f(x)', meaning: 'Constant probability density over interval [a, b]' },
            { symbol: 'a, b', meaning: 'Lower and upper finite endpoints of support' }
          ],
          explanation: 'Models a continuous random variable having completely constant likelihood over a bounded interval [a, b]; zero elsewhere.',
          conditions: 'a < b.',
          keywords: ['uniform distribution', 'continuous uniform', '1 / (b - a)'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-uniform-mean',
          name: 'Mean of Continuous Uniform Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Uniform Distribution',
          expression: 'μ = (a + b) / 2',
          latex: '\\mu=\\frac{a+b}{2}',
          symbols: [
            { symbol: '\\mu', meaning: 'Expected value (midpoint of interval)' },
            { symbol: 'a, b', meaning: 'Lower and upper bounds' }
          ],
          explanation: 'Due to rectangular symmetry, the expected value lies at the exact midpoint of the interval [a, b].',
          conditions: 'a < b.',
          keywords: ['uniform mean', '(a+b)/2', 'midpoint expectation'],
          difficulty: 'foundation',
          status: 'verified'
        },
        {
          id: 'm-dist-uniform-variance',
          name: 'Variance of Continuous Uniform Distribution',
          subject: 'mathematics',
          chapter: 'Probability Distributions',
          topic: 'Uniform Distribution',
          expression: 'σ^2 = (b - a)^2 / 12',
          latex: '\\sigma^2=\\frac{(b-a)^2}{12}',
          symbols: [
            { symbol: '\\sigma^2', meaning: 'Variance of uniform distribution' },
            { symbol: 'b - a', meaning: 'Total width of support interval' }
          ],
          explanation: 'Derived from E(X^2) - [E(X)]^2; the factor 1/12 arises from integrating x^2 over the interval.',
          conditions: 'a < b. Standard deviation is (b - a) / √12.',
          keywords: ['uniform variance', '(b-a)^2 / 12', 'spread uniform'],
          difficulty: 'intermediate',
          status: 'verified'
        }
      ]
    }
  ]
};

