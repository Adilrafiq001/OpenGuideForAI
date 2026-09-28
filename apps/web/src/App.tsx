import { useState } from 'react'
import { usePyodide } from './hooks/usePyodide'
import { XRayLens } from './components/XRayLens'
import './App.css'

function App() {
  const { state, logs, runCode } = usePyodide()
  const [code, setCode] = useState('print("Hello from Pyodide Web Worker!")\n2 + 2')
  const [isXRayOpen, setIsXRayOpen] = useState(false)

  const handleRun = async () => {
    try {
      await runCode(code)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>OpenGuideForAI</h1>
        <p>Phase 2: Vertical Slice</p>
        
        <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h2>Python Engine Status: <span style={{ color: state === 'ready' ? 'green' : 'orange' }}>{state}</span></h2>
          
          <div style={{ marginTop: '20px' }}>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: '100%',
                height: '150px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                resize: 'vertical'
              }}
              disabled={state !== 'ready' && state !== 'running'}
            />
          </div>
          
          <button 
            onClick={handleRun}
            disabled={state !== 'ready'}
            style={{
              marginTop: '12px',
              padding: '10px 20px',
              background: state === 'ready' ? '#2563eb' : '#94a3b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: state === 'ready' ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            {state === 'initializing' ? 'Booting AI Engine...' : 'Run Python Code'}
          </button>
        </div>
      </main>

      <XRayLens 
        state={state} 
        logs={logs} 
        isOpen={isXRayOpen} 
        onToggle={() => setIsXRayOpen(!isXRayOpen)} 
      />
    </>
  )
}

export default App
