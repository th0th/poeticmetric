import generateRobotsTxt from "generate-robotstxt";
import { writeFile } from "node:fs";
import { join } from "node:path";
import { getBaseDir, placeholderBaseURL } from "./base.js";

const baseDir = getBaseDir();

async function main() {
  const configs = [
    {
      fileName: "robots-allow.txt",
      options: {
        policy: [
          {
            allow: "/",
            userAgent: "*",
          },
        ],
        sitemap: `${placeholderBaseURL}/sitemap.xml`,
      },
    },
    {
      fileName: "robots-disallow.txt",
      options: {
        policy: [
          {
            disallow: "/",
            userAgent: "*",
          },
        ],
        sitemap: `${placeholderBaseURL}/sitemap.xml`,
      },
    },
  ];

  for (const robotsTxt of configs) {
    const content = await generateRobotsTxt(robotsTxt.options);
    await writeFile(join(baseDir, "public", robotsTxt.fileName), content, function (error) {
      if (error) throw error;
    });
  }
}

main().catch((error) => {
  throw error;
});
