type nullString = string | null | undefined;
type nullStringProps<T> = ({ [P in keyof T]: T[P] extends nullString ? P : never })[keyof T];
type stringProps<T> = ({ [P in keyof T]: T[P] extends string ? P : never })[keyof T];
type numberProps<T> = ({ [P in keyof T]: T[P] extends number ? P : never })[keyof T];

type nullDate = Date | null;
type dateProps<T> = ({ [P in keyof T]: T[P] extends nullDate ? P : never })[keyof T];

export function sortByNullStringProp<T>(target: T[], propName: nullStringProps<T>) {
  return target.sort((a, b) => {
    let ap = a[propName] as any as nullString; // 'a' > '' = true 'a' < '' = false
    let bp = b[propName] as any as nullString;
    if (ap === null || ap === void 0) {
      ap = '';
    }
    if (bp === null || bp === void 0) {
      bp = '';
    }
    if (ap === bp) {
      return 0;
    }
    return (ap > bp) ? 1 : -1;
  });
}

export function sortByStringProp<T>(target: T[], propName: stringProps<T>) {
  return sortByAnyProp(target, propName);
}

export function sortByNumberProp<T>(target: T[], propName: stringProps<T>) {
  return sortByAnyProp(target, propName);
}

export function sortByDateProp<T>(target: T[], propName: dateProps<T>) {
  return target.sort((a, b) => {
    const ap = a[propName] as any as nullDate; // 'a' > '' = true 'a' < '' = false
    const bp = b[propName] as any as nullDate;
    if (!ap) {
      return !bp ? 0 : 1; // note this is sorting null last
    }
    if (!bp) {
      return -1;
    }
    const aTime = ap.getTime();
    const bTime = bp.getTime();
    if (aTime === bTime) {
      return 0;
    }
    return aTime > bTime
      ? 1
      : -1;
  });
}

export function sortByAnyProp<T>(target: T[], propName: keyof T) {
  return target.sort((a, b) => {
    const ap = a[propName];
    const bp = b[propName];
    if (ap === bp) {
      return 0;
    }
    return ap > bp ? 1 : -1;
  });
}
