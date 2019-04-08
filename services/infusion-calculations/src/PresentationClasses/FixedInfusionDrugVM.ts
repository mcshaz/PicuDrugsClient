import { SiConcentration } from './Dosing/SiConcentration';
import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { DrugDoseUnit } from './Dosing/DrugDoseUnit';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { IFixedInfusionPeriodVM } from './IFixedInfusionPeriodVM';

export class FixedInfusionDrugVM implements IInfusionDrugVM {
  public drugName: string = '';
  public sourceDescription: string = '';
  public sourceHref: string = '';
  public route: string = '';
  public note: string = '';
  public ampuleConcentration: number = 0;
  public ampuleUnits: SiConcentration | null = null;
  public diluentFluid: string = '';
  public concentrations: IFixedInfusionPeriodVM[] = [];
  get CalculatedDoseUnit(): DrugDoseUnit | null {
    if (!this.rateUnit) {
      return null;
    }
    return this.rateUnit.toDrugDoseUnit();
  }
  public rateUnit: InfusionRateUnit | null = null;
  set drawingUpUnits(value: SiUnitMeasure | null) {
    this.ampuleUnits = value ? null : new SiConcentration(value!);
  }
  get drawingUpUnits(): SiUnitMeasure | null {
    if (this.ampuleUnits === null) {
      return null;
    }
    return this.ampuleUnits;
  }
}
