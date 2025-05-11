import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = getBaseDir();

export function getBaseDir() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

function readFromBaseTs(name) {
  const baseTsContent = readFileSync(join(baseDir, "src", "lib", "base.ts"), { encoding: "utf-8" });
  const variableLine = baseTsContent.split("\n").find((line) => line.includes(name));

  if (variableLine === undefined) {
    throw new Error("Variable not found.");
  }

  const [, variableStatement] = variableLine.replaceAll("import.meta.env", "process.env").split("=");

  return eval(variableStatement);
}

export const placeholderBaseURL = readFromBaseTs("placeholderBaseURL");
export const placeholderRestAPIBaseURL = readFromBaseTs("placeholderRestAPIBaseURL");
export const placeholderTagsEnvironment = readFromBaseTs("placeholderTagsEnvironment");
