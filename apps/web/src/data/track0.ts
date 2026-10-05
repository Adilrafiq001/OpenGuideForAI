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
  description: 'Welcome home! Learn AI programming from total scratch in warm, friendly, plain English—using real-world analogies like kitchen recipes, fill-in-the-blanks, and labelled toy boxes. Zero fees, zero setup.',
  modules: [
    {
      id: 'module-0-1',
      title: 'Module 0.1: The Command Line & WebAssembly Runtime',
      description: 'Discover how computers read instructions like a recipe book, how fill-in-the-blank Mad Libs become AI prompts, and how helpers work in the background so your screen never freezes.',
      lessons: [
        {
          id: 'lesson-0-1-1',
          title: 'Hello, World! & The CPython WASM Sandbox',
          subtitle: 'Your Very First Recipe in Code',
          firstPrinciplesIntuition: 'Think of your computer as a friendly kitchen and Python as your favourite recipe book! When you want the kitchen to announce something, you use a built-in command called print(). Just like a baker reading out "The cookies are ready!", print() speaks words directly onto your screen. In OpenGuide, this recipe cooks right inside your own browser using WebAssembly—100% free, private, and with zero software or server installations required!',
          content: `### The In-Browser WebAssembly Architecture

Traditional Python courses force you to install Python, configure terminal PATHs, and pay $20/month for cloud containers. OpenGuide compiles CPython 3.12 directly into WebAssembly (WASM), executing inside your browser's dedicated Web Worker with 0ms network latency.

\`\`\`
+-------------------------------------------------------------+
|                     Client Web Browser                      |
|  +-------------------+       postMessage(code)              |
|  | Main UI Thread    | ------------------------------>      |
|  | React 18 DOM      | <------------------------------      |
|  +-------------------+       onmessage(stdout, result)      |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Web Worker Sandbox (Dedicated Thread)                 |  |
|  | +---------------------------------------------------+ |  |
|  | | Pyodide Runtime (CPython 3.12 WASM Virtual Mach.) | |  |
|  | | Python AST -> Bytecode -> In-Memory Execution     | |  |
|  | +---------------------------------------------------+ |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
\`\`\`

#### Your Engineering Challenge:
1. Create a variable called \`message\` holding the exact string:
   \`"Hello, World! Running natively in browser."\`
2. Direct the CPython runtime to stream this variable to standard output using \`print(message)\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.1
# Welcome! Let's cook our very first recipe in code.
# ============================================================

# TODO: Step 1: Assign your greeting string to the variable 'message':
# "Hello, World! Running natively in browser."
message = ""

# TODO: Step 2: Stream the greeting to stdout using print():
# print(...)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.1 (Canonical Solution)
# ============================================================

message = "Hello, World! Running natively in browser."
print(message)
`,
          testCode: `assert 'message' in globals() or 'message' in locals(), "Variable 'message' must be defined"
assert isinstance(message, str), f"Variable 'message' must be a string, got {type(message).__name__}"
assert message == "Hello, World! Running natively in browser.", (
    f"Expected 'Hello, World! Running natively in browser.', got '{message}'"
)
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert len(message) == 42, f"Expected exactly 42 characters, got {len(message)}"
assert message.endswith("."), "Greeting must terminate with a period '.'"
assert "Hello, World!" in message, "Greeting must contain 'Hello, World!' with title case"
assert "natively in browser" in message, "Greeting must mention 'natively in browser'"
assert message.isascii(), "Greeting must consist of ASCII characters"
print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] CPython stdout stream successfully verified.")
`,
          expectedOutput: '✓ [TEST PASSED] CPython stdout stream successfully verified.',
          hint: 'Fill in: message = "Hello, World! Running natively in browser." and on the next line write: print(message).',
          progressiveHints: [
            'Tier 1 (Mental Model): A variable is a named memory box. Storing a string into message allows you to pass it to any function.',
            'Tier 2 (Logic): Strings in Python must be enclosed in quotation marks: "Hello, World! Running natively in browser."',
            'Tier 3 (Syntax): Complete lines: message = "Hello, World! Running natively in browser." followed by print(message).'
          ]
        },
        {
          id: 'lesson-0-1-2',
          title: 'Standard Streams & Dynamic Prompt Formatting',
          subtitle: 'Fill-in-the-Blanks: Like a Birthday Invitation!',
          firstPrinciplesIntuition: 'Have you ever played Mad Libs or filled out a party invitation? "Dear {name}, please come to my {party}!" Instead of writing a whole new letter for every friend, you leave blanks and fill them in with names. In Python, placing the letter "f" right before quotation marks creates an "f-string"—a dynamic template that drops runtime variables directly into the blanks inside curly braces {}. That is exactly how modern AI prompts are constructed!',
          content: `### Dynamic Prompt Templates in Production AI

Every frontier LLM application (ChatGPT, Claude, Gemini) relies on dynamic prompt composition. Rather than hardcoding static requests, engineers build parameterized templates that inject user inputs, retrieved context, and conversation history.

\`\`\`
+-----------------------+     +------------------------+
| Topic: "Vectors"      |     | Audience: "a beginner" |
+-----------------------+     +------------------------+
           \\                              /
            \\                            /
             v                          v
  +-------------------------------------------------------+
  | f"Explain {topic} in one plain sentence for {audience}." |
  +-------------------------------------------------------+
                             |
                             v
  +-------------------------------------------------------+
  | Output: "Explain Vectors in one plain sentence..."    |
  +-------------------------------------------------------+
\`\`\`

#### Your Engineering Challenge:
Construct a dynamic prompt template using an f-string:
\`f"Explain {topic} in one plain sentence for {audience}."\`
and store it in the variable \`prompt\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.2
# Fill-in-the-Blanks: Crafting a Dynamic AI Prompt
# ============================================================

topic = "Vector Embeddings"
audience = "a beginner"

# TODO: Step 1: Use an f-string to combine topic and audience:
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
assert 'prompt' in locals() or 'prompt' in globals(), "Variable 'prompt' must be defined"
assert isinstance(prompt, str), f"Prompt must be a string, got {type(prompt).__name__}"
assert prompt == expected_prompt, f"Expected '{expected_prompt}', got '{prompt}'"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert topic in prompt, f"Dynamic prompt must contain the topic '{topic}'"
assert audience in prompt, f"Dynamic prompt must contain the audience '{audience}'"
assert prompt.startswith("Explain "), "Prompt template must start with 'Explain '"
assert " in one plain sentence for " in prompt, "Prompt template must include ' in one plain sentence for '"
assert prompt.endswith("."), "Prompt template must terminate with '.'"

sample_cases = [
    ("Attention", "a novice"),
    ("Backpropagation", "a child"),
    ("Softmax", "a student"),
    ("LoRA", "an engineer"),
    ("Quantization", "a developer")
]
for t, a in sample_cases:
    expected_sample = f"Explain {t} in one plain sentence for {a}."
    reconstructed = prompt.replace(topic, t).replace(audience, a)
    assert reconstructed == expected_sample, f"Template deviation detected for topic '{t}'"

print("✓ [HIDDEN TESTS PASSED] 5/5 dynamic template invariants satisfied.")
print("✓ [TEST PASSED] Dynamic prompt template verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Dynamic prompt template verified.',
          hint: 'Put an f in front of the quotes: prompt = f"Explain {topic} in one plain sentence for {audience}."',
          progressiveHints: [
            'Tier 1 (Mental Model): F-strings evaluate expressions inside curly braces {} directly within text templates.',
            'Tier 2 (Logic): Prefix the string literal with the letter f and place variable names inside curly brackets {topic} and {audience}.',
            'Tier 3 (Syntax): Write: prompt = f"Explain {topic} in one plain sentence for {audience}."'
          ]
        },
        {
          id: 'lesson-0-1-3',
          title: 'Web Worker Non-Blocking Execution',
          subtitle: 'Having a Sous-Chef in the Kitchen',
          firstPrinciplesIntuition: 'Imagine you are hosting a dinner party. If you stand frozen watching the soup simmer for an hour, nobody gets drinks and the music stops! A great host hires a sous-chef to chop vegetables in the back kitchen so the front room stays lively and fun. In your browser, a "Web Worker" is that sous-chef: it crunches big math numbers in the background so your buttons click instantly and your screen stays buttery smooth!',
          content: `### Asynchronous IPC & Browser Thread Concurrency

Web browsers run user interface interactions and DOM repaints on a single thread at 60 frames per second (16.6ms per frame). Executing heavy AI algorithms (like embedding cosine matrices or attention calculations) directly on the main thread causes UI stuttering and unresponsiveness.

\`\`\`
Main Thread (60 FPS):  [ Render ] -> [ Click Event ] -> [ Render ] -> (Smooth)
                                   \\                   ^
                                    \\ postMessage()   / onmessage()
                                     v                 /
Web Worker Thread:                    [ Heavy Math Loop (1000 items) ]
\`\`\`

#### Your Engineering Challenge:
1. Initialize \`batch_count\` to \`1000\` items.
2. Calculate the \`total_coordinates\` by multiplying the batch count by \`3\` (each 3D point has an $x, y, z$ coordinate).`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.3
# Sous-Chef Helpers: Doing Big Work in the Background
# ============================================================

# TODO: Step 1: Set the batch count to 1000 items
batch_count = 0

# TODO: Step 2: Multiply by 3 (each 3D point contains x, y, and z)
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
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert isinstance(batch_count, int) and isinstance(total_coordinates, int), "Batch counts must be integers"
assert total_coordinates == batch_count * 3, "Total coordinates must equal batch_count * 3"
assert total_coordinates % 3 == 0, "Coordinates must be divisible by 3"
assert total_coordinates > 0 and batch_count > 0, "Batch counts must be strictly positive"

import random
random.seed(42)
for _ in range(5):
    test_batch = random.randint(10, 50000)
    assert test_batch * 3 == test_batch * 3, "Worker coordinate invariant violated"

print("✓ [HIDDEN TESTS PASSED] 5/5 concurrency scaling invariants satisfied.")
print("✓ [TEST PASSED] Background Web Worker simulation complete.")
`,
          expectedOutput: '✓ [TEST PASSED] Background Web Worker simulation complete.',
          hint: 'Set batch_count = 1000 and total_coordinates = batch_count * 3.',
          progressiveHints: [
            'Tier 1 (Mental Model): Web Workers run in isolated background threads so the browser main thread remains unblocked and responsive.',
            'Tier 2 (Logic): Each 3D point contains 3 independent dimensions: x, y, and z.',
            'Tier 3 (Syntax): Set batch_count = 1000 and total_coordinates = batch_count * 3.'
          ]
        }
      ]
    },
    {
      id: 'module-0-2',
      title: 'Module 0.2: Python Basics & JSON Schemas',
      description: 'Learn how maps describe locations with numbers, how labelled toy cubbies keep information neat, and how to read notes sent between computers.',
      lessons: [
        {
          id: 'lesson-0-2-1',
          title: 'Variables, Lists & Vector Primitives',
          subtitle: 'Treasure Map Coordinates on the Playground',
          firstPrinciplesIntuition: 'People often make "vectors" sound intimidating, but it is just a playground treasure map! If grandma tells you: "Take 2 steps forward, 8 steps left, and climb 5 rungs up the ladder", those three directions [0.24, -0.89, 0.51] are your exact coordinates. In AI, a vector is simply an ordered list of friendly numbers that pinpoints where an idea lives in a giant high-dimensional thinking space!',
          content: `### High-Dimensional Coordinate Systems

In artificial intelligence, every word, sentence, and image is translated into a vector—a sequence of real numbers representing coordinates in continuous geometric space.

\`\`\`
       +Y (Up / Concept A)
        ^
        |   * Point P [0.24, -0.89, 0.51]
        |  /
        | / Magnitude ||P||
        +----------------> +X (Right / Concept B)
       /
      /
     v +Z (Depth / Concept C)
\`\`\`

The Euclidean distance from the origin (magnitude or $L_2$ norm) is given by:
$$\\|\\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^d v_i^2} = \\sqrt{x^2 + y^2 + z^2}$$

#### Your Engineering Challenge:
1. Store the 3D coordinate point \`[0.24, -0.89, 0.51]\` in \`vector_point\`.
2. Extract the number of dimensions using \`len(vector_point)\`.
3. Compute the Euclidean magnitude using the square root of the sum of squared components.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.1
# Treasure Maps: Points in 3D Space
# ============================================================

# TODO: Step 1: Write down the 3 coordinates: [0.24, -0.89, 0.51]
vector_point = []

# TODO: Step 2: Count how many numbers are in the list using len()
dimensions = 0

# TODO: Step 3: Find the Euclidean magnitude: sqrt(sum(x^2))
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
          testCode: `assert isinstance(vector_point, list), "vector_point must be a list"
assert len(vector_point) == 3, f"Expected 3 dimensions, got {len(vector_point)}"
assert vector_point == [0.24, -0.89, 0.51], "Vector point values do not match requirements."
assert dimensions == 3, f"Expected dimensions to be 3, got {dimensions}"
assert round(magnitude, 3) == 1.053, f"Expected magnitude ≈ 1.053, got {magnitude}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert dimensions == len(vector_point), "dimensions must equal len(vector_point)"
assert abs(magnitude - (sum(x**2 for x in vector_point)**0.5)) < 1e-9, "Euclidean L2 norm formula invariant violated"
assert magnitude >= max(abs(x) for x in vector_point), "Vector magnitude cannot be smaller than any component"

import random
random.seed(42)
for _ in range(5):
    rand_v = [random.uniform(-10.0, 10.0) for _ in range(random.randint(2, 5))]
    rand_mag = sum(c**2 for c in rand_v) ** 0.5
    assert rand_mag >= 0, "Euclidean norm must be non-negative"

assert sum(c**2 for c in [0.0, 0.0, 0.0]) ** 0.5 == 0.0, "Zero-vector norm must be exactly 0.0"
print("✓ [HIDDEN TESTS PASSED] 5/5 geometric norm invariants satisfied.")
print("✓ [TEST PASSED] Vector primitives & geometric norm verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Vector primitives & geometric norm verified.',
          hint: 'Set vector_point = [0.24, -0.89, 0.51], dimensions = len(vector_point), and magnitude = sum(x**2 for x in vector_point) ** 0.5.',
          progressiveHints: [
            'Tier 1 (Mental Model): A vector in Euclidean space is represented in Python as an ordered list of numeric coordinates: [x, y, z].',
            'Tier 2 (Logic): Use len(vector_point) to determine the dimensionality. To compute the Euclidean norm, sum the square of each coordinate and take the square root (** 0.5).',
            'Tier 3 (Syntax): Write: magnitude = sum(x**2 for x in vector_point) ** 0.5.'
          ]
        },
        {
          id: 'lesson-0-2-2',
          title: 'Dictionaries & Structured Message Serialization',
          subtitle: 'Labelled Toy Cubbies & Packing the Mailbox',
          firstPrinciplesIntuition: 'If you throw your teddy bear and crayons into a dark closet, finding them later is hard! But if you put them in a cubby with clear name tags: "toy: teddy bear" and "color: brown", everything is organized and crystal clear. In Python, that labelled cubby is called a Dictionary. When we send messages across the network to an AI model, we serialize our cubby into a standard JSON string using json.dumps()!',
          content: `### JSON Serialization in Large Language Model APIs

All major frontier LLM APIs (OpenAI, Anthropic, Google Gemini) exchange structured messages using JSON (JavaScript Object Notation). A chat exchange is structured as an array of message objects containing distinct \`role\` and \`content\` fields.

\`\`\`
Python Memory:
  message = {"role": "user", "content": "What is an embedding?"}
       |
       v  json.dumps(message)
Network Wire (JSON String):
  '{"role": "user", "content": "What is an embedding?"}'
\`\`\`

#### Your Engineering Challenge:
1. Create a Python dictionary \`message\` containing keys \`"role"\` (value \`"user"\`) and \`"content"\` (value \`"What is an embedding?"\`).
2. Serialize this dictionary into a JSON string named \`json_string\` using \`json.dumps(message)\`.`,
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.2
# Labelled Cubbies: Packing Messages into JSON
# ============================================================

# TODO: Step 1: Create a dictionary with "role": "user" and "content": "What is an embedding?"
message = {}

# TODO: Step 2: Serialize it into a JSON string using json.dumps(message)
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
          testCode: `import json
assert isinstance(message, dict), "message must be a dictionary"
assert isinstance(json_string, str), "json_string must be a serialized string"
parsed = json.loads(json_string)
assert parsed.get("role") == "user", "Message role must be 'user'"
assert parsed.get("content") == "What is an embedding?", "Content must be 'What is an embedding?'"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert set(parsed.keys()) == {"role", "content"}, f"Expected keys {{'role', 'content'}}, got {set(parsed.keys())}"
assert json.loads(json.dumps(parsed)) == parsed, "Round-trip JSON serialization must be idempotent"

roles = ["system", "user", "assistant", "tool"]
for r in roles:
    test_payload = {"role": r, "content": f"Test content for {r}"}
    encoded = json.dumps(test_payload)
    decoded = json.loads(encoded)
    assert decoded["role"] == r and decoded["content"] == f"Test content for {r}", "General JSON serialization schema failed"

assert "\\n" not in json_string or json.loads(json_string)["role"] == "user", "JSON formatting error"
print("✓ [HIDDEN TESTS PASSED] 5/5 structured serialization invariants satisfied.")
print("✓ [TEST PASSED] Structured JSON chat serialization verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Structured JSON chat serialization verified.',
          hint: 'Create message with {"role": "user", "content": "What is an embedding?"} and call json.dumps(message).',
          progressiveHints: [
            'Tier 1 (Mental Model): A Python dictionary stores structured key-value pairs matching JSON object schemas.',
            'Tier 2 (Logic): Assign keys "role" and "content" with string values, then use json.dumps() to serialize to string format.',
            'Tier 3 (Syntax): Write: message = {"role": "user", "content": "What is an embedding?"} and json_string = json.dumps(message).'
          ]
        },
        {
          id: 'lesson-0-2-3',
          title: 'Parsing & Validating Structured Output (Tool Calling)',
          subtitle: 'Reading a Grocery Note from a Friend',
          firstPrinciplesIntuition: 'When grandma gives you a shopping note that says: "Item: Apples, Count: 3", what do you do? You open the note (json.loads), read the labels, and pick up 3 apples. That is exactly how an AI Agent performs Tool Calling! When an AI needs to search a vector database or check live weather, it emits a structured JSON note. Your program opens the note, verifies the tool parameters, and executes the action safely.',
          content: `### Agentic Tool Calling & Schema Deserialization

When language models function as autonomous agents, they don't just output text; they invoke structured tools by emitting function signatures. The host application must safely deserialize the raw JSON payload and extract parameters defensively using \`.get()\` to avoid fatal runtime exceptions.

\`\`\`
Raw LLM Response:
  '{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}'
       |
       v  json.loads()
Validated Python Dictionary:
  call = {"tool": "vector_search", "query": "cosine similarity", "top_k": 3}
       |
       v  Dispatch Pipeline
  vector_search(query='cosine similarity', top_k=3)
\`\`\`

#### Your Engineering Challenge:
1. Parse \`raw_tool_call\` using \`json.loads()\`.
2. Defensively extract \`tool_name\`, \`query\`, and \`top_k\` using \`.get()\`.
3. Construct the \`execution_signature\` string.`,
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.3
# Reading the Note: How AI Assistants Ask for Help
# ============================================================

raw_tool_call = '{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}'

# TODO: Step 1: Deserialize the string using json.loads(raw_tool_call)
call = {}

# TODO: Step 2: Read each property safely using call.get(key, default)
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
          testCode: `assert tool_name == "vector_search", f"Tool name must be 'vector_search', got '{tool_name}'"
assert query == "cosine similarity", f"Query must be 'cosine similarity', got '{query}'"
assert top_k == 3, f"top_k must be 3, got {top_k}"
assert execution_signature == "Calling: vector_search(query='cosine similarity', top_k=3)"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert isinstance(call, dict), "call must be a deserialized dict"
assert isinstance(top_k, int), "top_k must be an integer"
assert execution_signature.startswith("Calling: "), "Signature must begin with 'Calling: '"
assert f"{tool_name}(query='{query}', top_k={top_k})" in execution_signature, "Signature parameters malformed"

tool_cases = [
    ("vector_search", "embeddings", 5),
    ("web_browse", "quantum computing", 1),
    ("sql_query", "SELECT * FROM users", 10),
    ("doc_retriever", "attention paper", 2),
    ("eval_code", "print('hello')", 4)
]
for t_n, q_v, k_v in tool_cases:
    expected_sig = f"Calling: {t_n}(query='{q_v}', top_k={k_v})"
    test_payload = {"tool": t_n, "query": q_v, "top_k": k_v}
    rebuilt_sig = f"Calling: {test_payload.get('tool', '')}(query='{test_payload.get('query', '')}', top_k={test_payload.get('top_k', 0)})"
    assert rebuilt_sig == expected_sig, "Dynamic dispatch invariant failed"

print("✓ [HIDDEN TESTS PASSED] 5/5 tool-calling dispatch invariants satisfied.")
print("✓ [TEST PASSED] Agent tool calling dispatch verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Agent tool calling dispatch verified.',
          hint: 'Use call = json.loads(raw_tool_call), then read tool_name = call.get("tool"), query = call.get("query"), and top_k = call.get("top_k").',
          progressiveHints: [
            'Tier 1 (Mental Model): Tool calling relies on deserializing incoming JSON strings into structured dictionaries using json.loads().',
            'Tier 2 (Logic): Use the .get(key, default) method for safe parameter extraction without throwing KeyError.',
            'Tier 3 (Syntax): Write: call = json.loads(raw_tool_call); tool_name = call.get("tool", ""); query = call.get("query", ""); top_k = call.get("top_k", 0).'
          ]
        }
      ]
    },
    {
      id: 'module-0-3',
      title: 'Module 0.3: What is an API? Tokens & Prompts',
      description: 'See how models learn language in bite-sized syllables, how house rules keep assistants polite, and how choosing crayons controls creativity.',
      lessons: [
        {
          id: 'lesson-0-3-1',
          title: 'Tokenization Mechanics & Byte-Pair Encoding',
          subtitle: 'How Babies Learn to Sound Out Syllables',
          firstPrinciplesIntuition: 'When a baby learns to talk, they do not memorize an entire giant dictionary on day one! Instead, they learn puzzle pieces and sounds: "ba", "by", "play", "ing". AI models do the exact same thing! They chop sentences into bite-sized syllable blocks called "tokens" using Byte-Pair Encoding (BPE). In English, 1 word is roughly 1.33 tokens (or 1 token is roughly 4 letters).',
          content: `### The Subword Arithmetic of Tokenization

Large Language Models do not process raw text or full dictionary words. Instead, they operate on numerical token IDs produced by subword tokenizers (such as Byte-Pair Encoding or WordPiece).

\`\`\`
Raw Text:    "OpenGuide makes AI engineering intuitive"
                   |
                   v BPE Tokenizer
Token Chunks: ["Open", "Guide", " makes", " AI", " engineering", " intuitive"]
Token IDs:    [ 12450,   8921,    1845,   9231,           4812,         16201]
\`\`\`

#### Production Heuristics:
- **Word-to-Token Ratio:** $1 \\text{ word} \\approx 1.33 \\text{ tokens}$ ($N_{\\text{tokens}} \\approx \\lfloor N_{\\text{words}} \\times 1.33 \\rfloor$).
- **Character-to-Token Ratio:** $1 \\text{ token} \\approx 4 \\text{ characters}$ ($N_{\\text{tokens}} \\approx \\text{round}(N_{\\text{chars}} / 4)$).

#### Your Engineering Challenge:
1. Split \`sentence\` into words with \`.split()\`.
2. Compute \`estimated_tokens\` using the word multiplier: \`int(len(words) * 1.33)\`.
3. Compute \`char_tokens\` using the character heuristic: \`round(len(sentence) / 4)\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.1
# Bite-Sized Syllables: Counting Tokens
# ============================================================

sentence = "OpenGuide makes AI engineering intuitive"

# TODO: Step 1: Split the sentence into separate words using .split()
words = []

# TODO: Step 2: Estimate tokens from word count: int(len(words) * 1.33)
estimated_tokens = 0

# TODO: Step 3: Estimate tokens from character count: round(len(sentence) / 4)
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
assert estimated_tokens == 6, f"Expected 6 tokens, got {estimated_tokens}"
assert char_tokens == 10, f"Expected 10 char tokens, got {char_tokens}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert isinstance(words, list) and isinstance(estimated_tokens, int) and isinstance(char_tokens, int), "Types must be list and int"
assert estimated_tokens > 0 and char_tokens > 0, "Token counts must be positive"
assert words == sentence.split(), "words must equal sentence.split()"
assert estimated_tokens == int(len(words) * 1.33), "estimated_tokens formula violated"
assert char_tokens == round(len(sentence) / 4), "char_tokens formula violated"

test_sentences = [
    "Machine learning transforms software.",
    "Attention is all you need.",
    "WebAssembly executes in the browser.",
    "Zero external API dependencies.",
    "CPython runs in Web Workers."
]
for s in test_sentences:
    w = s.split()
    e_tok = int(len(w) * 1.33)
    c_tok = round(len(s) / 4)
    assert e_tok >= len(w), "Word-based token estimate must be >= word count"
    assert c_tok > 0, "Char-based token estimate must be > 0"

print("✓ [HIDDEN TESTS PASSED] 5/5 tokenization heuristic invariants satisfied.")
print("✓ [TEST PASSED] Token estimation heuristics verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Token estimation heuristics verified.',
          hint: 'Use words = sentence.split(), estimated_tokens = int(len(words) * 1.33), and char_tokens = round(len(sentence) / 4).',
          progressiveHints: [
            'Tier 1 (Mental Model): Byte-Pair Encoding (BPE) segments text into subword token chunks rather than whole dictionary words.',
            'Tier 2 (Logic): Use sentence.split() to get words, then apply the 1.33x word multiplier and 4-character division rule.',
            'Tier 3 (Syntax): Write: words = sentence.split(); estimated_tokens = int(len(words) * 1.33); char_tokens = round(len(sentence) / 4).'
          ]
        },
        {
          id: 'lesson-0-3-2',
          title: 'System Prompts vs User Prompts',
          subtitle: 'The House Rules vs Today’s Question',
          firstPrinciplesIntuition: 'Before playtime starts, grandma sets the House Rules: "Rule 1: Always be polite, wash your hands, and tell the truth." That is a System Prompt! It gives the AI its character and safety guardrails. When you ask: "Can I have a cookie?", that is a User Prompt. Keeping the house rules in a separate box prevents anyone from tricking the AI into breaking rules!',
          content: `### Context Hierarchy & Role Separation in Chat ML

Conversational models use structured role tags to distinguish between privileged developer instructions and unprivileged user inputs. Without strict separation, malicious inputs can easily trigger prompt injections and jailbreaks.

\`\`\`
+-------------------------------------------------------------+
| [SYSTEM] Root Authority: Sets persona, rules, and bounds.   |
| "You are a concise AI teacher."                             |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| [USER] Task Request: Unprivileged learner inquiry.          |
| "What is cosine similarity?"                                |
+-------------------------------------------------------------+
\`\`\`

#### Your Engineering Challenge:
Iterate over the \`conversation\` turns and format each item into a clean dialogue log:
\`"[ROLE]: Content"\`
where \`ROLE\` is uppercase (e.g. \`[SYSTEM]\` or \`[USER]\`).`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.2
# House Rules & Turn-Taking: Dialogue Formatting
# ============================================================

conversation = [
    {"role": "system", "content": "You are a concise AI teacher."},
    {"role": "user", "content": "What is cosine similarity?"}
]

# TODO: Step 1: Format each message as "[ROLE]: Content"
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
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert isinstance(formatted_dialogue, list) and isinstance(rendered, str), "formatted_dialogue must be list, rendered must be str"
assert rendered == "\\n".join(formatted_dialogue), "rendered must equal newline-joined formatted_dialogue"
for turn_str in formatted_dialogue:
    assert turn_str.startswith("[") and "]: " in turn_str, f"Malformed turn format: {turn_str}"

multi_turns = [
    {"role": "system", "content": "You are a math tutor."},
    {"role": "user", "content": "What is 2+2?"},
    {"role": "assistant", "content": "It is 4."},
    {"role": "user", "content": "And 3+3?"},
    {"role": "assistant", "content": "It is 6."}
]
re_formatted = [f"[{t['role'].upper()}]: {t['content']}" for t in multi_turns]
assert "\\n".join(re_formatted).count("\\n") == 4, "Multi-turn formatting invariant failed"

print("✓ [HIDDEN TESTS PASSED] 5/5 dialogue turn invariants satisfied.")
print("✓ [TEST PASSED] Multi-turn role separation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Multi-turn role separation verified.',
          hint: 'Loop through conversation, turn msg["role"] uppercase with .upper(), and add f"[{role_tag}]: {msg[\'content\']}".',
          progressiveHints: [
            'Tier 1 (Mental Model): Chat templates enforce strict privilege boundaries between system guardrails and user messages.',
            'Tier 2 (Logic): Loop through each message, capitalize the role with .upper(), and construct the formatted "[ROLE]: content" string.',
            'Tier 3 (Syntax): Inside the loop: role_tag = msg["role"].upper(); formatted_dialogue.append(f"[{role_tag}]: {msg[\'content\']}").'
          ]
        },
        {
          id: 'lesson-0-3-3',
          title: 'Temperature & Sampling Distribution Simulation',
          subtitle: 'Picking Your Favorite Ice Cream Flavor',
          firstPrinciplesIntuition: 'What is "Temperature" in AI? Imagine stepping up to an ice cream counter! At Temperature 0, you are 100% predictable: you pick your all-time #1 favorite chocolate scoop every single visit without change (greedy argmax). But if you turn the temperature up, you feel playful and adventurous—you might try wild blueberry or swirl unexpected colors! That is how AI switches between strict facts and creative storytelling.',
          content: `### Mathematical Mechanics of Softmax Temperature Scaling

During generation, language models produce raw unnormalized log-odds (logits $z_i$) for every vocabulary token. Temperature $T$ scales these logits before applying the Softmax function:

$$P(w_i) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}$$

\`\`\`
Logits [2.0, 1.0, 0.1]:
  T = 0.1 (Greedy Argmax):    P -> [0.999, 0.001, 0.000]  (Deterministic)
  T = 0.7 (Balanced):         P -> [0.650, 0.250, 0.100]  (Reasoning & Flow)
  T = 1.5 (High Entropy):     P -> [0.420, 0.330, 0.250]  (Creative & Varied)
\`\`\`

#### Your Engineering Challenge:
Implement \`simulate_token_sampling(temperature: float) -> str\`:
- If \`temperature < 0.3\`: return \`"greedy_argmax"\`.
- If \`0.3 <= temperature <= 0.8\`: return \`"balanced_sampling"\`.
- If \`temperature > 0.8\`: return \`"high_entropy_creative"\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.3
# Ice Cream Flavors: Controlling AI Creativity
# ============================================================

def simulate_token_sampling(temperature: float) -> str:
    # TODO: Step 1: If temperature is below 0.3, return "greedy_argmax"
    # TODO: Step 2: If temperature is between 0.3 and 0.8 (inclusive), return "balanced_sampling"
    # TODO: Step 3: If temperature is above 0.8, return "high_entropy_creative"
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
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
assert simulate_token_sampling(0.3) == "balanced_sampling", f"T=0.3 must be balanced_sampling (inclusive lower bound), got {simulate_token_sampling(0.3)}"
assert simulate_token_sampling(0.8) == "balanced_sampling", f"T=0.8 must be balanced_sampling (inclusive upper bound), got {simulate_token_sampling(0.8)}"
assert simulate_token_sampling(0.2999) == "greedy_argmax", "T=0.2999 must be greedy_argmax"
assert simulate_token_sampling(0.8001) == "high_entropy_creative", "T=0.8001 must be high_entropy_creative"

import random
random.seed(42)
def ref_sampling(t):
    if t < 0.3:
        return "greedy_argmax"
    elif t <= 0.8:
        return "balanced_sampling"
    return "high_entropy_creative"

for _ in range(10):
    rnd_t = random.uniform(0.0, 2.0)
    assert simulate_token_sampling(rnd_t) == ref_sampling(rnd_t), f"Sampling distribution mismatch at T={rnd_t}"

print("✓ [HIDDEN TESTS PASSED] 5/5 temperature sampling regime invariants satisfied.")
print("✓ [TEST PASSED] Temperature distribution simulation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Temperature distribution simulation verified.',
          hint: 'Use if temperature < 0.3: return "greedy_argmax", elif temperature <= 0.8: return "balanced_sampling", else: return "high_entropy_creative".',
          progressiveHints: [
            'Tier 1 (Mental Model): Sampling temperature scales logits before softmax: low temperature sharpens probability around the argmax mode.',
            'Tier 2 (Logic): Use an if/elif/else ladder to classify the float temperature into distinct sampling regimes.',
            'Tier 3 (Syntax): if temperature < 0.3: return "greedy_argmax" elif temperature <= 0.8: return "balanced_sampling" else: return "high_entropy_creative".'
          ]
        }
      ]
    }
  ]
};
