import { SiConcentration } from './Dosing/SiConcentration';
import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { DrugDoseUnit } from './Dosing/DrugDoseUnit';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { IFixedInfusionPeriodVM } from './IFixedInfusionPeriodVM';

export class FixedInfusionDrugVM implements IInfusionDrugVM {
  public drugName!: string;
  public sourceDescription: string = '';
  public sourceHref: string = '';
  public route: string = '';
  public note: string = '';
  public ampuleUnits!: SiConcentration;
  public diluentFluid: string = '';
  public concentrations: IFixedInfusionPeriodVM[] = [];
  get CalculatedDoseUnit(): DrugDoseUnit {
    return this.rateUnit.toDrugDoseUnit();
  }
  public rateUnit!: InfusionRateUnit;
  set drawingUpUnits(value: SiUnitMeasure) {
    this.ampuleUnits = new SiConcentration(value);
  }
  get drawingUpUnits(): SiUnitMeasure {
    return this.ampuleUnits;
  }
}
