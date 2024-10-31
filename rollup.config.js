import fs from "node:fs";
import { join } from "node:path";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const srcPath = join(__dirname, "scripts");
const distPath = join(__dirname, "pkg", "web", "fileserver", "files", "scripts");

const config = fs.readdirSync(srcPath).map((f) => ({
  input: join(srcPath, f),
  output: {
    dir: distPath,
    format: "iife",
  },
  plugins: [nodeResolve({ browser: true }), typescript(), terser()],
}));

export default config;
