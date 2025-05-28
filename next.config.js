/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for server-side functionality
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: "loose",
  },
}

module.exports = nextConfig
