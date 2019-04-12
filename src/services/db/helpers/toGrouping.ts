export function toGrouping<T, K>(data: T[], keyselector: (val: T) => K) {
    const returnVar = new Map<K, T[]>();
    for (const d of data) {
        const k = keyselector(d);
        if (returnVar.has(k)) {
            (returnVar.get(k) as T[]).push(d);
        } else {
            returnVar.set(k, [d]);
        }
    }
    return returnVar;
}
