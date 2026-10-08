import { useEffect, useState, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Glasses, 
  Keyboard, 
  Hand, 
  RotateCcw, 
  Sliders, 
  Camera,
  X 
} from 'lucide-react';
import { useSpatialStore, type SpatialPassthroughMode } from '../../store/useSpatialStore';
import { handGestureEngine } from '../../utils/handGestureEngine';
import { VirtualSpatialKeyboard } from './VirtualSpatialKeyboard';

interface AppWideSpatialHUDProps {
  children: ReactNode;
}

export function AppWideSpatialHUD({ children }: AppWideSpatialHUDProps) {
  const {
    isSpatialModeActive,
    setSpatialModeActive,
    spatialAnchorMode,
    setSpatialAnchorMode,
    screenCurvature,
    setScreenCurvature,
    virtualDistance,
    setVirtualDistance,
    passthroughMode,
    setPassthroughMode,
    deviceProfile: _deviceProfile,
    setDeviceProfile: _setDeviceProfile,
    yaw,
    pitch,
    originYaw,
    originPitch,
    setOrientation,
    resetCenter,
    isHandTrackingEnabled,
    toggleHandTracking,
    isVirtualKeyboardOpen,
    toggleVirtualKeyboard,
    cursorPos,
    setCursorPos,
    isPinching,
    setPinching,
    detectedGesture,
    setDetectedGesture
  } = useSpatialStore();

  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [showCameraPip, setShowCameraPip] = useState(true);
  const [_cameraError, setCameraError] = useState<string | null>(null);
  const wasPinchingRef = useRef(false);

  // Global hotkeys for AR Glasses wearers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+S: Toggle Spatial Mode
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setSpatialModeActive(!isSpatialModeActive);
      }
      if (!isSpatialModeActive) return;

      // When inside spatial mode
      const target = e.target as HTMLElement | null;
      const isEditable = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        Boolean(target.closest?.('[contenteditable="true"]')) ||
        Boolean(target.closest?.('.cm-editor')) ||
        Boolean(target.closest?.('.monaco-editor'))
      );

      if (isEditable) return;

      if (e.key === 'c' || e.key === 'C') {
        resetCenter();
      } else if (e.key === 'k' || e.key === 'K') {
        toggleVirtualKeyboard();
      } else if (e.key === 'h' || e.key === 'H') {
        toggleHandTracking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpatialModeActive, setSpatialModeActive, resetCenter, toggleVirtualKeyboard, toggleHandTracking]);

  // Orientation tracking (Gyro 3DOF)
  useEffect(() => {
    if (!isSpatialModeActive) return;

    handGestureEngine.startOrientationTracking((newYaw, newPitch, newRoll) => {
      setOrientation(newYaw, newPitch, newRoll);
    });

    return () => {
      handGestureEngine.stopOrientationTracking();
    };
  }, [isSpatialModeActive, setOrientation]);

  // Webcam Hand Tracking lifecycle
  useEffect(() => {
    if (!isSpatialModeActive || !isHandTrackingEnabled) {
      handGestureEngine.stopWebcamHandTracking();
      wasPinchingRef.current = false;
      return;
    }

    handGestureEngine.startWebcamHandTracking((frame) => {
      setCursorPos(frame.cursorX, frame.cursorY);
      setPinching(frame.isPinching);
      setDetectedGesture(frame.gesture);

      // Robust synthetic pointer event dispatch on pinch trigger (rising edge only)
      if (frame.isPinching && !wasPinchingRef.current) {
        wasPinchingRef.current = true;
        const clientX = (frame.cursorX / 100) * window.innerWidth;
        const clientY = (frame.cursorY / 100) * window.innerHeight;
        const targetEl = document.elementFromPoint(clientX, clientY);
        if (targetEl) {
          const eventInit = { bubbles: true, cancelable: true, clientX, clientY, view: window };
          targetEl.dispatchEvent(new PointerEvent('pointerdown', eventInit));
          targetEl.dispatchEvent(new MouseEvent('mousedown', eventInit));
          targetEl.dispatchEvent(new PointerEvent('pointerup', eventInit));
          targetEl.dispatchEvent(new MouseEvent('mouseup', eventInit));
          if ((targetEl as HTMLElement).click) {
            (targetEl as HTMLElement).click();
          } else {
            targetEl.dispatchEvent(new MouseEvent('click', eventInit));
          }
        }
      } else if (!frame.isPinching) {
        wasPinchingRef.current = false;
      }
    }).then((res) => {
      if (!res.success) {
        setCameraError(res.error || 'Failed to start camera for hand gestures.');
      } else {
        setCameraError(null);
      }
    });

    return () => {
      handGestureEngine.stopWebcamHandTracking();
      wasPinchingRef.current = false;
    };
  }, [isSpatialModeActive, isHandTrackingEnabled, setCursorPos, setPinching, setDetectedGesture]);

  // Calculate 3DOF rotational transform offsets
  const deltaYaw = yaw - originYaw;
  const deltaPitch = pitch - originPitch;

  let rotateYDeg = 0;
  let rotateXDeg = 0;

  if (spatialAnchorMode === 'fixed-pin') {
    rotateYDeg = -deltaYaw * 0.8;
    rotateXDeg = deltaPitch * 0.8;
  } else if (spatialAnchorMode === 'smooth-follow') {
    rotateYDeg = -deltaYaw * 0.25;
    rotateXDeg = deltaPitch * 0.25;
  } // body-anchor keeps monitor anchored to chest coordinates (0 deg)

  // Clamp rotation angles to prevent flipping
  rotateYDeg = Math.max(-45, Math.min(45, rotateYDeg));
  rotateXDeg = Math.max(-30, Math.min(30, rotateXDeg));

  if (!isSpatialModeActive) {
    return <>{children}</>;
  }

  const isBezelMode = passthroughMode !== 'native-theme';
  const containerBg = passthroughMode === 'true-black' 
    ? '#000000' 
    : passthroughMode === 'cinema-dark' 
      ? '#05070d' 
      : 'var(--color-primary)';

  return (
    <div 
      data-testid="app-wide-spatial-hud"
      className="relative min-h-screen w-full overflow-x-hidden select-none transition-colors duration-300"
      style={{
        backgroundColor: containerBg,
        color: passthroughMode === 'native-theme' ? 'var(--color-text-primary)' : '#f8fafc'
      }}
    >
      {/* SpaceWalker Top Control Bar */}
      <header className="fixed top-0 inset-x-0 z-[220] px-4 py-2.5 flex items-center justify-between gap-3 bg-black/95 backdrop-blur-2xl border-b border-cyan-500/30 text-xs font-mono shadow-2xl overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Glasses size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">SpaceWalker 3DOF HUD Active</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                {spatialAnchorMode.toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              SpaceWalker & Nebula Architecture // True-Black Micro-OLED Optical Passthrough
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Recenter 3DOF button */}
          <button
            onClick={resetCenter}
            data-testid="spatial-recenter-btn"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Recenter virtual screen in front of your current gaze (Press C)"
          >
            <RotateCcw size={12} className="text-cyan-400" />
            <span className="hidden sm:inline">Recenter (C)</span>
          </button>

          {/* Anchor Mode Selector */}
          <div className="flex p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <button
              onClick={() => setSpatialAnchorMode('fixed-pin')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                spatialAnchorMode === 'fixed-pin' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
              }`}
              title="Fixed Pin: Screen stays pinned in 3D room space like a real 120 inch TV"
            >
              Fixed
            </button>
            <button
              onClick={() => setSpatialAnchorMode('smooth-follow')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                spatialAnchorMode === 'smooth-follow' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
              }`}
              title="Smooth Follow: Screen smoothly follows your head gaze"
            >
              Follow
            </button>
            <button
              onClick={() => setSpatialAnchorMode('body-anchor')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                spatialAnchorMode === 'body-anchor' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
              }`}
              title="Body Anchor: Anchored to chest coordinates"
            >
              Body
            </button>
          </div>

          {/* Hand Tracking Toggle */}
          <button
            onClick={toggleHandTracking}
            data-testid="toggle-hand-tracking-btn"
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isHandTrackingEnabled
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-400'
            }`}
            title="Software-enabled hand tracking via host camera (for Viture Pro 2 / Xreal Air 2)"
          >
            <Hand size={12} className={isHandTrackingEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-400'} />
            <span className="hidden sm:inline">Hands {isHandTrackingEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            onClick={toggleVirtualKeyboard}
            data-testid="spatial-keyboard-toggle-btn"
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isVirtualKeyboardOpen
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-400'
            }`}
            title="Toggle floating on-demand virtual keyboard (Press K)"
          >
            <Keyboard size={12} className="text-cyan-400" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>

          {/* More Settings */}
          <button
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            data-testid="spatial-settings-drawer-btn"
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 cursor-pointer transition-colors"
            title="Spatial Curvature & Distance Sliders"
          >
            <Sliders size={14} />
          </button>

          {/* Exit Spatial Mode */}
          <button
            onClick={() => setSpatialModeActive(false)}
            data-testid="exit-spatial-mode-btn"
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer font-bold flex items-center gap-1"
            title="Exit Spatial AR Mode (Alt+S)"
          >
            <X size={13} />
            <span>Exit AR</span>
          </button>
        </div>
      </header>

      {/* Expanded Slider Controls Drawer */}
      <AnimatePresence>
        {isControlsExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            data-testid="spatial-controls-drawer"
            className="fixed top-14 inset-x-0 z-[210] p-4 bg-black/95 border-b border-cyan-500/30 flex flex-wrap items-center justify-around gap-6 text-xs font-mono shadow-2xl backdrop-blur-xl"
          >
            {/* Virtual Screen Distance Slider */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Virtual Distance:</span>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={virtualDistance}
                onChange={(e) => setVirtualDistance(parseFloat(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer"
              />
              <span className="font-bold text-cyan-300 tabular-nums">{virtualDistance}m</span>
            </div>

            {/* Screen Curvature Slider */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Curvature:</span>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={screenCurvature}
                onChange={(e) => setScreenCurvature(parseInt(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer"
              />
              <span className="font-bold text-cyan-300 tabular-nums">{screenCurvature}°</span>
            </div>

            {/* Passthrough Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Optics:</span>
              <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-700">
                {(['native-theme', 'true-black', 'cinema-dark'] as SpatialPassthroughMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPassthroughMode(mode)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      passthroughMode === mode ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'native-theme' ? 'Native Theme (PC)' : mode === 'true-black' ? 'OLED True-Black (AR)' : 'Dark Cinema'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holographic Laser Reticle (When Hand Tracking Active) */}
      {isHandTrackingEnabled && (
        <div
          data-testid="spatial-hand-laser-cursor"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
          }}
          className="fixed pointer-events-none z-[260] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
        >
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className={`w-8 h-8 rounded-full border-2 transition-all ${
              isPinching ? 'scale-75 border-emerald-400 bg-emerald-500/30' : 'border-cyan-400/80 bg-cyan-500/10'
            }`} />
            {/* Center Reticle Point */}
            <div className={`absolute w-2 h-2 rounded-full ${
              isPinching ? 'bg-emerald-300' : 'bg-cyan-300'
            }`} />
            {/* Gesture Badge */}
            {detectedGesture && detectedGesture !== 'none' && (
              <span className="absolute -bottom-5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/80 border border-cyan-500/40 text-cyan-300 uppercase font-bold">
                {detectedGesture}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Live Camera Hand Tracking Monitor PIP (Top-Right Floating, Zero Keyboard Collision) */}
      {isHandTrackingEnabled && showCameraPip && (
        <HandCvPipMonitor
          isPinching={isPinching}
          detectedGesture={detectedGesture}
          cursorPos={cursorPos}
          onClose={() => setShowCameraPip(false)}
        />
      )}

      {/* Razor-Sharp 1:1 Native Resolution Spatial Workspace - Direct ClearType Font Vectors */}
      <div 
        data-testid="spatial-canvas-stage"
        style={{
          transform: spatialAnchorMode === 'smooth-follow' && (rotateYDeg !== 0 || rotateXDeg !== 0)
            ? `translate3d(${Math.round(rotateYDeg * 2)}px, ${Math.round(rotateXDeg * 2)}px, 0)`
            : undefined,
          transition: spatialAnchorMode === 'smooth-follow' ? 'transform 0.25s ease-out' : undefined,
          maxWidth: isBezelMode 
            ? (virtualDistance <= 1.5 ? '98vw' : virtualDistance <= 2.5 ? '94vw' : virtualDistance <= 3.5 ? '88vw' : '82vw')
            : '100%',
          margin: '0 auto',
          borderRadius: isBezelMode ? `${Math.max(16, Math.round(screenCurvature / 3) + 16)}px` : undefined,
          border: isBezelMode ? '1px solid rgba(6, 182, 212, 0.3)' : undefined,
          boxShadow: isBezelMode 
            ? '0 25px 70px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(6, 182, 212, 0.08)' 
            : undefined,
          overflow: isBezelMode ? 'hidden' : undefined,
        }}
        className="w-full min-h-screen pt-16 bg-transparent transition-all duration-300"
      >
        {children}
      </div>

      {/* On-Demand Virtual Keyboard Overlay */}
      <VirtualSpatialKeyboard />
    </div>
  );
}

function HandCvPipMonitor({
  isPinching,
  detectedGesture,
  cursorPos,
  onClose,
}: {
  isPinching: boolean;
  detectedGesture: string | null;
  cursorPos: { x: number; y: number };
  onClose: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = handGestureEngine.getDisplayCanvas();
    if (canvas) {
      canvas.className = 'w-full h-auto block rounded-lg';
      mount.innerHTML = '';
      mount.appendChild(canvas);
    }

    return () => {
      if (mount) mount.innerHTML = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -20 }}
      data-testid="hand-cv-monitor-pip"
      className="fixed top-16 right-6 z-[240] p-3 rounded-2xl bg-black/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl text-xs font-mono w-72 space-y-2 pointer-events-auto"
    >
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Camera size={13} className="animate-pulse" />
          <span>HAND CV MONITOR</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">LIVE</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          aria-label="Hide camera monitor"
        >
          <X size={12} />
        </button>
      </div>

      {/* Live Video / Canvas Viewport */}
      <div 
        ref={mountRef} 
        data-testid="hand-cv-canvas-mount"
        className="w-full aspect-[4/3] bg-black/90 rounded-xl overflow-hidden border border-emerald-500/30 flex items-center justify-center relative shadow-inner"
      />

      <div className="space-y-1 text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span>Action:</span>
          <span className="font-bold text-emerald-300">
            {isPinching ? '★ PINCH CLICK TRIGGER' : detectedGesture === 'palm' ? 'OPEN PALM HOVER' : 'TRACKING RETICLE'}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>Laser Target:</span>
          <span className="text-cyan-400">{Math.round(cursorPos.x)}%, {Math.round(cursorPos.y)}%</span>
        </div>
        <p className="text-[9px] text-slate-400 pt-0.5 leading-snug">
          Host Webcam • Optical Frame Differencing + YCbCr Skin Cluster • 0 Cloud Data
        </p>
      </div>
    </motion.div>
  );
}
