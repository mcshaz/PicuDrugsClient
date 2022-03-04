
import { IEntityInfusion, IEntityDilutionBase, IEntityConcentration } from './IEntityInfusionDrug';

export interface IEntityFixedConcentration extends IEntityConcentration {
    volume: number | null;
    stopMinutes: number;
    rate: number;
}
export interface IEntityFixedDilution extends IEntityDilutionBase {
    fixedTimeConcentrations: IEntityFixedConcentration[];
}
export interface IEntityFixedInfusionDrug extends IEntityInfusion {
    fixedTimeDilutions: IEntityFixedDilution[];
}
