import { 
    create, 
    evaluateDependencies, 
    factory,
    log10Dependencies,
    sqrtDependencies,
    unaryMinusDependencies,
} from 'mathjs';

type OperationFunction = (a: number, b: number) => number;

const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;
const multiply = (a: number, b: number) => a * b;
const divide = (a: number, b: number) => a / b;

const createOperation = (name: string, fn: OperationFunction) => factory(name, [], () => fn);

const { evaluate } = create({
  evaluateDependencies,
  log10Dependencies,
  sqrtDependencies,
  unaryMinusDependencies,
  createAdd: createOperation('add', add),
  createSubtract: createOperation('subtract', subtract),
  createMultiply: createOperation('multiply', multiply),
  createDivide: createOperation('divide', divide),
});

export default (expression: string[]): number => {
  return evaluate(expression.join(""));
}
