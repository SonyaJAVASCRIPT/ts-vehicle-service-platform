/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_USER_SERVICE_URL: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
    NEXT_PUBLIC_VEHICLE_SERVICE_URL:
      process.env.NEXT_PUBLIC_VEHICLE_SERVICE_URL,
  },
};

module.exports = nextConfig;
