import { AngleUnit, FunctionType } from "../types";
import convertToRadians from "../utils/convertToRadians";
import isTrigonometric from "../utils/isTrigonometric";

 
  class ExpressionBuilder {
    
    static build(func: FunctionType, operand: string, angleUnit: AngleUnit): string {
        let unit = "";
        let convertedOperand = operand;
      
        if (isTrigonometric(func)) {
          unit = "rad";
          convertedOperand = convertToRadians(parseFloat(operand), angleUnit).toString();
        }
      
        const spacing = unit !== "" ? " " : "";
        return `${func}(${convertedOperand}${spacing}${unit})`;
    }
  }
  
  export default ExpressionBuilder;
