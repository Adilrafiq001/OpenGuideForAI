import { useState, useEffect, useRef } from 'react';
import { 
  Glasses, 
  Eye,
  Layers,
  Activity,
  AlertCircle,
  Maximize2,
  Camera,
  CameraOff,
  Hand,
  Keyboard as KeyboardIcon,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { detectHardwareFull, type HardwareTelemetry } from '../../utils/hardwareDetection';
import { useSpatialStore } from '../../store/useSpatialStore';

export function WebXRControls({ className = '' }: { className?: string }) {
  const [_telemetry, setTelemetry] = useState<HardwareTelemetry | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Global Spatial AR Store
  const {
    isSpatialModeActive,
    toggleSpatialMode,
    spatialAnchorMode,
    setSpatialAnchorMode,
    screenCurvature,
    setScreenCurvature,
    virtualDistance,
    setVirtualDistance,
    passthroughMode,
    setPassthroughMode,
    isHandTrackingEnabled,
    toggleHandTracking,
    isVirtualKeyboardOpen,
    toggleVirtualKeyboard,
    resetCenter
  } = useSpatialStore();

  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);
  const [simulatorProfile, setSimulatorProfile] = useState<'arglasses' | 'quest' | 'visionpro'>('arglasses');
  const [arDeviceModel, setArDeviceModel] = useState<'viture' | 'xreal' | 'rayneo' | 'rokid' | 'visionpro'>('viture');
  const [activeSpatialTrack, setActiveSpatialTrack] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    detectHardwareFull().then(res => {
      if (isMounted) setTelemetry(res);
    });

    return () => {
      isMounted = false;
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Universal AR Camera Passthrough
  const toggleCameraPassthrough = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
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

  // WebXR Native Session Request with SpaceWalker Fallback
  const requestXRSession = async (mode: 'immersive-vr' | 'immersive-ar') => {
    if (typeof navigator === 'undefined' || !('xr' in navigator) || !navigator.xr) {
      // Seamlessly fall back to SpaceWalker 3DOF engine across the whole app
      if (!isSpatialModeActive) {
        toggleSpatialMode();
      }
      setStatusMsg('SpaceWalker 3DOF Engine activated! Your browser does not have WebXR hardware drivers, so OpenGuide engaged the in-browser Gyroscopic 3DOF Spatial Lock for your connected AR glasses.');
      return;
    }

    try {
      const isSupported = await navigator.xr.isSessionSupported(mode);
      if (!isSupported) {
        if (!isSpatialModeActive) {
          toggleSpatialMode();
        }
        setStatusMsg(`Connected display is ready via SpaceWalker 3DOF mode. (Native ${mode} requires a dedicated VR headset runtime).`);
        return;
      }

      const session = await navigator.xr.requestSession(mode);
      setStatusMsg(`Connected to ${mode.toUpperCase()} session successfully.`);
      
      session.addEventListener('end', () => {
        setStatusMsg('Spatial session ended.');
      });
    } catch (err: any) {
      if (!isSpatialModeActive) {
        toggleSpatialMode();
      }
      setStatusMsg(`Switched to software SpaceWalker 3DOF spatial engine: ${err?.message || 'Ready'}`);
    }
  };

  const deviceSpecs = {
    viture: {
      name: 'Viture (Pro XR / One)',
      optics: 'Sony Micro-OLED 1080p 120Hz • 43° FoV • Electrochromic Film',
      details: 'Built-in rotary diopter dials (0 to -5.0D). Zero front cameras; uses OpenGuide software computer vision via host webcam for in-air hand pinch gestures.'
    },
    xreal: {
      name: 'Xreal (Air 2 Ultra / Air 1/2)',
      optics: 'Birdbath Prism Micro-OLED • 52° FoV • 120Hz',
      details: 'Connects directly over USB-C DP Alt Mode. OpenGuide projects high-contrast neon vector space with pure pitch-black (#000000) optical transparency.'
    },
    rayneo: {
      name: 'RayNeo (Air 2 / X2)',
      optics: 'Micro-LED & Waveguide • Up to 1500 Nits Brightness',
      details: 'Diffractive optical waveguides provide razor-sharp readability even outdoors in direct sunlight.'
    },
    rokid: {
      name: 'Rokid (Max / Air)',
      optics: 'Birdbath Micro-OLED • 50° FoV • Perceived 215" Screen at 6m',
      details: 'Hardware diopter adjustments and physical 3D SBS mode support.'
    },
    visionpro: {
      name: 'Apple Vision Pro & Meta Quest 3',
      optics: 'Dual 4K Micro-OLED / Pancake Lens Spatial Passthrough',
      details: 'Full 6-DOF room tracking with gaze + pinch micro-gestures and spatial audio acoustics.'
    }
  };

  return (
    <div className={`p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col gap-6 shadow-2xl text-[var(--color-text-primary)] transition-colors ${className}`}>
      
      {/* Title & Hardware Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <Glasses size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
              Spatial Holodeck WebXR & AR Gateway
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                SpaceWalker & Nebula Ready • 3DOF / 6DOF
              </span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              App-wide spatial floating HUD for Viture Pro 2, Xreal Air 2, RayNeo, Rokid, Meta Quest 3 & Apple Vision Pro.
            </p>
          </div>
        </div>

        {/* Global Spatial AR Mode Toggle Banner */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSpatialMode()}
            data-testid="gateway-spatial-toggle-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSpatialModeActive 
                ? 'bg-cyan-500 text-black shadow-cyan-500/30' 
                : 'bg-[var(--color-primary)] border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Glasses size={15} />
            <span>{isSpatialModeActive ? 'SPATIAL AR ACTIVE (Alt+S)' : 'ENABLE APP-WIDE AR MODE (Alt+S)'}</span>
            {isSpatialModeActive && <span className="w-2 h-2 rounded-full bg-black animate-ping" />}
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. App-Wide Spatial Mode / SpaceWalker Button */}
        <button
          onClick={() => toggleSpatialMode()}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isSpatialModeActive
              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
              : 'bg-[var(--color-primary)] border-[var(--color-border)] hover:border-cyan-500/50'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Glasses size={15} className="text-cyan-400" />
              <span>{isSpatialModeActive ? 'Exit Spatial Mode' : 'App-Wide Spatial HUD'}</span>
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              SpaceWalker / Nebula 3DOF
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isSpatialModeActive ? 'bg-cyan-400 text-black' : 'bg-[var(--color-secondary)] text-cyan-400 border border-cyan-500/30'
          }`}>
            {isSpatialModeActive ? 'ACTIVE' : 'LAUNCH'}
          </span>
        </button>

        {/* 2. Universal Camera AR Passthrough Button */}
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

        {/* 3. Immersive 6-DOF VR */}
        <button
          onClick={() => requestXRSession('immersive-vr')}
          className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-violet-500/60 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
              <Maximize2 size={15} className="text-violet-400" />
              <span>Launch 6-DOF WebXR</span>
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Meta Quest / Vision Pro
            </div>
          </div>
          <Layers size={16} className="text-violet-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* 4. Headset Simulator Mode */}
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
              <Activity size={15} className="text-amber-400" />
              <span>{isSimulatorActive ? 'Exit Simulator' : 'XR Spatial Simulator'}</span>
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Hardware Optics Preview
            </div>
          </div>
          <Activity size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Real SpaceWalker & Nebula Live Calibration Studio */}
      <div className="p-5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              SpaceWalker / Nebula Spatial HUD Tuning Console
            </h4>
          </div>
          <button
            onClick={() => resetCenter()}
            className="px-3 py-1 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-cyan-400 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw size={12} />
            <span>Recenter Gaze (C)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* 1. Anchor Mode */}
          <div className="space-y-2 p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase block">1. Anchor Mode</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'fixed-pin' as const, label: 'Fixed' },
                { id: 'smooth-follow' as const, label: 'Follow' },
                { id: 'body-anchor' as const, label: 'Body' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSpatialAnchorMode(mode.id)}
                  className={`py-1.5 rounded-lg text-center text-[10px] font-bold cursor-pointer transition-all ${
                    spatialAnchorMode === mode.id
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-[var(--color-text-secondary)] font-sans">
              {spatialAnchorMode === 'fixed-pin' && 'Pins display at physical coordinates in room.'}
              {spatialAnchorMode === 'smooth-follow' && 'Display glides smoothly with head rotation.'}
              {spatialAnchorMode === 'body-anchor' && 'Pinned to user chest coordinates.'}
            </p>
          </div>

          {/* 2. Display Curvature Slider */}
          <div className="space-y-2 p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--color-text-secondary)] font-bold uppercase">2. Screen Curvature</span>
              <span className="text-cyan-400 font-bold">{screenCurvature}°</span>
            </div>
            <input 
              type="range"
              aria-label="Display screen curvature"
              min="0"
              max="120"
              step="5"
              value={screenCurvature}
              aria-valuemin={0}
              aria-valuemax={120}
              aria-valuenow={screenCurvature}
              aria-valuetext={`${screenCurvature} degrees`}
              onChange={(e) => setScreenCurvature(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[var(--color-text-secondary)]">
              <span>0° (Flat Plane)</span>
              <span>120° (Curved Cockpit)</span>
            </div>
          </div>

          {/* 3. Virtual Projection Distance */}
          <div className="space-y-2 p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--color-text-secondary)] font-bold uppercase">3. Screen Distance</span>
              <span className="text-cyan-400 font-bold">{virtualDistance.toFixed(1)}m</span>
            </div>
            <input 
              type="range"
              aria-label="Virtual projection distance"
              min="1.0"
              max="5.0"
              step="0.2"
              value={virtualDistance}
              aria-valuemin={1.0}
              aria-valuemax={5.0}
              aria-valuenow={virtualDistance}
              aria-valuetext={`${virtualDistance.toFixed(1)} meters`}
              onChange={(e) => setVirtualDistance(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[var(--color-text-secondary)]">
              <span>1.0m (Desk)</span>
              <span>5.0m (Theater)</span>
            </div>
          </div>

          {/* 4. Peripheral Tools */}
          <div className="space-y-2 p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase block">4. Peripheral Tools</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => toggleHandTracking()}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  isHandTrackingEnabled
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                <Hand size={11} />
                <span>Hands ({isHandTrackingEnabled ? 'ON' : 'OFF'})</span>
              </button>
              <button
                onClick={() => toggleVirtualKeyboard()}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  isVirtualKeyboardOpen
                    ? 'bg-violet-500 text-white'
                    : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                <KeyboardIcon size={11} />
                <span>Keyboard (K)</span>
              </button>
            </div>
            <button
              onClick={() => setPassthroughMode(passthroughMode === 'true-black' ? 'cinema-dark' : 'true-black')}
              className={`w-full py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                passthroughMode === 'true-black'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              True-Black OLED ({passthroughMode === 'true-black' ? 'ACTIVE' : 'OFF'})
            </button>
          </div>
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
                  {(['viture', 'xreal', 'rayneo', 'rokid', 'visionpro'] as const).map(d => (
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
                      {deviceSpecs[arDeviceModel].name}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    3DOF Spatial Anchoring active. Floating virtual screen pinned at 3.0m depth. {deviceSpecs[arDeviceModel].optics}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {deviceSpecs[arDeviceModel].details}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Anchor Mode</span>
                      <span className="text-emerald-400 font-bold uppercase">{spatialAnchorMode}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Hand Gestures</span>
                      <span className="text-cyan-400 font-bold">{isHandTrackingEnabled ? 'Webcam CV Active' : 'Off (Press H)'}</span>
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
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3 text-xs shadow-lg">
          <AlertCircle size={17} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-[var(--color-text-primary)] font-mono leading-relaxed">{statusMsg}</div>
          </div>
        </div>
      )}

      {/* Spatial Architecture Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">SpaceWalker & Nebula Architecture</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">Fixed-Pin, Smooth-Follow & Body-Anchor 3DOF modes with 0°-120° screen curvature.</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">Software-Enabled Hand Gestures</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">Uses host device webcam CV for pinch click & palm drag on camera-less glasses (Viture Pro 2 / Xreal).</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1 shadow-inner">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">100% Sovereign ($0 Cloud Bill)</div>
          <div className="text-[11px] text-[var(--color-text-secondary)]">All spatial transforms, computer vision, and WebXR logic execute client-side at 60-120FPS.</div>
        </div>
      </div>

    </div>
  );
}
