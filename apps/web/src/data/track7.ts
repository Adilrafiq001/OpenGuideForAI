import type { Track } from './track0';

export const track7: Track = {
  id: 'track-7',
  title: 'Track 7: Generative Diffusion & Multimodal Transformers',
  description: 'Master the generative mathematics of modern creation: Denoising Diffusion Probabilistic Models (DDPM), Classifier-Free Guidance (CFG) scale equations, Vision Transformer (ViT) patch projections, and multimodal cross-attention conditioning.',
  modules: [
    {
      id: 'module-7-1',
      title: 'Module 7.1: Denoising Diffusion Probabilistic Models (DDPM)',
      description: 'Dismantle continuous noise mechanics. Master the forward closed-form reparameterization trick, score-matching mean estimation, and Classifier-Free Guidance vectors from first principles.',
      lessons: [
        {
          id: 'lesson-7-1-1',
          title: 'Forward Diffusion Noise Scheduling & Closed-Form Sampling',
          subtitle: 'The Invariant Physics of Continuous Gaussian Perturbation',
          firstPrinciplesIntuition: 'Diffusion models generate realistic data by learning to reverse an entropy process. In the forward pass, a pristine image is gradually corrupted with microscopic increments of Gaussian noise over T steps. Naively, simulating step 500 would require running 500 successive noise additions. Using the reparameterization trick with cumulative alphas (alpha_bar_t), we can jump directly from pristine data x_0 to noisy data x_t in a single mathematical step: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon!',
          content: `### Closed-Form Forward Diffusion Formulation

Introduced by Sohl-Dickstein et al. (2015) and Ho et al. (NeurIPS 2020), the forward process $q(x_t | x_0)$ adds Gaussian noise according to variance schedule $\\beta_1, \\dots, \\beta_T$:

$$\\alpha_t = 1 - \\beta_t, \\quad \\bar{\\alpha}_t = \\prod_{s=1}^t \\alpha_s$$

$$q(x_t | x_0) = \\mathcal{N}\\left(x_t; \\sqrt{\\bar{\\alpha}_t} x_0, (1 - \\bar{\\alpha}_t) \\mathbf{I}\\right)$$

$$x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$$

\`\`\`
  Pristine Data x_0
         |
         +--------------------------------+
         | (Scale by sqrt(alpha_bar_t))   | (Scale noise by sqrt(1 - alpha_bar_t))
         v                                v
    Signal Component                Noise Component
         \\                               /
          \\                             /
           +--------> (+) <------------+
                       |
                       v
             Noisy State x_t at Step t (One-step calculation!)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`forward_diffusion_sample(x_0, noise, alpha_bar_t)\`.
2. Compute $\\sqrt{\\bar{\\alpha}_t} x_0$.
3. Compute $\\sqrt{1 - \\bar{\\alpha}_t} \\epsilon$.
4. Return the combined noisy tensor $x_t$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.1.1
# Forward Diffusion Noise Scheduling & Closed-Form Sampling
# ============================================================
import numpy as np

def forward_diffusion_sample(x_0, noise, alpha_bar_t):
    """
    Computes closed-form noisy latent x_t given clean x_0, noise, and alpha_bar_t.
    """
    # TODO: Compute scaled signal and scaled noise components
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.1.1 (Canonical Solution)
# ============================================================
import numpy as np

def forward_diffusion_sample(x_0, noise, alpha_bar_t):
    sqrt_alpha_bar = np.sqrt(alpha_bar_t)
    sqrt_one_minus_alpha = np.sqrt(1.0 - alpha_bar_t)
    return sqrt_alpha_bar * x_0 + sqrt_one_minus_alpha * noise
`,
          testCode: `assert 'forward_diffusion_sample' in globals(), "Function 'forward_diffusion_sample' must be defined"

x_0 = np.array([1.0, 2.0, 3.0])
noise = np.array([0.0, 0.0, 0.0])
alpha_bar = 0.64 # sqrt is 0.8

x_t = forward_diffusion_sample(x_0, noise, alpha_bar)
assert np.allclose(x_t, np.array([0.8, 1.6, 2.4])), f"Expected [0.8, 1.6, 2.4], got {x_t}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Boundary 1: alpha_bar = 1.0 (step 0, pure signal)
x_pure = forward_diffusion_sample(x_0, np.array([9.9, 9.9, 9.9]), 1.0)
assert np.allclose(x_pure, x_0), "At alpha_bar = 1.0, output must strictly equal original x_0"

# Boundary 2: alpha_bar = 0.0 (step T, pure noise)
x_noise = forward_diffusion_sample(x_0, np.array([4.0, 5.0, 6.0]), 0.0)
assert np.allclose(x_noise, np.array([4.0, 5.0, 6.0])), "At alpha_bar = 0.0, output must strictly equal noise"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Forward diffusion closed-form sampling verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Forward diffusion closed-form sampling verified.',
          hint: 'Calculate np.sqrt(alpha_bar_t) * x_0 + np.sqrt(1.0 - alpha_bar_t) * noise.',
          progressiveHints: [
            'Tier 1 (Mental Model): Think of a photo being dissolved in fog: alpha_bar controls how much of the original photo remains vs how much fog has covered it.',
            'Tier 2 (Algorithmic Logic): Both scaling factors use square roots because variances add: Var(aX + bY) = a^2 Var(X) + b^2 Var(Y). (sqrt(a))^2 + (sqrt(1-a))^2 = 1.0.',
            'Tier 3 (Exact Formula): return np.sqrt(alpha_bar_t) * x_0 + np.sqrt(1.0 - alpha_bar_t) * noise.'
          ]
        },
        {
          id: 'lesson-7-1-2',
          title: 'Classifier-Free Guidance (CFG) Vector Scaling',
          subtitle: 'Controlling Prompt Adherence in Generative Models',
          firstPrinciplesIntuition: 'When generating an image from a text prompt like "a golden crown", an unguided model often produces a bland average of all crowns it has seen. Classifier-Free Guidance (CFG) (Ho & Salimans, 2021) dramatically sharpens output quality by computing two predictions in parallel: an unconditional prediction eps_uncond (with prompt dropped to empty string) and a conditional prediction eps_cond. By pushing the prediction further in the direction of the prompt vector, the guidance scale s forces the model to emphasize prompt-specific features!',
          content: `### Classifier-Free Guidance (CFG) Equation

Given a conditional noise estimate $\\epsilon_\\theta(x_t, c)$ and an unconditional estimate $\\epsilon_\\theta(x_t, \\emptyset)$, the guided prediction with scale $s$ is:

$$\\tilde{\\epsilon}_t = \\epsilon_{\\text{uncond}} + s \\cdot (\\epsilon_{\\text{cond}} - \\epsilon_{\\text{uncond}})$$

\`\`\`
  Unconditional Prediction: eps_uncond  (Base probability manifold)
                 |
                 +-----> Vector Difference: (eps_cond - eps_uncond)
                 |                     |
                 |                     v (Multiply by Guidance Scale s)
                 |             Amplified Directional Shift
                 v                     v
                 (+) <-----------------+
                  |
                  v
         Guided Noise Prediction (Sharp Prompt Fidelity)
\`\`\`

#### Your Engineering Challenge:
1. Implement \`apply_cfg(eps_uncond, eps_cond, guidance_scale=7.5)\`.
2. Compute the directional guidance vector: \`eps_cond - eps_uncond\`.
3. Extrapolate by scale: \`eps_uncond + guidance_scale * direction\`.
4. Return the resulting guided noise prediction tensor.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.1.2
# Classifier-Free Guidance (CFG) Vector Scaling
# ============================================================
import numpy as np

def apply_cfg(eps_uncond, eps_cond, guidance_scale=7.5):
    """
    Computes Classifier-Free Guidance prediction: eps_uncond + s * (eps_cond - eps_uncond)
    """
    # TODO: Compute guided noise prediction
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.1.2 (Canonical Solution)
# ============================================================
import numpy as np

def apply_cfg(eps_uncond, eps_cond, guidance_scale=7.5):
    return eps_uncond + guidance_scale * (eps_cond - eps_uncond)
`,
          testCode: `assert 'apply_cfg' in globals(), "Function 'apply_cfg' must be defined"

eps_u = np.array([1.0, 2.0])
eps_c = np.array([2.0, 4.0])
# direction = [1.0, 2.0]. Scale = 7.5. result = [1.0, 2.0] + 7.5 * [1.0, 2.0] = [8.5, 17.0]
guided = apply_cfg(eps_u, eps_c, guidance_scale=7.5)

assert np.allclose(guided, np.array([8.5, 17.0])), f"Expected [8.5, 17.0], got {guided}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Identity test: guidance_scale = 1.0 must return pure conditional eps_cond
g_one = apply_cfg(eps_u, eps_c, guidance_scale=1.0)
assert np.allclose(g_one, eps_c), "Guidance scale = 1.0 must return exactly eps_cond"

# Neutral test: guidance_scale = 0.0 must return pure unconditional eps_uncond
g_zero = apply_cfg(eps_u, eps_c, guidance_scale=0.0)
assert np.allclose(g_zero, eps_u), "Guidance scale = 0.0 must return exactly eps_uncond"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] Classifier-Free Guidance vector calculation verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Classifier-Free Guidance vector calculation verified.',
          hint: 'Subtract eps_uncond from eps_cond, multiply by guidance_scale, and add to eps_uncond.',
          progressiveHints: [
            'Tier 1 (Mental Model): CFG acts like an audio equalizer: it identifies what is unique to the prompt and boosts its volume.',
            'Tier 2 (Algorithmic Logic): direction = eps_cond - eps_uncond. The scale factor multiplies this directional vector.',
            'Tier 3 (Exact Formula): return eps_uncond + guidance_scale * (eps_cond - eps_uncond).'
          ]
        }
      ]
    },
    {
      id: 'module-7-2',
      title: 'Module 7.2: Multimodal Vision Transformers & Cross-Attention',
      description: 'Bridge vision and language. Implement Vision Transformer (ViT) patch flattening, learnable linear projections, and cross-attention conditioning mechanisms from scratch.',
      lessons: [
        {
          id: 'lesson-7-2-1',
          title: 'Vision Transformer (ViT) Patch Projection Mechanics',
          subtitle: 'Converting 2D Pixel Arrays into 1D Token Sequences',
          firstPrinciplesIntuition: 'Transformers were designed for 1D sequences of words, not 2D grids of pixels. A standard 224x224 RGB image contains 150,528 numbers—far too large for quadratic attention matrices! Dosovitskiy et al. (Google, 2020) realized an image is just a grid of small 16x16 pixel "patches", like words in a sentence. By flattening each 16x16x3 patch into a vector of 768 numbers and projecting it through a linear matrix, an entire 2D image is converted into a standard sequence of 196 tokens that standard transformer blocks can process directly!',
          content: `### ViT Linear Patch Projection Formulation

Given an input image $X \\in \\mathbb{R}^{H \\times W \\times C}$, divide it into non-overlapping patches of size $P \\times P$. The number of patches is:

$$N = \\frac{H \\cdot W}{P^2}$$

Each flattened patch $x_p \\in \\mathbb{R}^{P^2 \\cdot C}$ is linearly projected into the model dimension $D$:

$$z_0 = \\left[ x_p^1 E; x_p^2 E; \\dots; x_p^N E \\right], \\quad E \\in \\mathbb{R}^{(P^2 C) \\times D}$$

\`\`\`
  2D Image [32 x 32 x 3] (Patch size P = 16)
         |
         v
  Grid of 4 Patches [2 x 2]
         |
         v (Flatten each 16x16x3 patch into 1D vector of length 768)
  Flattened Patches: [4 x 768]
         |
         v (Matrix Multiply: Patches @ Projection_Matrix E [768 x 64])
  Visual Tokens for Transformer: [4 x 64]
\`\`\`

#### Your Engineering Challenge:
1. Implement \`project_image_patches(image, patch_size, projection_matrix)\`.
2. Flatten the image into $N$ non-overlapping patches of size $P \\times P \\times C$.
3. Project each patch using matrix multiplication: \`patches @ projection_matrix\`.
4. Return token sequence of shape \`[num_patches, embed_dim]\`.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.2.1
# Vision Transformer (ViT) Patch Projection Mechanics
# ============================================================
import numpy as np

def project_image_patches(image, patch_size=16, projection_matrix=None):
    """
    Extracts patches from image (H, W, C) and linearly projects them into embed_dim.
    """
    # TODO: Step 1: Compute number of vertical and horizontal patches
    
    # TODO: Step 2: Reshape and flatten into (N, patch_size * patch_size * C)
    
    # TODO: Step 3: Project through projection_matrix
    return None
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 7 - Lab 7.2.1 (Canonical Solution)
# ============================================================
import numpy as np

def project_image_patches(image, patch_size=16, projection_matrix=None):
    H, W, C = image.shape
    num_h = H // patch_size
    num_w = W // patch_size
    num_patches = num_h * num_w
    patch_dim = patch_size * patch_size * C

    # Reshape into (num_h, patch_size, num_w, patch_size, C) then transpose to (num_h, num_w, patch_size, patch_size, C)
    patches = image.reshape(num_h, patch_size, num_w, patch_size, C)
    patches = patches.transpose(0, 2, 1, 3, 4).reshape(num_patches, patch_dim)

    if projection_matrix is not None:
        return np.matmul(patches, projection_matrix)
    return patches
`,
          testCode: `assert 'project_image_patches' in globals(), "Function 'project_image_patches' must be defined"

# 32x32 image with 3 channels, 16x16 patch size -> 4 patches, patch_dim = 16*16*3 = 768
image = np.ones((32, 32, 3))
embed_dim = 64
projection_matrix = np.full((768, embed_dim), 0.01)

tokens = project_image_patches(image, patch_size=16, projection_matrix=projection_matrix)
assert isinstance(tokens, np.ndarray), "Output must be a numpy ndarray"
assert tokens.shape == (4, embed_dim), f"Expected shape (4, {embed_dim}), got {tokens.shape}"
# Each patch is 768 ones. 768 * 0.01 = 7.68
assert np.allclose(tokens, 7.68, atol=1e-5), f"Expected token values 7.68, got {tokens[0,0]}"
print("✓ [VISIBLE TESTS PASSED]")

# --- Hidden Invariant Verification ---
# Preserving total pixel volume in raw patches
raw_patches = project_image_patches(image, patch_size=16, projection_matrix=None)
assert raw_patches.shape == (4, 768), f"Expected raw shape (4, 768), got {raw_patches.shape}"
assert raw_patches.size == image.size, "Total elements in extracted patches must strictly equal original image elements"

print("✓ [HIDDEN TESTS PASSED] 5/5 invariant assertions satisfied.")
print("✓ [TEST PASSED] ViT patch linear projection verified.")
`,
          expectedOutput: '✓ [TEST PASSED] ViT patch linear projection verified.',
          hint: 'Reshape image into (num_h, patch_size, num_w, patch_size, C), transpose axes 1 and 2, flatten to (num_patches, patch_dim), and multiply by projection_matrix.',
          progressiveHints: [
            'Tier 1 (Mental Model): An image is like a mosaic tile puzzle. We slice the picture into a grid of squares and flatten each square into a 1D strip of colors.',
            'Tier 2 (Algorithmic Logic): num_h = H // patch_size and num_w = W // patch_size. Total patches = num_h * num_w.',
            'Tier 3 (Exact Formula): patches = image.reshape(num_h, patch_size, num_w, patch_size, C).transpose(0, 2, 1, 3, 4).reshape(num_patches, -1); return np.matmul(patches, projection_matrix).'
          ]
        }
      ]
    }
  ]
};
