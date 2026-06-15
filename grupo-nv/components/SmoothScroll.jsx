"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourney } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wires Lenis (premium inertial scrolling) into GSAP's ticker and ScrollTrigger,
 * and publishes a normalized scroll progress into the journey store so the
 * 3D scene can move the camera in lockstep with the narrative.
 */
export default function SmoothScroll({ children }) {
  const setProgress = useJourney((s) => s.setProgress);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    const onScroll = ({ scroll, limit }) => {
      const p = limit > 0 ? scroll / limit : 0;
      setProgress(Math.max(0, Math.min(1, p)));
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [setProgress]);

  return children;
}
