// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs";
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
  transpilePackages: ["@chakra-ui/react"],
};

const configWithSentry = withSentryConfig(nextConfig, {
  org: "javieralzu",
  project: "tratolibre",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

export default withBundleAnalyzer(configWithSentry);
