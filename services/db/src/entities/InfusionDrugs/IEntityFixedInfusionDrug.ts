
import { IEntityInfusionBase } from './IEntityInfusionDrug';
import { IEntityDilutionBase, IEntityConcentration } from './IEntityInfusionDrug';

export interface IEntityFixedInfusionDrug extends IEntityInfusionBase {
    drugAmpuleConcentrations: IEntityDrugAmpuleConcentration[];
    dilutions: IEntityFixedDilution[];
}

export interface IEntityDrugAmpuleConcentration {
    concentration: number;
    volume: number;
}

export interface IEntityFixedDilution extends IEntityDilutionBase {
    concentrations: IEntityFixedConcentration[];
}

export interface IEntityFixedConcentration extends IEntityConcentration {
    volume: number | null;
    stopMinutes: number;
    rate: number;
}

