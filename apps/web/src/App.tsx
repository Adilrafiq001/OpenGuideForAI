import { CoursePlayer } from './components/CoursePlayer'
import { track0 } from './data/track0'
import './App.css'

function App() {
  
  // Note: the CoursePlayer currently fetches its own usePyodide hook instance.
  // Wait, if CoursePlayer calls usePyodide, it spawns its own worker.
  // App also calls usePyodide? Let's just use it in one place or use a context.
  // Actually, for now let's just render the CoursePlayer. X-Ray lens would need global state.
  // We will mount a mock X-Ray lens that just tells the user to click it for now, 
  // or we pass the same Pyodide instance down. 
  
  // To avoid spinning up 2 workers, let's remove usePyodide from App and let CoursePlayer handle it.
  // BUT XRayLens needs state and logs! So we should keep usePyodide in App and pass it down.
  // Let me just export CoursePlayer to not use usePyodide directly, but accept it as props.

  return (
    <>
      <CoursePlayer track={track0} />
      {/* XRayLens omitted here for simplicity in this step. We'll integrate it properly soon. */}
    </>
  )
}

export default App
