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
 * A stylized architectural-massing "construction site". As the chapter scrolls:
 *   1. the terrain/site platform settles in, then
 *   2. the units build up, piece by piece — walls grow up out of the ground,
 *      roofs and details drop into place — staggered like a real development.
 * Premium massing aesthetic (materials, warm light, shadows), not a photo.
 */
function ConstructionSite({ data, win }) {
  const group = useRef();
  const groundRef = useRef();
  const refs = useRef([]);
  const { ground, pieces } = data;

  useFrame((state) => {
    if (!group.current) return;
    const p = useJourney.getState().progress;
    const [w0, w1] = win;
    const active = p > w0 - 0.06 && p < w1 + 0.14;
    group.current.visible = active;
    if (!active) return;

    const span = w1 - w0;
    const build = ss(w0, w1, p);
    const out = 1 - ss(w1, w1 + 0.07, p);

    // Phase 1 — terrain/site settles first.
    const g = ss(w0, w0 + span * 0.16, p);
    if (groundRef.current) {
      groundRef.current.material.opacity = g * out * 0.96;
      groundRef.current.scale.set(g, 1, g);
    }

    // Phase 2 — units build up after the ground.
    const unitBuild = ss(w0 + span * 0.12, w1, p);
    const stagger = 0.8;
    const n = pieces.length;
    for (let i = 0; i < n; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const pc = pieces[i];
      const t = THREE.MathUtils.clamp(unitBuild * (1 + stagger) - (pc.order / n) * stagger, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const [sx, sy, sz] = pc.size;
      if (pc.kind === "base") {
        // Walls grow upward out of the ground (anchored at their base).
        m.scale.set(sx, Math.max(0.0001, sy * e), sz);
        m.position.set(pc.pos[0], pc.pos[1] - sy / 2 + (sy * e) / 2, pc.pos[2]);
      } else {
        // Roofs / glass / details settle down into place.
        m.scale.set(sx, sy, sz);
        m.position.set(pc.pos[0], pc.pos[1] + (1 - e) * 2.2, pc.pos[2]);
      }
      m.material.opacity = e * out;
    }

    // Slow showcase orbit so the massing reads as three-dimensional.
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.16 * build * out;
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={groundRef} position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={ground.size} />
        <meshStandardMaterial
          color={ground.color}
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>
      {pieces.map((pc, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={pc.color}
            emissive={pc.emissive || "#000000"}
            emissiveIntensity={pc.ei || 0}
            metalness={pc.metal ?? 0.2}
            roughness={pc.rough ?? 0.65}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Casa Nuba — boutique villas, a common bar, glowing pool and warm path lights. */
export function CasaNuba() {
  const data = useMemo(() => {
    const ground = { size: [30, 1, 24], color: "#2f2820" };
    const pieces = [];
    let order = 0;
    const push = (pc) => pieces.push({ order: order++, ...pc });

    // Common / restaurant building (left)
    push({ pos: [-9, 1.7, -4], size: [5, 3.4, 13], color: "#5b4a37", kind: "base", rough: 0.6 });
    push({ pos: [-9, 1.7, -4], size: [5.05, 1.4, 13.05], color: "#0e0c09", emissive: "#ffb066", ei: 0.8, kind: "glass" });
    push({ pos: [-9, 3.6, -4], size: [5.5, 0.5, 13.6], color: "#17140f", kind: "roof" });

    // Villas — 2 rows × 5
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const x = -2.5 + c * 3.4;
        const z = -5 + r * 5;
        push({ pos: [x, 1.2, z], size: [2.7, 2.3, 3.6], color: "#8a6f52", kind: "base", rough: 0.55 });
        push({ pos: [x, 1.0, z + 1.85], size: [2.0, 1.1, 0.18], color: "#0e0c09", emissive: "#ffb066", ei: 1.1, kind: "glass" });
        push({ pos: [x, 2.65, z], size: [3.1, 0.5, 4.0], color: "#17140f", kind: "roof" });
      }
    }

    // Pool + deck (front)
    push({ pos: [-3, 0.55, 6], size: [7, 0.3, 3.6], color: "#5b4a37", kind: "deck" });
    push({ pos: [-3, 0.72, 6], size: [4.2, 0.3, 2], color: "#0b3b4a", emissive: "#1f9fc4", ei: 1.5, kind: "pool" });

    // Warm path lights
    for (let i = 0; i < 12; i++) {
      const x = -3 + (i % 6) * 2.9;
      const z = i < 6 ? -1.8 : 2.6;
      push({ pos: [x, 0.5, z], size: [0.22, 0.7, 0.22], color: "#1a140e", emissive: "#ffcf95", ei: 1.8, kind: "light" });
    }
    return { ground, pieces };
  }, []);

  return <ConstructionSite data={data} win={[0.3, 0.45]} />;
}

/* Bodeflex — flexible warehouse modules with dark metal, roofs and orange doors. */
export function Bodeflex() {
  const data = useMemo(() => {
    const ground = { size: [30, 1, 20], color: "#26262a" };
    const pieces = [];
    let order = 0;
    const push = (pc) => pieces.push({ order: order++, ...pc });

    for (let i = 0; i < 6; i++) {
      const x = -9 + i * 3.6;
      push({ pos: [x, 1.9, 0], size: [3.2, 3.8, 9.5], color: "#2c2c2e", kind: "base", metal: 0.55, rough: 0.4 });
      push({ pos: [x, 3.95, 0], size: [3.5, 0.4, 10], color: "#19191b", kind: "roof", metal: 0.55 });
      push({ pos: [x, 1.2, 4.9], size: [2.1, 2.3, 0.25], color: "#120f0c", emissive: "#e8731f", ei: 1.3, kind: "door" });
    }
    return { ground, pieces };
  }, []);

  return <ConstructionSite data={data} win={[0.48, 0.63]} />;
}
