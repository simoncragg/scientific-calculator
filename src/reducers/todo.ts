import type { Draft } from "@reduxjs/toolkit";
import type { CalcState } from "../types";

function todo(calc: Draft<CalcState>) {
  calc.output = "- TODO -";
}

export default todo;
