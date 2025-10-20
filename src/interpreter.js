import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Source } from "./source.js";
import { Scanner } from "./scanner.js";

const filepath = resolve(process.cwd(), process.argv[2]);
const source = new Source(await readFile(filepath, { encoding: "utf-8" }));
const scanner = new Scanner(source, 4);
const parser;
