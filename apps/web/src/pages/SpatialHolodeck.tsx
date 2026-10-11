import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Compass, 
  Network, 
  Glasses, 
  Cpu, 
  Atom
} from 'lucide-react';
import { VectorSpace3D } from '../components/spatial/VectorSpace3D';
import { NeuralSynapse3D } from '../components/spatial/NeuralSynapse3D';
import { WebXRControls } from '../components/spatial/WebXRControls';
import { ARGlassesGuideModal } from '../components/spatial/ARGlassesGuideModal';
import { useSettingsStore } from '../store/useSettingsStore';
import { detectHardwareFull, type HardwareTelemetry } from '../utils/hardwareDetection';

type HolodeckTab = 'vectors' | 'synapses' | 'webxr';

const TABS: { id: HolodeckTab; label: string; icon: typeof Compass; badge?: string }[] = [
  { id: 'vectors', label: 'Semantic Vector Galaxy (3D/2D)', icon: Compass },
  { id: 'synapses', label: 'Neural Synapse Propagation', icon: Network },
  { id: 'webxr', label: 'Smart AR Glasses & WebXR Gateway', icon: Glasses, badge: 'Xreal • Viture • RayNeo • Rokid' }
];

export function SpatialHolodeck() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { graphicsTier, setGraphicsTier } = useSettingsStore();

  const tabParam = searchParams.get('tab') as HolodeckTab | null;
  const activeTab: HolodeckTab = (tabParam && ['vectors', 'synapses', 'webxr'].includes(tabParam)) ? tabParam : 'vectors';

  const [telemetry, setTelemetry] = useState<HardwareTelemetry | null>(null);
  const [isARGlassesGuideOpen, setIsARGlassesGuideOpen] = useState(false);
  const tabListRef = useRef<HTMLDivElement | null>(null);

  const setActiveTab = useCallback((tab: HolodeckTab) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    let isMounted = true;
    detectHardwareFull().then(res => {
      if (isMounted) setTelemetry(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % TABS.length;
      const nextTab = TABS[nextIndex].id;
      setActiveTab(nextTab);
      const nextBtn = tabListRef.current?.querySelector<HTMLButtonElement>(`#tab-${nextTab}`);
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + TABS.length) % TABS.length;
      const prevTab = TABS[prevIndex].id;
      setActiveTab(prevTab);
      const prevBtn = tabListRef.current?.querySelector<HTMLButtonElement>(`#tab-${prevTab}`);
      prevBtn?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstTab = TABS[0].id;
      setActiveTab(firstTab);
      const firstBtn = tabListRef.current?.querySelector<HTMLButtonElement>(`#tab-${firstTab}`);
      firstBtn?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastTab = TABS[TABS.length - 1].id;
      setActiveTab(lastTab);
      const lastBtn = tabListRef.current?.querySelector<HTMLButtonElement>(`#tab-${lastTab}`);
      lastBtn?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-primary,#09090b)] text-[var(--color-text-primary,#fafafa)] flex flex-col transition-colors selection:bg-[var(--color-accent,#10b981)] selection:text-black">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-secondary)] px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to Studio"
            className="p-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-hidden"
          >
            <ArrowLeft size={16} />
            <span>Back to Studio</span>
          </button>

          <div className="h-4 w-[1px] bg-[var(--color-border)]" />

          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent,#10b981)] animate-pulse" />
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
                Spatial Holodeck
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-accent,#10b981)]/20 text-[var(--color-accent,#10b981)] border border-[var(--color-accent,#10b981)]/30 font-semibold">
                  3D Semantic Cosmos
                </span>
              </h1>
              <p className="text-[10px] font-mono text-[var(--color-text-secondary)] hidden sm:block">
                Semantic Embedding Hyper-Space // See, measure, and hear how AI models represent meaning in geometric space
              </p>
            </div>
          </div>
        </div>

        {/* Graphics Tier Selector Quick Bar */}
        <div className="flex flex-wrap items-center gap-2 max-w-full py-1">
          <span className="text-[11px] font-mono text-[var(--color-text-secondary)] font-semibold hidden sm:inline shrink-0">Compute Tier:</span>
          <div className="flex p-1 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-mono shadow-sm shrink-0" role="group" aria-label="Graphics Compute Tier Selector">
            <button
              onClick={() => setGraphicsTier('auto')}
              aria-pressed={graphicsTier === 'auto'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === 'auto' ? 'bg-[var(--color-accent,#10b981)] text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Auto-detects hardware and picks optimal mode"
            >
              Auto
            </button>
            <button
              onClick={() => setGraphicsTier('2d-lean')}
              aria-pressed={graphicsTier === '2d-lean'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === '2d-lean' ? 'bg-amber-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Ultra-lightweight 2D SVG (0% GPU load)"
            >
              2D Lean
            </button>
            <button
              onClick={() => setGraphicsTier('3d-hardware')}
              aria-pressed={graphicsTier === '3d-hardware'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === '3d-hardware' ? 'bg-cyan-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Hardware accelerated 3D WebGL"
            >
              3D WebGL
            </button>
            <button
              onClick={() => setGraphicsTier('spatial-xr')}
              aria-pressed={graphicsTier === 'spatial-xr'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphicsTier === 'spatial-xr' ? 'bg-purple-400 text-black font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Immersive 6-DOF WebXR for Quest & Vision Pro"
            >
              Spatial XR
            </button>
          </div>

          <button
            onClick={() => setIsARGlassesGuideOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-xs shrink-0"
          >
            <Glasses size={14} />
            <span>AR Glasses Guide (Xreal • Viture • RayNeo)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-64 md:pb-72 space-y-5">
        
        {/* Hardware Telemetry Bar */}
        <div className="py-2.5 px-4 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
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
        <div 
          ref={tabListRef}
          className="flex flex-wrap border-b border-[var(--color-border)] gap-2 max-w-full pb-0.5" 
          role="tablist" 
          aria-label="Holodeck Visualizer Views"
          aria-orientation="horizontal"
        >
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                tabIndex={isSelected ? 0 : -1}
                aria-selected={isSelected}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`pb-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-hidden ${
                  isSelected
                    ? tab.id === 'webxr' 
                      ? 'border-cyan-400 text-cyan-400' 
                      : 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active View */}
        <div className="space-y-6">
          {activeTab === 'vectors' && (
            <div id="tabpanel-vectors" role="tabpanel" aria-labelledby="tab-vectors" className="space-y-4">
              <VectorSpace3D force2D={graphicsTier === '2d-lean'} />
            </div>
          )}

          {activeTab === 'synapses' && (
            <div id="tabpanel-synapses" role="tabpanel" aria-labelledby="tab-synapses" className="space-y-4">
              <NeuralSynapse3D force2D={graphicsTier === '2d-lean'} />
            </div>
          )}

          {activeTab === 'webxr' && (
            <div id="tabpanel-webxr" role="tabpanel" aria-labelledby="tab-webxr" className="space-y-6">
              {/* Live Interactive 3D Semantic Vector Space embedded within the WebXR Gateway */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-bold text-cyan-300">Live Spatial Vector Canvas</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] hidden sm:inline">• Orbit & Calibrate with AR Glasses</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Interactive 3D / 2D
                  </span>
                </div>
                <VectorSpace3D force2D={graphicsTier === '2d-lean'} />
              </div>

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

            {/* Card 3: Smart AR Glasses & WebXR */}
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
              <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Glasses size={15} className="text-cyan-400" />
                Smart AR Glasses & True-Black Passthrough
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Plug your Xreal, Viture, or RayNeo smart glasses directly via USB-C DisplayPort Alt-Mode. In True-Black mode, the Micro-OLED panels emit zero photons on dark pixels, rendering the optical lenses 100% transparent while luminous 3D neural topologies float weightlessly in your physical room.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Smart AR Glasses Onboarding Modal */}
      <ARGlassesGuideModal
        isOpen={isARGlassesGuideOpen}
        onClose={() => setIsARGlassesGuideOpen(false)}
        onLaunchAR={() => setActiveTab('webxr')}
      />

    </div>
  );
}

