/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    API: process.env.API,
    SECRET_KEY: process.env.SECRET_KEY,
    PROJECT_ID: process.env.PROJECT_ID,
    IPFS_URL: process.env.IPFS_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};
