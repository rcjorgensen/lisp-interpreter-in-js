import { Position } from "./position.js";
import { TokenType } from "./token-type.js";

export class Token {
  /**
   * @param {string} symbol
   * @param {Position} position
   * @param {string} text
   */
  constructor(
    symbol = TokenType.unknown,
    position = new Position(),
    text = "",
  ) {
    this.symbol = symbol;
    this.position = position;
    this.text = text;
  }
}
