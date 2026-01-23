import { join } from "node:path";
import { build } from "vite";
import { getBaseDir, getBaseOutDir, isHostedOptions } from "./base.js";

const baseDir = getBaseDir();

async function main() {
  for (const isHostedOption of isHostedOptions) {
    process.env.VITE_IS_HOSTED = isHostedOption;
    const baseOutDir = getBaseOutDir();

    // build - static
    await build({
      build: {
        outDir: join(baseOutDir, "static"),
      },
    });

    // build - server
    await build({
      build: {
        outDir: join(baseOutDir, "server"),
        ssr: join(baseDir, "src", "entry-server.tsx"),
      },
    });
  }
}

main().catch((e) => {
  console.error(e); // eslint-disable-line no-console
});
