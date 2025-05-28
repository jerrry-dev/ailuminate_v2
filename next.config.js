/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: "loose",
  },
  // Ensure proper routing for Netlify
  trailingSlash: false,
  // Add output configuration for Netlify
  output: "standalone",
}

module.exports = nextConfig
