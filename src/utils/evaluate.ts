import { 
  addDependencies,
  acosDependencies,
  asinDependencies,
  cosDependencies,
  create,
  divideDependencies,
  evaluateDependencies,
  expDependencies,
  factory,
  logDependencies,
  log10Dependencies,
  multiplyDependencies,
  sinDependencies,
  sqrtDependencies,
  squareDependencies,
  subtractDependencies,
  tanDependencies,
} from 'mathjs';

type OperationFunction = (...args: number[]) => number;
const createOperation = (name: string, fn: OperationFunction) => factory(name, [], () => fn);
const powerOfTen = (exponent: number) => Math.pow(10, exponent);

const { evaluate } = create({
  addDependencies,
  acosDependencies,
  asinDependencies,
  cosDependencies,
  divideDependencies,
  evaluateDependencies,
  expDependencies,
  logDependencies,
  log10Dependencies,
  multiplyDependencies,
  sinDependencies,
  sqrtDependencies,
  squareDependencies,
  subtractDependencies,
  tanDependencies,
  createPowerOfTen: createOperation("powerOfTen", powerOfTen),
});

export default (expression: string[]): number => {
  return evaluate(expression.join(""));
}
