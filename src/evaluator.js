import { Token } from "./token.js";
import { TokenType } from "./token-type.js";

export function evaluate(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  } else if (isQuoted(exp)) {
    return getTextOfQuotation(exp);
  } else {
    throw Error(`Unknown expression type ${exp}`);
  }
}

function isSelfEvaluating(exp) {
  return (
    exp instanceof Token &&
    (exp.symbol === TokenType.intLiteral ||
      exp.symbol === TokenType.stringLiteral)
  );
}

function isTaggedList(exp, tag) {
  return Array.isArray(exp) && exp.length > 0 && exp[0] === tag;
}

function isQuoted(exp) {
  return isTaggedList(exp);
}

function getTextOfQuotation([_, exp]) {
  return exp;
}
