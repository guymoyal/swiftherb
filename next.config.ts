import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full-Stack Next.js (not static export)
  // Cloudflare Pages Functions will handle /api/* routes automatically
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.iherb.com",
        pathname: "/**",
      },
    ],
    unoptimized: false, // Enable image optimization
  },
};

export default nextConfig;
