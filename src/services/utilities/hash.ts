export function hash(...args: Array<string | number | Array<number | undefined | null> | null | undefined>) {
  return args.reduce((prev: number, cur) => {
    switch (typeof cur) {
      case 'number':
        return prev * 3 + reduceNumberAlgorithm(cur);
      case 'string':
        return prev * 5 + reduceStringAlgoritm(cur);
      case 'undefined':
        return prev * 11 + 29;
      default: // must be object - either number array or null
        if (cur === null) {
          return (prev * 19 + 31);
        }
        return prev * 23 + reduceNumberAlgorithm(...cur);
    }
  }, 0);
}

function reduceStringAlgoritm(str: string) {
  let hashNo = 11;
  for (let i = str.length - 1; i >= 0; i--) {
    hashNo = hashNo * str.charCodeAt(i) + 17;
  }
  return hashNo;
}

function reduceNumberAlgorithm(...ars: Array<number | undefined | null>) {
  return ars.reduce((prev: number, cur) => {
    if (cur === null) {
      return prev * 37 + 41;
    }
    if (cur === void 0) {
      return prev * 43 + 47;
    }
    return prev * 13 + cur;
  }, 7);
}
