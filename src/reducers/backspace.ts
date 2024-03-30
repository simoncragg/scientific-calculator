import type { CalcState } from "../types";
import { FRACTION_BAR } from "../constants";

function backspace(calc: CalcState) {
  if (shouldAbort(calc)) return;
   
  updateCurrentOperand(
    calc.currentOperand.substring(0, calc.currentOperand.length - 1), calc
  );

  if (calc.numericMode === "fraction") {
    backspaceFraction(calc);
  } else {
    calc.output = calc.currentOperand !== ""
      ? calc.currentOperand
      : "0";
  }
}

function shouldAbort(calc: CalcState): boolean {
  if (calc.currentOperand === "0" && calc.numericMode === "decimal") return true;
  if (calc.lastInput === "=") return true;
  if ("0123456789.frac".includes(calc.lastInput!) === false) return true;
  return false;
}

function backspaceFraction(calc: CalcState) {
  if (isCurrentOperandEmpty(calc)) {

    updateCurrentOperand(
      calc.fractionInputs[calc.fractionInputs.length - 1].toString(), calc
    );

    removeLastFractionInput(calc);

    if (fractionInputsIsEmpty(calc)) {
      calc.numericMode = "decimal";
    }
  }

  calc.output = [...calc.fractionInputs, calc.currentOperand].join(FRACTION_BAR);
}

function isCurrentOperandEmpty(calc: CalcState): boolean {
  return calc.lastOperand === "" || calc.lastOperand === "0";
}

function updateCurrentOperand(newValue: string, calc: CalcState) {
  calc.lastOperand = calc.currentOperand;
  calc.currentOperand = newValue;
}

function removeLastFractionInput(calc: CalcState) {
  calc.fractionInputs.splice(calc.fractionInputs.length - 1, 1);
}

function fractionInputsIsEmpty(calc: CalcState): boolean {
  return calc.fractionInputs.length === 0;
}

export default backspace;
