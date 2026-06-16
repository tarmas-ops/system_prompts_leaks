"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourney } from "@/lib/store";

const dummy = new THREE.Object3D();

/**
 * Instanced massing that rises from the terrain — concept → architecture →
 * completion. Heights animate in as the Development chapter is scrolled, and
 * the cluster doubles as the "platform scale" portfolio later in the journey.
 */
export default function City({ rows = 14, cols = 14, spacing = 11 }) {
  const ref = useRef();

  const blocks = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          x: (c - cols / 2) * spacing + (Math.random() - 0.5) * 3,
          z: (r - rows / 2) * spacing + (Math.random() - 0.5) * 3,
          w: 3.4 + Math.random() * 2.6,
          d: 3.4 + Math.random() * 2.6,
          h: 6 + Math.random() * 34,
          phase: Math.random(),
        });
      }
    }
    return arr;
  }, [rows, cols, spacing]);

  useFrame(() => {
    if (!ref.current) return;
    const p = useJourney.getState().progress;
    // Buildings construct themselves across chapters 2-7.
    const build = THREE.MathUtils.clamp((p - 0.2) / 0.55, 0, 1);

    blocks.forEach((b, i) => {
      const local = THREE.MathUtils.clamp(build * 1.6 - b.phase * 0.6, 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      const h = Math.max(0.001, b.h * eased);
      dummy.position.set(b.x, h / 2 - 6, b.z);
      dummy.scale.set(b.w, h, b.d);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, blocks.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#152f54"
        emissive="#0b2343"
        emissiveIntensity={0.35}
        metalness={0.55}
        roughness={0.35}
      />
    </instancedMesh>
  );
}
