import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Glasses, 
  Tv, 
  Eye, 
  Zap,
  Hand,
  Compass
} from 'lucide-react';
import { useSpatialStore } from '../../store/useSpatialStore';

interface ARGlassesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAR?: () => void;
}

type DeviceCategory = 'viture' | 'xreal' | 'rayneo' | 'rokid' | 'meta';

export function ARGlassesGuideModal({ isOpen, onClose, onLaunchAR }: ARGlassesGuideModalProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceCategory>('viture');
  const { isSpatialModeActive, toggleSpatialMode } = useSpatialStore();

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const deviceGuides = {
    viture: {
      name: 'Viture (Pro XR, Pro 2, One, One Lite)',
      optics: 'Sony Micro-OLED 1080p 120Hz • 43°-46° FoV • Electrochromic Tinting',
      cable: 'Direct Magnetic USB-C DP Alt-Mode (PC / Mac / iPhone 15+ / Android)',
      handTracking: 'Software Computer Vision: Uses host laptop/phone webcam for 60FPS in-air hand pinch gestures (no cameras needed on glasses!)',
      steps: [
        'Connect the magnetic USB-C cable directly from your host device to the right temple of your Viture glasses.',
        'Adjust the rotary diopter knobs on top of each eye for 20/20 clarity (0 to -5.0D).',
        'Press Alt+S anywhere in OpenGuide to activate App-Wide Spatial AR Glasses Mode.',
        'SpaceWalker 3DOF engine instantly anchors OpenGuide in 3D mid-air (Fixed-Pin, Smooth-Follow, or Body-Anchor).',
        'Enable Hand Gestures (Press H): Point your laptop/phone webcam at your desk. Pinch index + thumb to click links, drag palm to scroll.'
      ],
      tip: 'Pro Tip: Double-click the left temple button on Viture Pro XR to activate electrochromic lens tinting for instant optical black immersion.'
    },
    xreal: {
      name: 'Xreal (Air 1, Air 2, Air 2 Pro, Ultra)',
      optics: 'Birdbath Prism • Sony Micro-OLED 1080p 120Hz • 46°-52° FoV',
      cable: 'Direct USB-C DisplayPort Alt-Mode (Zero adapters required)',
      handTracking: 'Software CV via webcam (Air 1/2) or direct 6-DOF tracking on Xreal Ultra',
      steps: [
        'Plug your Xreal glasses directly into your computer, Mac, iPad, or mobile phone via USB-C.',
        'The OS instantly treats the glasses as a secondary 1080p 120Hz spatial display.',
        'Press Alt+S or click "Spatial AR" on the header to launch the full app into SpaceWalker/Nebula 3D mode.',
        'True-Black OLED Optical Passthrough emits zero light on #000000 background, allowing your physical room to remain 100% visible while OpenGuide floats in air.',
        'Use keyboard shortcut K to open the cybernetic floating spatial keyboard for in-air typing.'
      ],
      tip: 'Pro Tip: On Xreal Air 2 Pro, use the rocker switch on the right temple to cycle through 0%, 35%, and 100% ambient light transmission.'
    },
    rayneo: {
      name: 'RayNeo (Air 2, Air 2s, X2, X2 Lite)',
      optics: 'Micro-LED & Micro-OLED Waveguide • Up to 1500 Nits Brightness',
      cable: 'USB-C DP Alt-Mode or Standalone Wireless (RayNeo X2)',
      handTracking: 'Software webcam hand tracking or right-temple capacitive touchpad gestures',
      steps: [
        'Connect via USB-C or open OpenGuide inside RayNeo Chromium browser on standalone X2.',
        'Press Alt+S to engage App-Wide Spatial Mode with customizable 0°-120° screen curvature.',
        'Diffractive waveguides project high-contrast vector space and curriculum modules directly onto your retinas with zero optical distortion.',
        'Press C at any moment to instantly recenter your virtual 3D monitor in front of your head gaze.'
      ],
      tip: 'Pro Tip: RayNeo optical waveguides provide true see-through visibility even outdoors in bright direct sunlight.'
    },
    rokid: {
      name: 'Rokid (Max, Max 2, Station, Air)',
      optics: 'Birdbath Micro-OLED • 50° FoV • 120Hz Refresh Rate',
      cable: 'Direct USB-C Cable to PC, Mac, iPad, or Rokid Station',
      handTracking: 'Host webcam computer vision or Rokid Station pointer clicker',
      steps: [
        'Connect the braided USB-C cable to your Rokid Max glasses.',
        'Turn the diopter dials on top of the frames for razor-sharp text rendering.',
        'Press Alt+S anywhere in OpenGuide to float the entire app as a perceived 215-inch virtual screen at 3 meters distance.',
        'Select between Flat Plane (0°) or Curved Cockpit (120°) in the spatial control dock.'
      ],
      tip: 'Pro Tip: Rokid Max supports physical 2D/3D SBS mode by holding the volume button for 2 seconds.'
    },
    meta: {
      name: 'Meta Quest (3, 3S, Pro) & Apple Vision Pro',
      optics: 'Dual 4K Spatial Passthrough & Immersive WebXR Environment',
      cable: 'Wireless Standalone WebXR or USB-C Link Cable',
      handTracking: 'Native 6-DOF optical hand tracking with gaze + pinch micro-gestures',
      steps: [
        'Open Meta Quest Browser on Quest 3 or visionOS Safari on Apple Vision Pro.',
        'Navigate to openguideforai.dpdns.org.',
        'Click "Spatial AR" on the header or launch "Launch 6-DOF WebXR" in the Holodeck.',
        'Use natural hand pinch gestures or spatial motion controllers to interact with code, nodes, and curriculum in full room-scale space.'
      ],
      tip: 'Pro Tip: On Meta Quest 3, double-tap the side of your headset to toggle between full room passthrough and darkroom immersive cosmos.'
    }
  };

  const currentGuide = deviceGuides[activeDevice];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ backgroundColor: 'var(--color-secondary)' }}
            className="w-full max-w-4xl max-h-[92vh] border border-[var(--color-border)] rounded-[2.5rem] shadow-2xl shadow-black/60 flex flex-col overflow-hidden text-[var(--color-text-primary)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ar-guide-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-primary)]/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Glasses size={18} />
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <h2 id="ar-guide-title" className="text-base sm:text-lg font-bold tracking-tight">
                      Smart AR Glasses Mode: Setup & Controls (SpaceWalker & Nebula Architecture)
                    </h2>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold uppercase">
                      App-Wide • 3DOF / 6DOF • Hand Gestures
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Applicable across the entire OpenGuide app (Curriculum, Labs, IDE, Holodeck) • Zero third-party apps required
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                aria-label="Close AR Glasses Guide"
              >
                <X size={16} />
              </button>
            </div>

            {/* Device Selector Tabs */}
            <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-primary)]/20 text-xs font-mono shrink-0 overflow-x-auto">
              {[
                { id: 'viture' as const, label: 'Viture (One/Pro XR)' },
                { id: 'xreal' as const, label: 'Xreal (Air 1/2/Ultra)' },
                { id: 'rayneo' as const, label: 'RayNeo (Air 2/X2)' },
                { id: 'rokid' as const, label: 'Rokid (Max)' },
                { id: 'meta' as const, label: 'Meta Quest / Vision Pro' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDevice(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeDevice === tab.id
                      ? 'bg-cyan-500 text-black font-bold shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
              {/* App-Wide Architecture Highlight Card */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Compass size={14} />
                    <span>Active Across the Entire Application</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Smart AR Glasses mode is not limited to the Holodeck. You can code in the Python IDE, study curriculum tracks, inspect vector embeddings, and take quizzes inside a floating 3D cockpit.
                  </p>
                </div>
                <button
                  onClick={() => toggleSpatialMode()}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 cursor-pointer transition-all ${
                    isSpatialModeActive
                      ? 'bg-cyan-400 text-black'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  {isSpatialModeActive ? 'Spatial AR Active (Alt+S)' : 'Toggle AR Mode (Alt+S)'}
                </button>
              </div>

              {/* Hardware Summary Card */}
              <div className="p-5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                      {currentGuide.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
                    {currentGuide.cable}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Tv size={14} className="text-cyan-400 shrink-0" />
                    <span><strong>Optics:</strong> {currentGuide.optics}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Eye size={14} className="text-emerald-400 shrink-0" />
                    <span><strong>Passthrough:</strong> True-Black Micro-OLED Optical Waveguide</span>
                  </div>
                </div>

                <div className="pt-1 flex items-start gap-2 text-xs text-cyan-300 bg-cyan-500/5 p-2.5 rounded-xl border border-cyan-500/20">
                  <Hand size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Hand Tracking:</strong> {currentGuide.handTracking}</span>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  How To Launch in 30 Seconds
                </h4>
                <div className="space-y-2">
                  {currentGuide.steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-border)]"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pro Tip */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                  <Zap size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentGuide.tip}</span>
                </div>
              </div>

              {/* Spatial Keyboard & Controller Shortcuts */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Universal SpaceWalker Shortcuts & In-Air Controls
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">Alt+S</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Toggle Spatial AR</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">C</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Recenter Head Gaze</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">K</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Virtual Keyboard</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">H</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Webcam Hand CV</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">G</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">True-Black OLED</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">1 / 2 / 3</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Anchor Modes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                100% Client-Side WebGL / WebXR • Zero proprietary apps or cloud costs
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-primary)] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Close Guide
                </button>
                <button
                  onClick={() => {
                    toggleSpatialMode();
                    if (onLaunchAR) onLaunchAR();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <Glasses size={14} />
                  <span>{isSpatialModeActive ? 'Exit Spatial Mode' : 'Enter Spatial Mode (Alt+S)'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
