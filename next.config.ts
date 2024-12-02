import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true,

  },
  /* config options here */
  images:{
    domains: [
      'cloud.appwrite.io',
      'platform-lookaside.fbsbx.com',
      'lh3.googleusercontent.com',
      // {
      //   domain: 'your-domain.com',
      //   public: '/_next/static/images',
      // },
    ],
  }
};

export default nextConfig;
