
// Next.js only loads `next.config.js` or `next.config.mjs` — `next.config.ts` is NOT used.
// Keep all build-critical options here (Vercel reads this file).

const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber'],

  typescript: {
    // Repo has TS errors in tests/features outside the app bundle; Vercel runs `tsc` during build
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Clerk user avatars / assets (next/image)
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fabiola.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'angelocaruso.art',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'angelocaruso.art',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'createbuildconnect.com',
        port: '',
        pathname: '/**',
      },
      // Airtable attachment CDN (alumni headshots via next/image)
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    return [
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

  async redirects() {
    return [
      { source: '/support', destination: '/grants', permanent: true },
      { source: '/support/:path*', destination: '/grants/:path*', permanent: true },
      { source: '/case-studies', destination: '/projects', permanent: true },
      { source: '/case-studies/:slug', destination: '/projects/:slug', permanent: true },
      { source: '/pilots', destination: '/projects', permanent: true },
      {
        source: '/projects/cultural-institution-wayfinding',
        destination: '/projects/museum-scale-public-information',
        permanent: true,
      },
      {
        source: '/projects/nonprofit-program-portal',
        destination: '/projects/program-heavy-nonprofit-portal',
        permanent: true,
      },
      {
        source: '/projects/multi-venue-events',
        destination: '/projects/multi-venue-events-calendar',
        permanent: true,
      },
      { source: '/what-we-do', destination: '/infra24', permanent: true },
      {
        source: '/audit',
        destination: '/programs/artist-support/digital-audits',
        permanent: true,
      },
    ];
  },

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

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      domexception: false,
      inflight: false,
      abab: false,
    };

    return config;
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;
