/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 64 * 1000000,
    appDir: true,
  },
};

module.exports = nextConfig;
