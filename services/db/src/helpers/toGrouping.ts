function toGrouping<T, K, V>(data: T[], keyselector: (val: T) => K, valselector: (val: T) => V) {
    const returnVar = new Map<K, V[]>();
    for (const d of data) {
        const k = keyselector(d);
        const v = valselector(d);
        if (returnVar.has(k)) {
            (returnVar.get(k) as V[]).push(v);
        } else {
            returnVar.set(k, [v]);
        }
    }
    return returnVar;
}
