# Grupo NV — Immersive Real Estate Private Equity Experience

A scroll-driven, cinematic storytelling site. The visitor "travels" through the
full lifecycle of real estate value creation — raw land → masterplan →
operating institutional assets — as a single continuous WebGL journey.

> "Value is not found. It is created."

## Stack

| Concern | Tech |
|--------|------|
| Framework | Next.js 14 (App Router) |
| 3D / WebGL | Three.js + React Three Fiber |
| Scroll storytelling | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis |
| UI motion / counters | Framer Motion |
| State bridge (DOM ↔ 3D) | Zustand |

## Run

```bash
cd grupo-nv
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18+.

## How it works

- `components/SmoothScroll.jsx` — Lenis drives the page, publishes a normalized
  `0..1` scroll `progress` into the Zustand store and pumps GSAP's ticker.
- `components/Experience.jsx` — a fixed full-viewport `<Canvas>` behind the DOM.
  The camera `Rig` lerps along 9 keyframes (one per chapter) using the shared
  `progress`, so the lens flies the ecosystem as you scroll. Lighting warms from
  institutional dawn → Casa Nuba sunset → final sunrise.
- `components/three/*` — procedural scene: glowing wireframe **Terrain** that
  solidifies then recedes, an instanced **City** that constructs itself, and an
  ambient **Particles** capital/data field.
- `components/Story.jsx` — the 9 chapters (DOM overlay) with GSAP staggered
  line reveals, parallax, glass KPI cards and the floating investment dashboard.

## The 9 chapters

1. Opening · 2. Origination · 3. Development · 4. Casa Nuba (Hospitality) ·
5. Bodeflex (Industrial) · 6. +Value (Retail) · 7. Platform Scale ·
8. Investment Platform · 9. Final — *Originate. Develop. Operate.*

## Swapping in real 3D assets (Blender / Spline → GLTF)

The procedural geometry is intentionally a stand-in. To go photoreal:

1. Export your hotels / warehouses / strip centers / cliffs as `.glb` into
   `public/models/`.
2. Load with drei's `useGLTF`, e.g. inside a new component:
   ```jsx
   import { useGLTF } from "@react-three/drei";
   const { scene } = useGLTF("/models/casa-nuba.glb");
   return <primitive object={scene} />;
   ```
3. Gate its visibility/position on `useJourney.getState().progress` so it
   appears in the right chapter, the same pattern `Terrain`/`City` use.

## Notes & next steps

- KPI figures are **illustrative placeholders** — replace with real underwriting.
- For production polish, add postprocessing (`@react-three/postprocessing`:
  bloom, depth-of-field, vignette) and real ocean/sunset shaders for Casa Nuba.
- Respect `prefers-reduced-motion` is partially handled; extend for full a11y.
