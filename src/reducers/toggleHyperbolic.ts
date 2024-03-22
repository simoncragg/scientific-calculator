import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

function toggleHyperbolic(calc: Draft<CalcState>) {
  calc.isHyperbolic = !calc.isHyperbolic;
}

export default toggleHyperbolic;
