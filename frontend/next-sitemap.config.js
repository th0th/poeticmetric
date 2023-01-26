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
    policies: process.env.NEXT_PUBLIC_ROBOTS_TXT_ALLOW !== "true" ? [{
      disallow: ["/"],
      userAgent: "*",
    }] : [{
      allow: ["/"],
      userAgent: "*",
    }],
  },
  siteUrl: process.env.BASE_URL,
};
