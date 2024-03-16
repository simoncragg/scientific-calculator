import type { AngleUnit } from "../types";

export function convertFromRadians(angle: number, unit: AngleUnit) {
  switch (unit) {
    case "deg": return angle * (180 / Math.PI);
    case "grad": return angle / (Math.PI / 200);
    default: return angle;
  }
}
