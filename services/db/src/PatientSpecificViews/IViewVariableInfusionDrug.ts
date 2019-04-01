import { IContextInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IVariableDilution } from '../entities/InfusionDrugs/IContextVariableInfusionDrug';

export interface IViewVariableInfuionDrug extends IContextInfusionDrug {
    Dilution: IVariableDilution;
}
