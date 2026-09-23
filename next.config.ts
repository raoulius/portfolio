import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // resume and project image uploads go through server actions (default limit is 1 MB)
    serverActions: { bodySizeLimit: "11mb" },
  },
};

export default nextConfig;
