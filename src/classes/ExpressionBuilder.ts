import type { AngleUnit, FunctionType } from "../types";
import { convertToRadians } from "../utils/angle-conversion";
import { isInverseTrigonometric, isTrigonometric } from "../utils/function-classifiers";
 
class ExpressionBuilder {
  
  static build(func: FunctionType, operand: string, angleUnit: AngleUnit): string {
      let unit = "";
      let convertedOperand = operand;
    
      if (isTrigonometric(func) && !isInverseTrigonometric(func)) {
        unit = "rad";
        convertedOperand = convertToRadians(parseFloat(operand), angleUnit).toString();
      }
    
      const spacing = unit !== "" ? " " : "";
      return `${func}(${convertedOperand}${spacing}${unit})`;
  }
}
  
export default ExpressionBuilder;
