export const TokenType = {
  // reserved words
  quoteRW: { label: "quote" },
  setRW: { label: "set!" },
  defineRW: { label: "define" },
  ifRW: { label: "if" },
  lambdaRW: { label: "lambda" },
  beginRW: { label: "begin" },
  condRW: { label: "cond" },
  trueRW: { label: "true" },
  falseRW: { label: "false" },

  // arithmetic operators
  plus: { label: "+" },
  minus: { label: "-" },
  times: { label: "*" },
  divide: { label: "/" },

  // relational operators
  lessThan: { label: "<" },
  lessOrEqual: { label: "<=" },
  greaterThan: { label: ">" },
  greaterOrEqual: { label: ">=" },

  // punctuation
  leftParen: { label: "(" },
  rightParen: { label: ")" },
  apostrophe: { label: "'" },

  // literals and identifiers
  intLiteral: { label: "Integer Literal" },
  stringLiteral: { label: "String Literal" },
  identifier: { label: "Identifier" },

  // special scanning symbols
  EOF: { label: "End-of-File" },
  unknown: { label: "unknown" },
};

export function isPrimitive(symbol) {
  return (
    symbol === TokenType.setRW ||
    symbol === TokenType.defineRW ||
    symbol === TokenType.ifRW ||
    symbol === TokenType.lambdaRW ||
    symbol === TokenType.beginRW ||
    symbol === TokenType.condRW ||
    symbol === TokenType.trueRW ||
    symbol === TokenType.falseRW ||
    symbol === TokenType.plus ||
    symbol === TokenType.minus ||
    symbol === TokenType.times ||
    symbol === TokenType.divide ||
    symbol === TokenType.lessThan ||
    symbol === TokenType.lessOrEqual ||
    symbol === TokenType.greaterThan ||
    symbol === TokenType.greaterOrEqual ||
    symbol === TokenType.intLiteral ||
    symbol === TokenType.stringLiteral ||
    symbol === TokenType.identifier
  );
}
