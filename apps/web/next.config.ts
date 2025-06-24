import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
       {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'cwdaust.com.au',
      },
      {
        protocol: 'https',
        hostname: 'ornery-avalanche.biz',
      },
      {
        protocol: 'https',
        hostname: 'flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'late-guacamole.info',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'marvelous-alligator.com',
      },
      {
        protocol: 'https',
        hostname: 'distorted-folklore.name',
      },
      {
        protocol: 'https',
        hostname: 'immense-yarmulke.info',
      },
      {
        protocol: 'https',
        hostname: 'faint-unit.info',
      },
      {
        protocol: 'https',
        hostname: 'untrue-humidity.biz',
      },
      {
        protocol: 'https',
        hostname: 'late-guacamole.info',
      },
      {
        protocol: 'https',
        hostname: 'second-utilization.com',
      },

      // Add other domains as needed
    ],
  },
};

export default nextConfig;
