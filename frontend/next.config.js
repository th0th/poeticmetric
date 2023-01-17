const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

const isSentryEnabled = process.env.SENTRY_ENABLED === "true";

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

if (isSentryEnabled) {
  nextConfig.sentry = {
    disableClientWebpackPlugin: !isSentryEnabled,
    disableServerWebpackPlugin: !isSentryEnabled,
    hideSourceMaps: true,
  };
}

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = isSentryEnabled
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
