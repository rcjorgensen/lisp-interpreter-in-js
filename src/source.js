import { Position } from "./position.js";

export class Source {
  EOF = -1;

  #currentChar;
  /**
   * @returns {string | -1}
   */
  get currentChar() {
    return this.#currentChar;
  }

  #lineNumber = 1;
  #charNumber = 0;
  get charPosition() {
    return new Position(this.#lineNumber, this.#charNumber);
  }

  advance() {
    if (this.#currentChar === "\n") {
      ++this.#lineNumber;
      this.#charNumber = 1;
    } else {
      ++this.#charNumber;
    }

    if (this.#pos >= this.#source.length) {
      this.#currentChar = this.EOF;
    } else {
      this.#currentChar = this.#source[this.#pos++];
    }
  }

  #source;
  #pos = 0;
  /**
   * @param {string} source
   */
  constructor(source) {
    this.#source = source;
    this.advance();
  }
}
