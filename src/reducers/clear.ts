import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

function clear(calc: Draft<CalcState>) {
  calc.currentOperand = "0";
  calc.output = "0";
  calc.lastInput = undefined;
  calc.lastOperand = undefined;
  calc.repeatOperationAffixes = undefined;
  calc.isShiftEnabled = false;
  calc.isHyperbolic = false;
  calc.sexagesimalInputs = [];
}

export default clear;
