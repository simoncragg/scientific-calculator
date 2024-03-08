import { 
    create, 
    evaluateDependencies,
    expDependencies,
    factory,
    logDependencies,
    log10Dependencies,
    sqrtDependencies,
    squareDependencies,
    unaryMinusDependencies,
} from 'mathjs';

type OperationFunction = (a: number, b: number) => number;

const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;
const multiply = (a: number, b: number) => a * b;
const divide = (a: number, b: number) => a / b;
const powerOfTen = (exponent: number) => Math.pow(10, exponent);

const createOperation = (name: string, fn: OperationFunction) => factory(name, [], () => fn);

const { evaluate } = create({
  evaluateDependencies,
  expDependencies,
  logDependencies,
  log10Dependencies,
  sqrtDependencies,
  squareDependencies,
  unaryMinusDependencies,
  createAdd: createOperation("add", add),
  createSubtract: createOperation("subtract", subtract),
  createMultiply: createOperation("multiply", multiply),
  createDivide: createOperation("divide", divide),
  createPowerOfTen: createOperation("powerOfTen", powerOfTen),
});

export default (expression: string[]): number => {
  return evaluate(expression.join(""));
}
