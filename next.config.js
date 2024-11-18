/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['pmssfzblmsaphdlmxmdg.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig 