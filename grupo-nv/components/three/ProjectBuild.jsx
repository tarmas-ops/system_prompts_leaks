"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourney } from "@/lib/store";
import { makeWood, makeWindows, makeMetal } from "@/components/three/textures";

function ss(e0, e1, x) {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function buildMaterial(pc, tex) {
  const base = { transparent: true, opacity: 0 };
  const rep = (t, u, v) => {
    const c = t.clone();
    c.needsUpdate = true;
    c.repeat.set(u, v);
    return c;
  };
  switch (pc.mat) {
    case "wood":
      return new THREE.MeshStandardMaterial({
        ...base,
        map: rep(tex.wood, pc.ru || 1, pc.rv || 1),
        emissiveMap: rep(tex.windows, pc.ru || 1, pc.rv || 1),
        emissive: new THREE.Color("#ff9a4d"),
        emissiveIntensity: 1.15,
        roughness: 0.72,
        metalness: 0.04,
      });
    case "metal":
      return new THREE.MeshStandardMaterial({
        ...base,
        map: rep(tex.metal, pc.ru || 1, pc.rv || 1),
        color: new THREE.Color("#33333a"),
        roughness: 0.42,
        metalness: 0.6,
      });
    case "deck":
      return new THREE.MeshStandardMaterial({
        ...base,
        map: rep(tex.wood, pc.ru || 2, pc.rv || 2),
        color: new THREE.Color("#caa877"),
        roughness: 0.85,
      });
    case "pool":
      return new THREE.MeshStandardMaterial({
        ...base,
        color: new THREE.Color("#0d4658"),
        emissive: new THREE.Color("#2ec4e6"),
        emissiveIntensity: 1.7,
        roughness: 0.12,
        metalness: 0.4,
      });
    case "light":
      return new THREE.MeshStandardMaterial({
        ...base,
        color: new THREE.Color("#1a140e"),
        emissive: new THREE.Color("#ffce93"),
        emissiveIntensity: 2.4,
      });
    case "door":
      return new THREE.MeshStandardMaterial({
        ...base,
        color: new THREE.Color("#120f0c"),
        emissive: new THREE.Color("#ef7a22"),
        emissiveIntensity: 1.6,
      });
    case "roof":
    default:
      return new THREE.MeshStandardMaterial({
        ...base,
        color: new THREE.Color(pc.color || "#15120d"),
        roughness: 0.5,
        metalness: 0.2,
      });
  }
}

/**
 * Stylized architectural-massing construction site with textured materials,
 * landscaping and warm dusk lighting. Terrain settles first, then the units
 * build up piece by piece (walls grow from the ground, roofs/details drop in).
 */
function ConstructionSite({ data, win }) {
  const group = useRef();
  const groundRef = useRef();
  const meshRefs = useRef([]);
  const treeRefs = useRef([]);
  const { ground, pieces, trees = [] } = data;

  const tex = useMemo(() => ({ wood: makeWood(), windows: makeWindows(), metal: makeMetal() }), []);
  const materials = useMemo(() => pieces.map((pc) => buildMaterial(pc, tex)), [pieces, tex]);
  const groundMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(ground.color),
        roughness: 0.95,
        metalness: 0.04,
        transparent: true,
        opacity: 0,
      }),
    [ground.color]
  );
  const treeMats = useMemo(
    () => ({
      trunk: new THREE.MeshStandardMaterial({ color: "#3b2a1a", roughness: 0.9 }),
      leaf: new THREE.MeshStandardMaterial({ color: "#54632f", roughness: 0.85 }),
    }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const p = useJourney.getState().progress;
    const [w0, w1] = win;
    const active = p > w0 - 0.06 && p < w1 + 0.16;
    group.current.visible = active;
    if (!active) return;

    const span = w1 - w0;
    const build = ss(w0, w1, p);
    const out = 1 - ss(w1, w1 + 0.08, p);

    const g = ss(w0, w0 + span * 0.16, p);
    if (groundRef.current) {
      groundMat.opacity = g * out * 0.98;
      groundRef.current.scale.set(g, 1, g);
    }

    const unitBuild = ss(w0 + span * 0.12, w1, p);
    const stagger = 0.82;
    const n = pieces.length;
    for (let i = 0; i < n; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const pc = pieces[i];
      const t = THREE.MathUtils.clamp(unitBuild * (1 + stagger) - (pc.order / n) * stagger, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const [sx, sy, sz] = pc.size;
      if (pc.kind === "base") {
        m.scale.set(sx, Math.max(0.0001, sy * e), sz);
        m.position.set(pc.pos[0], pc.pos[1] - sy / 2 + (sy * e) / 2, pc.pos[2]);
      } else {
        m.scale.set(sx, sy, sz);
        m.position.set(pc.pos[0], pc.pos[1] + (1 - e) * 2.4, pc.pos[2]);
      }
      materials[i].opacity = e * out;
    }

    // Landscaping settles in late.
    for (let i = 0; i < trees.length; i++) {
      const tr = treeRefs.current[i];
      if (!tr) continue;
      const t = THREE.MathUtils.clamp(unitBuild * 1.3 - 0.4 - (i / trees.length) * 0.3, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      tr.scale.setScalar(Math.max(0.0001, e) * (trees[i].s || 1) * out);
    }

    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.09) * 0.14 * build * out;
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={groundRef} position={[0, -0.5, 0]} receiveShadow material={groundMat}>
        <boxGeometry args={ground.size} />
      </mesh>
      {pieces.map((pc, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          material={materials[i]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
      {trees.map((tr, i) => (
        <group key={`t${i}`} ref={(el) => (treeRefs.current[i] = el)} position={tr.pos} scale={0.001}>
          <mesh castShadow material={treeMats.trunk} position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 1.4, 6]} />
          </mesh>
          <mesh castShadow material={treeMats.leaf} position={[0, 1.7, 0]}>
            <icosahedronGeometry args={[0.8, 0]} />
          </mesh>
          <mesh castShadow material={treeMats.leaf} position={[0.3, 2.2, 0.1]}>
            <icosahedronGeometry args={[0.55, 0]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CasaNuba() {
  const data = useMemo(() => {
    const ground = { size: [30, 1, 24], color: "#3a2e22" };
    const pieces = [];
    const trees = [];
    let order = 0;
    const push = (pc) => pieces.push({ order: order++, ...pc });

    // Common / restaurant building with long glazing
    push({ pos: [-9, 1.7, -4], size: [5, 3.4, 13], mat: "wood", kind: "base", ru: 1, rv: 4 });
    push({ pos: [-9, 3.65, -4], size: [5.6, 0.45, 13.6], mat: "roof", kind: "roof" });

    // Villas — 2 rows × 5 (warm timber + lit windows)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const x = -2.5 + c * 3.4;
        const z = -5 + r * 5;
        push({ pos: [x, 1.2, z], size: [2.7, 2.4, 3.6], mat: "wood", kind: "base" });
        push({ pos: [x, 2.75, z], size: [3.2, 0.5, 4.1], mat: "roof", kind: "roof" });
      }
    }

    // Pool + deck
    push({ pos: [-3, 0.55, 6], size: [7.5, 0.3, 4], mat: "deck", kind: "deck" });
    push({ pos: [-3, 0.75, 6], size: [4.4, 0.3, 2.1], mat: "pool", kind: "pool" });

    // Warm path lights
    for (let i = 0; i < 12; i++) {
      const x = -3 + (i % 6) * 2.9;
      const z = i < 6 ? -1.6 : 2.8;
      push({ pos: [x, 0.5, z], size: [0.22, 0.7, 0.22], mat: "light", kind: "light" });
    }

    // Landscaping around the site
    const tspots = [
      [-13, -9], [-13, 8], [7, -9], [7, 9], [-3, 9.5], [12, 0], [-13, 0], [3, 9.5],
    ];
    tspots.forEach(([x, z]) => trees.push({ pos: [x, 0, z], s: 0.8 + Math.random() * 0.6 }));

    return { ground, pieces, trees };
  }, []);

  return <ConstructionSite data={data} win={[0.3, 0.45]} />;
}

export function Bodeflex() {
  const data = useMemo(() => {
    const ground = { size: [30, 1, 20], color: "#26262a" };
    const pieces = [];
    const trees = [];
    let order = 0;
    const push = (pc) => pieces.push({ order: order++, ...pc });

    for (let i = 0; i < 6; i++) {
      const x = -9 + i * 3.6;
      push({ pos: [x, 1.9, 0], size: [3.2, 3.8, 9.5], mat: "metal", kind: "base", ru: 1, rv: 2 });
      push({ pos: [x, 3.95, 0], size: [3.5, 0.4, 10], mat: "roof", color: "#19191b", kind: "roof" });
      push({ pos: [x, 1.2, 4.9], size: [2.1, 2.3, 0.25], mat: "door", kind: "door" });
    }
    [[-12, -7], [12, -7], [-12, 7], [12, 7]].forEach(([x, z]) =>
      trees.push({ pos: [x, 0, z], s: 0.9 })
    );

    return { ground, pieces, trees };
  }, []);

  return <ConstructionSite data={data} win={[0.48, 0.63]} />;
}
