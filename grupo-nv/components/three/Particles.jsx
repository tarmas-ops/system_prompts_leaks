"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourney } from "@/lib/store";

/**
 * Ambient capital/data field. Always present, drifting slowly. Reads as the
 * "alive" particulate atmosphere behind every chapter.
 */
export default function Particles({ count = 2600 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 400;
      arr[i * 3 + 1] = Math.random() * 120 - 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    const p = useJourney.getState().progress;
    // Cool navy dust early → warm taupe capital later.
    ref.current.material.color.lerpColors(
      new THREE.Color("#3a557e"),
      new THREE.Color("#b7aea3"),
      p
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.55}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
