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
          firstPrinciplesIntuition: 'Think of your computer as a friendly kitchen and Python as your favourite recipe book! When you want the kitchen to announce something, you use a magic word called print(). Just like a baker reading out "The cookies are ready!", print() speaks words directly onto your screen. Even better: in OpenGuide, this recipe cooks right inside your own browser—100% free, private, and with zero software to install!',
          content: 'Let us introduce ourselves! Create a note called message that holds the exact phrase: "Hello, World! Running natively in browser." Then tell the computer to read it aloud using print(message).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.1
# Welcome! Let's cook our very first recipe in code.
# ============================================================

# TODO: Step 1: Write down your greeting inside the quotation marks:
# "Hello, World! Running natively in browser."
message = ""

# Step 2: Ask the computer to speak it aloud using print():
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
          hint: 'Fill in: message = "Hello, World! Running natively in browser." and on the next line write: print(message).'
        },
        {
          id: 'lesson-0-1-2',
          title: 'Standard Streams & Dynamic Prompt Formatting',
          subtitle: 'Fill-in-the-Blanks: Like a Birthday Invitation!',
          firstPrinciplesIntuition: 'Have you ever played Mad Libs or filled out a party invitation? "Dear {name}, please come to my {party}!" Instead of writing a whole new letter for every friend, you leave blanks and fill them in with names. In Python, placing the little letter "f" right before quotation marks creates an "f-string"—a magic template that drops variables right into the blanks inside curly braces {}. That is how AI prompts are built!',
          content: 'Combine our topic and audience variables into a friendly prompt template using an f-string: "Explain {topic} in one plain sentence for {audience}."',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.2
# Fill-in-the-Blanks: Crafting a Dynamic AI Prompt
# ============================================================

topic = "Vector Embeddings"
audience = "a beginner"

# Step: Fill in the blank using an f-string:
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
          hint: 'Put an f in front of the quotes: prompt = f"Explain {topic} in one plain sentence for {audience}."'
        },
        {
          id: 'lesson-0-1-3',
          title: 'Web Worker Non-Blocking Execution',
          subtitle: 'Having a Sous-Chef in the Kitchen',
          firstPrinciplesIntuition: 'Imagine you are hosting a dinner party. If you stand frozen watching the soup simmer for an hour, nobody gets drinks and the music stops! A great host hires a sous-chef to chop vegetables in the back kitchen so the front room stays lively and fun. In your browser, a "Web Worker" is that sous-chef: it crunches big math numbers in the background so your buttons click instantly and your screen stays buttery smooth!',
          content: 'Simulate our background helper processing 1,000 3D spatial points (each point has 3 coordinates: x, y, z) without making the user interface pause.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.1.3
# Sous-Chef Helpers: Doing Big Work in the Background
# ============================================================

# Step 1: Set the batch count to 1000 items
batch_count = 0

# Step 2: Multiply by 3 (since every 3D point has an x, y, and z coordinate)
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
      description: 'Learn how maps describe locations with numbers, how labelled toy cubbies keep information neat, and how to read notes sent between computers.',
      lessons: [
        {
          id: 'lesson-0-2-1',
          title: 'Variables, Lists & Vector Primitives',
          subtitle: 'Treasure Map Coordinates on the Playground',
          firstPrinciplesIntuition: 'People often make "vectors" sound scary, but it is just a playground treasure map! If grandma tells you: "Take 2 steps forward, 8 steps left, and climb 5 rungs up the ladder", those three directions [0.24, -0.89, 0.51] are your exact coordinates. In AI, a vector is simply a list of friendly numbers that pinpoints where an idea lives in a giant thinking space!',
          content: 'Store our 3D treasure point [0.24, -0.89, 0.51], count its dimensions with len(), and find out how far it is from home (its magnitude).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.1
# Treasure Maps: Points in 3D Space
# ============================================================

# Step 1: Write down the 3 coordinates: [0.24, -0.89, 0.51]
vector_point = []

# Step 2: Count how many numbers are in the list using len()
dimensions = 0

# Step 3: Find the distance (magnitude) using sqrt(x^2 + y^2 + z^2)
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
          hint: 'Set vector_point = [0.24, -0.89, 0.51], dimensions = len(vector_point), and magnitude = sum(x**2 for x in vector_point) ** 0.5.'
        },
        {
          id: 'lesson-0-2-2',
          title: 'Dictionaries & Structured Message Serialization',
          subtitle: 'Labelled Toy Cubbies & Packing the Mailbox',
          firstPrinciplesIntuition: 'If you throw your teddy bear and crayons into a dark closet, finding them later is hard! But if you put them in a cubby with a name tag: "toy: teddy bear" and "color: brown", everything is crystal clear. In Python, that labelled cubby is called a Dictionary. When we want to send our cubby across the internet to an AI assistant, we pack it into a neat letter called JSON using json.dumps()!',
          content: 'Build a tidy message cubby with role="user" and content="What is an embedding?", then pack it into a JSON string ready to mail.',
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.2
# Labelled Cubbies: Packing Messages into JSON
# ============================================================

# Step 1: Put sticky notes inside our cubby: "role" and "content"
message = {}

# Step 2: Pack it into a JSON letter using json.dumps(message)
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
          hint: 'Create message with {"role": "user", "content": "What is an embedding?"} and call json.dumps(message).'
        },
        {
          id: 'lesson-0-2-3',
          title: 'Parsing & Validating Structured Output (Tool Calling)',
          subtitle: 'Reading a Grocery Note from a Friend',
          firstPrinciplesIntuition: 'When grandma gives you a shopping note that says: "Item: Apples, Count: 3", what do you do? You open the note (json.loads), read the labels, and pick up 3 apples. That is exactly what an AI Agent does! When an AI needs to look up weather or search a book, it hands your program a note. You open the note, read what tool it asked for, and perform the job happily.',
          content: 'Unpack a tool note from an AI assistant and extract the tool name, search query, and how many items to return (top_k).',
          initialCode: `import json

# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.2.3
# Reading the Note: How AI Assistants Ask for Help
# ============================================================

raw_tool_call = '{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}'

# Step 1: Open the note using json.loads(raw_tool_call)
call = {}

# Step 2: Read each label from the note using call.get(...)
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
          hint: 'Use call = json.loads(raw_tool_call), then read tool_name = call.get("tool"), query = call.get("query"), and top_k = call.get("top_k").'
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
          firstPrinciplesIntuition: 'When a baby learns to talk, they do not memorize an entire giant dictionary on day one! Instead, they learn puzzle pieces and sounds: "ba", "by", "play", "ing". AI models do the exact same thing! They chop sentences into bite-sized syllable blocks called "tokens". In English, 1 word is usually about 1.33 tokens (or 1 token is roughly 4 letters).',
          content: 'Break a sentence into words, then calculate the estimated syllable tokens using both the word multiplier (1.33x) and the letter counter (divide by 4).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.1
# Bite-Sized Syllables: Counting Tokens
# ============================================================

sentence = "OpenGuide makes AI engineering intuitive"

# Step 1: Cut the sentence into separate words using .split()
words = []

# Step 2: Guess the tokens: int(len(words) * 1.33)
estimated_tokens = 0

# Step 3: Guess by characters: round(len(sentence) / 4)
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
          hint: 'Use words = sentence.split(), estimated_tokens = int(len(words) * 1.33), and char_tokens = round(len(sentence) / 4).'
        },
        {
          id: 'lesson-0-3-2',
          title: 'System Prompts vs User Prompts',
          subtitle: 'The House Rules vs Today’s Question',
          firstPrinciplesIntuition: 'Before playtime starts, grandma sets the House Rules: "Rule 1: Always be polite, wash your hands, and tell the truth." That is a System Prompt! It gives the AI its character and safety guardrails. When you ask: "Can I have a cookie?", that is a User Prompt. Keeping the house rules in a separate box prevents anyone from tricking the AI into breaking rules!',
          content: 'Format a tidy conversation log with clear name tags for both [SYSTEM] house rules and [USER] questions.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.2
# House Rules & Turn-Taking: Dialogue Formatting
# ============================================================

conversation = [
    {"role": "system", "content": "You are a concise AI teacher."},
    {"role": "user", "content": "What is cosine similarity?"}
]

# Step: Format each message as "[ROLE]: Content"
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
          hint: 'Loop through conversation, turn msg["role"] uppercase with .upper(), and add f"[{role_tag}]: {msg[\'content\']}".'
        },
        {
          id: 'lesson-0-3-3',
          title: 'Temperature & Sampling Distribution Simulation',
          subtitle: 'Picking Your Favorite Ice Cream Flavor',
          firstPrinciplesIntuition: 'What is "Temperature" in AI? Imagine stepping up to an ice cream counter! At Temperature 0, you are 100% predictable: you pick your all-time #1 favorite chocolate scoop every single visit without change (greedy argmax). But if you turn the temperature up, you feel playful and adventurous—you might try wild blueberry or swirl unexpected colors! That is how AI switches between strict facts and creative storytelling.',
          content: 'Write a friendly temperature selector that returns "greedy_argmax" when temperature is below 0.3, "balanced_sampling" for middle values, and "high_entropy_creative" when you want wild ideas.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 0 - Lab 0.3.3
# Ice Cream Flavors: Controlling AI Creativity
# ============================================================

def simulate_token_sampling(temperature: float) -> str:
    # Step 1: If temperature is below 0.3, stick to the predictable favorite: "greedy_argmax"
    # Step 2: If temperature is between 0.3 and 0.8 (inclusive), choose: "balanced_sampling"
    # Step 3: If temperature is above 0.8, go wild with: "high_entropy_creative"
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
          hint: 'Use if temperature < 0.3: return "greedy_argmax", elif temperature <= 0.8: return "balanced_sampling", else: return "high_entropy_creative".'
        }
      ]
    }
  ]
};
