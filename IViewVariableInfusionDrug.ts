import { IEntityInfusionDrug } from './services/db/src/entities/InfusionDrugs/IContextInfusionDrugBase';
import { IVariableDilution } from './services/db/src/entities/InfusionDrugs/IContextVariableInfusionDrug';

export interface IViewVariableInfuionDrug extends IEntityInfusionDrug {
    Dilution: IVariableDilution;
}
