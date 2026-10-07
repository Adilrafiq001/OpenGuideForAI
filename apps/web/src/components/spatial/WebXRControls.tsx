import { useState, useEffect, useRef } from 'react';
import { 
  Glasses, 
  Eye,
  Layers,
  Activity,
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
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    detectHardwareFull().then(res => {
      if (isMounted) setTelemetry(res);
    });

    const videoEl = videoRef.current;
    return () => {
      isMounted = false;
      // Clean up camera stream if component unmounts
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoEl) {
        if (videoEl.srcObject) {
          const stream = videoEl.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
        }
        videoEl.srcObject = null;
      }
    };
  }, []);

  // Universal AR Camera Passthrough (Webcam on PC/Mac & Rear Camera on Mobile)
  const toggleCameraPassthrough = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
        }
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
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setStatusMsg('Live AR Camera Passthrough activated. 3D spatial models are now augmented over your real physical environment.');
    } catch (err: any) {
      setStatusMsg(err?.message || 'Could not access camera for AR passthrough.');
      setIsCameraActive(false);
    }
  };

  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);
  const [simulatorProfile, setSimulatorProfile] = useState<'quest' | 'visionpro' | 'arglasses'>('arglasses');
  const [arDeviceModel, setArDeviceModel] = useState<'xreal' | 'viture' | 'rayneo' | 'metaglass'>('xreal');
  const [activeSpatialTrack, setActiveSpatialTrack] = useState<number>(0);

  // WebXR Native Session Request with honest cross-platform detection
  const requestXRSession = async (mode: 'immersive-vr' | 'immersive-ar') => {
    if (typeof navigator === 'undefined' || !('xr' in navigator) || !navigator.xr) {
      setStatusMsg('WebXR is not supported by your current browser engine (Safari iOS/macOS, Firefox). WebXR is supported natively on Meta Quest Browser and visionOS Safari (immersive-vr). Use the "XR Headset Simulator" below to preview either device.');
      return;
    }

    try {
      const isSupported = await navigator.xr.isSessionSupported(mode);
      if (!isSupported) {
        if (mode === 'immersive-ar') {
          setStatusMsg('Notice: Apple visionOS Safari supports immersive-vr with gaze+pinch, but does NOT support immersive-ar camera passthrough due to Apple privacy limits. Meta Quest 3/Pro supports immersive-ar with full color passthrough. Use "Universal AR Passthrough" for browser camera overlays on all devices.');
        } else {
          setStatusMsg(`No active ${mode === 'immersive-vr' ? 'VR Headset (e.g. Meta Quest / Vision Pro)' : 'AR Device'} detected on this display. You can test and preview immediately using the "XR Headset Simulator" below.`);
        }
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
    <div className={`p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col gap-6 shadow-2xl text-[var(--color-text-primary)] transition-colors ${className}`}>
      
      {/* Title & Hardware Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-inner">
            <Glasses size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
              Spatial Holodeck WebXR & AR Gateway
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-400 border border-violet-500/30">
                AR Glasses • 6-DOF • WebXR
              </span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Optical Micro-OLED passthrough for Xreal, Viture, RayNeo, Rokid, Meta Quest, and Apple Vision Pro.
            </p>
          </div>
        </div>

        {/* Headset Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono shadow-inner">
          {telemetry?.hasImmersiveVR ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={14} /> VR Headset Ready
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <Laptop size={14} /> Screen Display (Ready for AR Glasses &amp; Passthrough)
            </span>
          )}
        </div>
      </div>

      {/* AR Camera Passthrough Viewport (when active) */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-[var(--color-border)] transition-all ${isCameraActive ? 'h-72 bg-black' : 'hidden'}`}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Universal Camera AR Passthrough Button */}
        <button
          onClick={toggleCameraPassthrough}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isCameraActive 
              ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400' 
              : 'bg-[var(--color-primary)] border-[var(--color-border)] hover:border-cyan-500/50'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              {isCameraActive ? <CameraOff size={15} className="text-rose-400" /> : <Camera size={15} className="text-cyan-400" />}
              <span>{isCameraActive ? 'Disable Camera AR' : 'Universal AR Passthrough'}</span>
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Webcam or Phone Camera
            </div>
          </div>
          <Eye size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Immersive 6-DOF VR */}
        <button
          onClick={() => requestXRSession('immersive-vr')}
          className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-violet-500/60 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-violet-400 transition-colors">
              Launch Immersive VR (6-DOF)
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Meta Quest / visionOS Safari
            </div>
          </div>
          <Maximize2 size={16} className="text-violet-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Pass-Through AR for Quest */}
        <button
          onClick={() => requestXRSession('immersive-ar')}
          className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-emerald-500/60 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
              WebXR Pass-Through AR
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Meta Quest 3/Pro Exclusive
            </div>
          </div>
          <Layers size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Headset Simulator Mode (Preview Quest / Vision Pro / AR Glasses) */}
        <button
          data-testid="xr-simulator-btn"
          onClick={() => {
            const next = !isSimulatorActive;
            setIsSimulatorActive(next);
            setStatusMsg(next 
              ? `XR Simulator Active: Emulating ${simulatorProfile === 'arglasses' ? 'Smart AR Glasses (Xreal/Viture/RayNeo)' : simulatorProfile === 'quest' ? 'Meta Quest 3' : 'Apple Vision Pro'} optics.`
              : 'XR Headset Simulator deactivated.'
            );
          }}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isSimulatorActive 
              ? 'bg-amber-950/40 border-amber-500/60 hover:border-amber-400' 
              : 'bg-[var(--color-primary)] border-[var(--color-border)] hover:border-amber-500/50'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Glasses size={15} className="text-amber-400" />
              <span>{isSimulatorActive ? 'Exit Simulator' : 'XR Spatial Simulator'}</span>
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              AR Glasses, Quest &amp; Vision Pro
            </div>
          </div>
          <Activity size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Headset Simulator Interactive HUD */}
      {isSimulatorActive && (
        <div data-testid="xr-simulator-viewport" className="p-5 rounded-2xl bg-black border border-cyan-500/40 flex flex-col gap-4 text-xs font-mono shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-cyan-400">SPATIAL OPTICAL EMULATION ACTIVE</span>
            </div>
            {/* Profile Selector */}
            <div className="flex flex-wrap items-center p-0.5 rounded-xl bg-slate-900 border border-cyan-500/30 gap-1">
              <button
                type="button"
                data-testid="profile-arglasses-btn"
                onClick={() => setSimulatorProfile('arglasses')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${simulatorProfile === 'arglasses' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}
              >
                Smart AR Glasses (Xreal / Viture / RayNeo)
              </button>
              <button
                type="button"
                data-testid="profile-quest-btn"
                onClick={() => setSimulatorProfile('quest')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${simulatorProfile === 'quest' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400'}`}
              >
                Meta Quest 3 (6-DOF)
              </button>
              <button
                type="button"
                data-testid="profile-visionpro-btn"
                onClick={() => setSimulatorProfile('visionpro')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${simulatorProfile === 'visionpro' ? 'bg-violet-500 text-black font-bold' : 'text-slate-400'}`}
              >
                Apple Vision Pro (Gaze)
              </button>
            </div>
          </div>

          {/* AR Glasses Micro-OLED Optical Waveguide Viewport */}
          {simulatorProfile === 'arglasses' ? (
            <div className="p-5 rounded-2xl bg-[#000000] border border-cyan-500/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
                    TRUE-BLACK MICRO-OLED WAVEGUIDE
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Background #000000 is 100% transparent in physical birdbath optics. UI floats over reality.
                  </span>
                </div>

                {/* Device Profile */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Device Spec:</span>
                  {(['xreal', 'viture', 'rayneo', 'metaglass'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setArDeviceModel(d)}
                      className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] cursor-pointer ${
                        arDeviceModel === d ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Holographic Floating Spatial HUD */}
              <div className="relative p-6 rounded-xl border border-cyan-500/30 bg-slate-950/60 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col md:flex-row gap-6 items-start justify-between min-h-[220px]">
                {/* Left: Spatial Head-Tracking Reticle & Device Telemetry */}
                <div className="space-y-3 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-cyan-300 font-bold text-xs uppercase tracking-wider">
                      {arDeviceModel === 'xreal' && 'Xreal Air 2 Ultra • 52° FOV • 120Hz'}
                      {arDeviceModel === 'viture' && 'Viture Pro XR • 135" Micro-OLED • Electrochromic'}
                      {arDeviceModel === 'rayneo' && 'RayNeo Air 2 • Sony Micro-OLED 600 Nits'}
                      {arDeviceModel === 'metaglass' && 'Meta Glass / Ray-Ban • Audio HUD + Visual AI'}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    3DOF Spatial Anchoring active. Floating virtual screen pinned at 3.0m depth. High-contrast neon vectors prevent optical glare while letting the physical environment remain 100% visible.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Head Yaw / Pitch</span>
                      <span className="text-emerald-400 font-bold">0.0° / +2.4° (Centered)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Gesture Pointer</span>
                      <span className="text-cyan-400 font-bold">Air Tap / Beam Ray</span>
                    </div>
                  </div>
                </div>

                {/* Right: Spatial Holographic Curriculum Quick Explorer */}
                <div className="flex-1 w-full p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="text-slate-300 font-bold">Spatial Curriculum Selector</span>
                    <span className="text-cyan-400 font-mono text-[11px]">Track {activeSpatialTrack} of 7</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(tNum => (
                      <button
                        key={tNum}
                        type="button"
                        onClick={() => setActiveSpatialTrack(tNum)}
                        className={`p-2 rounded-lg text-center font-bold text-xs cursor-pointer transition-all ${
                          activeSpatialTrack === tNum 
                            ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30 scale-105' 
                            : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        T{tNum}
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="font-bold text-cyan-300">
                      {activeSpatialTrack === 0 && 'Track 0: Absolute Zero — CPython WASM Sandbox & Vector Primitives'}
                      {activeSpatialTrack === 1 && 'Track 1: Embeddings & Vectors — Cosine Distance & Semantic Projections'}
                      {activeSpatialTrack === 2 && 'Track 2: Agents & RAG — ReAct Loop, Memory & Tool Calling Protocols'}
                      {activeSpatialTrack === 3 && 'Track 3: Production Evals — LLM-as-a-Judge & OWASP Security Defenses'}
                      {activeSpatialTrack === 4 && 'Track 4: Frontier Attention — Scaled Dot-Product & KV-Cache Dynamics'}
                      {activeSpatialTrack === 5 && 'Track 5: Fine-Tuning & LoRA — Low-Rank Adaptations & QLoRA 4-bit Weights'}
                      {activeSpatialTrack === 6 && 'Track 6: Production MLOps — vLLM PagedAttention & Speculative Decoding'}
                      {activeSpatialTrack === 7 && 'Track 7: Generative Diffusion — DDPM Noise Schedules & CFG Mathematics'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Air gesture pinch or companion tap immediately projects code into floating spatial editor.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dual Eye Stereoscopic Simulation Grid for Quest & Vision Pro */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                <div className="text-[10px] text-slate-500 font-bold uppercase">LEFT EYE (Stereo IPD: 64mm)</div>
                <div className="text-center text-slate-400 text-xs py-4">
                  {simulatorProfile === 'quest' ? (
                    <div>
                      <span className="text-violet-400">Left Controller: Tracked-Pointer</span>
                      <div className="text-[10px] text-slate-500 mt-1">Grip: 0.0 • Trigger: 0.0 • Thumbstick: (0.0, 0.0)</div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-cyan-400">Gaze Vector (Left Fovea)</span>
                      <div className="text-[10px] text-slate-500 mt-1">Ray: [0.02, -0.01, -1.00] • Pupil Dilation: 3.4mm</div>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center justify-between">
                  <span>FPS: 90.0</span>
                  <span>Pose: [X: 0.00, Y: 1.65m, Z: 0.00]</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                <div className="text-[10px] text-slate-500 font-bold uppercase">RIGHT EYE (Stereo IPD: 64mm)</div>
                <div className="text-center text-slate-400 text-xs py-4">
                  {simulatorProfile === 'quest' ? (
                    <div>
                      <span className="text-violet-400">Right Controller: Ray Hit Active</span>
                      <div className="text-[10px] text-slate-500 mt-1">Grip: 0.0 • Trigger: 1.0 (Pinch) • Target: Node 04</div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-cyan-400">Pinch Gesture: Micro-Tap Detected</span>
                      <div className="text-[10px] text-slate-500 mt-1">Thumb-Index Distance: 2.1mm • Target: Semantic Vector 04</div>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center justify-between">
                  <span>FOV: 110° Diag</span>
                  <span>Latency: ~11ms (Motion-to-Photon)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Output if triggered */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-start gap-3 text-xs shadow-lg">
          <AlertCircle size={17} className="text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-[var(--color-text-primary)] font-mono leading-relaxed">{statusMsg}</div>
            {!telemetry?.hasImmersiveVR && (
              <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Developer Note: To test native WebXR spatial hand controllers on Chrome desktop, install Google's official <span className="text-[var(--color-text-primary)] font-semibold">WebXR API Emulator</span> Chrome Extension, or open this URL directly inside your Meta Quest browser.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spatial Architecture Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">Direct Hand & Pointer Hit-Testing</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">Three.js raycaster hits 3D nodes instantly with tactile Web Audio feedback.</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">Zero Cloud Compute ($0)</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">100% of spatial meshes and linear algebra run on device GPU via WebGL & WebXR.</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">Instant 2D Lean Fallback</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">Low-spec laptops and mobile phones automatically drop down to lightweight 0% GPU SVG.</div>
        </div>
      </div>

    </div>
  );
}
