import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "15mb"
    }
  }
};

export default nextConfig;
