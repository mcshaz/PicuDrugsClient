import { SiUnitMeasure } from './SiUnitMeasure';
import { siUnit } from '@/services/drugDb';
export class SiConcentration extends SiUnitMeasure {
  public perSeperator: string;
  constructor(measure: SiUnitMeasure);
  constructor(logSi: number, unit: siUnit);
  constructor(measureOrLogSi: SiUnitMeasure | number, unit?: siUnit) {
    if (typeof measureOrLogSi === 'number') {
      super(measureOrLogSi, unit!);
    } else {
      super(measureOrLogSi.logSi, measureOrLogSi.unit);
    }
    this.perSeperator = '/';
  }
  public toString(): string {
    return super.toString() + this.rate();
  }
  public toShortUserSafeString(): string {
    return this.isUserSafePrefix ? this.toShortString() : this.toString();
  }
  public toShortString(): string {
    return super.toShortString() + this.rate();
  }
  private rate(): string {
    return this.perSeperator + 'mL';
  }
}
