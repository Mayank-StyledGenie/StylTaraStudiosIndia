import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    
    unoptimized: true,

    domains: ['www.styltarastudios.com'], 
  },
  
  
  output: 'standalone', 
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
