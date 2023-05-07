/** @type {import("next-sitemap").IConfig} */
module.exports = {
  exclude: [
    "/activation",
    "/billing",
    "/bootstrap",
    "/docs",
    "/email-address-verification",
    "/password-reset",
    "/sign-out",
    "/settings",
    "/sites",
    "/sites/*",
    "/team",
    "/team/*",
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: process.env.ROBOTS_TXT_ALLOW !== "true" ? [{
      disallow: ["/"],
      userAgent: "*",
    }] : [{
      allow: ["/"],
      userAgent: "*",
    }],
  },
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
};
