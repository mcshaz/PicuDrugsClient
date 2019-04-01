
import { IFixedDilution, IFixedInfusionDrug } from '../entities/InfusionDrugs/IContextFixedInfusionDrug';

export interface IViewFixedInfuionDrug extends IFixedInfusionDrug {
    Dilution: IFixedDilution;
}
