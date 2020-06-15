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

  public get isEmpty(): boolean {
    return this.pLowerBound === void 0 && this.pUpperBound === void 0;
  }

  public static opMultiply(rng: NumericRange, multiplier: number): NumericRange {
    return new NumericRange(rng.lowerBound * multiplier, rng.upperBound * multiplier);
  }

  public static opDivision(rng: NumericRange, divisor: number): NumericRange {
    return new NumericRange(rng.lowerBound / divisor, rng.upperBound / divisor);
  }

  public static sigFigures(val: number, precision = 2) {
    return Number((val).toPrecision(precision));
  }

  public rounding: roundingMethod = roundingMethod.toPrecision;
  public separator = '–';
  private pLowerBound?: number;
  private pUpperBound?: number;
  private pPrecision = 2;
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
    if (this.isEmpty) {
      throw new Error('toString called without upper or lower set');
    }
    if (this.lowerBound === void 0 || this.upperBound === this.lowerBound) {
      return this.makeString(this.upperBound as number);
    }
    if (this.upperBound === void 0) {
      return this.makeString(this.lowerBound as number);
    }
    return this.makeString(this.lowerBound as number) + this.separator + this.makeString(this.upperBound as number);
  }

  public avg(round = false) {
    if (this.isEmpty) {
      throw new Error('avg called without upper or lower set');
    }
    let returnVar: number;
    if (this.lowerBound === void 0 || this.upperBound === this.lowerBound) {
      returnVar = this.upperBound;
    }
    if (this.upperBound === void 0) {
      returnVar = this.lowerBound;
    } else {
      returnVar = (this.upperBound + this.lowerBound) / 2;
    }
    return round
      ? Math.round(returnVar)
      : returnVar;
  }

  public floor(floor: number) {
    if (this.lowerBound < floor) { this.lowerBound = floor; }
    if (this.upperBound < floor) { this.upperBound = floor; }
  }

  public cap(cap: number) {
    if (this.lowerBound > cap) { this.lowerBound = cap; }
    if (this.upperBound > cap) { this.upperBound = cap; }
  }

  public apply(transform: (n: number) => number) {
    if (this.lowerBound !== void 0) {
      this.lowerBound = transform(this.lowerBound);
    }
    if (this.upperBound !== void 0) {
      this.upperBound = transform(this.upperBound);
    }
  }

  private makeString(val: number): string {
    switch (this.rounding) {
      case roundingMethod.noRounding:
        return val.toString();
      case roundingMethod.fixedDecimalPlaces:
        return val.toFixed(this.precision);
      case roundingMethod.toPrecision:
        return NumericRange.sigFigures(val, this.precision).toString();
      default:
        throw new Error('unknown Rounding type');
    }
  }
}
