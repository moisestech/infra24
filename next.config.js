
// Configuration to handle deprecated packages
const nextConfig = {
  // Image configuration for external domains
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
      }
    ],
  },
  
  // Handle deprecated packages
  webpack: (config, { isServer }) => {
    // Handle domexception deprecation
    config.resolve.alias = {
      ...config.resolve.alias,
      'domexception': false,
      'inflight': false,
      'abab': false
    };
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
};

module.exports = nextConfig;
