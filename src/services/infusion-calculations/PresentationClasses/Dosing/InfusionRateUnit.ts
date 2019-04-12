import { DrugDoseUnit } from './DrugDoseUnit';
import { siUnit } from '@/services/db';

export class InfusionRateUnit extends DrugDoseUnit {
  constructor(logSi: number, unit: siUnit, isPerKg: boolean, readonly isPerMin: boolean) {
    super(logSi, unit, isPerKg);
  }
  public toDrugDoseUnit(): DrugDoseUnit {
    return new DrugDoseUnit(this.logSi, this.unit, this.isPerKg);
  }
  public toString(): string {
    return super.toString() + this.longRate();
  }
  public toShortString(): string {
    return super.toShortString() + this.shortRate();
  }
  public toShortUserSafeString(): string {
    return this.isUserSafePrefix ? this.toShortString() : (super.toString() + this.shortRate());
  }
  private shortRate(): string {
    return this.perSeperator + (this.isPerMin ? 'min' : 'hr');
  }
  private longRate(): string {
    return this.perSeperator + (this.isPerMin ? 'minute' : 'hour');
  }
}
