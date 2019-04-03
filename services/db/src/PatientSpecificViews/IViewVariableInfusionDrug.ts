import { IEntityInfusionDrug } from '../entities/InfusionDrugs/IContextInfusionDrugBase';
import { IVariableDilution } from '../entities/InfusionDrugs/IContextVariableInfusionDrug';

export interface IViewVariableInfuionDrug extends IEntityInfusionDrug {
    Dilution: IVariableDilution;
}
