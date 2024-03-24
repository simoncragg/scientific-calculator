import type { CalcState } from "../types";

function invertNumber(calc: CalcState) {
  if (calc.lastInput === "=" && calc.output === "Error") return;
  
  calc.currentOperand = invert(calc.currentOperand);
  calc.output = invert(calc.output);
  calc.lastInput = "+/-";
  calc.isHyperbolic = false;
}

function invert(strNumber: string): string {
  return strNumber.startsWith("-")
    ? strNumber.replace("-", "")
    : `-${strNumber}`;
}

export default invertNumber;
