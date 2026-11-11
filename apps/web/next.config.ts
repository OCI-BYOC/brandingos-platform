import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@brandingos/db'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
