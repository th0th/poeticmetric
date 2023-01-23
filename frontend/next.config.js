const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import("@sentry/nextjs/types/config/types").ExportedNextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.resolve(__dirname, "styles")],
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

if (!!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  nextConfig.sentry = {
    hideSourceMaps: true,
  };
}

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = !!process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
