export type OperatorType = "+" | "-" | "*" | "/";
export type DrgModeType = "deg" | "rad" | "grad";

export interface ShiftState {
  isShiftEnabled: boolean;
  toggleShift: () => void;
}

export interface CalcState {
  drgMode: DrgModeType;
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
  payload?: UpdateCurrentOperandPayload | UpdateExpressionPayload | AdjustVoltagePayload;
}

export interface UpdateCurrentOperandPayload {
  input: string;
}
  
export interface UpdateExpressionPayload {
  operator: OperatorType;
}

export interface AdjustVoltagePayload {
  voltageLevel: number;
}

export interface GetLastOperatorResultType {
  lastOperator: OperatorType | undefined;
  index: number;
};
