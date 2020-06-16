
export function mergeValidators(ruleProps: object | string | undefined, autoGen: object) {
  if (typeof ruleProps === 'string') {
    ruleProps = Object.fromEntries(ruleProps.split('|').map((rule) => {
      const returnVar: any = rule.split(':', 2);
      returnVar[1] = returnVar[1].split(','); // potentially if all numeric change them to numbers?
      return returnVar;
    })) as object;
  }
  return { ...autoGen, ...ruleProps } as any;
}
