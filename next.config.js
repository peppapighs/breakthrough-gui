/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatar.githubusercontent.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
