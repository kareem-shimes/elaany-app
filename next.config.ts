import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Enable standalone output for Docker deployment
  output: "standalone",
};

export default nextConfig;
