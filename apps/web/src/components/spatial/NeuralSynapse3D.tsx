import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Network, 
  Play, 
  Pause, 
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { detectHardwareSync } from '../../utils/hardwareDetection';
import { getAudioContext } from '../../services/soundHaptics';

interface SynapseNode {
  id: string;
  label: string;
  layer: number; // 0: Input, 1: Hidden 1, 2: Hidden 2, 3: Output
  coords: [number, number, number];
  color: string;
  activation: number;
}

interface SynapseEdge {
  from: string;
  to: string;
  weight: number;
  fromCoords: [number, number, number];
  toCoords: [number, number, number];
}

const LAYERS_CONFIG = [
  { name: 'Input Tokens (x)', count: 3, labels: ['x₁: Token Embed', 'x₂: Pos Encoding', 'x₃: Attention Mask'], color: '#06b6d4', x: -4.5 },
  { name: 'Hidden Synapse I (h¹)', count: 4, labels: ['h¹₁: Query Proj', 'h¹₂: Key Proj', 'h¹₃: Value Proj', 'h¹₄: LayerNorm'], color: '#10b981', x: -1.5 },
  { name: 'Hidden Synapse II (h²)', count: 4, labels: ['h²₁: FFN Dense', 'h²₂: GELU Activ', 'h²₃: Dropout', 'h²₄: Residual'], color: '#8b5cf6', x: 1.5 },
  { name: 'Output Logits (ŷ)', count: 2, labels: ['ŷ₁: Next Token', 'ŷ₂: End Of Text'], color: '#f59e0b', x: 4.5 }
];

export function NeuralSynapse3D({ className = '', force2D = false }: { className?: string; force2D?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { graphicsTier } = useSettingsStore();

  const [hardwareInfo] = useState(() => detectHardwareSync());
  const [isPlaying, setIsPlaying] = useState(true);
  const [pulseSpeed, setPulseSpeed] = useState(1);
  const [selectedNode, setSelectedNode] = useState<SynapseNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SynapseNode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const isPlayingRef = useRef(isPlaying);
  const pulseSpeedRef = useRef(pulseSpeed);
  const selectedNodeRef = useRef(selectedNode);
  const soundEnabledRef = useRef(soundEnabled);
  const nodeMeshesRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; data: SynapseNode }[]>([]);
  const edgeLinesRef = useRef<{ line: THREE.Line; edge: SynapseEdge }[]>([]);

  useLayoutEffect(() => {
    isPlayingRef.current = isPlaying;
    pulseSpeedRef.current = pulseSpeed;
    selectedNodeRef.current = selectedNode;
    soundEnabledRef.current = soundEnabled;
  });

  const [webGLFailed, setWebGLFailed] = useState(false);
  const use3D = !force2D && graphicsTier !== '2d-lean' && hardwareInfo.hasWebGL && !webGLFailed;

  // Build Graph Nodes & Edges
  const { nodes, edges } = (() => {
    const nList: SynapseNode[] = [];
    const eList: SynapseEdge[] = [];

    LAYERS_CONFIG.forEach((layerConf, lIdx) => {
      const totalInLayer = layerConf.count;
      for (let i = 0; i < totalInLayer; i++) {
        const y = (i - (totalInLayer - 1) / 2) * 1.55;
        const z = (Math.sin(i * 1.5) * 0.4);
        nList.push({
          id: `l${lIdx}_n${i}`,
          label: layerConf.labels[i] || `Node ${i + 1}`,
          layer: lIdx,
          coords: [layerConf.x, y, z],
          color: layerConf.color,
          activation: parseFloat((Math.sin(lIdx + i * 2) * 0.4 + 0.6).toFixed(3))
        });
      }
    });

    // Connect adjacent layers
    for (let l = 0; l < LAYERS_CONFIG.length - 1; l++) {
      const currNodes = nList.filter(n => n.layer === l);
      const nextNodes = nList.filter(n => n.layer === l + 1);

      currNodes.forEach(c => {
        nextNodes.forEach(nxt => {
          const w = (Math.sin(c.coords[1] * 2.5 + nxt.coords[1]) * 0.85).toFixed(2);
          eList.push({
            from: c.id,
            to: nxt.id,
            weight: parseFloat(w),
            fromCoords: c.coords,
            toCoords: nxt.coords
          });
        });
      });
    }

    return { nodes: nList, edges: eList };
  })();

  // Web Audio Chime on Neuron Activation
  const playSynapseChime = (layer: number) => {
    if (!soundEnabledRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [392.00, 523.25, 659.25, 880.00]; // G4, C5, E5, A5
      osc.frequency.setValueAtTime(freqs[layer] || 440, ctx.currentTime);
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_) {}
      };
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  };

  // 3D Scene Initialization
  useEffect(() => {
    if (!use3D || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11.5);

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

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Subtle Background Cosmic Dust (400 particles)
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(400 * 3);
    for (let i = 0; i < 400 * 3; i++) {
      dustPos[i] = (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.04, transparent: true, opacity: 0.3 });
    const dustField = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustField);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Nodes
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: SynapseNode }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const haloGeo = new THREE.SphereGeometry(0.38, 16, 16);

    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: isSelected ? 0.9 : 0.45,
        roughness: 0.2,
        metalness: 0.4
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.coords);
      rootGroup.add(mesh);

      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        wireframe: true,
        transparent: true,
        opacity: isSelected ? 0.6 : 0
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...node.coords);
      rootGroup.add(halo);

      nodeMeshes.push({ mesh, halo, data: node });
    });

    // Edges (Synaptic weights)
    const edgeLines: { line: THREE.Line; edge: SynapseEdge }[] = [];
    edges.forEach(edge => {
      const isConnected = selectedNode 
        ? edge.from === selectedNode.id || edge.to === selectedNode.id 
        : true;

      const baseOpacity = isConnected 
        ? (Math.abs(edge.weight) > 0.4 ? 0.45 : 0.25)
        : 0.06;

      const mat = new THREE.LineBasicMaterial({
        color: edge.weight > 0 ? 0x10b981 : 0xec4899,
        transparent: true,
        opacity: baseOpacity
      });
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...edge.fromCoords),
        new THREE.Vector3(...edge.toCoords)
      ]);
      const line = new THREE.Line(geo, mat);
      rootGroup.add(line);
      edgeLines.push({ line, edge });
    });

    nodeMeshesRef.current = nodeMeshes;
    edgeLinesRef.current = edgeLines;

    // Action Potential Signal Pulses (Traveling Particles)
    const PULSE_COUNT = 36;
    const pulseGeo = new THREE.SphereGeometry(0.07, 10, 10);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulses: { mesh: THREE.Mesh; edge: SynapseEdge; progress: number; speed: number }[] = [];

    for (let p = 0; p < PULSE_COUNT; p++) {
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      rootGroup.add(mesh);
      pulses.push({
        mesh,
        edge: randomEdge,
        progress: Math.random(),
        speed: (Math.random() * 0.009 + 0.005)
      });
    }

    // Direct Raycaster for Clicking & Hovering Neurons
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
        nodeMeshes.forEach(n => {
          if (n.data.id !== selectedNodeRef.current?.id) {
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
          setSelectedNode(hit.data);
          playSynapseChime(hit.data.layer);
        }
      } else {
        setSelectedNode(null);
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

      rootGroup.rotation.y += deltaX * 0.005;
      rootGroup.rotation.x += deltaY * 0.005;

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

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        pulses.forEach(pulse => {
          pulse.progress += pulse.speed * pulseSpeedRef.current;
          if (pulse.progress > 1) {
            pulse.progress = 0;
            pulse.edge = edges[Math.floor(Math.random() * edges.length)];
          }

          const from = new THREE.Vector3(...pulse.edge.fromCoords);
          const to = new THREE.Vector3(...pulse.edge.toCoords);
          pulse.mesh.position.lerpVectors(from, to, pulse.progress);
        });

        if (!isDragging) {
          rootGroup.rotation.y = Math.sin(Date.now() * 0.0004) * 0.18;
          dustField.rotation.y += 0.001;
        }
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
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.Points).isPoints) {
          const item = obj as THREE.Mesh;
          if (item.geometry) item.geometry.dispose();
          if (item.material) {
            if (Array.isArray(item.material)) {
              item.material.forEach((m) => m.dispose());
            } else {
              item.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      sphereGeo.dispose();
      haloGeo.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
    };
  }, [use3D, hardwareInfo.isLowEnd, webGLFailed]);

  // Reactive node selection & synapse weight highlighting without scene rebuild
  useEffect(() => {
    if (!use3D) return;
    nodeMeshesRef.current.forEach(n => {
      const isSelected = selectedNode?.id === n.data.id;
      const mat = n.mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isSelected ? 0.9 : 0.45;
      }
      const haloMat = n.halo.material as THREE.MeshBasicMaterial;
      if (haloMat) {
        haloMat.opacity = isSelected ? 0.6 : 0;
      }
      n.mesh.scale.set(isSelected ? 1.25 : 1, isSelected ? 1.25 : 1, isSelected ? 1.25 : 1);
    });

    edgeLinesRef.current.forEach(({ line, edge }) => {
      const isConnected = selectedNode 
        ? edge.from === selectedNode.id || edge.to === selectedNode.id 
        : true;
      const baseOpacity = isConnected 
        ? (Math.abs(edge.weight) > 0.4 ? 0.45 : 0.25)
        : 0.06;
      const mat = line.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.opacity = baseOpacity;
      }
    });
  }, [use3D, selectedNode]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col shadow-2xl text-[var(--color-text-primary)] transition-colors ${className}`}>
      
      {/* Header HUD */}
      <div className="px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] shadow-inner">
            <Network size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              Multi-Layer Neural Synapse Engine
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Action Potentials
              </span>
            </h4>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              {use3D ? 'Click any neuron in 3D to isolate connections & compute activation' : '2D Lean SVG Perceptron Topology'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              soundEnabled ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/40 text-[var(--color-accent)]' : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
            }`}
            title={soundEnabled ? 'Mute Synaptic Audio' : 'Enable Synaptic Audio'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              isPlaying ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
            }`}
            title={isPlaying ? 'Pause Synapse Pulse' : 'Play Synapse Pulse'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)] rounded-xl border border-[var(--color-border)] text-xs font-mono">
            <Activity size={13} className="text-emerald-400" />
            <span className="text-[var(--color-text-secondary)]">Speed:</span>
            <span className="text-[var(--color-text-primary)] font-bold">{pulseSpeed}x</span>
            <button
              onClick={() => setPulseSpeed(s => (s >= 2 ? 0.5 : s + 0.5))}
              className="ml-1 text-[10px] text-emerald-400 hover:underline cursor-pointer"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div ref={containerRef} className="relative w-full h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#040711] via-[#080d1e] to-[#040711]">
        {use3D ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: 'none' }} />
            
            {/* Real-time Hovered / Active Neuron Badge */}
            {hoveredNode && (
              <div className="absolute top-4 left-4 pointer-events-none z-20 px-3.5 py-1.5 rounded-xl bg-[var(--color-secondary)]/95 backdrop-blur-md border border-purple-500/40 text-xs font-mono text-purple-300 shadow-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                <span className="font-bold">{hoveredNode.label}</span>
                <span className="text-[var(--color-text-secondary)]">Activation: {hoveredNode.activation}</span>
              </div>
            )}

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[var(--color-text-secondary)] pointer-events-none select-none bg-[var(--color-primary)]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] flex items-center gap-2">
              <span className="text-emerald-400 font-bold">● Green = Excitatory (+)</span>
              <span className="text-pink-400 font-bold">● Pink = Inhibitory (-)</span>
              <span className="text-[var(--color-text-primary)] font-bold">● White = Forward Action Potential</span>
            </div>
          </>
        ) : (
          /* 2D Lean SVG Perceptron Model */
          <div className="w-full h-full p-6 flex flex-col justify-between relative bg-gradient-to-b from-black/40 to-transparent">
            <svg className="w-full h-full" viewBox="-5.5 -3.2 11 6.4">
              {/* Edges */}
              {edges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.fromCoords[0]}
                  y1={-edge.fromCoords[1]}
                  x2={edge.toCoords[0]}
                  y2={-edge.toCoords[1]}
                  stroke={edge.weight > 0 ? '#10b981' : '#ec4899'}
                  strokeWidth={Math.abs(edge.weight) * 0.04 + 0.015}
                  opacity={0.4}
                />
              ))}

              {/* Nodes */}
              {nodes.map(n => (
                <g key={n.id} className="cursor-pointer" onClick={() => {
                  setSelectedNode(n);
                  playSynapseChime(n.layer);
                }}>
                  <circle cx={n.coords[0]} cy={-n.coords[1]} r={0.24} fill={n.color} />
                  <text
                    x={n.coords[0]}
                    y={-n.coords[1] - 0.35}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[var(--color-text-primary)]"
                    fontSize="0.2"
                    fontFamily="monospace"
                  >
                    {n.label.split(':')[0]}
                  </text>
                </g>
              ))}
            </svg>
            <div className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              Rendering in 2D Lean Mode. Optimized for battery life and low-power hardware.
            </div>
          </div>
        )}
      </div>

      {/* Layer Inspector & Selected Node HUD Bar */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-secondary)] backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {selectedNode ? (
          <div className="flex items-center gap-3 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
            <span className="font-bold text-[var(--color-text-primary)]">{selectedNode.label}</span>
            <span className="text-[var(--color-text-secondary)] font-mono">
              Scalar Activation: <strong className="text-emerald-400">{selectedNode.activation}</strong>
            </span>
            <span className="text-[var(--color-text-secondary)] font-mono">
              Formula: σ(W · x + b)
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[11px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline cursor-pointer ml-2"
            >
              Deselect
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {LAYERS_CONFIG.map((layer, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-mono border border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)]"
              >
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: layer.color }} />
                {layer.name}
              </div>
            ))}
          </div>
        )}

        <div className="text-[11px] font-mono text-[var(--color-text-secondary)]">
          Math: <span className="text-emerald-400 font-bold">ŷ = σ(W₂ · ReLU(W₁ · x + b₁) + b₂)</span>
        </div>
      </div>

    </div>
  );
}
