import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = getBaseDir();

export function getBaseDir() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

export function getBaseDistDir() {
  return join(baseDir, "dist");
}

export function getBaseOutDir() {
  return join(getBaseDistDir(), process.env.VITE_IS_HOSTED === "true" ? "hosted" : "non-hosted");
}

export function getCommonOutDir() {
  return join(getBaseDistDir(), "common");
}

function readFromBaseTs(name) {
  const baseTsContent = readFileSync(join(baseDir, "src", "lib", "base.ts"), { encoding: "utf-8" });
  const regex = new RegExp(`^export const ${name} = getEnvironmentVariable\\("(.*?)", "(.*?)"\\)`, "gm");
  const arr = regex.exec(baseTsContent);

  if (arr === null) {
    throw new Error("Variable not found.");
  }

  const [, environmentVariableName, defaultValue] = arr;
  const line = `process.env.${environmentVariableName} || "${defaultValue}";`;

  return eval(line);
}

export const baseURL = readFromBaseTs("baseURL");
export const isHostedOptions = ["true", ""];
