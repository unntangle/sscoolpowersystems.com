import type { NextConfig } from "next";

// Validate environment variables at boot. Fails fast with a readable error.
import "./src/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" }],
  },
};

export default nextConfig;
