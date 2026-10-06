import type { KnowledgeEntry } from './offlineKnowledge';

/**
 * OpenGuide Frontier Knowledge Base - Batch 1 (60 Core Topics)
 * Expands corpus from 65 to 125 deep, mathematically grounded topics.
 * Domains:
 *  1. Diffusion & Flow Matching (15 Topics)
 *  2. Frontier RL & Reasoning (15 Topics)
 *  3. Distributed High-Performance Systems (15 Topics)
 *  4. Classical ML & Deep Learning Core (15 Topics)
 */

export const FRONTIER_KNOWLEDGE_BATCH_1: KnowledgeEntry[] = [
  // ===========================================================================
  // 1. DIFFUSION, FLOW MATCHING & GENERATIVE VISION (15 TOPICS)
  // ===========================================================================
  {
    id: 'ddpm-forward-reverse-sde',
    keywords: ['ddpm', 'diffusion', 'forward process', 'reverse process', 'noise schedule', 'score function', 'denoising'],
    multilingualKeywords: {
      es: ['difusión', 'proceso inverso'],
      hi: ['डिफ्यूजन', 'नॉइज़ शेड्यूल'],
      zh: ['扩散模型', '去噪扩散'],
      fr: ['modèle de diffusion'],
      de: ['diffusionsmodell'],
      ar: ['نموذج الانتشار']
    },
    title: 'Denoising Diffusion Probabilistic Models (DDPM) & Gaussian Noise SDE',
    category: 'math',
    summary: 'Generating continuous data distributions by reversing a parameterized Markovian forward noise chain.',
    explanation: 'DDPM (Sohl-Dickstein et al., Ho et al.) defines a forward Markov chain q(x_t | x_{t-1}) adding Gaussian noise governed by variance schedule beta_t: q(x_t|x_0) = N(x_t; sqrt(alpha_bar_t) * x_0, (1 - alpha_bar_t) * I). The model theta is trained to predict the added Gaussian noise epsilon via simplified L2 loss: L_simple = E_{t, x_0, epsilon} [ || epsilon - epsilon_theta(x_t, t) ||^2 ]. Sampling reverses the degradation step-by-step from pure isotropic noise N(0, I) to high-fidelity data.',
    codeSnippet: 'import numpy as np\n\ndef forward_diffusion_sample(x_0, t, alpha_bars):\n    # Reparameterization trick: x_t = sqrt(alpha_bar) * x_0 + sqrt(1 - alpha_bar) * eps\n    eps = np.random.randn(*x_0.shape)\n    alpha_bar = alpha_bars[t]\n    x_t = np.sqrt(alpha_bar) * x_0 + np.sqrt(1.0 - alpha_bar) * eps\n    return x_t, eps\n\nx0 = np.array([1.5, -0.8])\nalpha_bars = np.linspace(1.0, 0.05, 100)\nx_t, noise = forward_diffusion_sample(x0, t=50, alpha_bars=alpha_bars)\nprint(f"Noisy State x_t at step 50: {x_t.round(3)}")',
    takeaway: 'Diffusion models break difficult high-dimensional generative modeling into tractable small denoising steps.'
  },
  {
    id: 'ddim-deterministic-sampling',
    keywords: ['ddim', 'deterministic diffusion', 'sampling acceleration', 'non-markovian', 'ode trajectory'],
    multilingualKeywords: {
      es: ['ddim', 'muestreo determinista'],
      hi: ['डीडीआईएम'],
      zh: ['去噪扩散隐式模型'],
      fr: ['échantillonnage ddim'],
      de: ['deterministische diffusion'],
      ar: ['انتشار حتمي']
    },
    title: 'DDIM: Non-Markovian Deterministic Sampling for Fast Inference',
    category: 'math',
    summary: 'Accelerating diffusion inference from 1000 steps down to 20-50 steps using an implicit non-Markovian ODE formulation.',
    explanation: 'Standard DDPM sampling is strictly Markovian and requires hundreds of small stochastic steps to preserve reverse transition fidelity. Song et al. formulated Denoising Diffusion Implicit Models (DDIM), constructing a class of non-Markovian forward processes that share the exact same marginal distributions q(x_t | x_0) as DDPM but allow setting the forward noise parameter eta = 0. This turns the reverse process into a deterministic Ordinary Differential Equation (ODE), allowing skipping 95% of intermediate timesteps.',
    codeSnippet: 'import numpy as np\n\ndef ddim_step(x_t, pred_eps, alpha_t, alpha_prev):\n    # 1. Predict x_0 from current x_t and predicted noise\n    pred_x0 = (x_t - np.sqrt(1 - alpha_t) * pred_eps) / np.sqrt(alpha_t)\n    # 2. Compute deterministic direction pointing to x_{t-1}\n    dir_xt = np.sqrt(1 - alpha_prev) * pred_eps\n    # 3. Deterministic update step (eta = 0)\n    x_prev = np.sqrt(alpha_prev) * pred_x0 + dir_xt\n    return x_prev\n\nx_now = np.array([0.7, 0.4])\nx_next = ddim_step(x_now, pred_eps=np.array([0.1, 0.05]), alpha_t=0.6, alpha_prev=0.8)\nprint(f"Accelerated DDIM Next State: {x_next.round(3)}")',
    takeaway: 'DDIM enables deterministic generation and latent image inversion by turning diffusion into an ODE.'
  },
  {
    id: 'score-based-generative-modeling',
    keywords: ['score matching', 'score based', 'langevin dynamics', 'gradient of log density', 'song ermon'],
    multilingualKeywords: {
      es: ['coincidencia de puntuación'],
      hi: ['स्कोर मैचिंग'],
      zh: ['分数匹配', '朗之万动力学'],
      fr: ['correspondance de score'],
      de: ['score-basiertes modell'],
      ar: ['مطابقة النقاط']
    },
    title: 'Score-Based Generative Modeling & Annealed Langevin Dynamics',
    category: 'math',
    summary: 'Modeling data probability distributions via the vector field of gradients of the log-density s(x) = grad_x log p(x).',
    explanation: 'Normalized probability density p(x) = exp(-E(x))/Z requires calculating an intractable partition function Z. Score-based models bypass Z entirely by training a neural network s_theta(x) to estimate the Stein Score: nabla_x log p(x). Sampling proceeds via Annealed Langevin Dynamics: x_{i+1} = x_i + (epsilon / 2) * s_theta(x_i) + sqrt(epsilon) * z, descending the energy gradient toward high-density data modes.',
    codeSnippet: 'import numpy as np\n\ndef langevin_dynamics_step(x, score_fn, step_size=0.01):\n    score = score_fn(x)\n    noise = np.random.randn(*x.shape)\n    x_next = x + (step_size / 2.0) * score + np.sqrt(step_size) * noise\n    return x_next\n\n# Mock score function pointing toward origin (Gaussian mode at 0)\ntoy_score = lambda v: -v\nx_init = np.array([2.5, -3.0])\nx_sampled = langevin_dynamics_step(x_init, toy_score)\nprint(f"Langevin Step: From {x_init} -> {x_sampled.round(3)}")',
    takeaway: 'The score function eliminates normalizing constants, enabling generative modeling via vector field gradients.'
  },
  {
    id: 'rectified-flow-matching',
    keywords: ['flow matching', 'rectified flow', 'straight trajectory', 'lipman', 'albergo', 'flux', 'optimal transport'],
    multilingualKeywords: {
      es: ['coincidencia de flujo', 'flujo rectificado'],
      hi: ['फ्लो मैचिंग'],
      zh: ['流匹配', '整流流'],
      fr: ['flow matching'],
      de: ['flow-matching'],
      ar: ['مطابقة التدفق']
    },
    title: 'Flow Matching & Rectified Flow: Straight-Line Generative Trajectories',
    category: 'math',
    summary: 'Replacing curved stochastic diffusion paths with linear ODE velocity fields for single-digit step generation.',
    explanation: 'Traditional diffusion trajectories curve through probability space, requiring many small steps to avoid numerical integration error. Flow Matching (Lipman et al., Albergo et al.) defines an explicit velocity field v_t(x) that maps noise distribution p_0 directly to data distribution p_1 along straight lines: x_t = (1 - t) * x_0 + t * x_1, with velocity dx_t/dt = x_1 - x_0. The loss simply regresses predicted velocity against the vector direction: L_FM = E || v_theta(x_t, t) - (x_1 - x_0) ||^2. Used in state-of-the-art models like Flux and SD3.',
    codeSnippet: 'import numpy as np\n\ndef rectified_flow_sample(x_noise, velocity_fn, num_steps=10):\n    dt = 1.0 / num_steps\n    x = np.copy(x_noise)\n    for step in range(num_steps):\n        t = step * dt\n        v = velocity_fn(x, t)\n        x = x + v * dt # Euler ODE integration\n    return x\n\n# Toy constant linear velocity field\nmock_velocity = lambda pos, t: np.array([1.0, 1.0]) - pos\ngenerated = rectified_flow_sample(np.array([0.0, 0.0]), mock_velocity, num_steps=5)\nprint(f"Flow Matching Sample Result: {generated.round(3)}")',
    takeaway: 'Straight trajectories minimize ODE curvature, enabling high-fidelity image generation in 10 or fewer steps.'
  },
  {
    id: 'latent-diffusion-vae-compression',
    keywords: ['latent diffusion', 'ldm', 'vae', 'stable diffusion', 'perceptual compression', 'pixel space'],
    multilingualKeywords: {
      es: ['difusión latente', 'vae'],
      hi: ['लेटेंट डिफ्यूजन'],
      zh: ['潜空间扩散', '变分自编码器'],
      fr: ['diffusion latente'],
      de: ['latente diffusion'],
      ar: ['الانتشار الكامن']
    },
    title: 'Latent Diffusion Models (LDM) & Perceptual VAE Compression',
    category: 'architecture',
    summary: 'Running diffusion inside a spatially compressed, perceptually equivalent latent representation rather than pixel space.',
    explanation: 'Pixel-level diffusion on high-resolution images (e.g. 1024x1024x3) wastes 90% of compute on high-frequency imperceptible texture noise. Rombach et al. (Latent Diffusion) split generation into two distinct phases:\n1. Perceptual Compression: A pre-trained autoencoder (VAE) compresses RGB images by factor f (e.g. f=8), transforming a 512x512x3 image into a 64x64x4 latent tensor z = E(x).\n2. Latent Denoising: The U-Net or DiT model runs diffusion entirely in this low-dimensional latent space z.\n3. Reconstruction: Once denoised, decoder D(z) renders the final high-resolution RGB image. This reduces compute costs by up to 64x.',
    codeSnippet: 'import numpy as np\n\n# Dimension compression comparison\npixel_shape = (512, 512, 3)\nlatent_factor = 8\nlatent_channels = 4\nlatent_shape = (pixel_shape[0] // latent_factor, pixel_shape[1] // latent_factor, latent_channels)\n\npixel_elements = np.prod(pixel_shape)\nlatent_elements = np.prod(latent_shape)\nprint(f"Pixel Elements: {pixel_elements:,} | Latent Elements: {latent_elements:,}")\nprint(f"Memory Reduction: {pixel_elements / latent_elements:.1f}x smaller computation tensor!")',
    takeaway: 'Latent diffusion eliminates perceptual redundancy before running iterative generative modeling.'
  },
  {
    id: 'classifier-free-guidance-cfg',
    keywords: ['cfg', 'classifier-free guidance', 'unconditional', 'prompt alignment', 'guidance scale'],
    multilingualKeywords: {
      es: ['guía sin clasificador'],
      hi: ['क्लासिफायर फ्री गाइडेंस'],
      zh: ['无分类器引导'],
      fr: ['guidage sans classificateur'],
      de: ['klassifikatorfreie führung'],
      ar: ['توجيه بدون مصنف']
    },
    title: 'Classifier-Free Guidance (CFG): Controlling Generative Prompt Fidelity',
    category: 'math',
    summary: 'Extrapolating model predictions away from an unconditional baseline to sharply adhere to text prompts.',
    explanation: 'Early conditional diffusion required an auxiliary noisy image classifier to compute grad_x log p(y|x). Ho & Salimans introduced Classifier-Free Guidance (CFG), jointly training a single model on both conditional text prompts c and null prompts empty (dropout rate ~10-20%). During inference, predicted noise is extrapolated using guidance scale w:\neps_guided = eps_uncond + w * (eps_cond - eps_uncond).\nWhen w=1, standard conditional sampling occurs. When w > 1 (e.g. 7.5), samples are pushed strongly toward the prompt features, trading diversity for sharp prompt alignment.',
    codeSnippet: 'import numpy as np\n\ndef apply_cfg(eps_uncond, eps_cond, guidance_scale=7.5):\n    # eps_guided = eps_uncond + scale * (eps_cond - eps_uncond)\n    return eps_uncond + guidance_scale * (eps_cond - eps_uncond)\n\neps_u = np.array([0.2, 0.5])\neps_c = np.array([0.6, 0.9])\neps_final = apply_cfg(eps_u, eps_c, guidance_scale=7.5)\nprint(f"CFG Extrapolated Noise Vector: {eps_final.round(2)}")',
    takeaway: 'CFG amplifies prompt-conditioned signal relative to unconditional drift without needing external classifier models.'
  },
  {
    id: 'controlnet-zero-convolutions',
    keywords: ['controlnet', 'zero convolutions', 'spatial conditioning', 'canny edge', 'pose conditioning'],
    multilingualKeywords: {
      es: ['controlnet', 'convoluciones cero'],
      hi: ['कंट्रोलनेट'],
      zh: ['控制网络', '零卷积'],
      fr: ['controlnet'],
      de: ['controlnet'],
      ar: ['شبكة التحكم']
    },
    title: 'ControlNet & Zero-Convolutions: Preserving Backbone Quality with Spatial Priors',
    category: 'architecture',
    summary: 'Adding strict spatial conditioning (depth, edge, pose) to frozen diffusion backbones using zero-initialized 1x1 convolutions.',
    explanation: 'Fine-tuning a billion-parameter diffusion model on specific conditioning signals (like Canny edges, human pose skeletons, or depth maps) risks catastrophic forgetting. Zhang & Agrawala invented ControlNet:\n1. Lock the production diffusion model backbone weights.\n2. Create a trainable clone of the encoding layers.\n3. Connect the trainable copy to the locked model using "Zero Convolutions" (1x1 conv layers initialized with both weights and biases at exactly 0).\n4. Because weights start at 0, the model output at step 0 is perfectly identical to the base model. As gradient descent proceeds, spatial controls modulate features smoothly without degrading pre-trained image quality.',
    codeSnippet: 'import numpy as np\n\ndef zero_conv_step(feature_map, weights, biases):\n    # Initial state: weights=0, biases=0 -> output=0\n    return feature_map @ weights + biases\n\nfeat = np.random.randn(2, 4)\nW_zero = np.zeros((4, 4))\nb_zero = np.zeros(4)\nout = zero_conv_step(feat, W_zero, b_zero)\nprint(f"Zero Conv Output (Guaranteed Zero at Step 0): {np.all(out == 0)}")',
    takeaway: 'Zero convolutions provide a mathematical guarantee that pre-trained features remain pristine at training initialization.'
  },
  {
    id: 'diffusion-transformer-dit',
    keywords: ['dit', 'diffusion transformer', 'peebles xie', 'sora architecture', 'patchification'],
    multilingualKeywords: {
      es: ['transformador de difusión'],
      hi: ['डिफ्यूजन ट्रांसफॉर्मर'],
      zh: ['扩散变换器', 'dit架构'],
      fr: ['transformateur de diffusion'],
      de: ['diffusions-transformer'],
      ar: ['محول الانتشار']
    },
    title: 'Diffusion Transformers (DiT): Scaling Generative Models via Vision Transformers',
    category: 'architecture',
    summary: 'Replacing traditional convolutional U-Nets with scalable Vision Transformer backbones for modern generative AI.',
    explanation: 'Peebles & Xie (2023) demonstrated that the inductive bias of convolutional U-Nets is unnecessary for high-fidelity diffusion. DiT adapts the standard Vision Transformer (ViT) architecture:\n1. Patchification: Latent feature maps z are flattened into a sequence of non-overlapping visual patches and projected linearly into token embeddings.\n2. Adaptive LayerNorm (adaLN-Zero): Condition tokens (timestep t and class/text embedding c) modulate normalized activations via scale gamma and shift beta parameters: y = gamma * LayerNorm(x) + beta.\n3. Scaling Laws: As model size and compute FLOPs scale up, DiT exhibits consistent power-law improvements in Frechet Inception Distance (FID), forming the foundation of systems like Sora and SD3.',
    codeSnippet: 'import numpy as np\n\ndef patchify_latent(latent_grid, patch_size=2):\n    # latent_grid shape: (H, W, C)\n    H, W, C = latent_grid.shape\n    patches = []\n    for r in range(0, H, patch_size):\n        for c in range(0, W, patch_size):\n            patches.append(latent_grid[r:r+patch_size, c:c+patch_size, :].flatten())\n    return np.array(patches)\n\ngrid = np.random.randn(8, 8, 4) # 8x8 latent with 4 channels\ntokens = patchify_latent(grid, patch_size=2)\nprint(f"Patchified Token Matrix Shape: {tokens.shape} (16 patches x 16 features)")',
    takeaway: 'DiT brings Transformer scaling laws to generative image and video diffusion.'
  },
  {
    id: 'noise-schedulers-cosine-linear',
    keywords: ['noise schedule', 'variance schedule', 'cosine schedule', 'linear schedule', 'nichol dhariwal'],
    multilingualKeywords: {
      es: ['programación de ruido'],
      hi: ['नॉइज़ शेड्यूलर'],
      zh: ['噪声调度器', '余弦调度'],
      fr: ['programme de bruit'],
      de: ['rauschplaner'],
      ar: ['جدولة الضوضاء']
    },
    title: 'Diffusion Noise Schedulers: Linear vs. Cosine Variance Dynamics',
    category: 'math',
    summary: 'Designing mathematical schedules for noise accumulation to preserve semantic image information across timesteps.',
    explanation: 'The original DDPM linear schedule beta_t = beta_1 + (beta_T - beta_1) * (t / T) causes alpha_bar_t to drop too quickly in early timesteps, destroying high-level structural information before step 200. Nichol & Dhariwal introduced the Cosine Schedule:\nalpha_bar_t = cos^2( ((t/T + s) / (1 + s)) * (pi / 2) ) / cos^2( (s / (1 + s)) * (pi / 2) )\nwhere small offset s (e.g. 0.008) prevents beta_t from being too small near t=0. The cosine schedule produces a smooth, gradual degradation of features across all 1000 steps, improving generation quality on small resolutions.',
    codeSnippet: 'import numpy as np\n\ndef cosine_beta_schedule(timesteps=1000, s=0.008):\n    steps = np.arange(timesteps + 1)\n    f_t = np.cos(((steps / timesteps) + s) / (1 + s) * (np.pi / 2)) ** 2\n    alphas_bar = f_t / f_t[0]\n    betas = 1 - (alphas_bar[1:] / alphas_bar[:-1])\n    return np.clip(betas, 0, 0.999)\n\nbetas = cosine_beta_schedule(100)\nprint(f"Cosine Schedule: beta_1={betas[0]:.5f} | beta_mid={betas[50]:.5f} | beta_T={betas[-1]:.5f}")',
    takeaway: 'Cosine schedules distribute information destruction uniformly across timesteps, avoiding abrupt loss of image structure.'
  },
  {
    id: 'continuous-time-sdes',
    keywords: ['continuous time sde', 'score sde', 'variance preserving', 'variance exploding', 'ito calculus'],
    multilingualKeywords: {
      es: ['sde de tiempo continuo'],
      hi: ['कंटीन्यूअस टाइम एसडीई'],
      zh: ['连续时间随机微分方程'],
      fr: ['sde à temps continu'],
      de: ['stochastische differentialgleichung'],
      ar: ['المعادلات التفاضلية العشوائية']
    },
    title: 'Continuous-Time SDEs: Unifying VP, VE & Sub-VP Diffusion Formulations',
    category: 'math',
    summary: 'Unifying all discrete diffusion schedules into a continuous stochastic differential equation framework dx = f(x, t)dt + g(t)dw.',
    explanation: 'Song et al. (2020) proved that discrete diffusion schedules (DDPM and SMLD) are specific discretization schemes of continuous stochastic differential equations (SDEs):\n1. Forward SDE: dx = f(x, t) dt + g(t) dw, where f(x, t) is the drift coefficient and g(t) is the diffusion coefficient.\n2. Variance Preserving (VP SDE): Corresponds to DDPM, maintaining constant variance Var(x_t) = 1.\n3. Variance Exploding (VE SDE): Corresponds to SMLD, where noise grows unbounded Var(x_t) -> inf.\n4. Reverse SDE: dx = [ f(x, t) - g(t)^2 * nabla_x log p_t(x) ] dt + g(t) d_w_bar, enabling sampling by integrating backward in time with estimated scores.',
    codeSnippet: 'import numpy as np\n\n# VP SDE Drift and Diffusion Coefficients\ndef vp_sde_coefficients(beta_min=0.1, beta_max=20.0, t=0.5):\n    beta_t = beta_min + t * (beta_max - beta_min)\n    drift_coef = -0.5 * beta_t\n    diffusion_coef = np.sqrt(beta_t)\n    return drift_coef, diffusion_coef\n\ndrift, diff = vp_sde_coefficients(t=0.5)\nprint(f"At t=0.5: Drift Coefficient={drift:.3f} | Diffusion Coefficient={diff:.3f}")',
    takeaway: 'Continuous SDEs unbind diffusion models from fixed step counts, enabling adaptive step-size ODE/SDE solvers.'
  },
  {
    id: 'inpainting-masked-conditioning',
    keywords: ['inpainting', 'masked diffusion', 'image editing', 'repaint', 'latent blending'],
    multilingualKeywords: {
      es: ['inpainting', 'difusión enmascarada'],
      hi: ['इनपेंटिंग'],
      zh: ['图像修复', '掩码扩散'],
      fr: ['inpainting'],
      de: ['inpainting'],
      ar: ['ترميم الصور']
    },
    title: 'Inpainting & Generative Fill: Mask-Guided Latent Boundary Blending',
    category: 'labs',
    summary: 'Restoring or editing local image regions by seamlessly blending noisy known context with generated fills at each reverse step.',
    explanation: 'Inpainting fills missing image regions while preserving unmasked context. The RePaint algorithm operates without retraining the model:\nAt each reverse timestep t -> t-1:\n1. Known Pixels: Forward-diffuse the original unmasked image x_0 to time t-1 by adding exact Gaussian noise: x_{known, t-1} = sqrt(alpha_bar) * x_0 + sqrt(1 - alpha_bar) * eps.\n2. Unknown Pixels: Predict the reverse step using the model: x_{unknown, t-1} = Denoise(x_t).\n3. Blending: Combine the two using binary mask M: x_{t-1} = M * x_{known, t-1} + (1 - M) * x_{unknown, t-1}.\n4. Resampling: Re-diffuse and denoise multiple times per step to harmonize the seams along mask borders.',
    codeSnippet: 'import numpy as np\n\ndef blend_inpaint_step(x_known_noisy, x_generated, mask):\n    # mask = 1 for keep original, 0 for inpaint fill\n    return mask * x_known_noisy + (1.0 - mask) * x_generated\n\nx_known = np.array([1.0, 1.0, 1.0])\nx_gen = np.array([0.2, 0.4, 0.8])\nmask = np.array([1.0, 0.0, 1.0]) # Middle element masked\nblended = blend_inpaint_step(x_known, x_gen, mask)\nprint(f"Blended Inpainting Latent: {blended}")',
    takeaway: 'Latent blending fuses pristine source context with generative synthesis without seams.'
  },
  {
    id: 'ip-adapter-cross-attention',
    keywords: ['ip-adapter', 'image prompt adapter', 'decoupled cross-attention', 'image conditioning', 'style transfer'],
    multilingualKeywords: {
      es: ['adaptador de imagen ip'],
      hi: ['आईपी एडेप्टर'],
      zh: ['图像提示适配器', '解耦交叉注意力'],
      fr: ['ip-adapter'],
      de: ['ip-adapter'],
      ar: ['محول موجه الصور']
    },
    title: 'IP-Adapter: Decoupled Cross-Attention for High-Fidelity Image Prompting',
    category: 'architecture',
    summary: 'Conditioning diffusion on reference images using dedicated, decoupled cross-attention layers.',
    explanation: 'Standard text-to-image models inject text embeddings into U-Net feature maps using cross-attention: Attention(Q, K_text, V_text). Merging image CLIP embeddings into the same text projection matrices causes interference, muddying both style and subject details. Ye et al. introduced IP-Adapter:\n• Maintain the original frozen text cross-attention layers.\n• Add a secondary, lightweight cross-attention layer dedicated exclusively to image feature embeddings (K_img, V_img).\n• The final attention output is the sum of both paths: Z = Softmax(Q K_text^T / sqrt(d)) V_text + lambda * Softmax(Q K_img^T / sqrt(d)) V_img.\n• Enables reference image prompting and character consistency with zero degradation of text prompt following.',
    codeSnippet: 'import numpy as np\n\ndef decoupled_cross_attention(Q, K_txt, V_txt, K_img, V_img, img_scale=0.8):\n    # Path 1: Text attention\n    attn_txt = (Q @ K_txt.T) / np.sqrt(Q.shape[-1])\n    out_txt = np.exp(attn_txt) / np.sum(np.exp(attn_txt)) @ V_txt\n    # Path 2: Decoupled Image attention\n    attn_img = (Q @ K_img.T) / np.sqrt(Q.shape[-1])\n    out_img = np.exp(attn_img) / np.sum(np.exp(attn_img)) @ V_img\n    return out_txt + img_scale * out_img\n\nq = np.ones((1, 4))\nout = decoupled_cross_attention(q, q, q, q, q, img_scale=0.5)\nprint(f"Decoupled Output Norm: {np.linalg.norm(out):.3f}")',
    takeaway: 'Decoupled cross-attention isolates visual reference features from textual semantics, avoiding prompt competition.'
  },
  {
    id: 'stable-video-diffusion-temporal',
    keywords: ['video diffusion', 'temporal attention', 'svd', 'frame consistency', '3d unet'],
    multilingualKeywords: {
      es: ['difusión de video', 'atención temporal'],
      hi: ['वीडियो डिफ्यूजन'],
      zh: ['视频扩散', '时序注意力'],
      fr: ['diffusion vidéo'],
      de: ['video-diffusionsmodell'],
      ar: ['انتشار الفيديو']
    },
    title: 'Video Diffusion Models: Temporal Attention & Multi-Frame Coherence',
    category: 'architecture',
    summary: 'Generating smooth multi-frame video by interleaving 2D spatial attention with 1D temporal attention layers.',
    explanation: 'Generating video requires high visual spatial quality within each frame and smooth motion consistency across consecutive frames. Video Diffusion Models (VDM) inflate pre-trained 2D image models into pseudo-3D networks:\n1. Spatial Layers (Frozen/Fine-tuned): 2D convolutions and spatial self-attention process each video frame independently (Batch * Frames, Channels, Height, Width).\n2. Temporal Attention Layers (Trained): 1D self-attention applied across the time dimension (Batch * Height * Width, Frames, Channels), allowing each pixel to query its past and future trajectory.\n3. Temporal Convolution: 1D causal convolutions smooth frame transitions, eliminating flicker and temporal artifacts across 25+ frames.',
    codeSnippet: 'import numpy as np\n\n# Pseudo-3D Feature Reshaping: (B, F, H, W, C)\nB, F, H, W, C = 1, 16, 32, 32, 64\nvideo_tensor = np.zeros((B, F, H, W, C))\n\n# Spatial Processing Shape: (B*F, H, W, C)\nspatial_view = video_tensor.reshape(B * F, H, W, C)\n# Temporal Processing Shape: (B*H*W, F, C)\ntemporal_view = video_tensor.transpose(0, 2, 3, 1, 4).reshape(B * H * W, F, C)\nprint(f"Spatial View: {spatial_view.shape} | Temporal Attention View: {temporal_view.shape}")',
    takeaway: 'Factorizing 3D video into separate spatial and temporal attention passes prevents memory explosion while enforcing temporal consistency.'
  },
  {
    id: 'progressive-distillation-diffusion',
    keywords: ['progressive distillation', 'salimans ho', 'step reduction', 'student teacher', 'diffusion speedup'],
    multilingualKeywords: {
      es: ['destilación progresiva'],
      hi: ['प्रोग्रेसिव डिस्टिलेशन'],
      zh: ['渐进式蒸馏', '模型加速'],
      fr: ['distillation progressive'],
      de: ['progressive destillation'],
      ar: ['التقطير التدريجي']
    },
    title: 'Progressive Distillation: Compressing 1024 Denoising Steps into 4 Steps',
    category: 'math',
    summary: 'Iteratively halving the required sampling steps of a diffusion model by training student models to predict two teacher steps in one.',
    explanation: 'Salimans & Ho (2022) established Progressive Distillation to eliminate the inference speed penalty of diffusion models:\n1. Begin with an N-step teacher model (e.g. N=1024).\n2. Train an N/2-step student model (N=512) where each student step matches the combined ODE trajectory of two consecutive teacher steps.\n3. The student model becomes the teacher for the next iteration (512 -> 256 -> 128 -> ... -> 4).\n4. After log_2(N) training cycles, the final student generates high-quality images in just 2 to 4 forward passes without stochastic sampling degradation.',
    codeSnippet: 'import numpy as np\n\ndef distillation_halving_rounds(initial_steps=1024, target_steps=4):\n    current = initial_steps\n    rounds = 0\n    while current > target_steps:\n        current //= 2\n        rounds += 1\n    return rounds\n\nrounds = distillation_halving_rounds(1024, 4)\nprint(f"Distillation from 1024 to 4 steps requires exactly {rounds} halving stages.")',
    takeaway: 'Progressive distillation recursively halves step counts by training student networks to jump two ODE steps simultaneously.'
  },
  {
    id: 'ddpo-diffusion-policy-rl',
    keywords: ['ddpo', 'diffusion rl', 'black et al', 'reward fine-tuning', 'policy gradient diffusion'],
    multilingualKeywords: {
      es: ['optimización de política de difusión'],
      hi: ['डिफ्यूजन पॉलिसी आरएल'],
      zh: ['扩散策略优化', 'ddpo算法'],
      fr: ['optimisation de politique de diffusion'],
      de: ['diffusions-policy-optimierung'],
      ar: ['تحسين سياسة الانتشار']
    },
    title: 'Diffusion Direct Policy Optimization (DDPO): Reinforcement Learning on Generated Imagery',
    category: 'math',
    summary: 'Fine-tuning diffusion models directly for downstream objective rewards (aesthetic quality, compression ratio, safety).',
    explanation: 'Standard supervised fine-tuning of diffusion models cannot optimize non-differentiable rewards like human aesthetic ratings, text compressibility, or safety classifier scores. Black et al. (2023) formulated diffusion sampling as a Multi-Step Markov Decision Process (MDP) and applied Policy Gradient methods:\n1. State: The noisy image x_t at timestep t.\n2. Action: The denoising update x_{t-1}.\n3. Policy: The stochastic transition p_theta(x_{t-1} | x_t).\n4. Reward R(x_0): Evaluated strictly on the final denoised image at t=0.\n5. Policy Gradient Loss: Backpropagates reward gradients across the entire sampling trajectory using Importance Sampling weights, maximizing aesthetic scores without mode collapse.',
    codeSnippet: 'import numpy as np\n\ndef ddpo_importance_ratio(log_p_new, log_p_old):\n    # Importance weight w = exp(log_p_new - log_p_old)\n    return np.exp(log_p_new - log_p_old)\n\nratio = ddpo_importance_ratio(log_p_new=-2.1, log_p_old=-2.3)\nreward = 8.5 # High aesthetic score\npolicy_loss = -ratio * reward\nprint(f"DDPO Policy Loss Contribution: {policy_loss:.3f}")',
    takeaway: 'DDPO frames diffusion sampling as an MDP, enabling reinforcement learning optimization against arbitrary non-differentiable rewards.'
  },

  // ===========================================================================
  // 2. FRONTIER REINFORCEMENT LEARNING & REASONING (15 TOPICS)
  // ===========================================================================
  {
    id: 'grpo-group-relative-policy',
    keywords: ['grpo', 'group relative policy', 'deepseek r1', 'critic free', 'reinforcement learning', 'reasoning models'],
    multilingualKeywords: {
      es: ['grpo', 'optimización relativa de grupo'],
      hi: ['जीआरपीओ', 'डीपसीक आर१'],
      zh: ['组相对策略优化', 'grpo算法'],
      fr: ['grpo', 'optimisation de politique de groupe'],
      de: ['gruppenrelative policy-optimierung'],
      ar: ['تحسين السياسة النسبية الجماعية']
    },
    title: 'Group Relative Policy Optimization (GRPO): Critic-Free Reasoning RL (DeepSeek-R1)',
    category: 'math',
    summary: 'Eliminating the separate value critic model by normalizing rewards across a group of sampled responses for the same prompt.',
    explanation: 'Traditional PPO requires training two equally large models simultaneously: the Actor policy pi_theta and the Critic value network V_phi, consuming 2x GPU memory and introducing value estimation instabilities. DeepSeek-R1 introduced GRPO:\n1. Group Sampling: For each prompt q, sample a group of G outputs {o_1, o_2, ..., o_G} from the current policy.\n2. Relative Advantage Normalization: Compute scalar reward r_i for each output. Instead of baseline V(q), compute normalized advantage: A_i = (r_i - mean(r)) / (std(r) + eps).\n3. Surrogate Objective: Optimize clipped policy ratio min( (pi(o_i)/pi_old(o_i)) * A_i, clip(...) * A_i ) penalized by KL divergence from reference model.\n4. Result: 50% less VRAM and exceptional stability on verifiable math and code reasoning tasks.',
    codeSnippet: 'import numpy as np\n\ndef compute_grpo_advantages(rewards):\n    # Normalized advantage over group samples without a critic model\n    r = np.array(rewards)\n    std = np.std(r)\n    eps = 1e-6\n    advantages = (r - np.mean(r)) / (std + eps)\n    return advantages\n\n# Group of 4 sampled answers to a math problem with correctness scores\nsample_rewards = [1.0, 0.0, 1.0, 0.0]\nadvs = compute_grpo_advantages(sample_rewards)\nprint(f"GRPO Group Advantages: {advs.round(3)}")',
    takeaway: 'GRPO eliminates the actor-critic memory footprint by calculating baseline advantages across a group of sampled rollouts.'
  },
  {
    id: 'rlvr-verifiable-rewards',
    keywords: ['rlvr', 'verifiable rewards', 'ground truth rl', 'math reasoning', 'code execution reward'],
    multilingualKeywords: {
      es: ['recompensas verificables'],
      hi: ['सत्यापन योग्य पुरस्कार'],
      zh: ['可验证奖励强化学习'],
      fr: ['récompenses vérifiables'],
      de: ['verifizierbare belohnungen'],
      ar: ['مكافآت قابلة للتحقق']
    },
    title: 'Reinforcement Learning with Verifiable Rewards (RLVR)',
    category: 'curriculum',
    summary: 'Training reasoning LLMs using deterministic ground-truth execution signals rather than subjective reward models.',
    explanation: 'Reward models trained on human preferences (RLHF) suffer from reward hacking—models learn to output polite, sycophantic, or verbosely confident non-answers. RLVR replaces subjective scoring with deterministic ground-truth verification:\n1. Formal Math: Answers are parsed and checked for exact equivalence against canonical symbolic solutions (SymPy).\n2. Software Engineering: Code outputs are executed inside isolated sandboxes (WASM/Docker) against comprehensive unit test suites.\n3. Binary Reward: The reward is strictly 1.0 (all tests pass) or 0.0 (any assertion failure or compilation error).\n4. Eliminates reward model drift, enabling autonomous emergence of long thinking chains and self-correcting reasoning.',
    codeSnippet: '# Deterministic Code Execution Verifier\ndef verify_code_solution(user_code, test_cases):\n    # Sandboxed execution simulation\n    for input_val, expected in test_cases:\n        # Simulated execution result\n        result = eval(f"lambda x: x * 2") (input_val) \n        if result != expected:\n            return 0.0 # Strict binary failure\n    return 1.0 # Verifiable success\n\ntests = [(2, 4), (5, 10), (0, 0)]\nreward = verify_code_solution("def double(x): return x * 2", tests)\nprint(f"RLVR Deterministic Ground-Truth Reward: {reward}")',
    takeaway: 'Verifiable rewards eliminate reward hacking by grading models on deterministic truth rather than subjective opinions.'
  },
  {
    id: 'prm-vs-orm-process-rewards',
    keywords: ['prm', 'orm', 'process reward model', 'outcome reward model', 'step by step supervision', 'lightman et al'],
    multilingualKeywords: {
      es: ['modelo de recompensa de proceso'],
      hi: ['प्रोसेस बनाम आउटकम रिवॉर्ड'],
      zh: ['过程奖励模型', 'prm模型'],
      fr: ['modèle de récompense de processus'],
      de: ['prozess-belohnungsmodell'],
      ar: ['نموذج مكافأة العملية']
    },
    title: 'Process Reward Models (PRM) vs. Outcome Reward Models (ORM)',
    category: 'math',
    summary: 'Guiding multi-step reasoning by scoring every individual reasoning step rather than evaluating only the final answer.',
    explanation: 'Outcome Reward Models (ORM) evaluate only the final output (x_T). If a model makes a fatal algebraic error at step 3 but fortuitously stumbles into the right answer at step 10, an ORM assigns a positive reward, reinforcing bad logic. Process Reward Models (PRM, Lightman et al., 2023):\n1. Stepwise Feedback: Score every intermediate reasoning step r(s_1), r(s_2), ..., r(s_T).\n2. Error Localization: Identifies the exact step where hallucinations or logical fallacies begin.\n3. Best-of-N Search: Reranks candidate reasoning paths by taking the product or minimum of step-wise probabilities: Score(path) = min_t p(s_t is valid).\n4. Dramatic scaling improvements on competition-level math benchmarks (MATH, GSM8K).',
    codeSnippet: 'import numpy as np\n\ndef prm_path_score(step_probabilities, method="min"):\n    # Min aggregation: weakest link in the reasoning chain\n    if method == "min":\n        return np.min(step_probabilities)\n    return np.prod(step_probabilities)\n\n# Candidate 1: Flawless logic (all steps > 0.95)\npath_1 = [0.98, 0.96, 0.99, 0.95]\n# Candidate 2: Early hallucination, lucky guess\npath_2 = [0.99, 0.22, 0.85, 0.99]\nprint(f"Path 1 Score: {prm_path_score(path_1):.3f} | Path 2 Score: {prm_path_score(path_2):.3f}")',
    takeaway: 'PRMs catch logical errors at the source step, preventing models from being rewarded for lucky wrong reasoning.'
  },
  {
    id: 'mcts-test-time-compute',
    keywords: ['mcts', 'monte carlo tree search', 'test-time compute', 'uct formula', 'tree search reasoning'],
    multilingualKeywords: {
      es: ['búsqueda de árbol monte carlo'],
      hi: ['मोंटे कार्लो ट्री सर्च'],
      zh: ['蒙特卡洛树搜索', '测试时计算'],
      fr: ['recherche arborescente de monte-carlo'],
      de: ['monte-carlo-baumsuchverfahren'],
      ar: ['بحث شجرة مونت كارلو']
    },
    title: 'Monte Carlo Tree Search (MCTS) & Test-Time Compute Scaling',
    category: 'architecture',
    summary: 'Scaling inference-time compute by exploring multiple reasoning trajectories using Upper Confidence Bounds (UCT).',
    explanation: 'Scaling pre-training compute faces data exhaustion and electrical grid bottlenecks. Test-Time Compute scaling trades inference latency for superhuman reasoning using MCTS:\n1. Selection: Traverse the reasoning tree using the UCT criterion: UCT = Q(s, a) + c * P(s, a) * sqrt(N(s)) / (1 + N(s, a)), balancing high-reward paths with under-explored logical steps.\n2. Expansion: Generate K alternative reasoning steps using the policy model.\n3. Simulation / Evaluation: Score candidate expansions using a Process Reward Model (PRM) or fast rollout.\n4. Backpropagation: Propagate the step evaluation back up the tree to update visit counts N and value estimates Q.',
    codeSnippet: 'import numpy as np\n\ndef uct_score(Q, P, N_parent, N_child, c_param=1.414):\n    exploration = c_param * P * np.sqrt(N_parent) / (1 + N_child)\n    return Q + exploration\n\n# Child A: Explored often with high score\nscore_a = uct_score(Q=0.85, P=0.7, N_parent=100, N_child=30)\n# Child B: Rarely explored, high potential\nscore_b = uct_score(Q=0.60, P=0.3, N_parent=100, N_child=2)\nprint(f"Child A UCT: {score_a:.3f} | Child B UCT (Exploration Boost): {score_b:.3f}")',
    takeaway: 'MCTS enables deliberate systemic thinking at inference time by balancing exploitation of valid logic with exploration.'
  },
  {
    id: 'self-rewarding-language-models',
    keywords: ['self-rewarding', 'iterative dpo', 'llm as a judge', 'bootstrapping', 'autonomous alignment'],
    multilingualKeywords: {
      es: ['modelos de lenguaje auto-recompensados'],
      hi: ['सेल्फ रिवार्डिंग मॉडल्स'],
      zh: ['自我奖励语言模型'],
      fr: ['modèles auto-récompensés'],
      de: ['selbstbelohnende sprachmodelle'],
      ar: ['نماذج اللغة ذاتية المكافأة']
    },
    title: 'Self-Rewarding Language Models: Autonomous Post-Training via Iterative DPO',
    category: 'architecture',
    summary: 'Overcoming human feedback data bottlenecks by enabling an LLM to evaluate and rank its own responses iteratively.',
    explanation: 'Traditional RLHF is bottlenecked by the cost, latency, and quality ceilings of human annotators. Yuan et al. (Meta, 2024) introduced Self-Rewarding Language Models:\n1. Dual Competency: A single model is fine-tuned to act as both an instruction-following agent and an LLM-as-a-Judge evaluator using structured Likert rubrics.\n2. Iterative Generation: At iteration M, the model generates multiple candidate responses for novel prompts.\n3. Self-Evaluation: The model evaluates its own responses, creating pairs of chosen (high score) and rejected (low score) outputs.\n4. Iterative DPO: The model updates itself using DPO on its self-curated dataset. Both instruction-following and self-critiquing abilities improve across iterations (M1 -> M2 -> M3).',
    codeSnippet: 'def self_curate_dpo_pair(responses, judge_scores):\n    # Pair highest-rated output with lowest-rated output\n    ranked = sorted(zip(responses, judge_scores), key=lambda x: x[1], reverse=True)\n    chosen, chosen_score = ranked[0]\n    rejected, rejected_score = ranked[-1]\n    if chosen_score - rejected_score >= 2.0: # Sufficient margin\n        return {"chosen": chosen, "rejected": rejected, "margin": chosen_score - rejected_score}\n    return None\n\npair = self_curate_dpo_pair(["Detailed step-by-step math", "Vague answer"], [4.8, 1.5])\nprint("Curated Pair Margin:", pair["margin"])',
    takeaway: 'Self-rewarding loops enable continuous model capability growth through self-evaluation and iterative DPO.'
  },
  {
    id: 'star-self-taught-reasoner',
    keywords: ['star', 'self-taught reasoner', 'zelikman', 'bootstrapping reasoning', 'rationale generation'],
    multilingualKeywords: {
      es: ['razonador autodidacta'],
      hi: ['एसटीएआर'],
      zh: ['自我演进推理者', 'star算法'],
      fr: ['raisonneur autodidacte'],
      de: ['selbstlernender logiker'],
      ar: ['المستدل ذاتي التعلم']
    },
    title: 'STaR (Self-Taught Reasoner): Bootstrapping Reasoning with Rationales',
    category: 'curriculum',
    summary: 'Bootstrapping reasoning capabilities from scratch by generating, filtering, and fine-tuning on correct reasoning rationales.',
    explanation: 'Teaching models to reason step-by-step usually requires massive, hand-crafted chain-of-thought datasets. Zelikman et al. (2022) created the STaR loop:\n1. Generate Rationales: Present the model with a dataset of questions and ground-truth answers. The model generates chain-of-thought rationales.\n2. Filter on Ground Truth: If the model arrives at the correct final answer, the question + rationale + answer sequence is retained.\n3. Rationalization (Failure Recovery): If the model fails, provide the correct ground-truth answer as a hint and ask the model to generate a post-hoc rationale justifying it.\n4. Fine-Tune: Re-train the model on all verified rationales. Repeating this cycle bootstraps complex reasoning from a small set of prompt questions.',
    codeSnippet: 'def star_filter(question, rationale, model_ans, ground_truth):\n    # Strict verification filter: only save rationale if final answer matches\n    if model_ans.strip().lower() == ground_truth.strip().lower():\n        return {"prompt": question, "thought": rationale, "answer": ground_truth, "status": "VERIFIED"}\n    return None\n\nentry = star_filter("5 + 3 * 2", "Multiplication first: 3*2=6, then 5+6=11", "11", "11")\nprint(f"STaR Dataset Status: {entry[\'status\']} | Saved reasoning: {entry[\'thought\']}")',
    takeaway: 'STaR bootstraps reasoning without human intervention by filtering out generated rationales that lead to wrong answers.'
  },
  {
    id: 'ppo-clipped-surrogate-objective',
    keywords: ['ppo', 'clipped surrogate', 'schulman', 'policy gradient', 'trust region'],
    multilingualKeywords: {
      es: ['ppo', 'objetivo subrogado recortado'],
      hi: ['पीपीओ', 'प्रॉक्सिमल पॉलिसी'],
      zh: ['近端策略优化', '剪切替代目标'],
      fr: ['optimisation de politique proximale'],
      de: ['proximale policy-optimierung'],
      ar: ['تحسين السياسة القريبة']
    },
    title: 'Proximal Policy Optimization (PPO): The Clipped Surrogate Objective',
    category: 'math',
    summary: 'Stabilizing reinforcement learning updates by preventing the new policy from straying too far from the old policy.',
    explanation: 'Standard policy gradient methods take excessively large parameter steps that can permanently degrade model capabilities. Schulman et al. (2017) created PPO with a clipped surrogate objective:\nL_CLIP(theta) = E [ min( r_t(theta) * A_t, clip(r_t(theta), 1 - epsilon, 1 + epsilon) * A_t ) ]\nwhere r_t(theta) = pi_theta(a_t | s_t) / pi_theta_old(a_t | s_t) is the probability ratio between new and old policies.\nIf advantage A_t > 0, the ratio is bounded from above by 1 + epsilon (e.g. 1.2), preventing over-optimistic updates. If A_t < 0, the ratio is bounded from below by 1 - epsilon (0.8), preventing catastrophic policy collapse.',
    codeSnippet: 'import numpy as np\n\ndef ppo_clipped_loss(pi_new_prob, pi_old_prob, advantage, eps_clip=0.2):\n    ratio = pi_new_prob / pi_old_prob\n    surr1 = ratio * advantage\n    surr2 = np.clip(ratio, 1.0 - eps_clip, 1.0 + eps_clip) * advantage\n    # Negative for gradient ascent (loss minimization)\n    return -np.min([surr1, surr2])\n\nloss = ppo_clipped_loss(pi_new_prob=1.4, pi_old_prob=1.0, advantage=2.5, eps_clip=0.2)\nprint(f"PPO Clipped Objective Loss: {loss:.3f} (Clipped at ratio 1.2)")',
    takeaway: 'The PPO clip parameter bounds policy update steps, preventing catastrophic policy degradation in RL.'
  },
  {
    id: 'gae-generalized-advantage-estimation',
    keywords: ['gae', 'generalized advantage estimation', 'temporal difference', 'monte carlo return', 'variance reduction'],
    multilingualKeywords: {
      es: ['estimación de ventaja generalizada'],
      hi: ['सामान्यीकृत लाभ अनुमान'],
      zh: ['广义优势估计', 'gae算法'],
      fr: ['estimation d avantage généralisée'],
      de: ['generalisierte vorteilsschätzung'],
      ar: ['تقدير الميزة المعمم']
    },
    title: 'Generalized Advantage Estimation (GAE): The Bias-Variance Tradeoff in RL',
    category: 'math',
    summary: 'Balancing bias and variance in policy gradients using an exponentially-weighted average of temporal difference residuals.',
    explanation: 'In policy gradients, computing Advantage A(s, a) = Q(s, a) - V(s) faces a fundamental dilemma:\n• Monte Carlo empirical returns are completely unbiased but suffer from high variance across long sequences.\n• 1-step TD errors delta_t = r_t + gamma * V(s_{t+1}) - V(s_t) have minimal variance but high bias from inaccurate value estimates V.\nSchulman et al. formulated GAE:\nA_t^GAE(gamma, lambda) = sum_{l=0}^{inf} (gamma * lambda)^l * delta_{t+l}.\nParameter lambda in [0, 1] interpolates smoothly: lambda=0 yields 1-step TD (low variance, high bias); lambda=1 yields full Monte Carlo (high variance, zero bias).',
    codeSnippet: 'import numpy as np\n\ndef compute_gae(deltas, gamma=0.99, lam=0.95):\n    advantages = np.zeros_like(deltas, dtype=float)\n    acc = 0.0\n    for t in reversed(range(len(deltas))):\n        acc = deltas[t] + gamma * lam * acc\n        advantages[t] = acc\n    return advantages\n\ntd_residuals = np.array([1.2, -0.4, 0.8, 0.1])\ngae_advs = compute_gae(td_residuals)\nprint(f"GAE Smoothed Advantage Estimates: {gae_advs.round(3)}")',
    takeaway: 'GAE provides an exponential discount parameter lambda that controls the bias-variance tradeoff in reinforcement learning.'
  },
  {
    id: 'constitutional-ai-rlaif',
    keywords: ['constitutional ai', 'rlaif', 'anthropic', 'principles', 'critique revision', 'harmlessness'],
    multilingualKeywords: {
      es: ['ia constitucional'],
      hi: ['संवैधानिक एआई'],
      zh: ['宪法ai', '原则驱动对齐'],
      fr: ['ia constitutionnelle'],
      de: ['konstitutionelle ki'],
      ar: ['الذكاء الاصطناعي الدستوري']
    },
    title: 'Constitutional AI: Principle-Guided Self-Critique & RLAIF Alignment',
    category: 'governance',
    summary: 'Aligning foundation models using a written set of natural-language principles rather than human crowd-worker feedback.',
    explanation: 'Human crowd-sourced labeling for RLHF is prone to inconsistent standards and human bias. Bai et al. (Anthropic, 2022) developed Constitutional AI:\n1. Written Constitution: A concise list of guiding principles (e.g. "Choose the response that is least harmful, respects user autonomy, and explains safety boundaries without being patronizing").\n2. Critique & Revision: Present the model with its own potentially unsafe or unhelpful output, instruct it to critique the text against specific constitutional principles, and generate a revised response.\n3. RLAIF (RL from AI Feedback): Train a preference model on AI-evaluated pairwise comparisons based on constitutional criteria, removing human labor bottlenecks from safety alignment.',
    codeSnippet: 'constitution = [\n    "Principle 1: Do not provide actionable instructions for hazardous physical harm.",\n    "Principle 2: Remain objective, calm, and informative without scolding the user."\n]\n\ndef constitutional_critique(draft, principle):\n    # Synthetic critique prompt generator\n    return f"Critique draft: \'{draft}\'\\nAgainst: {principle}\\nRevision: Provide benign scientific context."\n\nrev = constitutional_critique("How do chemicals explode?", constitution[0])\nprint("Constitutional Revision Workflow Initiated:\\n", rev)',
    takeaway: 'Constitutional AI replaces opaque human preference judgments with transparent, editable natural language principles.'
  },
  {
    id: 'kto-kahneman-tversky-optimization',
    keywords: ['kto', 'kahneman tversky', 'prospect theory', 'loss aversion', 'binary feedback', 'contextualai'],
    multilingualKeywords: {
      es: ['optimización kahneman-tversky'],
      hi: ['केटीओ'],
      zh: ['前景理论优化', 'kto对齐'],
      fr: ['optimisation kahneman-tversky'],
      de: ['kahneman-tversky-optimierung'],
      ar: ['تحسين كانيمان تفيرسكي']
    },
    title: 'Kahneman-Tversky Optimization (KTO): Human Prospect Theory Alignment',
    category: 'math',
    summary: 'Aligning language models directly from unpaired binary signals (thumbs up/down) grounded in behavioral economics.',
    explanation: 'DPO requires paired data (every prompt x must have both a chosen y_w and a rejected y_l output). In production, real-world user logs consist of unpaired binary signals (e.g. user gave a thumbs up, or user clicked copy). Ethayarajh et al. (Contextual AI, 2024) designed KTO:\n• Rooted in Kahneman & Tversky’s Prospect Theory: Humans perceive losses more severely than equivalent gains (loss aversion).\n• The KTO loss maximizes the utility function: U(x, y) = 1 - sigma( beta * (r(x, y) - z_ref) ) for undesirable outputs, and sigma( beta * (r(x, y) - z_ref) ) for desirable outputs.\n• Because it operates on unpaired binary signals, models can be aligned directly from real-world telemetry logs.',
    codeSnippet: 'import numpy as np\n\ndef kto_loss_per_sample(implicit_reward, ref_point, is_desirable, beta=0.1):\n    diff = beta * (implicit_reward - ref_point)\n    sigmoid = 1.0 / (1.0 + np.exp(-diff))\n    # Desirable sample utility vs Undesirable sample penalty\n    if is_desirable:\n        return -np.log(sigmoid)\n    return -np.log(1.0 - sigmoid)\n\nloss_pos = kto_loss_per_sample(implicit_reward=2.5, ref_point=1.0, is_desirable=True)\nloss_neg = kto_loss_per_sample(implicit_reward=0.2, ref_point=1.0, is_desirable=False)\nprint(f"KTO Losses: Positive={loss_pos:.3f} | Negative={loss_neg:.3f}")',
    takeaway: 'KTO frees alignment from paired datasets, directly training models on unpaired thumbs up/down user signals.'
  },
  {
    id: 'direct-nash-optimization',
    keywords: ['direct nash', 'dno', 'game theory', 'two player zero sum', 'intransitive preferences', 'self play'],
    multilingualKeywords: {
      es: ['optimización directa de nash'],
      hi: ['डायरेक्ट नैश ऑप्टिमाइजेशन'],
      zh: ['纳什均衡优化', '博弈论对齐'],
      fr: ['optimisation directe de nash'],
      de: ['direkte nash-optimierung'],
      ar: ['تحسين ناش المباشر']
    },
    title: 'Direct Nash Optimization (DNO): Game-Theoretic Multi-Model Preference Equilibria',
    category: 'math',
    summary: 'Resolving non-transitive human preferences (rock-paper-scissors cycles) using two-player zero-sum Nash equilibria.',
    explanation: 'Standard RLHF and DPO assume transitive Bradley-Terry preferences: if A is preferred to B, and B is preferred to C, then A must be preferred to C. In practice, human preferences are non-transitive (e.g. style A beats B in brevity, B beats C in detail, but C beats A in clarity). Direct Nash Optimization (DNO, Rosset et al., 2024):\n1. Game Formulation: Frames alignment as a two-player zero-sum symmetric game between candidate policies pi_1 and pi_2.\n2. Nash Equilibrium: Finds policy pi* such that no alternative policy pi can achieve expected preference win-rate exceeding 50% against it: E_{y1 ~ pi*, y2 ~ pi} [ P(y1 > y2) ] >= 0.5.\n3. Eliminates policy cycling and over-optimization vulnerabilities on complex qualitative benchmarks.',
    codeSnippet: 'import numpy as np\n\n# Payoff matrix for 3 competing response styles (Rock-Paper-Scissors cycle)\n# Positive value means row beats column\npayoff = np.array([\n    [0.0,  1.0, -1.0],\n    [-1.0, 0.0,  1.0],\n    [1.0, -1.0,  0.0]\n])\n\n# Nash equilibrium distribution: Equal mixture [1/3, 1/3, 1/3]\nnash_policy = np.array([1/3, 1/3, 1/3])\nexpected_payoff = nash_policy @ payoff @ nash_policy\nprint(f"Nash Equilibrium Expected Game Value: {expected_payoff:.4f} (Unexploitable)")',
    takeaway: 'DNO solves cyclical human preferences by computing game-theoretic Nash equilibrium policies.'
  },
  {
    id: 'chain-of-thought-backtracking',
    keywords: ['cot backtracking', 'error recovery', 'state rollback', 'deliberate thinking', 'self correction'],
    multilingualKeywords: {
      es: ['retroceso de cadena de pensamiento'],
      hi: ['बैकट्रैकिंग'],
      zh: ['思维链回溯', '自我纠错'],
      fr: ['retour arrière cot'],
      de: ['backtracking in gedankenketten'],
      ar: ['التراجع في سلسلة التفكير']
    },
    title: 'Chain-of-Thought Backtracking: Dynamic State Recovery from Dead Ends',
    category: 'curriculum',
    summary: 'Allowing thinking models to recognize dead ends, roll back intermediate tokens, and explore alternative solution paths.',
    explanation: 'Standard autoregressive transformers generate tokens strictly left-to-right without the ability to erase mistakes. When a model commits to a flawed initial assumption, subsequent tokens attempt to rationalize the error. Modern reasoning systems (o1, DeepSeek-R1) train explicit backtracking behavior:\n1. Trigger Phrases: The model generates explicit self-critique tokens: "Wait, let me recalculate that...", "This contradicts the earlier theorem. Let me restart from step 2."\n2. Hypothesis Branching: The model articulates why the previous branch failed before opening a secondary reasoning path.\n3. Verification Tokens: Generates parity checks before committing to the final answer box.\n4. Enables super-human problem solving on olympiad-level physics and competitive programming.',
    codeSnippet: 'reasoning_trace = [\n    "Step 1: Assume x is positive.",\n    "Step 2: Calculate x^2 + 5 = 1 -> x^2 = -4.",\n    "Wait, x^2 cannot be negative for real numbers. My initial assumption in Step 1 was flawed.",\n    "Step 3 (Backtrack): Consider complex domain x = 2i.",\n    "Final Answer: x = 2i"\n]\n\nfor i, step in enumerate(reasoning_trace):\n    if "wait" in step.lower() or "backtrack" in step.lower():\n        print(f"[Self-Correction Triggered at Step {i}]: {step}")',
    takeaway: 'Backtracking enables models to recover from dead ends instead of persistently hallucinating false logic.'
  },
  {
    id: 'model-based-tool-rollouts',
    keywords: ['tool rollouts', 'simulated actions', 'world models', 'speculative tool use', 'agent planning'],
    multilingualKeywords: {
      es: ['despliegues de herramientas simulados'],
      hi: ['टूल रोलआउट'],
      zh: ['基于模型的工具模拟'],
      fr: ['déploiements d outils simulés'],
      de: ['simulierte werkzeug-rollouts'],
      ar: ['محاكاة استخدام الأدوات']
    },
    title: 'Model-Based Tool Rollouts: Simulated Action Exploration for AI Agents',
    category: 'architecture',
    summary: 'Simulating the downstream consequences of irreversible tool calls before executing them in physical production environments.',
    explanation: 'In autonomous agent systems, executing physical tool calls (e.g. deleting files, sending emails, executing database mutations, transferring financial funds) is irreversible. Model-Based Tool Rollouts introduce a mental simulation sandbox:\n1. Environmental Simulation: The agent predicts what the environment will return for action a: s_hat_{t+1} = WorldModel(s_t, a).\n2. Consequence Critique: An internal safety evaluator inspects s_hat_{t+1} for catastrophic failure modes, unintended side effects, or policy violations.\n3. Re-planning: If the simulated state reveals a flaw, the agent selects an alternative tool or asks the user for confirmation.\n4. Execution Gate: Only validated, non-destructive tool invocations are dispatched to real-world APIs.',
    codeSnippet: 'def simulate_tool_call(action, args):\n    # Internal safety sandbox check before execution\n    if action == "delete_database" or "drop" in args.get("query", "").lower():\n        return {"status": "BLOCKED", "reason": "Catastrophic destructive risk. User approval required."}\n    return {"status": "SAFE", "action": action}\n\ncheck = simulate_tool_call("sql_query", {"query": "DROP TABLE users;"})\nprint(f"Tool Simulation Gate: {check[\'status\']} | Reason: {check[\'reason\']}")',
    takeaway: 'Simulated tool rollouts prevent irreversible damage by evaluating action consequences in a mental sandbox.'
  },
  {
    id: 'simpo-simple-preference-optimization',
    keywords: ['simpo', 'simple preference', 'reference free', 'margin reward', 'length normalization'],
    multilingualKeywords: {
      es: ['simpo', 'optimización de preferencia simple'],
      hi: ['सिम्पो'],
      zh: ['简单偏好优化', 'simpo算法'],
      fr: ['simpo'],
      de: ['einfache präferenzoptimierung'],
      ar: ['تحسين التفضيل البسيط']
    },
    title: 'SimPO: Reference-Free Margin Preference Optimization without Reference Models',
    category: 'math',
    summary: 'Eliminating the reference model in DPO and preventing verbosity bias via length-normalized margin rewards.',
    explanation: 'While DPO eliminated the explicit reward model, it still requires keeping a frozen reference model pi_ref in GPU VRAM to calculate KL divergence penalties, consuming memory. Furthermore, DPO exhibits severe verbosity bias—it rewards longer outputs simply because log-likelihood sums naturally grow with token counts. Meng et al. (Princeton, 2024) introduced SimPO:\n1. Length-Normalized Reward: r_SimPO(x, y) = (beta / |y|) * sum_{t=1}^{|y|} log pi_theta(y_t | x, y_{<t}).\n2. Target Margin: Enforces a strict minimum margin gamma > 0 between chosen and rejected outputs: L_SimPO = -log sigma( r(x, y_w) - r(x, y_l) - gamma ).\n3. Zero Reference Model: Completely removes pi_ref from memory, saving 50% VRAM and outperforming DPO on AlpacaEval 2 and Arena-Hard.',
    codeSnippet: 'import numpy as np\n\ndef simpo_loss(chosen_logp, chosen_len, reject_logp, reject_len, beta=2.0, gamma=0.5):\n    # Length-normalized average log-likelihood\n    r_w = (beta / chosen_len) * chosen_logp\n    r_l = (beta / reject_len) * reject_logp\n    # Logistic margin loss: -log(sigmoid(r_w - r_l - gamma))\n    margin_diff = r_w - r_l - gamma\n    loss = np.log1p(np.exp(-margin_diff))\n    return loss\n\nloss = simpo_loss(chosen_logp=-12.0, chosen_len=20, reject_logp=-25.0, reject_len=30)\nprint(f"SimPO Length-Normalized Loss: {loss:.4f}")',
    takeaway: 'SimPO eliminates reference model memory overhead and length bias by enforcing length-normalized margin rewards.'
  },
  {
    id: 'alignment-tax-mitigation',
    keywords: ['alignment tax', 'capability degradation', 'over-alignment', 'kl regularization', 'refusal mitigation'],
    multilingualKeywords: {
      es: ['impuesto de alineación'],
      hi: ['अलाइनमेंट टैक्स'],
      zh: ['对齐税', '能力退化缓解'],
      fr: ['taxe d alignement'],
      de: ['ausrichtungssteuer'],
      ar: ['ضريبة المحاذاة']
    },
    title: 'Mitigating the Alignment Tax: Preserving General Capabilities during Safety Tuning',
    category: 'governance',
    summary: 'Techniques for preventing safety and RLHF post-training from degrading core mathematical and coding reasoning capabilities.',
    explanation: 'The "Alignment Tax" refers to the observed phenomenon where fine-tuning a model for safety and harmlessness degrades its performance on complex reasoning, mathematics, coding, and instruction following. Techniques to mitigate this degradation:\n1. Mixed Pre-Training Replay: Injecting 5-10% high-quality pre-training math/code data into the SFT and preference optimization batches.\n2. Targeted Refusal Classifiers: Training refusal tokens only on unambiguous harm categories (CBRN, cyberattacks) while permitting benign scientific discussions.\n3. Parameter-Efficient Alignment (LoRA): Freezing foundational knowledge weights and isolating safety conditioning inside separate low-rank adapter matrices.\n4. KL Regularization Floor: Capping policy drift to maintain the original pretrained probability distribution for neutral factual queries.',
    codeSnippet: '# Mixed Training Loss with Capability Replay Anchor\ndef mixed_alignment_loss(loss_preference, loss_general_pretrain, alpha=0.1):\n    # Preserves foundational coding/math capabilities during safety tuning\n    return loss_preference + alpha * loss_general_pretrain\n\nloss = mixed_alignment_loss(loss_preference=0.45, loss_general_pretrain=0.82, alpha=0.1)\nprint(f"Total Anchored Alignment Loss: {loss:.4f}")',
    takeaway: 'Replaying high-signal reasoning data during post-training prevents safety alignment from dulling model intelligence.'
  },

  // ===========================================================================
  // 3. DISTRIBUTED SYSTEMS & HIGH-PERFORMANCE TRAINING (15 TOPICS)
  // ===========================================================================
  {
    id: 'zero-stage-1-2-3-memory',
    keywords: ['zero', 'zero-1', 'zero-2', 'zero-3', 'deepspeed', 'memory sharding', 'optimizer partitioning'],
    multilingualKeywords: {
      es: ['zero', 'partición de memoria'],
      hi: ['ज़ीरो स्टेज'],
      zh: ['zero显存优化', 'deepspeed架构'],
      fr: ['zero deepspeed'],
      de: ['zero-speicherpartitionierung'],
      ar: ['تجزئة الذاكرة zero']
    },
    title: 'ZeRO-Stage 1, 2, and 3: Sharding Optimizer, Gradients, and Parameters (DeepSpeed)',
    category: 'architecture',
    summary: 'Eliminating memory redundancy in distributed training by partitioning optimizer states, gradients, and model parameters across GPUs.',
    explanation: 'During 16-bit model training with AdamW, memory is dominated by states, not model weights:\nFor a model with Psi parameters (e.g. 16 GB weights in FP16), optimizer states consume 16 bytes per parameter (FP32 master weights = 4, FP32 momentum = 4, FP32 variance = 4, FP16 gradients = 2, FP16 weights = 2). Rajbhandari et al. formulated Zero Redundancy Optimizer (ZeRO):\n• ZeRO-Stage 1: Partition optimizer states across N_d GPUs. Reduces memory by 4x with zero communication overhead.\n• ZeRO-Stage 2: Partition gradients alongside optimizer states. Reduces memory by 8x.\n• ZeRO-Stage 3: Partition model parameters themselves across all GPUs. Each GPU gathers parameters on-the-fly via All-Gather only during the forward pass and discards them immediately, enabling training of trillion-parameter models.',
    codeSnippet: '# Memory footprint calculation for 7B parameter model in AdamW\nparams = 7e9\nfp16_weights_gb = (params * 2) / 1e9\nfp16_grads_gb = (params * 2) / 1e9\nadam_states_gb = (params * 12) / 1e9\ntotal_standard_gb = fp16_weights_gb + fp16_grads_gb + adam_states_gb\n\n# ZeRO-Stage 3 sharded across 8 GPUs\nzero3_per_gpu = total_standard_gb / 8.0\nprint(f"Single GPU Standard: {total_standard_gb:.1f} GB (OOM!) | ZeRO-3 per GPU: {zero3_per_gpu:.1f} GB (Fits in VRAM!)")',
    takeaway: 'ZeRO removes redundant memory across data-parallel workers, linearizing maximum model size with GPU cluster count.'
  },
  {
    id: 'fsdp-fully-sharded-data-parallel',
    keywords: ['fsdp', 'fully sharded data parallel', 'pytorch native', 'all gather', 'reduce scatter'],
    multilingualKeywords: {
      es: ['fsdp', 'datos totalmente fragmentados'],
      hi: ['एफएसडीपी'],
      zh: ['完全分片数据并行', 'fsdp架构'],
      fr: ['fsdp pytorch'],
      de: ['vollständig fragmentierte datenparallelität'],
      ar: ['البيانات المجزأة بالكامل fsdp']
    },
    title: 'Fully Sharded Data Parallel (FSDP): PyTorch-Native Distributed Scaling',
    category: 'architecture',
    summary: 'PyTorch-native implementation of ZeRO-3 memory sharding with fine-grained layer-by-layer compute communication overlap.',
    explanation: 'FSDP implements parameter, gradient, and optimizer sharding directly inside the PyTorch runtime. Instead of sharding the entire network as a monolithic block, FSDP wraps nested modules (e.g. individual Transformer decoder layers):\n1. Forward Pass: Before executing layer i, issues an asynchronous All-Gather collective to reconstruct the layer\'s full parameters across the process group. Computes forward activations, then immediately frees the full parameters, retaining only its local shard in VRAM.\n2. Backward Pass: Reconstructs parameters via All-Gather, computes input gradients, and applies Reduce-Scatter on weight gradients to synchronize and shard updates simultaneously.\n3. Forward-backward communication is fully overlapped with GPU compute kernels via asynchronous CUDA streams.',
    codeSnippet: 'import numpy as np\n\n# Collective communication cost per layer\nparams_per_layer = 250e6 # 250M params per transformer block\nbytes_fp16 = params_per_layer * 2\n\n# All-Gather communication volume: 2 * (N-1)/N * Bytes\nnum_gpus = 8\nall_gather_bytes = 2 * ((num_gpus - 1) / num_gpus) * bytes_fp16\nprint(f"All-Gather Data Volume per Layer: {all_gather_bytes / 1e6:.1f} MB")',
    takeaway: 'FSDP achieves near-linear distributed scaling by overlapping layer-by-layer All-Gather communications with matrix multiplication.'
  },
  {
    id: 'tensor-parallelism-megatron',
    keywords: ['tensor parallelism', 'megatron-lm', 'column parallel', 'row parallel', 'all-reduce', 'intra-node'],
    multilingualKeywords: {
      es: ['paralelismo de tensores'],
      hi: ['टेंसर पैरेललिज्म'],
      zh: ['张量并行', 'megatron架构'],
      fr: ['parallélisme de tenseurs'],
      de: ['tensor-parallelismus'],
      ar: ['توازي الموترات']
    },
    title: 'Tensor Parallelism: Column and Row Linear Fusions (Megatron-LM)',
    category: 'architecture',
    summary: 'Splitting individual weight matrices across GPUs within high-bandwidth NVLink nodes to fit massive layers into memory.',
    explanation: 'When a single Transformer layer is too large to fit in a single GPU\'s memory, Shoeybi et al. (Megatron-LM) split the weight matrices along column and row dimensions:\n1. Self-Attention QKV & MLP Layer 1: Split along columns (Column Parallel). Matrix W is split into [W_1, W_2]. Output is Y_i = X @ W_i. Requires zero communication during the forward pass!\n2. Output Projection & MLP Layer 2: Split along rows (Row Parallel). Matrix W is split into [W_1; W_2]. Output is Y = Y_1 @ W_1 + Y_2 @ W_2.\n3. Communication: A single All-Reduce collective is required at the end of the attention block and MLP block to sum the partial row products across GPUs. Runs at microsecond latency across 900 GB/s NVLink.',
    codeSnippet: 'import numpy as np\n\n# Column Parallel + Row Parallel Matrix Multiply Simulation\nX = np.random.randn(2, 4) # Batch of 2 tokens, 4 features\nW = np.random.randn(4, 4)\n\n# Split Column: GPU 0 gets W[:, :2], GPU 1 gets W[:, 2:]\nW_col0 = W[:, :2]\nW_col1 = W[:, 2:]\nY_col0 = X @ W_col0\nY_col1 = X @ W_col1\n\n# Recombined Column output matches full X @ W exactly\nY_combined = np.hstack([Y_col0, Y_col1])\nprint(f"Column Parallel Exact Equivalence: {np.allclose(Y_combined, X @ W)}")',
    takeaway: 'Megatron Tensor Parallelism pairs Column-Parallel with Row-Parallel matrices to require only 2 All-Reduces per transformer layer.'
  },
  {
    id: 'pipeline-parallelism-1f1b',
    keywords: ['pipeline parallelism', '1f1b schedule', 'interleaved pipeline', 'pipeline bubble', 'activation stashing'],
    multilingualKeywords: {
      es: ['paralelismo de canalización'],
      hi: ['पाइपलाइन पैरेललिज्म'],
      zh: ['流水线并行', '1f1b调度'],
      fr: ['parallélisme de pipeline'],
      de: ['pipeline-parallelismus'],
      ar: ['توازي خطوط الأنابيب']
    },
    title: 'Pipeline Parallelism: 1F1B Scheduling & Pipeline Bubble Reduction',
    category: 'architecture',
    summary: 'Distributing sequential layers of deep neural networks across multiple GPUs with interleaved One-Forward-One-Backward execution.',
    explanation: 'Pipeline Parallelism assigns different groups of layers to different GPUs (e.g. GPU 0 has layers 1-8, GPU 1 has layers 9-16). Naive execution causes idle "pipeline bubbles" where downstream GPUs wait for upstream activations. The 1F1B (One-Forward-One-Backward) schedule (PipeDream, Megatron):\n1. Micro-Batching: Splits the batch into M micro-batches.\n2. Warmup Phase: Injects micro-batches forward until the pipeline stage is saturated.\n3. 1F1B Steady State: Each stage alternates executing exactly one forward micro-batch followed by one backward micro-batch.\n4. Memory Bound: Caps activation memory to at most P micro-batches (where P is the number of pipeline stages), eliminating out-of-memory crashes on very deep architectures.',
    codeSnippet: 'def pipeline_bubble_fraction(num_stages, num_microbatches):\n    # Ideal pipeline bubble ratio: (p - 1) / (m + p - 1)\n    p = num_stages\n    m = num_microbatches\n    bubble = (p - 1) / (m + p - 1)\n    return bubble\n\nbubble_ratio = pipeline_bubble_fraction(num_stages=8, num_microbatches=64)\nprint(f"Pipeline Bubble Overhead: {bubble_ratio * 100:.1f}% idle time (90%+ GPU compute utilization)")',
    takeaway: '1F1B alternates forward and backward execution per micro-batch, bounding activation memory and minimizing idle pipeline bubbles.'
  },
  {
    id: 'activation-checkpointing-memory',
    keywords: ['activation checkpointing', 'gradient checkpointing', 'memory compute tradeoff', 'vram reduction', 'rematerialization'],
    multilingualKeywords: {
      es: ['puntos de control de activación'],
      hi: ['एक्टिवेशन चेकपॉइंटिंग'],
      zh: ['激活检查点', '显存重计算'],
      fr: ['point de contrôle d activation'],
      de: ['aktivierungs-checkpointing'],
      ar: ['نقاط فحص التنشيط']
    },
    title: 'Activation Checkpointing: Trading 33% Compute to Halve Training VRAM',
    category: 'architecture',
    summary: 'Discarding intermediate forward activations from GPU memory and recomputing them on-the-fly during backpropagation.',
    explanation: 'In deep transformer training, storing all intermediate layer activations for the backward pass consumes significantly more VRAM than the model parameters themselves (proportional to Batch * Sequence * Layers * Hidden). Chen et al. (2016) developed Activation Checkpointing:\n• During the forward pass, save activations only at selected module boundaries (e.g. once per Transformer block) and drop all inner activations (QKV projections, Softmax, GELU, Layernorms).\n• During the backward pass, re-run the forward pass of that single block using the stashed boundary activation to rematerialize inner activations immediately before computing weight gradients.\n• Result: Reduces activation memory by over 75% for only a ~33% increase in total training FLOPs.',
    codeSnippet: 'import numpy as np\n\ndef memory_comparison(num_layers=32, batch=4, seq_len=4096, hidden=4096):\n    # Approximate activation memory in bytes per token per layer\n    bytes_per_token_layer = 16 * hidden * 2 # FP16\n    full_vram_gb = (num_layers * batch * seq_len * bytes_per_token_layer) / 1e9\n    # Checkpointed: Store only boundary inputs + 1 layer recompute\n    checkpointed_vram_gb = (num_layers * batch * seq_len * hidden * 2) / 1e9 + (1 * batch * seq_len * bytes_per_token_layer) / 1e9\n    return full_vram_gb, checkpointed_vram_gb\n\nfull, chk = memory_comparison()\nprint(f"Full Activations: {full:.1f} GB | Checkpointed: {chk:.1f} GB ({full/chk:.1f}x memory savings)")',
    takeaway: 'Activation checkpointing trades a modest 33% compute overhead to prevent out-of-memory crashes on long context training.'
  },
  {
    id: 'ring-all-reduce-primitive',
    keywords: ['ring all-reduce', 'collective communication', 'bandwidth optimal', 'baidu allreduce', 'nccl'],
    multilingualKeywords: {
      es: ['ring all-reduce', 'colectivo de anillo'],
      hi: ['रिंग ऑल-रिड्यूस'],
      zh: ['环形规约', 'ring all-reduce'],
      fr: ['ring all-reduce'],
      de: ['ring-all-reduce'],
      ar: ['حلقة التقليل الكلي']
    },
    title: 'Ring All-Reduce: Bandwidth-Optimal Collective Gradient Synchronization',
    category: 'architecture',
    summary: 'Synchronizing gradients across N GPUs where communication time is independent of the number of GPUs in the cluster.',
    explanation: 'Naive master-slave gradient aggregation requires the master GPU to receive gradients from all N-1 workers (O(N) network bottleneck). Ring All-Reduce arranges GPUs in a logical ring where each node communicates only with its immediate successor and predecessor:\n1. Scatter-Reduce Phase: Model gradients are divided into N chunks. Over N-1 steps, each GPU sends a chunk to its successor while accumulating received data. At the end, each GPU holds the complete global sum of 1/N-th of the model gradient.\n2. All-Gather Phase: Over another N-1 steps, each GPU circulates its completed gradient chunk around the ring until all nodes possess the full synchronized gradient.\n3. Total Data Transferred: Exactly 2 * ((N-1) / N) * S bytes per GPU. As N grows, communication volume approaches 2 * S, completely independent of cluster size!',
    codeSnippet: 'def ring_allreduce_transfer(data_size_mb, num_gpus):\n    # Total data sent by each GPU in a ring topology\n    transfer_per_gpu = 2.0 * ((num_gpus - 1) / num_gpus) * data_size_mb\n    return transfer_per_gpu\n\nsize = 1000 # 1GB gradient\nprint(f"4 GPUs: {ring_allreduce_transfer(size, 4):.1f} MB sent per GPU")\nprint(f"128 GPUs: {ring_allreduce_transfer(size, 128):.1f} MB sent per GPU (Constant ~2GB bandwidth bound!)")',
    takeaway: 'Ring All-Reduce eliminates centralized network bottlenecks, keeping gradient synchronization time constant at cluster scale.'
  },
  {
    id: 'mixed-precision-bf16-fp8',
    keywords: ['mixed precision', 'bf16', 'fp8', 'e4m3', 'e5m2', 'loss scaling', 'numerical dynamic range'],
    multilingualKeywords: {
      es: ['precisión mixta', 'bf16', 'fp8'],
      hi: ['मिक्स्ड प्रिसिजन'],
      zh: ['混合精度', 'bf16与fp8'],
      fr: ['précision mixte'],
      de: ['gemischte präzision'],
      ar: ['الدقة المختلطة']
    },
    title: 'Mixed Precision Dynamics: FP16, BF16, and FP8 (E4M3 vs. E5M2)',
    category: 'math',
    summary: 'Mastering numerical exponent dynamic range and mantissa precision to double training throughput without loss divergence.',
    explanation: 'IEEE FP32 uses 1 sign bit, 8 exponent bits, and 23 mantissa bits. Smaller floating-point formats trade precision for raw compute throughput:\n• FP16 (1s, 5e, 10m): Small dynamic range (max ~65,504). Gradients frequently underflow to zero, requiring dynamic loss scaling.\n• BF16 (Bfloat16: 1s, 8e, 7m): Retains the full 8-bit dynamic range of FP32 while dropping mantissa precision. Immune to underflow/overflow; eliminated loss scaling in modern LLM training.\n• FP8 Formats (Hopper/Blackwell GPUs):\n  1. E4M3 (1s, 4e, 3m): Higher precision, lower range. Ideal for forward activations and model weights.\n  2. E5M2 (1s, 5e, 2m): Lower precision, higher dynamic range identical to FP16. Ideal for backpropagation gradient flows.',
    codeSnippet: 'import numpy as np\n\n# Dynamic range comparisons\nfp16_max = 65504.0\nbf16_max = 3.39e38 # Matches FP32 range!\nfp8_e4m3_max = 448.0\nfp8_e5m2_max = 57344.0\n\nprint(f"FP16 Max: {fp16_max} | BF16 Max: {bf16_max:.1e}")\nprint(f"FP8 E4M3 Max (Weights): {fp8_e4m3_max} | FP8 E5M2 Max (Gradients): {fp8_e5m2_max}")',
    takeaway: 'BF16 eliminated training stability headaches, while dual-format FP8 doubles Tensor Core throughput on modern accelerators.'
  },
  {
    id: 'cuda-streams-async-engines',
    keywords: ['cuda streams', 'async memory copy', 'host to device', 'overlap compute', 'cuda synchronization'],
    multilingualKeywords: {
      es: ['flujos cuda', 'copia asíncrona'],
      hi: ['कूडा स्ट्रीम्स'],
      zh: ['cuda流', '异步数据传输'],
      fr: ['flux cuda'],
      de: ['cuda-streams'],
      ar: ['تدفقات كودا']
    },
    title: 'CUDA Streams & Asynchronous Memory Copy Engines',
    category: 'architecture',
    summary: 'Eliminating GPU idle stalls by overlapping PCIe/NVLink data transfers with active Tensor Core kernel execution.',
    explanation: 'A GPU consists of separate hardware execution engines: the SM (Streaming Multiprocessor) Compute Engine, the Host-to-Device Copy Engine, and the Device-to-Host Copy Engine. Operations submitted to the default (NULL) stream block all other streams. Custom CUDA Streams enable parallel execution:\n• Stream 1: Executes heavy matrix multiplications on Tensor Cores.\n• Stream 2: Simultaneously prefetches the next batch of input tensors from host CPU RAM via DMA (Direct Memory Access).\n• CUDA Events (cudaEventRecord, cudaStreamWaitEvent) synchronize streams without forcing an expensive host CPU thread stall.\n• Ensures GPU compute utilization remains at 100% without data-starvation stalls.',
    codeSnippet: '# Conceptual asynchronous stream scheduling\ndef execute_with_overlap():\n    timeline = [\n        {"time": 0, "copy_stream": "Prefetch Batch 1 to VRAM", "compute_stream": "Idle"},\n        {"time": 1, "copy_stream": "Prefetch Batch 2 to VRAM", "compute_stream": "Compute Batch 1 on Tensor Cores"},\n        {"time": 2, "copy_stream": "Prefetch Batch 3 to VRAM", "compute_stream": "Compute Batch 2 on Tensor Cores"},\n    ]\n    return timeline\n\nfor event in execute_with_overlap():\n    print(f"T={event[\'time\']} | Copy Engine: {event[\'copy_stream\']} <--> SMs: {event[\'compute_stream\']}")',
    takeaway: 'CUDA streams enable concurrent memory transfers and kernel execution, preventing compute engines from starving.'
  },
  {
    id: 'triton-block-level-programming',
    keywords: ['triton', 'openai triton', 'gpu programming', 'custom kernels', 'sram management'],
    multilingualKeywords: {
      es: ['lenguaje triton'],
      hi: ['ट्राइटन'],
      zh: ['triton编程', '自定义gpu算子'],
      fr: ['triton gpu'],
      de: ['triton-sprache'],
      ar: ['برمجة ترايتون']
    },
    title: 'OpenAI Triton: Block-Level GPU Programming without CUDA C++',
    category: 'architecture',
    summary: 'Authoring custom high-performance GPU kernels in pure Python via automatic thread block scheduling and memory coalescence.',
    explanation: 'Writing raw CUDA C++ requires manually managing thread synchronization (__syncthreads()), shared memory bank conflicts, and memory coalescence at the warp level (32 threads). Tillet et al. (OpenAI, 2019) created Triton:\n1. Block-Level Abstraction: Algorithms operate on 2D/3D tensor blocks (e.g. BLOCK_SIZE = 128) rather than individual threads.\n2. Automatic Memory Coalescing: The Triton compiler (LLVM-based) automatically converts 2D block loads into vectorized, coalesced 128-bit memory instructions.\n3. Automatic Shared Memory Tiling: Manages on-chip SRAM allocation and instruction pipelining automatically.\n4. Enables rapid authoring of custom FlashAttention, LayerNorm, and quantization kernels that match or exceed vendor cuBLAS speeds in ~50 lines of Python.',
    codeSnippet: '# Conceptual Triton Block Load and Masking\ndef triton_kernel_concept(BLOCK_SIZE=128, N=500):\n    pid = 0 # Program ID (Block index)\n    block_start = pid * BLOCK_SIZE\n    offsets = block_start + np.arange(BLOCK_SIZE)\n    mask = offsets < N # Guard against out-of-bounds memory accesses\n    return offsets, mask\n\noffs, msk = triton_kernel_concept(BLOCK_SIZE=128, N=100)\nprint(f"Triton Block Offsets: {offs[:5]}... | Valid Elements in Block: {np.sum(msk)}")',
    takeaway: 'Triton elevates GPU programming to block-level Python, automating memory coalescence and thread synchronization.'
  },
  {
    id: 'flash-decoding-split-kv',
    keywords: ['flash-decoding', 'split-kv', 'decoding latency', 'dao et al', 'long context decoding'],
    multilingualKeywords: {
      es: ['flash-decoding', 'decodificación rápida'],
      hi: ['फ्लैश डिकोडिंग'],
      zh: ['flash-decoding', '切分注意力'],
      fr: ['flash-decoding'],
      de: ['flash-decoding'],
      ar: ['فك التشفير الومضي']
    },
    title: 'Flash-Decoding: Accelerating Long-Context Generation via Split-KV Parallelism',
    category: 'architecture',
    summary: 'Parallelizing single-token generation across thread blocks by splitting the KV cache along the sequence dimension.',
    explanation: 'While FlashAttention achieved massive speedups during pre-training (where batch * seq_len is large), standard autoregressive generation produces only 1 query token per sequence. On long contexts (e.g. 64k tokens), a single query must attend to 64k cached Keys/Values, underutilizing the thousands of Streaming Multiprocessors on modern GPUs. Dao et al. (2023) developed Flash-Decoding:\n1. Split-KV: Divides the long KV-cache sequence into M separate chunks (e.g. 1024 tokens each).\n2. Parallel Block Attention: Dispatches all M chunks across separate GPU thread blocks simultaneously, computing partial attention outputs and running max/sum statistics in parallel.\n3. Final Reduction: A fast final reduction kernel combines the M partial outputs using online softmax rescaling. Achieves up to 8x faster decoding at long context lengths.',
    codeSnippet: 'import numpy as np\n\ndef split_kv_reduction(partial_outputs, partial_maxes, partial_sums):\n    # Re-normalize partial blocks along sequence chunks\n    global_max = np.max(partial_maxes)\n    rescaled_sums = partial_sums * np.exp(partial_maxes - global_max)\n    total_sum = np.sum(rescaled_sums)\n    # Weighted blend of partial outputs\n    final_out = np.sum([out * (s / total_sum) for out, s in zip(partial_outputs, rescaled_sums)], axis=0)\n    return final_out\n\nout1, out2 = np.array([1.0, 2.0]), np.array([3.0, 4.0])\nfinal = split_kv_reduction([out1, out2], [10.0, 12.0], [5.0, 6.0])\nprint(f"Flash-Decoding Final Reduced Output: {final.round(2)}")',
    takeaway: 'Flash-Decoding parallelizes long-context generation across GPU cores by splitting the KV-cache sequence.'
  },
  {
    id: 'continuous-batching-vllm',
    keywords: ['continuous batching', 'iteration level scheduling', 'orca', 'vllm', 'serving latency'],
    multilingualKeywords: {
      es: ['procesamiento por lotes continuo'],
      hi: ['कंटीन्यूअस बैचिंग'],
      zh: ['连续批处理', '迭代级调度'],
      fr: ['traitement par lots continu'],
      de: ['kontinuierliche stapelverarbeitung'],
      ar: ['الدفعات المستمرة']
    },
    title: 'Continuous Batching & Iteration-Level Request Scheduling',
    category: 'architecture',
    summary: 'Eliminating static batch padding delays by dynamically injecting new requests at every generation step.',
    explanation: 'Traditional static batching waits for all sequences in a batch to finish generation before accepting new requests. If one sequence generates 500 tokens while others finish in 20 tokens, GPU memory and compute are wasted on padding tokens (the "tail latency problem"). Yu et al. (Orca, 2022) created Continuous Batching (implemented in vLLM and TGI):\n• Scheduling occurs at the iteration (single token) level rather than the request level.\n• As soon as a request completes generation (emits EOS token), its physical memory is reclaimed immediately.\n• A new incoming request from the queue enters the batch at the very next forward pass, without waiting for lingering requests.\n• Increases server throughput by 10x-20x under high concurrency.',
    codeSnippet: 'active_batch = [{"id": "req_1", "tokens_left": 1}, {"id": "req_2", "tokens_left": 5}]\nqueue = [{"id": "req_3", "tokens_left": 8}]\n\n# Iteration step\nfor req in list(active_batch):\n    req["tokens_left"] -= 1\n    if req["tokens_left"] == 0:\n        active_batch.remove(req) # Evict immediately on completion\n        if queue:\n            active_batch.append(queue.pop(0)) # Inject pending request instantly\n\nprint(f"Active Batch after 1 Iteration: {[r[\'id\'] for r in active_batch]}")',
    takeaway: 'Continuous batching schedules execution token-by-token, eliminating padding waste and maximizing server throughput.'
  },
  {
    id: 'disaggregated-prefill-decode',
    keywords: ['disaggregated serving', 'distserve', 'split serving', 'prefill phase', 'decode phase'],
    multilingualKeywords: {
      es: ['servicio desagregado'],
      hi: ['डिसएग्रीगेटेड सर्विंग'],
      zh: ['解耦预填充与解码', '分布式推理'],
      fr: ['service désagrégé'],
      de: ['disaggregierte bereitstellung'],
      ar: ['الخدمة المفككة']
    },
    title: 'Disaggregated Prefill & Decode Architecture: Separating Compute and Memory Nodes',
    category: 'architecture',
    summary: 'Eliminating serving interference by hosting prompt prefill (compute-bound) and token decoding (memory-bound) on separate GPU pools.',
    explanation: 'Serving an LLM consists of two completely different computational workloads:\n1. Prefill Phase: Processing the user prompt. Highly compute-bound (large matrix-matrix multiplications), high Tensor Core arithmetic intensity.\n2. Decode Phase: Generating output tokens one-by-one. Heavily memory-bandwidth bound (reading gigabytes of KV-cache to compute single-token vectors).\nIn co-located serving, an incoming prompt stalls active generation, causing stuttering and high Time-To-First-Token (TTFT) latency. Disaggregated Serving (DistServe, Mooncake, 2024):\n• Prefill Nodes: GPU cluster optimized with maximum FLOPS and high batching to process prompts rapidly.\n• KV-Transfer: Completed KV-caches are streamed across high-speed InfiniBand/RDMA to dedicated Decode Nodes.\n• Decode Nodes: Memory-bandwidth optimized GPU clusters executing uninterrupted generation with minimal latency.',
    codeSnippet: 'def compute_intensity(batch_tokens, hidden_dim, is_prefill=True):\n    # Arithmetic intensity FLOPs / Byte\n    if is_prefill:\n        return f"{batch_tokens * 2:.1f} FLOPs/Byte (Compute Bound - Saturates Tensor Cores)"\n    return "0.5 FLOPs/Byte (Memory Bandwidth Bound - Limited by HBM Speed)"\n\nprint("Prefill Phase:", compute_intensity(1024, 4096, is_prefill=True))\nprint("Decode Phase: ", compute_intensity(1, 4096, is_prefill=False))',
    takeaway: 'Disaggregating prefill and decode phases eliminates workload interference, optimizing hardware for each task.'
  },
  {
    id: 'gpudirect-rdma-infiniband',
    keywords: ['gpudirect', 'rdma', 'infiniband', 'nic bypass', 'multi node communication'],
    multilingualKeywords: {
      es: ['gpudirect rdma'],
      hi: ['जीपीयूडायरेक्ट आरडीएमए'],
      zh: ['gpudirect技术', '远程直接内存访问'],
      fr: ['gpudirect rdma'],
      de: ['gpudirect-rdma'],
      ar: ['الوصول المباشر لذاكرة gpu']
    },
    title: 'GPUDirect RDMA & InfiniBand: Bypassing Host CPU in Multi-Node Clusters',
    category: 'architecture',
    summary: 'Streaming data directly between GPU memories across network adapters without intermediate host CPU memory copies.',
    explanation: 'In naive multi-node GPU communication, sending a tensor from GPU A (Node 1) to GPU B (Node 2) requires 4 copies:\nGPU A VRAM -> Host 1 CPU RAM -> Host 1 Network Adapter -> Network -> Host 2 Network Adapter -> Host 2 CPU RAM -> GPU B VRAM. This overloads the CPU memory bus and introduces 50-100 microsecond latencies. GPUDirect RDMA (Remote Direct Memory Access):\n• The Network Interface Card (NIC) accesses GPU VRAM directly via the PCIe switch.\n• Transfers stream straight from GPU A VRAM over the InfiniBand network to GPU B VRAM.\n• Eliminates CPU host buffer copies, dropping latency to < 2 microseconds with full 400-800 Gbps line-rate throughput across nodes.',
    codeSnippet: '# Comparison of data transfer hops\nstandard_hops = ["GPU VRAM", "Host CPU RAM", "NIC Buffer", "Network", "Remote NIC", "Remote CPU RAM", "Remote VRAM"]\nrdma_hops = ["GPU VRAM", "NIC", "Network", "Remote NIC", "Remote VRAM"]\nprint(f"Standard Hops: {len(standard_hops)} | GPUDirect RDMA Hops: {len(rdma_hops)} (Zero CPU Involvement)")',
    takeaway: 'GPUDirect RDMA bypasses host CPU memory entirely, enabling direct peer-to-peer VRAM networking across nodes.'
  },
  {
    id: 'kv-cache-eviction-streaming',
    keywords: ['streamingllm', 'attention sinks', 'h2o', 'kv cache eviction', 'infinite context'],
    multilingualKeywords: {
      es: ['evicción de kv cache', 'sumideros de atención'],
      hi: ['केवी कैशे एविक्शन'],
      zh: ['kv缓存淘汰', '注意力下沉'],
      fr: ['éviction du cache kv'],
      de: ['kv-cache-bereinigung'],
      ar: ['طرد ذاكرة التخزين المؤقت kv']
    },
    title: 'KV-Cache Eviction & Attention Sinks: StreamingLLM and H2O Mechanics',
    category: 'architecture',
    summary: 'Maintaining stable endless streaming generation in fixed VRAM by preserving initial attention sinks and recent tokens.',
    explanation: 'When generating long text streams, the KV cache eventually exhausts GPU VRAM. Naively evicting the oldest tokens (sliding window) causes the model\'s perplexity to explode to infinity after just a few hundred tokens. Xiao et al. (StreamingLLM, 2023) discovered Attention Sinks:\n• The Softmax operation requires sum(exp(scores)) to sum to 1. Even when initial tokens (tokens 0-3) lack semantic relevance, the model dumps excess attention mass into them as a mathematical sink.\n• When token 0 is evicted, the softmax distribution destabilizes.\n• Solution: Retain the first 4 tokens (Attention Sinks) forever in the KV cache, alongside a sliding window of the most recent K tokens (e.g. 1024 tokens).\n• Enables language models to stream millions of tokens continuously in fixed, bounded VRAM without perplexity collapse.',
    codeSnippet: 'import numpy as np\n\ndef streaming_kv_cache(cache, new_token, sink_size=4, window_size=1024):\n    # Always preserve the initial sink tokens\n    if len(cache) < (sink_size + window_size):\n        cache.append(new_token)\n    else:\n        # Evict oldest token outside the sink window\n        cache = cache[:sink_size] + cache[sink_size+1:] + [new_token]\n    return cache\n\nmock_cache = list(range(1030))\nupdated = streaming_kv_cache(mock_cache, 9999, sink_size=4, window_size=1024)\nprint(f"Preserved Sinks: {updated[:4]} | Recent: {updated[-3:]} | Size: {len(updated)}")',
    takeaway: 'Attention sinks preserve softmax normalization stability, enabling infinite streaming within fixed VRAM bounds.'
  },
  {
    id: '3d-parallelism-orchestration',
    keywords: ['3d parallelism', 'tensor data pipeline', 'megatron deepspeed', 'cluster orchestration', 'scaling frontier'],
    multilingualKeywords: {
      es: ['paralelismo 3d'],
      hi: ['३डी पैरेललिज्म'],
      zh: ['三维并行', '3d并行架构'],
      fr: ['parallélisme 3d'],
      de: ['3d-parallelismus'],
      ar: ['التوازي ثلاثي الأبعاد']
    },
    title: '3D Parallelism: Harmonizing Data, Tensor, and Pipeline Parallelism at Scale',
    category: 'architecture',
    summary: 'Composing Tensor (intra-node), Pipeline (inter-node), and Data Parallelism (cluster-wide) to train hundred-billion parameter models.',
    explanation: 'Training models with hundreds of billions of parameters requires orchestrating all three parallel paradigms simultaneously:\n1. Tensor Parallelism (TP): Deployed within single nodes (e.g. 8 GPUs connected via ultra-fast 900 GB/s NVLink) to shard large weight matrices.\n2. Pipeline Parallelism (PP): Deployed across nodes connected via InfiniBand to partition sequential layer groups with minimal communication traffic.\n3. Data Parallelism (DP / ZeRO): Replicates the combined TP * PP engine across the remaining cluster nodes to scale batch size and training throughput.\n4. Total GPU Count = TP * PP * DP. For example, TP=8, PP=16, DP=64 requires 8,192 GPUs working in mathematical unison.',
    codeSnippet: 'def calculate_3d_cluster_topology(num_gpus, tp, pp):\n    dp = num_gpus // (tp * pp)\n    assert num_gpus == tp * pp * dp\n    return {"Total GPUs": num_gpus, "Tensor Parallel (Intra-Node)": tp, "Pipeline Stages": pp, "Data Replicas": dp}\n\ntopology = calculate_3d_cluster_topology(num_gpus=2048, tp=8, pp=8)\nfor k, v in topology.items():\n    print(f"{k}: {v}")',
    takeaway: '3D parallelism matches each communication pattern to the physical network hierarchy of modern supercomputing clusters.'
  },

  // ===========================================================================
  // 4. CLASSICAL ML, DEEP LEARNING FOUNDATIONS & OPTIMIZATION (15 TOPICS)
  // ===========================================================================
  {
    id: 'backpropagation-jacobian-products',
    keywords: ['backpropagation', 'jacobian', 'vector jacobian product', 'vjp', 'computational graph', 'chain rule'],
    multilingualKeywords: {
      es: ['retropropagación', 'jacobiano'],
      hi: ['बैकप्रॉपैगेशन'],
      zh: ['反向传播', '雅可比向量积'],
      fr: ['rétropropagation'],
      de: ['backpropagation'],
      ar: ['الانتشار العكسي']
    },
    title: 'Backpropagation Mechanics: Vector-Jacobian Products (VJP) in Autograd',
    category: 'math',
    summary: 'Deriving reverse-mode automatic differentiation as efficient vector-Jacobian products along computational graphs.',
    explanation: 'Forward automatic differentiation calculates Jacobian-Vector Products (JVP), which is efficient when input dimension is much smaller than output dimension. In deep learning, scalar loss L in R has millions of parameters w in R^D. Reverse-mode automatic differentiation computes Vector-Jacobian Products (VJP):\n1. The chain rule states: dL/dw_i = sum_j (dL/dh_j) * (dh_j/dw_i).\n2. Rather than materializing the full D x D Jacobian matrix J (which would require petabytes of memory), autograd engines (PyTorch, JAX) propagate upstream adjoint vectors v = dL/dh backward through primitive vector-Jacobian products v^T @ J.\n3. Enables computing exact gradients of scalar loss with respect to all D parameters in a single reverse sweep with the exact same time complexity as the forward pass.',
    codeSnippet: 'import numpy as np\n\n# Vector-Jacobian Product (VJP) for matrix multiplication Y = X @ W\ndef vjp_matmul(X, W, upstream_grad_Y):\n    # upstream_grad_Y has shape (B, Out)\n    grad_X = upstream_grad_Y @ W.T # Shape (B, In)\n    grad_W = X.T @ upstream_grad_Y # Shape (In, Out)\n    return grad_X, grad_W\n\nx = np.array([[1.0, 2.0]])\nw = np.array([[3.0, 4.0], [5.0, 6.0]])\nu_grad = np.array([[1.0, 1.0]])\ng_x, g_w = vjp_matmul(x, w, u_grad)\nprint(f"Gradient with respect to X: {g_x.round(2)}")',
    takeaway: 'Reverse-mode autograd computes exact gradients with respect to millions of parameters in a single backward pass via VJPs.'
  },
  {
    id: 'adamw-weight-decay-decoupling',
    keywords: ['adamw', 'weight decay', 'l2 regularization', 'loshchilov hutter', 'optimizer dynamics'],
    multilingualKeywords: {
      es: ['adamw', 'decadencia de peso'],
      hi: ['एडम डब्लू'],
      zh: ['adamw优化器', '权重衰减解耦'],
      fr: ['adamw'],
      de: ['adamw-optimierer'],
      ar: ['محسن adamw']
    },
    title: 'AdamW vs. Adam: Decoupling L2 Regularization from Adaptive Moments',
    category: 'math',
    summary: 'Fixing the weight decay bug in standard Adam by subtracting regularization directly from weights rather than adding to gradients.',
    explanation: 'In standard SGD, L2 regularization is mathematically equivalent to weight decay: adding lambda * w to the gradient directly shrinks weights. In adaptive gradient algorithms (Adam), however, Loshchilov & Hutter (2017) proved this equivalence breaks down:\n• Adding lambda * w to gradient g causes the moving second moment v_t = beta_2 * v_t + (1 - beta_2) * g^2 to scale with weight magnitude.\n• Weights with large historical gradients receive much less regularization than weights with small gradients!\n• AdamW decouples weight decay: theta_{t+1} = theta_t - lr * lambda * theta_t - lr * (m_hat / (sqrt(v_hat) + eps)).\n• Restores correct uniform regularization across all model layers, becoming the standard optimizer for LLMs.',
    codeSnippet: 'import numpy as np\n\ndef adamw_step(w, grad, m, v, lr=0.001, weight_decay=0.01, beta1=0.9, beta2=0.999, eps=1e-8):\n    # 1. Update biased first and second moments\n    m = beta1 * m + (1.0 - beta1) * grad\n    v = beta2 * v + (1.0 - beta2) * (grad ** 2)\n    # 2. Decoupled weight decay applied directly to parameter\n    w = w - lr * weight_decay * w\n    # 3. Adaptive moment step\n    w = w - lr * (m / (np.sqrt(v) + eps))\n    return w, m, v\n\nweight = np.array([2.0, -1.5])\nw_next, _, _ = adamw_step(weight, grad=np.array([0.1, -0.2]), m=np.zeros(2), v=np.zeros(2))\nprint(f"AdamW Updated Weight: {w_next.round(4)}")',
    takeaway: 'AdamW decouples weight decay from gradient history, preventing adaptive moments from distorting regularization.'
  },
  {
    id: 'rmsnorm-scaling-invariants',
    keywords: ['rmsnorm', 'root mean square norm', 'layernorm', 'zhang sennrich', 'scaling invariant'],
    multilingualKeywords: {
      es: ['rmsnorm', 'normalización rms'],
      hi: ['आरएमएस नॉर्म'],
      zh: ['rmsnorm', '均方根归一化'],
      fr: ['rmsnorm'],
      de: ['rmsnorm'],
      ar: ['تطبيع rms']
    },
    title: 'RMSNorm vs. LayerNorm: Why Centering Mean is Redundant in Transformers',
    category: 'math',
    summary: 'Accelerating layer normalization by 10-50% by enforcing root-mean-square scale invariance without mean subtraction.',
    explanation: 'Standard LayerNorm (Ba et al., 2016) shifts and scales activations: y = ((x - mu) / sigma) * gamma + beta. Computing mean mu requires an extra reduction pass across hidden dimension d. Zhang & Sennrich (2019) hypothesized that the primary benefit of LayerNorm is scale regularization (enforcing invariant activation magnitudes), while mean-centering mu contributes virtually nothing to training stability. RMSNorm defines:\nRMS(x) = sqrt( (1 / d) * sum_{i=1}^d x_i^2 + eps )\ny = (x / RMS(x)) * gamma.\nEliminates mean subtraction and bias beta, saving memory bandwidth and reducing kernel latency in Llama, Mistral, and Gemma.',
    codeSnippet: 'import numpy as np\n\ndef rms_norm(x, gamma, eps=1e-6):\n    rms = np.sqrt(np.mean(x ** 2, axis=-1, keepdims=True) + eps)\n    return (x / rms) * gamma\n\nx_sample = np.array([[-2.0, 3.0, 1.0, -0.5]])\ngamma = np.ones(4)\ny_norm = rms_norm(x_sample, gamma)\nprint(f"RMSNorm Output: {y_norm.round(3)} | Resulting RMS: {np.sqrt(np.mean(y_norm**2)):.4f}")',
    takeaway: 'RMSNorm delivers identical training stability to LayerNorm while cutting compute overhead by discarding mean calculation.'
  },
  {
    id: 'cosine-annealing-warmup',
    keywords: ['cosine annealing', 'learning rate schedule', 'warmup', 'loshchilov', 'learning rate decay'],
    multilingualKeywords: {
      es: ['recocido de coseno', 'tasa de aprendizaje'],
      hi: ['कोसाइन एनीलिंग'],
      zh: ['余弦退火', '学习率调度'],
      fr: ['recuit cosinus'],
      de: ['kosinus-annealing'],
      ar: ['التلدين بجيب التمام']
    },
    title: 'Learning Rate Scheduling: Linear Warmup with Cosine Annealing',
    category: 'math',
    summary: 'Preventing early divergence with linear warmup and smoothly decaying learning rate to zero for optimal convergence.',
    explanation: 'At training initialization, random model weights produce noisy, high-magnitude gradients. Applying a large learning rate immediately causes gradient explosion or catastrophic representation collapse. Linear Warmup with Cosine Annealing:\n1. Warmup Phase (t <= T_warmup): Linearly ramp learning rate from 0 to lr_max: lr_t = (t / T_warmup) * lr_max.\n2. Cosine Annealing Phase (t > T_warmup): Decays learning rate along a cosine curve: lr_t = lr_min + 0.5 * (lr_max - lr_min) * (1 + cos( ((t - T_warmup) / (T_total - T_warmup)) * pi )).\n3. Reaches a flat plateau near zero, allowing the optimizer to settle into flat, generalized loss minima.',
    codeSnippet: 'import numpy as np\n\ndef get_cosine_lr(step, total_steps=1000, warmup_steps=100, lr_max=1e-3, lr_min=1e-5):\n    if step < warmup_steps:\n        return lr_max * (step / warmup_steps)\n    decay_ratio = (step - warmup_steps) / (total_steps - warmup_steps)\n    return lr_min + 0.5 * (lr_max - lr_min) * (1.0 + np.cos(np.pi * decay_ratio))\n\nprint(f"Step 50 (Warmup): {get_cosine_lr(50):.2e} | Step 550 (Mid): {get_cosine_lr(550):.2e} | Step 1000 (End): {get_cosine_lr(1000):.2e}")',
    takeaway: 'Warmup protects initial training stability, while cosine decay settles the model into broad, generalizing loss minima.'
  },
  {
    id: 'gbdt-xgboost-split-criterion',
    keywords: ['gbdt', 'xgboost', 'gradient boosting', 'split criterion', 'hessian', 'decision trees'],
    multilingualKeywords: {
      es: ['árboles de decisión impulsados por gradiente'],
      hi: ['जीबीडीटी'],
      zh: ['梯度提升决策树', 'xgboost算法'],
      fr: ['arbres de décision boostés'],
      de: ['gradient-boosting-entscheidungsbäume'],
      ar: ['أشجار القرار المعززة بالتدرج']
    },
    title: 'Gradient Boosted Decision Trees (GBDT): Exact Greedy & Histogram Splits (XGBoost)',
    category: 'math',
    summary: 'Constructing ensembles of shallow decision trees that greedily optimize Taylor series approximations of objective loss.',
    explanation: 'Chen & Guestrin (XGBoost, 2016) derived an exact second-order Taylor expansion for tree splits:\nL_split = 0.5 * [ (G_L^2 / (H_L + lambda)) + (G_R^2 / (H_R + lambda)) - ((G_L + G_R)^2 / (H_L + H_R + lambda)) ] - gamma\nwhere G = sum_i g_i is the sum of first-order gradients and H = sum_i h_i is the sum of second-order Hessians in candidate leaf nodes, and lambda/gamma penalize tree complexity.\nHistogram algorithms (LightGBM) bin continuous features into discrete buckets (e.g. 256 bins), reducing split-finding complexity from O(data * features) to O(bins * features).',
    codeSnippet: 'def xgboost_split_gain(G_L, H_L, G_R, H_R, reg_lambda=1.0, gamma=0.1):\n    # Score gain calculation for splitting a leaf\n    score_L = (G_L ** 2) / (H_L + reg_lambda)\n    score_R = (G_R ** 2) / (H_R + reg_lambda)\n    score_combined = ((G_L + G_R) ** 2) / (H_L + H_R + reg_lambda)\n    gain = 0.5 * (score_L + score_R - score_combined) - gamma\n    return gain\n\ngain = xgboost_split_gain(G_L=15.0, H_L=5.0, G_R=20.0, H_R=8.0)\nprint(f"XGBoost Split Gain: {gain:.3f} (Positive gain -> Split Accepted!)")',
    takeaway: 'GBDT optimizes second-order Taylor expansions of arbitrary loss functions using histogram feature binning.'
  },
  {
    id: 'random-forest-oob-error',
    keywords: ['random forest', 'bagging', 'out of bag', 'oob error', 'breiman', 'feature bagging'],
    multilingualKeywords: {
      es: ['bosque aleatorio', 'error fuera de bolsa'],
      hi: ['रैंडम फ़ॉरेस्ट'],
      zh: ['随机森林', '袋外误差'],
      fr: ['forêt aléatoire'],
      de: ['random forest'],
      ar: ['الغابة العشوائية']
    },
    title: 'Random Forests: Bootstrap Aggregation, Feature Subsampling, and OOB Error',
    category: 'curriculum',
    summary: 'Achieving robust, non-overfitting ensemble models via bootstrap aggregation and mathematical Out-of-Bag validation.',
    explanation: 'Leo Breiman (2001) established Random Forests by combining two variance-reduction principles:\n1. Bootstrap Aggregation (Bagging): Each tree is trained on an independent dataset sampled with replacement from the N training examples. In expectation, each tree leaves out (1 - 1/e) approx 36.8% of samples (the Out-of-Bag, or OOB set).\n2. Feature Subsampling: At every node split, only a random subset of features m = sqrt(p) is considered, decorrelating individual trees.\n3. OOB Error: Passing each training example through only those trees that did NOT see it during training provides an unbiased estimate of generalization error with zero need for a separate validation split.',
    codeSnippet: 'import numpy as np\n\ndef simulate_oob_ratio(N=10000):\n    # Sample N items with replacement\n    sampled_indices = np.random.choice(N, size=N, replace=True)\n    unique_seen = len(np.unique(sampled_indices))\n    oob_ratio = (N - unique_seen) / N\n    return oob_ratio\n\nprint(f"OOB Sample Ratio: {simulate_oob_ratio():.4f} (Matches theoretical 1/e = {1/np.e:.4f})")',
    takeaway: 'Random Forests use OOB samples to calculate an unbiased validation score without setting aside a validation set.'
  },
  {
    id: 'svm-lagrange-dual-kernel',
    keywords: ['svm', 'support vector machine', 'lagrange dual', 'kernel trick', 'rbf kernel', 'margin maximization'],
    multilingualKeywords: {
      es: ['máquinas de vectores de soporte'],
      hi: ['एसवीएम'],
      zh: ['支持向量机', '核技巧'],
      fr: ['machines à vecteurs de support'],
      de: ['support-vektor-maschine'],
      ar: ['آلات المتجهات الداعمة']
    },
    title: 'Support Vector Machines (SVM): Lagrange Duality & The Kernel Trick',
    category: 'math',
    summary: 'Finding the optimal maximum-margin separating hyperplane and projecting non-linear data into infinite-dimensional Hilbert spaces.',
    explanation: 'SVM seeks a hyperplane w^T x + b = 0 that separates binary classes with maximum margin 2 / ||w||. Formulating the primal optimization problem with constraints y_i (w^T x_i + b) >= 1 leads to the Lagrange Dual formulation:\nmax_alpha sum_i alpha_i - 0.5 * sum_i sum_j alpha_i * alpha_j * y_i * y_j * (x_i^T x_j)\nsubject to 0 <= alpha_i <= C and sum_i alpha_i * y_i = 0.\nThe Kernel Trick replaces inner product x_i^T x_j with kernel function K(x_i, x_j) = phi(x_i)^T phi(x_j). The Radial Basis Function (RBF) kernel K(x_i, x_j) = exp(-gamma * ||x_i - x_j||^2) implicitly projects data into an infinite-dimensional feature space without ever calculating coordinates explicitly.',
    codeSnippet: 'import numpy as np\n\ndef rbf_kernel(u, v, gamma=0.5):\n    # Implicit infinite-dimensional inner product\n    dist_sq = np.sum((u - v) ** 2)\n    return np.exp(-gamma * dist_sq)\n\nx1 = np.array([1.0, 2.0])\nx2 = np.array([1.2, 1.9])\nprint(f"RBF Kernel Inner Product: {rbf_kernel(x1, x2):.4f}")',
    takeaway: 'The Kernel Trick computes dot products in infinite-dimensional Hilbert spaces without materializing feature coordinates.'
  },
  {
    id: 'pca-svd-eigen-decomposition',
    keywords: ['pca', 'svd', 'principal component analysis', 'eigenvalues', 'dimensionality reduction', 'variance projection'],
    multilingualKeywords: {
      es: ['análisis de componentes principales'],
      hi: ['पीसीए'],
      zh: ['主成分分析', '奇异值分解'],
      fr: ['analyse en composantes principales'],
      de: ['hauptkomponentenanalyse'],
      ar: ['تحليل المكونات الرئيسية']
    },
    title: 'Principal Component Analysis (PCA) via Singular Value Decomposition (SVD)',
    category: 'math',
    summary: 'Projecting high-dimensional data onto orthogonal axes of maximum variance via Singular Value Decomposition.',
    explanation: 'PCA finds orthogonal projection vectors w_1, w_2, ... that maximize variance of projected data points w^T Sigma w, where Sigma = (1/N) * X^T X is the sample covariance matrix of zero-centered data X. Rather than computing expensive covariance matrices explicitly, modern PCA performs Singular Value Decomposition directly on centered matrix X:\nX = U * Sigma_svd * V^T\nwhere columns of V are the eigenvectors of X^T X (the Principal Components), and singular values s_i relate to variance: lambda_i = s_i^2 / (N - 1). The top-K columns of V provide the optimal low-rank linear projection.',
    codeSnippet: 'import numpy as np\n\n# 2D data centered at origin with high variance along diagonal\nX = np.random.randn(100, 2) @ np.array([[2.0, 1.0], [0.5, 3.0]])\nX_centered = X - np.mean(X, axis=0)\n\n# SVD: X = U @ S @ Vt\nU, S, Vt = np.linalg.svd(X_centered, full_matrices=False)\nprincipal_components = Vt.T\nvariance_explained = (S ** 2) / np.sum(S ** 2)\nprint(f"Top-1 Principal Component Vector: {principal_components[:, 0].round(3)}")\nprint(f"Variance Explained: {variance_explained[0]*100:.1f}% by first component")',
    takeaway: 'PCA projects high-dimensional data onto orthogonal axes of maximal variance using SVD factorization.'
  },
  {
    id: 'tsne-umap-manifold-topologies',
    keywords: ['tsne', 'umap', 'manifold learning', 'non-linear reduction', 't-distribution', 'fuzzy simplicial sets'],
    multilingualKeywords: {
      es: ['tsne', 'umap', 'reducción no lineal'],
      hi: ['टी-स्ने', 'यूएमएएपी'],
      zh: ['降维可视化', 'tsne与umap'],
      fr: ['tsne umap'],
      de: ['nichtlineare maßstabsreduktion'],
      ar: ['تقليل الأبعاد غير الخطي']
    },
    title: 't-SNE vs. UMAP: Preserving Local Neighborhoods vs. Global Topologies',
    category: 'math',
    summary: 'Non-linear manifold dimension reduction for visualizing high-dimensional embeddings in 2D/3D space.',
    explanation: 'Linear methods like PCA fail to capture non-linear cluster manifolds. Non-linear dimensionality reduction algorithms:\n• t-SNE (van der Maaten & Hinton, 2008): Converts Euclidean distances into pairwise Gaussian probabilities p_{j|i} in high dimension, and Student-t distributions q_{ij} in low dimension. Minimizes KL divergence KL(P || Q). The heavy-tailed Student-t distribution prevents crowding, creating distinct local clusters but distorting global inter-cluster distances.\n• UMAP (McInnes et al., 2018): Grounded in Riemannian geometry and algebraic topology (Fuzzy Simplicial Sets). Preserves both local cluster neighborhoods and macro-level global topology while running 10x-50x faster than t-SNE.',
    codeSnippet: 'import numpy as np\n\ndef student_t_prob(dist_sq):\n    # Heavy-tailed Student-t probability in low dimensions (t-SNE)\n    inv_dist = 1.0 / (1.0 + dist_sq)\n    return inv_dist\n\nprint(f"Nearby points (d=0.1): q = {student_t_prob(0.1**2):.4f}")\nprint(f"Distant points (d=3.0): q = {student_t_prob(3.0**2):.4f} (Smooth decay eliminates crowding)")',
    takeaway: 't-SNE excels at isolating distinct local clusters, while UMAP preserves both local structure and global inter-cluster topology.'
  },
  {
    id: 'gmm-expectation-maximization',
    keywords: ['gmm', 'gaussian mixture model', 'expectation maximization', 'em algorithm', 'soft clustering'],
    multilingualKeywords: {
      es: ['modelo de mezcla gaussiana'],
      hi: ['गॉसियन मिक्सचर मॉडल'],
      zh: ['高斯混合模型', 'em算法'],
      fr: ['modèle de mélange gaussien'],
      de: ['gaußsches mischmodell'],
      ar: ['نموذج المزيج الغاوسي']
    },
    title: 'Gaussian Mixture Models (GMM) & The Expectation-Maximization (EM) Algorithm',
    category: 'math',
    summary: 'Probabilistic soft clustering via iterative expectation-maximization updates of Gaussian component densities.',
    explanation: 'While K-Means performs hard cluster assignments assuming spherical variance, Gaussian Mixture Models (GMM) assign soft posterior probabilities under K Gaussian components N(mu_k, Sigma_k). Optimized via Expectation-Maximization (EM):\n1. E-Step (Expectation): Calculate responsibility gamma_{ik} that component k generated data point x_i: gamma_{ik} = pi_k * N(x_i; mu_k, Sigma_k) / sum_j pi_j * N(x_i; mu_j, Sigma_j).\n2. M-Step (Maximization): Update parameters using responsibilities:\nmu_k = (1 / N_k) * sum_i gamma_{ik} * x_i\nSigma_k = (1 / N_k) * sum_i gamma_{ik} * (x_i - mu_k)(x_i - mu_k)^T\npi_k = N_k / N.\nGuaranteed to monotonically increase the data log-likelihood to local convergence.',
    codeSnippet: 'import numpy as np\n\ndef gmm_e_step(x, weights, means, variances):\n    # 1D E-step responsibility calculation\n    probs = [w * (1.0 / np.sqrt(2 * np.pi * var)) * np.exp(-((x - m)**2) / (2 * var)) for w, m, var in zip(weights, means, variances)]\n    total = np.sum(probs)\n    responsibilities = [p / total for p in probs]\n    return responsibilities\n\nresp = gmm_e_step(x=2.5, weights=[0.5, 0.5], means=[1.0, 3.0], variances=[1.0, 1.0])\nprint(f"Soft Cluster Responsibility: Component 0: {resp[0]:.3f} | Component 1: {resp[1]:.3f}")',
    takeaway: 'EM iteratively calculates cluster probabilities and parameter updates, enabling soft ellipsoidal cluster modeling.'
  },
  {
    id: 'roc-auc-vs-precision-recall',
    keywords: ['roc-auc', 'precision-recall', 'pr-auc', 'class imbalance', 'evaluation metrics'],
    multilingualKeywords: {
      es: ['curva roc', 'precisión y recuerdo'],
      hi: ['आरओसी एयूसी'],
      zh: ['roc曲线', '精确率召回率曲线'],
      fr: ['courbe roc'],
      de: ['roc-kurve'],
      ar: ['منحنى roc']
    },
    title: 'ROC-AUC vs. Precision-Recall Curves: Metric Selection Under Severe Class Imbalance',
    category: 'math',
    summary: 'Why ROC-AUC produces dangerously over-optimistic evaluations on imbalanced datasets (fraud, cancer, search) and when to use PR-AUC.',
    explanation: 'Evaluating binary classifiers requires choosing the right curve metric:\n• ROC Curve plots True Positive Rate (TPR = TP / (TP + FN)) against False Positive Rate (FPR = FP / (FP + TN)). When negative samples vastly outnumber positives (e.g. fraud detection where 99.9% of transactions are legitimate), TN is huge. Even if the model generates thousands of false alarms (FP), FPR remains tiny, causing ROC-AUC to report a deceptive 0.98 score!\n• Precision-Recall Curve plots Precision (TP / (TP + FP)) against Recall (TP / (TP + FN)). Precision divides by predicted positives, immediately exposing false positives. For severe class imbalances, PR-AUC is the only mathematically sound metric.',
    codeSnippet: 'def compare_metrics(TP, FP, FN, TN):\n    fpr = FP / (FP + TN)\n    precision = TP / (TP + FP) if (TP + FP) else 0.0\n    return fpr, precision\n\n# Imbalanced scenario: 10 real frauds, 9990 legitimate. Model predicts 100 flags (10 real, 90 false alarms)\nfpr, prec = compare_metrics(TP=10, FP=90, FN=0, TN=9900)\nprint(f"ROC False Positive Rate: {fpr:.4f} (Misleadingly looks like 99.1% perfect!)")\nprint(f"PR Precision: {prec*100:.1f}% (Accurately exposes that 90% of alarms are false!)")',
    takeaway: 'Under severe class imbalance, ROC-AUC hides false alarms behind true negatives; use PR-AUC for truthful evaluation.'
  },
  {
    id: 'batch-norm-internal-covariate',
    keywords: ['batch norm', 'internal covariate shift', 'batch normalization', 'training vs inference', 'ioff & szegedy'],
    multilingualKeywords: {
      es: ['normalización por lotes'],
      hi: ['बैच नॉर्मलाइजेशन'],
      zh: ['批归一化', 'batchnorm机制'],
      fr: ['normalisation par lots'],
      de: ['batch-normalisierung'],
      ar: ['تطبيع الدُفعات']
    },
    title: 'Batch Normalization: Operating Dynamics, Running Statistics, and Inference Pitfalls',
    category: 'architecture',
    summary: 'Stabilizing deep feedforward training via mini-batch normalization, and why it was replaced by LayerNorm in NLP.',
    explanation: 'Ioffe & Szegedy (2015) introduced Batch Normalization to address training instability across deep convolutional networks:\n1. Training Phase: For mini-batch B, compute batch mean mu_B and batch variance sigma_B^2 across the batch dimension. Normalize: x_hat = (x - mu_B) / sqrt(sigma_B^2 + eps), and scale/shift: y = gamma * x_hat + beta. Concurrently update running averages of mean and variance.\n2. Inference Phase: Use fixed running mean and running variance accumulated during training.\n3. Why Transformers Replaced BatchNorm: In NLP, sequence lengths vary widely, and batch size 1 streaming inference is common. BatchNorm couples sequences within a batch, causing catastrophic inference failures on variable-length text.',
    codeSnippet: 'import numpy as np\n\ndef batch_norm_train(X, gamma, beta, running_mean, running_var, momentum=0.1, eps=1e-5):\n    # X shape: (Batch, Features)\n    mean = np.mean(X, axis=0)\n    var = np.var(X, axis=0)\n    X_norm = (X - mean) / np.sqrt(var + eps)\n    out = gamma * X_norm + beta\n    # Running tracking updates\n    running_mean = (1 - momentum) * running_mean + momentum * mean\n    running_var = (1 - momentum) * running_var + momentum * var\n    return out, running_mean, running_var\n\nx_data = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])\nout, r_m, r_v = batch_norm_train(x_data, 1.0, 0.0, np.zeros(2), np.ones(2))\nprint(f"Batch Norm Mean Centered Output:\\n{out.round(2)}")',
    takeaway: 'BatchNorm couples samples across mini-batches, making it ideal for computer vision but unsuitable for variable-length NLP.'
  },
  {
    id: 'monte-carlo-dropout-uncertainty',
    keywords: ['mc dropout', 'gal & ghahramani', 'epistemic uncertainty', 'bayesian neural network', 'confidence estimation'],
    multilingualKeywords: {
      es: ['dropout monte carlo', 'incertidumbre epistémica'],
      hi: ['मोंटे कार्लो ड्रॉपआउट'],
      zh: ['蒙特卡洛dropout', '不确定性估计'],
      fr: ['dropout de monte carlo'],
      de: ['monte-carlo-dropout'],
      ar: ['إسقاط مونت كارلو']
    },
    title: 'Monte Carlo Dropout: Epistemic Uncertainty Estimation in Production AI',
    category: 'math',
    summary: 'Approximating Bayesian neural networks by keeping Dropout active during inference to measure model uncertainty.',
    explanation: 'Standard deep networks output overconfident Softmax probabilities even when fed out-of-distribution adversarial data. Gal & Ghahramani (2016) proved mathematically that a neural network with Dropout applied at every layer is a variational approximation to a Deep Gaussian Process:\n• Instead of turning Dropout off at test time, keep Dropout active (p=0.1 to 0.5).\n• Perform N forward passes on the exact same input x.\n• Mean Prediction: mu(x) = (1/N) * sum_i y_i.\n• Epistemic Uncertainty: sigma^2(x) = (1/N) * sum_i (y_i - mu(x))^2.\n• If the N predictions diverge wildly, the model is uncertain and should escalate to a human expert.',
    codeSnippet: 'import numpy as np\n\ndef mc_dropout_predict(x, num_samples=100, p=0.2):\n    # Simulate multiple forward passes with active dropout\n    samples = []\n    for _ in range(num_samples):\n        mask = (np.random.rand(*x.shape) > p) / (1.0 - p)\n        samples.append(np.sum(x * mask))\n    mean_pred = np.mean(samples)\n    uncertainty = np.std(samples)\n    return mean_pred, uncertainty\n\nval, uncert = mc_dropout_predict(np.array([1.0, 2.0, 3.0]))\nprint(f"MC Dropout Mean: {val:.3f} | Epistemic Uncertainty (Std Dev): {uncert:.3f}")',
    takeaway: 'MC Dropout turns standard neural networks into Bayesian estimators by measuring prediction variance across stochastic forward passes.'
  },
  {
    id: 'weight-initialization-he-glorot',
    keywords: ['weight initialization', 'kaiming he', 'xavier glorot', 'vanishing gradient', 'exploding variance'],
    multilingualKeywords: {
      es: ['inicialización de pesos', 'xavier', 'he'],
      hi: ['वेट इनिशियलाइजेशन'],
      zh: ['权重初始化', 'kaiming初始化'],
      fr: ['initialisation des poids'],
      de: ['gewichtsinitialisierung'],
      ar: ['تهيئة الأوزان']
    },
    title: 'Weight Initialization: He (Kaiming) vs. Xavier (Glorot) Variance Scaling',
    category: 'math',
    summary: 'Preventing vanishing or exploding gradients at initialization by preserving activation variance across deep layers.',
    explanation: 'Initializing weights too small causes activations to vanish to zero in deep networks; initializing too large causes activations to explode and saturate non-linearities:\n• Xavier (Glorot) Initialization (2010): Designed for symmetric activations (Tanh, Sigmoid, Linear) where output variance matches input variance: Var(W) = 2 / (fan_in + fan_out). Sample from N(0, sqrt(2 / (fan_in + fan_out))).\n• He (Kaiming) Initialization (2015): ReLU zeros out half of the activations (negative values). To compensate for the 50% dropped variance, the variance must be doubled: Var(W) = 2 / fan_in. Sample from N(0, sqrt(2 / fan_in)).\n• Crucial for training deep networks without early divergence before batch/layer normalization kicks in.',
    codeSnippet: 'import numpy as np\n\ndef he_init(fan_in, fan_out):\n    std = np.sqrt(2.0 / fan_in)\n    return np.random.randn(fan_in, fan_out) * std\n\ndef xavier_init(fan_in, fan_out):\n    std = np.sqrt(2.0 / (fan_in + fan_out))\n    return np.random.randn(fan_in, fan_out) * std\n\nW_he = he_init(1000, 1000)\nW_xavier = xavier_init(1000, 1000)\nprint(f"He Variance: {np.var(W_he):.5f} (Target 2/1000 = 0.00200)")\nprint(f"Xavier Variance: {np.var(W_xavier):.5f} (Target 2/2000 = 0.00100)")',
    takeaway: 'He initialization doubles variance to account for ReLU clipping, while Xavier balances linear/tanh activations.'
  },
  {
    id: 'contrastive-divergence-energy',
    keywords: ['contrastive divergence', 'energy based models', 'hinton', 'restricted boltzmann machine', 'mcmc sampling'],
    multilingualKeywords: {
      es: ['divergencia contrastiva', 'modelos basados en energía'],
      hi: ['कॉन्ट्रास्टिव डाइवर्जेंस'],
      zh: ['对比散度', '基于能量的模型'],
      fr: ['divergence contrastive'],
      de: ['kontrastive divergenz'],
      ar: ['التباعد التبايني']
    },
    title: 'Energy-Based Models & Contrastive Divergence: MCMC Approximations',
    category: 'math',
    summary: 'Training unnormalized energy probability models p(x) = exp(-E(x)) / Z by approximating negative phase gradients with short MCMC chains.',
    explanation: 'Energy-Based Models (EBMs) define probability density via an arbitrary energy function: p_theta(x) = exp(-E_theta(x)) / Z_theta, where Z is the partition function integral. The gradient of the log-likelihood is:\nd/d_theta log p_theta(x) = -d/d_theta E_theta(x_data) + E_{x ~ p_theta} [ d/d_theta E_theta(x) ].\nThe second term (the "negative phase") requires sampling from the model\'s own unnormalized distribution, requiring intractable Markov Chain Monte Carlo (MCMC) chains. Geoffrey Hinton invented Contrastive Divergence (CD-k):\n• Start the Markov chain at the real data point x_data rather than random noise.\n• Run Gibbs or Langevin sampling for only k steps (often k=1).\n• Minimizes the difference between the data distribution and the k-step reconstructed distribution, making deep generative pre-training feasible.',
    codeSnippet: 'import numpy as np\n\ndef contrastive_divergence_gradient(x_data, x_reconstructed):\n    # Positive phase gradient minus negative phase gradient (toy scalar energy E(x) = 0.5 * w * x^2)\n    grad_pos = 0.5 * (x_data ** 2)\n    grad_neg = 0.5 * (x_reconstructed ** 2)\n    return grad_pos - grad_neg\n\ngrad = contrastive_divergence_gradient(x_data=2.0, x_reconstructed=1.8)\nprint(f"Contrastive Divergence Step Gradient: {grad:.4f}")',
    takeaway: 'Contrastive Divergence initializes MCMC at real data points, enabling efficient training of unnormalized energy distributions.'
  }
];
