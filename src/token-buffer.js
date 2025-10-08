import { Token } from "./token.js";

/**
 * Bounded circular buffer for tokens.
 */
export class TokenBuffer {
  #capacity;
  constructor(capacity) {
    this.#capacity = capacity;
    this.#buffer.push(new Token());
  }

  #buffer = Array(this.#capacity);
  #tokenIndex = 0;

  get(i) {
    return this.#buffer[(this.#tokenIndex + i) % this.#capacity];
  }

  add(token) {
    this.#buffer[this.#tokenIndex] = token;
    this.#tokenIndex = (this.#tokenIndex + 1) % this.#capacity;
  }
}
