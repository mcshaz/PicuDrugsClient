
import { getPrefix } from './getPrefix';
import { getSiUnitAbbrev} from './getSiUnitAbbrev';
import { siUnit } from './../../../../db';
export class SiUnitMeasure {
  get isUserSafePrefix(): boolean {
    return this.logSi === -3;
  }
  public static logSiToString(logVal: number): string {
    return getPrefix(logVal).fullName;
  }
  public static logSiToChar(logVal: number): string {
    return getPrefix(logVal).siSymbol;
  }
  public pleuralise: boolean = true;
  constructor(readonly logSi: number, readonly unit: siUnit) {
    if (logSi > 0 || logSi % 3 !== 0) {
      throw new RangeError('logSi must be between -12 and 0, in intervals of 3');
    }
  }
  public unitString(abbreviate: boolean = false): string {
    if (abbreviate) {
      return getSiUnitAbbrev(this.unit);
    }
    return siUnit[this.unit] + (this.pleuralise ? 's' : '');
  }
  public toString(): string {
    return SiUnitMeasure.logSiToString(this.logSi) + this.unitString(false);
  }
  public toShortString(): string {
    return SiUnitMeasure.logSiToChar(this.logSi) + this.unitString(true);
  }
  public toShortUserSafeString(): string {
    return this.isUserSafePrefix ? this.toShortString() : this.toString();
  }
}
