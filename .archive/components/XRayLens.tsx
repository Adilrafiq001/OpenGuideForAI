
type XRayLensProps = {
  state: string;
  logs: { type: string; text: string }[];
  isOpen: boolean;
  onToggle: () => void;
};

export function XRayLens({ state, logs, isOpen, onToggle }: XRayLensProps) {
  return (
    <>
      <button 
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: isOpen ? '#e53e3e' : '#3182ce',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        {isOpen ? 'CLOSE X-RAY' : 'X-RAY LENS'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          right: '20px',
          width: '400px',
          height: '500px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          borderRadius: '8px',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'monospace',
          color: '#e2e8f0'
        }}>
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid #334155', 
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <strong>X-Ray Debug Lens</strong>
            <span style={{ 
              color: state === 'ready' ? '#4ade80' : 
                     state === 'running' ? '#fbbf24' : 
                     state === 'error' ? '#f87171' : '#94a3b8' 
            }}>
              [{state.toUpperCase()}]
            </span>
          </div>
          
          <div style={{ padding: '12px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ 
                  color: log.type === 'STDOUT' ? '#cbd5e1' : 
                         log.type === 'STDERR' ? '#f87171' : '#a78bfa',
                  wordBreak: 'break-all'
                }}>
                  <span style={{ opacity: 0.5, marginRight: '8px' }}>[{log.type}]</span>
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
