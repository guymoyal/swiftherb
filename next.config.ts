import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static site generation for Cloudflare Pages
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
  trailingSlash: true, // Better compatibility with Cloudflare Pages
};

export default nextConfig;
