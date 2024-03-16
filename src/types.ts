export type OperatorType = "+" | "-" | "*" | "/";
export type AngleUnit = "deg" | "rad" | "grad";
export type FunctionType = "square" | "sqrt" | "log10" | "powerOfTen" | "log" | "exp" | TrigFunctionType;
export type TrigFunctionType = "sin" | "cos" | "tan" | "asin" | "acos" | "atan" | "sinh" | "cosh" | "tanh" | "asinh" | "acosh" | "atanh";

export interface CalcState {
  isShiftEnabled: boolean;
  isHyperbolic: boolean;
  angleMode: AngleUnit;
  currentOperand: string;
  expression: string[];
  lastInput?: string;
  lastOperand?: string;
  lastOperation?: OperandAffixes;
  output: string;
  voltageLevel: number;
}

export interface OperandAffixes {
  prefix: string;
  suffix: string;
}

export interface AdjustVoltagePayload {
  voltageLevel: number;
}

export interface ExecuteFunctionPayload {
  func: FunctionType;
}

export interface UpdateCurrentOperandPayload {
  input: string;
}
  
export interface UpdateExpressionPayload {
  operator: OperatorType;
}

export interface GetLastOperatorResultType {
  lastOperator: OperatorType | undefined;
  index: number;
};
