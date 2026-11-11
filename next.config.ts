import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // no metered Vercel image transformations
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qkvcghzcdehlifzprvyi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
