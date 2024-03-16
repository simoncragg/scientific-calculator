import { AngleUnit } from "../types";

export function convertToRadians(angle: number, unit: AngleUnit) {
    switch (unit) {
      case "deg": return angle * (Math.PI / 180);
      case "grad": return angle / (200 / Math.PI);
      default: return angle;
    }
  }