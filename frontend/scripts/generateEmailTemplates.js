import { execSync } from "node:child_process";
import { readdirSync, renameSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import getBaseDir from "./base.js";

const baseDir = getBaseDir();
const outPath = join(baseDir, "emails-out");

execSync("pnpm exec -- email export --outDir emails-out --silent");

const files = readdirSync(outPath, { withFileTypes: true });

for (const f of files) {
  renameSync(
    join(f.parentPath, f.name),
    join(baseDir, "..", "backend", "pkg", "service", "email", "files", "templates", f.name.replace(".html", ".gohtml")),
  );
}

rmdirSync(outPath);

