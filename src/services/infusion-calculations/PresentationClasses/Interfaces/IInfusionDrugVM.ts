import { InfusionRateUnit } from '../Dosing/InfusionRateUnit';
import { SiUnitMeasure } from '../Dosing/SiUnitMeasure';
import { IConcentrationDetailVM } from './IConcentrationDetailVM';

export interface IInfusionDrugVM {
  rateUnit: InfusionRateUnit | null;
  drawingUpUnits: SiUnitMeasure | null;
  concentrations: IConcentrationDetailVM[];
}
