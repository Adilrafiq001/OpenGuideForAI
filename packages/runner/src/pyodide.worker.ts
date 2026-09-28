import { loadPyodide, type PyodideInterface } from 'pyodide';
import type { RunnerMessage, WorkerMessage } from './types';

let pyodide: PyodideInterface | null = null;

async function initPyodide() {
  // Use the standard jsdelivr CDN to fetch the Pyodide environment
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
  });

  // Redirect stdout/stderr to the main thread
  pyodide.setStdout({ batched: (text) => postMessage({ type: 'STDOUT', text }) });
  pyodide.setStderr({ batched: (text) => postMessage({ type: 'STDERR', text }) });

  // Preload essential micropip for async package fetching (per guidelines)
  await pyodide.loadPackage(['micropip']);
  
  postMessage({ type: 'READY' } satisfies WorkerMessage);
}

self.onmessage = async (event: MessageEvent<RunnerMessage>) => {
  const msg = event.data;

  if (msg.type === 'INIT') {
    await initPyodide();
  } else if (msg.type === 'EXECUTE') {
    if (!pyodide) {
      postMessage({ type: 'RESULT', error: 'Pyodide not initialized', id: msg.id } satisfies WorkerMessage);
      return;
    }
    
    try {
      const result = await pyodide.runPythonAsync(msg.code);
      postMessage({ type: 'RESULT', data: result, id: msg.id } satisfies WorkerMessage);
    } catch (error: any) {
      postMessage({ type: 'RESULT', error: error.message, id: msg.id } satisfies WorkerMessage);
    }
  }
};
