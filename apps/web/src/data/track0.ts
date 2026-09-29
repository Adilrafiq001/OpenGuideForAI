export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  firstPrinciplesIntuition: string;
  content: string;
  initialCode: string;
  testCode?: string;
  expectedOutput: string;
  hint?: string;
  progressiveHints?: string[];
  solutionCode?: string;
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
          content: 'Initialize your browser sandbox by defining a standard greeting string and writing it to standard output (stdout). Complete the code below to pass the automated Pyodide unit test.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.1
# Objective: Initialize Standard Output in Browser WASM Runtime
# ============================================================

# TODO: Step 1 - Define the message variable with the exact text:
# "Hello, World! Running natively in browser."
message = ""

# TODO: Step 2 - Use print() to write the message to stdout
# print(...)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.1 (Canonical Solution)
# ============================================================

message = "Hello, World! Running natively in browser."
print(message)
`,
          testCode: `assert message == "Hello, World! Running natively in browser.", (
    f"Expected 'Hello, World! Running natively in browser.', got '{message}'"
)
print("✓ [TEST PASSED] CPython stdout stream successfully verified.")
`,
          expectedOutput: '✓ [TEST PASSED] CPython stdout stream successfully verified.',
          hint: 'Define message = "Hello, World! Running natively in browser." and call print(message).'
        },
        {
          id: 'lesson-0-1-2',
          title: 'Standard Streams & Dynamic Prompt Formatting',
          subtitle: 'Constructing Flexible Inputs for Machine Intelligence',
          firstPrinciplesIntuition: 'In production AI engineering, prompts are almost never static strings. We inject user context, retrieved document chunks, and guardrail constraints dynamically using f-strings (formatted strings).',
          content: 'Combine dynamic variables into an AI prompt template using Python f-strings. Complete the prompt interpolation to satisfy the automated test assertion.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.2
# Objective: Dynamic Prompt Engineering with Python f-strings
# ============================================================

topic = "Vector Embeddings"
audience = "a beginner"

# TODO: Construct a formatted prompt using an f-string:
# "Explain {topic} in one plain sentence for {audience}."
prompt = ""

print(prompt)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.2 (Canonical Solution)
# ============================================================

topic = "Vector Embeddings"
audience = "a beginner"

prompt = f"Explain {topic} in one plain sentence for {audience}."
print(prompt)
`,
          testCode: `expected_prompt = "Explain Vector Embeddings in one plain sentence for a beginner."
assert prompt == expected_prompt, f"Expected '{expected_prompt}', got '{prompt}'"
print("✓ [TEST PASSED] Dynamic prompt template verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Dynamic prompt template verified.',
          hint: 'Use prompt = f"Explain {topic} in one plain sentence for {audience}."'
        },
        {
          id: 'lesson-0-1-3',
          title: 'Web Worker Non-Blocking Execution',
          subtitle: 'Keeping the User Interface Fluid at 60 FPS',
          firstPrinciplesIntuition: 'Heavy matrix calculations and token processing take CPU time. If run on the main browser thread, the UI freezes and buttons stop clicking. That is why OpenGuide executes Python inside a dedicated Web Worker thread.',
          content: 'Calculate processing metrics across a batch of 1,000 3D vector coordinates (3 coordinates each: x, y, z) without blocking the browser UI thread.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.3
# Objective: Non-Blocking Web Worker Vector Telemetry
# ============================================================

# TODO: Step 1 - Set the total batch count to 1000 items
batch_count = 0

# TODO: Step 2 - Compute total processed coordinates (each point has 3 coordinates: x, y, z)
total_coordinates = 0

print(f"Processed {batch_count} vectors ({total_coordinates} coordinates) in Web Worker.")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.3 (Canonical Solution)
# ============================================================

batch_count = 1000
total_coordinates = batch_count * 3
print(f"Processed {batch_count} vectors ({total_coordinates} coordinates) in Web Worker.")
`,
          testCode: `assert batch_count == 1000, f"Expected batch_count to be 1000, got {batch_count}"
assert total_coordinates == 3000, f"Expected total_coordinates to be 3000, got {total_coordinates}"
print("✓ [TEST PASSED] Background Web Worker simulation complete.")
`,
          expectedOutput: '✓ [TEST PASSED] Background Web Worker simulation complete.',
          hint: 'Set batch_count = 1000 and total_coordinates = batch_count * 3.'
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
          content: 'Define a 3-dimensional vector coordinate [0.24, -0.89, 0.51], calculate its Euclidean magnitude (norm), and verify its dimensions.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.1
# Objective: Vector Coordinate Primitives & Euclidean Norm
# ============================================================

# TODO: Step 1 - Define the 3D embedding coordinate list: [0.24, -0.89, 0.51]
vector_point = []

# TODO: Step 2 - Compute dimensions using len()
dimensions = 0

# TODO: Step 3 - Compute vector magnitude (norm) = sqrt(x^2 + y^2 + z^2)
magnitude = 0.0

print(f"Dimensions: {dimensions} | Magnitude: {round(magnitude, 4)}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.1 (Canonical Solution)
# ============================================================

vector_point = [0.24, -0.89, 0.51]
dimensions = len(vector_point)
magnitude = sum(x**2 for x in vector_point) ** 0.5

print(f"Dimensions: {dimensions} | Magnitude: {round(magnitude, 4)}")
`,
          testCode: `assert len(vector_point) == 3, f"Expected 3 dimensions, got {len(vector_point)}"
assert vector_point == [0.24, -0.89, 0.51], "Vector point values do not match requirements."
assert round(magnitude, 3) == 1.053, f"Expected magnitude ≈ 1.053, got {magnitude}"
print("✓ [TEST PASSED] Vector primitives & geometric norm verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Vector primitives & geometric norm verified.',
          hint: 'Calculate magnitude with sum(x**2 for x in vector_point) ** 0.5.'
        },
        {
          id: 'lesson-0-2-2',
          title: 'Dictionaries & Structured Message Serialization',
          subtitle: 'The Universal Language of LLM APIs',
          firstPrinciplesIntuition: 'All frontier LLMs (Claude, GPT-4, Gemini) speak JSON over the wire. Python dictionaries map 1-to-1 to JSON objects. To communicate with any AI API, you convert dictionaries to JSON strings using json.dumps().',
          content: 'Construct a structured chat message dictionary with role="user" and content="What is an embedding?", then serialize it into a valid JSON string.',
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.2
# Objective: Structured Chat Message Serialization
# ============================================================

# TODO: Step 1 - Construct message dictionary with 'role' and 'content' keys
message = {}

# TODO: Step 2 - Serialize dictionary to JSON string using json.dumps()
json_string = ""

print("Serialized JSON Payload:")
print(json_string)
`,
          solutionCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.2 (Canonical Solution)
# ============================================================

message = {
    "role": "user",
    "content": "What is an embedding?"
}

json_string = json.dumps(message)
print("Serialized JSON Payload:")
print(json_string)
`,
          testCode: `parsed = json.loads(json_string)
assert parsed.get("role") == "user", "Message role must be 'user'"
assert parsed.get("content") == "What is an embedding?", "Content must be 'What is an embedding?'"
print("✓ [TEST PASSED] Structured JSON chat serialization verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Structured JSON chat serialization verified.',
          hint: 'Set message["role"] = "user" and message["content"] = "What is an embedding?".'
        },
        {
          id: 'lesson-0-2-3',
          title: 'Parsing & Validating Structured Output (Tool Calling)',
          subtitle: 'How AI Agents Choose and Execute External Tools',
          firstPrinciplesIntuition: 'When an AI agent decides to query a database or search the web, it emits structured JSON. Your application must parse that JSON string back into a Python object using json.loads() and invoke the requested action.',
          content: 'Parse a simulated LLM tool-calling payload and extract its execution parameters defensively.',
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.3
# Objective: Defensive Parsing of AI Agent Tool Calls
# ============================================================

raw_tool_call = '{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}'

# TODO: Step 1 - Parse raw_tool_call JSON into a Python dictionary using json.loads()
call = {}

# TODO: Step 2 - Extract tool name, query, and top_k parameters
tool_name = ""
query = ""
top_k = 0

execution_signature = f"Calling: {tool_name}(query='{query}', top_k={top_k})"
print(execution_signature)
`,
          solutionCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.3 (Canonical Solution)
# ============================================================

raw_tool_call = '{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}'

call = json.loads(raw_tool_call)
tool_name = call.get("tool", "")
query = call.get("query", "")
top_k = call.get("top_k", 0)

execution_signature = f"Calling: {tool_name}(query='{query}', top_k={top_k})"
print(execution_signature)
`,
          testCode: `assert tool_name == "vector_search", "Tool name must be 'vector_search'"
assert query == "cosine similarity", "Query must be 'cosine similarity'"
assert top_k == 3, "top_k must be 3"
assert execution_signature == "Calling: vector_search(query='cosine similarity', top_k=3)"
print("✓ [TEST PASSED] Agent tool calling dispatch verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Agent tool calling dispatch verified.',
          hint: 'Use call = json.loads(raw_tool_call) and call.get().'
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
          content: 'Estimate the token count of a sentence using both the BPE word multiplier (1.33x) and the character length rule of thumb (1 token ≈ 4 characters).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.1
# Objective: Token Estimation & Byte-Pair Encoding Heuristics
# ============================================================

sentence = "OpenGuide makes AI engineering intuitive"

# TODO: Step 1 - Split the sentence into words using sentence.split()
words = []

# TODO: Step 2 - Calculate estimated tokens using int(len(words) * 1.33)
estimated_tokens = 0

# TODO: Step 3 - Calculate character-based estimate using round(len(sentence) / 4)
char_tokens = 0

print(f"Words: {len(words)} | BPE Word Est: {estimated_tokens} | Char Est: {char_tokens}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.1 (Canonical Solution)
# ============================================================

sentence = "OpenGuide makes AI engineering intuitive"

words = sentence.split()
estimated_tokens = int(len(words) * 1.33)
char_tokens = round(len(sentence) / 4)

print(f"Words: {len(words)} | BPE Word Est: {estimated_tokens} | Char Est: {char_tokens}")
`,
          testCode: `assert len(words) == 5, f"Expected 5 words, got {len(words)}"
assert estimated_tokens == 6, f"Expected 6 tokens (5 * 1.33 = 6.65 -> int 6), got {estimated_tokens}"
assert char_tokens == 10, f"Expected 10 char tokens (41 chars / 4 ≈ 10), got {char_tokens}"
print("✓ [TEST PASSED] Token estimation heuristics verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Token estimation heuristics verified.',
          hint: 'Use sentence.split(), int(len(words) * 1.33), and round(len(sentence) / 4).'
        },
        {
          id: 'lesson-0-3-2',
          title: 'System Prompts vs User Prompts',
          subtitle: 'Role Separation & Prompt Injection Defense',
          firstPrinciplesIntuition: 'A system prompt defines the AI persona, rules, and security boundaries. The user prompt provides the dynamic question. Separating roles prevents users from overriding core instructions.',
          content: 'Format a multi-turn conversation list containing both system and user messages, rendering each turn with an uppercase role header.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.2
# Objective: Role Separation & Prompt Injection Guardrails
# ============================================================

conversation = [
    {"role": "system", "content": "You are a concise AI teacher."},
    {"role": "user", "content": "What is cosine similarity?"}
]

# TODO: Step 1 - Format each turn as "[ROLE]: Content"
formatted_dialogue = []
# for msg in conversation:
#     ...

rendered = "\\n".join(formatted_dialogue)
print(rendered)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.2 (Canonical Solution)
# ============================================================

conversation = [
    {"role": "system", "content": "You are a concise AI teacher."},
    {"role": "user", "content": "What is cosine similarity?"}
]

formatted_dialogue = []
for msg in conversation:
    role_tag = msg["role"].upper()
    formatted_dialogue.append(f"[{role_tag}]: {msg['content']}")

rendered = "\\n".join(formatted_dialogue)
print(rendered)
`,
          testCode: `assert len(formatted_dialogue) == 2, "Conversation should have 2 turns"
assert formatted_dialogue[0] == "[SYSTEM]: You are a concise AI teacher."
assert formatted_dialogue[1] == "[USER]: What is cosine similarity?"
print("✓ [TEST PASSED] Multi-turn role separation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Multi-turn role separation verified.',
          hint: 'Use msg["role"].upper() inside an f-string.'
        },
        {
          id: 'lesson-0-3-3',
          title: 'Temperature & Sampling Distribution Simulation',
          subtitle: 'Controlling Randomness from Greedy Argmax to High Entropy',
          firstPrinciplesIntuition: 'What does "Temperature" actually do? At T=0, the model is completely deterministic—it always picks the highest probability token (argmax). At higher temperatures, probability distributions flatten, allowing less probable tokens to be chosen for creative exploration.',
          content: 'Write a sampling simulator function that returns "greedy_argmax" when temperature is below 0.3, "balanced_sampling" for moderate values, and "high_entropy_creative" for high temperature.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.3
# Objective: Temperature & Sampling Distribution Simulation
# ============================================================

def simulate_token_sampling(temperature: float) -> str:
    # TODO: Step 1 - If temperature is below 0.3, return "greedy_argmax"
    # TODO: Step 2 - If temperature is between 0.3 and 0.8 (inclusive), return "balanced_sampling"
    # TODO: Step 3 - If temperature is above 0.8, return "high_entropy_creative"
    return ""

t0 = simulate_token_sampling(0.0)
t5 = simulate_token_sampling(0.5)
t9 = simulate_token_sampling(0.95)

print(f"T=0.0: {t0} | T=0.5: {t5} | T=0.95: {t9}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.3 (Canonical Solution)
# ============================================================

def simulate_token_sampling(temperature: float) -> str:
    if temperature < 0.3:
        return "greedy_argmax"
    elif temperature <= 0.8:
        return "balanced_sampling"
    return "high_entropy_creative"

t0 = simulate_token_sampling(0.0)
t5 = simulate_token_sampling(0.5)
t9 = simulate_token_sampling(0.95)

print(f"T=0.0: {t0} | T=0.5: {t5} | T=0.95: {t9}")
`,
          testCode: `assert simulate_token_sampling(0.1) == "greedy_argmax", "Low temp must be greedy_argmax"
assert simulate_token_sampling(0.7) == "balanced_sampling", "Mid temp must be balanced_sampling"
assert simulate_token_sampling(1.2) == "high_entropy_creative", "High temp must be high_entropy_creative"
print("✓ [TEST PASSED] Temperature distribution simulation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Temperature distribution simulation verified.',
          hint: 'Return "greedy_argmax", "balanced_sampling", or "high_entropy_creative" based on temperature.'
        }
      ]
    }
  ]
};
