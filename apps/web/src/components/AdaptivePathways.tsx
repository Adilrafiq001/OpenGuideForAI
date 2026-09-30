import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  Compass, 
  Zap, 
  Cpu, 
  Layers, 
  Terminal,
  Database,
  ShieldCheck
} from 'lucide-react';
import { ExplainerPill } from './ExplainerPill';

export type PathwayLevel = 'beginner' | 'intermediate' | 'pro' | 'topics';

interface PathwayMilestone {
  id: string;
  step: string;
  duration: string;
  title: string;
  summary: string;
  intuition: string;
  goal: string;
  tools: string[];
  explainerKey?: 'python' | 'wasm' | 'vector' | 'rag' | 'budget' | 'evals';
}

export function AdaptivePathways() {
  const [activeLevel, setActiveLevel] = useState<PathwayLevel>('beginner');
  const [expandedIntuition, setExpandedIntuition] = useState<string | null>(null);

  const beginnerMilestones: PathwayMilestone[] = [
    {
      id: 'beg-1',
      step: '01',
      duration: 'Flexible Pace (Weeks 1–3)',
      title: 'The Atom Call: Your Very First Chatbot',
      summary: 'Execute real Python code in your browser with zero setup. Send prompts to a frontier model and receive structured responses.',
      intuition: 'Think of an LLM like an ultra-smart digital assistant that has read billions of pages. In this step, you learn the exact command formats (prompts) to get reliable answers instead of unpredictable chatter.',
      goal: 'A working chatbot calling a frontier model — 100% free with 0 cloud bills.',
      tools: ['CPython WASM', 'Google AI Studio Free Tier', 'JSON Parsing'],
      explainerKey: 'python'
    },
    {
      id: 'beg-2',
      step: '02',
      duration: 'Flexible Pace (Weeks 4–6)',
      title: 'Giving It Memory: RAG & Vector Databases',
      summary: 'Prevent the AI from hallucinating by connecting it to your personal notes, PDF documents, or study guides using Chroma.',
      intuition: 'Language models forget or invent facts when asked about private data. RAG is like handing the AI an open reference book with the exact highlighted page during an exam so it always cites real truth.',
      goal: 'A personalized RAG knowledge assistant live on Hugging Face Spaces.',
      tools: ['ChromaDB', 'Cosine Similarity', 'Hugging Face Spaces'],
      explainerKey: 'vector'
    },
    {
      id: 'beg-3',
      step: '03',
      duration: 'Flexible Pace (Weeks 7–9)',
      title: 'Giving It Hands: Autonomous Tools & MCP',
      summary: 'Equip your model with abilities to execute Python math, search live internet pages, and interact with the Model Context Protocol.',
      intuition: 'Standard models only output text. Giving a model "tools" is like giving it hands: it can click search buttons, calculate exact math formulas in code, and perform real actions on your behalf.',
      goal: 'An autonomous agent that DOES real tasks — not just chats.',
      tools: ['Function Calling', 'FastMCP', 'ReAct State Machine'],
      explainerKey: 'wasm'
    },
    {
      id: 'beg-4',
      step: '04',
      duration: 'Flexible Pace (Weeks 10–12)',
      title: 'Production Proof: Evals & Deployment',
      summary: 'Measure latency, token cost, and hallucination rates with automated evaluation harnesses before shipping publicly.',
      intuition: 'How do you know your AI assistant actually works before showing it to an employer or user? An eval harness runs 50 automated tests to grade its accuracy and speed with objective numbers.',
      goal: '2 deployed production projects with verified benchmarks and zero hallucination.',
      tools: ['Synthetic Evals', 'Playwright CI/CD', 'Streamlit Cloud'],
      explainerKey: 'evals'
    }
  ];

  const intermediateMilestones: PathwayMilestone[] = [
    {
      id: 'int-1',
      step: '01',
      duration: 'Fast-Track (Days 1–5)',
      title: 'High-Dimensional Vector Space & Geometry',
      summary: 'Skip basic syntax. Dive straight into text embeddings, dot product attention math, and HNSW vector indexing algorithms.',
      intuition: 'Words are mapped into coordinates in 1536-dimensional space where conceptual similarity equals geometric distance. You will compute cosine distance client-side.',
      goal: 'An in-browser vector search index performing semantic queries in under 5 milliseconds.',
      tools: ['Embeddings API', 'HNSW Algorithms', 'NumPy WebAssembly'],
      explainerKey: 'vector'
    },
    {
      id: 'int-2',
      step: '02',
      duration: 'Fast-Track (Days 6–12)',
      title: 'Production RAG: Chunking, Reranking & pgvector',
      summary: 'Master parent-child chunking, cross-encoder reranking, and semantic caching right inside standard PostgreSQL.',
      intuition: 'Naïve RAG breaks on complex documents. Advanced RAG splits text into small retrieval chunks while feeding larger context windows to the LLM.',
      goal: 'A production RAG pipeline achieving >92% retrieval relevance on complex PDF schemas.',
      tools: ['pgvector', 'LlamaIndex', 'Cross-Encoders'],
      explainerKey: 'rag'
    },
    {
      id: 'int-3',
      step: '03',
      duration: 'Fast-Track (Days 13–20)',
      title: 'Model Context Protocol (MCP) & Agent Workflows',
      summary: 'Build client-server architectures where LLMs query local databases, IDE terminals, and external services via the open MCP standard.',
      intuition: 'MCP standardizes how models connect to tools across any provider, making your agent skills 100% portable across Claude, OpenAI, and Gemini.',
      goal: 'A fully functional MCP server integrating local filesystems and APIs.',
      tools: ['MCP SDK', 'Tool Schemas', 'Structured Outputs']
    },
    {
      id: 'int-4',
      step: '04',
      duration: 'Fast-Track (Days 21–28)',
      title: 'Benchmarking, Token Budgets & Cost Audits',
      summary: 'Benchmark time-to-first-token (TTFT), tokens-per-second, and implement token compression techniques to slash API costs.',
      intuition: 'Production AI engineering is fundamentally about latency and cost trade-offs. Learn to choose the right model size for every subtask.',
      goal: 'A deployed multi-agent system with verified latency under 800ms and 70% reduced token spend.',
      tools: ['Prometheus/OpenTelemetry', 'Token Pruning', 'Hugging Face Spaces']
    }
  ];

  const proMilestones: PathwayMilestone[] = [
    {
      id: 'pro-1',
      step: '01',
      duration: 'Deep Dive',
      title: 'Synthetic Evaluation Suites & Guardrails',
      summary: 'Design ground-truth test datasets, automate LLM-as-a-judge scoring, and detect edge-case regressions before deployment.',
      intuition: 'Traditional unit tests check deterministic code (2+2=4). AI evals score non-deterministic probabilistic responses against rubric metrics.',
      goal: 'An automated CI/CD eval harness scoring faithfulness, answer relevancy, and context recall.',
      tools: ['Ragas', 'DeepEval', 'Synthetic Data Generators'],
      explainerKey: 'evals'
    },
    {
      id: 'pro-2',
      step: '02',
      duration: 'Deep Dive',
      title: 'Headless Playwright Automated Testing for AI Apps',
      summary: 'Build zero-flake E2E test suites with Playwright MCP to validate streaming responses, UI fallbacks, and multi-turn states.',
      intuition: 'AI interfaces fail in unique ways: network timeouts, broken markdown rendering, rate limit throttling. Playwright tests ensure robust recovery.',
      goal: 'A 100% automated headless test suite verifying all routes, latency thresholds, and error recovery.',
      tools: ['Playwright MCP', 'Mock Service Workers', 'GitHub Actions']
    },
    {
      id: 'pro-3',
      step: '03',
      duration: 'Deep Dive',
      title: 'Client-Side WebLLM & Offline-First Architectures',
      summary: 'Run Small Language Models (SLMs) like Qwen, Gemma, and Llama 3 directly in the browser via WebGPU without any API keys or server costs.',
      intuition: 'True $0 compute means running inference directly on the client device. Zero latency, 100% privacy, and infinite scalability without server bills.',
      goal: 'An offline-first AI application running local WebGPU inference inside the browser tab.',
      tools: ['WebGPU', 'WebLLM', 'IndexedDB Model Caching']
    },
    {
      id: 'pro-4',
      step: '04',
      duration: 'Frontier Tier',
      title: 'Frontier Intelligence: Attention, KV-Cache & Test-Time Reasoning',
      summary: 'Master the eternal mathematical foundations of Scaled Dot-Product Attention, multi-head projection, KV-cache scaling, and test-time reasoning search trees.',
      intuition: 'Instead of treating transformers as black boxes, you build attention matrices, calculate KV-cache memory limits, and implement Tree-of-Thoughts reasoning search from scratch.',
      goal: 'A fully certified Autonomous Frontier Reasoning Engine running client-side with MCP tool dispatch.',
      tools: ['Attention Math', 'KV-Cache Dynamics', 'Tree-of-Thoughts', 'MCP Protocol']
    }
  ];

  const topicDeepDives = [
    {
      icon: <Database className="text-emerald-500" size={20} />,
      title: 'Vector Databases & Similarity Geometry',
      level: 'All Levels',
      duration: '3 Hours',
      desc: 'Cosine similarity, Euclidean distance, embeddings projection, and HNSW indexing visualized interactively.'
    },
    {
      icon: <Terminal className="text-indigo-500" size={20} />,
      title: 'Agentic Tool Calling & FastMCP',
      level: 'Intermediate',
      duration: '4 Hours',
      desc: 'Connect models to local files, REST APIs, and databases using the open Model Context Protocol standard.'
    },
    {
      icon: <Layers className="text-purple-500" size={20} />,
      title: 'Advanced RAG & Hybrid Retrieval',
      level: 'Intermediate',
      duration: '5 Hours',
      desc: 'Combine keyword BM25 search with dense vector embeddings to eliminate retrieval blindspots.'
    },
    {
      icon: <ShieldCheck className="text-cyan-500" size={20} />,
      title: 'Synthetic Evals & Regression Testing',
      level: 'Pro',
      duration: '4 Hours',
      desc: 'Build continuous evaluation gates in GitHub Actions so model updates never break production behavior.'
    },
    {
      icon: <Zap className="text-amber-500" size={20} />,
      title: 'The 100% Free Deployment Stack',
      level: 'Beginner',
      duration: '2 Hours',
      desc: 'Deploy full-stack AI web applications to Hugging Face Spaces and Streamlit Cloud for $0/month.'
    },
    {
      icon: <Cpu className="text-rose-500" size={20} />,
      title: 'Prompt Engineering & JSON Schemas',
      level: 'Beginner',
      duration: '3 Hours',
      desc: 'Force language models to output reliable, typed JSON schemas for downstream application code.'
    }
  ];

  const currentMilestones = 
    activeLevel === 'beginner' ? beginnerMilestones :
    activeLevel === 'intermediate' ? intermediateMilestones :
    activeLevel === 'pro' ? proMilestones : [];

  return (
    <div className="w-full">
      
      {/* Level Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 p-1.5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] w-fit mx-auto shadow-sm">
        <button
          onClick={() => { setActiveLevel('beginner'); setExpandedIntuition(null); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeLevel === 'beginner'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Beginner: Absolute Zero</span>
        </button>

        <button
          onClick={() => { setActiveLevel('intermediate'); setExpandedIntuition(null); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeLevel === 'intermediate'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Intermediate: Fast-Track</span>
        </button>

        <button
          onClick={() => { setActiveLevel('pro'); setExpandedIntuition(null); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeLevel === 'pro'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Pro: Systems Architect</span>
        </button>

        <button
          onClick={() => { setActiveLevel('topics'); setExpandedIntuition(null); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeLevel === 'topics'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Compass size={14} className="text-amber-500" />
          <span>Topic-Specific Deep Dives</span>
        </button>
      </div>

      {/* Interactive First-Principles Explainers Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mr-2">
          Plain-English Explainers:
        </span>
        <ExplainerPill 
          label="Why Python for AI?"
          title="Why Python is the Global Standard for AI"
          explanation="Every major research frontier (OpenAI, DeepMind, Meta) writes their libraries (PyTorch, Hugging Face) in Python. It reads like plain English, allowing you to focus on intelligence architecture rather than syntax boilerplate."
          takeaway="You do not need complex math or C++; Python acts as the friendly steering wheel for deep AI models."
        />
        <ExplainerPill 
          label="Why Local WASM?"
          title="Why In-Browser WebAssembly Python Beats Cloud Servers"
          explanation="Instead of renting expensive cloud servers, your browser runs CPython directly on your local device CPU via WebAssembly. You get instant 0ms execution, complete data privacy, and zero server hosting bills."
          takeaway="Learn without credit cards or fear of surprise cloud bills."
        />
        <ExplainerPill 
          label="Why Vector Databases?"
          title="Why Vector DBs Search by Meaning, Not Words"
          explanation="Traditional databases search for exact word matches ('doctor' = 'doctor'). Vector databases turn text into numeric coordinates in space, so searching for 'physician' instantly finds 'surgeon' and 'medical clinic' based on conceptual proximity."
          takeaway="Vector search allows AI to understand semantic context instead of keyword matching."
        />
        <ExplainerPill 
          label="Why RAG Over Fine-Tuning?"
          title="Why RAG is the Smartest Choice for 95% of Applications"
          explanation="Fine-tuning retrains model weights (taking days and thousands of dollars). RAG (Retrieval Augmented Generation) simply hands the model an open textbook with the exact highlighted page during the query."
          takeaway="RAG is 100x cheaper, updates instantly when documents change, and cites real sources."
        />
        <ExplainerPill 
          label="Why a $0 Budget Stack?"
          title="Why You Should Never Pay for Subscriptions to Learn"
          explanation="Platforms like Hugging Face Spaces (2vCPU free), Google Colab (free GPU), Kaggle (30h/wk GPU), and Chroma offer 100% of the tools required to build production portfolios without spending a penny."
          takeaway="Pay $0 until you have a paying enterprise client."
        />
      </div>

      {/* Active Level Content */}
      {activeLevel !== 'topics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {currentMilestones.map((m) => (
            <div 
              key={m.id}
              className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-[2rem] p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-accent)]">
                    STEP {m.step} • {m.duration}
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpandedIntuition(expandedIntuition === m.id ? null : m.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                  >
                    <Lightbulb size={13} className="text-amber-400" />
                    <span>The Intuition</span>
                  </button>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
                  {m.title}
                </h3>

                <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                  {m.summary}
                </p>

                {/* Animated Plain-Language Intuition Drawer */}
                <AnimatePresence>
                  {expandedIntuition === m.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                      className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--color-text-primary)] mb-6 leading-relaxed overflow-hidden"
                    >
                      <div className="flex items-center gap-2 font-bold text-amber-500 mb-1">
                        <HelpCircle size={14} />
                        <span>Plain-Language Mental Model:</span>
                      </div>
                      {m.intuition}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verifiable Outcome */}
                <div className="p-4 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] mb-6">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-text-secondary)] block mb-1">
                    Verifiable Deliverable:
                  </span>
                  <p className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>{m.goal}</span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)]">
                  {m.tools.map((tool, tIdx) => (
                    <span 
                      key={tIdx}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Topic-Specific Deep Dives Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {topicDeepDives.map((topic, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                    {topic.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                    {topic.level} • {topic.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  {topic.title}
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {topic.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                <span>Standalone Module</span>
                <span className="text-emerald-500 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Launch Module &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdaptivePathways;
