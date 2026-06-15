"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";

// WebGL must only render on the client.
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
});

export default function Page() {
  return (
    <SmoothScroll>
      <Experience />
      <Story />
    </SmoothScroll>
  );
}
