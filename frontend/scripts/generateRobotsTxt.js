import generateRobotsTxt from "generate-robotstxt";
import { writeFile } from "node:fs";
import { join } from "node:path";
import { getBaseDir, baseURL } from "./base.js";

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
        sitemap: `${baseURL}/sitemap.xml`,
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
        sitemap: `${baseURL}/sitemap.xml`,
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
