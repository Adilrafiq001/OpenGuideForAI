export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  firstPrinciplesIntuition: string;
  content: string;
  initialCode: string;
  expectedOutput: string;
  hint?: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Track = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
};

export const track0: Track = {
  id: 'track-0',
  title: 'Track 0: Absolute Zero',
  description: 'Master the command line, in-browser WebAssembly CPython execution, structured JSON schemas, and token mechanics without paying a single dollar.',
  modules: [
    {
      id: 'module-0-1',
      title: 'Module 0.1: The Command Line & WebAssembly Runtime',
      description: 'Understand why Python rules AI, how CPython compiles to WebAssembly, and how to execute non-blocking code in browser Web Workers.',
      lessons: [
        {
          id: 'lesson-0-1-1',
          title: 'Hello, World! & The CPython WASM Sandbox',
          subtitle: 'The Lingua Franca of Artificial Intelligence',
          firstPrinciplesIntuition: 'Why do we write Python instead of C++ or JavaScript for AI? Python is the universal steering wheel for AI systems: fast to write, deeply expressive, and backed by a global ecosystem. In OpenGuide, Python executes natively in your browser via WebAssembly (Pyodide)—$0 server fees and zero local setup.',
          content: 'Run your first Python code inside the browser sandbox. The `print()` function writes text directly to the standard output stream (stdout), which our Web Worker captures and displays in the terminal.',
          initialCode: 'print("Hello, World! Running natively in browser.")',
          expectedOutput: 'Hello, World! Running natively in browser.',
          hint: 'Click "Run Code" or press Ctrl+Enter to execute the code in your browser Web Worker.'
        },
        {
          id: 'lesson-0-1-2',
          title: 'Standard Streams & Dynamic Prompt Formatting',
          subtitle: 'Constructing Flexible Inputs for Machine Intelligence',
          firstPrinciplesIntuition: 'In production AI engineering, prompts are almost never static strings. We inject user context, retrieved document chunks, and guardrail constraints dynamically using f-strings (formatted strings).',
          content: 'Combine variables into a dynamic AI prompt template using Python f-strings. Notice how the values are cleanly interpolated before being written to stdout.',
          initialCode: 'topic = "Vector Embeddings"\naudience = "a beginner"\nprompt = f"Explain {topic} in one plain sentence for {audience}."\nprint(prompt)',
          expectedOutput: 'Explain Vector Embeddings in one plain sentence for a beginner.',
          hint: 'Ensure your f-string matches the exact variables defined above.'
        },
        {
          id: 'lesson-0-1-3',
          title: 'Web Worker Non-Blocking Execution',
          subtitle: 'Keeping the User Interface Fluid at 60 FPS',
          firstPrinciplesIntuition: 'Heavy matrix calculations and token processing take CPU time. If run on the main browser thread, the UI freezes and buttons stop clicking. That is why OpenGuide executes Python inside a dedicated Web Worker thread.',
          content: 'Simulate processing 1,000 vector coordinates in the background. The Web Worker streams telemetry directly to the X-Ray Debug Lens without dropping a single animation frame on the main thread.',
          initialCode: 'items_processed = 1000\nprint(f"Processed {items_processed} vector coordinates in background.")',
          expectedOutput: 'Processed 1000 vector coordinates in background.',
          hint: 'Inspect the X-Ray Debug Lens at the top right to view worker execution duration in milliseconds.'
        }
      ]
    },
    {
      id: 'module-0-2',
      title: 'Module 0.2: Python Basics & JSON Schemas',
      description: 'Master vectors as numerical lists, dictionaries as key-value stores, and parse structured JSON tool calls defensively.',
      lessons: [
        {
          id: 'lesson-0-2-1',
          title: 'Variables, Lists & Vector Primitives',
          subtitle: 'The Mathematical Anatomy of an Embedding',
          firstPrinciplesIntuition: 'What is an "embedding vector"? Strip away the buzzwords: it is simply a list of floating-point numbers representing coordinates in multi-dimensional space, just like GPS coordinates (latitude, longitude) represent locations on Earth.',
          content: 'Define a 3-dimensional vector coordinate and inspect its dimensions using the built-in `len()` function.',
          initialCode: 'vector_point = [0.24, -0.89, 0.51]\ndimensions = len(vector_point)\nprint(f"Dimensions: {dimensions} | Vector: {vector_point}")',
          expectedOutput: 'Dimensions: 3 | Vector: [0.24, -0.89, 0.51]',
          hint: 'Vectors in real frontier LLMs typically have 1,536 or 3,072 dimensions, but the math is identical to this 3D list.'
        },
        {
          id: 'lesson-0-2-2',
          title: 'Dictionaries & Structured Message Serialization',
          subtitle: 'The Universal Language of LLM APIs',
          firstPrinciplesIntuition: 'All frontier LLMs (Claude, GPT-4, Gemini) speak JSON over the wire. Python dictionaries map 1-to-1 to JSON objects. To communicate with any AI API, you convert dictionaries to JSON strings using `json.dumps()`.',
          content: 'Construct a structured chat message dictionary with `role` and `content` keys, then serialize it into standard JSON format.',
          initialCode: 'import json\n\nmessage = {\n    "role": "user",\n    "content": "What is an embedding?"\n}\n\njson_string = json.dumps(message)\nprint(json_string)',
          expectedOutput: '{"role": "user", "content": "What is an embedding?"}',
          hint: 'JSON requires double quotes around keys and strings. `json.dumps()` handles this automatically.'
        },
        {
          id: 'lesson-0-2-3',
          title: 'Parsing & Validating Structured Output (Tool Calling)',
          subtitle: 'How AI Agents Choose and Execute External Tools',
          firstPrinciplesIntuition: 'When an AI agent decides to query a database or search the web, it emits structured JSON. Your application must parse that JSON string back into a Python object using `json.loads()` and invoke the requested action.',
          content: 'Parse a simulated LLM tool-calling payload and format a clean execution call using its extracted parameters.',
          initialCode: 'import json\n\nraw_tool_call = \'{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}\'\nparsed = json.loads(raw_tool_call)\n\nprint(f"Calling: {parsed[\'tool\']}(query=\'{parsed[\'query\']}\', top_k={parsed[\'top_k\']})")',
          expectedOutput: "Calling: vector_search(query='cosine similarity', top_k=3)",
          hint: 'Use single quotes inside double-quoted f-strings to avoid syntax collisions.'
        }
      ]
    },
    {
      id: 'module-0-3',
      title: 'Module 0.3: What is an API? Tokens & Prompts',
      description: 'Demystify tokenization, Byte-Pair Encoding, role isolation in prompts, and simulate temperature sampling curves.',
      lessons: [
        {
          id: 'lesson-0-3-1',
          title: 'Tokenization Mechanics & Byte-Pair Encoding',
          subtitle: 'How Models Slice Human Language into Numbers',
          firstPrinciplesIntuition: 'AI models do not see words or letters. They process "tokens"—common clusters of characters learned via Byte-Pair Encoding (BPE). As a general rule of thumb in English, 1 word is approximately 1.33 tokens (or 1 token ≈ 4 characters).',
          content: 'Estimate the token count of a sentence by analyzing its word count and applying the standard 1.33 multiplier ratio.',
          initialCode: 'sentence = "OpenGuide makes AI engineering intuitive"\nwords = sentence.split()\nestimated_tokens = int(len(words) * 1.33)\n\nprint(f"Word count: {len(words)} | Estimated tokens: {estimated_tokens}")',
          expectedOutput: 'Word count: 5 | Estimated tokens: 6',
          hint: '5 words * 1.33 = 6.65, which rounds down to 6 using `int()`.'
        },
        {
          id: 'lesson-0-3-2',
          title: 'System Prompts vs User Prompts',
          subtitle: 'Role Separation & Prompt Injection Defense',
          firstPrinciplesIntuition: 'A system prompt defines the AI persona, rules, and security boundaries. The user prompt provides the dynamic question. Separating roles prevents users from overriding core instructions.',
          content: 'Iterate through a multi-turn conversation list containing both `system` and `user` messages, printing each message with its uppercase role prefix.',
          initialCode: 'conversation = [\n    {"role": "system", "content": "You are a concise AI teacher."},\n    {"role": "user", "content": "What is cosine similarity?"}\n]\n\nfor msg in conversation:\n    print(f"[{msg[\'role\'].upper()}]: {msg[\'content\']}")',
          expectedOutput: "[SYSTEM]: You are a concise AI teacher.\n[USER]: What is cosine similarity?",
          hint: 'Use `msg["role"].upper()` to display SYSTEM and USER in uppercase brackets.'
        },
        {
          id: 'lesson-0-3-3',
          title: 'Temperature & Sampling Distribution Simulation',
          subtitle: 'Controlling Randomness from Greedy Argmax to High Entropy',
          firstPrinciplesIntuition: 'What does "Temperature" actually do? At T=0, the model is completely deterministic—it always picks the highest probability token (argmax). At higher temperatures, probability distributions flatten, allowing less probable tokens to be chosen for creative exploration.',
          content: 'Write a sampling simulator that returns "deterministic" when temperature is low (< 0.3) and "creative" when temperature is high, testing both conditions.',
          initialCode: 'def simulate_token_sampling(temperature):\n    if temperature < 0.3:\n        return "deterministic"\n    return "creative"\n\nt_low = simulate_token_sampling(0.1)\nt_high = simulate_token_sampling(0.9)\nprint(f"Low Temp: {t_low} | High Temp: {t_high}")',
          expectedOutput: 'Low Temp: deterministic | High Temp: creative',
          hint: 'Notice how temperature transforms the output from predictable to exploratory.'
        }
      ]
    }
  ]
};
