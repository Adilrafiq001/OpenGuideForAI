import type { Track } from './track0';

export const track1: Track = {
  id: 'track-1',
  title: 'Track 1: Vector Spaces & High-Dimensional Geometry',
  description: 'Understand how computers understand meaning. Explore vector embeddings, high-dimensional distances, cosine similarity, and in-memory semantic search with zero external APIs.',
  modules: [
    {
      id: 'module-1-1',
      title: 'Module 1.1: High-Dimensional Geometry & Vector Basics',
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
          subtitle: 'Standardizing Arrow Lengths to Unit 1.0',
          firstPrinciplesIntuition: 'When comparing two vectors, we often care about their direction (what topic they discuss), not their length (how many times a word appeared). Normalizing a vector scales its length to exactly 1.0.',
          content: 'Calculate the magnitude of vector [3.0, 4.0] using the Pythagorean theorem (sqrt(x^2 + y^2)) and normalize it.',
          initialCode: 'import math\n\nv = [3.0, 4.0]\nmag = math.sqrt(v[0]**2 + v[1]**2)\nunit_v = [v[0] / mag, v[1] / mag]\nprint(f"Magnitude: {mag}")\nprint(f"Normalized: {unit_v}")',
          expectedOutput: 'Magnitude: 5.0\nNormalized: [0.6, 0.8]',
          hint: 'The magnitude of (3, 4) is 5.0, so the normalized components are 3/5 = 0.6 and 4/5 = 0.8.'
        },
        {
          id: 'lesson-1-1-3',
          title: 'The Dot Product: Measuring Alignment',
          subtitle: 'The Core Mathematical Operation of Attention & Embeddings',
          firstPrinciplesIntuition: 'The dot product multiplies corresponding dimensions and sums the results. If two vectors point in the exact same direction, their dot product is maximized. If they are perpendicular (unrelated), their dot product is 0.',
          content: 'Compute the dot product between two 3D vectors a = [1, 2, 3] and b = [4, 5, 6].',
          initialCode: 'a = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum(x * y for x, y in zip(a, b))\nprint(f"Dot product: {dot}")',
          expectedOutput: 'Dot product: 32',
          hint: '1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32.'
        }
      ]
    },
    {
      id: 'module-1-2',
      title: 'Module 1.2: Cosine Similarity vs. Euclidean Distance',
      description: 'Why Euclidean distance suffers from the curse of dimensionality, and how cosine similarity captures true semantic angle.',
      lessons: [
        {
          id: 'lesson-1-2-1',
          title: 'Why Angle Trumps Distance in Text',
          subtitle: 'The Difference Between Length and Meaning',
          firstPrinciplesIntuition: 'A 100-page book on physics and a 1-page summary on physics share the exact same conceptual direction, but the 100-page book vector is 100x longer. Euclidean distance would mistakenly say they are far apart; cosine similarity says they are identical.',
          content: 'Compare the angle (cosine similarity) of a short text vector [1.0, 2.0] with an expanded version [10.0, 20.0].',
          initialCode: 'import math\n\ndef cosine_sim(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    return dot / (mag1 * mag2)\n\nshort_doc = [1.0, 2.0]\nlong_doc = [10.0, 20.0]\nsim = cosine_sim(short_doc, long_doc)\nprint(f"Similarity: {round(sim, 2)}")',
          expectedOutput: 'Similarity: 1.0',
          hint: 'Since both vectors have identical proportions, their cosine similarity is 1.0 (0 degree angle).'
        },
        {
          id: 'lesson-1-2-2',
          title: 'Computing Cosine Distance',
          subtitle: 'Turning Similarities into Metrics for Indexing',
          firstPrinciplesIntuition: 'Most vector databases store distance rather than similarity, where 0.0 means identical and 2.0 means opposite. Cosine distance is simply 1.0 - cosine_similarity.',
          content: 'Calculate the cosine distance between two orthogonal (perpendicular) vectors [1.0, 0.0] and [0.0, 1.0].',
          initialCode: 'v1 = [1.0, 0.0]\nv2 = [0.0, 1.0]\n# Perpendicular vectors have dot product = 0\ndot = sum(a * b for a, b in zip(v1, v2))\nsim = dot / (1.0 * 1.0)\ndistance = 1.0 - sim\nprint(f"Cosine Distance: {distance}")',
          expectedOutput: 'Cosine Distance: 1.0',
          hint: 'Perpendicular vectors have cosine similarity 0.0 and cosine distance 1.0.'
        }
      ]
    },
    {
      id: 'module-1-3',
      title: 'Module 1.3: In-Memory Semantic Vector Search',
      description: 'Build your first vector search engine in pure Python. Index passages, query with an embedding, and return the Top-K closest matches.',
      lessons: [
        {
          id: 'lesson-1-3-1',
          title: 'Building an In-Memory Vector Store',
          subtitle: 'The Anatomy of FAISS, Chroma, and Qdrant in 10 Lines of Python',
          firstPrinciplesIntuition: 'Underneath all enterprise vector databases is a simple loop: store document embeddings in an array, compute cosine similarity against a query vector, and sort descending.',
          content: 'Search an in-memory database of 3 documents to find the one closest to query vector [0.8, 0.6].',
          initialCode: 'documents = [\n    {"id": "doc1", "text": "Deep learning architectures", "vec": [0.8, 0.5]},\n    {"id": "doc2", "text": "Cooking pasta and sauces", "vec": [-0.5, 0.8]},\n    {"id": "doc3", "text": "Neural network optimization", "vec": [0.75, 0.65]}\n]\nquery = [0.8, 0.6]\n\ndef score(doc):\n    # dot product as simplified similarity\n    return sum(a * b for a, b in zip(doc["vec"], query))\n\nbest_match = max(documents, key=score)\nprint(f"Best Match: {best_match[\'id\']} -> {best_match[\'text\']}")',
          expectedOutput: 'Best Match: doc3 -> Neural network optimization',
          hint: 'doc3 has the highest dot product with the AI query.'
        }
      ]
    }
  ]
};
