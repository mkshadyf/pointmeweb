/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  images: {
    domains: ['pmssfzblmsaphdlmxmdg.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true
 // swcMinify: true
}

module.exports = nextConfig