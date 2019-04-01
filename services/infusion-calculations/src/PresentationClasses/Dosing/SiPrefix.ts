export class SiPrefix {
  public readonly siSymbol: string;
  constructor(readonly logValue: number, readonly fullName: string, siSymbol?: string) {
    if (siSymbol === void 0) {
      this.siSymbol = fullName.length > 0
        ? fullName[0]
        : fullName;
    } else {
      if (siSymbol.length > 1) {
        throw new Error('the symbol argument must be 0 or 1 characters long');
      }
      this.siSymbol = siSymbol;
    }
  }
}
