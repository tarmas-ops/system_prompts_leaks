"use client";

import { useEffect, useRef } from "react";
import { useJourney } from "@/lib/store";

function ss(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/**
 * Full-screen cinematic render layer that sits between the 3D canvas and the
 * story. As the journey scrolls through the project chapters, the real Casa
 * Nuba and Bodeflex renders cross-fade in with a slow Ken-Burns scale, while a
 * navy scrim keeps the floating text legible. This is the reliable, always-
 * visible version of the "renders transitioning in the background" effect.
 */
export default function RenderBackground() {
  const casa = useRef(null);
  const bode = useRef(null);
  const scrim = useRef(null);

  useEffect(() => {
    const apply = (p) => {
      const co = ss(0.29, 0.37, p) * (1 - ss(0.45, 0.52, p));
      const bo = ss(0.45, 0.52, p) * (1 - ss(0.61, 0.69, p));
      if (casa.current) {
        casa.current.style.opacity = co.toFixed(3);
        casa.current.style.transform = `scale(${(1.08 - co * 0.08).toFixed(3)})`;
      }
      if (bode.current) {
        bode.current.style.opacity = bo.toFixed(3);
        bode.current.style.transform = `scale(${(1.08 - bo * 0.08).toFixed(3)})`;
      }
      if (scrim.current) scrim.current.style.opacity = Math.max(co, bo).toFixed(3);
    };
    apply(useJourney.getState().progress);
    return useJourney.subscribe((s) => apply(s.progress));
  }, []);

  return (
    <div className="render-bg" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={casa} src="/projects/casa-nuba.png" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={bode} src="/projects/bodeflex.png" alt="" />
      <div ref={scrim} className="render-scrim" />
    </div>
  );
}
