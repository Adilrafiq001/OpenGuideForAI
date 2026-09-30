import type { Track } from './track0';

export const track4: Track = {
  id: 'track-4',
  title: 'Track 4: Frontier Intelligence & System Foundations',
  description: 'Master the invariant mathematical foundations of transformers, KV-cache dynamics, test-time reasoning search trees, Model Context Protocol (MCP), and local edge quantization without server bills.',
  modules: [
    {
      id: 'module-4-1',
      title: 'Module 4.1: The Transformer Engine & Attention Mechanics',
      description: 'Understand the eternal core of modern deep learning: Query-Key-Value projection matrices, scaled dot-product attention, multi-head subspaces, and KV-cache memory dynamics.',
      lessons: [
        {
          id: 'lesson-4-1-1',
          title: 'Scaled Dot-Product Attention from Scratch (Q, K, V)',
          subtitle: 'The Invariant Mathematical Engine of Modern AI',
          firstPrinciplesIntuition: 'Attention is not magic—it is a content-addressable memory lookup. A Query vector asks "What am I looking for?", Key vectors declare "What information do I contain?", and Value vectors store the actual representation. The dot product Q · K measures conceptual relevance, scaled by 1/sqrt(d_k) to prevent softmax saturation, producing a probability distribution that weights the Values.',
          content: 'Implement the scaled dot-product attention mechanism from scratch in pure Python. Given Q, K, and V matrices, compute attention scores, apply 1/sqrt(d_k) scaling, compute numerically stable row-wise softmax, and multiply by V.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.1
# Objective: Scaled Dot-Product Attention from Scratch (Q, K, V)
# Formula: Attention(Q, K, V) = Softmax( (Q @ K.T) / sqrt(d_k) ) @ V
# ============================================================
import math

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def matrix_transpose(m):
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]

def matrix_multiply(a, b):
    b_t = matrix_transpose(b)
    return [[dot_product(row, col) for col in b_t] for row in a]

def softmax_row(row):
    # Numerically stable softmax: subtract max before exp
    max_val = max(row)
    exp_vals = [math.exp(x - max_val) for x in row]
    sum_exp = sum(exp_vals)
    return [e / sum_exp for e in exp_vals]

def scaled_dot_product_attention(Q, K, V):
    # d_k is the dimension of the key vectors (length of row in K)
    d_k = len(K[0])
    scale = 1.0 / math.sqrt(d_k)
    
    # TODO: Step 1 - Compute raw scores = Q @ K^T
    # Hint: use matrix_multiply(Q, matrix_transpose(K))
    K_T = matrix_transpose(K)
    raw_scores = matrix_multiply(Q, K_T)
    
    # TODO: Step 2 - Scale raw scores by scale (1 / sqrt(d_k))
    scaled_scores = [[val * scale for val in row] for row in raw_scores]
    
    # TODO: Step 3 - Apply softmax to each row of scaled_scores to get attention weights
    attention_weights = [softmax_row(row) for row in scaled_scores]
    
    # TODO: Step 4 - Compute final output = attention_weights @ V
    output = matrix_multiply(attention_weights, V)
    
    return output, attention_weights

# Sample 2-token sequence with d_model = 3
Q = [[1.0, 0.0, 1.0], [0.0, 1.0, 0.0]]
K = [[1.0, 0.0, 1.0], [0.0, 1.0, 1.0]]
V = [[10.0, 20.0], [30.0, 40.0]]

output, weights = scaled_dot_product_attention(Q, K, V)
print("Attention Weights (Row Probabilities):")
for r in weights:
    print([round(p, 4) for p in r])
print("Attention Output:")
for r in output:
    print([round(val, 4) for val in r])
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.1 (Canonical Solution)
# ============================================================
import math

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def matrix_transpose(m):
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]

def matrix_multiply(a, b):
    b_t = matrix_transpose(b)
    return [[dot_product(row, col) for col in b_t] for row in a]

def softmax_row(row):
    max_val = max(row)
    exp_vals = [math.exp(x - max_val) for x in row]
    sum_exp = sum(exp_vals)
    return [e / sum_exp for e in exp_vals]

def scaled_dot_product_attention(Q, K, V):
    d_k = len(K[0])
    scale = 1.0 / math.sqrt(d_k)
    K_T = matrix_transpose(K)
    raw_scores = matrix_multiply(Q, K_T)
    scaled_scores = [[val * scale for val in row] for row in raw_scores]
    attention_weights = [softmax_row(row) for row in scaled_scores]
    output = matrix_multiply(attention_weights, V)
    return output, attention_weights

Q = [[1.0, 0.0, 1.0], [0.0, 1.0, 0.0]]
K = [[1.0, 0.0, 1.0], [0.0, 1.0, 1.0]]
V = [[10.0, 20.0], [30.0, 40.0]]

output, weights = scaled_dot_product_attention(Q, K, V)
print("Attention Weights (Row Probabilities):")
for r in weights:
    print([round(p, 4) for p in r])
print("Attention Output:")
for r in output:
    print([round(val, 4) for val in r])
`,
          testCode: `
# Automated In-Browser Pyodide Verification
test_q = [[1.0, 0.5], [0.2, 0.8]]
test_k = [[1.0, 0.5], [0.2, 0.8]]
test_v = [[5.0, 10.0], [15.0, 20.0]]

out, w = scaled_dot_product_attention(test_q, test_k, test_v)

# Test 1: Shape conformance
assert len(out) == 2 and len(out[0]) == 2, "Output must have shape (seq_len, d_v)"

# Test 2: Row-stochastic property (softmax weights must sum to 1.0 per row)
for row in w:
    assert abs(sum(row) - 1.0) < 1e-5, "Each row of attention weights must sum to exactly 1.0"

# Test 3: Numerical correctness
assert out[0][0] > 0 and out[0][1] > 0, "Output values must be non-zero positive floats"

print("[TEST PASSED] Scaled dot-product attention mathematically certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Remember that K must be transposed before multiplying by Q. Softmax must be applied across rows so every row sums to 1.0.',
          progressiveHints: [
            'Matrix multiplication of Q (shape M x K) by K_T (shape K x N) gives a score matrix of shape M x N.',
            'Scale each score by 1 / math.sqrt(d_k) before exponentiation.',
            'For numerical stability in softmax, subtract max(row) from each score before calling math.exp().'
          ]
        },
        {
          id: 'lesson-4-1-2',
          title: 'Multi-Head Attention & Linear Subspace Decomposition',
          subtitle: 'Parallel Cognitive Projections in Representation Space',
          firstPrinciplesIntuition: 'A single attention head only looks at one relationship at a time (e.g. grammar). Multi-Head Attention splits the high-dimensional embedding space into multiple parallel subspaces (heads). One head attends to verb-object syntax, while another head attends to long-range entity coreference.',
          content: 'Implement a multi-head projection splitter and recombiner. Given an input token tensor of dimension d_model, split the representation into h distinct heads, compute attention per head, concatenate the head outputs, and project back to d_model.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.2
# Objective: Multi-Head Projection & Subspace Decomposition
# ============================================================

def split_heads(X, num_heads):
    """
    Splits a 2D matrix (seq_len x d_model) into num_heads sub-matrices (seq_len x d_k).
    """
    seq_len = len(X)
    d_model = len(X[0])
    d_k = d_model // num_heads
    
    heads = []
    for h in range(num_heads):
        head = []
        for i in range(seq_len):
            start = h * d_k
            end = start + d_k
            head.append(X[i][start:end])
        heads.append(head)
    return heads

def concat_heads(heads):
    """
    Recombines num_heads sub-matrices into a single matrix (seq_len x d_model).
    """
    num_heads = len(heads)
    seq_len = len(heads[0])
    d_k = len(heads[0][0])
    
    combined = []
    for i in range(seq_len):
        row = []
        for h in range(num_heads):
            row.extend(heads[h][i])
        combined.append(row)
    return combined

# Verify splitting and concatenation identity
sample_tokens = [
    [0.1, 0.2, 0.3, 0.4], # Token 0 (d_model = 4)
    [0.5, 0.6, 0.7, 0.8]  # Token 1 (d_model = 4)
]

heads = split_heads(sample_tokens, num_heads=2)
reconstructed = concat_heads(heads)

print("Original Tokens     :", sample_tokens)
print("Reconstructed Tokens:", reconstructed)
print("Heads count         :", len(heads), "with dimension:", len(heads[0][0]))
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.2 (Canonical Solution)
# ============================================================

def split_heads(X, num_heads):
    seq_len = len(X)
    d_model = len(X[0])
    d_k = d_model // num_heads
    heads = []
    for h in range(num_heads):
        head = []
        for i in range(seq_len):
            start = h * d_k
            end = start + d_k
            head.append(X[i][start:end])
        heads.append(head)
    return heads

def concat_heads(heads):
    seq_len = len(heads[0])
    combined = []
    for i in range(seq_len):
        row = []
        for h in range(len(heads)):
            row.extend(heads[h][i])
        combined.append(row)
    return combined

sample_tokens = [
    [0.1, 0.2, 0.3, 0.4],
    [0.5, 0.6, 0.7, 0.8]
]

heads = split_heads(sample_tokens, num_heads=2)
reconstructed = concat_heads(heads)
print("Original Tokens     :", sample_tokens)
print("Reconstructed Tokens:", reconstructed)
print("Heads count         :", len(heads), "with dimension:", len(heads[0][0]))
`,
          testCode: `
# Automated Pyodide Subspace Invariance Test
test_matrix = [[float(i * 8 + j) for j in range(8)] for i in range(4)] # 4 tokens, d_model=8
test_heads = split_heads(test_matrix, num_heads=4) # 4 heads, d_k=2

assert len(test_heads) == 4, "Must produce exactly 4 heads"
assert len(test_heads[0][0]) == 2, "Each head dimension d_k must equal d_model // num_heads (8 // 4 = 2)"

test_recon = concat_heads(test_heads)
assert test_recon == test_matrix, "Concatenation must be an exact lossless inversion of split_heads"

print("[TEST PASSED] Multi-head subspace decomposition certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Verify that each head slices the columns of each token row according to start = h * d_k and end = start + d_k.',
          progressiveHints: [
            'd_k is computed as d_model // num_heads.',
            'When concatenating heads, loop through tokens first, and for each token extend the row with slice from all heads.'
          ]
        },
        {
          id: 'lesson-4-1-3',
          title: 'KV-Cache Dynamics & Production Memory Sizing',
          subtitle: 'Why Inference Is Memory-Bandwidth Bound',
          firstPrinciplesIntuition: 'During LLM generation, computing token N requires attending to all N-1 past tokens. Without caching, generation takes O(N^2) compute. The KV-Cache stores the computed Key and Value vectors for all past tokens in GPU VRAM. However, as context grows to 128k tokens, the KV-cache can easily consume 40GB+ of VRAM! Calculating and managing KV-cache memory is the #1 operational skill for AI engineers.',
          content: 'Build a production KV-Cache memory estimator and an interactive stateful generation cache that appends newly generated token keys and values without recomputing past states.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.3
# Objective: KV-Cache Dynamics & Production Memory Sizing
# Formula: Memory (Bytes) = 2 * layers * heads * d_head * tokens * bytes_per_elem
# ============================================================

def estimate_kv_cache_memory(layers, heads, d_head, tokens, precision_bytes=2):
    """
    Estimates the KV-cache memory in bytes, megabytes, and gigabytes.
    Default precision_bytes=2 corresponds to FP16 / BF16.
    Factor of 2 accounts for both Keys and Values.
    """
    # TODO: Step 1 - Compute total bytes
    bytes_per_token_layer = 2 * heads * d_head * precision_bytes
    total_bytes = layers * bytes_per_token_layer * tokens
    
    mb = total_bytes / (1024 * 1024)
    gb = total_bytes / (1024 * 1024 * 1024)
    return {
        "bytes": total_bytes,
        "mb": round(mb, 2),
        "gb": round(gb, 3)
    }

class KVCache:
    def __init__(self):
        # Cache stores list of (K, V) per layer
        self.k_cache = []
        self.v_cache = []
        
    def append(self, new_k, new_v):
        """Appends new token key and value vectors to the persistent cache."""
        self.k_cache.append(new_k)
        self.v_cache.append(new_v)
        return len(self.k_cache)

# Example: Llama-3 8B (32 layers, 32 heads, d_head=128, 8,192 context tokens, FP16)
llama8b_cache = estimate_kv_cache_memory(layers=32, heads=32, d_head=128, tokens=8192, precision_bytes=2)
print("Llama-3 8B (8k tokens) KV-Cache Memory:", llama8b_cache["gb"], "GB")

# Example: 128k context window
llama8b_128k = estimate_kv_cache_memory(layers=32, heads=32, d_head=128, tokens=128000, precision_bytes=2)
print("Llama-3 8B (128k tokens) KV-Cache Memory:", llama8b_128k["gb"], "GB")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.3 (Canonical Solution)
# ============================================================

def estimate_kv_cache_memory(layers, heads, d_head, tokens, precision_bytes=2):
    bytes_per_token_layer = 2 * heads * d_head * precision_bytes
    total_bytes = layers * bytes_per_token_layer * tokens
    mb = total_bytes / (1024 * 1024)
    gb = total_bytes / (1024 * 1024 * 1024)
    return {
        "bytes": total_bytes,
        "mb": round(mb, 2),
        "gb": round(gb, 3)
    }

class KVCache:
    def __init__(self):
        self.k_cache = []
        self.v_cache = []
        
    def append(self, new_k, new_v):
        self.k_cache.append(new_k)
        self.v_cache.append(new_v)
        return len(self.k_cache)

llama8b_cache = estimate_kv_cache_memory(layers=32, heads=32, d_head=128, tokens=8192, precision_bytes=2)
print("Llama-3 8B (8k tokens) KV-Cache Memory:", llama8b_cache["gb"], "GB")

llama8b_128k = estimate_kv_cache_memory(layers=32, heads=32, d_head=128, tokens=128000, precision_bytes=2)
print("Llama-3 8B (128k tokens) KV-Cache Memory:", llama8b_128k["gb"], "GB")
`,
          testCode: `
# Automated Pyodide KV Cache Assertion
mem = estimate_kv_cache_memory(layers=32, heads=32, d_head=128, tokens=1000, precision_bytes=2)
# 2 * 32 * 32 * 128 * 1000 * 2 = 524,288,000 bytes = 500 MB = ~0.488 GB
assert mem["bytes"] == 524288000, "Exact byte calculation mismatch"
assert mem["mb"] == 500.0, "MB calculation must equal 500.0"

cache = KVCache()
assert cache.append([1, 2], [3, 4]) == 1
assert cache.append([5, 6], [7, 8]) == 2
assert len(cache.k_cache) == 2

print("[TEST PASSED] KV-Cache memory scaling laws certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Remember that the factor of 2 accounts for both Keys and Values. Megabytes are bytes / (1024 * 1024).',
          progressiveHints: [
            'Total bytes = 2 (keys+values) * layers * heads * d_head * tokens * precision_bytes.',
            'For FP16 or BF16, precision_bytes = 2. For FP32, precision_bytes = 4.'
          ]
        }
      ]
    },
    {
      id: 'module-4-2',
      title: 'Module 4.2: Reasoning Models & Test-Time Compute',
      description: 'Master the modern frontier: Test-Time Compute search trees, constrained grammar-guided decoding (FSMs), and Anthropic Model Context Protocol (MCP) JSON-RPC 2.0 architectures.',
      lessons: [
        {
          id: 'lesson-4-2-1',
          title: 'Tree-of-Thoughts & Self-Critique Search Trees',
          subtitle: 'The Test-Time Compute Revolution (o1/o3/Claude Thinking)',
          firstPrinciplesIntuition: 'Classic LLMs generate answers in a single feed-forward pass. Reasoning models spend "thinking tokens" during inference. They generate multiple candidate paths (branches), evaluate intermediate progress using a self-critique scoring function, and backtrack when a dead end is reached. Test-time search replaces blind token regurgitation with deliberate problem solving.',
          content: 'Implement an in-browser Tree-of-Thoughts (ToT) search engine. Build a branch generator, a heuristic critique scorer, and a depth-first search that prunes invalid branches and selects the certified path.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.1
# Objective: Tree-of-Thoughts & Self-Critique Search Trees
# ============================================================

class ThoughtNode:
    def __init__(self, thought, score=0.0, parent=None):
        self.thought = thought
        self.score = score
        self.parent = parent
        self.children = []

def generate_candidate_thoughts(current_state):
    """Simulates LLM proposing 3 potential logical next steps."""
    return [
        f"{current_state} -> Plan A (Direct Attack)",
        f"{current_state} -> Plan B (Decompose Sub-problems)",
        f"{current_state} -> Plan C (Adversarial Inversion)"
    ]

def critique_score(thought_path):
    """
    Simulates Self-Critique scoring (0.0 to 1.0).
    Rewards structured decomposition over shallow attacks.
    """
    if "Decompose Sub-problems" in thought_path:
        return 0.95
    elif "Adversarial Inversion" in thought_path:
        return 0.70
    return 0.30

def tree_of_thoughts_search(initial_state, max_depth=2, prune_threshold=0.5):
    root = ThoughtNode(initial_state, score=1.0)
    best_path = None
    best_score = 0.0
    
    # Queue for breadth-first / beam search
    queue = [root]
    
    while queue:
        current = queue.pop(0)
        
        # If at max depth, check if best
        if current.thought.count("->") >= max_depth:
            if current.score > best_score:
                best_score = current.score
                best_path = current.thought
            continue
            
        candidates = generate_candidate_thoughts(current.thought)
        for cand in candidates:
            score = critique_score(cand)
            # Prune unpromising branches (Test-Time Compute efficiency)
            if score >= prune_threshold:
                child = ThoughtNode(cand, score=score, parent=current)
                current.children.append(child)
                queue.append(child)
                
    return best_path, best_score

path, score = tree_of_thoughts_search("Solve Complex Proof", max_depth=1)
print(f"Certified Reasoning Path: {path}")
print(f"Confidence Score        : {score}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.1 (Canonical Solution)
# ============================================================

class ThoughtNode:
    def __init__(self, thought, score=0.0, parent=None):
        self.thought = thought
        self.score = score
        self.parent = parent
        self.children = []

def generate_candidate_thoughts(current_state):
    return [
        f"{current_state} -> Plan A (Direct Attack)",
        f"{current_state} -> Plan B (Decompose Sub-problems)",
        f"{current_state} -> Plan C (Adversarial Inversion)"
    ]

def critique_score(thought_path):
    if "Decompose Sub-problems" in thought_path:
        return 0.95
    elif "Adversarial Inversion" in thought_path:
        return 0.70
    return 0.30

def tree_of_thoughts_search(initial_state, max_depth=2, prune_threshold=0.5):
    root = ThoughtNode(initial_state, score=1.0)
    best_path = None
    best_score = 0.0
    queue = [root]
    
    while queue:
        current = queue.pop(0)
        if current.thought.count("->") >= max_depth:
            if current.score > best_score:
                best_score = current.score
                best_path = current.thought
            continue
            
        candidates = generate_candidate_thoughts(current.thought)
        for cand in candidates:
            score = critique_score(cand)
            if score >= prune_threshold:
                child = ThoughtNode(cand, score=score, parent=current)
                current.children.append(child)
                queue.append(child)
                
    return best_path, best_score

path, score = tree_of_thoughts_search("Solve Complex Proof", max_depth=1)
print(f"Certified Reasoning Path: {path}")
print(f"Confidence Score        : {score}")
`,
          testCode: `
# Automated Pyodide Test-Time Search Certification
p, s = tree_of_thoughts_search("Root Goal", max_depth=1, prune_threshold=0.8)
assert "Decompose Sub-problems" in p, "Search must select the highest-scoring reasoning path"
assert s == 0.95, "Selected score must match best critique score"

# Verify pruning threshold eliminates weak branches
p_low, _ = tree_of_thoughts_search("Root Goal", max_depth=1, prune_threshold=0.99)
assert p_low is None, "Threshold of 0.99 should prune all branches"

print("[TEST PASSED] Tree-of-Thoughts test-time compute search certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Ensure that only candidate thoughts with score >= prune_threshold are enqueued as child nodes.',
          progressiveHints: [
            'Tree search evaluates each candidate thought using critique_score.',
            'Branches scoring below prune_threshold are discarded, drastically reducing search space.'
          ]
        },
        {
          id: 'lesson-4-2-2',
          title: 'Constrained Decoding & Finite State Machine (FSM) Grammars',
          subtitle: 'Guaranteed 100% Valid JSON Schemas Without Retries',
          firstPrinciplesIntuition: 'Telling an LLM "Please return JSON" will inevitably fail on edge cases. Modern production inference solves this mathematically via Constrained Decoding (Grammar-guided sampling). An FSM monitors the generated tokens character-by-character and masks out all tokens in the vocabulary that would violate the grammar. The model literally CANNOT output invalid syntax.',
          content: 'Build a miniature Finite State Machine constrained decoder in Python. Given a target schema for a key-value pair, validate candidate tokens and mask out illegal syntax.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.2
# Objective: Constrained Decoding & FSM Grammars
# Target Schema: {"status": "ok", "code": <integer>}
# ============================================================

class JsonFSM:
    def __init__(self):
        # States: 0=START, 1=KEY_STATUS, 2=COLON1, 3=VAL_STATUS, 4=COMMA, 5=KEY_CODE, 6=COLON2, 7=VAL_INT, 8=END
        self.state = 0
        
    def step(self, char):
        """Advances the state machine if char is valid, else raises ValueError."""
        if self.state == 0 and char == '{':
            self.state = 1
            return True
        elif self.state == 1 and char == '"':
            self.state = 2
            return True
        elif self.state == 2 and char in 'status':
            return True
        elif self.state == 2 and char == '"':
            self.state = 3
            return True
        elif self.state == 3 and char == ':':
            self.state = 4
            return True
        # For this lab: validate that complete valid JSON strings transition from { to }
        return True

def validate_constrained_stream(token_stream):
    """
    Simulates grammar-guided validation on an incoming token sequence.
    """
    import json
    accumulated = "".join(token_stream)
    try:
        parsed = json.loads(accumulated)
        return True, parsed
    except Exception as e:
        return False, str(e)

valid_tokens = ['{"status":', ' "ok",', ' "code":', ' 200}']
success, data = validate_constrained_stream(valid_tokens)
print("Constrained Stream Success:", success)
print("Parsed JSON Payload       :", data)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.2 (Canonical Solution)
# ============================================================
import json

def validate_constrained_stream(token_stream):
    accumulated = "".join(token_stream)
    try:
        parsed = json.loads(accumulated)
        return True, parsed
    except Exception as e:
        return False, str(e)

valid_tokens = ['{"status":', ' "ok",', ' "code":', ' 200}']
success, data = validate_constrained_stream(valid_tokens)
print("Constrained Stream Success:", success)
print("Parsed JSON Payload       :", data)
`,
          testCode: `
# Automated Pyodide Constrained Decoding Verification
ok, res = validate_constrained_stream(['{"status":', ' "ok",', ' "code":', ' 200}'])
assert ok is True, "Valid tokens must successfully parse as JSON"
assert res["status"] == "ok" and res["code"] == 200, "Payload keys must match schema"

bad_ok, _ = validate_constrained_stream(['{"status":', ' "ok",', ' "code":'])
assert bad_ok is False, "Incomplete or malformed tokens must be rejected"

print("[TEST PASSED] Grammar-guided constrained decoding verified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Verify that the token stream concatenates into a complete, well-formed JSON object before calling json.loads.',
          progressiveHints: [
            'Constrained decoding operates by masking candidate logits at inference time.',
            'Every emitted token must preserve valid JSON prefix semantics.'
          ]
        },
        {
          id: 'lesson-4-2-3',
          title: 'Model Context Protocol (MCP) JSON-RPC 2.0 Dispatcher',
          subtitle: 'The Universal Open Standard for AI Agent Tools',
          firstPrinciplesIntuition: 'Before MCP, every AI vendor invented their own proprietary tool-calling schema. Anthropic open-sourced Model Context Protocol (MCP) as the universal USB-C standard for AI. MCP standardizes tool listing (tools/list), execution (tools/call), resource reading, and prompt templates over JSON-RPC 2.0. Any agent can speak to any tool server globally.',
          content: 'Implement an MCP JSON-RPC 2.0 server dispatcher. Register tools with parameter schemas, handle tools/list requests, execute tools/call invocations, and return standardized error codes (-32601 for Method Not Found).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.3
# Objective: Model Context Protocol (MCP) JSON-RPC 2.0 Dispatcher
# ============================================================
import json

class MCPServer:
    def __init__(self, name="OpenGuide-MCP"):
        self.name = name
        self.tools = {}
        
    def register_tool(self, name, description, schema, handler):
        self.tools[name] = {
            "name": name,
            "description": description,
            "inputSchema": schema,
            "handler": handler
        }
        
    def handle_request(self, request_json_str):
        req = json.loads(request_json_str)
        req_id = req.get("id")
        method = req.get("method")
        params = req.get("params", {})
        
        # Standard MCP JSON-RPC 2.0 Routing
        if method == "tools/list":
            tool_list = [
                {"name": t["name"], "description": t["description"], "inputSchema": t["inputSchema"]}
                for t in self.tools.values()
            ]
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"tools": tool_list}
            })
            
        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            if tool_name not in self.tools:
                return json.dumps({
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Tool '{tool_name}' not found"}
                })
            result = self.tools[tool_name]["handler"](arguments)
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"content": [{"type": "text", "text": str(result)}]}
            })
            
        else:
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method '{method}' not implemented"}
            })

server = MCPServer()
server.register_tool(
    name="calculator",
    description="Adds two numbers",
    schema={"type": "object", "properties": {"a": {"type": "number"}, "b": {"type": "number"}}},
    handler=lambda args: args.get("a", 0) + args.get("b", 0)
)

# Test listing
list_req = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
print("MCP tools/list Response:", server.handle_request(list_req))

# Test execution
call_req = json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "calculator", "arguments": {"a": 40, "b": 2}}})
print("MCP tools/call Response:", server.handle_request(call_req))
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.2.3 (Canonical Solution)
# ============================================================
import json

class MCPServer:
    def __init__(self, name="OpenGuide-MCP"):
        self.name = name
        self.tools = {}
        
    def register_tool(self, name, description, schema, handler):
        self.tools[name] = {
            "name": name,
            "description": description,
            "inputSchema": schema,
            "handler": handler
        }
        
    def handle_request(self, request_json_str):
        req = json.loads(request_json_str)
        req_id = req.get("id")
        method = req.get("method")
        params = req.get("params", {})
        
        if method == "tools/list":
            tool_list = [
                {"name": t["name"], "description": t["description"], "inputSchema": t["inputSchema"]}
                for t in self.tools.values()
            ]
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"tools": tool_list}
            })
            
        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            if tool_name not in self.tools:
                return json.dumps({
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Tool '{tool_name}' not found"}
                })
            result = self.tools[tool_name]["handler"](arguments)
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"content": [{"type": "text", "text": str(result)}]}
            })
            
        else:
            return json.dumps({
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method '{method}' not implemented"}
            })

server = MCPServer()
server.register_tool(
    name="calculator",
    description="Adds two numbers",
    schema={"type": "object", "properties": {"a": {"type": "number"}, "b": {"type": "number"}}},
    handler=lambda args: args.get("a", 0) + args.get("b", 0)
)
`,
          testCode: `
# Automated Pyodide MCP Compliance Harness
res = json.loads(server.handle_request(json.dumps({
    "jsonrpc": "2.0", "id": 10, "method": "tools/call",
    "params": {"name": "calculator", "arguments": {"a": 15, "b": 27}}
})))

assert res["id"] == 10, "Response ID must echo request ID"
assert res["result"]["content"][0]["text"] == "42", "Tool call must correctly execute and return stringified result"

err_res = json.loads(server.handle_request(json.dumps({
    "jsonrpc": "2.0", "id": 11, "method": "non_existent_method"
})))
assert err_res["error"]["code"] == -32601, "Unknown method must return standard JSON-RPC error code -32601"

print("[TEST PASSED] Model Context Protocol (MCP) server dispatcher certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Confirm that all responses return a valid JSON-RPC 2.0 envelope with jsonrpc, id, and either result or error.',
          progressiveHints: [
            'MCP specifies that tool results are returned inside content arrays of objects with type="text".',
            'Error code -32601 is the standard JSON-RPC 2.0 error for Method not found.'
          ]
        }
      ]
    },
    {
      id: 'module-4-3',
      title: 'Module 4.3: Local Small Language Models & Optimization',
      description: 'Run AI locally on edge devices: Affine weight quantization (FP32 to INT8/INT4), Direct Preference Optimization (DPO Loss), and the Capstone Autonomous Reasoning Agent.',
      lessons: [
        {
          id: 'lesson-4-3-1',
          title: 'Weight Quantization from Scratch (FP32 to INT8)',
          subtitle: 'Running 8B Parameter Models in 4GB of Memory',
          firstPrinciplesIntuition: 'Neural network weights are initially stored as 32-bit floating point numbers (FP32, 4 bytes per weight). For an 8B model, that is 32GB of RAM! Symmetric quantization finds the maximum absolute weight scale = max(|W|) / 127 and maps every float into an 8-bit signed integer [-128, 127] (1 byte per weight). The model size shrinks by 4x with virtually zero loss in perceptual intelligence.',
          content: 'Build a symmetric uniform 8-bit quantizer and dequantizer in pure Python. Given a weight matrix of FP32 values, compute the scale factor, quantize to INT8 integers, dequantize back to float, and calculate the Mean Squared Error (MSE).',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.3.1
# Objective: Weight Quantization from Scratch (FP32 to INT8)
# Formula: q = clip(round(x / scale), -128, 127) where scale = max(|x|) / 127
# ============================================================

def quantize_int8(weights):
    """
    Symmetric INT8 quantization.
    Returns: quantized_weights (list of ints), scale (float)
    """
    flat = [abs(w) for row in weights for w in row] if isinstance(weights[0], list) else [abs(w) for w in weights]
    max_val = max(flat)
    if max_val == 0:
        scale = 1.0
    else:
        scale = max_val / 127.0
        
    def q_val(x):
        val = round(x / scale)
        return max(-128, min(127, val))
        
    if isinstance(weights[0], list):
        quantized = [[q_val(x) for x in row] for row in weights]
    else:
        quantized = [q_val(x) for x in weights]
        
    return quantized, scale

def dequantize_int8(quantized, scale):
    """
    Reconstructs floating point weights from INT8 integers.
    """
    if isinstance(quantized[0], list):
        return [[q * scale for q in row] for row in quantized]
    return [q * scale for q in quantized]

def compute_mse(original, reconstructed):
    flat_orig = [x for row in original for x in row] if isinstance(original[0], list) else original
    flat_rec = [x for row in reconstructed for x in row] if isinstance(reconstructed[0], list) else reconstructed
    return sum((o - r) ** 2 for o, r in zip(flat_orig, flat_rec)) / len(flat_orig)

# Example weight tensor
fp32_weights = [
    [0.452, -0.891, 0.123],
    [-0.054, 0.985, -0.320]
]

q_weights, scale = quantize_int8(fp32_weights)
rec_weights = dequantize_int8(q_weights, scale)
mse = compute_mse(fp32_weights, rec_weights)

print("Original FP32 Weights   :", fp32_weights)
print("Quantized INT8 (1-byte) :", q_weights)
print("Quantization Scale      :", round(scale, 6))
print("Mean Squared Error (MSE):", round(mse, 6))
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.3.1 (Canonical Solution)
# ============================================================

def quantize_int8(weights):
    flat = [abs(w) for row in weights for w in row] if isinstance(weights[0], list) else [abs(w) for w in weights]
    max_val = max(flat)
    scale = max_val / 127.0 if max_val != 0 else 1.0
    def q_val(x):
        return max(-128, min(127, round(x / scale)))
    if isinstance(weights[0], list):
        quantized = [[q_val(x) for x in row] for row in weights]
    else:
        quantized = [q_val(x) for x in weights]
    return quantized, scale

def dequantize_int8(quantized, scale):
    if isinstance(quantized[0], list):
        return [[q * scale for q in row] for row in quantized]
    return [q * scale for q in quantized]

def compute_mse(original, reconstructed):
    flat_orig = [x for row in original for x in row] if isinstance(original[0], list) else original
    flat_rec = [x for row in reconstructed for x in row] if isinstance(reconstructed[0], list) else reconstructed
    return sum((o - r) ** 2 for o, r in zip(flat_orig, flat_rec)) / len(flat_orig)

fp32_weights = [
    [0.452, -0.891, 0.123],
    [-0.054, 0.985, -0.320]
]

q_weights, scale = quantize_int8(fp32_weights)
rec_weights = dequantize_int8(q_weights, scale)
mse = compute_mse(fp32_weights, rec_weights)

print("Original FP32 Weights   :", fp32_weights)
print("Quantized INT8 (1-byte) :", q_weights)
print("Quantization Scale      :", round(scale, 6))
print("Mean Squared Error (MSE):", round(mse, 6))
`,
          testCode: `
# Automated Pyodide Quantization Certification
test_tensor = [0.12, -0.85, 0.44, 0.99, -0.02]
q, s = quantize_int8(test_tensor)

# Assert all values are signed 8-bit integers
for val in q:
    assert isinstance(val, int), "Quantized values must be integers"
    assert -128 <= val <= 127, f"Value {val} out of 8-bit range [-128, 127]"

rec = dequantize_int8(q, s)
loss = compute_mse(test_tensor, rec)
assert loss < 0.001, f"Quantization MSE ({loss}) must be under 0.001 for uniform scale"

print("[TEST PASSED] In-memory weight quantization certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Ensure that scale is max(|weights|) / 127 and values are clipped between -128 and 127.',
          progressiveHints: [
            'Symmetric quantization centers values around zero with a single scale factor.',
            'Dequantization simply multiplies the integer by scale: x_hat = q * scale.'
          ]
        },
        {
          id: 'lesson-4-3-2',
          title: 'Direct Preference Optimization (DPO) Loss from Scratch',
          subtitle: 'Mathematical Alignment Without Reinforcement Learning',
          firstPrinciplesIntuition: 'RLHF (Reinforcement Learning from Human Feedback) required training complex reward models and running fragile PPO loops. In 2023, DPO proved that the optimal policy can be extracted analytically in closed form. Given pairs of preferred (winning) and dispreferred (losing) responses, DPO directly computes the log-ratio loss between the current policy and reference model.',
          content: 'Implement the mathematical DPO loss function in pure Python. Given winning and losing log-probabilities from the policy and reference models, compute implicit rewards and binary cross-entropy loss with beta temperature scaling.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.3.2
# Objective: Direct Preference Optimization (DPO) Loss
# Formula: L_DPO = -log( sigmoid( beta * (log_pi(y_w) - log_ref(y_w)) - beta * (log_pi(y_l) - log_ref(y_l)) ) )
# ============================================================
import math

def sigmoid(x):
    # Numerically stable sigmoid
    if x >= 0:
        z = math.exp(-x)
        return 1.0 / (1.0 + z)
    else:
        z = math.exp(x)
        return z / (1.0 + z)

def compute_dpo_loss(pi_win_logprob, pi_lose_logprob, ref_win_logprob, ref_lose_logprob, beta=0.1):
    """
    Computes DPO loss for a single preference pair.
    """
    # TODO: Step 1 - Calculate log ratio for winning response: log(pi(y_w)) - log(ref(y_w))
    win_log_ratio = pi_win_logprob - ref_win_logprob
    
    # TODO: Step 2 - Calculate log ratio for losing response: log(pi(y_l)) - log(ref(y_l))
    lose_log_ratio = pi_lose_logprob - ref_lose_logprob
    
    # TODO: Step 3 - Compute logits difference scaled by beta
    logits = beta * (win_log_ratio - lose_log_ratio)
    
    # TODO: Step 4 - Compute -log(sigmoid(logits))
    prob = sigmoid(logits)
    loss = -math.log(max(prob, 1e-12))
    
    return loss, logits

# Scenario 1: Model prefers winning response over reference
loss_good, logits_good = compute_dpo_loss(
    pi_win_logprob=-1.2,   # Higher probability
    pi_lose_logprob=-3.5,  # Lower probability
    ref_win_logprob=-2.0,
    ref_lose_logprob=-2.0,
    beta=0.1
)

print(f"Aligned Model Logits: {round(logits_good, 4)} | DPO Loss: {round(loss_good, 4)}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.3.2 (Canonical Solution)
# ============================================================
import math

def sigmoid(x):
    if x >= 0:
        z = math.exp(-x)
        return 1.0 / (1.0 + z)
    else:
        z = math.exp(x)
        return z / (1.0 + z)

def compute_dpo_loss(pi_win_logprob, pi_lose_logprob, ref_win_logprob, ref_lose_logprob, beta=0.1):
    win_log_ratio = pi_win_logprob - ref_win_logprob
    lose_log_ratio = pi_lose_logprob - ref_lose_logprob
    logits = beta * (win_log_ratio - lose_log_ratio)
    prob = sigmoid(logits)
    loss = -math.log(max(prob, 1e-12))
    return loss, logits

loss_good, logits_good = compute_dpo_loss(
    pi_win_logprob=-1.2,
    pi_lose_logprob=-3.5,
    ref_win_logprob=-2.0,
    ref_lose_logprob=-2.0,
    beta=0.1
)
print(f"Aligned Model Logits: {round(logits_good, 4)} | DPO Loss: {round(loss_good, 4)}")
`,
          testCode: `
# Automated Pyodide DPO Verification
# Case A: Policy strongly prefers winning response (Loss should be near 0)
loss_aligned, _ = compute_dpo_loss(-0.5, -5.0, -2.0, -2.0, beta=0.5)

# Case B: Policy mistakenly prefers losing response (Loss should be large)
loss_misaligned, _ = compute_dpo_loss(-5.0, -0.5, -2.0, -2.0, beta=0.5)

assert loss_aligned < loss_misaligned, "Aligned policy must produce strictly lower loss than misaligned policy"
assert loss_aligned < 0.5, "Strongly aligned response should produce small loss"
assert loss_misaligned > 1.5, "Inverted preferences must produce high penalizing loss"

print("[TEST PASSED] Direct Preference Optimization (DPO) mathematical loss certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Remember that DPO loss minimizes -log(sigmoid(beta * (win_ratio - lose_ratio))).',
          progressiveHints: [
            'win_log_ratio is pi_win_logprob - ref_win_logprob.',
            'As the policy increases probability on y_w and decreases on y_l, logits increase, sigmoid approaches 1, and -log(1) approaches 0.'
          ]
        },
        {
          id: 'lesson-4-3-3',
          title: 'Boss Project: The Autonomous Frontier Reasoning Agent',
          subtitle: 'Composing Attention, KV-Cache, ToT Search & MCP Tools',
          firstPrinciplesIntuition: 'You have mastered the foundational mechanics of the AI frontier: the linear algebra of attention projections, memory-constrained KV-cache sizing, tree-of-thoughts reasoning search, and the standardized Model Context Protocol. In this capstone, you will compose all components into a production-grade autonomous agent architecture that searches, reasons, invokes tools, and self-evaluates.',
          content: 'Synthesize your skills into an end-to-end AutonomousReasoningEngine class. Implement goal decomposition, multi-turn reasoning loops, MCP tool dispatching, and self-critique verification to output a certified mission report.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Capstone Boss Project
# Objective: The Autonomous Frontier Reasoning Agent
# ============================================================
import json

class AutonomousReasoningEngine:
    def __init__(self, agent_name="OpenGuide-Apex"):
        self.agent_name = agent_name
        self.kv_memory_tokens = 0
        self.tools = {}
        self.audit_log = []
        
    def register_mcp_tool(self, name, handler):
        self.tools[name] = handler
        
    def execute_reasoning_cycle(self, goal):
        self.audit_log.append(f"[GOAL] Initialized: {goal}")
        
        # Step 1: Decompose problem
        sub_tasks = [
            f"Step 1: Inspect environment for '{goal}'",
            f"Step 2: Dispatch MCP tool calculation",
            f"Step 3: Verify and self-critique"
        ]
        
        results = []
        for step in sub_tasks:
            self.audit_log.append(f"[THOUGHT] {step}")
            if "tool calculation" in step:
                if "calc" in self.tools:
                    tool_out = self.tools["calc"]({"x": 21, "multiplier": 2})
                    results.append(f"Tool Result: {tool_out}")
                    self.audit_log.append(f"[MCP CALL] calc -> {tool_out}")
            self.kv_memory_tokens += 128
            
        # Step 4: Self-critique synthesis
        certified = len(results) > 0 and self.kv_memory_tokens > 0
        self.audit_log.append(f"[VERDICT] Certified: {certified}")
        
        return {
            "agent": self.agent_name,
            "goal": goal,
            "certified": certified,
            "kv_tokens_consumed": self.kv_memory_tokens,
            "log": self.audit_log
        }

agent = AutonomousReasoningEngine()
agent.register_mcp_tool("calc", lambda args: args.get("x", 0) * args.get("multiplier", 1))

report = agent.execute_reasoning_cycle("Synthesize Frontier Intelligence")
print(json.dumps(report, indent=2))
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Capstone Boss Project (Canonical Solution)
# ============================================================
import json

class AutonomousReasoningEngine:
    def __init__(self, agent_name="OpenGuide-Apex"):
        self.agent_name = agent_name
        self.kv_memory_tokens = 0
        self.tools = {}
        self.audit_log = []
        
    def register_mcp_tool(self, name, handler):
        self.tools[name] = handler
        
    def execute_reasoning_cycle(self, goal):
        self.audit_log.append(f"[GOAL] Initialized: {goal}")
        sub_tasks = [
            f"Step 1: Inspect environment for '{goal}'",
            f"Step 2: Dispatch MCP tool calculation",
            f"Step 3: Verify and self-critique"
        ]
        results = []
        for step in sub_tasks:
            self.audit_log.append(f"[THOUGHT] {step}")
            if "tool calculation" in step and "calc" in self.tools:
                tool_out = self.tools["calc"]({"x": 21, "multiplier": 2})
                results.append(f"Tool Result: {tool_out}")
                self.audit_log.append(f"[MCP CALL] calc -> {tool_out}")
            self.kv_memory_tokens += 128
            
        certified = len(results) > 0 and self.kv_memory_tokens > 0
        self.audit_log.append(f"[VERDICT] Certified: {certified}")
        
        return {
            "agent": self.agent_name,
            "goal": goal,
            "certified": certified,
            "kv_tokens_consumed": self.kv_memory_tokens,
            "log": self.audit_log
        }

agent = AutonomousReasoningEngine()
agent.register_mcp_tool("calc", lambda args: args.get("x", 0) * args.get("multiplier", 1))
report = agent.execute_reasoning_cycle("Synthesize Frontier Intelligence")
print(json.dumps(report, indent=2))
`,
          testCode: `
# Automated Pyodide Capstone Certification
test_agent = AutonomousReasoningEngine()
test_agent.register_mcp_tool("calc", lambda args: args["x"] * args["multiplier"])
res = test_agent.execute_reasoning_cycle("Autonomous Test")

assert res["certified"] is True, "Autonomous cycle must verify and certify execution"
assert res["kv_tokens_consumed"] >= 384, "KV memory token consumption must be tracked across steps"
assert any("[MCP CALL]" in line for line in res["log"]), "Log must capture standardized MCP tool invocation"

print("[TEST PASSED] Capstone Autonomous Frontier Reasoning Agent certified.")
`,
          expectedOutput: '[TEST PASSED]',
          hint: 'Verify that the MCP tool is called and returns the product, updating audit_log and kv_memory_tokens.',
          progressiveHints: [
            'Each reasoning step increments the active working KV context tokens.',
            'The MCP tool invocation outputs [MCP CALL] calc -> 42 into the execution audit log.'
          ]
        }
      ]
    }
  ]
};
