const isDev = process.env.NODE_ENV !== 'production';


const assetPrefix = "/"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix,
  // 添加 assetPrefix 地址到 publicRuntimeConfig
  publicRuntimeConfig: {
    isDev,
    assetPrefix,
  },
  webpack: (config) => {
    return config;
  }
};

module.exports = (_phase, { defaultConfig }) => {
  const plugins = [];
  return plugins.reduce((acc, plugin) => plugin(acc), {
    ...defaultConfig,
    ...nextConfig
  });
};

