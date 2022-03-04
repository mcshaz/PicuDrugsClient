
export function mergeValidators(ruleProps: Record<string, unknown> | string | undefined, autoGen: Record<string, unknown>) {
  if (typeof ruleProps === 'string') {
    ruleProps = Object.fromEntries(ruleProps.split('|').map((rule) => {
      const returnVar: any = rule.split(':', 2);
      returnVar[1] = returnVar[1].split(','); // potentially if all numeric change them to numbers?
      return returnVar;
    })) as Record<string, unknown>;
  }
  return { ...autoGen, ...ruleProps } as any;
}
