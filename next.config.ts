import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right'
  },
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
