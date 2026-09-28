import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Terminal, CaretRight, Sparkle } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

type WelcomeScreenProps = {
  onStart: () => void;
};

// Magnetic Button Component
function MagneticButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-4 rounded-full pl-8 pr-3 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-[var(--text-primary)] transition-all duration-300 hover:shadow-[0_0_40px_var(--text-primary)]/30"
    >
      <span className="relative z-10 uppercase tracking-widest text-sm">{children}</span>
      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-primary)]/10 group-hover:bg-[var(--bg-primary)]/20 transition-colors">
        <CaretRight weight="bold" size={16} />
      </div>
    </motion.button>
  );
}

// 3D Tilt Card Component
function HolographicCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative perspective-[1200px] w-full max-w-sm mx-auto" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[4/5] rounded-[2.5rem] bg-[var(--bg-secondary)]/40 backdrop-blur-2xl border border-[var(--border-color)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-8"
      >
        {/* Holographic Glare */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%"
          }}
        />
        
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex-1 flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-color)] flex items-center justify-center mb-auto shadow-xl">
            <Terminal size={32} weight="duotone" className="text-[var(--accent)]" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--bg-primary)]/50 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Environment Ready
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Native Execution</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              No servers. No latency. Complete isolation. The browser is now your machine.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { theme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--bg-primary)] flex items-center justify-center p-6 md:p-12 text-[var(--text-primary)] font-sans relative overflow-hidden selection:bg-[var(--accent-transparent)]">
      
      {/* Background Mesh Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1, 1.1, 1],
            x: ["-10%", "5%", "15%", "-5%", "-10%"],
            y: ["10%", "-5%", "10%", "15%", "10%"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        />
        <motion.div 
          animate={{ 
            rotate: [360, 270, 180, 90, 0],
            scale: [1, 1.1, 0.9, 1.2, 1],
            x: ["10%", "-5%", "-15%", "5%", "10%"],
            y: ["-10%", "15%", "-5%", "-15%", "-10%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[60%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-10 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, var(--text-primary) 0%, transparent 70%)' }}
        />
      </div>
      
      {/* Structural Grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTUwLDE1MCwxNTAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-50" />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Typography & Intro */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left pt-12 lg:pt-0"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8">
            <Sparkle size={16} weight="fill" className="text-[var(--accent)]" />
            <span className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.3em] font-semibold">
              OpenGuide Sequence
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-7xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.9] mb-8"
          >
            Track 0:
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--bg-secondary)]">
              Absolute<br/>Zero
            </span>
          </motion.h1>

          <motion.div variants={itemVariants} className="w-24 h-1 bg-[var(--border-color)] mb-8" />

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-md mb-12"
          >
            A pure, weightless environment designed to build the foundation of AI engineering. Master the terminal, execute Python natively, and manipulate data structures.
          </motion.p>

          <motion.div variants={itemVariants}>
            <MagneticButton onClick={onStart}>
              Initiate
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right: 3D Holographic Card & UI Mock */}
        <motion.div 
          initial={{ opacity: 0, x: 100, filter: 'blur(20px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.4 }}
          className="lg:col-span-5 hidden md:flex items-center justify-center w-full relative"
        >
          {/* Ambient Glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <HolographicCard />
        </motion.div>

      </div>
    </div>
  );
}
