import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

import formatNumber from "../utils/formatNumber";
import { MAX_DIGITS } from "../constants";

function invertNumber(calc: Draft<CalcState>) {
  if (calc.lastInput === "=" && calc.output === "Error") return;
  const invertedNumber = parseFloat(calc.currentOperand) * -1;
  calc.currentOperand = invertedNumber.toString();
  calc.output = formatNumber(invertedNumber, MAX_DIGITS);
  calc.isHyperbolic = false;
  calc.lastInput = "+/-";
}

export default invertNumber;
