export type GraphicsTier = 'auto' | '2d-lean' | '3d-hardware' | 'spatial-xr';

export interface HardwareTelemetry {
  hasWebGL: boolean;
  hasWebXR: boolean;
  hasImmersiveVR: boolean;
  hasImmersiveAR: boolean;
  isLowEnd: boolean;
  rendererName: string;
  recommendedTier: '2d-lean' | '3d-hardware' | 'spatial-xr';
}

export function detectHardwareSync(): { hasWebGL: boolean; isLowEnd: boolean; rendererName: string } {
  if (typeof window === 'undefined') {
    return { hasWebGL: false, isLowEnd: true, rendererName: 'SSR' };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    
    if (!gl) {
      return { hasWebGL: false, isLowEnd: true, rendererName: 'None' };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Generic WebGL';

    // Identify low-end or software rasterizers (SwiftShader, llvmpipe, etc.)
    const isSoftware = /swiftshader|llvmpipe|software/i.test(renderer);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    const isLowEnd = isSoftware || cores <= 2 || memory <= 2;

    return {
      hasWebGL: true,
      isLowEnd,
      rendererName: renderer
    };
  } catch (e) {
    return { hasWebGL: false, isLowEnd: true, rendererName: 'Unknown' };
  }
}

export async function detectHardwareFull(): Promise<HardwareTelemetry> {
  const sync = detectHardwareSync();
  const hasWebXR = typeof navigator !== 'undefined' && 'xr' in navigator && !!navigator.xr;
  let hasImmersiveVR = false;
  let hasImmersiveAR = false;

  if (hasWebXR && navigator.xr) {
    try {
      hasImmersiveVR = await navigator.xr.isSessionSupported('immersive-vr');
    } catch (e) {
      hasImmersiveVR = false;
    }

    try {
      hasImmersiveAR = await navigator.xr.isSessionSupported('immersive-ar');
    } catch (e) {
      hasImmersiveAR = false;
    }
  }

  let recommendedTier: '2d-lean' | '3d-hardware' | 'spatial-xr' = '3d-hardware';
  if (hasImmersiveVR || hasImmersiveAR) {
    recommendedTier = 'spatial-xr';
  } else if (!sync.hasWebGL || sync.isLowEnd) {
    recommendedTier = '2d-lean';
  }

  return {
    hasWebGL: sync.hasWebGL,
    hasWebXR,
    hasImmersiveVR,
    hasImmersiveAR,
    isLowEnd: sync.isLowEnd,
    rendererName: sync.rendererName,
    recommendedTier
  };
}
