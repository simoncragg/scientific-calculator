import type { PayloadAction } from "@reduxjs/toolkit";
import type { CalcState, UpdateCurrentOperandPayload } from "../types";

import getDigitCount from "../utils/getDigitCount";
import { MAX_DIGITS } from "../constants";

function updateCurrentOperand(calc: CalcState, action: PayloadAction<UpdateCurrentOperandPayload>) {
  const { input } = action.payload;
  if (isMaxLength(calc)) return;
  if (input === "." && calc.currentOperand.includes(".")) return;

  if (calc.lastInput === "sex") {
    calc.currentOperand = "0";
  }

  calc.currentOperand = isFirstDigit(input, calc) 
    ? input
    : `${calc.currentOperand}${input}`;

  calc.output = calc.numericMode === "decimal"
    ? calc.currentOperand
    : `${calc.output}${input}`;

  calc.lastInput = input;
  calc.isHyperbolic = false;
}

function isMaxLength(calc: CalcState): boolean {
  if (calc.numericMode === "decimal") {
    return getDigitCount(calc.currentOperand) === MAX_DIGITS;
  }

  if (calc.numericMode === "fraction") {
    const len1 = calc
      .fractionInputs
      .reduce((acc, val) => 
        acc + getDigitCount(val.toString() + 1), 0);

    const len2 = getDigitCount(calc.currentOperand);
    return len1 + len2 === MAX_DIGITS;
  }

  return false;
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

export default updateCurrentOperand;
