import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { Source } from "./src/source.js";
import { Scanner } from "./src/scanner.js";
import { Parser } from "./src/parser.js";
import { evaluate } from "./src/evaluator.js";

const inputPrompt = ";;; M-Eval input:";
const outputPrompt = ";;; M-Eval value:";

async function driverLoop() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    while (true) {
      const input = await rl.question(`\n\n${inputPrompt}\n`);

      if (input === "exit" || input === "quit") {
        break;
      }

      const source = new Source(input);
      const scanner = new Scanner(source, 4);
      const parser = new Parser(scanner);

      const exp = parser.parseExpression();

      const output = evaluate(exp, []);

      console.log(`\n${outputPrompt}\n`);
      console.log(output);
    }
  } catch (err) {
    console.error("Error during input loop:", err);
  } finally {
    rl.close();
  }
}

await driverLoop();
