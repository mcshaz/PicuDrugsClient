import { NumericRange } from '../Utilities/NumericRange';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { IVariableConcentrationDetailVM } from './VariableConcentrationDetailVM';

export interface IVariableInfusionDrugVM {
  drugName: string;
  diluent?: string;
  doseRange: NumericRange;
  rateUnit: InfusionRateUnit;
  link: string;
  note: string;
  drawingUpUnits: SiUnitMeasure;
  concentrations: IVariableConcentrationDetailVM[];
}
