import { TokenType, isPrimitive } from "./token-type.js";
import { Token } from "./token.js";

export class Parser {
  #scanner;
  /**
   * @param {import("./scanner.js").Scanner} scanner
   */
  constructor(scanner) {
    this.#scanner = scanner;
  }

  /**
   * Parse the following grammar rule:
   * `program = { expression } .`
   */
  parseProgram() {
    const expressions = [];
    while (this.#scanner.symbol !== TokenType.EOF) {
      const expression = this.parseExpression();
      expressions.push(expression);
    }

    return expressions;
  }

  /**
   * Parse the following grammar rule:
   * `expression = ( expressions ) | identifier | literal | quotedExpression .`
   */
  parseExpression() {
    if (this.#scanner.symbol === TokenType.leftParen) {
      return this.#parseExpressions();
    } else if (isPrimitive(this.#scanner.symbol)) {
      return this.#parsePrimitive();
    } else if (this.#scanner.symbol === TokenType.apostrophe) {
      return this.#parseQuotedExpression();
    }

    throw Error(`Invalid expression ${this.#scanner.symbol.label}`);
  }

  /**
   * Parse the following grammar rule:
   * `expressions = { expression } .`
   */
  #parseExpressions() {
    this.#match(TokenType.leftParen);
    const expressions = [];

    while (this.#scanner.symbol !== TokenType.rightParen) {
      const expression = this.parseExpression();
      expressions.push(expression);
    }

    this.#match(TokenType.rightParen);

    return expressions;
  }

  #parsePrimitive() {
    const literal = this.#scanner.token;
    this.#matchCurrentSymbol();
    return literal;
  }

  /**
   * Parse the following grammar rule:
   * `quotedExpression = "'" expression .`
   */
  #parseQuotedExpression() {
    const position = this.#scanner.token.position;
    this.#match(TokenType.apostrophe);
    const expression = this.parseExpression();
    return [new Token(TokenType.quoteRW, position), expression];
  }

  /**
   * Check that the current scanner symbol is the expected symbol.
   * If it is, then advance the scanner. Otherwise, throw an exception.
   */
  #match(expectedSymbol) {
    if (this.#scanner.symbol === expectedSymbol) {
      this.#scanner.advance();
    } else {
      throw Error(
        `Expecting "${expectedSymbol}" but found "${this.#scanner.token}" instead.`,
      );
    }
  }

  /**
   * Advance the scanner. This method represents an unconditional match
   * with the current scanner symbol.
   */
  #matchCurrentSymbol() {
    this.#scanner.advance();
  }
}
