import { evaluate } from 'mathjs'

export const MAX_DIGITS = 16;

export const ActionTypes = {
  UPDATE_CURRENT_OPERAND: "UPDATE_CURRENT_OPERAND",
  UPDATE_EXPRESSION: "UPDATE_EXPRESSION",
  EVALUATE_EXPRESSION: "EVALUATE_EXPRESSION"
};

export function calcReducer(calc, action) {

  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_OPERAND:
      return updateCurrentOperand(calc, action.payload.digit);

    case ActionTypes.UPDATE_EXPRESSION:
      return updateExpression(calc, action.payload.operator)

    case ActionTypes.EVALUATE_EXPRESSION:
      return evaluateExpression(calc);

    default:
      return calc;
  }
}

function updateCurrentOperand (calc, digit) {
  if (calc.currentOperand.replace(".", "").length >= MAX_DIGITS) return calc;
  if (digit === "." && calc.currentOperand.includes(".")) return calc;

  const isFirstDigit = (calc.currentOperand === "0" && digit !== ".");
  const currentOperand = (isFirstDigit) ? digit : calc.currentOperand + digit;

  return {
    ...calc,
    currentOperand,
    lastInput: digit,
    output: formatNumber(currentOperand)
  };
}

function updateExpression (calc, newOperator) {
  if (newOperator === calc.lastInput) return calc;

  const expression = isOperator(calc.lastInput)
    ? calc.expression.slice(-1)
    : calc.expression + calc.currentOperand;

  return {
    currentOperand: "",
    expression: expression + newOperator,
    lastInput: newOperator,
    output: buildOutputForNewOperator(calc, expression, newOperator)
  };
}

function evaluateExpression (calc) {
  const expression = calc.expression + calc.currentOperand;
  return {
    currentOperand: "",
    expression: "",
    lastInput: "=",
    output: formatNumber(roundNumber(evaluate(expression)).toString())
  };
}

function buildOutputForNewOperator(calc, expression, newOperator) {
  const evaluationIndex = getEvaluationIndex(expression, newOperator);
  if (evaluationIndex > -1) {
    const evaluation = evaluate(expression.substring(evaluationIndex));
    return formatNumber(roundNumber(evaluation).toString());
  }
  return calc.currentOperand;
}

function getEvaluationIndex(expression, newOperator) {
  const {lastOperator, i} = getLastOperator(expression);
  if (!lastOperator) return -1;
  if (isDivideOrMultiply(lastOperator) && isDivideOrMultiply(newOperator)) return i-1;
  if (isAddOrSubtract(lastOperator) && isAddOrSubtract(newOperator)) return 0;
  return -1;
}

function getLastOperator(expression) {
  for (let i = expression.length - 1; i > -1; i--) {
    if (isOperator(expression[i])) {
      return {lastOperator: expression[i], i};
    }
  }
  return {undefined, i: -1};
}

function isOperator(candidate) {
  return "/*-+".includes(candidate);
}

function isAddOrSubtract(operator) {
  return "+-".indexOf(operator) > -1;
}

function isDivideOrMultiply(operator) {
  return "/*".indexOf(operator) > -1;
}

function formatNumber(strNumber) {
  if (isInfinity(strNumber)) return "Error";
  const numberParts = strNumber.split(".");
  const integerPart = parseInt(numberParts[0]).toLocaleString("en", { maximumFractionDigits: 0});
  const fractionalPart = numberParts.length > 1 ? numberParts[1] : "";
  return (strNumber.includes(".")) 
    ? `${integerPart}.${fractionalPart}`
    : integerPart;
}

function roundNumber(number) {
  if (isInfinity(number)) return number;
  const strNumber = number.toString();
  const floatNumber = parseFloat(number);
  const fractionalDigits = computeFixedPointFractionDigits(strNumber)
  const fixedNumber = floatNumber.toFixed(fractionalDigits);
  const fixedNumberWithNoTrailingZeros = parseFloat(fixedNumber).toString();
  return fixedNumberWithNoTrailingZeros;
}

function computeFixedPointFractionDigits(strNumber) {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return MAX_DIGITS - numOfIntegerDigits;
}

function isInfinity (number) {
  return number === "Infinity";
}