import { useState } from 'react';
import {
  Globe,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Check,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface EdgeDeployLabProps {
  onDeploySuccess?: () => void;
  lessonId?: string;
}

export function EdgeDeployLab({ onDeploySuccess, lessonId: _lessonId }: EdgeDeployLabProps) {
  const [activeTab, setActiveTab] = useState<'cdn' | 'storage' | 'secrets'>('cdn');
  
  // Tab 1: Edge CDN & DNS
  const [subdomain, setSubdomain] = useState('my-ai-studio');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'building' | 'deployed'>('idle');
  const [customDomain] = useState('app.mydomain.com');
  const [dnsVerified, setDnsVerified] = useState(false);

  // Tab 2: Local-First IndexedDB
  const [storedRecordCount] = useState(3);
  const [dbName] = useState('OpenGuideLocalStore');
  const [simulatedReload, setSimulatedReload] = useState(false);
  const [storageFeedback, setStorageFeedback] = useState<string | null>(null);

  // Tab 3: Secret Leak Scanner
  const [envFileText, setEnvFileText] = useState(
`# Client-Safe Environment Variables
VITE_APP_TITLE="AI Invoice Studio"
VITE_PUBLIC_API_URL="https://api.example.com"
# WARNING: Did an AI assistant add this?
STRIPE_SECRET_KEY="sk_live_51M0SecretKeyDoNotLeakToBrowser"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret"
`
  );
  const [scanResult, setScanResult] = useState<{
    clean: boolean;
    leaks: string[];
  } | null>(null);

  const checkMastery = () => {
    if (deployStatus === 'deployed' || dnsVerified || storageFeedback) {
      onDeploySuccess?.();
    }
  };

  // Simulate Edge Deployment
  const handleRunDeploy = () => {
    setIsDeploying(true);
    setDeployStatus('building');
    setDeployLogs([
      '⚡ Initializing Cloudflare Pages edge build worker...',
      '📦 Running: yarn build (Vite + React 18 + TS)',
      '🔍 Scanning dist/ output directory: 100% static assets (HTML/CSS/JS/WASM)',
      '🌐 Cloning immutable bundle to 310+ global PoP data centers...'
    ]);

    setTimeout(() => {
      setDeployLogs(prev => [
        ...prev,
        '🛡️ HTTP Cache-Control: max-age=31536000, immutable verified.',
        '🚀 Edge deployment complete: https://' + subdomain + '.pages.dev (0ms cold start)'
      ]);
      setDeployStatus('deployed');
      setIsDeploying(false);
      checkMastery();
    }, 1200);
  };

  const handleVerifyDns = () => {
    if (customDomain.includes('.')) {
      setDnsVerified(true);
      checkMastery();
    }
  };

  const handleTestIndexedDb = () => {
    setSimulatedReload(true);
    setTimeout(() => {
      setStorageFeedback('✓ 100% data intact across reload! IndexedDB persisted 3 records without backend server.');
      setSimulatedReload(false);
      checkMastery();
    }, 600);
  };

  const handleScanSecrets = () => {
    const forbiddenPatterns = [
      { pattern: /STRIPE_SECRET_KEY/i, name: 'Stripe Secret Key' },
      { pattern: /SUPABASE_SERVICE_ROLE/i, name: 'Supabase Service Role Key (Full DB Bypass)' },
      { pattern: /AWS_SECRET_ACCESS_KEY/i, name: 'AWS Secret Access Key' },
      { pattern: /sk_live_/i, name: 'Live Production API Secret' }
    ];

    const detected: string[] = [];
    forbiddenPatterns.forEach(item => {
      if (item.pattern.test(envFileText)) {
        detected.push(item.name);
      }
    });

    setScanResult({
      clean: detected.length === 0,
      leaks: detected
    });

    if (detected.length === 0) {
      checkMastery();
    }
  };

  const handleCleanSecrets = () => {
    setEnvFileText(
`# Client-Safe Environment Variables (Only VITE_PUBLIC_* variables)
VITE_APP_TITLE="AI Invoice Studio"
VITE_PUBLIC_API_URL="https://api.example.com"
`
    );
    setScanResult({
      clean: true,
      leaks: []
    });
    checkMastery();
  };

  return (
    <div 
      data-testid="edge-deploy-lab"
      className="h-full flex flex-col bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm font-sans"
    >
      {/* Header Bar */}
      <div className="h-11 border-b border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-purple-400" />
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Track B3 Workbench: Edge Deployment & Storage Studio
          </span>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          <button
            onClick={() => setActiveTab('cdn')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'cdn'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Edge CDN
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Local-First IDB
          </button>
          <button
            onClick={() => setActiveTab('secrets')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'secrets'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Secret Scanner
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
        {activeTab === 'cdn' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Cloudflare Pages Edge Simulator
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                  $0 Zero-Cost CDN
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Static edge hosting clones your compiled single-page application across 300+ global edge data centers.
                Zero server processes, zero maintenance fees, and instant global delivery.
              </p>
            </div>

            {/* Subdomain Input & Deploy Button */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                  Target Subdomain:
                </label>
                <div className="flex items-center rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] px-3 py-2 text-xs font-mono">
                  <span className="text-[var(--color-text-secondary)]">https://</span>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="bg-transparent border-none outline-none text-[var(--color-text-primary)] font-bold px-1 flex-1 min-w-0"
                    placeholder="my-project"
                  />
                  <span className="text-purple-400 font-bold">.pages.dev</span>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  data-testid="edge-deploy-btn"
                  onClick={handleRunDeploy}
                  disabled={isDeploying}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  <Play size={13} />
                  <span>{isDeploying ? 'Deploying...' : 'Deploy to Edge CDN'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Logs Window */}
            {deployLogs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-black/90 border border-[var(--color-border)] text-xs font-mono space-y-1 text-emerald-400 max-h-48 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] uppercase text-zinc-500 border-b border-zinc-800 pb-1 mb-1 flex items-center gap-1.5">
                  <Terminal size={13} />
                  <span>Edge Build Telemetry</span>
                </div>
                {deployLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">{log}</div>
                ))}
              </div>
            )}

            {/* Custom Domain DNS CNAME Simulation */}
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)]">
                <span>Custom Domain DNS CNAME Record</span>
                {dnsVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <Check size={12} /> Verified (Active)
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-mono">Pending Check</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="sm:col-span-1 p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Type</div>
                  <div className="font-bold text-purple-400">CNAME</div>
                </div>
                <div className="sm:col-span-1 p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Host Name</div>
                  <div className="font-bold text-[var(--color-text-primary)]">app</div>
                </div>
                <div className="sm:col-span-2 p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Target Value</div>
                  <div className="font-bold text-emerald-400 truncate">{subdomain}.pages.dev</div>
                </div>
              </div>

              <button
                onClick={handleVerifyDns}
                className="w-full py-2 min-h-[40px] rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text-primary)] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 size={14} className="text-purple-400" />
                <span>Simulate DNS Propagation Check</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Local-First IndexedDB Architecture
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  Sovereign Client Storage
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Local-First applications store state directly in the user's browser database (IndexedDB via Dexie).
                Data persists across tabs, browser restarts, and offline subway rides without renting a server database.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className="text-cyan-400" />
                  <span className="font-bold text-[var(--color-text-primary)]">{dbName} (v1)</span>
                </div>
                <span className="text-[11px] text-emerald-400">Status: Active</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Records</div>
                  <div className="text-base font-bold text-[var(--color-text-primary)]">{storedRecordCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Storage Engine</div>
                  <div className="text-base font-bold text-cyan-400">IndexedDB</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Monthly Cost</div>
                  <div className="text-base font-bold text-emerald-400">$0.00</div>
                </div>
              </div>

              <button
                data-testid="test-idb-persistence-btn"
                onClick={handleTestIndexedDb}
                disabled={simulatedReload}
                className="w-full py-2.5 min-h-[42px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                <RotateCcw size={14} className={simulatedReload ? 'animate-spin' : ''} />
                <span>{simulatedReload ? 'Simulating Page Reload...' : 'Simulate Hard Reload & Verify Persistence'}</span>
              </button>

              {storageFeedback && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {storageFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'secrets' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Client-Side Secret Leak Auditor
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  Security Invariant
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Any API key included in frontend code or bundled with Vite is publicly readable by anyone using browser DevTools.
                Never put private backend secrets in frontend client code!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                Inspect .env File Configuration:
              </label>
              <textarea
                value={envFileText}
                onChange={(e) => setEnvFileText(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-black/90 border border-[var(--color-border)] text-xs font-mono text-zinc-300 leading-relaxed outline-none focus:border-amber-400/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                data-testid="scan-secrets-btn"
                onClick={handleScanSecrets}
                className="flex-1 py-2.5 min-h-[42px] rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <ShieldCheck size={14} />
                <span>Run Secret Leak Scan</span>
              </button>
              {scanResult && !scanResult.clean && (
                <button
                  data-testid="clean-secrets-btn"
                  onClick={handleCleanSecrets}
                  className="px-3 py-2.5 min-h-[42px] rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text-primary)] hover:border-emerald-500/40 transition-colors cursor-pointer"
                >
                  Surgically Remove Secrets
                </button>
              )}
            </div>

            {scanResult && (
              <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
                scanResult.clean 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {scanResult.clean ? (
                    <>
                      <Check size={15} />
                      <span>✓ Clean! Zero Leaked Backend Secrets in Client Config</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={15} />
                      <span>CRITICAL HAZARD: Leaked Backend Secrets Detected!</span>
                    </>
                  )}
                </div>
                {!scanResult.clean && (
                  <ul className="list-disc list-inside space-y-1 text-[11px] pt-1">
                    {scanResult.leaks.map((leak, idx) => (
                      <li key={idx}>Forbidden client secret: {leak}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Mastery Bar */}
      <div className="h-12 border-t border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0 text-xs font-mono">
        <span className="text-[var(--color-text-secondary)]">
          {deployStatus === 'deployed' ? '✓ Edge CDN live' : 'Deploy or scan to verify Track B3'}
        </span>
        <button
          onClick={() => {
            onDeploySuccess?.();
          }}
          className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all active:scale-95"
        >
          Verify Competency B3 →
        </button>
      </div>
    </div>
  );
}
