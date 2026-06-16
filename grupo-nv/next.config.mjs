/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // Fully static client-rendered build — deployable from any host with no
  // server runtime and no Vercel "Root Directory" setting required.
  output: "export",
};

export default nextConfig;
