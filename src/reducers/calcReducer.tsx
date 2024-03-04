import type {
  Action,
  AdjustVoltagePayload,
  CalcState,
  GetLastOperatorResultType,
  OperandAffixes,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import evaluate from '../utils/evaluate';
import formatNumberString from "../utils/formatNumberString";
import getDigitCount from "../utils/getDigitCount";
import { ActionTypes, INVERT_SYMBOL, MAX_DIGITS } from '../constants';

export default function calcReducer(calc: CalcState, action: Action): CalcState {

  switch (action.type) {

    case ActionTypes.ALL_CLEAR:
      return allClear();

    case ActionTypes.CLEAR:
      return clear(calc);

    case ActionTypes.UPDATE_CURRENT_OPERAND:
      const { entry } = action.payload as UpdateCurrentOperandPayload; 
      return updateCurrentOperand(calc, entry);

    case ActionTypes.UPDATE_EXPRESSION:
      const { operator } = action.payload as UpdateExpressionPayload; 
      return updateExpression(calc, operator);

    case ActionTypes.EVALUATE_EXPRESSION:
      return evaluateExpression(calc);

    case ActionTypes.INVERT_NUMBER:
      return invertNumber(calc);
  
    case ActionTypes.PERCENT:
      return percent(calc);

    case ActionTypes.SQUARE:
      return square(calc);

    case ActionTypes.SQUARE_ROOT:
      return squareRoot(calc);

    case ActionTypes.ADJUST_VOLTAGE:
      const { voltageLevel } = action.payload as AdjustVoltagePayload;
      return adjustVoltage(calc, voltageLevel);

    default:
      return calc;
  }
}

function allClear(): CalcState {
  return {
    expression: [],
    currentOperand: "0",
    output: "0",
    voltageLevel: 1.0,
  };
}

function clear(calc: CalcState): CalcState {
  return {
    ...calc,
    currentOperand: "0",
    lastInput: "AC",
    lastOperand: undefined,
    lastOperation: undefined,
    output: "0",
  };
}

function invertNumber(calc: CalcState): CalcState {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;

  const invertedNumber = parseFloat(calc.currentOperand) * -1;
  const strInvertedNumber = invertedNumber.toString();
  const output = formatNumberString(strInvertedNumber, { maxDigits: MAX_DIGITS });

  return {
    ...calc,
    currentOperand: strInvertedNumber,
    lastInput: INVERT_SYMBOL,
    output,
  };
}

function percent(calc: CalcState): CalcState {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;  

  const expression = [
    ...calc.expression, 
    calc.currentOperand, 
    "%"
  ];

  const result = evaluate(expression);
  const formattedResult = formatNumberString(result, { maxDigits: MAX_DIGITS });
  const lastOperation = getLastOperation(expression);

  return {
    ...calc,
    currentOperand: formattedResult,
    expression: [],
    lastInput: "%",
    lastOperation,
    output: formattedResult,
  };
}

function square(calc: CalcState): CalcState {
  const result = evaluate([calc.currentOperand, "^", "2"]);
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS });
  const { lastOperator } = getLastOperator(calc.expression);
  const lastOperation = lastOperator
    ? { prefix: "", suffix: `${lastOperator}${result}`}
    : { prefix: "", suffix: "^2" };

  return {
    ...calc,
    currentOperand: result,
    lastOperand: calc.currentOperand,
    lastInput: "square",
    lastOperation,
    output,
  };
}

function squareRoot(calc: CalcState): CalcState {
  const result = evaluate([`sqrt(${calc.currentOperand})`]);
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS });
  const { lastOperator } = getLastOperator(calc.expression);
  const lastOperation = lastOperator
    ? { prefix: "", suffix: `${lastOperator}${result}`}
    : { prefix: "sqrt(", suffix: ")" };

  return {
    ...calc,
    currentOperand: result,
    lastOperand: calc.currentOperand,
    lastInput: "sqrt",
    lastOperation,
    output,
  };
}

function updateCurrentOperand (calc: CalcState, digit: string): CalcState {
  if (getDigitCount(calc.currentOperand) === MAX_DIGITS) return calc;
  if (digit === "." && calc.currentOperand.includes(".")) return calc;

  const isFirstDigit = calc.currentOperand === "0" && digit !== "." || calc.lastInput === "=";
  const currentOperand = isFirstDigit ? digit : calc.currentOperand + digit;
  const output = formatNumberString(currentOperand, { maxDigits: MAX_DIGITS });

  return {
    ...calc,
    currentOperand,
    lastInput: digit,
    output,
  };
}

function updateExpression (calc: CalcState, newOperator: string): CalcState {
  if (newOperator === calc.lastInput) return calc;
  
  const operatorHasChanged = isOperator(calc.lastInput);

  const currentOperand = !operatorHasChanged
    ? resolveCurrentOperand(calc)
    : calc.lastOperand ?? "0";

  const expression = !operatorHasChanged
    ? [...calc.expression, currentOperand]
    : calc.expression.slice(0, -1);
  
  const output = buildOutputForNewOperator(currentOperand, expression, newOperator);

  return {
    ...calc,
    currentOperand: "",
    expression: [...expression, newOperator],
    lastOperand: currentOperand,
    lastInput: newOperator,
    output,
  };
}

function evaluateExpression(calc: CalcState): CalcState {
  if (calc.lastInput === "=") {
    return repeatLastOperation(calc);
  }
  
  const currentOperand = resolveCurrentOperand(calc);
  const expression = [...calc.expression, currentOperand];
  const result = evaluate(expression);
  const lastOperation = resolveLastOperation(calc, expression);
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true });

  return {
    ...calc,
    currentOperand: result,
    expression: [],
    lastInput: "=",
    lastOperation,
    output,
  };
}

function repeatLastOperation(calc: CalcState): CalcState {
  const { prefix, suffix } = calc.lastOperation!;
  const expression = [prefix, calc.currentOperand, suffix];
  const result = evaluate(expression);
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true });

  return {
    ...calc,
    currentOperand: result,
    output,
  };
}

function adjustVoltage(calc: CalcState, voltageLevel: number): CalcState {
  return {
    ...calc,
    voltageLevel,
  }
}

function resolveCurrentOperand(calc: CalcState): string {
  return calc.currentOperand !== ""
    ? calc.currentOperand
    : calc.lastOperand ?? "0";
}

function resolveLastOperation(calc: CalcState, expression: string[]): OperandAffixes {
  return calc.lastOperation
    ? calc.lastOperation
    : getLastOperation(expression);
}

function getLastOperation(expression: string[]): OperandAffixes {

  const { lastOperator, index } = getLastOperator(expression);
  
  if (lastOperator) {
    return { 
      prefix: "",
      suffix: expression.slice(index).join(""),
    }
  }

  if (expression[0].startsWith("sqrt")) {
    return {
      prefix: "sqrt(",
      suffix: ")",
    }
  }

  return {
    prefix: "",
    suffix: "",
  };
}

function buildOutputForNewOperator(
  operand: string, 
  expression: string[], 
  newOperator: string,
): string {

  const expressionToEvaluate = getExpressionToEvaluate(expression, newOperator);
  if (expressionToEvaluate) {
    const evaluation = evaluate(expressionToEvaluate);
    return formatNumberString(evaluation.toString(), { maxDigits: MAX_DIGITS });
  }

  return formatNumberString(operand, { maxDigits: MAX_DIGITS });
}

function getExpressionToEvaluate(
  expression: string[], 
  newOperator: string
): string[] | undefined {

  const { lastOperator, index } = getLastOperator(expression);

  if (!lastOperator) {
    return !isNumber(expression.join())
      ? expression
      : undefined
  }

  if (isDivideOrMultiply(newOperator) && isAddOrSubtract(lastOperator)) {
    return undefined;
  }

  return expression.slice(index - 1);
}

function getLastOperator(expression: string[]): GetLastOperatorResultType {
  for (let i = expression.length - 1; i > -1; i--) {
    if (isOperator(expression[i])) {
      return { 
        lastOperator: expression[i],
        index: i
      };
    }
  }
  
  return { 
    lastOperator: undefined,
    index: -1
  };
}
 
function isOperator(candidate: string | undefined): boolean {
  return candidate 
    ? "/*-+".includes(candidate)
    : false;
}

function isNumber(candidate: string): boolean {
  return !isNaN(Number(candidate));
}

function isAddOrSubtract(operator: string): boolean {
  return "+-".indexOf(operator) > -1;
}

function isDivideOrMultiply(operator: string): boolean {
  return "/*".indexOf(operator) > -1;
}
