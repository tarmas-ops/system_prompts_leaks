"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useJourney, SECTIONS } from "@/lib/store";
import Terrain from "@/components/three/Terrain";
import Particles from "@/components/three/Particles";
import City from "@/components/three/City";

// One camera keyframe per chapter: where the lens sits + what it looks at.
// This is the cinematic spine — the camera "travels" the ecosystem on scroll.
const KEYFRAMES = [
  { pos: [0, 58, 125], look: [0, 0, 0] }, // 01 Manifesto — high, distant
  { pos: [0, 34, 95], look: [0, 4, 0] }, // 02 Thesis — settle toward site
  { pos: [-28, 16, 52], look: [0, 9, 0] }, // 03 Lifecycle — descend into the build
  { pos: [38, 10, 30], look: [0, 11, -8] }, // 04 Casa Nuba — low, intimate
  { pos: [-52, 14, 6], look: [-6, 7, -28] }, // 05 Bodeflex — fly the corridor
  { pos: [26, 9, 44], look: [-8, 6, 0] }, // 06 +Value — street level
  { pos: [0, 70, 120], look: [0, 6, 0] }, // 07 Leadership — calm, pulled back
  { pos: [0, 138, 64], look: [0, 0, -18] }, // 08 Close — rise to sunrise
];

function Rig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const targetLook = useRef(new THREE.Vector3(...KEYFRAMES[0].look));
  const currentLook = useRef(new THREE.Vector3(...KEYFRAMES[0].look));

  useFrame((state, delta) => {
    const p = useJourney.getState().progress;
    const scaled = p * (SECTIONS - 1);
    const i = Math.min(SECTIONS - 2, Math.floor(scaled));
    const t = THREE.MathUtils.clamp(scaled - i, 0, 1);
    const ease = t * t * (3 - 2 * t); // smoothstep between keyframes

    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];

    targetPos.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], ease),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], ease),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], ease)
    );
    targetLook.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], ease),
      THREE.MathUtils.lerp(a.look[1], b.look[1], ease),
      THREE.MathUtils.lerp(a.look[2], b.look[2], ease)
    );

    // Subtle breathing drift for a hand-held, alive feel.
    const drift = state.clock.elapsedTime;
    targetPos.current.x += Math.sin(drift * 0.25) * 1.4;
    targetPos.current.y += Math.cos(drift * 0.2) * 0.8;

    const k = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(targetPos.current, k);
    currentLook.current.lerp(targetLook.current, k);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function SunLight() {
  const light = useRef();
  useFrame(() => {
    if (!light.current) return;
    const p = useJourney.getState().progress;
    // Cold institutional dawn → warm Casa Nuba sunset → final sunrise gold.
    light.current.color.lerpColors(
      new THREE.Color("#9fb4d4"),
      new THREE.Color("#f0c08a"),
      Math.sin(p * Math.PI)
    );
    light.current.position.set(60, 40 + p * 60, -80 + p * 120);
  });
  return <directionalLight ref={light} intensity={1.6} castShadow />;
}

// Smoothstep helper.
function ss(e0, e1, x) {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Project renders living inside the 3D world as billboards the camera flies
// toward. They fade in/out by scroll progress, so the real Casa Nuba and
// Bodeflex imagery becomes the cinematic background of their chapters.
function ProjectPlanes() {
  const casa = useTexture("/projects/casa-nuba.png");
  const bode = useTexture("/projects/bodeflex.png");
  const casaRef = useRef();
  const bodeRef = useRef();

  useFrame(() => {
    const p = useJourney.getState().progress;
    if (casaRef.current) {
      const o = ss(0.28, 0.36, p) * (1 - ss(0.47, 0.53, p));
      casaRef.current.material.opacity = o;
      casaRef.current.scale.setScalar(1 + (1 - o) * 0.06);
    }
    if (bodeRef.current) {
      const o = ss(0.46, 0.52, p) * (1 - ss(0.62, 0.68, p));
      bodeRef.current.material.opacity = o;
      bodeRef.current.scale.setScalar(1 + (1 - o) * 0.06);
    }
  });

  return (
    <>
      <Billboard position={[0, 11, -10]}>
        <mesh ref={casaRef}>
          <planeGeometry args={[66, 37]} />
          <meshBasicMaterial map={casa} transparent opacity={0} toneMapped={false} />
        </mesh>
      </Billboard>
      <Billboard position={[-6, 8, -30]}>
        <mesh ref={bodeRef}>
          <planeGeometry args={[70, 39]} />
          <meshBasicMaterial map={bode} transparent opacity={0} toneMapped={false} />
        </mesh>
      </Billboard>
    </>
  );
}

export default function Experience() {
  const setReady = useJourney((s) => s.setReady);
  useEffect(() => setReady(true), [setReady]);

  return (
    <div className="scene-canvas">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 2000, position: KEYFRAMES[0].pos }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.8]}
      >
        <color attach="background" args={["#061629"]} />
        <fog attach="fog" args={["#061629", 90, 360]} />
        <ambientLight intensity={0.35} />
        <SunLight />
        <hemisphereLight args={["#2a4670", "#0b2343", 0.5]} />

        <Particles />
        <Terrain />
        <City />
        <Suspense fallback={null}>
          <ProjectPlanes />
        </Suspense>

        <Rig />
      </Canvas>
    </div>
  );
}
