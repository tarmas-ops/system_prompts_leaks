"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useJourney, SECTIONS } from "@/lib/store";
import Terrain from "@/components/three/Terrain";
import Particles from "@/components/three/Particles";
import City from "@/components/three/City";

// One camera keyframe per chapter: where the lens sits + what it looks at.
// This is the cinematic spine — the camera "travels" the ecosystem on scroll.
const KEYFRAMES = [
  { pos: [0, 60, 120], look: [0, 0, 0] }, // 01 Opening — high, distant
  { pos: [0, 28, 90], look: [0, 2, 0] }, // 02 Origination — descend to site
  { pos: [-30, 18, 55], look: [0, 8, 0] }, // 03 Development — among the rise
  { pos: [40, 10, 30], look: [0, 12, -10] }, // 04 Casa Nuba — low, intimate
  { pos: [-55, 14, 5], look: [0, 6, -30] }, // 05 Bodeflex — fly the corridor
  { pos: [20, 8, 45], look: [-10, 6, 0] }, // 06 +Value — street level
  { pos: [0, 95, 150], look: [0, 0, 0] }, // 07 Platform Scale — pull back
  { pos: [0, 50, 80], look: [0, 10, 0] }, // 08 Investment Platform — dashboards
  { pos: [0, 140, 60], look: [0, 0, -20] }, // 09 Final — rise to sunrise
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
        <fog attach="fog" args={["#061629", 90, 320]} />
        <ambientLight intensity={0.35} />
        <SunLight />
        <hemisphereLight args={["#2a4670", "#0b2343", 0.5]} />

        <Particles />
        <Terrain />
        <City />

        <Rig />
      </Canvas>
    </div>
  );
}
