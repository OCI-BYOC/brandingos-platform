import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@brandingos/db'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config) => {
    // Workspace packages import with .js extensions (ESM convention) but the
    // source is .ts — tell webpack to also try .ts/.tsx when it sees .js
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    }
    return config
  },
}

export default nextConfig
