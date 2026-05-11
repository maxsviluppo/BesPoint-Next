import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow Next.js to transpile the original Vite source files
  transpilePackages: [],

  // Image optimization: allow picsum and other hosts used in original project
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.svgrepo.com" },
    ],
  },

  // Expose GA ID and AI Key to the client bundle
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  },

  webpack(config) {
    // Path alias: @bespoint-src → original Vite project's src/
    config.resolve.alias = {
      ...config.resolve.alias,
      "@bespoint-src": path.resolve(
        __dirname,
        "./src/original-src"
      ),
      "react-router-dom": path.resolve(
        __dirname,
        "./src/lib/router-shim.tsx"
      ),
    };
    return config;
  },
};

export default nextConfig;
