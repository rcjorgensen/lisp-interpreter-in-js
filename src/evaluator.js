import { Token } from "./token.js";
import { TokenType } from "./token-type.js";
import { Environment } from "./environment.js";

/**
 * @param {Environment} env
 */
export function evaluate(exp, env) {
  if (isSelfEvaluating(exp)) {
    return exp;
  } else if (isVariable(exp)) {
    return env.lookup(exp);
  } else if (isQuoted(exp)) {
    return getTextOfQuotation(exp);
  } else if (isAssignment(exp)) {
    return evalAssignment(exp, env);
  } else if (isDefinition(exp)) {
    return evalDefinition(exp, env);
  } else if (isIf(exp)) {
    return evalIf(exp, env);
  } else if (isLambda(exp)) {
    return makeProcedure(getLambdaParameters(exp), getLambdaBody(exp), env);
  } else if (isBegin(exp)) {
    return evalSequence(getBeginActions(exp), env);
  } else if (isCond(exp)) {
    return evaluate(condToIf(exp), env);
  } else if (isApplication(exp)) {
    return apply(
      evaluate(getOperator(exp), env),
      listOfValues(getOperands(exp), env),
    );
  } else {
    throw Error(`Unknown expression type ${JSON.stringify(exp)}`);
  }
}

function apply(procedure, args) {
  if (isPrimitiveProcedure(procedure)) {
    return applyPrimitiveProcedure(procedure, args);
  } else if (isCompoundProcedure(procedure)) {
    return evalSequence(
      getProcedureBody(procedure),
      extendEnvironment(
        getProcedureParamters(procedure),
        args,
        getProcedureEnvironment(procedure),
      ),
    );
  } else {
    throw Error(`Unknown procedure type ${JSON.stringify(procedure)}`);
  }
}

/**
 * @param {any[]} exps
 * @param {Environment} env
 */
function listOfValues(exps, env) {
  return exps.map((exp) => evaluate(exp, env));
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

function isAssignment(exp) {
  return isTaggedList(exp, TokenType.setRW);
}

function isDefinition(exp) {
  return isTaggedList(exp, TokenType.defineRW);
}

function isLambda(exp) {
  return isTaggedList(exp, TokenType.lambdaRW);
}

function isIf(exp) {
  return isTaggedList(exp, TokenType.ifRW);
}

function isBegin(exp) {
  return isTaggedList(exp, TokenType.beginRW);
}

function isCond(exp) {
  return isTaggedList(exp, TokenType.condRW);
}

function isApplication(exp) {
  return Array.isArray(exp);
}

function getTextOfQuotation([_, exp]) {
  return exp;
}

function getAssignmentVariable(exp) {
  return exp[1];
}

function getAssignmentValue(exp) {
  return exp[2];
}

/**
 * Definitions have the form
 * `(define <var> <value>)`
 * or the form
 * ```
 * (define (<var> <parameter_1> ... <parameter_n>)
 *    <body>)
 * ```
 */
function getDefinitionVariable(exp) {
  if (exp[1] instanceof Token && exp[1].symbol === TokenType.identifier) {
    return exp[1];
  }

  return exp[1][0];
}

function getDefinitionValue(exp) {
  if (exp[1] instanceof Token && exp[1].symbol === TokenType.identifier) {
    return exp[2];
  }

  // [define, [<var>, <parameter_1>, ..., <parameter_n>], <body>]
  const parameters = exp[1].slice(1);
  const body = exp[2];
  return makeLambda(parameters, body);
}

function getOperator(exp) {
  return exp[0];
}

function getOperands(exp) {
  return exp.slice(1);
}

function getLambdaParameters(exp) {
  return exp[1][0];
}

function getLambdaBody(exp) {
  return exp[1][1];
}

function makeLambda(parameters, body) {
  return [new Token(TokenType.lambdaRW), [parameters, body]];
}

const procedureSymbol = {
  label: "procedure",
};

function makeProcedure(parameters, body, env) {
  return [new Token(procedureSymbol), parameters, body, env];
}

function isCompoundProcedure(procedure) {
  return isTaggedList(procedure, procedureSymbol);
}

const primitiveSymbol = {
  label: "primitive",
};

function isPrimitiveProcedure(proc) {
  return isTaggedList(proc, primitiveSymbol);
}

/**
 * @param {Environment} env
 */
function evalAssignment(exp, env) {
  env.set(getAssignmentVariable(exp), evaluate(getAssignmentValue(exp), env));

  return new Token(TokenType.apostrophe, undefined, "ok");
}

/**
 * @param {Environment} env
 */
function evalDefinition(exp, env) {
  env.define(
    getDefinitionVariable(exp),
    evaluate(getDefinitionValue(exp), env),
  );
}

function evalSequence(exps, env) {
  let result;
  for (const exp of exps) {
    result = evaluate(exp, env);
  }

  return result;
}

/**
 * @param {any[]} vars
 * @param {any[]} vals
 * @param {Environment} baseEnv
 */
function extendEnvironment(vars, vals, baseEnv) {
  if (vars.length === vals.length) {
    return new Environment(
      new Map(vars.map((vari, i) => [vari, vals[i]])),
      baseEnv,
    );
  } else if (vars.length < vals.length) {
    throw Error("Too many arguments supplied");
  } else {
    throw Error("Too few arguments supplied");
  }
}
