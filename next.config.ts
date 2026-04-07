import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Other experimental options if needed
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'akama.aamardokan.online',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
