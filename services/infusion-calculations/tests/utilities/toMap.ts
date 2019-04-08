export function toMap<TKey, TValue>(values: TValue[], keySelector: (val: TValue) => TKey) {
    const returnVar = new Map<TKey, TValue>();
    for (const v of values) {
        returnVar.set(keySelector(v), v);
    }
    return returnVar;
}

export function concatSets<T>(set: Set<T>, ...iterables: Array<Set<T> | T[]>) {
    for (const iterable of iterables) {
        for (const item of iterable) {
            set.add(item);
        }
    }
}

export class ToArrayMap<TValue, MValue> {
    public matched: Array<[TValue, MValue[]]>;
    private readonly pkeyToTValIndx: Map<number, number>;
    constructor(values: TValue[], keySelector: (val: TValue) => number[]) {
        this.matched = new Array(values.length);
        this.pkeyToTValIndx = new Map<number, number>();
        for (let i = 0; i < values.length; i++) {
            this.matched[i] = [values[i], []]
            for (const k of keySelector(values[i])) {
                this.pkeyToTValIndx.set(k, i);
            }
        }
    }

    public match(matchValues: MValue[], keySelector: (val: MValue) => number) {
        for (const v of matchValues) {
            const m = this.pkeyToTValIndx.get(keySelector(v));
            if (m !== void 0) {
                this.matched[m][1].push(v);
            }
        }
    }
}
