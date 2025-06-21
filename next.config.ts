import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Do NOT ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
