import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Compass, 
  Network, 
  Glasses, 
  Cpu, 
  ShieldCheck, 
  Atom
} from 'lucide-react';
import { VectorSpace3D } from '../components/spatial/VectorSpace3D';
import { NeuralSynapse3D } from '../components/spatial/NeuralSynapse3D';
import { WebXRControls } from '../components/spatial/WebXRControls';
import { useSettingsStore } from '../store/useSettingsStore';
import { detectHardwareFull, type HardwareTelemetry } from '../utils/hardwareDetection';

type HolodeckTab = 'vectors' | 'synapses' | 'webxr';

export function SpatialHolodeck() {
  const navigate = useNavigate();
  const { graphicsTier, setGraphicsTier } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<HolodeckTab>('vectors');
  const [telemetry, setTelemetry] = useState<HardwareTelemetry | null>(null);

  useEffect(() => {
    detectHardwareFull().then(res => setTelemetry(res));
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-primary,#09090b)] text-[var(--color-text-primary,#fafafa)] flex flex-col transition-colors selection:bg-[var(--color-accent,#10b981)] selection:text-black">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-secondary)]/90 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Studio</span>
          </button>

          <div className="h-4 w-[1px] bg-[var(--color-border)]" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent,#10b981)] animate-pulse" />
            <h1 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              Spatial Holodeck
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-accent,#10b981)]/20 text-[var(--color-accent,#10b981)] border border-[var(--color-accent,#10b981)]/30 font-semibold">
                3D • VR • 2D Lean
              </span>
            </h1>
          </div>
        </div>

        {/* Graphics Tier Selector Quick Bar */}
        <div className="flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-mono text-[var(--color-text-secondary)] font-semibold hidden sm:inline shrink-0">Compute Tier:</span>
          <div className="flex p-1 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-mono shadow-sm shrink-0">
            <button
              onClick={() => setGraphicsTier('auto')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === 'auto' ? 'bg-[var(--color-accent,#10b981)] text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Auto-detects hardware and picks optimal mode"
            >
              Auto
            </button>
            <button
              onClick={() => setGraphicsTier('2d-lean')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === '2d-lean' ? 'bg-amber-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Ultra-lightweight 2D SVG (0% GPU load)"
            >
              2D Lean
            </button>
            <button
              onClick={() => setGraphicsTier('3d-hardware')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === '3d-hardware' ? 'bg-cyan-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Hardware accelerated 3D WebGL"
            >
              3D WebGL
            </button>
            <button
              onClick={() => setGraphicsTier('spatial-xr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === 'spatial-xr' ? 'bg-purple-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Immersive 6-DOF WebXR for Quest & Vision Pro"
            >
              Spatial XR
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 pb-36 space-y-6">
        
        {/* Hardware Telemetry Bar */}
        <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)]">
              <Cpu size={16} />
            </div>
            <div>
              <div className="text-[var(--color-text-primary)] font-semibold">
                GPU: {telemetry ? telemetry.rendererName.slice(0, 45) : 'Scanning Hardware...'}
              </div>
              <div className="text-[11px] text-[var(--color-text-secondary)]">
                WebGL: {telemetry?.hasWebGL ? 'Supported (Hardware)' : 'Disabled'} • WebXR: {telemetry?.hasWebXR ? 'Active' : 'Standby'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[var(--color-text-secondary)]">Recommended:</span>
              <span className="text-[var(--color-text-primary)] font-bold">{telemetry?.recommendedTier || '3d-hardware'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center gap-2">
              <span className="text-[var(--color-text-secondary)]">Active Profile:</span>
              <span className="text-[var(--color-accent)] font-bold">{graphicsTier.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--color-border)] gap-2 overflow-x-auto no-scrollbar max-w-full whitespace-nowrap pb-0.5">
          <button
            onClick={() => setActiveTab('vectors')}
            className={`pb-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'vectors'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Compass size={16} />
            <span>Semantic Vector Galaxy (3D/2D)</span>
          </button>

          <button
            onClick={() => setActiveTab('synapses')}
            className={`pb-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'synapses'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Network size={16} />
            <span>Neural Synapse Propagation</span>
          </button>

          <button
            onClick={() => setActiveTab('webxr')}
            className={`pb-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'webxr'
                ? 'border-violet-400 text-violet-400'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Glasses size={16} />
            <span>WebXR Spatial Gateway</span>
          </button>
        </div>

        {/* Active View */}
        <div className="space-y-6">
          {activeTab === 'vectors' && (
            <div className="space-y-4">
              <VectorSpace3D force2D={graphicsTier === '2d-lean'} />
            </div>
          )}

          {activeTab === 'synapses' && (
            <div className="space-y-4">
              <NeuralSynapse3D force2D={graphicsTier === '2d-lean'} />
            </div>
          )}

          {activeTab === 'webxr' && (
            <div className="space-y-4">
              <WebXRControls />
            </div>
          )}
        </div>

        {/* First-Principles Spatial Intuition Section */}
        <div className="pt-6 border-t border-[var(--color-border)] space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2">
            <Atom size={14} className="text-[var(--color-accent)]" />
            First-Principles: Spatial Geometry & Universal Compatibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Vector Space */}
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
              <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Compass size={15} className="text-emerald-400" />
                Why AI Lives in High-Dimensional Space
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                When a Large Language Model understands language, it converts each token into a dense vector (e.g., 1536 floating point numbers). Words with similar semantic meanings cluster together in space. Here, we project these 1536 dimensions down to 3D Euclidean coordinates so human eyes can orbit and perceive semantic proximity.
              </p>
            </div>

            {/* Card 2: Neural Synapses */}
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
              <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Network size={15} className="text-purple-400" />
                Action Potentials & Synaptic Weights
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Information travels through multi-layer perceptrons as continuous matrix multiplications (<code className="text-[var(--color-accent)] font-mono">W · x + b</code>) followed by non-linear activations (ReLU / GELU). Green synaptic lines represent excitatory signals, pink represent inhibitory signals, and traveling pulses model forward inference in real-time.
              </p>
            </div>

            {/* Card 3: $0 Rule & Device Adaptation */}
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
              <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <ShieldCheck size={15} className="text-cyan-400" />
                Hardware-Adaptive Tiering ($0 Cost)
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                OpenGuide is designed to run anywhere. If you are on an older laptop or battery saver, <strong className="text-[var(--color-text-primary)]">2D Lean Mode</strong> renders pure SVG with 0% GPU load. If you have a GPU, <strong className="text-[var(--color-text-primary)]">3D WebGL</strong> activates 60FPS orbit. And if you wear a Meta Quest or Apple Vision Pro, <strong className="text-[var(--color-text-primary)]">WebXR</strong> places the vectors directly in your room.
              </p>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
