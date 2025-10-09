
// Configuration to handle deprecated packages
const nextConfig = {
  // ... existing config ...
  
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
