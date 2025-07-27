/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/Sofienne-Portfolio',
  assetPrefix: '/Sofienne-Portfolio',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
