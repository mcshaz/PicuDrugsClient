import {InfusionRateUnit} from './../Dosing/InfusionRateUnit';
import {SiUnitMeasure} from './../Dosing/SiUnitMeasure';

export interface IInfusionDrugVM {
  RateUnit: InfusionRateUnit | null;
  DrawingUpUnits: SiUnitMeasure | null;
}
