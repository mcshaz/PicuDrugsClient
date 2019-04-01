import { roundingMethod } from './roundingMethod';
export class NumericRange {

  set precision(value: number) {
    if (value <= 0 || value > 8) {
      throw new RangeError('Precision must be between 1 - 8');
    }
    this.pPrecision = value;
  }
  get precision(): number {
    return this.pPrecision;
  }

  get lowerBound(): number {
    return this.pLowerBound || 0;
  }
  set lowerBound(value: number) {
    if (this.pUpperBound! < value) {
      throw new RangeError('upperBound must be greater than lowerBound');
    }
    this.pLowerBound = value;
  }
  get upperBound(): number {
    return this.pUpperBound || 0;
  }
  set upperBound(value: number) {
    if (this.pLowerBound! > value) {
      throw new RangeError('upperBound must be greater than lowerBound');
    }
    this.pUpperBound = value;
  }
  public static op_Multiply(rng: NumericRange, multiplier: number): NumericRange {
    return new NumericRange(rng.lowerBound * multiplier, rng.upperBound * multiplier);
  }
  public static op_Division(rng: NumericRange, divisor: number): NumericRange {
    return new NumericRange(rng.lowerBound / divisor, rng.upperBound / divisor);
  }

  public rounding: roundingMethod = roundingMethod.noRounding;
  public separator: string = '–';
  private pLowerBound: number | undefined ;
  private pUpperBound: number | undefined ;
  private pPrecision: number = 2;
  constructor(val1?: number, val2?: number) {
    if (val1 !== void 0) {
      if (val2 !== void 0) {
        if (val1 < val2) {
          this.lowerBound = val1;
          this.upperBound = val2;
        } else {
          this.lowerBound = val2;
          this.upperBound = val1;
        }
      } else {
        this.lowerBound = this.upperBound = val1;
      }
    }
  }
  public toString(): string {
    if (this.lowerBound === void 0 && this.upperBound === void 0) {
      throw new Error('toString called without upper or lower set');
    }
    if (this.lowerBound === void 0  || this.upperBound === this.lowerBound) {
      return this.makeString(this.upperBound as number);
    }
    if (this.upperBound === void 0) {
      return this.makeString(this.lowerBound as number);
    }
    return this.makeString(this.lowerBound as number) + this.separator + this.makeString(this.upperBound as number);
  }
  private makeString(val: number): string {
    switch (this.rounding) {
      case roundingMethod.noRounding:
        return val.toString();
      case roundingMethod.fixedDecimalPlaces:
        return val.toFixed(this.precision);
      case roundingMethod.toPrecision:
        const returnVar = val.toPrecision(this.precision);
        return returnVar.includes('e')
          ? parseFloat(returnVar).toString()
          : returnVar;
      default:
        throw new Error('unknown Rounding type');
    }
  }
}
