import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Terminal, 
  ShieldCheck, 
  Cloud, 
  FileCode2, 
  Workflow, 
  Copy, 
  Check, 
  Zap, 
  Compass, 
  SlidersHorizontal,
  FolderGit2,
  Lock,
  Boxes,
  HelpCircle,
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';
import { FDE_KNOWLEDGE_CARDS } from '../data/forwardEngineerKnowledge';

interface ForwardEngineerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'matrix' | 'ide-setup' | 'zero-dollar' | 'governance' | 'case-studies' | 'secret-hygiene' | 'knowledge-bank';
}

interface SystemsComparisonRow {
  dimension: string;
  naiveVibeCoder: string;
  traditionalSwe: string;
  deepAiEngineer: string;
  forwardAiEngineer: string;
}

const SYSTEMS_MATRIX_ROWS: SystemsComparisonRow[] = [
  {
    dimension: 'Core Mission',
    naiveVibeCoder: 'Types chat prompts until code runs once.',
    traditionalSwe: 'Writes manual code from deterministic product specs.',
    deepAiEngineer: 'Trains foundations: attention heads, backprop, RoPE, LoRA.',
    forwardAiEngineer: 'Embeds frontier models into production systems with verified tool harnesses.'
  },
  {
    dimension: 'Agent Governance',
    naiveVibeCoder: 'No rules. Blindly accepts generated code.',
    traditionalSwe: 'Manual PR reviews and static code linter.',
    deepAiEngineer: 'Loss curves, perplexity, and benchmark datasets.',
    forwardAiEngineer: 'AGENTS.md contracts, sandboxed MCP tools, and 5-point CI pre-flight gates.'
  },
  {
    dimension: 'IDE & Workflow',
    naiveVibeCoder: 'Web browser chat UI copy-paste.',
    traditionalSwe: 'Standard text editor with auto-complete.',
    deepAiEngineer: 'Jupyter notebooks, PyTorch clusters, CUDA profiling.',
    forwardAiEngineer: 'Agentic IDEs: Antigravity IDE, Claude Code CLI, Codex, Cursor rules.'
  },
  {
    dimension: 'Compute Cost',
    naiveVibeCoder: 'Runs up expensive API tokens on trial runs.',
    traditionalSwe: 'Standard cloud server infrastructure bills.',
    deepAiEngineer: 'GPU cluster rental (A100/H100) at high hourly rates.',
    forwardAiEngineer: '$0 Rule: Sovereign in-browser WASM, edge workers, and client BYOK.'
  },
  {
    dimension: 'Security & Secrets',
    naiveVibeCoder: 'Leaks API keys into git repositories.',
    traditionalSwe: 'Server-side key vaults and environment managers.',
    deepAiEngineer: 'Weight checkpoint signing and dataset licensing.',
    forwardAiEngineer: 'Zero-leakage BYOK, in-memory isolation, and automated secret scanners.'
  },
  {
    dimension: 'Failure Metric',
    naiveVibeCoder: 'Application breaks in production silently.',
    traditionalSwe: 'Unit test failures and uncaught runtime errors.',
    deepAiEngineer: 'Gradient explosion and benchmark regression.',
    forwardAiEngineer: 'E2E eval drift, prompt injection, and tool calling hallucination.'
  }
];

const IDE_GUIDES = [
  {
    id: 'antigravity',
    name: 'Google Antigravity IDE',
    platforms: 'Desktop • CLI • Windows • Linux • macOS',
    badge: 'Multi-Agent Native',
    description: 'Autonomous agentic environment featuring native MCP tool integration, artifact workspaces, memory compaction, and subagent orchestration.',
    quickStart: `# Install Antigravity IDE CLI
npm install -g @google/antigravity-cli

# Initialize project with governance constitution
agy init my-agentic-app --template sovereign-react

# Launch with autonomous task engine
agy start --watch --port 5173`,
    tips: [
      'Maintain an airtight AGENTS.md in project root; Antigravity reads this before every tool invocation.',
      'Use the artifacts system to inspect architectural plans before approving high-blast-radius edits.',
      'Configure FastMCP servers in config to give the agent sandboxed local tool execution.'
    ]
  },
  {
    id: 'claude-code',
    name: 'Anthropic Claude Code',
    platforms: 'CLI • macOS • Linux • Windows (WSL / Native)',
    badge: 'Terminal Powerhouse',
    description: 'High-velocity command-line agent with compact terminal UI, git awareness, subagent delegation, and spec-driven execution.',
    quickStart: `# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Launch inside your repository
cd my-project
claude

# Run specific autonomous tasks with compact flags
claude "Implement MCP tool server for local database with unit tests"`,
    tips: [
      'Add CLAUDE.md to your repository with single-line commands and architectural conventions.',
      'Use /compact frequently to maintain clean context windows and avoid hallucinations.',
      'Leverage headless subagents for parallel code analysis and test execution.'
    ]
  },
  {
    id: 'codex-cursor',
    name: 'OpenAI Codex & Cursor',
    platforms: 'Desktop • VS Code Fork • Windows • Linux • macOS',
    badge: 'Editor Integrated',
    description: 'Deep codebase semantic indexing with .cursorrules, Composer multi-file editing, and inline prompt-to-diff generation.',
    quickStart: `# Create .cursorrules in project root
cat << 'EOF' > .cursorrules
You are a Forward AI Engineer.
- Always check AGENTS.md for architecture invariants.
- Never write mocks for production logic.
- Verify changes with Playwright before reporting complete.
EOF`,
    tips: [
      'Index your full repository for semantic retrieval across symbols.',
      'Use Ctrl+I / Cmd+I for surgical inline diffs rather than full-file regenerations.',
      'Reference files with @filename to supply exact context to the model.'
    ]
  }
];

const ZERO_DOLLAR_STACK = [
  {
    layer: 'Version Control & CI/CD',
    service: 'GitHub & GitHub Actions',
    tier: '100% Free Tier (Public/Private 2000 min/mo)',
    howItWorks: 'Host git repository, run 5-point pre-flight validation gates, execute Playwright tests in headless Linux containers on every push.',
    cost: '$0.00 / month'
  },
  {
    layer: 'Hosting & Global CDN',
    service: 'Cloudflare Pages / GitHub Pages',
    tier: 'Free Tier (Unlimited Bandwidth, 500 builds/mo)',
    howItWorks: 'Direct static SPA deployment from git commits. Global edge network with sub-20ms TTFB and automatic SSL/TLS encryption.',
    cost: '$0.00 / month'
  },
  {
    layer: 'Serverless Relational Database',
    service: 'Neon Serverless Postgres',
    tier: 'Free Tier (0.5 GB Storage, Instant Branching)',
    howItWorks: 'Scale-to-zero serverless PostgreSQL with copy-on-write database branches for staging and preview deployments.',
    cost: '$0.00 / month'
  },
  {
    layer: 'In-Browser Compute Engine',
    service: 'CPython WebAssembly (Pyodide v0.26)',
    tier: 'Client Sovereign (100% Client-Side CPU/GPU)',
    howItWorks: 'Runs actual Python 3.12, NumPy, SymPy, and micrograd directly inside client browser Web Worker with 0ms server latency.',
    cost: '$0.00 / month'
  },
  {
    layer: 'Model Hosting & Sandbox',
    service: 'Hugging Face Spaces',
    tier: 'Free Tier (2 vCPU, 16 GB RAM CPU Basic)',
    howItWorks: 'Deploy interactive ML prototypes, Gradio apps, or custom Docker microservices with zero infrastructure overhead.',
    cost: '$0.00 / month'
  }
];

export function ForwardEngineerModal({ isOpen, onClose, initialTab = 'matrix' }: ForwardEngineerModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'matrix' | 'ide-setup' | 'zero-dollar' | 'governance' | 'case-studies' | 'secret-hygiene' | 'knowledge-bank'>(initialTab);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState('');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<string>('all');
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (code: string, id: string) => {
    playTactileSound('click');
    triggerHaptic('light');
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forward-engineer-title"
        aria-describedby="forward-engineer-subtitle"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden text-[var(--color-text-primary)]"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-primary)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-600/30 dark:border-cyan-400/30 flex items-center justify-center text-cyan-700 dark:text-cyan-300">
                <Workflow size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="forward-engineer-title" className="text-base sm:text-lg font-bold tracking-tight">
                    Forward Deployed AI Engineering
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-600/30 dark:border-cyan-400/30">
                    Production Standard • 0.001% Rigor
                  </span>
                </div>
                <p id="forward-engineer-subtitle" className="text-xs text-[var(--color-text-secondary)]">
                  The definitive operational blueprint: from Agentic IDEs and governance constitutions to $0 sovereign stacks.
                </p>
              </div>
            </div>

            <button
              onClick={() => { playTactileSound('click'); onClose(); }}
              aria-label="Close Forward Engineer Blueprint Modal"
              className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-primary)]/50 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'matrix', label: '1. Role Matrix', icon: Compass },
              { id: 'ide-setup', label: '2. Agentic IDEs', icon: Terminal },
              { id: 'zero-dollar', label: '3. $0 Sovereign Stack', icon: Cloud },
              { id: 'secret-hygiene', label: '4. Secret Hygiene & .env', icon: Lock },
              { id: 'governance', label: '5. Governance & Docs', icon: FileCode2 },
              { id: 'case-studies', label: '6. Real Case Studies', icon: Boxes },
              { id: 'knowledge-bank', label: '7. Knowledge Bank', icon: BookOpen },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playTactileSound('click'); setActiveTab(tab.id as any); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500 text-black font-bold shadow-xs' 
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body Content */}
          <div ref={modalContentRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* TAB 1: ROLE MATRIX */}
            {activeTab === 'matrix' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-600/20 dark:border-cyan-400/20 text-xs text-[var(--color-text-secondary)] space-y-2">
                  <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                    <HelpCircle size={16} />
                    <span>What is a Forward Deployed AI Engineer (FDE)?</span>
                  </div>
                  <p className="leading-relaxed">
                    A Forward AI Engineer integrates frontier models directly into operational client systems. Unlike a naive vibe coder who accepts raw LLM hallucinations, and unlike a pure ML researcher who trains weights from scratch, the Forward AI Engineer constructs <strong>specifications, tool sandboxes (MCP), context constitutions (AGENTS.md), and deterministic evaluation harnesses</strong>.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[var(--color-primary)] border-b border-[var(--color-border)]">
                        <th className="p-3 font-mono font-bold uppercase text-[10px] text-[var(--color-text-secondary)]">Dimension</th>
                        <th className="p-3 font-mono font-bold uppercase text-[10px] text-rose-500 dark:text-rose-400">Naive Vibe Coder</th>
                        <th className="p-3 font-mono font-bold uppercase text-[10px] text-amber-600 dark:text-amber-400">Traditional SWE</th>
                        <th className="p-3 font-mono font-bold uppercase text-[10px] text-blue-600 dark:text-blue-400">Deep AI Engineer</th>
                        <th className="p-3 font-mono font-bold uppercase text-[10px] text-cyan-700 dark:text-cyan-400">Forward AI Engineer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {SYSTEMS_MATRIX_ROWS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[var(--color-primary)]/40 transition-colors">
                          <td className="p-3 font-semibold text-[var(--color-text-primary)] font-mono text-[11px] whitespace-nowrap">
                            {row.dimension}
                          </td>
                          <td className="p-3 text-[var(--color-text-secondary)] opacity-85 leading-relaxed">
                            {row.naiveVibeCoder}
                          </td>
                          <td className="p-3 text-[var(--color-text-secondary)] opacity-85 leading-relaxed">
                            {row.traditionalSwe}
                          </td>
                          <td className="p-3 text-[var(--color-text-secondary)] opacity-85 leading-relaxed">
                            {row.deepAiEngineer}
                          </td>
                          <td className="p-3 text-cyan-800 dark:text-cyan-300 font-medium leading-relaxed bg-cyan-500/5">
                            {row.forwardAiEngineer}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] gap-4">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)]">OpenGuide Curriculum Alignment</div>
                    <div className="text-[11px] text-[var(--color-text-secondary)]">
                      Master Builder Path (Tracks B0–B7) for operational FDE skills, grounded in Deep AI Track (Tracks 0–7) for foundation mathematical rigor.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/track/b0/intro');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    <span>Launch Builder Track B0</span>
                    <Zap size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: AGENTIC IDES MASTERCLASS */}
            {activeTab === 'ide-setup' && (
              <div className="space-y-6">
                <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Agentic IDEs differ fundamentally from classical code editors: they execute multi-step tool calls, manage their own context memory, read specifications, and run terminal commands. Here is the operational setup across all environments:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {IDE_GUIDES.map(ide => (
                    <div 
                      key={ide.id}
                      className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-[var(--color-text-primary)]">{ide.name}</div>
                          <div className="text-[10px] font-mono text-[var(--color-text-secondary)]">{ide.platforms}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          {ide.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed flex-1">
                        {ide.description}
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)]">
                          <span>Terminal Commands</span>
                          <button
                            onClick={() => handleCopy(ide.quickStart, ide.id)}
                            className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer"
                          >
                            {copiedCodeId === ide.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            <span>{copiedCodeId === ide.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded-xl bg-black/60 border border-[var(--color-border)] text-[10px] font-mono text-cyan-300 overflow-x-auto">
                          {ide.quickStart}
                        </pre>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-[var(--color-border)]">
                        <div className="text-[10px] font-bold text-[var(--color-text-primary)]">Pro Engineering Tips:</div>
                        <ul className="text-[10px] text-[var(--color-text-secondary)] space-y-1 list-disc list-inside">
                          {ide.tips.map((t, idx) => (
                            <li key={idx} className="leading-snug">{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: $0 SOVEREIGN STACK */}
            {activeTab === 'zero-dollar' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-[var(--color-text-secondary)] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Cloud size={16} />
                    <span>The $0 Rule: Production-Grade Infrastructure Without Cloud Bills</span>
                  </div>
                  <p className="leading-relaxed">
                    A world-class Forward AI Engineer knows how to ship sovereign, zero-maintenance applications that cost exactly $0.00/month. By leveraging in-browser WebAssembly for compute, global edge CDNs for assets, and generous free tiers for persistence, you can scale to tens of thousands of active learners without a credit card.
                  </p>
                </div>

                <div className="space-y-3">
                  {ZERO_DOLLAR_STACK.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.service}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400">
                            {item.layer}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                          {item.howItWorks}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-emerald-400">{item.cost}</div>
                        <div className="text-[10px] font-mono text-[var(--color-text-secondary)]">{item.tier}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cloudflare Pages CI/CD configuration snippet */}
                <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                      <FolderGit2 size={14} className="text-cyan-400" />
                      <span>Zero-Dollar GitHub Actions CI & Cloudflare Deployment Pipeline</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`# .github/workflows/deploy.yml
name: Sovereign CI/CD Pipeline
on:
  push:
    branches: [dev, main]
jobs:
  validate-and-ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: npx playwright test --config apps/web/playwright.config.ts
      - run: yarn --cwd apps/web build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: openguide-studio
          directory: apps/web/dist`, 'ci-yaml')}
                      className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedCodeId === 'ci-yaml' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedCodeId === 'ci-yaml' ? 'Copied Pipeline' : 'Copy deploy.yml'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-[var(--color-border)] text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`# 5-Point Autonomous CI Gate (.github/workflows/deploy.yml)
1. Live dev server validation (HTTP 200)
2. Zero console errors via headless browser testing
3. Static linter enforcement (yarn lint)
4. 100% test suite passage (Playwright headless)
5. Production build bundle compilation (dist output)`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: SECRET HYGIENE & .ENV RULES */}
            {activeTab === 'secret-hygiene' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-[var(--color-text-secondary)] space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldCheck size={16} />
                    <span>The Zero-Leakage Protocol: Strict Do's & Don'ts for Agentic Projects</span>
                  </div>
                  <p className="leading-relaxed">
                    AI agents possess tool-calling power and terminal access. A careless agent can accidentally read a `.env` file and commit credentials into a public repository. As a Forward AI Engineer, you must enforce strict architectural boundaries:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Check size={14} />
                      <span>DO: Professional Secret Hygiene</span>
                    </div>
                    <ul className="text-xs text-[var(--color-text-secondary)] space-y-2 list-disc list-inside leading-relaxed">
                      <li>Maintain a clean <code className="text-cyan-300">.env.example</code> with dummy placeholder strings.</li>
                      <li>Add <code className="text-cyan-300">.env</code> and <code className="text-cyan-300">*.local</code> to <code className="text-cyan-300">.gitignore</code> before your first commit.</li>
                      <li>Use client-side BYOK (Bring Your Own Key) where API keys reside strictly in browser memory or local storage.</li>
                      <li>Install pre-commit hooks (<code className="text-cyan-300">git-secrets</code> / <code className="text-cyan-300">trufflehog</code>) to block commits containing entropy spikes.</li>
                      <li>Declare explicit governance rules in <code className="text-cyan-300">AGENTS.md</code> forbidding agents from echoing secrets.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
                    <div className="text-xs font-bold text-rose-400 flex items-center gap-2">
                      <X size={14} />
                      <span>DON'T: Critical Production Vulnerabilities</span>
                    </div>
                    <ul className="text-xs text-[var(--color-text-secondary)] space-y-2 list-disc list-inside leading-relaxed">
                      <li>Never hardcode API keys or secret tokens directly inside client-side JS bundles.</li>
                      <li>Never allow autonomous agents to run commands without sandbox review on unknown code.</li>
                      <li>Never commit `.env` into git history — even if deleted later, it remains in git reflog.</li>
                      <li>Never send user API keys to backend proxy logs or telemetry servers.</li>
                      <li>Never bypass automated CI gates or push with <code className="text-rose-300">--no-verify</code>.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-primary)] font-mono">Standard .env.example Template</span>
                    <button
                      onClick={() => handleCopy(`# Sovereign AI Studio Environment Configuration
VITE_APP_NAME="OpenGuide"
VITE_PRODUCTION_URL="https://openguideforai.dpdns.org"

# BYOK Client Frontier Models (Optional - user provides key in UI)
# VITE_GEMINI_API_KEY=your_gemini_key_here
# VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
# VITE_OPENAI_API_KEY=your_openai_key_here

# Zero Paid Servers - Web Worker Pyodide runtime executes in client browser
VITE_PYODIDE_CDN_URL="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"`, 'env-template')}
                      className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedCodeId === 'env-template' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedCodeId === 'env-template' ? 'Copied Template' : 'Copy .env.example'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-[var(--color-border)] text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`# Sovereign AI Studio Environment Configuration (.env.example)
VITE_APP_NAME="OpenGuide"
VITE_PRODUCTION_URL="https://openguideforai.dpdns.org"

# Client BYOK (Optional - kept in local memory, never transmitted to backend)
# VITE_GEMINI_API_KEY=dummy_key_for_local_testing

# CDN & Runtime URLs
VITE_PYODIDE_CDN_URL="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 5: GOVERNANCE & PROJECT DOCUMENTS */}
            {activeTab === 'governance' && (
              <div className="space-y-6">
                <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Every 0.001% world-class repository maintains a synchronized governance constitution. Agents, human contributors, and CI runners refer to these exact documents:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      file: 'AGENTS.md',
                      purpose: 'Governing master contract for all AI coding agents.',
                      content: 'Defines autonomous triggers, approval defaults, $0 compute rules, branch safety (dev only), dual-remote push targets, and the 5-point pre-flight CI gate.'
                    },
                    {
                      file: 'CLAUDE.md / GEMINI.md',
                      purpose: 'IDE-specific pointer files for context grounding.',
                      content: 'Points agents back to canonical AGENTS.md so instructions are never fragmented across duplicate config files.'
                    },
                    {
                      file: 'ARCHITECTURE.md',
                      purpose: 'System topology, state management & invariants.',
                      content: 'Documents the client-first data flow: Vite SPA + Web Worker Pyodide + Dexie IndexedDB + 24 WCAG AAA themes.'
                    },
                    {
                      file: 'CHANGELOG.md',
                      purpose: 'Keep-a-Changelog historical audit trail.',
                      content: 'Synchronizes every release version (v1.0.0 through current) with exact dates, features, fixes, and architectural additions.'
                    },
                    {
                      file: 'CODE_OF_CONDUCT.md',
                      purpose: 'Contributor Covenant standards.',
                      content: 'Establishes inclusive, respectful collaboration guidelines for open-source contributors worldwide.'
                    },
                    {
                      file: '.agents/rules/ & .agents/skills/',
                      purpose: 'Modular agent skill packs.',
                      content: 'Specialized domain procedures (e.g. anti-bias standards, Pyodide WebWorker runner, Playwright browser testing).'
                    }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-300">{doc.file}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          Standard Doc
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-[var(--color-text-primary)]">{doc.purpose}</div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{doc.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REAL CASE STUDIES */}
            {activeTab === 'case-studies' && (
              <div className="space-y-6">
                <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Real-world teardowns of production systems built using the Forward Deployed AI Engineer methodology:
                </div>

                <div className="space-y-4">
                  {/* Case Study 1: OpenGuide */}
                  <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[var(--color-text-primary)]">
                          Case Study 1: OpenGuide AI Studio
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400">
                          Sovereign In-Browser CPython WebAssembly • 24 Themes • $0 Cloud Bill
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Production Live
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
                      <p>
                        <strong>The Challenge:</strong> How do you teach 57 interactive AI engineering labs requiring Python code execution, NumPy matrix operations, and autograding to thousands of global learners without running an expensive cluster of cloud server sandboxes (which costs thousands of dollars per month)?
                      </p>
                      <p>
                        <strong>The Forward AI Engineer Solution:</strong> Deployed CPython 3.12 WebAssembly (Pyodide v0.26) inside a dedicated client Web Worker with a 15-second watchdog timer. Learner code executes directly on their local CPU. Progress is saved locally in IndexedDB via Dexie.js. Deployed to Cloudflare Pages edge network for $0.
                      </p>
                    </div>
                  </div>

                  {/* Case Study 2: FastMCP */}
                  <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[var(--color-text-primary)]">
                          Case Study 2: Model Context Protocol (MCP) Connector Server
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400">
                          JSON-RPC 2.0 • Sandboxed Local Tools • Frontier Agent Interoperability
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        Open Standard
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
                      <p>
                        <strong>The Challenge:</strong> Connecting LLMs to enterprise databases, internal git systems, and local filesystems without custom one-off API code for each model vendor.
                      </p>
                      <p>
                        <strong>The Forward AI Engineer Solution:</strong> Implement the open standard Model Context Protocol (MCP) using Python FastMCP or TypeScript SDK. Define strictly typed tools with JSON Schema validation, returning structured JSON or markdown text over standard I/O (stdio).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: KNOWLEDGE BANK */}
            {activeTab === 'knowledge-bank' && (() => {
              const query = knowledgeSearchQuery.trim().toLowerCase();
              const filteredCards = FDE_KNOWLEDGE_CARDS.filter(card => {
                const matchesCategory = selectedKnowledgeCategory === 'all' || card.category === selectedKnowledgeCategory;
                if (!matchesCategory) return false;
                if (!query) return true;
                return (
                  card.title.toLowerCase().includes(query) ||
                  card.summary.toLowerCase().includes(query) ||
                  card.operationalGuidance.toLowerCase().includes(query) ||
                  card.badge.toLowerCase().includes(query) ||
                  (card.codeSnippet && card.codeSnippet.toLowerCase().includes(query))
                );
              });

              const categoryTabs = [
                { id: 'all', label: 'All Topics' },
                { id: 'architecture', label: 'Architecture & RAG' },
                { id: 'agentic-ides', label: 'Agentic IDEs' },
                { id: 'fastmcp', label: 'FastMCP & Tools' },
                { id: 'token-engineering', label: 'Context & Tokens' },
                { id: 'governance', label: 'Governance & Rules' },
                { id: 'spec-rigor', label: 'Specification Rigor' },
                { id: 'security', label: 'Security & OWASP' },
                { id: 'evals', label: 'Evals & Gates' },
                { id: 'sovereign-wasm', label: 'Sovereign & $0 Stack' },
              ];

              return (
                <div className="space-y-6">
                  {/* Search and Category Filter Dock */}
                  <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-3.5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-700 dark:text-cyan-300" />
                        <input
                          type="text"
                          value={knowledgeSearchQuery}
                          onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                          placeholder="Search 28 operational FDE knowledge topics, protocols, code..."
                          className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] focus:border-cyan-400/70 focus:outline-none text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-colors"
                        />
                        {knowledgeSearchQuery && (
                          <button
                            onClick={() => setKnowledgeSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-[var(--color-text-secondary)] shrink-0 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                        <span>{filteredCards.length} of {FDE_KNOWLEDGE_CARDS.length} Topics Loaded</span>
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                      {categoryTabs.map(cat => {
                        const isSelected = selectedKnowledgeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => { playTactileSound('click'); setSelectedKnowledgeCategory(cat.id); }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500 text-black font-bold shadow-xs'
                                : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-cyan-400/40'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Knowledge Cards List */}
                  {filteredCards.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mx-auto flex items-center justify-center">
                        <Search size={18} />
                      </div>
                      <div className="text-sm font-bold text-[var(--color-text-primary)]">
                        No matching knowledge topics found
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
                        No topic matched "{knowledgeSearchQuery}". Try clearing filters or searching for terms like "MCP", "WASM", "RAG", or "evals".
                      </p>
                      <button
                        onClick={() => { setKnowledgeSearchQuery(''); setSelectedKnowledgeCategory('all'); }}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCards.map((card) => (
                        <div
                          key={card.id}
                          className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] space-y-4 shadow-sm hover:border-cyan-500/30 transition-all"
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)]/60 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-600/30 dark:border-cyan-400/30">
                                  {card.badge}
                                </span>
                                <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
                                  {card.categoryLabel}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">
                                {card.title}
                              </h3>
                            </div>
                          </div>

                          {/* Summary & Operational Guidance */}
                          <div className="space-y-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                            <p className="text-[var(--color-text-primary)] font-medium">
                              {card.summary}
                            </p>
                            <p>
                              {card.operationalGuidance}
                            </p>
                          </div>

                          {/* Code Snippet Box */}
                          {card.codeSnippet && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
                                <span>Operational Specification / Configuration</span>
                                <button
                                  onClick={() => handleCopy(card.codeSnippet!, `kb-${card.id}`)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--color-secondary)] transition-colors cursor-pointer text-cyan-400"
                                >
                                  {copiedCodeId === `kb-${card.id}` ? (
                                    <>
                                      <Check size={12} className="text-emerald-400" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-3.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[11px] font-mono text-cyan-300 overflow-x-auto custom-scrollbar leading-relaxed">
                                <code>{card.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          {/* Traps vs Best Practices Two-Column Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Common Traps */}
                            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 font-mono">
                                <AlertTriangle size={13} />
                                <span>Naive Failure Modes</span>
                              </div>
                              <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)] list-disc list-inside">
                                {card.commonTraps.map((trap, idx) => (
                                  <li key={idx} className="leading-snug">{trap}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Best Practices */}
                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 font-mono">
                                <CheckCircle2 size={13} />
                                <span>Forward AI Engineering Standard</span>
                              </div>
                              <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)] list-disc list-inside">
                                {card.bestPractices.map((bp, idx) => (
                                  <li key={idx} className="leading-snug">{bp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Key Takeaway Pill */}
                          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-2 text-xs">
                            <Zap size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                            <div className="text-[11px] text-cyan-300">
                              <strong>Key Invariant:</strong> {card.takeaway}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Modal Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-primary)] gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] font-mono">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>Architected by Adil Rafiq Dar (ARD) • OpenGuide Sovereign Studio</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/portfolio');
                }}
                className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-secondary)] text-xs font-semibold text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                View Verifiable Credentials
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/track/b5/intro');
                }}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Track B5: Context & Tools</span>
                <SlidersHorizontal size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
