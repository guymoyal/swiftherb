import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export for Cloudflare Pages direct upload
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.iherb.com",
        pathname: "/**",
      },
    ],
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};

export default nextConfig;
