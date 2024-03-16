import type { 
  FunctionType,
  GetLastOperatorResultType, 
  OperandAffixes, 
  OperatorType
} from "../types";

import isOperator from "../utils/isOperator";
import { isTrigonometric } from "../utils/isTrigonometric";

class ExpressionParser {

  private readonly expression: string[];

  constructor(expression: string[] = []) {
    this.expression = expression;
  }

  getExpressionToEvaluate(newOperator: OperatorType): string[] | undefined {
    
    const { lastOperator, index } = this.getLastOperator();
  
    if (!lastOperator) {
      return !this.isNumber(this.expression.join())
        ? this.expression
        : undefined
    }
  
    if (this.isDivideOrMultiply(newOperator) && this.isAddOrSubtract(lastOperator)) {
      return undefined;
    }
  
    return this.expression.slice(index - 1);
  }

  getLastOperation(): OperandAffixes {

    const { lastOperator, index } = this.getLastOperator();
    
    if (lastOperator) {
      return { 
        prefix: "",
        suffix: this.expression.slice(index).join(""),
      }
    }
  
    if (this.expression[0].startsWith("sqrt")) {
      return {
        prefix: "sqrt(",
        suffix: ")",
      }
    }
  
    return {
      prefix: "",
      suffix: "",
    };
  }

  getLastOperator(): GetLastOperatorResultType {
    for (let i = this.expression.length - 1; i > -1; i--) {
      if (isOperator(this.expression[i])) {
        return { 
          lastOperator: this.expression[i] as OperatorType,
          index: i
        };
      }
    }
    
    return { 
      lastOperator: undefined,
      index: -1
    };
  }

  determineLastOperation(
    func: FunctionType, 
    result: number
  ): OperandAffixes { 
  
    const { lastOperator } = this.getLastOperator();
  
    if (lastOperator) {
      return { 
        prefix: "", 
        suffix: `${lastOperator}${result}`,
      };
    }
  
    if (isTrigonometric(func)) {
      return { 
        prefix: "", 
        suffix: "",
      };
    }
  
    return {
      prefix: `${func}(`, 
      suffix: `)`,
    };
  }

  isNumber(candidate: string): boolean {
    return !isNaN(Number(candidate));
  }

  isAddOrSubtract(operator: OperatorType): boolean {
    return "+-".indexOf(operator) > -1;
  }

  isDivideOrMultiply(operator: OperatorType): boolean {
    return "/*".indexOf(operator) > -1;
  }
}

export default ExpressionParser;
