/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kthnjptsyqsrmbernlsm.supabase.co',
      },
    ],
  },
  // Compress responses
  compress: true,
  // Power optimizations
  poweredByHeader: false,
  // React strict mode for better debugging
  reactStrictMode: true,
}

module.exports = nextConfig
