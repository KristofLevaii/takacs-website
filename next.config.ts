import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/takacs-website',
  assetPrefix: '/takacs-website/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
