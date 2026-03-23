import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.13"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "kgfarjtgqckdofdfokfn.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
