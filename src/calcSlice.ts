import { createSlice } from "@reduxjs/toolkit";

import type { CalcState } from "./types";

import adjustVoltage from "./reducers/adjustVoltage";
import allClear from "./reducers/allClear";
import clear from "./reducers/clear";
import cycleDrgMode from "./reducers/cycleDrgMode";
import decimalToSexagesimal from "./reducers/decimalToSexagesimal";
import evaluateExpression from "./reducers/evaluateExpression";
import executeFunction from "./reducers/executeFunction"
import expOrPi from "./reducers/expOrPi";
import fractionMode from "./reducers/fractionMode";
import inputSexagesimal from "./reducers/inputSexagesimal";
import invertNumber from "./reducers/invertNumber";
import percent from "./reducers/percent";
import todo from "./reducers/todo";
import toggleHyperbolic from "./reducers/toggleHyperbolic";
import toggleShift from "./reducers/toggleShift";
import updateCurrentOperand from "./reducers/updateCurrentOperand";
import updateExpression from "./reducers/updateExpression";

export const initialState: CalcState = {
  numericMode: "decimal",
  isShiftEnabled: false,
  isHyperbolic: false,
  angleMode: "deg",
  currentOperand: "0",
  expression: [],
  output: "0",
  fractionInputs: [],
  sexagesimalInputs: [],
  voltageLevel: 1.0,
};

export const calcSlice = createSlice({
  name: "calc",
  initialState,
  reducers: {
    adjustVoltage,
    allClear,
    clear,
    cycleDrgMode,
    decimalToSexagesimal,
    evaluateExpression,
    executeFunction,
    expOrPi,
    fractionMode,
    inputSexagesimal,
    invertNumber,
    percent,
    todo,
    toggleHyperbolic,
    toggleShift,
    updateCurrentOperand,
    updateExpression,
  }
});

export default calcSlice.reducer;
