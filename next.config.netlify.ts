import type { NextConfig } from "next";
import { withAxiom } from 'next-axiom';

const nextConfig: NextConfig = {
  // Production optimizations for Netlify
  typescript: {
    // Don't ignore build errors in production
    ignoreBuildErrors: false,
  },
  
  // Enable strict mode for production
  reactStrictMode: true,
  
  // ESLint configuration
  eslint: {
    // Don't ignore ESLint errors in production
    ignoreDuringBuilds: false,
  },
  
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NETLIFY: process.env.NETLIFY,
  },
  
  // Images configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    // Minimum cache time for images
    minimumCacheTTL: 60,
  },
  
  // Compression configuration
  compress: true,
  
  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-*',
      'framer-motion',
      'recharts',
    ],
  },
  
  // Webpack configuration for Netlify
  webpack: (config, { dev, isServer, webpack }) => {
    // Production optimizations
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
      });
      config.plugins.push(BundleAnalyzerPlugin);
    }
    
    // Optimization plugins
    config.plugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 25,
      })
    );
    
    // Environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NETLIFY': JSON.stringify(process.env.NETLIFY),
        'process.env.BUILD_ID': JSON.stringify(process.env.BUILD_ID),
      })
    );
    
    // Node.js polyfills for Netlify
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        domain: false,
        http2: false,
        https: false,
        os: false,
        path: false,
        punycode: false,
        querystring: false,
        readline: false,
        stream: false,
        string_decoder: false,
        timers: false,
        tty: false,
        url: false,
        util: false,
        v8: false,
        vm: false,
        zlib: false,
      };
    }
    
    return config;
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: true,
      },
    ];
  },
  
  // Rewrites configuration for Netlify functions
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/.netlify/functions/api-handler/:path*',
      },
      {
        source: '/auth/:path*',
        destination: '/.netlify/functions/auth-handler/:path*',
      },
    ];
  },
  
  // Generate build ID for Netlify
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    }
    return `netlify-${Date.now()}`;
  },
  
  // Output configuration
  output: 'export',
  trailingSlash: true,
  
  // Asset prefix for CDN
  assetPrefix: process.env.NETLIFY ? undefined : '',
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable static generation
  generateStaticParams: true,
  
  // Incremental static regeneration
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  
  // Cache handler configuration
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50MB
};

// Export with Axiom for logging
export default withAxiom(nextConfig);