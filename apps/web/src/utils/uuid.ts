/**
 * uuid.ts - Resilient RFC4122 v4 UUID Generator
 * Works uniformly across secure contexts (HTTPS/localhost), non-secure HTTP LAN contexts,
 * Web Workers, embedded webviews, and headless test runners.
 */

export function safeRandomUUID(): string {
  // 1. Primary: Native crypto.randomUUID (W3C standard, available in secure contexts)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {}
  }

  // 2. Secondary: crypto.getRandomValues (available in almost all modern browser contexts)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    try {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // RFC4122 v4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch {}
  }

  // 3. Fallback: RFC4122 v4 Pseudo-random bitwise generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
