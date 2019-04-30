export class GenericRange<T> {
    constructor(public lowerBound?: T, public upperBound?: T) {}
    public get isEmpty(): boolean {
        return this.lowerBound === void 0 && this.upperBound === void 0;
    }
}
