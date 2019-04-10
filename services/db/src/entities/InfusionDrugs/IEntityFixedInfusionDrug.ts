
import { IEntityInfusion } from './IEntityInfusionDrug';
import { IEntityDilutionBase, IEntityConcentration } from './IEntityInfusionDrug';

export interface IEntityFixedInfusionDrug extends IEntityInfusion {
    drugAmpuleConcentrations: IEntityDrugAmpuleConcentration[];
    fixedTimeDilutions: IEntityFixedDilution[];
}

export interface IEntityDrugAmpuleConcentration {
    concentration: number;
    volume: number;
}

export interface IEntityFixedDilution extends IEntityDilutionBase {
    fixedTimeConcentrations: IEntityFixedConcentration[];
}

export interface IEntityFixedConcentration extends IEntityConcentration {
    volume: number | null;
    stopMinutes: number;
    rate: number;
}

