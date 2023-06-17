const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import("@sentry/nextjs/types/config/types").ExportedNextConfig} */
let nextConfig = {
  experimental: {
    mdxRs: true,
  },
  output: "export",
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.resolve(__dirname, "styles")],
  },
  swcMinify: true,
  webpack(config) {
    if (process.env.USE_POLLING === "true") {
      config.watchOptions = {
        aggregateTimeout: 500,
        poll: 500,
      };
    }

    // svgr
    const svgFileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      {
        ...svgFileLoaderRule,
        resourceQuery: /url/, // *.svg?url
        test: /\.svg$/i,
      },
      // Convert all other *.svg imports to React components
      {
        issuer: { not: /\.(css|scss|sass)$/ },
        loader: "@svgr/webpack",
        options: {
          dimensions: false,
          ref: true,
        },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        test: /\.svg$/i,
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    svgFileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

const withMDX = require("@next/mdx")();

nextConfig = withMDX(nextConfig);

if (!!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  /** @type {Partial<import("@sentry/webpack-plugin").SentryCliPluginOptions>} */
  const sentryWebpackPluginOptions = {
    silent: true,
  };

  nextConfig.sentry = {
    hideSourceMaps: true,
  };

  nextConfig = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
}

module.exports = nextConfig;
