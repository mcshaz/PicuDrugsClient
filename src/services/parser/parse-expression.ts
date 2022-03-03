interface IAnthro { weightKg: number; ageMonths?: number; heightCm?: number; bsa?: number; cgaWeeks?: number }
type primativeType = string | boolean | number | null

export function parseAnthro(expression: string, anthro: IAnthro): primativeType {
  return parseExpression<IAnthro>(expression, anthro, ['weightKg', 'ageMonths', 'heightCm', 'bsa', 'cgaWeeks']);
}

type propertiesOfType<TObj, TResult> = { [K in keyof TObj]: TObj[K] extends TResult ? K : never }[keyof TObj]

export function parseExpression<T>(expression: string, obj: T, props: Array<string & propertiesOfType<T, number | undefined | null>>): primativeType {
  for (const prop of props) {
    const val = obj[prop];
    // a bit of a hack - null behaves like 0 in ES, whereas undefined behaves more as expected
    expression = expression.replaceAll(prop, typeof val === 'number' ? val.toString() : 'undefined');
  }
  if (/(alert)|(prompt)|(document)|(fetch)|(XMLHttpRequest)/.test(expression)) {
    throw new Error(`expresson is potentially malicious: '${expression}'`);
  }
  // ? remove newlines and semicolons to ensure single expression tree
  try {
    // eslint-disable-next-line no-new-func
    const f = new Function(`return ${expression};`);
    return f() as primativeType;
  } catch (e) {
    if (e.name !== 'SyntaxError') throw e;
    console.log(`A SyntaxError has been caught:\n${e}\nresulting from expression: '${expression}'`);
    return null;
  }
}
