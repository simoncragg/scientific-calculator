import type { Draft, PayloadAction } from "@reduxjs/toolkit";
import type { CalcState, UpdateCurrentOperandPayload } from "../types";

import getDigitCount from "../utils/getDigitCount";
import { MAX_DIGITS } from "../constants";

function updateCurrentOperand(calc: Draft<CalcState>, action: PayloadAction<UpdateCurrentOperandPayload>) {
  const { input } = action.payload;
  if (getDigitCount(calc.currentOperand) === MAX_DIGITS) return;
  if (input === "." && calc.currentOperand.includes(".")) return;

  if (calc.lastInput === "sex") {
    calc.currentOperand = "0";
  }

  const currentOperand = isFirstDigit(input, calc) 
    ? input
    : calc.currentOperand + input; 

  calc.currentOperand = currentOperand;
  calc.output = currentOperand;
  calc.lastInput = input;
  calc.isHyperbolic = false;
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
