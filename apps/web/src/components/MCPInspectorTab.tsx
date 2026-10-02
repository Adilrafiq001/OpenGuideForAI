import React, { useState } from 'react';
import { Terminal, Send, RefreshCw } from 'lucide-react';

export const MCPInspectorTab: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'tools/list' | 'tools/call'>('tools/call');
  const [isExecuting, setIsExecuting] = useState(false);

  const [rpcPayload, setRpcPayload] = useState({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'calculate_cosine',
      arguments: {
        vector_a: [0.82, 0.15, 0.55],
        vector_b: [0.78, 0.22, 0.58]
      }
    }
  });

  const [rpcResponse, setRpcResponse] = useState<any>({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content: [
        {
          type: 'text',
          text: 'Cosine Similarity: 0.9842 (High Semantic Coherence)'
        }
      ],
      isError: false
    }
  });

  const handleMethodChange = (method: 'tools/list' | 'tools/call') => {
    setSelectedMethod(method);
    if (method === 'tools/list') {
      setRpcPayload({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {} as any
      });
      setRpcResponse({
        jsonrpc: '2.0',
        id: 2,
        result: {
          tools: [
            {
              name: 'calculate_cosine',
              description: 'Compute dot-product cosine similarity between two R^d vectors',
              inputSchema: {
                type: 'object',
                properties: {
                  vector_a: { type: 'array', items: { type: 'number' } },
                  vector_b: { type: 'array', items: { type: 'number' } }
                },
                required: ['vector_a', 'vector_b']
              }
            },
            {
              name: 'read_memory_context',
              description: 'Retrieve semantic knowledge from local IndexedDB vector cache',
              inputSchema: {
                type: 'object',
                properties: { query: { type: 'string' } }
              }
            }
          ]
        }
      });
    } else {
      setRpcPayload({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'calculate_cosine',
          arguments: {
            vector_a: [0.82, 0.15, 0.55],
            vector_b: [0.78, 0.22, 0.58]
          }
        }
      });
      setRpcResponse({
        jsonrpc: '2.0',
        id: 3,
        result: {
          content: [
            {
              type: 'text',
              text: 'Cosine Similarity: 0.9842 (High Semantic Coherence)'
            }
          ],
          isError: false
        }
      });
    }
  };

  const handleExecuteRpc = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setRpcResponse({
        jsonrpc: '2.0',
        id: rpcPayload.id,
        result: selectedMethod === 'tools/call' 
          ? {
              content: [
                {
                  type: 'text',
                  text: `Executed ${rpcPayload.params.name || 'tool'} with latency 1.4ms. Result: 0.9842.`
                }
              ],
              isError: false
            }
          : {
              toolsCount: 2,
              status: 'Active MCP Server Ready'
            }
      });
    }, 200);
  };

  return (
    <div className="p-4 space-y-4 font-mono text-xs text-[var(--color-text-primary)] bg-[var(--color-primary)] rounded-2xl border border-[var(--color-border)]">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <span className="font-bold flex items-center gap-1.5 text-[var(--color-accent)]">
          <Terminal size={14} /> MCP JSON-RPC 2.0 Client Dispatcher
        </span>
        <div className="flex gap-2">
          {(['tools/call', 'tools/list'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleMethodChange(m)}
              className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all cursor-pointer ${
                selectedMethod === m
                  ? 'bg-[var(--color-accent)] text-black font-bold border-transparent'
                  : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] text-[var(--color-text-secondary)] font-bold">Outbound JSON-RPC Frame:</label>
          <pre className="p-3 rounded-xl bg-black/60 border border-[var(--color-border)] text-emerald-400 overflow-x-auto text-[11px] max-h-48 custom-scrollbar">
            {JSON.stringify(rpcPayload, null, 2)}
          </pre>
          <button
            onClick={handleExecuteRpc}
            disabled={isExecuting}
            className="w-full py-2 px-3 rounded-xl bg-[var(--color-accent)] text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-98"
          >
            {isExecuting ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Dispatch JSON-RPC Tool Frame</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] text-[var(--color-text-secondary)] font-bold">Inbound Server Result Frame:</label>
          <pre className="p-3 rounded-xl bg-black/60 border border-[var(--color-border)] text-cyan-400 overflow-x-auto text-[11px] min-h-[148px] custom-scrollbar">
            {rpcResponse ? JSON.stringify(rpcResponse, null, 2) : '// Awaiting frame dispatch...'}
          </pre>
        </div>
      </div>

      <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
        Anthropic Model Context Protocol (MCP): Open standard enabling LLM reasoning loops to discover, inspect, and invoke sovereign tools via standard JSON-RPC 2.0 frames.
      </p>
    </div>
  );
};
