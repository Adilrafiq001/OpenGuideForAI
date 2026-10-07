import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Delete, 
  CornerDownLeft, 
  Space, 
  Copy, 
  Check, 
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSpatialStore } from '../../store/useSpatialStore';

const KEYBOARD_ROWS_LOWER = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

const KEYBOARD_ROWS_UPPER = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?']
];

export function VirtualSpatialKeyboard() {
  const { 
    isVirtualKeyboardOpen, 
    setVirtualKeyboardOpen,
    virtualKeyboardText,
    appendVirtualKeyboardChar,
    deleteVirtualKeyboardChar,
    setVirtualKeyboardText,
    keyboardPlacementMode,
    setKeyboardPlacementMode,
    keyboardTiltAngle,
    setKeyboardTiltAngle
  } = useSpatialStore();

  const [isShift, setIsShift] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  // Synthesize tactile haptic click audio via Web Audio API ($0 Rule)
  const playClickSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext autoplay restrictions safe fallback
    }
  }, [soundEnabled]);

  const handleKeyPress = (char: string) => {
    playClickSound();
    appendVirtualKeyboardChar(char);
    if (isShift) setIsShift(false);
  };

  const handleBackspace = () => {
    playClickSound();
    deleteVirtualKeyboardChar();
  };

  const handleEnter = () => {
    playClickSound();
    appendVirtualKeyboardChar('\n');
  };

  const handleSpace = () => {
    playClickSound();
    appendVirtualKeyboardChar(' ');
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(virtualKeyboardText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVirtualKeyboardOpen) return null;

  const currentRows = isShift ? KEYBOARD_ROWS_UPPER : KEYBOARD_ROWS_LOWER;
  const isFlatSurface = keyboardPlacementMode === 'flat-surface';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 30 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      data-testid="virtual-spatial-keyboard"
      style={{
        transform: isFlatSurface 
          ? `perspective(1000px) rotateX(${keyboardTiltAngle}deg)` 
          : 'none',
        transformOrigin: 'bottom center',
        transition: 'transform 0.3s ease-out'
      }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[250] w-[95vw] max-w-2xl rounded-3xl p-4 backdrop-blur-2xl text-slate-100 font-mono select-none ${
        isFlatSurface 
          ? 'bg-[#090d16]/98 border-2 border-cyan-400 shadow-[0_30px_90px_rgba(0,0,0,0.95)] shadow-cyan-950'
          : 'bg-[#090d16]/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/80'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cyan-500/20 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300">SPATIAL VIRTUAL KEYBOARD</span>
          <span className="text-[10px] text-slate-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {isFlatSurface ? 'Tabletop Desk Plane Active' : 'Mid-Air Floating Mode'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Surface Placement Mode Switch */}
          <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px]">
            <button
              type="button"
              data-testid="keyboard-midair-btn"
              onClick={() => setKeyboardPlacementMode('mid-air')}
              className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                !isFlatSurface ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mid-Air
            </button>
            <button
              type="button"
              data-testid="keyboard-flat-surface-btn"
              onClick={() => setKeyboardPlacementMode('flat-surface')}
              className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                isFlatSurface ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Desk Snap
            </button>
          </div>

          {/* Desk Tilt Angle Slider (Visible in flat-surface mode) */}
          {isFlatSurface && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px]">
              <span className="text-slate-400">Tilt:</span>
              <input
                type="range"
                min="30"
                max="75"
                step="5"
                value={keyboardTiltAngle}
                onChange={(e) => setKeyboardTiltAngle(Number(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
                title="Adjust desk tilt angle to match physical tabletop"
              />
              <span className="text-cyan-300 font-bold">{keyboardTiltAngle}°</span>
            </div>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute click audio' : 'Enable click audio'}
            aria-label="Toggle keyboard sound"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          <button
            onClick={() => setVirtualKeyboardOpen(false)}
            data-testid="close-spatial-keyboard-btn"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Virtual Keyboard"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Live Text Buffer Preview */}
      <div className="flex items-center gap-2 p-2.5 mb-3 bg-black/60 rounded-xl border border-cyan-500/20 text-xs">
        <div className="flex-1 truncate font-mono text-cyan-100 min-h-[1.25rem]">
          {virtualKeyboardText || <span className="text-slate-500 italic">Type with virtual laser pointer or gaze...</span>}
        </div>

        {virtualKeyboardText && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
            <button
              onClick={() => setVirtualKeyboardText('')}
              className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold cursor-pointer transition-colors"
            >
              CLEAR
            </button>
          </div>
        )}
      </div>

      {/* Virtual Key Grid */}
      <div className="space-y-1.5">
        {currentRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {rIdx === 3 && (
              <button
                type="button"
                onClick={() => setIsShift(!isShift)}
                className={`px-3 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isShift
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-md'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-500'
                }`}
                aria-label="Shift key"
              >
                <ArrowUp size={13} />
              </button>
            )}

            {row.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleKeyPress(char)}
                className="flex-1 min-w-[28px] sm:min-w-[38px] max-w-[48px] py-2 sm:py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 active:bg-cyan-400 active:text-black border border-slate-700/80 hover:border-cyan-400/60 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
              >
                {char}
              </button>
            ))}

            {rIdx === 3 && (
              <button
                type="button"
                onClick={handleBackspace}
                className="px-3 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 active:bg-rose-500 active:text-white border border-slate-700 hover:border-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-rose-300"
                aria-label="Backspace key"
              >
                <Delete size={14} />
              </button>
            )}
          </div>
        ))}

        {/* Bottom Control Row */}
        <div className="flex justify-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleKeyPress('/')}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs hover:border-cyan-400 cursor-pointer text-slate-300"
          >
            /
          </button>
          <button
            type="button"
            onClick={handleSpace}
            className="flex-1 max-w-sm py-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] text-slate-300"
            aria-label="Spacebar"
          >
            <Space size={14} />
            <span className="text-[10px] tracking-widest text-slate-400">SPACE</span>
          </button>
          <button
            type="button"
            onClick={handleEnter}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            aria-label="Enter key"
          >
            <CornerDownLeft size={13} />
            <span>ENTER</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
