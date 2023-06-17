import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: process.env.ROBOTS_TXT_ALLOW ? "/" : undefined,
      disallow: process.env.ROBOTS_TXT_ALLOW !== "true" ? "/" : undefined,
      userAgent: "*",
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
