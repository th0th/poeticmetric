import generateRobotsTxt from "generate-robotstxt";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { baseURL, getCommonOutDir } from "./base.js";

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
    const outDir = getCommonOutDir();

    const content = await generateRobotsTxt(robotsTxt.options);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, robotsTxt.fileName), content);
  }
}

main().catch((error) => {
  throw error;
});
