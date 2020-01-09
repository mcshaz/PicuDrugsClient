
export function mergeValidators(existing: object | string | undefined, newVals: object) {
    switch(typeof existing) {
        case 'undefined':
        case 'object':
            const returnVar = Object.assign({}, existing) as any;
            for (const e of Object.entries(newVals)) {
                if (e[1] !== void 0 && e[1] !== false) {
                    returnVar[e[0]] = e[1];
                }
            }
            return returnVar;
        case 'string':
            const vals = new Map<string, string | boolean>(existing.split('|').map((v) => v.split(':') as [string, string]));
            for (const e of Object.entries(newVals)) {
                switch (typeof e[1]) {
                    case 'object':
                        let aryArgs: any[];
                        if (e[1] instanceof Date) {
                            aryArgs = [e[1]];
                        } else {
                            aryArgs = Array.isArray(e[1])
                                ? e[1]
                                : Object.values(e[1]);
                        }
                        vals.set(e[0], aryArgs.map((a) => a instanceof Date ? a.toISOString() : a).join(','));
                        break;
                    case 'undefined':
                        break;
                    case 'boolean':
                        if (e[1]) {
                            vals.set(e[0], true);
                        }
                        break;
                    default:
                        vals.set(e[0], e[1].toString());
                }

            }
            return Array.from(vals).map((v) => v[1] === true ? v[0] : (v[0] + ':' +v[1])).join('|');
        default:
            throw new TypeError('wrong type for "existing" arg');
    }
}
