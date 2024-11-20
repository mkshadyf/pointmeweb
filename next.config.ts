/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    instrumentationHook: true
  },
  images: {
    domains: ['pmssfzblmsaphdlmxmdg.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config: { devtool: string; }) => {
    config.devtool = 'source-map';
    return config;
  }
}

module.exports = nextConfig
