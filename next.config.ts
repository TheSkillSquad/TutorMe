import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint checking during build for faster builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable strict mode for better error detection
  reactStrictMode: true,
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Images configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
