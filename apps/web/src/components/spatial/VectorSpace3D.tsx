import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { detectHardwareSync } from '../../utils/hardwareDetection';

export interface SemanticVectorNode {
  id: string;
  label: string;
  cluster: 'neural' | 'vector' | 'math' | 'agents';
  coords: [number, number, number]; // 3D coordinates (PCA projection)
  color: string;
  details: string;
}

export const SEMANTIC_VECTORS: SemanticVectorNode[] = [
  // Cluster 1: Neural Architecture (Emerald / Green)
  { id: 'transformer', label: 'Transformer', cluster: 'neural', coords: [2.5, 1.8, 1.2], color: '#10b981', details: 'Multi-head self-attention backbone' },
  { id: 'attention', label: 'Self-Attention', cluster: 'neural', coords: [2.8, 2.2, 0.9], color: '#10b981', details: 'Dynamic token-to-token contextual weighting' },
  { id: 'mlp', label: 'Perceptron (MLP)', cluster: 'neural', coords: [1.8, 0.8, 1.5], color: '#10b981', details: 'Feed-forward dense neural layers' },
  { id: 'weights', label: 'Synaptic Weights', cluster: 'neural', coords: [1.4, 1.2, 2.0], color: '#10b981', details: 'Learnable tensor parameters' },

  // Cluster 2: Vector Search & Memory (Cyan / Sky)
  { id: 'embeddings', label: 'Vector Embeddings', cluster: 'vector', coords: [-2.2, 1.5, 0.5], color: '#06b6d4', details: 'Dense floating-point semantic coordinates' },
  { id: 'vectordb', label: 'Vector Database', cluster: 'vector', coords: [-2.8, 2.0, 0.2], color: '#06b6d4', details: 'High-speed HNSW semantic indexing' },
  { id: 'cosine', label: 'Cosine Similarity', cluster: 'vector', coords: [-1.8, 1.0, 1.1], color: '#06b6d4', details: 'Dot-product angular distance formula' },
  { id: 'rag', label: 'RAG Pipeline', cluster: 'vector', coords: [-1.2, 2.5, -0.4], color: '#06b6d4', details: 'Retrieval-Augmented Generation context injection' },

  // Cluster 3: Math & Optimization (Violet / Purple) - Centered & Normalized in Viewport
  { id: 'gradient', label: 'Gradient Descent', cluster: 'math', coords: [0.5, -1.2, 1.8], color: '#8b5cf6', details: 'First-order iterative optimization algorithm' },
  { id: 'backprop', label: 'Backpropagation', cluster: 'math', coords: [0.8, -0.8, 2.3], color: '#8b5cf6', details: 'Chain-rule reverse gradient computation' },
  { id: 'loss', label: 'Cross-Entropy Loss', cluster: 'math', coords: [-0.2, -1.4, 1.4], color: '#8b5cf6', details: 'Prediction error quantification penalty' },
  { id: 'learning_rate', label: 'Learning Rate (η)', cluster: 'math', coords: [1.2, -1.6, 0.9], color: '#8b5cf6', details: 'Step size hyperparameter per iteration' },

  // Cluster 4: Autonomous Agents & Memory (Amber / Orange)
  { id: 'agent', label: 'Autonomous Agent', cluster: 'agents', coords: [-0.5, 1.8, -2.4], color: '#f59e0b', details: 'Self-directed ReAct reasoning & execution loop' },
  { id: 'tools', label: 'Tool Schemas (MCP)', cluster: 'agents', coords: [-0.2, 2.4, -2.0], color: '#f59e0b', details: 'External APIs, Python interpreter & filesystem' },
  { id: 'react_loop', label: 'ReAct Loop', cluster: 'agents', coords: [-1.0, 1.2, -2.6], color: '#f59e0b', details: 'Reason -> Action -> Observation cycle' },
  { id: 'context_window', label: 'Context Window', cluster: 'agents', coords: [0.6, 1.5, -1.8], color: '#f59e0b', details: 'Active token working memory capacity' }
];

interface VectorSpace3DProps {
  onSelectNode?: (node: SemanticVectorNode) => void;
  className?: string;
  force2D?: boolean;
}

export function VectorSpace3D({ onSelectNode, className = '', force2D = false }: VectorSpace3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { graphicsTier } = useSettingsStore();

  const [selectedNode, setSelectedNode] = useState<SemanticVectorNode>(SEMANTIC_VECTORS[0]);
  const [comparedNode, setComparedNode] = useState<SemanticVectorNode>(SEMANTIC_VECTORS[1]);
  const [hoveredNode, setHoveredNode] = useState<SemanticVectorNode | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hardwareInfo] = useState(() => detectHardwareSync());
  
  // Spatial XR Suite Controls (Meta/Oculus & VisionOS Grade)
  const [clusterFilter, setClusterFilter] = useState<'all' | 'neural' | 'vector' | 'math' | 'agents'>('all');
  const [simThreshold, setSimThreshold] = useState<number>(0.65);
  const [gimbalAngles, setGimbalAngles] = useState({ pitch: 0, yaw: 0 });

  // Determine if we should render 3D WebGL or 2D Lean
  const use3D = !force2D && graphicsTier !== '2d-lean' && hardwareInfo.hasWebGL;

  // Calculate real cosine similarity between selected and compared nodes in 3D
  const cosineSim = (() => {
    const v1 = new THREE.Vector3(...selectedNode.coords);
    const v2 = new THREE.Vector3(...comparedNode.coords);
    const dot = v1.dot(v2);
    const mag = v1.length() * v2.length();
    return mag > 0 ? (dot / mag) : 0;
  })();

  const angleDegrees = Math.acos(Math.max(-1, Math.min(1, cosineSim))) * (180 / Math.PI);

  // Web Audio Spatial Synthesizer Chime
  const playNodeChime = (cluster: string) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs: Record<string, number> = {
        neural: 523.25, // C5
        vector: 659.25, // E5
        math: 783.99,   // G5
        agents: 1046.50 // C6
      };
      osc.frequency.setValueAtTime(freqs[cluster] || 587.33, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  // 3D Scene Initialization & Loop
  useEffect(() => {
    if (!use3D || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    // Centered & Balanced Camera for Meta/VisionOS Spatial View
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.6, 9.0);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !hardwareInfo.isLowEnd,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Spatial Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0x10b981, 3.0, 70);
    primaryLight.position.set(2, 6, 6);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(0x06b6d4, 2.5, 60);
    secondaryLight.position.set(-6, 4, 4);
    scene.add(secondaryLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 2.0, 50);
    backLight.position.set(0, -4, -6);
    scene.add(backLight);

    // Root Group for Rotation
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // 1. Cosmic Latent Space Particle Cloud (1,400 floating manifold points)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 26;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.45
    });
    const starField = new THREE.Points(starGeo, starMat);
    galaxyGroup.add(starField);

    // 2. Holographic Coordinate Rings (Spatial Gyroscope & Horizon Planes)
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.63, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.28 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    galaxyGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.4, 4.43, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.22 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    galaxyGroup.add(ring2);

    // 3. Grid Floor Plane (Spatial Coordinate Grid) - Balanced at y = -2.2
    const gridHelper = new THREE.GridHelper(14, 14, 0x10b981, 0x334155);
    gridHelper.position.y = -2.2;
    galaxyGroup.add(gridHelper);

    // 4. Create Physical Dielectric 3D Nodes
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: SemanticVectorNode }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.24, 28, 28);
    const haloGeo = new THREE.SphereGeometry(0.38, 16, 16);

    SEMANTIC_VECTORS.forEach(vec => {
      const isSelected = vec.id === selectedNode.id;
      const isCompared = vec.id === comparedNode.id;
      const matchesFilter = clusterFilter === 'all' || vec.cluster === clusterFilter;

      // High-grade physical shader material with depth sheen
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(vec.color),
        emissive: new THREE.Color(vec.color),
        emissiveIntensity: isSelected ? 1.0 : isCompared ? 0.7 : matchesFilter ? 0.35 : 0.08,
        roughness: 0.2,
        metalness: 0.35,
        transparent: true,
        opacity: matchesFilter ? 1.0 : 0.2
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...vec.coords);
      galaxyGroup.add(mesh);

      // Holographic Wireframe Halo for Selected / Compared node
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(vec.color),
        wireframe: true,
        transparent: true,
        opacity: isSelected ? 0.75 : isCompared ? 0.4 : 0
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...vec.coords);
      galaxyGroup.add(halo);

      nodeMeshes.push({ mesh, halo, data: vec });

      // Connecting line from center origin to vector node
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(vec.color),
        transparent: true,
        opacity: isSelected ? 0.7 : matchesFilter ? 0.25 : 0.05
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...vec.coords)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      galaxyGroup.add(line);
    });

    // 5. Connecting Geodesic Vector Line between Selected and Compared nodes
    const pairLineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.25,
      gapSize: 0.12,
      transparent: true,
      opacity: 0.95
    });
    const pairLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...selectedNode.coords),
      new THREE.Vector3(...comparedNode.coords)
    ]);
    const pairLine = new THREE.Line(pairLineGeo, pairLineMat);
    pairLine.computeLineDistances();
    galaxyGroup.add(pairLine);

    // 6. Direct Three.js Raycaster for Interactive Hit-Testing
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getNormalizedMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      getNormalizedMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        canvas.style.cursor = 'pointer';
        const hit = nodeMeshes.find(n => n.mesh === intersects[0].object);
        if (hit) {
          setHoveredNode(hit.data);
          hit.mesh.scale.set(1.3, 1.3, 1.3);
        }
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredNode(null);
        nodeMeshes.forEach(n => n.mesh.scale.set(1, 1, 1));
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      getNormalizedMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find(n => n.mesh === intersects[0].object);
        if (hit) {
          if (hit.data.id !== selectedNode.id) {
            setComparedNode(selectedNode);
          }
          setSelectedNode(hit.data);
          onSelectNode?.(hit.data);
          playNodeChime(hit.data.cluster);
        }
      }
    };

    // 7. Mouse & Touch Orbit Controls (Interactive Spatial Gyroscope)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      galaxyGroup.rotation.y += deltaX * 0.007;
      galaxyGroup.rotation.x += deltaY * 0.007;

      setGimbalAngles({
        yaw: Math.round(((galaxyGroup.rotation.y * 180) / Math.PI) % 360),
        pitch: Math.round(((galaxyGroup.rotation.x * 180) / Math.PI) % 360)
      });

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        galaxyGroup.rotation.y += 0.0022;
        starField.rotation.y -= 0.0004;
      }

      // Rotate selected node halo
      nodeMeshes.forEach(n => {
        if (n.data.id === selectedNode.id) {
          n.halo.rotation.y += 0.025;
          n.halo.rotation.x += 0.015;
        }
      });

      camera.lookAt(0, 0.1, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      sphereGeo.dispose();
      haloGeo.dispose();
    };
  }, [use3D, isRotating, selectedNode, comparedNode, hardwareInfo.isLowEnd, soundEnabled, clusterFilter, simThreshold]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col shadow-2xl text-[var(--color-text-primary)] transition-colors ${className}`}>
      
      {/* Top HUD Controls (Meta/VisionOS Spatial Command Bar) */}
      <div className="px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] shadow-inner">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              Semantic Embedding Hyper-Space
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 font-bold">
                XR Manifold Suite
              </span>
            </h4>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              {use3D ? '6-DOF Latent Manifold Projection • Direct Raycaster' : '2D Lean SVG Projection'}
            </span>
          </div>
        </div>

        {/* Orbit, Gyroscope & Audio Toggles */}
        <div className="flex items-center gap-2.5">
          {/* Spatial Gimbal Telemetry Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[10px] font-mono shadow-inner">
            <span className="text-[var(--color-text-secondary)]">Gimbal:</span>
            <span className="text-[var(--color-accent)] font-bold">Y:{gimbalAngles.yaw}° P:{gimbalAngles.pitch}°</span>
          </div>

          {/* Cosine & Angle Proximity Badge */}
          <div className="px-3 py-1 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center gap-2 text-xs font-mono shadow-inner">
            <span className="text-[var(--color-text-secondary)]">Proximity:</span>
            <span className={`font-bold ${cosineSim > 0.8 ? 'text-emerald-400' : cosineSim > 0.3 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {(cosineSim * 100).toFixed(1)}% (θ={angleDegrees.toFixed(1)}°)
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              soundEnabled ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/40 text-[var(--color-accent)]' : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
            }`}
            title={soundEnabled ? 'Mute Spatial Audio Chimes' : 'Enable Spatial Audio'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {use3D && (
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                isRotating ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
              title={isRotating ? 'Pause Rotation' : 'Resume Orbit'}
            >
              <RotateCcw size={14} className={isRotating ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Spatial Sub-Manifold Cluster Slicer Bar */}
      <div className="px-5 py-2.5 bg-[var(--color-primary)]/70 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[var(--color-accent)]" />
          <span className="text-[var(--color-text-secondary)]">Isolate Sub-Manifold:</span>
          {(['all', 'neural', 'vector', 'math', 'agents'] as const).map(c => (
            <button
              key={c}
              onClick={() => setClusterFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] capitalize transition-all cursor-pointer ${
                clusterFilter === c
                  ? 'bg-[var(--color-accent)] text-black font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]'
              }`}
            >
              {c === 'all' ? 'All Clusters' : c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--color-text-secondary)]">Sim Threshold:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={simThreshold}
            onChange={(e) => setSimThreshold(parseFloat(e.target.value))}
            className="w-24 accent-[var(--color-accent)] cursor-pointer"
            title="Filter semantic connections"
          />
          <span className="text-[10px] font-bold text-[var(--color-accent)]">≥ {(simThreshold * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Canvas Area (High-End Spatial Viewport) */}
      <div ref={containerRef} className="relative w-full h-[520px] md:h-[580px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#040711] via-[#080d1e] to-[#040711]">
        {use3D ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Real-time Hovered / Active Node Floating Badge */}
            {hoveredNode && (
              <div className="absolute top-4 left-4 pointer-events-none z-20 px-3.5 py-2 rounded-xl bg-[var(--color-secondary)]/95 backdrop-blur-md border border-cyan-500/50 text-xs font-mono text-cyan-400 shadow-2xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                <span className="font-bold">{hoveredNode.label}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">Click to focus</span>
              </div>
            )}

            {/* 3D Spatial Reticle & HUD Instructions */}
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[var(--color-text-secondary)] pointer-events-none select-none flex items-center gap-2 bg-[var(--color-primary)]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] shadow-md">
              <Sparkles size={12} className="text-[var(--color-accent)]" />
              <span>Click node to select • Drag to orbit • 1,400 Manifold Particles • PCA R³ Projection</span>
            </div>

            {/* Spatial Vector Coordinates Tag */}
            <div className="absolute bottom-3 right-4 hidden sm:flex items-center gap-2 text-[10px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-primary)]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] shadow-md">
              <span>Target:</span>
              <span className="text-[var(--color-accent)] font-bold">[{selectedNode.coords.map(n => n.toFixed(1)).join(', ')}]</span>
            </div>
          </>
        ) : (
          /* 2D Lean SVG Fallback for Low-End Hardware */
          <div className="w-full h-full p-6 flex flex-col justify-between relative bg-gradient-to-b from-black/40 to-transparent">
            <svg className="w-full h-full" viewBox="-4 -4 8 8">
              {/* Coordinate Grid */}
              <line x1="-4" y1="0" x2="4" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.02" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.1)" strokeWidth="0.02" />
              <circle cx="0" cy="0" r="1" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.02" />
              <circle cx="0" cy="0" r="2.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.02" />

              {/* Connecting line between selected and compared */}
              <line 
                x1={selectedNode.coords[0]} 
                y1={-selectedNode.coords[1]} 
                x2={comparedNode.coords[0]} 
                y2={-comparedNode.coords[1]} 
                stroke="#38bdf8" 
                strokeWidth="0.04" 
                strokeDasharray="0.1, 0.1" 
              />

              {/* Nodes */}
              {SEMANTIC_VECTORS.map(vec => {
                const isSel = vec.id === selectedNode.id;
                const isComp = vec.id === comparedNode.id;
                return (
                  <g key={vec.id} className="cursor-pointer" onClick={() => {
                    if (vec.id !== selectedNode.id) {
                      setComparedNode(selectedNode);
                    }
                    setSelectedNode(vec);
                    onSelectNode?.(vec);
                    playNodeChime(vec.cluster);
                  }}>
                    <line x1="0" y1="0" x2={vec.coords[0]} y2={-vec.coords[1]} stroke={vec.color} strokeWidth="0.02" opacity="0.4" />
                    <circle cx={vec.coords[0]} cy={-vec.coords[1]} r={isSel || isComp ? 0.25 : 0.16} fill={vec.color} />
                    <text x={vec.coords[0] + 0.25} y={-vec.coords[1] + 0.08} fill="#ffffff" fontSize="0.22" fontFamily="monospace">
                      {vec.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              Rendering in 2D Lean Vector Projection mode (Optimal for low-power CPUs).
            </div>
          </div>
        )}
      </div>

      {/* Bottom Concept Selector Bar */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-secondary)] backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--color-text-secondary)]">Semantic Cluster Manifolds:</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Neural
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Vector DB
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-violet-400">
              <span className="w-2 h-2 rounded-full bg-violet-400" /> Math
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Agents
            </span>
          </div>
        </div>

        {/* Quick Vector Node Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scroll-mask-x momentum-scroll-x px-2" data-testid="vector-chips-scroll">
          {SEMANTIC_VECTORS.map(node => {
            const isSelected = node.id === selectedNode.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  if (node.id !== selectedNode.id) {
                    setComparedNode(selectedNode);
                  }
                  setSelectedNode(node);
                  onSelectNode?.(node);
                  playNodeChime(node.cluster);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[var(--color-accent)] text-black font-bold border-transparent shadow-lg scale-105'
                    : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50'
                }`}
              >
                {node.label}
              </button>
            );
          })}
        </div>

        {/* Active Node Detail Card */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-between text-xs shadow-inner">
          <div>
            <span className="font-bold text-[var(--color-text-primary)] mr-2">{selectedNode.label}:</span>
            <span className="text-[var(--color-text-secondary)]">{selectedNode.details}</span>
          </div>
          <span className="font-mono text-[10px] text-[var(--color-accent)] px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]">
            [{selectedNode.coords.map(n => n.toFixed(1)).join(', ')}]
          </span>
        </div>
      </div>

    </div>
  );
}
