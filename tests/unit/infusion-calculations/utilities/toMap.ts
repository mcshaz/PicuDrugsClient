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

export class Lookup<TKey, TValue> {
    public readonly values: Map<TKey, TValue[]>;
    constructor(private readonly keySelector?: (val: TValue) => TKey) {
      this.values = new Map();
    }

    // public add(key: TKey, value: TValue): void;
    // public add(value: TValue): void;
    public add(keyOrVal: (TKey | TValue), value?: TValue) {
      if (value === void 0) {
        this.pAdd(this.keySelector!(keyOrVal as TValue), keyOrVal as TValue);
      } else {
        this.pAdd(keyOrVal as TKey, value);
      }
    }

    public addMany(values: TValue[]) {
      values.forEach((v) => this.add(v));
    }

    private pAdd(key: TKey, value: TValue) {
      const arr = this.values.get(key);
      if (arr === void 0) {
        this.values.set(key, [value]);
      } else {
        arr.push(value);
      }
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ToArrayMap<TValue, MValue> {
    private readonly pMatchedToIds: Array<[TValue, number[]]>;
    private readonly pKeyToMatchedIndex: Lookup<number, number>;
    constructor(values: TValue[], keySelector: (val: TValue) => number[]) {
      this.pMatchedToIds = new Array(values.length);
      this.pKeyToMatchedIndex = new Lookup<number, number>();
      for (let i = 0; i < values.length; i++) {
        const keys = keySelector(values[i]);
        this.pMatchedToIds[i] = [values[i], new Array(keys.length)];
        for (let j = 0; j < keys.length; j++) {
          this.pMatchedToIds[i][1][j] = keys[j];
          this.pKeyToMatchedIndex.add(keys[j], i);
        }
      }
    }

    public match(matchValues: MValue[], keySelector: (val: MValue) => number) {
      const returnVar = this.pMatchedToIds.map((m) => [m[0], new Array<MValue>(m[1].length)] as [TValue, MValue[]]);
      for (const v of matchValues) {
        const key = keySelector(v);
        const matchIndices = this.pKeyToMatchedIndex.values.get(key);
        if (matchIndices !== void 0) {
          for (const m of matchIndices) {
            const indx = this.pMatchedToIds[m][1].indexOf(key);
            returnVar[m][1][indx] = v;
          }
        }
      }
      return returnVar;
    }
}
