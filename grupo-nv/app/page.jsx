"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import RenderBackground from "@/components/RenderBackground";

// WebGL must only render on the client.
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
});

export default function Page() {
  return (
    <SmoothScroll>
      <Experience />
      <RenderBackground />
      <Story />
    </SmoothScroll>
  );
}
