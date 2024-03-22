import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

function toggleShift(calc: Draft<CalcState>) {
  calc.isShiftEnabled = !calc.isShiftEnabled;
}

export default toggleShift;
