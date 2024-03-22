import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

import isOperator from "../utils/isOperator";
import formatNumber from "../utils/formatNumber";
import { MAX_DIGITS } from "../constants";

function expOrPi(calc: Draft<CalcState>) {
  if (calc.currentOperand === "0" || isOperator(calc.lastInput)) {
    const pi = Math.PI;
    calc.currentOperand = pi.toString();
    calc.output = formatNumber(pi, MAX_DIGITS);
    calc.lastInput = "PI";
    return;
  }
  // TODO: Exp input mode
  calc.output = "- TODO -";
}

export default expOrPi;
