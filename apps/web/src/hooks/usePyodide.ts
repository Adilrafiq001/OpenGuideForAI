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
  const [initStage, setInitStage] = useState<string>('Pre-warming WebAssembly kernel...');
  const workerRef = useRef<Worker | null>(null);
  
  // Track output for the X-Ray lens or terminal
  const [logs, setLogs] = useState<{ type: 'STDOUT' | 'STDERR' | 'RESULT'; text: string; timestamp: string }[]>([]);
  
  // Real-time telemetry for X-Ray Debug Lens
  const [telemetry, setTelemetry] = useState<PyodideTelemetry>({
    lastDurationMs: 0,
    memoryMb: 0,
    runtime: 'CPython WASM',
    version: '0.26.2',
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

  // Watchdog timer ref (terminates runaway code > 15 seconds)
  const watchdogTimerRef = useRef<number | null>(null);

  const initWorker = useCallback(() => {
    setState('initializing');
    const worker = new Worker('/pyodide.worker.js');
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<any>) => {
      const msg = event.data;
      const timestamp = new Date().toLocaleTimeString();
      
      switch (msg.type) {
        case 'INIT_PROGRESS':
          setInitStage(msg.text || 'Loading WebAssembly runtime...');
          break;

        case 'READY':
          setState('ready');
          setInitStage('CPython WebAssembly Ready');
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
          if (watchdogTimerRef.current) {
            clearTimeout(watchdogTimerRef.current);
            watchdogTimerRef.current = null;
          }

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
          if (watchdogTimerRef.current) {
            clearTimeout(watchdogTimerRef.current);
            watchdogTimerRef.current = null;
          }
          setState('error');
          setLogs(prev => [...prev, { type: 'STDERR', text: msg.error || 'Worker encountered an error', timestamp }]);
          if (activeExecution.current) {
            activeExecution.current.reject(new Error(msg.error || 'Worker encountered an error'));
            activeExecution.current = null;
          }
          break;
      }
    };

    worker.onerror = (err) => {
      console.warn('[Pyodide Worker Error]', err);
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
      setState('error');
      if (activeExecution.current) {
        activeExecution.current.reject(new Error('Web Worker encountered an unhandled error.'));
        activeExecution.current = null;
      }
    };

    // Kick off initialization
    worker.postMessage({ type: 'INIT' });
  }, []);

  useEffect(() => {
    initWorker();

    return () => {
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
      if (activeExecution.current) {
        activeExecution.current.reject(new Error('Execution cancelled: component unmounted mid-flight.'));
        activeExecution.current = null;
      }
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [initWorker]);

  const runCode = useCallback((code: string): Promise<{ result: any; stdout: string; durationMs: number }> => {
    if (state !== 'ready' || activeExecution.current !== null) {
      if (state === 'running' || activeExecution.current !== null) {
        return Promise.reject(new Error('Pyodide engine is currently busy executing code.'));
      }
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

      // 15-second watchdog timer: terminate and respawn worker if execution exceeds budget
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
      }
      watchdogTimerRef.current = window.setTimeout(() => {
        if (activeExecution.current && activeExecution.current.id === id) {
          const timeoutMsg = 'Execution terminated: Exceeded 15-second watchdog budget.';
          setLogs(prev => [...prev, { type: 'STDERR', text: timeoutMsg, timestamp: new Date().toLocaleTimeString() }]);
          
          workerRef.current?.terminate();
          const timedOutExec = activeExecution.current;
          activeExecution.current = null;
          timedOutExec.reject(new Error(timeoutMsg));
          
          initWorker();
        }
      }, 15000);
    });
  }, [state, initWorker]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { state, initStage, logs, telemetry, runCode, clearLogs };
}
