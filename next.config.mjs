/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages deployment
  output: 'export',
  // No image optimization needed - all client-side
  images: {
    unoptimized: true,
  },
  // Memory optimization for development
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 3,
  },

  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Fixes for Transformers.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Security headers moved to public/_headers for Cloudflare Pages
};

export default nextConfig;
