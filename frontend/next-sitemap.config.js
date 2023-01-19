/** @type {import("next-sitemap").IConfig} */
module.exports = {
  exclude: [
    "/activation",
    "/billing",
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
    policies: process.env.STAGE !== "production" ? [{
      disallow: ["/"],
      userAgent: "*",
    }] : [{
      allow: ["/"],
      userAgent: "*",
    }],
  },
  siteUrl: process.env.BASE_URL,
};
