import type { FunctionType } from "../types";

export function isFunction(input: string | undefined): boolean {
  return input !== undefined &&
    input !== "." && 
    input !== "+/-" &&
    isNaN(Number(input));
}

export function isTrigonometric(func: FunctionType) {
  return ["sin", "cos", "tan"].includes(func) || isInverseTrigonometric(func);
}

export function isInverseTrigonometric(func: FunctionType): boolean {
  return ["asin", "acos", "atan"].includes(func);
}
