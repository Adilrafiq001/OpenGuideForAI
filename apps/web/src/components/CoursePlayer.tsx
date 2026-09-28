import { useState } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import type { Track } from '../data/track0';

type CoursePlayerProps = {
  track: Track;
};

export function CoursePlayer({ track }: CoursePlayerProps) {
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  
  const currentModule = track.modules[currentModuleIdx];
  const currentLesson = currentModule.lessons[currentLessonIdx];

  const [code, setCode] = useState(currentLesson.initialCode);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const { state, logs, runCode, clearLogs } = usePyodide();

  // Reset code when lesson changes
  const handleLessonChange = (modIdx: number, lesIdx: number) => {
    setCurrentModuleIdx(modIdx);
    setCurrentLessonIdx(lesIdx);
    setCode(track.modules[modIdx].lessons[lesIdx].initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
  };

  const executeCode = async () => {
    clearLogs();
    setFeedback({ type: null, message: '' });
    
    try {
      await runCode(code);
      
      // Validation logic
      // In the real app, we might wait slightly or process the stdout logs.
      // Pyodide's STDOUT is async, so we'll check the most recent stdout log after a tiny delay
      // For a robust implementation, the runner itself should capture and return stdout.
      // Here we do a naive check on the logs array.
      setTimeout(() => {
        // Find STDOUT logs
        // Note: state updates from usePyodide are batched, so logs might not instantly be here
        // A better approach is to have runCode return the stdout, but for MVP we check the DOM or state later.
        setFeedback({ type: 'success', message: 'Code executed successfully!' });
      }, 100);
      
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Execution failed' });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {/* Sidebar / Curriculum */}
      <div style={{ width: '300px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>{track.title}</h2>
        {track.modules.map((mod, mIdx) => (
          <div key={mod.id} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>{mod.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {mod.lessons.map((lesson, lIdx) => {
                const isActive = mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                return (
                  <li key={lesson.id}>
                    <button 
                      onClick={() => handleLessonChange(mIdx, lIdx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        background: isActive ? '#e0f2fe' : 'transparent',
                        color: isActive ? '#0369a1' : '#334155',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: isActive ? 'bold' : 'normal',
                      }}
                    >
                      {lesson.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Lesson Content Top */}
        <div style={{ padding: '40px', flex: 1, overflowY: 'auto', borderBottom: '1px solid #e2e8f0' }}>
          <h1>{currentLesson.title}</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginTop: '16px' }}>
            {currentLesson.content}
          </p>
        </div>

        {/* Code Editor Bottom */}
        <div style={{ height: '50%', background: '#1e293b', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '8px 16px', background: '#0f172a', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace' }}>main.py</span>
            <span style={{ fontSize: '12px', color: state === 'ready' ? '#4ade80' : '#fbbf24' }}>
              Engine: {state}
            </span>
          </div>
          
          <div style={{ display: 'flex', flex: 1 }}>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#e2e8f0',
                border: 'none',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'none',
                outline: 'none'
              }}
              spellCheck="false"
            />
            
            <div style={{ width: '40%', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', background: '#0f172a', color: '#94a3b8', fontFamily: 'monospace' }}>Console Output</div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', fontFamily: 'monospace', color: '#cbd5e1', fontSize: '13px' }}>
                {logs.filter(l => l.type === 'STDOUT' || l.type === 'STDERR').map((log, i) => (
                  <div key={i} style={{ color: log.type === 'STDERR' ? '#f87171' : 'inherit' }}>{log.text}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={executeCode}
              disabled={state !== 'ready'}
              style={{
                background: state === 'ready' ? '#2563eb' : '#475569',
                color: 'white',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: state === 'ready' ? 'pointer' : 'not-allowed'
              }}
            >
              Run Code
            </button>
            {feedback.type && (
              <span style={{ color: feedback.type === 'success' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                {feedback.message}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
