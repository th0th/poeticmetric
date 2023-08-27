import fs from "fs";
import path from "path";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const routeScriptsPath = "scripts/routes";

const config = [
  {
    input: "scripts/common.js",
    output: {
      dir: "public-generated",
      format: "iife",
    },
    plugins: [nodeResolve({ browser: true }), terser()],
  },
  {
    input: "scripts/common-reeval.js",
    output: {
      dir: "public-generated",
      format: "iife",
    },
    plugins: [nodeResolve({ browser: true }), terser()],
  },
];

fs.readdirSync(routeScriptsPath).forEach((f) => config.push({
  input: path.join(routeScriptsPath, f),
  output: {
    dir: "public-generated/routes",
    format: "iife",
  },
  plugins: [nodeResolve({ browser: true }), terser()],
}));

export default config;
