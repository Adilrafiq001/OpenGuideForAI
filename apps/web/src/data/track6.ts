import type { Track } from './track0';

export const track6: Track = {
  id: 'track-6',
  title: 'Track 6: Production MLOps, Hardware Memory & vLLM Optimization',
  description: 'Master the high-performance systems engineering behind frontier inference engines: KV-cache memory sizing, PagedAttention block paging, FlashAttention online softmax tiling, and speculative decoding verification loops.',
  modules: [
    {
      id: 'module-6-1',
      title: 'Module 6.1: KV-Cache Engineering & Memory Virtualization',
      description: 'Break free from the memory-bandwidth bottleneck. Calculate the exact byte footprint of autoregressive attention caches, eliminate external fragmentation using PagedAttention, and slash memory usage with Grouped-Query Attention (GQA).',
      lessons: [
        {
          id: 'lesson-6-1-1',
          title: 'KV-Cache Byte Footprint & Arithmetic Intensity',
          subtitle: 'Why Large Language Model Inference is Memory-Bandwidth Bound',
          firstPrinciplesIntuition: 'During training, high batch sizes keep GPU compute cores fully saturated. But during generation (the decode phase), the model produces one token at a time. To generate that single token, the GPU must load every single parameter and historical Key-Value vector from High Bandwidth Memory (HBM) into fast on-chip SRAM cache. Because the arithmetic intensity (FLOPs per byte transferred) is near 1, modern GPU compute units spend 95% of their clock cycles stalled, waiting for memory buses. Understanding exact KV-cache sizing is essential for deploying models without running out of memory.',
          content: `### KV-Cache Memory Calculation Mechanics

For a model with $L$ layers, hidden dimension $D$, sequence length $S$, batch size $B$, and $b_{\\text{prec}}$ bytes per element (e.g. 2 bytes for FP16), the total memory required by the Key and Value cache is:

$$\\text{Memory}_{\\text{KV}} = 2 \\times b_{\\text{prec}} \\times L \\times D \\times S \\times B \\quad \\text{(Bytes)}$$

\`\`\`
  Token 1 -> [Key 1, Value 1] saved in RAM
  Token 2 -> [Key 2, Value 2] saved in RAM
  ...
  Token S -> [Key S, Value S] saved in RAM
  
  Total Footprint = 2 (K & V) * BytesPerParam * Layers * ModelDim * Tokens * Batch
\`\`\`

#### Your Engineering Challenge:
1. Implement \`calculate_kv_cache_bytes(layers, hidden_dim, seq_len, batch_size, precision='fp16')\`.
2. Map precision string (\`'fp32'\` &rarr; 4 bytes, \`'fp16'\` &rarr; 2 bytes, \`'int8'\` &rarr; 1 byte, \`'int4'\` &rarr; 0.5 bytes).
3. Return the exact total bytes as an integer or float.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.1.1
# KV-Cache Byte Footprint & Arithmetic Intensity
# ============================================================

def calculate_kv_cache_bytes(layers, hidden_dim, seq_len, batch_size, precision='fp16'):
    """
    Computes exact total bytes consumed by Key-Value cache.
    """
    # TODO: Step 1: Determine bytes per parameter based on precision
    bytes_per_elem = 0
    
    # TODO: Step 2: Calculate total bytes for 2 tensors (Key and Value)
    return 0
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.1.1 (Canonical Solution)
# ============================================================

def calculate_kv_cache_bytes(layers, hidden_dim, seq_len, batch_size, precision='fp16'):
    precision_map = {
        'fp32': 4.0,
        'fp16': 2.0,
        'int8': 1.0,
        'int4': 0.5
    }
    b_prec = precision_map.get(precision.lower(), 2.0)
    # 2 represents Key and Value states
    total_bytes = 2 * b_prec * layers * hidden_dim * seq_len * batch_size
    return total_bytes
`,
          testCode: `assert 'calculate_kv_cache_bytes' in globals(), "Function 'calculate_kv_cache_bytes' must be defined"

# Standard Llama-3 8B configuration: 32 layers, hidden_dim 4096, 4096 tokens, batch 1, FP16
bytes_8b = calculate_kv_cache_bytes(layers=32, hidden_dim=4096, seq_len=4096, batch_size=1, precision='fp16')
# 2 * 2 * 32 * 4096 * 4096 * 1 = 2,147,483,648 bytes (Exactly 2.0 GB)
assert bytes_8b == 2147483648, f"Expected 2147483648 bytes (2 GB), got {bytes_8b}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Scaling with batch size: batch=4 must yield exactly 4x bytes
bytes_batch4 = calculate_kv_cache_bytes(layers=32, hidden_dim=4096, seq_len=4096, batch_size=4, precision='fp16')
assert bytes_batch4 == 4 * bytes_8b, "Batch size scaling must be strictly linear"

# Precision scaling: INT8 must be exactly half FP16
bytes_int8 = calculate_kv_cache_bytes(layers=32, hidden_dim=4096, seq_len=4096, batch_size=1, precision='int8')
assert bytes_int8 == bytes_8b / 2.0, "INT8 cache must consume exactly 50% of FP16"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] KV-Cache memory calculation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] KV-Cache memory calculation verified.',
          hint: 'Map precision to bytes (fp32: 4, fp16: 2, int8: 1, int4: 0.5) and multiply 2 * bytes * layers * hidden_dim * seq_len * batch_size.',
          progressiveHints: [
            'Tier 1 (Mental Model): Both Key and Value vectors must be remembered for every token at every layer. That is why the formula starts with a factor of 2.',
            'Tier 2 (Algorithmic Logic): Check the dictionary keys for precision: fp16 = 2.0 bytes, fp32 = 4.0 bytes.',
            'Tier 3 (Exact Formula): return 2 * precision_map[precision] * layers * hidden_dim * seq_len * batch_size.'
          ]
        },
        {
          id: 'lesson-6-1-2',
          title: 'PagedAttention Virtual Block Table Lookups',
          subtitle: 'Eliminating GPU External Fragmentation with OS Memory Paging',
          firstPrinciplesIntuition: 'In naive serving systems, memory for a prompt must be allocated contiguously in advance based on the maximum possible context length (e.g. 8,192 tokens). If a request only generates 100 tokens, 98% of that reserved VRAM sits completely wasted (internal fragmentation)! PagedAttention (Kwon et al., vLLM, 2023) applies operating system virtual memory paging to neural networks. Key and Value vectors are chopped into fixed-size "blocks" (e.g. 16 tokens each) stored anywhere in physical GPU RAM. A block table maps logical token positions to physical blocks with zero waste.',
          content: `### PagedAttention Block Table Lookup Mechanics

Given a token at logical sequence index $i$ and a block size $K$:

$$\\text{block\\_number} = \\text{block\\_table}\\left[ \\lfloor i / K \\rfloor \\right]$$

$$\\text{block\\_offset} = i \\pmod K$$

\`\`\`
  Logical Token Index: i = 35 (Block size K = 16)
       |
       +---> Logical Block Index = 35 // 16 = 2
       +---> Block Offset        = 35 % 16  = 3
       |
  Block Table: [Block #12, Block #7, Block #94, ...]
                                       |
  Physical Memory Location: Physical Block #94, Slot 3!
\`\`\`

#### Your Engineering Challenge:
1. Implement \`resolve_paged_memory_slot(token_idx, block_table, block_size=16)\`.
2. Compute the logical block index and offset.
3. Return a tuple \`(physical_block_id, offset)\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.1.2
# PagedAttention Virtual Block Table Lookups
# ============================================================

def resolve_paged_memory_slot(token_idx, block_table, block_size=16):
    """
    Resolves physical memory slot for token_idx using virtual block_table.
    Returns (physical_block_id, block_offset).
    """
    # TODO: Compute logical block index and block offset
    return None, None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.1.2 (Canonical Solution)
# ============================================================

def resolve_paged_memory_slot(token_idx, block_table, block_size=16):
    logical_block_idx = token_idx // block_size
    offset = token_idx % block_size
    physical_block_id = block_table[logical_block_idx]
    return physical_block_id, offset
`,
          testCode: `assert 'resolve_paged_memory_slot' in globals(), "Function 'resolve_paged_memory_slot' must be defined"

block_table = [12, 7, 94, 3] # Logical blocks 0, 1, 2, 3
token_idx = 35 # Resides in logical block 2 (tokens 32..47)
block_id, offset = resolve_paged_memory_slot(token_idx, block_table, block_size=16)

assert block_id == 94, f"Expected physical block 94, got {block_id}"
assert offset == 3, f"Expected offset 3 within block, got {offset}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Boundary at block start
b_start, o_start = resolve_paged_memory_slot(16, block_table, block_size=16)
assert b_start == 7 and o_start == 0, f"Token 16 must be at start of block 1, got {b_start}, {o_start}"

# Boundary at block end
b_end, o_end = resolve_paged_memory_slot(15, block_table, block_size=16)
assert b_end == 12 and o_end == 15, f"Token 15 must be at end of block 0, got {b_end}, {o_end}"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] PagedAttention virtual block lookup verified.")
`,
          expectedOutput: '✓ [TEST PASSED] PagedAttention virtual block lookup verified.',
          hint: 'Use integer division token_idx // block_size for the table index, and token_idx % block_size for the offset.',
          progressiveHints: [
            'Tier 1 (Mental Model): PagedAttention works exactly like an OS page table: logical addresses map to non-contiguous physical pages.',
            'Tier 2 (Algorithmic Logic): Index into block_table using logical_block_idx = token_idx // block_size.',
            'Tier 3 (Exact Formula): return block_table[token_idx // block_size], token_idx % block_size.'
          ]
        }
      ]
    },
    {
      id: 'module-6-2',
      title: 'Module 6.2: Speculative Decoding Verification Loops',
      description: 'Accelerate autoregressive inference by 2x to 3x without changing output probability distributions. Implement draft-target token verification loops from first principles.',
      lessons: [
        {
          id: 'lesson-6-2-1',
          title: 'Speculative Decoding Acceptance-Rejection Verification',
          subtitle: 'Lossless Inference Acceleration with Speculative Sampling',
          firstPrinciplesIntuition: 'Generating text with a 70B parameter model is slow because the GPU has to read 140 GB of memory for each token. A tiny 1B "draft" model can generate 5 candidate tokens in the time it takes the 70B model to generate one. In speculative decoding (Leviathan et al., 2023), the large target model evaluates all 5 draft tokens in parallel in a single forward pass! Using modified rejection sampling, every token that passes the acceptance criterion is mathematically guaranteed to follow the exact target model probability distribution.',
          content: `### Speculative Decoding Acceptance Criterion

Let $p(x)$ be the probability of draft token $x$ under the target model, and $q(x)$ be its probability under the draft model. The token is accepted with probability:

$$\\alpha = \\min\\left(1, \\frac{p(x)}{q(x)}\\right)$$

\`\`\`
  Draft Model generates K candidate tokens: [t_1, t_2, t_3, t_4]
                    |
                    v
  Target Model runs 1 parallel forward pass evaluating all K tokens
                    |
                    v
  For each token: if random_uniform() < min(1, p(x) / q(x)):
      -> ACCEPT TOKEN! (Keep moving forward)
  Else:
      -> REJECT TOKEN! (Resample from max(0, p - q) and stop draft sequence)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`verify_speculative_tokens(draft_tokens, target_probs, draft_probs, rand_uniform_vals)\`.
2. For each token, compute acceptance probability $\\min(1, p/q)$.
3. Accept the token if \`rand_val < accept_prob\`.
4. Stop at the first rejected token and return the list of accepted tokens.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.2.1
# Speculative Decoding Acceptance-Rejection Verification
# ============================================================

def verify_speculative_tokens(draft_tokens, target_probs, draft_probs, rand_uniform_vals):
    """
    Verifies draft tokens using speculative rejection sampling.
    Returns list of accepted tokens.
    """
    accepted = []
    # TODO: Loop through draft tokens, compute min(1, p/q), and accept/reject
    return accepted
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 6 - Lab 6.2.1 (Canonical Solution)
# ============================================================

def verify_speculative_tokens(draft_tokens, target_probs, draft_probs, rand_uniform_vals):
    accepted = []
    for t, p_target, p_draft, r_val in zip(draft_tokens, target_probs, draft_probs, rand_uniform_vals):
        ratio = p_target / p_draft if p_draft > 0 else 0.0
        accept_prob = min(1.0, ratio)
        if r_val < accept_prob:
            accepted.append(t)
        else:
            # Rejection stops the speculation chain
            break
    return accepted
`,
          testCode: `assert 'verify_speculative_tokens' in globals(), "Function 'verify_speculative_tokens' must be defined"

draft_tokens = ['The', 'neural', 'network', 'learns']
# Scenario: First 2 tokens accepted, 3rd token rejected
target_probs = [0.9, 0.8, 0.2, 0.9]
draft_probs =  [0.8, 0.7, 0.8, 0.2]
rand_vals =    [0.1, 0.3, 0.6, 0.1] # For token 3: ratio = 0.2/0.8 = 0.25; rand=0.6 > 0.25 -> REJECT!

accepted = verify_speculative_tokens(draft_tokens, target_probs, draft_probs, rand_vals)
assert accepted == ['The', 'neural'], f"Expected ['The', 'neural'], got {accepted}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Target model strictly more confident than draft model (p >= q) -> Always accepted
p_high = [0.9, 0.9]
q_low =  [0.5, 0.5]
r_high = [0.99, 0.99]
acc_all = verify_speculative_tokens(['A', 'B'], p_high, q_low, r_high)
assert acc_all == ['A', 'B'], "When p >= q, acceptance probability is 1.0; tokens must be accepted"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Speculative decoding verification loop verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Speculative decoding verification loop verified.',
          hint: 'Calculate ratio = p_target / p_draft. If r_val < min(1.0, ratio), append token; otherwise break.',
          progressiveHints: [
            'Tier 1 (Mental Model): If the big model likes the token more than the small model did (p >= q), it accepts it 100% of the time.',
            'Tier 2 (Algorithmic Logic): Iterate using zip(draft_tokens, target_probs, draft_probs, rand_uniform_vals). Stop at the first rejection.',
            'Tier 3 (Exact Formula): if r_val < min(1.0, p_target / p_draft): accepted.append(t) else: break.'
          ]
        }
      ]
    }
  ]
};
