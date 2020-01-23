
export function mergeValidators(existing: object | string | undefined, autoGen: object) {
  if (typeof existing === 'string') {
    existing = Object.fromEntries(existing.split('|').map((rule) => {
      const returnVar: any = rule.split(':', 2);
      returnVar[1] = returnVar[1].split(','); // potentially if all numeric change them to numbers?
      return returnVar;
    })) as object;
  }
  return { ...autoGen, ...existing } as any;
}
