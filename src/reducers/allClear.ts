import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

function allClear(calc: Draft<CalcState>) {
  calc.numericMode = "decimal";
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
  calc.fractionInputs = [];
  calc.sexagesimalInputs = [];
};

export default allClear;
