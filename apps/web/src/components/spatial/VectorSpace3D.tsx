import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX
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

  // Cluster 3: Math & Optimization (Violet / Purple)
  { id: 'gradient', label: 'Gradient Descent', cluster: 'math', coords: [0.5, -2.2, 1.8], color: '#8b5cf6', details: 'First-order iterative optimization algorithm' },
  { id: 'backprop', label: 'Backpropagation', cluster: 'math', coords: [0.8, -1.8, 2.3], color: '#8b5cf6', details: 'Chain-rule reverse gradient computation' },
  { id: 'loss', label: 'Cross-Entropy Loss', cluster: 'math', coords: [-0.2, -2.5, 1.4], color: '#8b5cf6', details: 'Prediction error quantification penalty' },
  { id: 'learning_rate', label: 'Learning Rate (η)', cluster: 'math', coords: [1.2, -2.8, 0.9], color: '#8b5cf6', details: 'Step size hyperparameter per iteration' },

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
    const height = container.clientHeight || 520;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 9.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !hardwareInfo.isLowEnd,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2.5, 60);
    pointLight.position.set(0, 6, 6);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 1.8, 50);
    backLight.position.set(-5, -4, -5);
    scene.add(backLight);

    // Root Group for Rotation
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // 1. Cosmic Latent Space Particle Cloud (1,200 floating manifold points)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 22;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.4
    });
    const starField = new THREE.Points(starGeo, starMat);
    galaxyGroup.add(starField);

    // 2. Holographic Coordinate Rings (Spatial Gyroscope)
    const ringGeo1 = new THREE.RingGeometry(3.4, 3.42, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    galaxyGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.2, 4.22, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    galaxyGroup.add(ring2);

    // 3. Grid Floor Plane (Spatial Coordinate Grid)
    const gridHelper = new THREE.GridHelper(12, 12, 0x10b981, 0x1f2937);
    gridHelper.position.y = -3.2;
    galaxyGroup.add(gridHelper);

    // 4. Create 3D Nodes
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: SemanticVectorNode }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const haloGeo = new THREE.SphereGeometry(0.34, 16, 16);

    SEMANTIC_VECTORS.forEach(vec => {
      const isSelected = vec.id === selectedNode.id;
      const isCompared = vec.id === comparedNode.id;

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(vec.color),
        emissive: new THREE.Color(vec.color),
        emissiveIntensity: isSelected ? 0.9 : isCompared ? 0.6 : 0.25,
        roughness: 0.25,
        metalness: 0.3
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...vec.coords);
      galaxyGroup.add(mesh);

      // Halo Wireframe Beacon for Selected node
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(vec.color),
        wireframe: true,
        transparent: true,
        opacity: isSelected ? 0.6 : 0
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...vec.coords);
      galaxyGroup.add(halo);

      nodeMeshes.push({ mesh, halo, data: vec });

      // Connecting line from center origin to vector node
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(vec.color),
        transparent: true,
        opacity: isSelected ? 0.6 : 0.2
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...vec.coords)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      galaxyGroup.add(line);
    });

    // 5. Connecting Vector Line between Selected and Compared nodes
    const pairLineMat = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.25,
      gapSize: 0.12,
      transparent: true,
      opacity: 0.85
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
          hit.mesh.scale.set(1.25, 1.25, 1.25);
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

    // 7. Mouse & Touch Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let movedDistance = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      movedDistance = 0;
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
      movedDistance += Math.abs(deltaX) + Math.abs(deltaY);

      galaxyGroup.rotation.y += deltaX * 0.007;
      galaxyGroup.rotation.x += deltaY * 0.007;

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
        galaxyGroup.rotation.y += 0.0025;
        starField.rotation.y -= 0.0005;
      }

      // Rotate selected node halo
      nodeMeshes.forEach(n => {
        if (n.data.id === selectedNode.id) {
          n.halo.rotation.y += 0.02;
          n.halo.rotation.x += 0.01;
        }
      });

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
  }, [use3D, isRotating, selectedNode, comparedNode, hardwareInfo.isLowEnd, soundEnabled]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#09090b] via-[#0d1117] to-[#09090b] border border-[var(--color-border,rgba(255,255,255,0.1))] flex flex-col shadow-2xl ${className}`}>
      
      {/* Top HUD Controls */}
      <div className="px-5 py-3.5 border-b border-[var(--color-border,rgba(255,255,255,0.08))] bg-[#09090b]/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-accent,#10b981)]/20 border border-[var(--color-accent,#10b981)]/40 flex items-center justify-center text-[var(--color-accent,#10b981)] shadow-inner">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
              Semantic Embedding Hyper-Space
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Interactive Raycaster
              </span>
            </h4>
            <span className="text-[10px] font-mono text-neutral-400">
              {use3D ? 'Click any 3D node directly to select & calculate Cosine Proximity' : '2D Lean SVG Projection'}
            </span>
          </div>
        </div>

        {/* Orbit & Cosine Readout & Audio Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-xs font-mono shadow-inner">
            <span className="text-neutral-400">Cosine Angle:</span>
            <span className={`font-bold ${cosineSim > 0.8 ? 'text-emerald-400' : cosineSim > 0.3 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {(cosineSim * 100).toFixed(1)}% ({(cosineSim).toFixed(3)})
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              soundEnabled ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-neutral-500'
            }`}
            title={soundEnabled ? 'Mute Spatial Audio Chimes' : 'Enable Spatial Audio'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {use3D && (
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                isRotating ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)]' : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
              title={isRotating ? 'Pause Rotation' : 'Resume Orbit'}
            >
              <RotateCcw size={14} className={isRotating ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="relative w-full h-[460px] flex items-center justify-center overflow-hidden">
        {use3D ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Real-time Hovered / Active Node Floating Badge */}
            {hoveredNode && (
              <div className="absolute top-4 left-4 pointer-events-none z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                <span>{hoveredNode.label}</span>
                <span className="text-[10px] text-neutral-400">Click to focus</span>
              </div>
            )}

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-neutral-400 pointer-events-none select-none flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border border-white/5">
              <Sparkles size={12} className="text-emerald-400" />
              <span>Direct Click: Focus Node • Drag: Orbit • Pinch: Zoom • 1,200 Latent Particles</span>
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
                stroke="#ffffff" 
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
            <div className="text-[10px] font-mono text-neutral-400">
              Rendering in 2D Lean Vector Projection mode (Optimal for low-power CPUs).
            </div>
          </div>
        )}
      </div>

      {/* Bottom Concept Selector Bar */}
      <div className="p-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))] bg-[#09090b]/80 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-neutral-400">Semantic Clusters:</span>
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
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
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
                    ? 'bg-[var(--color-accent,#10b981)] text-black font-bold border-transparent shadow-lg scale-105'
                    : 'border-white/5 bg-black/40 text-neutral-300 hover:text-white hover:border-white/20'
                }`}
              >
                {node.label}
              </button>
            );
          })}
        </div>

        {/* Active Node Detail Card */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs shadow-inner">
          <div>
            <span className="font-bold text-white mr-2">{selectedNode.label}:</span>
            <span className="text-neutral-300">{selectedNode.details}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
            [{selectedNode.coords.map(n => n.toFixed(1)).join(', ')}]
          </span>
        </div>
      </div>

    </div>
  );
}
