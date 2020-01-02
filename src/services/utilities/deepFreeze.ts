interface IStringProps {
    [s: string]: any;
}

export function deepFreeze<T extends IStringProps>(obj: T) {
  // Retrieve the property names defined on object
  // Freeze properties before freezing self
  for (const name of Object.getOwnPropertyNames(obj)) {
    const value = obj[name] as any;
    const type = typeof value;
    if (type === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}
