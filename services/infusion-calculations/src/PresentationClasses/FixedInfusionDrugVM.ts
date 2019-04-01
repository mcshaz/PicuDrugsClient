import { SiConcentration } from './Dosing/SiConcentration';
import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { DrugDoseUnit } from './Dosing/DrugDoseUnit';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { FixedInfusionPeriodVM } from './FixedInfusionPeriodVM';
export class FixedInfusionDrugVM implements IInfusionDrugVM {
  public DrugName: string = '';
  public SourceDescription: string = '';
  public SourceHref: string = '';
  public Route: string = '';
  public Note: string = '';
  public AmpuleConcentration: number = 0;
  public AmpuleUnits: SiConcentration | null = null;
  public DiluentFluid: string = '';
  get CalculatedDoseUnit(): DrugDoseUnit | null {
    if (!this.RateUnit) {
      return null;
    }
    return this.RateUnit.toDrugDoseUnit();
  }
  public RateUnit: InfusionRateUnit | null = null;
  set DrawingUpUnits(value: SiUnitMeasure | null) {
    this.AmpuleUnits = value ? null : new SiConcentration(value!);
  }
  get DrawingUpUnits(): SiUnitMeasure | null {
    if (this.AmpuleUnits === null) {
      return null;
    }
    return this.AmpuleUnits;
  }
  public InfusionPeriods: FixedInfusionPeriodVM[] = [];
}
