import { useEffect, useRef, useState, useCallback } from 'react';
import type { RunnerMessage, WorkerMessage } from '@openguideforai/runner';

export type PyodideState = 'idle' | 'initializing' | 'ready' | 'running' | 'error';

export function usePyodide() {
  const [state, setState] = useState<PyodideState>('idle');
  const workerRef = useRef<Worker>(null);
  
  // Track output for the X-Ray lens or terminal
  const [logs, setLogs] = useState<{type: 'STDOUT' | 'STDERR' | 'RESULT'; text: string}[]>([]);
  
  // Resolve functions for active execution
  const activeExecution = useRef<{
    id: string;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  } | null>(null);

  useEffect(() => {
    setState('initializing');
    const worker = new Worker('/pyodide.worker.js');
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const msg = event.data;
      
      switch (msg.type) {
        case 'READY':
          setState('ready');
          break;
        case 'STDOUT':
          setLogs(prev => [...prev, { type: 'STDOUT', text: msg.text }]);
          break;
        case 'STDERR':
          setLogs(prev => [...prev, { type: 'STDERR', text: msg.text }]);
          break;
        case 'RESULT':
          setLogs(prev => [...prev, { type: 'RESULT', text: msg.error || (typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data)) }]);
          
          if (activeExecution.current?.id === msg.id) {
            if (msg.error) {
              activeExecution.current.reject(new Error(msg.error));
            } else {
              activeExecution.current.resolve(msg.data);
            }
            activeExecution.current = null;
            setState('ready');
          }
          break;
      }
    };

    // Kick off initialization
    worker.postMessage({ type: 'INIT' } satisfies RunnerMessage);

    return () => {
      worker.terminate();
    };
  }, []);

  const runCode = useCallback((code: string) => {
    if (state !== 'ready' && state !== 'running') {
      return Promise.reject(new Error('Pyodide is not ready'));
    }

    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      activeExecution.current = { id, resolve, reject };
      setState('running');
      workerRef.current?.postMessage({ type: 'EXECUTE', code, id } satisfies RunnerMessage);
    });
  }, [state]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { state, logs, runCode, clearLogs };
}
