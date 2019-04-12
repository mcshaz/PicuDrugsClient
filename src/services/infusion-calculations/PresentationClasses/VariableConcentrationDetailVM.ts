import {NumericRange} from '../Utilities/NumericRange';

export interface IVariableConcentrationDetailVM {
  detailName: string;
  drawingUpDose: number;
  isNeat: boolean;
  finalVolume: number;
  oneMlHrDose: number;
  flowRange: NumericRange;
}

