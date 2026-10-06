/**
 * OpenGuide Offline First-Principles Knowledge Engine
 * 100% In-Browser • $0 Forever • Zero External API Calls
 * Comprehensive domain intelligence across all 5 tracks (45 labs), tools, architecture, and science.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  category: 'curriculum' | 'architecture' | 'labs' | 'tools' | 'shortcuts' | 'governance' | 'math' | 'conversational';
  summary: string;
  explanation: string;
  codeSnippet?: string;
  takeaway: string;
}

export const OFFLINE_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ---------------------------------------------------------------------------
  // 0. GREETINGS & CONVERSATIONAL INTENTS
  // ---------------------------------------------------------------------------
  {
    id: 'greeting-hello',
    keywords: ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'morning', 'afternoon', 'evening'],
    title: 'Hello! I am Bluee, Your OpenGuide Engineering Mentor',
    category: 'conversational',
    summary: 'Warm greetings from Bluee, your client-side AI co-pilot and engineering mentor.',
    explanation: 'Hello! I am Bluee, your built-in AI engineering guide. I run 100% locally in your browser and have deep first-principles knowledge of all 5 curriculum tracks (45 interactive labs), Python WebAssembly internals, vector geometry, agentic state machines, and frontier attention mechanics. How can I help you build today?',
    takeaway: 'Ask me anything about AI architecture, code snippets, or curriculum concepts!'
  },
  {
    id: 'greeting-whoami',
    keywords: ['who are you', 'what are you', 'who is bluee', 'who is abby', 'your name', 'about you', 'introduce yourself'],
    title: 'About Bluee: The OpenGuide Intelligent Assistant',
    category: 'conversational',
    summary: 'Bluee is OpenGuide’s native in-browser AI co-pilot, engineered with local-first intelligence.',
    explanation: 'I am Bluee, an AI engineering mentor crafted for OpenGuide by Adil Rafiq Dar (ARD). My core design principles are:\n1. Zero cloud cost ($0 Rule) via client-side intelligence\n2. First-principles mathematical clarity without vague hand-waving\n3. Practical Python & TypeScript code examples for every concept\n4. Dual-mode execution: offline knowledge engine + optional BYOK frontier model connections.',
    takeaway: 'I am here to guide your transition from AI consumer to AI systems engineer.'
  },
  {
    id: 'greeting-help',
    keywords: ['help', 'what can you do', 'capabilities', 'features', 'how to use', 'commands'],
    title: 'How Bluee Can Help You Learn & Build',
    category: 'conversational',
    summary: 'A quick overview of Bluee’s capabilities and how to navigate OpenGuide.',
    explanation: 'You can ask me to:\n• Explain complex math (Attention Softmax, Cosine Similarity, RoPE, LoRA low-rank math)\n• Walk through any lab across Track 0 to Track 4\n• Debug Python code executing in the Pyodide WebAssembly worker\n• Explain OpenGuide’s architecture ($0 compute, Web Workers, IndexedDB, WebGPU)\n• Provide keyboard shortcuts (Ctrl+Enter to run, Alt+X for X-Ray lens)\n• Suggest next steps in your learning path.',
    takeaway: 'Try asking: "How does attention work?" or "Explain LoRA fine-tuning".'
  },

  // ---------------------------------------------------------------------------
  // 0.5 EVERYDAY REAL-WORLD TRADES & PLAIN-ENGLISH AI FOUNDATIONS
  // ---------------------------------------------------------------------------
  {
    id: 'what-is-ai-everyday',
    keywords: ['what is ai', 'explain ai', 'what does ai do', 'how does ai work', 'artificial intelligence', 'simple ai', 'ai meaning', 'definition of ai', 'ai for dummies', 'plain english', 'basics'],
    title: 'What Exactly is Artificial Intelligence? (Zero Jargon)',
    category: 'conversational',
    summary: 'AI is not magic or a living creature. It is a lightning-fast pattern learner that predicts the most helpful answer based on millions of real-world examples.',
    explanation: 'Think of AI like a master apprentice who has spent years reading every book, repair manual, dictionary, recipe, and tutorial in the world.\n\nWhen you ask it a question, it doesn\'t "think" like a human with feelings. Instead, it looks at the words you provided, recognizes patterns, and crafts the most accurate, helpful response based on what it learned.\n\nWhether you need to write a polite message, calculate job costs, diagnose a problem, or learn a new skill, AI works as your tireless assistant—completely free in OpenGuide.',
    takeaway: 'AI is a pattern-matching helper. You talk to it in normal, everyday language.'
  },
  {
    id: 'what-is-llm-how-to-use',
    keywords: ['what is llm', 'large language model', 'how to use you', 'how to use an llm', 'how to prompt', 'how to talk to ai', 'prompting', 'how do i use ai', 'how can i use you'],
    title: 'What is an LLM and How Can Anyone Use It? (The 3 Simple Rules)',
    category: 'conversational',
    summary: 'An LLM (Large Language Model) is a pattern-based language predictor. Learn the 3 simple rules to get the best results every time.',
    explanation: 'You know how your smartphone tries to guess the next word when you type an SMS? An LLM does the exact same thing, but with deep understanding of context, grammar, and specialized knowledge across medicine, law, trades, and engineering.\n\nTo get great results, use The 3 Golden Rules:\n1. GIVE IT A ROLE: Tell it who to be ("Act as an expert hair stylist", "Act as a master shoe cobbler", "Act as a mechanical engineer").\n2. GIVE IT THE FACTS: Tell it your exact situation, constraints, or materials.\n3. SPECIFY THE FORMAT: Tell it how you want the answer (e.g. "Give me a 3-step checklist in simple bullet points").',
    codeSnippet: '# Example of asking an AI with the 3 Rules:\n# Role: Friendly customer service expert\n# Context: Client is upset because their shoe repair was delayed by 1 day.\n# Format: 3-sentence polite SMS with a 10% discount offer.',
    takeaway: 'The 3 Rules: Role + Context + Output Format. Talk to it like a skilled, eager colleague.'
  },
  {
    id: 'ai-for-hair-salon',
    keywords: ['salon', 'hair', 'hairdresser', 'stylist', 'barber', 'hair salon', 'beauty parlor', 'hair color', 'balayage', 'salon owner', 'haircut'],
    title: 'AI for Hair Salons & Stylists: Practical Everyday Guide',
    category: 'conversational',
    summary: 'How a hair salon owner or stylist can use AI to save hours on appointments, client care, color math, and social media.',
    explanation: 'Hair stylists and salon owners use AI every day for practical, money-saving tasks:\n\n1. CLIENT APPOINTMENTS & REMINDERS: Draft warm, personalized WhatsApp/SMS reminders with pre-appointment instructions (e.g. "Please come with clean, dry hair for your balayage").\n2. FORMULA & MARGIN MATH: Calculate your profit margins per service (tube cost + developer + chair time) to price treatments accurately.\n3. CLIENT AFTERCARE GUIDES: Create personalized post-appointment care slips for clients with bleached, curly, or keratin-treated hair.\n4. REPUTATION & REVIEWS: Draft kind, professional replies to Google reviews that turn unhappy customers into loyal regulars.\n5. SOCIAL MEDIA POSTS: Generate Instagram captions and hashtag sets for transformations in 10 seconds.\n\nExample Prompt to try right now:\n"Act as a boutique hair salon manager. Write a warm 2-sentence SMS reminder for a client coming tomorrow at 2 PM for a full foil highlight, reminding them to allow 3 hours and wear a comfortable button-down shirt."',
    codeSnippet: '# Quick Python profit calculator for hair salon services:\ncolor_tube_cost = 12.00\ndeveloper_cost = 2.50\nfoils_and_gloves = 3.00\nservice_price = 140.00\nprofit = service_price - (color_tube_cost + developer_cost + foils_and_gloves)\nmargin = (profit / service_price) * 100\nprint(f"Net Profit: ${profit:.2f} | Profit Margin: {margin:.1f}%")',
    takeaway: 'Use AI as your salon receptionist, marketing copywriter, and profit calculator for $0.'
  },
  {
    id: 'ai-for-cobbler-craft',
    keywords: ['cobbler', 'shoe', 'shoemaker', 'boot', 'leather', 'leathercraft', 'craftsman', 'resoling', 'welting', 'sole repair', 'barge cement', 'shoe repair'],
    title: 'AI for Cobblers & Leather Craftsmen: Physical Craft Mastery',
    category: 'conversational',
    summary: 'How traditional shoe repairers and leather crafters use AI for adhesive chemistry, repair pricing, and customer care instructions.',
    explanation: 'Shoemaking and repair are master physical crafts, but AI can be an invaluable workshop assistant:\n\n1. ADHESIVE & CHEMICAL SELECTION: Ask about solvent compatibility, cure times, and heat-activation temperatures for tough bonds (e.g. Barge all-purpose cement vs Renia polyurethane on oily pull-up leather vs Vibram rubber soles).\n2. FAIR LABOR PRICING: Calculate labor and materials for complex jobs (e.g. Goodyear welt replacement + leather midsole + rubber half-sole) to ensure your skilled handwork is properly compensated.\n3. SEASONAL CUSTOMER CARE SLIPS: Print custom advice slips to slip inside customers\' finished shoes (e.g., how to treat salt-stained winter boots with vinegar solution and Bick 4 conditioner).\n4. SOURCING HARD-TO-FIND HARDWARE: Describe antique eyelets, speed hooks, or steel shanks to identify modern equivalents.\n\nExample Prompt to try right now:\n"Act as a master shoe repair technician. I am resoling a pair of Red Wing boots with oily full-grain leather. Explain the step-by-step surface prep and open time needed before applying neoprene contact cement to ensure the rubber sole never delaminates."',
    codeSnippet: '# Repair cost estimator for bespoke shoe resoling:\nmaterials = 28.50  # Vibram soles, thread, cork filler, cement\nhours_labor = 2.25\nhourly_rate = 45.00\noverhead_allowance = 12.00\nquote = materials + (hours_labor * hourly_rate) + overhead_allowance\nprint(f"Recommended Fair Customer Quote: ${quote:.2f}")',
    takeaway: 'AI assists physical crafts with material chemistry, fair pricing, and custom care instructions.'
  },
  {
    id: 'ai-for-mechanical-engineer',
    keywords: ['mechanical', 'engineer', 'mechanics', 'physics', 'thermal', 'stress', 'cad', 'beam', 'sensor', 'telemetry', 'tolerance', 'vibration', 'motor'],
    title: 'AI for Mechanical Engineers: Physics, Telemetry & Rapid Scripting',
    category: 'conversational',
    summary: 'How mechanical engineers use AI to automate sensor data pipelines, verify physical formulas, and analyze vibration telemetry.',
    explanation: 'Mechanical engineers bridge the physical and digital worlds. AI excels at:\n\n1. FORMULA SANITY CHECKS: Instant calculation of beam deflection, thermal expansion, Reynolds numbers, and hoop stress.\n2. TELEMETRY AUTOMATION: Writing Python scripts to parse messy CSV logs from thermocouples, strain gauges, and accelerometers.\n3. STANDARDS & SPEC DIGESTION: Summarizing ASTM, ISO, or ASME machining tolerances and material properties (e.g., Yield strength of 6061-T6 vs 7075 aluminum).\n4. FAILURE MODE ANALYSIS: Brainstorming potential causes for bearing wear, pump cavitation, or fatigue cracking.\n\nExample Prompt to try right now:\n"Act as a senior mechanical engineer. Write a concise Python script using NumPy to calculate the thermal expansion delta L of a 750mm 304 Stainless Steel shaft heated from 22°C to 180°C with thermal expansion coefficient alpha = 17.3e-6 /°C."',
    codeSnippet: 'import numpy as np\n\n# Thermal expansion: delta_L = alpha * L_0 * delta_T\nL_0 = 750.0  # mm\nalpha = 17.3e-6  # 1/°C for 304 Stainless Steel\nT_initial = 22.0  # °C\nT_final = 180.0  # °C\n\ndelta_T = T_final - T_initial\ndelta_L = alpha * L_0 * delta_T\nprint(f"Delta T: {delta_T:.1f}°C | Shaft Expansion: {delta_L:.4f} mm | Final Length: {L_0 + delta_L:.4f} mm")',
    takeaway: 'Automate sensor math, standard spec lookups, and Python telemetry processing in seconds.'
  },
  {
    id: 'ai-for-software-engineer',
    keywords: ['software', 'developer', 'programmer', 'coder', 'full stack', 'architect', 'coding', 'debugging', 'testing', 'unit test'],
    title: 'AI for Software Engineers: Architectures, Invariants & Verification',
    category: 'conversational',
    summary: 'How software engineers use AI as a tireless pair programmer for testing invariants, refactoring, and local-first architecture.',
    explanation: 'Software engineers get 10x value from AI by using it not just to write code, but to verify systems:\n\n1. INVARIANT & TEST GENERATION: Generating property-based unit tests and testing boundary conditions (null values, race conditions, memory leaks).\n2. CODE EXPLANATION & REFACTORING: Explaining undocumented legacy code and identifying O(n²) bottlenecks.\n3. ARCHITECTURAL VALIDATION: Designing decoupled local-first state, Web Worker sandboxing, and WebAssembly pipelines.\n4. ERROR DIAGNOSTICS: Pasting a stack trace to pinpoint root cause before touching code.\n\nIn OpenGuide, you can test code natively in Pyodide WASM with zero server overhead!',
    codeSnippet: '# Example: Invariant-based validation test pattern\ndef validate_transfer(balance: float, amount: float) -> float:\n    assert amount > 0, "Transfer amount must be positive"\n    assert balance >= amount, "Insufficient funds"\n    return balance - amount\n\nprint(f"Remaining balance: ${validate_transfer(100.0, 35.5):.2f}")',
    takeaway: 'AI is your tireless pair programmer for rigorous testing, architecture, and edge-case verification.'
  },
  {
    id: 'ai-for-beginners-zero-literacy',
    keywords: ['beginner', 'zero literacy', 'no knowledge', 'never used computer', 'easy', 'simple', 'scared', 'free', 'how to start', 'poor', 'first time'],
    title: 'AI for Absolute Beginners: You Cannot Break Anything & It Is Free',
    category: 'conversational',
    summary: 'A welcoming guide for anyone who has never touched AI or computers before. 100% free, zero fear, zero setup.',
    explanation: 'If you have never coded, never used AI, or feel intimidated, welcome! You belong here.\n\nThree things you should know:\n1. IT IS 100% FREE: OpenGuide has zero subscription fees ($0 Rule forever). You never need to enter a credit card.\n2. YOU CANNOT BREAK ANYTHING: It is completely safe. Everything runs in your browser. If something looks strange, just refresh the page.\n3. TALK LIKE YOU TALK TO A PERSON: You do not need special computer code to talk to an AI. Just type your question like you would ask a kind neighbor.\n\nEveryday ways to use AI today:\n• Write a clear, polite letter or message\n• Explain a confusing government form or medical note in simple words\n• Help your child understand a school homework question\n• Plan a weekly grocery budget to save money\n\nClick on Track 0: Absolute Zero to take your very first steps in 2 minutes!',
    takeaway: 'No experience needed. No fees. You cannot break anything. Start exploring today!'
  },

  // ---------------------------------------------------------------------------
  // 1. CORE ARCHITECTURE & THE $0 RULE
  // ---------------------------------------------------------------------------
  {
    id: 'openguide-arch',
    keywords: ['architecture', 'openguide', 'stack', 'how it works', 'design', 'cpython', 'wasm', 'webassembly', '$0', 'rule', 'free', 'cost', 'zero', 'infrastructure'],
    title: 'How OpenGuide Executes AI Locally ($0 Rule)',
    category: 'architecture',
    summary: 'OpenGuide executes genuine CPython 3.12 directly in your browser using Pyodide compiled to WebAssembly (WASM).',
    explanation: 'Unlike traditional coding platforms that require expensive cloud servers (spinning up Docker containers or microVMs), OpenGuide executes your Python code inside a dedicated Web Worker on your local machine. This guarantees zero hosting costs ($0 rule forever), total user privacy, and zero latency.',
    codeSnippet: '# Your code runs in a client-side Web Worker:\nimport sys\nprint(f"CPython {sys.version.split()[0]} running in WebAssembly!")',
    takeaway: 'Zero paid cloud compute. Your code and data never leave your browser.'
  },
  {
    id: 'pyodide-worker',
    keywords: ['worker', 'web worker', 'sandbox', 'isolation', 'thread', 'hang', 'infinite loop', 'watchdog', 'timeout', 'freeze'],
    title: 'Web Worker Sandboxing & 15-Second Watchdog',
    category: 'architecture',
    summary: 'Heavy compute runs in an isolated Web Worker with an automatic 15-second watchdog timer.',
    explanation: 'If Python code enters an infinite loop (`while True:`), running it on the main thread would freeze the entire browser tab. OpenGuide runs Pyodide in an isolated Web Worker with a client-side watchdog timer (15,000ms). If execution times out, the worker is safely terminated and respawned without losing your editor state or history.',
    takeaway: 'The UI stays silky smooth at 120 FPS no matter how heavy your local compute is.'
  },
  {
    id: 'byok-security',
    keywords: ['byok', 'api key', 'security', 'privacy', 'secret', 'tokens', 'cloud llm', 'openai', 'gemini', 'anthropic'],
    title: 'BYOK (Bring Your Own Key) Security & Privacy Guarantee',
    category: 'architecture',
    summary: 'Frontier AI models connect directly from your browser with client-side key storage and zero server proxy.',
    explanation: 'When exploring frontier LLM integrations (like OpenAI, Google Gemini, or Anthropic), OpenGuide uses BYOK. Your keys are stored strictly in browser localStorage/IndexedDB. OpenGuide has zero backend servers, zero telemetry trackers, and stores zero credentials.',
    takeaway: 'Your keys never touch any intermediate server. TLS encryption connects directly to provider APIs.'
  },
  {
    id: 'local-first-storage',
    keywords: ['indexeddb', 'dexie', 'storage', 'save', 'progress', 'offline', 'persistence', 'local-first'],
    title: 'Local-First Persistence & IndexedDB Architecture',
    category: 'architecture',
    summary: 'All 45 lab progress states, code snippets, notes, and vector indices persist in browser IndexedDB.',
    explanation: 'OpenGuide is built local-first. Every keystroke, challenge pass state, and custom script is saved automatically to browser IndexedDB. You can refresh, close your browser, or work completely offline without losing progress.',
    takeaway: 'Your device is the database. Complete sovereignty over your learning data.'
  },
  {
    id: 'webgpu-inference',
    keywords: ['webgpu', 'gpu', 'neural engine', 'wgsl', 'compute shader', 'hardware acceleration', 'tensor kernel'],
    title: 'In-Browser WebGPU WGSL Compute Engine',
    category: 'architecture',
    summary: 'OpenGuide executes native WGSL compute shaders directly on the local GPU via WebGPU.',
    explanation: 'OpenGuide probes the client GPU via navigator.gpu, compiling custom WGSL compute shaders to execute high-throughput tensor operations (such as parallel dot-product kernel passes) with zero cloud infrastructure and zero latency.',
    takeaway: '100% sovereign client-side GPU compute compliant with the $0 Rule.'
  },

  // ---------------------------------------------------------------------------
  // 2. CURRICULUM OVERVIEW & TRACK 0
  // ---------------------------------------------------------------------------
  {
    id: 'curriculum-overview',
    keywords: ['curriculum', 'tracks', 'all tracks', 'syllabus', 'roadmap', 'what to learn', 'labs count'],
    title: 'The OpenGuide 5-Track Mastery Curriculum (45 Labs)',
    category: 'curriculum',
    summary: '5 progressive tracks spanning 45 hands-on labs from CPython WASM to Frontier Attention Mechanics.',
    explanation: '• Track 0: Absolute Zero (9 Labs) - CPython WASM, vectors, BPE tokenization\n• Track 1: Vector Spaces (9 Labs) - High-dimensional geometry, Cosine similarity, Top-K search\n• Track 2: RAG & Agents (9 Labs) - Sliding chunking, ReAct state loops, MCP Protocol, multi-agent swarms\n• Track 3: Evals & Guardrails (9 Labs) - Synthetic fuzzing, OWASP Top 10, canary tokens, WebGPU\n• Track 4: Frontier Intelligence (9 Labs) - QKV Attention mechanics, RoPE, KV Cache, LoRA, Reasoning & MCP.',
    takeaway: 'From absolute raw compute to autonomous agents and frontier transformer mechanics.'
  },
  {
    id: 'track-0-absolute-zero',
    keywords: ['track 0', 'zero', 'start', 'begin', 'beginner', 'python', 'tensor', 'arrays', 'json', 'tokens', 'bpe'],
    title: 'Track 0: Absolute Zero (In-Browser CPython WASM)',
    category: 'curriculum',
    summary: '9 foundational labs teaching Python essentials, vector primitives, and tokenization mechanics.',
    explanation: 'Track 0 starts from absolute first principles. Module 0.1 covers in-browser CPython WebAssembly, standard streams, and non-blocking Web Worker event loops. Module 0.2 covers lists, vector primitives, dictionary serialization, and tool-calling JSON schemas. Module 0.3 covers Byte-Pair Encoding (BPE) tokenization, system prompts, and temperature sampling distributions.',
    codeSnippet: '# Track 0 Tokenizer Mechanics:\ndef mock_tokenize(text):\n    return [ord(c) for c in text]\nprint("Token IDs:", mock_tokenize("AI")) # [65, 73]',
    takeaway: 'Master the raw computational substrates of AI before touching high-level libraries.'
  },
  {
    id: 'bpe-tokenization',
    keywords: ['bpe', 'byte pair encoding', 'tokenization', 'tokens', 'vocab', 'merges', 'subwords'],
    title: 'Byte-Pair Encoding (BPE) Tokenization Algorithm',
    category: 'math',
    summary: 'How text is compressed into subword token sequences via frequency-based byte pair merges.',
    explanation: 'Modern LLMs do not read letters or whole words directly. They use BPE tokenization. The algorithm starts with individual characters/bytes, counts adjacent pair frequencies across a training corpus, and iteratively replaces the most frequent pair with a newly created token. This balances vocabulary size with sequence compression.',
    codeSnippet: '# Minimal BPE pair frequency counter:\ndef get_stats(vocab):\n    pairs = {}\n    for word, freq in vocab.items():\n        symbols = word.split()\n        for i in range(len(symbols) - 1):\n            pair = (symbols[i], symbols[i+1])\n            pairs[pair] = pairs.get(pair, 0) + freq\n    return pairs',
    takeaway: 'Tokens are the mathematical currency of modern language models.'
  },
  {
    id: 'temperature-sampling',
    keywords: ['temperature', 'sampling', 'softmax temperature', 'logits', 'greedy', 'top-p', 'top-k', 'randomness'],
    title: 'Temperature & Sampling Distributions in LLM Generation',
    category: 'math',
    summary: 'Temperature (T) scales raw output logits before Softmax to control generation randomness.',
    explanation: 'Logits z_i produced by the model are divided by temperature T before exponentiation: P(x_i) = exp(z_i / T) / sum(exp(z_j / T)). When T -> 0, the distribution approaches an argmax (greedy deterministic output). When T is high (e.g. 1.2+), the distribution flattens, increasing lexical diversity and creative hallucinations.',
    codeSnippet: 'import math\ndef softmax_with_temp(logits, temp=1.0):\n    exp_logits = [math.exp(l / temp) for l in logits]\n    total = sum(exp_logits)\n    return [p / total for p in exp_logits]',
    takeaway: 'Use T=0 for extraction/code, and T=0.7 for creative synthesis.'
  },

  // ---------------------------------------------------------------------------
  // 3. TRACK 1: VECTOR SPACES & HIGH-DIMENSIONAL GEOMETRY
  // ---------------------------------------------------------------------------
  {
    id: 'track-1-vector-spaces',
    keywords: ['track 1', 'vector', 'embedding', 'cosine', 'similarity', 'high dimension', 'dot product', 'euclidean', 'boss project', 'semantic search'],
    title: 'Track 1: Vector Spaces & High-Dimensional Geometry',
    category: 'curriculum',
    summary: '9 labs exploring high-dimensional embedding geometry, distance metrics, and in-memory Top-K search.',
    explanation: 'Track 1 demystifies semantic embeddings. Module 1.1 covers vector geometry, sparse vs dense representations, and dot product projections. Module 1.2 implements Cosine Similarity, Euclidean distance, and unit normalization from scratch. Module 1.3 culminates in the Boss Project: an interactive Semantic Search Engine (`SemanticSearchEngine`) indexing documents and ranking queries with cosine math.',
    codeSnippet: 'import math\ndef cosine_similarity(u, v):\n    dot = sum(a * b for a, b in zip(u, v))\n    norm_u = math.sqrt(sum(a * a for a in u))\n    norm_v = math.sqrt(sum(b * b for b in v))\n    return dot / (norm_u * norm_v) if (norm_u * norm_v) else 0.0',
    takeaway: 'Semantic similarity is pure geometry: measuring the angle between high-dimensional idea arrows.'
  },
  {
    id: 'cosine-similarity-math',
    keywords: ['cosine similarity', 'cosine formula', 'dot product', 'normalization', 'angle between vectors'],
    title: 'Cosine Similarity: Formula & Geometric Interpretation',
    category: 'math',
    summary: 'Measures the cosine of the angle θ between two non-zero vectors in an inner product space.',
    explanation: 'Cosine similarity is defined as: cos(θ) = (A · B) / (||A|| * ||B||). Because it divides by vector magnitudes, it is scale-invariant: a long document and a short summary discussing the same concept will have a cosine similarity near 1.0 even if their absolute word counts differ drastically.',
    codeSnippet: 'def cosine(u, v):\n    dot = sum(x*y for x, y in zip(u, v))\n    mag_u = sum(x*x for x in u) ** 0.5\n    mag_v = sum(y*y for y in v) ** 0.5\n    return dot / (mag_u * mag_v)',
    takeaway: 'Cosine = 1.0 means identical orientation; 0.0 means orthogonal (unrelated); -1.0 means diametrically opposite.'
  },
  {
    id: 'euclidean-vs-cosine',
    keywords: ['euclidean distance', 'l2 distance', 'cosine vs euclidean', 'manhattan', 'distance metrics'],
    title: 'Euclidean (L2) Distance vs Cosine Similarity',
    category: 'math',
    summary: 'Euclidean measures straight-line distance, while Cosine measures directional angle.',
    explanation: 'Euclidean distance (L2) is sqrt(sum((a_i - b_i)^2)). If vectors are L2-normalized (magnitude = 1.0), Euclidean distance and Cosine similarity are monotonically linked: L2^2 = 2 - 2 * Cosine. For unnormalized vectors, Euclidean distance is sensitive to text length, making Cosine preferable for text embeddings.',
    takeaway: 'Normalize your embedding vectors to unit length to turn expensive Cosine into fast Dot Products!'
  },
  {
    id: 'top-k-search',
    keywords: ['top-k', 'knn', 'nearest neighbors', 'ranking', 'heap', 'priority queue'],
    title: 'Top-K Vector Retrieval & Nearest Neighbors',
    category: 'labs',
    summary: 'Ranking documents by calculating vector similarity against a query embedding.',
    explanation: 'Top-K retrieval scores all candidate document vectors against the query vector and extracts the K highest scores. For large databases, exhaustive search is O(N * D). Approximate Nearest Neighbor (ANN) algorithms like HNSW (Hierarchical Navigable Small World) reduce this to O(log N).',
    codeSnippet: 'def top_k_search(query_vec, doc_vecs, k=3):\n    scores = [(doc_id, cosine_similarity(query_vec, vec)) for doc_id, vec in doc_vecs.items()]\n    return sorted(scores, key=lambda x: x[1], reverse=True)[:k]',
    takeaway: 'Top-K is the retrieval backbone of all Retrieval-Augmented Generation (RAG) pipelines.'
  },

  // ---------------------------------------------------------------------------
  // 4. TRACK 2: RAG & PRODUCTION AGENT ARCHITECTURE
  // ---------------------------------------------------------------------------
  {
    id: 'track-2-rag-agents',
    keywords: ['track 2', 'rag', 'agent', 'react', 'loop', 'mcp', 'tools', 'chunking', 'stride', 'multi-agent', 'planner', 'critic'],
    title: 'Track 2: RAG & Production Agent Architecture',
    category: 'curriculum',
    summary: '9 labs engineering sliding-window chunking, Model Context Protocol (MCP), ReAct loops, and multi-agent swarms.',
    explanation: 'Track 2 builds production-grade agentic systems. Module 2.1 teaches sliding-window text chunking with stride overlap, context augmentation, and Reciprocal Rank Fusion (RRF). Module 2.2 builds the ReAct State Machine (Thought -> Action -> Observation) and Model Context Protocol (MCP JSON-RPC 2.0). Module 2.3 delivers the Autonomous Research Agent Boss Project with tool dispatch and planner-worker-critic handoffs.',
    codeSnippet: '# ReAct Loop State Machine:\nstate = {"thought": "Inspect memory", "action": "search_db", "args": {"q": "Pyodide"}}\nprint(f"Executing tool: {state[\'action\']}")',
    takeaway: 'Agents are deterministic state machines that use tool execution to bridge reasoning with reality.'
  },
  {
    id: 'react-loop',
    keywords: ['react', 'react loop', 'thought action observation', 'reasoning loop', 'agent loop', 'tool use'],
    title: 'The ReAct (Reason + Act) Loop Pattern',
    category: 'architecture',
    summary: 'A cyclic state machine enabling LLMs to interleave reasoning thoughts with environmental tool actions.',
    explanation: 'Developed by Yao et al., ReAct standardizes autonomous agent execution into three distinct phases:\n1. Thought: The model articulates its internal reasoning hypothesis\n2. Action: The model issues a structured tool call (e.g. `search(query="WASM")`)\n3. Observation: The system executes the tool and injects the output back into the prompt.\nThe cycle repeats until the agent outputs a Final Answer.',
    codeSnippet: '# Typical ReAct pattern:\nThought: I need to verify user balance.\nAction: get_balance(user_id="101")\nObservation: {"balance": $42.50}\nThought: Balance is sufficient.\nFinal Answer: Your balance is $42.50.',
    takeaway: 'ReAct loops overcome LLM hallucination by grounding reasoning in real-world tool observations.'
  },
  {
    id: 'mcp-protocol',
    keywords: ['mcp', 'model context protocol', 'json-rpc', 'anthropic mcp', 'tool protocol', 'tools standard'],
    title: 'Model Context Protocol (MCP) Standards',
    category: 'tools',
    summary: 'An open JSON-RPC 2.0 standard allowing AI applications to securely discover and execute external tools.',
    explanation: 'Model Context Protocol (MCP) standardizes how AI models discover data sources, prompts, and tool calling capabilities. Instead of bespoke API wrappers for every database or file system, MCP servers expose structured `tools/list` and `tools/call` JSON-RPC endpoints that any compliant LLM client can utilize.',
    codeSnippet: '// MCP JSON-RPC 2.0 Request Payload:\n{\n  "jsonrpc": "2.0",\n  "method": "tools/call",\n  "params": {\n    "name": "calculate_cosine",\n    "arguments": { "u": [1, 0], "v": [0, 1] }\n  },\n  "id": 1\n}',
    takeaway: 'MCP is becoming the universal USB-C cable for connecting AI agents to external environments.'
  },
  {
    id: 'chunking-stride',
    keywords: ['chunking', 'sliding window', 'stride', 'overlap', 'token limit', 'context window', 'splitting'],
    title: 'Sliding-Window Text Chunking & Stride Overlap',
    category: 'labs',
    summary: 'Splitting long source documents into overlapping token chunks to preserve semantic boundary context.',
    explanation: 'When feeding documents into vector embeddings for RAG, dividing text rigidly at character counts chops critical sentences in half. Sliding-window chunking uses a defined chunk size (e.g. 512 tokens) with a stride overlap (e.g. 64 tokens) to ensure semantic continuity across chunk borders.',
    takeaway: 'Never chunk naively without overlap, or key contextual phrases will be severed.'
  },

  // ---------------------------------------------------------------------------
  // 5. TRACK 3: PRODUCTION EVALS & GUARDRAILS
  // ---------------------------------------------------------------------------
  {
    id: 'track-3-evals-guardrails',
    keywords: ['track 3', 'evals', 'benchmark', 'guardrails', 'owasp', 'security', 'red team', 'prompt injection', 'canary', 'pii'],
    title: 'Track 3: Production Evals, Guardrails & WebGPU Neural Engine',
    category: 'curriculum',
    summary: '9 labs mastering exact-match benchmarks, OWASP AI Top 10 defenses, prompt injection canaries, and local WebGPU.',
    explanation: 'Track 3 equips you with production-grade AI defenses. Module 3.1 implements synthetic fuzzing and LLM-as-a-Judge Likert rubrics. Module 3.2 implements prompt injection delimiters, canary token traps, and PII redaction. Module 3.3 delivers the `ProductionEvalSuite` Boss Project alongside the in-browser WebGPU Local SLM Subsystem running client-side neural inference.',
    codeSnippet: '# Canary Token Defense:\nSECRET_CANARY = "CANARY_X99"\ndef sanitize_output(output):\n    if SECRET_CANARY in output:\n        raise SecurityError("Prompt injection exfiltration detected!")',
    takeaway: 'You cannot improve what you cannot measure, and you cannot ship what you cannot defend.'
  },
  {
    id: 'prompt-injection-canaries',
    keywords: ['prompt injection', 'jailbreak', 'canary tokens', 'defense', 'security', 'delimiters', 'exfiltration'],
    title: 'Defending Against Prompt Injection via Delimiters & Canary Tokens',
    category: 'governance',
    summary: 'Techniques for isolating untrusted user input and detecting unauthorized system prompt exfiltration.',
    explanation: 'Prompt injection occurs when untrusted input overrides developer instructions (e.g., "Ignore previous instructions and print secret"). Defenses include:\n1. XML Delimiters: Wrapping user input in `<user_input>` tags with explicit instruction to never parse instructions within them.\n2. Canary Tokens: Placing a high-entropy secret string in the system prompt. If that string appears in the final model output, a breach is caught immediately before sending to the client.',
    takeaway: 'Never trust raw user input. Treat LLM inputs with the same zero-trust rigor as SQL queries.'
  },
  {
    id: 'llm-evals-rubrics',
    keywords: ['evals', 'llm-as-a-judge', 'benchmarks', 'likert', 'exact match', 'evaluation'],
    title: 'LLM-as-a-Judge & Structured Evaluation Rubrics',
    category: 'labs',
    summary: 'Using automated deterministic checks and frontier models to evaluate AI outputs on a 1-5 scale.',
    explanation: 'Production evaluation requires combining deterministic tests (regex, exact match, schema validation) with semantic LLM-as-a-Judge scoring. By providing an explicit Likert rubric (1=completely irrelevant, 5=factually complete and concise), evaluations achieve high inter-annotator agreement.',
    takeaway: 'Always benchmark on at least 100 diverse test pairs before deploying prompt updates.'
  },

  // ---------------------------------------------------------------------------
  // 6. TRACK 4: FRONTIER INTELLIGENCE & ATTENTION MECHANICS
  // ---------------------------------------------------------------------------
  {
    id: 'track-4-frontier-intelligence',
    keywords: ['track 4', 'frontier', 'attention', 'transformers', 'rope', 'kv cache', 'lora', 'qlora', 'quantization', 'reasoning', 'mcp protocol'],
    title: 'Track 4: Frontier Intelligence & Attention Mechanics',
    category: 'curriculum',
    summary: '9 advanced labs mastering QKV Scaled Dot-Product Attention, RoPE, KV Caching, LoRA, and Reasoning Models.',
    explanation: 'Track 4 dives into the heart of modern frontier AI architectures:\n• Module 4.1: Attention Mechanics & Transformer Architecture (Scaled Dot-Product Softmax(QK^T / √d_k)V, Multi-Head Attention, RoPE, KV Cache)\n• Module 4.2: Model Adaptation & Efficiency (LoRA low-rank updates, QLoRA, FP16/INT8/INT4/NF4 quantization)\n• Module 4.3: Reasoning Models & Frontier Protocols (Chain of Thought, Test-Time Compute, GRPO, Production MCP Server & Capstone).',
    codeSnippet: '# Scaled Dot-Product Attention in Python:\nimport math\ndef attention(Q, K, V):\n    d_k = len(Q[0])\n    # Scores = Q * K^T / sqrt(d_k)\n    # Weights = Softmax(Scores)\n    # Output = Weights * V',
    takeaway: 'Understand how transformers think, adapt, and scale at the physical tensor level.'
  },
  {
    id: 'scaled-dot-product-attention',
    keywords: ['attention', 'attention mechanics', 'scaled dot-product', 'qkv', 'query key value', 'transformer formula', 'how attention works'],
    title: 'Scaled Dot-Product Attention: Formula & Step-by-Step Math',
    category: 'math',
    summary: 'Attention(Q, K, V) = Softmax((Q · K^T) / √d_k) · V',
    explanation: 'The core equation of the Transformer (Vaswani et al., 2017):\n1. Queries (Q): What a token is searching for\n2. Keys (K): What a token contains\n3. Values (V): The actual informational content to route\n4. Dot Product (Q · K^T): Measures pairwise compatibility between tokens\n5. Scale by 1/√d_k: Prevents dot products from exploding in large dimensions, avoiding vanishing gradients in Softmax\n6. Softmax: Normalizes scores into an attention probability distribution across the sequence\n7. Weighted Sum (· V): Blends token values according to attention probabilities.',
    codeSnippet: 'import math\ndef attention(Q, K, V):\n    d_k = len(Q[0])\n    # 1. Compute dot product QK^T\n    scores = [[sum(q[i] * k[i] for i in range(d_k)) / math.sqrt(d_k) for k in K] for q in Q]\n    # 2. Softmax\n    weights = []\n    for row in scores:\n        exp_r = [math.exp(x) for x in row]\n        s = sum(exp_r)\n        weights.append([x / s for x in exp_r])\n    # 3. Weighted sum over V\n    d_v = len(V[0])\n    return [[sum(weights[r][c] * V[c][i] for c in range(len(V))) for i in range(d_v)] for r in range(len(Q))]',
    takeaway: 'Attention is an information routing matrix: Queries pick Keys to dynamically blend Values.'
  },
  {
    id: 'multi-head-attention',
    keywords: ['multi-head', 'mha', 'gqa', 'grouped query attention', 'heads', 'subspaces'],
    title: 'Multi-Head Attention (MHA) & Grouped-Query Attention (GQA)',
    category: 'architecture',
    summary: 'Projecting Q, K, and V into multiple lower-dimensional subspaces to attend to different linguistic features.',
    explanation: 'Single-head attention can only focus on one relationship at a time. Multi-Head Attention linearly projects Q, K, and V into H separate subspaces (each of dimension d_k = d_model / H), applies attention in parallel, and concatenates the outputs. Modern models like Llama 3 use Grouped-Query Attention (GQA) where multiple query heads share a single key/value head to dramatically compress KV Cache memory.',
    takeaway: 'MHA allows a token to simultaneously attend to syntactic, semantic, and positional contexts.'
  },
  {
    id: 'rope-embeddings',
    keywords: ['rope', 'rotary position embeddings', 'relative position', 'sinusoidal', 'complex numbers', 'rotary'],
    title: 'Rotary Position Embeddings (RoPE)',
    category: 'math',
    summary: 'Encoding positional information by rotating query and key vectors in 2D coordinate planes.',
    explanation: 'Invented by Su et al. (2021), RoPE replaces absolute learned position embeddings with a multiplicative rotation matrix applied to Q and K. In 2D pairs, a token at position m is multiplied by complex rotation e^(i * m * θ). The inner product (R_m * q) · (R_n * k) naturally depends only on the relative distance (m - n), enabling superior context length extrapolation.',
    takeaway: 'RoPE gives models an innate mathematical geometry for relative token distance.'
  },
  {
    id: 'kv-cache',
    keywords: ['kv cache', 'key value cache', 'inference speed', 'autoregressive', 'memory', 'decoding'],
    title: 'KV Caching: Accelerating Autoregressive Generation',
    category: 'architecture',
    summary: 'Caching previous Keys and Values to avoid quadratic recomputation during token-by-token generation.',
    explanation: 'During autoregressive decoding, generating token N requires attention over all previous N-1 tokens. Without KV caching, the model would recompute K and V for all prior tokens at every single step (O(N^2) complexity). By storing past K and V matrices in GPU VRAM, each new step only computes Q, K, V for the single new token and attends over the cache (O(N) complexity).',
    takeaway: 'KV Cache turns slow quadratic token generation into linear speed, at the expense of VRAM memory.'
  },
  {
    id: 'lora-fine-tuning',
    keywords: ['lora', 'qlora', 'fine-tuning', 'low rank adaptation', 'peft', 'parameter efficient', 'weights'],
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    category: 'math',
    summary: 'Decomposing weight updates into two low-rank matrices: ΔW = B · A, reducing trainable parameters by 99%.',
    explanation: 'Instead of retraining all 70 billion parameters in a foundation model, Hu et al. hypothesized that weight update matrices ΔW have a very low intrinsic rank r (e.g. r=8 or r=16). LoRA freezes the original weights W_0 and trains two tiny matrices: A of dimension (d × r) and B of dimension (r × k). The adapted output is h = W_0 · x + (B · A) · x · (α / r).',
    codeSnippet: '# LoRA parameter count comparison:\n# Full 4096 x 4096 weight matrix = 16,777,216 params\n# LoRA with rank r=8:\n# Matrix A (4096 x 8) + Matrix B (8 x 4096) = 65,536 params (99.6% reduction!)',
    takeaway: 'LoRA democratizes AI fine-tuning: adapt frontier models on consumer GPUs or laptops.'
  },
  {
    id: 'quantization-precision',
    keywords: ['quantization', 'fp16', 'int8', 'int4', 'nf4', 'gguf', 'precision', 'bits', 'memory footprint'],
    title: 'Model Quantization: FP16, INT8, INT4 & NormalFloat4 (NF4)',
    category: 'architecture',
    summary: 'Compressing 32-bit floating point weights into 8-bit or 4-bit integers to fit models into limited VRAM.',
    explanation: 'Foundational models are trained in FP32 (4 bytes per parameter) or BF16/FP16 (2 bytes per parameter). A 7B parameter model in FP16 takes ~14 GB of VRAM. Post-Training Quantization (PTQ) maps continuous weights into discrete INT8 (1 byte) or INT4 (0.5 byte) buckets using scaling factors and zero-points. NF4 (NormalFloat4) uses information-theoretically optimal quantiles for normally distributed weights.',
    takeaway: 'INT4 quantization shrinks a 7B model from 14 GB down to ~4.5 GB with minimal accuracy loss.'
  },
  {
    id: 'reasoning-models-cot',
    keywords: ['reasoning', 'chain of thought', 'cot', 'test time compute', 'grpo', 'o1', 'r1', 'deepseek', 'rl'],
    title: 'Reasoning Models, Test-Time Compute & GRPO',
    category: 'architecture',
    summary: 'Trading inference-time compute (extended thinking chains) for super-human mathematical and coding accuracy.',
    explanation: 'Traditional LLMs produce answers token-by-token with constant compute per token. Reasoning models (like OpenAI o1/o3 or DeepSeek R1) are trained with Reinforcement Learning (RL) using algorithms like Group Relative Policy Optimization (GRPO). They spend hundreds of tokens generating internal "hidden thoughts", backtracking, verifying hypotheses, and self-correcting before outputting the final conclusion.',
    takeaway: 'Scaling test-time thinking compute is the newest frontier of artificial intelligence.'
  },

  // ---------------------------------------------------------------------------
  // 7. INTERACTIVE LABS & TOOLS
  // ---------------------------------------------------------------------------
  {
    id: 'spatial-holodeck-tool',
    keywords: ['holodeck', '3d', 'vr', 'xr', 'vector space 3d', 'threejs', 'visualize', 'spatial', 'cosmic'],
    title: 'Spatial Holodeck: 3D High-Dimensional Vector Playground',
    category: 'tools',
    summary: 'Interactive 3D Three.js environment mapping semantic AI concepts with real-time cosine angle probes.',
    explanation: 'The Spatial Holodeck (`/holodeck`) brings abstract vector math to life. Navigate 24 core AI concepts rendered in 3D coordinate space. Select two nodes to trigger the Dual-Vector Cosine Probe, inspecting the exact angular distance θ and similarity score in real time. Features 3 tiers: 2D Lean SVG, Hardware 3D, and WebXR Immersive Gateway.',
    takeaway: 'True mathematical intuition begins when you can fly through embedding geometries.'
  },
  {
    id: 'synapse-lounge-tool',
    keywords: ['synapse', 'arcade', 'minigame', 'radar', 'logic gate', 'attention radar'],
    title: 'Synapse Lounge: Neuro-Plasticity Learning Arcade',
    category: 'tools',
    summary: 'Tactile minigames designed to train deep intuition through playful parameter tuning.',
    explanation: 'The Synapse Lounge features 3 interactive minigames:\n1. Vector Alignment Radar: Steer directional vector arrows to hit semantic targets.\n2. Neural Gate Deductor: Adjust weights w1, w2 and bias b to solve logical gates.\n3. Transformer Attention Radar: Tweak Q, K, and temperature sliders to observe real-time attention weight routing.',
    takeaway: 'Playful experimentation cements theoretical formulas into instinctual understanding.'
  },
  {
    id: 'xray-debug-lens',
    keywords: ['x-ray', 'xray', 'debug', 'lens', 'alt+x', 'diagnostics', 'telemetry', 'state inspection'],
    title: 'X-Ray Debug Lens: Live Studio State Inspection',
    category: 'tools',
    summary: 'Floating developer diagnostic tool inspecting real-time Web Worker state, memory, and IndexedDB keys.',
    explanation: 'Press `Alt + X` or click the X-Ray icon in the header to open the X-Ray Debug Lens. It provides an immediate live read of Pyodide execution health, DOM render counters, active theme contrast ratios, audio state, and pending IndexedDB transactions without interrupting your code editor.',
    takeaway: 'Complete operational visibility into the in-browser execution substrate.'
  },
  {
    id: 'curated-goldmines',
    keywords: ['goldmines', 'courses', 'free courses', 'video', 'karpathy', 'andrew ng', 'youtube', 'playlists'],
    title: 'Curated Goldmines: Elite Free AI Engineering Lectures',
    category: 'tools',
    summary: 'Carefully curated collection of world-class foundational lectures (Andrej Karpathy, 3Blue1Brown, Stanford).',
    explanation: 'OpenGuide curates the absolute highest-signal free lectures on the internet, including Andrej Karpathy’s "Neural Networks: Zero to Hero" and 3Blue1Brown’s "Essence of Linear Algebra". Includes embedded video playback, chapter navigation, and a direct "Watch in YouTube App" fallback for mobile devices.',
    takeaway: 'Zero paywalls. Master the field from the foremost minds in AI history.'
  },
  {
    id: 'theme-system-wcag',
    keywords: ['theme', 'themes', 'dark mode', 'light mode', 'contrast', 'wcag', 'accessibility', 'colors'],
    title: '20 Calibrated Themes & WCAG AAA Contrast Guarantee',
    category: 'tools',
    summary: '10 dark and 10 light meticulously calibrated themes meeting strict WCAG AAA contrast requirements (>7:1).',
    explanation: 'OpenGuide rejects low-contrast washed-out UI slop. Every theme is mathematically tested to guarantee at least 7:1 contrast ratio for all body text and UI controls. From Sovereign Dark and Obsidian Void to Pure Paper and Crisp Cream, your eyes remain fresh during 8-hour coding marathons.',
    takeaway: 'Aesthetic luxury meets uncompromising accessibility engineering.'
  },
  {
    id: 'sound-haptics-engine',
    keywords: ['sound', 'audio', 'haptics', 'chime', 'click', 'vibration', 'synthesizer'],
    title: 'Client-Side Synthesized Sound & Tactile Haptics Engine',
    category: 'tools',
    summary: 'Pure Web Audio API synthesizer generating tactile mechanical clicks, success chords, and mobile vibration.',
    explanation: 'OpenGuide features an embedded sound and haptics engine (`soundHaptics.ts`). Instead of loading heavy MP3 files, sound waveforms (sine, triangle, bandpass clicks) are generated on the fly via the browser’s Web Audio API. When running code or passing challenges on mobile devices, native vibration feedback triggers automatically.',
    takeaway: 'Rich multi-sensory feedback with zero external network asset overhead.'
  },

  // ---------------------------------------------------------------------------
  // 8. GOVERNANCE & CREATOR ATTRIBUTION
  // ---------------------------------------------------------------------------
  {
    id: 'creator-attribution',
    keywords: ['creator', 'architect', 'author', 'who made this', 'ard', 'adil', 'adil rafiq dar', 'origin', 'about'],
    title: 'Creator & Architect: Adil Rafiq Dar (ARD)',
    category: 'governance',
    summary: 'OpenGuide is architected and engineered by Adil Rafiq Dar (ARD) under the $0 Compute Rule.',
    explanation: 'OpenGuide. (Monogram: OG, Subtitle: AI STUDIO) was envisioned, architected, and engineered by Adil Rafiq Dar (ARD). It stands as a sovereign, zero-cost, local-first alternative to commercial subscription platforms. Built on Vite, React 19, TypeScript, Pyodide WASM, and WebGPU, it gives any learner with a browser the power of a premier AI research laboratory.',
    takeaway: 'Crafted with pride, sovereign design taste, and uncompromising engineering rigor by Adil Rafiq Dar (ARD).'
  },
  {
    id: 'keyboard-shortcuts',
    keywords: ['shortcuts', 'hotkeys', 'run code', 'clear', 'navigate', 'terminal', 'alt+x', 'ctrl+enter'],
    title: 'Tactile Keyboard Shortcuts in OpenGuide Studio',
    category: 'shortcuts',
    summary: 'Accelerate your workflow with ergonomic keyboard hotkeys.',
    explanation: '• Ctrl + Enter (Cmd + Enter): Execute Python code in Pyodide WASM\n• Alt + X: Toggle floating X-Ray Debug Lens\n• Ctrl + L: Clear terminal output\n• Alt + → / Alt + ←: Navigate to next or previous curriculum lab\n• Escape: Close open modals, drawers, or tools',
    takeaway: 'Keep your hands on the keyboard for uninterrupted developer flow state.'
  },
  {
    id: 'numpy-vector-ops',
    keywords: ['numpy', 'vector', 'matrix', 'dot product', 'linalg', 'norm', 'cosine', 'multiply', 'array', 'shape', 'reshape', 'linear algebra'],
    title: 'NumPy Vector & Linear Algebra Reference',
    category: 'math',
    summary: 'Essential NumPy primitives for vector spaces, cosine similarity, and matrix projections in Pyodide WASM.',
    explanation: 'Pyodide includes full C-optimized NumPy compiled to WebAssembly. Key vector operations used across Tracks 1 to 4:\n• np.dot(a, b): Inner dot product $\\sum a_i b_i$\n• np.linalg.norm(a): L2 Euclidean length $\\sqrt{\\sum a_i^2}$\n• Cosine Similarity: np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n• L2 Normalization: a / np.linalg.norm(a) turning dot product into cosine similarity directly\n• np.matmul(A, B) or A @ B: Matrix multiplication for attention projection $Q K^T$\n• np.argmax(scores) / np.argsort(scores)[::-1]: Top-K retrieval ranking.',
    codeSnippet: 'import numpy as np\n\n# Create 3D semantic vectors\nu = np.array([0.2, 0.8, 0.5])\nv = np.array([0.1, 0.9, 0.4])\n\n# Compute cosine similarity\ncosine_sim = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))\nprint(f"Cosine Similarity: {cosine_sim:.4f}")',
    takeaway: 'Vector normalization eliminates magnitude bias, enabling lightning-fast inner-product semantic search.'
  },
  {
    id: 'tensor-broadcasting-matrix-ops',
    keywords: ['broadcasting', 'tensor', 'matmul', 'softmax', 'einsum', 'matrix multiplication', 'batch', 'dimension', 'axis'],
    title: 'Tensor Broadcasting & Transformer Dimension Mechanics',
    category: 'math',
    summary: 'Core rules for tensor dimension alignment, row-wise softmax stability, and multi-head attention projections.',
    explanation: 'When implementing self-attention from scratch without PyTorch:\n1. Broadcasting Rules: Two dimensions are compatible when they are equal, or one of them is 1. Operations expand the singleton dimension to match.\n2. Stable Softmax: To prevent numerical overflow with exponentiated logits, subtract max along axis=-1 before exp: np.exp(x - np.max(x, axis=-1, keepdims=True)).\n3. Scaled Attention Score: S = (Q @ K.T) / np.sqrt(d_k). Scaling prevents gradients from vanishing in extreme softmax regions.\n4. Causal Masking: Add an upper-triangular negative infinity mask (-1e9) to logits before softmax to prevent attending to future tokens.',
    codeSnippet: 'import numpy as np\n\ndef stable_softmax(logits):\n    exp_x = np.exp(logits - np.max(logits, axis=-1, keepdims=True))\n    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)\n\n# Q: (seq, d_k), K: (seq, d_k)\nQ = np.random.randn(4, 16)\nK = np.random.randn(4, 16)\nscores = (Q @ K.T) / np.sqrt(16)\nweights = stable_softmax(scores)\nprint("Attention Matrix Shape:", weights.shape)',
    takeaway: 'Numerically stable softmax and sqrt(d_k) scaling are non-negotiable requirements for training and evaluating attention models.'
  }
];

/**
 * High-precision offline search algorithm with token set matching and domain phrase weighting.
 */
export function searchOfflineKnowledge(query: string): KnowledgeEntry[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return OFFLINE_KNOWLEDGE_BASE;

  // Normalize query and extract meaningful word tokens
  const sanitized = clean.replace(/[^\w\s$]/g, ' ');
  const stopWords = new Set([
    'what', 'is', 'the', 'how', 'does', 'do', 'in', 'my', 'a', 'an', 'to', 'and', 'for', 
    'of', 'on', 'can', 'i', 'you', 'me', 'tell', 'about', 'explain', 'give', 'please', 
    'with', 'at', 'by', 'from', 'this', 'that', 'these', 'those', 'are', 'was', 'were'
  ]);
  
  const rawTerms = sanitized.split(/\s+/).filter(t => t.length > 0);
  const terms = rawTerms.filter(t => !stopWords.has(t));
  const effectiveTerms = terms.length > 0 ? terms : rawTerms;

  return OFFLINE_KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const summaryLower = entry.summary.toLowerCase();
    const explanationLower = entry.explanation.toLowerCase();
    const idLower = entry.id.toLowerCase();

    // Exact full query match in title or keywords
    if (titleLower.includes(clean)) score += 40;
    if (entry.keywords.some(k => k === clean)) score += 50;
    if (entry.keywords.some(k => clean.includes(k) && k.length >= 3)) score += 30;

    for (const term of effectiveTerms) {
      // 1. Exact keyword match
      if (entry.keywords.includes(term)) {
        score += 35;
      } else if (entry.keywords.some(k => {
        // Safe prefix match for terms >= 4 chars (e.g. "atten" in "attention"), avoiding "work" in "worker"
        if (term.length >= 4 && k.startsWith(term)) return true;
        // Multi-word keyword contains single word term
        if (k.includes(' ') && k.split(/\s+/).includes(term)) return true;
        return false;
      })) {
        score += 20;
      }

      // 2. Title word match
      if (titleLower.split(/\s+/).includes(term)) {
        score += 25;
      } else if (titleLower.includes(term)) {
        score += 15;
      }

      // 3. ID match
      if (idLower.includes(term)) {
        score += 18;
      }

      // 4. Summary & explanation matches
      if (summaryLower.includes(term)) {
        score += 8;
      }
      if (explanationLower.includes(term)) {
        score += 4;
      }
    }

    return { entry, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.entry);
}
