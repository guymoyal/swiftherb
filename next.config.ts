import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
