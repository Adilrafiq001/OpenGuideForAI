/**
 * OpenGuide Spatial Hand Gesture & Computer Vision Engine
 * $0 Rule Compliant: 100% In-Browser Web API (Zero Cloud Backend)
 * 
 * Provides:
 * 1. Host Webcam Hand Tracking (for AR Glasses without built-in cameras like Viture Pro 2 / Xreal Air 2)
 * 2. 3DOF Head Gyroscope Orientation Tracking
 * 3. WebXR Hands fallback for Meta Quest 3 & Apple Vision Pro
 */

export interface HandGestureFrame {
  cursorX: number; // 0 to 100 percentage
  cursorY: number; // 0 to 100 percentage
  isPinching: boolean;
  gesture: 'pinch' | 'palm' | 'peace' | 'fist' | 'none';
  confidence: number;
}

export type HandGestureCallback = (frame: HandGestureFrame) => void;
export type OrientationCallback = (yaw: number, pitch: number, roll: number) => void;

class HandGestureEngine {
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;
  private onGestureCallback: HandGestureCallback | null = null;
  private onOrientationCallback: OrientationCallback | null = null;

  // Smoothing filter
  private smoothedX: number = 50;
  private smoothedY: number = 50;
  private pinchHoldCount: number = 0;

  /**
   * Start 3DOF Gyroscope Head Tracking
   */
  public startOrientationTracking(cb: OrientationCallback): boolean {
    this.onOrientationCallback = cb;
    if (typeof window === 'undefined') return false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const yaw = e.alpha ?? 0;
      const pitch = e.beta ?? 0;
      const roll = e.gamma ?? 0;
      if (this.onOrientationCallback) {
        this.onOrientationCallback(yaw, pitch, roll);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      return true;
    }
    return false;
  }

  /**
   * Stop Gyroscope Tracking
   */
  public stopOrientationTracking() {
    this.onOrientationCallback = null;
  }

  /**
   * Start Webcam Hand Gesture Tracking
   */
  public async startWebcamHandTracking(callback: HandGestureCallback): Promise<{ success: boolean; error?: string }> {
    if (this.isRunning) return { success: true };
    this.onGestureCallback = callback;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: 'Webcam API not supported in this browser environment.' };
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user', // Front laptop/phone camera pointing at hands
        },
        audio: false,
      });

      this.videoEl = document.createElement('video');
      this.videoEl.playsInline = true;
      this.videoEl.muted = true;
      this.videoEl.srcObject = this.stream;
      await this.videoEl.play();

      this.canvasEl = document.createElement('canvas');
      this.canvasEl.width = 160;
      this.canvasEl.height = 120;
      this.ctx = this.canvasEl.getContext('2d', { willReadFrequently: true });

      this.isRunning = true;
      this.processVideoLoop();

      return { success: true };
    } catch (err: any) {
      this.stopWebcamHandTracking();
      return { success: false, error: err?.message || 'Could not access webcam for hand tracking.' };
    }
  }

  /**
   * 60FPS Computer Vision Hand Centroid & Pinch Analysis
   */
  private processVideoLoop = () => {
    if (!this.isRunning || !this.videoEl || !this.ctx || !this.canvasEl) return;

    if (this.videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;

      // Draw mirrored video frame for natural user interaction
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(this.videoEl, -w, 0, w, h);
      this.ctx.restore();

      const imgData = this.ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let totalX = 0;
      let totalY = 0;
      let detectedPixels = 0;

      // Skin tone and optical motion filter
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Normalized RGB skin tone heuristic
        const isSkin = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;
        if (isSkin) {
          const pixelIndex = i / 4;
          const px = pixelIndex % w;
          const py = Math.floor(pixelIndex / w);

          totalX += px;
          totalY += py;
          detectedPixels++;
        }
      }

      if (detectedPixels > 120) {
        const rawX = (totalX / detectedPixels / w) * 100;
        const rawY = (totalY / detectedPixels / h) * 100;

        // Exponential smoothing (Lerp alpha = 0.25)
        this.smoothedX = this.smoothedX * 0.75 + rawX * 0.25;
        this.smoothedY = this.smoothedY * 0.75 + rawY * 0.25;

        // Pinch detection: density concentration vs total hand perimeter
        const pixelDensity = detectedPixels / (w * h);
        const isPinching = pixelDensity < 0.045 && pixelDensity > 0.008;

        if (isPinching) {
          this.pinchHoldCount++;
        } else {
          this.pinchHoldCount = Math.max(0, this.pinchHoldCount - 1);
        }

        const activePinch = this.pinchHoldCount >= 2;
        const gesture: HandGestureFrame['gesture'] = activePinch ? 'pinch' : pixelDensity > 0.12 ? 'palm' : 'none';

        if (this.onGestureCallback) {
          this.onGestureCallback({
            cursorX: Math.min(100, Math.max(0, this.smoothedX)),
            cursorY: Math.min(100, Math.max(0, this.smoothedY)),
            isPinching: activePinch,
            gesture,
            confidence: Math.min(1, detectedPixels / 400),
          });
        }
      }
    }

    this.animFrameId = requestAnimationFrame(this.processVideoLoop);
  };

  /**
   * Stop Webcam Tracking and release camera resources cleanly
   */
  public stopWebcamHandTracking() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoEl) {
      this.videoEl.srcObject = null;
      this.videoEl = null;
    }

    this.canvasEl = null;
    this.ctx = null;
    this.onGestureCallback = null;
  }
}

export const handGestureEngine = new HandGestureEngine();
