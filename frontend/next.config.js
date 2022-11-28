const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.resolve(__dirname, "styles")],
    prependData: '@import "bootstrap/utilities"; @import "bootstrap/variables";',
  },
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      issuer: /\.[jt]sx?$/,
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            dimensions: false,
            ref: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
