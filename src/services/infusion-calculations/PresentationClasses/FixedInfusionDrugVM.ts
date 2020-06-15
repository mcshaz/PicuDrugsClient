import { SiConcentration } from './Dosing/SiConcentration';
import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { DrugDoseUnit } from './Dosing/DrugDoseUnit';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { IFixedInfusionPeriodVM } from './IFixedInfusionPeriodVM';

export class FixedInfusionDrugVM implements IInfusionDrugVM {
  public drugName!: string;
  public infusionDrugId!: number;
  public sourceDescription = '';
  public sourceHref = '';
  public route = '';
  public note = '';
  public ampuleUnits!: SiConcentration;
  public diluentFluid = '';
  public concentrations: IFixedInfusionPeriodVM[] = [];
  get calculatedDoseUnit(): DrugDoseUnit {
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
