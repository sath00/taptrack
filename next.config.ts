import type { NextConfig } from "next";
import { execSync } from "node:child_process";

const resolveBuildId = () => {
  const envBuildId =
    process.env.NEXT_PUBLIC_BUILD_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA;

  if (envBuildId) {
    return envBuildId.slice(0, 8);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
};

const buildId = resolveBuildId();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
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
