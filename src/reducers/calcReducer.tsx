import type {
  Action,
  AdjustVoltagePayload,
  CalcState,
  OperandAffixes,
  OperatorType,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import ExpressionParser from "../classes/ExpressionParser";
import evaluate from '../utils/evaluate';
import formatNumber from "../utils/formatNumber";
import getDigitCount from "../utils/getDigitCount";
import { ActionTypes, DRG_MODES, MAX_DIGITS } from '../constants';

export default function calcReducer(calc: CalcState, action: Action): CalcState {

  switch (action.type) {

    case ActionTypes.ALL_CLEAR:
      return allClear(calc);

    case ActionTypes.CLEAR:
      return clear(calc);

    case ActionTypes.CYCLE_DRG_MODE:
      return cycleDrgMode(calc);

    case ActionTypes.UPDATE_CURRENT_OPERAND:
      const { input } = action.payload as UpdateCurrentOperandPayload; 
      return updateCurrentOperand(calc, input);

    case ActionTypes.UPDATE_EXPRESSION:
      const { operator } = action.payload as UpdateExpressionPayload; 
      return updateExpression(calc, operator);

    case ActionTypes.EVALUATE_EXPRESSION:
      return evaluateExpression(calc);

    case ActionTypes.INVERT_NUMBER:
      return invertNumber(calc);
  
    case ActionTypes.PERCENT:
      return percent(calc);

    case ActionTypes.SQUARE_ROOT:
        return squareRoot(calc);

    case ActionTypes.SQUARE:
      return square(calc);

    case ActionTypes.LOG:
      return log(calc);

    case ActionTypes.POWER_OF_TEN:
      return powerOfTen(calc);

    case ActionTypes.NATURAL_LOG:
      return naturalLog(calc);

    case ActionTypes.EXP_X:
      return expX(calc);

    case ActionTypes.SIN:
      return sin(calc);

    case ActionTypes.ADJUST_VOLTAGE:
      const { voltageLevel } = action.payload as AdjustVoltagePayload;
      return adjustVoltage(calc, voltageLevel);

    default:
      return calc;
  }
}

function allClear(calc: CalcState): CalcState {
  return {
    drgMode: calc.drgMode,
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
    lastInput: undefined,
    lastOperand: undefined,
    lastOperation: undefined,
    output: "0",
  };
}

function invertNumber(calc: CalcState): CalcState {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;

  const invertedNumber = parseFloat(calc.currentOperand) * -1;
  const output = formatNumber(invertedNumber, MAX_DIGITS);

  return {
    ...calc,
    currentOperand: invertedNumber.toString(),
    lastInput: "+/-",
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
  const formattedResult = formatNumber(result, MAX_DIGITS);
  const lastOperation = new ExpressionParser(expression).getLastOperation();

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
  return applyFunc("square", calc);
}

function squareRoot(calc: CalcState): CalcState {
  return applyFunc("sqrt", calc);
}

function log(calc: CalcState): CalcState {
  return applyFunc("log10", calc);
}

function powerOfTen(calc: CalcState): CalcState {
  return applyFunc("powerOfTen", calc);
}

function naturalLog(calc: CalcState): CalcState {
  return applyFunc("log", calc);
}

function expX(calc: CalcState): CalcState {
  return applyFunc("exp", calc);
}

function sin(calc: CalcState): CalcState {
  return applyFunc("sin", calc);
}

function cycleDrgMode(calc: CalcState): CalcState {
  const currentIndex = DRG_MODES.indexOf(calc.drgMode);
  const nextIndex = (currentIndex + 1) % DRG_MODES.length;

  return {
    ...calc,
    drgMode: DRG_MODES[nextIndex],
  };
}

function updateCurrentOperand (calc: CalcState, input: string): CalcState {
  if (getDigitCount(calc.currentOperand) === MAX_DIGITS) return calc;
  if (input === "." && calc.currentOperand.includes(".")) return calc;

  const currentOperand = isFirstDigit(input, calc) ? input : calc.currentOperand + input;
  const output = currentOperand;

  return {
    ...calc,
    currentOperand,
    lastInput: input,
    output,
  };
}

function updateExpression (calc: CalcState, newOperator: OperatorType): CalcState {
  if (newOperator === calc.lastInput) return calc;
  
  const currentOperand = resolveCurrentOperand(calc);

  const expression = calc.currentOperand !== ""
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
  const output = formatNumber(result, MAX_DIGITS);

  return {
    ...calc,
    currentOperand: result.toString(),
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
  const output = formatNumber(result, MAX_DIGITS);

  return {
    ...calc,
    currentOperand: result.toString(),
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
    : new ExpressionParser(expression).getLastOperation();
}

function applyFunc(func: string, calc: CalcState): CalcState {
  const isTrig = isTrigonometric(func);
  const mode = isTrig ? ` ${calc.drgMode}` : "";

  const expression = [`${func}(${calc.currentOperand}${mode})`];
  const result = evaluate(expression);
  const output = formatNumber(result, MAX_DIGITS);
  const lastOperation = determineLastOperation(func, mode, calc.expression, result);
  
  return {
    ...calc,
    currentOperand: result.toString(),
    lastOperand: calc.currentOperand,
    lastInput: func,
    lastOperation,
    output,
  };
}

function isTrigonometric(func: string) {
  return ["sin", "cos", "tan"].includes(func);
}

function determineLastOperation(
  func: string, 
  mode: string,
  expression: string[],
  result: number
): OperandAffixes { 

  const parser = new ExpressionParser(expression);
  const { lastOperator } = parser.getLastOperator();

  return lastOperator
    ? { prefix: "", suffix: `${lastOperator}${result}`}
    : { prefix: `${func}(`, suffix: `${mode})` };
}

function buildOutputForNewOperator(
  operand: string, 
  expression: string[], 
  newOperator: OperatorType,
): string {

  const parser = new ExpressionParser(expression);
  const expressionToEvaluate = parser.getExpressionToEvaluate(newOperator);
  if (expressionToEvaluate) {
    const evaluation = evaluate(expressionToEvaluate);
    return formatNumber(evaluation, MAX_DIGITS);
  }

  return formatNumber(parseFloat(operand), MAX_DIGITS);
}

function isFirstDigit(input: string, calc: CalcState) {
  return calc.currentOperand === "0" && 
    input !== "." || 
    calc.lastInput === "=" ||
    isFunction(calc.lastInput)
}

function isFunction(input: string | undefined): boolean {
  return input !== undefined &&
    input !== "." && 
    input !== "+/-" &&
    isNaN(Number(input));
}
