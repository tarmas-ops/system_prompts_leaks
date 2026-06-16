"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourney } from "@/lib/store";

// Cheap layered value-noise — enough to read as topography without textures.
function noise(x, z) {
  return (
    Math.sin(x * 0.18) * Math.cos(z * 0.21) * 2.4 +
    Math.sin(x * 0.05 + z * 0.07) * 5.5 +
    Math.cos(z * 0.12) * 1.8
  );
}

/**
 * The living terrain: a displaced plane rendered as a glowing wireframe that
 * "solidifies" as the journey begins, then sinks away as buildings take over.
 */
export default function Terrain() {
  const wire = useRef();
  const solid = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(320, 320, 160, 160);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, noise(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    const p = useJourney.getState().progress;
    // Terrain dominates chapters 0-2, recedes afterward.
    const presence = THREE.MathUtils.clamp(1 - (p - 0.28) * 2.2, 0, 1);
    const solidify = THREE.MathUtils.clamp((p - 0.04) * 6, 0, 1);

    if (wire.current) {
      wire.current.material.opacity = presence * (1 - solidify * 0.55) * 0.9;
    }
    if (solid.current) {
      solid.current.material.opacity = presence * solidify * 0.85;
      solid.current.position.y = -1 + (1 - presence) * -14;
    }
  });

  return (
    <group position={[0, -6, 0]}>
      <mesh ref={solid} geometry={geometry}>
        <meshStandardMaterial
          color="#0d2c52"
          emissive="#0b2343"
          emissiveIntensity={0.4}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0}
          flatShading
        />
      </mesh>
      <lineSegments ref={wire}>
        <wireframeGeometry args={[geometry]} />
        <lineBasicMaterial color="#b7aea3" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}
