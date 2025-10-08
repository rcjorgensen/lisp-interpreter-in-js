export const TokenType = {
  // reserved words
  quoteRW: { label: "quote" },
  setRW: { label: "set!" },
  defineRW: { label: "define" },
  ifRW: { label: "if" },
  lambdaRW: { label: "lambda" },
  beginRW: { label: "begin" },
  condRW: { label: "cond" },

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
