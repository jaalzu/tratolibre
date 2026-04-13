import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

// Wrapper del bundle analyzer
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.13"],
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "kgfarjtgqckdofdfokfn.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  // transpilePackages: ["@chakra-ui/react"],
};
