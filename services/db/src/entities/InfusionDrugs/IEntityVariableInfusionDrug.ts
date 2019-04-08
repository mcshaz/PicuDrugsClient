import { IEntityConcentration, IEntityInfusionBase, IDilutionInfo, IEntityDilutionBase } from './IEntityInfusionDrug';

export interface IEntityVariableInfusionDrug extends IEntityInfusionBase {
    dilutions: IEntityVariableDilution[];
}

export interface IVariableDilutionInfo extends IDilutionInfo {
    volume: number | null;
    rateMin: number;
    rateMax: number;

    concentrations: IEntityVariableConcentration[];
}

export interface IEntityVariableDilution extends IEntityDilutionBase, IVariableDilutionInfo {
}

interface IEntityVariableConcentration extends IEntityConcentration {
    doseCat: string;
}
