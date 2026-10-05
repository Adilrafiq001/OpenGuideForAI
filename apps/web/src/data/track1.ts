import type { Track } from './track0';

export const track1: Track = {
  id: 'track-1',
  title: 'Track 1: Vector Spaces & High-Dimensional Geometry',
  description: 'Understand how computers understand meaning. Explore vector embeddings, high-dimensional distances, cosine similarity, and in-memory semantic search with zero external APIs.',
  modules: [
    {
      id: 'module-1-1',
      title: 'Module 1.1: Vector Embeddings & High-Dimensional Geometry',
      description: 'Learn why concepts can be represented as arrays of numbers, how vectors define direction, and how the dot product measures conceptual alignment.',
      lessons: [
        {
          id: 'lesson-1-1-1',
          title: 'The Vector as an Arrow in Semantic Space',
          subtitle: 'From Coordinates to Conceptual Meaning',
          firstPrinciplesIntuition: 'In classical databases, words are discrete categorical IDs with zero intrinsic geometric relationship ("king" and "queen" are as unrelated as "king" and "tractor"). In modern AI, concepts are projected into continuous high-dimensional vector manifolds R^d. Semantic similarity is measured by spatial proximity and angular alignment. Notice: If king = [0.9, 0.2] and queen = [0.85, 0.25], the vector displacement (delta = queen - king) encodes conceptual dimensions like gender, formality, and role.',
          content: '### Mathematical Foundation: High-Dimensional Coordinate Manifolds\n\nIn d-dimensional Euclidean space, a vector v in R^d is an ordered tuple (v_1, v_2, ..., v_d).\n\n**Key Properties to Remember:**\n1. **Direction**: Encodes the topic or semantic concept.\n2. **Magnitude (L2 Norm)**: ||v|| = sqrt(sum(v_i^2)). In unnormalized embeddings, magnitude often reflects word frequency rather than meaning.\n3. **Displacement**: delta = v_2 - v_1 represents the semantic transformation from concept 1 to concept 2.\n\n**Common Trap:** Never assume raw coordinates from different embedding models can be compared directly; each model defines an orthogonal manifold basis.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.1
# Objective: The Vector as an Arrow in Semantic Space
# ============================================================

# Step 1: Define semantic coordinate vectors in R^2
king = [0.9, 0.2]
queen = [0.85, 0.25]

# Step 2: Compute the semantic delta displacement vector: (queen - king)
# Hint: delta[i] = round(queen[i] - king[i], 4)
delta = []

# Step 3: Compute the squared Euclidean distance: sum((queen[i] - king[i])^2)
squared_distance = 0.0

print(f"King   : {king}")
print(f"Queen  : {queen}")
print(f"Delta  : {delta}")
print(f"Dist^2 : {squared_distance}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.1 (Canonical Solution)
# ============================================================

king = [0.9, 0.2]
queen = [0.85, 0.25]
delta = [round(q - k, 4) for k, q in zip(king, queen)]
squared_distance = round(sum((q - k) ** 2 for k, q in zip(king, queen)), 6)

print(f"King   : {king}")
print(f"Queen  : {queen}")
print(f"Delta  : {delta}")
print(f"Dist^2 : {squared_distance}")
`,
          testCode: `assert isinstance(king, list) and len(king) == 2, "king must be a 2D list [x, y]"
assert isinstance(queen, list) and len(queen) == 2, "queen must be a 2D list [x, y]"
assert king == [0.9, 0.2], f"Expected king = [0.9, 0.2], got {king}"
assert queen == [0.85, 0.25], f"Expected queen = [0.85, 0.25], got {queen}"
assert isinstance(delta, list) and len(delta) == 2, "delta must be a 2D list [dx, dy]"
assert abs(delta[0] - (-0.05)) < 1e-4 and abs(delta[1] - 0.05) < 1e-4, f"delta incorrect: got {delta}"
assert abs(squared_distance - 0.005) < 1e-4, f"squared_distance incorrect: got {squared_distance}"
print("✓ [TEST PASSED] Semantic vector coordinates successfully initialized.")
`,
          expectedOutput: '✓ [TEST PASSED] Semantic vector coordinates successfully initialized.',
          hint: 'Subtract king coordinates from queen coordinates: delta = [round(queen[0] - king[0], 4), round(queen[1] - king[1], 4)].',
          progressiveHints: [
            'Recall that vector subtraction is element-wise: (q_x - k_x, q_y - k_y).',
            'For delta: queen[0] - king[0] is 0.85 - 0.9 = -0.05, and queen[1] - king[1] is 0.25 - 0.20 = 0.05.',
            'For squared_distance: sum the square of each component of delta: (-0.05)^2 + (0.05)^2 = 0.0025 + 0.0025 = 0.005.'
          ]
        },
        {
          id: 'lesson-1-1-2',
          title: 'Vector Magnitude & Normalization',
          subtitle: 'Standardizing Arrow Lengths to Unit 1.0 (L2 Norm)',
          firstPrinciplesIntuition: 'When comparing conceptual embeddings, document length is an irrelevant confounder. A 5,000-word treatise on quantum physics has a massive vector length simply because terms repeat, whereas an abstract has a short length. Projecting both vectors onto the surface of a unit hypersphere (||v||_2 = 1.0) eliminates magnitude distortion so downstream cosine operations measure purely semantic direction.',
          content: '### Mathematical Formulation: The Euclidean L2 Norm & Hypersphere Projection\n\nGiven v = [v_1, v_2, ..., v_d], the Euclidean magnitude is:\n$$\\|v\\|_2 = \\sqrt{\\sum_{i=1}^d v_i^2}$$\n\nTo construct the unit vector u = v / ||v||_2, divide every dimension by the magnitude.\n\n**Numerical Stability Guardrail (Crucial in Production ML):**\nIf v is an all-zero vector, ||v|| = 0. Attempting division by zero throws a ZeroDivisionError in Python or NaN in WebGL shaders. Production inference engines add an epsilon damping term: u = v / (||v|| + 1e-12).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.2
# Objective: Vector Magnitude & Unit Normalization (L2 Norm)
# ============================================================
import math

v = [3.0, 4.0]

# Step 1: Calculate Euclidean L2 magnitude: sqrt(sum(x^2))
mag = 0.0

# Step 2: Normalize vector to unit length with epsilon protection: round(x / (mag + 1e-12), 2)
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
            'For (3, 4), 3^2 + 4^2 = 9 + 16 = 25. The square root of 25 is 5.0.',
            'Divide each element by 5.0: 3.0 / 5.0 = 0.6, and 4.0 / 5.0 = 0.8.',
            'Unit vector coordinates are [0.6, 0.8]. Notice that 0.6^2 + 0.8^2 = 0.36 + 0.64 = 1.0 exactly!'
          ]
        },
        {
          id: 'lesson-1-1-3',
          title: 'The Dot Product: Measuring Alignment',
          subtitle: 'The Core Mathematical Operation of Attention & Embeddings',
          firstPrinciplesIntuition: 'The dot product is the single most important mathematical operation in modern artificial intelligence. It computes the projection of one vector directly onto another. If two unit vectors point in the identical direction (angle theta = 0), cos(0) = 1.0. If they are orthogonal (90 degrees, conceptually independent), their dot product is exactly 0.0. In Transformer self-attention, Query @ Key^T is nothing more than billions of parallel dot products computing how much attention one token owes another.',
          content: '### Geometric & Algebraic Equivalence of the Dot Product\n\nAlgebraic definition:\n$$\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^d a_i b_i = a_1 b_1 + a_2 b_2 + \\dots + a_d b_d$$\n\nGeometric definition:\n$$\\mathbf{a} \\cdot \\mathbf{b} = \\|\\mathbf{a}\\| \\|\\mathbf{b}\\| \\cos \\theta$$\n\nWhen vectors are normalized to unit length (||a|| = ||b|| = 1.0), the algebraic sum of element-wise products equals the cosine of the angle between them!\n\n**Common Trap:** Remember that the dot product is sensitive to coordinate scaling. If vector A is multiplied by 10, the dot product grows 10x without any change in conceptual orientation.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.3
# Objective: The Dot Product - Measuring Conceptual Alignment
# ============================================================

a = [1, 2, 3]
b = [4, 5, 6]

# Step 1: Compute dot product by multiplying corresponding elements and summing:
# sum(x * y for x, y in zip(a, b))
dot = 0

print(f"Vector A            : {a}")
print(f"Vector B            : {b}")
print(f"Dot Product (A · B) : {dot}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.1.3 (Canonical Solution)
# ============================================================

a = [1, 2, 3]
b = [4, 5, 6]
dot = sum(x * y for x, y in zip(a, b))

print(f"Vector A            : {a}")
print(f"Vector B            : {b}")
print(f"Dot Product (A · B) : {dot}")
`,
          testCode: `assert dot == 32, f"Expected dot product 32, got {dot}"
assert sum(x * y for x, y in zip([1, 0], [0, 1])) == 0, "Orthogonal dot product must equal 0"
print("✓ [TEST PASSED] Vector dot product calculation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Vector dot product calculation verified.',
          hint: 'Multiply pairwise coordinates and add them together: (1 * 4) + (2 * 5) + (3 * 6) = 4 + 10 + 18 = 32.',
          progressiveHints: [
            'Pair up coordinates using zip(a, b): [(1, 4), (2, 5), (3, 6)].',
            'Compute element-wise products: 1 * 4 = 4, 2 * 5 = 10, 3 * 6 = 18.',
            'Sum the products: 4 + 10 + 18 = 32. Use sum(x * y for x, y in zip(a, b)).'
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
          firstPrinciplesIntuition: 'A 100-page book on physics and a 1-page summary on physics share the exact same conceptual direction, but the 100-page book vector is 100x longer. Euclidean distance would mistakenly say they are far apart; cosine similarity says they are identical.',
          content: 'Compare the angle (cosine similarity) of a short text vector [1.0, 2.0] with an expanded version [10.0, 20.0]. Complete the cosine similarity calculation.',
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
          hint: 'Since both vectors have identical proportions, their cosine similarity is 1.0 (0 degree angle).'
        },
        {
          id: 'lesson-1-2-2',
          title: 'Computing the Cosine Similarity Matrix',
          subtitle: 'Scoring One Query Vector Against Multiple Candidate Documents',
          firstPrinciplesIntuition: 'In real AI systems, an incoming user query embedding is compared against multiple document chunk embeddings. We compute cosine similarity for each document and rank them from highest alignment to lowest.',
          content: 'Compute cosine similarity between query [0.8, 0.6] and three candidate topic vectors to identify the best match.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.2
# Objective: Computing the Cosine Similarity Matrix
# ============================================================
import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return round(dot / (mag1 * mag2), 4)

query = [0.8, 0.6]
candidates = {
    "AI Systems": [0.85, 0.52],
    "Biology Genetics": [-0.3, 0.95],
    "Machine Learning": [0.79, 0.61]
}

# TODO: Step 1 - Calculate similarity for each candidate and store in scores dict
scores = {}
# for topic, vec in candidates.items():
#     scores[topic] = ...
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.2 (Canonical Solution)
# ============================================================
import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return round(dot / (mag1 * mag2), 4)

query = [0.8, 0.6]
candidates = {
    "AI Systems": [0.85, 0.52],
    "Biology Genetics": [-0.3, 0.95],
    "Machine Learning": [0.79, 0.61]
}

scores = {}
for topic, vec in candidates.items():
    scores[topic] = cosine_similarity(query, vec)
    print(f"Alignment to [{topic}]: {scores[topic]}")
`,
          testCode: `assert len(scores) == 3, f"Expected 3 topic scores, got {len(scores)}"
assert scores["Machine Learning"] > scores["Biology Genetics"], "Machine Learning must rank higher than Biology"
assert scores["AI Systems"] >= 0.99, f"AI Systems score should be >= 0.99, got {scores['AI Systems']}"
assert scores["Biology Genetics"] < 0.5, f"Biology Genetics score should be < 0.5, got {scores['Biology Genetics']}"
print("✓ [TEST PASSED] Multi-candidate cosine ranking matrix verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Multi-candidate cosine ranking matrix verified.',
          hint: 'Compare query coordinates with candidate vectors using dot product divided by product of magnitudes.'
        },
        {
          id: 'lesson-1-2-3',
          title: 'Distance Metrics: Cosine vs Euclidean vs Manhattan',
          subtitle: 'Choosing the Right Metric for Vector Databases (L1, L2, Cosine)',
          firstPrinciplesIntuition: 'Vector databases allow configuring different distance metrics. Euclidean distance (L2) measures straight-line distance; Manhattan distance (L1) measures grid-like absolute differences; Cosine distance (1 - CosineSimilarity) measures angular difference. For normalized embeddings, Euclidean and Cosine distances become monotonically equivalent!',
          content: 'Calculate Manhattan (L1), Euclidean (L2), and Cosine distance between vectors [1.0, 2.0] and [4.0, 6.0].',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.2.3
# Objective: Distance Metrics: Cosine vs Euclidean vs Manhattan
# ============================================================
import math

p = [1.0, 2.0]
q = [4.0, 6.0]

# TODO: Step 1 - Manhattan Distance (L1): sum(|p_i - q_i|)
manhattan = 0.0

# TODO: Step 2 - Euclidean Distance (L2): sqrt(sum((p_i - q_i)^2))
euclidean = 0.0

# TODO: Step 3 - Cosine Distance: 1.0 - cosine_similarity
cos_dist = 0.0

print(f"L1 Manhattan Distance: {manhattan}")
print(f"L2 Euclidean Distance: {euclidean}")
print(f"Cosine Distance: {cos_dist}")
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
print(f"Cosine Distance: {cos_dist}")
`,
          testCode: `assert manhattan == 7.0, f"Expected Manhattan 7.0, got {manhattan}"
assert euclidean == 5.0, f"Expected Euclidean 5.0, got {euclidean}"
assert cos_dist == 0.0039, f"Expected Cosine distance 0.0039, got {cos_dist}"
print("✓ [TEST PASSED] Tri-metric geometric comparison verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Tri-metric geometric comparison verified.',
          hint: 'L1 is |1-4| + |2-6| = 3+4=7. L2 is sqrt(3^2 + 4^2) = 5.'
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
          firstPrinciplesIntuition: 'Underneath all enterprise vector databases is a simple loop: store document embeddings in an array, compute cosine similarity against a query vector, and sort descending.',
          content: 'Implement a SimpleVectorStore class that registers documents with unique IDs and vector embeddings.',
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
        return len(self.documents)

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
          hint: 'The store appends records and reports total count via len(self.documents).'
        },
        {
          id: 'lesson-1-3-2',
          title: 'Top-K Nearest Neighbor Retrieval',
          subtitle: 'Scoring, Sorting, and Threshold Filtering',
          firstPrinciplesIntuition: 'Once document embeddings are indexed, searching is as simple as computing cosine similarity against each vector, sorting descending by score, and slicing the top K items.',
          content: 'Calculate cosine similarity across candidate documents and retrieve the top-2 ranked matches for a query vector.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.2
# Objective: Top-K Nearest Neighbor Retrieval
# ============================================================
import math

def cosine_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2) if (mag1 * mag2) > 0 else 0

corpus = [
    {"id": "doc_1", "text": "Linear algebra and matrix operations", "vec": [0.9, 0.2, 0.1]},
    {"id": "doc_2", "text": "Italian baking and bread sourdough", "vec": [-0.5, 0.8, -0.2]},
    {"id": "doc_3", "text": "Deep neural network architectures", "vec": [0.85, 0.35, 0.2]}
]

query_vec = [0.88, 0.25, 0.15]

# TODO: Step 1 - Score candidate documents against query vector
scored = []

# TODO: Step 2 - Sort candidates descending by cosine score
# scored.sort(...)

# TODO: Step 3 - Extract top-2 nearest neighbors
top_k = []
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.2 (Canonical Solution)
# ============================================================
import math

def cosine_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2) if (mag1 * mag2) > 0 else 0

corpus = [
    {"id": "doc_1", "text": "Linear algebra and matrix operations", "vec": [0.9, 0.2, 0.1]},
    {"id": "doc_2", "text": "Italian baking and bread sourdough", "vec": [-0.5, 0.8, -0.2]},
    {"id": "doc_3", "text": "Deep neural network architectures", "vec": [0.85, 0.35, 0.2]}
]

query_vec = [0.88, 0.25, 0.15]

scored = []
for item in corpus:
    score = cosine_sim(query_vec, item["vec"])
    scored.append({"id": item["id"], "score": round(score, 4), "text": item["text"]})

scored.sort(key=lambda x: x["score"], reverse=True)
top_k = scored[:2]

for rank, result in enumerate(top_k, 1):
    print(f"Rank {rank}: [{result['id']}] Score: {result['score']} | {result['text']}")
`,
          testCode: `assert len(top_k) == 2, f"Expected 2 matches, got {len(top_k)}"
assert top_k[0]["id"] == "doc_1", f"Top match should be doc_1, got {top_k[0]['id']}"
assert top_k[1]["id"] == "doc_3", f"Second match should be doc_3, got {top_k[1]['id']}"
assert top_k[0]["score"] > top_k[1]["score"], "Results must be sorted descending"
print("✓ [TEST PASSED] Top-K nearest neighbor ranking verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Top-K nearest neighbor ranking verified.',
          hint: 'doc_1 and doc_3 are mathematically closest to the linear algebra/neural network query.'
        },
        {
          id: 'lesson-1-3-3',
          title: 'Boss Project: Interactive Semantic Search Engine',
          subtitle: 'Building an End-to-End Client-Side Vector Search Engine',
          firstPrinciplesIntuition: 'Congratulations on reaching the Phase 2 Boss Project! Here, you assemble a complete vector search engine with indexing, vector normalization, and ranking across a 5-document multimodal knowledge base. This forms the exact retrieval core of production RAG systems.',
          content: 'Build and run a complete SemanticSearchEngine class indexing 5 documents and querying for the top 2 AI documents.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.3
# Objective: Boss Project - Interactive Semantic Search Engine
# ============================================================
import math

class SemanticSearchEngine:
    def __init__(self):
        self.index = []

    def add_document(self, doc_id, title, vector):
        # TODO: Normalize vector and append {"id": doc_id, "title": title, "vector": norm_vec}
        mag = math.sqrt(sum(x * x for x in vector))
        norm_vec = [x / mag for x in vector] if mag > 0 else vector
        self.index.append({"id": doc_id, "title": title, "vector": norm_vec})

    def search(self, query_vector, top_k=2):
        # TODO: Normalize query vector, compute cosine similarity, sort descending, return top_k
        mag = math.sqrt(sum(x * x for x in query_vector))
        norm_query = [x / mag for x in query_vector] if mag > 0 else query_vector
        
        results = []
        for doc in self.index:
            sim = sum(a * b for a, b in zip(norm_query, doc["vector"]))
            results.append({"id": doc["id"], "title": doc["title"], "score": round(sim, 4)})
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

# TODO: Instantiate and populate engine with 5 documents
engine = SemanticSearchEngine()
engine.add_document("ai_01", "Vector Manifolds & Embeddings", [0.92, 0.35, 0.15])
engine.add_document("cook_02", "Artisan Sourdough Fermentation", [-0.60, 0.75, -0.20])
engine.add_document("ai_03", "Transformer Attention Mechanisms", [0.88, 0.40, 0.22])
engine.add_document("phys_04", "General Relativity & Spacetime", [0.10, -0.30, 0.95])
engine.add_document("cook_05", "Classic French Pastry Techniques", [-0.55, 0.80, -0.15])

# TODO: Query for an AI topic and retrieve top 2
ai_query = [0.90, 0.38, 0.18]
matches = engine.search(ai_query, top_k=2)

print(f"Total Indexed Documents: {len(engine.index)}")
for i, match in enumerate(matches, 1):
    print(f"Top {i}: {match['id']} - {match['title']} (Cosine: {match['score']})")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 1 - Lab 1.3.3 (Canonical Solution)
# ============================================================
import math

class SemanticSearchEngine:
    def __init__(self):
        self.index = []

    def add_document(self, doc_id, title, vector):
        mag = math.sqrt(sum(x * x for x in vector))
        norm_vec = [x / mag for x in vector] if mag > 0 else vector
        self.index.append({"id": doc_id, "title": title, "vector": norm_vec})

    def search(self, query_vector, top_k=2):
        mag = math.sqrt(sum(x * x for x in query_vector))
        norm_query = [x / mag for x in query_vector] if mag > 0 else query_vector
        
        results = []
        for doc in self.index:
            sim = sum(a * b for a, b in zip(norm_query, doc["vector"]))
            results.append({"id": doc["id"], "title": doc["title"], "score": round(sim, 4)})
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

engine = SemanticSearchEngine()
engine.add_document("ai_01", "Vector Manifolds & Embeddings", [0.92, 0.35, 0.15])
engine.add_document("cook_02", "Artisan Sourdough Fermentation", [-0.60, 0.75, -0.20])
engine.add_document("ai_03", "Transformer Attention Mechanisms", [0.88, 0.40, 0.22])
engine.add_document("phys_04", "General Relativity & Spacetime", [0.10, -0.30, 0.95])
engine.add_document("cook_05", "Classic French Pastry Techniques", [-0.55, 0.80, -0.15])

ai_query = [0.90, 0.38, 0.18]
matches = engine.search(ai_query, top_k=2)

print(f"Total Indexed Documents: {len(engine.index)}")
for i, match in enumerate(matches, 1):
    print(f"Top {i}: {match['id']} - {match['title']} (Cosine: {match['score']})")
`,
          testCode: `assert len(engine.index) == 5, f"Expected 5 indexed documents, got {len(engine.index)}"
assert len(matches) == 2, f"Expected 2 top matches, got {len(matches)}"
assert matches[0]["id"] == "ai_01", f"Top match must be ai_01, got {matches[0]['id']}"
assert matches[1]["id"] == "ai_03", f"Second match must be ai_03, got {matches[1]['id']}"
assert matches[0]["score"] >= 0.99, "Cosine similarity for ai_01 should exceed 0.99"
print("✓ [TEST PASSED] Phase 2 Boss Project Semantic Search Engine verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Phase 2 Boss Project Semantic Search Engine verified.',
          hint: 'The engine normalizes vectors upon addition, so a simple dot-product yields the exact cosine similarity.'
        }
      ]
    }
  ]
};
