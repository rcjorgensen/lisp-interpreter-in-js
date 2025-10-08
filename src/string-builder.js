export class StringBuilder {
  #buffer;
  #length;

  constructor(capacity) {
    this.#buffer = new Uint8Array(capacity);
    this.#length = 0;
  }

  /**
   * @param {string} char
   */
  append(char) {
    this.#buffer[this.#length++] = char.codePointAt(0);
  }

  clear() {
    this.#length = 0;
  }

  /**
   * @returns {string}
   */
  toString() {
    return String.fromCharCode(...this.#buffer.slice(0, this.#length));
  }
}
