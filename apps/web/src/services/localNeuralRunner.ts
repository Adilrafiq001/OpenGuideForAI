/**
 * localNeuralRunner.ts
 * In-Browser WebGPU & Local Neural Engine Subsystem for OpenGuide
 * 
 * $0 Rule Compliance: All compute executes strictly in the user's browser via native WebGPU
 * hardware acceleration with zero external API calls or server telemetry.
 * 
 * Architected by Adil Rafiq Dar (ARD).
 */

export interface WebGpuTelemetry {
  supported: boolean;
  adapterName: string;
  vendor: string;
  architecture: string;
  maxBufferSizeMb: number;
  isFallbackCpu: boolean;
  tier: 'WebGPU Native' | 'WASM CPU Fallback';
  timestamp: string;
}

/**
 * Probes the user's browser and hardware environment for native WebGPU support.
 * Returns detailed telemetry regarding the active GPU adapter and buffer constraints.
 */
export async function detectWebGpuSupport(): Promise<WebGpuTelemetry> {
  const timestamp = new Date().toISOString();
  
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return {
      supported: false,
      adapterName: 'Software Rasterizer (No WebGPU)',
      vendor: 'Generic CPU',
      architecture: 'x86_64 / ARM CPU',
      maxBufferSizeMb: 0,
      isFallbackCpu: true,
      tier: 'WASM CPU Fallback',
      timestamp
    };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    });

    if (!adapter) {
      return {
        supported: false,
        adapterName: 'WebGPU Adapter Unavailable',
        vendor: 'System',
        architecture: 'CPU Emulation',
        maxBufferSizeMb: 0,
        isFallbackCpu: true,
        tier: 'WASM CPU Fallback',
        timestamp
      };
    }

    // Extract adapter metadata safely
    // Note: requestAdapterInfo may be synchronous or async depending on browser implementation
    let info: { device?: string; vendor?: string; architecture?: string } = {};
    if ('requestAdapterInfo' in adapter && typeof (adapter as unknown as { requestAdapterInfo: () => Promise<unknown> }).requestAdapterInfo === 'function') {
      try {
        info = await (adapter as unknown as { requestAdapterInfo: () => Promise<{ device?: string; vendor?: string; architecture?: string }> }).requestAdapterInfo();
      } catch {
        info = {};
      }
    }

    const maxBufferSize = adapter.limits?.maxBufferSize || 0;
    const maxBufferSizeMb = Math.round(maxBufferSize / (1024 * 1024));

    const isFallback = !!(adapter as unknown as { isFallbackAdapter?: boolean }).isFallbackAdapter;

    return {
      supported: true,
      adapterName: info.device || 'Direct3D / Metal / Vulkan Hardware Accelerator',
      vendor: info.vendor || 'Hardware GPU',
      architecture: info.architecture || 'Discrete / Integrated GPU',
      maxBufferSizeMb,
      isFallbackCpu: isFallback,
      tier: isFallback ? 'WASM CPU Fallback' : 'WebGPU Native',
      timestamp
    };
  } catch (err) {
    console.warn('[OpenGuide] WebGPU detection error, falling back to CPU:', err);
    return {
      supported: false,
      adapterName: 'Fallback Pipeline',
      vendor: 'Host System',
      architecture: 'CPU Core',
      maxBufferSizeMb: 0,
      isFallbackCpu: true,
      tier: 'WASM CPU Fallback',
      timestamp
    };
  }
}


export interface WebGpuKernelResult {
  dotProduct: number;
  durationMs: number;
  backend: 'WebGPU Hardware Accelerated' | 'WASM CPU Fallback';
  adapterName: string;
}

// Explicit WebGPU standard bitwise flags to ensure strict TypeScript compilation
const GPU_BUFFER_USAGE_STORAGE = 0x0080;
const GPU_BUFFER_USAGE_COPY_DST = 0x0008;
const GPU_BUFFER_USAGE_COPY_SRC = 0x0004;
const GPU_BUFFER_USAGE_MAP_READ = 0x0001;
const GPU_MAP_MODE_READ = 0x0001;

/**
 * Executes a genuine WGSL compute shader pass on the user's local GPU via native WebGPU.
 * Complies with the $0 Rule: 100% client-side tensor execution with zero external servers.
 */
export async function executeWebGpuKernel(
  vecA: number[] = [0.85, 0.45, -0.32, 0.91, 0.12, -0.64, 0.77, 0.28],
  vecB: number[] = [0.82, 0.49, -0.29, 0.88, 0.15, -0.61, 0.74, 0.31]
): Promise<WebGpuKernelResult> {
  const startTime = performance.now();

  const n = (vecA && vecB) ? Math.min(vecA.length, vecB.length) : 0;
  if (n <= 0) {
    return {
      dotProduct: 0,
      durationMs: Number((performance.now() - startTime).toFixed(2)),
      backend: 'WASM CPU Fallback',
      adapterName: 'CPU Arithmetic Core'
    };
  }

  if (typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (adapter) {
        const device = await adapter.requestDevice();
        let bufferA: any = null;
        let bufferB: any = null;
        let bufferOut: any = null;
        let stagingBuffer: any = null;
        let isStagingMapped = false;
        try {
          const aArray = new Float32Array(vecA.slice(0, n));
          const bArray = new Float32Array(vecB.slice(0, n));
          const byteSize = aArray.byteLength;

          // Buffers
          bufferA = device.createBuffer({
            size: byteSize,
            usage: GPU_BUFFER_USAGE_STORAGE | GPU_BUFFER_USAGE_COPY_DST,
          });
          bufferB = device.createBuffer({
            size: byteSize,
            usage: GPU_BUFFER_USAGE_STORAGE | GPU_BUFFER_USAGE_COPY_DST,
          });
          bufferOut = device.createBuffer({
            size: byteSize,
            usage: GPU_BUFFER_USAGE_STORAGE | GPU_BUFFER_USAGE_COPY_SRC,
          });
          stagingBuffer = device.createBuffer({
            size: byteSize,
            usage: GPU_BUFFER_USAGE_MAP_READ | GPU_BUFFER_USAGE_COPY_DST,
          });

          device.queue.writeBuffer(bufferA, 0, aArray);
          device.queue.writeBuffer(bufferB, 0, bArray);

          // WGSL Compute Shader Module
          const shaderModule = device.createShaderModule({
            code: `
              @group(0) @binding(0) var<storage, read> a : array<f32>;
              @group(0) @binding(1) var<storage, read> b : array<f32>;
              @group(0) @binding(2) var<storage, read_write> result : array<f32>;

              @compute @workgroup_size(64)
              fn main(@builtin(global_invocation_id) id : vec3<u32>) {
                let i = id.x;
                if (i < arrayLength(&result)) {
                  result[i] = a[i] * b[i];
                }
              }
            `
          });

          const computePipeline = device.createComputePipeline({
            layout: 'auto',
            compute: {
              module: shaderModule,
              entryPoint: 'main',
            },
          });

          const bindGroup = device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: bufferA } },
              { binding: 1, resource: { buffer: bufferB } },
              { binding: 2, resource: { buffer: bufferOut } },
            ],
          });

          const commandEncoder = device.createCommandEncoder();
          const passEncoder = commandEncoder.beginComputePass();
          passEncoder.setPipeline(computePipeline);
          passEncoder.setBindGroup(0, bindGroup);
          passEncoder.dispatchWorkgroups(Math.ceil(n / 64));
          passEncoder.end();

          commandEncoder.copyBufferToBuffer(bufferOut, 0, stagingBuffer, 0, byteSize);
          device.queue.submit([commandEncoder.finish()]);

          await stagingBuffer.mapAsync(GPU_MAP_MODE_READ);
          isStagingMapped = true;
          const resultArray = new Float32Array(stagingBuffer.getMappedRange());
          let sum = 0;
          for (let i = 0; i < n; i++) {
            sum += resultArray[i];
          }
          stagingBuffer.unmap();
          isStagingMapped = false;

          let adapterName = 'Native WebGPU Hardware Accelerator';
          if ('requestAdapterInfo' in adapter && typeof (adapter as unknown as { requestAdapterInfo: () => Promise<{ device?: string }> }).requestAdapterInfo === 'function') {
            try {
              const info = await (adapter as unknown as { requestAdapterInfo: () => Promise<{ device?: string }> }).requestAdapterInfo();
              if (info.device) adapterName = info.device;
            } catch {}
          }

          return {
            dotProduct: Number(sum.toFixed(4)),
            durationMs: Number((performance.now() - startTime).toFixed(2)),
            backend: 'WebGPU Hardware Accelerated',
            adapterName
          };
        } finally {
          if (isStagingMapped && stagingBuffer) {
            try { stagingBuffer.unmap(); } catch {}
          }
          try { bufferA?.destroy(); } catch {}
          try { bufferB?.destroy(); } catch {}
          try { bufferOut?.destroy(); } catch {}
          try { stagingBuffer?.destroy(); } catch {}
          try { device?.destroy(); } catch {}
        }
      }
    } catch (e) {
      console.warn('[OpenGuide] WebGPU kernel execution fell back to CPU:', e);
    }
  }

  // Fallback to in-browser CPU vector computation
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const valA = vecA[i] || 0;
    const valB = vecB[i] || 0;
    sum += valA * valB;
  }
  const safeSum = Number.isFinite(sum) ? sum : 0;
  return {
    dotProduct: Number(safeSum.toFixed(4)),
    durationMs: Number((performance.now() - startTime).toFixed(2)),
    backend: 'WASM CPU Fallback',
    adapterName: 'CPU Arithmetic Core'
  };
}


