import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SpatialAnchorMode = 'fixed-pin' | 'smooth-follow' | 'body-anchor';
export type SpatialPassthroughMode = 'true-black' | 'camera-ar' | 'cinema-dark';
export type ARDeviceProfile = 'universal' | 'viture' | 'xreal' | 'rayneo' | 'rokid' | 'quest' | 'visionpro';
export type KeyboardPlacementMode = 'mid-air' | 'flat-surface';

interface SpatialState {
  // Global Mode
  isSpatialModeActive: boolean;
  spatialAnchorMode: SpatialAnchorMode;
  screenCurvature: number; // 0 (flat) to 180 (curved IMAX)
  virtualDistance: number; // 1.0m to 5.0m
  passthroughMode: SpatialPassthroughMode;
  deviceProfile: ARDeviceProfile;

  // Spatial Sensor & Tracking State
  yaw: number;
  pitch: number;
  roll: number;
  originYaw: number;
  originPitch: number;

  // Hand Tracking & Laser Pointer
  isHandTrackingEnabled: boolean;
  isVirtualLaserActive: boolean;
  isVirtualKeyboardOpen: boolean;
  keyboardPlacementMode: KeyboardPlacementMode;
  keyboardTiltAngle: number;
  virtualKeyboardText: string;
  cursorPos: { x: number; y: number };
  isPinching: boolean;
  detectedGesture: string | null;

  // Actions
  toggleSpatialMode: () => void;
  setSpatialModeActive: (active: boolean) => void;
  setSpatialAnchorMode: (mode: SpatialAnchorMode) => void;
  setScreenCurvature: (val: number) => void;
  setVirtualDistance: (val: number) => void;
  setPassthroughMode: (mode: SpatialPassthroughMode) => void;
  setDeviceProfile: (profile: ARDeviceProfile) => void;
  setOrientation: (yaw: number, pitch: number, roll: number) => void;
  resetCenter: () => void;
  toggleHandTracking: () => void;
  setHandTrackingEnabled: (enabled: boolean) => void;
  toggleVirtualKeyboard: () => void;
  setVirtualKeyboardOpen: (open: boolean) => void;
  setKeyboardPlacementMode: (mode: KeyboardPlacementMode) => void;
  setKeyboardTiltAngle: (angle: number) => void;
  setVirtualKeyboardText: (text: string) => void;
  appendVirtualKeyboardChar: (char: string) => void;
  deleteVirtualKeyboardChar: () => void;
  setCursorPos: (x: number, y: number) => void;
  setPinching: (pinching: boolean) => void;
  setDetectedGesture: (gesture: string | null) => void;
}

export const useSpatialStore = create<SpatialState>()(
  persist(
    (set, get) => ({
      isSpatialModeActive: false,
      spatialAnchorMode: 'smooth-follow',
      screenCurvature: 30,
      virtualDistance: 2.5,
      passthroughMode: 'true-black',
      deviceProfile: 'viture',

      yaw: 0,
      pitch: 0,
      roll: 0,
      originYaw: 0,
      originPitch: 0,

      isHandTrackingEnabled: false,
      isVirtualLaserActive: true,
      isVirtualKeyboardOpen: false,
      keyboardPlacementMode: 'mid-air',
      keyboardTiltAngle: 55,
      virtualKeyboardText: '',
      cursorPos: { x: 50, y: 50 },
      isPinching: false,
      detectedGesture: null,

      toggleSpatialMode: () => {
        const next = !get().isSpatialModeActive;
        set({ isSpatialModeActive: next });
        if (next) {
          get().resetCenter();
        }
      },
      setSpatialModeActive: (active) => set({ isSpatialModeActive: active }),
      setSpatialAnchorMode: (mode) => set({ spatialAnchorMode: mode }),
      setScreenCurvature: (val) => set({ screenCurvature: val }),
      setVirtualDistance: (val) => set({ virtualDistance: val }),
      setPassthroughMode: (mode) => set({ passthroughMode: mode }),
      setDeviceProfile: (profile) => set({ deviceProfile: profile }),

      setOrientation: (yaw, pitch, roll) => set({ yaw, pitch, roll }),
      resetCenter: () => set((state) => ({ originYaw: state.yaw, originPitch: state.pitch })),

      toggleHandTracking: () => set((state) => ({ isHandTrackingEnabled: !state.isHandTrackingEnabled })),
      setHandTrackingEnabled: (enabled) => set({ isHandTrackingEnabled: enabled }),

      toggleVirtualKeyboard: () => set((state) => ({ isVirtualKeyboardOpen: !state.isVirtualKeyboardOpen })),
      setVirtualKeyboardOpen: (open) => set({ isVirtualKeyboardOpen: open }),
      setKeyboardPlacementMode: (mode) => set({ keyboardPlacementMode: mode }),
      setKeyboardTiltAngle: (angle) => set({ keyboardTiltAngle: angle }),
      setVirtualKeyboardText: (text) => set({ virtualKeyboardText: text }),
      appendVirtualKeyboardChar: (char) => set((state) => ({ virtualKeyboardText: state.virtualKeyboardText + char })),
      deleteVirtualKeyboardChar: () => set((state) => ({ virtualKeyboardText: state.virtualKeyboardText.slice(0, -1) })),

      setCursorPos: (x, y) => set({ cursorPos: { x, y } }),
      setPinching: (pinching) => set({ isPinching: pinching }),
      setDetectedGesture: (gesture) => set({ detectedGesture: gesture }),
    }),
    {
      name: 'openguide-spatial-store',
      partialize: (state) => ({
        spatialAnchorMode: state.spatialAnchorMode,
        screenCurvature: state.screenCurvature,
        virtualDistance: state.virtualDistance,
        passthroughMode: state.passthroughMode,
        deviceProfile: state.deviceProfile,
      }),
    }
  )
);
