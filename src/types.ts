export type OperatorType = "+" | "-" | "*" | "/";
export type AngleUnit = "deg" | "rad" | "grad";
export type FunctionType = "square" | "sqrt" | "log10" | "powerOfTen" | "log" | "exp" | "sin";

export interface ShiftState {
  isShiftEnabled: boolean;
  toggleShift: () => void;
}

export interface CalcState {
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

export interface Action {
  type: string;
  payload?: AdjustVoltagePayload | ExecuteFunctionPayload | UpdateCurrentOperandPayload | UpdateExpressionPayload;
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
