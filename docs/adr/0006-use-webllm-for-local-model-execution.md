# ADR 0006: WebLLM for Local Inference

**Date:** 2026-09-28
**Context:** We need a local, offline-capable LLM for Track 2/3.
**Options:** WebLLM, Transformers.js.
**Decision:** WebLLM for text generation, Transformers.js for embeddings if needed.
**Consequences:** WebLLM provides WebGPU acceleration and an OpenAI-compatible API, making it easy to swap with BYOK cloud models. Requires modern browser with WebGPU support.
