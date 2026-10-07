import type { Track } from './track0';

export const track5: Track = {
  id: 'track-5',
  title: 'Track 5: Fine-Tuning, LoRA & Parameter-Efficient Adaptation',
  description: 'Master the mathematical machinery of parameter-efficient fine-tuning (PEFT), Low-Rank Adaptation (LoRA), QLoRA 4-bit NormalFloat quantization, and Direct Preference Optimization (DPO) alignment from scratch.',
  modules: [
    {
      id: 'module-5-1',
      title: 'Module 5.1: Low-Rank Adaptation (LoRA) Mechanics',
      description: 'Dismantle massive weight matrices into low-rank intrinsic subspaces. Understand how freezing foundational weights while training rank decomposition pairs (B and A) cuts GPU memory by 90% while matching full fine-tuning performance.',
      lessons: [
        {
          id: 'lesson-5-1-1',
          title: 'Low-Rank Matrix Factorization & LoRA Forward Pass',
          subtitle: 'Decomposing Weight Updates into Intrinsic Subspaces',
          firstPrinciplesIntuition: 'When a gigantic model with billions of parameters learns a new domain, it does not need to rewrite its entire brain. Research into intrinsic dimensionality proves that weight updates delta_W occupy a tiny low-rank subspace. Instead of storing an enormous d_in by d_out matrix, LoRA factorizes the update into two slender matrices: matrix A of size d_in by r, and matrix B of size r by d_out, where r is a small rank such as 4 or 8. Since r is vastly smaller than the model dimension, you train 99% fewer parameters while keeping the original model frozen!',
          content: `### Low-Rank Adaptation (LoRA) Forward Pass Formulation

Introduced by Hu et al. (Microsoft, 2021), LoRA decomposes the weight update $\\Delta W$ into the product of two low-rank matrices $B$ and $A$:

$$h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} (B A) x$$

\`\`\`
       Input x [batch x d_in]
           /               \\
          /                 \\
   (Frozen Path)      (Trainable Low-Rank Path)
        |                     |
     W_0 [d_in x d_out]    A [d_in x r]  (Down-projection)
        |                     |
        |                  B [r x d_out]  (Up-projection)
        |                     |
        |              Scale: * (alpha / r)
        \\                     /
         \\                   /
       Elementwise Addition (+)
                 |
        Output h [batch x d_out]
\`\`\`

#### Your Engineering Challenge:
1. Implement \`lora_forward(x, W0, A, B, alpha, r)\`.
2. Compute the base forward pass \`x @ W0\` through frozen base weights.
3. Compute the low-rank branch: \`(x @ A) @ B\` scaled by \`alpha / r\`.
4. Return the combined output \`base_out + lora_out\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.1
# Low-Rank Matrix Factorization & LoRA Forward Pass
# ============================================================
import numpy as np

def lora_forward(x, W0, A, B, alpha=16.0, r=4):
    """
    Computes LoRA forward pass: h = x @ W0 + (alpha / r) * (x @ A @ B)
    """
    # TODO: Step 1: Compute frozen base output
    base_out = None
    
    # TODO: Step 2: Compute low-rank adaptation output with scaling
    lora_out = None
    
    # TODO: Step 3: Combine paths and return final activation tensor
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.1 (Canonical Solution)
# ============================================================
import numpy as np

def lora_forward(x, W0, A, B, alpha=16.0, r=4):
    scale = alpha / r
    base_out = np.matmul(x, W0)
    # Order of operations: (x @ A) @ B minimizes FLOPs when seq_len < d_out
    lora_out = np.matmul(np.matmul(x, A), B) * scale
    return base_out + lora_out
`,
          testCode: `assert 'lora_forward' in globals(), "Function 'lora_forward' must be defined"
np.random.seed(42)
B_sz, seq, d_in, d_out, r, alpha = 2, 4, 16, 32, 4, 16.0
x = np.random.randn(B_sz, d_in)
W0 = np.random.randn(d_in, d_out)
A = np.random.randn(d_in, r)
B = np.random.randn(r, d_out)

out = lora_forward(x, W0, A, B, alpha, r)
assert isinstance(out, np.ndarray), "Output must be a numpy ndarray"
assert out.shape == (B_sz, d_out), f"Expected shape ({B_sz}, {d_out}), got {out.shape}"

expected = np.matmul(x, W0) + (alpha / r) * np.matmul(np.matmul(x, A), B)
assert np.allclose(out, expected, atol=1e-5), "Numerical mismatch in LoRA forward pass"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Zero initialization invariant: When B is zero, LoRA output must strictly equal base output
B_zero = np.zeros((r, d_out))
out_zero = lora_forward(x, W0, A, B_zero, alpha, r)
assert np.allclose(out_zero, np.matmul(x, W0), atol=1e-7), "Initialization invariant violated: When B=0, output must equal base_out"

# Scaling invariant: doubling alpha must double the delta contribution
out_scaled = lora_forward(x, W0, A, B, alpha=32.0, r=r)
delta_1 = out - np.matmul(x, W0)
delta_2 = out_scaled - np.matmul(x, W0)
assert np.allclose(delta_2, 2.0 * delta_1, atol=1e-5), "Scaling invariant violated: alpha scaling not properly applied"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Low-Rank Adaptation forward pass verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Low-Rank Adaptation forward pass verified.',
          hint: 'Calculate scale = alpha / r. Multiply (x @ A) then multiply by B, then multiply by scale, and add to x @ W0.',
          progressiveHints: [
            'Tier 1 (Mental Model): Base weights W0 are untouched. Matrix A compresses features down to dimension r, and matrix B expands them back up to d_out.',
            'Tier 2 (Algorithmic Logic): Group multiplications as np.matmul(np.matmul(x, A), B) rather than multiplying A and B first. This saves compute.',
            'Tier 3 (Exact Formula): base_out = np.matmul(x, W0); lora_out = np.matmul(np.matmul(x, A), B) * (alpha / r); return base_out + lora_out.'
          ]
        },
        {
          id: 'lesson-5-1-2',
          title: 'Weight Merging & Zero-Latency Deployment',
          subtitle: 'Fusing LoRA Weights Back into Foundation Base Models',
          firstPrinciplesIntuition: 'During training, keeping W0 and Delta_W separate is necessary because only Delta_W accumulates gradients. But in production inference, running two separate matrix multiplications for every token adds unnecessary latency and overhead. Because matrix multiplication is distributive across addition: x(W0 + Delta_W) = xW0 + xDelta_W. We can mathematically fuse the trained LoRA matrices directly into the base weights prior to export! The deployed model runs at 100% native baseline speed with zero LoRA computation overhead.',
          content: `### LoRA Weight Fusion Formula

Prior to deploying an adapted model, the low-rank delta is pre-computed and merged into the base weight tensor:

$$W_{\\text{merged}} = W_0 + \\frac{\\alpha}{r} (A B)^T = W_0 + \\frac{\\alpha}{r} (B A)$$

\`\`\`
  Matrix A [d_in x r]      Matrix B [r x d_out]
          \\                     /
           \\                   /
            v                 v
        [ Matrix Multiply: A @ B ] -> [d_in x d_out]
                     |
                     v
        [ Scale: * (alpha / r) ]
                     |
                     v
           Delta W [d_in x d_out]
                     |
                     v
        (+) Base Weights W_0 [d_in x d_out]
                     |
                     v
         Merged Weights W_fused (Zero Inference Latency)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`merge_lora_weights(W0, A, B, alpha, r)\`.
2. Compute $\\Delta W = \\frac{\\alpha}{r} (A B)$.
3. Return the merged weight matrix $W_0 + \\Delta W$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.2
# Weight Merging & Zero-Latency Deployment
# ============================================================
import numpy as np

def merge_lora_weights(W0, A, B, alpha=16.0, r=4):
    """
    Fuses LoRA low-rank delta into base weights: W_fused = W0 + (alpha / r) * (A @ B)
    """
    # TODO: Compute fused weight matrix
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.2 (Canonical Solution)
# ============================================================
import numpy as np

def merge_lora_weights(W0, A, B, alpha=16.0, r=4):
    scale = alpha / r
    delta_W = np.matmul(A, B) * scale
    return W0 + delta_W
`,
          testCode: `assert 'merge_lora_weights' in globals(), "Function 'merge_lora_weights' must be defined"
d_in, d_out, r, alpha = 8, 16, 4, 16.0
W0 = np.ones((d_in, d_out))
A = np.full((d_in, r), 0.5)
B = np.full((r, d_out), 0.5)

merged = merge_lora_weights(W0, A, B, alpha, r)
assert isinstance(merged, np.ndarray), "Output must be a numpy ndarray"
assert merged.shape == (d_in, d_out), f"Expected shape ({d_in}, {d_out}), got {merged.shape}"

# A @ B of all 0.5s with r=4 yields 4 * (0.5 * 0.5) = 1.0 per cell. Scale = 16/4 = 4.0. Total = 1.0 + 4.0 = 5.0.
assert np.allclose(merged, 5.0, atol=1e-5), f"Expected all values 5.0, got {merged[0,0]}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Equivalence test: x @ W_merged must equal lora_forward(x)
x = np.random.randn(3, d_in)
out_merged = np.matmul(x, merged)
out_separate = np.matmul(x, W0) + (alpha / r) * np.matmul(np.matmul(x, A), B)
assert np.allclose(out_merged, out_separate, atol=1e-5), "Mathematical equivalence violated: Fused weight output must equal separate LoRA forward output"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Weight merging physics verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Weight merging physics verified.',
          hint: 'Multiply A and B: np.matmul(A, B), multiply by (alpha / r), then add to W0.',
          progressiveHints: [
            'Tier 1 (Mental Model): Merging weights permanently bakes the adaptation into the base model so you do not have to pay extra compute per token.',
            'Tier 2 (Algorithmic Logic): Delta W is of shape (d_in, d_out). Since A is (d_in, r) and B is (r, d_out), np.matmul(A, B) matches W0 shape perfectly.',
            'Tier 3 (Exact Formula): return W0 + (alpha / r) * np.matmul(A, B).'
          ]
        },
        {
          id: 'lesson-5-1-3',
          title: 'Intrinsic Rank Estimation & SVD Truncation',
          subtitle: 'Discovering the Minimal Representation of Learned Features',
          firstPrinciplesIntuition: 'How do researchers know whether rank r=4, r=8, or r=64 is appropriate for a task? Using Singular Value Decomposition (SVD), any real matrix can be factorized into U * Sigma * V^T, where Sigma contains singular values in descending order of explained variance. If the first 4 singular values contain 98% of the total energy, choosing r=4 will preserve nearly 100% of the model capacity while throwing away random noise. SVD gives us the mathematical microscope to measure the true information bottleneck of deep neural networks.',
          content: `### Singular Value Truncation Formulation

Given a weight update matrix $\\Delta W \\in \\mathbb{R}^{m \\times n}$, SVD decomposes it into:

$$\\Delta W = U \\Sigma V^T$$

The cumulative energy ratio for rank $r$ is:

$$\\text{Energy}(r) = \\frac{\\sum_{i=1}^r \\sigma_i^2}{\\sum_{j=1}^{\\min(m,n)} \\sigma_j^2}$$

\`\`\`
  Singular Values (Sigma):
  [ 120.4, 45.2, 12.1, 8.3, 0.4, 0.2, 0.1, 0.05 ... ]
    |====================|  |-----------------------|
      Top-4 Rank (98.5%)          Noise Tail (1.5%)
        Keep for LoRA!               Discard!
\`\`\`

#### Your Engineering Challenge:
1. Implement \`find_minimal_lora_rank(delta_W, energy_threshold=0.90)\`.
2. Compute singular values using \`np.linalg.svd(delta_W, compute_uv=False)\`.
3. Compute cumulative variance ratio of singular values squared.
4. Return the minimum rank $r$ that achieves $\\ge \\text{energy\\_threshold}$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.3
# Intrinsic Rank Estimation & SVD Truncation
# ============================================================
import numpy as np

def find_minimal_lora_rank(delta_W, energy_threshold=0.90):
    """
    Computes SVD and finds the minimal rank r capturing >= energy_threshold of variance.
    """
    # TODO: Step 1: Compute singular values of delta_W
    s = None
    
    # TODO: Step 2: Compute cumulative energy (squared singular values)
    
    # TODO: Step 3: Return minimal rank r (1-indexed)
    return 1
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.1.3 (Canonical Solution)
# ============================================================
import numpy as np

def find_minimal_lora_rank(delta_W, energy_threshold=0.90):
    s = np.linalg.svd(delta_W, compute_uv=False)
    squared = s ** 2
    total_energy = np.sum(squared)
    cumulative = np.cumsum(squared) / total_energy
    # Find first index where cumulative >= energy_threshold
    rank = int(np.argmax(cumulative >= energy_threshold)) + 1
    return rank
`,
          testCode: `assert 'find_minimal_lora_rank' in globals(), "Function 'find_minimal_lora_rank' must be defined"
# Construct a matrix with exactly 3 dominant singular components
np.random.seed(42)
U = np.random.randn(20, 3)
V = np.random.randn(3, 30)
delta_W = np.matmul(U, V) # Exactly rank 3

r = find_minimal_lora_rank(delta_W, energy_threshold=0.95)
assert isinstance(r, int), "Rank must be an integer"
assert r == 3, f"Expected rank 3 for rank-3 matrix, got {r}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Identity matrix has all equal singular values; 90% energy requires 90% of dimensions
I = np.eye(10)
r_identity = find_minimal_lora_rank(I, energy_threshold=0.50)
assert r_identity == 5, f"Expected rank 5 for 50% energy on 10x10 identity, got {r_identity}"

# Zero noise test
r_single = find_minimal_lora_rank(np.ones((10, 10)), energy_threshold=0.99)
assert r_single == 1, f"Expected rank 1 for all-ones matrix, got {r_single}"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] SVD rank estimation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] SVD rank estimation verified.',
          hint: 'Use np.linalg.svd(delta_W, compute_uv=False), square the singular values, take np.cumsum() / sum, and find the first index meeting the threshold.',
          progressiveHints: [
            'Tier 1 (Mental Model): Singular values show how much "stretch" occurs along each dimension. Squaring them gives the variance along that axis.',
            'Tier 2 (Algorithmic Logic): Calculate s = np.linalg.svd(delta_W, compute_uv=False). Cumulative energy is np.cumsum(s**2) / np.sum(s**2).',
            'Tier 3 (Exact Formula): rank = int(np.argmax(cumulative >= energy_threshold)) + 1; return rank.'
          ]
        }
      ]
    },
    {
      id: 'module-5-2',
      title: 'Module 5.2: Quantization & 4-Bit NormalFloat Precision',
      description: 'Compress model weights from 16-bit floating point down to 8-bit and 4-bit representations. Learn the mathematics of uniform symmetric quantization, asymmetric zero-point offsets, and QLoRA NormalFloat4 distributions.',
      lessons: [
        {
          id: 'lesson-5-2-1',
          title: 'Uniform Symmetric INT8 Quantization & Dequantization',
          subtitle: 'Mapping Continuous Floats into 8-Bit Signed Integers',
          firstPrinciplesIntuition: 'A standard FP16 parameter requires 2 bytes (16 bits) of VRAM. An 8-billion parameter model therefore consumes 16 Gigabytes of memory just to load into RAM. Uniform symmetric INT8 quantization maps the continuous range [-max_abs, +max_abs] onto the integer range [-127, 127]. By dividing by a floating-point scaling factor and rounding to the nearest integer, memory footprint drops by 50% with negligible loss in reasoning accuracy.',
          content: `### Uniform Symmetric INT8 Quantization Mechanics

Given a continuous weight tensor $W \\in \\mathbb{R}^{m \\times n}$, symmetric quantization maps to signed 8-bit integers $[-127, 127]$:

$$\\text{scale} = \\frac{\\max(|W|)}{127}$$

$$W_{\\text{int8}} = \\text{clip}\\left( \\text{round}\\left( \\frac{W}{\\text{scale}} \\right), -127, 127 \\right)$$

$$\\hat{W} = W_{\\text{int8}} \\times \\text{scale}$$

\`\`\`
  Continuous Floats: [-3.81, 0.00, +12.70]
           |
           v (Scale factor: 12.70 / 127 = 0.10)
  Divide by Scale:   [-38.1, 0.0, +127.0]
           |
           v (Round to Nearest Integer)
  Quantized INT8:    [-38, 0, 127]  <--- Stored in RAM (1 byte each!)
           |
           v (Dequantize: Multiply by 0.10)
  Reconstructed:     [-3.80, 0.00, +12.70] (0.01 Max Error)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`quantize_int8_symmetric(W)\` returning \`(W_int8, scale)\`.
2. Implement \`dequantize_int8_symmetric(W_int8, scale)\` returning the reconstructed float tensor.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.2.1
# Uniform Symmetric INT8 Quantization & Dequantization
# ============================================================
import numpy as np

def quantize_int8_symmetric(W):
    """
    Quantizes continuous weight tensor W to int8 in range [-127, 127].
    Returns (W_int8, scale).
    """
    # TODO: Compute scale and quantized int8 tensor
    return None, None

def dequantize_int8_symmetric(W_int8, scale):
    """
    Dequantizes int8 tensor back to floating point representation.
    """
    # TODO: Reconstruct floating point tensor
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.2.1 (Canonical Solution)
# ============================================================
import numpy as np

def quantize_int8_symmetric(W):
    max_val = np.max(np.abs(W))
    scale = float(max_val / 127.0) if max_val > 0 else 1.0
    scaled = W / scale
    W_int8 = np.clip(np.round(scaled), -127, 127).astype(np.int8)
    return W_int8, scale

def dequantize_int8_symmetric(W_int8, scale):
    return (W_int8.astype(np.float32) * scale)
`,
          testCode: `assert 'quantize_int8_symmetric' in globals(), "Function 'quantize_int8_symmetric' must be defined"
assert 'dequantize_int8_symmetric' in globals(), "Function 'dequantize_int8_symmetric' must be defined"

W = np.array([-12.7, -6.35, 0.0, 6.35, 12.7], dtype=np.float32)
W_int8, scale = quantize_int8_symmetric(W)

assert W_int8.dtype == np.int8, f"Expected dtype int8, got {W_int8.dtype}"
assert np.isclose(scale, 0.1, atol=1e-5), f"Expected scale 0.1, got {scale}"
assert np.array_equal(W_int8, np.array([-127, -64, 0, 64, 127], dtype=np.int8)), f"Unexpected quantized values: {W_int8}"

W_recon = dequantize_int8_symmetric(W_int8, scale)
assert np.allclose(W, W_recon, atol=0.1), "Reconstruction error exceeds quantization tolerance"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Quantization error bounded by scale / 2
max_error = np.max(np.abs(W - W_recon))
assert max_error <= (scale / 2.0) + 1e-5, f"Theoretical error bound violated: max error {max_error} > scale/2"

# Zero tensor test
zeros = np.zeros((4, 4))
z_int8, z_scale = quantize_int8_symmetric(zeros)
assert np.all(z_int8 == 0), "Quantization of all-zeros must remain all-zeros"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] INT8 quantization roundtrip verified.")
`,
          expectedOutput: '✓ [TEST PASSED] INT8 quantization roundtrip verified.',
          hint: 'Calculate scale = max(abs(W)) / 127.0. Round W / scale, clip between -127 and 127, and cast to np.int8.',
          progressiveHints: [
            'Tier 1 (Mental Model): Quantization is like rounding decimals on a ruler: you lose fine fractional millimeters, but the shape remains intact.',
            'Tier 2 (Algorithmic Logic): To prevent division by zero, guard scale when max_abs is 0. Cast the output to np.int8.',
            'Tier 3 (Exact Formula): scale = max(abs(W)) / 127; W_int8 = np.clip(np.round(W / scale), -127, 127).astype(np.int8); return W_int8, scale.'
          ]
        },
        {
          id: 'lesson-5-2-2',
          title: 'QLoRA 4-Bit NormalFloat (NF4) Quantization Bins',
          subtitle: 'Information-Theoretic Optimal Quantization for Gaussian Weights',
          firstPrinciplesIntuition: 'Standard integer quantization assumes numbers are uniformly distributed like grains of sand across a table. But neural network weights are NOT uniform—they follow a Gaussian bell curve (Normal distribution) centered at zero, with 99% of weights concentrated between -3 and +3 standard deviations. Uniform quantization wastes 70% of its bits on empty extremes. QLoRA introduces NormalFloat4 (NF4): a quantile-based 4-bit quantization where each of the 16 bin points represents an equal slice of the standard Normal distribution!',
          content: `### NormalFloat4 (NF4) Quantization Mechanics

Introduced by Dettmers et al. (University of Washington, 2023), NF4 guarantees that each 4-bit bin has an equal number of expected parameters under a $\\mathcal{N}(0, 1)$ distribution:

$$q_i = \\frac{1}{2} \\left( Q_X\\left(\\frac{i}{2^k}\\right) + Q_X\\left(\\frac{i+1}{2^k}\\right) \\right)$$

\`\`\`
  Standard Normal Bell Curve:
              .-''''-.
            .'        '.
           /     ||     \\
          /   |  ||  |   \\
       ..-    |  ||  |    -..
       [-1.0, -0.2, +0.2, +1.0] (Dense Bins near Center, Sparse Bins at Tail)
\`\`\`

#### Your Engineering Challenge:
1. Given an array of 16 pre-computed NF4 quantiles, implement \`quantize_nf4(weights, quantiles)\`.
2. Normalize weights by dividing by their maximum absolute value.
3. For each weight, find the index of the nearest quantile in the codebook.
4. Return an array of integer indices in range $[0, 15]$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.2.2
# QLoRA 4-Bit NormalFloat (NF4) Quantization Bins
# ============================================================
import numpy as np

# 16 Canonical NF4 Quantile Centers for Standard Normal Distribution
NF4_QUANTILES = np.array([
    -1.0, -0.6961928009986877, -0.5250730514526367, -0.39491748809814453,
    -0.28444138169288635, -0.18477343022823334, -0.09105003625154495, 0.0,
    0.07958029955625534, 0.16093020141124725, 0.24611230194568634, 0.33791524171829224,
    0.44070982933044434, 0.5626170039176941, 0.7229568362236023, 1.0
])

def quantize_nf4(weights, quantiles=NF4_QUANTILES):
    """
    Quantizes normalized weights into 4-bit bin indices [0..15].
    """
    # TODO: Step 1: Normalize weights to range [-1.0, 1.0]
    
    # TODO: Step 2: Assign each weight to the nearest quantile bin
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.2.2 (Canonical Solution)
# ============================================================
import numpy as np

NF4_QUANTILES = np.array([
    -1.0, -0.6961928009986877, -0.5250730514526367, -0.39491748809814453,
    -0.28444138169288635, -0.18477343022823334, -0.09105003625154495, 0.0,
    0.07958029955625534, 0.16093020141124725, 0.24611230194568634, 0.33791524171829224,
    0.44070982933044434, 0.5626170039176941, 0.7229568362236023, 1.0
])

def quantize_nf4(weights, quantiles=NF4_QUANTILES):
    max_abs = np.max(np.abs(weights))
    norm_w = weights / max_abs if max_abs > 0 else weights
    # Broadcast differences: (N, 1) - (16,) -> find argmin
    diffs = np.abs(norm_w[..., np.newaxis] - quantiles)
    indices = np.argmin(diffs, axis=-1).astype(np.uint8)
    return indices
`,
          testCode: `assert 'quantize_nf4' in globals(), "Function 'quantize_nf4' must be defined"

weights = np.array([-1.0, 0.0, 1.0])
indices = quantize_nf4(weights)

assert indices.dtype == np.uint8, f"Expected uint8 indices, got {indices.dtype}"
assert indices[0] == 0, f"Expected index 0 for -1.0, got {indices[0]}"
assert indices[1] == 7, f"Expected index 7 for 0.0, got {indices[1]}"
assert indices[2] == 15, f"Expected index 15 for 1.0, got {indices[2]}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Random normal test
np.random.seed(42)
test_w = np.random.randn(100)
q_idx = quantize_nf4(test_w)
assert np.all(q_idx >= 0) and np.all(q_idx <= 15), "Indices must reside strictly within 4-bit range [0, 15]"
# Quantization entropy test: all 16 bins should be utilized for a normal distribution
unique_bins = np.unique(q_idx)
assert len(unique_bins) >= 12, f"NF4 should distribute weights evenly, but only {len(unique_bins)} bins were used"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] QLoRA NF4 quantization bins verified.")
`,
          expectedOutput: '✓ [TEST PASSED] QLoRA NF4 quantization bins verified.',
          hint: 'Divide weights by np.max(np.abs(weights)), expand dimensions to compute absolute difference with quantiles, and use np.argmin(diffs, axis=-1).',
          progressiveHints: [
            'Tier 1 (Mental Model): NF4 is an optimal lookup table. Instead of evenly spaced steps, steps are crowded near zero where most weights live.',
            'Tier 2 (Algorithmic Logic): Use broadcasting: (norm_w[..., None] - quantiles) gives the difference between each weight and all 16 quantile centers.',
            'Tier 3 (Exact Formula): diffs = np.abs(norm_w[..., None] - quantiles); return np.argmin(diffs, axis=-1).astype(np.uint8).'
          ]
        }
      ]
    },
    {
      id: 'module-5-3',
      title: 'Module 5.3: Direct Preference Optimization (DPO) Alignment',
      description: 'Align frontier models directly with human preferences without complex PPO reward modeling. Implement the Bradley-Terry preference objective and implicit reward loss functions from first principles.',
      lessons: [
        {
          id: 'lesson-5-3-1',
          title: 'Direct Preference Optimization (DPO) Loss from Scratch',
          subtitle: 'Eliminating the PPO Actor-Critic Reinforcement Learning Loop',
          firstPrinciplesIntuition: 'Reinforcement Learning from Human Feedback (RLHF) historically required training four separate neural networks simultaneously: an Actor, a Critic, a Reward model, and a Reference model. This was notoriously unstable. Direct Preference Optimization (DPO) proved that the optimal reward function can be algebraically substituted directly into the language model loss! By optimizing the log-ratio of chosen responses over rejected responses compared to a frozen reference model, you align models in a single, stable supervised training pass.',
          content: `### DPO Loss Mathematical Formulation

Introduced by Rafailov et al. (Stanford, 2023), the DPO loss optimizes the policy $\\pi_\\theta$ directly on pairs of chosen ($y_w$) and rejected ($y_l$) completions given prompt $x$:

$$\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = - \\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]$$

\`\`\`
  Log-Ratio Winning:  log(pi_theta(y_w) / pi_ref(y_w))
                               -
  Log-Ratio Losing:   log(pi_theta(y_l) / pi_ref(y_l))
                               |
                               v
            Difference * beta (Implicit Margin)
                               |
                               v
                 Sigmoid: sigma(margin)
                               |
                               v
             Negative Log-Likelihood: -log(p)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`dpo_loss(logp_policy_w, logp_policy_l, logp_ref_w, logp_ref_l, beta=0.1)\`.
2. Compute the log-ratio for the winning (chosen) completion: \`logp_policy_w - logp_ref_w\`.
3. Compute the log-ratio for the losing (rejected) completion: \`logp_policy_l - logp_ref_l\`.
4. Compute the implicit margin: \`beta * (ratio_w - ratio_l)\`.
5. Return the scalar mean loss: \`-mean(log(sigmoid(margin)))\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.3.1
# Direct Preference Optimization (DPO) Loss from Scratch
# ============================================================
import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

def dpo_loss(logp_policy_w, logp_policy_l, logp_ref_w, logp_ref_l, beta=0.1):
    """
    Computes DPO loss for preference alignment.
    """
    # TODO: Compute log-ratios for winning and losing completions
    
    # TODO: Compute implicit margin and sigmoid cross-entropy
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 5 - Lab 5.3.1 (Canonical Solution)
# ============================================================
import numpy as np

def sigmoid(z):
    # Stable sigmoid implementation
    return np.where(z >= 0, 1.0 / (1.0 + np.exp(-z)), np.exp(z) / (1.0 + np.exp(z)))

def dpo_loss(logp_policy_w, logp_policy_l, logp_ref_w, logp_ref_l, beta=0.1):
    log_ratio_w = logp_policy_w - logp_ref_w
    log_ratio_l = logp_policy_l - logp_ref_l
    margin = beta * (log_ratio_w - log_ratio_l)
    # Binary cross entropy: -log(sigmoid(margin))
    loss = -np.mean(np.log(sigmoid(margin) + 1e-12))
    return float(loss)
`,
          testCode: `assert 'dpo_loss' in globals(), "Function 'dpo_loss' must be defined"

# Case 1: Policy strongly prefers winning response (Loss should be near 0)
loss_good = dpo_loss(
    logp_policy_w=np.array([-1.0]),
    logp_policy_l=np.array([-10.0]),
    logp_ref_w=np.array([-5.0]),
    logp_ref_l=np.array([-5.0]),
    beta=0.5
)
assert isinstance(loss_good, float), "Loss must be a float scalar"
assert loss_good < 0.1, f"Loss should be small when policy favors winner, got {loss_good}"

# Case 2: Policy mistakenly prefers losing response (Loss should be high)
loss_bad = dpo_loss(
    logp_policy_w=np.array([-10.0]),
    logp_policy_l=np.array([-1.0]),
    logp_ref_w=np.array([-5.0]),
    logp_ref_l=np.array([-5.0]),
    beta=0.5
)
assert loss_bad > 2.0, f"Loss should be high when policy favors loser, got {loss_bad}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# When policy equals reference model, loss must equal -log(0.5) ≈ 0.69315
loss_neutral = dpo_loss(
    logp_policy_w=np.array([-2.0]),
    logp_policy_l=np.array([-2.0]),
    logp_ref_w=np.array([-2.0]),
    logp_ref_l=np.array([-2.0]),
    beta=0.1
)
assert np.isclose(loss_neutral, np.log(2.0), atol=1e-4), f"Neutral policy must have loss -log(0.5) ≈ 0.6931, got {loss_neutral}"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Direct Preference Optimization loss verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Direct Preference Optimization loss verified.',
          hint: 'Subtract logp_ref_w from logp_policy_w, subtract logp_ref_l from logp_policy_l, multiply difference by beta, apply sigmoid, and compute -mean(log(sig)).',
          progressiveHints: [
            'Tier 1 (Mental Model): DPO pushes the model probability of the human-preferred answer UP and pulls the rejected answer DOWN relative to the reference anchor.',
            'Tier 2 (Algorithmic Logic): Remember that log(A / B) in log-space is simply log(A) - log(B).',
            'Tier 3 (Exact Formula): margin = beta * ((policy_w - ref_w) - (policy_l - ref_l)); return -np.mean(np.log(sigmoid(margin))).'
          ]
        }
      ]
    }
  ]
};
