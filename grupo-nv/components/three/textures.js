import * as THREE from "three";

function canvas(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

/** Warm timber cladding — vertical slats with subtle grain. */
export function makeWood() {
  const c = canvas(256);
  const x = c.getContext("2d");
  x.fillStyle = "#6e5638";
  x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 8) {
    x.fillStyle = i % 16 === 0 ? "#5d4830" : "#79603f";
    x.fillRect(i, 0, 6, 256);
  }
  for (let i = 0; i < 1600; i++) {
    x.fillStyle = `rgba(40,28,16,${Math.random() * 0.12})`;
    x.fillRect(Math.random() * 256, Math.random() * 256, 1, Math.random() * 18);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Emissive window grid for warm dusk interior glow. */
export function makeWindows(cols = 6, rows = 3) {
  const c = canvas(256);
  const x = c.getContext("2d");
  x.fillStyle = "#000000";
  x.fillRect(0, 0, 256, 256);
  const pad = 14;
  const cw = (256 - pad * (cols + 1)) / cols;
  const rh = (256 - pad * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let ccol = 0; ccol < cols; ccol++) {
      const lit = Math.random() > 0.18;
      x.fillStyle = lit ? "#ffbf82" : "#241a12";
      x.fillRect(pad + ccol * (cw + pad), pad + r * (rh + pad), cw, rh);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Dark brushed-metal cladding for the industrial modules. */
export function makeMetal() {
  const c = canvas(256);
  const x = c.getContext("2d");
  x.fillStyle = "#2b2b2e";
  x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 6) {
    x.fillStyle = i % 12 === 0 ? "#232326" : "#313135";
    x.fillRect(0, i, 256, 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
