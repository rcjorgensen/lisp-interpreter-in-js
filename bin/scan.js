#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Source } from "../src/source.js";
import { Scanner } from "../src/scanner.js";
import { TokenType } from "../src/token-type.js";

const filepath = resolve(process.cwd(), process.argv[2]);
const source = new Source(await readFile(filepath, { encoding: "utf-8" }));

const scanner = new Scanner(source, 4);

let token;
do {
  token = scanner.token;
  console.dir(token, { depth: null });
  scanner.advance();
} while (token.symbol !== TokenType.EOF);
