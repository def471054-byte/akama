import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Fix for the workspace root inference issue
  turbopack: {
    root: "/Users/manishankarvakta/Desktop/APPS/akama"
  },
  experimental: {
    // Other experimental options if needed
  },
};

export default withNextIntl(nextConfig);
