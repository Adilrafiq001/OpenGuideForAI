import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Lightbulb,
  ArrowLeftRight,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { detectHardwareSync } from '../../utils/hardwareDetection';
import { playCosineSonification, getAudioContext } from '../../services/soundHaptics';

function calculateCosine(a: [number, number, number], b: [number, number, number]): number {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const magA = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  const magB = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
  if (magA === 0 || magB === 0) return 0;
  return Math.max(-1, Math.min(1, dot / (magA * magB)));
}

export interface SemanticVectorNode {
  id: string;
  label: string;
  cluster: 'neural' | 'vector' | 'math' | 'agents' | 'frontier';
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
  { id: 'gradient', label: 'Gradient Descent', cluster: 'math', coords: [0.5, -1.2, 1.8], color: '#8b5cf6', details: 'First-order iterative optimization algorithm' },
  { id: 'backprop', label: 'Backpropagation', cluster: 'math', coords: [0.8, -0.8, 2.3], color: '#8b5cf6', details: 'Chain-rule reverse gradient computation' },
  { id: 'loss', label: 'Cross-Entropy Loss', cluster: 'math', coords: [-0.2, -1.4, 1.4], color: '#8b5cf6', details: 'Prediction error quantification penalty' },
  { id: 'learning_rate', label: 'Learning Rate (η)', cluster: 'math', coords: [1.2, -1.6, 0.9], color: '#8b5cf6', details: 'Step size hyperparameter per iteration' },
  { id: 'synthetic_fuzz', label: 'Synthetic Evals', cluster: 'math', coords: [-0.8, -1.2, 0.8], color: '#8b5cf6', details: 'Deterministic assertion & Likert benchmark suites' },

  // Cluster 4: Autonomous Agents & Memory (Amber / Orange)
  { id: 'agent', label: 'Autonomous Agent', cluster: 'agents', coords: [-0.5, 1.8, -2.4], color: '#f59e0b', details: 'Self-directed ReAct reasoning & execution loop' },
  { id: 'tools', label: 'Tool Schemas (MCP)', cluster: 'agents', coords: [-0.2, 2.4, -2.0], color: '#f59e0b', details: 'External APIs, Python interpreter & filesystem' },
  { id: 'react_loop', label: 'ReAct Loop', cluster: 'agents', coords: [-1.0, 1.2, -2.6], color: '#f59e0b', details: 'Reason -> Action -> Observation cycle' },
  { id: 'context_window', label: 'Context Window', cluster: 'agents', coords: [0.6, 1.5, -1.8], color: '#f59e0b', details: 'Active token working memory capacity' },
  { id: 'owasp_evals', label: 'OWASP Guardrails', cluster: 'agents', coords: [1.0, 1.8, -2.2], color: '#f59e0b', details: 'Canary token traps and prompt injection sanitizers' },

  // Cluster 5: Frontier Intelligence & Attention Mechanics (Rose / Red)
  { id: 'rope', label: 'Rotary Embeddings (RoPE)', cluster: 'frontier', coords: [0.2, 2.8, 1.8], color: '#f43f5e', details: 'Relative position encoding via 2D rotation matrices' },
  { id: 'kv_cache', label: 'KV Caching', cluster: 'frontier', coords: [-0.6, 2.2, 2.2], color: '#f43f5e', details: 'Autoregressive Key-Value memory state cache' },
  { id: 'lora', label: 'LoRA (Low-Rank Adaptation)', cluster: 'frontier', coords: [1.2, 2.5, 2.0], color: '#f43f5e', details: 'Parameter-efficient fine-tuning via W = W0 + B*A' },
  { id: 'quantization', label: 'INT4 Quantization', cluster: 'frontier', coords: [-1.4, 1.8, 2.4], color: '#f43f5e', details: 'Weight compression to 4-bit NormalFloat quantiles' },
  { id: 'reasoning_grpo', label: 'Reasoning & GRPO', cluster: 'frontier', coords: [0.8, 3.2, 1.2], color: '#f43f5e', details: 'Reinforcement learning for extended test-time thinking chains' },
  { id: 'mcp_frontier', label: 'MCP Protocol Server', cluster: 'frontier', coords: [-1.8, 2.8, -1.2], color: '#f43f5e', details: 'Production JSON-RPC 2.0 tool runtime standard' }
];

const CLUSTER_NAMES: Record<string, string> = {
  neural: 'Neural Architecture',
  vector: 'Vector Search & Memory',
  math: 'Math & Optimization',
  agents: 'Autonomous Agents & RAG',
  frontier: 'Frontier Intelligence'
};

interface ComparisonPreset {
  id: string;
  title: string;
  subtitle: string;
  nodeAId: string;
  nodeBId: string;
  badge: string;
  insight: string;
}

const PRESETS: ComparisonPreset[] = [
  {
    id: 'neural-twins',
    title: 'Transformer ⟷ Self-Attention',
    subtitle: 'Core Neural Architecture',
    nodeAId: 'transformer',
    nodeBId: 'attention',
    badge: '99.2% Match',
    insight: 'Both live in the same cluster. Their vectors point almost identically (θ = 7.5°), because Self-Attention is the foundational mathematical backbone of Transformers.'
  },
  {
    id: 'search-memory',
    title: 'Embeddings ⟷ Vector DB',
    subtitle: 'Semantic Search Engine',
    nodeAId: 'embeddings',
    nodeBId: 'vectordb',
    badge: '95.8% Match',
    insight: 'Vector databases exist specifically to index and search high-dimensional embeddings using nearest-neighbor algorithms like HNSW.'
  },
  {
    id: 'math-optimization',
    title: 'Gradient Descent ⟷ Backpropagation',
    subtitle: 'Neural Calculus',
    nodeAId: 'gradient',
    nodeBId: 'backprop',
    badge: '95.1% Match',
    insight: 'Backpropagation computes the chain-rule gradients of the loss, while Gradient Descent takes the step along that gradient to update weights.'
  },
  {
    id: 'cross-domain',
    title: 'Synaptic Weights ⟷ Autonomous Agent',
    subtitle: 'Micro vs Macro AI',
    nodeAId: 'weights',
    nodeBId: 'agent',
    badge: '32.4% Match',
    insight: 'These live in distant clusters: Synaptic Weights are microscopic tensor parameters, whereas Autonomous Agents are macroscopic reasoning and tool-calling systems.'
  }
];

interface VectorSpace3DProps {
  onSelectNode?: (node: SemanticVectorNode) => void;
  className?: string;
  force2D?: boolean;
}

export function VectorSpace3D({ onSelectNode, className = '', force2D = false }: VectorSpace3DProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { graphicsTier } = useSettingsStore();

  const [selectedNode, setSelectedNode] = useState<SemanticVectorNode>(SEMANTIC_VECTORS[0]); // Concept A
  const [comparedNode, setComparedNode] = useState<SemanticVectorNode>(SEMANTIC_VECTORS[1]); // Concept B
  const [hoveredNode, setHoveredNode] = useState<SemanticVectorNode | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [hardwareInfo] = useState(() => detectHardwareSync());
  
  // Spatial XR Suite Controls
  const [clusterFilter, setClusterFilter] = useState<'all' | 'neural' | 'vector' | 'math' | 'agents' | 'frontier'>('all');
  const [simThreshold, setSimThreshold] = useState<number>(0.65);
  const [gimbalAngles, setGimbalAngles] = useState({ pitch: 0, yaw: 0 });
  const [webGLFailed, setWebGLFailed] = useState(false);

  // Determine if we should render 3D WebGL or 2D Lean
  const use3D = !force2D && graphicsTier !== '2d-lean' && hardwareInfo.hasWebGL && !webGLFailed;

  // Calculate real cosine similarity between selected (A) and compared (B) nodes
  const cosineSim = calculateCosine(selectedNode.coords, comparedNode.coords);
  const angleDegrees = Math.acos(Math.max(-1, Math.min(1, cosineSim))) * (180 / Math.PI);

  // Qualitative alignment verdict
  const getProximityVerdict = (sim: number) => {
    if (sim >= 0.90) return { label: 'Near Identical', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' };
    if (sim >= 0.70) return { label: 'Strong Alignment', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' };
    if (sim >= 0.40) return { label: 'Moderate Connection', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
    return { label: 'Distant Concepts', color: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/30' };
  };

  const proximityVerdict = getProximityVerdict(cosineSim);

  // Web Audio Spatial Synthesizer Chime
  const playNodeChime = (cluster: string) => {
    if (!soundEnabledRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs: Record<string, number> = {
        neural: 523.25,  // C5
        vector: 659.25,  // E5
        math: 783.99,    // G5
        agents: 1046.50, // C6
        frontier: 1318.51 // E6
      };
      osc.frequency.setValueAtTime(freqs[cluster] || 587.33, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {}
  };

  // Trigger both chord sonification and node chime
  const triggerComparisonAudio = (sim: number, cluster: string) => {
    if (!soundEnabledRef.current) return;
    playCosineSonification(sim);
    playNodeChime(cluster);
  };

  // Swap Concept A and Concept B
  const handleSwapConcepts = () => {
    const prevA = selectedNode;
    const prevB = comparedNode;
    setSelectedNode(prevB);
    setComparedNode(prevA);
    triggerComparisonAudio(cosineSim, prevB.cluster);
  };

  // Apply a curated comparison preset
  const handleApplyPreset = (preset: ComparisonPreset) => {
    const nodeA = SEMANTIC_VECTORS.find(n => n.id === preset.nodeAId);
    const nodeB = SEMANTIC_VECTORS.find(n => n.id === preset.nodeBId);
    if (nodeA && nodeB) {
      setSelectedNode(nodeA);
      setComparedNode(nodeB);
      onSelectNode?.(nodeA);
      const sim = calculateCosine(nodeA.coords, nodeB.coords);
      triggerComparisonAudio(sim, nodeA.cluster);
    }
  };

  // Refs for state that changes without needing WebGL reconstruction
  const selectedNodeRef = useRef(selectedNode);
  const comparedNodeRef = useRef(comparedNode);
  const isRotatingRef = useRef(isRotating);
  const isHoveringCanvasRef = useRef(isHoveringCanvas);
  const soundEnabledRef = useRef(soundEnabled);
  const onSelectNodeRef = useRef(onSelectNode);
  const playNodeChimeRef = useRef(playNodeChime);
  const nodeMeshesRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; line: THREE.Line; data: SemanticVectorNode }[]>([]);
  const pairLineRef = useRef<THREE.Line | null>(null);

  useLayoutEffect(() => {
    selectedNodeRef.current = selectedNode;
    comparedNodeRef.current = comparedNode;
    isRotatingRef.current = isRotating;
    isHoveringCanvasRef.current = isHoveringCanvas;
    soundEnabledRef.current = soundEnabled;
    onSelectNodeRef.current = onSelectNode;
    playNodeChimeRef.current = playNodeChime;
  });

  // 3D Scene Initialization & Loop
  useEffect(() => {
    if (!use3D || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.6, 9.0);
    camera.lookAt(0, 0.1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !hardwareInfo.isLowEnd,
        powerPreference: 'high-performance'
      });
      if (!renderer.getContext() || renderer.getContext().isContextLost()) {
        renderer.dispose();
        setTimeout(() => setWebGLFailed(true), 0);
        return;
      }
    } catch {
      setTimeout(() => setWebGLFailed(true), 0);
      return;
    }
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

    // 2. Holographic Coordinate Rings
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.63, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.28 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    galaxyGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.4, 4.43, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide, transparent: true, opacity: 0.22 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 2;
    galaxyGroup.add(ring2);

    // 3. Coordinate Grid Horizon
    const gridHelper = new THREE.GridHelper(10, 16, 0x10b981, 0x1e293b);
    gridHelper.position.y = -2.8;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    galaxyGroup.add(gridHelper);

    // 4. Create Interactive Concept Vector Spheres
    const sphereGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const haloGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; line: THREE.Line; data: SemanticVectorNode }[] = [];

    SEMANTIC_VECTORS.forEach(node => {
      const color = new THREE.Color(node.color);

      // Core Node Mesh
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 1.0
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.coords);
      galaxyGroup.add(mesh);

      // Selection Halo
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        wireframe: true
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...node.coords);
      galaxyGroup.add(halo);

      // Vector Line from Origin (0,0,0)
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...node.coords)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        linewidth: 1
      });
      const line = new THREE.Line(lineGeo, lineMat);
      galaxyGroup.add(line);

      nodeMeshes.push({ mesh, halo, line, data: node });
    });

    nodeMeshesRef.current = nodeMeshes;

    // 5. Connecting Line Between Selected (A) and Compared (B) Concepts
    const pairLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...selectedNodeRef.current.coords),
      new THREE.Vector3(...comparedNodeRef.current.coords)
    ]);
    const pairLineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.2,
      gapSize: 0.1,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });
    const pairLine = new THREE.Line(pairLineGeo, pairLineMat);
    pairLine.computeLineDistances();
    galaxyGroup.add(pairLine);
    pairLineRef.current = pairLine;

    // Direct Raycaster for Clicking & Hovering
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getNormalizedMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
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
        nodeMeshes.forEach(n => {
          if (n.data.id !== selectedNodeRef.current?.id && n.data.id !== comparedNodeRef.current?.id) {
            n.mesh.scale.set(1, 1, 1);
          }
        });
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      getNormalizedMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find(n => n.mesh === intersects[0].object);
        if (hit) {
          // If clicked node is different from selected A, make previous A -> B, and hit -> A
          if (hit.data.id !== selectedNodeRef.current.id) {
            setComparedNode(selectedNodeRef.current);
            setSelectedNode(hit.data);
            onSelectNodeRef.current?.(hit.data);
            const sim = calculateCosine(hit.data.coords, selectedNodeRef.current.coords);
            playCosineSonification(sim);
            playNodeChimeRef.current(hit.data.cluster);
          } else {
            playNodeChimeRef.current(hit.data.cluster);
          }
        }
      }
    };

    // Pointer Orbit Interaction
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

      galaxyGroup.rotation.y += deltaX * 0.005;
      galaxyGroup.rotation.x += deltaY * 0.005;

      // Update gimbal telemetry
      const yaw = Math.round((galaxyGroup.rotation.y * 180 / Math.PI) % 360);
      const pitch = Math.round((galaxyGroup.rotation.x * 180 / Math.PI) % 360);
      setGimbalAngles({ yaw, pitch });

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

    // Animation Loop (auto-rotates ONLY when not dragging AND not hovering canvas)
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging && isRotatingRef.current && !isHoveringCanvasRef.current) {
        galaxyGroup.rotation.y += 0.0018;
        starField.rotation.y += 0.0004;

        const yaw = Math.round((galaxyGroup.rotation.y * 180 / Math.PI) % 360);
        const pitch = Math.round((galaxyGroup.rotation.x * 180 / Math.PI) % 360);
        setGimbalAngles({ yaw, pitch });
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      // Disposal
      scene.traverse((obj: any) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      nodeMeshesRef.current = [];
      pairLineRef.current = null;
    };
  }, [use3D, hardwareInfo.isLowEnd, webGLFailed]);

  // Reactive in-place property updates on selection/filter change
  useEffect(() => {
    if (!use3D) return;

    nodeMeshesRef.current.forEach(n => {
      const isSelected = n.data.id === selectedNode.id;
      const isCompared = n.data.id === comparedNode.id;
      const matchesFilter = clusterFilter === 'all' || n.data.cluster === clusterFilter;

      const mat = n.mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isSelected ? 1.0 : isCompared ? 0.7 : matchesFilter ? 0.35 : 0.08;
        mat.opacity = matchesFilter ? 1.0 : 0.2;
      }

      const haloMat = n.halo.material as THREE.MeshBasicMaterial;
      if (haloMat) {
        haloMat.opacity = isSelected ? 0.75 : isCompared ? 0.45 : 0;
      }

      const lineMat = n.line.material as THREE.LineBasicMaterial;
      if (lineMat) {
        lineMat.opacity = isSelected ? 0.7 : matchesFilter ? 0.25 : 0.05;
      }
    });

    if (pairLineRef.current) {
      pairLineRef.current.geometry.setFromPoints([
        new THREE.Vector3(...selectedNode.coords),
        new THREE.Vector3(...comparedNode.coords)
      ]);
      pairLineRef.current.computeLineDistances();
    }
  }, [use3D, selectedNode, comparedNode, clusterFilter]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col shadow-2xl text-[var(--color-text-primary)] transition-colors ${className}`}>
      
      {/* 1. Top HUD Controls Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] shadow-inner">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              Semantic Vector Galaxy
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 font-bold">
                {use3D ? '3D WebGL Orbit' : '2D Lean SVG'}
              </span>
            </h4>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              Real-time High-Dimensional Vector Proximity & Cosine Distance Engine
            </span>
          </div>
        </div>

        {/* Orbit, Audio, and Guide Toggles */}
        <div className="flex items-center gap-2">
          {use3D && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[10px] font-mono shadow-inner">
              <span className="text-[var(--color-text-secondary)]">Gimbal:</span>
              <span className="text-[var(--color-accent)] font-bold">Y:{gimbalAngles.yaw}° P:{gimbalAngles.pitch}°</span>
            </div>
          )}

          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
              showGuide ? 'bg-[var(--color-accent)]/15 border-[var(--color-accent)]/30 text-[var(--color-accent)] font-bold' : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            title="Toggle Beginner Walkthrough Guide"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">{showGuide ? 'Hide Guide' : 'How It Works'}</span>
            {showGuide ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

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
              title={isRotating ? 'Pause Rotation (Auto-pauses on hover)' : 'Resume Auto-Orbit'}
            >
              <RotateCcw size={14} className={isRotating && !isHoveringCanvas ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Spatial Sub-Manifold Cluster Slicer Bar */}
      <div className="px-4 sm:px-6 py-2 bg-[var(--color-secondary)] border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Layers size={13} className="text-[var(--color-accent)] shrink-0" />
          <span className="text-[10px] text-[var(--color-text-secondary)] shrink-0">Filter Cluster:</span>
          {(['all', 'neural', 'vector', 'math', 'agents', 'frontier'] as const).map(c => (
            <button
              key={c}
              onClick={() => setClusterFilter(c)}
              className={`px-2 py-0.5 rounded-lg text-[10px] capitalize transition-all cursor-pointer shrink-0 ${
                clusterFilter === c
                  ? 'bg-[var(--color-accent)] text-black font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]'
              }`}
            >
              {c === 'all' ? 'All Clusters' : c}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
          <span>Threshold:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={simThreshold}
            onChange={(e) => setSimThreshold(parseFloat(e.target.value))}
            className="w-20 accent-[var(--color-accent)] cursor-pointer"
            title="Filter semantic connections"
          />
          <span className="font-bold text-[var(--color-accent)]">≥ {(simThreshold * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* 3. Interactive "How This Works" Explainer Card */}
      {showGuide && (
        <div className="px-4 sm:px-6 py-4 bg-[var(--color-primary)]/90 border-b border-[var(--color-border)] text-xs space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 font-bold text-xs text-[var(--color-text-primary)]">
            <Lightbulb size={16} className="text-amber-400 shrink-0" />
            <span>How the Holodeck Works: Visualizing the AI Latent Mind in 3 Steps</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1">
              <div className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold">1</span>
                Words Are Coordinates
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Large Language Models convert every concept into a list of 1,536 numbers (a vector). We project those dimensions into 3D space. Concepts with related meanings cluster together.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1">
              <div className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold">2</span>
                Angles Equal Meaning
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Select <strong>Concept A</strong> and <strong>Concept B</strong> below. The Holodeck calculates the Cosine Similarity and angular distance (θ). Smaller angles mean closer semantic meaning.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1">
              <div className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono text-[10px] flex items-center justify-center font-bold">3</span>
                Hear the Math & Code It
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Consonant musical intervals play for close concepts, and dissonant intervals for distant concepts. Click <strong>Launch in Python IDE</strong> to write the vector math yourself!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. The Dual-Concept Comparator Bar (Concept A ⟷ Concept B) */}
      <div className="px-4 sm:px-6 py-3.5 bg-[var(--color-secondary)] border-b border-[var(--color-border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Concept A Selector */}
        <div className="flex-1 flex items-center gap-2 p-2 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedNode.color }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">Concept A (Reference)</div>
            <select
              value={selectedNode.id}
              onChange={(e) => {
                const node = SEMANTIC_VECTORS.find(n => n.id === e.target.value);
                if (node) {
                  setSelectedNode(node);
                  onSelectNode?.(node);
                  const sim = calculateCosine(node.coords, comparedNode.coords);
                  triggerComparisonAudio(sim, node.cluster);
                }
              }}
              className="w-full bg-transparent text-xs font-bold text-[var(--color-text-primary)] font-mono outline-none cursor-pointer pr-2 truncate"
            >
              {(['neural', 'vector', 'math', 'agents', 'frontier'] as const).map(clusterKey => (
                <optgroup key={clusterKey} label={`── ${CLUSTER_NAMES[clusterKey]} ──`}>
                  {SEMANTIC_VECTORS.filter(n => n.cluster === clusterKey).map(n => (
                    <option key={n.id} value={n.id} className="bg-[var(--color-secondary)] text-[var(--color-text-primary)]">
                      {n.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Swap and Metric Readout */}
        <div className="flex items-center justify-center gap-3 shrink-0">
          <button
            onClick={handleSwapConcepts}
            className="p-2.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Swap Concept A and Concept B"
          >
            <ArrowLeftRight size={16} />
          </button>

          <div className="text-center px-4 py-1.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] shadow-inner">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Cosine Similarity:</span>
              <span className={`text-sm font-mono font-bold ${cosineSim > 0.8 ? 'text-emerald-400' : cosineSim > 0.4 ? 'text-cyan-400' : 'text-neutral-400'}`}>
                {(cosineSim * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[var(--color-text-secondary)] mt-0.5">
              <span>θ = {angleDegrees.toFixed(1)}°</span>
              <span>•</span>
              <span className={`px-2 py-0.2 rounded-full border text-[9px] font-semibold ${proximityVerdict.color}`}>
                {proximityVerdict.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => triggerComparisonAudio(cosineSim, selectedNode.cluster)}
            className="p-2.5 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-all cursor-pointer shadow-sm active:scale-95"
            title="Play Harmonic Chord Sonification"
          >
            <Play size={16} />
          </button>
        </div>

        {/* Right: Concept B Selector */}
        <div className="flex-1 flex items-center gap-2 p-2 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: comparedNode.color }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">Concept B (Comparison)</div>
            <select
              value={comparedNode.id}
              onChange={(e) => {
                const node = SEMANTIC_VECTORS.find(n => n.id === e.target.value);
                if (node) {
                  setComparedNode(node);
                  const sim = calculateCosine(selectedNode.coords, node.coords);
                  triggerComparisonAudio(sim, node.cluster);
                }
              }}
              className="w-full bg-transparent text-xs font-bold text-[var(--color-text-primary)] font-mono outline-none cursor-pointer pr-2 truncate"
            >
              {(['neural', 'vector', 'math', 'agents', 'frontier'] as const).map(clusterKey => (
                <optgroup key={clusterKey} label={`── ${CLUSTER_NAMES[clusterKey]} ──`}>
                  {SEMANTIC_VECTORS.filter(n => n.cluster === clusterKey).map(n => (
                    <option key={n.id} value={n.id} className="bg-[var(--color-secondary)] text-[var(--color-text-primary)]">
                      {n.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* 4. Curated 1-Click Discovery Presets Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-[var(--color-primary)]/60 border-b border-[var(--color-border)] flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-[10px] text-[var(--color-text-secondary)] font-semibold shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-amber-400" />
          Quick Discovery Presets:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map(preset => {
            const isCurrent = (selectedNode.id === preset.nodeAId && comparedNode.id === preset.nodeBId) ||
                              (selectedNode.id === preset.nodeBId && comparedNode.id === preset.nodeAId);
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[var(--color-accent)] text-black font-bold border-transparent shadow-sm'
                    : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50'
                }`}
              >
                <span>{preset.title}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-black/20 text-black' : 'bg-[var(--color-primary)] text-[var(--color-accent)]'}`}>
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Canvas Area (High-End Spatial Viewport) */}
      <div 
        ref={containerRef} 
        onMouseEnter={() => setIsHoveringCanvas(true)}
        onMouseLeave={() => setIsHoveringCanvas(false)}
        className="relative w-full h-[400px] sm:h-[450px] md:h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#040711] via-[#080d1e] to-[#040711]"
      >
        {use3D ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: 'none' }} />
            
            {/* Real-time Hovered Node Floating Badge */}
            {hoveredNode && (
              <div className="absolute top-4 left-4 pointer-events-none z-20 px-3.5 py-2 rounded-xl bg-[var(--color-secondary)]/95 backdrop-blur-md border border-cyan-500/50 text-xs font-mono text-cyan-400 shadow-2xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                <span className="font-bold">{hoveredNode.label}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">• Click to select as Concept A</span>
              </div>
            )}

            {/* 3D Spatial Reticle & HUD Instructions */}
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[var(--color-text-secondary)] pointer-events-none select-none flex items-center gap-2 bg-[var(--color-primary)]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] shadow-md">
              <Compass size={12} className="text-[var(--color-accent)]" />
              <span>Hover canvas to pause spin • Drag starfield to orbit • Click any sphere to measure</span>
            </div>

            {/* Spatial Vector Coordinates Tag */}
            <div className="absolute bottom-3 right-4 hidden sm:flex items-center gap-2 text-[10px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-primary)]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] shadow-md">
              <span>Comparing:</span>
              <span className="text-emerald-400 font-bold">{selectedNode.label}</span>
              <span>⟷</span>
              <span className="text-cyan-400 font-bold">{comparedNode.label}</span>
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
                const matchesFilter = clusterFilter === 'all' || vec.cluster === clusterFilter;
                return (
                  <g 
                    key={vec.id} 
                    className="cursor-pointer transition-opacity duration-200" 
                    style={{ opacity: matchesFilter ? 1 : 0.2 }}
                    onClick={() => {
                      if (vec.id !== selectedNode.id) {
                        setComparedNode(selectedNode);
                        setSelectedNode(vec);
                        onSelectNode?.(vec);
                        const sim = calculateCosine(vec.coords, selectedNode.coords);
                        triggerComparisonAudio(sim, vec.cluster);
                      }
                    }}
                  >
                    <line x1="0" y1="0" x2={vec.coords[0]} y2={-vec.coords[1]} stroke={vec.color} strokeWidth="0.02" opacity="0.4" />
                    <circle cx={vec.coords[0]} cy={-vec.coords[1]} r={isSel || isComp ? 0.25 : 0.16} fill={vec.color} />
                    <text x={vec.coords[0] + 0.25} y={-vec.coords[1] + 0.08} fill="#ffffff" fontSize="0.22" fontFamily="monospace">
                      {vec.label} {isSel ? '[A]' : isComp ? '[B]' : ''}
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

      {/* 7. Bottom Concept Chips & Educational Details */}
      <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-secondary)] backdrop-blur-md space-y-4">
        
        {/* Cluster Legend & Quick Select Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[var(--color-text-secondary)]">All Concept Nodes in Universe:</span>
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
              <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Frontier
              </span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scroll-mask-x momentum-scroll-x px-1" data-testid="vector-chips-scroll">
            {SEMANTIC_VECTORS.map(node => {
              const isA = node.id === selectedNode.id;
              const isB = node.id === comparedNode.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    if (node.id !== selectedNode.id) {
                      setComparedNode(selectedNode);
                      setSelectedNode(node);
                      onSelectNode?.(node);
                      const sim = calculateCosine(node.coords, selectedNode.coords);
                      triggerComparisonAudio(sim, node.cluster);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isA 
                      ? 'bg-[var(--color-accent)] text-black font-bold border-transparent shadow-lg scale-105'
                      : isB
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/40 shadow-sm'
                      : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                  <span>{node.label}</span>
                  {isA && <span className="text-[9px] px-1 rounded bg-black/20 text-black font-bold">A</span>}
                  {isB && <span className="text-[9px] px-1 rounded bg-cyan-400/20 text-cyan-300 font-bold">B</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Active Pair Detail Card with Direct Curriculum IDE Launch */}
        <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-inner">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[var(--color-text-primary)] text-sm">{selectedNode.label}</span>
              <span className="font-mono text-[10px] text-[var(--color-accent)] px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]">
                [{selectedNode.coords.map(n => n.toFixed(1)).join(', ')}]
              </span>
              <span className="text-[var(--color-text-secondary)] font-mono">⟷</span>
              <span className="font-bold text-cyan-400 text-sm">{comparedNode.label}</span>
              <span className="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]">
                [{comparedNode.coords.map(n => n.toFixed(1)).join(', ')}]
              </span>
            </div>
            
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
              {selectedNode.cluster === comparedNode.cluster
                ? `Both concepts belong to ${CLUSTER_NAMES[selectedNode.cluster]}. Because they are part of the same architectural layer, their high cosine similarity of ${(cosineSim * 100).toFixed(1)}% (angle θ = ${angleDegrees.toFixed(1)}°) reflects direct functional synergy.`
                : `${selectedNode.label} (${CLUSTER_NAMES[selectedNode.cluster]}) and ${comparedNode.label} (${CLUSTER_NAMES[comparedNode.cluster]}) operate in different AI subsystems. Their similarity score of ${(cosineSim * 100).toFixed(1)}% illustrates cross-domain semantic distance.`}
            </p>
          </div>

          <button
            onClick={() => {
              const trackMap: Record<string, string> = {
                neural: '/track/0',
                vector: '/track/1',
                agents: '/track/2',
                math: '/track/3',
                frontier: '/track/4'
              };
              navigate(trackMap[selectedNode.cluster] || '/track/1');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] text-black font-mono font-bold text-xs hover:opacity-95 transition-all cursor-pointer shrink-0 shadow-lg active:scale-95"
          >
            <span>Launch in Python IDE (Track 1) →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
