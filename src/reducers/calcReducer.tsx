import type {
  Action,
  AdjustVoltagePayload,
  CalcState,
  AngleUnit,
  ExecuteFunctionPayload,
  FunctionType,
  OperandAffixes,
  OperatorType,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import ExpressionParser from "../classes/ExpressionParser";
import convertToRadians from "../utils/convertToRadians";
import evaluate from '../utils/evaluate';
import formatNumber from "../utils/formatNumber";
import getDigitCount from "../utils/getDigitCount";
import isTrigonometric from "../utils/isTrigonometric";
import { ActionTypes, ANGLE_MODES, MAX_DIGITS } from '../constants';
import ExpressionBuilder from "../classes/ExpressionBuilder";

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

    case ActionTypes.EXECUTE_FUNCTION:
      const { func } = action.payload as ExecuteFunctionPayload;
      return executeFunction(func, calc);

    case ActionTypes.ADJUST_VOLTAGE:
      const { voltageLevel } = action.payload as AdjustVoltagePayload;
      return adjustVoltage(calc, voltageLevel);

    default:
      return calc;
  }
}

function allClear(calc: CalcState): CalcState {
  return {
    angleMode: calc.angleMode,
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

function cycleDrgMode(calc: CalcState): CalcState {
  const currentIndex = ANGLE_MODES.indexOf(calc.angleMode);
  const nextIndex = (currentIndex + 1) % ANGLE_MODES.length;

  return {
    ...calc,
    angleMode: ANGLE_MODES[nextIndex],
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

function executeFunction(func: FunctionType, calc: CalcState): CalcState {

  const expression = ExpressionBuilder.build(func, calc.currentOperand, calc.angleMode);
  let result = evaluate([expression]);

  const output = formatNumber(result, MAX_DIGITS);
  const parser = new ExpressionParser(calc.expression);
  const lastOperation = parser.determineLastOperation(func, result);
  
  return {
    ...calc,
    currentOperand: result.toString(),
    lastOperand: calc.currentOperand,
    lastInput: func,
    lastOperation,
    output,
  };
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
