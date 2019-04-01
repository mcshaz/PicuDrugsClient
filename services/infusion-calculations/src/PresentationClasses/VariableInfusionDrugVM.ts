import { IInfusionDrugVM } from './Interfaces/IInfusionDrugVM';
import { NumericRange } from '../Utilities/NumericRange';
import { InfusionRateUnit } from './Dosing/InfusionRateUnit';
import { SiUnitMeasure } from './Dosing/SiUnitMeasure';
import { VariableConcentrationDetailVM } from './VariableConcentrationDetailVM';

export class VariableInfusionDrugVM implements IInfusionDrugVM {
  public DrugName: string = '';
  public DoseRange: NumericRange | null = null;
  public RateUnit: InfusionRateUnit | null = null;
  public Link: string = '';
  public Note: string = '';
  public DrawingUpUnits: SiUnitMeasure | null = null;
  public InfusionDetails: VariableConcentrationDetailVM[] = [];
}
