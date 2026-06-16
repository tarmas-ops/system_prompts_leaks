"use client";

import { create } from "zustand";

// Total number of narrative chapters in the experience.
export const SECTIONS = 8;

/**
 * Global scroll/journey state shared between the DOM story layer and the
 * WebGL scene. `progress` is the normalized 0..1 position through the entire
 * experience; `section` is the integer chapter (0-8) currently centered.
 */
export const useJourney = create((set) => ({
  progress: 0,
  section: 0,
  ready: false,
  setProgress: (progress) =>
    set({
      progress,
      section: Math.min(SECTIONS - 1, Math.floor(progress * SECTIONS + 0.0001)),
    }),
  setReady: (ready) => set({ ready }),
}));
