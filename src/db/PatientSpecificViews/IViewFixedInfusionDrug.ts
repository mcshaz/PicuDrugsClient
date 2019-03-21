
import { IFixedDilution, IFixedInfusionDrug } from '../entities/IContextFixedInfusionDrug';

export interface IViewFixedInfuionDrug extends IFixedInfusionDrug {
    Dilution: IFixedDilution;
}
