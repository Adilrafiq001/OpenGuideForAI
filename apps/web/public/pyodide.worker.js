// pyodide.worker.js - Classic Worker in public folder
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

let pyodide = null;

async function initPyodide() {
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
  });

  // Redirect stdout/stderr to the main thread
  pyodide.setStdout({ batched: (text) => postMessage({ type: 'STDOUT', text }) });
  pyodide.setStderr({ batched: (text) => postMessage({ type: 'STDERR', text }) });

  await pyodide.loadPackage(['micropip']);
  
  postMessage({ type: 'READY' });
}

self.onmessage = async (event) => {
  const msg = event.data;

  if (msg.type === 'INIT') {
    await initPyodide();
  } else if (msg.type === 'EXECUTE') {
    if (!pyodide) {
      postMessage({ type: 'RESULT', error: 'Pyodide not initialized', id: msg.id });
      return;
    }
    
    try {
      const result = await pyodide.runPythonAsync(msg.code);
      postMessage({ type: 'RESULT', data: result, id: msg.id });
    } catch (error) {
      postMessage({ type: 'RESULT', error: error.message, id: msg.id });
    }
  }
};
