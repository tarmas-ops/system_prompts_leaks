"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourney } from "@/lib/store";

function ss(e0, e1, x) {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * A cluster of box "pieces" that assembles itself, piece by piece, as the
 * journey scrolls through its window. Each piece rises from below and scales
 * into place with a staggered delay, so the project literally builds in front
 * of the visitor — concept → structure → completion.
 */
function Cluster({ pieces, position, win }) {
  const refs = useRef([]);
  const group = useRef();
  const [w0, w1] = win;

  useFrame((state) => {
    const p = useJourney.getState().progress;
    const build = ss(w0, w1, p);
    const stagger = 0.65;
    const n = pieces.length;

    for (let i = 0; i < n; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const pc = pieces[i];
      const t = THREE.MathUtils.clamp(build * (1 + stagger) - (i / n) * stagger, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      m.position.set(pc.pos[0], pc.pos[1] - (1 - e) * 16, pc.pos[2]);
      const s = Math.max(0.0001, e);
      m.scale.set(pc.size[0] * s, pc.size[1] * s, pc.size[2] * s);
      m.material.opacity = e;
    }
    // Slow showcase rotation so the massing reads as three-dimensional.
    if (group.current) {
      const vis = build * (1 - ss(w1 + 0.08, w1 + 0.18, p));
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.12 * vis;
    }
  });

  return (
    <group ref={group} position={position}>
      {pieces.map((pc, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={pc.color}
            emissive={pc.emissive || "#000000"}
            emissiveIntensity={pc.ei || 0}
            metalness={pc.metal ?? 0.35}
            roughness={pc.rough ?? 0.55}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Casa Nuba — boutique villas, dark roofs, a glowing pool and a common bar. */
export function CasaNuba() {
  const pieces = useMemo(() => {
    const out = [];
    // Common / restaurant building
    out.push({ pos: [-13, 1.7, -13], size: [20, 3.4, 6], color: "#4f4030" });
    out.push({ pos: [-13, 3.7, -13], size: [20.6, 0.5, 6.6], color: "#16120d" });
    // Villas grid (2 rows × 6) — base + dark roof
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        const x = -13 + c * 5.2;
        const z = -3 + r * 5.6;
        out.push({ pos: [x, 1.2, z], size: [3.2, 2.4, 3.8], color: "#7a6650" });
        out.push({ pos: [x, 2.7, z], size: [3.7, 0.55, 4.2], color: "#16120d" });
      }
    }
    // Pool deck + glowing water
    out.push({ pos: [-2, 0.1, 6], size: [11, 0.25, 6], color: "#5b4a3a" });
    out.push({ pos: [-2, 0.3, 6], size: [7, 0.35, 3.4], color: "#0b3b4a", emissive: "#1f9fc4", ei: 1.5 });
    return out;
  }, []);
  return <Cluster pieces={pieces} position={[0, 0, -8]} win={[0.31, 0.45]} />;
}

/* Bodeflex — a row of warehouse modules with dark roofs and orange doors. */
export function Bodeflex() {
  const pieces = useMemo(() => {
    const out = [];
    for (let i = 0; i < 8; i++) {
      const x = -21 + i * 6;
      out.push({ pos: [x, 1.9, 0], size: [5, 3.8, 9], color: "#2c2c2e", metal: 0.6, rough: 0.4 });
      out.push({ pos: [x, 4.0, 0], size: [5.3, 0.4, 9.4], color: "#1a1a1c", metal: 0.6 });
      out.push({ pos: [x, 1.3, 4.8], size: [3, 2.4, 0.3], color: "#120f0c", emissive: "#e8731f", ei: 1.2 });
    }
    return out;
  }, []);
  return <Cluster pieces={pieces} position={[-6, 0, -28]} win={[0.46, 0.6]} />;
}
