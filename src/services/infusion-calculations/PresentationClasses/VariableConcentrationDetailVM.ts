import { NumericRange } from '../Utilities/NumericRange';
import { IConcentrationDetailVM } from '..';

export interface IVariableConcentrationDetailVM extends IConcentrationDetailVM {
  detailName: string;
  flowRange: NumericRange;
}
