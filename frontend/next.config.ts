import type { NextConfig } from "next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      '127.0.0.1',
      'zarkrqyamscgfmxrqafp.supabase.co'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
