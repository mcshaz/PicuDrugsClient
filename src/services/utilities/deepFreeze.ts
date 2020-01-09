interface IStringProps {
    [s: string]: any;
}

export function deepFreeze<T extends IStringProps>(obj: T) {
  // Retrieve the property names defined on object
  // Freeze properties before freezing self
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}
