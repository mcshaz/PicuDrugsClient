type nullString = string | null | undefined;
type nullStringProps<T> = ({ [P in keyof T]: T[P] extends nullString ? P : never })[keyof T];
type stringProps<T> = ({ [P in keyof T]: T[P] extends string ? P : never })[keyof T];
export function sortByNullStringProp<T>(target: T[], propName: nullStringProps<T>) {
    target.sort((a, b) => {
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
    target.sort((a, b) => {
        const ap = a[propName]; // 'a' > '' = true 'a' < '' = false
        const bp = b[propName];
        if (ap === bp) {
            return 0;
        }
        return (ap > bp) ? 1 : -1;
    });
}
