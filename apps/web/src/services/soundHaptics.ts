import { useSettingsStore } from '../store/useSettingsStore';

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      try {
        sharedAudioCtx = new AudioCtx();
      } catch {
        sharedAudioCtx = null;
      }
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Pure Client-Side Sovereign Web Audio Synthesizer
 * Zero network requests, 0 byte downloads, instantaneous response.
 */
export function playTactileSound(type: 'click' | 'success' | 'error' | 'chime') {
  const { soundFx, soundVolume = 0.5 } = useSettingsStore.getState() as any;
  if (!soundFx || soundVolume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const vol = Math.max(0.01, Math.min(1, soundVolume)) * 0.12;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.03);
      gain.gain.setValueAtTime(vol * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'success') {
      // Ascending dual harmonic (C5 -> G5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(783.99, now + 0.08);
      osc2.frequency.setValueAtTime(1046.50, now + 0.08);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.onended = () => {
        try {
          osc1.disconnect();
        } catch {}
      };
      osc2.onended = () => {
        try {
          osc2.disconnect();
          gain.disconnect();
        } catch {}
      };
      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.2);
      gain.gain.setValueAtTime(vol * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'chime') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(vol * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {}
}

/**
 * Native Mobile Touch Vibration (Haptics)
 */
export function triggerHaptic(type: 'light' | 'success' | 'error' | 'boss') {
  const { hapticsEnabled = true } = useSettingsStore.getState() as any;
  if (!hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
  if ('userActivation' in navigator && (navigator as any).userActivation && !(navigator as any).userActivation.hasBeenActive) return;

  try {
    if (type === 'light') {
      navigator.vibrate(8);
    } else if (type === 'success') {
      navigator.vibrate([12, 40, 18]);
    } else if (type === 'boss') {
      navigator.vibrate([15, 30, 15, 30, 25]);
    } else if (type === 'error') {
      navigator.vibrate([30, 40, 30]);
    }
  } catch {}
}

/**
 * Cosine Similarity Audio Sonification
 * Maps angular distance (similarity -1.0 to +1.0) to consonant vs dissonant frequencies.
 * High similarity (+1.0) -> Pure Perfect Fifth (E5 659Hz + A5 880Hz).
 * Orthogonal (0.0) -> Neutral middle tone (C4 261Hz).
 * Dissonant / Opposite (-1.0) -> Tritone (F#4 370Hz).
 */
export function playCosineSonification(similarity: number) {
  const { soundFx, soundVolume = 0.5 } = useSettingsStore.getState() as any;
  if (!soundFx || soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const vol = Math.max(0.01, Math.min(1, soundVolume)) * 0.15;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Base frequency clamped between 260Hz and 880Hz
    const safeSimilarity = Number.isFinite(similarity) ? similarity : 0;
    const normalized = Math.max(-1, Math.min(1, safeSimilarity));
    const baseFreq = 440 + normalized * 220; // 220Hz to 660Hz

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * (normalized > 0.5 ? 1.5 : 1.414), now);
    osc1.connect(gain);
    osc2.connect(gain);
    osc1.onended = () => {
      try {
        osc1.disconnect();
      } catch {}
    };
    osc2.onended = () => {
      try {
        osc2.disconnect();
        gain.disconnect();
      } catch {}
    };
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch {}
}
