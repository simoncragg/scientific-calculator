import { GetLastOperatorResultType, OperandAffixes, OperatorType } from "../types";

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
      if (this.isOperator(this.expression[i])) {
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

  isOperator(candidate: string | undefined): boolean {
    return candidate 
      ? "/*-+".includes(candidate)
      : false;
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
