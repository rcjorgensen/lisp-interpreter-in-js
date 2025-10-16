import { Position } from "./position.js";

export class Source {
  EOF = -1;

  /**
   * @type {number}
   */
  #currentChar;

  get currentChar() {
    return this.#currentChar;
  }

  #lineNumber = 1;
  #charNumber = 0;
  get charPosition() {
    return new Position(this.#lineNumber, this.#charNumber);
  }

  advance() {
    if (this.#currentChar === "\n".codePointAt(0)) {
      ++this.#lineNumber;
      this.#charNumber = 1;
    } else {
      ++this.#charNumber;
    }

    if (this.#pos >= this.#source.length) {
      this.#currentChar = this.EOF;
    } else {
      this.#currentChar = this.#source.codePointAt(this.#pos);
      this.#pos += this.#currentChar > 0xffff ? 2 : 1; // Handles surrogate pairs.
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
