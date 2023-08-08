/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tctfkldntrezaglqmcqe.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
  },
}

module.exports = nextConfig