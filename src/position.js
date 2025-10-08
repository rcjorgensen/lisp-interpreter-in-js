export class Position {
  constructor(lineNumber = 0, charNumber = 0) {
    this.lineNumber = lineNumber;
    this.charNumber = charNumber;
  }

  toString() {
    return `line ${this.lineNumber}, character ${this.charNumber}`;
  }
}
