/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    // WebP only: the images are UI screenshots, and AVIF visibly softens their small text and thin borders even at quality 85
    formats: ["image/webp"],
    minimumCacheTTL: 2592000,
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
