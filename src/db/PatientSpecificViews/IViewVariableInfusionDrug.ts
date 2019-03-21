import { IContextInfusionDrug } from '../entities/IContextInfusionDrugBase';
import { IVariableDilution } from '../entities/IContextVariableInfusionDrug';

export interface IViewVariableInfuionDrug extends IContextInfusionDrug {
    Dilution: IVariableDilution;
}
