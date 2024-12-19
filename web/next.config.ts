import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aggregator.walrus-testnet.walrus.space',
      },
    ],
  },
};

export default nextConfig;
