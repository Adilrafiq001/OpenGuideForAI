export interface ParetoConcept {
  id: string;
  title: string;
  governsPct: string; // e.g. "80% of Retrieval & Memory"
  summary: string;
  coreFormula: string;
  plainIntuition: string;
  examQuestion: string;
}

export interface BlurtingPrompt {
  id: string;
  topic: string;
  shortTopic: string;
  studyText: string;
  coreKeywords: string[];
  canonicalSummary: string;
}

export interface FeynmanChallenge {
  id: string;
  topic: string;
  shortTopic: string;
  forbiddenJargon: string[];
  goodMetaphorHint: string;
  idealPlainExplanation: string;
}

export interface TargetedDrill {
  id: string;
  concept: string;
  hardScenario: string;
  options: { label: string; isCorrect: boolean; feedback: string }[];
}

export interface VerifiedResource {
  id: string;
  title: string;
  authorOrSource: string;
  description: string;
  url: string;
  category: 'Feynman' | 'Ultralearning' | 'Cognitive Science' | 'Spaced Repetition';
  badge: string;
}

export const PARETO_CONCEPTS: ParetoConcept[] = [
  {
    id: 'embeddings',
    title: 'Vector Embeddings (Spatial Meaning)',
    governsPct: '80% of Vector Search, RAG & Memory',
    summary: 'Converting qualitative concepts, words, and documents into lists of coordinates where distance directly represents semantic similarity.',
    coreFormula: 'v = E(token) ∈ ℝ¹⁵³⁶',
    plainIntuition: 'Think of GPS coordinates for a city. London and Paris are near each other on a globe; "King" and "Queen" are near each other in 1536-dimensional space.',
    examQuestion: 'Why does adding two embedding vectors together (e.g., King - Man + Woman) produce Queen?'
  },
  {
    id: 'cosine',
    title: 'Cosine Similarity (Angular Distance)',
    governsPct: '80% of Semantic Matching & Ranking',
    summary: 'Measuring the angle between two vectors rather than their absolute lengths, making comparisons independent of document word count.',
    coreFormula: 'cos(θ) = (A · B) / (‖A‖ · ‖B‖)',
    plainIntuition: 'If two arrows point in the exact same direction, similarity is 1.0 (0° angle). If they point at 90° right angles, similarity is 0.0 (completely unrelated).',
    examQuestion: 'When would Euclidean distance (L2) fail where Cosine similarity succeeds in vector search?'
  },
  {
    id: 'attention',
    title: 'Scaled Dot-Product Attention',
    governsPct: '80% of Transformer Architecture',
    summary: 'Allowing every token in a sentence to dynamically query and absorb context from every other token.',
    coreFormula: 'Attention(Q, K, V) = softmax((Q · Kᵀ) / √dₖ) · V',
    plainIntuition: 'Imagine a spotlight in a theatre. When the word "bank" appears, the spotlight checks nearby words: if it illuminates "river", bank means shore; if it illuminates "money", bank means vault.',
    examQuestion: 'Why do we divide by √dₖ in the attention equation?'
  },
  {
    id: 'loss_gradient',
    title: 'Loss Gradients & Optimization',
    governsPct: '80% of Model Training & Fine-Tuning',
    summary: 'Measuring how wrong the model is with a mathematical penalty, then taking reverse derivative steps to nudge weights closer to truth.',
    coreFormula: 'W ← W - η ∇L(W)',
    plainIntuition: 'You are blindfolded on a foggy mountain and want to reach the valley. You tap the ground with your foot to find which direction slopes downwards, and take one step that way.',
    examQuestion: 'What happens if the learning rate η is set 100x too large?'
  },
  {
    id: 'react_loop',
    title: 'The ReAct Agent Execution Loop',
    governsPct: '80% of Autonomous AI Agents',
    summary: 'Interleaving internal reasoning tokens with structured external tool calls and environment feedback.',
    coreFormula: 'Thought → Action(tool, args) → Observation → Final Answer',
    plainIntuition: 'Instead of blurting out an answer with blind hallucination, the model pauses, admits what data it lacks, writes down a python command or API search, inspects the result, and then answers.',
    examQuestion: 'Why does an agent fail if it acts without generating an intermediate Thought step?'
  }
];

export const BLURTING_CHALLENGES: BlurtingPrompt[] = [
  {
    id: 'blurt_embeddings',
    topic: 'High-Dimensional Vector Embeddings',
    shortTopic: 'Vector Embeddings',
    studyText: 'An embedding is a numerical representation of semantic meaning. In large language models, each token is mapped to a high-dimensional vector (such as 1536 floating point numbers). Similar concepts are positioned close to one another in this Euclidean hyper-space. Dot product and cosine similarity calculate the angular distance between vectors to measure contextual relevance.',
    coreKeywords: ['numerical', 'semantic', 'high-dimensional', 'coordinates', 'vector', 'cosine similarity', 'distance', 'angle'],
    canonicalSummary: 'Embeddings map text tokens to high-dimensional coordinates (vectors). Words with similar semantic meanings cluster together. Similarity is determined by measuring angular distance via cosine similarity.'
  },
  {
    id: 'blurt_attention',
    topic: 'Self-Attention Mechanism',
    shortTopic: 'Self-Attention',
    studyText: 'Self-attention calculates how strongly each word in a sequence should attend to every other word. It does this using three matrices: Queries (what I am looking for), Keys (what I contain), and Values (the actual information passed). The dot product of Q and K is scaled by sqrt(d_k), passed through softmax to get probability weights, and multiplied by V.',
    coreKeywords: ['queries', 'keys', 'values', 'softmax', 'scaled', 'dot product', 'context', 'weights'],
    canonicalSummary: 'Self-attention uses Query, Key, and Value vectors to weigh how much focus each token gives to other tokens. Q and K dot products are scaled by sqrt(d_k), normalized via softmax, and applied to V.'
  },
  {
    id: 'blurt_rag',
    topic: 'Retrieval-Augmented Generation (RAG)',
    shortTopic: 'RAG Architecture',
    studyText: 'RAG prevents model hallucinations by injecting factual documents into the prompt at runtime. Ingestion involves chunking source text, converting chunks into vector embeddings, and indexing them in a vector database. At query time, the user question is embedded, nearest-neighbor search retrieves top-k relevant chunks, and these are passed into the LLM context window.',
    coreKeywords: ['hallucination', 'chunking', 'vector database', 'top-k', 'context window', 'retrieval', 'runtime', 'embeddings'],
    canonicalSummary: 'RAG retrieves authoritative document chunks from a vector database using semantic similarity search and injects them into the LLM prompt context window to ground responses in fact.'
  }
];

export const FEYNMAN_CHALLENGES: FeynmanChallenge[] = [
  {
    id: 'feynman_transformer',
    topic: 'Explain a Transformer to a 12-Year-Old',
    shortTopic: 'Transformer',
    forbiddenJargon: ['transformer', 'feedforward', 'backpropagation', 'hyperparameter', 'eigenvalue', 'stochastic'],
    goodMetaphorHint: 'Compare it to a smart team of detectives reading a mystery book where everyone passes sticky notes highlighting connected clues.',
    idealPlainExplanation: 'Imagine reading a sentence, but instead of reading one word at a time, you see all the words at once. Each word sends a message to other words asking, "How do you relate to me?" Words that belong together, like "ice" and "cold", form strong invisible threads. The computer uses these threads to understand the full meaning.'
  },
  {
    id: 'feynman_cosine',
    topic: 'Explain Cosine Similarity to a Novice',
    shortTopic: 'Cosine Similarity',
    forbiddenJargon: ['cosine', 'dot product', 'magnitude', 'euclidean', 'hyperplane', 'trigonometric'],
    goodMetaphorHint: 'Use two laser pointers or flashlights shining on a wall.',
    idealPlainExplanation: 'Imagine you and a friend each have a laser pointer. If both pointers aim at the exact same target on the wall, you are in 100% agreement. If one aims straight ahead and the other aims at the ceiling, you have 0% in common. It does not matter how bright your laser is—only where it points.'
  },
  {
    id: 'feynman_agent',
    topic: 'Explain Autonomous AI Agents to a Novice',
    shortTopic: 'AI Agents',
    forbiddenJargon: ['agentic', 'react loop', 'mcp schema', 'json-rpc', 'deterministic'],
    goodMetaphorHint: 'Think of a chef who has a recipe book, a phone to order ingredients, and an oven.',
    idealPlainExplanation: 'Instead of just answering your question like a calculator, an AI agent can stop and think: "To solve this, I need to check the weather, write a file, or search the web." It uses tools like a human uses hands, looks at what happened, and keeps working until the goal is finished.'
  }
];

export const TARGETED_DRILLS: TargetedDrill[] = [
  {
    id: 'drill_1',
    concept: 'Cosine Similarity vs Euclidean Distance',
    hardScenario: 'You are comparing a 5-word sentence with a 500-word essay on the exact same topic (Quantum Physics). Euclidean distance says they are very far apart, but Cosine similarity says they are 96% similar. Why?',
    options: [
      {
        label: 'Euclidean distance is sensitive to vector magnitude (document length), while Cosine similarity only measures directional angle.',
        isCorrect: true,
        feedback: 'Correct! Longer documents have much larger total vector lengths. Euclidean distance measures the straight-line distance between the tips of vectors, which distorts similarity. Cosine similarity only looks at the angle between them.'
      },
      {
        label: 'Cosine similarity automatically deletes stop words from the calculation.',
        isCorrect: false,
        feedback: 'Incorrect. Cosine similarity does not inspect tokens or words; it purely evaluates the cosine of the angle between two multi-dimensional coordinates.'
      },
      {
        label: 'Euclidean distance only works on 2D planes, not 1536-dimensional spaces.',
        isCorrect: false,
        feedback: 'Incorrect. Euclidean distance is mathematically valid in any dimensional space, but distance scales with vector magnitude.'
      }
    ]
  },
  {
    id: 'drill_2',
    concept: 'Softmax Temperature in Inference',
    hardScenario: 'When temperature T is set to 0.001, what happens to the output logits of the next token probability distribution?',
    options: [
      {
        label: 'The probability distribution becomes completely uniform (random flat guessing).',
        isCorrect: false,
        feedback: 'Incorrect. A temperature approaching infinity produces uniform flat probability. Low temperature does the exact opposite.'
      },
      {
        label: 'The highest logit becomes almost 100% probability (greedy deterministic selection).',
        isCorrect: true,
        feedback: 'Correct! Dividing logits by T close to 0 magnifies the gap between numbers before softmax, converting the distribution into an argmax spike (deterministic).'
      },
      {
        label: 'The model rejects the user prompt and throws a context window error.',
        isCorrect: false,
        feedback: 'Incorrect. Temperature is purely a mathematical scaling factor applied during the final sampling step.'
      }
    ]
  },
  {
    id: 'drill_3',
    concept: 'Embedding Chunk Size Trade-off in RAG',
    hardScenario: 'If you chunk documents into tiny 10-token pieces before indexing into your vector database, what primary failure occurs during retrieval?',
    options: [
      {
        label: 'Chunks lose their surrounding context, causing the retrieved pieces to be ambiguous or misleading to the model.',
        isCorrect: true,
        feedback: 'Correct! A 10-token chunk (e.g. "it was approved by the board") lacks who "it" refers to and when it occurred. Context fragmentation is a primary failure mode.'
      },
      {
        label: 'Vector databases reject chunks with fewer than 512 dimensions.',
        isCorrect: false,
        feedback: 'Incorrect. The embedding model always outputs fixed dimensions (e.g. 1536) regardless of chunk length.'
      },
      {
        label: 'Cosine similarity becomes negative for all short sentences.',
        isCorrect: false,
        feedback: 'Incorrect. Sentence length does not force negative cosine similarity.'
      }
    ]
  }
];

export const VERIFIED_RESOURCES: VerifiedResource[] = [
  {
    id: 'farnam_feynman',
    title: 'The Feynman Technique Guide',
    authorOrSource: 'Farnam Street (Shane Parrish)',
    description: 'The definitive step-by-step framework for isolating cognitive blind spots by explaining complex concepts with simple language and no jargon.',
    url: 'https://fs.blog/feynman-technique/',
    category: 'Feynman',
    badge: 'Core Mental Model'
  },
  {
    id: 'scott_ultralearning',
    title: 'Ultralearning 9 Core Principles',
    authorOrSource: 'Scott H. Young',
    description: 'High-intensity learning framework covering Directness, Metalearning, Drilling, and Active Retrieval for rapid technical mastery.',
    url: 'https://readingraphics.com/book-summary-ultralearning-scott-young/',
    category: 'Ultralearning',
    badge: 'Framework'
  },
  {
    id: 'learning_scientists',
    title: 'Downloadable Cognitive Study Sheets',
    authorOrSource: 'The Learning Scientists (Cognitive Psychologists)',
    description: 'Free peer-reviewed visual PDF cheat sheets detailing practical cognitive methods: Retrieval Practice, Dual Coding, Spaced Practice, and Interleaving.',
    url: 'https://www.learningscientists.org/downloadable-materials',
    category: 'Cognitive Science',
    badge: 'Free Download'
  },
  {
    id: 'anki_web',
    title: 'Anki Web (Automated Spaced Repetition)',
    authorOrSource: 'Anki Ecosystem',
    description: '100% free open-source spaced repetition engine that automates review intervals according to the Ebbinghaus forgetting curve so zero time is wasted.',
    url: 'https://apps.ankiweb.net/',
    category: 'Spaced Repetition',
    badge: 'Free Tool'
  }
];
