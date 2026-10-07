import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Glasses, 
  Tv, 
  Eye, 
  Sparkles
} from 'lucide-react';

interface ARGlassesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAR?: () => void;
}

type DeviceCategory = 'xreal' | 'viture' | 'rayneo' | 'rokid' | 'meta';

export function ARGlassesGuideModal({ isOpen, onClose, onLaunchAR }: ARGlassesGuideModalProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceCategory>('xreal');

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const deviceGuides = {
    xreal: {
      name: 'Xreal (Air 1, Air 2, Air 2 Pro, Ultra)',
      optics: 'Birdbath Prism • Micro-OLED 1080p 120Hz • 46°-52° FoV',
      cable: 'Direct USB-C DisplayPort Alt-Mode (No adapter needed on Mac/PC/iPhone 15+)',
      steps: [
        'Plug your Xreal glasses directly into your computer, Mac, or tablet via USB-C.',
        'Your OS will instantly recognize the glasses as a secondary 1080p 120Hz display.',
        'Launch OpenGuide Holodeck and click "Enable True-Black OLED Optical Passthrough" (or press G).',
        'Because Xreal optics use Micro-OLED panels, pure pitch black (#000000) emits zero light, making your room 100% visible while neural networks float in 3D mid-air in front of you!'
      ],
      tip: 'Pro Tip: On Xreal Air 2 Pro, press the electrochromic dimming rocker on the right frame temple to choose 0%, 35%, or 100% ambient light transmission.'
    },
    viture: {
      name: 'Viture (One, One Lite, Pro XR)',
      optics: 'Birdbath Optical Engine • Sony Micro-OLED 1080p 120Hz • 43° FoV',
      cable: 'Direct Magnetic USB-C Connection with DP Alt-Mode',
      steps: [
        'Connect the magnetic USB-C cable from your computer to the right temple of your Viture glasses.',
        'Adjust the rotary diopter knobs on top of each eye if you wear prescription glasses (0 to -5.0D).',
        'Launch OpenGuide Holodeck in True-Black Mode.',
        'Use Viture SpaceWalker (optional) for enhanced 3DOF multiscreen pinned anchors, or use OpenGuide built-in 3DOF gyroscopic spatial lock.'
      ],
      tip: 'Pro Tip: Double-click the mode button on the left temple to toggle physical electrochromic lens tinting for daylight vs darkroom usage.'
    },
    rayneo: {
      name: 'RayNeo (Air 2, X2, X2 Lite)',
      optics: 'Micro-LED & Micro-OLED Waveguide • Up to 1500 nits brightness',
      cable: 'USB-C DP Alt-Mode or Standalone Wireless AR (RayNeo X2)',
      steps: [
        'Plug in via USB-C or open OpenGuide in the RayNeo Chromium browser on standalone X2.',
        'Enable Spatial Holodeck True-Black mode.',
        'The diffractive optical waveguides project high-contrast neural topologies directly over your field of vision with zero visual distortion.',
        'Navigate nodes using keyboard shortcuts, mouse gaze, or touchpad on the right frame.'
      ],
      tip: 'Pro Tip: RayNeo optical waveguides provide true see-through visibility even outdoors in bright sunshine.'
    },
    rokid: {
      name: 'Rokid (Max, Station, Air)',
      optics: 'Birdbath Micro-OLED • 50° FoV • 120Hz Refresh Rate',
      cable: 'Direct USB-C Cable to PC, Mac, iPad, or Rokid Station',
      steps: [
        'Connect the braided USB-C cable to your Rokid Max glasses.',
        'Turn the diopter dials on top of the glasses for razor-sharp focus.',
        'Activate OpenGuide Spatial Holodeck in True-Black mode.',
        'Experience a perceived 215-inch virtual floating spatial AI manifold at 6 meters distance.'
      ],
      tip: 'Pro Tip: Rokid Max supports physical 2D/3D SBS mode by holding the volume button for 2 seconds.'
    },
    meta: {
      name: 'Meta Quest (3, 3S, Pro) & Apple Vision Pro',
      optics: 'Full 4K Spatial Passthrough & Immersive VR/XR Environment',
      cable: 'Wireless Standalone WebXR or USB-C Link Cable',
      steps: [
        'Open Meta Quest Browser on Quest 3 or Safari on Apple Vision Pro.',
        'Navigate to openguideforai.dpdns.org/holodeck.',
        'Click the "Enter Immersive VR / AR" button on the spatial toolbar.',
        'Use natural hand pinch gestures or spatial motion controllers to grab, rotate, and traverse vector embedding clusters in full 6DOF room-scale space.'
      ],
      tip: 'Pro Tip: On Meta Quest 3, double-tap the side of your headset to toggle between full room passthrough and darkroom immersive cosmos.'
    }
  };

  const currentGuide = deviceGuides[activeDevice];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
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
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-primary)]/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Glasses size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="ar-guide-title" className="text-base sm:text-lg font-bold tracking-tight">
                      Smart AR Glasses Mode: Setup & Controls
                    </h2>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold uppercase">
                      Xreal • Viture • RayNeo • VR
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Zero installations or apps required: Plug in via USB-C DisplayPort Alt-Mode for in-air 3D spatial AI
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
                { id: 'xreal' as const, label: 'Xreal (Air 1/2/Ultra)' },
                { id: 'viture' as const, label: 'Viture (One/Pro XR)' },
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
                  <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentGuide.tip}</span>
                </div>
              </div>

              {/* Spatial Keyboard & Controller Shortcuts */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Spatial Gaze, Bluetooth Clicker & Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">G</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">True-Black Passthrough</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">Space</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">3DOF Spatial Pin / Lock</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">↑ ↓ ← →</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Orbit / Zoom Manifold</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-bold">Esc</kbd>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">Exit Spatial Mode</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                100% Client-Side WebGL / WebXR • Zero proprietary software or cloud bills required
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-primary)] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Close Guide
                </button>
                {onLaunchAR && (
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchAR();
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <Glasses size={14} />
                    <span>Launch Holodeck in AR Mode</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
