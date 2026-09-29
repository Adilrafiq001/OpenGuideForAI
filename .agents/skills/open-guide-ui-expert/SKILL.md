---
name: open-guide-ui-expert
description: Master UI/UX skill for OpenGuideForAI. Combines impeccable taste, antigravity design, product-design, and ui-ux-pro-max. Uses strict rules for high-end web applications avoiding generic AI slop.
category: frontend
risk: safe
---

# OpenGuideForAI UI Expert

This skill synthesizes all major premium UI/UX guidelines to create a high-agency, Apple-level product design standard specifically for OpenGuideForAI.

## 1. Core Vibe & Anti-Slop Policy
- **No AI Slop:** BANNED: Centered layouts with dark images, default "purple/blue" glows, neon gradients, `Inter` font, generic "3 cards" horizontal rows, "Acme" or "John Doe" placeholders.
- **The Liquid Glass & Antigravity Look:** 
  - Glassmorphism is done right: use `backdrop-blur`, a `1px` inner refraction border (`border-white/10`), and subtle inner shadow.
  - Cards should appear weightless with diffused drop-shadows (e.g., `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`).
  - Spatial depth using Z-axis layering and 3D transforms where appropriate.
- **Asymmetry is Mandatory (Design Variance 8):** Default to split-screen, 70/30 ratios, left-aligned headers, masonry grids, and bento boxes. Centered Hero sections are forbidden.

## 2. Technical Stack & Motion Engine
- **Framework:** React + Tailwind CSS v4 + Framer Motion (for UI) / GSAP (for scroll-heavy backgrounds).
- **Perpetual Micro-Interactions (Motion Intensity 6):** 
  - Buttons have magnetic pull.
  - Active states loop infinitely (Pulse, Shimmer, Float). 
  - Spring Physics only: `type: "spring", stiffness: 100, damping: 20`. NO linear easing.
  - Use `layoutId` for smooth transitions between states.
- **Interactivity Isolation:** Ensure all perpetual animations and magnetic effects are isolated in tiny `'use client'` leaf components to preserve RSC architecture performance.

## 3. Typography & Color
- **Fonts:** BANNED: `Inter`, Serifs in dashboards. MANDATORY: `Geist`, `Satoshi`, `Outfit`, or `Cabinet Grotesk`.
- **Display/Headlines:** `tracking-tighter leading-none`. Let weight and color create hierarchy, not just massive scale.
- **Colors:** Max 1 Accent Color with saturation < 80%. Use absolute neutral bases (Zinc/Slate/Charcoal) and high-contrast, singular accents (Emerald, Electric Blue).
- **Contrast & Accessibility (Priority 1):** Min 4.5:1 ratio, visible focus rings, minimum 44x44px touch targets.

## 4. Components & Interactive States
- **Bento Grids (Motion-Engine Paradigm):**
  - Background `#f9fafb` (Light) or `#0a0a0a` (Dark).
  - Cards have `rounded-[2.5rem]` and generous `p-8` or `p-10`.
  - Include 5 Card Archetypes: The Intelligent List, The Command Input, Live Status, Wide Data Stream, Contextual UI.
- **Interactive UI Cycles:** Always implement full interaction cycles: Skeletal loaders, Empty States, Inline Errors, and Tactile `:active` feedback (scale-[0.98]).
- **Icons:** Use exclusively `@phosphor-icons/react` or `@radix-ui/react-icons`. BANNED: Emojis in UI.
- **Mechanical, Capsule & Glow Craft Standards:**
  - **Zero Rectangular Blur Halos:** High blur filters (`filter: blur(...)`) must NEVER be enclosed within an ancestor with `overflow: hidden` unless both share identical curved border-radii (`border-radius: var(--rounded-max)` or `rounded-full`). Glows must use concentric pill border-radii and smooth radial gradients (`radial-gradient(ellipse at center, ...)`) rather than flat-edged linear gradients or clipped rectangular boxes.
  - **Light Theme Contrast Calibration:** Translucent glass capsules must adapt background gradients and text colors in light themes to guarantee WCAG AAA contrast (minimum 7:1 ratio). In light themes, text must use dark slate ink (`#0f172a`) rather than washed-out white text.
  - **Route-Aware Component Lifecycle Reset:** Any interactive element with an opening/closing animation lifecycle MUST bind to `location.pathname` / `location.key` via `useLocation` (or `pageshow` / `popstate`) to guarantee an instant return to the idle resting state upon navigation re-entry.
  - **Multi-Stage Spring Settlement:** Multi-stage spring animations must be afforded adequate settlement time (~2,000–2,200ms) before route unmounting, so learners can perceive and appreciate the completed state.

## 5. Execution Routine
1. Inspect the brief and current aesthetics (landing vs dashboard).
2. Choose a dynamic, asymmetric layout pattern.
3. Apply Liquid Glass and Antigravity shadowing.
4. Implement Spring-based micro-interactions.
5. Verify accessibility and responsive breakpoints (strictly collapse complex grids to 1 column below `md`).
