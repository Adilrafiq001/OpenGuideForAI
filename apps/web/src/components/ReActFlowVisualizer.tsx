import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  GitFork, 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Eye, 
  Wrench,
  Pulse
} from '@phosphor-icons/react';

export interface ReActStep {
  id: string;
  type: 'thought' | 'action' | 'observation' | 'finish';
  title: string;
  content: string;
  toolName?: string;
  toolArgs?: Record<string, any>;
  durationMs?: number;
  status: 'completed' | 'active' | 'pending';
}

interface ReActFlowVisualizerProps {
  logs?: Array<{ text: string } | string>;
  activeLessonTitle?: string;
}

// Preloaded trace archetypes for instant first-principles exploration
const PRELOADED_TRACES: Record<string, { name: string; description: string; steps: ReActStep[] }> = {
  rag: {
    name: 'RAG Multi-Hop Search',
    description: 'Autonomous research loop searching chunk stores, reranking by cosine score, and synthesizing final grounded context.',
    steps: [
      {
        id: 'step-1',
        type: 'thought',
        title: 'Formulate Query Strategy',
        content: 'User query requires finding the mathematical formulation of self-attention. Need to search vector index with chunk limit = 3.',
        status: 'completed',
        durationMs: 42
      },
      {
        id: 'step-2',
        type: 'action',
        title: 'Execute Tool: vector_index.search',
        toolName: 'vector_index.search',
        toolArgs: { query: 'Attention(Q, K, V) softmax formula', top_k: 3 },
        content: 'Dispatched vector search across 1,024 chunk embeddings in local indexedDB.',
        status: 'completed',
        durationMs: 118
      },
      {
        id: 'step-3',
        type: 'observation',
        title: 'Retrieved 3 Grounded Chunks',
        content: 'Chunk 104: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V with cosine similarity 0.941.\nChunk 212: Multi-head concatenation projections.',
        status: 'completed',
        durationMs: 15
      },
      {
        id: 'step-4',
        type: 'thought',
        title: 'Analyze & Synthesize Context',
        content: 'Retrieved chunks contain complete closed-form equations. Validating dimensionality d_k before producing response.',
        status: 'completed',
        durationMs: 65
      },
      {
        id: 'step-5',
        type: 'finish',
        title: 'Final Grounded Synthesis',
        content: 'The scaled dot-product attention maps queries and key-value pairs through softmax(Q K^T / sqrt(d_k)) V, normalizing by key dimension square root.',
        status: 'completed',
        durationMs: 38
      }
    ]
  },
  fastmcp: {
    name: 'FastMCP Determinant Tool',
    description: 'In-browser agent invoking MCP-compliant tool protocol to calculate 3x3 matrix eigenvalues and determinants.',
    steps: [
      {
        id: 'step-1',
        type: 'thought',
        title: 'Inspect Available MCP Tools',
        content: 'Identified client request for matrix transformation determinant. Querying local schema for fastmcp_math capability.',
        status: 'completed',
        durationMs: 28
      },
      {
        id: 'step-2',
        type: 'action',
        title: 'Execute Tool: fastmcp.matrix_det',
        toolName: 'fastmcp.matrix_det',
        toolArgs: { matrix: [[1, 2, 3], [0, 1, 4], [5, 6, 0]] },
        content: 'Dispatched JSON-RPC 2.0 tool execution call to local FastMCP worker.',
        status: 'completed',
        durationMs: 84
      },
      {
        id: 'step-3',
        type: 'observation',
        title: 'Tool Output Payload',
        content: '{"result": 1.0, "status": "success", "invertible": true, "rank": 3}',
        status: 'completed',
        durationMs: 12
      },
      {
        id: 'step-4',
        type: 'finish',
        title: 'Final Matrix Classification',
        content: 'Matrix is non-singular with det(A) = 1.0; full rank guaranteed with stable transformation inverse.',
        status: 'completed',
        durationMs: 34
      }
    ]
  },
  correction: {
    name: 'Autonomous Self-Correction',
    description: 'Agent observes runtime sandbox syntax error, parses AST traceback, patches code, and re-executes to pass test assertions.',
    steps: [
      {
        id: 'step-1',
        type: 'action',
        title: 'Execute Initial Python Code',
        toolName: 'pyodide.exec',
        toolArgs: { code: 'def cosine_sim(a, b):\n  return np.dot(a, b) / (norm(a))' },
        content: 'Running code in Pyodide sandbox.',
        status: 'completed',
        durationMs: 95
      },
      {
        id: 'step-2',
        type: 'observation',
        title: 'NameError: norm is not defined',
        content: 'Traceback (most recent call last):\n  File "<exec>", line 2, in cosine_sim\nNameError: name "norm" is not defined. Did you mean: np.linalg.norm?',
        status: 'completed',
        durationMs: 14
      },
      {
        id: 'step-3',
        type: 'thought',
        title: 'Reflect & Plan AST Patch',
        content: 'Missing import or namespace qualification. Need to replace norm(a) with np.linalg.norm(a) * np.linalg.norm(b).',
        status: 'completed',
        durationMs: 52
      },
      {
        id: 'step-4',
        type: 'action',
        title: 'Execute Tool: patch_and_retest',
        toolName: 'pyodide.exec',
        toolArgs: { patch: 'np.linalg.norm(a) * np.linalg.norm(b)' },
        content: 'Patched function re-executed against unit test vectors.',
        status: 'completed',
        durationMs: 78
      },
      {
        id: 'step-5',
        type: 'finish',
        title: 'Assertions Passed (100%)',
        content: 'cosine_sim([1, 0], [0, 1]) == 0.0, cosine_sim([1, 2], [1, 2]) == 1.0. Bug resolved autonomously.',
        status: 'completed',
        durationMs: 22
      }
    ]
  }
};

export function ReActFlowVisualizer({ logs = [], activeLessonTitle = 'Interactive Agent IDE' }: ReActFlowVisualizerProps) {
  const [selectedTraceKey, setSelectedTraceKey] = useState<'live' | 'rag' | 'fastmcp' | 'correction'>('rag');
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Parse live Pyodide stdout lines for Thought / Action / Observation / Finish patterns
  const liveSteps = useMemo<ReActStep[]>(() => {
    if (!logs || logs.length === 0) return [];

    const steps: ReActStep[] = [];
    let currentStep: Partial<ReActStep> | null = null;
    let stepCount = 1;

    for (const raw of logs) {
      if (!raw) continue;
      const line = typeof raw === 'string' ? raw : (typeof raw.text === 'string' ? raw.text : '');
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (/^thought[:\s]/i.test(trimmed)) {
        if (currentStep && currentStep.type) {
          steps.push(currentStep as ReActStep);
        }
        currentStep = {
          id: `live-step-${stepCount++}`,
          type: 'thought',
          title: `Thought #${steps.filter(s => s.type === 'thought').length + 1}`,
          content: trimmed.replace(/^thought[:\s]+/i, ''),
          status: 'completed',
          durationMs: 45
        };
      } else if (/^(action|tool call)[:\s]/i.test(trimmed)) {
        if (currentStep && currentStep.type) {
          steps.push(currentStep as ReActStep);
        }
        const actionText = trimmed.replace(/^(action|tool call)[:\s]+/i, '');
        currentStep = {
          id: `live-step-${stepCount++}`,
          type: 'action',
          title: `Action: ${actionText.slice(0, 30)}`,
          content: actionText,
          toolName: actionText.split('(')[0] || 'custom_tool',
          status: 'completed',
          durationMs: 80
        };
      } else if (/^(observation|output)[:\s]/i.test(trimmed)) {
        if (currentStep && currentStep.type) {
          steps.push(currentStep as ReActStep);
        }
        currentStep = {
          id: `live-step-${stepCount++}`,
          type: 'observation',
          title: `Observation #${steps.filter(s => s.type === 'observation').length + 1}`,
          content: trimmed.replace(/^(observation|output)[:\s]+/i, ''),
          status: 'completed',
          durationMs: 25
        };
      } else if (/^(final answer|finish|result)[:\s]/i.test(trimmed)) {
        if (currentStep && currentStep.type) {
          steps.push(currentStep as ReActStep);
        }
        currentStep = {
          id: `live-step-${stepCount++}`,
          type: 'finish',
          title: 'Final Synthesis',
          content: trimmed.replace(/^(final answer|finish|result)[:\s]+/i, ''),
          status: 'completed',
          durationMs: 35
        };
      } else if (currentStep) {
        currentStep.content = `${currentStep.content}\n${trimmed}`;
      }
    }

    if (currentStep && currentStep.type) {
      steps.push(currentStep as ReActStep);
    }

    return steps;
  }, [logs]);

  // Determine active steps list
  const activeSteps: ReActStep[] = useMemo(() => {
    if (selectedTraceKey === 'live') {
      if (liveSteps.length > 0) return liveSteps;
      return PRELOADED_TRACES.rag.steps;
    }
    return PRELOADED_TRACES[selectedTraceKey]?.steps || PRELOADED_TRACES.rag.steps;
  }, [selectedTraceKey, liveSteps]);

  // Default selected step is the first step if none selected
  const activeSelectedStep = useMemo(() => {
    if (!selectedStepId) return activeSteps[0] || null;
    return activeSteps.find(s => s.id === selectedStepId) || activeSteps[0] || null;
  }, [selectedStepId, activeSteps]);

  const totalDuration = activeSteps.reduce((acc, s) => acc + (s.durationMs || 0), 0);
  const actionCount = activeSteps.filter(s => s.type === 'action').length;
  const thoughtCount = activeSteps.filter(s => s.type === 'thought').length;

  const getNodeStyles = (type: ReActStep['type'], isSelected: boolean) => {
    switch (type) {
      case 'thought':
        return {
          border: isSelected ? 'border-amber-400 bg-amber-500/20' : 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400/80',
          text: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Brain
        };
      case 'action':
        return {
          border: isSelected ? 'border-cyan-400 bg-cyan-500/20' : 'border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400/80',
          text: 'text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: Wrench
        };
      case 'observation':
        return {
          border: isSelected ? 'border-violet-400 bg-violet-500/20' : 'border-violet-500/40 bg-violet-950/20 hover:border-violet-400/80',
          text: 'text-violet-300',
          badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
          icon: Eye
        };
      case 'finish':
        return {
          border: isSelected ? 'border-emerald-400 bg-emerald-500/20' : 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/80',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle
        };
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner: Trace Selector & Summary Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitFork size={16} className="text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              ReAct Reasoning & Tool Execution DAG
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
              Autonomous Loop
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Target Context: <span className="text-emerald-300">{activeLessonTitle}</span>
          </span>
        </div>

        {/* Global Trace Metrics */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 text-right">
            <span className="text-[10px] text-neutral-500 uppercase block">Thoughts</span>
            <span className="text-xs font-bold text-amber-300">{thoughtCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 text-right">
            <span className="text-[10px] text-neutral-500 uppercase block">Tool Invocations</span>
            <span className="text-xs font-bold text-cyan-300">{actionCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 text-right">
            <span className="text-[10px] text-neutral-500 uppercase block">Total Span</span>
            <span className="text-xs font-bold text-emerald-300">{totalDuration}ms</span>
          </div>
        </div>
      </div>

      {/* Trace Archetype Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          onClick={() => setSelectedTraceKey('live')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
            selectedTraceKey === 'live'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'bg-black/60 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Pulse size={14} className={liveSteps.length > 0 ? 'animate-pulse text-emerald-300' : ''} />
          <span>Live Editor Output ({liveSteps.length > 0 ? `${liveSteps.length} nodes` : 'Awaiting Run'})</span>
        </button>

        {Object.entries(PRELOADED_TRACES).map(([key, trace]) => (
          <button
            key={key}
            onClick={() => setSelectedTraceKey(key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              selectedTraceKey === key
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'bg-black/60 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{trace.name}</span>
          </button>
        ))}
      </div>

      {/* Main Visualizer Area: Directed Execution DAG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Interactive Step Nodes Graph */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-black/70 border border-white/10 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-2">
              <span className="uppercase tracking-wider">Sequential Reasoning Chain</span>
              <span className="text-neutral-500">Click any node to inspect payload</span>
            </div>

            {/* Step Nodes Flow with Connectors */}
            <div className="space-y-3 relative">
              {activeSteps.map((step, idx) => {
                const styles = getNodeStyles(step.type, activeSelectedStep?.id === step.id);
                const Icon = styles.icon;
                const isLast = idx === activeSteps.length - 1;

                return (
                  <div key={step.id} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedStepId(step.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${styles.border}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${styles.badge}`}>
                          <Icon size={16} weight="bold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${styles.text} text-xs`}>
                              {step.title}
                            </span>
                            {step.toolName && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {step.toolName}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                            {step.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {step.durationMs && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {step.durationMs}ms
                          </span>
                        )}
                        <ArrowRight size={14} className={activeSelectedStep?.id === step.id ? styles.text : 'text-neutral-600'} />
                      </div>
                    </motion.div>

                    {/* Connecting Vertical DAG Wire */}
                    {!isLast && (
                      <div className="flex items-center justify-center my-1.5">
                        <div className="w-0.5 h-3 bg-gradient-to-b from-white/20 to-white/5 rounded-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detailed Payload Inspector Drawer */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-black/80 border border-emerald-500/20 flex flex-col justify-between">
          {activeSelectedStep ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                  Node Telemetry Inspector
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px]">
                  {activeSelectedStep.type.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Node Title</span>
                <h4 className="text-sm font-bold text-white">{activeSelectedStep.title}</h4>
              </div>

              {activeSelectedStep.toolName && (
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Invoked MCP / Local Tool</span>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                    {activeSelectedStep.toolName}
                  </div>
                </div>
              )}

              {activeSelectedStep.toolArgs && (
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Call Parameters (JSON)</span>
                  <pre className="p-2.5 rounded-xl bg-black border border-white/10 text-neutral-300 text-[10px] overflow-x-auto">
                    {JSON.stringify(activeSelectedStep.toolArgs, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Trace Payload & Output</span>
                <div className="p-3 rounded-xl bg-black border border-white/10 text-neutral-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {activeSelectedStep.content}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-500">
                <span>Status: <span className="text-emerald-400 uppercase font-bold">{activeSelectedStep.status}</span></span>
                <span>Latency: {activeSelectedStep.durationMs || 0}ms</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-neutral-500">
              Select a node in the reasoning DAG to inspect telemetry details.
            </div>
          )}

          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-[10px] text-emerald-300">
            ReAct (Reason + Act) loop guarantees explainable multi-hop execution without opaque black-box hallucination.
          </div>
        </div>

      </div>
    </div>
  );
}
