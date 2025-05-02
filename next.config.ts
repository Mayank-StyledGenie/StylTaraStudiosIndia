import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.codewithfaraz.com',
        pathname: '/tools/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    domains: ['www.styltarastudios.com'], // Add your domain
  },
  // No basePath or assetPrefix needed for standard deployment
  
  // Remove the experimental.appDir section - it's no longer needed in Next.js 15+
  
  // Add production-specific settings
  output: 'standalone', // This creates a more optimized production build
};

export default nextConfig;