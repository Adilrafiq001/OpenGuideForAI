import type { Track } from './track0';

export const track1: Track = {
  id: 'track-1',
  title: 'Track 1: Vector Spaces & High-Dimensional Geometry',
  description: 'Master the high-dimensional linear algebra powering all modern AI: vector embeddings, cosine similarity, distance metrics, and vector search engines built from scratch in pure Python.',
  modules: [
    {
      id: 'module-1-1',
      title: 'Module 1.1: Vector Embeddings & High-Dimensional Geometry',
      description: 'Understand how computers map abstract semantic concepts onto directional coordinates in continuous vector space.',
      lessons: [
        {
          id: 'lesson-1-1-1',
          title: 'The Vector as an Arrow in Semantic Space',
          subtitle: 'From Word Associations to High-Dimensional Coordinates',
          firstPrinciplesIntuition: 'How does an artificial intelligence understand that "king" is to "queen" as "man" is to "woman"? In language models, words are not static dictionary strings—they are directional vectors pointing in continuous conceptual space. If two words share semantic properties (like royalty or gender), their coordinates point in closely aligned directions. Vector arithmetic allows us to compute conceptual relationships directly with high-school mathematics: subtracting the vector for "man" from "king" and adding "woman" points directly at "queen"!',
          content: `### Coordinate Geometry in Continuous Thought Space

A semantic vector $\\mathbf{v} \\in \\mathbb{R}^d$ is an ordered sequence of real numbers $[v_1, v_2, \\dots, v_d]$ representing coordinates in a $d$-dimensional space.

\`\`\`
       +Y (Feminine)
        ^
        |          * Queen [0.85, 0.25]
        |          /
        |         / Delta = Queen - King
        |        v
        |       * King [0.90, 0.20]
        +-----------------------------> +X (Royalty)
\`\`\`

The displacement vector $\\Delta$ between two points $\\mathbf{p}$ and $\\mathbf{q}$ is computed element-wise:
$$\\Delta = \\mathbf{q} - \\mathbf{p} = [q_1 - p_1, q_2 - p_2, \\dots, q_d - p_d]$$
The squared Euclidean distance is the sum of squared coordinate differences:
$$D^2(\\mathbf{p}, \\mathbf{q}) = \\sum_{i=1}^d (q_i - p_i)^2$$

#### Your Engineering Challenge:
1. Represent the 2D semantic coordinates for \`king = [0.90, 0.20]\` and \`queen = [0.85, 0.25]\`.
2. Compute the element-wise displacement \`delta = [queen[0] - king[0], queen[1] - king[1]]\`.
3. Compute the \`squared_distance\` between them using the sum of squared coordinate deltas.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.1
# Objective: Vectors as Arrows in Semantic Space
# ============================================================

king = [0.90, 0.20]
queen = [0.85, 0.25]

# TODO: Step 1 - Calculate the coordinate displacement delta: [queen[0] - king[0], queen[1] - king[1]]
delta = []

# TODO: Step 2 - Calculate squared Euclidean distance: delta[0]^2 + delta[1]^2
squared_distance = 0.0

print(f"King Coordinates    : {king}")
print(f"Queen Coordinates   : {queen}")
print(f"Semantic Delta      : {delta}")
print(f"Squared Distance    : {round(squared_distance, 5)}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.1 (Canonical Solution)
# ============================================================

king = [0.90, 0.20]
queen = [0.85, 0.25]

delta = [round(queen[0] - king[0], 4), round(queen[1] - king[1], 4)]
squared_distance = round(delta[0]**2 + delta[1]**2, 5)

print(f"King Coordinates    : {king}")
print(f"Queen Coordinates   : {queen}")
print(f"Semantic Delta      : {delta}")
print(f"Squared Distance    : {round(squared_distance, 5)}")
`,
          testCode: `assert len(delta) == 2, "Delta vector must have 2 dimensions"
assert delta == [-0.05, 0.05], f"Expected delta [-0.05, 0.05], got {delta}"
assert abs(squared_distance - 0.005) < 1e-4, f"squared_distance incorrect: got {squared_distance}"
print("✓ [TEST PASSED] Semantic vector coordinates successfully initialized.")
`,
          expectedOutput: '✓ [TEST PASSED] Semantic vector coordinates successfully initialized.',
          hint: 'Subtract king coordinates from queen coordinates: delta = [round(queen[0] - king[0], 4), round(queen[1] - king[1], 4)].',
          progressiveHints: [
            'Tier 1 (Mental Model): Vector subtraction is element-wise: subtract each king component from the matching queen component.',
            'Tier 2 (Logic): delta[0] = 0.85 - 0.90 = -0.05; delta[1] = 0.25 - 0.20 = 0.05.',
            'Tier 3 (Syntax): delta = [round(queen[0] - king[0], 4), round(queen[1] - king[1], 4)] and squared_distance = round(delta[0]**2 + delta[1]**2, 5).'
          ]
        },
        {
          id: 'lesson-1-1-2',
          title: 'Vector Magnitude & Normalization',
          subtitle: 'Standardizing Arrow Lengths to Unit 1.0 (L2 Norm)',
          firstPrinciplesIntuition: 'When comparing conceptual embeddings, raw document length is a dangerous confounder! A 50-page technical manual on quantum physics has a massive vector magnitude simply because terms repeat hundreds of times, whereas a 1-paragraph summary has a tiny magnitude. Projecting both vectors onto the surface of a unit hypersphere (||v||_2 = 1.0) eliminates magnitude distortion so downstream search operations measure pure conceptual direction.',
          content: `### The Euclidean L2 Norm & Hypersphere Normalization

Given a $d$-dimensional vector $\\mathbf{v} = [v_1, v_2, \\dots, v_d]$, its Euclidean magnitude ($L_2$ norm) is the straight-line distance from the origin:
$$\\|\\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^d v_i^2}$$

To normalize $\\mathbf{v}$ into a unit vector $\\mathbf{u}$ lying on the unit sphere ($\\|\\mathbf{u}\\|_2 = 1.0$):
$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|_2 + \\epsilon}$$

\`\`\`
       +Y
        ^
        |     * v = [3.0, 4.0] (Magnitude = 5.0)
        |    /
        |   /
        |  * u = [0.6, 0.8] (Unit Magnitude = 1.0)
        +--------------------> +X
\`\`\`

**Numerical Stability Invariant in Production ML:**
If $\\mathbf{v}$ is an all-zero vector, dividing by $\\|\\mathbf{v}\\| = 0$ throws a fatal \`ZeroDivisionError\` or generates \`NaN\` in GPU tensors. Production engines always add an infinitesimal epsilon damping factor: $\\epsilon = 10^{-12}$.

#### Your Engineering Challenge:
1. Compute the Euclidean magnitude \`mag\` of \`v = [3.0, 4.0]\` using \`math.sqrt()\`.
2. Construct the normalized \`unit_v\` by dividing each coordinate by \`(mag + 1e-12)\`, rounded to 2 decimal places.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.2
# Objective: Vector Magnitude & Unit Normalization (L2 Norm)
# ============================================================
import math

v = [3.0, 4.0]

# TODO: Step 1: Calculate Euclidean L2 magnitude: sqrt(sum(x^2))
mag = 0.0

# TODO: Step 2: Normalize vector to unit length with epsilon protection: round(x / (mag + 1e-12), 2)
unit_v = []

print(f"Original Vector       : {v}")
print(f"Magnitude (L2)        : {mag}")
print(f"Normalized Unit Vector: {unit_v}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.2 (Canonical Solution)
# ============================================================
import math

v = [3.0, 4.0]
mag = math.sqrt(v[0]**2 + v[1]**2)
eps = 1e-12
unit_v = [round(x / (mag + eps), 2) for x in v]

print(f"Original Vector       : {v}")
print(f"Magnitude (L2)        : {mag}")
print(f"Normalized Unit Vector: {unit_v}")
`,
          testCode: `assert mag == 5.0, f"Expected magnitude 5.0, got {mag}"
assert unit_v == [0.6, 0.8], f"Expected normalized vector [0.6, 0.8], got {unit_v}"
assert round(math.sqrt(unit_v[0]**2 + unit_v[1]**2), 1) == 1.0, "Unit vector must have magnitude 1.0"
print("✓ [TEST PASSED] Vector L2 magnitude and unit normalization verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Vector L2 magnitude and unit normalization verified.',
          hint: 'Calculate mag = math.sqrt(v[0]**2 + v[1]**2) which equals 5.0, then unit_v = [round(x / mag, 2) for x in v].',
          progressiveHints: [
            'Tier 1 (Mental Model): Normalization maps any vector onto a sphere with radius 1.0 while preserving its exact pointing angle.',
            'Tier 2 (Logic): For (3, 4), 3^2 + 4^2 = 9 + 16 = 25. The square root of 25 is 5.0. Dividing each component by 5 yields 0.6 and 0.8.',
            'Tier 3 (Syntax): mag = math.sqrt(sum(x**2 for x in v)) and unit_v = [round(x / (mag + 1e-12), 2) for x in v].'
          ]
        },
        {
          id: 'lesson-1-1-3',
          title: 'The Dot Product: Measuring Alignment',
          subtitle: 'The Core Mathematical Operation of Attention & Embeddings',
          firstPrinciplesIntuition: 'The dot product is the single most important mathematical operation in modern artificial intelligence. It computes the directional projection of one vector directly onto another. If two unit vectors point in the identical direction (angle theta = 0), cos(0) = 1.0. If they are orthogonal (90 degrees, conceptually independent), their dot product is exactly 0.0. In Transformer self-attention, Query @ Key^T is nothing more than billions of parallel dot products computing how much attention one token owes another.',
          content: `### Geometric & Algebraic Duality of the Dot Product

Algebraic definition:
$$\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^d a_i b_i = a_1 b_1 + a_2 b_2 + \\dots + a_d b_d$$

Geometric definition:
$$\\mathbf{a} \\cdot \\mathbf{b} = \\|\\mathbf{a}\\|_2 \\|\\mathbf{b}\\|_2 \\cos \\theta$$

\`\`\`
       Vector B
          ^
          | \\
          |  \\ theta
          |   \\
          +-----> Vector A
            Projected Shadow = ||B|| * cos(theta)
\`\`\`

When vectors are normalized to unit length ($\\|\\mathbf{a}\\| = \\|\\mathbf{b}\\| = 1.0$), the algebraic sum of element-wise products directly equals the cosine of the angle between them!

#### Your Engineering Challenge:
Compute the dot product between vectors \`a = [1, 2, 3]\` and \`b = [4, 5, 6]\` using a list comprehension or zip loop:
\`dot = sum(x * y for x, y in zip(a, b))\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.3
# Objective: The Dot Product - Measuring Conceptual Alignment
# ============================================================

a = [1, 2, 3]
b = [4, 5, 6]

# TODO: Step 1: Compute dot product by multiplying matching components and summing them:
# sum(x * y for x, y in zip(a, b))
dot = 0

print(f"Vector A            : {a}")
print(f"Vector B            : {b}")
print(f"Computed Dot Product: {dot}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.3 (Canonical Solution)
# ============================================================

a = [1, 2, 3]
b = [4, 5, 6]

dot = sum(x * y for x, y in zip(a, b))

print(f"Vector A            : {a}")
print(f"Vector B            : {b}")
print(f"Computed Dot Product: {dot}")
`,
          testCode: `assert dot == 32, f"Expected dot product 32 (1*4 + 2*5 + 3*6 = 4+10+18), got {dot}"
assert sum(x * y for x, y in zip([1, 0], [0, 1])) == 0, "Orthogonal dot product must be 0"
print("✓ [TEST PASSED] Vector dot product calculation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Vector dot product calculation verified.',
          hint: 'Multiply each element and add them together: (1*4) + (2*5) + (3*6) = 4 + 10 + 18 = 32.',
          progressiveHints: [
            'Tier 1 (Mental Model): The dot product accumulates matching coordinate overlaps: large positive when aligned, zero when orthogonal, negative when opposite.',
            'Tier 2 (Logic): Pair elements using zip(a, b), multiply each pair, and sum the result: 1*4 + 2*5 + 3*6 = 32.',
            'Tier 3 (Syntax): Write: dot = sum(x * y for x, y in zip(a, b)).'
          ]
        }
      ]
    },
    {
      id: 'module-1-2',
      title: 'Module 1.2: Cosine Similarity & Distance Metrics',
      description: 'Why Euclidean distance suffers from the curse of dimensionality, and how cosine similarity captures true semantic angle.',
      lessons: [
        {
          id: 'lesson-1-2-1',
          title: 'Why Angle Trumps Distance in Text',
          subtitle: 'Overcoming Word Count Distortion via Angular Proximity',
          firstPrinciplesIntuition: 'Consider two documents: a 1-paragraph summary of general relativity and a 300-page academic textbook on general relativity. Both discuss identical physical concepts (spacetime curvature, tensors, gravitational lensing). However, the 300-page book vector is 100x longer because word counts are high. Euclidean distance would mistakenly conclude that the two texts are completely unrelated; angular cosine similarity correctly recognizes that their semantic direction is identical!',
          content: `### Angular Proximity vs Length Distortion

Cosine similarity evaluates the orientation of two vectors rather than their magnitude:
$$\\text{CosineSimilarity}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum_{i=1}^d u_i^2} \\sqrt{\\sum_{i=1}^d v_i^2}}$$

\`\`\`
       +Y
        ^       / Long Document [10.0, 20.0]
        |      /
        |     /
        |    * Short Document [1.0, 2.0]
        |   /
        |  /  Angle theta = 0 degrees -> Cosine = 1.0 (Identical Concept!)
        +-----------------------------------> +X
\`\`\`

#### Range of Cosine Similarity:
- **$+1.0$**: Vectors point in identical directions (exact semantic alignment).
- **$0.0$**: Vectors are orthogonal (90 degrees, conceptually independent).
- **$-1.0$**: Vectors point in opposite directions (semantic diametric opposition).

#### Your Engineering Challenge:
Implement the \`cosine_sim(v1, v2)\` function:
1. Compute the dot product between \`v1\` and \`v2\`.
2. Compute the Euclidean magnitude of \`v1\` and \`v2\`.
3. Return \`dot / (mag1 * mag2)\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.1
# Objective: Why Angle Trumps Distance in Text
# ============================================================
import math

# TODO: Step 1 - Complete the cosine similarity function:
# dot_product / (magnitude1 * magnitude2)
def cosine_sim(v1, v2):
    dot = 0.0 # TODO: sum(a * b for a, b in zip(v1, v2))
    mag1 = 1.0 # TODO: math.sqrt(sum(a * a for a in v1))
    mag2 = 1.0 # TODO: math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

short_doc = [1.0, 2.0]
long_doc = [10.0, 20.0]

sim = cosine_sim(short_doc, long_doc)
print(f"Short Document Vector: {short_doc}")
print(f"10x Long Document Vector: {long_doc}")
print(f"Angular Cosine Similarity: {round(sim, 2)}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.1 (Canonical Solution)
# ============================================================
import math

def cosine_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

short_doc = [1.0, 2.0]
long_doc = [10.0, 20.0]

sim = cosine_sim(short_doc, long_doc)
print(f"Short Document Vector: {short_doc}")
print(f"10x Long Document Vector: {long_doc}")
print(f"Angular Cosine Similarity: {round(sim, 2)}")
`,
          testCode: `assert round(sim, 2) == 1.0, f"Identical direction must yield 1.0 similarity, got {sim}"
assert cosine_sim([1, 0], [0, 1]) == 0.0, "Orthogonal vectors must yield 0.0 similarity"
assert cosine_sim([1, 0], [-1, 0]) == -1.0, "Opposite vectors must yield -1.0 similarity"
print("✓ [TEST PASSED] Angular cosine similarity function verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Angular cosine similarity function verified.',
          hint: 'Since both vectors have identical proportions, their cosine similarity is 1.0 (0 degree angle).',
          progressiveHints: [
            'Tier 1 (Mental Model): Vectors pointing in the exact same direction have an angle theta = 0 degrees, so cos(0) = 1.0 regardless of magnitude.',
            'Tier 2 (Logic): Calculate dot = sum(a * b) and magnitudes mag1 = sqrt(sum(a^2)), mag2 = sqrt(sum(b^2)), then divide dot by (mag1 * mag2).',
            'Tier 3 (Syntax): Inside cosine_sim: dot = sum(a*b for a,b in zip(v1,v2)); mag1 = math.sqrt(sum(a*a for a in v1)); mag2 = math.sqrt(sum(b*b for b in v2)); return dot / (mag1 * mag2).'
          ]
        },
        {
          id: 'lesson-1-2-2',
          title: 'Computing the Cosine Similarity Matrix',
          subtitle: 'Scoring One Query Vector Against Multiple Candidate Documents',
          firstPrinciplesIntuition: 'In production search systems (RAG, enterprise document search, recommendation engines), a user prompt is embedded into a query vector $\\mathbf{q}$. The search engine then compares $\\mathbf{q}$ simultaneously against an entire corpus of candidate document embeddings, scoring each candidate with cosine similarity to rank the most relevant information at the top.',
          content: `### Pairwise Multi-Candidate Scoring

Given a query vector $\\mathbf{q}$ and a collection of $N$ document vectors $\\{\\mathbf{d}_1, \\mathbf{d}_2, \\dots, \\mathbf{d}_N\\}$, the similarity score vector $\\mathbf{s} \\in \\mathbb{R}^N$ is computed as:
$$s_j = \\text{CosineSimilarity}(\\mathbf{q}, \\mathbf{d}_j) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}_j}{\\|\\mathbf{q}\\|_2 \\|\\mathbf{d}_j\\|_2}$$

\`\`\`
Query Vector q [0.8, 0.6]
        |
        +---> Compare vs Doc 1 [0.85, 0.55] -> Score: 0.998 (Best Match!)
        +---> Compare vs Doc 2 [0.10, 0.90] -> Score: 0.685 (Moderate Match)
        +---> Compare vs Doc 3 [-0.70, 0.70] -> Score: -0.141 (Irrelevant)
\`\`\`

#### Your Engineering Challenge:
1. Complete the loop to calculate the cosine similarity between \`query\` and each candidate in \`candidates\`.
2. Append each rounded score (to 3 decimal places) to the \`scores\` list.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.2
# Objective: Computing the Cosine Similarity Matrix
# ============================================================
import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

query = [0.8, 0.6]
candidates = [
    [0.85, 0.55],   # Candidate 1: High alignment
    [0.10, 0.90],   # Candidate 2: Moderate alignment
    [-0.70, 0.70]   # Candidate 3: Low/orthogonal alignment
]

# TODO: Step 1 - Calculate similarity for each candidate:
scores = []
# for doc in candidates:
#     ...

print(f"Query Vector: {query}")
print(f"Candidate Scores: {scores}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.2 (Canonical Solution)
# ============================================================
import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

query = [0.8, 0.6]
candidates = [
    [0.85, 0.55],
    [0.10, 0.90],
    [-0.70, 0.70]
]

scores = [round(cosine_similarity(query, doc), 3) for doc in candidates]

print(f"Query Vector: {query}")
print(f"Candidate Scores: {scores}")
`,
          testCode: `assert len(scores) == 3, "Must compute exactly 3 candidate scores"
assert scores[0] == 0.998, f"Expected Doc 1 to score 0.998, got {scores[0]}"
assert scores[1] == 0.685, f"Expected Doc 2 to score 0.685, got {scores[1]}"
assert scores[2] == -0.141, f"Expected Doc 3 to score -0.141, got {scores[2]}"
assert scores[0] > scores[1] > scores[2], "Scores must rank candidate 1 highest"
print("✓ [TEST PASSED] Multi-candidate cosine ranking matrix verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Multi-candidate cosine ranking matrix verified.',
          hint: 'Loop through candidates and append round(cosine_similarity(query, doc), 3) to scores.',
          progressiveHints: [
            'Tier 1 (Mental Model): Scoring multiple candidates measures the angular alignment between one query and every document vector in the database.',
            'Tier 2 (Logic): Iterate over each document vector in candidates, call cosine_similarity(query, doc), and round to 3 decimals.',
            'Tier 3 (Syntax): scores = [round(cosine_similarity(query, doc), 3) for doc in candidates].'
          ]
        },
        {
          id: 'lesson-1-2-3',
          title: 'Distance Metrics: Manhattan, Euclidean & Cosine',
          subtitle: 'Sparse vs Dense Geometry Trade-offs',
          firstPrinciplesIntuition: 'Different AI architectures use different geometric rulers. When navigating a grid of city blocks, a taxi driver must drive along roads—that is Manhattan ($L_1$) distance. When a drone flies in a straight line through open air, that is Euclidean ($L_2$) distance. But when searching continuous text embeddings where length varies, Cosine distance ($1 - \\cos \\theta$) is the gold standard.',
          content: `### Comparative Metric Formulations

Given two points $\\mathbf{p}, \\mathbf{q} \\in \\mathbb{R}^d$:

1. **Manhattan Distance ($L_1$ Norm):**
   $$D_{L_1}(\\mathbf{p}, \\mathbf{q}) = \\sum_{i=1}^d |p_i - q_i|$$
2. **Euclidean Distance ($L_2$ Norm):**
   $$D_{L_2}(\\mathbf{p}, \\mathbf{q}) = \\sqrt{\\sum_{i=1}^d (p_i - q_i)^2}$$
3. **Cosine Distance ($D_{\\cos}$):**
   $$D_{\\cos}(\\mathbf{p}, \\mathbf{q}) = 1.0 - \\frac{\\mathbf{p} \\cdot \\mathbf{q}}{\\|\\mathbf{p}\\|_2 \\|\\mathbf{q}\\|_2}$$

\`\`\`
Coordinate Grid (p=[1, 2] to q=[4, 6]):
  Manhattan (Grid Path):  |4 - 1| + |6 - 2| = 3 + 4 = 7.0
  Euclidean (Diagonal):   sqrt(3^2 + 4^2) = sqrt(25) = 5.0
  Cosine Distance:        1.0 - (24.0 / (sqrt(5) * sqrt(52))) ≈ 0.0077
\`\`\`

#### Your Engineering Challenge:
For points \`p = [1.0, 2.0]\` and \`q = [4.0, 6.0]\`, compute:
1. \`manhattan\` ($L_1$ distance).
2. \`euclidean\` ($L_2$ distance).
3. \`cos_dist\` ($1.0 - \\text{cosine\\_similarity}$, rounded to 4 decimals).`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.3
# Objective: Tri-Metric Geometric Comparison
# ============================================================
import math

p = [1.0, 2.0]
q = [4.0, 6.0]

# TODO: Step 1 - Manhattan Distance (L1): sum(|p_i - q_i|)
manhattan = 0.0

# TODO: Step 2 - Euclidean Distance (L2): sqrt(sum((p_i - q_i)^2))
euclidean = 0.0

# TODO: Step 3 - Cosine Distance: round(1.0 - cosine_similarity, 4)
cos_dist = 0.0

print(f"L1 Manhattan Distance: {manhattan}")
print(f"L2 Euclidean Distance: {euclidean}")
print(f"Cosine Distance      : {cos_dist}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.3 (Canonical Solution)
# ============================================================
import math

p = [1.0, 2.0]
q = [4.0, 6.0]

manhattan = sum(abs(a - b) for a, b in zip(p, q))
euclidean = math.sqrt(sum((a - b)**2 for a, b in zip(p, q)))

dot = sum(a * b for a, b in zip(p, q))
mag_p = math.sqrt(sum(a*a for a in p))
mag_q = math.sqrt(sum(b*b for b in q))
cos_sim = dot / (mag_p * mag_q)
cos_dist = round(1.0 - cos_sim, 4)

print(f"L1 Manhattan Distance: {manhattan}")
print(f"L2 Euclidean Distance: {euclidean}")
print(f"Cosine Distance      : {cos_dist}")
`,
          testCode: `assert manhattan == 7.0, f"Expected Manhattan 7.0, got {manhattan}"
assert euclidean == 5.0, f"Expected Euclidean 5.0, got {euclidean}"
assert cos_dist == 0.0077, f"Expected Cosine distance 0.0077, got {cos_dist}"
print("✓ [TEST PASSED] Tri-metric geometric comparison verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Tri-metric geometric comparison verified.',
          hint: 'L1 is |1-4| + |2-6| = 3+4=7. L2 is sqrt(3^2 + 4^2) = 5.',
          progressiveHints: [
            'Tier 1 (Mental Model): L1 moves along grid axes; L2 measures direct Euclidean Euclidean straight-line distance; Cosine distance measures angular deviation regardless of coordinate scale.',
            'Tier 2 (Logic): Manhattan = |1-4| + |2-6| = 7.0. Euclidean = sqrt(3^2 + 4^2) = 5.0. Cosine distance = 1.0 - (dot / (mag_p * mag_q)).',
            'Tier 3 (Syntax): manhattan = sum(abs(a-b) for a,b in zip(p,q)); euclidean = math.sqrt(sum((a-b)**2 for a,b in zip(p,q))); cos_dist = round(1.0 - (dot / (mag_p * mag_q)), 4).'
          ]
        }
      ]
    },
    {
      id: 'module-1-3',
      title: 'Module 1.3: Client-Side Vector Search & Boss Project',
      description: 'Build your first vector search engine in pure Python. Index passages, query with an embedding, and return the Top-K closest matches.',
      lessons: [
        {
          id: 'lesson-1-3-1',
          title: 'Building an In-Memory Vector Store',
          subtitle: 'The Anatomy of FAISS, Chroma, and Qdrant in Pure Python',
          firstPrinciplesIntuition: 'Underneath all enterprise vector databases (Pinecone, Chroma, Qdrant, Milvus) is a remarkably elegant core loop: maintain an in-memory index of document records with their vector embeddings, compute similarity against a search query, and return the closest semantic neighbours. Understanding this core data structure demystifies vector storage completely!',
          content: `### Architecture of an In-Memory Vector Store

A vector database combines structured metadata storage with geometric vector coordinates. In its foundational form, each record contains a unique identifier, source text chunk, and a numerical embedding vector.

\`\`\`
SimpleVectorStore
  |
  +-- documents = [
        {"id": "doc1", "text": "Neural Networks...", "vector": [0.9, 0.1, 0.4]},
        {"id": "doc2", "text": "Cooking Recipes...", "vector": [-0.2, 0.8, 0.1]}
      ]
\`\`\`

#### Your Engineering Challenge:
Implement the \`SimpleVectorStore\` class:
1. Initialize \`self.documents = []\` in \`__init__\`.
2. In \`add(self, doc_id, text, vector)\`, append a dictionary \`{"id": doc_id, "text": text, "vector": vector}\`.
3. In \`count(self)\`, return the total number of indexed documents using \`len(self.documents)\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.1
# Objective: Building an In-Memory Vector Store
# ============================================================

# TODO: Step 1 - Complete the SimpleVectorStore class
class SimpleVectorStore:
    def __init__(self):
        self.documents = []

    def add(self, doc_id, text, vector):
        # TODO: Append dictionary {"id": doc_id, "text": text, "vector": vector}
        pass

    def count(self):
        # TODO: Return total documents
        return 0

store = SimpleVectorStore()
store.add("doc1", "Introduction to Neural Networks", [0.9, 0.1, 0.4])
store.add("doc2", "French Cooking Recipes", [-0.2, 0.8, 0.1])

print(f"Indexed {store.count()} documents successfully.")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.1 (Canonical Solution)
# ============================================================

class SimpleVectorStore:
    def __init__(self):
        self.documents = []

    def add(self, doc_id, text, vector):
        self.documents.append({"id": doc_id, "text": text, "vector": vector})

    def count(self):
        return len(self.documents)

store = SimpleVectorStore()
store.add("doc1", "Introduction to Neural Networks", [0.9, 0.1, 0.4])
store.add("doc2", "French Cooking Recipes", [-0.2, 0.8, 0.1])

print(f"Indexed {store.count()} documents successfully.")
for doc in store.documents:
    print(f"  [{doc['id']}] {doc['text']}")
`,
          testCode: `assert store.count() == 2, f"Expected 2 documents, got {store.count()}"
assert store.documents[0]["id"] == "doc1"
assert store.documents[1]["id"] == "doc2"
assert len(store.documents[0]["vector"]) == 3
print("✓ [TEST PASSED] In-memory vector store indexing verified.")
`,
          expectedOutput: '✓ [TEST PASSED] In-memory vector store indexing verified.',
          hint: 'The store appends records and reports total count via len(self.documents).',
          progressiveHints: [
            'Tier 1 (Mental Model): An in-memory vector store maintains a registry of document records containing unique IDs, text, and vector embeddings.',
            'Tier 2 (Logic): In the .add() method, append a dictionary with keys "id", "text", and "vector" to self.documents. Implement .count() with len(self.documents).',
            'Tier 3 (Syntax): self.documents.append({"id": doc_id, "text": text, "vector": vector}) and return len(self.documents).'
          ]
        },
        {
          id: 'lesson-1-3-2',
          title: 'Top-K Nearest Neighbor Retrieval',
          subtitle: 'Scoring, Sorting, and Threshold Filtering',
          firstPrinciplesIntuition: 'Once document embeddings are indexed, nearest-neighbor search executes three sequential steps: compute the cosine alignment score between the user query and every indexed document, sort the candidate records descending by score, and take the top $K$ items. This exact algorithm powers retrieval in RAG systems worldwide!',
          content: `### The Nearest Neighbor Retrieval Pipeline

Linear scan nearest-neighbor search ($k$-NN) compares a target query vector against every record in the store:

\`\`\`
Query Vector q -> [ Compute Cosine Similarity against all N Docs ]
                                    |
                                    v
                  [ (Doc 1, 0.94), (Doc 2, 0.41), (Doc 3, 0.88) ]
                                    |
                                    v Sort Descending
                  [ (Doc 1, 0.94), (Doc 3, 0.88), (Doc 2, 0.41) ]
                                    |
                                    v Slice Top-K (K=2)
                  Result: [ Doc 1, Doc 3 ]
\`\`\`

#### Your Engineering Challenge:
1. Iterate over each document in \`documents\`.
2. Compute its cosine similarity score against \`query_vector\`.
3. Sort candidate records by score in descending order.
4. Slice and return the top \`k=2\` results.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.2
# Objective: Top-K Nearest Neighbor Retrieval
# ============================================================
import math

def cosine_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

documents = [
    {"id": "doc1", "text": "Deep Learning with PyTorch", "vector": [0.88, 0.22, 0.41]},
    {"id": "doc2", "text": "Gardening and Plant Care",   "vector": [-0.55, 0.81, 0.12]},
    {"id": "doc3", "text": "Convolutional Neural Nets", "vector": [0.92, 0.18, 0.35]}
]

query_vector = [0.90, 0.20, 0.38]

# TODO: Step 1 - Calculate (score, doc) pairs for each document:
scored_docs = []

# TODO: Step 2 - Sort descending by score and slice the top 2:
top_2 = []

print("Top 2 Retrieved Documents:")
for score, doc in top_2:
    print(f"  Score: {round(score, 4)} | [{doc['id']}] {doc['text']}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.2 (Canonical Solution)
# ============================================================
import math

def cosine_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

documents = [
    {"id": "doc1", "text": "Deep Learning with PyTorch", "vector": [0.88, 0.22, 0.41]},
    {"id": "doc2", "text": "Gardening and Plant Care",   "vector": [-0.55, 0.81, 0.12]},
    {"id": "doc3", "text": "Convolutional Neural Nets", "vector": [0.92, 0.18, 0.35]}
]

query_vector = [0.90, 0.20, 0.38]

scored_docs = [(cosine_sim(query_vector, doc["vector"]), doc) for doc in documents]
scored_docs.sort(key=lambda x: x[0], reverse=True)
top_2 = scored_docs[:2]

print("Top 2 Retrieved Documents:")
for score, doc in top_2:
    print(f"  Score: {round(score, 4)} | [{doc['id']}] {doc['text']}")
`,
          testCode: `assert len(top_2) == 2, "Must return exactly top 2 items"
assert top_2[0][1]["id"] in ["doc1", "doc3"], "Top document must be doc1 or doc3"
assert top_2[1][1]["id"] in ["doc1", "doc3"], "Second document must be doc1 or doc3"
assert top_2[0][0] >= top_2[1][0], "Results must be sorted in descending order"
print("✓ [TEST PASSED] Top-K nearest neighbor ranking verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Top-K nearest neighbor ranking verified.',
          hint: 'Score all docs with (cosine_sim(query_vector, doc["vector"]), doc), sort reverse=True, and slice [:2].',
          progressiveHints: [
            'Tier 1 (Mental Model): Top-K search evaluates every candidate, ranks by similarity, and selects the highest scoring items.',
            'Tier 2 (Logic): Build a list of (score, doc) tuples, sort with key=lambda x: x[0] and reverse=True, then take the first 2 elements with [:2].',
            'Tier 3 (Syntax): scored_docs = [(cosine_sim(query_vector, d["vector"]), d) for d in documents]; scored_docs.sort(key=lambda x: x[0], reverse=True); top_2 = scored_docs[:2].'
          ]
        },
        {
          id: 'lesson-1-3-3',
          title: 'Boss Project: Interactive Semantic Search Engine',
          subtitle: 'A Production-Grade Vector Search Engine in Pure Python',
          firstPrinciplesIntuition: 'Congratulations on reaching the Phase 2 Boss Project! Here, you synthesize everything you have mastered into a complete, end-to-end SemanticSearchEngine. Your engine maintains an internal document registry, embeds query vectors, calculates cosine projections across high-dimensional space, and returns ranked relevance matches with zero third-party dependencies or external API costs!',
          content: `### The Full Semantic Search Engine Architecture

In this Boss Project, you will build a standalone search engine class encapsulating document indexing, vector storage, and ranked nearest-neighbor retrieval.

\`\`\`
SemanticSearchEngine
  |
  +-- add_document(id, text, vector)
  |     └── Indexes document metadata & numerical coordinates
  |
  +-- search(query_vector, top_k)
        ├── 1. Computes cosine similarity for every indexed record
        ├── 2. Sorts candidates by score in descending order
        └── 3. Returns Top-K items formatted as:
               [{"id": ..., "text": ..., "score": ...}, ...]
\`\`\`

#### Your Engineering Challenge:
1. Complete \`add_document\` in \`SemanticSearchEngine\`.
2. Implement \`search(self, query_vector, top_k=2)\` returning the top $K$ documents with rounded scores (3 decimal places).`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.3 (Boss Project)
# Build a Production Semantic Search Engine from Scratch
# ============================================================
import math

class SemanticSearchEngine:
    def __init__(self):
        self.documents = []

    def add_document(self, doc_id: str, text: str, vector: list):
        # TODO: Step 1: Append record dictionary {"id": doc_id, "text": text, "vector": vector}
        pass

    def _cosine_similarity(self, v1: list, v2: list) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        mag1 = math.sqrt(sum(a * a for a in v1))
        mag2 = math.sqrt(sum(b * b for b in v2))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot / (mag1 * mag2)

    def search(self, query_vector: list, top_k: int = 2) -> list:
        # TODO: Step 2: Compute cosine similarity against all indexed documents
        # TODO: Step 3: Sort descending by score and return top_k formatted results
        # [{"id": doc["id"], "text": doc["text"], "score": round(score, 3)}, ...]
        return []

engine = SemanticSearchEngine()
engine.add_document("doc-1", "Attention is all you need for Transformers", [0.95, 0.10, 0.28])
engine.add_document("doc-2", "Baking sourdough bread with wild yeast",   [-0.80, 0.55, 0.20])
engine.add_document("doc-3", "Self-attention mechanisms in deep learning", [0.91, 0.15, 0.38])

probe_query = [0.92, 0.12, 0.35]
results = engine.search(probe_query, top_k=2)

print(f"Top {len(results)} Semantic Search Results:")
for r in results:
    print(f"  [{r['id']}] Score: {r['score']} | {r['text']}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.3 (Boss Project)
# Canonical Solution
# ============================================================
import math

class SemanticSearchEngine:
    def __init__(self):
        self.documents = []

    def add_document(self, doc_id: str, text: str, vector: list):
        self.documents.append({
            "id": doc_id,
            "text": text,
            "vector": vector
        })

    def _cosine_similarity(self, v1: list, v2: list) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        mag1 = math.sqrt(sum(a * a for a in v1))
        mag2 = math.sqrt(sum(b * b for b in v2))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot / (mag1 * mag2)

    def search(self, query_vector: list, top_k: int = 2) -> list:
        scored = []
        for doc in self.documents:
            score = self._cosine_similarity(query_vector, doc["vector"])
            scored.append({
                "id": doc["id"],
                "text": doc["text"],
                "score": round(score, 3)
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

engine = SemanticSearchEngine()
engine.add_document("doc-1", "Attention is all you need for Transformers", [0.95, 0.10, 0.28])
engine.add_document("doc-2", "Baking sourdough bread with wild yeast",   [-0.80, 0.55, 0.20])
engine.add_document("doc-3", "Self-attention mechanisms in deep learning", [0.91, 0.15, 0.38])

probe_query = [0.92, 0.12, 0.35]
results = engine.search(probe_query, top_k=2)

print(f"Top {len(results)} Semantic Search Results:")
for r in results:
    print(f"  [{r['id']}] Score: {r['score']} | {r['text']}")
`,
          testCode: `assert len(results) == 2, f"Expected 2 results, got {len(results)}"
assert results[0]["id"] in ["doc-1", "doc-3"], "Top result must be an AI document"
assert results[1]["id"] in ["doc-1", "doc-3"], "Second result must be an AI document"
assert results[0]["score"] >= results[1]["score"], "Results must be ranked descending"

# Dynamic Anti-Cheat Test: probe unseen vector on fresh instance
test_engine = SemanticSearchEngine()
test_engine.add_document("t1", "Cooking Pasta", [-0.8, 0.6, 0.0])
test_engine.add_document("t2", "Neural Networks", [0.9, 0.1, 0.4])
res = test_engine.search([0.9, 0.1, 0.4], top_k=1)
assert len(res) == 1 and res[0]["id"] == "t2", "Dynamic query test failed"
assert res[0]["score"] == 1.0, f"Identical vector must yield 1.0, got {res[0]['score']}"
print("✓ [TEST PASSED] Phase 2 Boss Project Semantic Search Engine verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Phase 2 Boss Project Semantic Search Engine verified.',
          hint: 'Append documents as dictionaries with id, text, vector. In search(), score each doc with _cosine_similarity, sort descending, and return scored[:top_k].',
          progressiveHints: [
            'Tier 1 (Mental Model): The search engine integrates storage, geometric comparison, and ranking into a clean object-oriented interface.',
            'Tier 2 (Logic): In search(), iterate through self.documents, compute cosine similarity, build a list of result dictionaries with rounded scores, and sort descending.',
            'Tier 3 (Syntax): scored.append({"id": doc["id"], "text": doc["text"], "score": round(score, 3)}); scored.sort(key=lambda x: x["score"], reverse=True); return scored[:top_k].'
          ]
        }
      ]
    }
  ]
};
