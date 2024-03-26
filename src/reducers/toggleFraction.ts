import Fraction from "../classes/Fraction";
import { FRACTION_BAR } from "../constants";
import type { CalcState } from "../types";

function toggleFraction(calc: CalcState) {

  updateFractionInputsIfNeeded(calc);
  if (calc.fractionInputs.length < 2) return;

  const fraction = Fraction.fromNumberArray(calc.fractionInputs);
  const decimal = fraction.toDecimal();  
  const useMixed = decimal >= 1 && !isMixedFraction(calc.output);
  calc.output = fraction.format(useMixed);
}

function updateFractionInputsIfNeeded(calc: CalcState): void {
  if (calc.numericMode === "fraction" && calc.fractionInputs.length < 3 && calc.currentOperand !== "0") {
    calc.fractionInputs.push(parseInt(calc.currentOperand));    
    calc.currentOperand = "0";
  }
}

function isMixedFraction(str: string) {
  return countFractionBars(str) === 2;
}

function countFractionBars(str: string) {
  return str
    .split("")
    .filter(x => x === FRACTION_BAR)
    .length;
}

export default toggleFraction;
