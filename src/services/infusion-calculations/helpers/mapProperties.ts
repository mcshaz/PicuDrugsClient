/// note not providing typesafety of the property tpes
export function mapProperties<T, U>(target: T, source: U, propNames: Array<keyof T & keyof U & string>) {
    propNames.forEach((pn) => (target[pn] as any) = source[pn]);
    return target;
}
