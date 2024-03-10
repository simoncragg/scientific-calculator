import type { FunctionType } from "../types";

export function isTrigonometric(func: FunctionType) {
  return ["sin", "cos", "tan"].includes(func) || isInverseTrigonometric(func);
}

export function isInverseTrigonometric(func: FunctionType): boolean {
  return ["asin", "acos", "atan"].includes(func);
}
