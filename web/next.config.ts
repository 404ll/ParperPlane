import type { NextConfig } from "next";

'use client';
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aggregator.walrus-testnet.walrus.space',
      },
    ],
  },
  assetPrefix: '/',
  trailingSlash: true,
  distDir: 'out',
  basePath: '',
};

export default nextConfig;
