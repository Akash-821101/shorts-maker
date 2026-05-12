import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'remotion',
    '@remotion/renderer',
    '@remotion/lambda',
    '@remotion/cli',
  ],
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
        hostname: "remotionlambda-useast1-tljosgwdxa.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "remotionlambda-useast1-tljosgwdxa.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
