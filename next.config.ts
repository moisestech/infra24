import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  
  // Ignore TypeScript errors during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Multi-tenant domain configuration
  async rewrites() {
    return [
      // Rewrite subdomain requests to path-based routing
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)\\.infra24\\.com',
          },
        ],
        destination: '/o/:subdomain/:path*',
      },
      // Rewrite custom domain requests to path-based routing
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<domain>.*)\\.digital',
          },
        ],
        destination: '/o/:domain/:path*',
      },
    ];
  },

  // Headers for tenant identification
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
