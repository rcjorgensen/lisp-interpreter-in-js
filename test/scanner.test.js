import { describe, expect, it } from "vitest";

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readdir } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("correct", async () => {
  const correctDir = join(__dirname, "fixtures", "scanner", "correct");
  const files = (await readdir(correctDir)).filter((f) => f.endsWith(".scm"));

  for (const file of files) {
    it(file, () => {
      const scriptPath = join(__dirname, "./test-scanner.js");
      const inputPath = join(correctDir, file);
      const output = execFileSync("node", [scriptPath, inputPath], {
        encoding: "utf8",
      });
      expect(output).toMatchSnapshot();
    });
  }
});
