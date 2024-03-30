import Fraction from "../classes/Fraction";
import { FRACTION_BAR } from "../constants";
import type { CalcState } from "../types";

function toggleFraction(calc: CalcState) {

  updateFractionInputsIfNeeded(calc);

  const fraction = resolveFraction(calc);
  const decimal = fraction.toDecimal();  
  const useMixed = decimal >= 1 && !isMixedFraction(calc.output);
  calc.output = fraction.format(useMixed);
}

function resolveFraction(calc: CalcState) {
  return calc.fractionInputs.length > 1
    ? Fraction.fromNumberArray(calc.fractionInputs)
    : Fraction.fromDecimal(parseFloat(calc.currentOperand));
}

function updateFractionInputsIfNeeded(calc: CalcState): void {
  if (shouldUpdateFractionInputs(calc)) {
    calc.fractionInputs.push(parseInt(calc.currentOperand));    
    calc.currentOperand = "0";
  }
}

function shouldUpdateFractionInputs(calc: CalcState) {
  return (
    calc.lastInput !== "=" &&
    calc.numericMode === "fraction" && 
    calc.fractionInputs.length < 3 && 
    calc.currentOperand !== "0"
  );
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
