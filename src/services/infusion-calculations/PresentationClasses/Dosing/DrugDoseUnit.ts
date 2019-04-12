import { SiUnitMeasure } from './SiUnitMeasure';
import { siUnit } from '@/services/db';
export class DrugDoseUnit extends SiUnitMeasure {
  public perSeperator: string = '/';
  constructor(logSi: number, unit: siUnit, readonly isPerKg: boolean) {
    super(logSi, unit);
  }
  public tosiUnitMeasure(): SiUnitMeasure {
    return new SiUnitMeasure(this.logSi, this.unit);
  }
  public toString(): string {
    return super.toString() + this.perString();
  }
  public toShortString(): string {
    return super.toShortString() + this.perString();
  }
  public toShortUserSafeString(): string {
    return this.isUserSafePrefix ? this.toShortString() : this.toString();
  }
  private perString(): string {
    return this.isPerKg ? (this.perSeperator + 'kg') : '';
  }
}
