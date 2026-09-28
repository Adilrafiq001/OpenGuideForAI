import { useState, useEffect, useRef } from 'react';
import { 
  Glasses, 
  Sparkles, 
  Laptop, 
  CheckCircle2, 
  AlertCircle,
  Maximize2,
  Camera,
  CameraOff
} from 'lucide-react';
import { detectHardwareFull, type HardwareTelemetry } from '../../utils/hardwareDetection';

export function WebXRControls({ className = '' }: { className?: string }) {
  const [telemetry, setTelemetry] = useState<HardwareTelemetry | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    detectHardwareFull().then(res => setTelemetry(res));

    return () => {
      // Clean up camera stream if component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Universal AR Camera Passthrough (Webcam on PC/Mac & Rear Camera on Mobile)
  const toggleCameraPassthrough = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
      setStatusMsg('AR Camera Passthrough deactivated.');
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatusMsg('Camera passthrough is not supported by your current browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setStatusMsg('Live AR Camera Passthrough activated. 3D spatial models are now augmented over your real physical environment.');
    } catch (err: any) {
      setStatusMsg(err?.message || 'Could not access camera for AR passthrough.');
      setIsCameraActive(false);
    }
  };

  // WebXR Native Session Request
  const requestXRSession = async (mode: 'immersive-vr' | 'immersive-ar') => {
    if (typeof navigator === 'undefined' || !('xr' in navigator) || !navigator.xr) {
      setStatusMsg('WebXR is not supported by your current browser engine.');
      return;
    }

    try {
      const isSupported = await navigator.xr.isSessionSupported(mode);
      if (!isSupported) {
        setStatusMsg(`No active ${mode === 'immersive-vr' ? 'VR Headset (e.g. Meta Quest)' : 'AR Device (e.g. Apple Vision Pro)'} detected on this display.`);
        return;
      }

      const session = await navigator.xr.requestSession(mode);
      setStatusMsg(`Connected to ${mode.toUpperCase()} session successfully.`);
      
      session.addEventListener('end', () => {
        setStatusMsg('Spatial session ended.');
      });
    } catch (err: any) {
      setStatusMsg(err?.message || 'Failed to start WebXR session.');
    }
  };

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-b from-[#09090b] via-[#0d1117] to-[#09090b] border border-[var(--color-border,rgba(255,255,255,0.1))] flex flex-col gap-6 shadow-2xl ${className}`}>
      
      {/* Title & Hardware Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-inner">
            <Glasses size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Spatial Holodeck WebXR & AR Gateway
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                6-DOF & Webcam AR
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Immersive spatial computing for Meta Quest, Apple Vision Pro, and universal camera passthrough.
            </p>
          </div>
        </div>

        {/* Headset Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono shadow-inner">
          {telemetry?.hasImmersiveVR ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={14} /> VR Headset Ready
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Laptop size={14} /> Screen Display (Ready for AR Passthrough)
            </span>
          )}
        </div>
      </div>

      {/* AR Camera Passthrough Viewport (when active) */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-white/10 transition-all ${isCameraActive ? 'h-72 bg-black' : 'hidden'}`}>
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-black font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>LIVE AR PASSTHROUGH ACTIVE</span>
        </div>
        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/90 bg-black/70 px-3 py-1 rounded-lg backdrop-blur-sm">
          Physical camera feed connected. Spatial vector nodes overlay your room.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Universal Camera AR Passthrough Button */}
        <button
          onClick={toggleCameraPassthrough}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isCameraActive 
              ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400' 
              : 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30 hover:border-cyan-400'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              {isCameraActive ? <CameraOff size={15} className="text-rose-400" /> : <Camera size={15} className="text-cyan-400" />}
              <span>{isCameraActive ? 'Disable Camera AR' : 'Universal AR Passthrough'}</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Webcam or Phone Camera Overlay
            </div>
          </div>
          <Sparkles size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Immersive 6-DOF VR */}
        <button
          onClick={() => requestXRSession('immersive-vr')}
          className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 hover:border-violet-500/60 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
              Launch Immersive VR (6-DOF)
            </div>
            <div className="text-[11px] text-neutral-400">
              Meta Quest Browser / SteamVR
            </div>
          </div>
          <Maximize2 size={16} className="text-violet-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Pass-Through AR for Vision Pro / Quest */}
        <button
          onClick={() => requestXRSession('immersive-ar')}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              WebXR Pass-Through AR
            </div>
            <div className="text-[11px] text-neutral-400">
              Apple Vision Pro / Quest 3
            </div>
          </div>
          <Sparkles size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Status Output if triggered */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/40 flex items-start gap-3 text-xs shadow-lg">
          <AlertCircle size={17} className="text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-violet-200 font-mono leading-relaxed">{statusMsg}</div>
            {!telemetry?.hasImmersiveVR && (
              <div className="text-[11px] text-neutral-400 leading-relaxed">
                Developer Note: To test native WebXR spatial hand controllers on Chrome desktop, install Google's official <span className="text-white font-semibold">WebXR API Emulator</span> Chrome Extension, or open this URL directly inside your Meta Quest browser.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spatial Architecture Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1 shadow-inner">
          <div className="text-xs font-bold text-white">Direct Hand & Pointer Hit-Testing</div>
          <div className="text-[11px] text-neutral-400">Three.js raycaster hits 3D nodes instantly with tactile Web Audio feedback.</div>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1 shadow-inner">
          <div className="text-xs font-bold text-white">Zero Cloud Compute ($0)</div>
          <div className="text-[11px] text-neutral-400">100% of spatial meshes and linear algebra run on device GPU via WebGL & WebXR.</div>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1 shadow-inner">
          <div className="text-xs font-bold text-white">Instant 2D Lean Fallback</div>
          <div className="text-[11px] text-neutral-400">Low-spec laptops and mobile phones automatically drop down to lightweight 0% GPU SVG.</div>
        </div>
      </div>

    </div>
  );
}
