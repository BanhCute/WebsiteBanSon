import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true }, // chỉ bật nếu thật cần
};

export default nextConfig;
