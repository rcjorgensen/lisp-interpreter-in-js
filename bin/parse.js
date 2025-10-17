#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Source } from "../src/source.js";
import { Scanner } from "../src/scanner.js";
import { Parser } from "../src/parser.js";

const filepath = resolve(process.cwd(), process.argv[2]);
const source = new Source(await readFile(filepath, { encoding: "utf-8" }));
const scanner = new Scanner(source, 4);
const parser = new Parser(scanner);

const program = parser.parseProgram();
console.dir(program, { depth: null });
