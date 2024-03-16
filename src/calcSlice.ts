import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { 
  AdjustVoltagePayload, 
  CalcState, 
  ExecuteFunctionPayload, 
  OperandAffixes, 
  OperatorType, 
  UpdateCurrentOperandPayload, 
  UpdateExpressionPayload
} from "./types";

import ExpressionBuilder from "./classes/ExpressionBuilder";
import ExpressionParser from "./classes/ExpressionParser";
import evaluate from "./utils/evaluate";
import formatNumber from "./utils/formatNumber";
import getDigitCount from "./utils/getDigitCount";
import { ANGLE_MODES, MAX_DIGITS } from "./constants";
import { isHyperbolic, isArc, isAreaHyperbolic } from "./utils/isTrigonometric";
import { convertFromRadians } from "./utils/convertFromRadians";

export const initialState: CalcState = {
  isShiftEnabled: false,
  isHyperbolic: false,
  angleMode: "deg",
  currentOperand: "0",
  expression: [],
  output: "0",
  voltageLevel: 1.0,
};

export const calcSlice = createSlice({
  name: "calc",
  initialState,
  reducers: {

    adjustVoltage: (calc, action: PayloadAction<AdjustVoltagePayload>) => {
      calc.voltageLevel = action.payload.voltageLevel;
    },

    allClear: calc => {
      calc.angleMode = calc.angleMode;
      calc.expression = [];
      calc.currentOperand = "0";
      calc.output = "0";
      calc.voltageLevel = 1.0;
      calc.lastInput = undefined;
      calc.lastOperand = undefined;
      calc.lastOperation = undefined;
      calc.isHyperbolic = false;
    },

    clear: calc => {
      calc.currentOperand = "0";
      calc.output = "0";
      calc.lastInput = undefined;
      calc.lastOperand = undefined;
      calc.lastOperation = undefined;
      calc.isHyperbolic = false;
    },

    cycleDrgMode: calc => {
      const currentIndex = ANGLE_MODES.indexOf(calc.angleMode);
      const nextIndex = (currentIndex + 1) % ANGLE_MODES.length;
      calc.angleMode = ANGLE_MODES[nextIndex];
    },

    evaluateExpression: calc => {
      if (calc.lastInput === "=") {
        const result = repeatLastOperation(calc);
        calc.currentOperand = result.toString(),
        calc.output = formatNumber(result, MAX_DIGITS);
        calc.isHyperbolic = false;
        return;
      }

      const currentOperand = resolveCurrentOperand(calc);
      const expression = [...calc.expression, currentOperand];
      const result = evaluate(expression);
    
      calc.currentOperand = result.toString();
      calc.expression = [];
      calc.lastInput = "=";
      calc.lastOperation = resolveLastOperation(calc, expression);
      calc.output = formatNumber(result, MAX_DIGITS);
      calc.isHyperbolic = false;
    },

    executeFunction: (calc, action: PayloadAction<ExecuteFunctionPayload>) => {
      const { func } = action.payload;

      if (isHyperbolic(func) || isAreaHyperbolic(func)) {
        calc.output = "- TODO -";
        return;
      }

      const expression = ExpressionBuilder.build(func, calc.currentOperand, calc.angleMode);
      let result = evaluate([expression]);
      
      if (isArc(func)) {
        result = convertFromRadians(result, calc.angleMode);
      }
          
      calc.currentOperand = result.toString();
      calc.output = formatNumber(result, MAX_DIGITS);
      calc.lastOperand = result.toString();
      calc.lastInput = func;
      calc.isHyperbolic = false;

      const parser = new ExpressionParser(calc.expression);
      calc.lastOperation = parser.determineLastOperation(func, result);
    },

    invertNumber: calc => {
      if (calc.lastInput === "=" && calc.output === "Error") return;
      const invertedNumber = parseFloat(calc.currentOperand) * -1;
      calc.currentOperand = invertedNumber.toString();
      calc.output = formatNumber(invertedNumber, MAX_DIGITS);
      calc.lastInput = "+/-";
      calc.isHyperbolic = false;
    },

    percent: calc => {
      if (calc.lastInput === "=" && calc.output === "Error") return;
    
      const expression = [
        ...calc.expression, 
        calc.currentOperand, 
        "%"
      ];
    
      const result = evaluate(expression);
      const formattedResult = formatNumber(result, MAX_DIGITS);
      const lastOperation = new ExpressionParser(expression).getLastOperation();
    
      calc.currentOperand = formattedResult;
      calc.output = formattedResult;
      calc.expression = [];
      calc.lastOperation = lastOperation;
      calc.lastInput =  "%";
      calc.isHyperbolic = false;
    },
  
    todo: calc => {
      calc.output = "- TODO -";
    },

    toggleHyperbolic: calc => {
      calc.isHyperbolic = !calc.isHyperbolic;
    },

    toggleShift: calc => {
      calc.isShiftEnabled = !calc.isShiftEnabled;
    },

    updateCurrentOperand: (calc, action: PayloadAction<UpdateCurrentOperandPayload>) => {
      const { input } = action.payload;
      if (getDigitCount(calc.currentOperand) === MAX_DIGITS) return;
      if (input === "." && calc.currentOperand.includes(".")) return;
    
      const currentOperand = isFirstDigit(input, calc) 
        ? input
        : calc.currentOperand + input; 

      calc.currentOperand = currentOperand;
      calc.output = currentOperand;
      calc.lastInput = input;
      calc.isHyperbolic = false;
    },

    updateExpression: (calc, action: PayloadAction<UpdateExpressionPayload>) => {
      const { operator } = action.payload;
      if (operator === calc.lastInput) return;
      
      const currentOperand = resolveCurrentOperand(calc);
    
      const expression = calc.currentOperand !== ""
        ? [...calc.expression, currentOperand]
        : calc.expression.slice(0, -1);

      calc.expression = [...expression, operator];
      calc.currentOperand = "";
      calc.output = buildOutputForNewOperator(currentOperand, expression, operator);
      calc.lastOperand = currentOperand;
      calc.lastInput = operator;
    },
  }
});

export const { 
  adjustVoltage,
  allClear, 
  clear, 
  cycleDrgMode,
  evaluateExpression,
  executeFunction,
  invertNumber, 
  percent, 
  todo,
  toggleHyperbolic,
  toggleShift,
  updateCurrentOperand,
  updateExpression,
 } = calcSlice.actions;

// Helper functions

function repeatLastOperation(calc: CalcState): number {
  const { prefix, suffix } = calc.lastOperation!;
  const expression = [prefix, calc.currentOperand, suffix];
  return evaluate(expression);
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

export default calcSlice.reducer;
