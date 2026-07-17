/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ccf8a9a9104b48a5a457aab2e743cf0b.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Help Vercel builds: disable static generation for pages that might cause hangs
  experimental: {
    // Add any experimental flags if needed
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
