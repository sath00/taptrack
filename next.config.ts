import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep incoming trailing slashes (important for Django APPEND_SLASH on POST endpoints)
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')

    return [
      {
        source: '/api/:path*/',
        destination: `${backendUrl}/api/:path*/`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*/`,
      },
    ]
  },
};

export default nextConfig;
