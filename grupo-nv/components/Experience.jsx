"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useJourney, SECTIONS } from "@/lib/store";
import Terrain from "@/components/three/Terrain";
import Particles from "@/components/three/Particles";
import { CasaNuba, Bodeflex } from "@/components/three/ProjectBuild";

// One camera keyframe per chapter: where the lens sits + what it looks at.
// This is the cinematic spine — the camera "travels" the ecosystem on scroll.
const KEYFRAMES = [
  { pos: [0, 58, 125], look: [0, 0, 0] }, // 01 Manifesto — high, distant
  { pos: [0, 34, 95], look: [0, 4, 0] }, // 02 Thesis — settle toward site
  { pos: [-26, 26, 60], look: [0, 4, 0] }, // 03 Lifecycle — descend to the site
  { pos: [22, 17, 44], look: [0, 3, 0] }, // 04 Casa Nuba — 3/4 aerial of the build
  { pos: [-24, 16, 42], look: [0, 3, 0] }, // 05 Bodeflex — 3/4 aerial of the build
  { pos: [26, 12, 46], look: [0, 4, 0] }, // 06 +Value — street level
  { pos: [0, 80, 120], look: [0, 6, 0] }, // 07 Leadership — calm, pulled back
  { pos: [0, 150, 70], look: [0, 0, -18] }, // 08 Close — rise to sunrise
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
    light.current.position.set(34, 40 + p * 40, 28);
  });
  return (
    <directionalLight
      ref={light}
      intensity={1.9}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={1}
      shadow-camera-far={140}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-bias={-0.0004}
    />
  );
}

export default function Experience() {
  const setReady = useJourney((s) => s.setReady);
  useEffect(() => setReady(true), [setReady]);

  return (
    <div className="scene-canvas">
      <Canvas
        shadows
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
        <CasaNuba />
        <Bodeflex />

        <Rig />
      </Canvas>
    </div>
  );
}
