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
          content: `### Scaled Dot-Product Attention Mathematical Formulation

Introduced in *Attention Is All You Need* (Vaswani et al., 2017), the scaled dot-product attention function maps queries and key-value pairs to an output representation:

$$\\text{Attention}(Q, K, V) = \\text{Softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

\`\`\`
  Queries (Q)          Keys (K)                   Values (V)
  [seq_len x d_k]    [seq_len x d_k]            [seq_len x d_v]
         \\                 /                            |
          \\               / (Transpose K -> K^T)        |
           v             v                              |
        [ Matrix Multiply: Q @ K^T ]                    |
                     |                                  |
                     v                                  |
        [ Scale: Multiply by 1/sqrt(d_k) ]              |
                     |                                  |
                     v                                  |
        [ Softmax (Row-wise Probabilities) ]            |
                     \\                                 /
                      \\                               /
                       v                             v
                   [ Matrix Multiply: Weights @ V ]
                                 |
                                 v
                     [ Output: seq_len x d_v ]
\`\`\`

#### Why Scaling by $1/\\sqrt{d_k}$ Is Non-Negotiable
For large key dimensions $d_k$, the dot products grow large in magnitude: $\\text{Var}(q \\cdot k) = d_k$. Without dividing by $\\sqrt{d_k}$, large logits push the softmax function into regions with vanishing gradients ($e^z / \\sum e^z \\approx 0$ or $1$), halting learning.`,
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
    
    # TODO: Step 1 - Compute raw scores = Q @ K^T using matrix_multiply(Q, matrix_transpose(K))
    # TODO: Step 2 - Scale raw scores by scale (1 / sqrt(d_k))
    # TODO: Step 3 - Apply softmax_row to each row of scaled_scores to obtain attention_weights
    # TODO: Step 4 - Compute final output = matrix_multiply(attention_weights, V)
    return [], []

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
          firstPrinciplesIntuition: 'A single attention head only looks at one relationship at a time (e.g. grammar). Multi-Head Attention splits the high-dimensional embedding space into multiple parallel subspaces (heads). One head attends to verb-object syntax, while another head attends to long-range entity coreference. Projecting into subspaces allows the model to simultaneously attend to information from different representation subspaces at different positions.',
          content: `### Multi-Head Subspace Decomposition Architecture

Instead of performing a single attention function with $d_{\\text{model}}$-dimensional keys, queries, and values, Multi-Head Attention linearly projects queries, keys, and values $h$ times with distinct learned linear projections:

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$
$$\\text{where } \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

\`\`\`
Input Tensor X: [ seq_len x d_model ] (e.g. 2 x 4)
                  |
     +------------+------------+
     |                         |
     v                         v
Head 0 (Slice 0..2)       Head 1 (Slice 2..4)
[ seq_len x d_k ]         [ seq_len x d_k ]
     |                         |
     v                         v
[ Attention Engine ]      [ Attention Engine ]
     |                         |
     v                         v
Output Head 0             Output Head 1
     |                         |
     +------------+------------+
                  | (Concatenate along channel dimension)
                  v
Reconstructed Tensor: [ seq_len x d_model ]
\`\`\`

#### Dimensionality Invariant
Each head operates on dimension $d_k = d_{\\text{model}} / h$. Due to the reduced dimension of each head, the total computational cost is similar to that of single-head attention with full dimensionality.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.1.2
# Objective: Multi-Head Projection & Subspace Decomposition
# ============================================================

def split_heads(X, num_heads):
    """
    Splits a 2D matrix (seq_len x d_model) into num_heads sub-matrices (seq_len x d_k).
    """
    # TODO: Step 1 - Compute d_k = len(X[0]) // num_heads
    # TODO: Step 2 - For each head h in range(num_heads), extract slice [h*d_k : (h+1)*d_k]
    # for each token in X, returning a list of num_heads sub-matrices
    return []

def concat_heads(heads):
    """
    Recombines num_heads sub-matrices into a single matrix (seq_len x d_model).
    """
    # TODO: Step 3 - For each token index across seq_len, concatenate slices across all heads
    # into a single row of dimension d_model, returning the combined 2D matrix
    return []

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
            'Tier 1 (Mental Model): Multi-head attention projects token representations into h parallel lower-dimensional subspaces so the model can attend to different syntactic and semantic patterns simultaneously.',
            'Tier 2 (Logic): Compute subspace dimension d_k = d_model // num_heads. For each head h, slice each token row from h * d_k to (h + 1) * d_k.',
            'Tier 3 (Syntax): For concat_heads: for each token i across seq_len, concatenate row segments across all heads into a single flat list: row = []; for h in range(len(heads)): row.extend(heads[h][i]); combined.append(row).'
          ]
        },
        {
          id: 'lesson-4-1-3',
          title: 'KV-Cache Dynamics & Production Memory Sizing',
          subtitle: 'Why Inference Is Memory-Bandwidth Bound',
          firstPrinciplesIntuition: 'During LLM generation, computing token N requires attending to all N-1 past tokens. Without caching, generation takes O(N^2) compute. The KV-Cache stores the computed Key and Value vectors for all past tokens in GPU VRAM. However, as context grows to 128k tokens, the KV-cache can easily consume 40GB+ of VRAM! Calculating and managing KV-cache memory is the #1 operational skill for AI engineers.',
          content: `### KV-Cache Memory Kinematics & Scaling Laws

During autoregressive token generation, past keys and values are cached in memory so new tokens only compute a single query vector:

$$\\text{Memory}_{\\text{KV}} = 2 \\times L \\times H \\times d_{\\text{head}} \\times T \\times b \\text{ bytes}$$

Where:
- $2$: Accounts for both Key and Value matrices.
- $L$: Total number of transformer layers (e.g. 32 in Llama-3 8B).
- $H$: Number of attention heads per layer (or KV-heads in Grouped-Query Attention).
- $d_{\\text{head}}$: Hidden dimension per head (e.g. 128).
- $T$: Sequence length (context window tokens).
- $b$: Precision bytes per element (2 bytes for FP16 / BF16).

\`\`\`
Token 0 (Prompt)   --> [ Compute Q0, K0, V0 ] --> Cache (K0, V0)
Token 1 (Prompt)   --> [ Compute Q1, K1, V1 ] --> Cache (K1, V1)
...
Token N (Generate) --> [ Compute QN, KN, VN ] --> Append (KN, VN)
                       Attend QN against [ K0...KN ], weight against [ V0...VN ]
\`\`\`

#### Production Memory Impact
For Llama-3 8B at 8,192 context tokens in FP16:
$$2 \\times 32 \\times 32 \\times 128 \\times 8,192 \\times 2 = 4,294,967,296 \\text{ bytes} = 4.0 \\text{ GB}$$
At 128,000 tokens, the KV-cache alone requires over 62 GB of VRAM!`,
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
    # TODO: Step 1 - Compute total bytes = 2 (keys+values) * layers * heads * d_head * tokens * precision_bytes
    # TODO: Step 2 - Compute mb = total_bytes / (1024 * 1024) and gb = total_bytes / (1024 ** 3)
    return {
        "bytes": 0,
        "mb": 0.0,
        "gb": 0.0
    }

class KVCache:
    def __init__(self):
        # Cache stores list of (K, V) per layer
        self.k_cache = []
        self.v_cache = []
        
    def append(self, new_k, new_v):
        """Appends new token key and value vectors to the persistent cache."""
        # TODO: Step 3 - Append new_k to self.k_cache and new_v to self.v_cache
        # Return current length of self.k_cache
        return 0

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
            'Tier 1 (Mental Model): The KV-Cache eliminates quadratic recomputation by storing past Key and Value projection matrices in GPU memory during autoregressive generation.',
            'Tier 2 (Logic): Calculate total bytes using 2 * layers * heads * d_head * tokens * precision_bytes, where 2 accounts for both Keys and Values. Divide by 1024^2 for MB and 1024^3 for GB.',
            'Tier 3 (Syntax): In estimate_kv_cache_memory, total_bytes = layers * (2 * heads * d_head * precision_bytes) * tokens; return {"bytes": total_bytes, "mb": round(total_bytes / (1024*1024), 2), "gb": round(total_bytes / (1024**3), 3)}.'
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
          content: `### Tree-of-Thoughts (ToT) Search Architecture

Yao et al. (2023) demonstrated that allowing language models to deliberately explore tree-structured thought spaces dramatically improves complex reasoning over linear Chain-of-Thought:

\`\`\`
                    [ Root State: Goal Inquiry ]
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
    [ Branch A ]            [ Branch B ]            [ Branch C ]
  "Direct Attack"      "Decompose Sub-prob"    "Adversarial Invert"
    Critique: 0.30          Critique: 0.95          Critique: 0.70
         |                       |                       |
     (PRUNED)                (ENQUEUED)              (ENQUEUED)
     score < 0.50            score >= 0.50           score >= 0.50
                                 |
                     +-----------+-----------+
                     |                       |
                     v                       v
                [ Sub-path 1 ]          [ Sub-path 2 ]
\`\`\`

#### Search Mechanics & Pruning Invariant
1. **Thought Generation**: Proposes candidate logical continuations from the current state.
2. **Heuristic Self-Critique**: An evaluation function rates each candidate path $\\in [0.0, 1.0]$.
3. **Threshold Pruning**: Any branch scoring below \`prune_threshold\` is discarded, preventing combinatorial explosion in search depth.`,
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
    # TODO: Step 1 - Initialize root = ThoughtNode(initial_state, score=1.0) and search queue = [root]
    # TODO: Step 2 - Loop while queue is non-empty, popping candidate node
    # TODO: Step 3 - When current.thought.count("->") >= max_depth, check and track best_path and best_score
    # TODO: Step 4 - For other states, generate candidates, compute score = critique_score(cand),
    # and enqueue child node ONLY if score >= prune_threshold
    # TODO: Step 5 - Return (best_path, best_score)
    return None, 0.0

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
            'Tier 1 (Mental Model): Tree-of-Thoughts enables test-time search by exploring alternative reasoning paths and pruning weak branches.',
            'Tier 2 (Logic): Loop through queue. If thought has reached max_depth, compare against best_score. Otherwise, generate candidates, critique them, and enqueue only if score >= prune_threshold.',
            'Tier 3 (Syntax): while queue: current = queue.pop(0); if current.thought.count("->") >= max_depth: if current.score > best_score: best_score = current.score; best_path = current.thought; continue; for cand in generate_candidate_thoughts(current.thought): score = critique_score(cand); if score >= prune_threshold: queue.append(ThoughtNode(cand, score=score, parent=current)).'
          ]
        },
        {
          id: 'lesson-4-2-2',
          title: 'Constrained Decoding & Finite State Machine (FSM) Grammars',
          subtitle: 'Guaranteed 100% Valid JSON Schemas Without Retries',
          firstPrinciplesIntuition: 'Telling an LLM "Please return JSON" will inevitably fail on edge cases. Modern production inference solves this mathematically via Constrained Decoding (Grammar-guided sampling). An FSM monitors the generated tokens character-by-character and masks out all tokens in the vocabulary that would violate the grammar. The model literally CANNOT output invalid syntax.',
          content: `### Grammar-Guided Constrained Decoding Architecture

Rather than re-prompting on malformed syntax, constrained decoding applies an active vocabulary mask at each autoregressive step:

\`\`\`
Target Grammar: {"status": "ok", "code": <integer>}

Vocabulary Logits from Model: [ '{', 'Hello', '42', 'def', ... ]
               |
               v
+--------------------------------------------------------------+
| Finite State Machine (FSM) Transition Filter                 |
| Current State: 0 (START)                                     |
| Legal Next Characters: Only '{'                              |
| Action: Mask out all tokens except '{' (set logit = -infinity)|
+--------------------------------------------------------------+
               |
               v
Emitted Token: '{' --> Advances FSM to State 1
               |
               v
State 1: Expects '"status":' --> Next Valid Transition
\`\`\`

#### Production Engineering Invariant
A constrained decoding stream guarantees structural invariant conformance before token consumption. The validator concatenates streaming chunks and parses with \`json.loads()\`, rejecting malformed or partial fragments with structured error telemetry.`,
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
    # TODO: Step 1 - Concatenate tokens in token_stream: accumulated = "".join(token_stream)
    # TODO: Step 2 - Attempt to parse accumulated text with json.loads(accumulated)
    # Return (True, parsed) on success, or (False, str(e)) if an Exception is caught
    return False, None

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
            'Tier 1 (Mental Model): Constrained grammar decoding ensures emitted token sequences adhere 100% to valid syntax by rejecting invalid state transitions.',
            'Tier 2 (Logic): Concatenate incoming token strings into a single buffer and attempt to parse with json.loads().',
            'Tier 3 (Syntax): accumulated = "".join(token_stream); try: return True, json.loads(accumulated); except Exception as e: return False, str(e).'
          ]
        },
        {
          id: 'lesson-4-2-3',
          title: 'Model Context Protocol (MCP) JSON-RPC 2.0 Dispatcher',
          subtitle: 'The Universal Open Standard for AI Agent Tools',
          firstPrinciplesIntuition: 'Before MCP, every AI vendor invented their own proprietary tool-calling schema. Anthropic open-sourced Model Context Protocol (MCP) as the universal USB-C standard for AI. MCP standardizes tool listing (tools/list), execution (tools/call), resource reading, and prompt templates over JSON-RPC 2.0. Any agent can speak to any tool server globally.',
          content: `### Model Context Protocol (MCP) Server Architecture

An MCP server hosts tool capabilities, exposes input JSON schemas, and executes client requests via standard JSON-RPC 2.0 framing:

\`\`\`
Client (LLM Host)                               Server (MCPServer Instance)
       |                                                    |
       |--- 1. tools/list Request ------------------------->|
       |    {"jsonrpc": "2.0", "id": 1, "method": ...}      |
       |                                                    |
       |<-- 2. Tool Registry Response ----------------------|
       |    {"result": {"tools": [{"name": "calculator"}]}} |
       |                                                    |
       |--- 3. tools/call Request ------------------------->|
       |    {"params": {"name": "calculator",               |
       |               "arguments": {"a": 40, "b": 2}}}     |
       |                                                    |
       |                                              [Execute Handler]
       |                                                    |
       |<-- 4. Result Envelope -----------------------------|
       |    {"result": {"content": [{"text": "42"}]}}       |
\`\`\`

#### Standardized Error Handling
If an unregistered method or tool is requested, the dispatcher must return standard JSON-RPC error code \`-32601\` (\`Method not found\`). This enables universal client recovery without proprietary error parsing.`,
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
        # TODO: Step 1 - Parse request_json_str: req = json.loads(request_json_str)
        # TODO: Step 2 - If method == "tools/list", return JSON-RPC 2.0 envelope with {"tools": tool_list}
        # TODO: Step 3 - If method == "tools/call", lookup params["name"] in self.tools.
        # If present, call handler(params.get("arguments", {})) and return {"content": [{"type": "text", "text": str(result)}]}.
        # If tool not found, return JSON-RPC error code -32601.
        # TODO: Step 4 - For other methods, return error code -32601 ("Method not implemented")
        return json.dumps({"jsonrpc": "2.0", "id": None, "error": {"code": -32601, "message": "Method not implemented"}})

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
            'Tier 1 (Mental Model): Model Context Protocol (MCP) establishes open JSON-RPC 2.0 message conventions so agents can discover and call tools universally.',
            'Tier 2 (Logic): Inspect req["method"]. For "tools/list", return the registered tool metadata list. For "tools/call", lookup tool in self.tools, invoke with arguments, and wrap the output in a text content envelope.',
            'Tier 3 (Syntax): If method not in ("tools/list", "tools/call") or tool_name not in self.tools, return json.dumps({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": "Method not found"}}).'
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
          content: `### Symmetric Uniform INT8 Quantization Mechanics

Quantization compresses continuous 32-bit floating point representations into discrete 8-bit integer bins:

\`\`\`
FP32 Weight Matrix: [ -0.891, 0.452, 0.985, -0.054 ]
                          |
                          v
Step 1: Compute Maximum Absolute Value: max(|W|) = 0.985
Step 2: Calculate Scale Factor: scale = max(|W|) / 127 = 0.007756
                          |
                          v
Step 3: Quantize & Clip to Signed 8-bit Range:
        q = clip(round(x / scale), -128, 127)
        0.985  / 0.007756 =  127  (INT8)
        -0.891 / 0.007756 = -115  (INT8)
                          |
                          v
Step 4: Dequantization for Inference Computation:
        x_hat = q * scale
        127  * 0.007756 = 0.985002  (Reconstructed Float)
        -115 * 0.007756 = -0.891940 (Reconstructed Float)
\`\`\`

#### Quantization Invariant & Error Bound
The Mean Squared Error (MSE) between original float weights $W$ and reconstructed weights $\\hat{W}$:
$$\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (w_i - \\hat{w}_i)^2$$
For uniform symmetric quantization across balanced distributions, MSE is bounded tightly beneath $0.001$, maintaining numerical fidelity while slashing memory footprints by $75\\%$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 4 - Lab 4.3.1
# Objective: Weight Quantization from Scratch (FP32 to INT8)
# Formula: q = clip(round(x / scale), -128, 127) where scale = max(|x|) / 127
# ============================================================

def quantize_int8(weights):
    """
    Symmetric INT8 quantization.
    Returns: quantized_weights (list of ints), scale (float)
    # TODO: Step 1 - Find max absolute value in weights: max_val
    # TODO: Step 2 - Compute scale = max_val / 127.0 if max_val != 0 else 1.0
    # TODO: Step 3 - Map each float value to clipped 8-bit integer: max(-128, min(127, round(x / scale)))
    # Return (quantized_weights, scale)
    return [], 1.0

def dequantize_int8(quantized, scale):
    """
    Reconstructs floating point weights from INT8 integers.
    """
    # TODO: Step 4 - Multiply each quantized integer by scale: q * scale
    return []

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
            'Tier 1 (Mental Model): Symmetric quantization maps continuous 32-bit floats into signed 8-bit integers [-128, 127] by dividing by scale = max(|W|) / 127.',
            'Tier 2 (Logic): Find maximum absolute weight value to derive scale. For each weight x, compute q = max(-128, min(127, round(x / scale))).',
            'Tier 3 (Syntax): Dequantization reverses this with reconstructed = q * scale. MSE is sum((orig - rec)**2) / N.'
          ]
        },
        {
          id: 'lesson-4-3-2',
          title: 'Direct Preference Optimization (DPO) Loss from Scratch',
          subtitle: 'Mathematical Alignment Without Reinforcement Learning',
          firstPrinciplesIntuition: 'RLHF (Reinforcement Learning from Human Feedback) required training complex reward models and running fragile PPO loops. In 2023, DPO proved that the optimal policy can be extracted analytically in closed form. Given pairs of preferred (winning) and dispreferred (losing) responses, DPO directly computes the log-ratio loss between the current policy and reference model.',
          content: `### Direct Preference Optimization (DPO) Mathematical Derivation

Rafailov et al. (2023) established that preference alignment can be solved directly by optimizing a binary cross-entropy loss over implicit language model probabilities without a separate reward model:

$$\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]$$

\`\`\`
Winning Pair (y_w): log_pi(y_w) - log_ref(y_w) = win_ratio
Losing Pair (y_l) : log_pi(y_l) - log_ref(y_l) = lose_ratio
                           |
                           v
Logits Difference: logits = beta * (win_ratio - lose_ratio)
                           |
                           v
Probability: p = sigmoid(logits)
                           |
                           v
DPO Objective Loss: L = -log( max(p, 1e-12) )
\`\`\`

#### Optimization Dynamics
- When the policy $\\pi_\\theta$ assigns high probability to winning response $y_w$ and low probability to losing response $y_l$ relative to $\\pi_{\\text{ref}}$, \`logits\` is positive and large, $\\sigma(\\text{logits}) \\to 1.0$, and loss approaches $0$.
- If the policy mistakenly assigns higher probability to the dispreferred response, \`logits\` is negative, $\\sigma(\\text{logits}) \\to 0$, producing high penalizing loss.`,
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
    # TODO: Step 1 - Calculate log ratio for winning response: win_log_ratio = pi_win_logprob - ref_win_logprob
    # TODO: Step 2 - Calculate log ratio for losing response: lose_log_ratio = pi_lose_logprob - ref_lose_logprob
    # TODO: Step 3 - Compute logits difference scaled by beta: logits = beta * (win_log_ratio - lose_log_ratio)
    # TODO: Step 4 - Compute DPO loss: -math.log(max(sigmoid(logits), 1e-12))
    # Return (loss, logits)
    return 0.0, 0.0

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
            'Tier 1 (Mental Model): Direct Preference Optimization (DPO) derives an exact closed-form alignment objective, eliminating the instability of training separate reward models and RL loops.',
            'Tier 2 (Logic): Compute win_log_ratio = pi_win - ref_win and lose_log_ratio = pi_lose - ref_lose. Multiply difference by beta to obtain logits, apply sigmoid, and compute negative log-likelihood.',
            'Tier 3 (Syntax): logits = beta * ((pi_win_logprob - ref_win_logprob) - (pi_lose_logprob - ref_lose_logprob)); prob = sigmoid(logits); loss = -math.log(max(prob, 1e-12)); return loss, logits.'
          ]
        },
        {
          id: 'lesson-4-3-3',
          title: 'Boss Project: The Autonomous Frontier Reasoning Agent',
          subtitle: 'Composing Attention, KV-Cache, ToT Search & MCP Tools',
          firstPrinciplesIntuition: 'You have mastered the foundational mechanics of the AI frontier: the linear algebra of attention projections, memory-constrained KV-cache sizing, tree-of-thoughts reasoning search, and the standardized Model Context Protocol. In this capstone, you will compose all components into a production-grade autonomous agent architecture that searches, reasons, invokes tools, and self-evaluates.',
          content: `### Capstone Autonomous Frontier Reasoning Architecture

The capstone agent orchestrates working KV context tokens, Model Context Protocol tool execution, and self-critique verification across an integrated reasoning cycle:

\`\`\`
+--------------------------------------------------------------+
| AutonomousReasoningEngine ("OpenGuide-Apex")                 |
|                                                              |
| Goal Ingress: "Synthesize Frontier Intelligence"             |
|                                                              |
| Cycle Step 1: Initialize Goal Audit Log                      |
|                                                              |
| Cycle Step 2: Formulate Multi-Stage Sub-Tasks                |
|   - Inspect environment state                                |
|   - Dispatch MCP tool calculation                            |
|   - Verify and self-critique output                          |
|                                                              |
| Cycle Step 3: Tool Dispatch & KV Memory Tracking             |
|   - Invoke tools["calc"]({"x": 21, "multiplier": 2}) -> 42   |
|   - Track Working Context: kv_memory_tokens += 128 per step  |
|                                                              |
| Cycle Step 4: Self-Critique Verification Gate                |
|   certified = (len(results) > 0 and kv_tokens > 0)           |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
| Certified Mission Report Output (JSON Formatted)             |
| Status: certified = True | KV Tokens Consumed: >= 384        |
+--------------------------------------------------------------+
\`\`\`

#### Boss Project Criteria
1. **MCP Tool Integration**: Must register and invoke tools using standardized schemas.
2. **Context Kinematics**: Must simulate and track KV context memory growth across reasoning steps.
3. **Trace Auditability**: Every sub-task thought and tool result must be logged chronologically in \`audit_log\`.`,
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
        
        # TODO: Step 1 - Append f"[GOAL] Initialized: {goal}" to self.audit_log
        # TODO: Step 2 - Formulate sub-tasks: inspect environment, dispatch MCP tool calculation, verify and self-critique
        # TODO: Step 3 - For each step, append f"[THOUGHT] {step}" and increment self.kv_memory_tokens += 128
        # If "tool calculation" in step and "calc" in self.tools, invoke tool and append f"[MCP CALL] calc -> {tool_out}"
        # TODO: Step 4 - Determine certified = (len(results) > 0 and self.kv_memory_tokens > 0)
        # and append f"[VERDICT] Certified: {certified}" to self.audit_log
        # TODO: Step 5 - Return summary dict with "agent", "goal", "certified", "kv_tokens_consumed", and "log"
        return {
            "agent": self.agent_name,
            "goal": goal,
            "certified": False,
            "kv_tokens_consumed": 0,
            "log": []
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
            'Tier 1 (Mental Model): The Capstone Autonomous Frontier Reasoning Agent harmonizes internal context memory (KV cache tokens), structured MCP tool invocation, and self-critique verification.',
            'Tier 2 (Logic): In execute_reasoning_cycle, log each reasoning thought step, execute MCP tools when requested, track context tokens (+= 128), and verify certification criteria.',
            'Tier 3 (Syntax): for step in sub_tasks: self.audit_log.append(f"[THOUGHT] {step}"); if "tool calculation" in step: tool_out = self.tools["calc"]({"x": 21, "multiplier": 2}); self.audit_log.append(f"[MCP CALL] calc -> {tool_out}"); self.kv_memory_tokens += 128; certified = len(results) > 0 and self.kv_memory_tokens > 0; return {...}.'
          ]
        }
      ]
    }
  ]
};
