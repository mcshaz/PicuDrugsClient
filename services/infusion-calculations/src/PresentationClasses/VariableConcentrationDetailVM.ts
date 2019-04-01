import {IConcentrationDetailVM } from './Interfaces/IConcentrationDetailVM';
import {NumericRange} from './../Utilities/NumericRange';

export class VariableConcentrationDetailVM implements IConcentrationDetailVM {
  public DetailName: string = '';
  public DrawingUpDose: number = 0;
  public IsNeat: boolean = false;
  public FinalVolume: number = 0;
  public OneMlHrDose: number = 0;
  public FlowRange: NumericRange | null = null;
}

