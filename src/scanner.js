import { Position } from "./position.js";
import { Source } from "./source.js";
import { TokenBuffer } from "./token-buffer.js";
import { Token } from "./token.js";
import { TokenType } from "./token-type.js";
import { StringBuilder } from "./string-builder.js";

export class Scanner {
  #source;
  #tokenBuffer;
  #scanBuffer = new StringBuilder(100);
  #reservedWords = [
    TokenType.quoteRW,
    TokenType.setRW,
    TokenType.defineRW,
    TokenType.ifRW,
    TokenType.lambdaRW,
    TokenType.beginRW,
    TokenType.condRW,
  ];

  /**
   * @param {Source} source
   * @param {number} k
   */
  constructor(source, k) {
    this.#source = source;
    this.#tokenBuffer = new TokenBuffer(k);

    this.#reservedWords.sort(({ label: a }, { label: b }) => {
      if (a < b) return -1;
      else if (b < a) return 1;
      return 0;
    });

    for (let i = 0; i < k; ++i) {
      this.advance();
    }
  }

  get token() {
    return this.lookahead(1);
  }

  get symbol() {
    return this.lookahead(1).symbol;
  }

  get text() {
    return this.lookahead(1).text;
  }

  get position() {
    return this.lookahead(1).position;
  }

  lookahead(i) {
    return this.#tokenBuffer.get(i - 1);
  }

  advance() {
    this.#tokenBuffer.add(this.#nextToken());
  }

  advanceTo(symbol) {
    while (this.symbol !== symbol && this.symbol !== "EOF") {
      this.advance();
    }
  }

  advanceTo(symbols) {
    while (!symbols.contains(this.symbol) && this.symbol !== "EOF") {
      this.advance();
    }
  }

  #nextToken() {
    let symbol;
    let position = new Position();
    let text = "";

    this.#skipWhitespace();

    position = this.#source.charPosition;

    if (this.#source.currentChar === this.#source.EOF) {
      symbol = TokenType.EOF;
    } else if (isLetter(this.#source.currentChar)) {
      const idString = this.#scanIdentifier();
      symbol = this.#getIdentifierSymbol(idString);

      if (symbol === TokenType.identifier) {
        text = idString;
      }
    } else if (isDigit(this.#source.currentChar)) {
      symbol = TokenType.intLiteral;
      text = this.#scanIntegerLiteral();
    } else {
      switch (this.#source.currentChar) {
        case "+": {
          symbol = TokenType.plus;
          this.#source.advance();
          break;
        }
        case "-": {
          symbol = TokenType.minus;
          this.#source.advance();
          break;
        }
        case "*": {
          symbol = TokenType.times;
          this.#source.advance();
          break;
        }
        case "/": {
          symbol = TokenType.divide;
          this.#source.advance();
          break;
        }
        case ";": {
          this.#skipComment();
          return this.#nextToken();
        }
        case "<": {
          this.#source.advance();
          if (this.#source.currentChar === "=") {
            symbol = TokenType.lessOrEqual;
            this.#source.advance();
          } else {
            symbol = TokenType.lessThan;
          }
          break;
        }
        case ">": {
          this.#source.advance();
          if (this.#source.currentChar === "=") {
            symbol = TokenType.greaterOrEqual;
            this.#source.advance();
          } else {
            symbol = TokenType.greaterThan;
          }
          break;
        }
        case "(": {
          symbol = TokenType.leftParen;
          this.#source.advance();
          break;
        }
        case ")": {
          symbol = TokenType.rightParen;
          this.#source.advance();
          break;
        }
        case "'": {
          symbol = TokenType.apostrophe;
          this.#source.advance();
          break;
        }
        case '"': {
          symbol = TokenType.stringLiteral;
          text = this.#scanStringLiteral();
          break;
        }
        default:
          throw Error(`Invalid character '${this.#source.currentChar}'`);
      }
    }

    return new Token(symbol, position, text);
  }

  #skipWhitespace() {
    while (
      this.#source.currentChar !== this.#source.EOF &&
      isWhitespace(this.#source.currentChar)
    ) {
      this.#source.advance();
    }
  }

  #skipComment() {
    while (
      this.#source.currentChar !== "\n" &&
      this.#source.currentChar !== this.#source.EOF
    ) {
      this.#source.advance();
    }

    this.#source.advance();
  }

  #scanIdentifier() {
    this.#scanBuffer.clear();

    do {
      this.#scanBuffer.append(this.#source.currentChar);
      this.#source.advance();
    } while (
      isLetterOrDigit(this.#source.currentChar) ||
      isQuestionMarkOrExclamationPoint(this.#source.currentChar)
    );

    return this.#scanBuffer.toString();
  }

  #scanIntegerLiteral() {
    this.#scanBuffer.clear();

    do {
      this.#scanBuffer.append(this.#source.currentChar);
      this.#source.advance();
    } while (isDigit(this.#source.currentChar));

    return this.#scanBuffer.toString();
  }

  #scanStringLiteral() {
    this.#scanBuffer.clear();

    let c = this.#source.currentChar;
    this.#scanBuffer.append(c);
    this.#source.advance();

    while (this.#source.currentChar !== '"') {
      c = this.#source.currentChar;
      if (c === "\\") {
        this.#scanBuffer.append(this.#scanEscapedChar());
      } else {
        this.#scanBuffer.append(c);
        this.#source.advance();
      }
    }
    c = this.#source.currentChar;
    this.#scanBuffer.append(c);
    this.#source.advance();

    return this.#scanBuffer.toString();
  }

  #scanEscapedChar() {
    // Need to save current position for error reporting.
    const backslashPosition = this.#source.charPosition;

    this.#source.advance();
    const c = this.#source.currentChar;

    this.#source.advance(); // leave source at second character following backslash

    switch (c) {
      case "t":
        return "\\t";
      case "n":
        return "\\n";
      case "r":
        return "\\r";
      case '"':
        return '\\"';
      case "'":
        return "\\'";
      case "\\":
        return "\\\\";
      default: {
        throw Error(
          `Illegal escape character '\\${c}' at ${backslashPosition}.`,
        );
      }
    }
  }

  #getIdentifierSymbol(idString) {
    return (
      searchForSymbol(
        idString,
        this.#reservedWords,
        0,
        this.#reservedWords.length,
      ) ?? TokenType.identifier
    );
  }
}

function isWhitespace(char) {
  return char.trim() === "";
}

function isLetter(char) {
  return /[a-z]/i.test(char);
}

function isDigit(char) {
  return /\d/.test(char);
}

function isLetterOrDigit(char) {
  return isLetter(char) || isDigit(char);
}

function isQuestionMarkOrExclamationPoint(char) {
  return /[?!]/.test(char);
}

/**
 * @param {string} searchString
 * @param {{ label: string}[]} symbols
 * @param {number} low
 * @param {number} high
 */
function searchForSymbol(searchString, symbols, low, high) {
  if (low >= high) {
    return null;
  }

  const mid = Math.floor((low + high) / 2);
  const midSymbol = symbols[mid];
  const label = midSymbol.label;

  if (searchString === label) {
    return midSymbol;
  } else if (searchString < label) {
    return searchForSymbol(searchString, symbols, low, mid);
  } else {
    return searchForSymbol(searchString, symbols, mid + 1, high);
  }
}
