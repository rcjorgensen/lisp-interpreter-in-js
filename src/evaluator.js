import { Token } from "./token.js";
import { TokenType } from "./token-type.js";

export function evaluate(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  } else if (isQuoted(exp)) {
    return getTextOfQuotation(exp);
  } else if (isDefinition(exp)) {
  } else {
    throw Error(`Unknown expression type ${JSON.stringify(exp)}`);
  }
}

function isSelfEvaluating(exp) {
  return (
    exp instanceof Token &&
    (exp.symbol === TokenType.intLiteral ||
      exp.symbol === TokenType.stringLiteral)
  );
}

function isVariable(exp) {
  return exp instanceof Token && exp.symbol === TokenType.identifier;
}

function isTaggedList(exp, tag) {
  return Array.isArray(exp) && exp.length > 0 && exp[0].symbol === tag;
}

function isQuoted(exp) {
  return isTaggedList(exp, TokenType.quoteRW);
}

function isDefinition(exp) {
  return isTaggedList(exp, TokenType.defineRW);
}

function getTextOfQuotation([_, exp]) {
  return exp;
}

/**
 * @param {any[]} vars
 * @param {any[]} vals
 * @param {any[]} baseEnv
 */
function extendEnvironment(vars, vals, baseEnv) {
  if (vars.length === vals.length) {
    baseEnv.push([vars, vals]);
  } else if (vars.length < vals.length) {
    throw Error("Too many arguments supplied");
  } else {
    throw Error("Too few arguments supplied");
  }
}

/**
 * Looks up the of a variable in an environment.
 * It looks in the first frame and if it finds the variable,
 * returns the corresponding value.
 * Otherwise it searches the enclosing environment, and so on.
 * It throws an error if the variable is unbound.
 */
function lookupVariableValue(variable, value, env) {
  for (let i = env.length - 1; i >= 0; --i) {
    const [vars, vals] = env[i];
    for (let j = 0; j < vars.length; ++j) {
      if (vars[j] === variable) {
        return vals[j];
      }
    }
  }

  throw Error(`Unbound variable ${variable}`);
}

/**
 * Sets the value of a variable in the specified environment
 * or throws an error if the variable is unbound.
 */
function setVariableValue(variable, value, env) {
  for (let i = env.length - 1; i >= 0; --i) {
    const [vars, vals] = env[i];
    for (let j = 0; j < vars.length; ++j) {
      if (vars[j] === variable) {
        vals[j] = value;
        return;
      }
    }
  }

  throw Error(`Unbound variable ${variable}`);
}
