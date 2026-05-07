import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fionpmscmcrmhyhvhixa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Remotion Lambda renders output to S3 before re-upload
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
