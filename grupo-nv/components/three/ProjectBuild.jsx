"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useJourney } from "@/lib/store";

function ss(e0, e1, x) {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * The real project render, shattered into a grid of 3D tiles that fly in from
 * depth — rotating and scattered — and assemble, piece by piece, into the
 * complete photographic render as the chapter is scrolled. The final state IS
 * the render (full design fidelity); the journey there is a true 3D build.
 *
 * The whole grid is locked to the camera and sized to "contain" the image in
 * view, so framing is always perfect regardless of the cinematic camera path.
 */
function ImageAssembly({ url, win, cols = 9, rows = 5, dist = 22 }) {
  const baseTex = useTexture(url);
  const { camera, size } = useThree();
  const group = useRef();
  const meshRefs = useRef([]);
  const fwd = useMemo(() => new THREE.Vector3(), []);

  const { tiles, materials } = useMemo(() => {
    baseTex.colorSpace = THREE.SRGBColorSpace;
    const tiles = [];
    const materials = [];
    let i = 0;
    const rnd = (seed) => {
      const x = Math.sin(seed) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tex = baseTex.clone();
        tex.needsUpdate = true;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(1 / cols, 1 / rows);
        tex.offset.set(c / cols, 1 - (r + 1) / rows);
        materials.push(
          new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0,
            toneMapped: false,
            side: THREE.DoubleSide,
          })
        );
        const k = i + 1;
        tiles.push({
          cx: (c + 0.5) / cols,
          cy: (r + 0.5) / rows,
          order: ((r / rows + c / cols) / 2) * 0.7 + rnd(k * 12.9) * 0.3,
          ox: (rnd(k * 1.3) - 0.5) * 2.0,
          oy: (rnd(k * 7.7) - 0.5) * 2.0,
          oz: 5 + rnd(k * 3.1) * 16,
          rx: (rnd(k * 2.1) - 0.5) * 2.6,
          ry: (rnd(k * 5.2) - 0.5) * 2.6,
          rz: (rnd(k * 9.4) - 0.5) * 2.6,
        });
        i++;
      }
    }
    return { tiles, materials };
  }, [baseTex, cols, rows]);

  useFrame(() => {
    if (!group.current) return;
    const p = useJourney.getState().progress;
    const [w0, w1] = win;
    const build = ss(w0, w0 + (w1 - w0) * 0.72, p); // assemble across the window
    const vis = 1 - ss(w1, w1 + 0.05, p); // fade out just after

    // Lock the grid in front of the camera, facing it.
    fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
    group.current.position.copy(camera.position).addScaledVector(fwd, dist);
    group.current.quaternion.copy(camera.quaternion);

    // Contain the image within the current view at `dist`.
    const vH = 2 * dist * Math.tan(((camera.fov || 50) * Math.PI) / 360);
    const vW = vH * (size.width / size.height);
    const imgA = baseTex.image ? baseTex.image.width / baseTex.image.height : 1.6;
    let planeW, planeH;
    if (vW / vH < imgA) {
      planeW = vW * 0.92;
      planeH = planeW / imgA;
    } else {
      planeH = vH * 0.84;
      planeW = planeH * imgA;
    }
    const tw = planeW / cols;
    const th = planeH / rows;
    const stagger = 0.7;

    for (let i = 0; i < tiles.length; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const t = tiles[i];
      const lp = THREE.MathUtils.clamp(build * (1 + stagger) - t.order * stagger, 0, 1);
      const e = 1 - Math.pow(1 - lp, 3);
      const fx = (t.cx - 0.5) * planeW;
      const fy = (0.5 - t.cy) * planeH;
      m.position.set(
        fx + (1 - e) * t.ox * planeW * 0.5,
        fy + (1 - e) * t.oy * planeH * 0.5,
        (1 - e) * t.oz
      );
      m.rotation.set((1 - e) * t.rx, (1 - e) * t.ry, (1 - e) * t.rz);
      m.scale.set(tw, th, 1);
      materials[i].opacity = e * vis;
    }
  });

  return (
    <group ref={group}>
      {tiles.map((t, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} material={materials[i]}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

export function CasaNuba() {
  return <ImageAssembly url="/projects/casa-nuba.png" win={[0.3, 0.45]} dist={22} />;
}

export function Bodeflex() {
  return <ImageAssembly url="/projects/bodeflex-hero.png" win={[0.48, 0.63]} dist={26} />;
}
