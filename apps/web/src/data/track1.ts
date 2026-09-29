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
          firstPrinciplesIntuition: 'In classical software, words are just arbitrary integer IDs (strings). But in AI, words live in high-dimensional vector spaces. If "king" is at [0.9, 0.2] and "queen" is at [0.85, 0.25], the distance between them is tiny because their meanings are related.',
          content: 'Create two simple 2D vectors representing two concepts ("king" and "queen") and print their coordinates.',
          initialCode: 'king = [0.9, 0.2]\nqueen = [0.85, 0.25]\nprint(f"King: {king}")\nprint(f"Queen: {queen}")',
          expectedOutput: 'King: [0.9, 0.2]\nQueen: [0.85, 0.25]',
          hint: 'Run the Python code to inspect the vector coordinates.'
        },
        {
          id: 'lesson-1-1-2',
          title: 'Vector Magnitude & Normalization',
          subtitle: 'Standardizing Arrow Lengths to Unit 1.0 (L2 Norm)',
          firstPrinciplesIntuition: 'When comparing two vectors, we care about their direction (what topic they discuss), not their length (document word count). Normalizing a vector divides each coordinate by its Euclidean norm (sqrt(sum(x^2))), producing a unit vector of length exactly 1.0 on a hypersphere.',
          content: 'Calculate the magnitude of vector [3.0, 4.0] using the Pythagorean theorem (sqrt(x^2 + y^2)) and normalize it.',
          initialCode: 'import math\n\nv = [3.0, 4.0]\nmag = math.sqrt(v[0]**2 + v[1]**2)\nunit_v = [round(v[0] / mag, 2), round(v[1] / mag, 2)]\nprint(f"Magnitude: {mag}")\nprint(f"Normalized: {unit_v}")',
          expectedOutput: 'Magnitude: 5.0\nNormalized: [0.6, 0.8]',
          hint: 'The magnitude of (3, 4) is 5.0, so the normalized components are 3/5 = 0.6 and 4/5 = 0.8.'
        },
        {
          id: 'lesson-1-1-3',
          title: 'The Dot Product: Measuring Alignment',
          subtitle: 'The Core Mathematical Operation of Attention & Embeddings',
          firstPrinciplesIntuition: 'The dot product multiplies corresponding dimensions and sums the results (sum(a_i * b_i)). If two unit vectors point in the identical direction, their dot product is 1.0. If orthogonal (90 degrees, unrelated), it is 0.0. If opposite (180 degrees), it is -1.0. This single operation powers all Transformer self-attention queries and keys.',
          content: 'Compute the dot product between two 3D vectors a = [1, 2, 3] and b = [4, 5, 6].',
          initialCode: 'a = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum(x * y for x, y in zip(a, b))\nprint(f"Dot product: {dot}")',
          expectedOutput: 'Dot product: 32',
          hint: '1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32.'
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
          content: 'Compare the angle (cosine similarity) of a short text vector [1.0, 2.0] with an expanded version [10.0, 20.0].',
          initialCode: 'import math\n\ndef cosine_sim(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    return dot / (mag1 * mag2)\n\nshort_doc = [1.0, 2.0]\nlong_doc = [10.0, 20.0]\nsim = cosine_sim(short_doc, long_doc)\nprint(f"Similarity: {round(sim, 2)}")',
          expectedOutput: 'Similarity: 1.0',
          hint: 'Since both vectors have identical proportions, their cosine similarity is 1.0 (0 degree angle).'
        },
        {
          id: 'lesson-1-2-2',
          title: 'Computing the Cosine Similarity Matrix',
          subtitle: 'Scoring One Query Vector Against Multiple Candidate Documents',
          firstPrinciplesIntuition: 'In real AI systems, an incoming user query embedding is compared against multiple document chunk embeddings. We compute cosine similarity for each document and rank them from highest alignment to lowest.',
          content: 'Compute cosine similarity between query [0.8, 0.6] and three candidate topic vectors.',
          initialCode: 'import math\n\ndef cosine_similarity(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    return round(dot / (mag1 * mag2), 4)\n\nquery = [0.8, 0.6]\ncandidates = {\n    "AI Systems": [0.85, 0.52],\n    "Biology Genetics": [-0.3, 0.95],\n    "Machine Learning": [0.79, 0.61]\n}\n\nfor topic, vec in candidates.items():\n    score = cosine_similarity(query, vec)\n    print(f"{topic}: {score}")',
          expectedOutput: 'AI Systems: 0.9922\nBiology Genetics: 0.3344\nMachine Learning: 0.9999',
          hint: 'Compare query coordinates with candidate vectors using dot product divided by product of magnitudes.'
        },
        {
          id: 'lesson-1-2-3',
          title: 'Distance Metrics: Cosine vs Euclidean vs Manhattan',
          subtitle: 'Choosing the Right Metric for Vector Databases (L1, L2, Cosine)',
          firstPrinciplesIntuition: 'Vector databases allow configuring different distance metrics. Euclidean distance (L2) measures straight-line distance; Manhattan distance (L1) measures grid-like absolute differences; Cosine distance (1 - CosineSimilarity) measures angular difference. For normalized embeddings, Euclidean and Cosine distances become monotonically equivalent!',
          content: 'Calculate Manhattan (L1), Euclidean (L2), and Cosine distance between vectors [1.0, 2.0] and [4.0, 6.0].',
          initialCode: 'import math\n\np = [1.0, 2.0]\nq = [4.0, 6.0]\n\n# Manhattan Distance (L1): sum(|p_i - q_i|)\nmanhattan = sum(abs(a - b) for a, b in zip(p, q))\n\n# Euclidean Distance (L2): sqrt(sum((p_i - q_i)^2))\neuclidean = math.sqrt(sum((a - b)**2 for a, b in zip(p, q)))\n\n# Cosine Distance: 1 - cosine_similarity\ndot = sum(a * b for a, b in zip(p, q))\ncos_sim = dot / (math.sqrt(sum(a*a for a in p)) * math.sqrt(sum(b*b for b in q)))\ncos_dist = round(1.0 - cos_sim, 4)\n\nprint(f"L1 Manhattan: {manhattan}")\nprint(f"L2 Euclidean: {euclidean}")\nprint(f"Cosine Distance: {cos_dist}")',
          expectedOutput: 'L1 Manhattan: 7.0\nL2 Euclidean: 5.0\nCosine Distance: 0.0039',
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
          content: 'Implement a SimpleVectorStore class that registers documents with IDs and vectors.',
          initialCode: 'class SimpleVectorStore:\n    def __init__(self):\n        self.documents = []\n\n    def add(self, doc_id, text, vector):\n        self.documents.append({"id": doc_id, "text": text, "vector": vector})\n\n    def count(self):\n        return len(self.documents)\n\nstore = SimpleVectorStore()\nstore.add("doc1", "Introduction to Neural Networks", [0.9, 0.1, 0.4])\nstore.add("doc2", "French Cooking Recipes", [-0.2, 0.8, 0.1])\nprint(f"Indexed {store.count()} documents successfully.")',
          expectedOutput: 'Indexed 2 documents successfully.',
          hint: 'The store appends records and reports total count.'
        },
        {
          id: 'lesson-1-3-2',
          title: 'Top-K Nearest Neighbor Retrieval',
          subtitle: 'Scoring, Sorting, and Threshold Filtering',
          firstPrinciplesIntuition: 'Once document embeddings are indexed, searching is as simple as computing cosine similarity against each vector, sorting descending by score, and slicing the top K items.',
          content: 'Calculate cosine similarity across candidate documents and retrieve the top-2 ranked matches for query vector.',
          initialCode: 'import math\n\ndef cosine_sim(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    return dot / (mag1 * mag2) if (mag1 * mag2) > 0 else 0\n\ncorpus = [\n    {"id": "doc_1", "text": "Linear algebra and matrix operations", "vec": [0.9, 0.2, 0.1]},\n    {"id": "doc_2", "text": "Italian baking and bread sourdough", "vec": [-0.5, 0.8, -0.2]},\n    {"id": "doc_3", "text": "Deep neural network architectures", "vec": [0.85, 0.35, 0.2]}\n]\n\nquery_vec = [0.88, 0.25, 0.15]\n\n# Calculate scores and sort descending\nscored = []\nfor item in corpus:\n    score = cosine_sim(query_vec, item["vec"])\n    scored.append({"id": item["id"], "score": round(score, 4), "text": item["text"]})\n\nscored.sort(key=lambda x: x["score"], reverse=True)\n\n# Top-2 retrieval\ntop_k = scored[:2]\nfor rank, result in enumerate(top_k, 1):\n    print(f"Rank {rank}: [{result[\'id\']}] Score: {result[\'score\']} | {result[\'text\']}")',
          expectedOutput: 'Rank 1: [doc_1] Score: 0.9995 | Linear algebra and matrix operations\nRank 2: [doc_3] Score: 0.9904 | Deep neural network architectures',
          hint: 'doc_1 and doc_3 are mathematically closest to the linear algebra/neural network query.'
        },
        {
          id: 'lesson-1-3-3',
          title: 'Boss Project: Interactive Semantic Search Engine',
          subtitle: 'Building an End-to-End Client-Side Vector Search Engine',
          firstPrinciplesIntuition: 'Congratulations on reaching the Phase 2 Boss Project! Here, you assemble a complete vector search engine with indexing, vector normalization, and ranking across a 5-document multimodal knowledge base. This forms the exact retrieval core of production RAG systems.',
          content: 'Build and run a complete SemanticSearchEngine class indexing 5 documents and querying for the top 2 AI documents.',
          initialCode: 'import math\n\nclass SemanticSearchEngine:\n    def __init__(self):\n        self.index = []\n\n    def add_document(self, doc_id, title, vector):\n        # Normalize on index for rapid dot-product comparisons\n        mag = math.sqrt(sum(x * x for x in vector))\n        norm_vec = [x / mag for x in vector] if mag > 0 else vector\n        self.index.append({"id": doc_id, "title": title, "vector": norm_vec})\n\n    def search(self, query_vector, top_k=2):\n        mag = math.sqrt(sum(x * x for x in query_vector))\n        norm_query = [x / mag for x in query_vector] if mag > 0 else query_vector\n        \n        results = []\n        for doc in self.index:\n            # Dot product of normalized vectors equals cosine similarity\n            sim = sum(a * b for a, b in zip(norm_query, doc["vector"]))\n            results.append({"id": doc["id"], "title": doc["title"], "score": round(sim, 4)})\n            \n        results.sort(key=lambda x: x["score"], reverse=True)\n        return results[:top_k]\n\n# Initialize and index 5 diverse documents\nengine = SemanticSearchEngine()\nengine.add_document("ai_01", "Vector Manifolds & Embeddings", [0.92, 0.35, 0.15])\nengine.add_document("cook_02", "Artisan Sourdough Fermentation", [-0.60, 0.75, -0.20])\nengine.add_document("ai_03", "Transformer Attention Mechanisms", [0.88, 0.40, 0.22])\nengine.add_document("phys_04", "General Relativity & Spacetime", [0.10, -0.30, 0.95])\nengine.add_document("cook_05", "Classic French Pastry Techniques", [-0.55, 0.80, -0.15])\n\n# Query for an AI engineering topic\nai_query = [0.90, 0.38, 0.18]\nmatches = engine.search(ai_query, top_k=2)\n\nprint(f"Total Indexed Documents: {len(engine.index)}")\nfor i, match in enumerate(matches, 1):\n    print(f"Top {i}: {match[\'id\']} - {match[\'title\']} (Cosine: {match[\'score\']})")',
          expectedOutput: 'Total Indexed Documents: 5\nTop 1: ai_01 - Vector Manifolds & Embeddings (Cosine: 0.9989)\nTop 2: ai_03 - Transformer Attention Mechanisms (Cosine: 0.9988)',
          hint: 'The engine normalizes vectors upon addition, so a simple dot-product yields the exact cosine similarity.'
        }
      ]
    }
  ]
};
