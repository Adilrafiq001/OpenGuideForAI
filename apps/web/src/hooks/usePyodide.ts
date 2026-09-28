import { useEffect, useRef, useState, useCallback } from 'react';

export type PyodideState = 'idle' | 'initializing' | 'ready' | 'running' | 'error';

export interface PyodideTelemetry {
  lastDurationMs: number;
  memoryMb: number;
  runtime: string;
  version: string;
  variables: Record<string, string>;
  lastPayload: { code: string; id: string; timestamp: string } | null;
  history: Array<{ id: string; status: 'success' | 'error'; durationMs: number; timestamp: string }>;
}

export function usePyodide() {
  const [state, setState] = useState<PyodideState>('idle');
  const workerRef = useRef<Worker | null>(null);
  
  // Track output for the X-Ray lens or terminal
  const [logs, setLogs] = useState<{ type: 'STDOUT' | 'STDERR' | 'RESULT'; text: string; timestamp: string }[]>([]);
  
  // Real-time telemetry for X-Ray Debug Lens
  const [telemetry, setTelemetry] = useState<PyodideTelemetry>({
    lastDurationMs: 0,
    memoryMb: 0,
    runtime: 'CPython WASM',
    version: '0.25.0',
    variables: {},
    lastPayload: null,
    history: []
  });

  // Resolve functions for active execution
  const activeExecution = useRef<{
    id: string;
    code: string;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  } | null>(null);

  useEffect(() => {
    setState('initializing');
    const worker = new Worker('/pyodide.worker.js');
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<any>) => {
      const msg = event.data;
      const timestamp = new Date().toLocaleTimeString();
      
      switch (msg.type) {
        case 'READY':
          setState('ready');
          setTelemetry(prev => ({
            ...prev,
            version: msg.version || prev.version,
            runtime: msg.runtime || prev.runtime
          }));
          break;

        case 'STDOUT':
          setLogs(prev => [...prev, { type: 'STDOUT', text: msg.text, timestamp }]);
          break;

        case 'STDERR':
          setLogs(prev => [...prev, { type: 'STDERR', text: msg.text, timestamp }]);
          break;

        case 'RESULT':
          const resultText = msg.error || (typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data));
          setLogs(prev => [...prev, { type: 'RESULT', text: resultText, timestamp }]);
          
          const currentExec = activeExecution.current;
          if (currentExec && currentExec.id === msg.id) {
            const durationMs = msg.durationMs || 0;
            const memoryMb = msg.memoryMb || 0;
            const variables = msg.variables || {};

            setTelemetry(prev => ({
              ...prev,
              lastDurationMs: durationMs,
              memoryMb: memoryMb || prev.memoryMb,
              variables,
              history: [
                {
                  id: msg.id,
                  status: msg.error ? 'error' : 'success',
                  durationMs,
                  timestamp
                },
                ...prev.history.slice(0, 19)
              ]
            }));

            if (msg.error) {
              currentExec.reject(new Error(msg.error));
            } else {
              currentExec.resolve({
                result: msg.data,
                stdout: typeof msg.stdout === 'string' ? msg.stdout : (typeof msg.data === 'string' ? msg.data : ''),
                durationMs
              });
            }
            activeExecution.current = null;
            setState('ready');
          }
          break;

        case 'ERROR':
          setState('error');
          setLogs(prev => [...prev, { type: 'STDERR', text: msg.error || 'Worker encountered an error', timestamp }]);
          break;
      }
    };

    worker.onerror = (err) => {
      console.warn('[Pyodide Worker Error]', err);
      setState('error');
    };

    // Kick off initialization
    worker.postMessage({ type: 'INIT' });

    return () => {
      worker.terminate();
    };
  }, []);

  const runCode = useCallback((code: string): Promise<{ result: any; stdout: string; durationMs: number }> => {
    if (state !== 'ready' && state !== 'running') {
      return Promise.reject(new Error('Pyodide engine is not ready.'));
    }

    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const timestamp = new Date().toLocaleTimeString();
      activeExecution.current = { id, code, resolve, reject };
      
      setTelemetry(prev => ({
        ...prev,
        lastPayload: { code, id, timestamp }
      }));

      setState('running');
      workerRef.current?.postMessage({ type: 'EXECUTE', code, id });
    });
  }, [state]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { state, logs, telemetry, runCode, clearLogs };
}
