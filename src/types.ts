export interface ShiftState {
  isShiftEnabled: boolean;
  toggleShift: () => void;
}

export interface CalcState {
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
  entry: string;
}
  
export interface UpdateExpressionPayload {
  operator: string;
}

export interface AdjustVoltagePayload {
  voltageLevel: number;
}

export interface GetLastOperatorResultType {
  lastOperator: string | undefined;
  index: number;
};
