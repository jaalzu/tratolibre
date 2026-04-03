import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.13"],
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "kgfarjtgqckdofdfokfn.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
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
