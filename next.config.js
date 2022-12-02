/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    API: process.env.API,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};
