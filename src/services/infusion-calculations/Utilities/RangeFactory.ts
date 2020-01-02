import { NumericRange } from './NumericRange';
import { roundingMethod } from './roundingMethod';
export class RangeFactory {
  public precision: number = 2;
  public rounding: roundingMethod = roundingMethod.toPrecision;
  // public create(val1: number, val2: number): NumericRange;
  public create(val1?: number, val2?: number): NumericRange {
    const returnVar: NumericRange = new NumericRange(val1 || 0, val2);
    returnVar.precision = this.precision;
    returnVar.rounding = this.rounding;
    return returnVar;
  }
}
