import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { 
  AdjustVoltagePayload, 
  CalcState, 
  ExecuteFunctionPayload, 
  FunctionType, 
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
import isOperator from "./utils/isOperator";
import { ANGLE_MODES, MAX_DIGITS } from "./constants";
import { isArc, isAreaHyperbolic, isTrigonometric } from "./utils/isTrigonometric";
import { convertFromRadians } from "./utils/convertFromRadians";

export const initialState: CalcState = {
  isShiftEnabled: false,
  isHyperbolic: false,
  angleMode: "deg",
  currentOperand: "0",
  sexagesimalInputs: [],
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
      calc.repeatOperationAffixes = undefined;
      calc.isShiftEnabled = false;
      calc.isHyperbolic = false;
      calc.sexagesimalInputs = [];
    },

    clear: calc => {
      calc.currentOperand = "0";
      calc.output = "0";
      calc.lastInput = undefined;
      calc.lastOperand = undefined;
      calc.repeatOperationAffixes = undefined;
      calc.isShiftEnabled = false;
      calc.isHyperbolic = false;
      calc.sexagesimalInputs = [];
    },

    cycleDrgMode: calc => {
      const currentIndex = ANGLE_MODES.indexOf(calc.angleMode);
      const nextIndex = (currentIndex + 1) % ANGLE_MODES.length;
      calc.angleMode = ANGLE_MODES[nextIndex];
    },

    decimalToSexagesimal: calc => {
      const decimal = parseFloat(calc.currentOperand);
      const isNegative = decimal < 0;
      const absoluateDecimal = Math.abs(decimal);
      const degrees = Math.floor(absoluateDecimal);
      const remainingMinutes = (absoluateDecimal - degrees) * 60;
      const minutes = Math.floor(remainingMinutes);
      const remainingSeconds = (remainingMinutes - minutes) * 60;
      const seconds = Math.round(remainingSeconds);
      const sign = isNegative ? "-" : "";
      calc.output = `${sign}${degrees}°${minutes}’${seconds}”`;
    },

    evaluateExpression: calc => {
      if (calc.lastInput === "=") {
        const result = repeatLastOperation(calc);
        calc.currentOperand = result.toString(),
        calc.output = formatNumber(result, MAX_DIGITS);
        calc.isHyperbolic = false;
        calc.sexagesimalInputs = [];
        return;
      }

      const currentOperand = resolveCurrentOperand(calc);
      const expression = [...calc.expression, currentOperand];
      const result = evaluate(expression);
    
      calc.currentOperand = result.toString();
      calc.expression = [];
      calc.repeatOperationAffixes = calc.repeatOperationAffixes ?? new ExpressionParser(expression).getRepeatOperationAffixes();
      calc.output = formatNumber(result, MAX_DIGITS);
      calc.isHyperbolic = false;
      calc.lastInput = "=";
      calc.sexagesimalInputs = [];
    },

    executeFunction: (calc, action: PayloadAction<ExecuteFunctionPayload>) => {
      const { func } = action.payload;
      const expression = ExpressionBuilder.build(func, calc.currentOperand, calc.angleMode);
      let result = evaluate([expression]);
      
      if (isArc(func) || isAreaHyperbolic(func)) {
        result = convertFromRadians(result, calc.angleMode);
      }
          
      calc.currentOperand = result.toString();
      calc.output = formatNumber(result, MAX_DIGITS);
      calc.lastOperand = result.toString();
      calc.isHyperbolic = false;
      calc.repeatOperationAffixes = getRepeatOperationAffixes(calc, func, result);
      calc.lastInput = func;
    },

    expOrPi: calc => {
      if (calc.currentOperand === "0" || isOperator(calc.lastInput)) {
        const pi = Math.PI;
        calc.currentOperand = pi.toString();
        calc.output = formatNumber(pi, MAX_DIGITS);
        calc.lastInput = "PI";
        return;
      }
      // TODO: Exp input mode
      calc.output = "- TODO -";
    },

    inputSexagesimal: calc => {
      const input = parseFloat(calc.currentOperand || calc.output);
      const isNegative = calc.sexagesimalInputs[0] < 0;
      calc.sexagesimalInputs.push(input);

      const total = calc.sexagesimalInputs.reduce((acc, val, i) => {
        const absoluteValue = Math.abs(val);
        return acc + absoluteValue / Math.pow(60, i);
      }, 0);

      const adjustedTotal = isNegative ? 0 - Math.abs(total) : Math.abs(total);
      calc.output = formatNumber(adjustedTotal, MAX_DIGITS);
      calc.currentOperand = adjustedTotal.toString();
      calc.lastInput = "SEX";
      
      if (calc.sexagesimalInputs.length === 3) {
        calc.sexagesimalInputs= [];
      }
    },

    invertNumber: calc => {
      if (calc.lastInput === "=" && calc.output === "Error") return;
      const invertedNumber = parseFloat(calc.currentOperand) * -1;
      calc.currentOperand = invertedNumber.toString();
      calc.output = formatNumber(invertedNumber, MAX_DIGITS);
      calc.isHyperbolic = false;
      calc.lastInput = "+/-";
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
      const parser = new ExpressionParser(expression);

      calc.currentOperand = formattedResult;
      calc.output = formattedResult;
      calc.expression = [];
      calc.repeatOperationAffixes = parser.getRepeatOperationAffixes();
      calc.isHyperbolic = false;
      calc.lastInput =  "%";
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

      if (calc.lastInput === "SEX") {
        calc.currentOperand = "0";
      }
    
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
      calc.sexagesimalInputs = [];
    },
  }
});

// Helper functions

function getRepeatOperationAffixes(calc: CalcState, func: FunctionType, result: number): OperandAffixes {
  const parser = new ExpressionParser([...calc.expression, result.toString()]);
  const { prefix, suffix } = parser.getRepeatOperationAffixes();
  
  if (prefix + suffix !== "") {
    return { prefix, suffix };
  }

  if (isTrigonometric(func)) {
    return { 
      prefix: "", 
      suffix: "",
    };
  }
  
  return {
    prefix: `${func}(`, 
    suffix: `)`,
  };
}

function repeatLastOperation(calc: CalcState): number {
  const { prefix, suffix } = calc.repeatOperationAffixes!;
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

export const { 
  adjustVoltage,
  allClear, 
  clear, 
  cycleDrgMode,
  decimalToSexagesimal,
  evaluateExpression,
  executeFunction,
  expOrPi,
  inputSexagesimal,
  invertNumber, 
  percent, 
  todo,
  toggleHyperbolic,
  toggleShift,
  updateCurrentOperand,
  updateExpression,
 } = calcSlice.actions;
