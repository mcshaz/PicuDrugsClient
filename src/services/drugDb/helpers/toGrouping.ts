export function toGrouping<T, K> (data: ReadonlyArray<T>, keyselector: (val: T) => K) {
  const returnVar = new Map<K, T[]>()
  for (const d of data) {
    const k = keyselector(d)
    const prop = returnVar.get(k)
    if (prop) {
      prop.push(d)
    } else {
      returnVar.set(k, [d])
    }
  }
  return returnVar
}
