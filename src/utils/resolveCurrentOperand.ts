import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";
import isOperator from "./isOperator";

function resolveCurrentOperand(calc: Draft<CalcState>): string {
  return isOperator(calc.lastInput)
    ? calc.lastOperand!
    : calc.currentOperand;
}

export default resolveCurrentOperand;
