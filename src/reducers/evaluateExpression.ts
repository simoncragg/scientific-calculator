import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

import evaluate from "../utils/evaluate";
import formatNumber from "../utils/formatNumber";
import resolveCurrentOperand from "../utils/resolveCurrentOperand";
import { MAX_DIGITS } from "../constants";
import ExpressionParser from "../classes/ExpressionParser";

function evaluateExpression(calc: Draft<CalcState>) {
  if (calc.lastInput === "=") {
    repeatLastOperation(calc);
    return;
  }

  const currentOperand = resolveCurrentOperand(calc);
  const expression = [...calc.expression, currentOperand];
  const result = evaluate(expression);

  calc.currentOperand = result.toString();
  calc.expression = [];
  calc.repeatOperationAffixes = resolveRepeatOperationAffixes(calc, expression);
  calc.output = formatNumber(result, MAX_DIGITS);
  calc.isHyperbolic = false;
  calc.lastInput = "=";
  calc.sexagesimalInputs = [];
}

function repeatLastOperation(calc: Draft<CalcState>) {
  const { prefix, suffix } = calc.repeatOperationAffixes!;
  const expression = [prefix, calc.currentOperand, suffix];
  const result = evaluate(expression);
  calc.currentOperand = result.toString(),
  calc.output = formatNumber(result, MAX_DIGITS);
  calc.isHyperbolic = false;
  calc.sexagesimalInputs = [];
}

function resolveRepeatOperationAffixes(calc: CalcState, expression: string[])  {
  return calc.repeatOperationAffixes 
    ?? new ExpressionParser(expression).getRepeatOperationAffixes();
}

export default evaluateExpression;
