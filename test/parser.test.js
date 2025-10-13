import { describe, expect, it } from "vitest";

import { Source } from "../src/source.js";
import { Scanner } from "../src/scanner.js";
import { Parser } from "../src/parser.js";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readdir, readFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("correct", async () => {
  const correctDir = join(__dirname, "..", "examples", "parser", "correct");
  const files = (await readdir(correctDir)).filter((f) => f.endsWith(".scm"));

  for (const file of files) {
    it(file, async () => {
      const filepath = join(correctDir, file);
      const source = new Source(
        await readFile(filepath, { encoding: "utf-8" }),
      );
      const scanner = new Scanner(source, 4);
      const parser = new Parser(scanner);
      const program = parser.parseProgram();

      expect(program).toMatchSnapshot();
    });
  }
});
