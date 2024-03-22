import type { Draft, PayloadAction } from "@reduxjs/toolkit";
import type { CalcState, OperatorType, UpdateExpressionPayload } from "../types";

import ExpressionParser from "../classes/ExpressionParser";
import evaluate from "../utils/evaluate";
import formatNumber from "../utils/formatNumber";
import resolveCurrentOperand from "../utils/resolveCurrentOperand";
import { MAX_DIGITS } from "../constants";

function updateExpression(calc: Draft<CalcState>, action: PayloadAction<UpdateExpressionPayload>) {
  const { operator } = action.payload;
  if (operator === calc.lastInput) return;
  
  const currentOperand = resolveCurrentOperand(calc);

  const expression = calc.currentOperand !== ""
    ? [...calc.expression, currentOperand]
    : calc.expression.slice(0, -1);

  calc.expression = [...expression, operator];
  calc.currentOperand = "";
  calc.output = buildOutputForNewOperator(currentOperand, expression, operator);
  calc.lastOperand = currentOperand;
  calc.lastInput = operator;
  calc.sexagesimalInputs = [];
}

function buildOutputForNewOperator(
  operand: string, 
  expression: string[], 
  newOperator: OperatorType,
): string {

  const parser = new ExpressionParser(expression);
  const expressionToEvaluate = parser.getExpressionToEvaluate(newOperator);
  if (expressionToEvaluate) {
    const evaluation = evaluate(expressionToEvaluate);
    return formatNumber(evaluation, MAX_DIGITS);
  }

  return formatNumber(parseFloat(operand), MAX_DIGITS);
}

export default updateExpression;
