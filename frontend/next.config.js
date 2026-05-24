/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery', 'pbxt.replicate.delivery'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com',
  },
}

module.exports = nextConfig
